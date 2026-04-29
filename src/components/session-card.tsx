import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/lib/sessions";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function SessionCard({ session }: { session: Session }) {
  return (
    <Link href={`/sessions/${session.slug}`} className="group block">
      <Card className="h-full transition-colors" style={{ border: "1px solid color-mix(in oklch, var(--green) 40%, transparent)" }}>
        <CardHeader className="pb-3">
          <div className="mb-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(session.date)}
            </span>
          </div>
          <h3
            className="text-lg font-semibold leading-tight group-hover:underline underline-offset-4"
          >
            {session.title}
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">

          <div className="flex flex-wrap gap-1.5">
            {session.tools.slice(0, 4).map((tool) => (
              <Badge
                key={tool}
                variant="secondary"
                className="text-xs font-normal"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--green) 15%, transparent)",
                  color: "color-mix(in oklch, var(--green) 60%, black)",
                }}
              >
                {tool}
              </Badge>
            ))}
            {session.tools.length > 4 && (
              <Badge
                variant="secondary"
                className="text-xs font-normal"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--green) 15%, transparent)",
                  color: "color-mix(in oklch, var(--green) 60%, black)",
                }}
              >
                +{session.tools.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
