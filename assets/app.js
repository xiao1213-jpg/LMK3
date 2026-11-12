import {seriesSeal} from './ornaments.js';
import {esc,button,startTemplate,envelopeTemplate,letterTemplate,dossierTemplate,historyTemplate} from './templates.js?v=20261112-ultimate';
import {questionAt} from './questions.js?v=20261112-system-polish';
import {classify,encode,decode,presentedOrder,isLegacyRecord} from './engine.js?v=20261111-independent-draw';
import {freshSeed} from './random.js?v=20261111-independent-draw';
import {invitationSharePayload,invitationCopyText,invitationResultURL} from './sharing.js?v=20261112-ultimate';

const app=document.querySelector('#app');
const params=new URLSearchParams(location.search);
const storeMode=params.get('mode')==='store';
const STORE_IDLE_MS=180_000;
const STORAGE={progress:'lmk6-progress',record:'lmk6-record'};

document.documentElement.dataset.mode=storeMode?'store':'mobile';
if(storeMode)document.querySelector('.brand')?.insertAdjacentHTML('beforeend','<small>ROYAL RECEPTION DESK</small>');

let worldLoader,portraitLoader,diagnosisLoader,storyLoader,heritageLoader,rarityLoader,qrLoader;
const loadWorld=()=>worldLoader??=import('./world.js?v=20261112-geography-v12').catch(error=>{worldLoader=null;throw error;});
const loadPortraits=()=>portraitLoader??=import('./portraits.js?v=20261110-editorial').catch(error=>{portraitLoader=null;throw error;});
const loadDiagnoses=()=>diagnosisLoader??=import('./diagnoses.js?v=20261110-content').catch(error=>{diagnosisLoader=null;throw error;});
const loadStories=()=>storyLoader??=import('./stories.js?v=20261110-content').catch(error=>{storyLoader=null;throw error;});
const loadHeritage=()=>heritageLoader??=import('./heritage.js?v=20261110-lineage-records').catch(error=>{heritageLoader=null;throw error;});
const loadRarity=()=>rarityLoader??=import('./rarity.js?v=20261112-geography-v12').catch(error=>{rarityLoader=null;throw error;});
const preloadResults=()=>Promise.all([loadWorld(),loadPortraits()]);

const independentSeed=other=>{const value=freshSeed();return value===other?(value+0x9e3779b9)>>>0:value;};
let answers=Array(6).fill(undefined);
let seed=freshSeed();
let provenanceSeed=independentSeed(seed);
let cursor=0,record=null,idleTimer;

function storageGet(key,persistent=false){try{return (persistent?localStorage:sessionStorage).getItem(key);}catch{return null;}}
function storageSet(key,value,persistent=false){try{(persistent?localStorage:sessionStorage).setItem(key,value);}catch{}}
function storageRemove(key,persistent=false){try{(persistent?localStorage:sessionStorage).removeItem(key);}catch{}}
function clearSession(){storageRemove(STORAGE.progress);storageRemove(STORAGE.record);}
function go(route){if(location.hash===`#${route}`)render();else location.hash=route;}
function on(id,handler){document.getElementById(id)?.addEventListener('click',handler);}

function armIdleReset(){
  clearTimeout(idleTimer);
  if(!storeMode||!location.hash||location.hash==='#start')return;
  idleTimer=setTimeout(()=>{record=null;clearSession();go('start');},STORE_IDLE_MS);
}

function shell(content,className=''){
  app.innerHTML=`<article class="sheet ${className}">${content}</article>`;
  window.scrollTo({top:0,behavior:'auto'});
  const heading=app.querySelector('h1');
  if(heading){
    heading.tabIndex=-1;
    heading.classList.add('route-heading');
    document.title=`${heading.textContent.trim()}｜リトル・ミュー王国`;
    requestAnimationFrame(()=>heading.focus({preventScroll:true}));
  }
  armIdleReset();
}

for(const eventName of ['pointerdown','keydown','scroll'])window.addEventListener(eventName,()=>{if(storeMode)armIdleReset();},{passive:true});

function restart(){
  answers=Array(6).fill(undefined);
  seed=freshSeed();
  provenanceSeed=independentSeed(seed);
  cursor=0;
  record=null;
  clearSession();
  go('quiz');
}

function rememberProgress(){
  storageSet(STORAGE.progress,JSON.stringify({answers:answers.map(value=>value===undefined?null:value),seed,provenanceSeed,cursor}));
}

