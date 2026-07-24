const React = require("react");
const {
  AbsoluteFill,
  Composition,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
} = require("remotion");

const DURATION = 1440;
const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const h = React.createElement;

const colors = {
  canvas: "#faf9f5",
  ink: "#141413",
  body: "#4c4943",
  muted: "#827d72",
  coral: "#cc785c",
  coralDark: "#9d513a",
  cream: "#efe9de",
  soft: "#f5f0e8",
  teal: "#5eb6a4",
  amber: "#e5a94d",
};

const ease = (frame, delay = 0, duration = 24) =>
  spring({
    frame: frame - delay,
    fps: FPS,
    config: { damping: 18, stiffness: 95, mass: 0.7 },
    durationInFrames: duration,
  });

function Wordmark({ large = false }) {
  return h(
    "div",
    { style: { display: "flex", alignItems: "baseline", gap: 12 } },
    h(
      "div",
      {
        style: {
          width: large ? 64 : 42,
          height: large ? 64 : 42,
          borderRadius: large ? 18 : 12,
          background: `linear-gradient(135deg, ${colors.coral}, ${colors.coralDark})`,
          display: "grid",
          placeItems: "center",
          color: "white",
          fontWeight: 800,
          fontSize: large ? 34 : 22,
          boxShadow: "0 18px 50px rgba(204,120,92,.35)",
        },
      },
      "R"
    ),
    h(
      "div",
      {
        style: {
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: large ? 78 : 44,
          letterSpacing: "-.06em",
          color: colors.ink,
          lineHeight: 1,
        },
      },
      "renma",
      h("span", { style: { color: colors.coral } }, ".")
    )
  );
}

function Shell({ children, dark = false }) {
  return h(
    AbsoluteFill,
    {
      style: {
        background: dark
          ? "radial-gradient(circle at 50% 20%, #3a2520 0%, #171615 62%, #0d0d0c 100%)"
          : `radial-gradient(circle at 20% 10%, rgba(204,120,92,.16), transparent 32%), radial-gradient(circle at 86% 70%, rgba(94,182,164,.16), transparent 36%), ${colors.canvas}`,
        fontFamily: "Inter, Arial, sans-serif",
        color: dark ? colors.canvas : colors.ink,
        overflow: "hidden",
      },
    },
    h("div", {
      style: {
        position: "absolute",
        inset: 0,
        opacity: dark ? 0.12 : 0.28,
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(20,20,19,.18) 1px, transparent 0)",
        backgroundSize: "26px 26px",
      },
    }),
    children
  );
}

