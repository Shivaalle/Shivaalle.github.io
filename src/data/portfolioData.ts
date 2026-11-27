export type ProjectId = 'opsbuddy' | 'ideainnovator' | 'pmagent';

export interface ProfileInfo {
  name: string;
  title: string;
  company: string;
  tenure: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  githubHandle: string;
  linkedin: string;
  summary: string;
  education: {
    degree: string;
    institution: string;
    years: string;
    cgpa: string;
  };
  certifications: Array<{
    name: string;
    issuer: string;
  }>;
  highlights: Array<{
    value: string;
    label: string;
    source: string;
  }>;
}

export type TopologyKind = 'input' | 'orchestrator' | 'agent' | 'gate' | 'storage';

export interface ProjectSummary {
  id: ProjectId;
  name: string;
  role: string;
  caseLabel: string;
  confidentiality: string;
  tagline: string;
  problem: string;
  orchestration: string;
  securityAndGates: string;
  impact: string;
  primaryStack: string[];
  metrics: Array<{ value: string; label: string }>;
  topologyNodes: Array<{
    id: string;
    label: string;
    detail: string;
    kind: TopologyKind;
  }>;
  evidence: {
    kind: 'architecture' | 'source';
    heading: string;
    intro: string;
    items: Array<{
      label: string;
      title: string;
      summary: string;
    }>;
    snippetTitle?: string;
    snippet?: string;
  };
}

export const PROFILE: ProfileInfo = {
  name: 'Shiva Teja Alle',
  title: 'Generative AI Engineer',
  company: 'Tata Consultancy Services (TCS)',
  tenure: '2024 – Present · 2+ years',
  location: 'Hyderabad, Telangana, India',
  email: 'shiva.alle22@gmail.com',
  phone: '+91-93903 47354',
  github: 'https://github.com/Shivaalle',
  githubHandle: 'github.com/Shivaalle',
  linkedin: 'https://www.linkedin.com/in/shiva-teja-alle-254895201',
  summary:
    'I build multi-agent systems that can show their work — hybrid retrieval, deterministic state, and human approval before side effects.',
  education: {
    degree: 'Bachelor of Technology — Information Technology',
    institution: 'VNR Vignana Jyothi Institute of Engineering and Technology',
    years: '2020 – 2024',
    cgpa: '8.53 / 10',
  },
  certifications: [
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services — cloud fundamentals, services & architecture',
    },
    {
      name: 'AIML — Deep Learning Workshop',
      issuer: 'ACM VNRVJIET — applied AI/ML & deep learning',
    },
    {
      name: 'Python Advanced Programming Workshop',
      issuer: 'ACM VNRVJIET — intensive Python systems development',
    },
  ],
  highlights: [
    {
      value: '60%',
      label: 'Lower MTTR',
      source: 'OpsBuddy production rollout',
    },
    {
      value: '75%',
      label: 'L1/L2 automated',
      source: 'Incident triage workflows',
    },
    {
      value: '100%',
      label: 'Citation coverage',
      source: 'PM Agent · 20/20 drafts',
    },
    {
      value: '10.5s',
      label: '4-meeting eval',
      source: 'Gemini golden benchmark',
    },
  ],
};

