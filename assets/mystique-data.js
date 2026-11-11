// Mystique metadata is deliberately independent from occupation, wealth and title.
// Levels describe a household tradition and the selected inherited object only.

export const NON_NOBLE_MYSTIQUE={
  mewminster:[null,
    {level:1,tags:['記憶','自然'],items:[1,0]},
    {level:1,tags:['記憶'],items:[1,1]},
    {level:0,tags:[],items:[1,0]},
    {level:1,tags:['記憶','祝福'],items:[2,1]},
    {level:0,tags:['季節','自然'],items:[1,0]},
    {level:1,tags:['記憶','導き'],items:[1,2]},
    {level:0,tags:['祝福'],items:[1,0]}
  ],
  whitecliff:[null,
    {level:1,tags:['記憶','自然'],items:[1,1]},
    {level:1,tags:['記憶','導き'],items:[2,1]},
    {level:1,tags:['記憶','導き'],items:[2,1]},
    {level:0,tags:['自然'],items:[1,0]},
    {level:1,tags:['季節','自然'],items:[1,1]},
    {level:1,tags:['導き','自然'],items:[2,1]},
    {level:1,tags:['記憶','祝福'],items:[1,0]}
  ],
  crownshire:[null,
    {level:0,tags:['記憶','自然'],items:[1,0]},
    {level:1,tags:['記憶'],items:[1,2]},
    {level:0,tags:['導き'],items:[1,0]},
    {level:1,tags:['記憶','導き'],items:[2,1]},
    {level:1,tags:['季節'],items:[1,1]},
    {level:1,tags:['記憶','導き'],items:[2,1]},
    {level:1,tags:['祝福','導き'],items:[1,0]}
  ],
  rosewick:[null,
    {level:1,tags:['記憶','境界'],items:[2,0]},
    {level:1,tags:['祝福','季節'],items:[1,1]},
    {level:1,tags:['記憶','自然'],items:[2,1]},
    {level:1,tags:['記憶'],items:[2,1]},
    {level:1,tags:['季節','自然'],items:[1,1]},
    {level:2,tags:['記憶','祝福'],items:[2,1]},
    {level:1,tags:['記憶','祝福'],items:[1,2]}
  ],
  brambleshire:[null,
    {level:2,tags:['境界','自然'],items:[2,1]},
    {level:2,tags:['聖史','祝福'],items:[2,1]},
    {level:0,tags:[],items:[1,0]},
    {level:0,tags:['記憶'],items:[1,0]},
    {level:1,tags:['季節','自然'],items:[1,0]},
    {level:1,tags:['導き','自然'],items:[1,1]},
    {level:2,tags:['聖史','記憶'],items:[1,2]}
  ],
  bellmere:[null,
    {level:1,tags:['記憶','自然'],items:[2,1]},
    {level:1,tags:['季節','記憶'],items:[1,1]},
    {level:0,tags:[],items:[0,1]},
    {level:0,tags:[],items:[0,1]},
    {level:1,tags:['季節','祝福'],items:[2,2]},
    {level:1,tags:['自然','季節'],items:[1,1]},
    {level:0,tags:['祝福'],items:[0,1]}
  ],
  northfell:[null,
    {level:1,tags:['記憶','導き'],items:[2,1]},
    {level:2,tags:['天象','記憶'],items:[2,2]},
    {level:0,tags:['自然'],items:[1,1]},
    {level:1,tags:['季節','記憶'],items:[1,0]},
    {level:1,tags:['季節','自然'],items:[1,0]},
    {level:1,tags:['導き','季節'],items:[2,1]},
    {level:0,tags:['祝福'],items:[1,0]}
  ]
};

