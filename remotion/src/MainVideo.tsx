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

const CANVAS = "#faf9f5";
const INK = "#141413";
const CORAL = "#cc785c";
const CORAL_DEEP = "#a9583e";
const DARK = "#181715";
const DARK_ELEV = "#252320";
const ON_DARK_SOFT = "#a09d96";
const HAIRLINE_DARK = "rgba(250,249,245,0.08)";

// Chrome (light) palette for realistic browser
const CHROME_BG = "#dee1e6";
const CHROME_TAB = "#ffffff";
const CHROME_OMNIBOX = "#f1f3f4";
const CHROME_TEXT = "#3c4043";
const CHROME_HAIRLINE = "#c8ccd1";
const PAGE_BG = "#ffffff";

// Scene lengths (30fps)
const S1 = 120;   // 4s wordmark
const S2 = 240;   // 8s Chrome tab: save image + download bar morph
const S3 = 210;   // 7s Popup opens from toolbar
const S4 = 210;   // 7s Options page — templates
const S5 = 180;   // 6s Folder result + stats
const S6 = 180;   // 6s CTA
const T = 18;
export const DURATION = S1 + S2 + S3 + S4 + S5 + S6 - T * 5;

// -------- shared --------
const CoralGlow: React.FC<{ intensity?: number; x?: string; y?: string }> = ({
  intensity = 0.4,
  x = "50%",
  y = "45%",
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(60% 55% at ${x} ${y}, rgba(204,120,92,${intensity}), transparent 70%)`,
    }}
  />
);

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.05,
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

const RenmaIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: CORAL,
      display: "grid",
      placeItems: "center",
      color: CANVAS,
      fontFamily: FRAUNCES,
      fontStyle: "italic",
      fontWeight: 600,
      fontSize: size * 0.7,
      lineHeight: 1,
      boxShadow: `0 2px 6px rgba(0,0,0,0.25)`,
    }}
  >
    r
  </div>
);

// A realistic Chrome browser window frame with tabs + toolbar (with Renma icon)
const ChromeWindow: React.FC<{
  url: string;
  tabTitle: string;
  highlightRenmaIcon?: boolean;
  children: React.ReactNode;
  width?: number;
  height?: number;
}> = ({ url, tabTitle, highlightRenmaIcon, children, width = 1500, height = 880 }) => (
  <div
    style={{
      width,
      height,
      background: PAGE_BG,
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 60px 120px -30px rgba(0,0,0,0.65), 0 20px 40px -10px rgba(0,0,0,0.35)",
      border: `1px solid rgba(0,0,0,0.15)`,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {/* Tab bar */}
    <div
      style={{
        background: CHROME_BG,
        padding: "8px 12px 0",
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height: 44,
      }}
    >
      <div style={{ display: "flex", gap: 8, marginRight: 12, marginBottom: 8 }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f57" }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#febc2e" }} />
        <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28c840" }} />
      </div>
      <div
        style={{
          background: CHROME_TAB,
          borderRadius: "10px 10px 0 0",
          padding: "8px 16px 10px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 220,
          maxWidth: 260,
          fontFamily: INTER,
          fontSize: 13,
          color: CHROME_TEXT,
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: 3, background: CORAL, flexShrink: 0 }} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tabTitle}</span>
      </div>
    </div>
    {/* Omnibox row */}
    <div
      style={{
        background: CHROME_BG,
        padding: "8px 14px 10px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        borderBottom: `1px solid ${CHROME_HAIRLINE}`,
      }}
    >
      <div style={{ display: "flex", gap: 14, color: CHROME_TEXT, fontSize: 18, opacity: 0.7 }}>
        <span>←</span>
        <span>→</span>
        <span>↻</span>
      </div>
      <div
        style={{
          flex: 1,
          background: CHROME_OMNIBOX,
          borderRadius: 999,
          padding: "8px 16px",
          fontFamily: INTER,
          fontSize: 14,
          color: CHROME_TEXT,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ opacity: 0.5 }}>🔒</span>
        <span>{url}</span>
      </div>
      {/* Extension icons */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 22, height: 22, borderRadius: 4, background: "rgba(60,64,67,0.15)" }} />
        <div style={{ width: 22, height: 22, borderRadius: 4, background: "rgba(60,64,67,0.15)" }} />
        <div
          style={{
            position: "relative",
            padding: 4,
            borderRadius: 8,
            background: highlightRenmaIcon ? "rgba(204,120,92,0.2)" : "transparent",
            transition: "none",
            outline: highlightRenmaIcon ? `2px solid ${CORAL}` : "none",
          }}
        >
          <RenmaIcon size={22} />
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 14, background: "#7b6b5c", color: "white", display: "grid", placeItems: "center", fontSize: 13, fontFamily: INTER, fontWeight: 600 }}>
          U
        </div>
      </div>
    </div>
    {/* Page */}
    <div style={{ flex: 1, background: PAGE_BG, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  </div>
);

// -------- Scene 1: Opening --------
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 20, stiffness: 90 } });
  const scale = interpolate(s, [0, 1], [0.92, 1]);
  const opacity = interpolate(frame, [0, 20, S1 - 25, S1 - 5], [0, 1, 1, 0]);
  const tagOp = interpolate(frame, [28, 52, S1 - 30, S1 - 10], [0, 1, 1, 0]);
  const tagY = interpolate(frame, [28, 52], [12, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK }}>
      <CoralGlow intensity={0.35} />
      <Grid />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity }}>
        <div style={{ transform: `scale(${scale})`, display: "flex", alignItems: "center", gap: 24 }}>
          <RenmaIcon size={120} />
          <Wordmark size={180} />
        </div>
        <div
          style={{
            fontFamily: INTER,
            fontSize: 26,
            color: ON_DARK_SOFT,
            marginTop: 28,
            letterSpacing: "-0.01em",
            opacity: tagOp,
            transform: `translateY(${tagY}px)`,
          }}
        >
          The Chrome extension that renames every image you save.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// -------- Scene 2: Save image on ChatGPT — download bar morphs --------
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  // Timing within scene:
  // 0-40: window enters
  // 40-90: cursor moves to image, right-click appears
  // 90-130: "Save image as…" highlighted, click
  // 130-165: download bar slides in with "image (17).png"
  // 165-210: filename morphs to Renma name
  // 210-240: settle

  const winSpring = spring({ frame, fps: 30, config: { damping: 20, stiffness: 80 } });
  const winScale = interpolate(winSpring, [0, 1], [0.94, 1]);
  const winOp = interpolate(frame, [0, 20, S2 - 15, S2], [0, 1, 1, 0]);

  const menuOp = interpolate(frame, [60, 85], [0, 1], { extrapolateRight: "clamp" });
  const menuY = interpolate(frame, [60, 85], [8, 0], { extrapolateRight: "clamp" });
  const hoverAt = 100;
  const clickAt = 118;

  const cursorX = interpolate(frame, [20, 60, 100, 118, 140], [900, 620, 720, 720, 620]);
  const cursorY = interpolate(frame, [20, 60, 100, 118, 140], [420, 400, 560, 560, 720]);

  const barOp = interpolate(frame, [130, 155], [0, 1], { extrapolateRight: "clamp" });
  const barY = interpolate(frame, [130, 155], [40, 0], { extrapolateRight: "clamp" });

  // filename morph: at frame 172, replace text; add scramble effect via opacity toggle
  const morph = frame > 172;
  const oldOp = interpolate(frame, [165, 175], [1, 0], { extrapolateRight: "clamp" });
  const newOp = interpolate(frame, [175, 195], [0, 1], { extrapolateRight: "clamp" });
  const pillOp = interpolate(frame, [190, 210], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: "center", justifyContent: "center" }}>
      <CoralGlow intensity={0.22} y="30%" />
      <div style={{ transform: `scale(${winScale})`, opacity: winOp, position: "relative" }}>
        <ChromeWindow url="chatgpt.com/c/image" tabTitle="Image · ChatGPT" highlightRenmaIcon={false}>
          {/* ChatGPT-style page */}
          <div style={{ display: "flex", height: "100%" }}>
            <div style={{ width: 240, background: "#f7f7f8", borderRight: `1px solid ${CHROME_HAIRLINE}`, padding: 16 }}>
              <div style={{ height: 32, borderRadius: 6, background: "rgba(0,0,0,0.06)", marginBottom: 10 }} />
              <div style={{ height: 20, width: "80%", borderRadius: 4, background: "rgba(0,0,0,0.05)", marginBottom: 8 }} />
              <div style={{ height: 20, width: "65%", borderRadius: 4, background: "rgba(0,0,0,0.05)", marginBottom: 8 }} />
              <div style={{ height: 20, width: "72%", borderRadius: 4, background: "rgba(0,0,0,0.05)" }} />
            </div>
            <div style={{ flex: 1, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  width: 460,
                  height: 460,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DEEP}, #6b3a2a)`,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 60%)" }} />
                <div style={{ position: "absolute", bottom: 14, left: 16, fontFamily: MONO, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                  DALL·E · 1024×1024
                </div>
              </div>
              <div style={{ fontFamily: INTER, fontSize: 14, color: "#6b6f75" }}>
                "A cinematic sunset over a coral canyon"
              </div>
            </div>
          </div>

          {/* Right-click context menu (Chrome native style) */}
          <div
            style={{
              position: "absolute",
              top: 380,
              left: 720,
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 8,
              padding: 6,
              width: 260,
              opacity: menuOp,
              transform: `translateY(${menuY}px)`,
              boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
              fontFamily: INTER,
              fontSize: 14,
              color: CHROME_TEXT,
            }}
          >
            {[
              "Open image in new tab",
              "Copy image address",
              "Save image as…",
              "Search image with Google",
            ].map((t, i) => (
              <div
                key={t}
                style={{
                  padding: "8px 14px",
                  borderRadius: 4,
                  background:
                    i === 2 && frame > hoverAt
                      ? frame > clickAt && frame < clickAt + 8
                        ? "rgba(26,115,232,0.25)"
                        : "rgba(26,115,232,0.15)"
                      : "transparent",
                }}
              >
                {t}
              </div>
            ))}
          </div>

          {/* Download bar bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#f1f3f4",
              borderTop: `1px solid ${CHROME_HAIRLINE}`,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: barOp,
              transform: `translateY(${barY}px)`,
              fontFamily: INTER,
              fontSize: 13,
              color: CHROME_TEXT,
            }}
          >
            <div style={{ width: 34, height: 40, background: "#fff", border: `1px solid ${CHROME_HAIRLINE}`, borderRadius: 3, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 9, color: CORAL, fontWeight: 600 }}>
              PNG
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, position: "relative", minWidth: 400 }}>
              <div style={{ position: "relative", height: 18 }}>
                <span style={{ position: "absolute", opacity: oldOp, fontFamily: MONO, fontSize: 14 }}>image (17).png</span>
                <span style={{ position: "absolute", opacity: newOp, fontFamily: MONO, fontSize: 14, color: INK, fontWeight: 500 }}>
                  AI_Generated_2026-07-23_14-22.png
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#6b6f75" }}>
                {morph ? "Renamed by Renma · chatgpt.com" : "1.2 MB · chatgpt.com"}
              </div>
            </div>
            {/* Renma bubble */}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(204,120,92,0.12)",
                border: `1px solid ${CORAL}`,
                opacity: pillOp,
              }}
            >
              <RenmaIcon size={16} />
              <span style={{ fontFamily: INTER, fontSize: 12, color: CORAL_DEEP, fontWeight: 600 }}>
                Renamed
              </span>
            </div>
          </div>
        </ChromeWindow>

        {/* Cursor */}
        <div
          style={{
            position: "absolute",
            top: cursorY,
            left: cursorX,
            width: 24,
            height: 24,
            pointerEvents: "none",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M2 2 L2 20 L7 15 L10 22 L13 21 L10 14 L18 14 Z" fill="#fff" stroke="#000" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* caption */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontFamily: INTER,
          fontSize: 20,
          color: ON_DARK_SOFT,
          opacity: interpolate(frame, [155, 180, S2 - 15, S2], [0, 1, 1, 0], { extrapolateRight: "clamp" }),
        }}
      >
        Renma intercepts the download before Chrome writes it to disk.
      </div>
    </AbsoluteFill>
  );
};