export const PROJECTS: Record<ProjectId, ProjectSummary> = {
  opsbuddy: {
    id: 'opsbuddy',
    name: 'OpsBuddy AI',
    role: 'Lead AI Engineer',
    caseLabel: '01 · Production platform',
    confidentiality: 'Sanitized case study',
    tagline: 'Enterprise operations copilot with hybrid retrieval and governed MCP tools.',
    problem:
      'L1/L2 analysts had to correlate incidents, changes, batch jobs, monitoring alerts, and SOPs across business domains — each with different vocabulary and access rules.',
    orchestration:
      'Concurrent multi-agent orchestration across incident, SOP, change, RCA, resolution, and reranking modules, with FastAPI + SSE streaming on AWS ECS Fargate.',
    securityAndGates:
      'SSO-backed identity, role- and domain-scoped retrieval collections, origin/CSRF checks, and separately governed MCP tool surfaces.',
    impact:
      'Reduced mean time to resolution by 60% and automated 75% of repetitive L1/L2 investigation and resolution workflows in production support.',
    primaryStack: [
      'AWS Bedrock (Claude Sonnet)',
      'Titan Embeddings V2',
      'FastMCP',
      'BM25 + RRF + Titan Embeddings',
      'FastAPI + SSE',
      'AWS ECS Fargate',
      'DynamoDB',
      'React workbench',
    ],
    metrics: [
      { value: '60%', label: 'lower MTTR' },
      { value: '75%', label: 'L1/L2 workflows automated' },
    ],
    topologyNodes: [
      {
        id: 'gateway',
        label: 'Identity-aware gateway',
        detail: 'SSO roles and business-domain scope enforced before any retrieval or tool call',
        kind: 'gate',
      },
      {
        id: 'orchestrator',
        label: 'Streaming orchestrator',
        detail: 'Intent routing fans out to incident, change, SOP, RCA, and resolution agents',
        kind: 'orchestrator',
      },
      {
        id: 'mcp',
        label: 'Governed MCP tools',
        detail: 'Separate operations and SOP-builder tool surfaces with role-scoped permissions',
        kind: 'agent',
      },
      {
        id: 'rerank',
        label: 'Hybrid retrieval',
        detail: 'BM25 + 1,024-dim embeddings fused with RRF, then normalized and deduplicated',
        kind: 'agent',
      },
      {
        id: 'ingestion',
        label: 'Isolated indexes + ingestion',
        detail: 'Domain-scoped vector collections behind an event-driven, dead-letter-backed pipeline',
        kind: 'storage',
      },
    ],
    evidence: {
      kind: 'architecture',
      heading: 'Architecture notes',
      intro:
        'Client systems, identifiers, and runbooks are intentionally omitted. These notes describe the reusable architecture at a level suitable for a public portfolio.',
      items: [
        {
          label: '01 · Access layer',
          title: 'Identity before retrieval',
          summary:
            'Enterprise SSO establishes the user, role, and business-domain scope. The same scope is enforced again at the API and MCP-tool layers, so isolation does not depend on a prompt.',
        },
        {
          label: '02 · Orchestration',
          title: 'Concurrent agent fan-out',
          summary:
            'A streaming orchestrator routes each request to the relevant incident, change, SOP, RCA, or resolution agents, then merges their output into one evidence-backed response.',
        },
        {
          label: '03 · Retrieval',
          title: 'Hybrid ranking with a lexical safety net',
          summary:
            'Lexical BM25 catches exact identifiers; dense embeddings catch paraphrases. Reciprocal Rank Fusion combines both, then the fused list is normalized, deduplicated, and cut to the top candidates.',
        },
        {
          label: '04 · Tooling',
          title: 'Governed MCP surfaces',
          summary:
            'Read and write capabilities are exposed as separate MCP tools. High-impact SOP authoring is isolated behind its own role-gated endpoint rather than bundled into the chat tool.',
        },
        {
          label: '05 · Ingestion',
          title: 'Domain-isolated knowledge pipeline',
          summary:
            'An event-driven ingestion pipeline chunks and indexes operations knowledge per domain, with dead-letter handling so a failed document does not silently disappear.',
        },
      ],
      snippetTitle: 'Illustrative hybrid ranking pattern — simplified, not production source',
      snippet: `# Merge two independently ranked lists (illustrative only)
rrf_score = 1 / (k + lexical_rank) + 1 / (k + vector_rank)

top_candidates = sorted(candidates, key=rrf_score, reverse=True)[:limit]
final_ranking = dedupe_by_source_id(top_candidates)`,
    },
  },

  ideainnovator: {
    id: 'ideainnovator',
    name: 'Idea Innovator AI',
    role: 'Generative AI Engineer',
    caseLabel: '02 · Enterprise workflow',
    confidentiality: 'Sanitized case study',
    tagline: 'Multi-agent innovation intake with a role-gated lifecycle and automated POC compiler.',
    problem:
      'Innovation submissions arrived unstructured, duplicated prior work, lacked objective prioritization, and stalled before producing actionable requirements.',
    orchestration:
      'Eight specialized LangGraph intake nodes extract a structured business case through guided conversation bundles, followed by semantic deduplication and an async four-stage POC chain.',
    securityAndGates:
      'A 12-state role-gated lifecycle, immutable submitted snapshots, embedding-based duplicate blocking, and deterministic ranking separated from LLM-written explanations.',
    impact:
      'Turned raw employee ideas into evaluated, ranked, prototype-backed POCs across four personas: submitter, evaluator, leadership, and system.',
    primaryStack: [
      'LangGraph (8 intake nodes + 4 POC stages)',
      'Azure OpenAI GPT-4o',
      'SentenceTransformers (all-MiniLM-L6-v2)',
      'ChromaDB',
      'FastAPI',
      'JWT role-based access',
      'React 19 + Vite',
    ],
    metrics: [
      { value: '8', label: 'specialized intake agents' },
      { value: '12', label: 'role-gated lifecycle states' },
    ],
    topologyNodes: [
      {
        id: 'intake',
        label: '8-agent intake graph',
        detail: 'Router, extractors, coverage, mentor, edit, synthesis, and parser nodes',
        kind: 'orchestrator',
      },
      {
        id: 'similarity',
        label: 'Duplicate guard',
        detail: 'Sentence embeddings and vector search block near-duplicates before persistence',
        kind: 'gate',
      },
      {
        id: 'lifecycle',
        label: '12-state lifecycle',
        detail: 'One transition authority enforces role permissions and immutable submitted snapshots',
        kind: 'gate',
      },
      {
        id: 'radar',
        label: 'Deterministic radar',
        detail: 'Jury score, freshness decay, and strategic fit rank ideas; the LLM only explains',
        kind: 'agent',
      },
      {
        id: 'poc',
        label: '4-stage POC compiler',
        detail: 'Background chain: BRD → FRD → UIRD → standalone interactive HTML prototype',
        kind: 'storage',
      },
    ],
    evidence: {
      kind: 'architecture',
      heading: 'Architecture notes',
      intro:
        'Representative architecture only. Production prompts, scoring configuration, customer content, and generated artifacts are not shown.',
      items: [
        {
          label: '01 · Intake',
          title: 'A graph, not one large prompt',
          summary:
            'Eight nodes each own one job: route the input, extract fields, find missing coverage, mentor the submitter, apply edits, synthesize, and parse a typed business case.',
        },
        {
          label: '02 · Duplicate guard',
          title: 'Check similarity before persistence',
          summary:
            'Candidate ideas are embedded and compared against the existing corpus. A configurable similarity threshold blocks near-duplicates before they enter the evaluation queue.',
        },
        {
          label: '03 · Lifecycle',
          title: 'One authority for every transition',
          summary:
            'A centralized transition function owns the 12 states and their role permissions. Submissions are frozen as immutable snapshots and every change lands in an audit trail.',
        },
        {
          label: '04 · Ranking',
          title: 'Deterministic ranking, generative explanation',
          summary:
            'Pure arithmetic combines jury score, freshness, and strategic theme. The LLM writes a readable justification, but it cannot move an idea up or down the radar.',
        },
        {
          label: '05 · POC compiler',
          title: 'Four stages, resumable artifacts',
          summary:
            'A background chain produces a BRD, FRD, UI/interaction spec, and a standalone HTML prototype in a per-run directory, preserving earlier artifacts if a later stage retries.',
        },
      ],
      snippetTitle: 'Illustrative ranking model — weights and thresholds are not production values',
      snippet: `# Deterministic, explainable ranking (illustrative)
freshness = 0.5 ** (days_elapsed / half_life_days)

rank_score = (
    score_weight * normalized_jury_score
    + recency_weight * freshness
    + theme_weight * strategic_fit
)`,
    },
  },

  pmagent: {
    id: 'pmagent',
    name: 'PM Agent',
    role: 'AI Systems Architect',
    caseLabel: '03 · Independent build',
    confidentiality: 'Source-verified build',
    tagline: 'Meeting-to-Jira auditor that checks what was said against what the code actually shows.',
    problem:
      'Spoken status diverges from code reality — “the login API is done” while PR #45 is still open with failing CI — and autonomous bots risk corrupting a Jira board without evidence.',
    orchestration:
      'A three-node LangGraph state machine (fetch context → draft and cross-reference → save drafts) backed by pluggable Gemini or OpenAI-compatible models and MCP connectors for Jira, GitHub, and Teams.',
    securityAndGates:
      'Five hard gates: private-meeting discard before storage, role + project access control, verbatim source-quote verification, spoken-vs-code discrepancy flagging, and idempotent human-approved Jira writeback.',
    impact:
      'Measured across 4 golden meetings with Gemini 3.5 Flash-Lite (10.52s total): 100% verbatim citation coverage (20/20 drafts), 100% owner/decision/RAID/scope recall, and 19/19 passing tests.',
    primaryStack: [
      'LangGraph state machine',
      'Gemini 3.5 Flash-Lite / OpenAI-compatible',
      'MCP (Jira, GitHub, Teams)',
      'FastAPI + aiosqlite (WAL)',
      'Pydantic strict schemas',
      'React 19 + Vite + TypeScript',
      'Golden eval harness + pytest',
    ],
    metrics: [
      { value: '100%', label: 'verbatim citation coverage' },
      { value: '10.5s', label: '4-meeting golden eval' },
    ],
    topologyNodes: [
      {
        id: 'privacy',
        label: 'Privacy + RBAC gate',
        detail: 'Private meetings discarded before DB write; roles and projects scoped on every route',
        kind: 'gate',
      },
      {
        id: 'context',
        label: 'MCP context fetch',
        detail: 'Jira, GitHub, and Teams connectors pull live tickets, PRs, commits, and scope',
        kind: 'agent',
      },
      {
        id: 'audit',
        label: 'LangGraph reality audit',
        detail: 'Extracts quotes, resolves relative dates, and flags spoken-vs-code discrepancies',
        kind: 'orchestrator',
      },
      {
        id: 'quote',
        label: 'Source-quote gate',
        detail: 'Any draft without a verified verbatim transcript quote is dropped before persistence',
        kind: 'gate',
      },
      {
        id: 'writeback',
        label: 'Human-gated Jira sync',
        detail: 'Approval is recorded before an idempotent Jira writeback can run',
        kind: 'storage',
      },
    ],
    evidence: {
      kind: 'source',
      heading: 'Verified source modules',
      intro:
        'Paths and behavior checked against the local repository. Metrics come from the checked-in golden eval results.',
      items: [
        {
          label: 'backend/agent.py',
          title: 'Grounded extraction nodes',
          summary:
            'Enforces strict extraction rules: verbatim quotes, MISSING/UNMATCHED instead of guessing, and Git discrepancy detection when “done” conflicts with open PRs or missing merge evidence.',
        },
        {
          label: 'backend/mcp_servers.py',
          title: 'Jira, GitHub & Teams connectors',
          summary:
            'Dual-mode MCP servers (in-process or standalone stdio/SSE/streamable HTTP) that surface connector errors instead of silently returning fake data.',
        },
        {
          label: 'backend/main.py',
          title: 'Privacy gate & approval endpoint',
          summary:
            'Role-checked endpoints enforce PM-only approval, persist audit history, and keep Jira retries idempotent.',
        },
        {
          label: 'evals/run.py · evals/results/live.json',
          title: 'Golden-meeting eval harness',
          summary:
            'Measures action-item recall/precision, owner and date accuracy, scope detection, decision/RAID recall, citation coverage, and per-meeting latency.',
        },
      ],
      snippetTitle: 'backend/agent.py — non-negotiable grounding rules',
      snippet: `1. STRICT TRACEABILITY: Every decision, action item, RAID item, scope change and
   status update MUST include a source_quote with exact line number(s) and verbatim words.
2. NEVER GUESS: If owner, due date, or ticket key was not said, write "MISSING" / "UNMATCHED".
5. CODE TRUTH: A "done" claim with an open PR or no merged evidence is a discrepancy:
   set discrepancy_detected=true, explain it, lower confidence, cite PR/commit.`,
    },
  },
};

