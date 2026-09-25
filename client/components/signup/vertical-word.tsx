import { cn } from "@/lib/utils";

interface VerticalWordProps {
  word: string;
  className?: string;
  /** number of letter-steps to wait before this word starts revealing */
  startAt?: number;
}

export function VerticalWord({
  word,
  className,
  startAt = 0,
}: VerticalWordProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {word.split("").map((letter, i) => (
        <span key={i} className="block overflow-hidden leading-[0.95]">
          <span
            className="animate-letter-drop inline-block font-heading text-6xl text-white sm:text-7xl"
            style={{ animationDelay: `${(startAt + i) * 0.12}s` }}
          >
            {letter}
          </span>
        </span>
      ))}
    </div>
  );
}
