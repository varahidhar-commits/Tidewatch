const TOUR_STEPS = [
  { title: '1. Fisher safety status', text: 'Start by checking whether the vessel is safe to sail before departure.', find: () => textNode(['SAFE / CAUTION / DO NOT SAIL','Safe to Sail','Trip Safety Score']) },
  { title: '2. Trip details', text: 'Enter trip timing, fishing direction, crew and emergency information before requesting clearance.', find: () => textNode(['Start of Trip','Trip Details','Fishing Zone Direction']) },
  { title: '3. AI risk evaluation', text: 'Review fuel, engine, sustainability and safety intelligence before departure.', find: () => textNode(['Fuel','Engine','Sustainability','AI / ML']) },
  { title: '4. Government approval', text: 'The Fisheries Department reviews the sailing request and records its decision.', find: () => textNode(['Government Approval','Request Approval to Sail','Government Command Centre']) },
  { title: '5. Digital Sea Pass', text: 'After approval, TideWatch issues a digital verification pass for the trip.', find: () => textNode(['Digital Sea Pass','VALID']) },
  { title: '6. Live vessel monitoring', text: 'Track the vessel position, route, patrol assets and monitored zones during the trip.', find: () => textNode(['LIVE OPERATIONS MAP','LIVE MARITIME RADAR','Live Vessel Intelligence']) },
  { title: '7. Catch and quota', text: 'Log catch records and monitor quota pressure as the trip progresses.', find: () => textNode(['Log a Catch','Trip quota progress','Catch Log']) },
  { title: '8. Restricted-zone alert', text: 'TideWatch highlights geofence breaches so authorities can intervene quickly.', find: () => textNode(['restricted-zone','Restricted Zone','Fishing-Zone Compliance']) },
  { title: '9. Fuel return warning', text: 'Low fuel risk generates an early recommendation to return safely to port.', find: () => textNode(['Fuel & Engine Intelligence','Fuel Risk','Engine & Fuel']) },
  { title: '10. Audit-ready record', text: 'The trip closes with a traceable operational record for safety and compliance review.', find: () => textNode(['Trip Replay','audit-ready','Digital Marine Governance']) },
];

function textNode(needles) {
  const all = [...document.querySelectorAll('h1,h2,h3,div,span,p,button')];
  return all.find(el => {
    if (!el.offsetParent) return false;
    const txt = (el.textContent || '').trim();
    return txt.length < 180 && needles.some(n => txt.toLowerCase().includes(n.toLowerCase()));
  }) || null;
}

let current = -1;
let root = null;
let box = null;
let halo = null;
let autoTimer = null;
let lastTarget = null;

function createUi() {
  if (root) return;
  const style = document.createElement('style');
  style.textContent = `
    #tw-tour-root{position:fixed;inset:0;z-index:99999;pointer-events:none;font-family:Inter,Arial,sans-serif}
    #tw-tour-halo{position:fixed;border:2px solid #33d6c0;border-radius:10px;box-shadow:0 0 0 9999px rgba(2,10,18,.55),0 0 0 5px rgba(51,214,192,.13),0 0 28px rgba(51,214,192,.35);transition:all .35s ease;pointer-events:none}
    #tw-tour-box{position:fixed;width:min(390px,calc(100vw - 28px));background:#0b1c2b;border:1px solid #33d6c0;border-radius:10px;padding:16px;box-shadow:0 18px 55px rgba(0,0,0,.4);pointer-events:auto;color:#e7eef3}
    #tw-tour-box h3{margin:0 0 7px;font-size:16px;color:#e7eef3}
    #tw-tour-box p{margin:0 0 14px;font-size:12.5px;line-height:1.55;color:#9ab3c3}
    #tw-tour-meta{font:10px monospace;color:#33d6c0;letter-spacing:.12em;margin-bottom:8px;text-transform:uppercase}
    #tw-tour-actions{display:flex;justify-content:space-between;gap:8px;align-items:center}
    #tw-tour-actions button{border:1px solid #1d3b52;background:#0e2233;color:#e7eef3;border-radius:5px;padding:8px 11px;cursor:pointer;font-weight:600}
    #tw-tour-actions button.primary{background:#33d6c0;color:#081420;border-color:#33d6c0}
    #tw-tour-actions button:disabled{opacity:.4;cursor:not-allowed}
    #tw-tour-close{position:absolute;right:10px;top:9px;background:none!important;border:0!important;color:#7f9cb0!important;font-size:17px;padding:3px!important}
    @media(max-width:700px){#tw-tour-box{left:14px!important;right:auto!important;bottom:14px!important;top:auto!important}}
  `;
  document.head.appendChild(style);
  root = document.createElement('div');
  root.id = 'tw-tour-root';
  root.innerHTML = `<div id="tw-tour-halo"></div><div id="tw-tour-box"><button id="tw-tour-close" aria-label="Close guided demo">✕</button><div id="tw-tour-meta"></div><h3></h3><p></p><div id="tw-tour-actions"><button id="tw-tour-prev">Back</button><div style="display:flex;gap:7px"><button id="tw-tour-pause">Pause</button><button id="tw-tour-next" class="primary">Next</button></div></div></div>`;
  document.body.appendChild(root);
  halo = root.querySelector('#tw-tour-halo');
  box = root.querySelector('#tw-tour-box');
  root.querySelector('#tw-tour-close').onclick = stop;
  root.querySelector('#tw-tour-prev').onclick = () => show(Math.max(0,current-1), false);
  root.querySelector('#tw-tour-next').onclick = () => current >= TOUR_STEPS.length-1 ? stop() : show(current+1, false);
  root.querySelector('#tw-tour-pause').onclick = () => { clearTimeout(autoTimer); autoTimer=null; root.querySelector('#tw-tour-pause').textContent='Paused'; };
  window.addEventListener('resize', () => current >= 0 && position(lastTarget));
  window.addEventListener('scroll', () => current >= 0 && position(lastTarget), { passive:true });
}

