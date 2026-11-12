import {BIRTHPLACES_BY_REGION,REGION_GEOGRAPHY,SPECIAL_BIRTHPLACE} from './geography.js?v=20261112-v12';
import {describeLineage} from './heritage.js?v=20261110-lineage-records';
import {HOUSEHOLD_PROFILES} from './households.js?v=20261111-extracted';
import {mystiqueForHouse,mystiqueForNonNoble} from './mystique-data.js?v=20261111-mystique';
import {assessMystique,combinationNote} from './rarity.js?v=20261112-geography-v12';

const coatPool=[
  ['キジトラ',16],['キジシロ',12],['チャトラ',11],['チャシロ',6],['サバトラ',9],['サバシロ',6],
  ['クロ',9],['シロ',8],['グレー',5],['グレーシロ',4],['ハチワレ',6],['ミケ',4],['サビ',2],
  ['ムギワラ',.8],['クリーム',.6],['ポイント',.4],['シミツキ',.15],['パステルトビ',.05]
];

const coatEpithets={
  'キジトラ':'茶褐色に、細い縞が幾重にも走る','キジシロ':'深い縞のあいだに、澄んだ白がのぞく',
  'チャトラ':'陽だまりのような茶に、柔らかな縞が重なる','チャシロ':'温かな茶色に、清らかな白が映える',
  'サバトラ':'銀灰の毛並みを、涼やかな縞がよぎる','サバシロ':'銀灰の縞と白が、すっきりと際立つ',
  'クロ':'光を受けるたび、深い黒に艶が浮かぶ','シロ':'朝の光を、やわらかく返す白',
  'グレー':'薄明の空のように、穏やかな灰色','グレーシロ':'淡い灰色と白が、静かに寄り添う',
  'ハチワレ':'額の模様がくっきりと分かれる','ミケ':'白地に、茶と黒の色模様が散る',
  'サビ':'黒と赤褐色が、細やかに入り交じる','ムギワラ':'淡い茶と黒が、繊細な縞を描く',
  'クリーム':'淡い金色が、毛先にふんわり広がる','ポイント':'明るい毛色に、顔や先端の濃淡が映える',
  'シミツキ':'白い毛並みに、小さな斑点がぽつりと浮かぶ','パステルトビ':'淡い色模様が、白い毛並みにやさしく浮かぶ'
};

const titlePool=[
  ['公爵家の分家につながる家',2],['侯爵家の分家につながる家',5],['伯爵家の分家につながる家',13],
  ['子爵家の分家につながる家',25],['男爵家の分家につながる家',55]
];

// Household weights sum to 100 in every region. Index 0 is the titled branch;
// indices 1..7 refer to the authored regional household profiles.
const regionPool=[
  {id:'mewminster',weight:30,families:[12,2.5,18,18,18,1,22,8.5]},
  {id:'whitecliff',weight:18,families:[8,3.6,9,23,18,19,11,8.4]},
  {id:'crownshire',weight:10,families:[11,8.5,9,6,13,36,9,7.5]},
  {id:'rosewick',weight:12,families:[9,6.6,12,6,17,33,8,8.4]},
  {id:'brambleshire',weight:12,families:[12,8.5,11,6,17,29,9,7.5]},
  {id:'bellmere',weight:10,families:[9,8.8,7,5,13,47,5,5.2]},
  {id:'northfell',weight:8,families:[7,7.8,9,5,18,36,8,9.2]}
];

for(const region of regionPool){
  const places=BIRTHPLACES_BY_REGION[region.id];
  if(!places?.length)throw Error('Missing birthplace region: '+region.id);
  const total=region.families.reduce((sum,value)=>sum+value,0);
  if(Math.abs(total-100)>.0001)throw Error('Household weights do not total 100: '+region.id);
}

function mulberry32(seed){
  return function(){
    let t=seed+=0x6D2B79F5;
    t=Math.imul(t^t>>>15,t|1);
    t^=t+Math.imul(t^t>>>7,t|61);
    return((t^t>>>14)>>>0)/4294967296;
  };
}

function weightedPick(items,random,weightAt=item=>item[1]){
  const total=items.reduce((sum,item)=>sum+Number(weightAt(item)),0);
  let cursor=random()*total;
  for(const item of items){cursor-=Number(weightAt(item));if(cursor<0)return item;}
  return items.at(-1);
}

