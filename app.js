// Drawer (เมนูซ้าย)
const menuBtn = document.querySelector('[data-menu-btn]');
const drawer  = document.querySelector('[data-drawer]');
if (menuBtn && drawer){
  menuBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    menuBtn.classList.toggle('x');
  });
  // ปิดเมื่อแตะนอกเมนู
  document.addEventListener('click', (e)=>{
    if (!drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      drawer.classList.remove('open');
      menuBtn.classList.remove('x');
    }
  });
}

// จุด/ดับไฟเทียน
document.querySelectorAll('[data-candle]').forEach(c => {
  c.addEventListener('click', () => {
    const flame = c.querySelector('[data-flame]');
    flame.classList.toggle('off');
  });
});

// Flip card
const card = document.querySelector('[data-flip]');
if (card){
  card.addEventListener('click', ()=> card.classList.toggle('flipped'));
}

// Typewriter ข้อความ HBD
const typeEl = document.querySelector('.type');
if (typeEl){
  try{
    const payload = JSON.parse(typeEl.getAttribute('data-type'));
    const text = payload.text || '';
    const speed = +payload.speed || 30;
    typeEl.classList.add('typing');
    let i = 0;
    const tick = () => {
      typeEl.textContent = text.slice(0, i++);
      if (i <= text.length) setTimeout(tick, speed);
      else typeEl.classList.remove('typing');
    };
    tick();
  }catch(e){}
}

// Fireworks (แตะเพื่อจุด)
const canvas = document.getElementById('fx');
if (canvas){
  const ctx = canvas.getContext('2d');
  let W, H;
  const setSize = ()=>{
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  setSize(); window.addEventListener('resize', setSize);

  const particles = [];
  function spawn(x, y, color){
    for (let i=0;i<80;i++){
      const angle = (Math.PI*2) * (i/80) + Math.random()*0.2;
      const speed = 2 + Math.random()*3;
      particles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 60 + Math.random()*20,
        color
      });
    }
  }
  function step(){
    ctx.clearRect(0,0,W,H);
    for (let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;          // gravity
      p.vx *= 0.99; p.vy *= 0.99;
      p.life--;
      const alpha = Math.max(p.life/80, 0);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
      if (p.life<=0) particles.splice(i,1);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  }
  step();

  const colors = ['#22d3ee','#60a5fa','#a78bfa','#f59e0b','#34d399','#f472b6'];
  const fire = (x,y)=> spawn(x,y, colors[(Math.random()*colors.length)|0]);

  window.addEventListener('pointerdown', e => fire(e.clientX, e.clientY));
  // จุดอัตโนมัติเล็กน้อย
  setTimeout(()=>fire(W*0.5, H*0.35), 600);
}

