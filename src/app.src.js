
(function(){
"use strict";
var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
var coarse = matchMedia("(pointer: coarse)").matches;

/* ---------- SFX: procedural Web Audio, opt-in, no audio files ---------- */
var SFX=(function(){
  var ctx=null, master=null, enabled=false, drone=null;
  function ensure(){
    if(!ctx){
      var AC=window.AudioContext||window.webkitAudioContext;
      if(!AC) return false;
      ctx=new AC();
      master=ctx.createGain(); master.gain.value=0.17; master.connect(ctx.destination);
    }
    if(ctx.state==="suspended") ctx.resume();
    return true;
  }
  function tone(freq,dur,type,gain){
    if(!enabled||!ctx) return;
    var o=ctx.createOscillator(), gn=ctx.createGain(), t0=ctx.currentTime;
    o.type=type||"sine"; o.frequency.value=freq;
    gn.gain.setValueAtTime(0.0001,t0);
    gn.gain.linearRampToValueAtTime(gain||0.4,t0+0.008);
    gn.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(gn); gn.connect(master);
    o.start(t0); o.stop(t0+dur+0.02);
  }
  return {
    toggle:function(){ enabled=!enabled; if(enabled) ensure(); return enabled; },
    isEnabled:function(){ return enabled; },
    hover:function(){ tone(680+Math.random()*40,0.045,"sine",0.22); },
    click:function(){ tone(300,0.075,"triangle",0.32); },
    key:function(){ tone(1350+Math.random()*260,0.016,"square",0.09); },
    chime:function(){
      if(!enabled) return;
      [523.25,659.25,783.99].forEach(function(f,i){ setTimeout(function(){ tone(f,0.4,"sine",0.34); },i*120); });
    },
    droneEnter:function(){
      if(!enabled||!ctx||drone) return;
      var o1=ctx.createOscillator(), o2=ctx.createOscillator(), gn=ctx.createGain();
      o1.type="sine"; o2.type="sine"; o1.frequency.value=110; o2.frequency.value=118;
      gn.gain.value=0.0001;
      o1.connect(gn); o2.connect(gn); gn.connect(master);
      o1.start(); o2.start();
      gn.gain.linearRampToValueAtTime(0.1,ctx.currentTime+0.6);
      drone={o1:o1,o2:o2,gn:gn};
    },
    droneUpdate:function(t){
      if(!drone) return;
      drone.o2.frequency.setTargetAtTime(110+8+t*26, ctx.currentTime, 0.25);
    },
    droneExit:function(){
      if(!drone) return;
      var d=drone; drone=null;
      d.gn.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
      setTimeout(function(){ try{ d.o1.stop(); d.o2.stop(); }catch(e){} },900);
    }
  };
})();
(function(){
  var btn=document.getElementById("soundToggle");
  if(!btn) return;
  btn.addEventListener("click",function(){
    var on=SFX.toggle();
    btn.classList.toggle("on",on);
    btn.textContent=on?"🔊":"🔇";
    btn.setAttribute("aria-pressed",on?"true":"false");
    if(on) SFX.click();
  });
  var lastHover=null;
  document.addEventListener("mouseover",function(e){
    var t=e.target.closest("a,button"); if(!t||t===lastHover) return;
    lastHover=t; SFX.hover();
  });
  document.addEventListener("mouseout",function(e){
    var t=e.target.closest("a,button"); if(t===lastHover) lastHover=null;
  });
  document.addEventListener("click",function(e){
    if(e.target.closest("a,button")) SFX.click();
  });
})();

var ART=[
  "assets/img/art-01.webp",
  "assets/img/art-02.webp",
  "assets/img/art-03.webp",
  "assets/img/art-04.webp",
  "assets/img/art-05.webp",
  "assets/img/art-06.webp",
  "assets/img/art-07.webp"
];
var LOGO={rs:"assets/img/rs-01.webp",pa:"assets/img/pa-01.webp",pl:"assets/img/pl-01.webp"};
var PROJECTS = [
  {t:"RedScribe", cs:"work/redscribe/index.html", logo:LOGO.rs,                y:"In dev",  tag:"FastAPI · Next.js · AI reporting", url:"https://redscribe-2291.vercel.app/",
   github:"https://github.com/salman2610/redscribe",
   desc:"A self-hosted, AI-powered pentest report generation platform — FastAPI backend, Next.js frontend, PDF/DOCX export, and Gemini and Ollama providers. The frontend is live; the backend isn't deployed publicly yet."},
  {t:"SiteReliant", cs:"work/sitereliant/index.html",             y:"Active",  tag:"Next.js · Fastify · BullMQ · Chromium", url:"https://site-reliant.vercel.app/",
   github:"https://github.com/salman2610/SiteReliant",
   desc:"Website operations platform for agencies: HTTP, TLS, DNS and TCP monitoring, synthetic browser journeys with an evidence vault, root-cause hints, and fix verification before an incident can close. Includes white-label client portals, monthly SLA reports, and SSRF and DNS-rebinding defences."},
  {t:"Purple Agent", cs:"work/purple-agent/index.html", logo:LOGO.pa,             y:"Active",  tag:"Python · systemd · JWT auth",      url:"https://purple-agent-omega.vercel.app/",
   github:"https://github.com/salman2610/purple-agent",
   desc:"A modular server monitoring agent with centralized telemetry — CPU, memory, disk, processes and auth logs, plus file-integrity monitoring — deployed as a Linux systemd service with JWT-authenticated communication."},
  {t:"ProofLayer", cs:"work/proof-layer/index.html", logo:LOGO.pl,                y:"Active",  tag:"Node.js · SARIF · Proof records",  url:"https://proof-layer-zeta.vercel.app",
   github:"https://github.com/salman2610/ProofLayer",
   desc:"Proves that a security fix actually worked. It replays the original attack and alternate routes to the same data, returns one of five verdicts, and issues a sealed proof record anyone can verify offline with a CLI. Imports SARIF and Burp findings, redacts secrets and PII, and limits retests to approved targets."},
  {t:"AI Vulnerability Scanner", y:"Active",  tag:"Python · ML · CVSS v3.1",          url:"https://github.com/salman2610/ai-vuln-scanner",
   desc:"An ML-assisted scanner that maps findings to CVSS v3.1 and prioritizes what actually needs fixing first, instead of dumping a flat list of alerts."},
  {t:"OWASP Security Framework", y:"Active",  tag:"Python · Burp Suite · CI/CD",      url:"https://github.com/salman2610/OWASP-Framework",
   desc:"A modular Python framework wiring Nmap, Nikto, Nuclei and API fuzzing into one pipeline, with OWASP Top 10 mapping, severity classification, and automated HTML reporting."},
  {t:"Purple Team Framework",    y:"Active",  tag:"Python · MITRE ATT&CK · React",    url:"https://github.com/salman2610/PurpleTeam-Project",
   desc:"A real-time threat-hunting dashboard mapped to MITRE ATT&CK — live system telemetry on a FastAPI backend, surfaced through a React front end built to be read at a glance during an incident."}
];
var CAPS = [
  {n:"Design & Creative Engineering", d:"Visual storytelling, typography, motion design and interactive interfaces. WebGL, CSS and creative frontend engineering: this site is the working proof, from the physics padlocks to the vapour headline."},
  {n:"Cybersecurity Engineering", d:"VAPT, application security, infrastructure security, penetration testing and security research. Certified Penetration Tester (CPT): web, API and Android assessments against the OWASP Top 10, with Burp Suite, Nmap and Metasploit."},
  {n:"Software & Product Development", d:"Full-stack development, AI tooling and product architecture. SiteReliant, ProofLayer and RedScribe are built end to end with FastAPI, React, Next.js and Node, security designed in from the first commit."},
  {n:"Teaching & curriculum design", d:"Structured internship tracks in data science, Linux cloud administration and offensive security: scaffolded and hands-on, nothing pre-solved for the intern."}
];

/* ---------- preloader ---------- */
var count=document.getElementById("count"), bar=document.getElementById("bar"), pre=document.getElementById("pre"), preLog=document.getElementById("preLog");
var pct=0, revealStart=0, preT0=performance.now(), preDone=false;
var lt=setInterval(function(){
  pct=Math.max(pct+Math.random()*11+4, Math.min(100,(performance.now()-preT0)/16));
  if(pct>=100){pct=100;clearInterval(lt);setTimeout(finish,320);}
  count.textContent=Math.floor(pct); bar.style.width=pct+"%";
}, reduced?20:95);

setTimeout(function(){ if(!preDone){ clearInterval(lt); finish(); } },3500);

var BOOT_LINES=["[ok] mounting filesystem","[ok] initializing shaders","[ok] loading threat intel","[ok] starting recon module","[ok] verifying certificates","[ok] establishing secure session","[ok] rendering interface"];
var bootIdx=0;
var bootTimer = (reduced||!preLog) ? null : setInterval(function(){
  if(bootIdx>=BOOT_LINES.length){ clearInterval(bootTimer); return; }
  var line=document.createElement("div");
  line.className="pre-log-line";
  line.textContent=BOOT_LINES[bootIdx++];
  preLog.appendChild(line);
  requestAnimationFrame(function(){ line.classList.add("on"); });
  while(preLog.children.length>4) preLog.removeChild(preLog.firstChild);
},170);

function finish(){
  if(preDone) return; preDone=true;
  pre.classList.add("done");
  if(bootTimer) clearInterval(bootTimer);
  document.body.classList.remove("locked");
  document.body.classList.add("ready");
  revealStart=performance.now()+180;
  setTimeout(function(){pre.style.display="none";},1200);
  measure();
}

/* ---------- cursor ---------- */
var cur=document.getElementById("cursor"), ring=document.getElementById("cursor-ring");
var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
addEventListener("mousemove",function(e){mx=e.clientX;my=e.clientY;cur.style.transform="translate("+mx+"px,"+my+"px)";});
document.addEventListener("mouseover",function(e){
  var t=e.target.closest("a,button,.card"); ring.classList.toggle("grow",!!t);
});

/* ---------- marquee ---------- */
var stripWords=["Penetrate","Audit","Defend","Research","Develop","Analyze","Detect","Respond","Exploit","Patch","Architect","Reverse","Automate","Monitor","Harden","Decode","Encrypt","Report","Consult","Deliver"];
var strip=document.getElementById("strip"),sh="";
for(var r=0;r<4;r++) for(var i=0;i<stripWords.length;i++) sh+="<span>"+stripWords[i]+" <em>/</em></span>";
strip.innerHTML=sh;

/* ---------- cards + artwork ---------- */
var track=document.getElementById("track"), artURLs=ART.slice(), frameEls=[];
PROJECTS.forEach(function(p,i){
  var el=document.createElement("div"); el.className="card";
  el.setAttribute("draggable","false");
  el.addEventListener("dragstart",function(e){ e.preventDefault(); });
  el.innerHTML='<div class="frame"><span class="idx">'+String(i+1).padStart(2,"0")+'</span><img src="'+ART[i]+'" alt="" draggable="false" decoding="async">'+(PROJECTS[i].logo?'<img class="plogo" src="'+PROJECTS[i].logo+'" alt="" draggable="false">':'')+'<span class="lens" aria-hidden="true"></span></div>'+
    '<div class="cap"><h3>'+p.t+'</h3><span class="yr">'+p.y+'</span></div><div class="tags">'+p.tag+'</div>';
  el.innerHTML='<a class="card-link" href="'+(p.url||"#work")+'" target="_blank" rel="noopener noreferrer" draggable="false">'+el.innerHTML+'</a>'+(p.cs?'<a class="detail-btn" href="'+p.cs+'" draggable="false">View details <span aria-hidden="true">→</span></a>':"");
  track.appendChild(el);
  var frameEl=el.querySelector(".frame"), lens=el.querySelector(".lens"), artImg=el.querySelector("img");
  lens.style.backgroundImage='url("'+ART[i]+'")';
  frameEls.push(frameEl);
  if(!reduced&&!coarse){
    el.addEventListener("mousemove",function(e){
      var r=frameEl.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
      frameEl.style.transform="rotateX("+(py*-9).toFixed(2)+"deg) rotateY("+(px*11).toFixed(2)+"deg)";
      frameEl.style.setProperty("--mx",((px+.5)*100).toFixed(1)+"%"); frameEl.style.setProperty("--my",((py+.5)*100).toFixed(1)+"%");
      /* glass lens: a magnified copy of the artwork under the cursor, mapped like object-fit:cover */
      var fw=frameEl.offsetWidth, fh=frameEl.offsetHeight, iw=artImg.naturalWidth||fw, ih=artImg.naturalHeight||fh, sc=Math.max(fw/iw,fh/ih), dw=iw*sc, dh=ih*sc, ox=(fw-dw)/2, oy=(fh-dh)/2, Z=1.8, ld=Math.max(96,Math.min(150,fw*.44)), lx=(px+.5)*fw, ly=(py+.5)*fh;
      lens.style.setProperty("--ld",ld+"px"); lens.style.setProperty("--lx",lx.toFixed(1)+"px"); lens.style.setProperty("--ly",ly.toFixed(1)+"px");
      lens.style.backgroundSize=(dw*Z).toFixed(1)+"px "+(dh*Z).toFixed(1)+"px";
      lens.style.backgroundPosition=(-((lx-ox)*Z-ld/2)).toFixed(1)+"px "+(-((ly-oy)*Z-ld/2)).toFixed(1)+"px";
    });
    el.addEventListener("mouseleave",function(){ frameEl.style.transform=""; });
  }
});

/* ---------- image trail over the work section ---------- */
(function(){
  if(reduced||coarse||!artURLs.length) return;
  var host=document.getElementById("trail"), pinEl=document.querySelector(".work-pin");
  var pool=[], n=0, lastX=0, lastY=0, primed=false;
  for(var i=0;i<12;i++){
    var im=document.createElement("img");
    im.src=artURLs[i%artURLs.length]; im.alt=""; im.decoding="async";
    host.appendChild(im); pool.push(im);
  }
  var idx=0;
  pinEl.addEventListener("mousemove",function(e){
    var r=pinEl.getBoundingClientRect();
    var x=e.clientX-r.left, y=e.clientY-r.top;
    if(!primed){ lastX=x; lastY=y; primed=true; return; }
    var dx=x-lastX, dy=y-lastY;
    if(Math.sqrt(dx*dx+dy*dy) < 110) return;
    lastX=x; lastY=y;
    var im=pool[idx%pool.length]; idx++;
    im.src=artURLs[(n++)%artURLs.length];
    im.classList.remove("live","out");
    im.style.left=x+"px"; im.style.top=y+"px";
    im.style.setProperty("--rot",((Math.random()*10-5).toFixed(1))+"deg");
    void im.offsetWidth;
    im.classList.add("live");
    setTimeout(function(){ im.classList.remove("live"); im.classList.add("out"); }, 420);
  });
})();

/* ---------- spotlight artwork + parallax ---------- */
var spotEl=document.getElementById("spotlight"), spotBg=document.getElementById("spotBg"), spotInner=document.querySelector(".spotlight-inner");
if(spotBg){ spotBg.src=ART[6]; }

/* ---------- capabilities ---------- */
var CAP_COLORS=[
  [[0.48,0.42,1.0],[0.25,0.85,0.88]],
  [[0.25,0.85,0.88],[0.96,0.82,0.41]],
  [[1.0,0.48,0.30],[0.48,0.42,1.0]],
  [[0.96,0.82,0.41],[1.0,0.48,0.30]],
  [[0.48,0.42,1.0],[1.0,0.48,0.30]],
  [[0.86,0.88,0.84],[0.25,0.85,0.88]]
];
var caplist=document.getElementById("caplist"), capTarget=CAP_COLORS[0], capCur=[CAP_COLORS[0][0].slice(),CAP_COLORS[0][1].slice()];
CAPS.forEach(function(c,i){
  var b=document.createElement("button");
  b.className="cap-row"; b.type="button"; b.setAttribute("aria-expanded","false");
  b.innerHTML='<span class="top"><span class="name scr">'+c.n+'</span><span class="n">'+String(i+1).padStart(2,"0")+'</span></span><span class="body"><div><p>'+c.d+'</p></div></span>';
  b.addEventListener("click",function(){
    b.setAttribute("aria-expanded", b.getAttribute("aria-expanded")==="true"?"false":"true");
  });
  b.addEventListener("mouseenter",function(){ capTarget=CAP_COLORS[i]; });
  b.addEventListener("focus",function(){ capTarget=CAP_COLORS[i]; });
  caplist.appendChild(b);
});

/* ---------- attack surface ---------- */
/* ---------- toolkit ---------- */
var TOOLS=[
  {n:"Burp Suite Pro", d:["Web app proxy","Collaborator & out-of-band testing","Custom extensions"]},
  {n:"Metasploit", d:["Exploit development","Post-exploitation","Impact validation"]},
  {n:"Sliver", d:["Adversary emulation","C2 & implant tradecraft","Red-team operations"]},
  {n:"BloodHound", d:["Active Directory attack paths","Privilege-escalation graphs","Tiering & delegation gaps"]},
  {n:"Impacket", d:["Kerberos & SMB attacks","Credential relay","Windows protocol tooling"]},
  {n:"NetExec", d:["Credential spraying","Lateral movement","AD checks at scale"]},
  {n:"Nuclei", d:["Templated scanning","Custom detection templates","CI-friendly"]},
  {n:"Frida", d:["Dynamic instrumentation","Mobile runtime hooking","Certificate-pinning analysis"]},
  {n:"Ghidra", d:["Reverse engineering","Binary analysis","Decompilation"]},
  {n:"MobSF", d:["Mobile static & dynamic analysis","APK & IPA review","Manifest & permission audit"]},
  {n:"Semgrep", d:["Static analysis","Custom rules","Secure code review"]},
  {n:"CodeQL", d:["Semantic code queries","Variant analysis","CI scanning"]},
  {n:"Hashcat", d:["GPU password recovery","Rule-based attacks","Hash analysis"]},
  {n:"Responder", d:["LLMNR / NBT-NS poisoning","Internal network testing","Hash capture"]},
  {n:"Amass", d:["Attack-surface mapping","Subdomain enumeration","OSINT graphs"]},
  {n:"Trivy", d:["Container & IaC scanning","SBOM & CVE detection","Pipeline gates"]},
  {n:"Wazuh", d:["SIEM & EDR","Detection engineering","Log correlation"]},
  {n:"ffuf", d:["Web fuzzing","Directories & params","Virtual hosts"]},
  {n:"sqlmap", d:["SQL injection detection","Automated exploitation","Database enumeration"]},
  {n:"Nmap", d:["Network discovery","Port scanning","Service enumeration"]},
  {n:"Wireshark", d:["Packet capture","Protocol analysis","Traffic inspection"]},
  {n:"OWASP ZAP", d:["Open-source scanner","Active & passive scans","API testing"]},
  {n:"Nessus", d:["Infra vulnerability scans","Compliance checks","Asset coverage"]},
  {n:"Linux", d:["Kali & Ubuntu","Where all of this runs","Scripting & automation"]}
];
var tkGrid=document.getElementById("tkGrid"), tkDetail=document.getElementById("tkDetail");
if(tkGrid){
  TOOLS.forEach(function(t,i){
    var b=document.createElement("button");
    b.className="tk-item"; b.type="button"; b.textContent=t.n;
    function show(){
      Array.prototype.forEach.call(tkGrid.children,function(x){ x.classList.remove("active"); });
      b.classList.add("active");
      tkDetail.innerHTML='<div class="tk-detail-inner"><h4>'+t.n+'</h4><ul>'+t.d.map(function(x){ return "<li>"+x+"</li>"; }).join("")+'</ul></div>';
    }
    b.addEventListener("mouseenter",show);
    b.addEventListener("focus",show);
    tkGrid.appendChild(b);
  });
  if("IntersectionObserver" in window){
    var tkIo=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var idx=Array.prototype.indexOf.call(tkGrid.children,en.target);
          setTimeout(function(){ en.target.classList.add("in"); }, Math.max(0,idx)*55);
          tkIo.unobserve(en.target);
        }
      });
    },{threshold:0.2});
    Array.prototype.forEach.call(tkGrid.children,function(x){ tkIo.observe(x); });
  } else {
    Array.prototype.forEach.call(tkGrid.children,function(x){ x.classList.add("in"); });
  }
}

