(() => {
'use strict';
const PACKS=window.WIND_CONTENT_PACKS_V10;
if(!PACKS)return;
const SYLLABI=window.WIND_NAMED_SYLLABI_V11||{};
const STORE='wind-named-curriculum-v11';
const page=document.body.dataset.page||'';
const params=new URLSearchParams(location.search);
const isCourse=page==='course'||(page==='courses'&&params.has('subject'));
if(!isCourse)return;
if(!document.querySelector('link[data-named-curriculum-v11]')){
 const link=document.createElement('link');
 link.rel='stylesheet';
 link.href='assets/named-curriculum-v11.css?v=20260806-1';
 link.dataset.namedCurriculumV11='1';
 document.head.append(link);
}

const POEMS={
'咏鹅':'鹅，鹅，鹅，曲项向天歌。\n白毛浮绿水，红掌拨清波。',
'春晓':'春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
'静夜思':'床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
'登鹳雀楼':'白日依山尽，黄河入海流。\n欲穷千里目，更上一层楼。',
'悯农（其二）':'锄禾日当午，汗滴禾下土。\n谁知盘中餐，粒粒皆辛苦。',
'江南':'江南可采莲，莲叶何田田。\n鱼戏莲叶间。鱼戏莲叶东，鱼戏莲叶西，鱼戏莲叶南，鱼戏莲叶北。',
'望庐山瀑布':'日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。',
'绝句':'两个黄鹂鸣翠柳，一行白鹭上青天。\n窗含西岭千秋雪，门泊东吴万里船。',
'小池':'泉眼无声惜细流，树阴照水爱晴柔。\n小荷才露尖尖角，早有蜻蜓立上头。',
'山行':'远上寒山石径斜，白云生处有人家。\n停车坐爱枫林晚，霜叶红于二月花。',
'题西林壁':'横看成岭侧成峰，远近高低各不同。\n不识庐山真面目，只缘身在此山中。',
'游子吟':'慈母手中线，游子身上衣。\n临行密密缝，意恐迟迟归。\n谁言寸草心，报得三春晖。'
};
const TYPE={
chinese:'language',english:'language',cantonese:'language',japanese:'language',korean:'language',
math:'math',science:'science',physics:'science',chemistry:'science',biology:'science',
history:'humanities',geography:'humanities',computing:'computing',finance:'decision',logic:'logic'
};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=v=>String(v??'').replace(/\s+/g,' ').trim();
const load=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}};
const state={progress:{},...load()};
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state))}catch{}};
const doneCount=id=>Object.values(state.progress[id]||{}).filter(Boolean).length;
const stageKey=()=>document.querySelector('#subject-stage')?.value||params.get('stage')||document.body.dataset.stage||'primary';
const subjectKey=()=>document.body.dataset.subject||params.get('subject')||'chinese';
const duration=stage=>({preschool:'20 分钟',primary:'30 分钟',junior:'40 分钟',senior:'50 分钟',advanced:'60 分钟'}[stage]||'35 分钟');
const extractWork=title=>title.match(/《([^》]+)》/)?.[1]||'';

