import { cn } from "@/lib/utils";
import { SignupForm } from "./signup-form";

interface SignupPanelProps {
  className?: string;
}

export function SignupPanel({ className }: SignupPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-10 rounded-3xl bg-[#1C1916] px-8 py-10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] sm:px-14 sm:py-14",
        className,
      )}
    >
      <h1 className="font-heading text-4xl tracking-wide text-white sm:text-5xl">
        SIGN-UP
      </h1>
      <SignupForm />
    </div>
  );
}