var SURFACES=[
  {n:"Web",     pct:92, color:[0.48,0.42,1.0], items:["Cross-site scripting (XSS)","SQL injection","Authentication flaws","Broken access control","Business logic abuse","API security gaps"]},
  {n:"API",     pct:84, color:[0.25,0.85,0.88], items:["Broken object-level auth","Excessive data exposure","Mass assignment","Rate limiting & abuse","Injection via parameters"]},
  {n:"Network", pct:74, color:[1.0,0.48,0.30], items:["Exposed services & ports","Misconfigurations","Weak segmentation","Lateral movement paths"]},
  {n:"Mobile",  pct:60, color:[0.96,0.82,0.41], items:["Insecure local storage","WebView & deep-link handling","Root/jailbreak detection bypass","IPC & content-provider leaks"]},
  {n:"Cloud",   pct:52, color:[0.86,0.88,0.84], items:["IAM misconfiguration","Public storage buckets","Excessive permissions","Secrets exposure"]}
];
var asBarsEl=document.getElementById("asBars"), asDetailEl=document.getElementById("asDetail");
var asTargetColor=SURFACES[0].color, asCurColor=SURFACES[0].color.slice();
if(asBarsEl){
  SURFACES.forEach(function(s,i){
    var b=document.createElement("button");
    b.className="as-bar"; b.type="button"; b.style.setProperty("--w",s.pct+"%");
    b.innerHTML='<span class="as-label">'+s.n+'</span><span class="as-track"><span class="as-fill"></span></span><span class="as-pct">'+s.pct+'%</span>';
    b.addEventListener("click",function(){
      Array.prototype.forEach.call(asBarsEl.children,function(x){ x.classList.remove("active"); });
      b.classList.add("active");
      asTargetColor=s.color;
      asDetailEl.innerHTML='<div class="as-detail-inner">'+s.items.map(function(it){ return '<span class="as-chip">'+it+'</span>'; }).join("")+'</div>';
      var chips=asDetailEl.querySelectorAll(".as-chip");
      chips.forEach(function(c,ci){ setTimeout(function(){ c.classList.add("in"); },ci*55); });
    });
    asBarsEl.appendChild(b);
  });
  if("IntersectionObserver" in window){
    var asIo=new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting) en.target.classList.add("in"); });
    },{threshold:0.4});
    Array.prototype.forEach.call(asBarsEl.children,function(x){ asIo.observe(x); });
  } else {
    Array.prototype.forEach.call(asBarsEl.children,function(x){ x.classList.add("in"); });
  }
}
(function(){
  var cv=document.getElementById("asCanvas");
  if(!cv) return;
  var g=cv.getContext("2d");
  if(!g) return;
  var W=cv.width,H=cv.height,N=12,nodes=[];
  for(var i=0;i<N;i++) nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*0.18,vy:(Math.random()-0.5)*0.18});
  var wrapEl=document.querySelector(".as-visual");
  function inView(){ if(!wrapEl) return true; var r=wrapEl.getBoundingClientRect(); return r.bottom>0 && r.top<innerHeight; }
  function tick(){
    if(!reduced) requestAnimationFrame(tick);
    if(!inView()) return;
    asCurColor=asCurColor.map(function(v,k){ return v+(asTargetColor[k]-v)*0.045; });
    g.clearRect(0,0,W,H);
    for(var i=0;i<N;i++){
      var n=nodes[i]; n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
    }
    var rr=Math.round(asCurColor[0]*255), gg=Math.round(asCurColor[1]*255), bb=Math.round(asCurColor[2]*255);
    g.lineWidth=1;
    for(var a=0;a<N;a++)for(var bI=a+1;bI<N;bI++){
      var dx=nodes[a].x-nodes[bI].x, dy=nodes[a].y-nodes[bI].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<W*0.4){
        g.globalAlpha=Math.max(0,1-d/(W*0.4))*0.45;
        g.strokeStyle="rgb("+rr+","+gg+","+bb+")";
        g.beginPath(); g.moveTo(nodes[a].x,nodes[a].y); g.lineTo(nodes[bI].x,nodes[bI].y); g.stroke();
      }
    }
    g.globalAlpha=0.9;
    g.fillStyle="rgb("+rr+","+gg+","+bb+")";
    for(var j=0;j<N;j++){ g.beginPath(); g.arc(nodes[j].x,nodes[j].y,2.6,0,6.283); g.fill(); }
    g.globalAlpha=1;
  }
  requestAnimationFrame(tick);
})();

/* ---------- attack story: a live scene of one app being attacked and fixed, scrubbed by scroll ---------- */
(function(){
  var sc=document.getElementById("scene"); if(!sc) return;
  var logEl=document.getElementById("scLog"), titleEl=document.getElementById("scTitle"), statEl=document.getElementById("scStat"), wrapEl=document.getElementById("storyPin");
  var FIN=[["FINDING-07  SQL injection","dim"],["CVSS 8.1 High · A03:2021","warn"],["status: closed · retest passed","ok"]];
  var S=[
    {t:"traffic",s:"● nominal",L:[["GET  /login              200","ok"],["POST /api/session        200","ok"],["GET  /dashboard          200","ok"],["GET  /api/orders         200","ok"],["GET  /static/app.js      200","dim"]]},
    {t:"surface map",s:"● 38 routes · 9 forms",L:[["form    /login            POST","dim"],["form    /orders/search    GET","hl"],["upload  /api/upload       multipart","hl"],["api     /api/orders       REST","hl"],["api     /api/users        REST","dim"],["38 routes · 9 forms mapped","warn"]]},
    {t:"recon",s:"● scanning",L:[["$ nmap -sV -p- target.example","cmd"],["443/tcp open  https  nginx 1.24","dim"],["22/tcp  open  ssh    OpenSSH 9.2","dim"],["app.target.example","ok"],["api.target.example","ok"],["admin.target.example","warn"],["14 subdomains found","ok"]]},
    {t:"enumeration",s:"● probing",L:[["GET /api/users           401","dim"],["GET /api/orders          200  v2","ok"],["GET /api/orders/export   200  hidden","warn"],["GET /admin/login         200","ok"],["GET /.git/config         404","dim"]]},
    {t:"discovery",s:"● anomaly",L:[["GET /api/orders?id=1'","cmd"],["← 500  SQL syntax error near \"'\"","bad"],["⚑ injection candidate · OWASP A03","bad"]]},
    {t:"exploitation",s:"● in scope · read-only",L:[["GET /api/orders?id=1 UNION SELECT user()","cmd"],["← 200  app_rw@db-internal","bad"],["✔ impact proven · read-only · in scope","ok"],["evidence saved · FINDING-07","dim"]]},
    {t:"remediation",s:"● patched",L:[["- query(\"… id = \" + id)","bad"],["+ query(\"… id = ?\", [id])","ok"],["GET /api/orders?id=1'","cmd"],["← 400  rejected","ok"],["✔ retest passed · finding closed","ok"]]},
    {t:"report",s:"● secure",L:FIN}
  ];
  var cur=-2, shownN=-1, kids=[];
  function build(i){
    var d=S[i]; sc.setAttribute("data-step",i); titleEl.textContent=d.t; statEl.textContent=d.s; logEl.textContent=""; kids=[]; shownN=-1;
    d.L.forEach(function(l){ var r=document.createElement("div"); r.className="c-"+l[1]; r.textContent=l[0]; logEl.appendChild(r); kids.push(r); });
  }
  function inView(){ if(!wrapEl) return true; var r=wrapEl.getBoundingClientRect(); return r.bottom>0 && r.top<innerHeight; }
  function update(){
    var sa=(typeof storyActive==="number")?storyActive:0, sw=(typeof storyWithin==="number")?storyWithin:0, i=Math.max(0,Math.min(S.length-1,sa));
    if(i!==cur){ cur=i; build(i); }
    var len=kids.length, n=(i>=S.length-1)?len:Math.max(1,Math.min(len,Math.ceil(sw*len*1.3)));
    if(n!==shownN){ shownN=n; for(var k=0;k<len;k++) kids[k].classList.toggle("on",k<n); }
  }
  function frame(){ requestAnimationFrame(frame); if(inView()) update(); }
  build(0); update(); requestAnimationFrame(frame);
})();

/* ---------- throughline: ambient particle field + ending convergence ---------- */
(function(){
  if(reduced) return;
  var cv=document.getElementById("threadCanvas");
  if(!cv) return;
  var g=cv.getContext("2d");
  if(!g) return;
  var dpr=Math.min(devicePixelRatio||1,1.4);
  function size(){ cv.width=Math.floor(innerWidth*dpr); cv.height=Math.floor(innerHeight*dpr); }
  size(); addEventListener("resize",size);

  var STOPS=[[0.48,0.42,1.0],[0.25,0.85,0.88],[1.0,0.48,0.30],[0.96,0.82,0.41],[0.48,0.42,1.0]];
  function stopColor(f){
    f=Math.max(0,Math.min(0.999,f));
    var seg=f*(STOPS.length-1), i=Math.floor(seg), t=seg-i, a=STOPS[i], b=STOPS[i+1];
    return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
  }

  var N=150, pts=[];
  for(var i=0;i<N;i++){
    pts.push({x:Math.random(),y:Math.random(),vx:(Math.random()-0.5)*0.00035,vy:(Math.random()-0.5)*0.00035,r:0.7+Math.random()*1.5,tx:0.5,ty:0.5,delay:Math.random(),arc:(Math.random()-0.5)*2,ph:Math.random()*6.283});
  }

  /* targets: an "S" drawn as a vector stroke (font-independent), sampled evenly so every dot gets its own spot */
  (function(){
    var C=200, off=document.createElement("canvas"); off.width=C; off.height=C;
    var og=off.getContext("2d");
    og.clearRect(0,0,C,C);
    og.strokeStyle="#fff"; og.lineWidth=26; og.lineCap="round"; og.lineJoin="round";
    og.beginPath();
    og.moveTo(146,44);
    og.bezierCurveTo(128,12, 52,14, 52,60);
    og.bezierCurveTo(52,102, 148,98, 148,142);
    og.bezierCurveTo(148,190, 70,188, 52,154);
    og.stroke();
    var data=og.getImageData(0,0,C,C).data, spots=[];
    for(var y=0;y<C;y+=2) for(var x=0;x<C;x+=2){
      if(data[(y*C+x)*4+3]>140) spots.push({x:x/C,y:y/C});
    }
    var L=spots.length, picked=[];
    for(var k=0;k<N;k++){ picked.push(L ? spots[Math.floor((k+0.5)*L/N)] : {x:0.5,y:0.5}); }
    for(var m=picked.length-1;m>0;m--){ var j=(Math.random()*(m+1))|0, t=picked[m]; picked[m]=picked[j]; picked[j]=t; }
    for(var q=0;q<N;q++){ pts[q].tx=picked[q].x; pts[q].ty=picked[q].y; }
  })();

  function ss(t){ t=Math.max(0,Math.min(1,t)); return t*t*(3-2*t); }

  function frame(){
    requestAnimationFrame(frame);
    var W=cv.width, H=cv.height, now=performance.now();
    var scrollFrac=Math.max(0,Math.min(1, current/totalScrollLen));
    if(window.__burst){ var bs=window.__burst; window.__burst=null; for(var q=0;q<bs.length;q++){ for(var rp=0;rp<5;rp++){ var pp=pts[(q*5+rp)%pts.length]; pp.x=bs[q][0]/innerWidth; pp.y=bs[q][1]/innerHeight; var an=Math.random()*6.283, sp=.0025+Math.random()*.004; pp.vx=Math.cos(an)*sp; pp.vy=Math.sin(an)*sp; pp.bo=1; } } }
    var col=stopColor(scrollFrac);
    var mxN=mx/innerWidth, myN=my/innerHeight;
    var wide=innerWidth>900, SZ=wide?Math.min(W*0.3,H*0.66):Math.min(W,H)*0.5, cx=W*(wide?0.75:0.5), cy=H*(wide?0.47:0.3);
    g.clearRect(0,0,W,H);
    for(var i=0;i<pts.length;i++){
      var p=pts[i];
      p.x+=p.vx; p.y+=p.vy;
      if(p.bvx===undefined){ p.bvx=Math.abs(p.vx)||.0002; p.bvy=Math.abs(p.vy)||.0002; }
      p.vx+=((p.vx<0?-1:1)*p.bvx-p.vx)*.012; p.vy+=((p.vy<0?-1:1)*p.bvy-p.vy)*.012;
      if(p.bo) p.bo*=.985;
      if(p.x<0||p.x>1) p.vx*=-1;
      if(p.y<0||p.y>1) p.vy*=-1;
      var dx=mxN-p.x, dy=myN-p.y, d2=dx*dx+dy*dy;
      if(d2<0.02&&d2>0.00001){ var f=(0.02-d2)*0.4; p.vx-=dx*f; p.vy-=dy*f; }

      /* each dot starts its journey at a slightly different scroll point so they stream in rather than snap */
      var c=ss((scrollFrac-0.86-p.delay*0.06)/0.05);
      var bx=p.x*W, by=p.y*H;
      var sx=cx+(p.tx-0.5)*SZ, sy=cy+(p.ty-0.5)*SZ;
      var px=bx+(sx-bx)*c, py=by+(sy-by)*c;
      /* curved flight path */
      var arcAmt=Math.sin(c*Math.PI)*p.arc*SZ*0.18;
      px+=arcAmt*0.7; py+=arcAmt*0.4;
      /* settled dots breathe a little and shy away from the cursor */
      if(c>0.01){
        var br=Math.sin(now*0.0014+p.ph)*1.6*dpr*c;
        px+=br; py+=Math.cos(now*0.0012+p.ph)*1.6*dpr*c;
        var ddx=px-mx*(W/innerWidth), ddy=py-my*(H/innerHeight), dd=Math.sqrt(ddx*ddx+ddy*ddy), R=SZ*0.16;
        if(dd<R&&dd>0.01){ var push=(1-dd/R)*SZ*0.07*c; px+=ddx/dd*push; py+=ddy/dd*push; }
      }
      var alpha=0.14+0.16*Math.sin(i*1.7+now*0.0006)*(1-c)+c*0.78+(p.bo||0)*0.5;
      g.beginPath(); g.arc(px,py,(p.r*dpr)*(1+c*0.8),0,6.283);
      g.fillStyle="rgba("+Math.round(col[0]*255)+","+Math.round(col[1]*255)+","+Math.round(col[2]*255)+","+Math.max(0.05,alpha).toFixed(3)+")";
      g.fill();
    }
  }
  requestAnimationFrame(frame);
})();

