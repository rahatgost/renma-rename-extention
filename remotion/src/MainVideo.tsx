import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

const fraunces = loadFraunces("normal", { weights: ["400", "600"], subsets: ["latin"] });
const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const jbm = loadJetBrains("normal", { weights: ["400", "500"], subsets: ["latin"] });

const FRAUNCES = fraunces.fontFamily;
const INTER = inter.fontFamily;
const MONO = jbm.fontFamily;

const INK = "#141413";
const CANVAS = "#faf9f5";
const CORAL = "#cc785c";
const CORAL_DEEP = "#a9583e";
const DARK = "#181715";
const DARK_ELEV = "#252320";
const ON_DARK_SOFT = "#a09d96";
const HAIRLINE = "rgba(250,249,245,0.08)";

// scene durations (30fps)
const S1 = 150;   // opening
const S2 = 180;   // problem
const S3 = 210;   // overview
const S4 = 540;   // journey
const S5 = 420;   // features
const S6 = 240;   // cta
const T = 20;     // transition frames
export const DURATION = S1 + S2 + S3 + S4 + S5 + S6 - T * 5;

// ---------- shared bits ----------
const CoralGlow: React.FC<{ intensity?: number; x?: string; y?: string }> = ({
  intensity = 0.5,
  x = "50%",
  y = "45%",
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(60% 55% at ${x} ${y}, rgba(204,120,92,${intensity}), transparent 70%), radial-gradient(40% 40% at 50% 100%, rgba(204,120,92,${intensity * 0.4}), transparent 70%)`,
    }}
  />
);

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.06,
      backgroundImage:
        "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
      backgroundSize: "64px 64px",
      maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
      WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
    }}
  />
);

const Wordmark: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = CANVAS }) => (
  <span
    style={{
      fontFamily: FRAUNCES,
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: size,
      letterSpacing: "-0.04em",
      color,
      lineHeight: 1,
    }}
  >
    renma<span style={{ color: CORAL }}>.</span>
  </span>
);

// ---------- Scene 1: Opening ----------
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inSpring = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 90 } });
  const opacity = interpolate(frame, [0, 20, S1 - 25, S1 - 5], [0, 1, 1, 0]);
  const scale = interpolate(inSpring, [0, 1], [0.92, 1]);
  const tagOpacity = interpolate(frame, [30, 55, S1 - 30, S1 - 10], [0, 1, 1, 0]);
  const tagY = interpolate(frame, [30, 55], [12, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK }}>
      <CoralGlow intensity={0.35} />
      <Grid />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          opacity,
        }}
      >
        <div style={{ transform: `scale(${scale})` }}>
          <Wordmark size={220} />
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontWeight: 400,
            fontSize: 28,
            color: ON_DARK_SOFT,
            marginTop: 32,
            letterSpacing: "-0.01em",
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
          }}
        >
          Rename downloads before Chrome finishes writing them.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Scene 2: Problem ----------
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const files = [
    "image (17).png",
    "download.png",
    "unnamed (4).png",
    "image (18).png",
    "screenshot.png",
    "image (19).png",
  ];
  const headerOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 20], [16, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: "center", justifyContent: "center" }}>
      <CoralGlow intensity={0.2} y="60%" />
      <div style={{ maxWidth: 1400, width: "100%", padding: "0 80px" }}>
        <div
          style={{
            fontFamily: INTER,
            fontSize: 20,
            color: CORAL,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
            opacity: headerOp,
            transform: `translateY(${headerY}px)`,
          }}
        >
          The problem
        </div>
        <div
          style={{
            fontFamily: FRAUNCES,
            fontWeight: 400,
            fontSize: 84,
            color: CANVAS,
            marginTop: 20,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 1100,
            opacity: headerOp,
            transform: `translateY(${headerY}px)`,
          }}
        >
          Your downloads folder is a graveyard of{" "}
          <span style={{ fontStyle: "italic", color: CORAL }}>image (17).png</span>
        </div>

        <div
          style={{
            marginTop: 64,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {files.map((f, i) => {
            const start = 30 + i * 6;
            const op = interpolate(frame, [start, start + 20], [0, 1], { extrapolateRight: "clamp" });
            const y = interpolate(frame, [start, start + 20], [20, 0], { extrapolateRight: "clamp" });
            return (
              <div
                key={f}
                style={{
                  background: DARK_ELEV,
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 12,
                  padding: "22px 24px",
                  fontFamily: MONO,
                  fontSize: 22,
                  color: ON_DARK_SOFT,
                  opacity: op,
                  transform: `translateY(${y}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(204,120,92,0.15)",
                    borderRadius: 6,
                    color: CORAL,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 16,
                    fontFamily: INTER,
                    fontWeight: 600,
                  }}
                >
                  IMG
                </div>
                {f}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 3: Product Overview (extension popup) ----------
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 5, fps, config: { damping: 22, stiffness: 100 } });
  const scale = interpolate(enter, [0, 1], [0.9, 1]);
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const capOp = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });

  const items = [
    { orig: "image (17).png", newName: "AI_Generated_2026-07-23_14-22.png", dom: "chatgpt.com" },
    { orig: "photo.jpg", newName: "unsplash_2026-07-23_14-21.jpg", dom: "unsplash.com" },
    { orig: "download.png", newName: "github_2026-07-23_14-19.png", dom: "github.com" },
  ];

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: "center", justifyContent: "center" }}>
      <CoralGlow intensity={0.28} />
      <Grid />
      <div style={{ display: "flex", gap: 64, alignItems: "center", opacity }}>
        <div style={{ maxWidth: 520 }}>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 18,
              color: CORAL,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Meet Renma
          </div>
          <div
            style={{
              fontFamily: FRAUNCES,
              fontSize: 68,
              color: CANVAS,
              lineHeight: 1.05,
              marginTop: 16,
              letterSpacing: "-0.02em",
            }}
          >
            A Chrome extension that <span style={{ fontStyle: "italic", color: CORAL }}>renames every image</span> the moment you save it.
          </div>
          <div
            style={{
              fontFamily: INTER,
              fontSize: 22,
              color: ON_DARK_SOFT,
              marginTop: 24,
              lineHeight: 1.5,
              opacity: capOp,
            }}
          >
            Source-aware. Fully local. Zero-latency.
          </div>
        </div>

        {/* popup mockup */}
        <div
          style={{
            width: 460,
            background: "#1f1e1b",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 20,
            padding: 24,
            boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7)",
            transform: `scale(${scale})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: CORAL,
                display: "grid",
                placeItems: "center",
                color: CANVAS,
                fontFamily: FRAUNCES,
                fontStyle: "italic",
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              r
            </div>
            <div style={{ fontFamily: FRAUNCES, fontStyle: "italic", fontWeight: 600, color: CANVAS, fontSize: 22 }}>
              renma<span style={{ color: CORAL }}>.</span>
            </div>
            <div style={{ marginLeft: "auto", fontFamily: INTER, fontSize: 12, color: ON_DARK_SOFT, textTransform: "uppercase", letterSpacing: "0.14em" }}>
              Recent
            </div>
          </div>

          {items.map((it, i) => {
            const start = 25 + i * 15;
            const op = interpolate(frame, [start, start + 18], [0, 1], { extrapolateRight: "clamp" });
            const y = interpolate(frame, [start, start + 18], [12, 0], { extrapolateRight: "clamp" });
            return (
              <div
                key={i}
                style={{
                  padding: "14px 0",
                  borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}`,
                  opacity: op,
                  transform: `translateY(${y}px)`,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 14, color: ON_DARK_SOFT, textDecoration: "line-through" }}>
                  {it.orig}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 15, color: CANVAS, marginTop: 4 }}>
                  {it.newName}
                </div>
                <div style={{ fontFamily: INTER, fontSize: 12, color: CORAL, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.14em" }}>
                  {it.dom}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 4: User Journey ----------
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline within scene (S4 = 540 frames = 18s)
  // 0-90: browser + right-click image
  // 90-210: rename appears
  // 210-360: folder auto-organized
  // 360-540: final resolved

  const stepOpacity = (start: number, end: number) =>
    interpolate(frame, [start, start + 15, end - 15, end], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK }}>
      <CoralGlow intensity={0.22} y="30%" />
      <Grid />

      {/* Step label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          fontFamily: INTER,
          fontSize: 16,
          color: CORAL,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        The Journey
      </div>

      {/* Step 1: Browser download */}
      <Sequence from={0} durationInFrames={200}>
        <StepDownload frame={frame} />
      </Sequence>

      {/* Step 2: Rename in-flight */}
      <Sequence from={180} durationInFrames={180}>
        <StepRename frame={frame - 180} />
      </Sequence>

      {/* Step 3: Organized folder */}
      <Sequence from={340} durationInFrames={200}>
        <StepFolder frame={frame - 340} />
      </Sequence>
    </AbsoluteFill>
  );
};