export interface OpsScenario {
  id: string;
  domain: 'Tier 1' | 'Store Ops' | 'Data Platform' | 'Logistics';
  role: string;
  scope: string;
  collections: string[];
  demoCaseId: string;
  title: string;
  query: string;
  searchTerms: string[];
  candidates: Array<{
    docId: string;
    title: string;
    source: string;
    bm25Rank: number;
    denseRank: number;
    snippet: string;
  }>;
  toolCalled: string;
  resolutionSummary: string;
  agentsExecuted: string[];
}

export const OPS_SCENARIOS: OpsScenario[] = [
  {
    id: 'tier1-price-override',
    domain: 'Tier 1',
    role: 'Tier 1 analyst',
    scope: 'Store Ops',
    collections: ['store-ops-runbooks', 'store-ops-cases'],
    demoCaseId: 'DEMO-2201',
    title: 'Temporary price override lookup',
    query: 'How do I apply a temporary price override and confirm it reached the register?',
    searchTerms: ['temporary price override', 'register sync', 'approval window', 'Tier 1'],
    toolCalled: 'ask_ops_copilot(role="Tier 1", domain="Store Ops")',
    agentsExecuted: ['IntentAgent', 'SOPAgent', 'Reranker', 'ResolutionAgent'],
    candidates: [
      {
        docId: 'DEMO-RUN-011',
        title: 'Runbook: temporary price override',
        source: 'Synthetic runbook · demo data',
        bm25Rank: 0,
        denseRank: 0,
        snippet:
          'Open item maintenance → create a time-boxed override with a reason code → publish the delta → verify the receipt on a test register.',
      },
      {
        docId: 'DEMO-RUN-014',
        title: 'Escalation: master price table mismatch',
        source: 'Synthetic escalation guide · demo data',
        bm25Rank: 2,
        denseRank: 1,
        snippet:
          'If two publish attempts fail with the same validation error, attach the SKU batch log and route the case to Tier 2.',
      },
      {
        docId: 'DEMO-CASE-210',
        title: 'Historical case: delayed promo sync',
        source: 'Synthetic incident history · demo data',
        bm25Rank: 3,
        denseRank: 2,
        snippet:
          'Resolved after clearing a cached promotion window and republishing the price delta to the store cluster.',
      },
    ],
    resolutionSummary:
      'Mapped the request to the Tier 1 override runbook, attached the relevant historical case, and surfaced the escalation threshold when repeated validation errors occur.',
  },
  {
    id: 'store-stuck-settlement',
    domain: 'Store Ops',
    role: 'Tier 2 analyst',
    scope: 'Store Ops',
    collections: ['store-ops-runbooks', 'store-ops-cases', 'change-records'],
    demoCaseId: 'DEMO-3142',
    title: 'Stalled settlement batch',
    query: 'How do we clear a stalled settlement batch without duplicate tender posting?',
    searchTerms: ['settlement batch', 'duplicate tender', 'journal lock', 'Store Ops'],
    toolCalled: 'ask_ops_copilot(role="Tier 2", domain="Store Ops")',
    agentsExecuted: ['IntentAgent', 'IncidentAgent', 'SOPAgent', 'Reranker', 'ResolutionAgent'],
    candidates: [
      {
        docId: 'DEMO-RUN-042',
        title: 'Runbook: settlement queue recovery',
        source: 'Synthetic runbook · demo data',
        bm25Rank: 0,
        denseRank: 0,
        snippet:
          'Confirm the end-of-day journal lock → drain the pending tender buffer → reconcile the batch hash before restarting the terminal.',
      },
      {
        docId: 'DEMO-CASE-881',
        title: 'Historical case: terminal offline during batch close',
        source: 'Synthetic incident history · demo data',
        bm25Rank: 2,
        denseRank: 1,
        snippet:
          'Resolved by resetting the settlement worker after verifying there were no unsettled authorization holds in the local cache.',
      },
      {
        docId: 'DEMO-CHG-019',
        title: 'Release note: checkout timeout changes',
        source: 'Synthetic change record · demo data',
        bm25Rank: 5,
        denseRank: 3,
        snippet:
          'Updated offline synchronization timeouts for high-volume lanes; monitor the first batch close after rollout.',
      },
    ],
    resolutionSummary:
      'Correlated the recovery runbook with a prior terminal-offline case, then recommended verifying the journal lock and draining the tender buffer before restart.',
  },
  {
    id: 'data-nightly-job',
    domain: 'Data Platform',
    role: 'Tier 2 analyst',
    scope: 'Data Platform',
    collections: ['data-platform-runbooks', 'data-platform-alerts', 'change-records'],
    demoCaseId: 'DEMO-4078',
    title: 'Nightly aggregate job failure',
    query: 'The nightly sales aggregate failed with exit code 12 after warehouse maintenance. What is the safe recovery path?',
    searchTerms: ['nightly aggregate', 'exit code 12', 'warehouse maintenance', 'Data Platform'],
    toolCalled: 'analyze_incident(role="Tier 2", domain="Data Platform", case="DEMO-4078")',
    agentsExecuted: ['IntentAgent', 'IncidentAgent', 'CRAgent', 'RCAAgent', 'Reranker'],
    candidates: [
      {
        docId: 'DEMO-RUN-108',
        title: 'Runbook: batch recovery for exit code 12',
        source: 'Synthetic runbook · demo data',
        bm25Rank: 0,
        denseRank: 1,
        snippet:
          'Exit code 12 indicates an expired staging session. Refresh the session, validate warehouse health, then restart the dependent job graph from the failed node.',
      },
      {
        docId: 'DEMO-CHG-404',
        title: 'Change: scheduled warehouse maintenance',
        source: 'Synthetic change record · demo data',
        bm25Rank: 3,
        denseRank: 0,
        snippet:
          'Compute cluster restarted inside the maintenance window; downstream jobs queued past the retry limit and require a controlled restart.',
      },
      {
        docId: 'DEMO-ALERT-33',
        title: 'Alert: downstream SLA breach',
        source: 'Synthetic monitoring alert · demo data',
        bm25Rank: 1,
        denseRank: 4,
        snippet:
          'The upstream ingest job completed late because of cluster warm-up, delaying the aggregate and triggering an SLA warning.',
      },
    ],
    resolutionSummary:
      'Linked the maintenance change to the downstream alert, then surfaced the exit-code recovery runbook and a controlled restart path for the failed job graph.',
  },
  {
    id: 'logistics-manifest',
    domain: 'Logistics',
    role: 'Tier 2 analyst',
    scope: 'Logistics',
    collections: ['logistics-runbooks', 'logistics-cases'],
    demoCaseId: 'DEMO-5120',
    title: 'Outbound manifest stuck in PENDING_ACK',
    query: 'Outbound manifests are stuck in PENDING_ACK after a partner gateway reset. How do we replay them safely?',
    searchTerms: ['manifest', 'PENDING_ACK', 'gateway reset', 'Logistics'],
    toolCalled: 'ask_ops_copilot(role="Tier 2", domain="Logistics")',
    agentsExecuted: ['IntentAgent', 'IncidentAgent', 'SOPAgent', 'Reranker', 'ResolutionAgent'],
    candidates: [
      {
        docId: 'DEMO-RUN-019',
        title: 'Runbook: replay unacknowledged manifest messages',
        source: 'Synthetic runbook · demo data',
        bm25Rank: 1,
        denseRank: 0,
        snippet:
          'Inspect the outbound dead-letter topic, replay unacknowledged manifests in small batches, and preserve the idempotency key on every message.',
      },
      {
        docId: 'DEMO-CASE-772',
        title: 'Historical case: partner gateway TLS reset',
        source: 'Synthetic incident history · demo data',
        bm25Rank: 0,
        denseRank: 2,
        snippet:
          'A TLS handshake reset dropped 14 acknowledgements. The fix was a controlled batch replay after a partner endpoint health check.',
      },
      {
        docId: 'DEMO-RUN-005',
        title: 'Checklist: verify carrier manifest checksums',
        source: 'Synthetic checklist · demo data',
        bm25Rank: 4,
        denseRank: 3,
        snippet:
          'Validate carton and pallet barcode counts against the manifest header before releasing the shipment.',
      },
    ],
    resolutionSummary:
      'Scoped the answer to the logistics index, fused the replay runbook with a prior gateway-reset case, and recommended small batches with checksum verification.',
  },
];

