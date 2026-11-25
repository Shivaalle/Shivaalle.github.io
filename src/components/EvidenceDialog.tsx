import {
  Certificate,
  Code,
  DownloadSimple,
  Envelope,
  GithubLogo,
  LinkedinLogo,
  ShieldCheck,
  X,
} from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import { PROFILE, PROJECTS } from '../data/portfolioData';
import type { ProjectId } from '../data/portfolioData';

export type DialogMode =
  | { kind: 'closed' }
  | { kind: 'resume' }
  | { kind: 'project'; projectId: ProjectId };

interface EvidenceDialogProps {
  mode: DialogMode;
  onClose: () => void;
}

const RESUME_PATH = '/Shiva-Teja-Alle-Resume.pdf';

export function EvidenceDialog({ mode, onClose }: EvidenceDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (mode.kind === 'closed') {
      if (dialog.open) dialog.close();
      return;
    }

    if (!dialog.open) {
      // showModal() focuses the first control, which can scroll the document
      // to the dialog's DOM position at the end of the page. Keep the reader
      // anchored where they opened it.
      const scrollY = window.scrollY;
      dialog.showModal();
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = scrollY;
      }
    }
  }, [mode]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };
    dialog.addEventListener('close', handleClose);

    let cleanupBackdrop: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      let pressedOutside = false;
      const isOutside = (e: PointerEvent) => {
        const rect = dialog.getBoundingClientRect();
        return (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        );
      };
      const onPointerDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e)) {
          dialog.close();
        }
      };
      dialog.addEventListener('pointerdown', onPointerDown);
      dialog.addEventListener('pointerup', onPointerUp);
      cleanupBackdrop = () => {
        dialog.removeEventListener('pointerdown', onPointerDown);
        dialog.removeEventListener('pointerup', onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupBackdrop?.();
    };
  }, [onClose]);

  const project = mode.kind === 'project' ? PROJECTS[mode.projectId] : null;
  const titleId = 'evidence-dialog-title';

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as Record<string, string>)}
      className="evidence-dialog"
    >
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-6 py-4">
        <div>
          <p className="font-mono text-xs text-[var(--accent-signal)]">
            {mode.kind === 'resume'
              ? 'CREDENTIALS & PROFILE'
              : `${project?.name} · ${project?.evidence.heading.toUpperCase()}`}
          </p>
          <h2 id={titleId} className="font-[var(--font-display)] text-xl font-semibold text-[var(--text-primary)]">
            {mode.kind === 'resume'
              ? PROFILE.name
              : project
                ? `${project.name} — ${project.confidentiality}`
                : 'Portfolio details'}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close modal"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {mode.kind === 'resume' ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[var(--text-primary)]">{PROFILE.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {PROFILE.company} · {PROFILE.tenure} · {PROFILE.location}
                  </p>
                </div>
                <a
                  href={RESUME_PATH}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent-signal)] bg-[var(--accent-signal-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-signal)] transition-colors hover:bg-[var(--accent-signal)] hover:text-[var(--on-accent-signal)]"
                >
                  <DownloadSimple size={14} weight="bold" aria-hidden="true" />
                  Download PDF
                </a>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-signal)]"
                >
                  <Envelope size={14} aria-hidden="true" />
                  {PROFILE.email}
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-signal)]"
                >
                  <GithubLogo size={14} aria-hidden="true" />
                  GitHub
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--accent-signal)]"
                >
                  <LinkedinLogo size={14} aria-hidden="true" />
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{PROFILE.summary}</p>
            </div>

            <div>
              <h3 className="mb-3 font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Featured systems
              </h3>
              <div className="space-y-3">
                {(['opsbuddy', 'ideainnovator', 'pmagent'] as ProjectId[]).map((pid) => {
                  const p = PROJECTS[pid];
                  return (
                    <div
                      key={pid}
                      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-[var(--font-display)] text-base font-semibold text-[var(--text-primary)]">
                          {p.name}
                        </h4>
                        <span className="font-mono text-xs text-[var(--accent-signal)]">{p.role}</span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{p.impact}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Experience
              </h3>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{PROFILE.company}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {PROFILE.title} · {PROFILE.tenure}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[var(--accent-cyan)]">{PROFILE.location}</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  <li>Lead AI engineer on a production multi-agent operations platform (60% lower MTTR, 75% of L1/L2 workflows automated).</li>
                  <li>Built an 8-agent LangGraph innovation workflow with a 12-state lifecycle and a 4-stage POC compiler.</li>
                  <li>Engineered NLP classification across 100K+ records at 92% accuracy for InsightStream AI.</li>
                  <li>Built PM Agent independently: transcript-to-Jira auditing with verbatim citations and a golden eval harness.</li>
                </ul>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
                <h3 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Education
                </h3>
                <p className="mt-2 font-medium text-[var(--text-primary)]">{PROFILE.education.degree}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{PROFILE.education.institution}</p>
                <p className="mt-2 font-mono text-xs text-[var(--accent-signal)]">
                  {PROFILE.education.years} · CGPA {PROFILE.education.cgpa}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
                <h3 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                  Certifications &amp; training
                </h3>
                <ul className="mt-2 space-y-2">
                  {PROFILE.certifications.map((cert) => (
                    <li key={cert.name} className="flex items-start gap-2 text-sm">
                      <Certificate
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-[var(--accent-signal)]"
                      />
                      <div>
                        <span className="font-medium text-[var(--text-primary)]">{cert.name}</span>
                        <p className="text-xs text-[var(--text-secondary)]">{cert.issuer}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : project ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)]">
                <ShieldCheck size={13} weight="bold" aria-hidden="true" className="text-[var(--accent-signal)]" />
                {project.confidentiality}
              </span>
              <span className="font-mono text-[11px] text-[var(--text-secondary)]">{project.role}</span>
            </div>

            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{project.impact}</p>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4">
              <p className="font-mono text-xs font-semibold text-[var(--accent-cyan)]">
                {project.evidence.kind === 'source' ? 'VERIFICATION NOTE' : 'PUBLIC-SAFE SUMMARY'}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">{project.evidence.intro}</p>
            </div>

            <div>
              <h3 className="mb-3 font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                {project.evidence.heading}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {project.evidence.items.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-4"
                  >
                    <div className="flex items-center gap-2 font-mono text-xs text-[var(--accent-cyan)]">
                      {project.evidence.kind === 'source' ? (
                        <Code size={14} weight="bold" aria-hidden="true" />
                      ) : (
                        <ShieldCheck size={14} weight="bold" aria-hidden="true" />
                      )}
                      <span className="truncate">{item.label}</span>
                    </div>
                    <p className="mt-1.5 font-mono text-xs font-medium text-[var(--text-primary)]">{item.title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {project.evidence.snippet ? (
              <div>
                <h3 className="mb-2 font-mono text-xs font-medium text-[var(--text-secondary)]">
                  {project.evidence.snippetTitle}
                </h3>
                <pre className="code-surface overflow-x-auto rounded-xl p-4 font-mono text-xs leading-relaxed">
                  <code>{project.evidence.snippet}</code>
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-6 py-3">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-signal)]"
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
