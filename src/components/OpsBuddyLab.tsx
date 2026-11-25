import {
  CheckCircle,
  Code,
  Cpu,
  Database,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  TerminalWindow,
} from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { OPS_SCENARIOS, PROJECTS } from '../data/portfolioData';

interface OpsBuddyLabProps {
  onOpenEvidence: () => void;
}

const PIPELINE_STEPS = [
  {
    id: 'auth',
    title: 'Identity & domain scope',
    detail: 'Verify the signed-in user, resolve the role and business-domain scope, and reject the request before retrieval if the scope does not match.',
  },
  {
    id: 'intent',
    title: 'Intent & entity extraction',
    detail: 'Extract incident, change, batch-job, and monitoring references while preserving the conversation follow-up state.',
  },
  {
    id: 'dispatch',
    title: 'Concurrent agent dispatch',
    detail: 'Fan out to incident, SOP, change, and RCA agents against domain-scoped retrieval collections.',
  },
  {
    id: 'rerank',
    title: 'Hybrid RRF + cross-encoder',
    detail: 'Fuse lexical BM25 ranks with dense vector ranks using Reciprocal Rank Fusion, then re-score the top candidates.',
  },
  {
    id: 'stream',
    title: 'Streaming resolution + memory',
    detail: 'Stream structured resolution steps to the workbench and persist session turns and feedback for continuity.',
  },
];

