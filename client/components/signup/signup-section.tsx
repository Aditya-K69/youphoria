import { LoginLink } from "./login-link";
import { SignupPanel } from "./signup-panel";
import { VinylPanel } from "./vinyl-panel";
import { TuneInHeading } from "./tune-in-heading";

export function SignupSection() {
  return (
    <section className="min-h-screen bg-[#1f1f1f] p-6 sm:p-10">
      <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] bg-youphoria p-6 pt-20 sm:min-h-[calc(100vh-5rem)] sm:p-10 sm:pt-24">
        <LoginLink />

        <div className="flex h-full flex-col items-center gap-10 sm:flex-row sm:items-stretch sm:gap-0">
          <SignupPanel className="z-20 w-full sm:w-[54%]" />
          <VinylPanel className="z-0 w-full sm:-ml-16 sm:w-[34%]" />
          <TuneInHeading className="z-20 hidden shrink-0 py-6 sm:flex sm:w-[12%]" />
        </div>
      </div>
    </section>
  );
}
