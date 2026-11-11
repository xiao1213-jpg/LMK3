import {questions} from './questions.js';
export const VERSION=17;
export function summarize(answers){
 if(!Array.isArray(answers)||answers.length!==9||answers.some(v=>v!==0&&v!==1))throw Error('Invalid answers');
 const scores={time:0,message:0,life:0,inherit:0,weave:0,outer:0,inner:0,quiet:0,share:0};
 questions.forEach((q,i)=>scores[q.keys[answers[i]]]++);return scores;
}
export function classify(answers){
 const scores=summarize(answers);const groups=[['time','message','life'],['inherit','weave'],['outer','inner'],['quiet','share']];
 const options=groups.map(keys=>{const top=Math.max(...keys.map(k=>scores[k]));return keys.filter(k=>scores[k]===top);});
 const candidates=[];
 for(const primary of options[0])for(const relation of options[1])for(const expression of options[2])for(const enjoyment of options[3]){
 const series={'inherit,outer':'blood','inherit,inner':'salon','weave,outer':'lady','weave,inner':'rebel'}[`${relation},${expression}`];
 candidates.push({primary,relation,expression,enjoyment,series,id:`result_${series}_${primary}_${enjoyment}`});}
 return {scores,options,candidates};
}
export function encode(record){
 const c=classify(record.answers);if(!Number.isInteger(record.seed)||record.seed<0||record.seed>0xffffffff||record.view&&!c.candidates.some(x=>x.id===record.view))throw Error('Invalid record');
 const payload={v:VERSION,a:record.answers,s:record.seed,p:record.view||null};
 return btoa(JSON.stringify(payload)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
}
export function decode(payload){
 try{if(typeof payload!=='string'||payload.length>1000||!/^[A-Za-z0-9_-]+$/.test(payload))return null;const r=JSON.parse(atob(payload.replaceAll('-','+').replaceAll('_','/')));if(r.v!==VERSION||!Number.isInteger(r.s)||r.s<0||r.s>0xffffffff||r.p!==null&&typeof r.p!=='string')return null;const c=classify(r.a);if(r.p&&!c.candidates.some(x=>x.id===r.p))return null;return {answers:r.a,seed:r.s,view:r.p};}catch{return null;}
}
// Presentation alone uses the seed; scoring always uses canonical option indexes.
export function presentedOrder(questionIndex,seed){let x=(seed^Math.imul(questionIndex+1,0x45d9f3b))>>>0;x=Math.imul(x^(x>>>16),0x45d9f3b)>>>0;return (x^(x>>>16))&1?[1,0]:[0,1];}
