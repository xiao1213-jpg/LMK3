// Stars combine the rarity of the full draw with the recorded noble rank.
// They never judge occupation, income, neighbourhood, or a cat's worth.
export const rarity={
  star1:{stars:'★☆☆☆',count:1,label:'王国の日々',note:'王国でよく見かける、親しみのある巡り合わせです。'},
  star2:{stars:'★★☆☆',count:2,label:'珍しい巡り合わせ',note:'いくつかの要素が重なった、少し珍しい来歴です。'},
  star3:{stars:'★★★☆',count:3,label:'稀なる来歴',note:'王国でもそう多くは巡り合わない、稀な来歴です。'},
  star4:{stars:'★★★★',count:4,label:'王国でもごく稀な来歴',note:'いくつもの珍しい要素が重なった、王国でもごく稀な巡り合わせです。'}
};

// Weighted-quantile boundaries from the v12 tables. When many distinct
// combinations have exactly the same probability at a boundary, a stable hash
// of the combination divides that tie. This reaches 60/25/12/3 without making
// a later visit change the same record's class.
const quantileBoundary={
  common:{K3:[0.000005229,.5578504494],K2:[0.00001494,.6031650411],K1:[0.000026892,.0398783342]},
  noble:{K3:[0.000008537143,.1452476573],K2:[0.000021342857,.7622155288],K1:[0.000038417143,.5104545165]}
};

export function rarityClass(q,noble=false,tie=.5){
  const boundary=noble?quantileBoundary.noble:quantileBoundary.common;
  const value=Math.round(q*1e12)/1e12;
  if(value<boundary.K3[0]||(value===boundary.K3[0]&&tie<boundary.K3[1]))return 'K3';
  if(value<boundary.K2[0]||(value===boundary.K2[0]&&tie<boundary.K2[1]))return 'K2';
  if(value<boundary.K1[0]||(value===boundary.K1[0]&&tie<boundary.K1[1]))return 'K1';
  return 'K0';
}

const starMatrix={
  common:{K0:1,K1:2,K2:3,K3:4},
  '男爵':{K0:2,K1:2,K2:3,K3:4},
  '子爵':{K0:2,K1:3,K2:3,K3:4},
  '伯爵':{K0:2,K1:3,K2:4,K3:4},
  '侯爵':{K0:3,K1:3,K2:4,K3:4},
  '公爵':{K0:3,K1:4,K2:4,K3:4}
};

export function provenanceStanding(q,rank=null,tie=.5){
  const rarityBand=rarityClass(q,Boolean(rank),tie);
  const count=starMatrix[rank||'common'][rarityBand];
  return {rarityBand,count,tier:`star${count}`,...rarity[`star${count}`]};
}

export function coatMystique(rate){
  if(rate<.5)return 3;
  if(rate<3)return 2;
  if(rate<8)return 1;
  return 0;
}

const legendLevel=value=>value==='王国奇譚'?3:value==='深い伝承'||value==='古い伝承との縁'?2:value==='不思議の気配'?1:0;
export function assessMystique({coatRate,place,familyMeta={}}){
  const coat=coatMystique(coatRate);
  const land=Math.max(0,Math.min(2,Number(place?.mystique)||0));
  const family=Math.max(Number(familyMeta.level)||0,legendLevel(familyMeta.houseLegend));
  const item=Math.max(Number(familyMeta.itemLevel)||0,legendLevel(familyMeta.itemLegend));
  const score=coat+land+family+item;
  const tier=score>=7?'chronicle':score>=4?'legend':score>=2?'whisper':'none';
  const labels={none:'穏やかな来歴',whisper:'不思議の気配',legend:'古い伝承との縁',chronicle:'王国奇譚との縁'};
  return {tier,label:labels[tier],score,components:{coat,land,family,item}};
}

export function combinationNote(oneIn){
  if(oneIn>=250000)return '王国でも、めったに巡り合わない組み合わせです。';
  if(oneIn>=50000)return 'とても珍しい組み合わせです。';
  return '';
}
