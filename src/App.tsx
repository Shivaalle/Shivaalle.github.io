import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Certificate,
  Check,
  Copy,
  Cpu,
  Database,
  DownloadSimple,
  Envelope,
  FileText,
  GitBranch,
  GithubLogo,
  GraduationCap,
  LinkedinLogo,
  Phone,
  ShieldCheck,
  TerminalWindow,
} from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AccessibleTabs } from './components/AccessibleTabs';
import { EvidenceDialog } from './components/EvidenceDialog';
import type { DialogMode } from './components/EvidenceDialog';
import { IdeaInnovatorLab } from './components/IdeaInnovatorLab';
import { OpsBuddyLab } from './components/OpsBuddyLab';
import { PmAgentLab } from './components/PmAgentLab';
import { ThemeToggle } from './components/ThemeToggle';
import {
  ENGINEERING_TRADEOFFS,
  PROFILE,
  PROJECTS,
  SKILL_CATEGORIES,
} from './data/portfolioData';
import type { ProjectId } from './data/portfolioData';

const PROJECT_IDS: ProjectId[] = ['opsbuddy', 'ideainnovator', 'pmagent'];
const RESUME_PATH = '/Shiva-Teja-Alle-Resume.pdf';

const NAV_ITEMS = [
  { id: 'work', label: 'Selected work', mobileLabel: 'Work' },
  { id: 'workbench', label: 'Systems', mobileLabel: 'Systems' },
  { id: 'approach', label: 'Approach', mobileLabel: 'Approach' },
  { id: 'experience', label: 'Experience', mobileLabel: 'Experience' },
  { id: 'contact', label: 'Contact', mobileLabel: 'Contact' },
] as const;

const PRINCIPLES = [
  'Deterministic where it matters',
  'Generative where it helps',
  'Human approval before side effects',
  'Measure with golden data',
];

function getProjectFromHash(): ProjectId {
  if (typeof window === 'undefined') return 'opsbuddy';
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash === 'ideainnovator') return 'ideainnovator';
  if (hash === 'pmagent') return 'pmagent';
  return 'opsbuddy';
}

