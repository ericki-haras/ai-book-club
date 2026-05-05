// ============================================================
// AI Book Club — Google Apps Script Automation
// ============================================================
// Watches your Gmail for AI Book Club meeting summary emails,
// parses them (translating from Portuguese to English), and
// automatically creates new sessions on the website.
//
// SETUP:
//   1. Go to script.google.com → New project → paste this file
//   2. Extensions → Apps Script → Project Settings → Script Properties → Add:
//        ADMIN_KEY  →  (copy from your .env file)
//   3. Run syncBookClub() once manually to grant Gmail permissions
//   4. Triggers (clock icon) → Add Trigger:
//        Function: syncBookClub | Event: Time-driven | Day timer | 6pm–7pm
// ============================================================

const WEBSITE_URL = "https://ai-book-club-lake.vercel.app";
const GMAIL_SEARCH = 'subject:"AI Book Club - Design POA"';

// Known AI tools to detect in the meeting content
const AI_TOOLS = [
  "ChatGPT", "GPT-4", "GPT-4o", "GPT-3.5", "GPT-3", "OpenAI", "o1", "o3",
  "Claude", "Anthropic",
  "Gemini", "Google AI", "NotebookLM", "Bard",
  "Perplexity",
  "Copilot", "GitHub Copilot", "Microsoft Copilot",
  "Midjourney",
  "DALL-E", "DALL·E",
  "Stable Diffusion",
  "Llama", "LLaMA", "Meta AI",
  "Mistral",
  "Grok",
  "Runway",
  "Sora",
  "Hugging Face", "HuggingFace",
  "LangChain",
  "AutoGPT",
  "CrewAI",
  "n8n",
  "Zapier",
  "Cursor",
  "Replit",
  "Windsurf",
  "Bolt",
  "Lovable",
  "v0",
  "ElevenLabs",
  "Whisper",
  "Groq",
  "Ollama",
  "Adobe Firefly",
  "Ideogram",
  "Flux",
  "Leonardo",
  "Kling",
  "Pika",
  "Devin",
  "Aider",
];

// ============================================================
// Main entry point — run this on a schedule
// ============================================================
function syncBookClub() {
  const props = PropertiesService.getScriptProperties();
  const adminKey = props.getProperty("ADMIN_KEY");

  if (!adminKey) {
    Logger.log("ERROR: ADMIN_KEY not set in Script Properties.");
    return;
  }

  const processedIds = JSON.parse(props.getProperty("PROCESSED_IDS") || "[]");
  const threads = GmailApp.search(GMAIL_SEARCH);

  for (const thread of threads) {
    for (const message of thread.getMessages()) {
      const id = message.getId();
      if (processedIds.includes(id)) continue;

      try {
        const payload = buildSessionPayload(message);
        if (!payload) {
          Logger.log("Could not parse message " + id + " — skipping.");
          continue;
        }

        Logger.log("Creating session: " + payload.title + " (" + payload.date + ")");

        const response = UrlFetchApp.fetch(WEBSITE_URL + "/api/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + adminKey,
          },
          payload: JSON.stringify(payload),
          muteHttpExceptions: true,
        });

        const code = response.getResponseCode();
        if (code === 201) {
          processedIds.push(id);
          props.setProperty("PROCESSED_IDS", JSON.stringify(processedIds));
          Logger.log("Session created successfully.");
        } else {
          Logger.log("API returned " + code + ": " + response.getContentText());
        }
      } catch (e) {
        Logger.log("Error on message " + id + ": " + e.message);
      }
    }
  }
}

// ============================================================
// Build the session payload from a Gmail message
// ============================================================
function buildSessionPayload(message) {
  const body = message.getPlainBody();
  const html = message.getBody();
  const receivedDate = message.getDate();

  // Extract Portuguese sections
  const resumoPT = extractFirstParagraph(body, "Resumo");
  const topicHeadersPT = extractTopicHeaders(body);
  const nextStepsPT = extractSection(body, "Próximas etapas", "Detalhes");

  if (!resumoPT && topicHeadersPT.length === 0) return null;

  // Translate everything to English
  const resumoEN = translate(resumoPT);
  const nextStepsEN = translate(nextStepsPT);
  const topicsEN = topicHeadersPT.map(translate);

  // Build title from the first sentence of the summary
  const title = resumoEN.split(".")[0].trim();

  // Combine summary + next steps into learnings
  const parts = [];
  if (resumoEN) parts.push(resumoEN);
  if (nextStepsEN) parts.push("Next steps:\n" + nextStepsEN);
  const learnings = parts.join("\n\n");

  // Detect AI tools in all translated text
  const allText = [title, learnings, ...topicsEN].join(" ");
  const tools = findAITools(allText);

  // Extract recording Drive file ID from email HTML
  const recordingFileId = extractDriveFileId(html);

  // Format date as YYYY-MM-DD
  const date = Utilities.formatDate(receivedDate, "America/Sao_Paulo", "yyyy-MM-dd");

  return {
    date,
    title,
    topics: topicsEN,
    learnings,
    tools,
    recordingFileId,
  };
}

// ============================================================
// Parsing helpers
// ============================================================

// Returns the first paragraph after a section marker (e.g. the summary text after "Resumo")
function extractFirstParagraph(body, marker) {
  const idx = body.indexOf("\n" + marker + "\n");
  if (idx === -1) return "";
  const after = body.substring(idx + marker.length + 2);
  const paraEnd = after.indexOf("\n\n");
  return (paraEnd === -1 ? after : after.substring(0, paraEnd)).trim();
}

// Returns the text between two section markers
function extractSection(body, startMarker, endMarker) {
  const startIdx = body.indexOf("\n" + startMarker + "\n");
  if (startIdx === -1) return "";
  const after = body.substring(startIdx + startMarker.length + 2);
  const endIdx = endMarker ? after.indexOf("\n" + endMarker + "\n") : -1;
  return (endIdx === -1 ? after : after.substring(0, endIdx)).trim();
}

// Extracts the bold section header titles between "Resumo" and "Próximas etapas"
// Each block separated by a double newline; the first line of each block is the header
function extractTopicHeaders(body) {
  const startMarker = "\nResumo\n";
  const endMarker = "\nPróximas etapas\n";

  const startIdx = body.indexOf(startMarker);
  const endIdx = body.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) return [];

  const section = body.substring(startIdx + startMarker.length, endIdx);
  const blocks = section.split("\n\n").map((b) => b.trim()).filter(Boolean);

  // The first block is the summary paragraph — skip it, take the rest
  return blocks
    .slice(1)
    .map((block) => block.split("\n")[0].trim())
    .filter(Boolean);
}

// Finds a Google Drive video file ID from email HTML
function extractDriveFileId(html) {
  const match = html.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
}

// Scans text for known AI tool names (case-insensitive)
function findAITools(text) {
  const lower = text.toLowerCase();
  return AI_TOOLS.filter((tool) => lower.includes(tool.toLowerCase()));
}

// Translates Portuguese text to English using Google Translate (free, built-in)
function translate(text) {
  if (!text) return "";
  try {
    return LanguageApp.translate(text, "pt", "en");
  } catch (e) {
    Logger.log("Translation failed: " + e.message);
    return text;
  }
}
