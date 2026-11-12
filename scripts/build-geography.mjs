import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dataPath=path.join(root,'data','geography-v12.json');
const outputPath=path.join(root,'assets','geography.js');
const source=JSON.parse(await readFile(dataPath,'utf8'));

const regionIds={
  'ノースフェル':'northfell','ベルメア':'bellmere','ローズウィック':'rosewick',
  'ブランブルシャー':'brambleshire','クラウンシャー':'crownshire',
  'ホワイトクリフ':'whitecliff','ミューミンスター':'mewminster'
};

// Global numbers are deliberately stable. They keep existing seeds tied to the
// same regional slot even when the workbook is reordered.
const regionOffsets={northfell:0,bellmere:14,rosewick:28,brambleshire:42,crownshire:56,whitecliff:70,mewminster:84};
const regionGeography={
  northfell:{id:'northfell',name:'ノースフェル地方',description:'雪をいただく山々と高原の地方。短い夏には草地を風が渡り、冬の夜には空いっぱいの星が近く感じられます。'},
  bellmere:{id:'bellmere',name:'ベルメア地方',description:'島の中央に大小の湖を抱く、六地方で唯一海に面しない土地。湖を囲む丘には果樹園が続き、秋には実りと水面の色が重なります。'},
  rosewick:{id:'rosewick',name:'ローズウィック地方',description:'野薔薇の丘と古い村々の地方。森の小径や井戸、山あいの集落に昔話が残り、大学街ウィッチフォードでは土地の記憶を訪ねる研究が続いています。'},
  brambleshire:{id:'brambleshire',name:'ブランブルシャー地方',description:'大森林と丘、細い沢が連なる地方。森と町の境には《ふたつの冠》の記憶が残り、古くから武芸と木の仕事が受け継がれています。'},
  crownshire:{id:'crownshire',name:'クラウンシャー地方',description:'空が大きく開けた王都周辺の田園地方。街道と鉄道は市場町や学校、港をつなぎながら、やがてミューミンスターへ集まります。'},
  whitecliff:{id:'whitecliff',name:'ホワイトクリフ地方',description:'白亜の断崖と乾いた丘、泉の谷が海へ続く東の地方。ソルト・ヘイブンを通じて、海の向こうの文化が最も近く届きます。'},
  mewminster:{id:'mewminster',name:'ミューミンスター特別区',description:'クラウンシャーのただ中にありながら、どの地方にも属さない王都特別区。宮殿、学術街、住宅街、商業街、芸術街が重なります。'}
};

// P is the workbook's mystery depth, not wealth or prestige. Tags only express
// the authored mystery and are used for thematic resonance with household lore.
const tags={
  'ホワイトクリフ/1':['聖史','導き'],'ホワイトクリフ/3':['聖史','自然'],'ホワイトクリフ/4':['記憶','境界'],
  'ベルメア/2':['季節','祝福'],'ベルメア/3':['季節','記憶'],'ベルメア/14':['境界','導き'],
  'ローズウィック/1':['自然','境界'],'ローズウィック/12':['記憶','境界'],'ローズウィック/14':['自然','記憶'],
  'ブランブルシャー/4':['記憶','聖史'],'ブランブルシャー/7':['聖史','記憶'],'ブランブルシャー/13':['自然','記憶'],
  'ノースフェル/1':['天象','季節'],'ノースフェル/2':['導き','記憶'],'ノースフェル/3':['天象','季節'],'ノースフェル/14':['自然','境界'],
  'クラウンシャー/11':['記憶','境界'],'ミューミンスター/6':['聖史','記憶'],
  '特殊出生地/EX':['境界','導き']
};

const normal=source.records.filter(record=>record.status==='確定');
const specialRows=source.records.filter(record=>record.status==='特殊枠');
if(normal.length!==100)throw Error(`Expected 100 confirmed birthplaces, got ${normal.length}`);
if(specialRows.length!==1)throw Error(`Expected one special birthplace, got ${specialRows.length}`);
for(const record of source.records){
  if(!record.region||record.localNumber===undefined||!record.name||!record.core||!record.description)throw Error(`Incomplete birthplace record: ${JSON.stringify(record)}`);
  if(![0,1,2].includes(record.mystique))throw Error(`Invalid mystery depth: ${record.region}/${record.localNumber}`);
}

const seenSlots=new Set();
const places=normal.map(record=>{
  const regionId=regionIds[record.region];
  if(!regionId)throw Error(`Unknown region: ${record.region}`);
  const slot=`${record.region}/${record.localNumber}`;
  if(seenSlots.has(slot))throw Error(`Duplicate regional slot: ${slot}`);
  seenSlots.add(slot);
  const placeTags=tags[slot]||[];
  if((record.mystique===0)!==(placeTags.length===0))throw Error(`Mystique/tag mismatch: ${slot}`);
  return {
    number:regionOffsets[regionId]+record.localNumber,
    localNumber:record.localNumber,regionId,name:record.name,legend:record.description,
    mystique:record.mystique,tags:placeTags,basis:record.core,kind:'確定地'
  };
}).sort((a,b)=>a.number-b.number);

if(places.some((place,index)=>place.number!==index+1))throw Error('Global birthplace numbering is incomplete');
const regionCounts=Object.fromEntries(Object.keys(regionOffsets).map(regionId=>[regionId,places.filter(place=>place.regionId===regionId).length]));
for(const [regionId,count] of Object.entries(regionCounts))if(count!==(regionId==='mewminster'?16:14))throw Error(`Unexpected region count: ${regionId}/${count}`);
const counts=Object.fromEntries([0,1,2].map(level=>[level,places.filter(place=>place.mystique===level).length]));
if(JSON.stringify(counts)!==JSON.stringify({0:82,1:13,2:5}))throw Error(`Unexpected P distribution: ${JSON.stringify(counts)}`);

const specialRecord=specialRows[0];
const special={
  number:'EX',localNumber:'EX',regionId:'special',name:specialRecord.name,legend:specialRecord.description,
  mystique:specialRecord.mystique,tags:tags['特殊出生地/EX'],basis:specialRecord.core,kind:'特殊出生地',
  regionName:'どの地図にもない場所',
  regionDescription:'王国のどの地図にも記されず、遠く離れた猫たちが再び出会うと伝えられる、境界の向こうの場所です。',
  replacementRate:.004
};

const derivedHash=createHash('sha256').update(JSON.stringify(source.records)).digest('hex');
const js=value=>JSON.stringify(value);
const output=`// Generated from data/geography-v12.json by scripts/build-geography.mjs.\n// Do not hand-edit this file. P measures mystery depth, never social standing.\nexport const GEOGRAPHY_SOURCE=${js({...source.source,derivedSha256:derivedHash})};\nexport const REGION_GEOGRAPHY=${js(regionGeography)};\nexport const BIRTHPLACES=${js(places)};\nexport const SPECIAL_BIRTHPLACE=${js(special)};\nexport const BIRTHPLACES_BY_REGION=Object.freeze(Object.groupBy?Object.groupBy(BIRTHPLACES,place=>place.regionId):BIRTHPLACES.reduce((all,place)=>((all[place.regionId]??=[]).push(place),all),{}));\n`;
await writeFile(outputPath,output);
console.log(JSON.stringify({output:path.relative(root,outputPath),normal:places.length,special:special.name,regions:regionCounts,mystique:counts}));
