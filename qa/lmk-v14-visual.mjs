import { chromium } from "playwright";
import fs from "node:fs";
const root="http://127.0.0.1:4173/preview-v14.html";
const out="qa/visual-v14";
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
       const visible=active?.getBoundingClientRect();
       return {route:location.hash,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,activeWidth:visible?.width,font:getComputedStyle(document.body).fontFamily,activeHeight:visible?.height,align:{start:getComputedStyle(document.querySelector("#start_page .intro")).textAlign,letter:getComputedStyle(document.querySelector(".royal-letter-body.ceremonial-lines")).textAlign,thesis:getComputedStyle(document.querySelector(".result-page .result-thesis")).textAlign,guide:getComputedStyle(document.querySelector(".result-page .guide-story-scene")||document.querySelector(".guide-story-heading")).textAlign,coat:getComputedStyle(document.querySelector(".provenance-page .coat-field")).textAlign}};
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
