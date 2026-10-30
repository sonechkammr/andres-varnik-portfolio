(()=>{'use strict';
const shell=document.querySelector('#egg'), canvas=document.querySelector('#runner-track'),g=canvas.getContext('2d'),soundButton=document.querySelector('#egg-sound'),pauseButton=document.querySelector('#egg-pause'),exit=document.querySelector('#egg-exit'),restart=document.querySelector('#egg-restart'),secret=document.querySelector('#egg-secret');
const W=960,H=540,keys=new Set(),mouse={x:700,y:270,down:false};
const screen=shell.querySelector('.egg-screen'),controls=shell.querySelector('.egg-touch-controls'),controlButtons=[...controls.querySelectorAll('[data-egg-control]')],actionButton=controls.querySelector('.egg-action'),touchMedia=matchMedia('(any-pointer: coarse), (max-width: 900px)'),touchKeys=new Set(),touchPointers=new Map();
let touchMode=touchMedia.matches,viewW=W,viewH=H,viewX=0,viewY=0,aimPointer=null,touchAim={x:1,y:0};
const held=code=>keys.has(code)||touchKeys.has(code);
let state='ready',scene=0,time=0,local=0,last=0,raf=0,life=3,inv=0,cam=0,lamp=false,transition=0,nextScene=0,audio=null,sound=false,noteAt=0,particles=[],enemies=[],killed=0,spawned=0,spawnAt=0,shake=0,visible=false;
function player(x=120,y=455){return {x,y,vx:0,vy:0,ground:true,face:1,coyote:.1,buffer:0,land:0,step:0,lean:0};}
let p=player(),returnY=0,touchY=null;
const FEEL={speed:230,accel:1100,brake:1400,turn:1750,air:720,airBrake:180,jump:515,rise:1360,apex:460,fall:1950,dive:3800};
const toward=(value,target,step)=>value+Math.sign(target-value)*Math.min(Math.abs(target-value),step);
function landing(impact){p.land=Math.min(.19,.08+impact/6000);if(impact>200){for(let i=0;i<5;i++)particles.push({x:p.x-cam+(i-2)*4,y:p.y-2,vx:(i-2)*18,vy:-10-i%2*12,t:.18+i%2*.07,color:scene?'#b6ab8266':'#a0b38a77'});tone(105,.045,'triangle',.025);}}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),rect=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))},circle=(x,y,r,c)=>{g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,7);g.fill()}, dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const platforms=[{x:430,y:400,w:150},{x:670,y:335,w:240},{x:1010,y:390,w:140},{x:1340,y:350,w:160},{x:1760,y:390,w:200},{x:2160,y:340,w:180},{x:2560,y:390,w:180}];
const et=()=>document.documentElement.lang==='et';
function labels(){soundButton.textContent=sound?'♪':'♫';soundButton.setAttribute('aria-pressed',String(sound));soundButton.setAttribute('aria-label',et()?(sound?'Heli välja':'Heli sisse'):(sound?'Mute sound':'Enable sound'));pauseButton.setAttribute('aria-label',et()?'Paus / jätka':'Pause / resume');exit.setAttribute('aria-label',et()?'Sulge mäng (Esc)':'Close game (Esc)');exit.title=et()?'Tagasi lehele · Esc':'Back to the site · Esc';restart.textContent=et()?'Alusta uuesti':'Restart';canvas.setAttribute('aria-label',et()?'Mäng. Tühik: hüpe. WASD: liikumine. Hiir: suund, hoia nuppu valguse jaoks. Alla/S: kiire langemine. Esc: sulge suur mäng / peata väike mäng.':'Game. Space: jump. WASD or arrows: move. Aim with mouse; hold click for light. Down/S: fast-fall. Escape: exit expanded game / pause runner.');}
function tone(freq,duration=.1,type='triangle',volume=.035){if(!sound||!audio)return;const o=audio.createOscillator(),v=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);v.gain.setValueAtTime(volume,audio.currentTime);v.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+duration);o.connect(v).connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}
function spark(x,y,color,n=15){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*180,vy:(Math.random()-.5)*180,t:.4+Math.random()*.5,color});}
function expand(){if(!shell.classList.contains('egg-expanded'))returnY=window.scrollY;shell.classList.add('egg-expanded');document.documentElement.classList.add('egg-open');shell.setAttribute('role','dialog');shell.setAttribute('aria-modal','true');exit.hidden=false;resizeGame();canvas.focus({preventScroll:true});}
function close(){pause();shell.classList.remove('egg-expanded');document.documentElement.classList.remove('egg-open');shell.removeAttribute('role');shell.removeAttribute('aria-modal');exit.hidden=true;clearInput();touchY=null;resizeGame();window.scrollTo({top:returnY,behavior:'instant'});canvas.focus({preventScroll:true});}
function resizeGame(){shell.classList[touchMode?'add':'remove']('egg-touch');const r=screen.getBoundingClientRect(),zoom=touchMode&&shell.classList.contains('egg-expanded'),ratio=r.width/Math.max(1,r.height);viewW=zoom?Math.round(Math.min(W,H*ratio)):W;viewH=zoom?Math.round(Math.min(H,W/ratio)):H;viewW=Math.max(1,viewW);viewH=Math.max(1,viewH);if(canvas.width!==viewW)canvas.width=viewW;if(canvas.height!==viewH)canvas.height=viewH;if(state!=='running')draw();}
function syncTouch(){touchKeys.clear();const actions=new Set([...touchPointers.values()].map(v=>v.action)),codes={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};for(const a of actions)if(codes[a])touchKeys.add(codes[a]);if(scene===3&&actions.has('action'))touchKeys.add('ArrowUp');for(const b of controlButtons)b.dataset.held=String(actions.has(b.dataset.eggControl));}
function clearInput(){keys.clear();touchPointers.clear();syncTouch();aimPointer=null;mouse.down=false;}
function controlLabels(){const mode=scene===2?'light':scene===3?'go':'jump',words=et()?{jump:'HÜPPA',light:'VALGUS',go:'EDASI'}:{jump:'JUMP',light:'LIGHT',go:'GO'};actionButton.querySelector('.egg-action-label').textContent=words[mode];actionButton.querySelector('span').textContent={jump:'↥',light:'☀',go:'↑'}[mode];actionButton.setAttribute('aria-label',et()?{jump:'Hüppa',light:'Hoia valguse jaoks',go:'Liigu edasi'}[mode]:{jump:'Jump',light:'Hold to shine the lantern',go:'Move forward'}[mode]);const directions=et()?{up:'Liigu üles',down:'Liigu alla',left:'Liigu vasakule',right:'Liigu paremale'}:{up:'Move up',down:'Move down',left:'Move left',right:'Move right'};for(const b of controlButtons)if(directions[b.dataset.eggControl])b.setAttribute('aria-label',directions[b.dataset.eggControl]);controls.setAttribute('aria-label',et()?'Puutetundlik juhtimine':'Touch controls');}
function scrollReturn(amount){if(!shell.classList.contains('egg-expanded')||!['won','dead'].includes(state))return false;close();window.scrollBy({top:-Math.max(120,amount),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return true;}
function reset(){clearInput();scene=0;life=3;time=local=cam=inv=transition=0;lamp=false;particles=[];enemies=[];killed=spawned=0;p=player();secret.hidden=true;state='ready';restart.hidden=true;canvas.dataset.scene='0';canvas.dataset.state=state;labels();controlLabels();draw();}
function start(){if(state==='dead'||state==='won')reset();if((scene>0||touchMode)&&!shell.classList.contains('egg-expanded'))expand();cancelAnimationFrame(raf);state='running';last=performance.now();canvas.dataset.state=state;loop(last);}
function pause(){clearInput();if(state==='running'){state='paused';canvas.dataset.state=state;cancelAnimationFrame(raf);draw();}}
function launchJump(){if(scene<2&&(p.ground||p.coyote>0)&&!transition){p.vy=-FEEL.jump;p.ground=false;p.coyote=0;p.buffer=0;p.land=0;tone(scene?392:260,.1,'triangle',.018);return true;}return false;}
function jump(){if(state!=='running')start();if(scene<2){p.buffer=.12;launchJump();}}
function change(n){if(transition)return;nextScene=n;transition=1.1;spark(p.x-cam,p.y-20,'#ffc876',30);tone(110,.5,'sawtooth',.018);if(n===1)expand();}
function enter(n){clearInput();scene=n;local=cam=0;canvas.dataset.scene=String(n);p=player(n===2?480:120,n===2?390:455);if(n===2){enemies=[];killed=spawned=0;spawnAt=0;}if(n===3){p.x=0;p.y=0;}controlLabels();}
function hurt(){if(inv||transition||state!=='running')return;life--;inv=2;shake=.3;tone(80,.22,'sawtooth');spark(scene===2?p.x:p.x-cam,p.y-20,'#ed7e78');if(life<=0){state='dead';restart.hidden=false;canvas.dataset.state=state;}}
function spawn(){const a=spawned*2.399,edge=spawned%4;enemies.push({x:edge<2?(edge?890:70):480+Math.cos(a)*300,y:edge>=2?(edge===2?75:460):150+Math.sin(a)*90,hp:1.65,seed:spawned,hit:false});spawned++;}
function update(dt){time+=dt;local+=dt;inv=Math.max(0,inv-dt);shake=Math.max(0,shake-dt);p.land=Math.max(0,p.land-dt);p.buffer=Math.max(0,p.buffer-dt);p.coyote=Math.max(0,p.coyote-dt);
 if(sound&&time>noteAt){noteAt=time+(scene===2?.3:.45);const melody=[0,7,12,10,7,3,5,7];tone((scene===0?110:scene===1?164.81:130.81)*2**(melody[Math.floor(time*2)%8]/12),.2,scene===0?'square':'triangle',.014);}
 if(transition){transition=Math.max(0,transition-dt);if(transition<=.55&&scene!==nextScene)enter(nextScene);return;}
 if(scene<2){const prevY=p.y,wasGround=p.ground,dx=scene===0?1:Number(held('ArrowRight')||held('KeyD'))-Number(held('ArrowLeft')||held('KeyA')),target=dx*FEEL.speed,reversing=dx&&p.vx*dx<0;
  const accel=p.ground?(reversing?FEEL.turn:dx?FEEL.accel:FEEL.brake):(dx?FEEL.air:FEEL.airBrake);p.vx=toward(p.vx,target,accel*dt);p.x=clamp(p.x+p.vx*dt,30,3240);if(Math.abs(p.vx)>12)p.face=Math.sign(p.vx);p.lean=toward(p.lean,dx*(reversing?.12:.1)*Math.min(1,Math.abs(p.vx)/FEEL.speed),dt*.9);if(wasGround)p.step+=Math.abs(p.vx)*dt*.075;
  if(p.buffer>0)launchJump();const dive=held('ArrowDown')||held('KeyS');if(dive&&!p.ground)p.vy=Math.max(180,p.vy);const gravity=dive?FEEL.dive:Math.abs(p.vy)<85?FEEL.apex:p.vy<0?FEEL.rise:FEEL.fall;p.vy=Math.min(960,p.vy+gravity*dt);const impact=p.vy;p.y+=p.vy*dt;p.ground=false;
  if(p.y>=455){p.y=455;p.vy=0;p.ground=true;}
  if(scene===1&&p.vy>=0)for(const b of platforms)if(p.x+15>b.x&&p.x-15<b.x+b.w&&prevY<=b.y+2&&p.y>=b.y){p.y=b.y;p.vy=0;p.ground=true;break;}
  if(p.ground){p.coyote=.1;if(!wasGround&&impact>120)landing(impact);if(p.buffer>0)launchJump();}
  cam=Math.max(0,p.x-Math.min(180,viewW*.38));
  if(scene===0){for(const x of [650,1130])if(Math.abs(p.x-x)<29&&p.y>424)hurt();if(p.x>1700)change(1);}
  else {if(!lamp&&Math.hypot(p.x-815,p.y-305)<60){lamp=true;spark(p.x-cam,p.y-25,'#ffd37c',35);tone(784,.4);}
   for(const x of [1550,2040,2440,2840])if(Math.abs(p.x-x)<30&&p.y>427)hurt();
   if(p.x>3070&&lamp)change(2);}
 }else if(scene===2){let dx=Number(held('KeyD')||held('ArrowRight'))-Number(held('KeyA')||held('ArrowLeft')),dy=Number(held('KeyS')||held('ArrowDown'))-Number(held('KeyW')||held('ArrowUp')),norm=Math.hypot(dx,dy)||1;const tx=dx/norm*190,ty=dy/norm*190,delta=Math.hypot(tx-p.vx,ty-p.vy),rate=(dx||dy?1200:1550)*dt/(delta||1),blend=Math.min(1,rate);p.vx+=(tx-p.vx)*blend;p.vy+=(ty-p.vy)*blend;p.x=clamp(p.x+p.vx*dt,68,892);p.y=clamp(p.y+p.vy*dt,95,465);if(Math.abs(p.vx)>10)p.face=Math.sign(p.vx);p.step+=Math.hypot(p.vx,p.vy)*dt*.075;p.lean=toward(p.lean,p.vx/190*.075,dt*.9);
  if(local>=spawnAt&&spawned<10){spawn();spawnAt=local+3;}
  const lightHeld=[...touchPointers.values()].some(v=>v.action==='action');
  if(dx||dy)touchAim={x:dx/norm,y:dy/norm};
  if(lightHeld&&aimPointer===null){let nearest=null,best=310;for(const e of enemies){const d=dist(p,e);if(e.hp>0&&d<best){best=d;nearest=e;}}mouse.x=nearest?nearest.x:p.x+touchAim.x*200;mouse.y=nearest?nearest.y:p.y+touchAim.y*200;}
  const beam=mouse.down||lightHeld,aim=Math.atan2(mouse.y-p.y,mouse.x-p.x);
  for(const e of enemies){if(e.hp<=0)continue;const d=dist(p,e),delta=Math.atan2(Math.sin(Math.atan2(e.y-p.y,e.x-p.x)-aim),Math.cos(Math.atan2(e.y-p.y,e.x-p.x)-aim));e.hit=beam&&Math.abs(delta)<.38&&d<310;e.hp-=e.hit?dt:0;const speed=e.hit?9:32+e.seed%3*6;e.x+=(p.x-e.x)/(d||1)*speed*dt;e.y+=(p.y-e.y)/(d||1)*speed*dt;if(d<24+18*e.hp/1.65)hurt();if(e.hp<=0){killed++;spark(e.x,e.y,'#ffd37c',22);tone(440+e.seed*33,.16);}}
  if(killed===10&&p.y<125&&Math.abs(p.x-480)<65)change(3);
 }else {const dx=Number(held('KeyD')||held('ArrowRight'))-Number(held('KeyA')||held('ArrowLeft')),dy=Number(held('KeyW')||held('ArrowUp'))-Number(held('KeyS')||held('ArrowDown'));p.vx=toward(p.vx,dx*.55,dt*2.5);p.vy=toward(p.vy,dy*.45,dt*2.2);p.x=clamp(p.x+p.vx*dt,-1.2,1.2);p.y=clamp(p.y+p.vy*dt,0,1);p.step+=Math.hypot(p.vx,p.vy)*dt*12;p.lean=toward(p.lean,p.vx*.12,dt*.9);if(p.y>.88){state='won';restart.hidden=false;secret.hidden=false;canvas.dataset.state=state;spark(480,260,'#ffd37c',24);tone(659,.5);}}

 particles=particles.filter(v=>{v.t-=dt;v.x+=v.vx*dt;v.y+=v.vy*dt;v.vy+=120*dt;return v.t>0;});
}
function text(t,x,y,size=16,c='#e7dec3',align='left'){g.fillStyle=c;g.font=`${size}px monospace`;g.textAlign=align;g.fillText(t,x,y);}
// Small, deliberately placed pixel clusters; one palette across all four eras.
const ink={night:'#142128',deep:'#101a20',pine:'#233b38',moss:'#65765a',sage:'#91a27c',stone:'#738079',paper:'#e6d9b3',gold:'#d9a55b',rust:'#ad7055'};
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
function stamp(rows,palette,x,y,size=1){for(let yy=0;yy<rows.length;yy++)for(let xx=0;xx<rows[yy].length;xx++){const c=palette[rows[yy][xx]];if(c)rect(x+xx*size,y+yy*size,size,size,c);}}
function person(x,y,scale=1,mono=false){
 const moving=state==='running'&&(scene===3?Math.hypot(p.vx,p.vy)>.01:Math.hypot(p.vx,scene===2?p.vy:0)>8),air=scene<2&&!p.ground,phase=p.step,foot=moving?Math.round(Math.sin(phase)*5):0,bend=Math.round(p.land/.19*4),bob=air?0:moving?Math.round(Math.abs(Math.cos(phase))*2):Math.floor(time*1.6)%2;
 const c=mono?{dark:'#14221c',edge:'#60755b',cloth:'#a4b595',light:'#e3e8c8',skin:'#c5d0ac',hair:'#7d9470',shade:'#485e49',purple:'#82936f'}:{dark:'#111c25',edge:'#34434a',cloth:'#202c36',light:'#e3d8be',skin:'#cf9c78',hair:'#593c36',shade:'#332c2d',purple:'#716077'};
 // The feet anchor the pose. Only knees and shoulders absorb the landing.
 g.save();g.translate(Math.round(x),Math.round(y));rect(-15,2,30,3,mono?'#090f0c88':'#09181277');g.scale(scale*p.face,scale);
 const stride=air?Math.round(clamp(p.vy/140,-3,3)):foot;
 function boot(xx,yy,back){rect(xx,yy,10,6,c.dark);rect(xx-1,yy+4,13,3,c.shade);rect(xx-1,yy+7,13,2,c.edge);rect(xx+1,yy+6,9,1,mono?c.light:'#a49366');if(!back)rect(xx+3,yy+2,4,1,c.edge);}
 rect(-10-stride,-20+bend,8,17-Math.abs(stride),c.dark);rect(3+stride,-20+bend,8,17-Math.abs(stride),c.cloth);
 for(let k=0;k<2;k++){rect(-8-stride+k*2,-18+bend,1,12-Math.abs(stride),c.light);rect(5+stride+k*2,-18+bend,1,12-Math.abs(stride),c.light);}
 boot(-11-stride,-8-Math.max(0,stride),true);boot(2+stride,-8-Math.max(0,-stride),false);
 const lean=Math.round(p.lean*p.face*26),bodyY=-43+bend+bob;
 rect(-12+lean,bodyY,23,24,c.dark);rect(-13+lean,bodyY+4,3,15,c.edge);rect(-9+lean,bodyY+1,17,3,c.purple);rect(-9+lean,bodyY+6,18,17,c.cloth);rect(-7+lean,bodyY+18,13,3,c.dark);rect(9+lean,bodyY+6,2,13,c.edge);
 for(let k=0;k<3;k++)rect(-4+lean+k*3,bodyY+3,1,17,c.light);rect(-6+lean,bodyY+1,1,9,c.shade);
 const arm=air?-3:Math.round(foot*.5);rect(-16+lean,bodyY+5+arm,6,18,c.cloth);rect(-15+lean,bodyY+20+arm,5,5,c.skin);rect(10+lean,bodyY+6-arm,6,17,c.dark);rect(11+lean,bodyY+20-arm,5,5,c.skin);rect(-15+lean,bodyY+17+arm,5,3,c.dark);rect(-14+lean,bodyY+18+arm,2,1,c.light);
 // Layered hair, a side fringe, glasses, and the purple hood match Andres's portrait.
 const hx=-13+lean,hy=bodyY-24-(air?1:0),sway=Math.round(clamp(-p.vx/150,-2,2));
 stamp(['....hhhhhhhh......','..hhhhHHHHhhhh....','.hhhHHHHhHHHhhhh..','hhhHHHhhhHHHHhhh..','hhHHhsssssHHHhhhh.','hHHhssssssssHHhhh.','hHHssSSSSSSssHHhh.','hHssSssssssSsHHhh.','hHssDDDDsDDDDsHhh.','hHssDaaD-DaaDsHhh.','hhssDDDDsDDDDsHh..','hhhssssssSsssHhh..','hhhhsssssSssHHhh..','hhhhssSSSSssHhhh..','hhhhhsssssHHhhhh..','.hhhhhhHHHhhhhhh..','..hhhhHHHhhhhhhh..','..hhhhh..hhhhhh...','...hhhh..hhhhh....','...hhh...hhhh.....'],{h:c.shade,H:c.hair,s:c.skin,S:mono?c.shade:'#ab785d',D:c.dark,a:mono?c.light:'#9da7a0','-':c.dark},hx,hy);
 rect(hx+sway,hy+13,3,10,c.shade);rect(hx+2+sway,hy+20,3,4,c.hair);rect(hx+16,hy+14,1,3,c.light);
 if(lamp){const lx=18+lean,ly=bodyY+17-arm;rect(lx-4,ly-5,7,2,ink.gold);rect(lx-5,ly-3,2,12,ink.rust);rect(lx+3,ly-3,2,12,ink.rust);rect(lx-4,ly+9,9,2,ink.rust);rect(lx-2,ly-2,4,10,ink.gold);rect(lx-1,ly,2,6,ink.paper);rect(lx-2,ly-8,4,1,ink.gold);}
 g.restore();
}
function door(x,y,open=false,mono=false){
 const stone=mono?'#7d9270':'#596862',edge=mono?'#b4c49f':'#8b9981',dark=mono?'#233b2b':'#16272a';
 rect(x-29,y-82,58,82,stone);rect(x-22,y-75,44,75,dark);rect(x-26,y-87,52,6,edge);
 for(let i=0;i<5;i++){rect(x-29,y-78+i*16,7,1,edge);rect(x+22,y-71+i*16,7,2,dark);}rect(x-29,y-81,2,81,edge);
 if(open){rect(x-17,y-71,34,71,mono?'#ced8b6':'#c8b77b');rect(x-8,y-68,15,68,mono?'#e4e8cd':'#efdfab');rect(x-17,y-8,34,8,mono?'#a3b48d':'#a69f73');}else{for(let i=0;i<4;i++)rect(x-20+i*10,y-73,1,72,stone);rect(x+11,y-39,3,3,ink.gold);}
 if(!mono){rect(x-31,y-5,20,5,ink.moss);rect(x+12,y-81,15,3,ink.moss);rect(x-28,y-74,3,13,ink.pine);}
}
function pine(x,y,s=1,c=ink.pine){
 // Uneven boughs and gaps break up the old repeated fence silhouette.
 const seed=Math.floor(y*1.9+s*67),trunk='#293a35';x=Math.round(x);y=Math.round(y);
 rect(x-3*s,y-126*s,6*s,139*s,trunk);rect(x-1*s,y-90*s,2*s,98*s,'#37473b');
 for(let tier=0;tier<7;tier++){const yy=y-(145-tier*19)*s,span=(10+tier*7)*s,offset=(hash(seed+tier)-.5)*12*s;
  rect(x-span*.35+offset,yy,span*.8,7*s,c);rect(x-span*.7+offset,yy+7*s,span*1.4,6*s,c);rect(x-span+offset,yy+13*s,span*1.8,5*s,c);
  rect(x-span*.65+offset,yy+10*s,span*.55,2*s,'#80977814');rect(x+offset+span*.55,yy+16*s,span*.24,6*s,c);
 }
}
function fern(x,y,s=1){for(let i=0;i<4;i++){rect(x-i*4*s,y-i*4*s,5*s,2*s,ink.moss);rect(x+i*4*s,y-i*4*s,5*s,2*s,ink.pine);}rect(x,y-13*s,2*s,15*s,ink.moss);}
function side(){const mono=scene===0;rect(0,0,W,H,mono?'#16231c':ink.night);
 if(mono){for(let i=0;i<28;i++)rect((i*173-cam*.15)%1100,65+i%5*37,2,2,'#687664');rect(0,455,W,2,'#a9b59a');for(let i=0;i<30;i++)rect((i*70-cam)%1000,465,28,2,'#465849');text('@',650-cam,454,44);text('!',1130-cam,454,44);door(1740-cam,455,true,true);person(p.x-cam,p.y,1.1,true);return;}
 // Muted dawn over a distinct lake, then three irregular forest planes.
 rect(0,238,W,150,'#293d42');for(let i=0;i<10;i++)rect(0,245+i*13,W,2,'#3a505044');
 for(let yy=0;yy<22;yy++)for(let xx=0;xx<22;xx++)if(Math.hypot(xx-11,yy-11)<10.5&&Math.hypot(xx-7,yy-7)>10)rect(715-cam*.04+xx*2,60+yy*2,2,2,'#d3c69b');
 for(let layer=0;layer<3;layer++)for(let i=0;i<12;i++){const n=i+layer*31,xx=((i*113+hash(n)*49-cam*(.08+layer*.14))%1420+1420)%1420-140;pine(xx,290+layer*67+hash(n+1)*25,.65+layer*.35,['#233539','#263f3d','#1c3330'][layer]);}
 for(let i=0;i<27;i++)rect((i*137-cam*.07+1100)%1100,34+i%8*20,1,1,'#b9c4ae77');
 rect(0,455,W,85,'#2b3c30');rect(0,457,W,7,'#192c27');rect(0,455,W,3,'#7b8864');
 for(let i=0;i<55;i++){const xx=((i*53-cam)%1080+1080)%1080-40,yy=465+hash(i)*70;rect(xx,yy,5+hash(i+3)*14,2,'#65745655');if(i%4===0){rect(xx,yy-3,9,3,'#3e5140');rect(xx+2,yy-4,5,1,'#84917466');}}
 for(const b of platforms){const x=b.x-cam;rect(x,b.y,b.w,16,'#384a3e');rect(x,b.y,b.w,3,'#a1aa7b');rect(x+4,b.y+3,b.w-9,3,'#78825c');rect(x+8,b.y+16,b.w-16,7,'#20362d');for(let j=12;j<b.w-8;j+=31){rect(x+j,b.y+8,1,7,'#1c3028');rect(x+j+3,b.y+6,18,1,'#b2b28a22');if(j%2)rect(x+j+4,b.y+18,3,14+j%11,'#5e7953');}fern(x+17,b.y,.5);}
 for(const x of [1550,2040,2440,2840]){rect(x-cam-23,447,48,8,'#2a3331');for(let i=0;i<4;i++){const xx=x-cam-24+i*13;rect(xx+3,434,4,21,'#7e8476');rect(xx+1,441,8,14,'#59695c');rect(xx+4,434,1,13,'#c2bca0');}}
 for(const q of [{x:170,y:455},{x:945,y:455},{x:1890,y:455},{x:2690,y:455}]){fern(q.x-cam,q.y,1.1);rect(q.x-cam+14,q.y-6,14,6,'#5b6955');rect(q.x-cam+17,q.y-8,8,2,'#9ca480');}
 if(!lamp){const lx=815-cam;rect(lx-8,285,16,3,ink.gold);rect(lx-6,290,12,20,ink.rust);rect(lx-3,292,6,14,ink.gold);rect(lx-1,295,2,9,ink.paper);rect(lx-8,311,16,3,ink.gold);rect(lx-4,279,8,2,ink.gold);}
 door(3120-cam,455,lamp);if(!inv||Math.floor(time*12)%2)person(p.x-cam,p.y,1.25);
 for(let i=0;i<7;i++)rect(((i*167-cam*.35)%1100+1100)%1100,250+i%4*35+Math.sin(time*.7+i)*9,2,2,'#d4bd7b88');
}
const mothPattern=['..a........a..','.ab........ba.','abbc......cbba','abbcc....ccbba','.bcccd..dcccb.','..bccdeedccb..','...ccdeedcc...','..bccdeedccb..','.bcccd..dcccb.','.bc........cb.','..b........b..'];
function moth(e){const size=(.35+e.hp/1.65*.8),flutter=Math.floor(time*7+e.seed)%3,px=e.x-14*size,py=e.y-11*size;g.save();g.translate(Math.round(px),Math.round(py));g.scale(size,size);stamp(mothPattern,{a:'#807c6b',b:e.hit?'#d0b57c':'#6d7770',c:e.hit?'#e0ca94':'#394f4b',d:'#bd9868',e:ink.deep},0,flutter===1?1:0,2);rect(12,-2,1,5,ink.gold);rect(15,-2,1,5,ink.gold);rect(12,8,2,2,ink.paper);rect(15,8,2,2,ink.paper);g.restore();}
function topdown(){rect(0,0,W,H,ink.deep);
 // Worn slabs, moss seams, a path through the court, and small shrine details.
 for(let y=64;y<500;y+=32)for(let x=48;x<916;x+=32){const n=x*3+y*7,v=hash(n),path=Math.abs(x-480)<65;rect(x,y,31,31,path?'#586052':v<.35?'#2a4037':'#31463c');rect(x+2,y+2,26,1,path?'#8c907044':'#72836a22');if(v<.22){rect(x+9,y+19,12,2,ink.pine);rect(x+13,y+15,2,6,'#667b4d');}if(v>.78)rect(x+20,y+6,1,12,'#182e29');}
 for(let i=0;i<12;i++){pine(i*92-10,75,.8,ink.pine);pine(i*88,550,.8,'#172e29');}
 for(let y=100;y<500;y+=74){rect(27,y,21,46,'#4d6051');rect(28,y,18,2,'#899375');rect(913,y,21,46,'#4d6051');fern(42,y+48,.7);fern(909,y+48,.7);}
 door(480,110,killed===10);for(const xx of [370,590]){rect(xx-12,108,24,17,'#68725c');rect(xx-9,85,18,23,'#4a5f51');rect(xx-14,83,28,4,'#9aa180');rect(xx-4,91,8,10,ink.gold);rect(xx-1,92,2,7,ink.paper);}
 if(mouse.down||[...touchPointers.values()].some(v=>v.action==='action')){const a=Math.atan2(mouse.y-p.y,mouse.x-p.x),gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,310);gr.addColorStop(0,'#ead4a54d');gr.addColorStop(1,'#ead4a500');g.fillStyle=gr;g.beginPath();g.moveTo(p.x,p.y);g.arc(p.x,p.y,310,a-.38,a+.38);g.closePath();g.fill();}
 for(const e of enemies)if(e.hp>0)moth(e);
 if(!inv||Math.floor(time*12)%2)person(p.x,p.y,1.1);g.strokeStyle='#d8c89888';g.strokeRect(mouse.x-4,mouse.y-4,8,8);
 for(let i=0;i<10-killed;i++)rect(443+i*8,36,5,60,'#716b59');
}
function sanctuary(){
 rect(0,0,W,H,'#243d45');rect(0,152,W,95,'#6e796e');rect(700,126,68,60,'#d4b584');
 const ridges=[{y:250,c:'#536c6a',pts:[0,37,76,30,68,10,73,40,0]},{y:302,c:'#344f50',pts:[20,68,17,52,9,77,21,45,0]}];for(const r of ridges){g.fillStyle=r.c;g.beginPath();g.moveTo(0,H);for(let i=0;i<r.pts.length;i++)g.lineTo(i*120,r.y-r.pts[i]);g.lineTo(W,H);g.fill();}
 for(let z=16;z>=0;z--){const depth=1/(1+z*.22),next=1/(1+(z+1)*.22),yy=260+240*depth;g.fillStyle=z%2?'#69765b':'#728160';g.beginPath();g.moveTo(480-330*depth,yy);g.lineTo(480+330*depth,yy);g.lineTo(480+330*next,260+240*next);g.lineTo(480-330*next,260+240*next);g.fill();rect(480-280*depth,yy,560*depth,1,'#b6ad7a33');}
 door(480,300,true);door(961,380,true);for(let i=0;i<6;i++)pine(100+i%2*760,330+i*35,.6+i*.1,ink.pine);
 const d=1/(1+p.y*2.7);person(480+p.x*200*d,270+235*d,2*d);
}
function draw(){g.imageSmoothingEnabled=false;const d=1/(1+p.y*2.7);viewX=scene===2?clamp(p.x-viewW/2,0,W-viewW):scene===3?clamp(480+p.x*200*d-viewW/2,0,W-viewW):0;viewY=scene<2?clamp(p.y-viewH*.78,0,H-viewH):scene===2?clamp(p.y-viewH/2,0,H-viewH):clamp(270+235*d-viewH/2,0,H-viewH);g.save();g.translate(-viewX,-viewY);if(shake)g.translate(Math.sin(time*90)*5,Math.cos(time*77)*4);if(scene<2)side();else if(scene===2)topdown();else sanctuary();for(const v of particles)rect(v.x,v.y,3,3,v.color);g.restore();
 shell.querySelector('.egg-toolbar small').textContent=['won','dead'].includes(state)?(et()?'Tagasi lehele: keri üles · Esc':'Scroll up to return to the site · Esc'):touchMode?(scene===2?(et()?'Hoia ☀ · puuduta vaenlast sihtimiseks':'Hold ☀ · touch a creature to aim'):(scene<2?(et()?'↓ kiire langemine · ↥ hüpe':'↓ fast-fall · ↥ jump'):(et()?'Ristnupp + tegevusnupp':'D-pad + action button'))):'SPACE / ↑ · ↓ FAST-FALL · WASD · MOUSE';
 // Restrained CRT texture, no flashing. HUD stays graphical.
 for(let y=0;y<viewH;y+=4)rect(0,y,viewW,1,'#0000000c');if(state!=='ready'){for(let i=0;i<3;i++){stamp(['.aa.aa.','aaaaaaa','aaaaaaa','.aaaaa.','..aaa..','...a...'],{a:i<life?(scene?'#c79b81':'#d4debc'):'#3a5045'},24+i*28,22,3);if(i<life)rect(30+i*28,25,3,3,scene?'#ead4ab':'#edf0d3');}if(lamp){rect(viewW-38,23,12,18,ink.gold);rect(viewW-35,26,6,11,ink.paper);}}
 if(transition){const t=1-Math.abs(transition-.55)/.55;rect(0,0,viewW,viewH,`rgba(8,16,18,${clamp(t,0,1)})`);for(let i=0;i<7;i++)rect((i*193+transition*400)%viewW,i*83,viewW*.22,2,'#d6c69755');}
 if(state==='ready'||state==='paused'||state==='dead'){rect(0,0,viewW,viewH,'#07110f66');const label=state==='dead'?'GAME OVER':state==='paused'?'Ⅱ':'▶';text(label,viewW/2,viewH/2,scene===0?32:42,'#e6dfc5','center');}
 canvas.dataset.lives=String(life);canvas.dataset.kills=String(killed);canvas.dataset.lamp=String(lamp);
}
function loop(now){if(state!=='running')return;const dt=Math.min(.033,(now-last)/1000);last=now;update(dt);draw();if(state==='running')raf=requestAnimationFrame(loop);}
canvas.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Escape'].includes(e.code)){e.preventDefault();if(e.code==='Escape'){state==='running'?pause():start();return}keys.add(e.code);if((e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW')&&!e.repeat&&scene<2)jump();else if(state==='ready'||state==='paused')start();}});
canvas.addEventListener('keyup',e=>keys.delete(e.code));
function pointer(e){const r=canvas.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*viewW+viewX;mouse.y=(e.clientY-r.top)/r.height*viewH+viewY;}
canvas.addEventListener('pointermove',e=>{if(e.pointerType!=='touch'||aimPointer===e.pointerId)pointer(e);});canvas.addEventListener('pointerdown',e=>{if(e.button!==0||['won','dead'].includes(state))return;e.preventDefault();if(e.pointerType==='touch'){touchMode=true;resizeGame();}if(state!=='running')start();pointer(e);canvas.focus({preventScroll:true});aimPointer=e.pointerId;canvas.setPointerCapture(e.pointerId);mouse.down=true;if(scene<2)jump();});
function releasePointer(e){if(aimPointer===e.pointerId){aimPointer=null;mouse.down=false;}if(touchPointers.delete(e.pointerId))syncTouch();}
addEventListener('pointerup',releasePointer);addEventListener('pointercancel',releasePointer);canvas.addEventListener('lostpointercapture',releasePointer);
function controlDown(b,e){e.preventDefault();if(['dead','won'].includes(state))return;touchMode=true;resizeGame();if(state!=='running')start();canvas.focus({preventScroll:true});touchPointers.set(e.pointerId,{action:b.dataset.eggControl});if(typeof e.pointerId==='number')b.setPointerCapture(e.pointerId);syncTouch();if(scene<2&&['up','action'].includes(b.dataset.eggControl))jump();}
for(const b of controlButtons){b.addEventListener('pointerdown',e=>{if(e.button===0)controlDown(b,e);});b.addEventListener('pointermove',e=>{const active=touchPointers.get(e.pointerId);if(!active||active.action==='action')return;const under=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-egg-control]');active.action=under&&controls.contains(under)&&under.dataset.eggControl!=='action'?under.dataset.eggControl:null;syncTouch();});b.addEventListener('pointerup',releasePointer);b.addEventListener('pointercancel',releasePointer);b.addEventListener('lostpointercapture',releasePointer);b.addEventListener('contextmenu',e=>e.preventDefault());b.addEventListener('keydown',e=>{if(['Space','Enter'].includes(e.code)&&!e.repeat)controlDown(b,{preventDefault:()=>e.preventDefault(),pointerId:'key-'+b.dataset.eggControl});});b.addEventListener('keyup',e=>{if(['Space','Enter'].includes(e.code))releasePointer({pointerId:'key-'+b.dataset.eggControl});});}
canvas.addEventListener('blur',pause);addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
pauseButton.addEventListener('click',()=>{state==='running'?pause():start();canvas.focus({preventScroll:true});});restart.addEventListener('click',()=>{cancelAnimationFrame(raf);reset();canvas.focus();start();});exit.addEventListener('click',close);
soundButton.addEventListener('click',()=>{sound=!sound;if(sound){const A=window.AudioContext||window.webkitAudioContext;if(A){audio??=new A();audio.resume().catch(()=>{});}}labels();canvas.focus({preventScroll:true});});
// A real external link is revealed only after the last doorway. Never auto-open a video.
secret.addEventListener('click',()=>{pause();});
shell.addEventListener('keydown',e=>{if(e.key==='Tab'&&shell.classList.contains('egg-expanded')){const list=[exit,canvas,...(!secret.hidden?[secret]:[]),...(touchMode?controlButtons:[]),soundButton,pauseButton,...(!restart.hidden?[restart]:[])];if(e.shiftKey&&document.activeElement===list[0]){e.preventDefault();list.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===list.at(-1)){e.preventDefault();list[0].focus();}}});
// Capture Escape before the canvas pause shortcut; the close control stays available in every scene.
shell.addEventListener('keydown',e=>{if(e.code==='Escape'&&shell.classList.contains('egg-expanded')){e.preventDefault();e.stopPropagation();close();}},true);
shell.addEventListener('wheel',e=>{if(e.deltaY<0&&Math.abs(e.deltaY)>Math.abs(e.deltaX)&&scrollReturn(-e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?window.innerHeight:1)))e.preventDefault();},{passive:false});
shell.addEventListener('touchstart',e=>{touchY=e.touches.length===1?e.touches[0].clientY:null;},{passive:true});
shell.addEventListener('touchmove',e=>{if(touchY!==null&&e.touches.length===1&&e.touches[0].clientY-touchY>35&&scrollReturn(e.touches[0].clientY-touchY))e.preventDefault();},{passive:false});
shell.addEventListener('touchend',()=>touchY=null,{passive:true});shell.addEventListener('touchcancel',()=>touchY=null,{passive:true});
shell.querySelectorAll('.egg-toolbar button, #egg-exit').forEach(b=>b.addEventListener('pointerdown',e=>e.preventDefault()));
touchMedia.addEventListener('change',e=>{clearInput();touchMode=e.matches;resizeGame();});new ResizeObserver(resizeGame).observe(screen);
new MutationObserver(()=>{labels();controlLabels();if(state!=='running')draw();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible)pause();}).observe(shell);reset();resizeGame();
})();
