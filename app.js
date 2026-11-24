{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* hero route with driving car */
const stops=[
{n:"Chicago",m:0},{n:"Springfield IL",m:200},{n:"St. Louis",m:300},{n:"Springfield MO",m:515},
{n:"Tulsa",m:690,night:true},{n:"Dallas",m:950},{n:"Waco",m:1045},{n:"San Antonio",m:1220,end:true}
];
const box=document.querySelector('#route'),s=box.querySelector('svg');
let carM=reduce?1220:0;
const geo=()=>{const W=box.clientWidth,H=box.clientHeight,narrow=W<600;
if(narrow){const top=24,bot=H-24,x=46;return{narrow,W,H,x,top,bot,pt:m=>[x,top+(bot-top)*m/1220]}}
const l=60,r=W-60,y=H*0.58;return{narrow,W,H,l,r,y,pt:m=>[l+(r-l)*m/1220,y]}};
const draw=()=>{
const g=geo();let o='';
if(g.narrow){
o+=`<line x1="${g.x}" y1="${g.top}" x2="${g.x}" y2="${g.bot}" stroke="#2c2f2d" stroke-width="18" stroke-linecap="round"/><line x1="${g.x}" y1="${g.top}" x2="${g.x}" y2="${g.bot}" stroke="#ffcc29" stroke-width="2" stroke-dasharray="8 8"/>`;
stops.forEach(p=>{const[x,y]=g.pt(p.m),big=p.night||p.end||p.m===0;
o+=`<circle cx="${x}" cy="${y}" r="${big?10:6}" fill="${p.night?'#ffcc29':'#fff'}" stroke="#1f4fa3" stroke-width="3"/><text x="${x+40}" y="${y+5}" fill="#fff" font-size="${big?16:14}" font-weight="${big?800:600}">${p.n}${p.night?' · overnight':''}</text>`});
}else{
o+=`<rect x="${g.l-20}" y="${g.y-14}" width="${g.r-g.l+40}" height="28" rx="14" fill="#2c2f2d"/><line x1="${g.l}" y1="${g.y}" x2="${g.r}" y2="${g.y}" stroke="#ffcc29" stroke-width="2" stroke-dasharray="10 10"/>`;
const mid=g.pt(690)[0];
o+=`<text x="${(g.l+mid)/2}" y="${g.y+50}" fill="#d4ebdd" font-size="14" text-anchor="middle">Friday · about 690 mi</text><text x="${(mid+g.r)/2}" y="${g.y+50}" fill="#d4ebdd" font-size="14" text-anchor="middle">Saturday · about 530 mi</text>`;
stops.forEach(p=>{const[x,y]=g.pt(p.m),big=p.night||p.end||p.m===0;
o+=`<circle cx="${x}" cy="${y}" r="${big?11:7}" fill="${p.night?'#ffcc29':'#fff'}" stroke="#1f4fa3" stroke-width="3"/><text x="${x}" y="${y+(big?-62:-28)}" fill="#fff" font-size="${big?17:14}" font-weight="${big?800:600}" text-anchor="middle">${p.n}</text>`;
if(p.night)o+=`<text x="${x}" y="${y-80}" fill="#ffcc29" font-size="14" font-weight="800" text-anchor="middle">overnight</text>`;});
}
o+=`<g id="hcar"><use href="#carIcon" width="56" height="38"/></g>`;
s.innerHTML=o;placeCar();
};
const placeCar=()=>{const c=s.querySelector('#hcar');if(!c)return;const g=geo(),[x,y]=g.pt(carM);
c.setAttribute('transform',g.narrow?`translate(${x-28},${y-19})`:`translate(${x-28},${y-46})`)};
const ro=new ResizeObserver(draw);ro.observe(box);
if(!reduce){const t0=performance.now(),dur=5200;
const step=t=>{const k=Math.min(1,(t-t0)/dur),e=k<.5?2*k*k:1-((-2*k+2)**2)/2;carM=1220*e;placeCar();if(k<1)requestAnimationFrame(step)};
requestAnimationFrame(step);}
/* stars for the night card */
const st=document.querySelector('.night .stars');
if(st){let seed=7,h='';const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
for(let i=0;i<26;i++)h+=`<i style="left:${(rnd()*100).toFixed(1)}%;top:${(rnd()*100).toFixed(1)}%"></i>`;st.innerHTML=h;}
/* reveal on scroll */
const rv=[...document.querySelectorAll('.rv')];
if('IntersectionObserver' in window&&!reduce){
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});
rv.forEach(el=>io.observe(el));
}else rv.forEach(el=>el.classList.add('in'));
/* scroll timeline: car follows, meter updates */
const trip=document.querySelector('#tripline'),car=document.querySelector('#tcar'),
tstops=[...trip.querySelectorAll('.stop')],
mW=document.querySelector('#mWhere'),mM=document.querySelector('#mMiles'),mD=document.querySelector('#mMoney'),mB=document.querySelector('#mBar');
let ticking=false;
const update=()=>{ticking=false;
const r=trip.getBoundingClientRect(),vh=innerHeight,meterH=90;
const focus=vh*0.55;
let y=focus-r.top;const max=trip.offsetHeight-50;
y=Math.max(meterH,Math.min(max,y));car.style.top=y+'px';
let cur=tstops[0];for(const el of tstops){if(el.getBoundingClientRect().top<focus)cur=el}
const mi=+cur.dataset.mile,mo=+cur.dataset.money;
mW.textContent=cur.dataset.where;mM.textContent=mi.toLocaleString();mD.textContent='$'+mo;mB.style.width=(mi/1220*100)+'%';
};
const onScroll=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
update();
}
