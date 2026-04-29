import { revalidatePath } from "next/cache";
import { addSession, getNextSessionNumber } from "@/lib/sessions";

export async function POST(request: Request) {
  const body = await request.json();

  const sessionNumber = await getNextSessionNumber();

  const session = await addSession({
    slug: `session-${String(sessionNumber).padStart(2, "0")}`,
    sessionNumber,
    date: body.date,
    title: body.title,
    recordingUrl: body.recordingUrl ?? null,
    recordingFileId: body.recordingFileId ?? "",
    topics: body.topics ?? [],
    learnings: body.learnings ?? "",
    tools: body.tools ?? [],
  });

  revalidatePath("/");
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${session.slug}`);

  return Response.json({ success: true, session }, { status: 201 });
}