/* ---------- accessible dialogs: focus in, trap Tab, Escape out, restore focus, hide the page behind ---------- */
var dlg=(function(){
  var stack=[];
  function focusables(root){ return Array.prototype.slice.call(root.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter(function(el){ return el.offsetParent!==null||el===document.activeElement; }); }
  function bg(on){ ["wrap","dotnav"].forEach(function(id){ var el=document.getElementById(id); if(el) el.inert=on; }); var n=document.querySelector("nav"); if(n) n.inert=on; }
  function onKey(e){
    var top=stack[stack.length-1]; if(!top) return;
    if(e.key==="Escape"){ e.preventDefault(); top.close(); return; }
    if(e.key!=="Tab") return;
    var f=focusables(top.box); if(!f.length){ e.preventDefault(); return; }
    var first=f[0], last=f[f.length-1];
    if(e.shiftKey&&(document.activeElement===first||!top.box.contains(document.activeElement))){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey&&(document.activeElement===last||!top.box.contains(document.activeElement))){ e.preventDefault(); first.focus(); }
  }
  return {
    open:function(box,close,initial){ stack.push({box:box,close:close,opener:document.activeElement}); if(stack.length===1){ bg(true); document.addEventListener("keydown",onKey,true); }
      setTimeout(function(){ var t=initial||focusables(box)[0]||box; if(t&&t.focus) t.focus(); },30); },
    close:function(box){ var i=stack.map(function(x){return x.box;}).indexOf(box); if(i<0) return; var it=stack.splice(i,1)[0];
      if(!stack.length){ bg(false); document.removeEventListener("keydown",onKey,true); }
      if(it.opener&&it.opener.focus&&document.contains(it.opener)) it.opener.focus(); }
  };
})();

/* ---------- anti-framing: GitHub Pages can't send frame-ancestors, so refuse to render inside someone else's frame ---------- */
(function(){ try{ if(window.top!==window.self&&location.hostname==="salman2610.github.io"){ document.documentElement.style.display="none"; window.top.location=window.self.location; } }catch(e){ document.documentElement.style.display="none"; } })();

/* ---------- hero terminal: a real, typeable REPL ---------- */
(function(){
  var root=document.getElementById("heroTerminal"), el=document.getElementById("ttype"),
      out=document.getElementById("termOutput"), input=document.getElementById("termInput");
  if(!root||!el||!input) return;

  function line(text,cls){
    var d=document.createElement("div");
    if(cls) d.className=cls;
    d.textContent=text;
    out.appendChild(d);
    while(out.children.length>16) out.removeChild(out.firstChild);
    out.scrollTop=out.scrollHeight;
  }

  var CMDS={
    help:function(){ return "commands: help, whoami, projects, skills, contact, ls, sudo, clear"; },
    whoami:function(){ return "salmanul_faris — full-stack dev / security researcher, kozhikode"; },
    ls:function(){ return PROJECTS.map(function(p){ return p.t.toLowerCase().replace(/\s+/g,"-"); }).join("  "); },
    projects:function(){
      return PROJECTS.map(function(p,i){ return (i+1)+". "+p.t+" — "+p.tag; }).join("\n");
    },
    skills:function(){ return CAPS.map(function(c){ return c.n; }).join(", "); },
    contact:function(){ return "salmanulfariss642@gmail.com — or scroll to the bottom, I don't bite"; },
    date:function(){ return new Date().toString(); },
    clear:function(){ out.innerHTML=""; return null; },
    sudo:function(){ if(triggerSudoEgg) triggerSudoEgg(); return "permission granted."; }
  };

  function run(cmdRaw){
    var cmd=cmdRaw.trim();
    if(!cmd) return;
    line(cmd,"echo");
    var key=cmd.toLowerCase().split(/\s+/)[0];
    var fn=Object.prototype.hasOwnProperty.call(CMDS,key)?CMDS[key]:null;
    if(typeof fn!=="function"){ line("command not found: "+key.slice(0,40)+" — try 'help'"); return; }
    var res=fn();
    if(res) res.split("\n").forEach(function(l2){ line(l2); });
  }

  root.addEventListener("click",function(){ input.focus(); });
  input.addEventListener("focus",function(){ root.classList.add("focused"); });
  input.addEventListener("blur",function(){ root.classList.remove("focused"); });
  input.addEventListener("input",function(){ el.textContent=input.value; });
  input.addEventListener("keydown",function(e){
    if(e.key==="Enter"){ run(input.value); input.value=""; el.textContent=""; }
    else if(e.key.length===1||e.key==="Backspace") SFX.key();
  });

  /* a short auto-typed intro so it doesn't open on a blank prompt, then hands over control */
  var INTRO="whoami";
  if(reduced){ el.textContent=INTRO; return; }
  var ci=0;
  var iv=setInterval(function(){
    el.textContent=INTRO.slice(0,ci+1); ci++; SFX.key();
    if(ci>=INTRO.length){
      clearInterval(iv);
      setTimeout(function(){
        run(INTRO);
        el.textContent="";
        line("type 'help' to see what else this does");
      },500);
    }
  },70);
})();

/* ---------- text scramble / decode ---------- */
(function(){
  if(reduced) return;
  var CH="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&+=-";
  function scramble(el){
    var final=el.getAttribute("data-text")||el.textContent;
    if(!el.getAttribute("data-text")) el.setAttribute("data-text",final);
    if(el._scrIv) clearInterval(el._scrIv);
    var len=final.length, totalFrames=Math.min(40,Math.max(12,Math.round(len*0.9))), frame=0;
    el._scrIv=setInterval(function(){
      frame++;
      var out="";
      for(var i=0;i<len;i++){
        var ch=final[i];
        if(ch===" "){ out+=" "; continue; }
        var revealAt=(i/len)*totalFrames*0.7+totalFrames*0.3;
        out += frame>=revealAt ? ch : CH[(Math.random()*CH.length)|0];
      }
      el.textContent=out;
      if(frame>=totalFrames){ clearInterval(el._scrIv); el._scrIv=null; el.textContent=final; }
    },30);
  }
  document.querySelectorAll(".scr").forEach(function(el){
    var host=el.closest("a,button")||el;
    host.addEventListener("mouseenter",function(){ scramble(el); });
  });
})();

/* ---------- interactive dot field behind proof stats ---------- */
(function(){
  var wrap=document.querySelector(".proof"), cv=document.getElementById("proofGrid");
  if(!wrap||!cv) return;
  var g=cv.getContext("2d");
  if(!g) return;
  var dpr=Math.min(devicePixelRatio||1,1.5);
  var mx=-9999,my=-9999;
  function size(){ cv.width=Math.max(1,Math.floor(cv.clientWidth*dpr)); cv.height=Math.max(1,Math.floor(cv.clientHeight*dpr)); }
  addEventListener("resize",size);
  if(!coarse){
    wrap.addEventListener("mousemove",function(e){
      var r=wrap.getBoundingClientRect();
      mx=(e.clientX-r.left)*dpr; my=(e.clientY-r.top)*dpr;
    });
    wrap.addEventListener("mouseleave",function(){ mx=-9999; my=-9999; });
  }
  var t0=performance.now();
  function inView(){ var r=wrap.getBoundingClientRect(); return r.bottom>0 && r.top<innerHeight; }
  size();
  function draw(now){
    if(!reduced) requestAnimationFrame(draw);
    if(!inView()) return;
    g.clearRect(0,0,cv.width,cv.height);
    var t=(now-t0)/1000, gap=34*dpr, R=170*dpr;
    for(var y=gap*0.5;y<cv.height;y+=gap){
      for(var x=gap*0.5;x<cv.width;x+=gap){
        var dx=x-mx, dy=y-my, dist=Math.sqrt(dx*dx+dy*dy);
        var push=Math.max(0,1-dist/R);
        var ang=Math.atan2(dy,dx);
        var off=push*22*dpr;
        var px=x+Math.cos(ang)*off, py=y+Math.sin(ang)*off+Math.sin(t*0.6+x*0.01+y*0.013)*1.4*dpr;
        var rad=1.1*dpr+push*2.2*dpr;
        g.beginPath();
        g.arc(px,py,rad,0,6.283);
        g.fillStyle = push>0.05 ? "rgba(63,216,224,"+(0.16+push*0.6).toFixed(3)+")" : "rgba(244,242,238,0.09)";
        g.fill();
      }
    }
  }
  if(reduced){ size(); } else { requestAnimationFrame(draw); }
})();

/* thinking orb — rotating depth-shaded particle sphere beside capabilities */
(function(){
  var cv=document.getElementById("capCanvas");
  if(!cv) return;
  var g=cv.getContext("2d");
  var W=cv.width,H=cv.height, wrapEl=document.querySelector(".caps-visual");
  var cx=W/2, cy=H/2, R=Math.min(W,H)*0.4;

  /* even coverage of a sphere via the golden-angle (Fibonacci) method */
  var N=110, pts=[];
  var GA=Math.PI*(3-Math.sqrt(5));
  for(var i=0;i<N;i++){
    var yv=1-(i/(N-1))*2;
    var rad=Math.sqrt(Math.max(0,1-yv*yv));
    var th=GA*i;
    pts.push({x:Math.cos(th)*rad, y:yv, z:Math.sin(th)*rad});
  }

  var t0=performance.now();
  function inView(){
    if(!wrapEl) return true;
    var r=wrapEl.getBoundingClientRect();
    return r.bottom>0 && r.top<innerHeight;
  }
  function frame(now){
    if(!reduced) requestAnimationFrame(frame);
    if(!inView()) return;
    var t=(now-t0)/1000;
    capCur[0]=capCur[0].map(function(v,k){return v+(capTarget[0][k]-v)*0.045;});
    capCur[1]=capCur[1].map(function(v,k){return v+(capTarget[1][k]-v)*0.045;});
    var col=capCur[0];
    var ay=t*0.35, ax=Math.sin(t*0.22)*0.5;
    var cosY=Math.cos(ay),sinY=Math.sin(ay), cosX=Math.cos(ax),sinX=Math.sin(ax);

    var rotated=pts.map(function(p){
      var x1=p.x*cosY-p.z*sinY, z1=p.x*sinY+p.z*cosY;
      var y2=p.y*cosX-z1*sinX, z2=p.y*sinX+z1*cosX;
      return {x:x1,y:y2,z:z2};
    });
    rotated.sort(function(a,b){ return a.z-b.z; });

    g.clearRect(0,0,W,H);
    rotated.forEach(function(p){
      var depth=(p.z+1)/2;
      var size=1.1+depth*2.6;
      var alpha=0.18+depth*0.82;
      var px=cx+p.x*R, py=cy+p.y*R;
      g.beginPath(); g.arc(px,py,size,0,6.283);
      g.fillStyle="rgba("+Math.round(col[0]*255)+","+Math.round(col[1]*255)+","+Math.round(col[2]*255)+","+alpha.toFixed(3)+")";
      g.fill();
    });
  }
  requestAnimationFrame(frame);
})();

/* ---------- journal hover preview ---------- */
(function(){
  var journalEl=document.querySelector(".journal"), rows=document.querySelectorAll(".jrow");
  var prev=document.getElementById("jPreview"), img=document.getElementById("jPreviewImg");
  if(!journalEl||!prev||reduced||coarse) return;
  var NOTE_ART=[ART[2],ART[4],ART[5]];
  var NOTE_POS=["50% 40%","50% 50%","50% 45%"];
  journalEl.addEventListener("mousemove",function(e){
    var r=journalEl.getBoundingClientRect();
    prev.style.left=(e.clientX-r.left)+"px";
    prev.style.top=(e.clientY-r.top)+"px";
  });
  rows.forEach(function(row,i){
    row.addEventListener("mouseenter",function(){ img.src=NOTE_ART[i]||""; img.style.objectPosition=NOTE_POS[i]||"50% 50%"; prev.classList.add("on"); });
    row.addEventListener("mouseleave",function(){ prev.classList.remove("on"); });
  });
})();

/* ---------- manifesto words ---------- */
var mcopy=document.getElementById("manifesto-copy");
mcopy.innerHTML=mcopy.textContent.trim().split(/\s+/).map(function(w){return "<w>"+w+"</w>";}).join(" ");
var wordEls=mcopy.querySelectorAll("w");

/* ---------- magnetic ---------- */
document.querySelectorAll(".magnet").forEach(function(el){
  el.addEventListener("mousemove",function(e){
    if(reduced) return;
    var r=el.getBoundingClientRect();
    el.style.transform="translate("+((e.clientX-(r.left+r.width/2))*0.18)+"px,"+((e.clientY-(r.top+r.height/2))*0.22)+"px)";
  });
  el.addEventListener("mouseleave",function(){el.style.transform="";});
});

/* ---------- scroll rig ---------- */
var wrap=document.getElementById("wrap"), spacer=document.getElementById("spacer");
var workSec=document.getElementById("work"), pin=workSec.querySelector(".work-pin");
var target=0,current=0,vel=0,trackLen=0,workTop=0,workLen=0,stripX=0,frameN=0;
var procSec=document.getElementById("process"), procPin=document.getElementById("procPin");
var storySec=document.getElementById("attack-story"), storyPin=document.getElementById("storyPin");
var storyLineEls=storyPin?Array.prototype.slice.call(storyPin.querySelectorAll(".story-line")):[];
var storyNumEl=document.getElementById("storyNum"), storyBarEl=document.getElementById("storyBar");
var storyTop=0, storyLen=0, storyActive=-1, storyWithin=0, storyDroneActive=false;
var totalScrollLen=1;
var STORY_NUMS=["","","01 — RECON","02 — ENUMERATION","03 — DISCOVERY","04 — EXPLOITATION","05 — REMEDIATION",""];
var bgList=document.getElementById("bgList"), bgFill=document.getElementById("bgFill");
var bgRows=bgList?Array.prototype.slice.call(bgList.querySelectorAll(".bgrow")):[];
if("IntersectionObserver" in window && bgRows.length){
  var bgIo=new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting) en.target.classList.add("in"); });
  },{threshold:0.25});
  bgRows.forEach(function(r){ bgIo.observe(r); });
} else {
  bgRows.forEach(function(r){ r.classList.add("in"); });
}

