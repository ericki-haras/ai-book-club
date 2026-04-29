import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function upsertSession(session) {
  await sql`
    INSERT INTO "Session" (id, slug, "sessionNumber", date, title, "recordingUrl", "recordingFileId", topics, learnings, tools, "createdAt")
    VALUES (
      ${session.id},
      ${session.slug},
      ${session.sessionNumber},
      ${session.date},
      ${session.title},
      ${session.recordingUrl ?? null},
      ${session.recordingFileId ?? ""},
      ${session.topics},
      ${session.learnings ?? ""},
      ${session.tools},
      NOW()
    )
    ON CONFLICT (slug) DO NOTHING
  `;
}

await upsertSession({
  id: "seed-1",
  slug: "session-01",
  sessionNumber: 1,
  date: "2025-04-22",
  title: "Kickoff — AI Tools Landscape",
  recordingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  recordingFileId: "",
  topics: [
    "Overview of the AI design tools ecosystem",
    "Midjourney v6 image generation techniques",
    "Adobe Firefly vs. Generative Fill comparison",
  ],
  learnings:
    "The group aligned on a shared vocabulary for discussing generative AI tools. Key insight: Firefly's strength is in non-destructive, context-aware edits within existing workflows, while Midjourney excels at creative exploration from scratch. Both serve different phases of the design process.",
  tools: ["Midjourney", "Adobe Firefly", "Runway ML"],
});

await upsertSession({
  id: "seed-2",
  slug: "session-02",
  sessionNumber: 2,
  date: "2026-04-29",
  title: "Test 2",
  recordingFileId: "",
  topics: [
    "Ericki: Storybook; Claude design",
    "Carlo: Claude design prototyping",
    "Vagner: Claude design prototyping",
  ],
  learnings: "Lorem ipsum dolor sit amet",
  tools: ["Claude Design", "Storybook", "Claude Code."],
});

console.log("Seeded 2 sessions.");
