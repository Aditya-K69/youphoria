import { NavPills } from "./nav-pills";

const words = ["OWN", "STREAM", "JAM", "REPEAT"];

export function HeroHeadline() {
  return (
    <div className="relative z-10 flex max-w-xl flex-col gap-8">
      <h1 className="font-heading text-6xl italic leading-[0.95] text-white sm:text-7xl">
        {words.map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </h1>
      <NavPills />
    </div>
  );
}
