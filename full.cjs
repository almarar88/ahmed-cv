const P=require('/workspace/alcode_mag/tools-verify/node_modules/puppeteer-core');const {execSync}=require('child_process');
(async()=>{const b=await P.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
for(const w of [1440,390])for(const th of ['light','dark']){const p=await b.newPage();await p.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
await p.evaluateOnNewDocument(t=>localStorage.setItem('aam-theme',t),th);const vh=900;await p.setViewport({width:w,height:vh});await p.goto('http://127.0.0.1:4877/',{waitUntil:'networkidle0'});
await p.addStyleTag({content:'.topbar{position:relative!important}.progress{display:none}'});await new Promise(r=>setTimeout(r,600));
const H=await p.evaluate(()=>document.documentElement.scrollHeight);const parts=[];
for(let y=0,i=0;y<H;y+=vh,i++){await p.evaluate(y=>scrollTo(0,y),y);await new Promise(r=>setTimeout(r,250));const f=`/workspace/ahmed_cv/screens/_t${i}.png`;
 const real=await p.evaluate(()=>scrollY);await p.screenshot({path:f});parts.push([f,y-real]);}
require('fs').writeFileSync('/workspace/ahmed_cv/screens/_parts.json',JSON.stringify({w,H,vh,parts}));
execSync(`python3 -c "
import json;from PIL import Image
d=json.load(open('/workspace/ahmed_cv/screens/_parts.json'));o=Image.new('RGB',(d['w'],d['H']))
for i,(f,off) in enumerate(d['parts']):
  im=Image.open(f);y=i*d['vh'];o.paste(im.crop((0,off,d['w'],d['vh'])),(0,y))
o.save('/workspace/ahmed_cv/screens/v4-full-${w}-${th}.png')"`);await p.close();}
await b.close();execSync('rm -f /workspace/ahmed_cv/screens/_t*.png /workspace/ahmed_cv/screens/_parts.json')})();