function categoryOf(subject,title){
 if(subject==='chinese'){
  if(title.includes('《'))return title.includes('作文')?'写作':'经典篇目';
  if(/写作|习作|作文/.test(title))return'写作';
  if(/阅读|新闻|文本/.test(title))return'阅读';
  return'语言基础';
 }
 if(['english','cantonese','japanese','korean'].includes(subject)){
  if(/Phonics|Letters|假名|音|拼|聲|辅音|元音|字母/i.test(title))return'语音文字';
  if(/阅读|讀|writing|Writing|作文|메일|郵件|邮件|报告|報告|essay/i.test(title))return'阅读写作';
  if(/语法|助词|助詞|形|时态|時態|句|voice|clause|tense|语尾|語尾/i.test(title))return'语法';
  return'情境会话';
 }
 if(subject==='math'){
  if(/图形|周长|面积|体积|圆|三角|几何|向量|空间/.test(title))return'图形与几何';
  if(/概率|统计|平均|随机/.test(title))return'统计与概率';
  if(/函数|方程|不等式|代数|矩阵|数列|导数|极限/.test(title))return'代数与函数';
  return'数与运算';
 }
 if(['science','physics','chemistry','biology'].includes(subject)){
  if(/实验|测量|观察|探究|设计|拟合|误差/.test(title))return'实验探究';
  if(subject==='biology')return/生态|环境|食物链|种群|群落/.test(title)?'生态与环境':'生命科学';
  if(subject==='chemistry')return/有机|官能团|烃|醇|酸和酯/.test(title)?'有机化学':'物质与反应';
  if(subject==='physics')return/电|磁|光|波/.test(title)?'电磁与光':'运动与能量';
  return'科学概念';
 }
 if(subject==='history')return/史料|材料|研究|档案|口述/.test(title)?'史料研习':'历史进程';
 if(subject==='geography')return/GIS|遥感|地图|经纬|图层/.test(title)?'地图与技术':'区域与环境';
 if(subject==='computing')return/HTML|CSS|JavaScript|Web|API|数据库|SQL/.test(title)?'Web 与数据':/算法|数据结构|复杂度|递归|动态规划/.test(title)?'算法':'编程与项目';
 if(subject==='finance')return/股票|债券|基金|投资|资产|估值/.test(title)?'投资':'个人财务';
 if(subject==='logic')return/谬误|新闻|广告|媒体/.test(title)?'信息辨析':'推理与论证';
 return'课程';
}

