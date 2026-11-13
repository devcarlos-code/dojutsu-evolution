(() => {
  'use strict';

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  const rgb = c => `${c[0]},${c[1]},${c[2]}`;

  const RED    = [255, 38, 28];
  const ORANGE = [255, 85, 35];
  const PURPLE = [165, 105, 255];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================== STAGES ===================== */
  const STAGES = [
    { id: 't1',     name: 'Sharingan', sub: '1 Tomoe',            color: RED,    hold: 1.9 },
    { id: 't2',     name: 'Sharingan', sub: '2 Tomoe',            color: RED,    hold: 1.9 },
    { id: 't3',     name: 'Sharingan', sub: '3 Tomoe',            color: RED,    hold: 2.2 },
    { id: 'itachi', name: 'Itachi',    sub: 'Mangekyō Sharingan', color: ORANGE, hold: 2.6 },
    { id: 'sasuke', name: 'Sasuke',    sub: 'Mangekyō Sharingan', color: ORANGE, hold: 2.6 },
    { id: 'madara', name: 'Madara',    sub: 'Mangekyō Sharingan', color: ORANGE, hold: 2.5 },
    { id: 'obito',  name: 'Obito',     sub: 'Mangekyō Sharingan', color: ORANGE, hold: 2.5 },
    { id: 'rinne',  name: 'Rinnegan',  sub: 'El ojo de los dioses', color: PURPLE, hold: 3.4 }
  ];

  let total = 0;
  STAGES.forEach(s => {
    s.start = total;
    total += s.hold + 0.7;
    s.end = total;
  });
  const END = total + 0.5;

  /* ===================== SHARP EYE SHAPE ===================== */
  const eyePath = `
    M18 85
    C40 32 95 8 170 8
    C245 8 300 32 322 85
    C300 138 245 162 170 162
    C95 162 40 138 18 85Z`;

  /* ===================== PATTERNS ===================== */
  function tomoe(count) {
    const angs = count === 1 ? [0] : count === 2 ? [-50, 50] : [0, 120, 240];
    return angs.map(a => `
      <g transform="rotate(${a} 170 85)">
        <path d="M170 44
                 C156 44 145 54 145 67
                 C145 78 154 85 166 85
                 C161 76 163 64 170 58
                 C177 64 179 76 174 85
                 C186 85 195 78 195 67
                 C195 54 184 44 170 44Z" fill="#0c0206"/>
        <circle cx="170" cy="61" r="5.2" fill="#0c0206"/>
      </g>`).join('');
  }

  const itachi = [0,120,240].map(a => `
    <g transform="rotate(${a} 170 85)">
      <path d="M170 30
               C153 30 138 44 136 60
               C134 76 146 90 163 94
               C158 78 160 62 170 50
               C180 62 182 78 177 94
               C194 90 206 76 204 60
               C202 44 187 30 170 30Z" fill="#0a0205"/>
      <path d="M170 38 C158 38 149 47 148 58" fill="none" stroke="#ff7a48" stroke-width="2.4" stroke-opacity=".5"/>
    </g>`).join('');

  const sasuke = [0,120,240].map(a => `
    <g transform="rotate(${a} 170 85)">
      <path d="M170 32 L192 72 L172 66 L198 102 L168 82 L176 118 L170 100 L164 118 L162 82 L132 102 L158 66 L148 72Z" fill="#0a0205"/>
    </g>`).join('');

  const madara = [0,120,240].map(a => `
    <g transform="rotate(${a} 170 85)">
      <path d="M170 28
               C150 28 132 45 130 64
               C128 84 144 100 165 104
               C159 86 161 66 170 52
               C179 66 181 86 175 104
               C196 100 212 84 210 64
               C208 45 190 28 170 28Z" fill="#090205"/>
      <circle cx="170" cy="50" r="4.2" fill="#150408"/>
    </g>`).join('');

  const obito = [0,120,240].map(a => `
    <g transform="rotate(${a} 170 85)">
      <path d="M170 34
               C158 34 148 43 146 55
               C144 68 154 80 167 84
               C163 70 165 56 170 50
               C175 56 177 70 173 84
               C186 80 196 68 194 55
               C192 43 182 34 170 34Z" fill="#0a0205"/>
      <path d="M170 40 C160 40 153 47 152 56" fill="none" stroke="#ff6e40" stroke-width="2.1" stroke-opacity=".48"/>
    </g>`).join('');

  const rinne = `
    <circle cx="170" cy="85" r="56" fill="none" stroke="#261440" stroke-width="3.8"/>
    <circle cx="170" cy="85" r="45" fill="none" stroke="#3a2260" stroke-width="2.4"/>
    <circle cx="170" cy="85" r="34" fill="none" stroke="#261440" stroke-width="2.3"/>
    <circle cx="170" cy="85" r="24" fill="none" stroke="#3a2260" stroke-width="2"/>
    <circle cx="170" cy="85" r="14" fill="none" stroke="#261440" stroke-width="1.8"/>
    <circle cx="170" cy="85" r="6.5" fill="#140a24"/>
  `;

  /* ===================== BUILD EYE ===================== */
  function buildEye(svg, side) {
    const id = side;
    svg.innerHTML = `
      <defs>
        <radialGradient id="irisRed-${id}" cx="0.38" cy="0.32" r="0.72">
          <stop offset="0%"   stop-color="#ff9a72"/>
          <stop offset="18%"  stop-color="#f03a28"/>
          <stop offset="45%"  stop-color="#b01014"/>
          <stop offset="72%"  stop-color="#5c060c"/>
          <stop offset="100%" stop-color="#180208"/>
        </radialGradient>
        <radialGradient id="irisPurp-${id}" cx="0.38" cy="0.32" r="0.72">
          <stop offset="0%"   stop-color="#f0e0ff"/>
          <stop offset="20%"  stop-color="#c090f0"/>
          <stop offset="50%"  stop-color="#7a40c0"/>
          <stop offset="78%"  stop-color="#3a1860"/>
          <stop offset="100%" stop-color="#12081e"/>
        </radialGradient>
        <filter id="soft-${id}">
          <feGaussianBlur stdDeviation="1.2"/>
        </filter>
      </defs>

      <path d="${eyePath}" fill="#050205" stroke="#0a060a" stroke-width="2.5"/>
      <path d="${eyePath}" fill="#f5efeb"/>

      <path d="M30 82 C70 28 120 12 170 12 C220 12 270 28 310 82"
            fill="none" stroke="#000" stroke-width="18" stroke-linecap="round" opacity="0.18"/>

      <g class="iris-group">
        <circle class="iris-base" cx="170" cy="85" r="58" fill="url(#irisRed-${id})"/>
        <circle cx="170" cy="85" r="58" fill="none" stroke="#1a0508" stroke-width="3.5"/>
        <circle cx="170" cy="85" r="46" fill="none" stroke="#ffb090" stroke-width="1.4" stroke-opacity="0.18"/>

        <g class="fibers" stroke="#ffc0a0" stroke-opacity="0.13" stroke-width="0.9">
          ${Array.from({length: 48}, (_, i) => {
            const a = (i / 48) * 360;
            return `<path d="M170 85 L170 32" transform="rotate(${a} 170 85)"/>`;
          }).join('')}
        </g>

        <g class="spin">
          <g class="pat t1"     opacity="0">${tomoe(1)}</g>
          <g class="pat t2"     opacity="0">${tomoe(2)}</g>
          <g class="pat t3"     opacity="0">${tomoe(3)}</g>
          <g class="pat itachi" opacity="0">${itachi}</g>
          <g class="pat sasuke" opacity="0">${sasuke}</g>
          <g class="pat madara" opacity="0">${madara}</g>
          <g class="pat obito"  opacity="0">${obito}</g>
        </g>
        <g class="pat rinne" opacity="0">${rinne}</g>

        <circle class="pupil" cx="170" cy="85" r="13" fill="#030105"/>
        <circle cx="170" cy="85" r="13" fill="none" stroke="#000" stroke-width="1.5" opacity="0.5"/>

        <ellipse class="hl" cx="148" cy="64" rx="13" ry="7" fill="#fff" opacity="0.78"
                 transform="rotate(-32 148 64)"/>
        <circle cx="192" cy="98" r="3.8" fill="#fff" opacity="0.28"/>
      </g>

      <path d="M22 84 C55 28 110 6 170 6 C230 6 285 28 318 84"
            fill="none" stroke="#000" stroke-width="16" stroke-linecap="round" opacity="0.75"/>
      <path d="M26 88 C65 140 120 160 170 160 C220 160 275 140 314 88"
            fill="none" stroke="#000" stroke-width="11" stroke-linecap="round" opacity="0.55"/>

      <path d="M38 58 C32 48 28 40 30 32" fill="none" stroke="#000" stroke-width="2.8" stroke-linecap="round" opacity="0.7"/>
      <path d="M58 42 C54 32 52 24 56 18" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>
    `;
  }

  const eyeL = document.getElementById('eyeL');
  const eyeR = document.getElementById('eyeR');
  buildEye(eyeL, 'L');
  buildEye(eyeR, 'R');

  function cache(svg) {
    return {
      group: svg.querySelector('.iris-group'),
      iris: svg.querySelector('.iris-base'),
      spin: svg.querySelector('.spin'),
      pupil: svg.querySelector('.pupil'),
      hl: svg.querySelector('.hl'),
      pats: {
        t1: svg.querySelector('.t1'),
        t2: svg.querySelector('.t2'),
        t3: svg.querySelector('.t3'),
        itachi: svg.querySelector('.itachi'),
        sasuke: svg.querySelector('.sasuke'),
        madara: svg.querySelector('.madara'),
        obito: svg.querySelector('.obito'),
        rinne: svg.querySelector('.rinne')
      }
    };
  }
  const eyes = [cache(eyeL), cache(eyeR)];

  const titleEl = document.getElementById('title');
  const subEl = document.getElementById('subtitle');
  const progressEl = document.getElementById('progress');
  const eyesContainer = document.getElementById('eyesContainer');

  const canvas = document.getElementById('fx');
  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, DPR = 1;

  function resize() {
    DPR = Math.min(2, devicePixelRatio || 1);
    W = canvas.width = Math.round(innerWidth * DPR);
    H = canvas.height = Math.round(innerHeight * DPR);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  addEventListener('resize', resize, { passive: true });
  resize();

  const particles = [];
  function burst(color, count = 36, power = 1.3) {
    const cx = W * 0.5;
    const cy = H * 0.47;
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = (1.8 + Math.random() * 5.5) * power;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 1.2,
        life: 1,
        decay: 0.012 + Math.random() * 0.018,
        r: 1.4 + Math.random() * 3.8,
        color
      });
    }
  }

  function drawFX(dt, energy) {
    ctx.clearRect(0, 0, W, H);
    if (REDUCED) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 18; i++) {
      const x = (Math.sin(t * 0.3 + i * 1.7) * 0.35 + 0.5) * W;
      const y = (Math.cos(t * 0.25 + i * 1.3) * 0.25 + 0.48) * H;
      const a = 0.04 + energy * 0.08;
      ctx.beginPath();
      ctx.arc(x, y, (1.5 + energy * 2) * DPR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb(currentColor)},${a})`;
      ctx.fill();
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt * 58;
      p.y += p.vy * dt * 58;
      p.vy += 14 * dt;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      const a = p.life * 0.85;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life * DPR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb(p.color)},${a})`;
      ctx.shadowColor = `rgba(${rgb(p.color)},${a})`;
      ctx.shadowBlur = 14 * DPR;
      ctx.fill();
    }
    ctx.restore();
  }

  let t = 0, prev = 0, angle = 0;
  let lastStage = -1;
  let completed = false;
  let currentColor = RED;
  let shake = 0;
  let breath = 0;
  let gazeX = 0, gazeY = 0;
  let targetGazeX = 0, targetGazeY = 0;
  let nextGaze = 1.5;

  addEventListener('pointerdown', () => {
    if (completed) {
      t = 0; angle = 0; completed = false;
      lastStage = -1; particles.length = 0; shake = 0;
    }
  });

  function frame(now) {
    const dt = Math.min(0.048, (now - (prev || now)) / 1000);
    prev = now;
    if (!completed) t += dt;
    const time = Math.min(t, END);

    let idx = 0;
    for (let i = STAGES.length - 1; i >= 0; i--) {
      if (time >= STAGES[i].start) { idx = i; break; }
    }
    const stage = STAGES[idx];
    const local = time - stage.start;
    const TRANS = 0.55;
    const inT = local < TRANS ? smooth(0, TRANS, local) : 1;
    const outT = local > stage.hold ? 1 - smooth(stage.hold, stage.hold + TRANS, local) : 1;
    const fade = Math.min(inT, outT);

    const enterFlash = idx > 0 ? Math.max(0, 1 - local / 0.42) : 0;
    const energy = clamp((idx >= 3 ? 0.55 : 0.28) + enterFlash * 0.7 + (idx === 7 ? 0.3 : 0));

    if (idx !== lastStage) {
      lastStage = idx;
      currentColor = stage.color;
      titleEl.textContent = stage.name;
      subEl.textContent = stage.sub;
      titleEl.style.textShadow = `0 0 30px rgba(${rgb(stage.color)},0.5), 0 0 70px rgba(${rgb(stage.color)},0.22)`;
      subEl.style.color = `rgba(${rgb(stage.color)},0.65)`;
      document.documentElement.style.setProperty('--accent', rgb(stage.color));
      if (idx > 0 && !REDUCED) {
        const power = idx >= 3 ? 1.5 : 1.15;
        burst(stage.color, idx >= 3 ? 42 : 28, power);
        shake = idx >= 3 ? 1.15 : 0.7;
      }
    }

    if (shake > 0) {
      shake = Math.max(0, shake - dt * 3.4);
      const s = shake * shake;
      document.documentElement.style.setProperty('--shake-x', `${(Math.random()-0.5)*9*s}px`);
      document.documentElement.style.setProperty('--shake-y', `${(Math.random()-0.5)*6*s}px`);
    } else {
      document.documentElement.style.setProperty('--shake-x', '0px');
      document.documentElement.style.setProperty('--shake-y', '0px');
    }

    breath += dt * 1.1;
    const breathScale = 1 + Math.sin(breath) * 0.008 * (0.6 + energy);

    if (time > nextGaze) {
      targetGazeX = (Math.random() - 0.5) * 9;
      targetGazeY = (Math.random() - 0.5) * 5;
      nextGaze = time + 1.8 + Math.random() * 2.5;
    }
    gazeX += (targetGazeX - gazeX) * clamp(dt * 3.2);
    gazeY += (targetGazeY - gazeY) * clamp(dt * 3.2);

    let spinTarget = 1.3;
    if (idx <= 2) spinTarget = 2.4 + idx * 1.3;
    else if (idx <= 6) spinTarget = 8.5 + (idx - 3) * 1.4;
    else spinTarget = 1.7;
    angle += spinTarget * dt * (0.35 + 0.65 * fade);

    document.documentElement.style.setProperty('--energy', energy.toFixed(3));

    const map = {
      t1: idx === 0, t2: idx === 1, t3: idx === 2,
      itachi: idx === 3, sasuke: idx === 4,
      madara: idx === 5, obito: idx === 6, rinne: idx === 7
    };

    eyes.forEach((eye, i) => {
      const ax = i === 1 ? -1.6 : 1.6;
      const ay = i === 1 ? 0.9 : -0.7;
      eye.group.setAttribute('transform',
        `translate(${gazeX + ax} ${gazeY + ay}) scale(${breathScale})`);
      eye.spin.setAttribute('transform', `rotate(${angle * 57.3} 170 85)`);

      Object.keys(map).forEach(k => {
        const op = map[k] ? fade : 0;
        eye.pats[k].setAttribute('opacity', op.toFixed(3));
      });

      const gradId = idx === 7 ? `irisPurp-${i === 0 ? 'L' : 'R'}` : `irisRed-${i === 0 ? 'L' : 'R'}`;
      eye.iris.setAttribute('fill', `url(#${gradId})`);

      const pr = 12.5 + energy * 3.5 - enterFlash * 2.5;
      eye.pupil.setAttribute('r', pr.toFixed(2));

      if (eye.hl) {
        const hx = 148 + gazeX * 0.4;
        const hy = 64 + gazeY * 0.35;
        eye.hl.setAttribute('cx', hx.toFixed(1));
        eye.hl.setAttribute('cy', hy.toFixed(1));
        eye.hl.setAttribute('transform', `rotate(${-32 + gazeX * 0.8} ${hx} ${hy})`);
      }
    });

    progressEl.style.width = (clamp(time / END) * 100) + '%';
    drawFX(dt, energy);

    if (time >= END) completed = true;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
