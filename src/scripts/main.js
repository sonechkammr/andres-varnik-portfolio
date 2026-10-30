

// Practice Wheel ships inside this file as a blob so the link works offline.
const wheelBytes=Uint8Array.from(atob("{{base64:assets/projects/practice-wheel.html}}"),c=>c.charCodeAt(0));
document.querySelector('#wheel-link').href=URL.createObjectURL(new Blob([wheelBytes],{type:'text/html;charset=utf-8'}));
// The CV is embedded once; every other CV link borrows its href.
const cvHref=document.querySelector('.cv-link').href;document.querySelectorAll('.cv-link').forEach(a=>a.href=cvHref);

const root=document.documentElement;root.classList.add('js');
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:720px)');
const css=getComputedStyle(root);let TILT=parseFloat(css.getPropertyValue('--tilt'))||0;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t,smooth=t=>t*t*(3-2*t),ramp=(p,a,b)=>smooth(clamp((p-a)/(b-a))),windowAt=(p,a,b,c,d)=>ramp(p,a,b)*(1-ramp(p,c,d));
const setText=(el,text,animate=true)=>{if(el.textContent===text)return;el.textContent=text;if(animate&&!reduced.matches){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')}};

/* ---------- Header: tuck on scroll down, return on scroll up ---------- */
const topbar=$('.topbar'),nav=$('nav'),menu=$('.nav-toggle');let lastY=scrollY;
function updateHeader(){const y=scrollY,dy=y-lastY;topbar.classList.toggle('scrolled',y>8);if(nav.classList.contains('open')||y<120)topbar.classList.remove('tucked');else if(Math.abs(dy)>6)topbar.classList.toggle('tucked',dy>0);lastY=y}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu'}));
// Highlight the section in view.
const navMap=new Map($$('nav a[href^="#"]').map(a=>[a.getAttribute('href').slice(1),a]));
const navIO=new IntersectionObserver(es=>es.forEach(e=>{const a=navMap.get(e.target.id);if(a)a.setAttribute('aria-current',String(e.isIntersecting))}),{rootMargin:'-45% 0px -50% 0px'});
navMap.forEach((a,id)=>{const s=document.getElementById(id);if(s)navIO.observe(s)});

/* ---------- Reveal on scroll, with stagger between siblings ---------- */
function splitWords(h){if(h.dataset.split)return;h.dataset.split=1;h.setAttribute('aria-label',h.textContent.replace(/\s+/g,' ').trim());let wi=0;const walk=node=>{[...node.childNodes].forEach(n=>{if(n.nodeType===3){const frag=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){frag.append(' ');return}const w=document.createElement('span');w.className='w';w.setAttribute('aria-hidden','true');const inner=document.createElement('span');inner.textContent=part;inner.style.setProperty('--wi',wi++);w.append(inner);frag.append(w)});n.replaceWith(frag)}else if(n.nodeType===1&&n.tagName!=='BR')walk(n)})};walk(h);h.classList.add('split')}
$$('.reveal h2, h2.reveal').forEach(splitWords);
const groups=new Map();$$('.reveal').forEach(el=>{const p=el.parentElement;const n=groups.get(p)||0;el.style.setProperty('--i',Math.min(n,6));groups.set(p,n+1)});
const revealIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.querySelectorAll('.split').forEach(s=>s.classList.add('in'));revealIO.unobserve(e.target)}}),{threshold:0,rootMargin:'0px 0px -8% 0px'});
$$('.reveal').forEach(el=>revealIO.observe(el));

