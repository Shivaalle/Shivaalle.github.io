import {
  ArrowRight,
  Code,
  GitBranch,
  LockKey,
  ShieldCheck,
  Sparkle,
  Stack,
  Target,
} from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { IDEA_STATUSES, IDEA_TRANSITIONS, PROJECTS } from '../data/portfolioData';
import type { IdeaRole } from '../data/portfolioData';

interface IdeaInnovatorLabProps {
  onOpenEvidence: () => void;
}

const POC_STAGES = [
  {
    id: 'brd',
    stage: '1 · BRD',
    artifact: 'BRD.md + BRD.html',
    summary:
      'Compiles the structured business case, stakeholder impact, value hypothesis, pilot scope, and success measures into an executive requirements document.',
    sample:
      '# BRD: Vendor Onboarding Copilot (demo)\n- Problem: onboarding takes 11 days across 4 handoffs\n- Value: 50% faster activation; fewer duplicate vendor records\n- Pilot: one region, 6 weeks, measured against a 5-day target',
  },
  {
    id: 'frd',
    stage: '2 · FRD',
    artifact: 'FRD.md + FRD.html',
    summary:
      'Translates the business goals into functional requirements, API contracts, permissions, telemetry, and failure-recovery behavior.',
    sample:
      '# FRD: Functional specification (demo)\n- FR-01: Ingest vendor intake through a typed API\n- FR-02: Validate tax and banking fields before approval\n- FR-03: Role-gated approver queue with audit history',
  },
  {
    id: 'uird',
    stage: '3 · UIRD',
    artifact: 'UIRD.md + UIRD.html',
    summary:
      'Specifies the multi-persona views, interaction states, responsive breakpoints, accessibility behavior, and content hierarchy.',
    sample:
      '# UIRD: Interface & interaction spec (demo)\n- Requester: guided intake with progress and save/resume\n- Approver: side-by-side evidence and exception flags\n- A11y: keyboard-first review queue; status live region',
  },
  {
    id: 'prototype',
    stage: '4 · Prototype',
    artifact: 'PROTOTYPE.html',
    summary:
      'Generates a standalone interactive HTML prototype in a per-run directory, preserving earlier artifacts if a later stage needs a retry.',
    sample:
      '<!doctype html><!-- Self-contained demo prototype -->\n<main data-demo="vendor-onboarding">\n  <section>Vendor intake · evidence review · approval queue</section>\n</main>',
  },
];

const THEME_PRIORITIES: Array<{ label: string; weight: number }> = [
  { label: 'Revenue growth', weight: 1.0 },
  { label: 'Operational excellence', weight: 0.85 },
  { label: 'Cost efficiency', weight: 0.75 },
  { label: 'Customer experience', weight: 0.7 },
  { label: 'Sustainability', weight: 0.55 },
];

