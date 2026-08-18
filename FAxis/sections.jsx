/* global React */
const { useEffect: useEff, useRef: useR, useState: useS } = React;

/* ---------- icons ---------- */
function Sun() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>); }
function Moon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"/></svg>); }
function ArrowUR({ s = 24 }) { return (<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>); }

const NAV = [
  { label: "What we do", href: "#what" },
  { label: "Offerings", href: "#offerings" },
  { label: "Why FAxis", href: "#why" },
  { label: "Founder", href: "#founder" },
  { label: "Contact", href: "#contact" },
];

/* ============================================================
   HEADER — floating pills + dropdown
   ============================================================ */
function Header({ isDark, onToggleTheme }) {
  const [open, setOpen] = useS(false);
  const [active, setActive] = useS("What we do");

  useEff(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight / 3;
      if (window.scrollY > 200 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120) { setActive("Contact"); return; }
      let cur = NAV[0].label;
      for (const n of NAV) {
        const el = document.querySelector(n.href);
        if (el && n.href !== "#contact" && el.offsetTop <= y) cur = n.label;
      }
      setActive(cur);
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="hdr">
      <div className="shell">
        <a className="logo-pill" href="#top" aria-label="FAxis Advisory Group">
          <img className="logo-img" src="assets/faxis-logo.png" alt="FAxis" />
        </a>
        <div className="hdr-right">
          <button className="theme-pill" onClick={onToggleTheme} aria-label="Toggle theme">{isDark ? <Sun /> : <Moon />}</button>
          <div className="menu-pill" style={{ height: open ? "auto" : 64 }}>
            <button className="menu-toggle" onClick={() => setOpen(!open)}>
              <span>{active}</span>
              <span className={"menu-x" + (open ? " open" : "")}><span /><span /></span>
            </button>
            {open && (
              <ul className="menu-list">
                {NAV.map((n) => (
                  <li key={n.label}>
                    <a href={n.href} className={active === n.label ? "active" : ""} onClick={() => { setOpen(false); setActive(n.label); }}>{n.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   WHAT WE DO — pinned scaling headline + flowing menu
   ============================================================ */
const capabilities = [
  "Executive Discovery Intelligence",
  "Strategic Account Acceleration",
  "Ecosystem GTM Advisory",
  "Transformation Readiness",
];

function FlowItem({ title, index }) {
  const fillRef = useR(null), innerRef = useR(null), itemRef = useR(null);
  const edge = (e) => {
    const r = itemRef.current.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const top = (x - r.width / 2) ** 2 + y ** 2;
    const bot = (x - r.width / 2) ** 2 + (y - r.height) ** 2;
    return top < bot ? "-101%" : "101%";
  };
  const enter = (e) => {
    const o = edge(e);
    fillRef.current.style.transition = "none"; innerRef.current.style.transition = "none";
    fillRef.current.style.transform = `translateY(${o})`; innerRef.current.style.transform = `translateY(${o === "-101%" ? "101%" : "-101%"})`;
    void fillRef.current.offsetWidth;
    fillRef.current.style.transition = "transform .5s cubic-bezier(.22,1,.36,1)"; innerRef.current.style.transition = "transform .5s cubic-bezier(.22,1,.36,1)";
    fillRef.current.style.transform = "translateY(0%)"; innerRef.current.style.transform = "translateY(0%)";
  };
  const leave = (e) => {
    const o = edge(e);
    fillRef.current.style.transform = `translateY(${o})`; innerRef.current.style.transform = `translateY(${o === "-101%" ? "101%" : "-101%"})`;
  };
  return (
    <div className="flow-item" ref={itemRef}>
      <a className="flow-link" href="#offerings" onMouseEnter={enter} onMouseLeave={leave}>
        <span className="ttl">{title}</span>
        <span className="num">0{index + 1}</span>
      </a>
      <div className="flow-fill" ref={fillRef}>
        <div className="flow-fill-inner" ref={innerRef}>
          <span className="ttl">{title}</span>
          <ArrowUR />
        </div>
      </div>
    </div>
  );
}

function WhatWeDo() {
  const headRef = useR(null);
  useEff(() => {
    const el = headRef.current; if (!el) return;
    const chars = el.querySelectorAll(".char");
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress as the headline travels through the viewport center
      const p = Math.min(1, Math.max(0, 1 - (r.top + r.height / 2) / vh + 0.25));
      const n = chars.length;
      chars.forEach((c, i) => {
        const cp = Math.min(1, Math.max(0, (p - (i / n) * 0.6) / 0.4));
        c.style.transform = `scaleY(${0.05 + cp * 0.95})`;
        c.style.opacity = 0.12 + cp * 0.88;
      });
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headline = "We get you in the door. Sharper, faster, repeatable.";
  return (
    <section className="wwd" id="what">
      <div className="wwd-pin">
        <h2 ref={headRef}>
          {headline.split("").map((ch, i) => (
            <span className="char" key={i} style={{ whiteSpace: ch === " " ? "pre" : "normal" }}>{ch}</span>
          ))}
        </h2>
      </div>
      <div className="flow">
        {capabilities.map((c, i) => <FlowItem key={i} title={c} index={i} />)}
      </div>
    </section>
  );
}

/* ============================================================
   OFFERINGS — marquee + alternating rows
   ============================================================ */
const offerings = [
  {
    n: "01", up: "Discovery Intelligence", down: "Brief", tm: "™",
    sub: "Executive Account Intelligence & Strategic GTM Alignment",
    desc: "AI-powered executive intelligence that prepares your team for high-value discovery conversations before outreach begins — executive research, organizational intelligence, and GTM alignment.",
    tags: ["Executive priorities", "Organizational friction", "Engagement pathways"],
    media: { type: "frame", src: "assets/discovery-workflow.webp", alt: "FAxis Discovery Intelligence workflow" },
  },
  {
    n: "02", up: "Discovery", down: "Partners", tm: "™",
    sub: "Embedded GTM Acceleration & Executive Access",
    desc: "Hands-on partnership embedded alongside your team — pairing executive alignment with ecosystem-based prospecting to open and accelerate strategic accounts.",
    tags: ["Executive alignment", "Ecosystem co-prospecting", "Growth advisory"],
    media: { type: "oval", label: "Add engagement photo" },
  },
  {
    n: "03", up: "FAxis", down: "Five", tm: "™",
    sub: "Executive Intelligence & Account Acceleration in 30 Minutes",
    desc: "A fast, intensive AI-powered engagement — account intelligence, executive research, and transformation mapping, distilled into one focused sprint.",
    tags: ["Account intelligence", "Transformation mapping", "Stakeholder read"],
    media: { type: "frame", src: "assets/account-prioritization.webp", alt: "Strategic Account Prioritization tool" },
  },
];

function OfferRow({ o, flip }) {
  const mediaRef = useR(null), imgRef = useR(null);
  const move = (e) => {
    if (!imgRef.current) return;
    const r = mediaRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    imgRef.current.style.transform = `scale(1.06) translate(${-x * 14}px, ${-y * 14}px)`;
  };
  const reset = () => { if (imgRef.current) imgRef.current.style.transform = ""; };
  return (
    <div className={"row reveal" + (flip ? " flip" : "")}>
      <div className="row-media" ref={mediaRef} onMouseMove={move} onMouseLeave={reset}>
        {o.media.type === "frame" ? (
          <div className="frame">
            <div className="bar"><i /><i /><i /></div>
            <div className="shot"><img ref={imgRef} src={o.media.src} alt={o.media.alt} loading="lazy" /></div>
          </div>
        ) : (
          <div className="ph-oval"><span className="lbl">{o.media.label}</span></div>
        )}
      </div>
      <div className="row-body">
        <span className="num">{o.n} — Offering</span>
        <h3>{o.up}<span className="serif">{o.down}<span className="tm">{o.tm}</span></span></h3>
        <p className="sub">{o.sub}</p>
        <p className="desc">{o.desc}</p>
        <div className="tags">{o.tags.map((t, i) => <span key={i}>{t}</span>)}</div>
      </div>
    </div>
  );
}

function Offerings() {
  const marquee = [];
  for (let i = 0; i < 4; i++) marquee.push(
    <span key={i}>Three&nbsp;Ways&nbsp;<span className="serif">In</span>&nbsp;·&nbsp;</span>
  );
  return (
    <section className="offerings" id="offerings">
      <div className="marquee"><div className="marquee-track">{marquee}</div></div>
      {offerings.map((o, i) => <OfferRow key={i} o={o} flip={i % 2 === 1} />)}
    </section>
  );
}

/* ============================================================
   WHY FAxis
   ============================================================ */
function Why() {
  return (
    <section className="why" id="why">
      <div className="shell">
        <div className="band-img reveal"><span className="lbl">Add a wide brand image</span></div>
        <h2 className="reveal">Most enterprise sellers don't fail for lack of product — they stall because they can't reach the right people. <span className="serif">FAxis exists to fix that.</span></h2>
        <a className="pill pill-accent reveal" href="#contact">Start a conversation <ArrowUR s={18} /></a>
      </div>
    </section>
  );
}

/* ============================================================
   FOUNDER
   ============================================================ */
function Founder() {
  return (
    <section className="founder" id="founder">
      <div className="row reveal">
        <div className="row-media">
          <div className="founder-photo"><img src="assets/founder.webp" alt="Olufemi Adedeji, Founder of FAxis Advisory Group" loading="lazy" /></div>
        </div>
        <div className="founder-body">
          <p className="role">Founder & Principal Advisor</p>
          <h2>Olufemi <span className="serif">"Femi"</span> Adedeji</h2>
          <p className="quote">"The hardest part of enterprise selling isn't the pitch — it's <span className="serif">getting in the door.</span> FAxis exists to make that part faster, sharper, and repeatable."</p>
          <p className="bio">Femi has spent two decades helping organizations win complex, high-stakes enterprise accounts across the Microsoft ecosystem and beyond — bridging executive strategy, GTM execution, and transformation leadership.</p>
          <p className="bio">He founded FAxis to turn hard-won enterprise instinct into an AI-powered, intelligence-led practice — so more teams reach the right buying centers with the right message, before the competition does.</p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROOF — bento
   ============================================================ */
function Proof() {
  return (
    <section className="proof">
      <div className="shell">
        <div className="proof-head reveal">
          <h2>Built on enterprise instinct, <span className="serif">proven in the room.</span></h2>
          <a className="pill pill-ghost" href="#contact">Work with FAxis <ArrowUR s={18} /></a>
        </div>
        <div className="bento">
          <div className="cell reveal"><div className="v">20<span className="serif">+</span></div><div className="l">Years of enterprise GTM & transformation leadership</div></div>
          <div className="cell span2 accent reveal">
            <div className="qmark">"</div>
            <blockquote>Get in the door faster — with sharper positioning, AI-powered intelligence, and ecosystem-aware advisory.</blockquote>
            <div className="who">The FAxis operating thesis</div>
          </div>
          <div className="cell reveal"><div className="v">30<span className="serif"> min</span></div><div className="l">From cold account to actionable intelligence</div></div>
          <div className="cell reveal"><div className="v">Top&nbsp;1%</div><div className="l">Strategic buying-center access</div></div>
          <div className="cell reveal"><div className="v">3</div><div className="l">Engagement models — from rapid sprint to embedded</div></div>
          <div className="cell span2 reveal"><div className="tagline">Microsoft ecosystem native</div><blockquote style={{ fontWeight: 500 }}>Advisory built for partners selling into and across the Microsoft ecosystem.</blockquote><div className="who" style={{ color: "var(--muted-fg)" }}>Azure · Dynamics · Power Platform · Copilot</div></div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  return (
    <footer className="foot" id="contact">
      <div className="shell foot-top">
        <p className="eyebrow">Get started</p>
        <a className="foot-mail" href="mailto:hello@faxisavg.com">hello@faxisavg.com</a>
        <div><a className="pill" href="mailto:hello@faxisavg.com">Book a FAxis Five™ <ArrowUR s={18} /></a></div>
      </div>
      <div className="shell"><div className="foot-hr" /></div>
      <div className="shell foot-grid">
        <div className="foot-brand">
          <img className="foot-logo" src="assets/faxis-logo.png" alt="FAxis Advisory Group" />
          <p>Get in the door, faster.</p>
        </div>
        <div className="foot-cols">
          <div className="foot-col">
            <h5>Offerings</h5>
            <ul>
              <li><a href="#offerings">Discovery Intelligence Brief™</a></li>
              <li><a href="#offerings">Discovery Partners™</a></li>
              <li><a href="#offerings">FAxis Five™</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#what">What we do</a></li>
              <li><a href="#why">Why FAxis</a></li>
              <li><a href="#founder">Founder</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="mailto:hello@faxisavg.com">hello@faxisavg.com</a></li>
              <li><span>United States</span></li>
              <li><span>Serving clients globally</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="shell"><div className="foot-hr" /></div>
      <div className="shell foot-bar">
        <span>© 2026 FAxis Advisory Group LLC</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Header, WhatWeDo, Offerings, Why, Founder, Proof, Footer });