/* ---------- Scroll story ---------- */
const journey=$('.journey'),stage=$('.journey-stage'),traveller=$('#traveller'),api=$('.api-paper'),token=$('.flying-token');
const el={table:$('.traveller-table'),rowOne:$('.row-one'),rowThree:$('.row-three'),query:$('.traveller-query'),qlines:$$('.ql'),q1:$('.q1'),q2:$('.q2'),q2lines:$$('.ql2'),q2out:$('.q2-out'),reqs:$$('.req'),codes:$$('.req .rs'),patchBody:$('.r2 .req-body'),success:$('.traveller-success'),successTitle:$('.traveller-success h3'),successPoints:$$('.success-points>span'),sealIcon:$('.seal'),seal:$('.seal path'),label:$('#traveller-label'),opening:$('.opening'),actions:$('.opening .actions'),tokenValue:$('#token-value'),stamp:$('.case-stamp'),guide:$('.scene-guide'),live:$('.journey-live'),chapters:$$('[data-chapter]')};
const copies=[['.copy-data',.07,.14,.23,.30],['.copy-query',.26,.32,.41,.48],['.copy-api',.46,.52,.62,.69],['.copy-fix',.66,.72,.84,.90]].map(([s,...w])=>[$(s),...w]);
const stops=[0,.19,.36,.57,.76,1],chapterRanges=[0,.13,.31,.49,.69,.855,1];
const liveText=['Start. A customer reports a stuck order.','Data. Order 1042 has no warehouse.','SQL. The join returns NULL for the warehouse.','API. POST dispatch fails with 400, missing warehouse_id.','Fix. Every other Lumen order ships from Tallinn, warehouse 7. PATCH /orders/1042 sets warehouse_id to 7, 200 OK.','Verified. Sending the dispatch again returns 202 Accepted.'];
// [progress, x, y, width (fractions of the stage), height px, rotation deg]
const keyframesDesktop=[[0,.14,.66,.72,215,0],[.13,.30,.50,.62,215,-2],[.26,.39,.38,.54,250,2],[.40,.32,.44,.60,250,-1],[.52,.07,.47,.43,250,-1.5],[.65,.05,.46,.43,290,-1],[.82,.12,.46,.40,290,.5],[.86,.26,.31,.46,300,0],[.93,.20,.26,.60,340,0],[1,.15,.22,.70,380,0]];
const keyframesPhone=[[0,.05,.72,.90,150,0],[.13,.12,.52,.82,150,-2],[.26,.05,.35,.90,190,1.5],[.40,.05,.35,.90,190,-1],[.52,.04,.355,.90,180,-1],[.65,.04,.34,.90,212,-.5],[.82,.04,.34,.90,212,0],[.86,.06,.28,.88,290,0],[.93,.045,.25,.91,325,0],[1,.03,.22,.94,360,0]];
function positionAt(p,keys){let a=keys[0],b=keys.at(-1);for(let i=1;i<keys.length;i++){if(p<=keys[i][0]){a=keys[i-1];b=keys[i];break}}const t=smooth(clamp((p-a[0])/(b[0]-a[0])));return a.slice(1).map((v,i)=>mix(v,b[i+1],t))}
let size={W:0,H:0,keys:null,mobile:false};
function measure(){const W=stage.clientWidth,H=stage.clientHeight,m=phone.matches;let title=m?Math.min(60,Math.max(40,W*.12)):Math.min(100,W*.066,Math.max(40,(H*.52-170)/2.9));stage.style.setProperty('--hero-title',title+'px');const keys=(m?keyframesPhone:keyframesDesktop).map(r=>[...r]);
  // Layout offsets ignore the opening's animated transform and hidden state.
  const copy=$('.opening-copy'),bottom=()=>copy.offsetTop+el.actions.offsetTop+el.actions.offsetHeight,maxY=H-keys[0][4]-84;
  for(let i=0;i<4&&bottom()+24>maxY&&title>36;i++){title=Math.max(36,title-(bottom()+24-maxY)/2);stage.style.setProperty('--hero-title',title+'px');}
  keys[0][2]=Math.min(maxY,Math.max(keys[0][2]*H,bottom()+24))/H;size={W,H,keys,mobile:m}}

