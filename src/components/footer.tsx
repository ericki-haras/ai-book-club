import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-24">
      <Separator />
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>AI Book Club · Porto Alegre</p>
        <p>A weekly design AI discoveries meeting</p>
      </div>
    </footer>
  );
}
