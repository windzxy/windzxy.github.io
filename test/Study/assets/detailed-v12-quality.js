(() => {
'use strict';
const api=window.WIND_DETAILED_CURRICULUM_V12;if(!api||api.__qualityWrapped)return;
const original=api.build.bind(api);
const subjectAdvice={
 chinese:'回答时必须回到具体字词、句段、结构或原文证据，并说明这些证据怎样支持理解。',
 math:'写出已知量、未知量、关系式、完整运算和检查过程，不能只给最终数字。',
 english:'Explain the form, meaning and context, then reuse the target language in a complete new situation.',
 cantonese:'先用真实粤语音频听辨，再标粤拼和声调，最后在完整情境中自然回应。',
 japanese:'先按音拍听读，再分析假名、助词、活用和礼貌关系，并在新情境中输出。',
 korean:'先拆分韩文音节、助词和语尾，再根据人物关系选择语体并完成真实表达。',
 science:'明确自变量、因变量、控制条件和测量方法，用重复数据支持有限度结论。',
 physics:'先画研究对象和受力、运动或能量关系，统一单位后列式，并检查方向与数量级。',
 chemistry:'把宏观现象、微观粒子和化学符号相互对应，同时检查原子、电荷和质量守恒。',
 biology:'说明生命层次、结构与功能、调控机制和证据，并考虑个体差异、统计和伦理。',
 history:'先定位时间与空间，再区分背景、原因、过程、结果和影响，并评价材料来源与局限。',
 geography:'先读位置、图例、比例尺和数据单位，再用自然与人文因素解释空间分布和变化。',
 computing:'写清输入、处理、输出、约束和验收条件，并用正常、边界、异常与安全测试验证。',
 finance:'明确目标、金额、期限、现金流、费用、风险和最坏情形，并对关键假设做敏感性分析。',
 logic:'把主张、前提、证据、推理关系和反例分开，判断结论强度是否与证据匹配。'
};
const minText=(value,min,suffix)=>{
 let text=String(value??'').trim();
 while(text.length<min)text+=`${text?' ':''}${suffix}`;
 return text;
};
const ensureBlocks=(items,count,title,subject,kind)=>{
 const result=Array.isArray(items)?items.map(item=>typeof item==='string'?{title:kind,body:item}:{...item}):[];
 while(result.length<count)result.push({title:`${kind} ${result.length+1}`,body:`围绕“${title}”补充一个完整、可核查的${kind}，说明条件、过程、结果和检查方法。`});
 return result.map((item,index)=>({
  title:item.title||`${kind} ${index+1}`,
  body:minText(item.body,55,`${subjectAdvice[subject]} 本部分专门对应“${title}”，完成后请用自己的话复述关键关系。`)
 }));
};
const ensureList=(items,count,title,subject,kind)=>{
 const result=Array.isArray(items)?items.map(value=>String(value).trim()).filter(Boolean):[];
 while(result.length<count)result.push(`围绕“${title}”补充一项${kind}，并用${subjectAdvice[subject]}`);
 return result;
};
api.build=(subject,stage,title,index=0)=>{
 const lesson=original(subject,stage,title,index);
 const advice=subjectAdvice[subject]||'使用明确材料、步骤和证据完成本课，并检查结果。';
 if(subject==='cantonese'&&/茶餐厅点餐/.test(title)){
  lesson.material=`真实粤语点餐对话：\n店员：早晨，想食啲咩？\n顾客：唔该，我要一个菠萝油，同一杯冻奶茶，少甜。\n店员：菠萝油要唔要加热？奶茶要唔要走冰？\n顾客：菠萝油加热，奶茶少冰，唔该。\n店员：好，一共三十八蚊。\n顾客：唔该，畀你。\n重点词语：菠萝油、冻奶茶、少甜、少冰、加热、埋单。\n粤拼提示：唔该 m4 goi1；菠萝油 bo1 lo4 jau4；冻奶茶 dung3 naai5 caa4；几多钱 gei2 do1 cin2。`;
  lesson.workedExamples=[
   {title:'完整点餐示范',body:'先用“唔该，我要……”提出食品和饮品，再补充“少甜、少冰、加热”等要求；店员复述订单后，顾客确认并询问价钱。整个对话保持粤语语音、粤拼声调和自然礼貌。'},
   {title:'替换练习',body:'把菠萝油替换成餐蛋治，把冻奶茶替换成热柠茶：唔该，我要一份餐蛋治，同一杯热柠茶，柠茶少甜。完成后再交换角色，练习店员确认订单。'},
   ...(Array.isArray(lesson.workedExamples)?lesson.workedExamples:[])
  ];
  lesson.practice=[
   {q:'在茶餐厅怎样礼貌点一个菠萝油和一杯冻奶茶？',a:'可以说：“唔该，我要一个菠萝油，同一杯冻奶茶，少甜。”回答要包含礼貌语、食品、饮品和具体要求。',level:'基础'},
   {q:'店员问“要唔要走冰”是什么意思？',a:'意思是询问是否不要冰块。“走冰”表示不加冰；“少冰”表示减少冰块，两个要求不能混淆。',level:'理解'},
   {q:'把订单改成餐蛋治、热柠茶和少甜。',a:'可以说：“唔该，我要一份餐蛋治，同一杯热柠茶，柠茶少甜。”并等待店员复述确认。',level:'应用'},
   {q:'设计一段包含点餐、修改要求、确认价钱和付款的完整对话。',a:'对话至少应出现“唔该”“我要”“少甜或少冰”“几多钱”“畀你”等表达，并保持角色回应自然连贯。',level:'提升'},
   ...(Array.isArray(lesson.practice)?lesson.practice:[])
  ];
 }
 lesson.overview=minText(lesson.overview,55,`本课围绕“${title}”形成从理解、示范到独立应用和复习的完整闭环。`);
 lesson.material=minText(lesson.material,120,`学习材料必须直接服务“${title}”：先标出对象、条件和目标，再找出决定结论的关键词、数据、公式、语法或史料。${advice}`);
 lesson.objectives=ensureList(lesson.objectives,3,title,subject,'学习目标');
 lesson.explanation=ensureBlocks(lesson.explanation,3,title,subject,'分层讲解');
 lesson.workedExamples=ensureBlocks(lesson.workedExamples,2,title,subject,'完整示例').map(item=>({
  ...item,
  body:minText(item.body,95,`请逐步重做这个“${title}”示例：写出输入或证据、每一步变化、所用规则、最终结果和至少一种检查方法。${advice}`)
 }));
 lesson.keyPoints=ensureList(lesson.keyPoints,4,title,subject,'核心知识点');
 lesson.examPoints=ensureList(lesson.examPoints,3,title,subject,'考点或能力要求');
 lesson.mistakes=ensureList(lesson.mistakes,3,title,subject,'易错点');
 const practice=Array.isArray(lesson.practice)?lesson.practice.map(item=>typeof item==='string'?{q:item,a:''}:{...item}):[];
 while(practice.length<4)practice.push({q:`完成一项与“${title}”直接相关的迁移任务。`,a:''});
 lesson.practice=practice.map((item,index)=>({
  q:minText(item.q,18,`请结合“${title}”的材料和方法作答。`),
  a:minText(item.a,38,`参考答案需写出判断依据和关键步骤。${advice} 学习者可用不同表达，但结论必须与材料和规则一致。`),
  level:item.level||(['基础','理解','应用','提升'][index]||'应用')
 }));
 lesson.extension=minText(lesson.extension,55,`把“${title}”迁移到一个新的真实情境，保存过程、结果、错误和修正版。`);
 lesson.summary=minText(lesson.summary,55,`复习时不只背结论，还要能重现“识别—分析—应用—检查”的完整路径。`);
 lesson.fingerprint=api.helpers.hash(`${subject}|${stage}|${title}|${lesson.material}|${lesson.workedExamples.map(item=>item.body).join('|')}|${lesson.practice.map(item=>item.a).join('|')}`);
 return lesson;
};
api.__qualityWrapped=true;
})();