let bodyY=0,lastChapter=-1,lastFinish=null,lastFixed=null,lastAccepted=null,lastLabel='';
function renderJourney(p){const{W,H,keys,mobile:m}=size;const k=positionAt(p,keys);
  traveller.style.width=k[2]*W+'px';traveller.style.height=k[3]+'px';traveller.style.transform=`translate3d(${k[0]*W}px,${k[1]*H}px,0) rotate(${k[4]*TILT}deg)`;
  const morph=ramp(p,.17,.31),finish=ramp(p,.845,.89),find=ramp(p,.615,.645),find2=ramp(p,.645,.675);
  el.table.style.opacity=1-morph;el.table.style.transform=`translateY(${-morph*40}px) scaleY(${1-morph*.5})`;
  el.rowOne.style.transform=`translate(${morph*70}px,${-morph*18}px) rotate(${morph*3*TILT}deg)`;el.rowThree.style.transform=`translate(${morph*90}px,${morph*26}px) rotate(${-morph*3*TILT}deg)`;
  el.query.style.opacity=morph*(1-finish);el.query.style.transform=`translateY(${(1-morph)*30-finish*20}px)`;
  el.q1.style.opacity=1-find;el.q1.style.transform=`translateY(${-find*12}px)`;el.q2.style.opacity=find2;el.q2.style.transform=`translateY(${(1-find2)*12}px)`;el.q2lines.forEach((l,i)=>{const t=ramp(p,.648+i*.01,.675+i*.01);l.style.opacity=t;l.style.transform=`translateX(${(1-t)*-14}px)`});const qo=ramp(p,.685,.71);el.q2out.style.opacity=qo;el.q2out.style.transform=`translateY(${(1-qo)*6}px)`;el.q1.setAttribute('aria-hidden',String(find>.5));el.q2.setAttribute('aria-hidden',String(find<=.5));
  el.qlines.forEach((l,i)=>{const t=ramp(p,.2+i*.018,.26+i*.018);l.style.opacity=t;l.style.transform=`translateX(${(1-t)*-14}px)`});
  const successIn=ramp(p,.855,.885),checkIn=ramp(p,.865,.90),titleIn=ramp(p,.91,.94);
  el.success.style.opacity=successIn;el.success.style.transform=`translateY(${(1-successIn)*20}px)`;
  el.sealIcon.style.opacity=checkIn;el.sealIcon.style.transform=`scale(${.88+checkIn*.12})`;el.seal.style.setProperty('--draw',1-ramp(p,.875,.925));
  el.successTitle.style.opacity=titleIn;el.successTitle.style.transform=`translateY(${(1-titleIn)*14}px)`;
  el.successPoints.forEach((row,i)=>{const t=ramp(p,.935+i*.02,.955+i*.02);row.style.opacity=t;row.style.transform=`translateY(${(1-t)*12}px)`;row.setAttribute('aria-hidden',String(t<.02));});
  const solved=finish>.5;if(solved!==lastFinish){traveller.classList.toggle('solved',solved);lastFinish=solved}
  const label=solved?'order 1042 · resolved':find>.5?'find-warehouse.sql':morph>.5?'investigation.sql':'orders · 3 rows';if(label!==lastLabel){lastLabel=label;el.label.style.opacity=0;setTimeout(()=>{el.label.textContent=label;el.label.style.opacity=1},140)}
  const fade=1-ramp(p,.02,.13);el.opening.style.opacity=fade;el.opening.style.transform=`translateY(${-ramp(p,0,.2)*H*.35}px)`;el.opening.style.visibility=fade<.01?'hidden':'visible';el.opening.style.pointerEvents=fade>.5?'auto':'none';
  copies.forEach(([c,a,b,cc,d])=>{const o=windowAt(p,a,b,cc,d);c.style.opacity=o;c.style.transform=`translateY(${(mix(b,cc,.5)-p)*H*(m?.9:1.4)}px)`;c.style.visibility=o<.01?'hidden':'visible'});
  const ao=windowAt(p,.40,.49,.87,.93),ax=(m?.07:.55)*W,ay=(m?.597:.47)*H;api.style.width=(m?.86:.39)*W+'px';api.style.opacity=ao;api.style.transform=`translate3d(${ax+(1-ao)*40}px,${ay+(1-ao)*48}px,0) rotate(${mix(2,0,ramp(p,.47,.8))*TILT}deg)`;api.style.visibility=ao<.01?'hidden':'visible';
  [[.44,.50,.49],[.71,.75,.755],[.79,.83,.835]].forEach(([a,b,c],i)=>{const t=ramp(p,a,b),r=el.reqs[i];r.style.opacity=t;r.style.transform=`translateY(${(1-t)*10}px)`;const on=p>=c;if(el.codes[i].classList.contains('on')!==on)el.codes[i].classList.toggle('on',on)});
  // The token makes two trips: NULL from the query into the failing request, then 7 from the lookup into the PATCH.
  const f1=ramp(p,.39,.51),f2=ramp(p,.69,.745),o1=windowAt(p,.35,.40,.53,.58),o2=windowAt(p,.665,.69,.76,.8),second=p>.6;token.style.opacity=Math.max(o1,o2);
  let tx,ty,fly;if(!second){fly=f1;tx=m?mix(.49,.55,f1)*W:mix(.54,.69,f1)*W;ty=m?mix(.49,.61,f1)*H:mix(.61,.53,f1)*H}else{fly=f2;const sx=k[0]*W+(m?120:220),sy=k[1]*H+(m?175:250),exx=ax+(m?.42:.5)*(m?.86:.39)*W,eyy=ay+(bodyY||(bodyY=el.patchBody.getBoundingClientRect().top-api.getBoundingClientRect().top))-(m?10:8);tx=mix(sx,exx,f2);ty=mix(sy,eyy,f2)}
  const arc=Math.sin(fly*Math.PI)*-40;token.style.transform=`translate3d(${tx}px,${ty+arc}px,0) rotate(${mix(-4,2,fly)*TILT}deg) scale(${1+Math.sin(fly*Math.PI)*.08})`;
  if(second!==lastFixed){lastFixed=second;setText(el.tokenValue,second?'7':'NULL');token.classList.toggle('ok',second)}
  el.stamp.style.opacity=windowAt(p,.12,.2,.96,1.01);
  el.guide.style.opacity=windowAt(p,.12,.24,.76,.87)*.9;el.guide.style.transform=`translateY(${p*70+Math.sin(p*24)*5}px)`;
  el.table.setAttribute('aria-hidden',String(morph>.98));el.query.setAttribute('aria-hidden',String(morph<.02||finish>.98));el.success.setAttribute('aria-hidden',String(finish<.02));
  const chapter=Math.max(0,chapterRanges.slice(0,-1).findLastIndex(start=>p>=start));
  el.chapters.forEach((b,i)=>{const a=chapterRanges[i],z=chapterRanges[i+1];b.style.setProperty('--fill',clamp((p-a)/(z-a)))});
  stage.dataset.progress=p.toFixed(4);
  if(chapter!==lastChapter){lastChapter=chapter;el.chapters.forEach((b,i)=>{b.classList.toggle('active',i===chapter);b.setAttribute('aria-current',i===chapter?'step':'false')});el.live.textContent=liveText[chapter]}}

