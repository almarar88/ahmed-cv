const P=require('/workspace/alcode_mag/tools-verify/node_modules/puppeteer-core');
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const w of [1440,390])for(const th of ['light','dark']){const p=await b.newPage();await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
await p.evaluateOnNewDocument(t=>localStorage.setItem('aam-theme',t),th);await p.setViewport({width:w,height:900});await p.goto('http://127.0.0.1:4877/',{waitUntil:'networkidle0'});
await new Promise(r=>setTimeout(r,800));await p.screenshot({path:`screens/v4-full-${w}-${th}.png`,fullPage:true});
if(th==='light'||w===1440)for(const id of ['achievements','timeline','certs','contact']){await p.evaluate(id=>{const e=document.getElementById(id);scrollTo(0,e.offsetTop-64)},id);await new Promise(r=>setTimeout(r,400));await p.screenshot({path:`screens/v4-${id}-${w}-${th}.png`});}
await p.close();}
// interaction: Lenis on, wheel + filter + copy toast
const p=await b.newPage();await p.setViewport({width:1440,height:900});await p.goto('http://127.0.0.1:4877/',{waitUntil:'networkidle0'});
await p.click('a[href="#certs"]');await new Promise(r=>setTimeout(r,2000));
await p.evaluate(()=>[...document.querySelectorAll('.fchips button')][3].click());await new Promise(r=>setTimeout(r,700));
await p.screenshot({path:'screens/v4-interact-filter-1440.png'});
await p.click('a[href="#contact"]');await new Promise(r=>setTimeout(r,2000));await p.evaluate(()=>document.querySelector('.copy').click());await new Promise(r=>setTimeout(r,500));
await p.screenshot({path:'screens/v4-interact-toast-1440.png'});await b.close()})();