export function IdeaInnovatorLab({ onOpenEvidence }: IdeaInnovatorLabProps) {
  const project = PROJECTS.ideainnovator;
  const [role, setRole] = useState<IdeaRole>('user');
  const [currentStatus, setCurrentStatus] = useState<string>('DRAFT');
  const [auditLog, setAuditLog] = useState<string[]>([
    'Initialized idea draft in DRAFT state (coverage checks active).',
  ]);
  const [blockedHint, setBlockedHint] = useState<string | null>(null);

  // Leadership Radar math state (illustrative weights)
  const [juryScore, setJuryScore] = useState(8.6);
  const [daysElapsed, setDaysElapsed] = useState(12);
  const [themeIndex, setThemeIndex] = useState(0);

  // Four-stage POC chain selector
  const [pocStageId, setPocStageId] = useState('brd');

  const radarCalc = useMemo(() => {
    const normalizedScore = juryScore / 10;
    const recency = Math.pow(0.5, daysElapsed / 30);
    const themePriority = THEME_PRIORITIES[themeIndex].weight;
    const composite = 0.7 * normalizedScore + 0.2 * recency + 0.1 * themePriority;
    const pocRecommended = juryScore >= 7.5;
    const quadrant =
      juryScore >= 7.5 && themePriority >= 0.8
        ? 'Strategic bets'
        : juryScore >= 7.5
          ? 'Quick wins'
          : themePriority >= 0.8
            ? 'Exploration plays'
            : 'Sequence later';
    return {
      normalizedScore,
      recency,
      themePriority,
      composite,
      pocRecommended,
      quadrant,
    };
  }, [juryScore, daysElapsed, themeIndex]);

  const outgoingTransitions = IDEA_TRANSITIONS.filter((t) => t.from === currentStatus);

  const attemptTransition = (toStatus: string, allowedRoles: IdeaRole[], rule: string) => {
    if (!allowedRoles.includes(role)) {
      setBlockedHint(
        `RoleNotPermitted: "${role}" cannot trigger ${currentStatus} → ${toStatus}. Switch persona to [${allowedRoles.join(' / ')}].`,
      );
      return;
    }
    setBlockedHint(null);
    setAuditLog((prev) => [`[${role}] ${currentStatus} → ${toStatus} · ${rule}`, ...prev.slice(0, 4)]);
    setCurrentStatus(toStatus);
  };

  const resetStateMachine = () => {
    setCurrentStatus('DRAFT');
    setRole('user');
    setBlockedHint(null);
    setAuditLog(['Reset lifecycle to DRAFT (user role).']);
  };

  const activePoc = POC_STAGES.find((s) => s.id === pocStageId) ?? POC_STAGES[0];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan-soft)] px-4 py-3">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-secondary)]">
          <ShieldCheck size={15} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--accent-cyan)]" />
          <span>
            <strong className="text-[var(--text-primary)]">Sanitized interactive demo.</strong> The workflow is
            representative. Production prompts, configuration, customer content, and generated artifacts are not shown.
          </span>
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-[var(--accent-signal)]">{project.role}</span>
              <h3 className="mt-1 font-[var(--font-display)] text-2xl font-semibold text-[var(--text-primary)]">
                {project.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{project.tagline}</p>
            </div>
            <button
              type="button"
              onClick={onOpenEvidence}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-signal)]"
            >
              <Code size={15} weight="bold" aria-hidden="true" />
              Architecture notes
            </button>
          </div>

          <dl className="mt-5 grid gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-xs text-[var(--text-secondary)]">Intake &amp; POC</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--text-primary)]">{project.orchestration}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-[var(--text-secondary)]">State &amp; similarity guards</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--text-primary)]">{project.securityAndGates}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 lg:col-span-4">
          <div>
            <p className="font-mono text-xs text-[var(--accent-signal)]">SYSTEM SCALE</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                <p className="font-[var(--font-display)] text-2xl font-bold text-[var(--accent-signal)]">8 + 4</p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Intake agents + POC stages</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                <p className="font-[var(--font-display)] text-2xl font-bold text-[var(--accent-cyan)]">4</p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Role-scoped personas</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              Duplicate guard: sentence embeddings + vector search, with a configurable similarity threshold before
              persistence.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.primaryStack.map((tech) => (
              <span
                key={tech}
                className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Lifecycle + radar */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
            <div>
              <p className="font-mono text-xs text-[var(--accent-cyan)]">LIFECYCLE TRANSITION GATE</p>
              <h4 className="font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
                12-state role-gated lifecycle explorer
              </h4>
            </div>
            <button
              type="button"
              onClick={resetStateMachine}
              className="rounded border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 py-1 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Reset to DRAFT
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Active persona role">
              <span className="mr-1 font-mono text-xs text-[var(--text-secondary)]">Actor role:</span>
              {(['user', 'evaluator', 'leadership', 'system'] as IdeaRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={role === r}
                  onClick={() => {
                    setRole(r);
                    setBlockedHint(null);
                  }}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs font-medium capitalize transition-colors ${
                    role === r
                      ? 'border-[var(--accent-signal)] bg-[var(--accent-signal-soft)] text-[var(--text-primary)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan-soft)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--accent-cyan)]">
              <GitBranch size={14} weight="bold" aria-hidden="true" />
              {currentStatus}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5" aria-label="12 lifecycle statuses">
            {IDEA_STATUSES.map((status) => {
              const isActive = status === currentStatus;
              return (
                <span
                  key={status}
                  className={`rounded border px-2 py-0.5 font-mono text-[10px] ${
                    isActive
                      ? 'border-[var(--accent-signal)] bg-[var(--accent-signal-soft)] font-semibold text-[var(--accent-signal)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                  }`}
                >
                  {status}
                </span>
              );
            })}
          </div>

          <div className="mt-4 space-y-2">
            <p className="font-mono text-xs text-[var(--text-secondary)]">
              Outgoing transitions from {currentStatus}:
            </p>
            {outgoingTransitions.length === 0 ? (
              <p className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-xs text-[var(--text-secondary)]">
                Terminal state reached ({currentStatus}). Reset to DRAFT to test another path.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {outgoingTransitions.map((edge) => {
                  const permitted = edge.roles.includes(role);
                  return (
                    <button
                      key={`${edge.from}-${edge.to}`}
                      type="button"
                      onClick={() => attemptTransition(edge.to, edge.roles, edge.rule)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        permitted
                          ? 'border-[var(--accent-signal)]/50 bg-[var(--bg-canvas)] hover:border-[var(--accent-signal)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] opacity-75 hover:border-[var(--accent-amber)]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-mono text-xs font-semibold text-[var(--text-primary)]">
                        <span className="inline-flex items-center gap-1">
                          <ArrowRight size={12} aria-hidden="true" className="text-[var(--accent-signal)]" />
                          {edge.to}
                        </span>
                        {!permitted ? (
                          <LockKey size={13} aria-hidden="true" className="text-[var(--accent-amber)]" />
                        ) : null}
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-[var(--text-secondary)]">
                        Allowed: {edge.roles.join(', ')}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {blockedHint ? (
              <div
                role="status"
                className="rounded-lg border border-[var(--accent-amber)]/50 bg-[var(--accent-amber-soft)] px-3 py-2 font-mono text-xs text-[var(--accent-amber)]"
              >
                {blockedHint}
              </div>
            ) : null}

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3">
              <p className="font-mono text-[11px] font-medium text-[var(--text-secondary)]">
                Immutable status-history audit trail
              </p>
              <ul className="mt-1.5 space-y-1 font-mono text-[11px] text-[var(--text-primary)]">
                {auditLog.map((entry, i) => (
                  <li key={`${entry}-${i}`} className="truncate">
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-5 lg:col-span-5">
          <div className="border-b border-[var(--border-subtle)] pb-4">
            <p className="font-mono text-xs text-[var(--accent-signal)]">DETERMINISTIC RANKING</p>
            <h4 className="font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
              Leadership radar calculator
            </h4>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between gap-2 text-xs">
                <label htmlFor="radar-score" className="font-medium text-[var(--text-primary)]">
                  Jury score (AI pre-score + evaluator decision)
                </label>
                <span className="font-mono font-semibold text-[var(--accent-signal)]">{juryScore.toFixed(1)} / 10</span>
              </div>
              <input
                id="radar-score"
                type="range"
                min={3}
                max={10}
                step={0.1}
                value={juryScore}
                onChange={(e) => setJuryScore(Number(e.target.value))}
                className="mt-1.5 w-full"
              />
            </div>

            <div>
              <div className="flex justify-between gap-2 text-xs">
                <label htmlFor="radar-days" className="font-medium text-[var(--text-primary)]">
                  Days since last update (30-day half-life)
                </label>
                <span className="font-mono font-semibold text-[var(--accent-cyan)]">
                  {daysElapsed}d · freshness {radarCalc.recency.toFixed(2)}
                </span>
              </div>
              <input
                id="radar-days"
                type="range"
                min={0}
                max={90}
                step={1}
                value={daysElapsed}
                onChange={(e) => setDaysElapsed(Number(e.target.value))}
                className="mt-1.5 w-full"
              />
            </div>

            <div>
              <label htmlFor="radar-theme" className="block text-xs font-medium text-[var(--text-primary)]">
                Strategic theme weight (10%)
              </label>
              <select
                id="radar-theme"
                value={themeIndex}
                onChange={(e) => setThemeIndex(Number(e.target.value))}
                className="mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-2 text-xs text-[var(--text-primary)]"
              >
                {THEME_PRIORITIES.map((t, idx) => (
                  <option key={t.label} value={idx}>
                    {t.label} (weight {t.weight.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-[var(--text-secondary)]">Composite rank score</span>
                <span className="font-[var(--font-display)] text-2xl font-bold text-[var(--accent-signal)]">
                  {radarCalc.composite.toFixed(4)}
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-[var(--text-secondary)]">
                0.7×{radarCalc.normalizedScore.toFixed(2)} + 0.2×{radarCalc.recency.toFixed(2)} + 0.1×
                {radarCalc.themePriority.toFixed(2)}
              </p>
              <p className="mt-1 font-mono text-[10px] text-[var(--text-secondary)]">
                Illustrative weights for the demo; production configuration is not shown.
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-primary)]">
                  <Target size={14} weight="bold" aria-hidden="true" className="text-[var(--accent-cyan)]" />
                  Quadrant: {radarCalc.quadrant}
                </span>
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[11px] font-semibold ${
                    radarCalc.pocRecommended
                      ? 'bg-[var(--accent-signal-soft)] text-[var(--accent-signal)]'
                      : 'bg-[var(--accent-amber-soft)] text-[var(--accent-amber)]'
                  }`}
                >
                  {radarCalc.pocRecommended ? 'POC RECOMMENDED' : 'HOLD FOR REFINEMENT'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POC compiler preview */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Stack size={18} weight="bold" aria-hidden="true" className="text-[var(--accent-signal)]" />
            <h4 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
              Four-stage POC compiler
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select POC compilation stage">
            {POC_STAGES.map((stage) => (
              <button
                key={stage.id}
                type="button"
                aria-pressed={stage.id === pocStageId}
                onClick={() => setPocStageId(stage.id)}
                className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                  stage.id === pocStageId
                    ? 'border-[var(--accent-signal)] bg-[var(--accent-signal-soft)] text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                }`}
              >
                {stage.stage}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--accent-cyan)]">
              <Sparkle size={13} aria-hidden="true" />
              Output: {activePoc.artifact}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{activePoc.summary}</p>
          </div>
          <pre className="code-surface overflow-x-auto rounded-lg p-3.5 font-mono text-xs leading-relaxed md:col-span-7">
            <code>{activePoc.sample}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