export function App() {
  const [activeProject, setActiveProject] = useState<ProjectId>(() => getProjectFromHash());
  const [dialogMode, setDialogMode] = useState<DialogMode>({ kind: 'closed' });
  const [stackFilter, setStackFilter] = useState<'all' | ProjectId>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Sync scroll progress fallback only when scroll-driven CSS animations are unsupported
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || CSS.supports('animation-timeline', 'scroll()')) {
      return;
    }
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      bar.style.setProperty('--scroll-fallback', ratio.toFixed(4));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  // Sync URL hash changes
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'opsbuddy' || hash === 'ideainnovator' || hash === 'pmagent') {
        setActiveProject(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSelectProject = useCallback((pid: ProjectId) => {
    setActiveProject(pid);
    window.history.replaceState(null, '', `#${pid}`);
  }, []);

  const jumpToWorkbench = (pid: ProjectId) => {
    handleSelectProject(pid);
    document.getElementById('workbench')?.scrollIntoView();
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2600);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const heroTopologyProject = PROJECTS[activeProject];

  const tabItems = useMemo(
    () => [
      {
        id: 'opsbuddy' as ProjectId,
        label: 'OpsBuddy AI',
        badge: 'Hybrid RAG + MCP',
        content: (
          <OpsBuddyLab onOpenEvidence={() => setDialogMode({ kind: 'project', projectId: 'opsbuddy' })} />
        ),
      },
      {
        id: 'ideainnovator' as ProjectId,
        label: 'Idea Innovator AI',
        badge: 'LangGraph + lifecycle',
        content: (
          <IdeaInnovatorLab
            onOpenEvidence={() => setDialogMode({ kind: 'project', projectId: 'ideainnovator' })}
          />
        ),
      },
      {
        id: 'pmagent' as ProjectId,
        label: 'PM Agent',
        badge: 'Grounded + human-gated',
        content: (
          <PmAgentLab onOpenEvidence={() => setDialogMode({ kind: 'project', projectId: 'pmagent' })} />
        ),
      },
    ],
    [],
  );

  const filteredSkills = useMemo(() => {
    if (stackFilter === 'all') return SKILL_CATEGORIES;
    return SKILL_CATEGORIES.filter((cat) => cat.usedIn.includes(stackFilter));
  }, [stackFilter]);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <div id="scroll-progress" aria-hidden="true" />
      <a href="#main-content" className="visually-hidden skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-[var(--text-primary)] no-underline"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--accent-signal)]/60 bg-[var(--accent-signal-soft)] font-mono text-xs font-bold text-[var(--accent-signal)]">
              SA
            </span>
            <span className="font-[var(--font-display)]">{PROFILE.name}</span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 text-sm text-[var(--text-secondary)] lg:flex"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="transition-colors hover:text-[var(--text-primary)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setDialogMode({ kind: 'resume' })}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[var(--accent-signal)] bg-[var(--accent-signal-soft)] px-3.5 py-1.5 text-sm font-semibold text-[var(--accent-signal)] transition-colors hover:bg-[var(--accent-signal)] hover:text-[var(--on-accent-signal)]"
            >
              <FileText size={16} weight="bold" aria-hidden="true" />
              <span>Resume</span>
            </button>
          </div>
        </div>

        <nav
          aria-label="Sections"
          className="border-t border-[var(--border-subtle)] lg:hidden"
        >
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-1.5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="whitespace-nowrap rounded px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                {item.mobileLabel}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section id="top" className="blueprint-grid border-b border-[var(--border-subtle)]">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:items-start lg:py-14">
            <div className="lg:col-span-7">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 font-mono text-xs text-[var(--accent-signal)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-signal)]" aria-hidden="true" />
                <span>
                  {PROFILE.title} · TCS · {PROFILE.location.split(',')[0]}
                </span>
              </div>

              <h1 className="mt-5 max-w-[15ch] font-[var(--font-display)] text-4xl font-bold leading-[1.06] tracking-tight text-[var(--text-primary)] sm:text-5xl xl:text-6xl">
                AI systems that can{' '}
                <span className="text-[var(--accent-signal)]">prove their work.</span>
              </h1>

              <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                I&apos;m a generative AI engineer at TCS. I build multi-agent platforms with hybrid retrieval,
                deterministic state, and human approval before side effects — then measure whether they actually work.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--accent-signal)] px-5 py-2.5 text-sm font-semibold text-[var(--on-accent-signal)] no-underline transition-opacity hover:opacity-90"
                >
                  <span>See selected work</span>
                  <ArrowRight size={17} weight="bold" aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={() => setDialogMode({ kind: 'resume' })}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-signal)]"
                >
                  <span>Resume dossier</span>
                </button>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] no-underline transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                >
                  <GithubLogo size={17} weight="bold" aria-hidden="true" />
                  <span>{PROFILE.githubHandle}</span>
                </a>
              </div>

              <div className="mt-9">
                <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
                  Selected outcomes
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {PROFILE.highlights.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5"
                    >
                      <p className="font-[var(--font-display)] text-2xl font-bold leading-none text-[var(--text-primary)]">
                        {metric.value}
                      </p>
                      <p className="mt-1.5 text-xs font-medium text-[var(--text-secondary)]">{metric.label}</p>
                      <p className="mt-1 font-mono text-[10px] leading-snug text-[var(--accent-signal)]">
                        {metric.source}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Representative system map */}
            <aside className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-5 shadow-lg lg:col-span-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3.5">
                <div>
                  <p className="font-mono text-[11px] text-[var(--accent-cyan)]">REPRESENTATIVE SYSTEM MAP</p>
                  <h2 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
                    {heroTopologyProject.name}
                  </h2>
                </div>
                <div className="flex gap-1" role="group" aria-label="Preview system architecture">
                  {PROJECT_IDS.map((pid) => (
                    <button
                      key={pid}
                      type="button"
                      aria-pressed={activeProject === pid}
                      onClick={() => handleSelectProject(pid)}
                      className={`rounded-md border px-2 py-1 font-mono text-[11px] transition-colors ${
                        activeProject === pid
                          ? 'border-[var(--accent-signal)] bg-[var(--accent-signal-soft)] font-semibold text-[var(--accent-signal)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {pid === 'opsbuddy' ? 'OpsBuddy' : pid === 'ideainnovator' ? 'IdeaAI' : 'PMAgent'}
                    </button>
                  ))}
                </div>
              </div>

              <ol className="mt-4 space-y-2">
                {heroTopologyProject.topologyNodes.map((node, index) => (
                  <li
                    key={node.id}
                    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[var(--bg-elevated)] text-[10px] text-[var(--accent-signal)]">
                          {index + 1}
                        </span>
                        {node.label}
                      </span>
                      <span className="rounded bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[var(--accent-cyan)]">
                        {node.kind}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{node.detail}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3.5">
                <button
                  type="button"
                  onClick={() => jumpToWorkbench(activeProject)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-signal)] hover:underline"
                >
                  Open interactive demo
                  <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setDialogMode({ kind: 'project', projectId: activeProject })}
                  className="font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {heroTopologyProject.evidence.kind === 'source' ? 'Source modules' : 'Architecture notes'}
                </button>
              </div>
              <p className="mt-3 rounded-lg bg-[var(--bg-elevated)] px-3 py-2 font-mono text-[10px] leading-relaxed text-[var(--text-secondary)]">
                {heroTopologyProject.confidentiality} · architecture shown at a public-safe level.
              </p>
            </aside>
          </div>
        </section>

        {/* Selected work */}
        <section id="work" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-[68ch]">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-signal)]">
              Selected work
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Three systems, three reliability problems.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              A production operations platform, an enterprise innovation workflow, and an independent agent build.
              Each case study goes from the problem to the architecture to a working interactive demo.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROJECT_IDS.map((pid) => {
              const project = PROJECTS[pid];
              return (
                <article
                  key={pid}
                  className="group flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-colors hover:border-[var(--accent-signal)]/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-medium text-[var(--accent-cyan)]">
                      {project.caseLabel}
                    </span>
                    <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">
                      {project.confidentiality}
                    </span>
                  </div>

                  <h3 className="mt-3 font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
                    {project.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-[var(--accent-signal)]">{project.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{project.tagline}</p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {project.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3"
                      >
                        <p className="font-[var(--font-display)] text-xl font-bold leading-none text-[var(--text-primary)]">
                          {metric.value}
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-[var(--text-secondary)]">{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.primaryStack.slice(0, 4).map((tech) => (
                      <li
                        key={tech}
                        className="rounded border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto border-t border-[var(--border-subtle)] pt-4">
                    <button
                      type="button"
                      onClick={() => jumpToWorkbench(pid)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-signal)] hover:underline"
                    >
                      Explore the system
                      <ArrowRight
                        size={15}
                        weight="bold"
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Interactive workbench */}
        <section
          id="workbench"
          className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="max-w-[68ch]">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-signal)]">
                Interactive systems workbench
              </p>
              <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Look inside the architecture.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Switch tabs to test the retrieval math, walk the lifecycle rules, or audit a transcript against Git.
                OpsBuddy and Idea Innovator use synthetic, sanitized demo data; PM Agent uses its checked-in eval
                fixtures.
              </p>
            </div>

            <div className="mt-8">
              <AccessibleTabs
                ariaLabel="Flagship AI systems workbench"
                items={tabItems}
                activeId={activeProject}
                onChange={handleSelectProject}
              />
            </div>
          </div>
        </section>

        {/* Engineering approach */}
        <section id="approach" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-[68ch]">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-cyan)]">
              Engineering approach
            </p>
            <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              The model is the easy part.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              The systems I care about are bounded, auditable, and measurable. These three decisions show how I keep
              generative behavior from becoming unpredictable behavior.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {PRINCIPLES.map((principle) => (
                <li
                  key={principle}
                  className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 font-mono text-[11px] text-[var(--text-secondary)]"
                >
                  {principle}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {ENGINEERING_TRADEOFFS.map((item) => (
              <article
                key={item.title}
                className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded bg-[var(--bg-elevated)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--accent-signal)]">
                    <ShieldCheck size={13} weight="bold" aria-hidden="true" />
                    {item.project}
                  </span>
                </div>
                <h3 className="mt-3 font-[var(--font-display)] text-lg font-semibold leading-snug text-[var(--text-primary)]">
                  {item.title}
                </h3>

                <div className="mt-4 space-y-3 text-sm leading-relaxed">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                      Problem
                    </p>
                    <p className="mt-1 text-[var(--text-secondary)]">{item.challenge}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-cyan)]">
                      Decision
                    </p>
                    <p className="mt-1 text-[var(--text-primary)]">{item.decision}</p>
                  </div>
                </div>

                <div className="mt-auto rounded-lg border border-[var(--accent-signal)]/30 bg-[var(--accent-signal-soft)] p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-signal)]">
                    Guardrail &amp; outcome
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-primary)]">{item.whyAndGuardrail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Experience & capabilities */}
        <section id="experience" className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-[60ch]">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-signal)]">
                  Toolkit &amp; track record
                </p>
                <h2 className="mt-2 font-[var(--font-display)] text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  Production stack mapped to shipped systems.
                </h2>
              </div>

              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter skills by system">
                {(['all', 'opsbuddy', 'ideainnovator', 'pmagent'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={stackFilter === filter}
                    onClick={() => setStackFilter(filter)}
                    className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                      stackFilter === filter
                        ? 'border-[var(--accent-signal)] bg-[var(--accent-signal-soft)] text-[var(--accent-signal)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {filter === 'all'
                      ? 'All systems'
                      : filter === 'opsbuddy'
                        ? 'OpsBuddy AI'
                        : filter === 'ideainnovator'
                          ? 'Idea Innovator AI'
                          : 'PM Agent'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSkills.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
                      {cat.label}
                    </h3>
                    <Cpu size={18} aria-hidden="true" className="shrink-0 text-[var(--accent-cyan)]" />
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {cat.items.map((skill) => (
                      <li
                        key={skill}
                        className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-primary)]"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t border-[var(--border-subtle)] pt-3 font-mono text-[11px] text-[var(--text-secondary)]">
                    Applied in: {cat.usedIn.map((id) => PROJECTS[id].name).join(', ')}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-12">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-6 lg:col-span-6">
                <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-signal)]">
                  <Briefcase size={16} weight="bold" aria-hidden="true" />
                  <span>PROFESSIONAL EXPERIENCE</span>
                </div>
                <h3 className="mt-2 font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
                  {PROFILE.company}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-[var(--accent-cyan)]">
                  {PROFILE.title} · {PROFILE.tenure}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <GitBranch
                      size={15}
                      weight="bold"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-[var(--accent-signal)]"
                    />
                    <span>
                      Lead AI engineer on <strong className="text-[var(--text-primary)]">OpsBuddy AI</strong>: a
                      multi-agent operations platform that reduced MTTR by 60% and automated 75% of L1/L2 workflows.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Database
                      size={15}
                      weight="bold"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-[var(--accent-signal)]"
                    />
                    <span>
                      Built <strong className="text-[var(--text-primary)]">Idea Innovator AI</strong>: 8-agent
                      LangGraph intake, semantic duplicate guard, 12-state lifecycle engine, and a 4-stage POC
                      compiler.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck
                      size={15}
                      weight="bold"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-[var(--accent-signal)]"
                    />
                    <span>
                      Engineered <strong className="text-[var(--text-primary)]">InsightStream AI</strong>: NLP
                      sentence-type classification across 100K+ records at 92% accuracy, improving content engagement
                      efficiency by 40%.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TerminalWindow
                      size={15}
                      weight="bold"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-[var(--accent-signal)]"
                    />
                    <span>
                      Built <strong className="text-[var(--text-primary)]">PM Agent</strong> independently: a
                      transcript-to-Jira auditor with verbatim citations, Git discrepancy detection, and a measured
                      golden eval harness.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="grid gap-4 lg:col-span-6">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-6">
                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-cyan)]">
                    <GraduationCap size={16} weight="bold" aria-hidden="true" />
                    <span>EDUCATION</span>
                  </div>
                  <h3 className="mt-2 font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
                    {PROFILE.education.degree}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{PROFILE.education.institution}</p>
                  <p className="mt-2 font-mono text-xs font-semibold text-[var(--accent-signal)]">
                    {PROFILE.education.years} · CGPA {PROFILE.education.cgpa}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-6">
                  <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-signal)]">
                    <Certificate size={16} weight="bold" aria-hidden="true" />
                    <span>CERTIFICATIONS &amp; TRAINING</span>
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {PROFILE.certifications.map((cert) => (
                      <li key={cert.name} className="text-sm">
                        <span className="font-semibold text-[var(--text-primary)]">{cert.name}</span>
                        <p className="text-xs text-[var(--text-secondary)]">{cert.issuer}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-[var(--accent-signal)]/40 bg-[var(--bg-surface)] p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent-signal)]">
                  Contact
                </p>
                <h2 className="mt-2 max-w-[22ch] font-[var(--font-display)] text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  Let&apos;s talk about production AI.
                </h2>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-[var(--text-secondary)]">
                  Happy to walk through the architecture, trade-offs, and eval results behind any of these systems.
                  Reach me by email or phone.
                </p>
                <p className="mt-4 font-mono text-xs text-[var(--text-secondary)]">
                  {PROFILE.location} · {PROFILE.email} · {PROFILE.phone}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 lg:col-span-5 lg:justify-end">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--accent-signal)] px-4 py-2.5 text-sm font-semibold text-[var(--on-accent-signal)] no-underline transition-opacity hover:opacity-90"
                >
                  <Envelope size={17} weight="bold" aria-hidden="true" />
                  Email me
                </a>
                <a
                  href={`tel:${PROFILE.phone.replace(/[^\d+]/g, '')}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--accent-signal)]"
                >
                  <Phone size={17} weight="bold" aria-hidden="true" />
                  Call
                </a>
                <a
                  href={RESUME_PATH}
                  download
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-4 py-2.5 text-sm font-semibold text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--accent-signal)]"
                >
                  <DownloadSimple size={17} weight="bold" aria-hidden="true" />
                  Download resume
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] no-underline transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                >
                  <LinkedinLogo size={17} weight="bold" aria-hidden="true" />
                  LinkedIn
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] no-underline transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                >
                  <GithubLogo size={17} weight="bold" aria-hidden="true" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 py-8 sm:px-6">
          <div>
            <p className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
              {PROFILE.name}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
              {PROFILE.location} · Built with React, TypeScript &amp; Vite
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-canvas)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-signal)]"
            >
              {copiedEmail ? (
                <Check size={15} weight="bold" aria-hidden="true" className="text-[var(--accent-signal)]" />
              ) : (
                <Copy size={15} weight="bold" aria-hidden="true" />
              )}
              <span>{copiedEmail ? 'Email copied' : PROFILE.email}</span>
            </button>
            <a
              href={`mailto:${PROFILE.email}`}
              aria-label="Send email to Shiva Teja Alle"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--accent-signal)]"
            >
              <Envelope size={16} weight="bold" aria-hidden="true" />
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Shiva Teja Alle on GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--accent-signal)]"
            >
              <GithubLogo size={16} weight="bold" aria-hidden="true" />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="Shiva Teja Alle on LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:border-[var(--accent-signal)]"
            >
              <LinkedinLogo size={16} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div aria-live="polite" className="visually-hidden">
          {copiedEmail ? `Copied ${PROFILE.email} to clipboard.` : ''}
        </div>
      </footer>

      <EvidenceDialog mode={dialogMode} onClose={() => setDialogMode({ kind: 'closed' })} />
    </div>
  );
}
export default App;
