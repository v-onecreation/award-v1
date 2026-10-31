/* ===== DATA (edit) ===== */
const cats=[["Creator of the Year","Overall impact"],["Best Newcomer","First two years"],["Best Storyteller","Narrative content"],["Best Gaming Channel","Games and esports"],["Best Educator","Learning content"],["Fans’ Choice","Open to all"]];
const works=["Season 1 gala","Red carpet","Creator summit","Backstage","Winners’ night","Fan meet-up"];
const photos=[]; // e.g. ["img/a.jpg","img/b.jpg",...] one per journey scene, replaces gradient placeholders

/* ===== BUILD DOM ===== */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const grid=$('#grid'),picks={};
cats.forEach((c,i)=>grid.insertAdjacentHTML('beforeend',`<div class="cat"><h3>${c[0]}</h3><small>${c[1]}</small>${"ABC".split('').map(n=>`<button class="opt" aria-pressed="false" data-c="${i}"><i></i>Nominee ${n}</button>`).join('')}</div>`));
grid.onclick=e=>{const b=e.target.closest('.opt');if(!b)return;const c=b.parentNode;$$('.opt',c).forEach(o=>o.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');c.classList.add('done');picks[b.dataset.c]=1;const n=Object.keys(picks).length;$('#msg').textContent=`${n} of ${cats.length} categories chosen`;$('#submit').disabled=n<cats.length};
$('#submit').onclick=()=>{$('#msg').textContent='Votes submitted. Thank you.';$('#submit').disabled=true};
const gs=["#7a4dff,#2b1a6b","#f0b94d,#8a3b2a","#2fb5a5,#143a5c","#e0527a,#4a1a5e","#5a7cff,#1a1f4f","#c06bff,#3b1566"];
const t=[...works,...works].map((w,i)=>`<div class="tile" style="--g:linear-gradient(160deg,${gs[i%6]})">${w}</div>`).join('');$('#track').innerHTML=t+t;
$('#form').onsubmit=e=>{e.preventDefault();$('#sent').textContent='Message sent. We’ll be in touch.'};
$$('.scene').forEach((s,i)=>{const [a,b]=s.dataset.bg.split(',');s.style.setProperty('--a',a);s.style.setProperty('--b',b);if(photos[i])$('.ph',s).style.backgroundImage=`url(${photos[i]})`});

/* ===== TEXT SPLIT ===== */
$$('.split').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(w=>`<span class="wd">${[...w].map(c=>`<span class="ch">${c}</span>`).join('')}</span>`).join(' ')});
const reveal=(el,trig)=>gsap.from($$('.ch',el),{yPercent:115,rotate:8,opacity:0,duration:1,ease:'power4.out',stagger:.025,scrollTrigger:trig?{trigger:el,start:'top 85%'}:null});

/* ===== LOGO ASSEMBLY INTRO (particles -> V1 mark) ===== */
function intro(done){
  const c=$('#intro'),x=c.getContext('2d'),dpr=Math.min(devicePixelRatio,2);
  const W=c.width=innerWidth*dpr,H=c.height=innerHeight*dpr,m=Math.min(W,H);
  const o=document.createElement('canvas');o.width=W;o.height=H;const ox=o.getContext('2d');
  ox.fillStyle='#fff';ox.textAlign='center';ox.textBaseline='middle';ox.font=`800 ${m*.36}px Bricolage Grotesque,Arial`;ox.fillText('V1',W/2,H/2);
  const d=ox.getImageData(0,0,W,H).data,step=Math.round(5*dpr),P=[];
  for(let y=0;y<H;y+=step)for(let xx=0;xx<W;xx+=step)if(d[(y*W+xx)*4+3]>128)P.push({tx:xx,ty:y,sx:Math.random()*W,sy:Math.random()*H,dl:Math.random()*1.2,r:(Math.random()*1.6+1)*dpr,h:Math.random()<.2});
  for(let i=0;i<260;i++){const a=i/260*Math.PI*2;P.push({tx:W/2+Math.cos(a)*m*.3,ty:H/2+Math.sin(a)*m*.3,sx:Math.random()*W,sy:Math.random()*H,dl:1+Math.random()*.8,r:2*dpr,h:true})}
  const T0=performance.now(),ease=p=>p>=1?1:1-Math.pow(2,-10*p);let fin=false;
  (function f(){const s=(performance.now()-T0)/1000;x.fillStyle='rgba(10,7,20,.35)';x.fillRect(0,0,W,H);
    P.forEach(p=>{const k=ease(Math.min(Math.max((s-p.dl)/1.8,0),1)),sw=(1-k)*Math.sin(s*3+p.tx)*30*dpr;x.fillStyle=p.h?'#e8b45a':'#f4efe6';x.beginPath();x.arc(p.sx+(p.tx-p.sx)*k+sw,p.sy+(p.ty-p.sy)*k+sw,p.r,0,7);x.fill()});
    if(s>3.4&&!fin){fin=true;gsap.to(c,{opacity:0,scale:1.25,duration:1.1,ease:'power3.in',onComplete:()=>{c.remove();done()}})}
    if(!fin||c.parentNode)requestAnimationFrame(f)})();
}

