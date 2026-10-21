const p=require('/workspace/alcode_mag/tools-verify/node_modules/puppeteer-core');
const only=process.argv[2];
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const runs=[[1440,900,'dark',1],[390,844,'dark',1],[390,844,'light',1],[673,900,'dark',0],[820,1180,'dark',0],[1440,900,'reduce',1]];
for(const [w,h,mode,shots] of runs){ if(only&&only!=String(w))continue;
 const pg=await b.newPage();const errs=[];pg.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});pg.on('pageerror',e=>errs.push(String(e).slice(0,200)));
 await pg.setViewport({width:w,height:h,isMobile:w<500,hasTouch:w<500});
 await pg.emulateMediaFeatures([{name:'prefers-reduced-motion',value:mode==='reduce'?'reduce':'no-preference'}]);
 await pg.evaluateOnNewDocument(d=>localStorage.setItem('aam-theme',d),mode==='light'?'light':'dark');
 await pg.goto('http://localhost:4877/',{waitUntil:'networkidle0',timeout:90000});
 await new Promise(r=>setTimeout(r,mode==='reduce'?800:6000));
 const H=await pg.evaluate(()=>document.documentElement.scrollHeight);
 const ys=await pg.evaluate(()=>{const o=[];for(const id of ['intro','career','skills','certs','contact']){const e=document.getElementById(id);o.push(e.offsetTop+(id==='intro'?0:e.offsetHeight*.3))}o.splice(2,0,(o[1]+o[2])/2+innerHeight*.4);return o.map(Math.round)});
 const res=[];
 for(const [k,y] of ys.entries()){
   await pg.evaluate(y=>window.scrollTo(0,y),y);
   await new Promise(r=>setTimeout(r,mode==='reduce'?300:2600));
   const o=await pg.evaluate(()=>{const W=document.documentElement.clientWidth;const bad=[];for(const e of document.querySelectorAll('body *')){if(e.closest('canvas,.loader,.cur-ring,.cur-dot,.static-ads,.skip,.sr-only'))continue;let p=e.parentElement,cl=false;while(p&&p!==document.body){const cs=getComputedStyle(p);if(/hidden|clip/.test(cs.overflowX)){const pr=p.getBoundingClientRect();if(pr.left>=-1&&pr.right<=W+1){cl=true;break}}p=p.parentElement}if(cl)continue;const r=e.getBoundingClientRect();if(r.width&&r.height&&(r.right>W+1||r.left<-1))bad.push(e.tagName+'.'+String(e.className).slice(0,30)+' '+Math.round(r.left)+'/'+Math.round(r.right))}return {sw:document.documentElement.scrollWidth,W,bad:bad.slice(0,4)}});
   res.push(o.sw>o.W||o.bad.length?JSON.stringify(o):'ok');
   if(shots) await pg.screenshot({path:`screens/v3-${w}${mode==='light'?'-light':mode==='reduce'?'-static':''}-${k}.png`});
 }
 if(w===1440&&mode==='dark'){
   for(const [t,n] of [['المهام','duties'],['القائمة الكاملة','certs']]){await pg.evaluate(t=>[...document.querySelectorAll('button')].find(b=>b.textContent.includes(t))?.click(),t);await new Promise(r=>setTimeout(r,1500));await pg.screenshot({path:`screens/v3-1440-modal-${n}.png`});await pg.keyboard.press('Escape');await new Promise(r=>setTimeout(r,500));}
 }
 console.log(w,mode,res.join(' '),'errors:',JSON.stringify(errs));
 await pg.close();}
await b.close();})();
