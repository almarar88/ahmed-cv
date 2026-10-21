const P=require('/workspace/alcode_mag/tools-verify/node_modules/puppeteer-core');const fs=require('fs');
const AXE=fs.readFileSync('/workspace/alcode_mag/tools-verify/node_modules/axe-core/axe.min.js','utf8');
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const out=[];for(const w of [1440,820,673,390])for(const th of ['light','dark']){const p=await b.newPage();const errs=[];
p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push(e.message));
await p.setViewport({width:w,height:900});await p.evaluateOnNewDocument(t=>localStorage.setItem('aam-theme',t),th);
await p.goto('http://127.0.0.1:4877/',{waitUntil:'networkidle0'});
const H=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<H;y+=500){await p.evaluate(y=>scrollTo(0,y),y);await new Promise(r=>setTimeout(r,90));}
await new Promise(r=>setTimeout(r,1500));
const ov=await p.evaluate(()=>{const W=document.documentElement.clientWidth;const bad=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&(r.right>W+1||r.left<-1)){let a=e.parentElement,c=false;while(a){const s=getComputedStyle(a);if(/hidden|clip|auto|scroll/.test(s.overflowX)&&a!==document.body&&a!==document.documentElement){c=true;break}a=a.parentElement}if(!c)bad.push(e.tagName+'.'+e.className.toString().slice(0,40))}});return {sw:document.documentElement.scrollWidth,W,bad:bad.slice(0,5)}});
await p.addScriptTag({content:AXE});const ax=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:['wcag2a','wcag2aa']});return r.violations.map(v=>v.id+':'+v.nodes.length+' '+v.nodes.slice(0,2).map(n=>n.target.join(' ')).join(' | '))});
if(w===1440||w===390){await p.evaluate(()=>scrollTo(0,0));await new Promise(r=>setTimeout(r,300));const H2=await p.evaluate(()=>document.documentElement.scrollHeight);await p.setViewport({width:w,height:H2});await new Promise(r=>setTimeout(r,800));await p.screenshot({path:`screens/v4-full-${w}-${th}.png`});}
out.push({w,th,ov,errs,ax});await p.close();}
console.log(JSON.stringify(out,null,1));await b.close();})();
