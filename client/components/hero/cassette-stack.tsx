import { Cassette } from "./cassette";

interface CassetteConfig {
  top: string;
  left: string;
  rotate: string;
  amplitude: string;
  zIndex: number;
  delay: string;
}

const cassettes: CassetteConfig[] = [
  {
    top: "2%",
    left: "8%",
    rotate: "-8deg",
    amplitude: "10px",
    zIndex: 10,
    delay: "0s",
  },
  {
    top: "16%",
    left: "26%",
    rotate: "-3deg",
    amplitude: "14px",
    zIndex: 20,
    delay: "0.7s",
  },
  {
    top: "30%",
    left: "44%",
    rotate: "3deg",
    amplitude: "12px",
    zIndex: 30,
    delay: "1.4s",
  },
  {
    top: "44%",
    left: "62%",
    rotate: "9deg",
    amplitude: "16px",
    zIndex: 40,
    delay: "2.1s",
  },
];

export function CassetteStack() {
  return (
    <div className="pointer-events-none relative h-full w-full select-none">
      {cassettes.map((c, i) => (
        <Cassette
          key={i}
          className="animate-cassette-float"
          style={
            {
              top: c.top,
              left: c.left,
              zIndex: c.zIndex,
              animationDelay: c.delay,
              "--rot": c.rotate,
              "--amp": c.amplitude,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
