  const coatPool = [
    ["キジトラ",16],["キジシロ",12],["チャトラ",11],["チャシロ",6],["サバトラ",9],["サバシロ",6],
    ["クロ",9],["シロ",8],["グレー",5],["グレーシロ",4],["ハチワレ",6],["ミケ",4],["サビ",2],
    ["ムギワラ",.8],["クリーム",.6],["ポイント",.4],["シミツキ",.15],["パステルトビ",.05]
  ];

  const coatEpithets = {
    "キジトラ":"茶褐色に、細い縞が幾重にも走る",
    "キジシロ":"深い縞のあいだに、澄んだ白がのぞく",
    "チャトラ":"陽だまりのような茶に、柔らかな縞が重なる",
    "チャシロ":"温かな茶色に、清らかな白が映える",
    "サバトラ":"銀灰の毛並みを、涼やかな縞がよぎる",
    "サバシロ":"銀灰の縞と白が、すっきりと際立つ",
    "クロ":"光を受けるたび、深い黒に艶が浮かぶ",
    "シロ":"朝の光を、やわらかく返す白",
    "グレー":"薄明の空のように、穏やかな灰色",
    "グレーシロ":"淡い灰色と白が、静かに寄り添う",
    "ハチワレ":"額の模様がくっきりと分かれる",
    "ミケ":"白地に、茶と黒の色模様が散る",
    "サビ":"黒と赤褐色が、細やかに入り交じる",
    "ムギワラ":"淡い茶と黒が、繊細な縞を描く",
    "クリーム":"淡い金色が、毛先にふんわり広がる",
    "ポイント":"明るい毛色に、顔や先端の濃淡が映える",
    "シミツキ":"白い毛並みに、小さな斑点がぽつりと浮かぶ",
    "パステルトビ":"淡い色模様が、白い毛並みにやさしく浮かぶ"
  };

  const titlePool = [
    ["公爵家の分家につながる家",2],
    ["侯爵家の分家につながる家",5],
    ["伯爵家の分家につながる家",13],
    ["子爵家の分家につながる家",25],
    ["男爵家の分家につながる家",55]
  ];

  const regionPool = [
    {
      id:"mewminster",name:"ミューミンスター特別区",weight:30,
      births:["王都ミューミンスターの学術街","王都の古い商店街","王都中央駅に近い街区","ランタンの灯る劇場街","セント・ミルク宮殿に近い住宅街"],
      families:[
        ["爵位家",12,["古い王室行事の招待札","小さな銀の家印"],"titled"],
        ["王都に古くから屋敷を構える無爵位旧家",2.5,["昔の王都を描いた庭図","古い館の小鍵"]],
        ["王立大学の学寮へ本を納めてきた製本家の家",18,["創業時の真鍮ルーペ","書き込みの残る古い講義録"]],
        ["王都中央駅の開業を支えた商家",18,["最初の開業硬券","駅前商店の小さな帳面"]],
        ["ランタン街で小劇場を守ってきた家",18,["小劇場の初演目録","客席番号を刻んだ真鍮札"]],
        ["王都近郊の菜園を何代も守ってきた家",1,["季節を書き込んだ栽培暦","最初の収穫を載せた小皿"]],
        ["議会記録の印刷と配達に関わってきた家",22,["議会記録の校正刷り","使い込まれた活字見本"]],
        ["宮殿や大学の客間を長く整えてきた家",8.5,["家族の名が刻まれたティーポット","客間で使われた小さな呼び鈴"]]
      ]
    },
    {
      id:"whitecliff",name:"ホワイトクリフ",weight:18,
      births:["ソルト・ヘイブン","ハーヴァリー","カスタミア","葡萄とオリーブの丘","海辺の小さな国内港"],
      families:[
        ["爵位家",8,["爵位家の古い家印の写し","海辺の館から贈られた銀の小皿"],"titled"],
        ["丘の土地台帳に古くから名を残す家",3.6,["葡萄畑の古い境界図","丘の館の小鍵"]],
        ["外国語の通訳や翻訳を担ってきた家",9,["二つの言葉で書かれた手紙","港の語学手帳"]],
        ["ソルト・ヘイブンの船荷を扱ってきた商家",23,["最初の蒸気船入港日の荷札","外国から届いた小箱"]],
        ["青い硝子を焼いてきた工房の家",18,["青い硝子の小瓶","硝子の色見本"]],
        ["葡萄畑やオリーブ畑を守ってきた家",19,["葡萄の収穫帳","秋最初の実を載せる皿"]],
        ["灯台と沿岸救難を支えてきた家",11,["灯台当番の小時計","救難記録を綴じた帳面"]],
        ["海辺の宿を長く切り盛りしてきた家",8.4,["旅猫の名が並ぶ古い宿帳","朝食用の小さな呼び鈴"]]
      ]
    },
    {
      id:"crownshire",name:"クラウンシャー",weight:10,
      births:["ステイブリッジ近郊","古い街道町","寄宿学校のある町","王都近郊の田園","海辺の国内港"],
      families:[
        ["爵位家",11,["爵位家の庭図の写し","家印を刻んだ小さなブローチ"],"titled"],
        ["寄宿学校へ土地を提供した無爵位旧家",8.5,["最初の寄贈本の蔵書印","開校日の真鍮鈴"]],
        ["街道沿いの学校を支えてきた教師の家",9,["何代も書き足された授業帳","古い地理図帳"]],
        ["王都へ農産物を送ってきた商家",6,["王都行き荷札の束","果実の値を記した小帳面"]],
        ["古い石橋を補修してきた石工の家",13,["石橋の小さな測量尺","最初の補修年を刻んだ金具"]],
        ["麦畑と広い草地を守ってきた家",36,["季節を書き込んだ農事暦","秋最初の実を載せる皿"]],
        ["王都近郊鉄道の開通を支えた家",9,["開通日の硬券","古い列車時刻表"]],
        ["学校や街道宿へ長く勤めてきた家",7.5,["街道宿の小鍵","何度も繕われた膝掛け"]]
      ]
    },
    {
      id:"rosewick",name:"ローズウィック",weight:12,
      births:["ウィッチフォード大学街","ブライアヒル","古い市場町","野ばらの丘","森の縁の村"],
      families:[
        ["爵位家",9,["館の鍵を模したブローチ","古い庭図の写し"],"titled"],
        ["市場町の記録に古くから名を残す家",6.6,["町の古い土地台帳","祭りの日付を書き込んだ暦"]],
        ["ウィッチフォード大学と古くから縁のある家",12,["野ばらを挟んだ野帳","大学街の古い蔵書票"]],
        ["大学街へ書籍を運んできた商家",6,["書籍荷札の束","創業時の仕入帳"]],
        ["製本と古書修復を続けてきた家",17,["手綴じの歌集","製本用の真鍮ルーペ"]],
        ["野ばらや薬草を育ててきた家",33,["花のシロップ帳","乾かした野ばらを挟んだ植物帖"]],
        ["地方の歌や祭りの記録を残してきた家",8,["古い祭りの歌集","町の行事を書いた記録帳"]],
        ["学生向けの下宿を長く営んできた家",8.4,["下宿の小さな呼び鈴","歴代の学生が署名したティーポット"]]
      ]
    },
    {
      id:"brambleshire",name:"ブランブルシャー",weight:12,
      births:["エドマンドウィック","《ドルヴァ》の森の縁","古城を囲む町","谷あいの市場町","森へ続く街道集落"],
      families:[
        ["爵位家",12,["《ふたつの冠》の古い招待札","古城の鍵を模したブローチ"],"titled"],
        ["古城と土地台帳を守ってきた無爵位旧家",8.5,["森の境を記した地図","水路図の写し"]],
        ["エドマンドウィック大学と縁のある家",11,["古い講義録","大学ポータンブル大会の入場札"]],
        ["谷町の木材と家具を扱ってきた商家",6,["木材の仕入帳","創業時の小さな家印"]],
        ["木工や地図づくりに関わってきた家",17,["家具工房の木型","使い込まれた地図用定規"]],
        ["森の縁で果樹と木苺を育ててきた家",29,["木苺の保存帳","収穫用の小さな木籠"]],
        ["谷町の橋と水路を守ってきた家",9,["橋の補修記録","水位を刻んだ真鍮札"]],
        ["古城や大学の客間へ長く勤めてきた家",7.5,["植物繊維で織った虎縞の布","客間の古い燭台"]]
      ]
    },
    {
      id:"bellmere",name:"ベルメア",weight:10,
      births:["サンミア湖畔の果樹園地帯","グリーンステッド","イーストバンク","農業・園芸カレッジの町","湖畔の市場町"],
      families:[
        ["爵位家",9,["湖畔の館から贈られた銀縁皿","家印を刻んだ小さな徽章"],"titled"],
        ["湖畔の土地台帳に古くから名を残す家",8.8,["果樹園の古い区画図","湖畔の館の小鍵"]],
        ["農業・園芸カレッジを支えてきた家",7,["試験園の観察ノート","果実の接ぎ方を描いた図譜"]],
        ["湖畔市場で果実と加工品を扱ってきた商家",5,["果実の選別印","《ミルクの実》菓子の古い包み紙"]],
        ["果実の保存道具を作ってきた職人の家",13,["木製の果実型","瓶のラベルを刷った版木"]],
        ["サンミア湖畔の果樹園を守ってきた家",47,["秋最初の梨を載せる銀縁皿","何代も書き足された収穫帳"]],
        ["湖上蒸気船と水位観測を支えてきた家",5,["湖上蒸気船の乗船札","湖の水位帳"]],
        ["地方学校や果樹園の館へ長く勤めてきた家",5.2,["食堂で使われた小さな呼び鈴","何度も繕われた植物繊維の膝掛け"]]
      ]
    },
    {
      id:"northfell",name:"ノースフェル",weight:8,
      births:["コホーリア湯郷","エイヴリング高地","雪深い谷あいの町","北岸の国内港","山地の大学町"],
      families:[
        ["爵位家",7,["北方の爵位家の星印を写した小章","高地の館の小鍵"],"titled"],
        ["峠道の記録に古くから名を残す家",7.8,["冬の峠を描いた古地図","初雪の日の銅燭台"]],
        ["山地の総合大学で観測を支えてきた家",9,["古い星図","寒冷地植物の観察帖"]],
        ["薬草と保存食を各地へ送ってきた商家",5,["薬草の仕入帳","保存瓶の古いラベル"]],
        ["植物繊維の織物を作ってきた家",18,["細かな織り見本","使い込まれた木の糸巻き"]],
        ["高地で薬草と果実を育ててきた家",36,["薬草を乾かす小箱","霜の日を書き込んだ栽培暦"]],
        ["谷鉄道と冬の郵便・救難を支えてきた家",8,["谷鉄道の開通硬券","冬の郵便経路図"]],
        ["コホーリアの宿や共同浴場へ長く勤めてきた家",9.2,["湯郷の古い客帳札","旅猫を迎えた小さな呼び鈴"]]
      ]
    }
  ];

  // The catalogue is an expandable sample of places: it is NOT a complete map of the Kingdom.
  // Canonical place names are preserved; unnamed villages are described without inventing proper names.
  const birthplaceWorld = window.LMK_KINGDOM_NOTES_V12 || {};

  // Region weights remain canonical; family wording and inherited objects are independent
  // of any contemporary occupation of the resulting cat.
  for (const region of regionPool) {
    const profiles = birthplaceWorld.familyProfiles?.[region.id];
    if (!profiles || profiles.length !== region.families.length) throw Error("Incomplete family catalogue for " + region.id);
    for (let i = 1; i < region.families.length; i++) {
      const profile = profiles[i];
      const original = region.families[i];
      region.families[i] = [profile[0],original[1],[profile[1],profile[2]],original[3]];
    }
  }

  const birthplaceCatalog = Object.fromEntries(regionPool.map(region => {
    const correction = birthplaceWorld.baseCorrections?.[region.id] || {};
    const base = region.births.map((name,index) => ({
      name: correction[index] || name,
      tag: birthplaceWorld.placeTags?.[region.id]?.[index] || "",
      scene: birthplaceWorld.placeScenes?.[region.id]?.[index] || "",
      weight: birthplaceWorld.baseBirthWeights?.[index] || 1
    }));
    const additions = (birthplaceWorld.additionalBirthplaces?.[region.id] || []).map(place => ({
      name:place[0],tag:place[1],scene:place[2],weight:place[3]
    }));
    return [region.id,[...base,...additions]];
  }));
  const birthplaceWeightSums = Object.fromEntries(Object.entries(birthplaceCatalog).map(([id,items]) =>
    [id,items.reduce((total,place)=>total+place.weight,0)]));

  function mulberry32(seed) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function weightedPick(items, random, weightAt = item => item[1]) {
    const total = items.reduce((sum,item) => sum + Number(weightAt(item)),0);
    let cursor = random() * total;
    for (const item of items) {
      cursor -= Number(weightAt(item));
      if (cursor < 0) return item;
    }
    return items[items.length - 1];
  }

  function pick(items, random) {
    return items[Math.floor(random() * items.length)];
  }

  function freshSeed() {
    if (window.crypto?.getRandomValues) return window.crypto.getRandomValues(new Uint32Array(1))[0];
    return Math.floor(Math.random() * 4294967296) >>> 0;
  }

  function registryNumber(seed) {
    return "LMK-" + (seed >>> 0).toString(36).toUpperCase().padStart(7,"0");
  }

  function generateProvenance(seed) {
    const random = mulberry32(seed >>> 0);
    const coatEntry = weightedPick(coatPool,random);
    const coat = coatEntry[0];
    const region = weightedPick(regionPool,random,item => item.weight);
    const places = birthplaceCatalog[region.id];
    const place = weightedPick(places,random,item=>item.weight);
    const birthplace = place.name;
    const birthplaceIndex = places.indexOf(place);
    const birthplaceProbability = place.weight / birthplaceWeightSums[region.id];
    const eligibility = birthplaceWorld.familyAllowedBirthIndexes?.[region.id];
    const eligible = region.families.map((f,i) => ({family:f,index:i}))
      .filter(item => item.index > 0 && eligibility?.[item.index]?.includes(birthplaceIndex));
    if (!eligible.length) throw Error("No family compatible with " + region.id + ":" + birthplaceIndex);
    const nobleProbability = region.families[0][1] / 100;
    const chosen = random() < nobleProbability
      ? {family:region.families[0],index:0}
      : weightedPick(eligible,random,item => item.family[1]);
    const family = chosen.family;
    const familyIndex = chosen.index;
    const nonNobleTotal = eligible.reduce((total,item)=> total + item.family[1],0);
    const familyProbability = familyIndex === 0
      ? nobleProbability
      : (1 - nobleProbability) * family[1] / nonNobleTotal;
    let familyName = family[0];
    let titleProbability = 1;
    if (family[3] === "titled") {
      const title = weightedPick(titlePool,random);
      familyName = title[0];
      titleProbability = title[1] / 100;
    }
    const heirloom = pick(family[2],random);
    const probability = (coatEntry[1]/100) * (region.weight/100) * birthplaceProbability * familyProbability * titleProbability * (1/family[2].length);
    const oneIn = Math.max(1,Math.round(1/probability));
    const tier = probability >= .00008012903225806451 ? "ivory" : probability >= .00001689171974522293 ? "silver" : probability >= .0000027547826086956524 ? "gold" : "crown";
    return {seed:seed >>> 0,coat,coatEpithet:coatEpithets[coat] || `${coat}の猫`,region:region.name,regionId:region.id,birthplace,birthplaceIndex,placeTag:place.tag,placeScene:place.scene,family:familyName,familyIndex,dataVersion:12,heirloom,registry:registryNumber(seed),probability,oneIn,tier};
  }


export {generateProvenance,registryNumber,coatEpithets,freshSeed};
