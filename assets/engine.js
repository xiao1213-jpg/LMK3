import {questionAt} from './questions.js?v=20261110-editorial';
export const VERSION=19;
const validSeed=s=>Number.isInteger(s)&&s>=0&&s<=0xffffffff;
export function classify(answers,seed){
 if(!Array.isArray(answers)||answers.length!==6||answers.some(v=>v!==0&&v!==1)||!validSeed(seed))throw Error('Invalid record');
 const path=answers.map((v,i)=>{const q=questionAt(i,answers,seed);return {id:q.id,axis:q.axis,key:q.keys[v],question:q.scene,answer:v?q.b:q.a};});
 const primary=path[2].key,relation=path[3].key,expression=path[4].key,enjoyment=path[5].key;
 const series={'inherit,outer':'blood','inherit,inner':'salon','weave,outer':'lady','weave,inner':'rebel'}[`${relation},${expression}`];
 return {primary,relation,expression,enjoyment,series,id:`result_${series}_${primary}_${enjoyment}`,path};
}
export function normalizeRecord(record){
 classify(record?.answers,record?.seed);
 const provenanceSeed=validSeed(record?.provenanceSeed)?record.provenanceSeed:record.seed;
 return {answers:[...record.answers],seed:record.seed,provenanceSeed};
}
export function encode(record){const r=normalizeRecord(record);return btoa(JSON.stringify({v:VERSION,a:r.answers,s:r.seed,p:r.provenanceSeed})).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
function parse(payload){if(typeof payload!=='string'||payload.length>1000||!/^[A-Za-z0-9_-]+$/.test(payload))throw Error('Invalid payload');return JSON.parse(atob(payload.replaceAll('-','+').replaceAll('_','/')));}
export function decode(payload){try{const r=parse(payload);if(r.v===VERSION){classify(r.a,r.s);if(!validSeed(r.p))return null;return {answers:[...r.a],seed:r.s,provenanceSeed:r.p};}if(r.v===18){classify(r.a,r.s);return {answers:[...r.a],seed:r.s,provenanceSeed:r.s};}return null;}catch{return null;}}
export function isLegacyRecord(payload){try{const r=parse(payload);return r.v===17&&Array.isArray(r.a)&&r.a.length===9&&r.a.every(v=>v===0||v===1)&&validSeed(r.s);}catch{return false;}}
export function presentedOrder(index,seed){let x=(seed^Math.imul(index+1,0x45d9f3b))>>>0;x=Math.imul(x^(x>>>16),0x45d9f3b)>>>0;return (x^(x>>>16))&1?[1,0]:[0,1];}
