import { Moon, Sun } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

type StoredScheme = 'light' | 'dark' | null;

function readStoredScheme(): StoredScheme {
  try {
    const val = localStorage.getItem('color-scheme');
    return val === 'light' || val === 'dark' ? val : null;
  } catch {
    return null;
  }
}

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function syncMetaScheme(scheme: StoredScheme) {
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.setAttribute('content', scheme ?? 'light dark');
  }
}

export function ThemeToggle() {
  const [stored, setStored] = useState<StoredScheme>(() =>
    typeof window !== 'undefined' ? readStoredScheme() : null,
  );
  const [systemDark, setSystemDark] = useState<boolean>(() =>
    typeof window !== 'undefined' ? getSystemDark() : true,
  );

  useEffect(() => {
    syncMetaScheme(stored);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onMediaChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'color-scheme') {
        const next = e.newValue === 'light' || e.newValue === 'dark' ? e.newValue : null;
        setStored(next);
        syncMetaScheme(next);
      }
    };

    media.addEventListener('change', onMediaChange);
    window.addEventListener('storage', onStorage);
    return () => {
      media.removeEventListener('change', onMediaChange);
      window.removeEventListener('storage', onStorage);
    };
  }, [stored]);

  const renderedDark = stored ? stored === 'dark' : systemDark;

  const handleToggle = () => {
    const target: 'light' | 'dark' = renderedDark ? 'light' : 'dark';
    const matchesSystem = (target === 'dark') === systemDark;
    const nextStored: StoredScheme = matchesSystem ? null : target;

    try {
      if (nextStored === null) {
        localStorage.removeItem('color-scheme');
      } else {
        localStorage.setItem('color-scheme', nextStored);
      }
    } catch {
      // Ignore storage failures and still apply in-memory override
    }

    setStored(nextStored);
    syncMetaScheme(nextStored);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
      aria-label={renderedDark ? 'Switch to light color scheme' : 'Switch to dark color scheme'}
    >
      <span className="theme-option-light">
        <Sun size={16} weight="bold" aria-hidden="true" className="text-[var(--accent-amber)]" />
        <span className="hidden sm:inline">Light</span>
      </span>
      <span className="theme-option-dark">
        <Moon size={16} weight="bold" aria-hidden="true" className="text-[var(--accent-cyan)]" />
        <span className="hidden sm:inline">Dark</span>
      </span>
    </button>
  );
}
