import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function NavPills() {
  return (
    <nav className="inline-flex items-center gap-1 rounded-full bg-black/25 p-1.5 backdrop-blur-sm">
      {links.map((link, i) => (
        <Button
          key={link.label}
          variant="ghost"
          className={cn(
            "rounded-full px-5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white",
            i === 0 && "bg-white/10 text-white",
          )}
        >
          <a href={link.href}>{link.label}</a>
        </Button>
      ))}
    </nav>
  );
}
