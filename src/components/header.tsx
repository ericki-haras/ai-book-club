import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-none group">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
            Porto Alegre
          </span>
          <span className="text-lg font-semibold tracking-tight group-hover:opacity-80 transition-opacity">
            AI Book Club
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
<Link
            href="/submit"
            className="nav-submit-btn"
          >
            Submit session
          </Link>
        </nav>
      </div>
      <Separator />
    </header>
  );
}
