import { chromium } from "playwright";
import fs from "node:fs";
const root="http://127.0.0.1:4173/preview-v15.html";
const out="qa/visual-v15";
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const errors=[], results=[];
async function run(width,height,mode="mobile"){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  page.on("pageerror",e=>errors.push({size:width,mode,exception:String(e)}));
  const url=root+"?mode="+mode+"#start_page";
  await page.goto(url,{waitUntil:"networkidle",timeout:30000});
  const shot=async name=>{
    await page.waitForTimeout(250);
    const metrics=await page.evaluate(()=>{
       const active=document.querySelector(location.hash);
       const alignment=selector=>{const el=document.querySelector(selector);return el?getComputedStyle(el).textAlign:"not-rendered";};
       const visible=active?.getBoundingClientRect();
       return {route:location.hash,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,activeWidth:visible?.width,font:getComputedStyle(document.body).fontFamily,activeHeight:visible?.height,align:{start:alignment("#start_page .intro"),letter:alignment(".royal-letter-body.ceremonial-lines"),thesis:alignment(".result-page .result-thesis"),guide:alignment(".result-page .guide-story-scene"),coat:alignment(".provenance-page .coat-field"),portraitTitle:alignment("#dossier_subject_portrait")}};
    });
    results.push({name,width,height,mode,...metrics});
    if(metrics.scrollWidth>metrics.viewport+1) errors.push({name,width,mode,reason:"horizontal overflow",metrics});
    if(name.startsWith("03-dossier")){
      const h=await page.evaluate(()=>{
        const coat=document.getElementById("dossier_subject_coat"), title=document.getElementById("dossier_subject_portrait"), origin=document.getElementById("dossier_subject_origin");
        const font=e=>parseFloat(getComputedStyle(e).fontSize);
        const rect=e=>e.getBoundingClientRect();
        return {coatFont:font(coat),titleFont:font(title),coat:coat.textContent,title:title.textContent,origin:origin.textContent,originWidth:rect(origin).width,bookWidth:rect(document.querySelector(".dossier-cover")).width};
      });
      if(h.titleFont<=h.coatFont+2) errors.push({name,width,mode,reason:"portrait title not clearly dominant",h});
      if(!h.origin) errors.push({name,width,mode,reason:"missing birthplace",h});
    }
    if(["00-start","02-letter","04-portrait","05-provenance"].includes(name)){const align={ "00-start":"start","02-letter":"letter","04-portrait":"thesis","05-provenance":"coat"}[name]; if(metrics.align[align]!=="center")errors.push({name,width,mode,reason:"not center",align:metrics.align});}
    await page.screenshot({path:out+"/"+width+"-"+mode+"-"+name+".png",fullPage:true,animations:"disabled"});
  };
  await shot("00-start");
  await page.locator("#start_quiz").click();
  for(let i=0;i<9;i++)await page.locator("#quiz_answers button").first().click();
  await page.waitForTimeout(150);
  await shot("01-sealed");
  await page.locator("#open_invitation").click();
  await page.locator("#royal_letter").waitFor({state:"visible",timeout:8000});
  await shot("02-letter");
  await page.locator("#enter_kingdom").click();
  await page.locator("#result_portal").waitFor({state:"visible",timeout:5000});
  await shot("03-dossier");
  // Long but catalogue-plausible values are stress-tested, then restored.
  if(mode==="mobile" && [320,390,768].includes(width)){
    await page.evaluate(()=>{
      const m=document.getElementById("dossier_subject_coat"),p=document.getElementById("dossier_subject_portrait"),b=document.getElementById("dossier_subject_origin");
      window.__displayFixture={coat:m.textContent,portrait:p.textContent,birth:b.textContent};
      m.textContent="パステルトビ";
      b.textContent="王都行きの鉄道沿線の町";
      p.textContent="真夜中の小さな時計職人";
    });
    const comprehensive=await page.evaluate(()=>{
      const title=document.getElementById("dossier_subject_portrait");
      const valid=[...document.querySelectorAll("section.result-page .title")].map(x=>x.textContent.trim());
      const prev=title.textContent;
      const overflow=[];
      let maxLines=0;
      for(const candidate of valid){
        title.textContent=candidate;
        const st=getComputedStyle(title);
        const lines=Math.ceil(title.getBoundingClientRect().height/parseFloat(st.lineHeight));
        maxLines=Math.max(maxLines,lines);
        if(title.scrollWidth>title.clientWidth+1 || lines>3) overflow.push({title:candidate,lines,scrollWidth:title.scrollWidth,clientWidth:title.clientWidth});
      }
      title.textContent=prev;
      return {checkedTitles:valid.length,maxLines,overflow,autoPhrase:CSS.supports("word-break","auto-phrase")};
    });
    if(comprehensive.checkedTitles!==24 || comprehensive.overflow.length) errors.push({name:"24-title-stress",width,mode,comprehensive});
    results.push({name:"03-title-sweep",width,mode,...comprehensive});
    await shot("03-dossier-long");
    await page.evaluate(()=>{
      document.getElementById("dossier_subject_coat").textContent=window.__displayFixture.coat;
      document.getElementById("dossier_subject_origin").textContent=window.__displayFixture.birth;
      document.getElementById("dossier_subject_portrait").textContent=window.__displayFixture.portrait;
    });
  }
  if(mode==="mobile" && width===390){
    await page.locator(".invitation-share-toggle").click();
    await page.waitForFunction(()=>document.querySelector("#invitation_share_canvas")?.dataset.ready==="yes",null,{timeout:12000});
    await shot("03-share");
    const data=await page.evaluate(()=>{
      const c=document.getElementById("invitation_share_canvas");
      return {ready:c.dataset.ready,width:c.width,height:c.height,disabled:document.getElementById("dossier_share").disabled};
    });
    if(!data.ready || data.width!==1080 || data.height!==1350 || data.disabled) errors.push({name:"03-share",reason:"invitation image unavailable",data});
  }
  await page.locator("#open_portrait").click();
  await shot("04-portrait");
  await page.goto(url.replace("#start_page","#result_portal"),{waitUntil:"domcontentloaded",timeout:30000});
  await page.locator("#result_portal").waitFor({state:"visible"});
  await page.locator("#open_registration").click();
  await shot("05-provenance");
  await context.close();
}
try{await run(320,640,"mobile");await run(375,667,"mobile");await run(390,844,"mobile");await run(768,1024,"mobile");await run(390,844,"store");}catch(e){errors.push({fatal:String(e),stack:String(e.stack).slice(0,1600)});}
await browser.close();
fs.writeFileSync(out+"/report.json",JSON.stringify({errors,results},null,2));
if(errors.length){console.error(errors);process.exitCode=1;}
console.log(JSON.stringify({errors,results},null,2));
