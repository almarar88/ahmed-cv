const p=require('/workspace/alcode_mag/tools-verify/node_modules/puppeteer-core');
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
for(const [w,dark,shot] of [[1440,0,'1440'],[390,0,'390'],[390,1,'390-dark'],[673,0,null],[820,0,null],[390,0,'reduced']]){
 const pg=await b.newPage();const errs=[];pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push(String(e)));
 await pg.setViewport({width:w,height:900});
 await pg.emulateMediaFeatures([{name:'prefers-color-scheme',value:dark?'dark':'light'},{name:'prefers-reduced-motion',value:shot==='reduced'?'reduce':'no-preference'}]);
 await pg.evaluateOnNewDocument(d=>localStorage.setItem('aam-theme',d?'dark':'light'),dark);await pg.goto('http://localhost:4877/',{waitUntil:'networkidle0'});
 // scroll through to trigger reveals/lazy
 await pg.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}scrollTo(0,0)});
 await new Promise(r=>setTimeout(r,1500));
 const o=await pg.evaluate(()=>{const W=document.documentElement.clientWidth;const bad=[];for(const e of document.querySelectorAll('body *')){const r=e.getBoundingClientRect();if(r.width&&(r.right>W+1||r.left<-1)&&!e.closest('.ads,.shelf,.hero-stack,[aria-hidden=true]'))bad.push(e.tagName+'.'+String(e.className).slice(0,40)+' '+Math.round(r.left)+'/'+Math.round(r.right))}return {sw:document.documentElement.scrollWidth,W,bad:bad.slice(0,8)}});
 console.log(w,dark?'dark':'light',shot,JSON.stringify(o),'errors:',errs);
 if(shot&&shot!=='reduced')await pg.screenshot({path:`screens/${shot}.png`,fullPage:true});
 await pg.close();}
await b.close();})();
