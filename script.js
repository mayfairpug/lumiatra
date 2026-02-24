
const revealEls = Array.from(document.querySelectorAll('.reveal'));
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('on'); });
},{threshold:0.12});
revealEls.forEach(el=>io.observe(el));

const pb = document.querySelector('.progressbar');
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const sc = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  pb.style.width = (Math.max(0, Math.min(1, sc)) * 100).toFixed(2) + '%';
}, {passive:true});

const cg = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', (e)=>{
  cg.style.left = e.clientX + 'px';
  cg.style.top = e.clientY + 'px';
}, {passive:true});

const btt = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 650) btt.classList.add('on');
  else btt.classList.remove('on');
}, {passive:true});
btt.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));

function countUp(el, to, duration=1100){
  const t0 = performance.now();
  function tick(t){
    const p = Math.min(1, (t - t0)/duration);
    const val = Math.floor(to * (1 - Math.pow(1-p, 3)));
    el.textContent = val.toLocaleString();
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
document.querySelectorAll('.stat-num[data-count]').forEach((el)=>{
  const to = parseInt(el.getAttribute('data-count'), 10) || 0;
  countUp(el, to);
});

function rand(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
let people = rand(6, 24);
document.querySelectorAll('.stat-num.live[data-live="people"]').forEach(el=>el.textContent = String(people));
function stepPeople(){
  const pause = rand(1800, 5600);
  people = Math.max(2, Math.min(48, people + rand(-2,3)));
  document.querySelectorAll('.stat-num.live[data-live="people"]').forEach(el=>el.textContent = String(people));
  setTimeout(stepPeople, pause);
}
stepPeople();
  document.querySelectorAll('.stat-num.live[data-live="people"]').forEach(el=>el.textContent = String(people));
}, 4200);

let q=rand(1200, 4800), v=rand(800, 3400), c=rand(600, 2600);
const qEl=document.getElementById('liveEmails');
const vEl=document.getElementById('liveVerified');
const cEl=document.getElementById('liveClean');

function stepLive(){
  const pause = rand(900, 4200);
  q += rand(5, 80);
  v += rand(3, 55);
  c += rand(2, 40);

  if(qEl) qEl.textContent = q.toLocaleString();
  if(vEl) vEl.textContent = v.toLocaleString();
  if(cEl) cEl.textContent = c.toLocaleString();

  setTimeout(stepLive, pause);
}
stepLive();

document.querySelectorAll('[data-prefill]').forEach((btn)=>{
  btn.addEventListener('click', ()=>{
    const pkg = btn.getAttribute('data-prefill');
    const sel = document.getElementById('pkg');
    if(sel && pkg) sel.value = pkg;
    document.getElementById('contact').scrollIntoView({behavior:'smooth'});
  });
});

function fmtDuration(hours){
  if(hours < 1) return `${Math.max(1, Math.round(hours*60))} min`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}
function updateScrape(){
  const kw = Math.max(1, parseInt(document.getElementById('kwCount').value || '1', 10));
  const c = parseFloat(document.getElementById('kwComplex').value || '1.8');
  const hours = (kw * 6 * c) / 60;
  document.getElementById('scrapeTime').textContent = fmtDuration(hours);
}
document.getElementById('kwCount').addEventListener('input', updateScrape);
document.getElementById('kwComplex').addEventListener('change', updateScrape);
updateScrape();

function updateVerify(){
  const n = Math.max(100, parseInt(document.getElementById('verCount').value || '100', 10));
  const d = parseFloat(document.getElementById('verDepth').value || '1.4');
  const perHour = 2000 / d;
  const hours = n / perHour;
  document.getElementById('verifyTime').textContent = fmtDuration(hours);
}
document.getElementById('verCount').addEventListener('input', updateVerify);
document.getElementById('verDepth').addEventListener('change', updateVerify);
updateVerify();

function updateSend(){
  const n = Math.max(50, parseInt(document.getElementById('sendCount').value || '50', 10));
  const r = parseFloat(document.getElementById('sendRate').value || '30');
  const hours = n / r;
  document.getElementById('sendTime').textContent = fmtDuration(hours);
}
document.getElementById('sendCount').addEventListener('input', updateSend);
document.getElementById('sendRate').addEventListener('change', updateSend);
updateSend();

function pad(n){ return String(n).padStart(2,'0'); }
function tickClock(){
  const d = new Date();
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const date = d.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
  const tEl = document.getElementById('clockTime');
  const dEl = document.getElementById('clockDate');
  if(tEl) tEl.textContent = time;
  if(dEl) dEl.textContent = date;
}
tickClock(); setInterval(tickClock, 1000);

function buildMessage(){
  const v = (id)=> (document.getElementById(id).value || '').trim();
  return `Lumiatra enquiry
Name: ${v('name')}
Email: ${v('email')}
WhatsApp: ${v('wa')}
Package: ${v('pkg')}
Country: ${v('country')}
Objective: ${v('objective')}
Keywords: ${v('keywords')}
Notes: ${v('notes')}`.trim();
}
const waBtn = document.getElementById('sendWhatsApp');
waBtn.addEventListener('click', ()=>{
  const msg = buildMessage();
  const url = `https://wa.me/447818930933?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
});
const emailLink = document.getElementById('sendEmailLink');
function updateEmailLink(){
  const msg = buildMessage();
  const subject = `Enquiry — ${document.getElementById('pkg').value || 'Lumiatra'}`;
  emailLink.href = `mailto:info@lumiatra.online?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
}
['name','email','wa','pkg','country','objective','keywords','notes'].forEach(id=>{
  document.getElementById(id).addEventListener('input', updateEmailLink);
  document.getElementById(id).addEventListener('change', updateEmailLink);
});
updateEmailLink();
document.getElementById('leadForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  updateEmailLink();
  window.location.href = emailLink.href;
});

const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('navLinks');
toggle?.addEventListener('click', ()=>{
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
