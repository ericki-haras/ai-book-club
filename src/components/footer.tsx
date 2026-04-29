import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-24">
      <Separator />
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>AI Book Club · Porto Alegre · website by Ericki Gutierrez</p>
        <p>A weekly meeting to share AI design tool discoveries</p>
      </div>
    </footer>
  );
}
