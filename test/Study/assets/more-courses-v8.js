(() => {
  'use strict';
  const bank = {
    chinese:[
      ['完整叙事阅读：雨后的操场','骤雨打乱体育课，学生从抱怨转为观察积水倒影、测量水洼并完成科学记录。','梳理“意外—观察—行动—领悟”；找出人物态度转变的细节；说明结尾如何照应标题。','把一次计划外事件写成180字短文，必须包含转折和两个动作细节。'],
      ['说明文阅读：一杯水的旅程','从水库、净水厂、管网到家庭水龙头，完整说明沉淀、过滤、消毒和输送。','判断说明顺序；区分举例、列数字和作比较；概括每个环节解决的问题。','画流程图并写一段节水建议，建议必须具体可执行。'],
      ['议论文：坚持是否总会成功','文章提出“坚持必须与反馈、方法调整和目标判断结合”，用训练、实验和学习三组事例论证。','找中心论点和分论点；判断事例与观点的关联；补写反方意见并回应。','围绕“努力与方法”写出论点、两条证据和一个反驳段。']
    ],
    math:[
      ['分数应用：读书计划','一本书240页，第一周读全书的3/8，第二周读剩余部分的2/5。求两周各读多少页、还剩多少页。','先判断分数对应“全书”还是“剩余”；画线段图；分步计算；用总页数检验。','把总页数改为360页并重新求解。'],
      ['比例与速度：两段骑行','前12千米速度16千米/时，后18千米速度12千米/时。求总时间与全程平均速度。','平均速度不是两个速度直接平均；统一时间单位；使用总路程÷总时间。','比较把前后速度互换后平均速度是否改变。'],
      ['方程建模：展览门票','成人票60元、学生票35元，共售80张，收入3550元。求两类票数量。','设未知量；建立总张数和总收入关系；解方程；检验数量非负且为整数。','改变总收入，设计一组仍有整数解的新数据。'],
      ['几何：带缺口的花园','长18米宽12米的花园挖去4米×3米入口，计算种植面积、围栏长度和铺砖预算。','面积与周长分别建模；判断缺口是否减少围栏；统一长度、面积与货币单位。','画两种不同缺口位置，比较周长是否相同。'],
      ['概率：抽签是否公平','袋中红卡3张、蓝卡2张，两人依次不放回抽一张。比较先抽和后抽获红卡的概率。','写完整样本或使用条件概率；区分“先后位置”和“颜色数量”；用树状图检查。','设计一个真正不公平的抽签规则并解释。'],
      ['函数：共享单车计费','前15分钟免费，之后每15分钟1.5元，封顶12元。建立分段费用规则并比较不同骑行时长。','确定区间端点；处理不足15分钟按一段计费；加入封顶条件；画阶梯图像。','计算17、31、76和140分钟的费用。']
    ],
    english:[
      ['Phonics Story: The Fish Shop','Chip and Beth visit a fish shop. They check the price, choose fresh fish and thank the shopkeeper.','Mark sh, ch and th; blend each word; read in phrases; answer who, where and what happened.','Retell the story in four sentences and replace the shop with another place.'],
      ['Everyday English: Morning Routine','Mia gets up at 6:30, packs her bag, walks to the bus stop and reviews five words while waiting.','Use the present simple for habits; use before, after and while to organise time; identify the useful habit.','Write a six-sentence routine with at least three time connectors.'],
      ['Project Email','A student asks a teacher to check whether a science conclusion is supported by data and requests feedback by Friday.','Write a clear subject line; state purpose; make a specific request; include deadline and polite closing.','Draft a complete email asking for help with a group presentation.'],
      ['Academic Reading: Later School Start','A short argument presents possible sleep benefits, evidence from schools, transport costs and a cautious conclusion.','Separate claim, evidence, limitation and conclusion; explain why may is cautious; identify missing evidence.','Write a counterargument and a balanced final judgement.']
    ],
    cantonese:[
      ['粤语问路：港铁转车','学习“点行、搭、转车、方向、出口”等完整路线表达。','先听线路和方向，再确认站数与转车；使用“要唔要”“喺边度”“就得”。','设计从旺角到尖沙咀的问路对话，并写粤拼。'],
      ['粤语购物：尺码与试穿','学习“有冇、细一码、试身室、拎过嚟”等商店表达。','区分件、条、对等量词；练习“A定B”；完成试穿和购买决定。','写一段购买鞋子的五轮对话。'],
      ['粤语电话预约','学习说明姓名、日期、人数、时间和确认资料。','电话开头先表明目的；逐项确认数字；结尾复述预约信息。','模拟预约周六晚上七点四位用餐。']
    ],
    science:[
      ['温度影响溶解速度','用相同质量和颗粒大小的糖，比较冷水、温水、热水中的溶解时间。','控制糖量、水量、搅拌和容器；重复三次；区分溶解速度与溶解度。','设计记录表并预测温度—时间关系。'],
      ['纸桥承重实验','改变纸桥折叠形状，逐枚增加硬币，记录最大承重和失效位置。','只改变桥形；使用相同纸张和跨度；记录数据而不是凭感觉判断。','比较平纸、折扇形和箱梁形。'],
      ['校园噪声调查','在早晨、午休、放学三个时段测量校门、操场、图书馆附近声级。','统一测量时长和距离；多次测量取代表值；绘制热区图。','提出兼顾效果、成本和可执行性的降噪方案。']
    ],
    physics:[
      ['斜面小车运动','改变斜面角度，记录小车通过相同距离所需时间。','确定研究对象；控制小车、路面和起点；计算平均速度；用图像比较。','解释为什么角度增大时运动变化更明显。'],
      ['串并联灯泡','搭建串联与并联电路，测量电流、电压并比较亮度。','画规范电路图；正确连接电流表和电压表；用功率解释亮度。','预测其中一只灯断路后另一只灯的状态。'],
      ['保温杯散热','比较不同包裹材料下热水温度随时间的变化。','保持水量、初温、容器和环境一致；固定时间记录；比较降温曲线。','判断哪种材料更适合保温并说明证据。']
    ],
    chemistry:[
      ['紫甘蓝指示剂','测试安全生活液体，建立颜色与酸碱性的对应。','设置已知酸碱对照；使用相同体积；记录颜色而不是模糊描述；不得品尝。','按酸性、中性、碱性分类测试结果。'],
      ['铁锈形成条件','设置有水有空气、无水、隔绝空气、盐水四组铁钉。','明确水、氧气和盐分变量；持续多日观察；用对照支持结论。','解释海边金属更易锈蚀的原因。'],
      ['颗粒大小与速率','比较等质量块状和粉末碳酸钙与相同盐酸反应的气泡速率。','控制质量、浓度和温度；解释表面积；注意气体和酸液安全。','画出两组气体体积—时间曲线。']
    ],
    biology:[
      ['运动前后心率','测量静息、步行、慢跑后的心率和恢复时间。','先建立个人基线；控制运动时长；多次测量；解释个体差异。','用表格比较不同强度的恢复曲线。'],
      ['叶片气孔观察','制作叶表皮临时装片，比较上下表皮气孔分布。','规范取材和染色；多视野计数；联系蒸腾与气体交换。','解释为什么陆生植物下表皮气孔通常较多。'],
      ['食物网稳定性','分析池塘食物网中某种鱼减少后的连锁影响。','追踪多条捕食关系；区分短期和长期；避免只写单一线性因果。','比较移除捕食者和移除生产者的影响。']
    ],
    history:[
      ['丝绸之路的多重交流','比较商品、技术、宗教和疾病传播材料。','确定时间和空间；区分一手、二手史料；同时评价交流的收益和代价。','用两份不同类型史料支持一个结论。'],
      ['工业革命城市生活','结合人口表、工厂记录和工人回忆分析城市化。','比较不同来源立场；区分事实和观点；避免用单一材料概括全部。','写出“机会—问题—改革”三层结构。'],
      ['空间竞赛','从科技、宣传、安全和经济成本分析美苏登月竞赛。','建立背景—行动—结果因果链；比较双方动机；评价长期影响。','判断空间竞赛是否只有军事意义。']
    ],
    geography:[
      ['城市热岛调查','比较公园、商业区和住宅区的地表温度与绿化率。','确定空间尺度；结合地图、时间和天气；避免只测一个点。','提出绿化、遮阳和材料三类降温措施。'],
      ['海岸侵蚀管理','比较海堤、补沙和湿地恢复的效果、成本与生态影响。','理解波浪和沉积过程；评价多目标；关注对邻近海岸的影响。','为旅游海岸设计组合方案。'],
      ['跨境河流水资源','分析上游水坝、农业灌溉和下游生态需求。','识别利益相关者；比较丰水和枯水季；提出共享数据与协商机制。','写出兼顾三方的分水原则。']
    ],
    computing:[
      ['待办事项应用','设计添加、完成、筛选和本地保存功能。','定义数据结构；处理空输入和重复项；测试刷新后恢复；分离数据与界面。','写出至少六个测试用例。'],
      ['迷宫寻路算法','比较深度优先和广度优先在不同迷宫中的路径。','明确栈与队列；手动追踪访问顺序；比较是否保证最短路和内存消耗。','构造一个让两种算法表现差异明显的迷宫。'],
      ['问卷数据清洗','处理缺失、重复、异常和日期格式不一致的数据。','保留原始副本；记录每条清洗规则；不可无依据删除异常。','输出清洗前后行数与修改日志。']
    ],
    finance:[
      ['旅行预算','在交通、住宿、餐饮、门票和应急金之间分配预算。','区分固定与可变支出；保留应急金；比较机会成本和最坏情况。','制作基础、舒适、节省三种方案。'],
      ['复利储蓄','比较每月定投与一次性存入在不同利率下的长期结果。','明确计息周期；区分名义收益和实际购买力；考虑手续费与通胀。','用表格比较1年、5年和10年。'],
      ['保险选择','比较保费、免赔额、保障范围和极端损失。','不能只看最低保费；评估自付能力；识别免责条款和等待期。','为三个风险承受能力不同的人选择方案。']
    ],
    logic:[
      ['相关不等于因果','某校使用新软件后成绩提高，分析替代解释。','识别共同原因、选择偏差和时间趋势；寻找对照组；避免事后归因。','写出至少三种可能的替代解释。'],
      ['必要与充分条件','用入学资格、几何定义和程序判断分析条件关系。','分别检验两个方向；寻找反例；准确理解“只有”“只要”。','为每种关系各写一个生活例子。'],
      ['样本偏差','评价只调查社团成员却推断全校意见的结论。','检查抽样框、回应率和未覆盖人群；限制结论范围。','重新设计一个较有代表性的抽样方案。']
    ]
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const subject = () => document.body.dataset.subject || new URLSearchParams(location.search).get('subject') || 'chinese';
  const dailyIndex = (length, key) => {
    const date = new Date();
    return (Number(`${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`) + [...key].reduce((sum,char) => sum + char.charCodeAt(0),0)) % length;
  };
  function mount() {
    const key = subject();
    if (key === 'japanese' || key === 'korean') return false;
    const lessons = bank[key];
    const anchor = document.querySelector('#deep-course-v6');
    if (!anchor || !lessons || document.querySelector('#more-courses-v8')) return false;
    let index = dailyIndex(lessons.length, key);
    const root = document.createElement('section');
    root.id = 'more-courses-v8';
    anchor.after(root);
    const render = () => {
      const [title,material,method,task] = lessons[index];
      root.innerHTML = `<header><div><span>持续扩充课程库</span><h2>更多完整案例与例子</h2><p>当前学科共 ${lessons.length} 个扩展案例；每日推荐一个，也可切换。</p></div><button id="more-random" type="button">换一例</button></header><article class="more-case"><span>完整材料</span><h2>${esc(title)}</h2><p>${esc(material)}</p><div><section><h3>学习方法</h3><p>${esc(method)}</p></section><section><h3>迁移任务</h3><p>${esc(task)}</p></section></div></article><footer><button id="more-prev" type="button">上一例</button><span>${index+1} / ${lessons.length}</span><button id="more-next" type="button">下一例</button></footer>`;
      root.querySelector('#more-random').onclick = () => { index = lessons.length > 1 ? (index + 1 + Math.floor(Math.random() * (lessons.length - 1))) % lessons.length : 0; render(); };
      root.querySelector('#more-prev').onclick = () => { index = (index - 1 + lessons.length) % lessons.length; render(); };
      root.querySelector('#more-next').onclick = () => { index = (index + 1) % lessons.length; render(); };
    };
    render();
    return true;
  }
  const style = document.createElement('style');
  style.textContent = '#more-courses-v8{margin:22px 0 40px;background:#fff;border:1px solid rgba(31,45,78,.08);border-radius:22px;box-shadow:0 16px 42px rgba(49,61,104,.08);overflow:hidden}#more-courses-v8>header{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding:24px 27px;border-bottom:1px solid #edf0f7}#more-courses-v8 header span,.more-case>span{font-size:12px;color:#7d879c}#more-courses-v8 h2{margin:5px 0 8px;color:#22304d}#more-courses-v8 header p{margin:0;color:#68748c}#more-courses-v8 button{border:0;border-radius:11px;padding:10px 14px;background:#eef1ff;color:#4e5de3;font-weight:800;cursor:pointer}.more-case{padding:27px}.more-case>p{color:#536078;line-height:1.85;font-size:16px}.more-case>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:18px}.more-case section{padding:18px 20px;background:#f7f8fc;border-radius:16px}.more-case h3{margin:0 0 8px;color:#283550}.more-case section p{margin:0;color:#606c84;line-height:1.75}#more-courses-v8 footer{display:flex;justify-content:center;align-items:center;gap:16px;padding:15px;border-top:1px solid #edf0f7}#more-courses-v8 footer span{color:#7d879d}@media(max-width:800px){#more-courses-v8>header{display:grid}.more-case>div{grid-template-columns:1fr}}';
  document.head.append(style);
  const start = () => { if (mount()) return; const observer = new MutationObserver(() => { if (mount()) observer.disconnect(); }); observer.observe(document.body,{childList:true,subtree:true}); setTimeout(() => observer.disconnect(),16000); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
})();