function exampleFor(subject,title){
 const t=title;
 if(subject==='chinese'){
  const work=extractWork(t);
  if(POEMS[work])return POEMS[work];
  if(/论语/.test(t))return'示例：“学而时习之，不亦说乎？”先解释关键词，再说明它对学习方法的启示。';
  if(/写作|作文|习作/.test(t))return'示例提纲：起因—关键经过—最有画面的细节—结果—我的变化。';
  if(/议论文/.test(t))return'示例论证：主张“阅读需要主动提问”，用学习效果和具体阅读案例作证据，再回应“只看答案更快”的反方意见。';
  return'从标题、关键词、句子关系和结构线索入手，先找证据，再用自己的话解释。';
 }
 if(subject==='math'){
  if(/凑十/.test(t))return'8＋7＝8＋2＋5＝15。先从 7 中分出 2，与 8 凑成 10。';
  if(/退位|破十/.test(t))return'13－8＝10－8＋3＝5。把 13 分成 10 和 3。';
  if(/6×7|乘法口诀/.test(t))return'6×7 表示 7 个 6 相加，也可以用 5×7＋1×7＝35＋7＝42。';
  if(/三位数乘两位数/.test(t))return'326×24＝326×4＋326×20＝1304＋6520＝7824，并用 300×20≈6000 估算检查。';
  if(/异分母/.test(t))return'3/4＋1/8＝6/8＋1/8＝7/8。';
  if(/小数乘法/.test(t))return'2.4×0.3：先算 24×3＝72，共两位小数，所以结果是 0.72。';
  if(/百分数|折扣/.test(t))return'原价 240 元，八五折：240×85%＝204 元。';
  if(/圆的周长/.test(t))return'直径 10 cm，周长 C＝πd≈31.4 cm；面积 S＝πr²≈78.5 cm²。';
  if(/体积/.test(t))return'长方体长 8 cm、宽 5 cm、高 3 cm，体积 8×5×3＝120 cm³。';
  if(/方程/.test(t))return'3x＋5＝20，先减 5 得 3x＝15，再除以 3 得 x＝5；代回验算。';
  if(/一次函数/.test(t))return'y＝2x＋1：当 x 每增加 1，y 增加 2；图像过点 (0,1)。';
  if(/一元二次/.test(t))return'x²－5x＋6＝0，可因式分解为 (x－2)(x－3)＝0。';
  if(/导数/.test(t))return'f(x)=x²－4x＋1，f′(x)=2x－4；x=2 时取得最小值。';
  if(/概率/.test(t))return'袋中有 3 个红球、2 个蓝球，随机取 1 个红球的概率是 3/5。';
  return'先把题目中的已知量、未知量和关系写清楚，再选择算式或模型，并用估算、逆运算或边界检查。';
 }
 if(subject==='english'){
  if(/Hello|names and ages/i.test(t))return"A: Hello! What's your name?\nB: My name is Mia. I'm nine years old.";
  if(/Family/i.test(t))return'This is my mother. These are my grandparents. My brother likes football.';
  if(/Daily Routines/i.test(t))return'I get up at seven, go to school at eight, and do my homework after dinner.';
  if(/Supermarket|How much/i.test(t))return'A: How much are these apples?\nB: They are three dollars a kilo.';
  if(/directions|Around Town/i.test(t))return'Go straight, turn left at the bank, and the library is next to the park.';
  if(/past|Last Weekend/i.test(t))return'Last Saturday, I visited my grandmother and cooked lunch with her.';
  if(/Future Plans|going to/i.test(t))return'I am going to join the science club next term.';
  if(/passive/i.test(t))return'The bridge was built in 2018. The focus is the bridge and the action.';
  if(/condition/i.test(t))return'If it rains tomorrow, we will stay indoors. If I had more time, I would learn Spanish.';
  return'Read or listen once for the main idea, again for details, then reuse the target words and sentence pattern in your own message.';
 }
 if(subject==='cantonese'){
  if(/茶餐廳|點餐/.test(t))return'A：唔該，我要一個菠蘿油同一杯凍檸茶。\nB：好呀，仲要唔要其他？';
  if(/問路|地鐵/.test(t))return'A：唔該，點去地鐵站呀？\nB：直行到路口，再轉右。';
  if(/自我介紹|我叫/.test(t))return'大家好，我叫阿晴，今年九歲，我鍾意畫畫。';
  return'先聽完整句，再標出粵拼與聲調；跟讀、替換關鍵詞，最後完成一段真實情境對話。';
 }
 if(subject==='japanese'){
  if(/自我紹介|自我介紹|わたしは/.test(t))return'はじめまして。わたしはミナです。九さいです。どうぞよろしく。';
  if(/買物|購物|いくら/.test(t))return'A：これは いくらですか。\nB：八百円です。';
  if(/問路|どこ/.test(t))return'A：えきは どこですか。\nB：ぎんこうの となりです。';
  return'先通读情境对话，圈出助词与活用；完成替换练习，再不看文本复述。';
 }
 if(subject==='korean'){
  if(/自我介紹|저는/.test(t))return'안녕하세요. 저는 민지예요. 열 살이에요. 만나서 반가워요.';
  if(/點餐|주세요/.test(t))return'A：비빔밥 하나 주세요.\nB：네, 음료수도 드릴까요?';
  if(/購物|얼마/.test(t))return'A：이거 얼마예요?\nB：오천 원이에요.';
  return'先读音节并标出收音，观察助词和语尾；完成替换对话，再用相同结构表达自己的信息。';
 }
 if(subject==='science')return'示例探究：提出“光照会不会影响种子发芽”的问题，只改变光照，保持种子数量、水量、温度和观察天数相同，记录并比较发芽率。';
 if(subject==='physics'){
  if(/欧姆|U=IR/.test(t))return'电阻 R=10 Ω，两端电压 U=6 V，电流 I=U/R=0.6 A。';
  if(/牛顿第二|F=ma/.test(t))return'质量 2 kg 的小车受到 6 N 合力，加速度 a=F/m=3 m/s²。';
  if(/速度|v=s\/t/.test(t))return'小车 5 s 通过 20 m，平均速度 v=20/5=4 m/s。';
  if(/密度/.test(t))return'金属块质量 54 g，体积 20 cm³，密度 ρ=54/20=2.7 g/cm³。';
  return'明确研究对象，画出示意图或受力图，列出物理量与单位，再建立公式并用数量级和边界情况检查。';
 }
 if(subject==='chemistry'){
  if(/质量守恒/.test(t))return'密闭容器中反应前后总质量相等；原子的种类和数目没有改变，只是重新组合。';
  if(/配平/.test(t))return'2H₂＋O₂→2H₂O。先数各元素原子数，再调整化学计量数。';
  if(/二氧化碳/.test(t))return'CaCO₃＋2HCl→CaCl₂＋H₂O＋CO₂↑；将气体通入澄清石灰水检验。';
  if(/原电池/.test(t))return'锌—铜原电池中，锌失电子发生氧化，电子经外电路流向铜电极。';
  return'把宏观现象、微观粒子变化和化学符号连接起来，同时写明条件、安全事项和守恒关系。';
 }
 if(subject==='biology'){
  if(/光合作用/.test(t))return'绿色植物在光下利用二氧化碳和水合成有机物并释放氧气；变量实验需设置遮光或缺少某条件的对照。';
  if(/孟德尔|遗传/.test(t))return'杂合子 Aa 自交，基因型比例 1AA:2Aa:1aa，显性表型通常为 3:1。';
  if(/DNA|蛋白质/.test(t))return'DNA 转录形成 RNA，RNA 在核糖体上翻译成蛋白质；碱基序列决定氨基酸序列。';
  return'用“结构—功能—过程—证据”组织学习，画出模型或流程图，并用实验或数据支持解释。';
 }
 if(subject==='history')return'材料研习：先确认材料的作者、时间、对象和目的，再提取可支持的事实，区分材料能够说明什么、不能说明什么。';
 if(subject==='geography')return'地图任务：确认方向、比例尺、图例和空间尺度；描述分布特征，再结合自然与人文因素解释原因。';
 if(subject==='computing'){
  if(/Python 变量/.test(t))return"```python\nname = input('Name: ')\nprint(f'Hello, {name}!')\n```";
  if(/条件语句/.test(t))return"```python\nscore = 82\nif score >= 60:\n    print('pass')\nelse:\n    print('try again')\n```";
  if(/循环|for 与 while/.test(t))return"```python\nfor i in range(1, 6):\n    print(i, i*i)\n```";
  if(/HTML/.test(t))return'```html\n<main><h1>My Project</h1><p>A clear introduction.</p></main>\n```';
  if(/SQL|数据库/.test(t))return'```sql\nSELECT subject, AVG(score)\nFROM results\nGROUP BY subject;\n```';
  return'从真实需求写出输入、处理和输出；先做最小可运行版本，再测试正常、边界和错误输入，记录调试过程。';
 }
 if(subject==='finance'){
  if(/预算|现金流/.test(t))return'月收入 3000 元：必要支出 1800、储蓄 600、弹性支出 600；若实际超支，应先找可调整项目。';
  if(/复利/.test(t))return'本金 10000 元，年收益率 5%，10 年后约为 10000×1.05¹⁰≈16289 元。';
  if(/单价/.test(t))return'750 mL 售 18 元，1.5 L 售 32 元；统一换算为每升价格再比较。';
  if(/投资组合/.test(t))return'根据目标期限、风险承受能力和流动性需求，比较现金、债券、股票基金的比例，而不是只看最高收益。';
  return'先明确目标与期限，列出现金流和约束，再比较方案的成本、风险、机会成本和最坏情形。';
 }
 if(subject==='logic'){
  if(/相关不等于因果/.test(t))return'冰淇淋销量和溺水事件同时增加，不代表冰淇淋导致溺水；共同原因可能是炎热天气。';
  if(/三段论/.test(t))return'所有哺乳动物都有脊柱；鲸是哺乳动物；所以鲸有脊柱。检查前提真假与推理形式。';
  if(/以偏概全/.test(t))return'“我遇到的两个客服态度不好，所以这家公司所有客服都不好”样本太少且不具代表性。';
  if(/贝叶斯/.test(t))return'检测结果阳性并不等于患病概率 100%；还要结合基础患病率、灵敏度和特异度更新判断。';
  return'把论证拆成主张、前提、证据和隐含假设；寻找反例、替代解释和边界条件，再判断结论强度。';
 }
 return'围绕本课主题完成材料阅读、示范分析、独立练习和小测。';
}

