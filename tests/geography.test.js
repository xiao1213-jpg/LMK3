import assert from 'node:assert/strict';
import {BIRTHPLACES,GEOGRAPHY_SOURCE,REGION_GEOGRAPHY} from '../assets/geography.js';

assert.equal(GEOGRAPHY_SOURCE.version,6);
assert.equal(GEOGRAPHY_SOURCE.sha256,'e482972a02a77044f98f2319554b4f8e2efa4acc8d3170daaf2947f08e1a95d2');
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
assert.deepEqual(mystiqueCounts,{0:60,1:30,2:10});
const allowedTags=new Set(['天象','季節','聖史','自然','導き','境界','祝福','記憶']);
for(const place of BIRTHPLACES){
  assert.ok(place.name&&place.legend&&place.basis&&place.kind);
  assert.ok(place.tags.every(tag=>allowedTags.has(tag)));
  assert.equal(place.mystique===0,place.tags.length===0);
}

assert.equal(BIRTHPLACES.find(place=>place.name==='ベルグレイブ・ガーデンズ').mystique,0);
assert.equal(BIRTHPLACES.find(place=>place.name==='セント・アルバン').mystique,0);
assert.equal(BIRTHPLACES.find(place=>place.name==='ソルト・ヘイブン').mystique,2);

const {generateProvenance}=await import('../assets/world.js');
const reached=new Set();
for(let seed=0;seed<200000;seed++){
  const result=generateProvenance(seed);
  reached.add(result.birthplaceNumber);
  assert.ok(result.region.endsWith('地方')||result.region.endsWith('特別区'));
  assert.ok(result.regionDescription.length>35);
  assert.ok(result.placeLegend.length>35);
}
assert.equal(reached.size,100);

console.log(JSON.stringify({birthplaces:BIRTHPLACES.length,regions:Object.keys(byRegion).length,mystiqueCounts,reached:reached.size,sourceVersion:GEOGRAPHY_SOURCE.version}));
