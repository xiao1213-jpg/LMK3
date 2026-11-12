import assert from 'node:assert/strict';
import {BIRTHPLACES,GEOGRAPHY_SOURCE,REGION_GEOGRAPHY,SPECIAL_BIRTHPLACE} from '../assets/geography.js';

assert.equal(GEOGRAPHY_SOURCE.version,12);
assert.equal(GEOGRAPHY_SOURCE.sha256,'fc253a304d2588d13cb421b086415f31fc41d36fdcef773a4121e319aaa4a7c1');
assert.equal(BIRTHPLACES.length,100);
assert.deepEqual(BIRTHPLACES.map(place=>place.number),Array.from({length:100},(_,index)=>index+1));
assert.equal(Object.keys(REGION_GEOGRAPHY).length,7);

const byRegion=Object.groupBy(BIRTHPLACES,place=>place.regionId);
for(const [regionId,places] of Object.entries(byRegion)){
  assert.equal(places.length,regionId==='mewminster'?16:14);
  assert.ok(REGION_GEOGRAPHY[regionId].name);
  assert.ok(REGION_GEOGRAPHY[regionId].description.length>35);
}

const mystiqueCounts=Object.fromEntries([0,1,2].map(level=>[level,BIRTHPLACES.filter(place=>place.mystique===level).length]));
assert.deepEqual(mystiqueCounts,{0:82,1:13,2:5});
const allowedTags=new Set(['天象','季節','聖史','自然','導き','境界','祝福','記憶']);
for(const place of BIRTHPLACES){
  assert.ok(place.name&&place.legend&&place.basis&&place.kind);
  assert.ok(place.tags.every(tag=>allowedTags.has(tag)));
  assert.equal(place.mystique===0,place.tags.length===0);
}

assert.equal(BIRTHPLACES.find(place=>place.name==='ベルグレイヴ・ガーデンズ').mystique,0);
assert.equal(BIRTHPLACES.find(place=>place.name==='セント・アルバン').mystique,1);
assert.equal(BIRTHPLACES.find(place=>place.name==='ソルト・ヘイブン').mystique,1);
assert.equal(BIRTHPLACES.find(place=>place.name==='白い城跡の丘').mystique,2);
assert.equal(SPECIAL_BIRTHPLACE.name,'《コホーリア》');
assert.equal(SPECIAL_BIRTHPLACE.replacementRate,.004);
assert.deepEqual(SPECIAL_BIRTHPLACE.tags,['境界','導き']);

const {generateProvenance}=await import('../assets/world.js');
const reached=new Set();let specialCount=0;
for(let seed=0;seed<200000;seed++){
  const result=generateProvenance(seed);
  if(result.specialBirthplace){
    specialCount++;
    assert.equal(result.birthplaceNumber,'EX');
    assert.equal(result.birthplaceIndex,-1);
    assert.equal(result.region,'どの地図にもない場所');
    assert.equal(result.birthplaceRegionId,'special');
  }else{
    reached.add(result.birthplaceNumber);
    assert.ok(result.region.endsWith('地方')||result.region.endsWith('特別区'));
  }
  assert.ok(result.regionDescription.length>35);
  assert.ok(result.placeLegend.length>35);
}
assert.equal(reached.size,100);
assert.ok(specialCount>650&&specialCount<950,specialCount);

console.log(JSON.stringify({birthplaces:BIRTHPLACES.length,specialBirthplaces:1,regions:Object.keys(byRegion).length,mystiqueCounts,reached:reached.size,specialCount,sourceVersion:GEOGRAPHY_SOURCE.version}));