function quizFor(subject,title,example){
 const kind=TYPE[subject];
 if(kind==='math')return{q:`请不用照抄，重新完成“${title}”中的示例，并写出一种检查方法。`,a:'答案应包含正确步骤、结果与估算/逆运算/代回等检查。'};
 if(kind==='science')return{q:`围绕“${title}”写出自变量、因变量和至少两个控制变量。`,a:'自变量是主动改变的条件，因变量是测量结果，其余可能影响结果的条件应保持一致。'};
 if(kind==='humanities')return{q:`关于“${title}”，材料能够直接支持哪一个结论？还缺少什么证据？`,a:'应引用材料中的具体信息，并说明来源、时间、立场或比较材料方面的限制。'};
 if(kind==='computing')return{q:`为“${title}”设计一个正常输入、一个边界输入和一个错误输入。`,a:'三类测试应分别验证主流程、临界条件和错误处理。'};
 if(kind==='decision')return{q:`“${title}”中，目标、约束、风险和机会成本分别是什么？`,a:'答案要把想达到的结果、资源限制、不确定损失和放弃的次优选择分开说明。'};
 if(kind==='logic')return{q:`为“${title}”写出一个反例或替代解释。`,a:'反例需满足前提却使结论不成立；替代解释需能解释同一现象。'};
 if(kind==='language')return{q:`用本课的关键词或句型，独立完成一句新的表达，并解释它与示例的对应关系。`,a:'表达应语义完整、形式正确，并能指出替换了哪些信息。'};
 return{q:`用自己的话解释“${title}”的核心内容。`,a:'应包含关键概念、证据或步骤，而不只是重复标题。'};
}

