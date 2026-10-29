
(()=>{
'use strict';
const section=document.querySelector('#photography'),book=section.querySelector('#pb-book'),leavesHost=section.querySelector('#pb-leaves'),prevBtn=section.querySelector('#pb-prev'),nextBtn=section.querySelector('#pb-next'),count=section.querySelector('#pb-count'),status=section.querySelector('#pb-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),small=matchMedia('(max-width:720px)');
const text={en:{title:'Through my lens.',kicker:'A different way of noticing',intro:'I’m also a photographer: portraits, street details and quiet corners.',photos:'Photographs',turn:'Turn the page →',end:'That’s the book for now. There are more on Instagram.',hint:'Click a page or use the arrows to turn it.',prev:'Previous page',next:'Next page',book:'Photo book',of:'of',endLabel:'End',nav:'Photography',shown:'Showing'},
et:{title:'Läbi minu objektiivi.',kicker:'Teine viis märgata',intro:'Tegelen ka fotograafiaga: portreed, tänavadetailid ja vaiksed nurgad.',photos:'Fotod',turn:'Keera lehte →',end:'Raamat on praegu siin otsas. Rohkem fotosid on Instagramis.',hint:'Lehe keeramiseks klõpsa lehel või kasuta nooli.',prev:'Eelmine leht',next:'Järgmine leht',book:'Fotoraamat',of:'/',endLabel:'Lõpp',nav:'Fotograafia',shown:'Näidatakse'}};
const lang=()=>document.documentElement.lang==='et'?'et':'en',w=()=>text[lang()];
// Photos are shuffled once per visit, as before; the order then stays put while reading.
const photos=[...section.querySelector('#pb-photos').content.children];
for(let i=photos.length-1;i>0;i--){const a=new Uint32Array(1);crypto.getRandomValues(a);const j=Math.floor(a[0]/4294967296*(i+1));[photos[i],photos[j]]=[photos[j],photos[i]]}
const N=photos.length,pad=n=>String(n).padStart(2,'0');
function page(side,kind,i){const p=document.createElement('div');p.className=`pb-page pb-${side==='back'?'left pb-back':'right pb-front'}`;
  if(kind==='photo'){const f=photos[i];p.dataset.photo=i;p.innerHTML=`<div class="pb-photo"></div><p class="pb-cap"><b></b><span>${pad(i+1)}</span></p>`;const svg=f.querySelector('svg').cloneNode(true),[,,vw,vh]=svg.getAttribute('viewBox').split(/\s+/).map(Number);svg.style.setProperty('--ar',vw/vh);p.querySelector('.pb-photo').append(svg)}
  else if(kind==='end'){p.classList.add('pb-end');p.innerHTML=`<p class="pb-small">${'@undress.v'}</p><p class="pb-end-text"></p><a href="https://www.instagram.com/undress.v/" target="_blank" rel="noopener noreferrer" tabindex="-1">Instagram ↗</a>`}
  else p.classList.add('pb-blank');
  return p}
let leaves=[],turned=0,single=null,flipSeq=0,busy=false,pending=0,flipTimer=0;
function finishFlip(){clearTimeout(flipTimer);busy=false;leaves.forEach((leaf,j)=>{leaf.classList.remove("flipping");rest(leaf,j)});if(pending){const dir=Math.sign(pending);pending-=dir;flip(dir)}}
// Wide: the inside cover is the title page, then each leaf carries a photo on the front and the next on its back.
// Phone: each leaf carries one photo, its back is plain paper, and the last leaf is the end page.
function build(){const photo=leaves.length?visible()[0]:0;clearTimeout(flipTimer);busy=false;pending=0;single=small.matches;turned=photo==null?0:single?photo:Math.floor((photo+1)/2);book.classList.toggle('single',single);leavesHost.replaceChildren();leaves=[];
  const specs=[];if(single){for(let i=0;i<N;i++)specs.push([['photo',i],['blank']]);specs.push([['end'],['blank']])}
  else{for(let i=0;i<N;i+=2)specs.push([['photo',i],i+1<N?['photo',i+1]:['end']]);if(N%2===0)specs.push([['end'],['blank']])}
  specs.forEach(([f,b],j)=>{const leaf=document.createElement('div');leaf.className='pb-leaf';leaf.append(page('front',...f),page('back',...b));leaf.addEventListener('transitionend',e=>{if(e.target!==leaf||e.propertyName!=='transform')return;finishFlip()});leavesHost.append(leaf);leaves.push(leaf)});
  section.querySelector('.pb-title').hidden=single;turned=Math.min(turned,max());leaves.forEach((l,j)=>{l.classList.toggle('turned',j<turned);rest(l,j)});labels()}
const max=()=>single?leaves.length-1:leaves.length;
function rest(leaf,j){leaf.style.zIndex=leaf.classList.contains('turned')?j+1:leaves.length-j}
function flip(dir){if(busy){pending=Math.max(-6,Math.min(6,pending+dir));return}const to=turned+dir;if(to<0||to>max())return;const j=dir>0?turned:to,leaf=leaves[j];turned=to;
  if(!reduced.matches){busy=true;flipTimer=setTimeout(finishFlip,1100);leaf.classList.remove('flipping');void leaf.offsetWidth;leaf.classList.add('flipping');leaf.style.zIndex=leaves.length+10+(++flipSeq)}
  leaf.classList.toggle('turned',dir>0);if(reduced.matches)rest(leaf,j);labels(true)}
// Which photos are visible right now, for the counter and screen readers.
function visible(){if(single){const f=leaves[turned]?.querySelector('.pb-front');return f?.dataset.photo!=null?[+f.dataset.photo]:[]}
  const out=[];const left=turned>0?leaves[turned-1].querySelector('.pb-back'):null,right=leaves[turned]?.querySelector('.pb-front');[left,right].forEach(p=>{if(p?.dataset.photo!=null)out.push(+p.dataset.photo)});return out}
function labels(announce=false){const t=w(),v=visible();
  section.querySelector('#pg-title').textContent=t.title;section.querySelector('#pg-kicker').textContent=t.kicker;section.querySelector('#pg-intro').textContent=t.intro;
  const nav=document.querySelector('#photo-nav');if(nav)nav.textContent=t.nav;
  section.querySelector('.pb-title .pb-small').textContent=t.photos;section.querySelector('.pb-title .pb-turn').textContent=t.turn;section.querySelector('#pb-hint').textContent=t.hint;
  book.setAttribute('aria-label',t.book);book.dataset.page=String(turned);prevBtn.setAttribute('aria-label',t.prev);nextBtn.setAttribute('aria-label',t.next);
  section.querySelectorAll('.pb-end-text').forEach(p=>p.textContent=t.end);
  leaves.forEach(l=>l.querySelectorAll('[data-photo]').forEach(p=>{const f=photos[+p.dataset.photo];p.querySelector('b').textContent=f.dataset[lang()==='et'?'captionEt':'captionEn']}));
  const label=v.length?v.map(i=>pad(i+1)).join('–')+' / '+N:t.endLabel;count.textContent=label;
  prevBtn.disabled=turned===0;nextBtn.disabled=turned===max();
  // Only the open pages are exposed; the rest of the stack is hidden from assistive tech.
  leaves.forEach((l,j)=>{const open=single?j===turned:(j===turned||j===turned-1);l.setAttribute('aria-hidden',String(!open));l.querySelectorAll('.pb-front,.pb-back').forEach(face=>{const shown=single?j===turned&&face.classList.contains('pb-front'):(j===turned&&face.classList.contains('pb-front'))||(j===turned-1&&face.classList.contains('pb-back'));face.setAttribute('aria-hidden',String(!shown));face.querySelectorAll('a').forEach(a=>a.tabIndex=shown?0:-1)})});
  if(announce)status.textContent=v.length?`${t.shown}: ${v.map(i=>photos[i].dataset[lang()==='et'?'captionEt':'captionEn']).join(' · ')}. ${label}`:t.endLabel}
prevBtn.addEventListener('click',()=>flip(-1));nextBtn.addEventListener('click',()=>flip(1));
// Click the right half to go forward, the left half to go back; a horizontal swipe does the same.
let down=null;
book.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;down={x:e.clientX,y:e.clientY}});
book.addEventListener('pointerup',e=>{if(!down||e.target.closest('a'))return;const dx=e.clientX-down.x,dy=e.clientY-down.y;down=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))flip(dx<0?1:-1);
  else if(Math.abs(dx)<8&&Math.abs(dy)<8){const r=book.getBoundingClientRect();flip(single?(e.clientX<r.left+r.width*.3?-1:1):(e.clientX<r.left+r.width/2?-1:1))}});
book.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();flip(1)}else if(e.key==='ArrowLeft'){e.preventDefault();flip(-1)}});
book.addEventListener('pointercancel',()=>down=null);
reduced.addEventListener('change',()=>{pending=0;finishFlip()});
small.addEventListener('change',build);
new MutationObserver(()=>labels()).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
build();
})();
