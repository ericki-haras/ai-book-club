import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionBySlug, getSessions } from "@/lib/sessions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export async function generateStaticParams() {
  const sessions = await getSessions();
  return sessions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/sessions/[slug]">) {
  const { slug } = await props.params;
  const session = await getSessionBySlug(slug);
  if (!session) return {};
  return {
    title: `${session.title} — AI Book Club · Porto Alegre`,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SessionPage(props: PageProps<"/sessions/[slug]">) {
  const { slug } = await props.params;
  const session = await getSessionBySlug(slug);

  if (!session) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      {/* Back */}
      <Link
        href="/sessions"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← All sessions
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <span className="text-xs text-muted-foreground">
          {formatDate(session.date)}
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
          {session.title}
        </h1>
      </header>

      <Separator />

      {/* Recording */}
      <section className="space-y-4">
        <h2
          className="text-xs font-mono tracking-widest uppercase"
          style={{ color: "var(--purple)" }}
        >
          Recording
        </h2>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
          {session.recordingUrl || session.recordingFileId ? (
            <iframe
              src={
                session.recordingUrl ??
                `https://drive.google.com/file/d/${session.recordingFileId}/preview`
              }
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={`Recording of ${session.title}`}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-40"
              >
                <path d="m15 10 4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.89L15 14" />
                <rect x="2" y="6" width="13" height="12" rx="2" />
                <line x1="2" y1="2" x2="22" y2="22" className="opacity-0" />
              </svg>
              <span className="text-sm font-medium opacity-50">No recording added</span>
            </div>
          )}
        </div>
      </section>

      {/* Topics */}
      {session.topics.length > 0 && (
        <section className="space-y-4">
          <h2
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--purple)" }}
          >
            Topics Covered
          </h2>
          <ul className="space-y-2">
            {session.topics.map((topic) => (
              <li key={topic} className="flex gap-3 text-sm leading-relaxed">
                <span
                  className="shrink-0 mt-0.5"
                  style={{ color: "var(--green)" }}
                >
                  →
                </span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Learnings */}
      {session.learnings && (
        <section className="space-y-4">
          <h2
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--purple)" }}
          >
            Key Learnings
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {session.learnings}
          </p>
        </section>
      )}

      {/* Tools */}
      {session.tools.length > 0 && (
        <section className="space-y-4">
          <h2
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--purple)" }}
          >
            Tools Mentioned
          </h2>
          <div className="flex flex-wrap gap-2">
            {session.tools.map((tool) => (
              <Badge
                key={tool}
                variant="secondary"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--green) 15%, transparent)",
                  color: "color-mix(in oklch, var(--green) 60%, black)",
                }}
              >
                {tool}
              </Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
