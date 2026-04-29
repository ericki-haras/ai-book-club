import { promises as fs } from "fs";
import path from "path";

export type Session = {
  id: string;
  slug: string;
  sessionNumber: number;
  date: string;
  title: string;
  /** Full iframe embed URL (YouTube, Loom, etc.) — takes priority over recordingFileId */
  recordingUrl?: string;
  /** Google Drive file ID — used when recordingUrl is not set */
  recordingFileId: string;
  presenters: string[];
  topics: string[];
  learnings: string;
  tools: string[];
};

const dataPath = path.join(process.cwd(), "src/data/sessions.json");

export async function getSessions(): Promise<Session[]> {
  const raw = await fs.readFile(dataPath, "utf-8");
  const sessions: Session[] = JSON.parse(raw);
  return sessions.sort((a, b) => b.sessionNumber - a.sessionNumber);
}

export async function getSessionBySlug(slug: string): Promise<Session | null> {
  const sessions = await getSessions();
  return sessions.find((s) => s.slug === slug) ?? null;
}

export async function addSession(session: Session): Promise<void> {
  const sessions = await getSessions();
  sessions.push(session);
  sessions.sort((a, b) => a.sessionNumber - b.sessionNumber);
  await fs.writeFile(dataPath, JSON.stringify(sessions, null, 2), "utf-8");
}
