import { cn } from "@/lib/utils";

interface LoginLinkProps {
  className?: string;
}

export function LoginLink({ className }: LoginLinkProps) {
  return (
    <a
      href="/login"
      className={cn(
        "absolute right-6 top-6 z-30 font-heading text-sm italic text-white underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80 sm:right-10 sm:top-8 sm:text-base",
        className,
      )}
    >
      Already a Member ? Click to Login
    </a>
  );
}
