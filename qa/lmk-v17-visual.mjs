import { chromium } from "playwright";
import fs from "node:fs";
const root="http://127.0.0.1:4173/preview-v17.html";
const out="qa/visual-v17";
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
       return {route:location.hash,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,activeWidth:visible?.width,font:getComputedStyle(document.body).fontFamily,activeHeight:visible?.height,align:{start:alignment("#start_page .intro"),letter:alignment(".royal-letter-body.ceremonial-lines"),thesis:alignment(".result-page .result-thesis"),guide:alignment(".result-page .guide-story-scene"),coat:alignment(".provenance-page .coat-field")}};
    });
    results.push({name,width,height,mode,...metrics});
    if(metrics.scrollWidth>metrics.viewport+1) errors.push({name,width,mode,reason:"horizontal overflow",metrics});
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
  const stress=await page.evaluate(()=>{
    const coat=document.getElementById("dossier_subject_coat");
    const place=document.getElementById("dossier_subject_origin");
    const title=document.getElementById("dossier_subject_portrait");
    const original={coat:coat.textContent,place:place.textContent,title:title.textContent};
    const subjects=[...document.querySelectorAll(".result-page h1.title")].map(x=>x.textContent.trim());
    const places=Object.values(window.LMK_KINGDOM_NOTES_V12?.additionalBirthplaces||{}).flat().map(x=>x[0]);
    places.push("王都行きの鉄道沿線の町","オールド・ミンスター","星空の開ける高原の集落");
    const checks=[];
    const check=(kind,value,el)=>{
      el.textContent=value;
      const box=el.getBoundingClientRect();
      checks.push({kind,value,clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,height:box.height,font:getComputedStyle(el).fontSize});
    };
    for(const v of subjects)check("portrait",v,title);
    for(const v of places)check("birthplace",v,place);
    for(const v of ["ハチワレ","パステルトビ","グレーシロ"])check("coat",v,coat);
    const widest=[...checks].sort((a,b)=>b.height-a.height).slice(0,8);
    const overflow=checks.filter(x=>x.scrollWidth>x.clientWidth+1);
    coat.textContent=original.coat;place.textContent=original.place;title.textContent=original.title;
    return {total:checks.length,overflow,widest};
  });
  results.push({name:"03-typographic-stress",width,height,mode,...stress});
  if(stress.overflow.length)errors.push({name:"03-typographic-stress",width,height,mode,reason:"label overflow",detail:stress.overflow.slice(0,10)});
  const hierarchy=await page.evaluate(()=>{
    const p=document.querySelector(".result-portal");
    const size=selector=>{const node=p.querySelector(selector);return node?parseFloat(getComputedStyle(node).fontSize):0;};
    return {headline:size(".portal-heading"),coat:size("#dossier_subject_coat"),toc:size(".dossier-entry-text strong"),portrait:size("#dossier_subject_portrait"),
      titlesOnCover:p.querySelectorAll("h1").length,methodInitiallyCollapsed:!p.querySelector(".dossier-v17-method")?.open,
      shareInitiallyCollapsed:!p.querySelector(".invitation-share-disclosure")?.open};
  });
  results.push({name:"03-hierarchy",width,height,mode,...hierarchy});
  if(!(hierarchy.headline>hierarchy.coat&&hierarchy.coat>hierarchy.toc&&hierarchy.toc>hierarchy.portrait&&hierarchy.titlesOnCover===1&&hierarchy.methodInitiallyCollapsed&&hierarchy.shareInitiallyCollapsed))
    errors.push({name:"03-hierarchy",width,height,mode,reason:"hierarchy failure",hierarchy});
  await page.evaluate(()=>{
    document.getElementById("dossier_subject_coat").textContent="パステルトビ";
    document.getElementById("dossier_subject_origin").textContent="王都行きの鉄道沿線の町";
    document.getElementById("dossier_subject_portrait").textContent="秘密の茶会へ招かれた猫";
  });
  await shot("03-stress-long");
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#result_portal").waitFor({state:"visible"});

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
