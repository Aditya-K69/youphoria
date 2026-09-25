import Image from "next/image";
import { cn } from "@/lib/utils";

interface CassetteProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Cassette({ className, style }: CassetteProps) {
  return (
    <div
      className={cn("absolute w-[46vw] max-w-[520px] min-w-[220px]", className)}
      style={style}
    >
      <Image
        src="/Cassette.png"
        alt="Cassette tape"
        width={520}
        height={300}
        className="h-auto w-full drop-shadow-2xl"
        priority
      />
    </div>
  );
}