function pick(items,random){return items[Math.floor(random()*items.length)];}
function registryNumber(seed){return'LMK-'+(seed>>>0).toString(36).toUpperCase().padStart(7,'0');}

function generateProvenance(seed){
  const normalized=seed>>>0,random=mulberry32(normalized);
  const coatEntry=weightedPick(coatPool,random),coat=coatEntry[0],coatRate=coatEntry[1];
  const region=weightedPick(regionPool,random,item=>item.weight);
  const regionGeography=REGION_GEOGRAPHY[region.id];
  const places=BIRTHPLACES_BY_REGION[region.id];
  const ordinaryPlace=pick(places,random);
  // The exceptional birthplace uses an independent roll so adding it does not
  // perturb the coat, household or heirloom attached to an existing seed.
  const specialBirthplace=mulberry32((normalized^0x4b4f484f)>>>0)()<SPECIAL_BIRTHPLACE.replacementRate;
  const place=specialBirthplace?SPECIAL_BIRTHPLACE:ordinaryPlace;
  const birthplaceIndex=specialBirthplace?-1:places.indexOf(ordinaryPlace);
  const familyChoice=weightedPick(region.families.map((weight,index)=>({weight,index})),random,item=>item.weight);
  const familyIndex=familyChoice.index;
  const profile=HOUSEHOLD_PROFILES[region.id]?.[familyIndex];
  let family,itemIndex=-1,heirloom,familyScene,house=null,familyMeta,detailProbability;

  if(familyIndex===0){
    const title=weightedPick(titlePool,random);
    family=title[0];
    const draft={seed:normalized,familyIndex,family,regionId:region.id};
    house=describeLineage(draft);
    if(!house)throw Error('Noble house could not be resolved');
    heirloom=house.heirloom;
    familyScene=house.story;
    familyMeta=mystiqueForHouse(house);
    detailProbability=(title[1]/100)*(1/20);
  }else{
    if(!profile)throw Error(`Missing household profile: ${region.id}/${familyIndex}`);
    family=profile[0];
    itemIndex=random()<.5?0:1;
    heirloom=profile[itemIndex+1];
    familyScene=profile[3];
    familyMeta=mystiqueForNonNoble(region.id,familyIndex,itemIndex,`${profile[0]} ${profile[3]}`,heirloom);
    detailProbability=.5;
  }

  const placeRate=specialBirthplace?SPECIAL_BIRTHPLACE.replacementRate:(1-SPECIAL_BIRTHPLACE.replacementRate)/places.length;
  const probability=(coatRate/100)*(region.weight/100)*placeRate*(familyChoice.weight/100)*detailProbability;
  const oneIn=Math.max(1,Math.round(1/probability));
  const mystique=assessMystique({coatRate,place,familyMeta});
  return {
    seed:normalized,registry:registryNumber(normalized),dataVersion:14,
    coat,coatRate,coatEpithet:coatEpithets[coat]||`${coat}の猫`,
    region:specialBirthplace?place.regionName:regionGeography.name,
    regionId:region.id,householdRegionId:region.id,birthplaceRegionId:place.regionId,
    regionDescription:specialBirthplace?place.regionDescription:regionGeography.description,
    birthplace:place.name,birthplaceNumber:place.number,birthplaceIndex,
    specialBirthplace,
    placeLegend:place.legend,placeScene:place.legend,placeMystique:place.mystique,placeTags:[...place.tags],
    family,familyIndex,familyScene,heirloom,itemIndex,houseId:house?.id||null,
    probability,oneIn,combinationNote:combinationNote(oneIn),
    tier:mystique.tier,mystiqueLabel:mystique.label,starReason:mystique.starReason,
    mystiqueScore:mystique.score,mystiqueSources:mystique.sourceCount,
    mystiqueComponents:mystique.components,mystiqueSigns:mystique.signs,sharedMystiqueTags:mystique.sharedTags
  };
}

export {generateProvenance,registryNumber,coatEpithets,coatPool,regionPool};
export {freshSeed} from './random.js?v=20261111-independent-draw';
