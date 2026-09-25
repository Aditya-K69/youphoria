import Image from "next/image";
import { cn } from "@/lib/utils";

interface VinylPanelProps {
  className?: string;
}

export function VinylPanel({ className }: VinylPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-[#E8A93E]",
        className,
      )}
    >
      <div className="animate-vinyl-reveal relative h-full min-h-[280px] w-full">
        <Image
          src="/Vinyl.png"
          alt="Two turntables spinning vinyl records"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