const BrowserChrome: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => (
  <div
    style={{
      width: 1200,
      background: DARK_ELEV,
      borderRadius: 16,
      overflow: "hidden",
      border: `1px solid ${HAIRLINE}`,
      boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: `1px solid ${HAIRLINE}` }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f57" }} />
      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#febc2e" }} />
      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28c840" }} />
      <div
        style={{
          marginLeft: 20,
          flex: 1,
          background: DARK,
          borderRadius: 8,
          padding: "8px 14px",
          fontFamily: MONO,
          fontSize: 14,
          color: ON_DARK_SOFT,
        }}
      >
        {url}
      </div>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: CORAL,
          display: "grid",
          placeItems: "center",
          fontFamily: FRAUNCES,
          fontStyle: "italic",
          fontWeight: 600,
          color: CANVAS,
          fontSize: 16,
        }}
      >
        r
      </div>
    </div>
    <div style={{ padding: 24 }}>{children}</div>
  </div>
);

const StepDownload: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [0, 20, 180, 200], [0, 1, 1, 0]);
  const menuOp = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const menuY = interpolate(frame, [50, 70], [10, 0], { extrapolateRight: "clamp" });
  const clickScale = interpolate(frame, [110, 120, 130], [1, 0.94, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
      <BrowserChrome url="chatgpt.com/c/image-generation">
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div
            style={{
              width: 420,
              height: 420,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DEEP}, #6b3a2a)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, fontFamily: MONO, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
              generated · 1024×1024
            </div>
          </div>
          <div style={{ flex: 1, paddingTop: 8 }}>
            <div style={{ fontFamily: INTER, fontSize: 22, color: CANVAS, fontWeight: 500 }}>
              Save the image?
            </div>
            <div style={{ fontFamily: INTER, fontSize: 16, color: ON_DARK_SOFT, marginTop: 8, lineHeight: 1.5 }}>
              Chrome wants to name it{" "}
              <code style={{ fontFamily: MONO, color: CORAL }}>image (17).png</code>
            </div>

            {/* context menu */}
            <div
              style={{
                marginTop: 24,
                background: DARK,
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 10,
                padding: 8,
                width: 260,
                opacity: menuOp,
                transform: `translateY(${menuY}px) scale(${clickScale})`,
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
            >
              {["Open image in new tab", "Copy image address", "Save image as…"].map((t, i) => (
                <div
                  key={t}
                  style={{
                    padding: "10px 14px",
                    fontFamily: INTER,
                    fontSize: 15,
                    color: i === 2 ? CANVAS : ON_DARK_SOFT,
                    background: i === 2 && frame > 100 ? "rgba(204,120,92,0.2)" : "transparent",
                    borderRadius: 6,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </BrowserChrome>

      {/* cursor */}
      <div
        style={{
          position: "absolute",
          top: `calc(50% + ${interpolate(frame, [0, 100], [-60, 60])}px)`,
          left: `calc(50% + ${interpolate(frame, [0, 100], [-100, 130])}px)`,
          fontSize: 32,
          transform: "rotate(-15deg)",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))",
        }}
      >
        ▲
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: INTER,
          fontSize: 22,
          color: CANVAS,
          opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        1. You save an image — nothing changes in your workflow.
      </div>
    </AbsoluteFill>
  );
};

const StepRename: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [0, 20, 160, 180], [0, 1, 1, 0]);
  const oldOp = interpolate(frame, [40, 60], [1, 0.3], { extrapolateRight: "clamp" });
  const arrowOp = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: "clamp" });
  const newOp = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  const newY = interpolate(frame, [70, 100], [16, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op, flexDirection: "column" }}>
      <div
        style={{
          fontFamily: INTER,
          fontSize: 22,
          color: CANVAS,
          marginBottom: 40,
        }}
      >
        2. Renma intercepts before Chrome writes to disk.
      </div>

      <div
        style={{
          width: 1100,
          background: DARK_ELEV,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 20,
          padding: 48,
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32, justifyContent: "space-between" }}>
          <div style={{ flex: 1, opacity: oldOp }}>
            <div style={{ fontFamily: INTER, fontSize: 12, color: ON_DARK_SOFT, textTransform: "uppercase", letterSpacing: "0.18em" }}>
              Chrome default
            </div>
            <div style={{ fontFamily: MONO, fontSize: 28, color: CANVAS, marginTop: 12, textDecoration: frame > 60 ? "line-through" : "none" }}>
              image (17).png
            </div>
          </div>

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: CORAL,
              display: "grid",
              placeItems: "center",
              color: CANVAS,
              fontSize: 32,
              fontFamily: INTER,
              opacity: arrowOp,
              transform: `scale(${arrowOp})`,
            }}
          >
            →
          </div>

          <div style={{ flex: 1.4, opacity: newOp, transform: `translateY(${newY}px)` }}>
            <div style={{ fontFamily: INTER, fontSize: 12, color: CORAL, textTransform: "uppercase", letterSpacing: "0.18em" }}>
              Renma
            </div>
            <div style={{ fontFamily: MONO, fontSize: 28, color: CANVAS, marginTop: 12 }}>
              AI_Generated_2026-07-23_14-22.png
            </div>
            <div style={{ fontFamily: INTER, fontSize: 14, color: ON_DARK_SOFT, marginTop: 12 }}>
              Source detected: <span style={{ color: CORAL }}>chatgpt.com</span> · applied rule: AI templates
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const StepFolder: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [0, 20, 180, 200], [0, 1, 1, 0]);

  const rows = [
    { folder: "AI_Generated/", file: "AI_Generated_2026-07-23_14-22.png", tag: "chatgpt" },
    { folder: "unsplash/",     file: "unsplash_2026-07-23_14-21.jpg", tag: "unsplash" },
    { folder: "github/",       file: "github_2026-07-23_14-19.png", tag: "github" },
    { folder: "AI_Generated/", file: "AI_Generated_2026-07-23_14-17.png", tag: "openai" },
    { folder: "figma/",        file: "figma_2026-07-23_14-15.png", tag: "figma" },
  ];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op, flexDirection: "column" }}>
      <div
        style={{
          fontFamily: INTER,
          fontSize: 22,
          color: CANVAS,
          marginBottom: 32,
        }}
      >
        3. Everything lands in the right folder, automatically.
      </div>
      <div
        style={{
          width: 1100,
          background: DARK_ELEV,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${HAIRLINE}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 20, height: 16, background: CORAL, borderRadius: 3 }} />
          <div style={{ fontFamily: MONO, fontSize: 15, color: ON_DARK_SOFT }}>
            ~/Downloads
          </div>
        </div>
        {rows.map((r, i) => {
          const start = 20 + i * 18;
          const rop = interpolate(frame, [start, start + 20], [0, 1], { extrapolateRight: "clamp" });
          const ry = interpolate(frame, [start, start + 20], [16, 0], { extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                padding: "16px 24px",
                borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}`,
                opacity: rop,
                transform: `translateY(${ry}px)`,
              }}
            >
              <div style={{ width: 22, height: 18, background: "rgba(204,120,92,0.25)", borderRadius: 3, border: `1px solid ${CORAL}` }} />
              <div style={{ fontFamily: MONO, fontSize: 17, color: CANVAS, width: 200 }}>{r.folder}</div>
              <div style={{ fontFamily: MONO, fontSize: 17, color: ON_DARK_SOFT, flex: 1 }}>{r.file}</div>
              <div
                style={{
                  fontFamily: INTER,
                  fontSize: 11,
                  color: CORAL,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(204,120,92,0.14)",
                }}
              >
                {r.tag}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Scene 5: Features ----------
const FEATURES = [
  {
    label: "Source-aware templates",
    body: "Every domain gets its own naming rule — {domain}, {date}, {dimensions}, and more.",
    demo: (
      <div style={{ fontFamily: MONO, fontSize: 22, color: CANVAS, lineHeight: 1.8 }}>
        <div><span style={{ color: CORAL }}>chatgpt.com</span> → AI_Generated_{"{date}"}.png</div>
        <div><span style={{ color: CORAL }}>unsplash.com</span> → {"{domain}"}_{"{width}"}x{"{height}"}.jpg</div>
        <div><span style={{ color: CORAL }}>github.com</span> → gh_{"{date}"}_{"{time}"}.png</div>
      </div>
    ),
  },
  {
    label: "Auto-routed folders",
    body: "Renma drops each file into a folder that already makes sense.",
    demo: (
      <div style={{ fontFamily: MONO, fontSize: 22, color: CANVAS, lineHeight: 1.8 }}>
        <div>~/Downloads/<span style={{ color: CORAL }}>AI_Generated/</span></div>
        <div>~/Downloads/<span style={{ color: CORAL }}>unsplash/</span></div>
        <div>~/Downloads/<span style={{ color: CORAL }}>figma/</span></div>
      </div>
    ),
  },
  {
    label: "Undo · duplicates · stats",
    body: "One-click undo, duplicate detection, and a live dashboard of every renamed file.",
    demo: (
      <div style={{ display: "flex", gap: 20 }}>
        {[
          { n: "1,284", l: "Renamed" },
          { n: "63", l: "Duplicates skipped" },
          { n: "42", l: "Domains" },
        ].map((s) => (
          <div key={s.l} style={{ padding: 24, background: DARK, border: `1px solid ${HAIRLINE}`, borderRadius: 12, flex: 1 }}>
            <div style={{ fontFamily: FRAUNCES, fontSize: 48, color: CORAL }}>{s.n}</div>
            <div style={{ fontFamily: INTER, fontSize: 14, color: ON_DARK_SOFT, marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>
    ),
  },
];

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const perFeature = Math.floor(S5 / FEATURES.length);

  return (
    <AbsoluteFill style={{ background: DARK }}>
      <CoralGlow intensity={0.2} />
      <Grid />
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          fontFamily: INTER,
          fontSize: 16,
          color: CORAL,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        What's inside
      </div>

      {FEATURES.map((f, i) => {
        const start = i * perFeature;
        const end = start + perFeature;
        const op = interpolate(
          frame,
          [start, start + 15, end - 15, end],
          [0, 1, 1, 0],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );
        const y = interpolate(frame, [start, start + 20], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        if (frame < start - 5 || frame > end + 5) return null;

        return (
          <AbsoluteFill
            key={i}
            style={{
              alignItems: "center",
              justifyContent: "center",
              opacity: op,
              transform: `translateY(${y}px)`,
              flexDirection: "column",
              padding: "0 120px",
            }}
          >
            <div style={{ fontFamily: INTER, fontSize: 18, color: ON_DARK_SOFT, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>
              0{i + 1} — Feature
            </div>
            <div
              style={{
                fontFamily: FRAUNCES,
                fontSize: 72,
                color: CANVAS,
                letterSpacing: "-0.02em",
                textAlign: "center",
                maxWidth: 1200,
                lineHeight: 1.05,
              }}
            >
              {f.label}
            </div>
            <div
              style={{
                fontFamily: INTER,
                fontSize: 22,
                color: ON_DARK_SOFT,
                marginTop: 20,
                maxWidth: 900,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              {f.body}
            </div>
            <div
              style={{
                marginTop: 48,
                padding: 40,
                background: DARK_ELEV,
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 16,
                minWidth: 900,
                boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
              }}
            >
              {f.demo}
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Scene 6: CTA ----------
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  const scale = interpolate(enter, [0, 1], [0.9, 1]);
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const capOp = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [70, 100], [16, 0], { extrapolateRight: "clamp" });
  const urlOp = interpolate(frame, [110, 140], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <CoralGlow intensity={0.5} />
      <Grid />

      <div style={{ transform: `scale(${scale})`, opacity }}>
        <Wordmark size={200} />
      </div>
      <div
        style={{
          fontFamily: FRAUNCES,
          fontSize: 44,
          color: CANVAS,
          marginTop: 36,
          fontStyle: "italic",
          opacity: capOp,
          letterSpacing: "-0.02em",
          textAlign: "center",
          maxWidth: 1200,
          lineHeight: 1.15,
        }}
      >
        Stop naming files. Start finding them.
      </div>

      <div
        style={{
          marginTop: 48,
          padding: "20px 40px",
          background: CORAL,
          color: CANVAS,
          borderRadius: 12,
          fontFamily: INTER,
          fontWeight: 600,
          fontSize: 22,
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
          boxShadow: "0 20px 40px rgba(204,120,92,0.35)",
        }}
      >
        Add Renma to Chrome — free
      </div>

      <div
        style={{
          marginTop: 32,
          fontFamily: MONO,
          fontSize: 18,
          color: ON_DARK_SOFT,
          letterSpacing: "0.1em",
          opacity: urlOp,
        }}
      >
        renma.app
      </div>
    </AbsoluteFill>
  );
};

// ---------- Main ----------
export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: DARK, fontFamily: INTER }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={S1}>
          <Scene1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={S2}>
          <Scene2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={S3}>
          <Scene3 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={S4}>
          <Scene4 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={S5}>
          <Scene5 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />

        <TransitionSeries.Sequence durationInFrames={S6}>
          <Scene6 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
