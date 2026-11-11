// Retained series palette; each mark is a small engraved ornament, never a portrait.
const glyphs={
 moon:'M29 9a15 15 0 1 0 9 25A16 16 0 0 1 29 9ZM31 17l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z',
 flower:'M24 24C9 22 13 9 24 17C26 3 39 12 31 23C46 26 35 38 27 30C23 44 10 34 18 26ZM24 24v16m0-6c-7 1-9-3-9-3m9 1c6 0 9-4 9-4',
 key:'M28 21a8 8 0 1 0-6 5l-9 12h6v-4h5v-4h4l3-4M18 14h.1',
 crown:'m9 19 7 6 8-13 8 13 7-6-4 17H13Zm5 20h20M24 8v2M7 16h2m30 0h2',
 bell:'M16 29V20a8 8 0 0 1 16 0v9l4 4H12Zm4 8q4 5 8 0M24 9v3',
 window:'M13 38V21a11 11 0 0 1 22 0v17ZM24 11v27M13 24h22M17 17l3 3m11-5-3 4',
 lily:'M24 37V17m0 10C12 25 11 16 13 12c8 1 12 7 11 15Zm0-4c0-10 6-14 12-14 2 9-3 15-12 14ZM16 37h16',
 star:'m24 8 4 11 12 1-9 8 3 12-10-7-10 7 3-12-9-8 12-1Z',
 letter:'M10 17h28v21H10Zm0 1 14 12 14-12M19 10h10m-5-3v6',
 mirror:'M35 21a11 14 0 1 0-22 0 11 14 0 1 0 22 0ZM24 35v6m-6 0h12M20 14l-3 7m11-9-8 17',
 pearl:'M24 11a12 12 0 1 0 0 24 12 12 0 1 0 0-24ZM18 19q2-4 6-4M12 38q12 6 24 0',
 glass:'m17 10 7-3 7 3-2 9 7 18q-12 8-24 0l7-18Zm2 9h10m-11 7h12',
 wisteria:'M24 8v10M13 17q11-7 22 0M14 18v5m7-7v9m7-9v10m7-7v5M12 25q2 7 4 0m3 2q2 8 4 0m3 2q2 8 4 0m3-3q2 7 4 0',
 berry:'M15 21q9-5 18 0 4 15-9 21-13-6-9-21ZM24 19V9m0 9-8-6m8 6 8-6M20 26h.1m8 0h.1m-4 6h.1',
 umbrella:'M7 25a17 17 0 0 1 34 0q-4-5-8 0-5-5-9 0-4-5-9 0-4-5-8 0ZM24 8v29q0 8-6 3',
 chestnut:'M12 33q-5-15 12-24 17 9 12 24-12 13-24 0Zm0-1q12-6 24 0M20 15v9m8-9v9',
 boat:'M7 29h34l-7 11H15ZM15 26l12-14 8 14M27 12v17M9 44q8-5 15 0 8-5 15 0',
 hat:'M9 35q15-6 30 0M14 33V22q10-19 20 0v11M13 29q11-5 22 0M23 9l3-3',
 book:'M24 17q-10-7-17-3v25q7-4 17 2 10-6 17-2V14q-7-4-17 3Zm0 0v24M12 21l7 2m10 0 7-2',
 shoe:'M16 10h13v16l11 8v6H10V27h6ZM15 35h19M16 18h13m-13 5h13',
 jar:'M17 10h14v6q7 5 7 15v9q-14 5-28 0v-9q0-10 7-15ZM14 10h20M18 27q6-6 12 0-6 10-12 0Z',
 ticket:'M8 15h32v7a4 4 0 0 0 0 8v7H8v-7a4 4 0 0 0 0-8Zm23 1v5m0 3v5m0 3v4M14 22h10m-10 7h10',
 leaf:'M10 36Q4 10 39 9q0 31-29 27ZM8 41l25-26M18 31l-2-10m8 4 10 1',
 ribbon:'M24 22q-18-18-17-2 0 11 17 2 17 9 17-2 1-16-17 2Zm-2 4-9 15 9-3 2 4 3-16m-1 1 9 12 1-8 5 1-11-11',
 cup:'M10 15h24v15q0 10-12 10T10 30Zm24 3q14-2 7 10h-7M7 44h32M18 10V6m8 4V6',
 scissors:'M21 28 34 8M26 28 13 8M14 28a6 6 0 1 0 0 12 6 6 0 1 0 0-12Zm20 0a6 6 0 1 0 0 12 6 6 0 1 0 0-12ZM24 23h.1',
 candle:'M18 22h12v19H18ZM24 7q-9 9 0 12 9-3 0-12ZM12 42h24M19 27h5v5',
 shell:'M24 39 9 26Q3 8 15 12q9-12 18 0 12-4 6 14ZM24 38V15m-3 23-7-20m13 20 7-20M19 41h10',
 lamp:'M12 28l7-16h10l7 16ZM24 28v13m-7 0h14M20 9h8',
 music:'M17 33V13l20-4v21M17 19l20-4M17 33q-13-4-11 5 4 7 11-5Zm20-3q-13-4-11 5 4 7 11-5Z',
 fan:'M24 40 5 22q19-28 38 0ZM24 40V10m0 30L13 15m11 25 11-25',
 thread:'M14 11h20M17 12v25m14-25v25M14 38h20M17 17l14 5m-14 2 14 5m-14 2 14 5M12 22l-5 8m25 3 9-17',
 cookie:'M24 8a16 16 0 1 0 16 16q-11 0-9-11-7 2-7-5ZM17 18h.1m-3 10h.1m9-3h.1m5 8h.1',
 windmill:'M24 24 7 15l13-7Zm0 0 9-17 7 13Zm0 0 17 9-13 7Zm0 0L15 41 8 28Zm0 2v18',
 scale:'M24 10v32M10 16h28M13 16 6 31h14Zm22 0-7 15h14ZM17 42h14M21 10h6',
 clock:'M24 8a16 16 0 1 0 0 32 16 16 0 1 0 0-32Zm0 6v11l8 5M24 8V5m-4-1h8',
 basket:'M10 23h28l-4 18H14ZM15 23l9-15 9 15M19 28v9m10-9v9M7 23h34',
 feather:'M18 38 28 9l5 3-7 30-4-6Zm0 0-3 7m10-20 6 2',
 door:'M13 42V19a11 11 0 0 1 22 0v23ZM24 42V29h9M17 21h.1m14 0h.1M9 42h30',
 compass:'M24 8a16 16 0 1 0 0 32 16 16 0 1 0 0-32Zm7 9-4 10-10 4 4-10ZM24 8V4m0 36v4M8 24H4m36 0h4',
 telescope:'m7 29 27-18 7 11-30 13ZM26 28l-6 15m6-15 9 15M30 14l7 11',

 rose:'M24 27q-11-2-7-10 2-8 10-6 11 2 8 11-2 10-11 5Zm0 0q-6-7 0-10 7-1 6 5-2 5-6 0M24 28v13m0-5q-8 0-10-7 8 0 10 7m0-1q7 1 11-5-7-2-11 5'
};
export function mark(kind='star',className='ornament'){return `<svg class="${className}" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="${glyphs[kind]||glyphs.star}"/></svg>`;}
export const seriesThemes={rebel:{mark:'moon',name:'ささやかな反逆者'},lady:{mark:'flower',name:'優雅な令嬢たち'},salon:{mark:'key',name:'秘密のサロン'},blood:{mark:'crown',name:'気高き血統'}};
export function seriesSeal(series){const theme=seriesThemes[series];return `<span class="series-seal">${mark(theme.mark)}</span>`;}
export function houseSeal(kind){return `<span class="house-seal"><svg viewBox="0 0 80 92" fill="none" aria-hidden="true"><path d="M9 12Q40 4 71 12v31Q71 66 40 84 9 66 9 43ZM14 16Q40 10 66 16v27Q66 64 40 78 14 64 14 43Z"/><path d="m32 6 8-4 8 4M6 33l-4 9 4 10m68-19 4 9-4 10"/></svg>${mark(kind,'house-symbol')}</span>`;}

export function houseFlourish(rankClass){const motifs={baron:'',viscount:'❖',earl:'· ❖ ·',marquess:'✧ ❖ ✧',duke:'✧ · ❖ · ✧'};return motifs[rankClass]?`<span class="house-flourish" aria-hidden="true">${motifs[rankClass]}</span>`:'';}
