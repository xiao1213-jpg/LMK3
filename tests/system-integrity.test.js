import assert from 'node:assert/strict';
import fs from 'node:fs';
import {portraits} from '../assets/portraits.js';
import {stories} from '../assets/stories.js';
import {diagnoses} from '../assets/diagnoses.js';
import {BIRTHPLACES_BY_REGION,SPECIAL_BIRTHPLACE} from '../assets/geography.js';
import {HOUSEHOLD_PROFILES} from '../assets/households.js';
import {describeLineage} from '../assets/heritage.js';
import {dossierTemplate,historyTemplate} from '../assets/templates.js';

const revision='20261121-final';
const activeFiles=['index.html','privacy.html','assets/app.js','assets/engine.js','assets/templates.js','assets/world.js'];
for(const file of activeFiles){
  const source=fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8');
  const revisions=[...source.matchAll(/\.js\?v=([\w-]+)/g),...source.matchAll(/\.css\?v=([\w-]+)/g)].map(match=>match[1]);
  assert(revisions.length>0,`${file} must revision its active assets`);
  assert(revisions.every(value=>value===revision),`${file} has a stale transitive asset revision`);
}

const css=fs.readFileSync(new URL('../assets/design.css',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
assert(!css.includes('!important'),'the production stylesheet must not depend on override stacking');
assert.match(css,/env\(safe-area-inset-left\)/,'safe areas must be respected');
assert.match(app,/saveRecord\(false\)/,'received invitations must not replace a local saved result');
assert.match(app,/visibilitychange/,'store expiry must be checked after backgrounding');
assert.match(app,/letter\(\);\s*return;/,'shared invitations must begin at the sealed letter');
assert.match(app,/role="radiogroup"/,'the two answers must expose single-choice semantics');
assert.match(app,/aria-checked=/,'each answer must expose its selected state');
const restartSource=app.slice(app.indexOf('function restart()'),app.indexOf('function rememberProgress()'));
assert(!restartSource.includes('storageRemove(STORAGE.record,true)'),'starting again must not erase the last completed result');

assert.equal(portraits.length,24);
assert.equal(Object.keys(stories).length,24);
assert.equal(Object.keys(diagnoses).length,24);
for(const portrait of portraits){
  assert(stories[portrait.id],`missing story for ${portrait.id}`);
  assert(diagnoses[portrait.id],`missing diagnosis for ${portrait.id}`);
}

const birthplaces=[...Object.values(BIRTHPLACES_BY_REGION).flat(),SPECIAL_BIRTHPLACE];
const households=Object.values(HOUSEHOLD_PROFILES).flat();
const nobleHouses=[];
for(const rank of ['男爵','子爵','伯爵','侯爵','公爵'])for(let houseIndex=0;houseIndex<20;houseIndex++)nobleHouses.push(describeLineage({rank,houseIndex,regionId:'mewminster'}));
assert.equal(birthplaces.length,101);
assert.equal(households.length,105);
assert.equal(nobleHouses.length,100);

const unsafe=value=>/[<>]/.test(String(value));
const authoredStrings=[
  ...birthplaces.flatMap(place=>[place.name,place.legend]),
  ...households.flatMap(profile=>[profile.family,profile.story,...profile.items]),
  ...nobleHouses.flatMap(house=>[house.name,house.motto,house.story,house.regionalNote,house.heirloom,house.detail])
];
assert(!authoredStrings.some(unsafe),'catalogue text must not contain raw markup');

const attack='<img src=x onerror=alert(1)>';
const maliciousRecord={registry:attack,coat:attack,birthplace:attack,coatEpithet:attack,region:attack,regionDescription:attack,placeLegend:attack,mystiqueLabel:attack,combinationNote:attack};
const maliciousPortrait={series:'rebel',title:attack};
const maliciousTier={count:1,stars:'★☆☆☆',label:attack,note:attack};
for(const html of [dossierTemplate(maliciousRecord,maliciousPortrait,false),historyTemplate(maliciousRecord,maliciousTier,attack,'')]){
  assert(!html.includes('<img src=x'),'record text must be escaped before entering HTML');
  assert(html.includes('&lt;img'),'escaped record text should remain readable');
}

const longest=(items,key)=>items.map(item=>String(item[key]||'')).sort((a,b)=>b.length-a.length)[0];
console.log(JSON.stringify({
  productionRevision:revision,
  stylesheetOverrides:0,
  safeAreaSupport:true,
  sharedRecordIsolation:true,
  accessibleSingleChoice:true,
  previousResultKeptUntilCompletion:true,
  portraits:portraits.length,
  birthplaces:birthplaces.length,
  commonHouses:households.length,
  nobleHouses:nobleHouses.length,
  longest:{portrait:longest(portraits,'title'),birthplace:longest(birthplaces,'name'),commonHouse:longest(households,'family'),nobleHouse:longest(nobleHouses,'name'),heirloom:longest(nobleHouses,'heirloom')}
}));
