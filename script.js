const progress=document.querySelector(".progress");
const glow=document.querySelector(".cursor-glow");
const menu=document.querySelector(".menu-btn");
const nav=document.querySelector(".nav-links");
const theme=document.querySelector(".theme-btn");

window.addEventListener("scroll",()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(window.scrollY/h*100)+"%";
});
window.addEventListener("pointermove",(e)=>{
  glow.style.left=e.clientX+"px"; glow.style.top=e.clientY+"px";
});
menu.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
theme.addEventListener("click",()=>{
  document.body.classList.toggle("light");
  theme.textContent=document.body.classList.contains("light")?"☾":"☼";
});
const observer=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add("visible")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
document.querySelectorAll(".project").forEach(card=>{
 card.addEventListener("mousemove",e=>{
   const r=card.getBoundingClientRect();
   const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
   card.style.transform=`perspective(900px) rotateY(${x*2}deg) rotateX(${-y*2}deg)`;
 });
 card.addEventListener("mouseleave",()=>card.style.transform="");
});

// Premium micro-interactions
document.querySelectorAll(".hero-actions .btn").forEach(btn=>{
  btn.addEventListener("pointermove",e=>{
    const r=btn.getBoundingClientRect();
    btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.06}px,${(e.clientY-r.top-r.height/2)*.06-4}px)`;
  });
  btn.addEventListener("pointerleave",()=>btn.style.transform="");
});
const sections=[...document.querySelectorAll("main section[id]")];
const links=[...document.querySelectorAll(".nav-links a")];
const activeObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      links.forEach(l=>l.classList.toggle("active",l.getAttribute("href")==="#"+entry.target.id));
    }
  });
},{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>activeObserver.observe(s));

// ===== Signature settings system =====
const settingsPanel=document.querySelector(".settings-panel");
const settingsBackdrop=document.querySelector(".settings-backdrop");
const settingsClose=document.querySelector(".settings-close");
const themeBtn=document.querySelector(".theme-btn");
const motionToggle=document.querySelector("#motionToggle");
const glowToggle=document.querySelector("#glowToggle");
const root=document.documentElement;

function openSettings(){
  settingsPanel.classList.add("open"); settingsBackdrop.classList.add("open");
  settingsBackdrop.setAttribute("aria-hidden","false");
}
function closeSettings(){
  settingsPanel.classList.remove("open"); settingsBackdrop.classList.remove("open");
  settingsBackdrop.setAttribute("aria-hidden","true");
}
themeBtn.addEventListener("click",openSettings);
settingsClose.addEventListener("click",closeSettings);
settingsBackdrop.addEventListener("click",closeSettings);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSettings()});

function setTheme(mode){
  localStorage.setItem("portfolio-theme",mode);
  let dark=mode==="dark" || (mode==="system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.body.classList.toggle("light",dark);
  document.querySelectorAll("[data-theme-choice]").forEach(b=>b.classList.toggle("selected",b.dataset.themeChoice===mode));
}
document.querySelectorAll("[data-theme-choice]").forEach(b=>b.addEventListener("click",()=>setTheme(b.dataset.themeChoice)));
const savedTheme=localStorage.getItem("portfolio-theme")||"light"; setTheme(savedTheme);
matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{if((localStorage.getItem("portfolio-theme")||"light")==="system")setTheme("system")});

document.querySelectorAll("[data-accent]").forEach(b=>b.addEventListener("click",()=>{
  const color=b.dataset.accent; root.style.setProperty("--accent",color);
  root.style.setProperty("--accent-soft",color+"22"); localStorage.setItem("portfolio-accent",color);
  document.querySelectorAll("[data-accent]").forEach(x=>x.classList.toggle("selected",x===b));
}));
const savedAccent=localStorage.getItem("portfolio-accent");
if(savedAccent){root.style.setProperty("--accent",savedAccent);root.style.setProperty("--accent-soft",savedAccent+"22")}
document.querySelectorAll("[data-accent]").forEach(x=>x.classList.toggle("selected",x.dataset.accent===savedAccent));

motionToggle.addEventListener("change",()=>document.body.classList.toggle("no-motion",!motionToggle.checked));
glowToggle.addEventListener("change",()=>document.body.classList.toggle("no-glow",!glowToggle.checked));

window.addEventListener("pointermove",e=>{
  root.style.setProperty("--mx",(e.clientX/window.innerWidth*100)+"%");
  root.style.setProperty("--my",(e.clientY/window.innerHeight*100)+"%");
});
