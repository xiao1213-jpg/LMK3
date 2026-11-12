export const invitationShare=Object.freeze({
  title:'私に届いた、王国からの招待状',
  text:'リトル・ミュー王国から届いた、私への招待状はこれでした。'
});

export function invitationSharePayload(url){
  return {...invitationShare,url};
}

export function invitationCopyText(url){
  return `${invitationShare.text}\n${url}`;
}
