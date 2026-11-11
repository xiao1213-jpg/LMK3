import {heritageProfiles} from './heritage.js?v=20261110-lore';
import {houseSeal,houseFlourish} from './ornaments.js?v=20261110-lore';
const classes={'男爵':'baron','子爵':'viscount','伯爵':'earl','侯爵':'marquess','公爵':'duke'};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav=document.getElementById('ranks'),catalog=document.getElementById('catalog'),count=document.getElementById('catalog-count');
const ranks=['すべて',...Object.keys(classes)];
for(const rank of ranks){const b=document.createElement('button');b.type='button';b.textContent=rank;b.dataset.rank=rank;b.setAttribute('aria-pressed',String(rank==='すべて'));b.addEventListener('click',()=>render(rank));nav.append(b);}
function render(selected){let n=0;catalog.innerHTML=Object.entries(heritageProfiles).filter(([rank])=>selected==='すべて'||rank===selected).flatMap(([rank,list])=>list.map(h=>{n++;return `<article class="family-miniature rank-${classes[rank]}"><p class="eyebrow">A FAMILY REMEMBERED</p>${houseSeal(h.mark)}<p class="lineage-badge">${rank}家</p><h2>${escape(h.name)}</h2><p class="house-motto">「${escape(h.motto)}」</p><p class="house-story">${escape(h.story)}</p><section class="catalog-heirloom"><p class="catalog-heirloom-label">家に伝わるもの</p><h3>${escape(h.heirloom)}</h3><p>${escape(h.detail)}</p></section>${houseFlourish(classes[rank])}</article>`;})).join('');count.textContent=selected==='すべて'?`${n}の家印 · 各爵位20種類`:`${selected}家に伝わる、${n}の家印`;for(const b of nav.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.rank===selected));}
render('すべて');
