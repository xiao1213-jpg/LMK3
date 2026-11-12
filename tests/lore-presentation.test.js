import assert from 'node:assert/strict';
import {rarity} from '../assets/rarity.js';
import {heritageProfiles,describeLineage} from '../assets/heritage.js';
import {dossierTemplate,historyTemplate,letterTemplate,startTemplate} from '../assets/templates.js';
import {stories} from '../assets/stories.js';
import {invitationShare,invitationSharePayload,invitationCopyText,invitationShareSearch,invitationResultURL} from '../assets/sharing.js';

const {generateProvenance}=await import('../assets/world.js');

const houses=Object.values(heritageProfiles).flat();
assert.equal(new Set(houses.map(h=>h.heirloom)).size,100);
assert.equal(new Set(houses.map(h=>h.detail)).size,100);

const ordinary=Array.from({length:10000},(_,seed)=>generateProvenance(seed)).find(result=>result.familyIndex!==0&&result.combinationNote);
assert.ok(ordinary);
const ordinaryHtml=historyTemplate(ordinary,rarity[ordinary.tier],ordinary.familyScene,'');
assert.ok(ordinaryHtml.includes('王国奇譚度'));
assert.ok(ordinaryHtml.includes(ordinary.regionDescription));
assert.ok(ordinaryHtml.includes(ordinary.placeLegend));
assert.ok(ordinaryHtml.includes('この土地に残る話'));
assert.ok(ordinaryHtml.includes(ordinary.combinationNote));
assert.ok(!ordinaryHtml.includes('回に1回'));
assert.ok(!ordinaryHtml.includes('家の由緒が残るところ'));

const noble=Array.from({length:5000},(_,seed)=>generateProvenance(seed)).find(result=>result.familyIndex===0);
const house=describeLineage(noble),nobleHtml=historyTemplate(noble,rarity[noble.tier],noble.familyScene,'',house);
assert.ok(nobleHtml.includes(house.story));
assert.ok(nobleHtml.includes(house.heirloom));
assert.ok(nobleHtml.includes(house.lineage));

const portrait={series:'rebel',title:'月影の反逆者'};
const dossier=dossierTemplate(ordinary,portrait,false);
assert.ok(dossier.includes('六つの答えから、あなたに重なった一枚'));
assert.ok(dossier.includes('王国から届いた、ひとつきりの生まれの記録'));
assert.ok(dossier.includes('provenance-seal'));
assert.ok(!dossier.includes('record-number">Ⅱ'));
assert.ok(dossier.includes('<span class="origin-label">毛色</span>'));
assert.ok(!dossier.includes('回答の振り返り'));
assert.ok(dossier.includes('届いた招待状を分かち合う'));
assert.ok(dossier.includes('招待状を共有する'));
assert.ok(dossier.includes('招待状のリンクをコピー'));
const letter=letterTemplate();
assert.ok(letter.includes('六つの答えから'));
assert.ok(letter.includes('そして王国は、もうひとつの記録を'));
assert.ok(letter.includes('毛色や故郷'));
const start=startTemplate();
assert.ok(start.includes('国王陛下から、あなた宛ての招待状'));
assert.ok(start.includes('招待状を受け取りにゆく'));
assert.ok(!start.includes('心象肖像を見つける'));

const sharedUrl='https://example.test/index.html?mode=mobile#record=example';
assert.equal(invitationShare.title,'私に届いた、王国からの招待状');
assert.equal(invitationShare.text,'リトル・ミュー王国から、私宛てにこんな招待状が届きました。よかったら、そっと封を開いてみてください。');
assert.equal(invitationShareSearch,'?mode=mobile&share=invitation-v2');
assert.equal(invitationResultURL('https://example.test/LMK3/?mode=store#dossier','abc'),'https://example.test/LMK3/index.html?mode=mobile&share=invitation-v2#record=abc');
const storeDossier=dossierTemplate(ordinary,portrait,true);
assert.ok(storeDossier.includes('TAKE YOUR INVITATION HOME'));
assert.ok(storeDossier.includes('あなた宛ての招待状をそのまま持ち帰れます'));
assert.ok(storeDossier.includes('この店頭端末に結果は残りません'));
assert.ok(!storeDossier.includes('招待状を共有する'));
assert.equal(invitationSharePayload(sharedUrl).url,sharedUrl);
assert.equal(invitationCopyText(sharedUrl),`${invitationShare.text}\n${sharedUrl}`);

const drawA=generateProvenance(41),drawB=generateProvenance(42);
assert.notDeepEqual(drawA,drawB);

assert.equal(Object.keys(stories).length,24);
assert.deepEqual(stories.result_rebel_time_quiet.lines,[
  '虎と騎士、ふたつの伝説を受け継ぐ少年猫。',
  'でも今夜は、だれの伝説も届かない森でひとやすみ。',
  '月あかりの下なら、ただのエドウィンでいられるのです。'
]);
assert.equal(stories.result_blood_life_share.lines.at(-1),'それでもおいしいケーキが届けば、耳はちゃんと「ぴん」とするのです。');

console.log(JSON.stringify({distinctNobleHeirlooms:100,geographyContext:true,portraitAndProvenanceSeparated:true,exactProbabilityHidden:true,storiesUnchanged:24}));
