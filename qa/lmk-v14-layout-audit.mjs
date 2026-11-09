import { chromium } from "playwright";
import fs from "node:fs";
const root="http://127.0.0.1:4173/preview-v14.html?mode=mobile#start_page";
const notes=fs.readFileSync("assets/kingdom-notes-v12.js","utf8");
const catalog=JSON.parse(notes.slice(notes.indexOf("=")+1).trim().replace(/;\s*$/,""));
const base=["セント・ミルク宮殿に近い住宅街","王都ミューミンスターの学術街","アヴェル川沿いのロウ・キーズ","アヴェル川に近い小さな住宅街","王都行きの鉄道沿線の町","サンミア湖畔の果樹園地帯"];
const places=[...new Set([...base,...Object.values(catalog.additionalBirthplaces).flatMap(a=>a.map(p=>p[0]))])];
const coats=["キジトラ","キジシロ","チャトラ","チャシロ","サバトラ","サバシロ","クロ","シロ","グレー","グレーシロ","ハチワレ","ミケ","サビ","ムギワラ","クリーム","ポイント","シミツキ","パステルトビ"];
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const report={cases:[],issues:[],notes:"Typography stress audit. This does not change quiz or population."};
for(const width of [320,375,390,768]){
 const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1});
 const page=await context.newPage();
 page.on("pageerror",e=>report.issues.push({width,error:String(e)}));
 await page.goto(root,{waitUntil:"networkidle"});
 await page.locator("#start_quiz").click();
 for(let i=0;i<9;i++)await page.locator("#quiz_answers button").first().click();
 await page.locator("#open_invitation").click();
 await page.locator("#enter_kingdom").click();
 const titles=await page.locator("section.result-page h1.title").allTextContents();
 const batch=await page.evaluate(({coats,places,titles})=>{
  const subject=document.querySelector(".dossier-subject");
  const nodes={coat:subject.querySelector("strong"),origin:subject.querySelector(".dossier-subject-origin"),tag:subject.querySelector(".dossier-place-tag"),title:subject.querySelector("b")};
  const splitLines=el=>{
   const node=el.firstChild;if(!node||node.nodeType!==3)return [];
   const rng=document.createRange(),groups=new Map();
   for(let i=0;i<node.textContent.length;i++){
    rng.setStart(node,i);rng.setEnd(node,i+1);
    const rect=rng.getBoundingClientRect();
    const key=Math.round(rect.top/2)*2;
    groups.set(key,(groups.get(key)||"")+node.textContent[i]);
   }
   return [...groups.values()];
  };
  function test(kind,inputs){
   const el=nodes[kind];const orig=el.textContent;const computed=getComputedStyle(el);const results=[];
   for(const str of inputs){
    el.textContent=str;
    const lines=splitLines(el);
    const rect=el.getBoundingClientRect(),s=subject.getBoundingClientRect();
    results.push({value:str,fontSize:computed.fontSize,lines,lineCount:lines.length,lastLine:lines.at(-1)?.length||0,
      centerOffset:+((rect.left+rect.width/2)-(s.left+s.width/2)).toFixed(2),width:rect.width});
   }
   el.textContent=orig;return results;
  }
  return {coat:test("coat",coats),title:test("title",titles.map(t=>"《"+t+"》")),origin:test("origin",places.map(x=>x+"に生まれた猫")),
    proposedTitle:test("title",titles),proposedOrigin:test("origin",places),
    single:{preface:document.querySelector(".dossier-preface").innerText,subjectPadding:getComputedStyle(subject).padding,frameWidth:subject.getBoundingClientRect().width,
      title:document.querySelector(".dossier-cover .portal-heading").getBoundingClientRect().height}};
 },{coats,places,titles});
 report.cases.push({width,data:batch});
 await context.close();
}
await browser.close();
const summary=report.cases.map(({width,data})=>({
 width,subjectWidth:data.single.frameWidth,padding:data.single.subjectPadding,
 fonts:{coat:data.coat[0].fontSize,title:data.title[0].fontSize,origin:data.origin[0].fontSize},
 wrapCounts:{coat:data.coat.filter(x=>x.lineCount>1).length,title:data.title.filter(x=>x.lineCount>1).length,origin:data.origin.filter(x=>x.lineCount>1).length,proposedTitle:data.proposedTitle.filter(x=>x.lineCount>1).length,proposedOrigin:data.proposedOrigin.filter(x=>x.lineCount>1).length},
 orphanOrigins:data.origin.filter(x=>x.lineCount>1&&x.lastLine<=4).map(x=>({v:x.value,lines:x.lines})).slice(0,16),
 maxOriginLines:Math.max(...data.origin.map(x=>x.lineCount)),
 maxTitleLines:Math.max(...data.title.map(x=>x.lineCount)),
 samples:{coat:data.coat.find(x=>x.value==="ハチワレ"),title:data.title.find(x=>x.value==="《暦を守る猫》"),
 longestOrigins:data.origin.toSorted((a,b)=>b.value.length-a.value.length).slice(0,4)}
 }));
fs.mkdirSync("qa/audit-v14",{recursive:true});fs.writeFileSync("qa/audit-v14/report.json",JSON.stringify({summary,full:report},null,2));
console.log(JSON.stringify(summary,null,2));