function saveRecord(){
  const value=JSON.stringify(record);
  storageSet(STORAGE.record,value);
  if(!storeMode)storageSet(STORAGE.record,value,true);
}

function start(){shell(startTemplate(storeMode),'cover opening');on('begin',restart);}

function quiz(){
  const question=questionAt(cursor,answers,seed);
  const order=presentedOrder(cursor,seed);
  const cut=question.scene.lastIndexOf('。');
  const context=cut>=0?question.scene.slice(0,cut+1):'';
  const prompt=cut>=0?question.scene.slice(cut+1):question.scene;
  const choices=order.map((value,index)=>`<button type="button" data-value="${value}" class="choice ${answers[cursor]===value?'selected':''}" aria-pressed="${answers[cursor]===value}"><span class="choice-letter">${index?'B':'A'}</span><span>${esc(value?question.b:question.a)}</span></button>`).join('');

  shell(`<div class="question-top"><span>第${cursor+1}問 / 6</span>${cursor?button('back','ひとつ戻る','text-button'):''}</div><div class="progress" role="progressbar" aria-label="診断の進み具合" aria-valuemin="1" aria-valuemax="6" aria-valuenow="${cursor+1}"><span style="width:${(cursor+1)/6*100}%"></span></div><p class="eyebrow">A MOMENT IN THE KINGDOM</p>${context?`<p class="question-scene">${esc(context)}</p>`:''}<h1 class="question">${esc(prompt)}</h1><div class="choices" role="group" aria-label="二つの選択肢">${choices}</div>${button('next',cursor===5?'招待状を受け取る':'次の問いへ')}<p class="fine">どちらもよくても、今少し心が向く方を。<br>選んだ答えをたどり、あなた宛ての招待状へ。</p>`,'quiz');

  const nextButton=document.querySelector('#next');
  nextButton.disabled=answers[cursor]===undefined;
  app.querySelectorAll('[data-value]').forEach(choice=>choice.addEventListener('click',()=>{
    const value=Number(choice.dataset.value);
    if(cursor<2&&answers[cursor]!==value)for(let index=cursor+1;index<3;index++)answers[index]=undefined;
    answers[cursor]=value;
    rememberProgress();
    app.querySelectorAll('[data-value]').forEach(element=>{
      const selected=Number(element.dataset.value)===value;
      element.classList.toggle('selected',selected);
      element.setAttribute('aria-pressed',String(selected));
    });
    nextButton.disabled=false;
  }));
  on('back',()=>{cursor--;rememberProgress();quiz();});
  on('next',()=>{
    if(cursor<5){cursor++;rememberProgress();quiz();return;}
    record={answers:[...answers],seed,provenanceSeed};
    saveRecord();
    void preloadResults().catch(()=>{});
    go('letter');
  });
}

function result(){return classify(record.answers,record.seed);}
function portrait(portraits){return portraits.find(item=>item.id===result().id);}
function openedLetter(){shell(letterTemplate(),'royal-letter');on('receive',()=>go('dossier'));}
function letter(){shell(envelopeTemplate(),'cover arrival');on('unseal',openedLetter);}
function resultURL(){return invitationResultURL(location.href,encode(record));}

function loadQRCode(){
  if(globalThis.QRCode)return Promise.resolve();
  if(!qrLoader)qrLoader=new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=new URL('./qrcode.min.js',import.meta.url);
    script.onload=resolve;
    script.onerror=()=>{qrLoader=null;reject(Error('QR library failed to load'));};
    document.head.append(script);
  });
  return qrLoader;
}

