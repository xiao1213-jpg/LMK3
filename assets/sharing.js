export const invitationShare=Object.freeze({
  title:'私に届いた、王国からの招待状',
  text:'リトル・ミュー王国から、私宛てにこんな招待状が届きました。よかったら、そっと封を開いてみてください。'
});

export const invitationShareSearch='?mode=mobile&share=invitation-v2';

export function invitationResultURL(base,token){
  const url=new URL('index.html',base);
  url.search=invitationShareSearch;
  url.hash=`record=${token}`;
  return url.href;
}

export function invitationSharePayload(url){
  return {...invitationShare,url};
}

export function invitationCopyText(url){
  return `${invitationShare.text}\n${url}`;
}
