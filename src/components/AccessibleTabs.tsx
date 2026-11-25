import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  badge?: string;
  content: ReactNode;
}

interface AccessibleTabsProps<T extends string> {
  ariaLabel: string;
  items: TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
}

export function AccessibleTabs<T extends string>({
  ariaLabel,
  items,
  activeId,
  onChange,
}: AccessibleTabsProps<T>) {
  const uid = useId().replace(/:/g, '');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tablistRef = useRef<HTMLDivElement | null>(null);

  const activeAnchorName = `--tab-${uid}-${activeId}`;

  // Keep the active tab visible inside the horizontal tab strip without
  // scrolling the page (scrollIntoView would jump to the workbench on load).
  useEffect(() => {
    const tablist = tablistRef.current;
    const activeTab = tabRefs.current[activeId];
    if (!tablist || !activeTab || tablist.scrollWidth <= tablist.clientWidth) return;

    const target =
      activeTab.offsetLeft - (tablist.clientWidth - activeTab.offsetWidth) / 2;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    tablist.scrollTo({
      left: Math.max(0, target),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [activeId]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    for (const item of items) {
      const panel = panelRefs.current[item.id];
      if (!panel) continue;
      const handleBeforeMatch = () => {
        onChange(item.id);
      };
      panel.addEventListener('beforematch', handleBeforeMatch);
      cleanups.push(() => panel.removeEventListener('beforematch', handleBeforeMatch));
    }
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [items, onChange]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextItem = items[nextIndex];
    onChange(nextItem.id);
    tabRefs.current[nextItem.id]?.focus();
  };

  return (
    <div>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label={ariaLabel}
        className="workbench-tablist"
        style={{ '--active-tab-anchor': activeAnchorName } as CSSProperties}
      >
        {items.map((item, idx) => {
          const isSelected = item.id === activeId;
          const anchorStyle = isSelected
            ? ({ anchorName: activeAnchorName } as CSSProperties)
            : undefined;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              id={`${uid}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(item.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              style={anchorStyle}
              className="workbench-tab inline-flex items-center gap-2.5"
            >
              <span>{item.label}</span>
              {item.badge ? (
                <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div>
        {items.map((item) => {
          const isSelected = item.id === activeId;
          return (
            <div
              key={item.id}
              ref={(el) => {
                panelRefs.current[item.id] = el;
              }}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${item.id}`}
              tabIndex={isSelected ? 0 : undefined}
              hidden={isSelected ? undefined : ('until-found' as unknown as boolean)}
            >
              <div className="pt-6">{item.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
