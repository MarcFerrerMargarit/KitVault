import { Shirt as ShirtIcon } from "lucide-react";

/** A few floating kit silhouettes drifting behind the hero text. */
const FLOATERS = [
  { color: "#a50044", left: "8%", top: "22%", size: 120, dur: "8s", rot: "-8deg", delay: "0s" },
  { color: "#6cabdd", left: "78%", top: "16%", size: 150, dur: "9.5s", rot: "7deg", delay: "1.2s" },
  { color: "#fde100", left: "84%", top: "58%", size: 110, dur: "7.5s", rot: "12deg", delay: "0.6s" },
  { color: "#c8102e", left: "4%", top: "62%", size: 130, dur: "10s", rot: "-12deg", delay: "1.8s" },
  { color: "#4ade80", left: "60%", top: "70%", size: 90, dur: "8.5s", rot: "6deg", delay: "0.3s" },
];

/**
 * Decorative hero background: pitch lines, a breathing stadium-light glow and
 * floating shirt silhouettes. Purely visual — hidden from assistive tech.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Stadium-light glow */}
      <div className="absolute left-1/2 top-[-120px] h-[460px] w-[860px] animate-glow rounded-full bg-accent/15 blur-[130px]" />

      {/* Pitch markings */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
      >
        {/* outer boundary */}
        <rect x="40" y="40" width="720" height="420" />
        {/* halfway line */}
        <line x1="400" y1="40" x2="400" y2="460" />
        {/* centre circle (slowly rotating) */}
        <g className="animate-spin-slow" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="400" cy="250" r="70" />
          <line x1="400" y1="180" x2="400" y2="320" strokeDasharray="6 10" />
        </g>
        <circle cx="400" cy="250" r="3" fill="white" stroke="none" />
        {/* penalty boxes */}
        <rect x="40" y="150" width="110" height="200" />
        <rect x="650" y="150" width="110" height="200" />
        <rect x="40" y="205" width="45" height="90" />
        <rect x="715" y="205" width="45" height="90" />
      </svg>

      {/* Floating kits */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className="absolute animate-float rounded-[6px] blur-[1px] opacity-25"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size * 1.25,
            background: `linear-gradient(150deg, ${f.color}, transparent 80%)`,
            ["--dur" as string]: f.dur,
            ["--rot" as string]: f.rot,
            animationDelay: f.delay,
          }}
        >
          <ShirtIcon
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20"
            style={{ width: f.size * 0.5, height: f.size * 0.5 }}
            strokeWidth={1}
          />
        </div>
      ))}
    </div>
  );
}
