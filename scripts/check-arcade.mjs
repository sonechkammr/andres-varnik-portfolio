import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const nodes=new Map();
const ctx=new Proxy({createRadialGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function node(){return {dataset:{},hidden:true,textContent:'',classList:{add(){},remove(){},contains(){return true;}},setAttribute(){},removeAttribute(){},addEventListener(){},focus(){},getContext:()=>ctx,querySelectorAll:()=>[],getBoundingClientRect:()=>({left:0,top:0,width:960,height:540})};}
const document={documentElement:{...node(),lang:'en'},querySelector:s=>{if(!nodes.has(s))nodes.set(s,node());return nodes.get(s);},addEventListener(){}};
let source=await readFile(new URL('../src/scripts/easter-egg.js',import.meta.url),'utf8');
// Test-only access to the actual engine, never emitted in the shipped HTML.
source=source.replace(/\}\)\(\);\s*$/,`globalThis.test={update,enter,reset,hurt,draw,jump,keys,mouse,player:()=>p,enemies:()=>enemies,snapshot:()=>({scene,life,lamp,state,killed,spawned,transition}),run:()=>state='running',clearInv:()=>inv=0};})();`);
const context={document,performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame(){},addEventListener(){},MutationObserver:class{observe(){}},IntersectionObserver:class{observe(){}}};
runInNewContext(source,context);const t=context.test;
t.run();for(let i=0;i<600;i++)t.update(1/60);
assert.equal(t.snapshot().scene,1,'The third runner object must lead into the platformer.');
assert.equal(t.snapshot().life,1,'Two unavoided obstacles remove two hearts, not the entire run.');
t.keys.add('ArrowRight');for(let i=0;i<300;i++){const p=t.player();if(p.ground&&((p.y===455&&p.x>365&&p.x<440)||(p.y===400&&p.x>545&&p.x<580)))t.jump();t.update(1/60);if(t.snapshot().lamp)break;}t.keys.clear();assert(t.snapshot().lamp,'The platform lamp must be collectible.');
t.player().x=3100;t.update(1/60);for(let i=0;i<80;i++)t.update(1/60);assert.equal(t.snapshot().scene,2);
t.player().x=480;t.player().y=390;t.mouse.x=480;t.mouse.y=200;t.mouse.down=true;t.enemies().splice(0);t.enemies().push({x:480,y:240,hp:1.65,seed:0});
for(let i=0;i<110;i++)t.update(1/60);assert(t.snapshot().killed>=1,'Holding the beam must shrink and destroy a monster.');
t.draw();t.enter(3);t.draw();t.keys.add('KeyW');for(let i=0;i<150;i++)t.update(1/60);assert.equal(t.snapshot().state,'won');assert.equal(nodes.get('#egg-secret').hidden,false,'The final secret door must become available.');
t.reset();t.run();for(let i=0;i<3;i++){t.clearInv();t.hurt();}assert.equal(t.snapshot().state,'dead');t.reset();assert.equal(t.snapshot().life,3);assert.equal(t.snapshot().scene,0);
console.log('Passed: runner door, three hearts, lamp pickup, arena transition, sustained light damage, finale, secret and restart.');
