import assert from 'node:assert/strict';
import {assessMystique,rarity} from '../assets/rarity.js';
import {HOUSE_LEVEL_DESIGN,NON_NOBLE_MYSTIQUE} from '../assets/mystique-data.js';

for(const [rank,record] of Object.entries(HOUSE_LEVEL_DESIGN)){
  assert.equal(record.deep.length,4,`${rank}: deep household traditions`);
  assert.equal(record.touched.length,10,`${rank}: touched household traditions`);
  assert.equal(record.objectDeep.length,4,`${rank}: deep inherited objects`);
  assert.equal(record.objectTouched.length,8,`${rank}: touched inherited objects`);
  assert.equal(new Set([...record.deep,...record.touched]).size,14);
  assert.equal(new Set([...record.objectDeep,...record.objectTouched]).size,12);
}
for(const [regionId,records] of Object.entries(NON_NOBLE_MYSTIQUE)){
  assert.equal(records.length,8,regionId);
  for(let index=1;index<8;index++){
    assert.ok(records[index]);
    assert.equal(records[index].items.length,2);
    assert.ok(records[index].level>=0&&records[index].level<=2);
  }
}

const rareCoatAlone=assessMystique({coatRate:.05,place:{mystique:0,tags:[]},familyMeta:{level:0,itemLevel:0,tags:[],itemTags:[]}});
assert.equal(rareCoatAlone.count,2,'One rare trait alone must never become a top record');
const deepLandAlone=assessMystique({coatRate:40,place:{mystique:2,tags:['境界']},familyMeta:{level:0,itemLevel:0,tags:[],itemTags:[]}});
assert.equal(deepLandAlone.count,2,'A P2 birthplace must not be presented as an ordinary one-star record');
const allFour=assessMystique({coatRate:.4,place:{mystique:2,tags:['境界']},familyMeta:{level:1,itemLevel:1,tags:['境界'],itemTags:[]}});
assert.equal(allFour.count,4);

const {generateProvenance}=await import('../assets/world.js');
const draws=300000,counts={1:0,2:0,3:0,4:0},starsByTier=Object.fromEntries(Object.entries(rarity).map(([tier,value])=>[tier,value.count]));
const groups={noble:{n:0,sum:0},other:{n:0,sum:0}},ranks={},bellgrave=new Set();
let rareButQuiet=null;

for(let seed=0;seed<draws;seed++){
  const result=generateProvenance(seed),stars=starsByTier[result.tier];
  counts[stars]++;
  const group=result.familyIndex===0?groups.noble:groups.other;
  group.n++;group.sum+=stars;
  if(result.familyIndex===0){
    const rank=result.family.match(/^(男爵|子爵|伯爵|侯爵|公爵)/)?.[1];
    assert.ok(rank);
    ranks[rank]??={n:0,sum:0};ranks[rank].n++;ranks[rank].sum+=stars;
  }
  if(result.birthplace==='ベルグレイヴ・ガーデンズ')bellgrave.add(stars);
  if(stars===4){
    assert.equal(result.mystiqueSources,4);
    assert.ok(result.mystiqueScore>=6);
    assert.ok(Object.values(result.mystiqueComponents).slice(0,4).every(Boolean));
  }
  if(result.combinationNote&&stars===1)rareButQuiet??=result;
  if(seed%997===0)assert.deepEqual(generateProvenance(seed),result);
}

const ratios=Object.fromEntries(Object.entries(counts).map(([stars,count])=>[stars,count/draws]));
assert.ok(ratios[1]>.47&&ratios[1]<.52,ratios);
assert.ok(ratios[2]>.39&&ratios[2]<.45,ratios);
assert.ok(ratios[3]>.05&&ratios[3]<.08,ratios);
assert.ok(ratios[4]>.015&&ratios[4]<.03,ratios);
assert.deepEqual([...bellgrave].sort(),[1,2,3],'A prestigious address must not force or permit four stars without land mystique');
assert.ok(rareButQuiet,'Full-combination rarity must remain separate from the stars');

for(const group of Object.values(groups))group.mean=group.sum/group.n;
for(const group of Object.values(ranks))group.mean=group.sum/group.n;
assert.ok(Math.abs(groups.noble.mean-groups.other.mean)<.25,'Nobility must not determine the star level');
const rankMeans=Object.values(ranks).map(group=>group.mean);
assert.equal(rankMeans.length,5);
assert.ok(Math.max(...rankMeans)-Math.min(...rankMeans)<.15,'Noble rank must not determine the star level');

console.log(JSON.stringify({draws,counts,ratios,nobleMean:groups.noble.mean,nonNobleMean:groups.other.mean,rankMeans:Object.fromEntries(Object.entries(ranks).map(([rank,value])=>[rank,value.mean])),bellgrave:[...bellgrave].sort(),rareCombinationSeparated:true}));