// -------- Scene 3: Click toolbar icon → popup opens --------
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const winOp = interpolate(frame, [0, 20, S3 - 15, S3], [0, 1, 1, 0]);
  const highlight = frame > 20 && frame < 90;
  const popupOp = interpolate(frame, [55, 85], [0, 1], { extrapolateRight: "clamp" });
  const popupY = interpolate(frame, [55, 85], [-10, 0], { extrapolateRight: "clamp" });
  const popupScale = interpolate(frame, [55, 85], [0.95, 1], { extrapolateRight: "clamp" });

  const items = [
    { orig: "image (17).png", newName: "AI_Generated_2026-07-23_14-22.png", dom: "chatgpt.com", dim: "1024×1024" },
    { orig: "photo-3822.jpg", newName: "unsplash_2026-07-23_14-19.jpg", dom: "unsplash.com", dim: "1920×1280" },
    { orig: "download.png",   newName: "github_2026-07-23_14-16.png",   dom: "github.com", dim: "800×600" },
  ];

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: "center", justifyContent: "center" }}>
      <CoralGlow intensity={0.22} y="30%" />
      <div style={{ opacity: winOp, position: "relative" }}>
        <ChromeWindow url="chatgpt.com/c/image" tabTitle="Image · ChatGPT" highlightRenmaIcon={highlight}>
          <div style={{ padding: 40, opacity: 0.35 }}>
            <div style={{ width: 460, height: 460, borderRadius: 16, background: `linear-gradient(135deg, ${CORAL}, ${CORAL_DEEP})`, margin: "0 auto" }} />
          </div>
        </ChromeWindow>

        {/* Popup panel — anchored under Renma icon */}
        <div
          style={{
            position: "absolute",
            top: 90,
            right: 92,
            width: 380,
            background: CANVAS,
            borderRadius: 14,
            boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.1)",
            opacity: popupOp,
            transform: `translateY(${popupY}px) scale(${popupScale})`,
            transformOrigin: "top right",
            overflow: "hidden",
            fontFamily: INTER,
            color: INK,
          }}
        >
          {/* header */}
          <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #e6dfd8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <RenmaIcon size={22} />
              <span style={{ fontFamily: FRAUNCES, fontStyle: "italic", fontWeight: 600, fontSize: 22, letterSpacing: "-0.04em" }}>
                renma<span style={{ color: CORAL }}>.</span>
              </span>
              <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6c6a64", fontWeight: 500 }}>
                renamer
              </span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#6c6a64", background: "#efe9de", padding: "3px 8px", borderRadius: 999 }}>
              1,284
            </span>
          </div>
          {/* toggle strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", background: "#f5f0e8", borderBottom: "1px solid #e6dfd8" }}>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>Renaming on</div>
              <div style={{ fontSize: 11, color: "#6c6a64" }}>Downloads will be auto-renamed</div>
            </div>
            <div style={{ position: "relative", width: 38, height: 22, background: CORAL, borderRadius: 999 }}>
              <div style={{ position: "absolute", top: 2, left: 18, width: 18, height: 18, borderRadius: 9, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
            </div>
          </div>
          {/* section label */}
          <div style={{ padding: "14px 18px 6px", fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8e8b82" }}>
            Recent renames
          </div>
          {/* items */}
          <div style={{ padding: "0 10px 12px" }}>
            {items.map((it, i) => {
              const start = 95 + i * 22;
              const op = interpolate(frame, [start, start + 18], [0, 1], { extrapolateRight: "clamp" });
              const y = interpolate(frame, [start, start + 18], [10, 0], { extrapolateRight: "clamp" });
              return (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 10, opacity: op, transform: `translateY(${y}px)`, background: i === 0 ? "#f5f0e8" : "transparent" }}>
                  <div style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 500, wordBreak: "break-all", lineHeight: 1.4 }}>
                    {it.newName}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#6c6a64", marginTop: 3, wordBreak: "break-all" }}>
                    was {it.orig}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 500, color: CORAL, background: "rgba(204,120,92,0.12)", padding: "2px 7px", borderRadius: 999 }}>{it.dom}</span>
                    <span style={{ fontSize: 10.5, fontFamily: MONO, color: "#3d3d3a", background: "#efe9de", padding: "2px 7px", borderRadius: 999 }}>{it.dim}</span>
                    <span style={{ fontSize: 10.5, color: "#8e8b82", marginLeft: "auto" }}>just now</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* cursor pointing at extension icon */}
        <div
          style={{
            position: "absolute",
            top: interpolate(frame, [0, 40, 55], [200, 78, 92], { extrapolateRight: "clamp" }),
            left: interpolate(frame, [0, 40, 55], [1200, 1380, 1380], { extrapolateRight: "clamp" }),
            width: 24,
            height: 24,
            opacity: interpolate(frame, [0, 10, 90, 110], [0, 1, 1, 0], { extrapolateRight: "clamp" }),
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M2 2 L2 20 L7 15 L10 22 L13 21 L10 14 L18 14 Z" fill="#fff" stroke="#000" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontFamily: INTER,
          fontSize: 20,
          color: ON_DARK_SOFT,
          opacity: interpolate(frame, [40, 70, S3 - 15, S3], [0, 1, 1, 0], { extrapolateRight: "clamp" }),
        }}
      >
        One click on the toolbar shows every file Renma has renamed.
      </div>
    </AbsoluteFill>
  );
};

