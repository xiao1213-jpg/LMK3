import {BIRTHPLACES_BY_REGION,REGION_GEOGRAPHY,SPECIAL_BIRTHPLACE} from './geography.js?v=20261121-final';
import {describeLineage} from './heritage.js?v=20261121-final';
import {HOUSEHOLD_PROFILES} from './households.js?v=20261121-final';
import {assessMystique,combinationNote,provenanceStanding} from './rarity.js?v=20261121-final';

const coatPool=[
  ['キジトラ',16],['キジシロ',12],['チャトラ',11],['チャシロ',6],['サバトラ',9],['サバシロ',6],
  ['クロ',9],['シロ',8],['グレー',5],['グレーシロ',4],['ハチワレ',6],['ミケ',4],['サビ',2],
  ['ムギワラ',.8],['クリーム',.6],['ポイント',.4],['シミツキ',.15],['パステルトビ',.05]
];
const coatEpithets={
  'キジトラ':'茶褐色の毛並みに、細い縞がくっきり走る','キジシロ':'深い縞模様に、胸もとや足先の白が映える',
  'チャトラ':'明るい茶の毛並みに、やわらかな縞が重なる','チャシロ':'あたたかな茶と白が、くっきり分かれる',
  'サバトラ':'銀灰の毛並みに、濃い縞がすっと走る','サバシロ':'銀灰の縞模様に、胸もとや足先の白が映える',
  'クロ':'光の加減で艶を変える、深い黒','シロ':'やわらかな光をまとった、まっさらな白',
  'グレー':'青みを帯びた、静かな灰色','グレーシロ':'淡い灰色と白が、やさしく分かれる',
  'ハチワレ':'額から鼻筋へ、白がくっきり分かれる','ミケ':'白を地に、茶と黒の模様が思い思いに入る',
  'サビ':'黒と赤褐色が、まだらに溶け合う','ムギワラ':'淡い茶と黒が、細かな縞になって重なる',
  'クリーム':'ミルクを混ぜたような、やわらかな淡い茶','ポイント':'明るい体色に、顔や耳、足先の濃色が際立つ',
  'シミツキ':'白い毛並みに、小さな色斑がひとつふたつ残る','パステルトビ':'淡い三色が、白い毛並みにふわりと散る'
};
const rankPool=[['男爵',55],['子爵',25],['伯爵',13],['侯爵',5],['公爵',2]];
const regionPool=[
  {id:'mewminster',weight:30},{id:'whitecliff',weight:18},{id:'crownshire',weight:10},
  {id:'rosewick',weight:12},{id:'brambleshire',weight:12},{id:'bellmere',weight:10},{id:'northfell',weight:8}
];

for(const region of regionPool){
  if(!BIRTHPLACES_BY_REGION[region.id]?.length)throw Error('Missing birthplace region: '+region.id);
  const profiles=HOUSEHOLD_PROFILES[region.id];
  if(profiles?.length!==15)throw Error('Household profile count must be 15: '+region.id);
  const total=profiles.reduce((sum,item)=>sum+item.weight,0);
  if(Math.abs(total-100)>.0001)throw Error('Household weights do not total 100: '+region.id);
  if(profiles.some(item=>item.items.length!==2))throw Error('Each household must have two heirlooms: '+region.id);
}

function mulberry32(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function weightedPick(items,random,weightAt=item=>item[1]){const total=items.reduce((s,item)=>s+Number(weightAt(item)),0);let cursor=random()*total;for(const item of items){cursor-=Number(weightAt(item));if(cursor<0)return item;}return items.at(-1);}
function pick(items,random){return items[Math.floor(random()*items.length)];}
function registryNumber(seed){return'LMK-'+(seed>>>0).toString(36).toUpperCase().padStart(7,'0');}
function stableUnit(value){let hash=2166136261;for(const char of value){hash^=char.codePointAt(0);hash=Math.imul(hash,16777619);}return(hash>>>0)/4294967296;}

function generateProvenance(seed){
  const normalized=seed>>>0,random=mulberry32(normalized);
  const [coat,coatRate]=weightedPick(coatPool,random);
  const region=weightedPick(regionPool,random,item=>item.weight),places=BIRTHPLACES_BY_REGION[region.id];
  const ordinaryPlace=pick(places,random);
  const specialBirthplace=mulberry32((normalized^0x4b4f484f)>>>0)()<SPECIAL_BIRTHPLACE.replacementRate;
  const place=specialBirthplace?SPECIAL_BIRTHPLACE:ordinaryPlace;
  const birthplaceIndex=specialBirthplace?-1:places.indexOf(ordinaryPlace);
  const noble=random()<.10;
  let rank=null,rankRate=0,houseIndex=-1,familyIndex=0,family,itemIndex=-1,heirloom,familyScene,house=null,familyMeta,conditionalHouseRate;

  if(noble){
    const selectedRank=weightedPick(rankPool,random);rank=selectedRank[0];rankRate=selectedRank[1]/100;
    houseIndex=Math.floor(random()*20);
    house=describeLineage({rank,houseIndex,regionId:region.id});
    family=`${rank}家の分家につながる家`;heirloom=house.heirloom;familyScene=house.story;
    familyMeta={houseLegend:house.houseLegend,itemLegend:house.itemLegend,level:0,itemLevel:0};
    conditionalHouseRate=1/20;
  }else{
    const profile=weightedPick(HOUSEHOLD_PROFILES[region.id],random,item=>item.weight);
    familyIndex=profile.number;family=profile.family;familyScene=profile.story;
    itemIndex=random()<.5?0:1;heirloom=profile.items[itemIndex];
    familyMeta={level:profile.mystique,itemLevel:0,tags:profile.tags,itemTags:[]};
    conditionalHouseRate=(profile.weight/100)*.5;
  }

  const placeRate=specialBirthplace?region.weight/100*SPECIAL_BIRTHPLACE.replacementRate:region.weight/100*(1-SPECIAL_BIRTHPLACE.replacementRate)/places.length;
  const q=(coatRate/100)*placeRate*conditionalHouseRate;
  const probability=q*(noble?.10*rankRate:.90);
  const oneIn=Math.max(1,Math.round(1/probability));
  const tie=stableUnit([coat,place.number,region.id,familyIndex,itemIndex,rank||'',houseIndex].join('|'));
  const standing=provenanceStanding(q,rank,tie),mystique=assessMystique({coatRate,place,familyMeta});
  const regionGeography=REGION_GEOGRAPHY[region.id];
  return {
    seed:normalized,registry:registryNumber(normalized),dataVersion:15,
    coat,coatRate,coatEpithet:coatEpithets[coat],
    region:specialBirthplace?place.regionName:regionGeography.name,regionId:region.id,householdRegionId:region.id,birthplaceRegionId:place.regionId,
    regionDescription:specialBirthplace?place.regionDescription:regionGeography.description,
    birthplace:place.name,birthplaceNumber:place.number,birthplaceIndex,specialBirthplace,
    placeLegend:place.legend,placeScene:place.legend,placeMystique:place.mystique,placeTags:[...place.tags],
    family,familyIndex,familyScene,heirloom,itemIndex,rank,rankRate,houseIndex,houseId:house?.id||null,
    q,probability,oneIn,combinationNote:combinationNote(oneIn),rarityBand:standing.rarityBand,tier:standing.tier,
    mystiqueTier:mystique.tier,mystiqueLabel:mystique.label,mystiqueScore:mystique.score,mystiqueComponents:mystique.components
  };
}

export {generateProvenance,registryNumber,coatEpithets,coatPool,regionPool,rankPool};
export {freshSeed} from './random.js?v=20261121-final';