export type IdeaRole = 'user' | 'evaluator' | 'leadership' | 'system';

export interface IdeaTransitionEdge {
  from: string;
  to: string;
  roles: IdeaRole[];
  rule: string;
}

export const IDEA_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_EVALUATION',
  'CHANGES_REQUESTED',
  'EVALUATED',
  'LEADERSHIP_REVIEW',
  'POC_APPROVED',
  'POC_IN_PROGRESS',
  'POC_READY',
  'POC_FAILED',
  'REJECTED',
  'DEFERRED',
] as const;

export const IDEA_TRANSITIONS: IdeaTransitionEdge[] = [
  {
    from: 'DRAFT',
    to: 'SUBMITTED',
    roles: ['user'],
    rule: 'Passes coverage checks and the duplicate guard; freezes an immutable submitted snapshot.',
  },
  {
    from: 'SUBMITTED',
    to: 'UNDER_EVALUATION',
    roles: ['evaluator'],
    rule: 'An evaluator claims the idea from the evaluation queue.',
  },
  {
    from: 'UNDER_EVALUATION',
    to: 'CHANGES_REQUESTED',
    roles: ['evaluator'],
    rule: 'The evaluator requests clarification from the submitter before scoring.',
  },
  {
    from: 'CHANGES_REQUESTED',
    to: 'SUBMITTED',
    roles: ['user'],
    rule: 'The submitter revises the draft and re-submits for evaluation.',
  },
  {
    from: 'UNDER_EVALUATION',
    to: 'EVALUATED',
    roles: ['evaluator'],
    rule: 'Combines the AI pre-score with an evaluator decision; any override needs a reason.',
  },
  {
    from: 'EVALUATED',
    to: 'LEADERSHIP_REVIEW',
    roles: ['system'],
    rule: 'The system advances the scored idea to the leadership radar queue.',
  },
  {
    from: 'LEADERSHIP_REVIEW',
    to: 'POC_APPROVED',
    roles: ['leadership'],
    rule: 'Leadership approves a candidate for the POC compiler.',
  },
  {
    from: 'LEADERSHIP_REVIEW',
    to: 'DEFERRED',
    roles: ['leadership'],
    rule: 'Placed on hold; non-terminal so leadership can pull it back later.',
  },
  {
    from: 'LEADERSHIP_REVIEW',
    to: 'REJECTED',
    roles: ['leadership'],
    rule: 'Archived with a decision audit entry in the status history.',
  },
  {
    from: 'DEFERRED',
    to: 'LEADERSHIP_REVIEW',
    roles: ['leadership'],
    rule: 'Re-opened by leadership onto the active decision queue.',
  },
  {
    from: 'POC_APPROVED',
    to: 'POC_IN_PROGRESS',
    roles: ['system', 'user', 'evaluator', 'leadership'],
    rule: 'Launches the four-stage background POC chain.',
  },
  {
    from: 'POC_IN_PROGRESS',
    to: 'POC_READY',
    roles: ['system'],
    rule: 'All four artifacts and the interactive prototype are persisted for the run.',
  },
  {
    from: 'POC_IN_PROGRESS',
    to: 'POC_FAILED',
    roles: ['system'],
    rule: 'Records the stage error while preserving earlier artifacts for retry.',
  },
  {
    from: 'POC_FAILED',
    to: 'POC_IN_PROGRESS',
    roles: ['leadership'],
    rule: 'Leadership triggers a non-destructive retry into a fresh run directory.',
  },
];

