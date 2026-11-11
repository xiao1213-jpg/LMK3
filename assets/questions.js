// Six-item branching preference guide. No summed scores or strength estimates.
export const primaryOrder=['time','message','life'];
export const rotations=[['time','message','life'],['message','life','time'],['life','time','message']];
export const labels={time:'時間の物語',message:'誰かの想い',life:'暮らしの楽しみ',inherit:'馴染みのある形を楽しむ',weave:'形を変えて楽しむ',outer:'色や形そのもの',inner:'そこから広がる意味',quiet:'一匹で味わう時間',share:'誰かと分かち合う時間'};
const pairs={
 'time,message':{scene:'古書店で、昔の絵葉書を見つけました。気になるのは？',answers:{time:'描かれた町が、昔どんな姿だったか',message:'差出猫が、どんな想いで書いたか'}},
 'time,life':{scene:'長く続くお茶屋に入りました。気になるのは？',answers:{time:'昔から今までの、お店の歩み',life:'淹れたてのお茶の香り'}},
 'message,life':{scene:'小さな包みに、手紙と焼き菓子が。あとから思い出しそうなのは？',answers:{message:'手紙の言葉から伝わる気持ち',life:'焼き菓子の香りと味わい'}}
};
const finalOptions={time:'町が歩んできた時間の展示',message:'猫たちの想いを伝える手紙',life:'お茶の時間を彩る器と菓子'};
export const binaryQuestions=[
{id:'pattern',axis:'relation',keys:['inherit','weave'],scene:'古い花模様から生まれた、二枚の飾り紙。窓辺に飾りたいのは？',a:'昔の配色を再現した一枚',b:'新しい配色に仕立てた一枚'},
{id:'picture',axis:'expression',keys:['outer','inner'],scene:'小さな画廊で、一枚の絵に心が留まりました。惹かれるのは？',a:'色や線の組み合わせ',b:'描かれた場面に感じる物語'},
{id:'news',axis:'enjoyment',keys:['quiet','share'],scene:'嬉しい知らせが届きました。そのあと、ほしくなるのは？',a:'一匹で、嬉しさを味わう時間',b:'誰かと、嬉しさを分かち合う時間'}
];
export const axes={primary:'心が向くもの',relation:'受け継いだものの楽しみ方',expression:'美しさの見つめ方',enjoyment:'喜びの味わい方'};
export function questionAt(index,answers,seed){
 if(!Number.isInteger(index)||index<0||index>5)throw Error('Invalid question');
 if(index>=3)return binaryQuestions[index-3];
 const rotation=rotations[(seed>>>0)%3];
 const winner0=rotation[answers[0]===1?1:0],loser0=rotation[answers[0]===1?0:1];
 const pair=index===0?rotation.slice(0,2):index===1?[loser0,rotation[2]]:[winner0,answers[1]===1?rotation[2]:loser0];
 if(index===2)return {id:'priority',axis:'primary',keys:pair,scene:'王国の小さな展覧会。最後にもう一度見たいのは？',a:finalOptions[pair[0]],b:finalOptions[pair[1]]};
 const key=[...pair].sort((a,b)=>primaryOrder.indexOf(a)-primaryOrder.indexOf(b)).join(',');const q=pairs[key];
 return {id:'discovery'+index,axis:'primary',keys:pair,scene:q.scene,a:q.answers[pair[0]],b:q.answers[pair[1]]};
}
