import assert from 'node:assert/strict';
import {assessMystique,rarity,provenanceStanding} from '../assets/rarity.js';
import {HOUSEHOLD_PROFILES} from '../assets/households.js';

assert.equal(Object.values(HOUSEHOLD_PROFILES).flat().length,105);
assert.equal(Object.values(HOUSEHOLD_PROFILES).flat().flatMap(h=>h.items).length,210);
assert.equal(new Set(Object.values(HOUSEHOLD_PROFILES).flat().map(h=>h.family)).size,105);
assert.equal(new Set(Object.values(HOUSEHOLD_PROFILES).flat().flatMap(h=>h.items)).size,210);
for(const profiles of Object.values(HOUSEHOLD_PROFILES)){
  assert.equal(profiles.length,15);
  assert.equal(profiles.reduce((sum,p)=>sum+p.weight,0),100);
}

assert.equal(assessMystique({coatRate:40,place:{mystique:0},familyMeta:{}}).label,'穏やかな来歴');
assert.equal(assessMystique({coatRate:.05,place:{mystique:2},familyMeta:{houseLegend:'深い伝承',itemLegend:'王国奇譚'}}).label,'王国奇譚との縁');
assert.equal(provenanceStanding(.1,null).count,1);
assert.equal(provenanceStanding(.1,'男爵').count,2);
assert.equal(provenanceStanding(.1,'公爵').count,3);

const {generateProvenance}=await import('../assets/world.js');
const draws=300000,counts={1:0,2:0,3:0,4:0},ranks={},families=new Set(),items=new Set(),houses=new Set();
let nobles=0,previous=null,adjacentExactRepeats=0;
for(let seed=0;seed<draws;seed++){
  const result=generateProvenance(seed),tier=rarity[result.tier];
  counts[tier.count]++;
  families.add(`${result.regionId}:${result.familyIndex}`);items.add(`${result.regionId}:${result.familyIndex}:${result.itemIndex}`);
  if(result.rank){nobles++;houses.add(result.houseId);ranks[result.rank]=(ranks[result.rank]||0)+1;}
  const signature=[result.coat,result.birthplaceNumber,result.family,result.heirloom].join('|');
  if(signature===previous)adjacentExactRepeats++;
  previous=signature;
  if(seed%997===0)assert.deepEqual(generateProvenance(seed),result);
}
const ratios=Object.fromEntries(Object.entries(counts).map(([k,v])=>[k,v/draws]));
assert.ok(ratios[1]>.52&&ratios[1]<.56,ratios);
assert.ok(ratios[2]>.285&&ratios[2]<.305,ratios);
assert.ok(ratios[3]>.12&&ratios[3]<.14,ratios);
assert.ok(ratios[4]>.025&&ratios[4]<.042,ratios);
assert.ok(nobles/draws>.095&&nobles/draws<.105,nobles/draws);
assert.equal(families.size,105+7); // 105 regional common families + one titled branch per region.
assert.equal(items.size,210+7);    // noble heirlooms are tracked separately by house id.
assert.equal(houses.size,100);
assert.ok(adjacentExactRepeats<20,adjacentExactRepeats);
const expectedRanks={'男爵':.55,'子爵':.25,'伯爵':.13,'侯爵':.05,'公爵':.02};
for(const [rank,expected] of Object.entries(expectedRanks))assert.ok(Math.abs(ranks[rank]/nobles-expected)<.01,{rank,actual:ranks[rank]/nobles});
console.log(JSON.stringify({draws,stars:ratios,nobleRate:nobles/draws,distinctCommonFamilies:105,distinctCommonHeirlooms:210,distinctNobleHouses:houses.size,rankShares:Object.fromEntries(Object.entries(ranks).map(([k,v])=>[k,v/nobles])),adjacentExactRepeats}));
