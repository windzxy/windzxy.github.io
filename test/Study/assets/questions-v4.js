window.WIND_QUESTIONS = (() => {
  const stages = ['preschool','primary','junior','senior','advanced'];
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const int = (min,max) => Math.floor(Math.random() * (max-min+1))+min;
  const shuffle = list => {
    const a = [...list];
    for (let i=a.length-1;i>0;i-=1) {
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  };
  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
  const choice = (subject,stage,prompt,options,answer,explanation,hint,tags=[]) => ({id:uid(),subject,stage,type:'choice',prompt,options:shuffle(options),answer,explanation,hint,tags});
  const input = (subject,stage,prompt,answer,explanation,hint,tags=[]) => ({id:uid(),subject,stage,type:'input',prompt,answer:String(answer),explanation,hint,tags});

  const banks = {
    chinese: [
      ['preschool','“苹果”的正确拼音是？',['píng guǒ','pín guǒ','píng gǒu'],'píng guǒ','“苹”读第二声，“果”读第三声。','注意声调位置。',['拼音']],
      ['preschool','“山”一共有几画？',['2','3','4'],'3','“山”的笔画是竖、竖折、竖，共3画。','在空中写一遍。',['识字']],
      ['primary','“画蛇添足”最接近哪一种意思？',['做了多余的事反而不好','做事非常认真','遇事果断'],'做了多余的事反而不好','成语比喻多此一举，反而把事情弄坏。','想一想故事中多画了什么。',['成语']],
      ['primary','“春眠不觉晓”的下一句是？',['处处闻啼鸟','花落知多少','夜来风雨声'],'处处闻啼鸟','出自孟浩然《春晓》。','回忆诗句顺序。',['古诗']],
      ['primary','句子“同学们在教室里认真地。”缺少什么成分？',['谓语','主语','宾语'],'谓语','“认真地”后面需要补充动作，如“读书”。','问一问：同学们认真地做什么？',['句子']],
      ['junior','“醉翁之意不在酒”中的“意”最恰当的解释是？',['情趣','意见','意外'],'情趣','句意是醉翁的情趣不在喝酒，而在山水之间。','结合上下文理解。',['文言文']],
      ['junior','比喻、拟人、排比中，连续三个结构相近的句子属于？',['排比','比喻','拟人'],'排比','排比用结构相同或相近的语句增强气势。','观察句式是否反复。',['修辞']],
      ['senior','议论文中直接支撑中心论点的观点通常称为？',['分论点','论据','论证方法'],'分论点','分论点从不同角度支撑中心论点。','区分观点与材料。',['写作']],
      ['senior','阅读论述类文本时，判断论据是否有效，首先要看？',['是否与论点相关','文字是否优美','篇幅是否很长'],'是否与论点相关','论据必须真实、典型，并与论点存在直接关联。','先检查证据与观点的关系。',['阅读']],
      ['advanced','学术写作中引用他人观点而不标注来源属于？',['学术不端','合理概括','自由改写'],'学术不端','引用、转述他人观点都应标明来源。','关注知识产权与引用规范。',['研究写作']]
    ],
    english: [
      ['preschool','Which word has the short /æ/ sound?',['cat','cake','car'],'cat','“cat” uses the short a sound /æ/.','Say each word slowly.',['phonics']],
      ['preschool','Choose the correct sentence for “我是一名学生”。',['I am a student.','I is a student.','Me am student.'],'I am a student.','Use “I am” before a noun phrase.','Remember: I + am.',['sentence']],
      ['primary','Which word follows the magic-e pattern?',['bike','bit','big'],'bike','The final e makes the vowel say its name: i → /aɪ/.','Look for a silent e.',['phonics']],
      ['primary','Choose the correct past tense: Yesterday, she ___ to school.',['went','go','goes'],'went','“Yesterday” signals the past tense; “go” becomes “went”.','Find the time word.',['grammar']],
      ['primary','What is the main idea of “Tom waters the plant every day. It grows taller and greener.”?',['Tom takes care of a plant.','Tom buys a new toy.','The plant is made of paper.'],'Tom takes care of a plant.','Both sentences describe Tom caring for the plant.','Combine the repeated idea.',['reading']],
      ['junior','Choose the correct passive form: People speak English worldwide.',['English is spoken worldwide.','English speaks worldwide.','English was speaking worldwide.'],'English is spoken worldwide.','Present simple passive: am/is/are + past participle.','Find the object and move it to the front.',['grammar']],
      ['junior','Which connector best shows contrast?',['however','therefore','because'],'however','“However” introduces a contrasting idea.','Think: opposite or result?',['writing']],
      ['senior','A strong thesis statement should be…',['clear and arguable','only a fact','a list of examples'],'clear and arguable','A thesis presents a focused position that can be supported with evidence.','Can someone reasonably disagree with it?',['essay']],
      ['advanced','In IELTS Writing Task 2, a paragraph should usually begin with…',['a clear topic sentence','a random quotation','a conclusion only'],'a clear topic sentence','A topic sentence states the paragraph’s controlling idea.','Guide the reader before giving evidence.',['IELTS']],
      ['advanced','TOEFL integrated writing requires the writer to…',['connect reading and listening information','write only personal opinions','memorise a fixed essay'],'connect reading and listening information','The task assesses accurate synthesis of two sources.','Compare what the lecture says about the reading.',['TOEFL']]
    ],
    cantonese: [
      ['preschool','“你好”的粤拼是？',['nei5 hou2','ni3 hao3','lei5 hou6'],'nei5 hou2','“你”读 nei5，“好”读 hou2。','注意粤拼声调数字。',['粤拼']],
      ['primary','“多谢”通常用于什么情境？',['感谢别人送礼或帮助','向别人道歉','询问时间'],'感谢别人送礼或帮助','“多谢”是常见感谢表达。','想一想什么时候会说谢谢。',['会话']],
      ['primary','“一啲”最接近普通话的？',['一些','一个','一起'],'一些','“啲”常表示一些、某些。','结合数量语境。',['词汇']],
      ['junior','粤语句末“喇”常表示？',['情况变化或提醒','否定所有内容','过去完成'],'情况变化或提醒','“喇”常提示状态变化或催促。','听语气和上下文。',['语气词']],
      ['senior','正式演讲中更适合使用哪一种表达？',['结构清楚、语气得体','大量网络缩写','不断重复语气词'],'结构清楚、语气得体','正式表达需要匹配场合与受众。','先判断语域。',['表达']],
      ['advanced','粤语入声韵尾主要包括？',['-p、-t、-k','-m、-n、-ng','-a、-o、-e'],'-p、-t、-k','入声以塞音韵尾收尾，音节短促。','留意收音位置。',['音系']]
    ],
    japanese: [
      ['preschool','平假名「あ」读作？',['a','i','u'],'a','“あ”是日语五十音的第一个假名。','从あ行开始回忆。',['五十音']],
      ['primary','“わたし___学生です。”应填？',['は','を','で'],'は','主题助词“は”标记句子的主题。','这里在介绍“我”。',['助词']],
      ['primary','“ねこ”的意思是？',['猫','狗','鸟'],'猫','“ねこ”表示猫。','联想常见动物词。',['词汇']],
      ['junior','动词“食べる”的て形是？',['食べて','食べた','食べない'],'食べて','一段动词去掉“る”加“て”。','先判断动词类别。',['动词变化']],
      ['senior','“にもかかわらず”表示？',['尽管……却……','因为……所以……','如果……就……'],'尽管……却……','该表达用于转折，让步关系。','观察前后是否形成反差。',['N2语法']],
      ['advanced','日语学术摘要应优先做到？',['客观概括核心信息','大量使用口语缩略','加入无关感想'],'客观概括核心信息','摘要需要准确、简洁、结构清楚。','只保留研究目的、方法、结果和结论。',['学术日语']]
    ],
    korean: [
      ['preschool','韩文字母“ㅏ”的读音接近？',['a','o','u'],'a','“ㅏ”是基本元音 a。','观察竖线右侧的短横。',['韩文']],
      ['primary','“저___학생이에요.”应填？',['는','를','에'],'는','主题助词“는”用于元音结尾名词“저”。','先判断词尾。',['助词']],
      ['primary','“사과”表示？',['苹果','学校','朋友'],'苹果','“사과”常用义为苹果。','结合生活词汇。',['词汇']],
      ['junior','“먹다”的过去式是？',['먹었어요','먹어요','먹을 거예요'],'먹었어요','过去时常使用 -았/었어요。','看词干元音。',['时态']],
      ['senior','“-다고 하다”主要用于？',['间接引语','比较大小','表示地点'],'间接引语','用于转述陈述内容。','想一想“他说……”如何表达。',['高级语法']],
      ['advanced','TOPIK写作中图表题首先应？',['概括总体趋势','逐字抄写题目','只写个人感受'],'概括总体趋势','先概括，再选择关键数据比较。','从最高、最低和变化方向入手。',['TOPIK']]
    ],
    science: [
      ['preschool','下面哪一种是有生命的？',['小树','石头','玻璃杯'],'小树','生物能生长、需要营养并对环境作出反应。','想一想它会不会长大。',['生命']],
      ['primary','控制实验中，只改变一个条件的目的是？',['判断该条件的影响','让实验更复杂','得到更多颜色'],'判断该条件的影响','控制变量有助于建立因果关系。','其他条件要保持相同。',['实验']],
      ['primary','水从液态变成气态称为？',['蒸发','凝固','融化'],'蒸发','液态水获得能量后可变成水蒸气。','观察晾衣服。',['物质']],
      ['junior','实验数据中重复测量的主要作用是？',['降低偶然误差','改变实验结论','增加变量'],'降低偶然误差','多次测量取平均可提高可靠性。','思考一次测量是否稳定。',['科学方法']],
      ['senior','评价科学结论时最关键的是？',['证据是否充分且可重复','文字是否华丽','作者是否知名'],'证据是否充分且可重复','科学结论依赖可检验、可重复的证据。','关注方法和数据。',['论证']],
      ['advanced','研究设计中“对照组”的作用是？',['提供比较基准','保证结果一定正确','增加样本偏差'],'提供比较基准','对照组帮助判断处理因素是否产生影响。','如果没有处理，会发生什么？',['研究方法']]
    ],
    biology: [
      ['primary','绿色植物制造有机物主要依靠？',['光合作用','蒸腾作用','呼吸作用'],'光合作用','叶绿体利用光能把二氧化碳和水转化为有机物。','需要光和叶绿体。',['植物']],
      ['junior','细胞的遗传信息主要储存在？',['DNA','水','无机盐'],'DNA','DNA携带遗传信息，并通过复制和表达发挥作用。','想一想染色体的主要成分。',['细胞']],
      ['junior','食物链“草→兔→鹰”中，兔属于？',['初级消费者','生产者','分解者'],'初级消费者','兔直接取食生产者草。','看它吃什么。',['生态']],
      ['senior','有氧呼吸产生ATP的主要场所是？',['线粒体','核糖体','高尔基体'],'线粒体','真核细胞有氧呼吸的主要阶段在线粒体完成。','它常被称为细胞的动力工厂。',['代谢']],
      ['senior','孟德尔分离定律发生的细胞学基础是？',['等位基因随同源染色体分离','DNA不复制','蛋白质完全消失'],'等位基因随同源染色体分离','减数分裂时同源染色体分离，使等位基因进入不同配子。','联系减数第一次分裂。',['遗传']],
      ['advanced','评价基因编辑应用时必须同时考虑？',['效果、安全与伦理','只考虑速度','只考虑价格'],'效果、安全与伦理','生命技术决策需要综合科学证据和伦理影响。','不只看技术能不能做。',['生物技术']]
    ],
    history: [
      ['preschool','“昨天—今天—明天”表示的是？',['时间顺序','空间方向','颜色变化'],'时间顺序','历史学习首先需要建立先后顺序。','哪一个先发生？',['时间']],
      ['primary','造纸术、印刷术、指南针、火药通常合称？',['中国古代四大发明','文艺复兴成果','工业革命机器'],'中国古代四大发明','这些发明对文化传播、航海和社会发展产生重要影响。','回忆古代科技。',['中国史']],
      ['junior','工业革命首先大规模发生在？',['英国','古埃及','巴西'],'英国','18世纪后期英国率先发生工业革命。','想一想蒸汽机和工厂制度。',['世界史']],
      ['junior','历史材料题中判断史料价值首先要考虑？',['来源、目的和时代背景','字数多少','纸张颜色'],'来源、目的和时代背景','史料的形成情境会影响其信息和局限。','谁在何时为何写下它？',['史料']],
      ['senior','“历史解释”与“历史事实”的区别在于？',['解释包含对事实的分析和观点','解释不需要证据','事实可以随意改变'],'解释包含对事实的分析和观点','历史解释必须基于事实和证据，但会体现研究视角。','区分发生了什么与如何理解。',['史学']],
      ['advanced','进行历史研究时，较可靠的做法是？',['交叉验证多种史料','只使用单一回忆录','忽略相反证据'],'交叉验证多种史料','不同史料相互印证能减少片面性。','寻找独立来源。',['研究']]
    ],
    geography: [
      ['preschool','地图上通常用什么表示方向？',['方向标或指北针','温度计','尺子颜色'],'方向标或指北针','地图方向常用指北针或经纬线判断。','找一找“N”。',['地图']],
      ['primary','一天中气温通常最高的时间接近？',['午后','日出前','午夜'],'午后','地面吸收太阳辐射后继续升温，最高温常滞后于正午。','热量积累需要时间。',['天气']],
      ['junior','经度主要用于确定？',['东西位置','海拔高度','降水多少'],'东西位置','经度表示相对本初子午线的东西位置。','纬度确定南北。',['经纬网']],
      ['junior','人口大量流入城市可能直接带来？',['住房和交通压力增大','海拔升高','地球自转变慢'],'住房和交通压力增大','快速城市化会增加公共服务和基础设施压力。','从城市承载力思考。',['城市']],
      ['senior','影响工业区位的因素通常不包括？',['地球自转速度','原料与市场','交通与劳动力'],'地球自转速度','工业区位主要受原料、市场、交通、能源、政策等影响。','判断是否直接影响生产成本。',['区位']],
      ['advanced','GIS最适合用于？',['叠加分析空间数据','只播放音乐','替代所有实地调查'],'叠加分析空间数据','GIS可管理、分析和可视化具有位置属性的数据。','关键词是空间。',['GIS']]
    ],
    finance: [
      ['preschool','“需要”和“想要”中，哪一个更应优先？',['基本需要','临时想要','跟风购买'],'基本需要','预算有限时，应先满足基本需要。','先问：没有它会怎样？',['消费']],
      ['primary','每周零花钱50元，计划储蓄20元，最多可支出？',['30元','50元','70元'],'30元','可支出金额=收入−储蓄=50−20=30元。','先把储蓄留出来。',['预算']],
      ['junior','分散投资的主要目的是什么？',['降低单一资产风险','保证绝对盈利','让交易次数更多'],'降低单一资产风险','不同资产表现不完全一致，分散可降低集中风险。','不要把鸡蛋放在一个篮子里。',['投资']],
      ['senior','通货膨胀持续时，同样金额货币的购买力通常？',['下降','上升','不变'],'下降','物价总体上涨会使相同货币能购买的商品减少。','比较今天与未来的价格。',['经济']],
      ['advanced','企业盈亏平衡点指？',['总收入等于总成本','收入为零','固定成本为零'],'总收入等于总成本','盈亏平衡时利润为0。','利润=收入−成本。',['创业']]
    ],
    critical: [
      ['preschool','红、蓝、红、蓝，下一种颜色是？',['红','绿','黄'],'红','序列按红蓝交替。','寻找重复模式。',['规律']],
      ['primary','“所有鸟都会飞，所以企鹅会飞”错在哪里？',['忽略了例外','计算错误','没有使用标点'],'忽略了例外','一般规律可能存在例外，企鹅不会飞。','找反例。',['逻辑']],
      ['junior','一条信息只有截图、没有来源，最合理的做法是？',['查找原始来源并交叉验证','立即转发','只看标题'],'查找原始来源并交叉验证','可靠判断需要来源、证据和多方核验。','先问信息从哪里来。',['媒介素养']],
      ['senior','“使用该方法后成绩提高，因此方法一定有效”可能忽略？',['其他变量和样本偏差','标点符号','字体大小'],'其他变量和样本偏差','相关不等于因果，需要控制其他因素。','还有什么可能同时变化？',['因果']],
      ['advanced','贝叶斯更新的核心是？',['根据新证据调整概率判断','永远坚持最初判断','只看单次结果'],'根据新证据调整概率判断','新证据会改变我们对假设可信度的估计。','先验遇到新证据。',['决策']]
    ]
  };

  function math(stage,difficulty) {
    if (stage==='preschool') {
      const a=int(2,10), b=int(1,a);
      return choice('math',stage,`${a} − ${b} = ?`,[String(a-b),String(a-b+1),String(Math.max(0,a-b-1))],String(a-b),`${a}减去${b}等于${a-b}。`,'可以用画点或倒着数。',['减法']);
    }
    if (stage==='primary') {
      const type=pick(['mix','fraction','area']);
      if (type==='mix') {
        const a=int(3,12),b=int(2,9),c=int(1,15),ans=a*b+c;
        return input('math',stage,`${a} × ${b} + ${c} = ?`,ans,`先算乘法：${a}×${b}=${a*b}，再加${c}，答案是${ans}。`,'先乘除，后加减。',['混合运算']);
      }
      if (type==='fraction') {
        const n=int(2,8),d=int(n+1,12);
        return choice('math',stage,`分数 ${n}/${d} 中，分母是？`,[String(d),String(n),String(n+d)],String(d),'分母写在分数线下方，表示平均分成的份数。','看分数线下面的数。',['分数']);
      }
      const l=int(3,12),w=int(2,10),ans=l*w;
      return input('math',stage,`长方形长${l}厘米，宽${w}厘米，面积是多少平方厘米？`,ans,`长方形面积=长×宽=${l}×${w}=${ans}。`,'使用面积公式。',['几何']);
    }
    if (stage==='junior') {
      const type=pick(['equation','function','geometry']);
      if (type==='equation') {
        const x=int(1,12),a=int(2,7),b=int(1,15),rhs=a*x+b;
        return input('math',stage,`解方程：${a}x + ${b} = ${rhs}`,x,`移项得${a}x=${rhs-b}，两边除以${a}，x=${x}。`,'先把常数项移到右边。',['方程']);
      }
      if (type==='function') {
        const k=int(2,6),b=int(-5,5),x=int(1,6),ans=k*x+b;
        return input('math',stage,`已知 y=${k}x${b>=0?'+':''}${b}，当x=${x}时，y=?`,ans,`代入x=${x}：y=${k}×${x}${b>=0?'+':''}${b}=${ans}。`,'把x的值代入解析式。',['函数']);
      }
      const a=int(3,9),b=int(4,12),c2=a*a+b*b,c=Math.sqrt(c2);
      if (Number.isInteger(c)) return input('math',stage,`直角三角形两直角边为${a}和${b}，斜边长为？`,c,`勾股定理：c²=${a}²+${b}²=${c2}，所以c=${c}。`,'使用a²+b²=c²。',['勾股定理']);
      return choice('math',stage,'相似三角形对应边的关系是？',['成比例','相等且平行','乘积为1'],'成比例','相似三角形对应角相等、对应边成比例。','回忆相似的定义。',['相似']);
    }
    if (stage==='senior') {
      const type=pick(['quadratic','sequence','probability']);
      if (type==='quadratic') {
        const r1=int(1,7),r2=int(1,7),sum=r1+r2,prod=r1*r2;
        return input('math',stage,`方程 x² − ${sum}x + ${prod}=0 的较小根是？`,Math.min(r1,r2),`因式分解为(x−${r1})(x−${r2})=0，两根为${r1}和${r2}。`,'寻找和为系数、积为常数的两个数。',['二次方程']);
      }
      if (type==='sequence') {
        const a1=int(1,8),d=int(2,6),n=int(5,12),ans=a1+(n-1)*d;
        return input('math',stage,`等差数列首项${a1}，公差${d}，第${n}项是？`,ans,`aₙ=a₁+(n−1)d=${a1}+${n-1}×${d}=${ans}。`,'使用等差数列通项公式。',['数列']);
      }
      const red=int(2,8),blue=int(2,8),total=red+blue;
      return input('math',stage,`袋中有${red}个红球和${blue}个蓝球，随机取1个，取到红球的概率用最简分数表示。`,`${red}/${total}`,`有利结果${red}种，总结果${total}种，概率=${red}/${total}，再按需约分。`,'概率=有利结果数÷总结果数。',['概率']);
    }
    const n=int(5,20),r=int(2,Math.min(5,n-1));
    const comb=(n,r)=>{let v=1;for(let i=1;i<=r;i++)v=v*(n-r+i)/i;return Math.round(v)};
    const ans=comb(n,r);
    return input('math',stage,`从${n}名学生中选${r}名组成小组，共有多少种选法？`,ans,`这是组合数 C(${n},${r})=${ans}。`,'顺序不重要，使用组合。',['组合']);
  }

  function physics(stage) {
    if (stage==='preschool'||stage==='primary') {
      const force=int(2,10),mass=int(1,5),acc=force/mass;
      if (Number.isInteger(acc)) return input('physics',stage,`质量${mass}千克的物体受到${force}牛合力，加速度是多少米/秒²？`,acc,`根据F=ma，a=F/m=${force}/${mass}=${acc}。`,'合力除以质量。',['力']);
      return choice('physics',stage,'让玩具车更快前进，通常可以？',['增大向前的推力','增加反向摩擦','停止施力'],'增大向前的推力','在其他条件相同时，更大的向前合力会产生更大的加速度。','想一想力怎样改变运动。',['运动']);
    }
    const type=pick(['speed','ohm','power']);
    if (type==='speed') {
      const t=int(2,10),v=int(3,15),d=t*v;
      return input('physics',stage,`物体以${v}米/秒匀速运动${t}秒，路程是多少米？`,d,`s=vt=${v}×${t}=${d}米。`,'速度乘时间。',['运动学']);
    }
    if (type==='ohm') {
      const r=int(2,12),i=int(1,6),u=r*i;
      return input('physics',stage,`电阻${r}Ω中电流为${i}A，两端电压是多少V？`,u,`欧姆定律U=IR=${i}×${r}=${u}V。`,'使用U=IR。',['电学']);
    }
    const u=int(2,12),i=int(1,6),p=u*i;
    return input('physics',stage,`用电器电压${u}V，电流${i}A，功率是多少W？`,p,`P=UI=${u}×${i}=${p}W。`,'电功率等于电压乘电流。',['功率']);
  }

  function chemistry(stage) {
    const symbol = pick([['氧','O'],['氢','H'],['钠','Na'],['铁','Fe'],['铜','Cu'],['氯','Cl']]);
    if (stage==='preschool'||stage==='primary') return choice('chemistry',stage,'食盐溶于水后，食盐“消失”了吗？',['没有，形成了溶液','完全变成空气','变成了光'],'没有，形成了溶液','食盐微粒均匀分散在水中，仍然存在。','水蒸发后还能看到食盐。',['溶解']);
    if (Math.random()<0.5) return choice('chemistry',stage,`元素“${symbol[0]}”的化学符号是？`,[symbol[1],symbol[1].toLowerCase(),symbol[0]],symbol[1],`“${symbol[0]}”的规范元素符号是${symbol[1]}。`,'注意大小写。',['元素']);
    const h=int(1,13);
    return choice('chemistry',stage,`pH=${h}的溶液通常呈？`,h<7?['酸性','碱性','中性']:h>7?['碱性','酸性','中性']:['中性','酸性','碱性'],h<7?'酸性':h>7?'碱性':'中性',`pH小于7呈酸性，等于7中性，大于7碱性。`,'把数值与7比较。',['酸碱']);
  }

  function computing(stage) {
    if (stage==='preschool') return choice('computing',stage,'机器人指令“前进、前进、右转”体现了？',['顺序执行','随机执行','同时执行'],'顺序执行','程序按既定顺序执行指令。','从第一步开始依次看。',['算法']);
    if (stage==='primary') return choice('computing',stage,'程序需要重复执行10次相同动作，最适合使用？',['循环','删除','关机'],'循环','循环结构可以减少重复代码。','寻找“重复”。',['编程']);
    const type=pick(['binary','logic','complexity']);
    if (type==='binary') {
      const n=int(2,31);
      return input('computing',stage,`十进制数${n}转换为二进制是？`,n.toString(2),`${n}的二进制表示为${n.toString(2)}。`,'反复除以2取余，或拆成2的幂。',['二进制']);
    }
    if (type==='logic') return choice('computing',stage,'条件“A且B”为真，需要？',['A和B都为真','只要A为真','A和B都为假'],'A和B都为真','逻辑与AND要求两个条件同时成立。','“且”表示同时。',['逻辑']);
    return choice('computing',stage,'在有序数组中查找元素，通常更高效的是？',['二分查找','从头随机猜','每次删除全部数据'],'二分查找','二分查找每次排除一半范围，时间复杂度为O(log n)。','利用“有序”条件。',['算法']);
  }

  const generators = {math,physics,chemistry,computing};

  function staticQuestion(subject,stage) {
    const pool=(banks[subject]||[]).filter(item=>item[0]===stage || (stage==='advanced'&&item[0]==='senior'));
    const source=pick(pool.length?pool:(banks[subject]||[]));
    if (!source) return choice(subject,stage,'请选择正确答案。',['A','B','C'],'A','答案是A。','排除错误选项。',[]);
    return choice(subject,stage,source[1],source[2],source[3],source[4],source[5],source[6]);
  }

  function generateOne(subject,stage,difficulty,system) {
    const q = generators[subject] ? generators[subject](stage,difficulty) : staticQuestion(subject,stage);
    q.difficulty=difficulty;
    q.system=system;
    return q;
  }

  function generate(config={}) {
    const subject=config.subject||'math';
    const stage=stages.includes(config.stage)?config.stage:'primary';
    const difficulty=Math.max(1,Math.min(5,Number(config.difficulty)||2));
    const count=Math.max(1,Math.min(50,Number(config.count)||10));
    const system=config.system||'integrated';
    const result=[];
    for (let i=0;i<count;i+=1) result.push(generateOne(subject,stage,difficulty,system));
    return result;
  }

  return {generate,generateOne,stages};
})();
