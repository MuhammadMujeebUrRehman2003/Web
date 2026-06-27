/*!
 * PORTFOLIO CANVAS ANIMATIONS v5.0 — Mujeeb Portfolio
 * Seven bespoke WebGL-quality 2D canvas scenes.
 * Zero dependencies. Pure Canvas 2D + offscreen compositing.
 *
 * Scenes:
 *  hero          — Aurora Plasma (northern‑lights ribbons + starfield)
 *  about         — Magnetic Flow Field (curl‑noise particle trails)
 *  skills        — GPU-style scan-line geometry dissolve
 *  experience    — Orbital orrery — nested elliptical paths with moons
 *  projects      — Reactive waveform spectrum — sine superposition
 *  certifications— Sacred geometry bloom — phi-spiral mandala
 *  contact       — Bioluminescent depth-charge ripple field
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const rand = (a, b) => Math.random() * (b - a) + a;
  const easeInOut = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

  /* ── colour palette ───────────────────────────────────────────────────── */
  function P() {
    const dark = document.documentElement.dataset.theme !== 'light';
    return {
      dark,
      bg:     dark ? '#05050a' : '#f3f4f6',
      a:      dark ? '#00ffb3' : '#00915e',   /* primary accent  */
      b:      dark ? '#7c6fff' : '#4c3dcc',   /* violet          */
      c:      dark ? '#ff6b9d' : '#c2185b',   /* rose            */
      d:      dark ? '#30d5f5' : '#0288d1',   /* cyan            */
      e:      dark ? '#ffb347' : '#e65100',   /* amber           */
      dim:    dark ? 'rgba(5,5,10,'   : 'rgba(243,244,246,',
    };
  }

  /* ── canvas setup ─────────────────────────────────────────────────────── */
  function setup(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H;
    function resize() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
    }
    resize();
    window.addEventListener('resize', resize);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const getWH = () => [canvas.offsetWidth, canvas.offsetHeight];
    return { ctx, dpr, getWH };
  }

  /* ── hex → [r,g,b] ───────────────────────────────────────────────────── */
  function rgb(hex) {
    const h = hex.replace('#','');
    const n = parseInt(h,16);
    return [(n>>16)&255,(n>>8)&255,n&255];
  }
  function rgba(hex, a) {
    const [r,g,b] = rgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ══════════════════════════════════════════════════════════════════════
     SCENE 1 — HERO  "Aurora Plasma"
     Flowing northern-lights ribbons built with layered sine-modulated
     bezier curves, over a slowly drifting star field.
  ══════════════════════════════════════════════════════════════════════ */
  function sceneHero(canvas) {
    const { ctx, getWH } = setup(canvas);
    const pal = P();
    // map palette to the colours expected by the original scene
    const accent  = pal.a;
    const accent2 = pal.b;
    const cyan    = pal.d;
    const purple  = pal.b;
    const pink    = pal.c;
    const bg      = pal.bg;

    let mx = 0.5, my = 0.5;

    /* stars */
    const STARS = 220;
    const stars = Array.from({ length: STARS }, () => ({
      x: Math.random(), y: Math.random(),
      r: rand(0.4, 1.8),
      twinkle: Math.random() * TAU,
      speed: rand(0.4, 1.2),
    }));

    /* aurora bands */
    const BANDS = 6;
    const bandColors = [
      accent, accent2, cyan, purple, pink, accent,
    ];
    const bandPhases = Array.from({ length: BANDS }, (_, i) => i * (TAU / BANDS));
    const bandYBase  = Array.from({ length: BANDS }, (_, i) => 0.25 + i * 0.08);
    const bandAmp    = Array.from({ length: BANDS }, () => rand(0.04, 0.10));
    const bandFreq   = Array.from({ length: BANDS }, () => rand(0.6, 1.4));
    const bandSpeed  = Array.from({ length: BANDS }, () => rand(0.15, 0.45));

    /* mouse parallax particles */
    const DOTS = 60;
    const dots = Array.from({ length: DOTS }, () => ({
      x: Math.random(), y: Math.random(),
      vx: rand(-0.06, 0.06), vy: rand(-0.04, 0.04),
      size: rand(1.5, 4),
      hue: [accent, cyan, purple][Math.floor(Math.random() * 3)],
      alpha: rand(0.2, 0.7),
    }));

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top)  / r.height;
    });

    let raf;
    function tick(ts) {
      raf = requestAnimationFrame(tick);
      const t  = ts * 0.001;
      const [W, H] = getWH();
      ctx.clearRect(0, 0, W, H);

      /* stars */
      stars.forEach(s => {
        s.twinkle += 0.015 * s.speed;
        const a = 0.3 + 0.5 * Math.abs(Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, TAU);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });

      /* aurora ribbons */
      for (let b = 0; b < BANDS; b++) {
        const phase  = bandPhases[b] + t * bandSpeed[b];
        const yBase  = bandYBase[b] + (my - 0.5) * 0.06;
        const amp    = bandAmp[b] * H;
        const freq   = bandFreq[b];
        const color  = bandColors[b];

        const SEGS = 40;
        ctx.beginPath();
        /* top edge */
        for (let i = 0; i <= SEGS; i++) {
          const px  = (i / SEGS) * W;
          const off = Math.sin((i / SEGS) * TAU * freq + phase) * amp
                    + Math.sin((i / SEGS) * TAU * freq * 2.3 + phase * 1.4) * amp * 0.3;
          const py  = yBase * H + off;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        /* bottom edge (reversed) */
        const thick = 0.03 + 0.02 * Math.sin(t * 0.5 + b);
        for (let i = SEGS; i >= 0; i--) {
          const px  = (i / SEGS) * W;
          const off = Math.sin((i / SEGS) * TAU * freq + phase) * amp
                    + Math.sin((i / SEGS) * TAU * freq * 2.3 + phase * 1.4) * amp * 0.3;
          const py  = yBase * H + off + thick * H;
          ctx.lineTo(px, py);
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0,   `${color}00`);
        grad.addColorStop(0.2, `${color}${Math.floor(0.35 * 255).toString(16).padStart(2,'0')}`);
        grad.addColorStop(0.5, `${color}${Math.floor(0.55 * 255).toString(16).padStart(2,'0')}`);
        grad.addColorStop(0.8, `${color}${Math.floor(0.35 * 255).toString(16).padStart(2,'0')}`);
        grad.addColorStop(1,   `${color}00`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      /* floating dots */
      dots.forEach(d => {
        d.x += d.vx * 0.0004 + (mx - 0.5) * 0.0001;
        d.y += d.vy * 0.0003 + (my - 0.5) * 0.00008;
        if (d.x < 0) d.x = 1; if (d.x > 1) d.x = 0;
        if (d.y < 0) d.y = 1; if (d.y > 1) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.size, 0, TAU);
        ctx.fillStyle = d.hue + Math.floor(d.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
    }
    requestAnimationFrame(tick);
    canvas._stop = () => cancelAnimationFrame(raf);
  }

  /* ══════════════════════════════════════════════════════════════════════
     SCENE 2 — ABOUT  "Magnetic Flow Field"
     Thousands of tiny particles that follow a curl-noise vector field,
     leaving glowing trails — like iron filings around an invisible magnet.
  ══════════════════════════════════════════════════════════════════════ */
function sceneAbout(canvas) {
  const { ctx, dpr, getWH } = setup(canvas);
  const pal = P();
  const accent  = pal.a;
  const cyan    = pal.d;
  const purple  = pal.b;
  const accent2 = pal.b;

  const PARTICLES = 1400;
  let [W, H] = getWH();
  const px  = new Float32Array(PARTICLES).map(() => Math.random() * W);
  const py  = new Float32Array(PARTICLES).map(() => Math.random() * H);
  const age = new Float32Array(PARTICLES).map(() => Math.floor(Math.random() * 200));

  function fieldAngle(x, y, t) {
    const nx = x * 0.003, ny = y * 0.003;
    return (
      Math.sin(nx + t * 0.4) * Math.cos(ny * 1.3 - t * 0.2) * TAU +
      Math.sin(nx * 2.1 - t * 0.3) * 0.5
    );
  }

  const palette = [accent, cyan, purple, accent2];
  const pColor  = Array.from({ length: PARTICLES }, () =>
    palette[Math.floor(Math.random() * palette.length)]
  );
  const MAX_AGE = 220;

  let mx = W / 2, my = H / 2;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });

  const trail = document.createElement('canvas');
  const tc = trail.getContext('2d');
  function syncTrail() {
    [W, H] = getWH();
    trail.width  = canvas.width;
    trail.height = canvas.height;
  }
  syncTrail();
  window.addEventListener('resize', syncTrail);

  let raf;
  function tick(ts) {
    raf = requestAnimationFrame(tick);
    const t = ts * 0.001;

    // CORRECTED: use pal.dark to choose the right fade colour
    const fadeColor = pal.dark ? 'rgba(5,5,10,0.18)' : 'rgba(243,244,246,0.18)';
    tc.fillStyle = fadeColor;
    tc.fillRect(0, 0, trail.width, trail.height);

    const scale = dpr;
    for (let i = 0; i < PARTICLES; i++) {
      age[i]++;
      if (age[i] > MAX_AGE || px[i] < 0 || px[i] > W || py[i] < 0 || py[i] > H) {
        px[i] = Math.random() * W;
        py[i] = Math.random() * H;
        age[i] = 0;
      }
      const dx = mx - px[i], dy = my - py[i];
      const d  = Math.sqrt(dx * dx + dy * dy) + 1;
      const attract = Math.min(60 / d, 0.5);

      const angle = fieldAngle(px[i], py[i], t);
      const speed = 0.9;
      px[i] += Math.cos(angle) * speed + dx / d * attract;
      py[i] += Math.sin(angle) * speed + dy / d * attract;

      const lifeRatio = age[i] / MAX_AGE;
      const a = Math.sin(lifeRatio * Math.PI) * 0.65;
      tc.fillStyle = pColor[i] + Math.floor(a * 255).toString(16).padStart(2, '0');
      tc.fillRect(px[i] * scale, py[i] * scale, 1.5, 1.5);
    }

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(trail, 0, 0, W, H);
  }
  requestAnimationFrame(tick);
  canvas._stop = () => cancelAnimationFrame(raf);
}

  /* ══════════════════════════════════════════════════════════════════════
     SCENE 3 — SKILLS: Scan-line geometry dissolve
     A grid of geometric primitives (triangles, squares, circles)
     that rotate, scale and swap on a scan-line sweep — like a GPU
     shader dissolve.
  ══════════════════════════════════════════════════════════════════════ */
  function sceneSkills(canvas) {
    const {ctx,getWH} = setup(canvas);
    const pal = P();
    const COLS=12, ROWS=7;
    const SHAPES=['circle','tri','sq','hex','diamond'];

    let cells=[], W=0, H=0;
    function build(w,h){
      W=w; H=h;
      const cw=w/COLS, ch=h/ROWS;
      cells=[];
      for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
        const idx=r*COLS+c;
        cells.push({
          cx:(c+0.5)*cw, cy:(r+0.5)*ch,
          cw, ch,
          shape:SHAPES[idx%SHAPES.length],
          nextShape:SHAPES[(idx+2)%SHAPES.length],
          hue: (idx/cells.length||0)*340,
          rot:rand(0,TAU), rotV:rand(-0.008,0.008),
          scale:0.55, targetScale:0.55,
          dissolve:0, phase:rand(0,TAU),
          scanState:0,
        });
      }
    }
    const [iW,iH]=getWH(); build(iW,iH);
    window.addEventListener('resize',()=>{ const [w,h]=getWH(); build(w,h); });

    let mx=0, my=0;
    canvas.addEventListener('mousemove',e=>{
      const r=canvas.getBoundingClientRect();
      mx=e.clientX-r.left; my=e.clientY-r.top;
    });

    function drawShape(type,size){
      ctx.beginPath();
      if(type==='circle'){
        ctx.arc(0,0,size,0,TAU);
      } else if(type==='tri'){
        for(let i=0;i<3;i++){
          const a=(i/3)*TAU-Math.PI/2;
          i===0?ctx.moveTo(Math.cos(a)*size,Math.sin(a)*size)
               :ctx.lineTo(Math.cos(a)*size,Math.sin(a)*size);
        }
        ctx.closePath();
      } else if(type==='sq'){
        ctx.rect(-size,-size,size*2,size*2);
      } else if(type==='hex'){
        for(let i=0;i<6;i++){
          const a=(i/6)*TAU;
          i===0?ctx.moveTo(Math.cos(a)*size,Math.sin(a)*size)
               :ctx.lineTo(Math.cos(a)*size,Math.sin(a)*size);
        }
        ctx.closePath();
      } else {
        ctx.moveTo(0,-size); ctx.lineTo(size*0.6,0);
        ctx.lineTo(0,size); ctx.lineTo(-size*0.6,0);
        ctx.closePath();
      }
    }

    let scanX=0;
    let raf;
    function tick(ts) {
      raf=requestAnimationFrame(tick);
      const t=ts*0.001;
      const [cW,cH]=getWH();
      ctx.clearRect(0,0,cW,cH);

      /* scan line advances */
      scanX = (scanX+1.2)%(cW+80);

      cells.forEach(cell=>{
        const dx=cell.cx-mx, dy=cell.cy-my;
        const dist=Math.sqrt(dx*dx+dy*dy);
        const hover=dist<90;

        /* scan-line dissolve: when scanX crosses cell */
        if(Math.abs(scanX-cell.cx)<cell.cw*0.6 && cell.scanState===0){
          cell.scanState=1;
          cell.dissolveDir=1;
          setTimeout(()=>{
            cell.shape=cell.nextShape;
            cell.nextShape=SHAPES[Math.floor(Math.random()*SHAPES.length)];
            cell.hue=(cell.hue+rand(40,90))%360;
            cell.dissolveDir=-1;
            setTimeout(()=>cell.scanState=0,400);
          },200);
        }

        cell.dissolve=clamp(cell.dissolve+(cell.dissolveDir||0)*0.05,0,1);
        cell.rot+=cell.rotV*(1+hover*2);
        cell.targetScale=hover?0.75:0.5;
        cell.scale=lerp(cell.scale,cell.targetScale,0.08);

        const size=Math.min(cell.cw,cell.ch)*cell.scale;
        const dissolveOff=cell.dissolve*cell.cw*0.4*(cell.dissolveDir>0?1:-1);

        ctx.save();
        ctx.translate(cell.cx+dissolveOff, cell.cy);
        ctx.rotate(cell.rot);
        ctx.globalAlpha=1-cell.dissolve*0.6;

        const lum=pal.dark?60:42;
        const alpha=pal.dark?(hover?0.55:0.2):(hover?0.45:0.18);
        ctx.strokeStyle=`hsla(${cell.hue},85%,${lum}%,${alpha+(Math.sin(t*1.5+cell.phase)*0.08)})`;
        ctx.lineWidth=hover?1.4:0.8;
        ctx.fillStyle=`hsla(${cell.hue},70%,${lum}%,${alpha*0.18})`;
        drawShape(cell.shape, size);
        ctx.fill(); ctx.stroke();

        ctx.restore();
      });

      /* scan-line beam */
      const beamGrad=ctx.createLinearGradient(scanX-30,0,scanX+8,0);
      beamGrad.addColorStop(0,rgba(pal.a,0));
      beamGrad.addColorStop(0.7,rgba(pal.a,pal.dark?0.12:0.08));
      beamGrad.addColorStop(1,rgba(pal.a,0));
      ctx.fillStyle=beamGrad;
      ctx.fillRect(scanX-30,0,38,cH);
    }
    requestAnimationFrame(tick);
    canvas._stop=()=>cancelAnimationFrame(raf);
  }

  /* ══════════════════════════════════════════════════════════════════════
     SCENE 4 — EXPERIENCE: Orbital Orrery
     Nested elliptical orbits with moons, Keplerian motion
     (variable speed — faster near centre), trails, and an
     animated starburst sun at centre.
  ══════════════════════════════════════════════════════════════════════ */
  function sceneExperience(canvas) {
    const {ctx,getWH} = setup(canvas);
    const pal = P();

    const PLANETS = [
      {a:0.10,b:0.07,period:5.2, r:6,  hue:200, moons:0, tilt:0.1},
      {a:0.18,b:0.12,period:8.7, r:9,  hue:140, moons:1, tilt:0.25},
      {a:0.27,b:0.18,period:13,  r:7,  hue:30,  moons:2, tilt:-0.15},
      {a:0.37,b:0.24,period:21,  r:11, hue:290, moons:1, tilt:0.3},
      {a:0.46,b:0.30,period:34,  r:8,  hue:60,  moons:3, tilt:-0.1},
    ];

    PLANETS.forEach(p=>{
      p.angle=rand(0,TAU);
      p.moonAngles=Array.from({length:p.moons},()=>rand(0,TAU));
    });

    /* planet trails */
    PLANETS.forEach(p=>{p.trail=[];});

    let mx=0.5,my=0.5;
    canvas.addEventListener('mousemove',e=>{
      const r=canvas.getBoundingClientRect();
      const [W,H]=getWH();
      mx=(e.clientX-r.left)/W-0.5;
      my=(e.clientY-r.top)/H-0.5;
    });

    let raf;
    function tick(ts){
      raf=requestAnimationFrame(tick);
      const t=ts*0.001;
      const [W,H]=getWH();
      ctx.clearRect(0,0,W,H);

      const cx=W/2+mx*20, cy=H/2+my*14;
      const scale=Math.min(W,H);

      /* sun */
      const sunR=scale*0.028;
      const sg=ctx.createRadialGradient(cx,cy,0,cx,cy,sunR*3.5);
      const sunHue=40;
      sg.addColorStop(0,`hsla(${sunHue},100%,98%,1)`);
      sg.addColorStop(0.2,`hsla(${sunHue},100%,80%,0.9)`);
      sg.addColorStop(0.6,`hsla(${sunHue},90%,55%,0.4)`);
      sg.addColorStop(1,`hsla(${sunHue},80%,40%,0)`);
      ctx.beginPath(); ctx.arc(cx,cy,sunR*3.5,0,TAU);
      ctx.fillStyle=sg; ctx.fill();

      /* sun spikes */
      const spikeCount=12;
      for(let i=0;i<spikeCount;i++){
        const a=(i/spikeCount)*TAU+t*0.4;
        const len=sunR*(1.8+Math.sin(t*2+i)*0.4);
        ctx.beginPath();
        ctx.moveTo(cx+Math.cos(a)*sunR*0.9, cy+Math.sin(a)*sunR*0.9);
        ctx.lineTo(cx+Math.cos(a)*len, cy+Math.sin(a)*len);
        ctx.strokeStyle=`hsla(${sunHue},100%,80%,${pal.dark?0.35:0.25})`;
        ctx.lineWidth=1; ctx.stroke();
      }

      /* orbit ellipses */
      PLANETS.forEach(p=>{
        const A=p.a*scale, B=p.b*scale;
        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(p.tilt);
        ctx.beginPath();
        ctx.ellipse(0,0,A,B,0,0,TAU);
        ctx.strokeStyle=`hsla(${p.hue},60%,${pal.dark?50:40}%,${pal.dark?0.1:0.12})`;
        ctx.lineWidth=0.7; ctx.stroke();
        ctx.restore();
      });

      /* planets */
      PLANETS.forEach(p=>{
        /* Kepler-ish: angle speed inversely proportional to distance from focus */
        const A=p.a*scale, B=p.b*scale;
        const c=Math.sqrt(Math.abs(A*A-B*B)); /* focal distance */
        /* planet position on ellipse */
        const px_local=A*Math.cos(p.angle);
        const py_local=B*Math.sin(p.angle);
        /* local speed: faster near periapsis */
        const r_focal=Math.sqrt((px_local-c)**2+py_local**2)+1;
        const baseSpeed = TAU/(p.period*8);
        p.angle += baseSpeed*(A*1.1/r_focal);

        /* world position */
        const cosT=Math.cos(p.tilt), sinT=Math.sin(p.tilt);
        const wx=cx+px_local*cosT-py_local*sinT;
        const wy=cy+px_local*sinT+py_local*cosT;

        /* trail */
        p.trail.push({x:wx,y:wy});
        if(p.trail.length>55) p.trail.shift();
        for(let i=1;i<p.trail.length;i++){
          const frac=i/p.trail.length;
          ctx.beginPath();
          ctx.moveTo(p.trail[i-1].x,p.trail[i-1].y);
          ctx.lineTo(p.trail[i].x,p.trail[i].y);
          ctx.strokeStyle=`hsla(${p.hue},90%,${pal.dark?65:40}%,${frac*0.5})`;
          ctx.lineWidth=frac*2.5; ctx.stroke();
        }

        /* planet glow */
        const pr=p.r*(scale/600);
        const pg=ctx.createRadialGradient(wx,wy,0,wx,wy,pr*2.5);
        pg.addColorStop(0,`hsla(${p.hue},90%,${pal.dark?80:55}%,1)`);
        pg.addColorStop(0.5,`hsla(${p.hue},80%,${pal.dark?60:40}%,0.5)`);
        pg.addColorStop(1,`hsla(${p.hue},70%,40%,0)`);
        ctx.beginPath(); ctx.arc(wx,wy,pr*2.5,0,TAU);
        ctx.fillStyle=pg; ctx.fill();

        /* moons */
        p.moonAngles.forEach((ma,mi)=>{
          p.moonAngles[mi]+=0.025*(mi+1);
          const mr=pr*(2.2+mi*1.4);
          const moX=wx+Math.cos(ma)*mr, moY=wy+Math.sin(ma)*mr;
          ctx.beginPath(); ctx.arc(moX,moY,pr*0.38,0,TAU);
          ctx.fillStyle=`hsla(${p.hue},60%,${pal.dark?70:55}%,0.8)`;
          ctx.fill();
          /* moon orbit ring */
          ctx.beginPath(); ctx.arc(wx,wy,mr,0,TAU);
          ctx.strokeStyle=`hsla(${p.hue},50%,50%,0.07)`;
          ctx.lineWidth=0.5; ctx.stroke();
        });
      });
    }
    requestAnimationFrame(tick);
    canvas._stop=()=>cancelAnimationFrame(raf);
  }

  /* ══════════════════════════════════════════════════════════════════════
     SCENE 5 — PROJECTS: Reactive Waveform Spectrum
     Multiple sine waves with different frequencies, amplitudes and
     phases — stacked & filled like an oscilloscope. Mouse X controls
     a "frequency modulation" parameter live. Particles ride the peaks.
  ══════════════════════════════════════════════════════════════════════ */
  function sceneProjects(canvas) {
    const {ctx,getWH} = setup(canvas);
    const pal = P();

    const WAVES = [
      {freq:1.2, amp:0.14, phase:0,   speed:0.55, hue:165, offset:0},
      {freq:2.1, amp:0.09, phase:1.2, speed:0.85, hue:195, offset:0},
      {freq:0.7, amp:0.18, phase:2.4, speed:0.35, hue:270, offset:0},
      {freq:3.4, amp:0.05, phase:0.8, speed:1.20, hue:330, offset:0},
      {freq:1.8, amp:0.12, phase:3.1, speed:0.60, hue:40,  offset:0},
    ];

    /* rider particles */
    const RIDERS=28;
    const riders=Array.from({length:RIDERS},(_,i)=>({
      xFrac: i/RIDERS,
      waveIdx: Math.floor(Math.random()*WAVES.length),
      size: rand(2,5),
      hue: rand(140,340),
      phase: rand(0,TAU),
    }));

    let mxFrac=0.5;
    canvas.addEventListener('mousemove',e=>{
      const r=canvas.getBoundingClientRect();
      mxFrac=(e.clientX-r.left)/r.width;
    });

    let raf;
    function tick(ts){
      raf=requestAnimationFrame(tick);
      const t=ts*0.001;
      const [W,H]=getWH();
      ctx.clearRect(0,0,W,H);

      const midY=H*0.5;

      /* draw each wave layer */
      WAVES.forEach((w,wi)=>{
        const fm=1+mxFrac*1.5; /* frequency mod from mouse */
        const pts=[];
        const STEPS=W;
        for(let i=0;i<=STEPS;i++){
          const x=i;
          const xFrac=i/STEPS;
          const y=midY + Math.sin(xFrac*TAU*w.freq*fm + t*w.speed + w.phase)*w.amp*H
                       + Math.sin(xFrac*TAU*w.freq*2*fm - t*w.speed*0.7)*w.amp*H*0.3;
          pts.push([x,y]);
        }

        /* filled wave */
        ctx.beginPath();
        ctx.moveTo(pts[0][0],pts[0][1]);
        pts.slice(1).forEach(([x,y])=>ctx.lineTo(x,y));
        ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath();

        const wg=ctx.createLinearGradient(0,midY-w.amp*H*1.3,0,H);
        wg.addColorStop(0,`hsla(${w.hue},85%,${pal.dark?55:40}%,${pal.dark?0.18:0.12})`);
        wg.addColorStop(1,`hsla(${w.hue},70%,40%,0)`);
        ctx.fillStyle=wg; ctx.fill();

        /* stroke */
        ctx.beginPath();
        ctx.moveTo(pts[0][0],pts[0][1]);
        pts.slice(1).forEach(([x,y])=>ctx.lineTo(x,y));
        ctx.strokeStyle=`hsla(${w.hue},90%,${pal.dark?65:42}%,${pal.dark?0.55:0.5})`;
        ctx.lineWidth=1.5; ctx.stroke();

        /* store pts for riders */
        w._pts=pts;
      });

      /* rider particles */
      riders.forEach(r=>{
        r.xFrac=(r.xFrac+0.0008)%1;
        const w=WAVES[r.waveIdx];
        if(!w._pts) return;
        const pIdx=Math.floor(r.xFrac*(w._pts.length-1));
        const [px,py]=w._pts[pIdx];
        const glow=ctx.createRadialGradient(px,py,0,px,py,r.size*3);
        glow.addColorStop(0,`hsla(${r.hue},100%,80%,0.9)`);
        glow.addColorStop(1,`hsla(${r.hue},80%,50%,0)`);
        ctx.beginPath(); ctx.arc(px,py,r.size*3,0,TAU);
        ctx.fillStyle=glow; ctx.fill();
        ctx.beginPath(); ctx.arc(px,py,r.size*0.6,0,TAU);
        ctx.fillStyle=`hsla(${r.hue},100%,95%,0.95)`;
        ctx.fill();
      });

      /* freq indicator line */
      const lx=mxFrac*W;
      ctx.beginPath(); ctx.moveTo(lx,0); ctx.lineTo(lx,H);
      ctx.strokeStyle=rgba(pal.a, pal.dark?0.12:0.1);
      ctx.lineWidth=1; ctx.stroke();
    }
    requestAnimationFrame(tick);
    canvas._stop=()=>cancelAnimationFrame(raf);
  }

  /* ══════════════════════════════════════════════════════════════════════
     SCENE 6 — CERTIFICATIONS: Sacred geometry bloom
     A phi-spiral mandala that unfolds from the centre, layer by layer.
     Each layer is a different geometric figure rotating at a prime ratio.
  ══════════════════════════════════════════════════════════════════════ */
  function sceneCertifications(canvas) {
    const {ctx,getWH} = setup(canvas);
    const pal = P();
    const PHI=1.6180339887;

    const LAYERS=[
      {n:3, rFrac:0.05, speed:0.24,  hue:160, lw:1.0},
      {n:6, rFrac:0.10, speed:-0.16, hue:200, lw:0.9},
      {n:4, rFrac:0.16, speed:0.13,  hue:260, lw:0.8},
      {n:8, rFrac:0.22, speed:-0.10, hue:300, lw:0.7},
      {n:5, rFrac:0.29, speed:0.09,  hue:40,  lw:0.6},
      {n:10,rFrac:0.37, speed:-0.07, hue:160, lw:0.5},
      {n:7, rFrac:0.46, speed:0.06,  hue:220, lw:0.45},
      {n:12,rFrac:0.56, speed:-0.05, hue:340, lw:0.4},
    ];
    LAYERS.forEach(l=>l.angle=rand(0,TAU));

    /* phi-spiral seed points */
    const SEEDS=144;
    const seeds=Array.from({length:SEEDS},(_,i)=>{
      const angle=i*TAU/PHI;
      const r=Math.sqrt(i/SEEDS);
      return {
        angle, r,
        size: rand(1,3),
        hue: (i/SEEDS)*340,
        pulse: rand(0,TAU),
      };
    });

    let mx=0,my=0;
    canvas.addEventListener('mousemove',e=>{
      const r=canvas.getBoundingClientRect();
      const [W,H]=getWH();
      mx=(e.clientX-r.left)/W-0.5;
      my=(e.clientY-r.top)/H-0.5;
    });

    let raf;
    function tick(ts){
      raf=requestAnimationFrame(tick);
      const t=ts*0.001;
      const [W,H]=getWH();
      ctx.clearRect(0,0,W,H);

      const cx=W/2+mx*15, cy=H/2+my*10;
      const scale=Math.min(W,H)*0.5;

      /* phi-spiral seeds */
      seeds.forEach((s,i)=>{
        const r=s.r*scale*0.92;
        const a=s.angle+t*0.08;
        const sx=cx+Math.cos(a)*r, sy=cy+Math.sin(a)*r;
        const pulse=0.5+0.5*Math.sin(t*1.5+s.pulse+i*0.05);
        const size=s.size*(0.6+pulse*0.8);
        const alpha=(pal.dark?0.35:0.25)*pulse;
        ctx.beginPath(); ctx.arc(sx,sy,size,0,TAU);
        ctx.fillStyle=`hsla(${s.hue},80%,${pal.dark?70:45}%,${alpha})`;
        ctx.fill();
      });

      /* concentric polygon layers */
      LAYERS.forEach(l=>{
        l.angle+=l.speed*0.007;
        const r=l.rFrac*scale;
        const alpha=pal.dark?0.30:0.22;

        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(l.angle);

        ctx.beginPath();
        for(let i=0;i<=l.n;i++){
          const a=(i/l.n)*TAU;
          i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r)
               :ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
        }
        ctx.closePath();
        ctx.strokeStyle=`hsla(${l.hue},85%,${pal.dark?65:42}%,${alpha})`;
        ctx.lineWidth=l.lw;
        ctx.stroke();

        /* star version (double) */
        ctx.beginPath();
        for(let i=0;i<l.n*2;i++){
          const a=(i/( l.n*2))*TAU;
          const rad=i%2===0?r:r*0.62;
          i===0?ctx.moveTo(Math.cos(a)*rad,Math.sin(a)*rad)
               :ctx.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);
        }
        ctx.closePath();
        ctx.strokeStyle=`hsla(${(l.hue+180)%360},70%,${pal.dark?55:38}%,${alpha*0.5})`;
        ctx.lineWidth=l.lw*0.6;
        ctx.stroke();

        ctx.restore();
      });

      /* centre bloom */
      const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,scale*0.06);
      bg.addColorStop(0,`hsla(160,100%,85%,${pal.dark?0.9:0.7})`);
      bg.addColorStop(0.5,`hsla(200,90%,60%,${pal.dark?0.3:0.2})`);
      bg.addColorStop(1,`hsla(200,80%,40%,0)`);
      ctx.beginPath(); ctx.arc(cx,cy,scale*0.06,0,TAU);
      ctx.fillStyle=bg; ctx.fill();
    }
    requestAnimationFrame(tick);
    canvas._stop=()=>cancelAnimationFrame(raf);
  }

  /* ══════════════════════════════════════════════════════════════════════
     SCENE 7 — CONTACT: Bioluminescent depth-charge ripples
     Click/hover spawns expanding ring-waves with decay. Particles
     drift upward like deep-ocean plankton. The whole field breathes.
  ══════════════════════════════════════════════════════════════════════ */
  function sceneContact(canvas) {
    const {ctx,getWH} = setup(canvas);
    const pal = P();

    const ripples=[];
    function spawnRipple(x,y,strength=1){
      ripples.push({x,y,r:0,maxR:rand(80,220)*strength,life:1,
        hue:rand(130,210), speed:rand(1.8,3.5)});
    }

    /* ambient auto-ripples */
    function autoRipple(){
      const [W,H]=getWH();
      spawnRipple(rand(W*0.1,W*0.9),rand(H*0.1,H*0.9),0.6);
    }
    const autoInterval=setInterval(autoRipple,1800);

    canvas.addEventListener('click',e=>{
      const r=canvas.getBoundingClientRect();
      spawnRipple(e.clientX-r.left,e.clientY-r.top,1.5);
    });
    canvas.addEventListener('mousemove',e=>{
      if(Math.random()<0.04){
        const r=canvas.getBoundingClientRect();
        spawnRipple(e.clientX-r.left,e.clientY-r.top,0.4);
      }
    });

    /* plankton */
    const [iW,iH]=getWH();
    const PLANKTON=90;
    const plankton=Array.from({length:PLANKTON},()=>({
      x:rand(0,iW), y:rand(0,iH),
      vy:rand(-0.15,-0.04),
      vx:rand(-0.05,0.05),
      size:rand(1,3.5),
      hue:rand(140,220),
      alpha:rand(0.1,0.6),
      pulse:rand(0,TAU),
    }));

    let raf;
    function tick(ts){
      raf=requestAnimationFrame(tick);
      const t=ts*0.001;
      const [W,H]=getWH();

      /* dim wipe */
      ctx.fillStyle=pal.dim+(pal.dark?'0.15)':'0.12)');
      ctx.fillRect(0,0,W,H);

      /* ripples */
      for(let i=ripples.length-1;i>=0;i--){
        const rp=ripples[i];
        rp.r+=rp.speed;
        rp.life=1-rp.r/rp.maxR;
        if(rp.life<=0){ ripples.splice(i,1); continue; }

        const ringCount=3;
        for(let k=0;k<ringCount;k++){
          const kr=rp.r*(1-k*0.12);
          const ka=rp.life*(1-k*0.3);
          ctx.beginPath();
          ctx.arc(rp.x,rp.y,kr,0,TAU);
          ctx.strokeStyle=`hsla(${rp.hue},90%,${pal.dark?65:42}%,${ka*0.55})`;
          ctx.lineWidth=1.5-k*0.4;
          ctx.stroke();
        }
        /* inner fill flash */
        if(rp.r<30){
          const fg=ctx.createRadialGradient(rp.x,rp.y,0,rp.x,rp.y,30);
          fg.addColorStop(0,`hsla(${rp.hue},100%,80%,${rp.life*0.35})`);
          fg.addColorStop(1,`hsla(${rp.hue},90%,50%,0)`);
          ctx.beginPath(); ctx.arc(rp.x,rp.y,30,0,TAU);
          ctx.fillStyle=fg; ctx.fill();
        }
      }

      /* plankton */
      plankton.forEach(p=>{
        p.y+=p.vy; p.x+=p.vx+Math.sin(t*0.4+p.pulse)*0.08;
        if(p.y<-10) p.y=H+5;
        if(p.x<0) p.x=W; if(p.x>W) p.x=0;
        const pulse=0.5+0.5*Math.sin(t*1.8+p.pulse);
        const pg=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*2.5);
        pg.addColorStop(0,`hsla(${p.hue},90%,${pal.dark?75:50}%,${p.alpha*(0.5+pulse*0.5)})`);
        pg.addColorStop(1,`hsla(${p.hue},80%,50%,0)`);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size*2.5,0,TAU);
        ctx.fillStyle=pg; ctx.fill();
      });
    }
    requestAnimationFrame(tick);
    canvas._stop=()=>{ cancelAnimationFrame(raf); clearInterval(autoInterval); };
  }

  /* ══════════════════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════════════════ */
  const SCENES = {
    hero:           sceneHero,
    about:          sceneAbout,
    skills:         sceneSkills,
    experience:     sceneExperience,
    projects:       sceneProjects,
    certifications: sceneCertifications,
    contact:        sceneContact,
  };

  function init() {
    document.querySelectorAll('canvas[data-three]').forEach(canvas => {
      if(canvas._stop){ canvas._stop(); canvas._stop=null; }
      const fn=SCENES[canvas.dataset.three];
      if(fn) fn(canvas);
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  } else {
    init();
  }
  window.initThreeCanvases=init;

})();