export const PM_TRANSCRIPT_LINES = [
  {
    line: 2,
    speaker: 'Alex',
    text: 'Task 2 is progressing well. I finished the OAuth token generation and the PR was merged yesterday.',
    tag: 'status_match' as const,
    draftTitle: 'Move KAN-2 toward completion based on merged PR #42',
    jiraKey: 'KAN-2',
    githubEvidence: 'PR #42 merged 2026-11-18T16:45:00Z (commit a1b2c3d)',
    discrepancy: false,
    confidence: 0.94,
    gateOutcome: 'Verified quote + merged PR #42 → queued for PM approval',
  },
  {
    line: 5,
    speaker: 'Alex',
    text: 'Task 1 is completely done on my end! The login API is fully finished and ready for production.',
    tag: 'discrepancy' as const,
    draftTitle: 'DISCREPANCY: Spoken “done” vs. open PR #45 (failing CI)',
    jiraKey: 'KAN-1',
    githubEvidence: 'PR #45 state=open, merged=false (“Still failing CI — 3 unit tests”)',
    discrepancy: true,
    confidence: 0.42,
    gateOutcome: 'Flagged discrepancy_detected=true → held in PM review queue (Jira NOT closed)',
  },
  {
    line: 11,
    speaker: 'Sarah',
    text: 'Agreed. Let us officially decide on 15-minute access tokens with refresh token rotation.',
    tag: 'decision' as const,
    draftTitle: 'Decision: 15-minute access tokens with refresh token rotation',
    jiraKey: 'UNMATCHED',
    githubEvidence: 'Architecture decision logged with a verbatim quote',
    discrepancy: false,
    confidence: 0.98,
    gateOutcome: 'Verified consensus quote → saved as a decision draft',
  },
  {
    line: 13,
    speaker: 'David',
    text: 'I will complete the responsive review dashboard components by tomorrow Friday.',
    tag: 'action_item' as const,
    draftTitle: 'Action item: complete responsive review dashboard (Owner: David, Due: 2026-11-20)',
    jiraKey: 'KAN-2',
    githubEvidence: 'Relative date “tomorrow Friday” resolved against 2026-11-19 → 2026-11-20',
    discrepancy: false,
    confidence: 0.91,
    gateOutcome: 'Resolved owner + YYYY-MM-DD deadline → monitored by the deadline engine',
  },
  {
    line: 16,
    speaker: 'Sarah',
    text: 'Yes, we need API documentation written, but we did not assign who owns it yet. Let us flag that.',
    tag: 'unassigned' as const,
    draftTitle: 'Action item: draft API documentation (Owner: MISSING)',
    jiraKey: 'UNMATCHED',
    githubEvidence: 'Rule 2 enforced: an unstated owner stays MISSING, never guessed',
    discrepancy: false,
    confidence: 0.89,
    gateOutcome: 'Saved with owner="MISSING" for PM assignment',
  },
  {
    line: 19,
    speaker: 'Mark',
    text: 'Hey everyone, quick question. Can we also integrate Apple Pay and cryptocurrency checkout into this sprint?',
    tag: 'scope_creep' as const,
    draftTitle: 'Scope change request: Apple Pay & crypto checkout outside agreed scope',
    jiraKey: 'UNMATCHED',
    githubEvidence: 'Compared against the agreed_scope baseline → flagged outside sprint scope',
    discrepancy: false,
    confidence: 0.97,
    gateOutcome: 'Flagged as a formal scope change for the sponsor and PM queue',
  },
];

