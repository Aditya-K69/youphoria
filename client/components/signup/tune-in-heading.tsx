import { cn } from "@/lib/utils";
import { VerticalWord } from "./vertical-word";

interface TuneInHeadingProps {
  className?: string;
}

export function TuneInHeading({ className }: TuneInHeadingProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-between", className)}
    >
      <VerticalWord word="TUNE" startAt={0} />
      {/* IN starts revealing after TUNE finishes, plus a short pause */}
      <VerticalWord word="IN" startAt={"TUNE".length + 2} />
    </div>
  );
}