function stepsFor(subject,title,material,example,quiz){
 const kind=TYPE[subject];
 const names={
 language:['完整输入','词句拆解','跟读或精读','迁移表达','小测与回顾'],
 math:['读懂情境','建立模型','示范计算','独立变式','验算与小测'],
 science:['提出问题','形成假设','实验或模型','分析证据','结论与反思'],
 humanities:['定位时空','阅读材料','建立因果','比较解释','证据论证'],
 computing:['明确需求','设计方案','动手实现','测试调试','复盘发布'],
 decision:['明确目标','整理数据','比较方案','评估风险','做出决策'],
 logic:['写出命题','识别证据','检查推理','寻找反例','形成结论']
 }[kind]||['导入','讲解','示范','练习','小测'];
 return names.map((name,i)=>({
  name,
  body:[
   `先读标题“${title}”，说出你已经知道什么、还想确认什么。`,
   `阅读本课材料，标出关键词、公式、证据或语言结构：${text(material).slice(0,180)}`,
   `跟随示例逐步解释每一个变化或判断：${text(example).slice(0,220)}`,
   `合上示例，独立完成一个同类型任务；做错时记录错误发生在哪一步。`,
   `${quiz.q}`
  ][i]
 }));
}

function lessonsFor(subject,stage){
 const titles=SYLLABI[subject]?.[stage]||[];
 return titles.map((title,index)=>{
  const material=exampleFor(subject,title);
  const quiz=quizFor(subject,title,material);
  return{
   id:`v11-${subject}-${stage}-${String(index+1).padStart(3,'0')}`,
   subject,stage,title,index,
   category:categoryOf(subject,title),
   duration:duration(stage),
   material,
   example:material,
   quiz,
   steps:stepsFor(subject,title,material,material,quiz)
  };
 });
}
const current={subject:'',stage:'',category:'',lessons:[]};

function modalFor(lesson){
 document.querySelector('#v11-lesson-modal')?.remove();
 const count=doneCount(lesson.id);
 const modal=document.createElement('div');
 modal.id='v11-lesson-modal';
 modal.innerHTML=`<div class="v11-backdrop" data-v11-close></div>
 <section class="v11-modal" role="dialog" aria-modal="true">
  <header><div><span>${esc(PACKS.subjects[lesson.subject]?.name||lesson.subject)} · ${esc(PACKS.stages[lesson.stage]||lesson.stage)} · 第 ${String(lesson.index+1).padStart(2,'0')} 课</span><h1>${esc(lesson.title)}</h1><p>${lesson.duration} · 五步完成本课</p></div><button type="button" data-v11-close aria-label="关闭">×</button></header>
  <main>
   <article class="v11-material"><h2>本课学习材料</h2><pre>${esc(lesson.material)}</pre></article>
   <article><h2>学习目标</h2><ul><li>能准确说明本课核心概念、文本或方法。</li><li>能跟随示例解释关键步骤，而不是只记答案。</li><li>能独立完成同类型任务并检查结果。</li></ul></article>
   <section class="v11-step-list">${lesson.steps.map((step,i)=>`<article class="${state.progress[lesson.id]?.[i]?'done':''}"><div><b>${i+1}</b><span><strong>${esc(step.name)}</strong><p>${esc(step.body)}</p></span></div><button type="button" data-v11-step="${i}">${state.progress[lesson.id]?.[i]?'已完成':'完成这一步'}</button></article>`).join('')}</section>
   <article class="v11-quiz"><h2>本课小测</h2><p>${esc(lesson.quiz.q)}</p><details><summary>查看参考答案</summary><p>${esc(lesson.quiz.a)}</p></details></article>
  </main>
  <footer><span>本课进度 <strong id="v11-modal-progress">${count}/5</strong></span><a href="practice.html?subject=${encodeURIComponent(lesson.subject)}&stage=${encodeURIComponent(lesson.stage)}&autostart=1">进入专项练习</a></footer>
 </section>`;
 document.body.append(modal);
 modal.querySelectorAll('[data-v11-close]').forEach(n=>n.onclick=()=>modal.remove());
 modal.querySelectorAll('[data-v11-step]').forEach(btn=>btn.onclick=()=>{
  const i=Number(btn.dataset.v11Step);
  state.progress[lesson.id]={...(state.progress[lesson.id]||{}),[i]:!state.progress[lesson.id]?.[i]};
  save();
  btn.closest('article').classList.toggle('done',Boolean(state.progress[lesson.id][i]));
  btn.textContent=state.progress[lesson.id][i]?'已完成':'完成这一步';
  modal.querySelector('#v11-modal-progress').textContent=`${doneCount(lesson.id)}/5`;
  drawRows();
 });
}

