// The stars measure proximity to the Kingdom's mysteries. They never measure
// occupation, wealth, address, noble rank or the rarity of the full combination.
export const rarity={
  story:{stars:'★☆☆☆',count:1,label:'王国の小さな物語',note:'不思議はまだ、日々の暮らしのすぐそばにあります。'},
  whisper:{stars:'★★☆☆',count:2,label:'不思議の気配',note:'毛色や土地、家の記憶のどこかに、古い気配が残っています。'},
  legend:{stars:'★★★☆',count:3,label:'古い伝承との縁',note:'いくつものしるしが重なり、王国の伝承へ近づいています。'},
  chronicle:{stars:'★★★★',count:4,label:'王国に残る奇譚',note:'毛色、土地、家の記憶が深く響き合う、まれな来歴です。'}
};

const tierByCount={1:'story',2:'whisper',3:'legend',4:'chronicle'};

export function coatMystique(rate){
  if(rate<.5)return 3;
  if(rate<3)return 2;
  if(rate<8)return 1;
  return 0;
}

function signForCoat(points){
  return ['', '少し珍しい毛色', '珍しい毛色', '王国でもめったに見ない毛色'][points];
}
function signForPlace(points){
  return ['', '土地に残る言い伝え', '王国の深層に触れる土地'][points];
}
function signForFamily(points){
  return ['', '家に残る古い習わし', '王国の伝承へ続く家の記憶'][points];
}
function signForItem(points){
  return ['', '記憶を受け継ぐ家伝品', '奇譚を宿す家伝品'][points];
}

export function assessMystique({coatRate,place,familyMeta}){
  const coat=coatMystique(coatRate);
  const land=Math.max(0,Math.min(2,Number(place.mystique)||0));
  const family=Math.max(0,Math.min(2,Number(familyMeta.level)||0));
  const item=Math.max(0,Math.min(2,Number(familyMeta.itemLevel)||0));
  const household=Math.min(3,family+item);
  const inheritedTags=new Set([...(familyMeta.tags||[]),...(familyMeta.itemTags||[])]);
  const shared=(place.tags||[]).filter(tag=>inheritedTags.has(tag));
  const resonance=land>0&&shared.length?1:0;
  const score=coat+land+household+resonance;
  const sourceCount=[coat,land,family,item].filter(Boolean).length;
  // Four stars require all four independent sources: coat, land, household
  // tradition and inherited object. Resonance strengthens them but is not a
  // fifth source. This prevents one very rare trait from becoming a jackpot.
  const count=score>=6&&sourceCount===4?4:score>=5?3:score>=3?2:1;
  const foundations=[signForCoat(coat),signForPlace(land),signForFamily(family),signForItem(item)].filter(Boolean);
  const signs=[...foundations];
  if(resonance)signs.push(`土地と家伝に「${shared[0]}」の縁`);
  const tier=tierByCount[count];
  const starReason=count===4
    ?`${foundations.join('、')}。四つのしるしが、この来歴で響き合っています。`
    :signs.length
    ?`${signs.slice(0,3).join('、')}が、この来歴のしるしです。`
    :'穏やかな日々のなかに、小さな王国の物語が残っています。';
  return {tier,count,label:rarity[tier].label,score,sourceCount,components:{coat,land,family,item,resonance},sharedTags:shared,signs,starReason};
}

export function combinationNote(oneIn){
  if(oneIn>=250000)return '王国でも、めったに出会えない組み合わせの猫です。';
  if(oneIn>=50000)return 'とても珍しい組み合わせの猫です。';
  return '';
}
