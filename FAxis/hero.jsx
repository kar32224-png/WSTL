/* global React, THREE */
const { useEffect, useRef } = React;

/* ============================================================
   Hero background treatments
   ============================================================ */

// ---- 1. Aurora: custom screen-space ribbon shader (FAxis blue) ----
const FRAG = `
precision highp float;
uniform float iTime,isDark,iScroll;
uniform vec2 iResolution;
uniform vec3 cA,cB,cC;
void main(){
  vec2 su=gl_FragCoord.xy/iResolution.xy;
  float ar=iResolution.x/iResolution.y;
  vec2 p=vec2((su.x-0.5)*ar, su.y-0.5);
  float t=iTime*0.14 + iScroll*0.8;
  vec3 col=vec3(0.0); float alpha=0.0;
  for(int i=0;i<4;i++){
    float fi=float(i);
    float cy = (0.16 - 0.085*fi)
             + sin(p.x*1.15 + t + fi*1.9)*0.17
             + sin(p.x*2.6 - t*1.25 + fi*0.7)*0.06;
    float d=abs(p.y-cy);
    float band=exp(-d*d*(20.0-fi*3.2));
    vec3 c = fi<1.0?cA : (fi<2.0?cB : (fi<3.0?cC : mix(cA,cC,0.5)));
    col+=c*band; alpha+=band*(1.0-fi*0.12);
  }
  float rightBias=smoothstep(-0.5,1.1,p.x);
  float topFade=smoothstep(0.02,0.4,su.y);
  alpha=clamp(alpha,0.0,1.0)*rightBias*topFade;
  col*=1.45;
  if(isDark<0.5){ col=mix(vec3(1.0),col*0.8,0.65); alpha*=0.45; }
  gl_FragColor=vec4(col, alpha*(isDark>0.5?0.92:0.7));
}`;
const VERT = `void main(){gl_Position=vec4(position,1.0);}`;

function hexRgb(h) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [0, 0, 0];
}

function AuroraBg({ isDark, palette }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !window.THREE) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const [a, b, c] = palette;
    const uniforms = {
      iTime: { value: 0 }, isDark: { value: isDark ? 1 : 0 }, iScroll: { value: 0 },
      iResolution: { value: new THREE.Vector2(1, 1) },
      cA: { value: new THREE.Vector3(...hexRgb(a)) },
      cB: { value: new THREE.Vector3(...hexRgb(b)) },
      cC: { value: new THREE.Vector3(...hexRgb(c)) },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      const bb = renderer.getDrawingBufferSize(new THREE.Vector2());
      uniforms.iResolution.value.set(bb.x, bb.y);
    }
    resize();
    window.addEventListener("resize", resize);
    const onScroll = () => {
      const pr = Math.min(1, window.scrollY / window.innerHeight);
      uniforms.iScroll.value = pr * pr * (3 - 2 * pr);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf, start = performance.now();
    const loop = () => { uniforms.iTime.value = (performance.now() - start) / 1000; renderer.render(scene, camera); raf = requestAnimationFrame(loop); };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("scroll", onScroll); renderer.dispose(); mat.dispose(); };
  }, [isDark, palette.join()]);
  return React.createElement("canvas", { ref });
}

// ---- 2. Network constellation (canvas 2D) ----
function NetworkBg({ isDark, accent }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w, h, nodes = [], raf;
    const ac = hexRgb(accent).map((x) => Math.round(x * 255));
    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.floor((w * h) / 15000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.8, hub: Math.random() > 0.86,
      }));
    }
    resize(); window.addEventListener("resize", resize);
    const DIST = 155;
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > w) n.vx *= -1; if (n.y < 0 || n.y > h) n.vy *= -1; }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < DIST) { const o = (1 - d / DIST) * (isDark ? 0.34 : 0.22); ctx.strokeStyle = `rgba(${ac[0]},${ac[1]},${ac[2]},${o})`; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? n.r * 2.1 : n.r, 0, 7); ctx.fillStyle = n.hub ? `rgba(${ac[0]},${ac[1]},${ac[2]},${isDark ? 0.95 : 0.8})` : `rgba(${ac[0]},${ac[1]},${ac[2]},${isDark ? 0.55 : 0.42})`; ctx.fill(); if (n.hub) { ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, 7); ctx.fillStyle = `rgba(${ac[0]},${ac[1]},${ac[2]},0.07)`; ctx.fill(); } }
      raf = requestAnimationFrame(frame);
    }
    frame();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [isDark, accent]);
  return React.createElement("canvas", { ref, style: { width: "100%", height: "100%", maskImage: "radial-gradient(ellipse 85% 78% at 66% 44%, #000 28%, transparent 82%)", WebkitMaskImage: "radial-gradient(ellipse 85% 78% at 66% 44%, #000 28%, transparent 82%)" } });
}

function Hero({ variant, isDark, accent, auroraPalette }) {
  let bg;
  if (variant === "aurora") bg = React.createElement(AuroraBg, { isDark, palette: auroraPalette });
  else if (variant === "network") bg = React.createElement(NetworkBg, { isDark, accent });
  else bg = React.createElement("div", { className: "hero-grid" });

  return (
    <section className="hero" id="top">
      <div className="hero-bg">{bg}</div>
      <div className="hero-inner">
        <h1>
          <span className="row"><span>Get in</span></span>
          <span className="row"><span>the door</span></span>
          <span className="row"><span className="serif">faster.</span></span>
        </h1>
        <p className="hero-sub">
          AI-powered executive discovery intelligence and strategic account acceleration —
          reaching the right buying centers before outreach begins.
        </p>
      </div>
      <div className="hero-scroll"><span>Scroll</span><span className="ln" /></div>
    </section>
  );
}

window.Hero = Hero;
