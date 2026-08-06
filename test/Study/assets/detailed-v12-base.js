(() => {
'use strict';
const STAGES={preschool:'幼小衔接',primary:'小学',junior:'初中',senior:'高中',advanced:'进阶'};
const SUBJECTS={chinese:'语文',math:'数学',english:'英语',cantonese:'粤语',japanese:'日语',korean:'韩语',science:'科学',physics:'物理',chemistry:'化学',biology:'生物',history:'历史',geography:'地理',computing:'信息科技',finance:'财商与生活',logic:'逻辑与思辨'};
const DURATIONS={preschool:18,primary:28,junior:38,senior:48,advanced:58};
const registry=window.WIND_DETAILED_BUILDERS_V12||(window.WIND_DETAILED_BUILDERS_V12={});
const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
const list=(value,min=0)=>{
 const result=Array.isArray(value)?value.filter(Boolean).map(item=>typeof item==='string'?clean(item):item):value?[value]:[];
 while(result.length<min)result.push(`围绕“${result[0]||'本课主题'}”完成一次独立解释、一次应用和一次检查。`);
 return result;
};
const qa=(q,a,level='基础')=>({q:clean(q),a:clean(a),level});
const block=(title,body)=>({title:clean(title),body:clean(body)});
const hash=text=>{
 let h=2166136261;
 for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(36);
};
const defaultMaterial=(subject,stage,title)=>{
 const level=STAGES[stage]||stage;
 const name=SUBJECTS[subject]||subject;
 return `${level}${name}课程“${title}”以一个可观察、可计算或可表达的完整任务为主线。学习者先识别题目中的对象、条件和目标，再使用本学科的方法处理材料，最后用证据、验算、复述或作品说明结果为什么成立。`;
};
const defaultExamples=(subject,title)=>{
 const examples={
 chinese:[`从“${title}”的题目、关键词和句子关系中找出两条文本证据，再概括作者怎样推进内容。`,`把同一内容分别改写成一句概括和一段有细节的表达，比较信息取舍。`],
 math:[`把“${title}”转化为已知量、未知量与数量关系，写出完整算式并逐步计算。`,`改变一个条件形成变式，用估算或逆运算检查答案。`],
 english:[`Read or listen to a complete situation about “${title}”, underline the target words, and explain their function.`,`Reuse the pattern in a new dialogue or paragraph, then check meaning, grammar and pronunciation.`],
 cantonese:[`听一段与“${title}”有关的完整粤语对话，标出关键词、粤拼和声调，再逐句跟读。`,`替换人物、地点或时间，完成一段新的粤语情境表达，并回听检查。`],
 japanese:[`阅读与“${title}”有关的完整日语情境，圈出假名、助词和活用形式。`,`替换关键词完成新对话，再用日语复述主要信息。`],
 korean:[`阅读与“${title}”有关的完整韩语情境，拆分音节、助词和语尾。`,`改变人物或场景重新表达，并检查收音、连音和敬语。`],
 science:[`围绕“${title}”提出可检验问题，写出自变量、因变量和控制变量。`,`根据一组观察数据画表或图，区分现象、证据与解释。`],
 physics:[`为“${title}”画出研究对象、方向和已知物理量，统一单位后建立模型。`,`改变一个物理量预测结果，再用公式、图像或实验数据检验。`],
 chemistry:[`把“${title}”同时写成宏观现象、微观粒子解释和符号表达。`,`根据守恒与比例完成一个定量例题，并检查单位和有效数字。`],
 biology:[`从结构与功能的关系解释“${title}”，画出过程或系统示意图。`,`根据实验或遗传数据提出结论，并指出结论适用的条件。`],
 history:[`把“${title}”放入时间线和空间背景，区分原因、过程、结果与影响。`,`比较两则不同来源的史料，判断作者立场、证据价值和局限。`],
 geography:[`围绕“${title}”读取地图、图表或区域材料，描述空间分布和变化。`,`用自然与人文因素建立因果链，并提出可持续方案。`],
 computing:[`把“${title}”拆成输入、处理、输出和测试条件，写出伪代码或结构图。`,`实现一个最小可运行版本，用正常、边界和错误输入进行调试。`],
 finance:[`为“${title}”列出目标、现金流、期限、风险和机会成本。`,`比较两个具体方案，计算关键数字并解释最终选择。`],
 logic:[`把“${title}”写成清晰的主张、理由、证据和隐含前提。`,`构造反例或替代解释，判断原结论需要怎样修改才可靠。`]
 };
 return examples[subject]||[`围绕“${title}”完成一个分步示例。`,`改变条件完成一个迁移示例。`];
};
function normalize(subject,stage,title,index,spec={}){
 const material=clean(spec.material)||defaultMaterial(subject,stage,title);
 const worked=list(spec.workedExamples||spec.examples||defaultExamples(subject,title),2).map((item,i)=>typeof item==='string'?block(`例 ${i+1}`,item):item);
 const lesson={
  id:`v12-${subject}-${stage}-${String(index+1).padStart(3,'0')}`,
  sourceId:`v11-${subject}-${stage}-${String(index+1).padStart(3,'0')}`,
  subject,subjectName:SUBJECTS[subject]||subject,stage,stageName:STAGES[stage]||stage,title:clean(title),index,
  duration:Number(spec.duration)||DURATIONS[stage]||35,
  overview:clean(spec.overview)||`完成“${title}”后，能够说明核心内容、展示方法、完成应用并检查结果。`,
  objectives:list(spec.objectives||[
   `准确说出“${title}”中的核心对象、条件和结论。`,
   `按本学科规范完成一个完整示例，并解释关键步骤。`,
   `独立处理一个变式任务，发现错误后能够修正。`
  ],3),
  material,
  explanation:list(spec.explanation||[
   `先整体阅读或观察材料，圈出与“${title}”直接相关的信息。`,
   `把材料拆成概念、关系、步骤或证据，说明各部分怎样连接。`,
   `回到完整任务，用自己的话复述方法和结论。`
  ],3).map((item,i)=>typeof item==='string'?block(`第 ${i+1} 层`,item):item),
  workedExamples:worked,
  keyPoints:list(spec.keyPoints||[
   `先明确“${title}”要解决的具体问题。`,
   '所有结论都要能回到材料、公式、数据或语言证据。',
   '步骤之间要说明理由，不能只写最终答案。',
   '完成后必须进行验算、复述、对照或反例检查。'
  ],4),
  examPoints:list(spec.examPoints||[
   `能识别“${title}”的核心概念或主要信息。`,
   '能解释关键步骤、语言效果、因果关系或模型依据。',
   '能在新材料中迁移使用，并规范表达。'
  ],3),
  mistakes:list(spec.mistakes||[
   '只记结论，不说明条件和理由。',
   '忽略题目中的限定词、单位、语境或证据来源。',
   '没有检查结果是否符合常识、材料或边界条件。'
  ],3),
  practice:list(spec.practice||[
   qa(`用一句话概括“${title}”要解决什么。`,`答案应包含核心对象、任务和限定条件。`),
   qa('列出本课最关键的三个信息或步骤。','从材料中选择决定结论的概念、证据或操作。'),
   qa('改变一个条件后，原方法是否仍适用？','先指出改变的条件，再说明需保持、修改或放弃的方法。'),
   qa('怎样检查自己的答案或作品？','使用验算、反例、回读、对照数据、运行测试或同伴复核。','提升')
  ],4).map(item=>typeof item==='string'?qa(item,'依据本课材料作答。'):item),
  extension:clean(spec.extension)||`把“${title}”应用到一个真实生活、跨学科或更高难度情境，记录过程、结果和一次修正。`,
  summary:clean(spec.summary)||`本课不是记住一个孤立答案，而是掌握处理“${title}”类问题的完整路径：识别—分析—应用—检查。`,
  tags:list(spec.tags||[],0),
  audioLanguage:spec.audioLanguage||'',
  fingerprint:hash(`${subject}|${stage}|${title}|${material}|${worked.map(x=>x.body).join('|')}`)
 };
 return lesson;
}
function fallback(subject,stage,title,index){return normalize(subject,stage,title,index,{})}
function build(subject,stage,title,index=0){
 const builder=registry[subject];
 let spec={};
 try{spec=builder?builder({subject,stage,title,index,helpers:api.helpers}):{}}catch(error){console.error('Detailed lesson builder failed',subject,title,error)}
 return normalize(subject,stage,title,index,spec||{});
}
function validate(lesson){
 const errors=[];
 if(!lesson||!lesson.title)errors.push('title');
 if(clean(lesson.material).length<70)errors.push('material');
 for(const [key,min] of [['objectives',3],['explanation',3],['workedExamples',2],['keyPoints',4],['examPoints',3],['mistakes',3],['practice',4]])if(!Array.isArray(lesson[key])||lesson[key].length<min)errors.push(key);
 if(lesson.practice?.some(item=>!clean(item.q)||!clean(item.a)))errors.push('practice-answer');
 if(!clean(lesson.extension)||!clean(lesson.summary))errors.push('closing');
 return{ok:errors.length===0,errors};
}
const api={version:'20260806-2',stages:STAGES,subjects:SUBJECTS,registry,register:(subjects,builder)=>list(subjects).forEach(subject=>registry[subject]=builder),build,validate,fallback,helpers:{clean,list,qa,block,hash,normalize,defaultExamples,STAGES,SUBJECTS}};
window.WIND_DETAILED_CURRICULUM_V12=api;
})();