export const PM_LIVE_EVAL = {
  provider: 'gemini',
  model: 'gemini-3.5-flash-lite',
  meetingsCount: 4,
  durationSeconds: 10.52,
  metrics: [
    { label: 'Citation coverage', value: 100, detail: '20 / 20 drafts cited verbatim' },
    { label: 'Owner accuracy', value: 100, detail: '6 / 6 assigned owners exact' },
    { label: 'Decision & RAID recall', value: 100, detail: '3 / 3 decisions · 4 / 4 RAID' },
    { label: 'Scope change precision & recall', value: 100, detail: '2 / 2 scope requests caught' },
    { label: 'Action item recall & precision', value: 75, detail: '6 / 8 expected matched' },
    { label: 'Due date accuracy', value: 66.7, detail: '4 / 6 relative dates resolved' },
  ],
  meetings: [
    { title: 'Sprint 14 Sync & Architecture Review', latency: '3.61s', drafts: 8, actionRecall: '66.7%' },
    { title: 'Sprint 15 Planning', latency: '2.65s', drafts: 6, actionRecall: '100%' },
    { title: 'Security Review', latency: '2.33s', drafts: 5, actionRecall: '100%' },
    { title: 'Quick Docs Sync', latency: '1.76s', drafts: 1, actionRecall: '0% (edge case: unassigned doc)' },
  ],
};

