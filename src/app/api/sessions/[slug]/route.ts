import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();

  const session = await prisma.session.update({
    where: { slug },
    data: {
      date: body.date,
      title: body.title,
      recordingFileId: body.recordingFileId ?? "",
      topics: body.topics ?? [],
      learnings: body.learnings ?? "",
      tools: body.tools ?? [],
    },
  });

  revalidatePath("/");
  revalidatePath("/sessions");
  revalidatePath(`/sessions/${slug}`);

  return Response.json({ success: true, session });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const session = await prisma.session.findUnique({ where: { slug } });
  if (!session) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.session.delete({ where: { slug } });

  revalidatePath("/");
  revalidatePath("/sessions");

  return Response.json({ success: true });
}
