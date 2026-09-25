import { CassetteStack } from "./cassette-stack";
import { MarqueeHeading } from "./marquee-heading";
import { HeroHeadline } from "./hero-headline";
import { GetStartedLink } from "./get-started-link";

export function HeroSection() {
  return (
    <section className="min-h-screen bg-[#1f1f1f] p-6 sm:p-10">
      <div className="relative flex min-h-[calc(100vh-3rem)] flex-col justify-between overflow-hidden rounded-[2rem] bg-youphoria sm:min-h-[calc(100vh-5rem)]">
        {/* Background wordmark */}
        <MarqueeHeading />

        {/* Cassette cascade */}
        <div className="relative h-[52vh] w-full sm:h-[60vh]">
          <CassetteStack />
        </div>

        {/* Headline + nav, overlaid on the left */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-full items-center px-6 sm:px-16">
          <div className="pointer-events-auto">
            <HeroHeadline />
          </div>
        </div>

        <GetStartedLink />
      </div>
    </section>
  );
}