// -------- Scene 4: Options page — templates + folder routing --------
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const winOp = interpolate(frame, [0, 20, S4 - 15, S4], [0, 1, 1, 0]);
  const s = spring({ frame, fps: 30, config: { damping: 22, stiffness: 100 } });
  const scale = interpolate(s, [0, 1], [0.94, 1]);

  const rules = [
    { dom: "chatgpt.com", tpl: "AI_Generated_{date}_{time}.{ext}", folder: "AI_Generated/" },
    { dom: "unsplash.com", tpl: "{domain}_{width}x{height}.{ext}", folder: "unsplash/" },
    { dom: "github.com", tpl: "gh_{date}.{ext}", folder: "github/" },
    { dom: "figma.com", tpl: "figma_{date}_{time}.{ext}", folder: "figma/" },
  ];

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: "center", justifyContent: "center" }}>
      <CoralGlow intensity={0.22} />
      <Grid />

      <div style={{ opacity: winOp, transform: `scale(${scale})` }}>
        <ChromeWindow url="chrome-extension://renma/options.html" tabTitle="Renma — Custom rules" width={1500} height={880}>
          <div style={{ display: "flex", height: "100%", background: CANVAS, color: INK, fontFamily: INTER }}>
            {/* sidebar */}
            <div style={{ width: 260, background: "#f5f0e8", padding: 32, borderRight: "1px solid #e6dfd8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                <RenmaIcon size={28} />
                <span style={{ fontFamily: FRAUNCES, fontStyle: "italic", fontWeight: 600, fontSize: 24, letterSpacing: "-0.04em" }}>
                  renma<span style={{ color: CORAL }}>.</span>
                </span>
              </div>
              {["Rules", "Folders", "Templates", "Duplicates", "Shortcuts", "Stats"].map((t, i) => (
                <div key={t} style={{ padding: "10px 12px", borderRadius: 8, background: i === 0 ? CORAL : "transparent", color: i === 0 ? CANVAS : "#3d3d3a", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                  {t}
                </div>
              ))}
            </div>
            {/* content */}
            <div style={{ flex: 1, padding: "36px 44px", overflow: "hidden" }}>
              <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: CORAL, fontWeight: 500 }}>
                Custom rules
              </div>
              <div style={{ fontFamily: FRAUNCES, fontSize: 42, fontStyle: "italic", fontWeight: 600, letterSpacing: "-0.02em", marginTop: 6 }}>
                Every domain, your naming.
              </div>
              <div style={{ fontSize: 15, color: "#6c6a64", marginTop: 8, maxWidth: 640 }}>
                Use tokens like {"{date}"}, {"{domain}"}, {"{width}"}, {"{height}"}, {"{ext}"} — Renma applies them the moment you save.
              </div>

              <div style={{ marginTop: 28, background: "#fff", border: "1px solid #e6dfd8", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", padding: "12px 20px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8e8b82", background: "#faf9f5", borderBottom: "1px solid #e6dfd8", fontWeight: 500 }}>
                  <div>Domain</div>
                  <div>Template</div>
                  <div>Folder</div>
                </div>
                {rules.map((r, i) => {
                  const start = 25 + i * 18;
                  const op = interpolate(frame, [start, start + 18], [0, 1], { extrapolateRight: "clamp" });
                  const y = interpolate(frame, [start, start + 18], [10, 0], { extrapolateRight: "clamp" });
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1fr", padding: "14px 20px", borderTop: i === 0 ? "none" : "1px solid #efe9de", opacity: op, transform: `translateY(${y}px)`, alignItems: "center" }}>
                      <div style={{ fontFamily: MONO, fontSize: 14, color: CORAL_DEEP }}>{r.dom}</div>
                      <div style={{ fontFamily: MONO, fontSize: 14, color: INK }}>{r.tpl}</div>
                      <div style={{ fontFamily: MONO, fontSize: 14, color: "#3d3d3a" }}>{r.folder}</div>
                    </div>
                  );
                })}
              </div>

              {/* Live preview */}
              <div style={{ marginTop: 24, padding: 20, background: INK, borderRadius: 12, color: CANVAS, display: "flex", alignItems: "center", gap: 20, opacity: interpolate(frame, [110, 140], [0, 1], { extrapolateRight: "clamp" }) }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: CORAL }}>Preview</div>
                <div style={{ fontFamily: MONO, fontSize: 18 }}>
                  {"chatgpt.com"} → <span style={{ color: CORAL }}>AI_Generated_2026-07-23_14-22.png</span>
                </div>
              </div>
            </div>
          </div>
        </ChromeWindow>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontFamily: INTER,
          fontSize: 20,
          color: ON_DARK_SOFT,
          opacity: interpolate(frame, [30, 60, S4 - 15, S4], [0, 1, 1, 0], { extrapolateRight: "clamp" }),
        }}
      >
        Build a naming rule for every site — templates, tokens, and folders.
      </div>
    </AbsoluteFill>
  );
};

