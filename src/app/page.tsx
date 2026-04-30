import Link from "next/link";
import { getSessions } from "@/lib/sessions";
import { SessionCard } from "@/components/session-card";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RecordingPlaceholder } from "@/components/recording-placeholder";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function HomePage() {
  const sessions = await getSessions();
  const latest = sessions[0];
  const rest = sessions.slice(1, 4);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

      {/* Hero */}
      <section className="space-y-6 max-w-2xl">
        <div className="space-y-1">
          <p
            className="text-xs font-mono tracking-[0.25em] uppercase"
            style={{ color: "var(--green)" }}
          >
            Telus Digital · Porto Alegre
          </p>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-none">
            AI Book Club ✨
          </h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Every week, our team gathers to share discoveries about AI design
          tools — new techniques, experiments, and insights from the frontier of
          generative design.
        </p>
      </section>

      {/* Latest session — expanded */}
      {latest && (
        <section className="space-y-8">
          <h2 className="text-sm font-mono tracking-widest uppercase" style={{ color: "var(--green)" }}>
            Latest Session
          </h2>

          <div
            className="space-y-8"
          >
            {/* Title + date */}
            <div className="flex items-start justify-between gap-4">
              <Link
                href={`/sessions/${latest.slug}`}
                className="text-2xl font-semibold hover:underline underline-offset-4 leading-tight"
              >
                {latest.title}
              </Link>
              <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0 pt-1">
                {formatDate(latest.date)}
              </span>
            </div>

            <Separator />

            {/* Recording */}
            <div className="space-y-4">
              <h3
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: "var(--purple)" }}
              >
                Recording
              </h3>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                {latest.recordingUrl || latest.recordingFileId ? (
                  <iframe
                    src={
                      latest.recordingUrl ??
                      `https://drive.google.com/file/d/${latest.recordingFileId}/preview`
                    }
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title={`Recording of ${latest.title}`}
                  />
                ) : (
                  <RecordingPlaceholder />
                )}
              </div>
            </div>

            {/* Topics */}
            {latest.topics.length > 0 && (
              <div className="space-y-4">
                <h3
                  className="text-xs font-mono tracking-widest uppercase"
                  style={{ color: "var(--purple)" }}
                >
                  Topics Covered
                </h3>
                <ul className="space-y-2">
                  {latest.topics.map((topic) => (
                    <li key={topic} className="flex gap-3 text-sm leading-relaxed">
                      <span className="shrink-0 mt-0.5" style={{ color: "var(--green)" }}>→</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Learnings */}
            {latest.learnings && (
              <div className="space-y-4">
                <h3
                  className="text-xs font-mono tracking-widest uppercase"
                  style={{ color: "var(--purple)" }}
                >
                  Key Learnings
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {latest.learnings}
                </p>
              </div>
            )}

            {/* Tools */}
            {latest.tools.length > 0 && (
              <div className="space-y-4">
                <h3
                  className="text-xs font-mono tracking-widest uppercase"
                  style={{ color: "var(--purple)" }}
                >
                  Tools Mentioned
                </h3>
                <div className="flex flex-wrap gap-2">
                  {latest.tools.map((tool) => (
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
              </div>
            )}
          </div>
        </section>
      )}

      <Separator />

      {/* Previous sessions */}
      {rest.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono tracking-widest uppercase" style={{ color: "var(--green)" }}>
              Previous Sessions
            </h2>
            <Link href="/sessions" className={buttonVariants()}>
              View all sessions
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
