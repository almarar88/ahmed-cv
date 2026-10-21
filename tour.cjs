const p=require('/workspace/alcode_mag/tools-verify/node_modules/puppeteer-core');
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const pg=await b.newPage();await pg.setViewport({width:1280,height:720});
await pg.evaluateOnNewDocument(()=>localStorage.setItem('aam-theme','dark'));
await pg.goto('http://localhost:4877/',{waitUntil:'networkidle0'});
const rec=await pg.screencast({path:'screens/v2-tour.webm'});
await new Promise(r=>setTimeout(r,5500));
await pg.mouse.move(640,300);for(let i=0;i<30;i++){await pg.mouse.move(400+i*16,280+Math.sin(i/3)*40);await new Promise(r=>setTimeout(r,60))}
const H=await pg.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
for(let y=0;y<=H;y+=Math.max(40,H/260)){await pg.evaluate(y=>scrollTo(0,y),y);await new Promise(r=>setTimeout(r,70));
 if(Math.abs(y/H-.42)<.004){await pg.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.startsWith('التقط'))?.click());await new Promise(r=>setTimeout(r,4000));}}
await new Promise(r=>setTimeout(r,2500));await rec.stop();await b.close();})();