export interface EngineeringTradeoff {
  project: string;
  title: string;
  challenge: string;
  decision: string;
  whyAndGuardrail: string;
}

export const ENGINEERING_TRADEOFFS: EngineeringTradeoff[] = [
  {
    project: 'PM Agent',
    title: 'Reconcile spoken status without letting an agent mutate Jira',
    challenge:
      'Engineers describe work informally (“auth is wrapped up”) without ticket keys, and a confident-sounding status can hide an open PR or failing CI.',
    decision:
      'Cross-reference every claim against live Jira and GitHub context, then surface a discrepancy card in a human review queue instead of writing to Jira directly.',
    whyAndGuardrail:
      'A draft without a verified verbatim quote is dropped at the database boundary. PM approval is persisted before any idempotent writeback, so the agent can prepare work but cannot silently change the board.',
  },
  {
    project: 'OpsBuddy AI',
    title: 'Make isolation a retrieval guarantee, not a prompt instruction',
    challenge:
      'Different support domains share vocabulary but not access rules. A single shared index makes cross-domain leakage a prompt-engineering problem instead of a system guarantee.',
    decision:
      'Keep domain-scoped vector collections, enforce identity and scope at both the API and MCP-tool layers, and fuse lexical BM25 ranks with dense retrieval via RRF.',
    whyAndGuardrail:
      'Exact identifiers are still caught by lexical search, paraphrases by embeddings, and every tool call is checked against the caller’s role and domain. Event-driven ingestion uses dead-letter handling so failures stay visible.',
  },
  {
    project: 'Idea Innovator AI',
    title: 'Separate deterministic ranking from generative explanation',
    challenge:
      'LLM-only scoring shifts between runs and is hard for evaluators and leadership to audit or defend.',
    decision:
      'Keep ranking as pure arithmetic and centralize every lifecycle transition in one transition authority. Use the LLM for structured extraction, rubric support, and readable justifications.',
    whyAndGuardrail:
      'Rankings stay reproducible, evaluator overrides require a written reason, and submitted ideas are frozen as immutable snapshots with a complete status history.',
  },
];

