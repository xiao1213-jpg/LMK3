// Nine concrete forced choices. One contrast per item; equal weights.
export const questions=[
{id:'p_tm',kind:'primary',keys:['time','message'],scene:'古書店で、昔の絵葉書を見つけました。気になるのは？',a:'描かれた町が、昔どんな姿だったか',b:'差出猫が、どんな想いで書いたか'},
{id:'r_pattern',kind:'relation',keys:['inherit','weave'],scene:'昔の図案を使って、飾り紙を作ります。どちらも同じ手間なら？',a:'元の図案と同じ模様にする',b:'模様の並びを変えてみる'},
{id:'e_picture',kind:'expression',keys:['outer','inner'],scene:'気に入った絵を、もう少し眺められます。心が向くのは？',a:'絵の色や線の組み合わせ',b:'その絵から思い浮かぶ物語'},
{id:'j_news',kind:'enjoyment',keys:['quiet','share'],scene:'嬉しい知らせが届きました。まず、どう過ごしたい？',a:'一匹で、喜びをゆっくり味わう',b:'誰かに話して、一緒に喜ぶ'},
{id:'p_tl',kind:'primary',keys:['time','life'],scene:'長く続くお茶屋に入りました。気になるのは？',a:'昔から今までの、お店の歩み',b:'淹れたてのお茶の香り'},
{id:'r_recipe',kind:'relation',keys:['inherit','weave'],scene:'おなじみのお菓子を作ります。どちらもおいしく作れるなら？',a:'いつもと同じ味に仕上げる',b:'材料を一つ替えて、新しい味にする'},
{id:'e_travel',kind:'expression',keys:['outer','inner'],scene:'旅の景色を、一冊の手帳に残します。特に残したいのは？',a:'目にした景色の、色や形',b:'その景色から思い浮かんだこと'},
{id:'j_view',kind:'enjoyment',keys:['quiet','share'],scene:'気に入った景色の前で、しばらく過ごせます。今、望むのは？',a:'一匹で眺める時間',b:'誰かと眺める時間'},
{id:'p_ml',kind:'primary',keys:['message','life'],scene:'小さな包みに、お菓子と短い手紙が。心が向くのは？',a:'手紙に込められた、贈り主の気持ち',b:'お菓子を食べたときの、味や香り'}
];
export const axes={primary:'心が向くもの',relation:'受け継いだものの楽しみ方',expression:'美しさの見つめ方',enjoyment:'喜びの味わい方'};
export const labels={time:'時間の物語',message:'誰かの想い',life:'感覚の楽しみ',inherit:'馴染みのある形を楽しむ',weave:'形を変えて楽しむ',outer:'色や形そのもの',inner:'そこから広がる意味',quiet:'一匹で味わう時間',share:'誰かと分かち合う時間'};
