import assert from 'node:assert/strict';
import {classify,presentedOrder} from '../assets/engine.js';
import {questionAt} from '../assets/questions.js';

const rankings=[['time','message','life'],['time','life','message'],['message','time','life'],['message','life','time'],['life','time','message'],['life','message','time']];
let stableProfiles=0;
for(const ranking of rankings)for(const relation of [0,1])for(const expression of [0,1])for(const enjoyment of [0,1]){
  const results=new Set();
  for(let seed=0;seed<300;seed++){
    const answers=[];
    for(let index=0;index<3;index++){
      const q=questionAt(index,answers,seed);
      answers.push(ranking.indexOf(q.keys[0])<ranking.indexOf(q.keys[1])?0:1);
    }
    answers.push(relation,expression,enjoyment);
    results.add(classify(answers,seed).id);
  }
  assert.equal(results.size,1,{ranking,relation,expression,enjoyment,results:[...results]});
  stableProfiles++;
}

const positionCounts={};
for(let seed=0;seed<120000;seed++){
  const answers=[];
  for(let index=0;index<6;index++)answers.push(presentedOrder(index,seed)[0]);
  const id=classify(answers,seed).id;positionCounts[id]=(positionCounts[id]||0)+1;
}
assert.equal(Object.keys(positionCounts).length,24);
for(const count of Object.values(positionCounts))assert.ok(count>4000&&count<6000,count);

const randomCounts={};let state=0x51f15e;
const next=()=>{state=Math.imul(state^state>>>15,1|state);state^=state+Math.imul(state^state>>>7,61|state);return (state^state>>>14)>>>0;};
for(let seed=0;seed<120000;seed++){
  const answers=Array.from({length:6},()=>next()&1),id=classify(answers,seed).id;
  randomCounts[id]=(randomCounts[id]||0)+1;
}
assert.equal(Object.keys(randomCounts).length,24);
for(const count of Object.values(randomCounts))assert.ok(count>4300&&count<5700,count);

console.log(JSON.stringify({stablePreferenceProfiles:stableProfiles,seedsPerProfile:300,positionStrategyPortraits:24,randomStrategyPortraits:24,positionRange:[Math.min(...Object.values(positionCounts)),Math.max(...Object.values(positionCounts))],randomRange:[Math.min(...Object.values(randomCounts)),Math.max(...Object.values(randomCounts))]}));