export interface SkillCategory {
  id: string;
  label: string;
  items: string[];
  usedIn: ProjectId[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'agents',
    label: 'Generative AI & multi-agent orchestration',
    items: [
      'LangGraph state machines',
      'LangChain',
      'Model Context Protocol (FastMCP / MCP)',
      'AWS Bedrock (Claude Sonnet)',
      'Azure OpenAI (GPT-4o)',
      'Google Gemini (3.5 Flash-Lite)',
      'Strict Pydantic structured outputs',
      'Human-in-the-loop approval workflows',
    ],
    usedIn: ['opsbuddy', 'ideainnovator', 'pmagent'],
  },
  {
    id: 'retrieval',
    label: 'Retrieval, embeddings & vector stores',
    items: [
      'Hybrid retrieval (BM25 + dense)',
      'Reciprocal Rank Fusion (RRF)',
      'Rank fusion and deduplication',
      'Amazon Titan Text Embeddings V2',
      'SentenceTransformers (all-MiniLM-L6-v2)',
      'ChromaDB',
      'S3 Vector storage',
      'Document chunking & ingestion pipelines',
    ],
    usedIn: ['opsbuddy', 'ideainnovator'],
  },
  {
    id: 'backend',
    label: 'Backend, persistence & streaming',
    items: [
      'Python 3.12+ & uv',
      'FastAPI & Starlette ASGI mounts',
      'Server-Sent Events (SSE)',
      'Async & concurrent pipelines',
      'DynamoDB',
      'SQLite (aiosqlite WAL) & SQLModel',
      'Idempotent REST writebacks',
    ],
    usedIn: ['opsbuddy', 'ideainnovator', 'pmagent'],
  },
  {
    id: 'cloud',
    label: 'Cloud, DevOps & enterprise security',
    items: [
      'AWS ECS Fargate',
      'AWS Lambda & EventBridge',
      'SQS dead-letter queues',
      'AWS CodeBuild & ECR',
      'Enterprise SSO (OIDC) & RBAC',
      'Role- and project-scoped access',
      'CloudWatch & Secrets Manager',
    ],
    usedIn: ['opsbuddy', 'ideainnovator', 'pmagent'],
  },
  {
    id: 'frontend',
    label: 'Frontend, evals & quality engineering',
    items: [
      'React 18 / 19 + TypeScript',
      'Vite & Tailwind CSS',
      'Golden-dataset eval harnesses',
      'RAGAS, DeepEval & BERTScore',
      'pytest, Ruff & oxlint',
      'Jira, GitHub & Teams integrations',
    ],
    usedIn: ['opsbuddy', 'ideainnovator', 'pmagent'],
  },
];
