import { addSession, getSessions } from "@/lib/sessions";
import type { Session } from "@/lib/sessions";

export async function POST(request: Request) {
  const body = await request.json();

  const existing = await getSessions();
  const nextNumber =
    existing.length > 0
      ? Math.max(...existing.map((s) => s.sessionNumber)) + 1
      : 1;

  const session: Session = {
    id: String(Date.now()),
    slug: `session-${String(nextNumber).padStart(2, "0")}`,
    sessionNumber: nextNumber,
    date: body.date,
    title: body.title,
    recordingFileId: body.recordingFileId ?? "",
    presenters: body.presenters ?? [],
    topics: body.topics ?? [],
    learnings: body.learnings ?? "",
    tools: body.tools ?? [],
  };

  await addSession(session);

  return Response.json({ success: true, session }, { status: 201 });
}
