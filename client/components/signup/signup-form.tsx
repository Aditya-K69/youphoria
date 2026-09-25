import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fieldClasses =
  "rounded-none border-0 border-b border-white/20 bg-transparent px-0 py-2 text-white placeholder:text-white/30 focus-visible:border-white focus-visible:ring-0 focus-visible:ring-offset-0";

const labelClasses = "text-xs uppercase tracking-[0.2em] text-white/60";

export function SignupForm() {
  return (
    <form className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username" className={labelClasses}>
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="saulgoodman69"
          className={fieldClasses}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className={labelClasses}>
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          className={fieldClasses}
        />
      </div>

      <Button
        type="submit"
        className="mt-4 rounded-full bg-[#E8A93E] font-heading text-base italic text-[#2E1D00] hover:bg-[#f0ba5c]"
      >
        Sign Up
      </Button>
    </form>
  );
}
