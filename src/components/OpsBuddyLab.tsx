import {
  ArrowRight,
  CheckCircle,
  Code,
  Cpu,
  Database,
  LockKey,
  MagnifyingGlass,
  Play,
  ShieldCheck,
  ShieldWarning,
  SlidersHorizontal,
  TerminalWindow,
  UserCircle,
} from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { OPS_SCENARIOS, PROJECTS } from '../data/portfolioData';

interface OpsBuddyLabProps {
  onOpenEvidence: () => void;
}

type RetrievalMode = 'lexical' | 'vector' | 'hybrid';

const PIPELINE_STEPS = [
  {
    id: 'auth',
    title: 'Identity & domain scope',
    detail:
      'Verify the signed-in user, resolve the role and business-domain scope, and reject the request before retrieval if the scope does not match.',
  },
  {
    id: 'intent',
    title: 'Intent & entity extraction',
    detail:
      'Extract incident, change, batch-job, and monitoring references while preserving the conversation follow-up state.',
  },
  {
    id: 'dispatch',
    title: 'Concurrent agent dispatch',
    detail: 'Fan out to incident, SOP, change, and RCA agents against domain-scoped retrieval collections.',
  },
  {
    id: 'rerank',
    title: 'Hybrid RRF + cross-encoder',
    detail:
      'Fuse lexical BM25 ranks with dense vector ranks using Reciprocal Rank Fusion, then re-score the top candidates.',
  },
  {
    id: 'stream',
    title: 'Streaming resolution + memory',
    detail:
      'Stream structured resolution steps to the workbench and persist session turns and feedback for continuity.',
  },
];

const AGENT_SOURCES: Record<string, string> = {
  IntentAgent: 'Rewrites the query and extracts entities',
  IncidentAgent: 'Reads incident history and monitoring alerts',
  SOPAgent: 'Reads runbooks and the SOP index',
  CRAgent: 'Reads change records and release notes',
  RCAAgent: 'Reads RCA notes and alert timelines',
  Reranker: 'Fuses candidates, then cross-encoder re-scores',
  ResolutionAgent: 'Synthesizes the cited answer',
};

const MODE_NOTES: Record<RetrievalMode, string> = {
  lexical: 'BM25 is precise on exact codes and runbook names, but misses paraphrases and synonyms.',
  vector: 'Dense retrieval catches paraphrases, but can drift on exact IDs, codes, and product names.',
  hybrid:
    'RRF fuses both rank lists without score calibration, then a cross-encoder re-scores the top candidates.',
};

function chipClass(active: boolean) {
  return active
    ? 'rounded bg-[var(--accent-signal-soft)] px-2 py-0.5 font-semibold text-[var(--accent-signal)]'
    : 'rounded bg-[var(--bg-surface)] px-2 py-0.5 text-[var(--text-secondary)]';
}