function DeviceMock({ progress = 1 }) {
  const items = [
    ["image (17).png", "AI_Generated_20260723_0038.png", "chatgpt.com", colors.coral],
    ["download.jpg", "Unsplash_1920x1080_0042.jpg", "unsplash.com", colors.teal],
    ["hero-large.webp", "Dribbble_20260723_0043.webp", "dribbble.com", colors.amber],
  ];

  return h(
    "div",
    {
      style: {
        width: 780,
        borderRadius: 34,
        background: "#1f1e1c",
        padding: 14,
        boxShadow: "0 55px 110px rgba(20,20,19,.28)",
        transform: `translateY(${(1 - progress) * 28}px) scale(${0.94 + progress * 0.06})`,
        opacity: progress,
      },
    },
    h(
      "div",
      { style: { borderRadius: 24, overflow: "hidden", background: "#2a2825" } },
      h(
        "div",
        {
          style: {
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 24px",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          },
        },
        ["#ff7066", "#ffc14d", "#62d26f"].map((c) =>
          h("span", { key: c, style: { width: 12, height: 12, borderRadius: 999, background: c } })
        ),
        h(
          "span",
          {
            style: {
              marginLeft: 18,
              fontSize: 18,
              color: "rgba(255,255,255,.55)",
              fontFamily: "Menlo, monospace",
            },
          },
          "Downloads"
        )
      ),
      h(
        "div",
        { style: { padding: 30, display: "grid", gap: 16 } },
        items.map((item, i) =>
          h(
            "div",
            {
              key: item[0],
              style: {
                background: "rgba(255,255,255,.055)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 18,
                padding: 18,
                opacity: interpolate(progress, [0, 0.5, 1], [0.25, 0.65, 1]),
                transform: `translateX(${(1 - progress) * (i % 2 ? 30 : -30)}px)`,
              },
            },
            h(
              "div",
              {
                style: {
                  color: "rgba(255,255,255,.38)",
                  fontFamily: "Menlo, monospace",
                  fontSize: 19,
                  textDecoration: "line-through",
                },
              },
              item[0]
            ),
            h(
              "div",
              { style: { marginTop: 8, color: "white", fontFamily: "Menlo, monospace", fontSize: 22 } },
              h("span", { style: { color: item[3] } }, String(item[1]).split("_")[0]),
              h(
                "span",
                null,
                String(item[1]).includes("_")
                  ? "_" + String(item[1]).split("_").slice(1).join("_")
                  : item[1]
              )
            ),
            h(
              "div",
              { style: { marginTop: 12, color: "rgba(255,255,255,.45)", fontSize: 17 } },
              item[2]
            )
          )
        )
      )
    )
  );
}

function PopupMock() {
  return h(
    "div",
    {
      style: {
        width: 420,
        borderRadius: 28,
        background: colors.canvas,
        border: `1px solid ${colors.cream}`,
        boxShadow: "0 38px 100px rgba(20,20,19,.24)",
        overflow: "hidden",
      },
    },
    h(
      "div",
      {
        style: {
          padding: "22px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${colors.cream}`,
        },
      },
      h(Wordmark, {}),
      h("span", { style: { fontFamily: "Menlo, monospace", fontSize: 18, color: colors.muted } }, "50")
    ),
    h(
      "div",
      {
        style: {
          padding: 22,
          background: colors.soft,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
      },
      h("div", null, h("div", { style: { fontWeight: 700, fontSize: 18 } }, "Renaming on"), h("div", { style: { color: colors.muted, fontSize: 14, marginTop: 3 } }, "Auto-clean every image")),
      h("div", { style: { width: 56, height: 32, borderRadius: 99, background: colors.coral, padding: 4 } }, h("div", { style: { width: 24, height: 24, borderRadius: 99, background: "white", marginLeft: 24 } }))
    ),
    h(
      "div",
      { style: { padding: 18, display: "grid", gap: 12 } },
      ["AI_Generated_0038.png", "Unsplash_1920x1080_0042.jpg", "Dribbble_20260723.webp"].map((x, i) =>
        h(
          "div",
          {
            key: x,
            style: {
              padding: 14,
              borderRadius: 16,
              background: i === 0 ? "#fff" : colors.soft,
              border: `1px solid ${colors.cream}`,
            },
          },
          h("div", { style: { fontFamily: "Menlo, monospace", fontWeight: 700, fontSize: 15 } }, x),
          h(
            "div",
            { style: { color: colors.muted, marginTop: 6, fontSize: 13 } },
            (i === 0 ? "chatgpt.com" : i === 1 ? "unsplash.com" : "dribbble.com") + " · just now"
          )
        )
      )
    )
  );
}

function SceneHero() {
  const f = useCurrentFrame();
  const p = ease(f, 6, 36);
  return h(
    Shell,
    null,
    h("div", { style: { position: "absolute", left: 110, top: 90 } }, h(Wordmark, { large: true })),
    h(
      "div",
      {
        style: {
          position: "absolute",
          left: 110,
          top: 265,
          width: 870,
          transform: `translateY(${(1 - p) * 30}px)`,
          opacity: p,
        },
      },
      h("div", { style: { color: colors.coral, textTransform: "uppercase", letterSpacing: ".18em", fontWeight: 800, fontSize: 22 } }, "Chrome extension · Manifest V3"),
      h("h1", { style: { margin: "24px 0 0", fontFamily: "Georgia, serif", fontSize: 104, lineHeight: 0.96, letterSpacing: "-.055em", fontWeight: 400 } }, "Every image,", h("br"), "named properly", h("br"), h("i", { style: { color: colors.coral } }, "as it lands.")),
      h("p", { style: { marginTop: 34, color: colors.body, fontSize: 28, lineHeight: 1.45, width: 740 } }, "Renma turns messy browser downloads into searchable, source-aware filenames — automatically and locally.")
    ),
    h("div", { style: { position: "absolute", right: 110, top: 230 } }, h(DeviceMock, { progress: p }))
  );
}

function SceneProblem() {
  const f = useCurrentFrame();
  const p = ease(f, 0, 30);
  const files = ["image (1).png", "download.jpg", "Untitled.webp", "IMG_2882.png", "image (17).png", "photo-large.jpeg"];
  return h(
    Shell,
    { dark: true },
    h(
      "div",
      { style: { padding: "120px 130px" } },
      h("div", { style: { color: colors.coral, textTransform: "uppercase", letterSpacing: ".18em", fontWeight: 800, fontSize: 22 } }, "The problem"),
      h("h2", { style: { fontFamily: "Georgia, serif", fontSize: 86, lineHeight: 1, letterSpacing: "-.045em", fontWeight: 400, margin: "22px 0 24px" } }, "Download folders", h("br"), "weren't built for creators."),
      h("p", { style: { color: "rgba(250,249,245,.68)", fontSize: 27, lineHeight: 1.4, width: 650 } }, "AI images, stock photos, UI references — all arrive with names you can never search again.")
    ),
    h(
      "div",
      { style: { position: "absolute", right: 130, top: 180, width: 620, display: "grid", gap: 18 } },
      files.map((x, i) =>
        h("div", { key: x, style: { transform: `translateX(${interpolate(p, [0, 1], [40, 0]) * (i + 1) * 0.08}px)`, opacity: p, padding: 24, borderRadius: 18, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", color: "rgba(255,255,255,.78)", fontFamily: "Menlo, monospace", fontSize: 28 } }, x)
      )
    )
  );
}

function SceneFeatures() {
  const f = useCurrentFrame();
  const p = ease(f, 0, 28);
  const features = [
    ["Smart templates", "{prefix}_{date}_{dimensions}.{ext}"],
    ["Domain rules", "dribbble.com → refs/ui/Dribbble"],
    ["Duplicate control", "tag or skip repeat URLs"],
    ["Private stats", "local chrome.storage only"],
  ];
  return h(
    Shell,
    null,
    h(
      "div",
      { style: { padding: "105px 120px" } },
      h("div", { style: { color: colors.coral, textTransform: "uppercase", letterSpacing: ".18em", fontWeight: 800, fontSize: 22 } }, "Advanced controls"),
      h("h2", { style: { fontFamily: "Georgia, serif", fontSize: 78, lineHeight: 1, letterSpacing: "-.045em", fontWeight: 400, margin: "20px 0 0" } }, "Not just renaming.", h("br"), h("i", { style: { color: colors.coral } }, "A rule engine."))
    ),
    h(
      "div",
      { style: { position: "absolute", left: 120, right: 120, bottom: 115, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 } },
      features.map(([title, body], i) =>
        h(
          "div",
          { key: title, style: { padding: 28, borderRadius: 26, background: i === 0 ? colors.ink : "white", color: i === 0 ? "white" : colors.ink, border: `1px solid ${colors.cream}`, minHeight: 240, transform: `translateY(${(1 - p) * (30 + i * 6)}px)`, opacity: p } },
          h("div", { style: { width: 48, height: 48, borderRadius: 16, background: colors.coral, marginBottom: 38 } }),
          h("div", { style: { fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 34 } }, title),
          h("div", { style: { marginTop: 14, color: i === 0 ? "rgba(255,255,255,.65)" : colors.body, fontFamily: "Menlo, monospace", fontSize: 18, lineHeight: 1.4 } }, body)
        )
      )
    )
  );
}

function SceneUi() {
  const f = useCurrentFrame();
  const p = ease(f, 0, 30);
  return h(
    Shell,
    null,
    h(
      "div",
      { style: { position: "absolute", left: 120, top: 120 } },
      h("div", { style: { color: colors.coral, textTransform: "uppercase", letterSpacing: ".18em", fontWeight: 800, fontSize: 22 } }, "Beautiful UI"),
      h("h2", { style: { fontFamily: "Georgia, serif", fontSize: 84, lineHeight: 1, letterSpacing: "-.045em", fontWeight: 400, margin: "20px 0 24px", width: 690 } }, "A premium control panel for a tiny workflow."),
      h("p", { style: { color: colors.body, fontSize: 27, lineHeight: 1.42, width: 620 } }, "Fast toggles, searchable history, instant export, site scope, live previews, and readable stats.")
    ),
    h("div", { style: { position: "absolute", right: 185, top: 130, transform: `rotate(${interpolate(p, [0, 1], [3, -2])}deg) scale(${0.88 + p * 0.12})`, opacity: p } }, h(PopupMock)),
    h(
      "div",
      { style: { position: "absolute", right: 120, bottom: 95, width: 660, borderRadius: 30, background: "white", border: `1px solid ${colors.cream}`, padding: 28, boxShadow: "0 38px 100px rgba(20,20,19,.18)", transform: `translateY(${(1 - p) * 42}px)` } },
      h(
        "div",
        { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 } },
        ["Total\n1,284", "Today\n42", "Sources\n18"].map((s) =>
          h(
            "div",
            { key: s, style: { background: colors.soft, borderRadius: 18, padding: 22 } },
            h("div", { style: { color: colors.muted, textTransform: "uppercase", fontSize: 13, letterSpacing: ".12em" } }, s.split("\n")[0]),
            h("div", { style: { fontFamily: "Georgia, serif", fontSize: 46, marginTop: 8 } }, s.split("\n")[1])
          )
        )
      )
    )
  );
}

function SceneFinal() {
  const f = useCurrentFrame();
  const p = ease(f, 0, 36);
  return h(
    Shell,
    { dark: true },
    h(
      "div",
      { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" } },
      h(
        "div",
        { style: { transform: `translateY(${(1 - p) * 28}px)`, opacity: p } },
        h(Wordmark, { large: true }),
        h("h2", { style: { fontFamily: "Georgia, serif", fontSize: 104, lineHeight: 0.95, fontWeight: 400, letterSpacing: "-.055em", color: colors.canvas, margin: "52px 0 0" } }, "Your Downloads folder,", h("br"), h("i", { style: { color: colors.coral } }, "finally organized.")),
        h("p", { style: { marginTop: 34, color: "rgba(250,249,245,.66)", fontSize: 28 } }, "Install Renma. Save an image. The name is already fixed.")
      )
    )
  );
}

function RenmaProductVideo() {
  return h(
    AbsoluteFill,
    null,
    h(Sequence, { from: 0, durationInFrames: 260 }, h(SceneHero)),
    h(Sequence, { from: 260, durationInFrames: 250 }, h(SceneProblem)),
    h(Sequence, { from: 510, durationInFrames: 300 }, h(SceneFeatures)),
    h(Sequence, { from: 810, durationInFrames: 310 }, h(SceneUi)),
    h(Sequence, { from: 1120, durationInFrames: 320 }, h(SceneFinal))
  );
}

function RemotionRoot() {
  return h(Composition, {
    id: "RenmaProductVideo",
    component: RenmaProductVideo,
    durationInFrames: DURATION,
    fps: FPS,
    width: WIDTH,
    height: HEIGHT,
    defaultProps: {},
  });
}

module.exports = { RemotionRoot, RenmaProductVideo };