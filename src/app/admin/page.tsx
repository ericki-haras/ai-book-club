"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminPage() {
  const router = useRouter();
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    sessionNumber: "",
    date: "",
    title: "",
    recordingFileId: "",
    presenters: "",
    topics: "",
    learnings: "",
    tools: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey.trim()) {
      setAuthError("Enter the admin key.");
      return;
    }
    setAuthenticated(true);
    setAuthError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    const slug =
      `session-${String(form.sessionNumber).padStart(2, "0")}` +
      (form.title ? `-${slugify(form.title).slice(0, 40)}` : "");

    const payload = {
      sessionNumber: form.sessionNumber,
      date: form.date,
      title: form.title,
      slug,
      recordingFileId: form.recordingFileId.trim(),
      presenters: form.presenters
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      topics: form.topics
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      learnings: form.learnings,
      tools: form.tools
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error ?? "Something went wrong.");
      } else {
        setSuccessMsg(`Session #${form.sessionNumber} saved successfully.`);
        setForm({
          sessionNumber: "",
          date: "",
          title: "",
          recordingFileId: "",
          presenters: "",
          topics: "",
          learnings: "",
          tools: "",
        });
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Enter your admin key to continue.
          </p>
        </div>
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminKey">Admin Key</Label>
            <Input
              id="adminKey"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {authError && <p className="text-sm text-red-500">{authError}</p>}
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">
      <div className="space-y-1">
        <p
          className="text-xs font-mono tracking-[0.25em] uppercase"
          style={{ color: "var(--green)" }}
        >
          Admin
        </p>
        <h1 className="text-3xl font-semibold">Add New Session</h1>
      </div>

      <Separator />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sessionNumber">Session Number *</Label>
            <Input
              id="sessionNumber"
              name="sessionNumber"
              type="number"
              min={1}
              required
              value={form.sessionNumber}
              onChange={handleChange}
              placeholder="e.g. 2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Session Title *</Label>
          <Input
            id="title"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Exploring AI Video Tools"
          />
        </div>

        {/* Recording */}
        <div className="space-y-2">
          <Label htmlFor="recordingFileId">
            Google Drive File ID
          </Label>
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

        {/* People */}
        <div className="space-y-2">
          <Label htmlFor="presenters">Presenters</Label>
          <Input
            id="presenters"
            name="presenters"
            value={form.presenters}
            onChange={handleChange}
            placeholder="Ana Silva, João Costa"
          />
          <p className="text-xs text-muted-foreground">Comma-separated names</p>
        </div>

        {/* Topics */}
        <div className="space-y-2">
          <Label htmlFor="topics">Topics Covered</Label>
          <Textarea
            id="topics"
            name="topics"
            rows={4}
            value={form.topics}
            onChange={handleChange}
            placeholder={"One topic per line:\nMidjourney v7 features\nRunway Gen-3 comparison"}
          />
          <p className="text-xs text-muted-foreground">One topic per line</p>
        </div>

        {/* Learnings */}
        <div className="space-y-2">
          <Label htmlFor="learnings">Key Learnings</Label>
          <Textarea
            id="learnings"
            name="learnings"
            rows={6}
            value={form.learnings}
            onChange={handleChange}
            placeholder="Summarise the main insights and takeaways from this session..."
          />
        </div>

        {/* Tools */}
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

        {successMsg && (
          <p className="text-sm font-medium" style={{ color: "var(--green)" }}>
            {successMsg}
          </p>
        )}
        {errorMsg && (
          <p className="text-sm text-red-500">{errorMsg}</p>
        )}

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Saving…" : "Save Session"}
        </Button>
      </form>
    </div>
  );
}