// -------- Scene 5: Folder result + stats --------
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 20, S5 - 15, S5], [0, 1, 1, 0]);

  const rows = [
    { folder: "AI_Generated/", file: "AI_Generated_2026-07-23_14-22.png", tag: "chatgpt" },
    { folder: "unsplash/",     file: "unsplash_1920x1280.jpg",             tag: "unsplash" },
    { folder: "github/",       file: "gh_2026-07-23.png",                  tag: "github" },
    { folder: "figma/",        file: "figma_2026-07-23_14-15.png",         tag: "figma" },
    { folder: "AI_Generated/", file: "AI_Generated_2026-07-23_14-17.png",  tag: "openai" },
  ];

  const stats = [
    { n: "1,284", l: "Files renamed" },
    { n: "63", l: "Duplicates skipped" },
    { n: "42", l: "Domains covered" },
  ];

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "0 100px", opacity: op }}>
      <CoralGlow intensity={0.2} />
      <Grid />
      <div style={{ fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: CORAL, fontFamily: INTER, fontWeight: 500 }}>
        The result
      </div>
      <div style={{ fontFamily: FRAUNCES, fontSize: 68, color: CANVAS, marginTop: 12, letterSpacing: "-0.02em", textAlign: "center" }}>
        A downloads folder that <span style={{ fontStyle: "italic", color: CORAL }}>finally makes sense</span>.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 32, marginTop: 48, width: "100%", maxWidth: 1500 }}>
        {/* Finder window */}
        <div style={{ background: "#f7f5f0", borderRadius: 14, overflow: "hidden", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)" }}>
          <div style={{ padding: "12px 18px", background: "#e6e2da", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: "#ff5f57" }} />
            <div style={{ width: 10, height: 10, borderRadius: 5, background: "#febc2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: 5, background: "#28c840" }} />
            <div style={{ marginLeft: 16, fontFamily: INTER, fontSize: 13, color: "#3d3d3a", fontWeight: 500 }}>
              ~/Downloads
            </div>
          </div>
          {rows.map((r, i) => {
            const start = 20 + i * 14;
            const rop = interpolate(frame, [start, start + 18], [0, 1], { extrapolateRight: "clamp" });
            const ry = interpolate(frame, [start, start + 18], [10, 0], { extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.06)", opacity: rop, transform: `translateY(${ry}px)`, background: i % 2 ? "rgba(0,0,0,0.02)" : "transparent" }}>
                <div style={{ width: 22, height: 18, background: "rgba(204,120,92,0.2)", border: `1px solid ${CORAL}`, borderRadius: 3 }} />
                <div style={{ fontFamily: MONO, fontSize: 15, color: CORAL_DEEP, width: 180, fontWeight: 500 }}>{r.folder}</div>
                <div style={{ fontFamily: MONO, fontSize: 15, color: INK, flex: 1 }}>{r.file}</div>
                <div style={{ fontFamily: INTER, fontSize: 10.5, color: CORAL, textTransform: "uppercase", letterSpacing: "0.14em", padding: "3px 10px", borderRadius: 999, background: "rgba(204,120,92,0.14)", fontWeight: 500 }}>
                  {r.tag}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, justifyContent: "center" }}>
          {stats.map((s, i) => {
            const start = 50 + i * 15;
            const sop = interpolate(frame, [start, start + 20], [0, 1], { extrapolateRight: "clamp" });
            const sy = interpolate(frame, [start, start + 20], [16, 0], { extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ padding: 28, background: DARK_ELEV, border: `1px solid ${HAIRLINE_DARK}`, borderRadius: 14, opacity: sop, transform: `translateY(${sy}px)` }}>
                <div style={{ fontFamily: FRAUNCES, fontSize: 56, color: CORAL, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: INTER, fontSize: 15, color: ON_DARK_SOFT, marginTop: 8 }}>{s.l}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// -------- Scene 6: CTA --------
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 20, stiffness: 90 } });
  const scale = interpolate(s, [0, 1], [0.9, 1]);
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const capOp = interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" });
  const ctaOp = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  const ctaY = interpolate(frame, [70, 100], [16, 0], { extrapolateRight: "clamp" });
  const urlOp = interpolate(frame, [110, 140], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <CoralGlow intensity={0.5} />
      <Grid />
      <div style={{ transform: `scale(${scale})`, opacity, display: "flex", alignItems: "center", gap: 24 }}>
        <RenmaIcon size={120} />
        <Wordmark size={180} />
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
          padding: "18px 36px",
          background: CORAL,
          color: CANVAS,
          borderRadius: 12,
          fontFamily: INTER,
          fontWeight: 600,
          fontSize: 22,
          opacity: ctaOp,
          transform: `translateY(${ctaY}px)`,
          boxShadow: "0 20px 40px rgba(204,120,92,0.35)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span>+</span> Add Renma to Chrome — free
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: MONO,
          fontSize: 18,
          color: ON_DARK_SOFT,
          letterSpacing: "0.1em",
          opacity: urlOp,
        }}
      >
        chrome web store · renma
      </div>
    </AbsoluteFill>
  );
};

// -------- Main --------
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
