import {writeFileSync} from 'node:fs';

globalThis.window={};
await import(new URL('../assets/kingdom-notes-v12.js',import.meta.url));

const profiles=globalThis.window.LMK_KINGDOM_NOTES_V12?.familyProfiles;
const regions=['mewminster','whitecliff','crownshire','rosewick','brambleshire','bellmere','northfell'];
if(!profiles||regions.some(region=>!Array.isArray(profiles[region])||profiles[region].length!==8)){
  throw Error('Legacy household profiles are incomplete');
}

const target=new URL('../assets/households.js',import.meta.url);
const source=`// Generated from kingdom-notes-v12.js. Run npm run build:households after changing the source.\nexport const HOUSEHOLD_PROFILES=${JSON.stringify(profiles,null,2)};\n`;
writeFileSync(target,source);
