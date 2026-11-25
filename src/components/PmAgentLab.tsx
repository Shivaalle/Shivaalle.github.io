import {
  CheckCircle,
  Code,
  GitPullRequest,
  Lock,
  Quotes,
  ShieldCheck,
  ShieldWarning,
} from '@phosphor-icons/react';
import { useState } from 'react';
import {
  PM_LIVE_EVAL,
  PM_TRANSCRIPT_LINES,
  PROJECTS,
} from '../data/portfolioData';

interface PmAgentLabProps {
  onOpenEvidence: () => void;
}

export function PmAgentLab({ onOpenEvidence }: PmAgentLabProps) {
  const project = PROJECTS.pmagent;
  const [selectedLine, setSelectedLine] = useState(5);
  const [isPrivateMeeting, setIsPrivateMeeting] = useState(false);
  const [approvedLines, setApprovedLines] = useState<Record<number, boolean>>({ 2: true });

  const activeItem =
    PM_TRANSCRIPT_LINES.find((item) => item.line === selectedLine) ?? PM_TRANSCRIPT_LINES[1];

  const isApproved = Boolean(approvedLines[activeItem.line]);

  const toggleApproval = () => {
    setApprovedLines((prev) => ({
      ...prev,
      [activeItem.line]: !prev[activeItem.line],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--accent-signal)]/30 bg-[var(--accent-signal-soft)] px-4 py-3">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-secondary)]">
          <ShieldCheck size={15} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--accent-signal)]" />
          <span>
            <strong className="text-[var(--text-primary)]">Source-verified build.</strong> The transcript is a
            checked-in synthetic fixture, the Git/Jira evidence is demo data, and the metrics below come from the
            repository&apos;s golden eval results.
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
              Source modules
            </button>
          </div>

          <dl className="mt-5 grid gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-xs text-[var(--text-secondary)]">LangGraph + MCP Connectors</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--text-primary)]">{project.orchestration}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-[var(--text-secondary)]">5 Hard Decision Gates</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--text-primary)]">{project.securityAndGates}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 lg:col-span-4">
          <div>
            <p className="font-mono text-xs text-[var(--accent-signal)]">GOLDEN EVAL BENCHMARK (LIVE GEMINI)</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                <p className="font-[var(--font-display)] text-2xl font-bold text-[var(--accent-signal)]">100%</p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Citation coverage (20/20)</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                <p className="font-[var(--font-display)] text-2xl font-bold text-[var(--accent-cyan)]">10.5s</p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">4 golden meetings total</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              Connectors: <code className="font-mono text-[var(--text-primary)]">jira_mcp</code>,{' '}
              <code className="font-mono text-[var(--text-primary)]">github_mcp</code>,{' '}
              <code className="font-mono text-[var(--text-primary)]">teams_mcp</code> (stdio / SSE / streamable-http).
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

      {/* Interactive Sprint 14 Reality Auditor */}
      <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <p className="font-mono text-xs text-[var(--accent-cyan)]">
              data/mock_transcript.json · Sprint 14 Sync
            </p>
            <h4 className="font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
              Transcript-to-Git Reality Check &amp; PM Approval Gate
            </h4>
          </div>

          <button
            type="button"
            aria-pressed={isPrivateMeeting}
            onClick={() => setIsPrivateMeeting((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-medium ${
              isPrivateMeeting
                ? 'border-[var(--accent-danger)] bg-[var(--accent-danger)]/10 text-[var(--accent-danger)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
            }`}
          >
            <Lock size={14} weight="bold" aria-hidden="true" />
            {isPrivateMeeting ? 'Private Series Gate: ACTIVE (Discarded)' : 'Simulate Private Meeting Gate'}
          </button>
        </div>

        {isPrivateMeeting ? (
          <div className="mt-5 rounded-xl border border-[var(--accent-danger)]/40 bg-[var(--accent-danger)]/10 p-6">
            <p className="font-mono text-xs font-semibold text-[var(--accent-danger)]">
              PRIVACY GATE TRIGGERED (is_private=true / private_series)
            </p>
            <p className="mt-2 text-sm text-[var(--text-primary)]">
              Request returns <code className="font-mono">skipped</code> immediately before SQLite storage or any LLM
              provider invocation. No transcript lines, drafts, action items, or notifications are persisted.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-6 lg:grid-cols-12">
            {/* Transcript Lines */}
            <div className="space-y-2 lg:col-span-6">
              <p className="font-mono text-xs text-[var(--text-secondary)]">
                Select a transcript line to inspect extraction &amp; Git verification:
              </p>
              {PM_TRANSCRIPT_LINES.map((entry) => {
                const selected = entry.line === activeItem.line;
                return (
                  <button
                    key={entry.line}
                    type="button"
                    onClick={() => setSelectedLine(entry.line)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selected
                        ? 'border-[var(--accent-signal)] bg-[var(--accent-signal-soft)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                        Line {entry.line} · {entry.speaker}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                          entry.discrepancy
                            ? 'bg-[var(--accent-amber-soft)] text-[var(--accent-amber)]'
                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {entry.discrepancy ? 'GIT DISCREPANCY' : entry.tag.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                      &ldquo;{entry.text}&rdquo;
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Reality Check & Approval Queue Card */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4 lg:col-span-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[var(--accent-cyan)]">
                    WAITING DRAFTS QUEUE · JIRA {activeItem.jiraKey}
                  </span>
                  <span className="rounded bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-primary)]">
                    Confidence {(activeItem.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <h5 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
                  {activeItem.draftTitle}
                </h5>

                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                  <p className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--accent-signal)]">
                    <Quotes size={13} weight="bold" aria-hidden="true" />
                    Verified Verbatim Source Quote (DB Boundary Gate)
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-primary)]">
                    &ldquo;Line {activeItem.line}: {activeItem.speaker}: {activeItem.text}&rdquo;
                  </p>
                </div>

                <div
                  className={`rounded-lg border p-3 ${
                    activeItem.discrepancy
                      ? 'border-[var(--accent-amber)]/50 bg-[var(--accent-amber-soft)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)]'
                  }`}
                >
                  <p
                    className={`flex items-center gap-1.5 font-mono text-[11px] font-semibold ${
                      activeItem.discrepancy ? 'text-[var(--accent-amber)]' : 'text-[var(--accent-cyan)]'
                    }`}
                  >
                    {activeItem.discrepancy ? (
                      <ShieldWarning size={14} weight="bold" aria-hidden="true" />
                    ) : (
                      <GitPullRequest size={14} weight="bold" aria-hidden="true" />
                    )}
                    GitHub &amp; Rules Audit Evidence
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-primary)]">{activeItem.githubEvidence}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-[var(--text-secondary)]">
                    Outcome: {activeItem.gateOutcome}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3">
                <div aria-live="polite" className="flex items-center gap-2 font-mono text-xs">
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1 text-[var(--accent-signal)]">
                      <CheckCircle size={15} weight="fill" aria-hidden="true" />
                      Approved in demo · no live Jira call
                    </span>
                  ) : (
                    <span className="text-[var(--text-secondary)]">Status: waiting PM review</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={toggleApproval}
                  className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                    isApproved
                      ? 'border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                      : 'border-[var(--accent-signal)] bg-[var(--accent-signal)] text-[var(--on-accent-signal)]'
                  }`}
                >
                  {isApproved ? 'Revoke demo approval' : 'Approve in demo'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Measured Golden Eval Harness Results */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h4 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
              Measured Eval Harness (<code className="font-mono text-sm">evals/results/live.json</code>)
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Model: {PM_LIVE_EVAL.model} · {PM_LIVE_EVAL.meetingsCount} golden meetings ·{' '}
              {PM_LIVE_EVAL.durationSeconds}s total · live model, fixture connectors
            </p>
          </div>
          <span className="font-mono text-xs text-[var(--accent-signal)]">19/19 pytest tests passing</span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PM_LIVE_EVAL.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-[var(--text-primary)]">{m.label}</span>
                <span className="font-mono text-sm font-semibold text-[var(--accent-signal)]">{m.value}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-signal)]"
                  style={{ width: `${m.value}%` }}
                />
              </div>
              <p className="mt-1.5 font-mono text-[11px] text-[var(--text-secondary)]">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