/* ===== MAIN ===== */
gsap.registerPlugin(ScrollTrigger);
const lenis=new Lenis();lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tm=>lenis.raf(tm*1000));gsap.ticker.lagSmoothing(0);lenis.stop();
const cur=$('#cursor');addEventListener('mousemove',e=>gsap.to(cur,{x:e.clientX,y:e.clientY,duration:.4}));

intro(()=>{lenis.start();
  const tl=gsap.timeline();
  tl.add(()=>0).from('.hero .orb',{scale:.4,opacity:0,duration:2,stagger:.2},0);
  $$('.hero .split').forEach((el,i)=>tl.from($$('.ch',el),{yPercent:120,rotate:10,opacity:0,duration:1.2,ease:'power4.out',stagger:.04},.1+i*.25));
  tl.from('.hero .fade',{opacity:0,y:16,duration:1},1.1);
  gsap.to('.hc',{yPercent:-15,opacity:0,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
});

// page colour shifts
$$('[data-bg]').forEach(s=>{if(s.classList.contains('scene'))return;ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%',onToggle:self=>{if(self.isActive)gsap.to('body',{backgroundColor:s.dataset.bg,duration:.9})}})});

// manifesto
const mp=$('#manifesto');mp.innerHTML=mp.textContent.split(' ').map(w=>`<span class="w">${w}</span>`).join('');
gsap.to('.manifesto .w',{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top 60%',end:'bottom 70%',scrub:true}});

// journey: photos arrive one by one, overlapping
const sc=$$('.scene'),yrs=$$('.yr'),n=sc.length;
gsap.set(sc.slice(1),{clipPath:'inset(100% 0 0 0)'});
const jt=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'.journey',start:'top top',end:'+='+n*110+'%',pin:true,scrub:.8,onUpdate:s=>{$('#bar').style.transform=`scaleX(${s.progress})`;$('#count').textContent=String(Math.min(n,Math.floor(s.progress*n+.02)+1)).padStart(2,'0')+' / 0'+n}}});
sc.forEach((s,i)=>{
  const chs=$$('.ch',s),fr=$('.frame',s),ph=$('.ph',s);
  if(i){const L='s'+i;jt.addLabel(L).to(s,{clipPath:'inset(0% 0 0 0)',duration:1,ease:'power3.inOut'},L)
    .from(ph,{scale:1.35,yPercent:20,duration:1},L).from(fr,{y:140,rotate:-6,duration:1,ease:'power3.out'},L)
    .from($('.yr',s),{xPercent:-30,opacity:0,duration:1},L)
    .from(chs,{yPercent:110,opacity:0,stagger:.03,duration:.5,ease:'power3.out'},L+'+=.5');
    jt.to(sc[i-1],{scale:.92,filter:'brightness(.5)',duration:1},L)}
  jt.to(ph,{yPercent:-8,duration:1.2},i?'>':0).to({},{duration:.5});
});
gsap.from(sc[0].children,{opacity:0,y:60,duration:1.2,stagger:.15,scrollTrigger:{trigger:'.journey',start:'top 70%'}});
$$('.ch',sc[0]).length&&gsap.from($$('.ch',sc[0]),{yPercent:110,stagger:.03,scrollTrigger:{trigger:'.journey',start:'top 60%'}});

// other titles
$$('.sec,.mq blockquote').forEach(el=>reveal(el,true));
gsap.from('.cat',{opacity:0,y:50,stagger:.08,duration:.9,scrollTrigger:{trigger:'#grid',start:'top 80%'}});
gsap.from('.tile',{xPercent:20,opacity:0,stagger:.1,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:'.work',start:'top 60%'}});
gsap.from('.mq .fade',{opacity:0,duration:1,scrollTrigger:{trigger:'.mq',start:'top 70%'}});

// sponsors
const main=$('.logo.main'),rail=$('#rail');
gsap.set(main,{scale:2.1,x:()=>Math.max(0,(rail.clientWidth-main.offsetWidth*2.1)/2)});
const sp=gsap.timeline({scrollTrigger:{trigger:'.spons',start:'top top',end:'+=220%',pin:true,scrub:.6,invalidateOnRefresh:true}});
sp.from('.lab',{opacity:0,y:20,duration:.3}).to(main,{scale:1,x:0,duration:1.2,ease:'power3.inOut'});
$$('.logo.o').forEach(o=>sp.to(o,{maxWidth:360,padding:'0 clamp(18px,3.4vw,52px)',borderWidth:1,opacity:1,duration:.8},'+=.15'));

/* ===== 3D TROPHY (three.js, procedural gold) ===== */
(function(){
  const cv=$('#gl'),r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.15;
  const scn=new THREE.Scene(),cam=new THREE.PerspectiveCamera(32,1,.1,100);cam.position.set(0,1.2,11);
  // studio environment for reflections
  const es=new THREE.Scene();[[0xffffff,0,8,4,6,2],[0xffd28a,-8,2,0,2,6],[0x8f6bff,8,3,-2,2,6],[0xffffff,0,-6,0,10,1]].forEach(([c,x,y,z,w,h])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,.3),new THREE.MeshBasicMaterial({color:c}));m.position.set(x,y,z);m.lookAt(0,0,0);es.add(m)});
  es.add(new THREE.Mesh(new THREE.SphereGeometry(30,16,16),new THREE.MeshBasicMaterial({color:0x180d3a,side:THREE.BackSide})));
  const pm=new THREE.PMREMGenerator(r);scn.environment=pm.fromScene(es).texture;
  const gold=new THREE.MeshStandardMaterial({color:0xf0b94d,metalness:1,roughness:.18,envMapIntensity:1.4}),dark=new THREE.MeshStandardMaterial({color:0x1b1038,metalness:.8,roughness:.3});
  const g=new THREE.Group();scn.add(g);
  const prof=[[0,0],[1.1,0],[1.25,.15],[1.2,.3],[.5,.45],[.3,.7],[.25,1.6],[.6,1.9],[1.1,2.5],[1.5,3.6],[1.6,4.4],[1.5,4.5],[1.35,4.45],[1.3,4.3],[1.2,3.7],[.8,2.9],[0,2.7]].map(p=>new THREE.Vector2(p[0],p[1]));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(prof,64),gold));
  [1,-1].forEach(s=>{const h=new THREE.Mesh(new THREE.TorusGeometry(.75,.09,16,48,Math.PI*1.2),gold);h.position.set(s*1.5,3.6,0);h.rotation.z=s>0?-Math.PI*.6:Math.PI*.6+Math.PI;g.add(h)});
  const pl=new THREE.Mesh(new THREE.BoxGeometry(2.8,.5,1.6),dark);pl.position.y=-.25;g.add(pl);
  const st=new THREE.Mesh(new THREE.OctahedronGeometry(.42),gold);st.position.y=5.3;g.add(st);
  g.position.y=-2.4;
  // sparkles
  const N=220,pos=new Float32Array(N*3);for(let i=0;i<N;i++){const a=Math.random()*7,rr=2.5+Math.random()*3;pos.set([Math.cos(a)*rr,Math.random()*7-2.5,Math.sin(a)*rr],i*3)}
  const gp=new THREE.BufferGeometry();gp.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const sp2=new THREE.Points(gp,new THREE.PointsMaterial({color:0xf0b94d,size:.06,transparent:true,opacity:.8}));scn.add(sp2);
  scn.add(new THREE.PointLight(0xffd9a0,40,30).translateX(5).translateY(4).translateZ(6));scn.add(new THREE.PointLight(0x7a4dff,50,30).translateX(-6).translateY(2).translateZ(-3));
  let mx=0,my=0,sy=0,vis=false;addEventListener('mousemove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
  function rs(){const w=cv.clientWidth,h=cv.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.position.x=w<760?0:3;cam.lookAt(w<760?0:3,.4,0);cam.updateProjectionMatrix()}rs();addEventListener('resize',rs);
  gsap.fromTo(g.scale,{x:.4,y:.4,z:.4},{x:1,y:1,z:1,ease:'none',scrollTrigger:{trigger:'.momento',start:'top 90%',end:'top 20%',scrub:true}});
  ScrollTrigger.create({trigger:'.momento',start:'top 70%',end:'top 0%',scrub:true,onUpdate:s=>{g.position.y=-2.4+(1-s.progress)*-3}});
  ScrollTrigger.create({trigger:'.momento',start:'top bottom',end:'bottom top',onToggle:s=>vis=s.isActive,onUpdate:s=>sy=s.progress});
  const clk=new THREE.Clock();(function f(){requestAnimationFrame(f);if(!vis)return;const t=clk.getElapsedTime();g.rotation.y=t*.5+sy*Math.PI*3+mx*1.2;g.rotation.x=my*.15;st.rotation.y=t*2;sp2.rotation.y=-t*.1;sp2.position.y=Math.sin(t)*.1;r.render(scn,cam)})();
})();