var markEl=document.querySelector("nav .mark");
if(markEl){ markEl.addEventListener("click",function(){ markEl.classList.remove("pulse"); void markEl.offsetWidth; markEl.classList.add("pulse"); setTimeout(function(){ markEl.classList.remove("pulse"); },1100); }); }
var navEl=document.querySelector("nav"), lightEls=Array.prototype.slice.call(document.querySelectorAll(".paper,.work,.as-sec"));
var dotEls=Array.prototype.slice.call(document.querySelectorAll(".dotnav a"));
dotEls.forEach(function(a){ a.setAttribute("aria-label",(a.getAttribute("data-label")||"Section")+" section"); });
var dotTargets=dotEls.map(function(a){ return document.querySelector(a.getAttribute("href")); });
var procStageEls=procPin?Array.prototype.slice.call(procPin.querySelectorAll(".proc-stage")):[];
var procDashEls=procPin?Array.prototype.slice.call(procPin.querySelectorAll(".proc-dashes i")):[];
var procBigNum=document.getElementById("procBigNum");
var procTop=0, procLen=0, procActive=-1;

/* absolute document position, correct whatever the offsetParent chain looks like */
function absTop(e){ var y=0; while(e){ y+=e.offsetTop; e=e.offsetParent; } return y; }

function measure(){
  var vw=innerWidth,vh=innerHeight;
  if(procSec&&procStageEls.length){
    procLen=vh*procStageEls.length*0.85;
    procSec.style.height=(vh+procLen)+"px";
  }
  if(storySec&&storyLineEls.length){
    storyLen=vh*storyLineEls.length*0.72;
    storySec.style.height=(vh+storyLen)+"px";
  }
  trackLen=Math.max(0,track.scrollWidth-vw);
  workSec.style.height=(vh+trackLen)+"px";
  if(procSec) procTop=absTop(procSec);
  if(storySec) storyTop=absTop(storySec);
  workTop=absTop(workSec);
  workLen=workSec.offsetHeight-vh;
  spacer.style.height=wrap.scrollHeight+"px";
  totalScrollLen=Math.max(1,wrap.scrollHeight-vh);
  if(window.__layoutText) window.__layoutText();
}
addEventListener("resize",measure);
addEventListener("load",measure);
measure();
addEventListener("keydown",function(e){
  if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey) return;
  var t=e.target, tn=t&&t.tagName;
  if(tn==="INPUT"||tn==="TEXTAREA"||tn==="SELECT"||tn==="BUTTON"||tn==="A"||(t&&t.isContentEditable)||(t&&t.getAttribute&&/^(slider|listbox|combobox|tab|menu)/.test(t.getAttribute("role")||""))) return;
  if(document.body.classList.contains("locked")) return;
  if(e.key==="ArrowRight")scrollBy(0,innerHeight*0.5);
  if(e.key==="ArrowLeft")scrollBy(0,-innerHeight*0.5);
});

function loop(){
  target=scrollY;
  var prev=current;
  var dl=Math.abs(target-current); current+=(target-current)*(reduced?1:(dl>innerHeight*1.5?0.4:(dl>innerHeight*0.6?0.2:0.085)));
  if(Math.abs(target-current)<0.03)current=target;
  vel=current-prev;
  wrap.style.transform="translate3d(0,"+(-current.toFixed(2))+"px,0)";
  if(!reduced){
    var blurAmt=Math.min(0.9,Math.max(0,Math.abs(vel)*0.045));
    wrap.style.filter=blurAmt>0.15?"blur("+blurAmt.toFixed(2)+"px)":"";
  }

  var off=Math.min(Math.max(current-workTop,0),workLen);
  pin.style.transform="translate3d(0,"+off.toFixed(2)+"px,0)";
  var p=workLen>0?off/workLen:0;
  track.style.transform="translate3d("+(-(p*trackLen)).toFixed(2)+"px,0,0)";

  var sk=Math.max(-7,Math.min(7,vel*0.12));
  for(var i=0;i<track.children.length;i++){
    track.children[i].style.transform=reduced?"":"skewY("+(sk*0.35).toFixed(2)+"deg) scaleY("+(1-Math.abs(sk)*0.004).toFixed(4)+")";
  }

  stripX=(stripX-0.6-Math.abs(vel)*0.08)%(strip.scrollWidth/4||1);
  strip.style.transform="translate3d("+stripX.toFixed(2)+"px,0,0)";

  var mr=mcopy.getBoundingClientRect();
  var mp=Math.max(0,Math.min(1,1-(mr.top-innerHeight*0.25)/(innerHeight*0.55)));
  var shown=Math.floor(mp*(wordEls.length+3));
  for(var j=0;j<wordEls.length;j++){
    var on=j<shown;
    if(on!==wordEls[j]._on){wordEls[j].classList.toggle("on",on);wordEls[j]._on=on;}
  }

  if(procPin&&procLen>0){
    var poff=Math.min(Math.max(current-procTop,0),procLen);
    procPin.style.transform="translate3d(0,"+poff.toFixed(2)+"px,0)";
    var pFrac=poff/procLen;
    var raw=pFrac*procStageEls.length;
    var activeIdx=Math.min(procStageEls.length-1,Math.floor(raw));
    if(activeIdx!==procActive){
      if(procBigNum) procBigNum.textContent=String(activeIdx+1).padStart(2,"0");
      procActive=activeIdx;
    }
    var within=Math.max(0,Math.min(1,raw-activeIdx));

    /* continuous 3D carousel: each stage rotates in from behind/below, */
    /* sits upright at its active moment, then flips away as the next one arrives */
    for(var qi=0;qi<procStageEls.length;qi++){
      var diff=qi-raw;
      var ad=Math.abs(diff);
      var pel=procStageEls[qi];
      pel.classList.toggle("on",ad<0.5);
      if(reduced){
        pel.style.opacity=ad<0.5?"1":"0";
        pel.style.transform="";
        continue;
      }
      var rotX=Math.max(-62,Math.min(62,diff*-48));
      var tz=-ad*130;
      var ty=diff*22;
      var op=Math.max(0,Math.min(1,1-Math.max(0,ad-0.28)*2.9));
      if(op<=0.002){ pel.style.opacity="0"; continue; }
      pel.style.opacity=op.toFixed(3);
      pel.style.transform="perspective(1100px) rotateX("+rotX.toFixed(2)+"deg) translateY("+ty.toFixed(1)+"px) translateZ("+tz.toFixed(1)+"px)";
    }
    if(procBigNum && !reduced){
      procBigNum.style.transform="perspective(900px) rotateY("+((within-0.5)*10).toFixed(2)+"deg)";
    }

    for(var di=0;di<procDashEls.length;di++){
      var de=procDashEls[di];
      de.classList.toggle("done",di<activeIdx);
      de.classList.toggle("active",di===activeIdx);
      if(di===activeIdx) de.style.setProperty("--p",within.toFixed(3));
    }
  }

  if(storyPin&&storyLen>0){
    var soff=Math.min(Math.max(current-storyTop,0),storyLen);
    storyPin.style.transform="translate3d(0,"+soff.toFixed(2)+"px,0)";
    var sFrac=soff/storyLen;
    storyBarEl.style.width=(sFrac*100).toFixed(2)+"%";
    var sRaw=sFrac*storyLineEls.length;
    var sIdx=Math.min(storyLineEls.length-1,Math.floor(sRaw));
    storyWithin=Math.max(0,Math.min(1,sRaw-sIdx));
    if(sIdx!==storyActive){
      storyNumEl.textContent=STORY_NUMS[sIdx]||"";
      storyActive=sIdx;
    }

    /* same continuous 3D carousel language as the process section */
    for(var sqi=0;sqi<storyLineEls.length;sqi++){
      var sdiff=sqi-sRaw;
      var sad=Math.abs(sdiff); if(sqi===storyLineEls.length-1&&sdiff<0){ sdiff=0; sad=0; }
      var sel=storyLineEls[sqi];
      sel.classList.toggle("on",sad<0.5);
      if(reduced){
        sel.style.opacity=sad<0.5?"1":"0";
        sel.style.transform="";
        continue;
      }
      if(sad>1.05){ sel.style.opacity="0"; continue; }
      var srotX=Math.max(-58,Math.min(58,sdiff*-52));
      var stz=-sad*110;
      var sop=Math.max(0,Math.min(1,1-Math.max(0,sad-0.2)*4));
      sel.style.opacity=sop.toFixed(3);
      sel.style.transform="perspective(1200px) rotateX("+srotX.toFixed(2)+"deg) translateZ("+stz.toFixed(1)+"px) scale("+(1-sad*0.08).toFixed(3)+")";
    }

    /* ambient tension drone: rises through recon→exploitation, resolves at remediation */
    if(!storyDroneActive){ SFX.droneEnter(); storyDroneActive=true; }
    var tension=sIdx>=6 ? Math.max(0,1-storyWithin) : Math.min(1,sRaw/5);
    SFX.droneUpdate(tension);
  } else if(storyDroneActive){
    SFX.droneExit();
    storyDroneActive=false;
  }

  /* secondary scroll-linked reads: throttled to every other frame — */
  /* imperceptible for slow scroll-progress UI, meaningfully cuts forced-layout reads */
  frameN++;
  if(frameN%2===0){
    if(bgList){
      var bgr=bgList.getBoundingClientRect();
      var bgP=Math.max(0,Math.min(1,(innerHeight*0.7-bgr.top)/(bgr.height+innerHeight*0.3)));
      bgFill.style.height=(bgP*100).toFixed(2)+"%";
      var bgActive=Math.round(bgP*bgRows.length);
      for(var bi=0;bi<bgRows.length;bi++){
        var bon=bi<bgActive;
        if(bon!==bgRows[bi]._on){ bgRows[bi].classList.toggle("on",bon); bgRows[bi]._on=bon; }
      }
    }

    if(spotEl&&!reduced){
      var sr=spotEl.getBoundingClientRect();
      var sc=Math.max(0,Math.min(1,1-Math.abs(sr.top+sr.height/2-innerHeight/2)/(innerHeight/2+sr.height/2)));
      var spotP=(sr.top+sr.height/2-innerHeight/2)/(innerHeight/2+sr.height/2);
      spotBg.style.transform="rotate("+(spotP*-14).toFixed(2)+"deg) scale("+(1.02+(1-sc)*0.1).toFixed(3)+")";
      spotInner.style.transform="translateY("+((1-sc)*38).toFixed(1)+"px)";
      spotInner.style.opacity=(0.3+0.7*sc).toFixed(3);
    }

    if(navEl){
      var lightNow=false;
      for(var li=0;li<lightEls.length;li++){ var lr=lightEls[li].getBoundingClientRect(); if(lr.top<=-70&&lr.bottom>110){ lightNow=true; break; } }
      if(lightNow!==navEl._light){ navEl.classList.toggle("on-light",lightNow); navEl._light=lightNow; }
    }

    if(dotEls.length){
      var mid=innerHeight*0.5, activeD=-1;
      for(var dti=0;dti<dotTargets.length;dti++){
        var te=dotTargets[dti]; if(!te) continue;
        if(te.getBoundingClientRect().top<=mid) activeD=dti;
      }
      for(var dj=0;dj<dotEls.length;dj++){ dotEls[dj].classList.toggle("on",dj===activeD); if(dj===activeD) dotEls[dj].setAttribute("aria-current","true"); else dotEls[dj].removeAttribute("aria-current"); }
    }
  }

  rx+=(mx-rx)*0.16; ry+=(my-ry)*0.16;
  ring.style.transform="translate("+rx.toFixed(1)+"px,"+ry.toFixed(1)+"px)";

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);


/* ================= WebGL page transition ================= */
var runTransition=(function(){
  var cv=document.getElementById("trans");
  var gl=cv.getContext("webgl",{alpha:true,premultipliedAlpha:false});
  if(!gl||reduced) return null;

  var fs=[
  "precision highp float;",
  "uniform vec2 uRes; uniform float uP; uniform float uDir;",
  "float hash(vec2 p){return fract(sin(dot(p,vec2(27.16,38.91)))*43758.5453);}",
  "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
  " return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}",
  "vec3 irid(float f){return 0.5+0.5*cos(6.28318*(vec3(0.0,0.33,0.67)+f*1.6+0.2));}",
  "void main(){",
  " vec2 uv=gl_FragCoord.xy/uRes;",
  " float y=mix(uv.y,1.0-uv.y,uDir);",
  " float n=noise(uv*vec2(5.0,3.0))*0.30+noise(uv*14.0)*0.08+y*0.64;",
  " float th=uP*1.45-0.22;",
  " float m=smoothstep(th,th+0.10,n);",
  " float rim=smoothstep(th,th+0.10,n)*smoothstep(th+0.19,th+0.03,n);",
  " vec3 col=mix(vec3(0.063,0.047,0.110),irid(n),rim*0.95);",
  " gl_FragColor=vec4(col,1.0-m);",
  "}"].join("\n");

  function mk(t,s){var x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);
    if(!gl.getShaderParameter(x,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(x));return null;}return x;}
  var pr=gl.createProgram(),v=mk(gl.VERTEX_SHADER,"attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"),f=mk(gl.FRAGMENT_SHADER,fs);
  if(!v||!f) return null;
  gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);gl.useProgram(pr);
  var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var l=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
  var uRes=gl.getUniformLocation(pr,"uRes"),uP=gl.getUniformLocation(pr,"uP"),uDir=gl.getUniformLocation(pr,"uDir");
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0,0,0,0);

  var dpr=Math.min(devicePixelRatio||1,1.5), busy=false;
  function size(){cv.width=Math.floor(innerWidth*dpr);cv.height=Math.floor(innerHeight*dpr);gl.viewport(0,0,cv.width,cv.height);}
  addEventListener("resize",size);

  function draw(p,dir){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes,cv.width,cv.height);
    gl.uniform1f(uP,p); gl.uniform1f(uDir,dir);
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
  function phase(dir,from,to,ms){
    return new Promise(function(res){
      var t0=performance.now();
      (function step(now){
        var k=Math.min(1,(now-t0)/ms);
        var e=k<0.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
        draw(from+(to-from)*e,dir);
        if(k<1) requestAnimationFrame(step); else res();
      })(t0);
    });
  }
  return function(mid){
    if(busy) return; busy=true;
    size(); cv.classList.add("on");
    phase(0,0,1,620).then(function(){
      mid();
      return new Promise(function(r){setTimeout(r,120);});
    }).then(function(){
      return phase(1,1,0,700);
    }).then(function(){
      cv.classList.remove("on"); busy=false;
    });
  };
})();

