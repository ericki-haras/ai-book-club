import { getSessions } from "@/lib/sessions";
import { SessionCard } from "@/components/session-card";

export const metadata = {
  title: "Sessions — AI Book Club · Porto Alegre",
};

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-2">
        <p className="text-xs font-mono tracking-[0.25em] uppercase" style={{ color: "var(--green)" }}>
          Archive
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">All Sessions</h1>
        <p className="text-muted-foreground">
          {sessions.length} session{sessions.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      {sessions.length === 0 ? (
        <p className="text-muted-foreground">No sessions yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
