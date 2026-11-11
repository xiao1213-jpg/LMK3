import assert from 'node:assert/strict';
import {describeLineage,heritageProfiles} from '../assets/heritage.js';
const {generateProvenance}=await import('../assets/world.js');
const found=new Set(),rankCounts={};let nobles=0;
for(let seed=0;seed<100000;seed++){
 const p=generateProvenance(seed),before=structuredClone(p),h=describeLineage(p);
 assert.deepEqual(p,before,'Heraldry must not mutate the original draw');
 if(p.familyIndex===0){assert.ok(h);assert.ok(p.family.startsWith(h.rank+'家'));assert.equal(h.lineage,h.rank+'家の分家');assert.deepEqual(describeLineage(generateProvenance(seed)),h);assert.ok(h.regionalNote);assert.ok(h.story&&h.motto&&h.detail);found.add(h.id);rankCounts[h.rank]=(rankCounts[h.rank]||0)+1;nobles++;}else assert.equal(h,null);
}
assert.equal(found.size,100);assert.equal(Object.keys(rankCounts).length,5);
assert.equal(Object.values(heritageProfiles).flat().length,100);
console.log(JSON.stringify({draws:100000,nobleRecords:nobles,distinctHouseStories:found.size,ranks:rankCounts,probabilityAndHeirloomMutation:'none',restoration:'stable'}));

const profiles=Object.values(heritageProfiles).flat();
assert.equal(new Set(profiles.map(x=>x.name)).size,100,'Every house has a distinct emblem');
assert.equal(new Set(profiles.map(x=>x.story)).size,100,'Every house has an authored tradition');
for(const list of Object.values(heritageProfiles))assert.equal(list.length,20);