/* in-page navigation goes through the transition */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener("click",function(e){
    var el=document.querySelector(a.getAttribute("href"));
    if(!el) return;
    e.preventDefault();
    var y=absTop(el);
    if(runTransition){
      runTransition(function(){ scrollTo({top:y,behavior:"auto"}); current=y; });
    } else {
      scrollTo({top:y,behavior:reduced?"auto":"smooth"});
    }
  });
});

/* ================= proof counters (odometer digit-flip) ================= */
(function(){
  var nums=document.querySelectorAll(".stat .num");
  if(!nums.length) return;
  function animate(el){
    var tgt=parseInt(el.getAttribute("data-target"),10)||0;
    var suf=el.getAttribute("data-suffix")||"";
    if(reduced){ el.textContent=tgt+suf; return; }
    var str=String(tgt);
    el.innerHTML="";
    el.classList.add("odometer");
    for(var i=0;i<str.length;i++){
      (function(digit,idx){
        var col=document.createElement("span"); col.className="od-col";
        var strip=document.createElement("span"); strip.className="od-strip";
        strip.innerHTML="0123456789".split("").map(function(c){ return "<i>"+c+"</i>"; }).join("");
        col.appendChild(strip); el.appendChild(col);
        setTimeout(function(){ strip.style.transform="translateY(-"+(digit*10)+"%)"; }, idx*130);
      })(parseInt(str[i],10), i);
    }
    if(suf){ var sfx=document.createElement("span"); sfx.className="od-suffix"; sfx.textContent=suf; el.appendChild(sfx); }
  }
  if("IntersectionObserver" in window){
    var seen=new WeakSet();
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting && !seen.has(en.target)){ seen.add(en.target); animate(en.target); }
      });
    },{threshold:0.45});
    nums.forEach(function(n){ io.observe(n); });
  } else {
    nums.forEach(animate);
  }
})();

/* ================= contact background ================= */
(function(){
  var cv=document.getElementById("contactBg");
  if(!cv) return;
  var g=cv.getContext("2d");
  if(!g) return;
  var dpr=Math.min(devicePixelRatio||1,1.25);
  function size(){
    cv.width=Math.max(1,Math.floor(cv.clientWidth*dpr));
    cv.height=Math.max(1,Math.floor(cv.clientHeight*dpr));
  }
  addEventListener("resize",size);
  var blobs=[
    {x:.22,y:.28,r:.5,c:"124,107,255"},
    {x:.78,y:.5,r:.46,c:"63,216,224"},
    {x:.48,y:.88,r:.42,c:"255,122,77"}
  ];
  var t0=performance.now();
  var contactWrap=document.querySelector(".contact");
  function inView(){ if(!contactWrap) return true; var r=contactWrap.getBoundingClientRect(); return r.bottom>0 && r.top<innerHeight; }
  size();
  function draw(now){
    if(!reduced) requestAnimationFrame(draw);
    if(!inView()) return;
    g.clearRect(0,0,cv.width,cv.height);
    var t=(now-t0)/1000;
    blobs.forEach(function(b,i){
      var x=(b.x+Math.sin(t*0.14+i*2.1)*0.06)*cv.width;
      var y=(b.y+Math.cos(t*0.11+i*1.6)*0.06)*cv.height;
      var r=b.r*Math.max(cv.width,cv.height);
      var grad=g.createRadialGradient(x,y,0,x,y,r);
      grad.addColorStop(0,"rgba("+b.c+",.55)");
      grad.addColorStop(1,"rgba("+b.c+",0)");
      g.fillStyle=grad;
      g.fillRect(0,0,cv.width,cv.height);
    });
  }
  if(reduced){ draw(t0); } else { requestAnimationFrame(draw); }
})();

setTimeout(measure,800);
setTimeout(measure,2500);

/* ---------- drag-to-scrub the work gallery ---------- */
(function(){
  var pinEl=document.querySelector(".work-pin");
  if(!pinEl||coarse) return;
  var dragging=false, moved=false, startX=0, startScroll=0, pid=0;
  pinEl.addEventListener("pointerdown",function(e){
    if(e.button!==undefined && e.button!==0) return;
    dragging=true; moved=false; startX=e.clientX; startScroll=window.scrollY; pid=e.pointerId;
  });
  pinEl.addEventListener("pointermove",function(e){
    if(!dragging) return;
    var dx=e.clientX-startX;
    if(!moved && Math.abs(dx)>6){ moved=true; try{ pinEl.setPointerCapture(pid); }catch(err){} pinEl.classList.add("dragging"); }
    if(moved) window.scrollTo(0, Math.max(0, startScroll - dx*2.4));
  });
  function endDrag(e){
    if(!dragging) return;
    dragging=false;
    pinEl.classList.remove("dragging");
    if(moved){
      var suppress=function(ev){ ev.preventDefault(); ev.stopPropagation(); };
      pinEl.addEventListener("click",suppress,{capture:true,once:true});
    }
  }
  pinEl.addEventListener("pointerup",endDrag);
  pinEl.addEventListener("pointercancel",endDrag);
})();

/* ---------- command palette ---------- */
(function(){
  var badge=document.getElementById("cmdkTrigger"), root=document.getElementById("cmdk"),
      backdrop=document.getElementById("cmdkBackdrop"), input=document.getElementById("cmdkInput"),
      list=document.getElementById("cmdkList");
  if(!root) return;

  function jumpTo(hash){
    var el=document.querySelector(hash); if(!el) return;
    var y=absTop(el);
    if(typeof runTransition==="function"){ runTransition(function(){ scrollTo({top:y,behavior:"auto"}); current=y; }); }
    else scrollTo({top:y,behavior:reduced?"auto":"smooth"});
  }
  function openLink(url){ window.open(url,"_blank","noopener,noreferrer"); }

  var CMDS=[
    {label:"Go to top",                  k:"Section", run:function(){ jumpTo("#top"); }},
    {label:"The Attack (story)",         k:"Section", run:function(){ jumpTo("#attack-story"); }},
    {label:"Selected work",              k:"Section", run:function(){ jumpTo("#work"); }},
    {label:"How I work",                 k:"Section", run:function(){ jumpTo("#process"); }},
    {label:"Capabilities",               k:"Section", run:function(){ jumpTo("#capabilities"); }},
    {label:"Attack surface",             k:"Section", run:function(){ jumpTo("#attack-surface"); }},
    {label:"Toolkit",                    k:"Section", run:function(){ jumpTo("#toolkit"); }},
    {label:"Background",                 k:"Section", run:function(){ jumpTo("#background"); }},
    {label:"Certifications",              k:"Section", run:function(){ jumpTo("#certifications"); }},
    {label:"Notes",                      k:"Section", run:function(){ jumpTo("#notes"); }},
    {label:"Get in touch",               k:"Section", run:function(){ jumpTo("#contact"); }},
    {label:"View GitHub",                k:"Link",    run:function(){ openLink("https://github.com/salman2610"); }},
    {label:"View LinkedIn",              k:"Link",    run:function(){ openLink("https://www.linkedin.com/in/p-salmanul-faris-68b733249/"); }},
    {label:"Download résumé",            k:"Link",    run:function(){ openLink("https://salman2610.github.io/Salmanul_Faris_Cybersecurity_Resume%20.pdf"); }},
    {label:"View redacted VAPT report",  k:"Link",    run:function(){ openLink("https://salman2610.github.io/Redacted%20Report.pdf"); }},
    {label:"Read Medium write-ups",      k:"Link",    run:function(){ openLink("https://medium.com/@salmanulfariss642"); }},
    {label:"Send an email",              k:"Action",  run:function(){ window.location.href="mailto:salmanulfariss642@gmail.com"; }}
  ];
  PROJECTS.forEach(function(p,pi){
    CMDS.push({label:"Project: "+p.t, k:"Project", run:function(){ if(openProject) openProject(pi); }});
    if(p.cs) CMDS.push({label:"Case study: "+p.t, k:"Page", run:function(){ window.location.href=p.cs; }});
  });

  var filtered=CMDS.slice(), activeIdx=0;

  function render(){
    if(!filtered.length){ list.innerHTML='<div class="cmdk-empty">No matches</div>'; return; }
    list.innerHTML=filtered.map(function(c,i){
      return '<div class="cmdk-item'+(i===activeIdx?" active":"")+'" data-i="'+i+'"><span>'+c.label+'</span><span class="k">'+c.k+'</span></div>';
    }).join("");
    var activeEl=list.querySelector(".cmdk-item.active");
    if(activeEl) activeEl.scrollIntoView({block:"nearest"});
  }
  function filter(){
    var q=input.value.trim().toLowerCase();
    filtered=!q ? CMDS.slice() : CMDS.filter(function(c){ return c.label.toLowerCase().indexOf(q)>-1; });
    activeIdx=0;
    render();
  }
  var box=root.querySelector(".cmdk-box");
  function open(){
    root.classList.add("open"); root.setAttribute("aria-hidden","false");
    input.value=""; filter();
    document.body.classList.add("locked");
    dlg.open(box,close,input);
  }
  function close(){
    if(!root.classList.contains("open")) return;
    root.classList.remove("open"); root.setAttribute("aria-hidden","true");
    document.body.classList.remove("locked");
    dlg.close(box);
  }
  function choose(i){
    var c=filtered[i]; if(!c) return;
    close(); c.run();
  }

  if(badge) badge.addEventListener("click",open);
  backdrop.addEventListener("click",close);
  input.addEventListener("input",filter);
  list.addEventListener("click",function(e){
    var it=e.target.closest(".cmdk-item"); if(!it) return;
    choose(parseInt(it.getAttribute("data-i"),10));
  });
  input.addEventListener("keydown",function(e){
    if(e.key==="ArrowDown"){ e.preventDefault(); activeIdx=Math.min(filtered.length-1,activeIdx+1); render(); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); activeIdx=Math.max(0,activeIdx-1); render(); }
    else if(e.key==="Enter"){ e.preventDefault(); choose(activeIdx); }
    else if(e.key==="Escape"){ close(); }
  });
  document.addEventListener("keydown",function(e){
    var mod=e.metaKey||e.ctrlKey;
    if(mod&&(e.key==="k"||e.key==="K")){ e.preventDefault(); root.classList.contains("open")?close():open(); }
    else if(e.key==="Escape"&&root.classList.contains("open")){ close(); }
  });
})();

/* ---------- click ripple ---------- */
(function(){
  if(reduced) return;
  var layer=document.createElement("div");
  layer.id="rippleLayer";
  layer.style.cssText="position:fixed;inset:0;z-index:250;pointer-events:none;overflow:hidden";
  document.body.appendChild(layer);
  document.addEventListener("click",function(e){
    var r=document.createElement("span");
    r.className="click-ripple";
    r.style.left=e.clientX+"px";
    r.style.top=e.clientY+"px";
    layer.appendChild(r);
    r.addEventListener("animationend",function(){ r.remove(); });
  });
})();

/* ---------- idle hint ---------- */
(function(){
  if(reduced) return;
  var badge=document.getElementById("cmdkTrigger");
  if(!badge || !badge.parentNode) return;
  var hint=document.createElement("div");
  hint.className="idle-hint";
  hint.textContent="psst — try ⌘K";
  badge.parentNode.insertBefore(hint,badge);
  var timer=null;
  function reset(){
    hint.classList.remove("on");
    clearTimeout(timer);
    timer=setTimeout(function(){ hint.classList.add("on"); },20000);
  }
  ["mousemove","scroll","keydown","touchstart","click"].forEach(function(ev){
    addEventListener(ev,reset,{passive:true});
  });
  reset();
})();

/* ---------- tab-away title swap ---------- */
(function(){
  var orig=document.title;
  document.addEventListener("visibilitychange",function(){
    document.title = document.hidden ? "👀 come back..." : orig;
  });
})();

/* ---------- project detail modal ---------- */
var openProject=null;
(function(){
  var modal=document.getElementById("projModal"), backdrop=document.getElementById("projBackdrop"),
      closeBtn=document.getElementById("projClose"), img=document.getElementById("projImg"),
      tag=document.getElementById("projTag"), title=document.getElementById("projTitle"),
      desc=document.getElementById("projDesc"), links=document.getElementById("projLinks"), plogo=document.getElementById("projLogo");
  if(!modal) return;
  var pbox=modal.querySelector(".proj-box");
  function close(){ if(!modal.classList.contains("open")) return; modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.classList.remove("locked"); dlg.close(pbox); }
  function open(i){
    var p=PROJECTS[i]; if(!p) return;
    img.src=ART[i]||""; if(p.logo){ plogo.src=p.logo; plogo.hidden=false; } else { plogo.hidden=true; } tag.textContent=p.y+" · "+p.tag; title.textContent=p.t; desc.textContent=p.desc||"";
    var ls="";
    if(p.cs){ ls+='<a class="cs" href="'+p.cs+'">Read case study</a>'; }
    if(p.github){ ls+='<a href="'+p.github+'" target="_blank" rel="noopener noreferrer">View on GitHub</a>'; }
    ls+='<a href="'+p.url+'" target="_blank" rel="noopener noreferrer">'+(p.github&&p.url!==p.github?"View live":"View repo")+'</a>';
    links.innerHTML=ls;
    modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("locked"); dlg.open(pbox,close,closeBtn);
  }
  backdrop.addEventListener("click",close);
  closeBtn.addEventListener("click",close);
  document.addEventListener("keydown",function(e){ if(e.key==="Escape"&&modal.classList.contains("open")) close(); });
  openProject=open;
})();

/* ---------- easter egg: type "sudo" → matrix rain ---------- */
var triggerSudoEgg=null;
(function(){
  var buf="", running=false;

  function runMatrixRain(canvas, durationMs, onDone){
    var ctx=canvas.getContext("2d");
    var dpr=Math.min(devicePixelRatio||1,1.4);
    var fontSize=15*dpr, cols, drops;
    function size(){
      canvas.width=Math.floor(innerWidth*dpr);
      canvas.height=Math.floor(innerHeight*dpr);
      cols=Math.max(1,Math.floor(canvas.width/fontSize));
      drops=new Array(cols).fill(0).map(function(){ return Math.random()*-40; });
    }
    size();
    var CHARS="アイウエオカキクケコサシスセソタチツテトナニヌネノ01デ";
    var start=performance.now(), raf=null, stopped=false;
    ctx.fillStyle="#000"; ctx.fillRect(0,0,canvas.width,canvas.height);
    function draw(now){
      if(stopped) return;
      ctx.fillStyle="rgba(0,0,0,.09)";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.font=fontSize+"px ui-monospace,monospace";
      ctx.textBaseline="top";
      for(var i=0;i<cols;i++){
        var ch=CHARS[(Math.random()*CHARS.length)|0];
        var y=drops[i]*fontSize;
        ctx.fillStyle = Math.random()>0.94 ? "#c9ffdf" : "#3fd88f";
        ctx.fillText(ch, i*fontSize, y);
        drops[i]+= (Math.random()*0.5+0.55);
        if(y>canvas.height && Math.random()>0.975) drops[i]=Math.random()*-20;
      }
      if(now-start<durationMs){ raf=requestAnimationFrame(draw); }
      else if(onDone){ onDone(); }
    }
    raf=requestAnimationFrame(draw);
    var resizeH=function(){ size(); };
    addEventListener("resize",resizeH);
    return function stop(){ stopped=true; if(raf) cancelAnimationFrame(raf); removeEventListener("resize",resizeH); };
  }

  function trigger(){
    if(running) return;
    running=true;
    var el=document.createElement("div");
    el.className="egg-flash";
    el.innerHTML='<canvas class="matrix-canvas"></canvas><div class="egg-content"><span class="egg-title">ACCESS GRANTED</span><span class="egg-sub">welcome, root. you didn\'t need sudo — it was already your site.</span></div>';
    document.body.appendChild(el);
    var cv=el.querySelector(".matrix-canvas");
    requestAnimationFrame(function(){ el.classList.add("on"); });

    if(reduced){
      setTimeout(function(){ el.classList.add("text-on"); SFX.chime(); },80);
      setTimeout(finish,1800);
      return;
    }
    var stopRain=runMatrixRain(cv, 2400, null);
    setTimeout(function(){ el.classList.add("text-on"); SFX.chime(); },900);
    setTimeout(function(){ stopRain(); finish(); },2400);

    function finish(){
      el.classList.remove("on");
      el.classList.remove("text-on");
      setTimeout(function(){ el.remove(); running=false; },500);
    }
  }

  triggerSudoEgg=trigger;
  document.addEventListener("keydown",function(e){
    var ae=document.activeElement;
    if(ae && (ae.tagName==="INPUT" || ae.tagName==="TEXTAREA")) return;
    if(e.metaKey||e.ctrlKey||e.altKey||e.key.length>1) return;
    buf=(buf+e.key).slice(-4).toLowerCase();
    if(buf==="sudo"){ buf=""; trigger(); }
  });
})();