function position(target) {
  if (!target || !target.isConnected) return;
  const r = target.getBoundingClientRect();
  const pad = 8;
  halo.style.left = `${Math.max(6,r.left-pad)}px`;
  halo.style.top = `${Math.max(6,r.top-pad)}px`;
  halo.style.width = `${Math.min(innerWidth-12,r.width+pad*2)}px`;
  halo.style.height = `${Math.min(innerHeight-12,r.height+pad*2)}px`;
  const bw = Math.min(390, innerWidth-28), bh = box.offsetHeight || 190;
  let left = r.right + 18;
  if (left + bw > innerWidth - 14) left = Math.max(14, r.left - bw - 18);
  let top = Math.max(14, Math.min(innerHeight - bh - 14, r.top));
  if (innerWidth <= 700) { left = 14; top = innerHeight - bh - 14; }
  box.style.left = `${left}px`; box.style.top = `${top}px`;
}

function show(index, autoplay=true) {
  createUi(); clearTimeout(autoTimer); current=index;
  const step=TOUR_STEPS[index];
  root.style.display='block';
  root.querySelector('#tw-tour-meta').textContent=`INDUSTRY DEMO · ${index+1}/${TOUR_STEPS.length}`;
  root.querySelector('h3').textContent=step.title;
  root.querySelector('p').textContent=step.text;
  root.querySelector('#tw-tour-prev').disabled=index===0;
  root.querySelector('#tw-tour-next').textContent=index===TOUR_STEPS.length-1?'Finish':'Next';
  root.querySelector('#tw-tour-pause').textContent='Pause';
  let target=step.find();
  if (!target) target=document.querySelector('main,#root') || document.body;
  lastTarget=target;
  target.scrollIntoView({behavior:'smooth',block:'center',inline:'nearest'});
  setTimeout(()=>position(target),450);
  if (autoplay) autoTimer=setTimeout(()=>{ if(current<TOUR_STEPS.length-1) show(current+1,true); },5500);
}

function stop(){ clearTimeout(autoTimer); autoTimer=null; current=-1; if(root) root.style.display='none'; }

function bindStartButton(){
  const buttons=[...document.querySelectorAll('button')];
  const btn=buttons.find(b=>/Start Industry Demo|தொழில் டெமோ|इंडस्ट्री डेमो|ഇൻഡസ്ട്രി ഡെമോ|ఇండస్ట్రీ డెమో/i.test((b.textContent||'').trim()));
  if(!btn || btn.dataset.twTourBound) return;
  btn.dataset.twTourBound='1';
  btn.addEventListener('click',e=>{ e.stopImmediatePropagation(); e.preventDefault(); show(0,true); },true);
}

new MutationObserver(bindStartButton).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',bindStartButton);
setTimeout(bindStartButton,200);
