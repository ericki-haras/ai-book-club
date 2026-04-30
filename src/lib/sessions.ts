import { prisma } from "@/lib/prisma";

export type Session = {
  id: string;
  slug: string;
  sessionNumber: number;
  date: string;
  title: string;
  /** Full iframe embed URL (YouTube, Loom, etc.) — takes priority over recordingFileId */
  recordingUrl?: string | null;
  /** Google Drive file ID — used when recordingUrl is not set */
  recordingFileId: string;
  topics: string[];
  learnings: string;
  tools: string[];
};

export async function getSessions(): Promise<Session[]> {
  return prisma.session.findMany({
    orderBy: { date: "desc" },
  });
}

export async function getSessionBySlug(slug: string): Promise<Session | null> {
  return prisma.session.findUnique({ where: { slug } });
}

export async function getNextSessionNumber(): Promise<number> {
  const last = await prisma.session.findFirst({
    orderBy: { sessionNumber: "desc" },
  });
  return last ? last.sessionNumber + 1 : 1;
}

export async function addSession(
  session: Omit<Session, "id">
): Promise<Session> {
  return prisma.session.create({ data: session });
}
