"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Session } from "@/lib/sessions";

export function EditSessionForm({ session }: { session: Session }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    date: session.date,
    title: session.title,
    recordingFileId: session.recordingFileId ?? "",
    topics: session.topics.join("\n"),
    learnings: session.learnings,
    tools: session.tools.join(", "),
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      date: form.date,
      title: form.title,
      recordingFileId: form.recordingFileId.trim(),
      topics: form.topics.split("\n").map((s) => s.trim()).filter(Boolean),
      learnings: form.learnings,
      tools: form.tools.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(`/api/sessions/${session.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error ?? "Something went wrong.");
      } else {
        router.push(`/sessions/${session.slug}`);
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">
      <div className="space-y-1">
        <p
          className="text-xs font-mono tracking-[0.25em] uppercase"
          style={{ color: "var(--green)" }}
        >
          Editing
        </p>
        <h1 className="text-3xl font-semibold">{session.title}</h1>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            required
            max={new Date().toISOString().split("T")[0]}
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Session Title *</Label>
          <Input
            id="title"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recordingFileId">Google Drive File ID</Label>
          <Input
            id="recordingFileId"
            name="recordingFileId"
            value={form.recordingFileId}
            onChange={handleChange}
            placeholder="Paste the file ID from the Drive share URL"
          />
          <p className="text-xs text-muted-foreground">
            From a Drive URL like{" "}
            <span className="font-mono">
              drive.google.com/file/d/[FILE_ID]/view
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topics">Topics Covered</Label>
          <Textarea
            id="topics"
            name="topics"
            rows={4}
            value={form.topics}
            onChange={handleChange}
            placeholder="One topic per line"
          />
          <p className="text-xs text-muted-foreground">One topic per line</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="learnings">Key Learnings</Label>
          <Textarea
            id="learnings"
            name="learnings"
            rows={6}
            value={form.learnings}
            onChange={handleChange}
            placeholder="Summarise the main insights and takeaways..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tools">Tools Mentioned</Label>
          <Input
            id="tools"
            name="tools"
            value={form.tools}
            onChange={handleChange}
            placeholder="Midjourney, Runway ML, Adobe Firefly"
          />
          <p className="text-xs text-muted-foreground">Comma-separated tool names</p>
        </div>

        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

        <div className="flex gap-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save changes"}
          </Button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