let root=null;
function drawRows(){
 if(!root)return;
 const list=current.lessons.filter(l=>!current.category||l.category===current.category);
 const firstIncomplete=list.find(l=>doneCount(l.id)<5)?.id;
 const rows=root.querySelector('#v11-course-rows');
 rows.innerHTML=list.map(lesson=>{
  const count=doneCount(lesson.id),pct=count*20;
  return`<button class="v11-row ${count===5?'complete':''}" type="button" data-v11-open="${esc(lesson.id)}">
   <span class="v11-node"><i></i></span>
   <span class="v11-row-main"><small>第 ${String(lesson.index+1).padStart(2,'0')} 课 · ${count?'学习中':'新课'}</small><strong>${esc(lesson.title)}</strong><em><i style="width:${pct}%"></i></em></span>
   <span class="v11-row-side">${lesson.id===firstIncomplete?'<b>推荐</b>':''}<strong>${count}/5</strong></span>
  </button>`;
 }).join('');
 rows.querySelectorAll('[data-v11-open]').forEach(btn=>btn.onclick=()=>modalFor(current.lessons.find(l=>l.id===btn.dataset.v11Open)));
 const completed=current.lessons.filter(l=>doneCount(l.id)===5).length;
 root.querySelector('#v11-map-progress').textContent=`${completed}/${current.lessons.length}`;
}

function renderMap(){
 const subject=subjectKey(),stage=stageKey();
 const lessons=lessonsFor(subject,stage);
 if(!lessons.length)return;
 current.subject=subject;current.stage=stage;current.lessons=lessons;current.category='';
 const categories=[...new Set(lessons.map(l=>l.category))];
 root.innerHTML=`<header class="v11-map-head"><div><span>课程地图</span><h2>一步一步掌握</h2><p>${esc(PACKS.subjects[subject]?.name||subject)} · ${esc(PACKS.stages[stage]||stage)}，共 ${lessons.length} 门具名课程，每课包含 5 个实际学习步骤。</p></div><div><select id="v11-category"><option value="">全部</option>${categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select><span class="v11-map-total"><strong id="v11-map-progress">0/${lessons.length}</strong><small>已学完</small></span></div></header><div id="v11-course-rows" class="v11-rows"></div>`;
 root.querySelector('#v11-category').onchange=e=>{current.category=e.target.value;drawRows();};
 drawRows();
}

function mount(){
 if(root)return true;
 const anchor=document.querySelector('#guided-path-v9')||document.querySelector('#deep-course-v6')||document.querySelector('#app > *');
 if(!anchor)return false;
 const old=document.querySelector('#v10-course-library');
 if(old)old.classList.add('v11-replaced');
 root=document.createElement('section');
 root.id='v11-course-map';
 anchor.after(root);
 renderMap();
 const select=document.querySelector('#subject-stage');
 if(select)select.addEventListener('change',()=>setTimeout(renderMap,0));
 const observer=new MutationObserver(()=>document.querySelector('#v10-course-library')?.classList.add('v11-replaced'));
 observer.observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
 return true;
}
let tries=0;
const timer=setInterval(()=>{tries++;if(mount()||tries>120)clearInterval(timer)},100);
})();