export function OpsBuddyLab({ onOpenEvidence }: OpsBuddyLabProps) {
  const project = PROJECTS.opsbuddy;
  const [scenarioId, setScenarioId] = useState(OPS_SCENARIOS[0].id);
  const [rrfK, setRrfK] = useState(20);
  const [activeStep, setActiveStep] = useState(4);

  const scenario = OPS_SCENARIOS.find((s) => s.id === scenarioId) ?? OPS_SCENARIOS[0];

  const rankedCandidates = useMemo(() => {
    const maxRrf = 2 / rrfK;
    return scenario.candidates
      .map((cand) => {
        const rawRrf = 1 / (rrfK + cand.bm25Rank) + 1 / (rrfK + cand.denseRank);
        const normalizedRrf = rawRrf / maxRrf;
        return {
          ...cand,
          rawRrf,
          normalizedRrf,
        };
      })
      .sort((a, b) => b.normalizedRrf - a.normalizedRrf);
  }, [scenario, rrfK]);

  const stepPipeline = () => {
    setActiveStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan-soft)] px-4 py-3">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--text-secondary)]">
          <ShieldCheck size={15} weight="bold" aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--accent-cyan)]" />
          <span>
            <strong className="text-[var(--text-primary)]">Sanitized interactive demo.</strong> Every query, case ID,
            runbook, and search result below is synthetic. Client systems, identifiers, and production content are not
            shown.
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
              <dt className="font-mono text-xs text-[var(--text-secondary)]">Orchestration</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--text-primary)]">{project.orchestration}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs text-[var(--text-secondary)]">Security &amp; isolation</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--text-primary)]">{project.securityAndGates}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 lg:col-span-4">
          <div>
            <p className="font-mono text-xs text-[var(--accent-signal)]">PRODUCTION OUTCOME</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                <p className="font-[var(--font-display)] text-2xl font-bold text-[var(--accent-signal)]">60%</p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">MTTR reduced</p>
              </div>
              <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                <p className="font-[var(--font-display)] text-2xl font-bold text-[var(--accent-cyan)]">75%</p>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">L1/L2 automated</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)]">
              Two MCP surfaces: operations tools and a separately governed SOP builder.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.primaryStack.slice(0, 6).map((tech) => (
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

      {/* Interactive Simulator */}
      <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--bg-surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <p className="font-mono text-xs text-[var(--accent-cyan)]">INTERACTIVE SANDBOX · SYNTHETIC DATA</p>
            <h4 className="font-[var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
              Domain-isolated triage &amp; hybrid reranker
            </h4>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Select a demo support domain">
            {OPS_SCENARIOS.map((item) => {
              const selected = item.id === scenario.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setScenarioId(item.id)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                    selected
                      ? 'border-[var(--accent-signal)] bg-[var(--accent-signal-soft)] text-[var(--text-primary)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.domain} · {item.demoCaseId}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-12">
          {/* Left: query + step trace */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--accent-signal)]">
                  <TerminalWindow size={14} weight="bold" aria-hidden="true" />
                  {scenario.title}
                </span>
                <span className="rounded bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                  Scope: {scenario.domain}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--text-primary)]">&ldquo;{scenario.query}&rdquo;</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Extracted retrieval terms">
                {scenario.searchTerms.map((term) => (
                  <li
                    key={term}
                    className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]"
                  >
                    {term}
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-[var(--border-subtle)] pt-2 font-mono text-[11px] text-[var(--accent-cyan)]">
                Tool: {scenario.toolCalled}
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-medium text-[var(--text-primary)]">Execution pipeline</span>
                <button
                  type="button"
                  onClick={stepPipeline}
                  className="inline-flex items-center gap-1.5 rounded border border-[var(--border-strong)] bg-[var(--bg-surface)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--text-primary)] hover:border-[var(--accent-signal)]"
                >
                  <Play size={12} weight="fill" aria-hidden="true" />
                  Step stage ({activeStep + 1}/{PIPELINE_STEPS.length})
                </button>
              </div>
              <ol className="mt-3 space-y-2">
                {PIPELINE_STEPS.map((step, idx) => {
                  const isCurrent = idx === activeStep;
                  const isDone = idx < activeStep;
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => setActiveStep(idx)}
                        className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                          isCurrent
                            ? 'border-[var(--accent-signal)] bg-[var(--accent-signal-soft)]'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-medium text-[var(--text-primary)]">
                            {idx + 1}. {step.title}
                          </span>
                          {isDone || isCurrent ? (
                            <CheckCircle
                              size={14}
                              weight="fill"
                              aria-hidden="true"
                              className="shrink-0 text-[var(--accent-signal)]"
                            />
                          ) : null}
                        </div>
                        {isCurrent ? (
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">{step.detail}</p>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Right: RRF calculator + ranked evidence */}
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal
                    size={16}
                    weight="bold"
                    aria-hidden="true"
                    className="text-[var(--accent-signal)]"
                  />
                  <label htmlFor="rrf-k-slider" className="font-mono text-xs font-medium text-[var(--text-primary)]">
                    RRF smoothing constant (<span className="text-[var(--accent-signal)]">k = {rrfK}</span>)
                  </label>
                </div>
                <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                  Formula: 1/({rrfK} + lexical) + 1/({rrfK} + vector)
                </span>
              </div>
              <input
                id="rrf-k-slider"
                type="range"
                min={5}
                max={60}
                step={5}
                value={rrfK}
                onChange={(e) => setRrfK(Number(e.target.value))}
                className="mt-3 w-full"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-[var(--text-secondary)]">
                <span>k=5 · sharp top-rank bias</span>
                <span>k=20 · example default</span>
                <span>k=60 · smooth consensus</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {rankedCandidates.map((cand, rankIdx) => (
                <div
                  key={cand.docId}
                  className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[var(--bg-elevated)] font-mono text-xs font-semibold text-[var(--accent-signal)]">
                        #{rankIdx + 1}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">{cand.title}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      <span className="rounded bg-[var(--bg-surface)] px-2 py-0.5 text-[var(--text-secondary)]">
                        Lexical #{cand.bm25Rank}
                      </span>
                      <span className="rounded bg-[var(--bg-surface)] px-2 py-0.5 text-[var(--text-secondary)]">
                        Vector #{cand.denseRank}
                      </span>
                      <span className="rounded bg-[var(--accent-signal-soft)] px-2 py-0.5 font-semibold text-[var(--accent-signal)]">
                        RRF {cand.normalizedRrf.toFixed(3)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{cand.snippet}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-[var(--accent-cyan)]">
                    <Database size={12} aria-hidden="true" />
                    {cand.source} · Cross-encoder {(cand.crossEncoderScore * 100).toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-[var(--accent-signal)]/40 bg-[var(--accent-signal-soft)] p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--accent-signal)]">
                  <ShieldCheck size={15} weight="bold" aria-hidden="true" />
                  Synthesized resolution
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--text-secondary)]">
                  <Cpu size={13} aria-hidden="true" />
                  {scenario.agentsExecuted.join(' → ')}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-primary)]">{scenario.resolutionSummary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
