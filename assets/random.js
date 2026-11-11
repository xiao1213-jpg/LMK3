export function freshSeed(){
  if(globalThis.crypto?.getRandomValues)return globalThis.crypto.getRandomValues(new Uint32Array(1))[0];
  return Math.floor(Math.random()*4294967296)>>>0;
}
