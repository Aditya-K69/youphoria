interface MarqueeLine {
  size: string;
  opacity: string;
  offset: number; // px, how far this line sits from the right edge
  delay: string;
}

const lines: MarqueeLine[] = [
  {
    size: "text-7xl sm:text-8xl",
    opacity: "opacity-100",
    offset: 0,
    delay: "0s",
  },
  {
    size: "text-6xl sm:text-7xl",
    opacity: "opacity-70",
    offset: 40,
    delay: "0.5s",
  },
  {
    size: "text-5xl sm:text-6xl",
    opacity: "opacity-45",
    offset: 96,
    delay: "1s",
  },
  {
    size: "text-4xl sm:text-5xl",
    opacity: "opacity-25",
    offset: 148,
    delay: "1.5s",
  },
];

export function MarqueeHeading() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-6 select-none overflow-hidden">
      <div className="flex flex-col items-end gap-1 pr-2">
        {lines.map((l, i) => (
          <span
            key={i}
            className={`animate-marquee-drift whitespace-nowrap font-heading italic text-white ${l.size} ${l.opacity}`}
            style={
              {
                animationDelay: l.delay,
                "--offset": `${l.offset}px`,
              } as React.CSSProperties
            }
          >
            YOUPHORIA
          </span>
        ))}
      </div>
    </div>
  );
}