export function OpsBuddyLab({ onOpenEvidence }: OpsBuddyLabProps) {
  const project = PROJECTS.opsbuddy;
  const [scenarioId, setScenarioId] = useState(OPS_SCENARIOS[0].id);
  const [rrfK, setRrfK] = useState(20);
  const [activeStep, setActiveStep] = useState(0);
  const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>('hybrid');
  const [crossDomainProbe, setCrossDomainProbe] = useState(false);

  const scenario = OPS_SCENARIOS.find((s) => s.id === scenarioId) ?? OPS_SCENARIOS[0];
  const requestScope = crossDomainProbe ? 'Finance' : scenario.scope;
  const accessAllowed = !crossDomainProbe;

  const selectScenario = (id: string) => {
    setScenarioId(id);
    setActiveStep(0);
    setCrossDomainProbe(false);
    setRetrievalMode('hybrid');
  };

  const rankedCandidates = useMemo(() => {
    const maxRrf = 2 / rrfK;
    const scored = scenario.candidates.map((cand) => {
      const rawRrf = 1 / (rrfK + cand.bm25Rank) + 1 / (rrfK + cand.denseRank);
      return {
        ...cand,
        rawRrf,
        normalizedRrf: rawRrf / maxRrf,
      };
    });

    if (retrievalMode === 'lexical') {
      return [...scored].sort((a, b) => a.bm25Rank - b.bm25Rank);
    }
    if (retrievalMode === 'vector') {
      return [...scored].sort((a, b) => a.denseRank - b.denseRank);
    }
    return scored.sort((a, b) => b.normalizedRrf - a.normalizedRrf);
  }, [scenario, rrfK, retrievalMode]);

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
              Domain-isolated triage, retrieval &amp; resolution
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
                  onClick={() => selectScenario(item.id)}
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
                  Scope: {scenario.scope}
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
                        aria-current={isCurrent ? 'step' : undefined}
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

          {/* Right: stage inspector */}
          <div className="lg:col-span-7">
            <p className="sr-only" aria-live="polite">
              Stage {activeStep + 1} of {PIPELINE_STEPS.length}: {PIPELINE_STEPS[activeStep].title}
            </p>
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                <p className="font-mono text-[11px] font-semibold tracking-wider text-[var(--accent-cyan)]">
                  STAGE {activeStep + 1} OF {PIPELINE_STEPS.length}
                </p>
                <p className="font-mono text-xs text-[var(--text-primary)]">{PIPELINE_STEPS[activeStep].title}</p>
              </div>

              {activeStep === 0 ? (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                        Signed-in role
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-primary)]">
                        <UserCircle size={15} aria-hidden="true" className="text-[var(--accent-signal)]" />
                        {scenario.role}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                        Requested scope
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{requestScope}</p>
                    </div>
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                        Case reference
                      </p>
                      <p className="mt-1 font-mono text-sm font-medium text-[var(--text-primary)]">
                        {scenario.demoCaseId}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                      Collections allowed for this role
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {scenario.collections.map((collection) => (
                        <li
                          key={collection}
                          className="inline-flex items-center gap-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]"
                        >
                          <Database size={10} aria-hidden="true" />
                          {collection}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`rounded-lg border p-3 ${
                      accessAllowed
                        ? 'border-[var(--accent-signal)]/40 bg-[var(--accent-signal-soft)]'
                        : 'border-[var(--accent-danger)]/50 bg-[var(--bg-surface)]'
                    }`}
                  >
                    <p
                      className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold ${
                        accessAllowed ? 'text-[var(--accent-signal)]' : 'text-[var(--accent-danger)]'
                      }`}
                    >
                      {accessAllowed ? (
                        <ShieldCheck size={15} weight="bold" aria-hidden="true" />
                      ) : (
                        <ShieldWarning size={15} weight="bold" aria-hidden="true" />
                      )}
                      {accessAllowed ? 'ALLOW · scope matched' : 'DENY · scope mismatch'}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-primary)]">
                      {accessAllowed
                        ? `The request is routed to the ${scenario.scope} index only. Retrieval and tool calls run after this gate, never before it.`
                        : `The ${scenario.role} role does not include the Finance domain. The request is rejected before retrieval or tool execution.`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCrossDomainProbe((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-2 font-mono text-[11px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent-signal)]"
                  >
                    <LockKey size={14} aria-hidden="true" />
                    {crossDomainProbe ? 'Return to in-scope request' : 'Probe a cross-domain request'}
                  </button>
                </div>
              ) : null}

              {activeStep === 1 ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                      <MagnifyingGlass size={12} aria-hidden="true" />
                      Extracted entities
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {scenario.searchTerms.map((term) => (
                        <li
                          key={term}
                          className="rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]"
                        >
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                        Resolved case
                      </dt>
                      <dd className="mt-1 font-mono text-sm text-[var(--text-primary)]">{scenario.demoCaseId}</dd>
                    </div>
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                        Tool contract
                      </dt>
                      <dd className="mt-1 break-words font-mono text-[11px] text-[var(--text-primary)]">
                        {scenario.toolCalled}
                      </dd>
                    </div>
                  </dl>

                  <p className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                    Follow-up turns reuse the resolved case and domain scope, so &ldquo;and the next batch?&rdquo; does
                    not restart discovery or widen the retrieval boundary.
                  </p>
                </div>
              ) : null}

              {activeStep === 2 ? (
                <div className="mt-4 space-y-4">
                  <p className="text-xs text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">{scenario.agentsExecuted.length} agents</strong>{' '}
                    participate in this request. Domain agents fan out concurrently; the reranker joins after retrieval.
                  </p>
                  <ul className="space-y-2">
                    {scenario.agentsExecuted.map((agent, idx) => (
                      <li
                        key={agent}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[var(--bg-elevated)] font-mono text-[10px] font-semibold text-[var(--accent-signal)]">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-mono text-xs font-medium text-[var(--text-primary)]">{agent}</p>
                            <p className="text-[11px] text-[var(--text-secondary)]">
                              {AGENT_SOURCES[agent] ?? 'Domain-scoped worker'}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded bg-[var(--accent-signal-soft)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--accent-signal)]">
                          <CheckCircle size={11} weight="fill" aria-hidden="true" />
                          complete
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                    Each worker reads only its domain-scoped collection. The orchestrator never hands a raw cross-domain
                    handle to a downstream agent.
                  </p>
                </div>
              ) : null}

              {activeStep === 3 ? (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select retrieval strategy">
                      {(
                        [
                          ['lexical', 'Lexical (BM25)'],
                          ['vector', 'Vector'],
                          ['hybrid', 'Hybrid RRF'],
                        ] as const
                      ).map(([mode, label]) => (
                        <button
                          key={mode}
                          type="button"
                          aria-pressed={retrievalMode === mode}
                          onClick={() => setRetrievalMode(mode)}
                          className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors ${
                            retrievalMode === mode
                              ? 'border-[var(--accent-signal)] bg-[var(--accent-signal-soft)] text-[var(--text-primary)]'
                              : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                      {scenario.candidates.length} candidates
                    </span>
                  </div>

                  {retrievalMode === 'hybrid' ? (
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal
                            size={15}
                            weight="bold"
                            aria-hidden="true"
                            className="text-[var(--accent-signal)]"
                          />
                          <label
                            htmlFor="rrf-k-slider"
                            className="font-mono text-xs font-medium text-[var(--text-primary)]"
                          >
                            RRF smoothing constant (<span className="text-[var(--accent-signal)]">k = {rrfK}</span>)
                          </label>
                        </div>
                        <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                          1/(k + lexical rank) + 1/(k + vector rank)
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
                  ) : null}

                  <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{MODE_NOTES[retrievalMode]}</p>

                  <div className="space-y-2.5">
                    {rankedCandidates.map((cand, rankIdx) => (
                      <div
                        key={cand.docId}
                        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[var(--bg-elevated)] font-mono text-xs font-semibold text-[var(--accent-signal)]">
                              #{rankIdx + 1}
                            </span>
                            <span className="text-sm font-medium text-[var(--text-primary)]">{cand.title}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                            <span className={chipClass(retrievalMode === 'lexical')}>Lexical #{cand.bm25Rank + 1}</span>
                            <span className={chipClass(retrievalMode === 'vector')}>Vector #{cand.denseRank + 1}</span>
                            <span className={chipClass(retrievalMode === 'hybrid')}>
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
                </div>
              ) : null}

              {activeStep === 4 ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-lg border border-[var(--accent-signal)]/40 bg-[var(--accent-signal-soft)] p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--accent-signal)]">
                        <ShieldCheck size={15} weight="bold" aria-hidden="true" />
                        Synthesized resolution
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--text-secondary)]">
                        <Cpu size={12} aria-hidden="true" />
                        {scenario.agentsExecuted.join(' → ')}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-primary)]">
                      {scenario.resolutionSummary}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                      Cited sources
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {scenario.candidates.map((cand) => (
                        <li
                          key={cand.docId}
                          className="flex flex-wrap items-center justify-between gap-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1.5"
                        >
                          <span className="font-mono text-[11px] text-[var(--text-primary)]">
                            {cand.docId} · {cand.title}
                          </span>
                          <span className="font-mono text-[10px] text-[var(--text-secondary)]">{cand.source}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <p className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                      <strong className="text-[var(--text-primary)]">Read-only path.</strong> This request answers and
                      cites; it does not execute a write. Mutating tools sit behind a separate approval gate.
                    </p>
                    <p className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                      <strong className="text-[var(--text-primary)]">Session memory.</strong> The turn, cited sources, and
                      feedback are persisted for the next follow-up in the same domain scope.
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-3">
                <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                  {activeStep + 1 < PIPELINE_STEPS.length
                    ? 'Continue to see the next gate, tool call, or ranking step.'
                    : 'End of pipeline. Switch scenarios or revisit any stage.'}
                </p>
                <button
                  type="button"
                  onClick={stepPipeline}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-[11px] font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-signal)]"
                >
                  {activeStep + 1 < PIPELINE_STEPS.length ? 'Next stage' : 'Restart'}
                  <ArrowRight size={13} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