async function renderQRCode(target){
  if(!target)return;
  try{
    await loadQRCode();
    target.replaceChildren();
    new QRCode(target,{text:resultURL(),width:220,height:220,colorDark:'#414638',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
    target.dataset.ready='true';
  }catch{target.textContent='QRコードを表示できませんでした。画面を再読み込みしてください。';}
}

async function dossier(){
  const [{generateProvenance},{portraits}]=await Promise.all([loadWorld(),loadPortraits()]);
  if(location.hash!=='#dossier'||!record)return;
  const provenance=generateProvenance(record.provenanceSeed);
  const selectedPortrait=portrait(portraits);
  shell(dossierTemplate(provenance,selectedPortrait,storeMode),`dossier theme-${selectedPortrait.series}`);
  on('read',()=>go('portrait'));
  on('history',()=>go('history'));
  on('again',()=>{if(storeMode){record=null;clearSession();}go('start');});
  if(storeMode)void renderQRCode(document.querySelector('#qr'));
  on('copy',copyInvitation);
  on('share',shareInvitation);
}

function setStatus(message){const status=document.querySelector('#status');if(status)status.textContent=message;}

async function shareInvitation(){
  try{
    if(navigator.share)await navigator.share(invitationSharePayload(resultURL()));
    else await copyInvitation();
  }catch(error){if(error.name!=='AbortError')setStatus('共有できませんでした。招待状のリンクをコピーしてお試しください。');}
}

async function copyInvitation(){
  try{
    await navigator.clipboard.writeText(invitationCopyText(resultURL()));
    setStatus('招待状の文とリンクをコピーしました。');
  }catch{
    const status=document.querySelector('#status');
    if(status)status.innerHTML=`リンクを長押ししてコピーできます。<br><a href="${esc(resultURL())}">私に届いた招待状をひらく</a>`;
  }
}

function nav(){return `<nav class="tabs" aria-label="記録の切り替え"><a href="#portrait" ${location.hash==='#portrait'?'aria-current="page"':''}>心象肖像</a><a href="#history" ${location.hash==='#history'?'aria-current="page"':''}>王国来歴証</a></nav>`;}

async function portraitPage(){
  const [{portraits},{diagnoses},{stories}]=await Promise.all([loadPortraits(),loadDiagnoses(),loadStories()]);
  if(location.hash!=='#portrait'||!record)return;
  const selectedPortrait=portrait(portraits);
  if(!selectedPortrait){go('dossier');return;}
  const diagnosis=diagnoses[selectedPortrait.id],story=stories[selectedPortrait.id];
  shell(`${nav()}<p class="eyebrow">ROYAL PORTRAIT GALLERY</p><p class="collection">${seriesSeal(selectedPortrait.series)}<span><small>心象肖像集</small><b>${esc(selectedPortrait.category)}</b></span></p><figure class="art"><img src="assets/${selectedPortrait.series}.webp" alt="心象肖像集を彩る挿絵"></figure><p class="label center">あなたの心象肖像</p><h1 class="portrait-title">${esc(selectedPortrait.title)}</h1><p class="diagnosis-lead">${esc(diagnosis.lead)}</p><div class="diagnosis-body">${diagnosis.paragraphs.map(text=>`<p>${esc(text)}</p>`).join('')}</div><section class="guide"><p class="eyebrow">A CAT TO MEET</p><p class="label center">この心象肖像にゆかりのある猫</p><p class="guide-number">No.${String(story.number).padStart(2,'0')}</p><h2>${esc(story.name)}</h2><p class="guide-story">${story.lines.map(line=>`<span>${esc(line)}</span>`).join('')}</p></section><section class="selection"><p class="eyebrow">LITTLE MEW SELECTION</p><p class="label">この一枚に似合うもの</p><p>${esc(selectedPortrait.goods)}</p></section>${button('dossier','一件簿に戻る')}`,`portrait theme-${selectedPortrait.series}`);
  on('dossier',()=>go('dossier'));
}

async function historyPage(){
  const [{generateProvenance},{rarity},{describeLineage}]=await Promise.all([loadWorld(),loadRarity(),loadHeritage()]);
  if(location.hash!=='#history'||!record)return;
  const provenance=generateProvenance(record.provenanceSeed),tier=rarity[provenance.tier],house=describeLineage(provenance);
  shell(historyTemplate(provenance,tier,provenance.familyScene,nav(),house),'provenance');
  on('dossier',()=>go('dossier'));
  on('find-family',()=>document.getElementById('family-entry').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
}

function method(){
  shell(`<p class="eyebrow">ABOUT THE PORTRAITS</p><h1>心象肖像について</h1><p class="body">六つの小さな場面を通じて、24の心象肖像から、あなたに重なる一枚を選びます。</p><p class="body">最初の二問は「時間の物語・誰かの想い・暮らしの楽しみ」への関心を比べ、第三問では残った二つを比べます。後半の三問では、受け継いだものの楽しみ方、美しさの見つめ方、喜びの味わい方を一つずつ尋ねます。</p><p class="body">答えに応じて進む分岐式なので、すべての道筋で必ず一つの心象肖像に決まります。点数の同率を抽選で解消する方式は使っていません。</p><p class="body">質問紙設計の原則を参考にしていますが、六問で人格全体や傾向の強さを測れるわけではありません。LMK独自の質問・分類は、実際の回答者による信頼性・妥当性の検証前です。物語との出会いを楽しむ、短い好みの案内です。</p><p class="body">最初の比較と選択肢の表示順は入れ替わります。関心が場面によって変わる方は、別の回で異なる一枚に出会うこともあります。</p><p class="body">王国来歴証は、六つの答えとは別に授けられます。毛色、100の出生地、地方ごとの家、家伝品が組み合わさり、ごく稀に地図の外の特殊出生地《コホーリア》が記されます。同じ一件簿を開き直したときは、同じ来歴が残ります。</p><p class="body">星は身分の高さではなく、王国の奇譚にどれほど近い来歴かを表します。毛色の珍しさ、土地に残る伝承、家の習わし、家伝品を別々に見て、土地と家伝の主題が重なれば「縁」として加えます。四つ星になるのは、四つの要素すべてにしるしがあり、十分に深く重なった場合だけです。</p><p class="body">職業、財産、住所の格式、爵位の種類は星を増やしません。爵位家は家印や家伝品の装いで個性を表し、奇譚度とは別に楽しめます。また、全要素の組み合わせ自体が珍しい場合は、星とは分けて短い一文でお知らせします。心象肖像にある身分や職業も、実際の家柄を意味しません。</p><p class="fine">参考：<a href="https://www.pewresearch.org/writing-survey-questions/">Pew Research Center：質問紙の設計</a> ／ <a href="https://www.cdc.gov/nchs/ccqder/question-evaluation/cognitive-interviewing.html">CDC：認知インタビュー</a></p>${button('home','王国の入口へ')}`);
  on('home',()=>go('start'));
}

function routeError(route){return ()=>{if(location.hash===`#${route}`&&!app.querySelector('.route-error'))shell('<h1 class="route-error">記録を開けませんでした。</h1><p class="body">通信をお確かめのうえ、もう一度お試しください。</p><a href="#start">王国の入口へ</a>');};}

function render(){
  const route=location.hash.slice(1)||'start';
  if(route.startsWith('record=')){
    const token=route.slice(7);
    if(isLegacyRecord(token)){location.replace(`archive-nine/index.html${location.search}${location.hash}`);return;}
    const decoded=decode(token);
    if(!decoded){shell('<h1>一件簿を開けませんでした。</h1><p class="body">リンクが途中で切れていないかお確かめください。</p><a href="#start">王国の入口へ</a>');return;}
    record=decoded;
    saveRecord();
    history.replaceState(null,'','#letter');
    openedLetter();
    return;
  }
  if(['letter','dossier','portrait','history'].includes(route)&&!record){go('start');return;}
  if(route==='quiz')quiz();
  else if(route==='letter')letter();
  else if(route==='dossier')void dossier().catch(routeError('dossier'));
  else if(route==='portrait')void portraitPage().catch(routeError('portrait'));
  else if(route==='history')void historyPage().catch(routeError('history'));
  else if(route==='method')method();
  else start();
}

function restoreState(){
  try{
    const savedRecord=storageGet(STORAGE.record)||(!storeMode&&storageGet(STORAGE.record,true));
    if(savedRecord)record=decode(encode(JSON.parse(savedRecord)));
    const progress=JSON.parse(storageGet(STORAGE.progress));
    const valid=progress&&Array.isArray(progress.answers)&&progress.answers.length===6&&progress.answers.every(value=>value===null||value===0||value===1)&&Number.isInteger(progress.cursor)&&progress.cursor>=0&&progress.cursor<6&&Number.isInteger(progress.seed)&&progress.seed>=0&&progress.seed<=0xffffffff;
    if(valid){
      answers=progress.answers.map(value=>value===null?undefined:value);
      seed=progress.seed;
      provenanceSeed=Number.isInteger(progress.provenanceSeed)&&progress.provenanceSeed>=0&&progress.provenanceSeed<=0xffffffff?progress.provenanceSeed:progress.seed;
      cursor=progress.cursor;
    }
  }catch{}
}

restoreState();
if(/^#(?:invitation_page|result_|provenance_page)/.test(location.hash))location.replace(`preview-v15.html${location.search}${location.hash}`);
else{window.addEventListener('hashchange',render);render();}