// Every rank uses the same 6/10/4 household distribution and 8/8/4 object
// distribution. A title therefore changes the house presentation, never its odds.
const HOUSE_LEVELS={
  '男爵':{
    deep:['baron-04','baron-15','moon-window','baron-11'],
    touched:['lily-bell','baron-07','baron-08','baron-14','baron-18','baron-20','silver-bell','baron-06','baron-10','baron-12'],
    objectDeep:['baron-04','baron-15','moon-window','baron-11'],
    objectTouched:['lily-bell','baron-07','baron-14','baron-18','silver-bell','baron-06','baron-08','baron-10']
  },
  '子爵':{
    deep:['star-key','viscount-16','water-mirror','viscount-07'],
    touched:['flower-letter','viscount-09','viscount-10','viscount-13','viscount-14','viscount-17','viscount-04','viscount-05','viscount-06','viscount-11'],
    objectDeep:['star-key','viscount-16','water-mirror','viscount-07'],
    objectTouched:['flower-letter','viscount-10','viscount-13','viscount-14','viscount-04','viscount-05','viscount-09','viscount-17']
  },
  '伯爵':{
    deep:['earl-06','earl-14','earl-04','earl-12'],
    touched:['white-rose','pearl-lamp','blue-glass','earl-09','earl-17','earl-20','earl-08','earl-10','earl-11','earl-19'],
    objectDeep:['earl-06','earl-14','earl-04','earl-12'],
    objectTouched:['pearl-lamp','blue-glass','earl-09','earl-20','white-rose','earl-08','earl-17','earl-19']
  },
  '侯爵':{
    deep:['marquess-04','marquess-20','evening-star','marquess-05'],
    touched:['silver-moon','marquess-08','marquess-10','marquess-12','marquess-17','marquess-18','marquess-07','marquess-11','marquess-13','marquess-16'],
    objectDeep:['marquess-04','marquess-20','evening-star','marquess-05'],
    objectTouched:['marquess-08','marquess-10','marquess-17','marquess-18','silver-moon','marquess-07','marquess-12','marquess-16']
  },
  '公爵':{
    deep:['duke-05','duke-11','star-crown','duke-15'],
    touched:['dawn-crown','silver-rose','duke-06','duke-07','duke-09','duke-13','duke-10','duke-12','duke-18','duke-20'],
    objectDeep:['duke-05','duke-11','star-crown','duke-15'],
    objectTouched:['dawn-crown','silver-rose','duke-07','duke-13','duke-06','duke-09','duke-18','duke-20']
  }
};

const TAG_TERMS={
  '天象':['星','月','暁','夜空','天球','望遠鏡','天文','銀河'],
  '季節':['春','夏','秋','冬','雪','霜','季節','収穫'],
  '聖史':['聖','王室','騎士','虎','建国','冠'],
  '自然':['森','湖','海','水','雨','風','花','薔薇','庭','木','草','果','霧'],
  '導き':['道','地図','羅針盤','鍵','灯','駅','旅','切符','鉄道','橋','門'],
  '境界':['境','扉','窓','鏡','夢','奥','門','夜'],
  '祝福':['祝い','祭','客','茶','食卓','贈','花冠','招待','宴'],
  '記憶':['古い','何代','代々','昔','記録','手紙','帳','図','語り','思い出','受け継','継','残']
};

export function tagsFromText(text){
  return Object.entries(TAG_TERMS).filter(([,terms])=>terms.some(term=>text.includes(term))).map(([tag])=>tag);
}

export function mystiqueForHouse(house){
  const record=HOUSE_LEVELS[house.rank];
  if(!record)throw Error('Unknown house rank');
  const level=record.deep.includes(house.id)?2:record.touched.includes(house.id)?1:0;
  const itemLevel=record.objectDeep.includes(house.id)?2:record.objectTouched.includes(house.id)?1:0;
  return {
    level,itemLevel,
    tags:tagsFromText(`${house.name} ${house.motto} ${house.story}`),
    itemTags:tagsFromText(`${house.heirloom} ${house.detail}`)
  };
}

export function mystiqueForNonNoble(regionId,familyIndex,itemIndex,familyText,itemText){
  const record=NON_NOBLE_MYSTIQUE[regionId]?.[familyIndex];
  if(!record)throw Error(`Missing household mystique: ${regionId}/${familyIndex}`);
  return {
    level:record.level,
    itemLevel:record.items[itemIndex]??0,
    tags:[...new Set([...record.tags,...tagsFromText(familyText)])],
    itemTags:tagsFromText(itemText)
  };
}

export const HOUSE_LEVEL_DESIGN=HOUSE_LEVELS;
