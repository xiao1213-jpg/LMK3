import assert from 'node:assert/strict';
import {VERSION,classify,encode,decode,presentedOrder,isLegacyRecord} from '../assets/engine.js';
import {questionAt,rotations} from '../assets/questions.js';
import {portraits} from '../assets/portraits.js';
import {rarity} from '../assets/rarity.js';
const reached=new Map();let checked=0;
for(let seed=0;seed<3;seed++)for(let bits=0;bits<64;bits++){
 const answers=Array.from({length:6},(_,i)=>(bits>>i)&1),r=classify(answers,seed);
 assert.ok(portraits.some(p=>p.id===r.id));assert.equal(r.path.length,6);assert.equal(typeof r.id,'string');assert.ok(!('candidates' in r));reached.set(r.id,(reached.get(r.id)||0)+1);
 const record={answers,seed,provenanceSeed:(seed+101)>>>0};assert.deepEqual(decode(encode(record)),record);assert.equal(classify(decode(encode(record)).answers,seed).id,r.id);
 for(let i=0;i<6;i++){const q=questionAt(i,answers,seed);assert.equal(q.keys.length,2);assert.notEqual(q.keys[0],q.keys[1]);assert.ok(q.a&&q.b);assert.deepEqual([...presentedOrder(i,seed)].sort(),[0,1]);}
 const first=questionAt(0,answers,seed),second=questionAt(1,answers,seed),third=questionAt(2,answers,seed);
 assert.ok(!second.keys.includes(first.keys[answers[0]]));assert.ok(third.keys.includes(first.keys[answers[0]]));assert.ok(third.keys.includes(second.keys[answers[1]]));assert.equal(r.primary,third.keys[answers[2]]);checked++;
}
assert.equal(reached.size,24);assert.deepEqual([...new Set(reached.values())],[8]);
// A consistent ranking of the three interests always chooses its top, regardless of entry rotation.
const permutations=[['time','message','life'],['time','life','message'],['message','time','life'],['message','life','time'],['life','time','message'],['life','message','time']];
for(const ranking of permutations)for(let seed=0;seed<3;seed++){const answers=[];for(let i=0;i<3;i++){const q=questionAt(i,answers,seed);answers.push(ranking.indexOf(q.keys[0])<ranking.indexOf(q.keys[1])?0:1);}answers.push(0,0,0);assert.equal(classify(answers,seed).primary,ranking[0]);}
const finalChoices=new Set();for(let seed=0;seed<3;seed++)for(let bits=0;bits<4;bits++){const q=questionAt(2,[bits&1,(bits>>1)&1],seed);finalChoices.add(q.a);finalChoices.add(q.b);}
assert.deepEqual([...finalChoices].sort(),['お茶の時間を彩る器と菓子','昔と今の町並みを並べた絵図','猫たちの想いが綴られた手紙'].sort());
assert.equal(decode('bad'),null);assert.equal(decode('a'.repeat(1001)),null);assert.throws(()=>classify([0],0));assert.throws(()=>classify(Array(6).fill(null),0));
for(const [tier,r] of Object.entries(rarity)){assert.equal([...r.stars].filter(s=>s==='★').length,r.count);assert.equal([...r.stars].length,4);assert.ok(r.label&&r.note);}
const legacy=btoa(JSON.stringify({v:17,a:Array(9).fill(0),s:0,p:null})).replace(/=+$/,'');assert.equal(isLegacyRecord(legacy),true);assert.equal(decode(legacy),null);
const v18=btoa(JSON.stringify({v:18,a:Array(6).fill(0),s:42})).replace(/=+$/,'');assert.deepEqual(decode(v18),{answers:Array(6).fill(0),seed:42,provenanceSeed:42});
assert.equal(VERSION,19);assert.equal(decode(btoa(JSON.stringify({v:19,a:Array(6).fill(0),s:42})).replace(/=+$/,'')),null);
console.log(JSON.stringify({answerPaths:checked,resultsPerPath:1,reachablePortraits:reached.size,pathsPerPortrait:8,shareRoundtrips:checked,legacyV18Migration:'passed',independentProvenanceSeed:'passed',consistentRankings:'passed',rarityTiers:4}));
