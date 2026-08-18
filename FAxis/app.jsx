/* global React, ReactDOM, Hero, Header, WhatWeDo, Offerings, Why, Founder, Proof, Footer,
   useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "hero": "aurora",
  "accent": "#2E3192",
  "type": "editorial"
}/*EDITMODE-END*/;

/* color helpers */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const ACCENTS = ["#2E3192", "#3b4ed8", "#2563eb", "#0ea5e9"];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const isDark = t.theme === "dark";

  // theme + accent + type → :root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t.theme);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-2", shade(t.accent, 0.22));
    root.style.setProperty("--accent-3", shade(t.accent, 0.42));
    root.style.setProperty("--font-serif", t.type === "editorial"
      ? '"Instrument Serif", Georgia, serif'
      : '"Geist", system-ui, sans-serif');
    document.body.dataset.typeMode = t.type;
  }, [t.theme, t.accent, t.type]);

  // JS-driven motion (CSS keyframes get throttled in embedded previews; rAF is reliable).
  useEffect(() => {
    const easeOut = (x) => 1 - Math.pow(1 - x, 3);
    const tweens = [];
    const seen = new WeakSet();

    const tween = (el, { dur = 850, delay = 0, from = 36, unit = "px", fade = true }) => {
      const begin = performance.now() + delay;
      if (fade) el.style.opacity = "0";
      el.style.transform = `translateY(${from}${unit})`;
      el.style.willChange = "transform, opacity";
      tweens.push((now) => {
        const p = Math.max(0, Math.min(1, (now - begin) / dur));
        const e = easeOut(p);
        if (fade) el.style.opacity = String(e);
        el.style.transform = `translateY(${(1 - e) * from}${unit})`;
        if (p >= 1) { el.style.transform = "none"; if (fade) el.style.opacity = "1"; el.style.willChange = ""; return true; }
        return false;
      });
    };

    // hero entrance
    document.querySelectorAll(".hero h1 .row > span").forEach((el, i) => {
      tween(el, { dur: 1050, delay: 90 + i * 150, from: 116, unit: "%", fade: false });
    });
    [[".hero-sub", 700], [".hero-actions", 880], [".hero-scroll", 1500]].forEach(([sel, d]) => {
      const el = document.querySelector(sel);
      if (el) tween(el, { dur: 850, delay: d, from: 18, fade: true });
    });

    let raf;
    const loop = (now) => {
      const h = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll(".reveal").forEach((el) => {
        if (seen.has(el)) return;
        const r = el.getBoundingClientRect();
        if (r.top < h * 0.9 && r.bottom > 4) { seen.add(el); tween(el, { dur: 900, from: 34, fade: true }); }
      });
      for (let i = tweens.length - 1; i >= 0; i--) { if (tweens[i](now)) tweens.splice(i, 1); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [t.hero]);

  // Slick agency-DNA interactions: scroll progress, magnetic buttons, cursor spotlight.
  useEffect(() => {
    // ---- scroll progress bar ----
    const bar = document.querySelector(".scroll-progress");
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (bar) bar.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return () => window.removeEventListener("scroll", onScroll);

    // ---- magnetic buttons + cursor spotlight (delegated, rAF-batched) ----
    const MAG = ".pill, .theme-pill, .logo-pill";
    const SPOT = ".cell, .frame, .ph-oval, .founder-photo, .band-img";
    const MAX = 16, STRENGTH = 0.32;
    let magEl = null, rafId = 0, lastE = null;

    const apply = () => {
      rafId = 0;
      const e = lastE;
      if (!e) return;

      const spot = e.target.closest && e.target.closest(SPOT);
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        spot.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      }

      const m = e.target.closest && e.target.closest(MAG);
      if (m !== magEl) { if (magEl) magEl.style.transform = ""; magEl = m; }
      if (magEl) {
        const r = magEl.getBoundingClientRect();
        let dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        let dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        dx = Math.max(-MAX, Math.min(MAX, dx));
        dy = Math.max(-MAX, Math.min(MAX, dy));
        magEl.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
      }
    };
    const onPointer = (e) => { lastE = e; if (!rafId) rafId = requestAnimationFrame(apply); };
    const onLeaveDoc = () => { if (magEl) { magEl.style.transform = ""; magEl = null; } };
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeaveDoc);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeaveDoc);
      if (rafId) cancelAnimationFrame(rafId);
      if (magEl) magEl.style.transform = "";
    };
  }, []);

  const auroraPalette = [shade(t.accent, 0.62), shade(t.accent, 0.3), shade(t.accent, -0.1)];

  return (
    <React.Fragment>
      <div className="scroll-progress" />
      <Header isDark={isDark} onToggleTheme={() => setTweak("theme", isDark ? "light" : "dark")} />
      <main className="page">
        <Hero variant={t.hero} isDark={isDark} accent={t.accent} auroraPalette={auroraPalette} />
        <WhatWeDo />
        <Offerings />
        <Why />
        <Founder />
        <Proof />
      </main>
      <Footer />

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme} options={["light", "dark"]} onChange={(v) => setTweak("theme", v)} />
        <TweakColor label="Accent" value={t.accent} options={ACCENTS} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Hero backdrop" />
        <TweakRadio label="Style" value={t.hero} options={["aurora", "network", "editorial"]} onChange={(v) => setTweak("hero", v)} />
        <TweakSection label="Typography" />
        <TweakRadio label="Accents" value={t.type} options={["editorial", "all-sans"]} onChange={(v) => setTweak("type", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