/* ---------- Portal into the forest ---------- */
const portal=$('.portal'),portalStage=$('.portal-stage'),pe={paper:$('.portal-paper'),heading:$('.portal-heading'),forest:$('.portal-forest'),walker:$('.walker'),caption:$('.forest-caption')};
function renderPortal(p){const H=portalStage.clientHeight;pe.paper.style.transform=`translate3d(0,${-p*H*1.12}px,0)`;pe.heading.style.opacity=1-ramp(p,.07,.45);pe.heading.style.transform=`translateY(${-p*H*.5}px)`;pe.forest.style.transform=`translate3d(0,${(1-p)*H*.06}px,0) scale(${1.08-p*.08})`;const step=Math.sin(p*Math.PI*8);pe.walker.style.transform=`translate3d(${(1-p)*-80}px,${(1-p)*40+Math.abs(step)*-4*(1-p)}px,0) rotate(${step*.8*(1-p)}deg)`;pe.caption.style.opacity=ramp(p,.4,.72);pe.caption.style.transform=`translateY(${(1-ramp(p,.4,.8))*30}px)`;pe.caption.style.visibility=p<.39?'hidden':'visible'}

/* ---------- Small scroll-linked touches ---------- */
const phones=$$('.phone'),gardenVisual=$('.garden-visual'),headArt=$('.projects-head .art');
function renderParallax(){if(reduced.matches)return;const r=gardenVisual.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const t=clamp((innerHeight-r.top)/(innerHeight+r.height))-.5;phones[0].style.transform=`translateY(${t*-40}px) rotate(${-4*TILT}deg)`;phones[1].style.transform=`translateY(${36+t*50}px) rotate(${5*TILT}deg)`}const h=headArt.getBoundingClientRect();if(h.bottom>0&&h.top<innerHeight){const t=clamp((innerHeight-h.top)/(innerHeight+h.height))-.5;headArt.style.transform=`translateY(${t*-24}px) scale(1.06)`}}