/* ---------- contact: aurora headline light + dotted globe ---------- */
(function(){
  var ct=document.getElementById("contact"), h=document.querySelector(".contact-headline");
  if(ct&&h&&!reduced&&!coarse) ct.addEventListener("mousemove",function(e){ var r=h.getBoundingClientRect(); h.style.setProperty("--hx",(e.clientX-r.left)+"px"); h.style.setProperty("--hy",(e.clientY-r.top)+"px"); });
  var cv=document.getElementById("globe"); if(!cv) return;
  var g=cv.getContext("2d"), dpr=Math.min(devicePixelRatio||1,2), S=0, on=false, drag=false, lx=0, off=0, offV=0;
  var HEX="000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ff9ffffe0000000000000000000000000133fcfffff000700000000c000000000000129900fffff00000000e001f8000000000003c034003fff00000006007ff80080008040017c6fe01ffe000000061dfffff7f80007ffffd43b381ff80001fe05ebfffffffffff3fffffffc3e1fc04007fd3fffffffffffff00fffffff51c1f00800f7ffffffffffffffe03ffffffc0600e00003e7ffffffffffffef801e07fffe07a0000003e7fffffffffff808000801ffff87e00000214fffffffffffe038000000ffffeff80000d1fffffffffffff0300000007ffffffc00003ffffffffffffff0000000003fffff4e00003ffffffffffffff0000000003fffffc000001fff5f7fffffffe0000000003fffff0000001ebe0effffffffc4000000003ffffe000000f86f6f3fffffff08000000001ffffc000000f029ff3fffffe208000000001ffffc0000000f007ffffffff1300000000007fff80000007f003ffffffff0400000000005ffe0000000ffeebffffffff8000000000003fc10000000fffffefffffff8000000000000f810000003ffffdf3ffffff00000000000007800000003ffffdfe1ffffe80000000000003880000007ffffeff0fe7e000000000000003d81800003ffffefe07c3d000000000000000780000007fffff780781e0800000000000000e0000007fffffe00301f0c0000000000000002800003fffff9003016000000000000000017f00001ffffff000010020000000000000007f80000fbffff000808000000000000000007ff000000fffe00001860000000000000000fff000000fffc00000ce0000000000000000fffc00000fff800000ce8c00000000000000ffff80000fff0000004083c0000000000000ffffc00007ff0000002001e0000000000000ffffc00007ff00000001a0800000000000007fff800007ff0000000000000000000000007fff000007ff100000000c000000000000001fff000007ff300000007e400000000000000fff000007fc300000007fe00000000000000fff000007fc60000003fff00000000000000ffc000003fc60000007fff00000000000000ff8000003f800000007fff80000000000001ff0000001f800000003fff80000000000001ff0000001f000000003fff80000000000001fe0000001c000000003c3f80000000000001f80000000000000000000f00000000000001f00000000000000000000200200000000003c00000000000000000000200400000000001c000000000000000000000008000000000038000000000000000000000010000000000038000000000000000000000000000000000030800000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", C=144, R=72, dots=[];
  for(var r=0;r<R;r++) for(var c=0;c<C;c++){ var i=r*C+c; if(parseInt(HEX[i>>2],16)>>(3-(i&3))&1){ var la=(90-(r+.5)*180/R)*Math.PI/180, lo=(-180+(c+.5)*360/C)*Math.PI/180; dots.push([Math.cos(la)*Math.sin(lo),Math.sin(la),Math.cos(la)*Math.cos(lo)]); } }
  function vec(la,lo){ la*=Math.PI/180; lo*=Math.PI/180; return [Math.cos(la)*Math.sin(lo),Math.sin(la),Math.cos(la)*Math.cos(lo)]; }
  var HOME=vec(11.25,75.78), CITY=[vec(51.5,-.1),vec(25.2,55.3),vec(1.35,103.8),vec(40.7,-74),vec(-33.9,151.2)], TILT=.38;
  function size(){ var b=cv.getBoundingClientRect(); S=Math.round(b.width)||200; cv.width=S*dpr; cv.height=S*dpr; g.setTransform(dpr,0,0,dpr,0,0); }
  size(); addEventListener("resize",size);
  function rot(v,a){ var x=v[0]*Math.cos(a)-v[2]*Math.sin(a), z=v[0]*Math.sin(a)+v[2]*Math.cos(a), y=v[1]; return [x, y*Math.cos(TILT)-z*Math.sin(TILT), y*Math.sin(TILT)+z*Math.cos(TILT)]; }
  function slerp(a,b,s){ var d=Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2])), om=Math.acos(d), so=Math.sin(om)||1, k1=Math.sin((1-s)*om)/so, k2=Math.sin(s*om)/so; return [k1*a[0]+k2*b[0],k1*a[1]+k2*b[1],k1*a[2]+k2*b[2]]; }
  function frame(now){
    if(on) requestAnimationFrame(frame);
    var t=now*.001; if(!drag){ off+=offV; offV*=.94; off*=.985; }
    var a=(75.78+80*Math.sin(t*.22))*Math.PI/180+off, cx=S/2, cy=S/2, Rr=S*.44;
    g.clearRect(0,0,S,S);
    var bg=g.createRadialGradient(cx,cy,Rr*.2,cx,cy,Rr*1.25); bg.addColorStop(0,"rgba(90,70,220,.16)"); bg.addColorStop(.8,"rgba(60,40,160,.08)"); bg.addColorStop(1,"rgba(60,40,160,0)");
    g.fillStyle=bg; g.beginPath(); g.arc(cx,cy,Rr*1.25,0,6.2832); g.fill();
    g.strokeStyle="rgba(255,255,255,.14)"; g.lineWidth=1; g.beginPath(); g.arc(cx,cy,Rr,0,6.2832); g.stroke();
    for(var i=0;i<dots.length;i++){ var p=rot(dots[i],a); if(p[2]<=0) continue; g.fillStyle="rgba(190,180,255,"+(.18+.62*p[2]).toFixed(2)+")"; g.fillRect(cx+p[0]*Rr-.6,cy-p[1]*Rr-.6,1.3,1.3); }
    var hp=rot(HOME,a);
    CITY.forEach(function(ct2,k){
      var prog=((t*.18+k*.37)%1), lastOK=false;
      g.lineWidth=1.1; g.beginPath(); var started=false;
      for(var s=0;s<=1.001;s+=.04){ var v=slerp(HOME,ct2,s), lift=1+.22*Math.sin(Math.PI*s), q=rot([v[0]*lift,v[1]*lift,v[2]*lift],a); if(q[2]<-.05){ started=false; continue; } var X=cx+q[0]*Rr, Y=cy-q[1]*Rr; if(!started){ g.moveTo(X,Y); started=true; } else g.lineTo(X,Y); }
      g.strokeStyle="rgba(53,214,200,.45)"; g.stroke();
      var v2=slerp(HOME,ct2,prog), l2=1+.22*Math.sin(Math.PI*prog), q2=rot([v2[0]*l2,v2[1]*l2,v2[2]*l2],a);
      if(q2[2]>0){ g.fillStyle="#fff"; g.beginPath(); g.arc(cx+q2[0]*Rr,cy-q2[1]*Rr,1.8,0,6.2832); g.fill(); }
    });
    if(hp[2]>0){ var X=cx+hp[0]*Rr, Y=cy-hp[1]*Rr, pr=(t*.9)%1; g.strokeStyle="rgba(255,122,107,"+(.7*(1-pr)).toFixed(2)+")"; g.lineWidth=1.4; g.beginPath(); g.arc(X,Y,3+pr*14,0,6.2832); g.stroke(); g.fillStyle="#ff7a6b"; g.beginPath(); g.arc(X,Y,3.2,0,6.2832); g.fill(); g.font="500 10px ui-monospace,Menlo,monospace"; var lft=X>cx; g.textAlign=lft?"right":"left"; g.fillStyle="rgba(255,255,255,.85)"; g.fillText("KOZHIKODE · IN",lft?X-9:X+9,Y-8); }
  }
  new IntersectionObserver(function(en){ var v=en[0].isIntersecting; if(v&&!on){ on=true; requestAnimationFrame(frame); } else if(!v) on=false; },{threshold:.05}).observe(cv);
  if(reduced) frame(0);
  cv.addEventListener("pointerdown",function(e){ drag=true; lx=e.clientX; offV=0; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove",function(e){ if(!drag) return; var d=(e.clientX-lx)*.012; off+=d; offV=d; lx=e.clientX; });
  cv.addEventListener("pointerup",function(){ drag=false; });
})();

