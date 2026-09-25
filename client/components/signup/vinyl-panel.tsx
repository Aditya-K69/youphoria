import Image from "next/image";
import { cn } from "@/lib/utils";

interface VinylPanelProps {
  className?: string;
}

export function VinylPanel({ className }: VinylPanelProps) {
  return (
    <div className={cn(className)}>
      <div className="animate-vinyl-reveal relative h-full min-h-70 w-full">
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
