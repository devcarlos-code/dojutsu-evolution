(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  window.addEventListener('error',(event)=>{
    const status=document.getElementById('motionStatus');
    if(status) status.textContent='ERROR DE INTERACCIÓN · '+(event.message||'SCRIPT');
  });
  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => {
    const n = clamp((x - a) / (b - a));
    return n * n * (3 - 2 * n);
  };
  const rgb = (c) => c.join(',');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const C = {
    crimson: [255, 48, 38],
    ember: [255, 91, 55],
    violet: [174, 116, 255],
    blue: [94, 190, 255],
    pearl: [190, 222, 255],
    scarlet: [255, 35, 65]
  };

  const STAGES = [
    { id:'tomoe1', clan:'CLAN UCHIHA', title:'Sharingan', subtitle:'一 Tomoe', description:'El primer despertar. Una nueva percepción comienza a abrirse.', color:C.crimson, duration:4.2, pattern:'tomoe1' },
    { id:'tomoe2', clan:'CLAN UCHIHA', title:'Sharingan', subtitle:'二 Tomoe', description:'La percepción se agudiza. Cada movimiento deja de ser un misterio.', color:C.crimson, duration:4.2, pattern:'tomoe2' },
    { id:'tomoe3', clan:'CLAN UCHIHA', title:'Sharingan', subtitle:'三 Tomoe', description:'El Sharingan alcanza su forma completa y revela todo su potencial.', color:C.crimson, duration:4.6, pattern:'tomoe3' },
    { id:'itachi', clan:'ITACHI UCHIHA', title:'Mangekyō Sharingan', subtitle:'万華鏡写輪眼 · Itachi', description:'Un patrón único despierta entre llamas y recuerdos.', color:C.ember, duration:4.8, pattern:'itachi' },
    { id:'sasuke', clan:'SASUKE UCHIHA', title:'Mangekyō Sharingan', subtitle:'万華鏡写輪眼 · Sasuke', description:'Una estrella afilada toma forma en el centro del iris.', color:C.ember, duration:4.8, pattern:'sasuke' },
    { id:'madara', clan:'MADARA UCHIHA', title:'Mangekyō Sharingan', subtitle:'万華鏡写輪眼 · Madara', description:'Un diseño ancestral gira con una presencia imponente.', color:C.crimson, duration:4.8, pattern:'madara' },
    { id:'obito', clan:'OBITO UCHIHA', title:'Mangekyō Sharingan', subtitle:'万華鏡写輪眼 · Obito', description:'El espacio parece doblarse alrededor de una mirada imposible.', color:C.ember, duration:4.8, pattern:'obito' },
    { id:'rinnegan', clan:'EL OJO DE LOS SEIS CAMINOS', title:'Rinnegan', subtitle:'輪廻眼', description:'Los anillos del poder legendario despiertan en un resplandor violeta.', color:C.violet, duration:5.4, pattern:'rinnegan' },
    { id:'eternal', clan:'UCHIHA · EVOLUCIÓN ETERNA', title:'Eternal Mangekyō', subtitle:'永遠の万華鏡写輪眼', description:'Dos destinos se funden en un patrón eterno.', color:C.ember, duration:5.0, pattern:'eternal' },
    { id:'sixpaths', clan:'PODER DE LOS SEIS CAMINOS', title:'Six Tomoe Rinnegan', subtitle:'六勾玉輪廻眼', description:'Seis tomoe rodean los anillos de un poder superior.', color:C.violet, duration:5.2, pattern:'sixpaths' },
    { id:'tenseigan', clan:'ŌTSUTSUKI', title:'Tenseigan', subtitle:'転生眼', description:'Una energía celestial azul ilumina el ojo con una calma abrumadora.', color:C.blue, duration:5.2, pattern:'tenseigan' },
    { id:'jogan', clan:'EL OJO PURO', title:'Jōgan', subtitle:'浄眼', description:'Una mirada azul y misteriosa percibe aquello que permanece oculto.', color:C.pearl, duration:5.2, pattern:'jogan' },
    { id:'rinneSharingan', clan:'PODER DIVINO', title:'Rinne Sharingan', subtitle:'輪廻写輪眼', description:'El despertar final: un ojo de poder ancestral que trasciende toda evolución.', color:C.scarlet, duration:6.0, pattern:'rinneSharingan' }
  ];

  const eyePath = 'M15 95 C48 35 105 12 170 12 C235 12 292 35 325 95 C292 155 235 178 170 178 C105 178 48 155 15 95Z';
  const polar = (count, radius, size, shape) => Array.from({length:count}, (_,i) => {
    const a = i * 360 / count;
    return '<g transform="rotate(' + a + ' 170 95)">' + shape.replaceAll('$R', radius).replaceAll('$S', size) + '</g>';
  }).join('');

  function tomoe(count, radius = 40, fill = '#090307') {
    // A comma-shaped tomoe anchored to the outer iris ring, never across the pupil.
    const shape = '<path d="M170 51 C184 47 195 57 194 69 C193 80 184 86 174 83 C181 78 181 69 176 64 C173 61 170 57 170 51Z" fill="' + fill + '"/><circle cx="187" cy="59" r="3.2" fill="' + fill + '"/>';
    return Array.from({length:count},(_,i)=>'<g transform="rotate('+(i*360/count)+' 170 95)">'+shape+'</g>').join('');
  }

  function mangekyo(type) {
    const blades = {
      itachi: {count:3, inner:25, outer:56, twist:0, color:'#080206'},
      sasuke: {count:6, inner:22, outer:57, twist:0, color:'#080206'},
      madara: {count:3, inner:20, outer:58, twist:18, color:'#080206'},
      obito: {count:3, inner:24, outer:56, twist:60, color:'#080206'}
    }[type];
    if(!blades) return '';
    const petals=Array.from({length:blades.count},(_,i)=>{
      const a=i*360/blades.count+blades.twist;
      return '<path d="M170 95 C150 80 151 57 170 37 C189 57 190 80 170 95Z" transform="rotate('+a+' 170 95)" fill="'+blades.color+'"/>';
    }).join('');
    return '<g>'+petals+'</g><circle cx="170" cy="95" r="20" fill="#d32824" opacity=".95"/>';
  }

  function patternMarkup(type) {
    switch(type) {
      case 'tomoe1': return tomoe(1, 38);
      case 'tomoe2': return tomoe(2, 39);
      case 'tomoe3': return tomoe(3, 40);
      case 'itachi': return mangekyo('itachi');
      case 'sasuke': return mangekyo('sasuke');
      case 'madara': return mangekyo('madara');
      case 'obito': return mangekyo('obito');
      case 'rinnegan':
        return '<g fill="none" stroke="#271340"><circle cx="170" cy="95" r="53" stroke-width="5"/><circle cx="170" cy="95" r="42" stroke-width="3.5"/><circle cx="170" cy="95" r="30" stroke-width="3"/><circle cx="170" cy="95" r="18" stroke-width="2.5"/></g><circle cx="170" cy="95" r="7" fill="#160a25"/>';
      case 'eternal':
        return '<g>' + mangekyo('itachi') + '<g transform="rotate(60 170 95)">' + mangekyo('obito') + '</g></g><circle cx="170" cy="95" r="20" fill="none" stroke="#ff795e" stroke-width="2" opacity=".7"/>';
      case 'sixpaths':
        return '<g fill="none" stroke="#2b1745"><circle cx="170" cy="95" r="56" stroke-width="4"/><circle cx="170" cy="95" r="44" stroke-width="3"/><circle cx="170" cy="95" r="31" stroke-width="2.5"/><circle cx="170" cy="95" r="18" stroke-width="2"/></g>' + tomoe(6, 47, '#160b22');
      case 'tenseigan':
        return '<g fill="none" stroke="#a7e6ff"><circle cx="170" cy="95" r="55" stroke-width="2" opacity=".8"/><circle cx="170" cy="95" r="43" stroke-width="2"/><circle cx="170" cy="95" r="31" stroke-width="1.5"/><path d="M170 38 L180 85 L227 95 L180 105 L170 152 L160 105 L113 95 L160 85Z" stroke-width="2.5"/><path d="M170 52V138M127 95H213" stroke-width="1" opacity=".6"/></g><circle cx="170" cy="95" r="10" fill="#d9f6ff"/>';
      case 'jogan':
        return '<g fill="none" stroke="#d8f5ff"><ellipse cx="170" cy="95" rx="52" ry="48" stroke-width="2"/><ellipse cx="170" cy="95" rx="37" ry="34" stroke-width="2"/><path d="M170 43 C198 68 198 122 170 147 C142 122 142 68 170 43Z" stroke-width="2"/><path d="M122 95H218M170 50V140" stroke-width="1.5" opacity=".7"/></g><circle cx="170" cy="95" r="13" fill="#081a2a"/><circle cx="170" cy="95" r="5" fill="#d9f6ff"/>';
      case 'rinneSharingan':
        return '<g fill="none" stroke="#31030e"><circle cx="170" cy="95" r="57" stroke-width="4"/><circle cx="170" cy="95" r="45" stroke-width="3"/><circle cx="170" cy="95" r="33" stroke-width="2.5"/><circle cx="170" cy="95" r="21" stroke-width="2"/><path d="M170 38 L182 83 L227 95 L182 107 L170 152 L158 107 L113 95 L158 83Z" stroke-width="2"/></g>' + tomoe(9, 49, '#170208') + '<circle cx="170" cy="95" r="8" fill="#170208"/>';
      default: return '';
    }
  }

  function eyeSVG(side, stage) {
    const id = side;
    const purple = stage.color === C.violet || stage.color === C.blue || stage.color === C.pearl;
    const irisA = purple ? '#f0f6ff' : '#ffb49b';
    const irisB = purple ? (stage.color === C.blue || stage.color === C.pearl ? '#4daddf' : '#a36be5') : '#d32824';
    const irisC = purple ? '#172b55' : '#510710';
    const grad = 'iris-' + id;
    return '<defs>' +
      '<radialGradient id="' + grad + '" cx=".38" cy=".32" r=".72"><stop offset="0" stop-color="' + irisA + '"/><stop offset=".18" stop-color="' + irisB + '"/><stop offset=".65" stop-color="' + irisC + '"/><stop offset="1" stop-color="#080309"/></radialGradient>' +
      '<clipPath id="clip-' + id + '"><path d="' + eyePath + '"/></clipPath>' +
      '<filter id="glow-' + id + '" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3"/></filter>' +
      '</defs>' +
      '<path d="' + eyePath + '" fill="#050307" stroke="#171016" stroke-width="4"/>' +
      '<path d="' + eyePath + '" fill="#eee9e5"/>' +
      '<g clip-path="url(#clip-' + id + ')">' +
        '<path d="M15 95 C48 35 105 12 170 12 C235 12 292 35 325 95" fill="none" stroke="#080509" stroke-width="17" opacity=".25"/>' +
        '<g class="iris-motion">' +
          '<circle cx="170" cy="95" r="59" fill="url(#' + grad + ')"/>' +
          '<circle cx="170" cy="95" r="59" fill="none" stroke="#17060a" stroke-width="3"/>' +
          '<circle cx="170" cy="95" r="49" fill="none" stroke="' + irisA + '" stroke-opacity=".25" stroke-width="1.2"/>' +
          '<g class="iris-fibers" stroke="' + irisA + '" stroke-opacity=".16" stroke-width="1">' +
            Array.from({length:72},(_,i)=>'<path d="M170 95L170 39" transform="rotate('+(i*5)+' 170 95)"/>').join('') +
          '</g>' +
          '<g class="pattern">' + patternMarkup(stage.pattern) + '</g>' +
          '<circle class="pupil" cx="170" cy="95" r="12" fill="#030205"/>' +
          '<circle cx="170" cy="95" r="12" fill="none" stroke="#000" stroke-width="1.5"/>' +
          '<ellipse class="eye-highlight" cx="147" cy="70" rx="13" ry="7" fill="#fff" opacity=".82" transform="rotate(-30 147 70)"/>' +
          '<circle cx="195" cy="113" r="3.8" fill="#fff" opacity=".3"/>' +
        '</g>' +
      '</g>' +
      '<path d="M19 92 C53 34 108 9 170 9 C232 9 287 34 321 92" fill="none" stroke="#080609" stroke-width="17" stroke-linecap="round"/>' +
      '<path d="M27 100 C66 155 119 177 170 177 C221 177 274 155 313 100" fill="none" stroke="#080609" stroke-width="10" stroke-linecap="round" opacity=".78"/>' +
      '<path d="M37 65Q27 50 32 36M58 48Q50 34 56 22" fill="none" stroke="#09070a" stroke-width="3" stroke-linecap="round"/>';
  }

  const eyeL = $('eyeL');
  const eyeR = $('eyeR');
  const title = $('stageTitle');
  const subtitle = $('stageSubtitle');
  const eyebrow = $('stageEyebrow');
  const description = $('stageDescription');
  const progress = $('progress');
  const progressLabel = $('progressLabel');
  const timeline = $('timelineTrack');
  const ticks = $('timelineTicks');
  const playBtn = $('playBtn');
  const playLabel = $('playLabel');
  const previousBtn = $('previousBtn');
  const nextBtn = $('nextBtn');
  const restartBtn = $('restartBtn');
  const autoToggle = $('autoToggle');
  const soundToggle = $('soundToggle');
  const intensityRange = $('intensityRange');
  const intensityValue = $('intensityValue');
  const flashOverlay = $('flashOverlay');
  const announcement = $('announcement');
  const eyePair = $('eyePair');

  let stageIndex = 0;
  let elapsed = 0;
  let playing = false;
  let angle = 0;
  let time = 0;
  let lastFrame = 0;
  let shake = 0;
  let gazeX = 0, gazeY = 0, targetX = 0, targetY = 0;
  let intensity = Number(intensityRange.value) / 100;
  let soundEnabled = false;
  let audioContext = null;
  let masterGain = null;
  let ambientNodes = [];
  let particles = [];\n  let shockwaves = [];\n  let transitionToken = 0;
  let irisMotion = [];
  let pupils = [];
  let width = 0, height = 0, dpr = 1;

  function makeTicks() {
    ticks.innerHTML = STAGES.map((_,i)=>'<i class="'+(i===stageIndex?'active':'')+'" data-stage="'+i+'"></i>').join('');
    timeline.setAttribute('aria-valuemax', String(STAGES.length));
  }

  function updateControls() {
    playBtn.classList.toggle('is-playing', playing);
    playBtn.setAttribute('aria-label', playing ? 'Pausar secuencia' : 'Iniciar despertar');
    playLabel.textContent = playing ? 'Pausar secuencia' : (autoToggle.checked ? 'Iniciar despertar' : 'Siguiente etapa');
    previousBtn.disabled = stageIndex === 0;
    nextBtn.disabled = stageIndex === STAGES.length - 1;
    previousBtn.style.opacity = previousBtn.disabled ? '.35' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '.35' : '1';
  }

  function updateProgress(value = (stageIndex + elapsed / STAGES[stageIndex].duration) / STAGES.length) {
    const pct = clamp(value) * 100;
    progress.style.width = pct + '%';
    const shown = String(stageIndex + 1).padStart(2,'0');
    progressLabel.textContent = shown + ' / ' + String(STAGES.length).padStart(2,'0');
    $('stageNumber').textContent = shown;
    $('stageTotal').textContent = String(STAGES.length).padStart(2,'0');
    timeline.setAttribute('aria-valuenow', String(stageIndex + 1));
    [...ticks.children].forEach((tick,i)=>tick.classList.toggle('active',i<=stageIndex));
  }

  function showAnnouncement(text) {
    announcement.textContent = text;
    announcement.classList.add('show');
    window.clearTimeout(showAnnouncement.timer);
    showAnnouncement.timer = window.setTimeout(()=>announcement.classList.remove('show'),1500);
  }

  function spawnBurst(color, amount = 46, force = 1) {
    if (reducedMotion || intensity <= 0) return;
    const cx = width * .5, cy = height * .48;\n    shockwaves.push({x:cx,y:cy,r:24,life:1,color});\n    if(shockwaves.length>5) shockwaves.shift();
    const count = Math.round(amount * intensity);
    for(let i=0;i<count;i++){
      const a = Math.random()*Math.PI*2;
      const speed = (1.2 + Math.random()*4.2)*force*intensity;
      particles.push({
        x:cx+(Math.random()-.5)*30*dpr,y:cy+(Math.random()-.5)*24*dpr,
        vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-1.1,
        life:1,decay:.008+Math.random()*.018,
        radius:(.8+Math.random()*2.7)*dpr,color
      });
    }
    if(particles.length>220) particles.splice(0,particles.length-220);
  }

  function enterStage(index, announce = true) {
    stageIndex = clamp(index,0,STAGES.length-1);
    elapsed = 0;
    const stage = STAGES[stageIndex];
    document.documentElement.style.setProperty('--accent',rgb(stage.color));
    document.documentElement.style.setProperty('--accent-soft',rgb(stage.color));
    eyeL.dataset.pattern=stage.pattern; eyeR.dataset.pattern=stage.pattern;\n    eyeL.innerHTML = eyeSVG('L',stage);
    eyeR.innerHTML = eyeSVG('R',stage);
    irisMotion = [...eyeL.querySelectorAll('.iris-motion'), ...eyeR.querySelectorAll('.iris-motion')];
    pupils = [...eyeL.querySelectorAll('.pupil'), ...eyeR.querySelectorAll('.pupil')];
    eyebrow.innerHTML = stage.clan + ' <span>•</span> AWAKENING ' + String(stageIndex+1).padStart(2,'0');
    title.textContent = stage.title;
    subtitle.textContent = stage.subtitle;
    description.textContent = stage.description;
    title.style.textShadow = '0 0 25px rgba('+rgb(stage.color)+',.4),0 0 75px rgba('+rgb(stage.color)+',.2)';
    makeTicks();
    updateProgress(stageIndex / STAGES.length);
    if(stageIndex>0){
      spawnBurst(stage.color,stageIndex>=7?76:48,stageIndex>=7?1.35:1);
      if(!reducedMotion){
        flashOverlay.classList.remove('flash');
        void flashOverlay.offsetWidth;
        flashOverlay.classList.add('flash');
        shake = stageIndex>=7 ? 1.25 : .72;
      }
      if(announce) showAnnouncement(stage.title.toUpperCase()+' — AWAKENED');
      playTransitionSound();
    } else if(announce) showAnnouncement('AWAKENING SEQUENCE READY');
    updateControls();
  }

  function resize() {
    dpr = Math.min(1.6,window.devicePixelRatio||1);
    width = window.innerWidth;
    height = window.innerHeight;
    const canvas = $('fx');
    canvas.width = Math.round(width*dpr);
    canvas.height = Math.round(height*dpr);
    canvas.style.width = width+'px';
    canvas.style.height = height+'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  const ctx = $('fx').getContext('2d',{alpha:true});
  window.addEventListener('resize',resize,{passive:true});
  resize();

  function drawParticles(dt) {
    ctx.clearRect(0,0,width,height);
    if(reducedMotion || intensity===0) return;
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    const ambientCount = Math.round(18*intensity);
    for(let i=0;i<ambientCount;i++){
      const x=(Math.sin(time*.22+i*1.73)*.38+.5)*width;
      const y=(Math.cos(time*.19+i*1.31)*.29+.48)*height;
      const alpha=(.035+intensity*.045)*(0.65+.35*Math.sin(time+i));
      ctx.beginPath();ctx.arc(x,y,1.1+intensity*1.8,0,Math.PI*2);
      ctx.fillStyle='rgba('+rgb(STAGES[stageIndex].color)+','+alpha+')';ctx.fill();
    }
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];
      p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.vy+=10*dt;p.life-=p.decay;
      if(p.life<=0){particles.splice(i,1);continue;}
      const alpha=p.life*.8;
      ctx.beginPath();ctx.arc(p.x,p.y,p.radius*p.life,0,Math.PI*2);
      ctx.fillStyle='rgba('+rgb(p.color)+','+alpha+')';
      ctx.shadowColor='rgba('+rgb(p.color)+','+alpha+')';ctx.shadowBlur=12*intensity;
      ctx.fill();
    }
    ctx.restore();
  }

  function setupAudio() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if(!AudioCtx) return false;
    if(!audioContext){
      audioContext = new AudioCtx();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0;
      masterGain.connect(audioContext.destination);
      const filter = audioContext.createBiquadFilter();
      filter.type='lowpass';filter.frequency.value=210;filter.Q.value=.7;
      filter.connect(masterGain);
      [55,82.41,110].forEach((frequency,index)=>{
        const osc=audioContext.createOscillator();
        const gain=audioContext.createGain();
        osc.type=index===1?'triangle':'sine';
        osc.frequency.value=frequency;
        gain.gain.value=[.22,.08,.035][index];
        osc.connect(gain);gain.connect(filter);osc.start();
        ambientNodes.push({osc,gain});
      });
    }
    return true;
  }

  function setSound(enabled) {
    soundEnabled=enabled;
    if(!enabled){
      if(audioContext&&masterGain){
        masterGain.gain.setTargetAtTime(0,audioContext.currentTime,.12);
        audioContext.suspend();
      }
      return;
    }
    if(!setupAudio()){
      soundToggle.checked=false;
      soundEnabled=false;
      showAnnouncement('AUDIO NO DISPONIBLE EN ESTE NAVEGADOR');
      return;
    }
    audioContext.resume().then(()=>{
      if(soundEnabled) masterGain.gain.setTargetAtTime(.18,audioContext.currentTime,.5);
    }).catch(()=>{soundToggle.checked=false;soundEnabled=false;});
  }

  function playTransitionSound() {
    if(!soundEnabled||!audioContext) return;
    if(audioContext.state==='suspended') audioContext.resume();
    const now=audioContext.currentTime;
    const osc=audioContext.createOscillator();
    const gain=audioContext.createGain();
    const filter=audioContext.createBiquadFilter();
    const base=stageIndex>=7?95:stageIndex>=3?130:170;
    osc.type='sawtooth';
    osc.frequency.setValueAtTime(base*2.2,now);
    osc.frequency.exponentialRampToValueAtTime(base,now+.55);
    filter.type='lowpass';filter.frequency.setValueAtTime(1200,now);filter.frequency.exponentialRampToValueAtTime(180,now+.65);
    gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.11,now+.06);gain.gain.exponentialRampToValueAtTime(.0001,now+.72);
    osc.connect(filter);filter.connect(gain);gain.connect(masterGain);osc.start(now);osc.stop(now+.75);
  }

  function setPlaying(value) {
    playing=value;
    updateControls();
    if(playing && stageIndex===STAGES.length-1 && elapsed>=STAGES[stageIndex].duration){
      enterStage(0,false);
    }
  }

  // Delegación centralizada: mantiene operativos los controles aunque el contenido
  // interno de los botones (SVG/texto) sea el objetivo real del clic.
  document.addEventListener('click',(event)=>{
    const button=event.target.closest('button');
    if(button){
      switch(button.id){
        case 'playBtn':
          if(!autoToggle.checked){
            setPlaying(false);
            enterStage((stageIndex+1)%STAGES.length);
          }else setPlaying(!playing);
          break;
        case 'previousBtn':
          setPlaying(false);enterStage(stageIndex-1);break;
        case 'nextBtn':
          setPlaying(false);enterStage(stageIndex+1);break;
        case 'restartBtn':
          setPlaying(false);particles=[];enterStage(0);break;
        case 'fullscreenBtn':
          (async()=>{
            try{
              if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
              else await document.exitFullscreen();
            }catch(_){showAnnouncement('PANTALLA COMPLETA NO DISPONIBLE');}
          })();
          break;
      }
    }
    const tick=event.target.closest('#timelineTicks [data-stage]');
    if(tick){
      setPlaying(false);
      enterStage(Number(tick.dataset.stage));
    }
  });

  autoToggle.addEventListener('change',()=>{setPlaying(false);updateControls();showAnnouncement(autoToggle.checked?'MODO AUTOMÁTICO':'MODO MANUAL');});
  soundToggle.addEventListener('change',()=>setSound(soundToggle.checked));
  intensityRange.addEventListener('input',()=>{
    intensity=Number(intensityRange.value)/100;
    intensityValue.value=Math.round(intensity*100)+'%';
    document.documentElement.style.setProperty('--energy',intensity);
  });
  window.addEventListener('pointermove',(event)=>{
    if(event.pointerType==='touch')return;
    const rect=eyePair.getBoundingClientRect();
    targetX=clamp((event.clientX-(rect.left+rect.width/2))/(rect.width/2),-1,1)*3.5;
    targetY=clamp((event.clientY-(rect.top+rect.height/2))/(rect.height/2),-1,1)*2.2;
  },{passive:true});
  window.addEventListener('keydown',(event)=>{
    if(['INPUT','BUTTON'].includes(document.activeElement.tagName))return;
    if(event.code==='Space'){event.preventDefault();if(autoToggle.checked)setPlaying(!playing);else enterStage((stageIndex+1)%STAGES.length);}
    if(event.code==='ArrowRight'){setPlaying(false);enterStage(stageIndex+1);}
    if(event.code==='ArrowLeft'){setPlaying(false);enterStage(stageIndex-1);}
  });

  function frame(now) {
    const dt=Math.min(.05,(now-(lastFrame||now))/1000);
    lastFrame=now;time+=dt;
    if(playing&&autoToggle.checked){
      elapsed+=dt;
      if(elapsed>=STAGES[stageIndex].duration){
        if(stageIndex<STAGES.length-1) enterStage(stageIndex+1);
        else {elapsed=STAGES[stageIndex].duration;setPlaying(false);showAnnouncement('SECUENCIA COMPLETADA');}
      }
    }
    const stage=STAGES[stageIndex];
    const energy=intensity*(.55+.45*Math.sin(time*1.35)*.5+.2);
    document.documentElement.style.setProperty('--energy',clamp(energy).toFixed(3));
    const breathe=1+Math.sin(time*1.05)*.006*(.5+intensity);
    angle+=dt*(stageIndex>=7?-.34:stageIndex>=3?.24:.12);
    gazeX+=(targetX-gazeX)*clamp(dt*2.7);
    gazeY+=(targetY-gazeY)*clamp(dt*2.7);
    irisMotion.forEach((group,index)=>{
      group.setAttribute('transform','translate('+(gazeX+(index?-.8:.8))+' '+gazeY+') scale('+breathe+') rotate('+angle*57.3+' 170 95)');
    });
    pupils.forEach(pupil=>pupil.setAttribute('r',(12+intensity*2.2).toFixed(2)));
    if(shake>0&&!reducedMotion){
      shake=Math.max(0,shake-dt*2.8);
      const amount=shake*shake*5;
      document.documentElement.style.setProperty('--shake-x',((Math.random()-.5)*amount)+'px');
      document.documentElement.style.setProperty('--shake-y',((Math.random()-.5)*amount*.7)+'px');
    }else{
      document.documentElement.style.setProperty('--shake-x','0px');
      document.documentElement.style.setProperty('--shake-y','0px');
    }
    updateProgress();
    drawParticles(dt);
    requestAnimationFrame(frame);
  }

  makeTicks();
  enterStage(0,false);
  updateControls();
  intensityValue.value=Math.round(intensity*100)+'%';
  document.documentElement.dataset.appReady='true';
  const status=$('motionStatus');
  if(status) status.innerHTML='VISUAL ENGINE <i>● ONLINE · CONTROLS READY</i>';
  requestAnimationFrame(frame);
})();