/* ---------- hero: a heap of glass & metal padlocks you can shove around ---------- */
(function(){
  var cvs=document.getElementById("locks"); if(!cvs) return;
  /* three.js is loaded off the critical path: a slow or blocked CDN can never hold up the page or the loader */
  /* sources are injected at build time: each carries a Subresource Integrity hash, so a tampered file simply won't run */
  var THREE_SRC=/*THREE_SRC*/[{u:"vendor/three.min.js",i:"sha384-R9kNze4YCU1vsX004q9WkHzp4p0f5UXJd1Q6KusA8oz+/P+KgsZC0WfTOPnLEjxG"}]/*END_THREE_SRC*/;
  function loadThree(list,done){ var k=0; (function next(){ if(k>=list.length) return; var src=list[k++], sc=document.createElement("script"), to=setTimeout(function(){ sc.onload=sc.onerror=null; next(); },7000);
      sc.async=true; sc.crossOrigin="anonymous"; sc.referrerPolicy="no-referrer"; sc.integrity=src.i; sc.src=src.u; sc.onload=function(){ clearTimeout(to); done(); }; sc.onerror=function(){ clearTimeout(to); next(); }; document.head.appendChild(sc); })(); }
  function boot(){
  var T=THREE, hero=cvs.parentNode, small=innerWidth<760, weak=(navigator.hardwareConcurrency||8)<=4||!!(navigator.deviceMemory&&navigator.deviceMemory<=4), ren, PERF=window.__perf=window.__perf||{level:0,hooks:[]};
  try{ ren=new T.WebGLRenderer({canvas:cvs,antialias:!(weak||small),alpha:true,powerPreference:"high-performance"}); }catch(e){ return; }
  ren.setPixelRatio(Math.min(devicePixelRatio||1,(small||weak)?1.5:2)); ren.outputColorSpace=T.SRGBColorSpace; ren.toneMapping=T.ACESFilmicToneMapping; ren.toneMappingExposure=1.0;
  var scene=new T.Scene(), cam=new T.OrthographicCamera(0,1,1,0,-2000,2000), W=1, H=1, floorY=0; scene.fog=new T.Fog(0x120e26,250,1000);
  var ENVT=(function(){ var c=document.createElement("canvas"); c.width=512; c.height=256; var x=c.getContext("2d"), g=x.createLinearGradient(0,0,0,256);
    g.addColorStop(0,"#34288a"); g.addColorStop(.5,"#120e26"); g.addColorStop(1,"#4a2250"); x.fillStyle=g; x.fillRect(0,0,512,256);
    [[40,26,120,60,"#fff"],[230,10,170,26,"#e8f6ff"],[400,50,60,110,"#fff"],[140,150,200,22,"#cfe0ff"],[10,170,70,50,"#9fd0ff"],[330,170,100,30,"#fff7d6"],[300,80,14,90,"#fff"]].forEach(function(b){ x.fillStyle=b[4]; x.fillRect(b[0],b[1],b[2],b[3]); });
    var t=new T.CanvasTexture(c); t.mapping=T.EquirectangularReflectionMapping; t.colorSpace=T.SRGBColorSpace;
    return t; })();
  scene.environment=new T.PMREMGenerator(ren).fromEquirectangular(ENVT).texture;
  scene.add(new T.AmbientLight(0xffffff,.35)); var dl=new T.DirectionalLight(0xffffff,2.2); dl.position.set(-300,700,600); scene.add(dl); var fl=new T.DirectionalLight(0x8b6cff,1.1); fl.position.set(700,200,300); scene.add(fl);
  function M(o){ return new T.MeshPhysicalMaterial(o); }
  function G(c,op,x){ var o={color:c,metalness:0,roughness:.05,transparent:true,opacity:op,clearcoat:1,clearcoatRoughness:.03,envMapIntensity:1.7,ior:1.45,specularIntensity:1,depthWrite:false,emissive:c,emissiveIntensity:.24}; if(x) for(var k in x) o[k]=x[k]; return M(o); }
  /* iMac-G3-style translucent plastics: bondi blue, clear ice, smoke, grape, a touch of tangerine, deep blue */
  var MATS=[G(0x2f8bff,.82),G(0xdbe9ff,.62,{emissiveIntensity:.12}),G(0x2a2c3d,.84,{emissiveIntensity:.1}),G(0x7b5cff,.8),G(0xff8a3d,.8),G(0x1f3fd6,.82)];
  var CORE=new T.MeshStandardMaterial({color:0xf2f4ff,roughness:.35,metalness:.1});
  var PICK=[0,1,2,0,3,4,1,2,5,0,2,1,4];
  var BLACK=new T.MeshStandardMaterial({color:0x0b0817,roughness:.6});
  function rr(w,h,r){ var s=new T.Shape(); s.moveTo(-w/2+r,-h/2); s.lineTo(w/2-r,-h/2); s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r); s.lineTo(w/2,h/2-r); s.quadraticCurveTo(w/2,h/2,w/2-r,h/2); s.lineTo(-w/2+r,h/2); s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r); s.lineTo(-w/2,-h/2+r); s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2); return s; }
  function slab(w,h,d,r){ var g=new T.ExtrudeGeometry(rr(w,h,r),{depth:d,bevelEnabled:true,bevelSize:d*.18,bevelThickness:d*.18,bevelSegments:3,curveSegments:6}); g.translate(0,0,-d/2); return g; }
  function padlock(r,m){ var g=new T.Group();
    g.add(new T.Mesh(slab(1.5*r,1.2*r,.5*r,.2*r),m));
    var core=new T.Mesh(new T.CylinderGeometry(.24*r,.24*r,.34*r,20),CORE); core.rotation.x=Math.PI/2; core.position.set(0,.06*r,0); g.add(core);
    var tab=new T.Mesh(new T.BoxGeometry(.5*r,.12*r,.3*r),CORE); tab.position.set(0,-.34*r,0); g.add(tab);
    var sg=new T.Group(); sg.position.set(-.46*r,.61*r,0); var sh=new T.Mesh(new T.TorusGeometry(.46*r,.1*r,12,28,Math.PI),m); sh.position.set(.46*r,.17*r,0); sg.add(sh);
    [0,1].forEach(function(k){ var l=new T.Mesh(new T.CylinderGeometry(.1*r,.1*r,.34*r,12),m); l.position.set(k*.92*r,0,0); sg.add(l); }); g.add(sg); g.userData.sg=sg; g.userData.sy=.61*r;
    var h=new T.Mesh(new T.CylinderGeometry(.13*r,.13*r,.1*r,16),BLACK); h.rotation.x=Math.PI/2; h.position.set(0,.05*r,.37*r); g.add(h);
    var sl=new T.Mesh(new T.BoxGeometry(.07*r,.3*r,.1*r),BLACK); sl.position.set(0,-.14*r,.37*r); g.add(sl); return g; }
  function key(r,m){ var g=new T.Group();
    var hd=new T.Mesh(new T.TorusGeometry(.34*r,.11*r,12,24),m); hd.position.x=-.85*r; g.add(hd);
    var sf=new T.Mesh(new T.CylinderGeometry(.08*r,.08*r,1.5*r,12),m); sf.rotation.z=Math.PI/2; sf.position.x=.05*r; g.add(sf);
    [.55,.85].forEach(function(k,i){ var t=new T.Mesh(new T.BoxGeometry(.14*r,(.3+i*.1)*r,.16*r),m); t.position.set(k*r,-.18*r,0); g.add(t); }); return g; }
  function cube(r,m){ var g=new T.Group(); g.add(new T.Mesh(slab(1.15*r,1.15*r,1.0*r,.26*r),m)); return g; }

  var N=small?9:(weak?12:15), B=[], gx=2000;
  for(var i=0;i<N;i++){ var kind=i%7===3||i%7===6?1:(i%9===5?2:0), mat=MATS[PICK[i%PICK.length]], r0=1+((i*37)%10)/22;
    B.push({kind:kind,mat:mat,k:r0,live:false,x:0,y:0,vx:0,vy:0,a:Math.random()*6.28,w:0,ph:Math.random()*6.28,tx:(Math.random()-.5)*.7,ty:(Math.random()-.5)*.7,g:null,r:40,im:1,iI:1,z:i%3===1?-520:0,zs:i%3===1?.86:1}); }
  var R0=40, GY=2300; function LWf(){ return W>900?W*.46:0; } function ss1(x){ x=Math.max(0,Math.min(1,x)); return x*x*(3-2*x); }
  function build(){ B.forEach(function(b){ if(b.g) scene.remove(b.g); var r=R0*b.k; b.g=b.kind===1?key(r*.95,b.mat):(b.kind===2?cube(r,b.mat):padlock(r,b.mat)); b.r=b.kind===1?r*.66:(b.kind===2?r*.66:r*.84); var m=b.r*b.r; b.im=1/m; b.iI=1/(.5*m*b.r*b.r); b.g.visible=b.live; scene.add(b.g); }); }
  function size(){ W=hero.clientWidth||innerWidth; H=hero.clientHeight||innerHeight; ren.setSize(W,H,false); cam.right=W; cam.top=H; cam.updateProjectionMatrix(); floorY=H*.03; var nr=Math.max(32,Math.min(64,Math.min(W,H)*.08)); if(Math.abs(nr-R0)>1){ R0=nr; build(); } }
  size(); addEventListener("resize",size);

  var PI=-1,KI=-1, hand={on:false,fresh:false,lx:0,ly:0,kx:0,ky:0}; B.forEach(function(b,i){ if(b.kind===0&&PI<0) PI=i; if(b.kind===1&&KI<0) KI=i; });
  var px=-999,py=-999,pvx=0,pvy=0,pt=0, t0=0;
  function ptr(e,down){ var rc=hero.getBoundingClientRect(), x=e.clientX-rc.left, y=H-(e.clientY-rc.top), now=performance.now(), dt=Math.max(8,now-pt)/1000;
    pvx=Math.max(-2200,Math.min(2200,(x-px)/dt)); pvy=Math.max(-2200,Math.min(2200,(y-py)/dt)); if(px<-900){pvx=0;pvy=0;} px=x; py=y; pt=now;
    B.forEach(function(b){ if(!b.live) return; var dx=b.x-x, dy=b.y-y, d=Math.sqrt(dx*dx+dy*dy)+1e-3;
      if(down){ var R=300; if(d<R){ var f=1-d/R; b.vx+=dx/d*820*f; b.vy+=dy/d*820*f+380*f; b.w+=(Math.random()-.5)*9*f; } }
      else { var R2=b.r+95; if(d<R2){ var f2=1-d/R2; b.vx+=pvx*f2*.32+dx/d*200*f2; b.vy+=pvy*f2*.32+dy/d*200*f2; b.w+=(Math.random()-.5)*4*f2; } } }); }
  addEventListener("pointermove",function(e){ ptr(e,false); },{passive:true});
  addEventListener("pointerdown",function(e){ ptr(e,true); },{passive:true});

  function step(dt){
    B.forEach(function(b){ if(!b.live) return; b.vy-=GY*dt; b.x+=b.vx*dt; b.y+=b.vy*dt; b.a+=b.w*dt; b.w*=.996;
      if(b.y<floorY+b.r){ b.y=floorY+b.r; if(b.vy<0) b.vy=-b.vy*.28; b.vx*=.988; b.w+=(-b.vx/b.r-b.w)*.12; }
      var lw=LWf(); if(b.x<lw+b.r){ b.x=lw+b.r; if(b.vx<0) b.vx=-b.vx*.3; } if(b.x>W-b.r){ b.x=W-b.r; if(b.vx>0) b.vx=-b.vx*.3; } });
    for(var it=0;it<3;it++) for(var i=0;i<B.length;i++){ var a=B[i]; if(!a.live) continue; for(var j=i+1;j<B.length;j++){ var c=B[j]; if(!c.live) continue;
      var dx=c.x-a.x, dy=c.y-a.y, rs=a.r+c.r, d2=dx*dx+dy*dy; if(d2>=rs*rs||d2<1e-6) continue;
      var d=Math.sqrt(d2), nx=dx/d, ny=dy/d, ov=rs-d, tm=a.im+c.im; a.x-=nx*ov*a.im/tm; a.y-=ny*ov*a.im/tm; c.x+=nx*ov*c.im/tm; c.y+=ny*ov*c.im/tm;
      var vn=(a.vx-c.vx)*nx+(a.vy-c.vy)*ny; if(vn>0){ var jn=vn*1.25/tm; a.vx-=jn*a.im*nx; a.vy-=jn*a.im*ny; c.vx+=jn*c.im*nx; c.vy+=jn*c.im*ny;
        var tx=-ny, ty=nx, vt=(a.vx-c.vx)*tx+(a.vy-c.vy)*ty+a.w*a.r+c.w*c.r, K=tm+a.r*a.r*a.iI+c.r*c.r*c.iI, jt=Math.max(-.4*jn,Math.min(.4*jn,-vt/K));
        a.vx+=jt*a.im*tx; a.vy+=jt*a.im*ty; c.vx-=jt*c.im*tx; c.vy-=jt*c.im*ty; a.w+=a.r*jt*a.iI; c.w+=c.r*jt*c.iI; } } }
  }
  var last=0, sent=false, started=false;
  function frame(now){
    requestAnimationFrame(frame);
    var rc=hero.getBoundingClientRect(); if(rc.bottom<-50||rc.top>innerHeight+50){ last=now; return; }
    var dt=Math.min(.033,(now-last)/1000||.016); last=now;
    if(!started&&document.body.classList.contains("ready")){ started=true; t0=now; }
    if(started) B.forEach(function(b,i){ if(!b.live&&now-t0>i*80){ b.live=true; b.g.visible=true; b.x=LWf()+(W-LWf())*(.06+.88*((i*0.618)%1)); b.y=H+b.r*2.2; b.vx=(Math.random()-.5)*160; b.vy=-380; b.w=(Math.random()-.5)*3; } });
    var sc=Math.max(0,-rc.top)/H, lift=ss1((sc-.06)/.3);
    GY=3000*(1-1.2*lift);
    step(dt/2); step(dt/2);
    if(sc>.45&&!sent){ sent=true; window.__burst=B.filter(function(b,ix){return b.live&&ix!==PI&&ix!==KI;}).map(function(b){ return [rc.left+b.x, rc.top+(H-b.y)]; }); } if(sc<.2) sent=false;
    if(sc>.55&&!hand.on&&PI>=0){ hand.on=true; hand.fresh=true; var L=B[PI], K=B[KI>=0?KI:PI]; hand.lx=rc.left+L.x; hand.ly=rc.top+(H-L.y); hand.kx=rc.left+K.x; hand.ky=rc.top+(H-K.y); }
    if(sc<.45&&hand.on) hand.on=false;
    var t=now*.001, n=B.length;
    B.forEach(function(b,i){ if(!b.live) return; var isP=(i===PI||i===KI), f=i/n, op=ss1((sc-.04-f*.26)/.16), s2=(isP?(hand.on?.001:1):Math.max(.001,1-ss1((sc-.4-f*.22)/.22)))*b.zs, sg=b.g.userData.sg;
      b.g.position.set(b.x,b.y,b.z); b.g.rotation.set(b.tx+Math.sin(t*.8+b.ph)*.22+op*.35,b.ty+Math.cos(t*.7+b.ph)*.26,b.a); b.g.scale.setScalar(s2);
      if(sg){ sg.rotation.z=op*1.2; sg.position.y=b.g.userData.sy+op*.12*b.r; } });
    var glEl=document.getElementById("vapour"); if(glEl){ glEl.style.opacity=(1-ss1((sc-.12)/.4)).toFixed(3); glEl.style.transform="translateY("+(-sc*90).toFixed(1)+"px)"; }
    var gone=sc>.95; cvs.style.visibility=gone?"hidden":"visible"; if(!gone) ren.render(scene,cam);
  }
  requestAnimationFrame(frame);

  /* adaptive quality: if the page can't hold ~30fps, shed cost in two steps */
  function degrade(){ PERF.level++; var l=PERF.level;
    if(l>=1){ ren.setPixelRatio(1); ren.setSize(W,H,false); B.forEach(function(b){ if(b.z<0){ b.live=false; b.g.visible=false; } }); }
    if(l>=2){ B.forEach(function(b,i){ if(i%3===0&&i!==PI&&i!==KI){ b.live=false; b.g.visible=false; } }); }
    PERF.hooks.forEach(function(h){ h(l); }); }
  var g0=0,gS=0,gN=0,born=performance.now();
  (function gov(now){ requestAnimationFrame(gov); if(document.hidden){ g0=0; return; }
    if(g0){ gS+=now-g0; gN++; if(gN>=90){ var avg=gS/gN; gS=0; gN=0; if(now-born>7000&&avg>32&&PERF.level<2) degrade(); } } g0=now; })(performance.now());
  /* one padlock and key leave the pile and travel with the scroll, switching sides, until the footer */
  (function(){
    var c2=document.createElement("canvas"); c2.setAttribute("aria-hidden","true");
    c2.style.cssText="position:fixed;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;visibility:hidden"; document.body.appendChild(c2);
    var r2; try{ r2=new T.WebGLRenderer({canvas:c2,antialias:true,alpha:true}); }catch(e){ return; }
    r2.setPixelRatio(Math.min(devicePixelRatio||1,(small||weak)?1.25:2)); PERF.hooks.push(function(){ r2.setPixelRatio(1); r2.setSize(w2,h2,false); }); r2.outputColorSpace=T.SRGBColorSpace; r2.toneMapping=T.ACESFilmicToneMapping;
    var s2=new T.Scene(), cm=new T.OrthographicCamera(0,1,1,0,-2000,2000), w2=1, h2=1;
    s2.environment=new T.PMREMGenerator(r2).fromEquirectangular(ENVT).texture;
    s2.add(new T.AmbientLight(0xffffff,.35)); var d1=new T.DirectionalLight(0xffffff,2.2); d1.position.set(-300,700,600); s2.add(d1); var d2=new T.DirectionalLight(0x8b6cff,1.1); d2.position.set(700,200,300); s2.add(d2);
    var RR=small?34:48, L2=padlock(RR,MATS[0]), K2=key(RR*.95,MATS[4]); s2.add(L2); s2.add(K2);
    function rs(){ w2=innerWidth; h2=innerHeight; r2.setSize(w2,h2,false); cm.right=w2; cm.top=h2; cm.updateProjectionMatrix(); } rs(); addEventListener("resize",rs);
    var cx=0,cy=0,kx=0,ky=0,vis=0,sc2=pageYOffset,sent2=false,prevOpen=0,snap=0;
    var hovCard=false, hovSm=0; function bump(r,a,b){ return ss1((r-a)/.2)*(1-ss1((r-(b-.2))/.2)); }
    document.addEventListener("mouseover",function(e){ hovCard=!!(e.target&&e.target.closest&&e.target.closest(".card")); },{passive:true});
    function f2(now){
      requestAnimationFrame(f2);
      var f=Math.max(0,Math.min(1,current/totalScrollLen)), t=now*.001;
      if(hand.fresh){ hand.fresh=false; cx=hand.lx; cy=hand.ly; kx=hand.kx; ky=hand.ky; }
      vis+=((hand.on?1:0)-vis)*.07; if(vis<.01){ c2.style.visibility="hidden"; return; }
      var wide=w2>900, fe=ss1((f-.84)/.06), side=Math.sin(f*Math.PI*9+.6);
      var tx=w2*(.5+.4*side), ty=h2*(.56+.1*Math.sin(f*31));
      tx+=(w2*(wide?.75:.5)-tx)*fe; ty+=(h2*(wide?.46:.32)-ty)*fe;
      /* section choreography: process steps, the attack story, the work cards */
      var nSt=procStageEls.length||6, rP=Math.max(0,Math.min(1,(current-procTop)/Math.max(1,procLen)))*nSt;
      var wp=ss1((current-(procTop-h2*.5))/(h2*.5))*(1-ss1((current-(procTop+procLen))/(h2*.5)));
      var nSy=storyLineEls.length||8, rS=Math.max(0,Math.min(1,(current-storyTop)/Math.max(1,storyLen)))*nSy;
      var ws=ss1((current-(storyTop-h2*.5))/(h2*.5))*(1-ss1((current-(storyTop+storyLen))/(h2*.5)));
      var ww=ss1((current-(workTop-h2*.4))/(h2*.4))*(1-ss1((current-(workTop+workLen))/(h2*.4)));
      hovSm+=((hovCard?1:0)-hovSm)*.1;
      tx+=(w2*(wide?.8:.84)-tx)*wp; ty+=(h2*.5-ty)*wp;
      tx+=(w2*(wide?.82:.84)-tx)*ws; ty+=(h2*.5-ty)*ws;
      tx+=(w2*.92-tx)*ww; ty+=(h2*.2-ty)*ww;
      var openP=ss1((rP-3)/.5)*(1-ss1((rP-5)/.6)), keyP=ss1((rP-2.6)/.4)*(1-ss1((rP-5)/.6)), ratP=bump(rP,2,3);
      var look=bump(rS,2,3), poke=bump(rS,3,4)*(.5+.5*Math.sin(t*5)), ratS=bump(rS,4,5), openS=ss1((rS-5)/.4)*(1-ss1((rS-6)/.4));
      var wA=Math.max(wp,ws), keyIn=Math.max(keyP*wp,poke*ws), rattle=Math.max(ratP*wp,ratS*ws), openStep=Math.max(openP*wp,openS*ws,.5*hovSm*ww);
      var pcx=cx; cx+=(tx-cx)*.06; cy+=(ty-cy)*.06; var vx=cx-pcx;
      var orb=1.9*RR*(1-.75*fe)*(1-.88*keyIn), ox=cx+Math.cos(t*1.1)*orb-RR*.1*keyIn, oy=cy+Math.sin(t*1.1)*orb*.7+RR*.3*fe+RR*.38*keyIn;
      kx+=(ox-kx)*.08; ky+=(oy-ky)*.08;
      var openEff=Math.max(ss1((f-.8)/.07),openStep); if(prevOpen>.55&&openEff<.45&&(wp>.2||ws>.2)) snap=1; prevOpen=openEff; snap*=.9;
      var out=1-ss1((f-.9)/.05), sv=vis*out*(1-ws), big=(1+.25*wA-.18*ww+.14*snap), W2=Math.max(wA,ww);
      var ryA=f*Math.PI*14+Math.sin(t*.5)*.3, ryB=Math.sin(t*.5)*.25+look*ws*Math.sin(t*2.2)*.7;
      L2.position.set(cx,h2-cy,0); L2.rotation.set(.25*Math.sin(t*.6)*(1-W2),ryA*(1-W2)+ryB*W2,Math.sin(t*.7)*.1-vx*.01+rattle*Math.sin(t*38)*.1); L2.scale.setScalar(Math.max(.001,sv*big));
      var sg=L2.userData.sg; if(sg){ sg.rotation.z=openEff*1.2; sg.position.y=L2.userData.sy+openEff*.12*RR; }
      K2.position.set(kx,h2-ky,40); K2.rotation.set(.3,t*.9*(1-.8*keyIn),-.5+Math.sin(t)*.3); K2.scale.setScalar(Math.max(.001,sv*big));
      if(out<.5&&!sent2){ sent2=true; window.__burst=[[cx,cy],[kx,ky]]; } if(f<.85) sent2=false;
      if(sv<.01){ c2.style.visibility="hidden"; return; } c2.style.visibility="visible"; r2.render(s2,cm);
    }
    requestAnimationFrame(f2);
  })();
  }
  if(window.THREE) boot(); else loadThree(THREE_SRC,boot);
})();