/* ---------- One loop, eased toward the scroll position ---------- */
let reading=reduced.matches,readProgress=0,jp=0,jt=0,pp=0,pt=0,ticking=false,lastT=0;
function targets(){const r=journey.getBoundingClientRect(),range=journey.offsetHeight-stage.clientHeight;jt=reading?readProgress:clamp(-r.top/Math.max(1,range));const pr=portal.getBoundingClientRect();pt=reduced.matches?1:clamp(-pr.top/Math.max(1,portal.offsetHeight-portalStage.clientHeight))}
function frame(t){const dt=Math.min(64,t-(lastT||t))/1000;lastT=t;targets();const k=reduced.matches?1:1-Math.exp(-dt*11);jp+=(jt-jp)*k;pp+=(pt-pp)*k;if(Math.abs(jt-jp)<.0004)jp=jt;if(Math.abs(pt-pp)<.0004)pp=pt;renderJourney(jp);renderPortal(pp);renderParallax();updateHeader();if(jp!==jt||pp!==pt){requestAnimationFrame(frame)}else{ticking=false;lastT=0}}
function queue(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',()=>{bodyY=0;measure();queue()});document.fonts?.ready.then(()=>{bodyY=0;measure();queue()});addEventListener('pageshow',queue);
function setReading(v){reading=v;document.body.classList.toggle('reading-journey',reading);const t=$('.motion-toggle');t.setAttribute('aria-pressed',String(reading));t.textContent=reading?'Back to scrolling':'Step through instead';measure();queue()}
$('.motion-toggle').addEventListener('click',()=>{readProgress=stops.reduce((b,s)=>Math.abs(s-jp)<Math.abs(b-jp)?s:b,0);setReading(!reading);scrollTo({top:journey.offsetTop,behavior:'instant'})});
reduced.addEventListener('change',()=>setReading(reduced.matches));
function goChapter(i){const p=stops[i];if(reading){readProgress=p;queue();return}scrollTo({top:journey.offsetTop+p*(journey.offsetHeight-stage.clientHeight),behavior:reduced.matches?'instant':'smooth'})}
el.chapters.forEach(b=>b.addEventListener('click',()=>goChapter(+b.dataset.chapter)));
$$('[data-jump]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();goChapter(+a.dataset.jump)}));
document.addEventListener('keydown',e=>{if(!reading||!stage.contains(document.activeElement))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const i=lastChapter+(e.key==='ArrowRight'?1:-1);if(i>=0&&i<6){e.preventDefault();goChapter(i)}}});
// Hero entrance.
if(!reduced.matches){const lines=$$('.opening .hero-title .line>span'),fade=[$('.opening .kicker'),$('.opening .lede'),el.actions],art=$('.room-art');lines.forEach((l,i)=>l.animate([{transform:'translateY(105%)'},{transform:'none'}],{duration:1100,delay:120+i*90,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));fade.forEach((f,i)=>f.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:900,delay:i===0?40:380+i*90,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));art.animate([{opacity:0,transform:'scale(1.05)',filter:'blur(6px)'},{opacity:1,transform:'none',filter:'blur(0)'}],{duration:1500,delay:150,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});traveller.animate([{opacity:0,translate:'0 30px'},{opacity:1,translate:'0 0'}],{duration:1000,delay:600,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})}
measure();setReading(reading);

/* ---------- Fireflies ---------- */
const flies=$('.fireflies');for(let i=0;i<20;i++){const f=document.createElement('i');f.className='firefly';const r=(n)=>((Math.sin(i*12.9898+n*78.233)*43758.5453)%1+1)%1;f.style.cssText=`left:${r(1)*96+2}%;top:${r(2)*80+8}%;--d:${5+r(3)*6}s;--b:${2+r(4)*3}s;--o:-${r(5)*8}s;--dx:${(r(6)-.5)*60}px;--dy:${(r(7)-.5)*50}px`;flies.append(f)}

/* ---------- Lab ---------- */
const labTabs=$$('.lab-tabs [role=tab]'),labPanels=$$('.lab-panel'),tabInk=$('.tab-ink');
const labDescriptions=['Two waves can add up or cancel out. Shift one and watch the sum change.','A lighter weight can balance a heavier one if it sits farther from the pivot. Move the 5 kg and find the balance point.','Light slows down in water. Change the angle and watch the ray bend towards the dashed line.'];
function placeInk(){const t=labTabs.find(t=>t.getAttribute('aria-selected')==='true');tabInk.style.width=t.offsetWidth+'px';tabInk.style.transform=`translateX(${t.offsetLeft}px)`}
function selectLab(index,focus=false){labTabs.forEach((tab,i)=>{const on=i===index;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;const was=labPanels[i].hidden;labPanels[i].hidden=!on;if(on&&was){labPanels[i].classList.remove('enter');void labPanels[i].offsetWidth;labPanels[i].classList.add('enter')}});const d=$('#lab-description');d.style.opacity=0;setTimeout(()=>{d.textContent=labDescriptions[index];d.style.opacity=1},150);placeInk();if(focus)labTabs[index].focus()}
labTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectLab(i));tab.addEventListener('keydown',e=>{let n=i;if(e.key==='ArrowRight')n=(i+1)%3;else if(e.key==='ArrowLeft')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;else return;e.preventDefault();selectLab(n,true)})});
addEventListener('resize',placeInk);document.fonts?.ready.then(placeInk);
const phase=$('#phase');let drift=0,waveVisible=false,waveRaf=0,waveLast=0;
function drawWaves(){const p=phase.value/100,paths=[[],[],[]];for(let x=0;x<=400;x+=4){const t=x/400*Math.PI*4+drift,a=Math.sin(t),b=Math.sin(t+p);[a*23,b*23,(a+b)*23].forEach((v,i)=>paths[i].push((x?'L':'M')+x+','+(75-v).toFixed(1)))}['wave-a','wave-b','wave-sum'].forEach((id,i)=>document.getElementById(id).setAttribute('d',paths[i].join('')));const amp=Math.abs(Math.cos(p/2));$('#wave-caption').textContent=amp<.15?'Out of step: they almost cancel.':amp>.9?'In step: a bigger wave.':'Partly in step: a smaller sum.'}
function waveLoop(t){const dt=Math.min(50,t-(waveLast||t));waveLast=t;drift-=dt*.0012;drawWaves();if(waveVisible&&!$('#lab-wave').hidden&&!reduced.matches)waveRaf=requestAnimationFrame(waveLoop);else{waveRaf=0;waveLast=0}}
new IntersectionObserver(([e])=>{waveVisible=e.isIntersecting;if(waveVisible&&!waveRaf&&!reduced.matches)waveRaf=requestAnimationFrame(waveLoop)}).observe($('.lab'));
labTabs[0].addEventListener('click',()=>{if(waveVisible&&!waveRaf&&!reduced.matches)waveRaf=requestAnimationFrame(waveLoop)});
phase.addEventListener('input',drawWaves);drawWaves();
function drawLever(){const d=+$('#lever-distance').value/100,left=10,right=5*d,x=200+d*60,angle=clamp((right-left)*1.8,-12,12);$('#lever-weight').setAttribute('transform',`translate(${x},0)`);$('#lever-distance-label').setAttribute('x',x);$('#lever-distance-label').textContent=d.toFixed(2)+' m';$('#lever-beam').style.transform=`rotate(${angle}deg)`;$('#lever-caption').textContent=Math.abs(right-left)<.01?'Balanced: half the mass, twice the distance.':right>left?'The lighter side wins. Distance matters.':'The heavy side wins. Move the 5 kg farther out.';$('#lever-math').textContent=`Left: 10 kg × 1 m. Right: 5 kg × ${d.toFixed(2)} m. Gravity cancels out in this comparison; the tilt just shows which side turns harder.`}
$('#lever-distance').addEventListener('input',drawLever);drawLever();
function drawLight(){const deg=+$('#light-angle').value,a=deg*Math.PI/180,b=Math.asin(Math.sin(a)/1.333),sx=200-100*Math.sin(a),sy=110-100*Math.cos(a),ex=200+100*Math.sin(b),ey=110+100*Math.cos(b);$('#light-in').setAttribute('d',`M${sx},${sy}L200,110`);$('#light-out').setAttribute('d',`M200,110L${ex},${ey}`);$('#light-straight').setAttribute('d',`M200,110L${200+100*Math.sin(a)},${110+100*Math.cos(a)}`);$('#light-source').setAttribute('cx',sx);$('#light-source').setAttribute('cy',sy);$('#light-caption').textContent=deg===0?'Straight in, straight through.':`${deg}° in air → ${(b*180/Math.PI).toFixed(1)}° in water.`}
$('#light-angle').addEventListener('input',drawLight);drawLight();selectLab(0);

/* ---------- Contact ---------- */
const copyBtn=$('#copy-email');let copyTimer;
copyBtn.addEventListener('click',async()=>{const email='viva.la.nick13@gmail.com';try{await navigator.clipboard.writeText(email);copyBtn.classList.remove('copied');void copyBtn.offsetWidth;copyBtn.classList.add('copied');$('#copy-status').textContent='Email copied.';clearTimeout(copyTimer);copyTimer=setTimeout(()=>copyBtn.classList.remove('copied'),2200)}catch{$('#copy-status').textContent='Copy failed. The address is '+email}});
$('#year').textContent=new Date().getFullYear();