/* ---------- hero: four titles, one at a time (vapour text effect, ported from the 21st.dev VaporizeTextCycle) ---------- */
(function(){
  var cv=document.getElementById("vapour"), hero=document.querySelector(".hero"), row=document.querySelector(".hero-row");
  if(!cv||!hero||!row) return; var g=cv.getContext("2d"); if(!g) return;
  var TEXTS=["Creative engineer.","Security engineer.","Pentester.","AI developer.","Full-stack."], FAM='"Syne",Impact,sans-serif';
  var VAP_S=2, FADE_S=1, WAIT_S=1.8, SPREAD=5, DENSITY=.65;      /* density 5/10 -> 0.65, as in the component */
  var small=innerWidth<760, reduced=matchMedia("(prefers-reduced-motion:reduce)").matches, dpr=Math.min(devicePixelRatio||1,2), CAP=small?4200:16000;
  var W=0,H=0,sets=[],idx=0,state="idle",st=0,prog=0,last=0,started=false;
  function spreadFor(size){ var P=[[20,.2],[50,.5],[100,1.5]]; if(size<=20) return .2; if(size>=100) return 1.5; var i=0; while(i<2&&P[i+1][0]<size) i++; return P[i][1]+(size-P[i][0])*(P[i+1][1]-P[i][1])/(P[i+1][0]-P[i][0]); }
  function layout(){
    var hr=hero.getBoundingClientRect(); W=Math.round(hr.width*dpr); H=Math.round(hr.height*dpr); cv.width=W; cv.height=H; g.setTransform(1,0,0,1,0,0);
    var rTop=row.getBoundingClientRect().top-hr.top, padL=Math.max(18,Math.min(56,hr.width*.04)), base=rTop-Math.min(64,hr.height*.08), maxBase=base;
    var sm=innerWidth<760, LN=TEXTS.map(function(t){ return (sm&&t.indexOf(" ")>0)?t.split(" "):[t]; }), maxL=1; LN.forEach(function(L){ maxL=Math.max(maxL,L.length); });
    var m=document.createElement("canvas").getContext("2d"); m.font="800 100px "+FAM; var wmax=1; LN.forEach(function(L){ L.forEach(function(ln){ wmax=Math.max(wmax,m.measureText(ln).width); }); });
    var fs=Math.max(20,Math.min((hr.width-padL*2)/wmax*100,small?120:200,(maxBase-96)/(.95+maxL-1))), fd=fs*dpr;
    base=Math.max(112+fs*(.95+maxL-1),Math.min(maxBase,hr.height*.4+fs*.4));
    var top=Math.max(0,Math.floor((base-fs*(1.05+maxL-1))*dpr)), bh=Math.ceil(fd*(1.4+maxL-1)), mk=document.createElement("canvas"); mk.width=W; mk.height=bh; var mc=mk.getContext("2d",{willReadFrequently:true});
    var sr=Math.max(2,Math.round(fd/110)), out=[];
    for(var tries=0;tries<8;tries++){ out=[]; var worst=0;
      TEXTS.forEach(function(t,ti){ mc.clearRect(0,0,W,bh); mc.font="800 "+fd+"px "+FAM; mc.textBaseline="alphabetic"; mc.textAlign="left"; mc.fillStyle="#fff"; var x0=padL*dpr; var L=LN[ti], wd=0; L.forEach(function(ln,k){ mc.fillText(ln,x0,base*dpr-top-(L.length-1-k)*fd); wd=Math.max(wd,mc.measureText(ln).width); });
        var d=mc.getImageData(0,0,W,bh).data, px=[],py=[],pa=[];
        for(var y=0;y<bh;y+=sr) for(var x=0;x<W;x+=sr){ var al=d[(y*W+x)*4+3]; if(al>40){ px.push(x); py.push(top+y); pa.push(al/255); } }
        var n=px.length; out.push({n:n,ox:Float32Array.from(px),oy:Float32Array.from(py),oa:Float32Array.from(pa),x:new Float32Array(n),y:new Float32Array(n),vx:new Float32Array(n),vy:new Float32Array(n),sp:new Float32Array(n),op:new Float32Array(n),fq:new Uint8Array(n),left:x0,width:wd}); worst=Math.max(worst,n); });
      if(worst<=CAP) break; sr++; }
    sets=out; sets.sr=sr; sets.msp=spreadFor(fs)*SPREAD*(dpr/3);
    document.body.classList.add("gltext"); state=started?"fadein":"idle"; st=0; reset(sets[idx]);
  }
  function reset(S){ for(var i=0;i<S.n;i++){ S.x[i]=S.ox[i]; S.y[i]=S.oy[i]; S.op[i]=S.oa[i]; S.sp[i]=0; S.vx[i]=0; S.vy[i]=0; S.fq[i]=0; } }
  function vaporize(S,vx0,dt){
    var all=true, M=sets.msp, fade=.25*(2000/(VAP_S*1000)), cap=M*2;
    for(var i=0;i<S.n;i++){
      if(S.ox[i]<=vx0){
        if(S.sp[i]===0){ var an=Math.random()*6.2832; S.sp[i]=(Math.random()+.5)*M; S.vx[i]=Math.cos(an)*S.sp[i]; S.vy[i]=Math.sin(an)*S.sp[i]; S.fq[i]=Math.random()>DENSITY?1:0; }
        if(S.fq[i]){ S.op[i]=Math.max(0,S.op[i]-dt); }
        else { var dx=S.ox[i]-S.x[i], dy=S.oy[i]-S.y[i], dist=Math.sqrt(dx*dx+dy*dy), damp=Math.max(.95,1-dist/(100*M)), spx=(Math.random()-.5)*M*3, spy=(Math.random()-.5)*M*3;
          S.vx[i]=(S.vx[i]+spx+dx*.002)*damp; S.vy[i]=(S.vy[i]+spy+dy*.002)*damp; var v=Math.sqrt(S.vx[i]*S.vx[i]+S.vy[i]*S.vy[i]); if(v>cap){ S.vx[i]*=cap/v; S.vy[i]*=cap/v; }
          S.x[i]+=S.vx[i]*dt*20; S.y[i]+=S.vy[i]*dt*10; S.op[i]=Math.max(0,S.op[i]-dt*fade); }
        if(S.op[i]>.01) all=false;
      } else all=false;
    }
    return all;
  }
  function draw(S,mul){ g.clearRect(0,0,W,H); g.fillStyle="#f4f2ee"; var sz=sets.sr; for(var i=0;i<S.n;i++){ var o=S.op[i]*mul; if(o>.01){ g.globalAlpha=o; g.fillRect(S.x[i],S.y[i],sz,sz); } } g.globalAlpha=1; }
  function frame(now){
    requestAnimationFrame(frame);
    if(!sets.length) return; var hr=hero.getBoundingClientRect(); if(hr.bottom<-40||hr.top>innerHeight+40){ last=now; return; }
    var dt=Math.min(.05,(now-last)/1000||.016); last=now;
    if(!started){ if(document.body.classList.contains("ready")){ started=true; state="fadein"; st=0; reset(sets[idx]); } else { g.clearRect(0,0,W,H); return; } }
    var S=sets[idx]; st+=dt;
    if(state==="fadein"){ draw(S,Math.min(1,st/FADE_S)); if(st>=FADE_S){ state="wait"; st=0; } }
    else if(state==="wait"){ draw(S,1); if(!reduced&&st>=WAIT_S){ state="vapor"; st=0; prog=0; reset(S); } }
    else if(state==="vapor"){ prog+=dt*100/VAP_S; var p=Math.min(100,prog), vx0=S.left+S.width*p/100, done=vaporize(S,vx0,dt); draw(S,1);
      if(prog>=100&&done){ idx=(idx+1)%TEXTS.length; reset(sets[idx]); state="fadein"; st=0; } }
  }
  var timer=0; function relayout(){ clearTimeout(timer); timer=setTimeout(layout,150); }
  if(window.__perf) window.__perf.hooks.push(function(){ CAP=Math.round(CAP*.6); relayout(); });
  addEventListener("resize",relayout); if(window.ResizeObserver) new ResizeObserver(relayout).observe(row);
  var go=false, once=function(){ if(go) return; go=true; layout(); requestAnimationFrame(frame); };
  if(document.fonts&&document.fonts.load){ document.fonts.load("800 100px Syne").then(once,once); setTimeout(once,2500); } else once();
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){ if(go) relayout(); });
})();
var CERT_DATA=[  {t:"Certified Penetration Tester (CPT v3)",i:"RedTeam Hacker Academy",d:"6 Jan 2025",x:"ID RTXSTU1669011849",bg:"#bd1e23",img:"assets/img/img-01.webp"},
  {t:"Ethical Hacker",i:"Cisco Networking Academy",d:"16 Jul 2025",x:"",bg:"#ffffff",img:"assets/img/img-02.webp"},
  {t:"Fortinet Certified Associate in Cybersecurity",i:"Fortinet Training Institute",d:"12 Sep 2025",x:"Valid until 12 Sep 2027 \u00b7 3084833472SF",bg:"#ea3112",img:"assets/img/img-03.webp"},
  {t:"Cyber Threat Management",i:"Cisco Networking Academy",d:"5 Aug 2025",x:"",bg:"#ffffff",img:"assets/img/img-04.webp"},
  {t:"FortiGate 7.6 Operator (NSE 3)",i:"Fortinet",d:"12 Sep 2025",x:"Digital badge",bg:"#ffffff",img:"assets/img/img-05.webp"},
  {t:"Advent of Cyber 2024",i:"TryHackMe",d:"22 Sep 2025",x:"24 security challenges \u00b7 THM-RCPN2JJH1W",bg:"#141b2b",img:"assets/img/img-06.webp"},
  {t:"Advanced Program in Full Stack Software Engineering",i:"NIIT",d:"12 Dec 2021",x:"216 hours",bg:"#ffffff",img:"assets/img/img-07.webp"}
];
(function(){
  var sec=document.getElementById("certifications"), pin=document.getElementById("cxPin"), stage=document.getElementById("cxStage"), track=document.getElementById("cxTrack"); if(!sec||!pin||!stage||!track) return;
  var reduced=matchMedia("(prefers-reduced-motion:reduce)").matches, small=innerWidth<760, n=CERT_DATA.length;
  var tEl=document.getElementById("cxTitle"), mEl=document.getElementById("cxMeta"), cEl=document.getElementById("cxCount");
  var lb=document.getElementById("cxLb"), lbImg=document.getElementById("cxLbImg");
  var secTop=0, len=1, vh=innerHeight, idx=0, pos=0, shown=-1;
  function meas(){ vh=innerHeight; secTop=absTop(sec); len=Math.max(1,sec.offsetHeight-vh); }
  meas(); addEventListener("resize",meas); addEventListener("load",function(){ setTimeout(meas,300); }); setInterval(meas,1500);
  /* the page position at which certificate k sits in the centre */
  function scrollToIdx(k){ k=Math.max(0,Math.min(n-1,k)); scrollTo({top:secTop+(k/(n-1))*len,behavior:reduced?"auto":"smooth"}); }
  var cards=CERT_DATA.map(function(c,i){
    var el=document.createElement("button"); el.type="button"; el.className="cx-card"; el.style.background=c.bg; el.tabIndex=-1;
    el.setAttribute("aria-label",c.t+", "+c.i+", "+c.d); el.innerHTML='<img src="'+c.img+'" alt="'+c.t+' certificate" draggable="false">';
    el.addEventListener("click",function(){ if(i===idx) openLb(i); else scrollToIdx(i); });
    track.appendChild(el); return el; });
  function info(){ var c=CERT_DATA[idx]; tEl.textContent=c.t; mEl.textContent=c.i+" · "+c.d+(c.x?" · "+c.x:""); cEl.textContent=(idx+1)+" / "+n; }
  function closeLb(){ if(lb.hidden) return; lb.hidden=true; dlg.close(lb); }
  function openLb(i){ lbImg.src=CERT_DATA[i].img; lbImg.alt=CERT_DATA[i].t; lb.hidden=false; dlg.open(lb,closeLb,lb); }
  lb.addEventListener("click",closeLb);
  document.getElementById("cxPrev").addEventListener("click",function(){ scrollToIdx(idx-1); });
  document.getElementById("cxNext").addEventListener("click",function(){ scrollToIdx(idx+1); });
  stage.addEventListener("keydown",function(e){ if(e.key==="ArrowRight"){ e.preventDefault(); e.stopPropagation(); scrollToIdx(idx+1); } else if(e.key==="ArrowLeft"){ e.preventDefault(); e.stopPropagation(); scrollToIdx(idx-1); } else if(e.key==="Enter"){ openLb(idx); } });
  function render(){
    var cw=cards[0].offsetWidth||400;
    for(var i=0;i<n;i++){ var d=i-pos, ad=Math.abs(d), el=cards[i];
      var x=d*cw*(small?.64:.6), ry=Math.max(-40,Math.min(40,d*22)), z=-Math.min(ad,3)*240-(ad>.01?40:0), sc=1-Math.min(ad,2.5)*.07, op=Math.max(0,1-Math.max(0,ad-.6)*.34), bl=Math.min(6,Math.max(0,ad-.12)*2.6);
      el.style.transform="translate3d(calc(-50% + "+x.toFixed(1)+"px),-50%,"+z.toFixed(0)+"px) rotateY("+ry.toFixed(1)+"deg) scale("+sc.toFixed(3)+")";
      el.style.opacity=op.toFixed(3); el.style.filter=bl>.15?"blur("+bl.toFixed(2)+"px)":"none"; el.style.zIndex=String(100-Math.round(ad*10)); el.style.pointerEvents=op<.05?"none":"auto";
    }
  }
  function frame(){
    requestAnimationFrame(frame);
    if(current<secTop-vh*1.2||current>secTop+len+vh*1.2) return;
    var off=Math.max(0,Math.min(len,current-secTop));
    pin.style.transform="translate3d(0,"+off.toFixed(1)+"px,0)";
    var x=(off/len)*(n-1), i=Math.floor(Math.min(x,n-1-1e-6)), f=x-i, f2=Math.max(0,Math.min(1,(f-.3)/.4)); f2=f2*f2*(3-2*f2);
    pos=Math.min(n-1,i+f2);
    var k=Math.round(pos); if(k!==shown){ shown=k; idx=k; info(); }
    render();
  }
  info(); render(); requestAnimationFrame(frame);
})();
})();
