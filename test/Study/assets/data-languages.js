window.STUDY_DATA = window.STUDY_DATA || {};
Object.assign(window.STUDY_DATA, {
  english: {
    name: '英语', icon: '🔤', color: 'green', intro: '以自然拼读为起点，连接词汇、短句、语法、阅读、写作与综合表达。', extraLink: ['english-exams.html','进入英语考级'],
    stages: {
      preschool: [
        { title: '字母音', lessons: [
          { title: 'A–Z Letter Sounds', type: 'chips', lang: 'en-US', items: [
            ['A a','apple'],['B b','ball'],['C c','cat'],['D d','dog'],['E e','egg'],['F f','fish'],['G g','goat'],['H h','hat'],['I i','ink'],['J j','jam'],['K k','kite'],['L l','lion'],['M m','moon'],['N n','nest'],['O o','orange'],['P p','pig'],['Q q','queen'],['R r','rabbit'],['S s','sun'],['T t','tiger'],['U u','umbrella'],['V v','van'],['W w','water'],['X x','box'],['Y y','yellow'],['Z z','zebra']
          ]},
          { title: '首音辨认', type: 'quiz', questions: [
            { q: 'Which word starts with /b/? 哪个单词以/b/开头？', answer: 'ball', options: ['ball','cat','fish'], explain: 'ball starts with the letter B.' },
            { q: 'Which word starts with /m/?', answer: 'moon', options: ['sun','moon','dog'], explain: 'moon starts with M.' },
            { q: 'Which word starts with /s/?', answer: 'sun', options: ['sun','pig','hat'], explain: 'sun starts with S.' }
          ]}
        ]},
        { title: 'CVC自然拼读', lessons: [
          { title: 'Short a · 短元音a', type: 'phonics', groups: [
            { sound: '-at', words: ['cat','bat','hat','mat','rat'] },
            { sound: '-an', words: ['can','fan','man','pan','van'] },
            { sound: '-ap', words: ['cap','map','nap','tap'] }
          ]},
          { title: 'Short e / i / o / u', type: 'phonics', groups: [
            { sound: '-en', words: ['hen','pen','ten'] },
            { sound: '-ig', words: ['big','dig','pig'] },
            { sound: '-op', words: ['hop','mop','top'] },
            { sound: '-ug', words: ['bug','hug','mug'] }
          ]},
          { title: 'Blend the word · 拼读单词', type: 'quiz', questions: [
            { q: 'c + a + t = ?', answer: 'cat', options: ['cat','cut','cot'], explain: '/k/ /æ/ /t/ blends into cat.' },
            { q: 'p + i + g = ?', answer: 'pig', options: ['peg','pig','pug'], explain: '/p/ /ɪ/ /g/ blends into pig.' },
            { q: 's + u + n = ?', answer: 'sun', options: ['sin','sun','son'], explain: '/s/ /ʌ/ /n/ blends into sun.' }
          ]}
        ]},
        { title: '高频词与短句', lessons: [
          { title: 'Sight Words · 高频词', type: 'chips', lang: 'en-US', items: [
            ['I','I'],['you','you'],['he','he'],['she','she'],['we','we'],['the','the'],['a','a'],['is','is'],['are','are'],['can','can'],['see','see'],['like','like'],['my','my'],['this','this'],['that','that']
          ]},
          { title: 'Everyday Sentences · 日常短句', type: 'sentences', lang: 'en-US', items: [
            ['Hello!','你好！'],['My name is Amy.','我叫艾米。'],['This is my book.','这是我的书。'],['I can see a cat.','我能看见一只猫。'],['I like red apples.','我喜欢红苹果。'],['Can I have some water?','我可以喝点水吗？'],['Thank you.','谢谢。'],['See you tomorrow.','明天见。']
          ]}
        ]}
      ],
      primary: [
        { title: '自然拼读进阶', lessons: [
          { title: '辅音组合', type: 'phonics', groups: [
            { sound: 'sh', words: ['ship','shop','fish','brush'] },
            { sound: 'ch', words: ['chair','chicken','lunch','peach'] },
            { sound: 'th', words: ['thin','three','this','mother'] },
            { sound: 'wh', words: ['what','when','white','wheel'] },
            { sound: 'ph', words: ['phone','photo','dolphin'] }
          ]},
          { title: 'Magic e · 长元音', type: 'table', rows: [
            ['短元音','加e后','例词'],['cap','cape','a-e /eɪ/'],['pet','Pete','e-e /iː/'],['kit','kite','i-e /aɪ/'],['hop','hope','o-e /oʊ/'],['cub','cube','u-e /juː/']
          ]},
          { title: '元音组合', type: 'phonics', groups: [
            { sound: 'ai / ay', words: ['rain','train','day','play'] },
            { sound: 'ee / ea', words: ['see','green','sea','read'] },
            { sound: 'oa / ow', words: ['boat','coat','snow','window'] },
            { sound: 'oo', words: ['moon','food','book','good'] },
            { sound: 'ar / or', words: ['car','star','fork','horse'] }
          ]}
        ]},
        { title: '核心语法', lessons: [
          { title: '一般现在时', type: 'cards', items: [
            { term: 'I/You/We/They play.', body: '主语不是第三人称单数，动词用原形。' },
            { term: 'He/She plays.', body: '第三人称单数，动词通常加-s或-es。' },
            { term: 'Do you like milk?', body: '一般疑问句使用do/does。' },
            { term: 'She does not swim.', body: '否定句使用do not或does not。' }
          ]},
          { title: '时态选择', type: 'quiz', questions: [
            { q: 'Tom ___ to school every day.', answer: 'goes', options: ['go','goes','going'], explain: 'Tom是第三人称单数，every day表示一般现在时。' },
            { q: 'Look! The children ___ football.', answer: 'are playing', options: ['play','played','are playing'], explain: 'Look提示现在进行时。' },
            { q: 'We ___ the museum yesterday.', answer: 'visited', options: ['visit','visited','will visit'], explain: 'yesterday提示一般过去时。' }
          ]}
        ]},
        { title: '阅读', lessons: [
          { title: 'A Busy Saturday', type: 'reading', passage: 'On Saturday morning, Lucy helps her mother clean the kitchen. After lunch, she rides her bike to the library and borrows two science books. In the evening, her family cooks dinner together. Lucy is tired, but she feels happy because everyone has helped.', questions: [
            ['What does Lucy do in the morning?','She helps her mother clean the kitchen.'],
            ['Where does she go after lunch?','She goes to the library.'],
            ['Why does she feel happy?','Because everyone has helped and the family spends time together.']
          ]},
          { title: '阅读技巧', type: 'steps', items: ['先读题目，圈出人名、时间和地点','快速阅读寻找关键词','遇到生词先根据上下文猜测','回答时使用完整句子并检查时态'] }
        ]},
        { title: '写作', lessons: [
          { title: 'My Day 写作框架', type: 'steps', items: ['开头说明日期或总体感受','按morning、afternoon、evening排序','每段写活动和感受','结尾总结最喜欢的部分'] },
          { title: '连接词', type: 'table', rows: [
            ['功能','连接词'],['顺序','first, next, then, finally'],['并列','and, also, besides'],['转折','but, however'],['原因结果','because, so'],['举例','for example']
          ]}
        ]}
      ],
      junior: [
        { title: '词汇构词', lessons: [
          { title: '常见前缀', type: 'table', rows: [
            ['前缀','含义','例词'],['un-','不','unhappy, unfair'],['re-','再次','rewrite, rebuild'],['dis-','否定/相反','disagree, disappear'],['im-/in-','不','impossible, incorrect'],['pre-','在……之前','preview, preheat']
          ]},
          { title: '常见后缀', type: 'table', rows: [
            ['后缀','词性/含义','例词'],['-er/-or','人','teacher, actor'],['-ful','充满','helpful, useful'],['-less','没有','careless, hopeless'],['-tion','名词','education, action'],['-ly','副词','quickly, carefully']
          ]}
        ]},
        { title: '语法体系', lessons: [
          { title: '宾语从句', type: 'examples', items: [
            { q: 'I know. He is honest.', a: 'I know that he is honest.' },
            { q: 'Where does she live? Do you know?', a: 'Do you know where she lives?' },
            { q: 'Will it rain? I am not sure.', a: 'I am not sure whether it will rain.' }
          ]},
          { title: '被动语态', type: 'table', rows: [
            ['时态','结构','例句'],['一般现在时','am/is/are＋done','English is spoken here.'],['一般过去时','was/were＋done','The bridge was built in 2010.'],['一般将来时','will be＋done','The work will be finished tomorrow.'],['现在完成时','has/have been＋done','The room has been cleaned.']
          ]}
        ]},
        { title: '阅读与完形', lessons: [
          { title: '主旨题', type: 'cards', items: [
            { term: '看首尾段', body: '议论文和说明文的中心常出现在首段或尾段。' },
            { term: '找重复词', body: '反复出现的名词和观点通常指向主题。' },
            { term: '概括而非照抄', body: '正确选项应覆盖全文，不能只对应一个细节。' }
          ]},
          { title: '上下文猜词', type: 'quiz', questions: [
            { q: 'The desert is arid; it receives very little rain. “arid” means ___.', answer: 'dry', options: ['dry','cold','crowded'], explain: '后半句“雨很少”说明arid意为干旱。' },
            { q: 'Mia was reluctant to speak, but finally she raised her hand. “reluctant” means ___.', answer: 'unwilling', options: ['excited','unwilling','unable'], explain: 'but finally说明她起初不愿意。' }
          ]}
        ]},
        { title: '写作与口语', lessons: [
          { title: '观点段落PEEL', type: 'steps', items: ['Point：提出观点','Evidence：给出事实或例子','Explanation：解释例子如何支持观点','Link：回扣主题或过渡到下一段'] },
          { title: '口语表达', type: 'sentences', lang: 'en-US', items: [
            ['In my opinion, school clubs help students develop useful skills.','我认为学校社团能帮助学生发展实用技能。'],['One reason is that students learn to work with others.','一个原因是学生能学会与他人合作。'],['For example, a drama club requires planning and teamwork.','例如，戏剧社需要计划与团队合作。'],['That is why I believe every student should join a club.','这就是我认为每位学生都应参加社团的原因。']
          ]}
        ]}
      ],
      senior: [
        { title: '高级语法', lessons: [
          { title: '非谓语动词', type: 'table', rows: [
            ['形式','常见作用','例句'],['to do','目的、将来、具体一次','To improve, you need practice.'],['doing','主动、进行、一般性','Reading broadens the mind.'],['done','被动、完成','Built in 1890, the house is historic.']
          ]},
          { title: '虚拟语气', type: 'examples', items: [
            { q: 'If I ___ you, I would accept the offer.', a: 'were。与现在事实相反。' },
            { q: 'If she had left earlier, she ___ the train.', a: 'would have caught。与过去事实相反。' },
            { q: 'It is important that every student ___ on time.', a: 'be。建议、要求类从句使用（should）＋动词原形。' }
          ]}
        ]},
        { title: '阅读理解', lessons: [
          { title: '长难句拆分', type: 'steps', items: ['先找主句主语和谓语','圈出连词和关系词','识别从句、非谓语和插入语','把修饰成分逐层放回','结合上下文确定代词指向'] },
          { title: '论证结构', type: 'cards', items: [
            { term: 'Claim', body: '作者提出的核心主张。' },
            { term: 'Evidence', body: '数据、研究、事实或案例。' },
            { term: 'Reasoning', body: '解释证据为什么支持主张。' },
            { term: 'Counterargument', body: '回应可能的反对意见。' }
          ]}
        ]},
        { title: '写作', lessons: [
          { title: '议论文结构', type: 'steps', items: ['Introduction：背景＋明确立场','Body 1：主论点＋证据＋分析','Body 2：另一论点或反方回应','Conclusion：总结但不引入新信息'] },
          { title: '句式升级', type: 'examples', items: [
            { q: 'Technology is useful. It can also be distracting.', a: 'Although technology is useful, it can also become a source of distraction.' },
            { q: 'Students exercise regularly. They are healthier.', a: 'Students who exercise regularly tend to enjoy better physical and mental health.' },
            { q: 'The problem is serious. We must act now.', a: 'Given the seriousness of the problem, immediate action is essential.' }
          ]}
        ]},
        { title: '综合表达', lessons: [
          { title: '演讲开场', type: 'sentences', lang: 'en-US', items: [
            ['Have you ever wondered how a small daily habit can change your future?','你是否想过，一个小小的日常习惯如何改变未来？'],['Today, I would like to share three practical ways to study more effectively.','今天我想分享三种更高效学习的实用方法。'],['By the end of this talk, you will have a simple plan you can use immediately.','演讲结束时，你将得到一个可以立即使用的简单计划。']
          ]}
        ]}
      ]
    }
  },
  'english-exams': {
    name: '英语考级', icon: '🎓', color: 'green', intro: '按考试类型组织真实能力训练：词汇、阅读、听力、写作与口语。', parent: 'english',
    tracks: {
      cet4: { name: '大学英语四级', units: [
        { title: '词汇与选词填空', lessons: [
          { title: '常见学术词', type: 'cards', items: [
            { term: 'significant', body: '重要的；显著的。a significant change' },{ term: 'maintain', body: '维持；坚持。maintain a balance' },{ term: 'available', body: '可获得的。resources are available' },{ term: 'impact', body: '影响。have an impact on' },{ term: 'consume', body: '消耗；消费。consume energy' },{ term: 'indicate', body: '表明。research indicates that' }
          ]},
          { title: '选词填空', type: 'quiz', questions: [
            { q: 'Regular exercise can ___ the risk of heart disease.', answer: 'reduce', options: ['reduce','produce','introduce'], explain: 'reduce the risk表示降低风险。' },
            { q: 'The report ___ that students need more sleep.', answer: 'indicates', options: ['indicates','includes','invites'], explain: '报告“表明”用indicate。' }
          ]}
        ]},
        { title: '阅读与翻译', lessons: [
          { title: '段落匹配方法', type: 'steps', items: ['先读题干并标出独特名词和数字','快速扫读每段首句与转折句','匹配同义改写而非原词重复','同一段可能对应多题'] },
          { title: '汉译英', type: 'examples', items: [
            { q: '越来越多的大学生通过志愿服务了解社会。', a: 'An increasing number of college students learn about society through volunteer work.' },
            { q: '公共交通的发展使城市生活更加便利。', a: 'The development of public transport has made urban life more convenient.' }
          ]}
        ]},
        { title: '写作', lessons: [
          { title: '120–180词短文', type: 'steps', items: ['第一段回应题目并表明立场','第二段给出两点理由或建议','每个理由配一个具体解释','最后一段简洁总结'] },
          { title: '开头句', type: 'sentences', lang: 'en-US', items: [
            ['In recent years, online learning has become part of university life.','近年来，在线学习已成为大学生活的一部分。'],['This change brings both opportunities and challenges.','这一变化既带来机会，也带来挑战。'],['In my view, students should learn to use digital tools wisely.','在我看来，学生应学会明智使用数字工具。']
          ]}
        ]}
      ]},
      cet6: { name: '大学英语六级', units: [
        { title: '高阶词汇', lessons: [
          { title: '学术表达', type: 'cards', items: [
            { term: 'substantial', body: '大量的；实质性的。substantial evidence' },{ term: 'inevitable', body: '不可避免的。an inevitable consequence' },{ term: 'controversial', body: '有争议的。a controversial issue' },{ term: 'deteriorate', body: '恶化。conditions deteriorate' },{ term: 'allocate', body: '分配。allocate resources' },{ term: 'conventional', body: '传统的。conventional wisdom' }
          ]}
        ]},
        { title: '深度阅读', lessons: [
          { title: '推断题', type: 'steps', items: ['区分作者原话与可合理推出的结论','关注语气词：may、likely、arguably','排除绝对化和过度延伸选项','答案必须有文本依据'] },
          { title: '作者态度', type: 'quiz', questions: [
            { q: 'The author calls the policy “well-intentioned but poorly designed.” The attitude is ___.', answer: 'critical', options: ['critical','enthusiastic','indifferent'], explain: '认可意图但批评设计，整体态度偏批判。' }
          ]}
        ]},
        { title: '议论文写作', lessons: [
          { title: '论证升级', type: 'steps', items: ['用定义限定讨论范围','提出可争辩的中心论点','每段说明因果链而非只举例','承认反方合理部分再反驳','结尾提出可行建议'] }
        ]}
      ]},
      tem8: { name: '英语专业八级', units: [
        { title: '语言与文化', lessons: [
          { title: '修辞与语体', type: 'table', rows: [
            ['术语','说明','例子'],['metaphor','隐喻','Time is a thief.'],['irony','反讽','What lovely weather!（暴雨中）'],['euphemism','委婉语','passed away'],['register','语域','formal / neutral / informal'],['collocation','搭配','pose a threat, draw a conclusion']
          ]}
        ]},
        { title: '改错与翻译', lessons: [
          { title: '常见改错点', type: 'cards', items: [
            { term: '一致关系', body: '主谓一致、代词指代、时态一致。' },{ term: '搭配', body: '介词、动词、形容词固定搭配。' },{ term: '逻辑连接', body: '转折、因果、递进是否合理。' },{ term: '冗余', body: '避免重复表达同一意义。' }
          ]},
          { title: '翻译练习', type: 'examples', items: [
            { q: '真正的文化交流不是简单复制，而是在理解差异的基础上建立新的联系。', a: 'Genuine cultural exchange is not simple imitation; it creates new connections through an understanding of differences.' }
          ]}
        ]},
        { title: '学术写作', lessons: [
          { title: '摘要写作', type: 'steps', items: ['确定原文中心问题','保留主要论点和关键证据','删除例子、修辞和重复内容','使用自己的语言改写','保持客观，不加入个人评价'] }
        ]}
      ]},
      toefl: { name: '托福', units: [
        { title: 'Reading', lessons: [
          { title: '学术阅读题型', type: 'cards', items: [
            { term: 'Factual Information', body: '定位文中明确陈述的信息。' },{ term: 'Inference', body: '从证据推出未直接表达的结论。' },{ term: 'Vocabulary', body: '结合上下文判断词义。' },{ term: 'Organization', body: '分析段落功能和文章结构。' }
          ]}
        ]},
        { title: 'Listening & Speaking', lessons: [
          { title: '听力笔记', type: 'steps', items: ['记录主题和教授态度','用箭头标因果和对比','只记关键词，不写完整句','关注例子为何被提到'] },
          { title: '口语模板', type: 'sentences', lang: 'en-US', items: [
            ['The reading proposes that the university should extend library hours.','阅读材料提出大学应延长图书馆开放时间。'],['The speaker disagrees for two reasons.','说话者基于两个原因反对。'],['First, most students already use online resources at night.','首先，大多数学生晚上已经使用在线资源。'],['Second, hiring additional staff would be expensive.','其次，增加工作人员成本很高。']
          ]}
        ]},
        { title: 'Writing', lessons: [
          { title: '综合写作', type: 'steps', items: ['概括阅读材料的三个观点','逐点写听力如何反驳或补充','不加入个人意见','准确呈现双方关系'] }
        ]}
      ]},
      ielts: { name: '雅思', units: [
        { title: 'Reading', lessons: [
          { title: '判断题', type: 'cards', items: [
            { term: 'TRUE', body: '题干与原文意思一致。' },{ term: 'FALSE', body: '题干与原文明确矛盾。' },{ term: 'NOT GIVEN', body: '原文没有足够信息判断。' }
          ]},
          { title: '段落标题', type: 'steps', items: ['先概括每段中心而非细节','关注首尾句和转折句','比较标题范围是否过大或过小','同义替换比原词重复更常见'] }
        ]},
        { title: 'Writing', lessons: [
          { title: 'Task 1 图表', type: 'steps', items: ['改写题目','写总体趋势Overview','分组比较主要数据','不解释原因、不写个人意见'] },
          { title: 'Task 2 议论文', type: 'steps', items: ['明确回应题目中的所有问题','每段一个中心观点','使用具体解释和例子','保持立场一致','结尾总结而不重复全文'] }
        ]},
        { title: 'Speaking', lessons: [
          { title: 'Part 2结构', type: 'steps', items: ['直接点明要描述的人、物或经历','交代时间和背景','讲两个具体细节','说明感受和意义','使用过去、现在和将来时扩展'] },
          { title: '扩展回答', type: 'sentences', lang: 'en-GB', items: [
            ['I first became interested in photography when I was twelve.','我十二岁时第一次对摄影产生兴趣。'],['What I enjoy most is the way a photograph can preserve an ordinary moment.','我最喜欢的是照片能保存普通瞬间。'],['In the future, I hope to learn more about portrait photography.','将来我希望学习更多人像摄影知识。']
          ]}
        ]}
      ]}
    }
  },
  cantonese: {
    name: '粤语', icon: '🗣️', color: 'orange', intro: '从粤拼、声调和生活会话开始，逐步进入听辨、阅读和正式表达。',
    stages: {
      preschool: [
        { title: '粤拼声母', lessons: [
          { title: '常用声母', type: 'chips', lang: 'zh-HK', items: [['b','巴'],['p','怕'],['m','妈'],['f','花'],['d','打'],['t','他'],['n','你'],['l','啦'],['g','家'],['k','卡'],['ng','牙'],['h','虾'],['gw','瓜'],['kw','夸'],['w','蛙'],['z','渣'],['c','叉'],['s','沙'],['j','也']] }
        ]},
        { title: '六个声调', lessons: [
          { title: '声调示例', type: 'table', rows: [['调号','例字','粤拼'],['1','诗','si1'],['2','史','si2'],['3','试','si3'],['4','时','si4'],['5','市','si5'],['6','事','si6']] },
          { title: '听读练习', type: 'sentences', lang: 'zh-HK', items: [['你好。','nei5 hou2'],['早晨。','zou2 san4'],['多谢。','do1 ze6'],['唔该。','m4 goi1'],['再见。','zoi3 gin3']] }
        ]}
      ],
      primary: [
        { title: '生活会话', lessons: [
          { title: '日常短句', type: 'sentences', lang: 'zh-HK', items: [
            ['你叫咩名？','你叫什么名字？ · nei5 giu3 me1 meng2'],['我叫小明。','我叫小明。 · ngo5 giu3 siu2 ming4'],['你食咗饭未？','你吃饭了吗？ · nei5 sik6 zo2 faan6 mei6'],['我想饮水。','我想喝水。 · ngo5 soeng2 jam2 seoi2'],['呢个几多钱？','这个多少钱？ · ni1 go3 gei2 do1 cin2'],['我唔明白。','我不明白。 · ngo5 m4 ming4 baak6']
          ]}
        ]},
        { title: '量词与语气词', lessons: [
          { title: '常用量词', type: 'table', rows: [['普通话','粤语表达'],['一辆车','一架车'],['一件衣服','一件衫'],['一把雨伞','一把遮'],['一间房子','一间屋'],['一只鸡蛋','一只蛋']] },
          { title: '语气词', type: 'cards', items: [
            { term: '啦', body: '表示提醒、催促或语气缓和：行啦。' },{ term: '喇', body: '表示情况已经变化：落雨喇。' },{ term: '啫', body: '表示“只是”：讲笑啫。' },{ term: '咩', body: '表示疑问：真系咩？' }
          ]}
        ]}
      ],
      junior: [
        { title: '听辨与转换', lessons: [
          { title: '常见对应', type: 'table', rows: [['普通话','粤语'],['什么','咩'],['哪里','边度'],['为什么','点解'],['怎么','点样'],['现在','而家'],['昨天','寻日'],['明天','听日'],['非常','好/劲']] },
          { title: '句子转换', type: 'examples', items: [
            { q: '普通话：你为什么不去？', a: '粤语：你点解唔去？ nei5 dim2 gaai2 m4 heoi3' },
            { q: '普通话：我现在很忙。', a: '粤语：我而家好忙。 ngo5 ji4 gaa1 hou2 mong4' },
            { q: '普通话：明天在哪里见面？', a: '粤语：听日喺边度见？ ting1 jat6 hai2 bin1 dou6 gin3' }
          ]}
        ]},
        { title: '阅读', lessons: [
          { title: '短文', type: 'reading', passage: '今日放学之后，我同几个同学去图书馆温书。大家先做数学功课，再一齐练习英文口语。虽然有几道题比较难，但我哋互相讨论，好快就搵到答案。', questions: [
            ['他们放学后去了哪里？','图书馆。'],['他们先做什么？','先做数学功课。'],['为什么很快找到答案？','因为大家互相讨论。']
          ]}
        ]}
      ],
      senior: [
        { title: '正式与口语表达', lessons: [
          { title: '语体转换', type: 'examples', items: [
            { q: '口语：呢件事真系几麻烦。', a: '较正式：这件事情确实相当复杂。' },
            { q: '口语：我哋要快啲谂办法。', a: '较正式：我们需要尽快提出解决方案。' }
          ]},
          { title: '演讲表达', type: 'sentences', lang: 'zh-HK', items: [
            ['各位老师、各位同学，大家好。','正式开场'],['今日我想同大家分享一个同城市生活有关嘅问题。','提出主题'],['首先，我哋要了解问题出现嘅原因。','组织观点'],['最后，我希望大家可以由日常小事开始改变。','总结呼吁']
          ]}
        ]}
      ]
    }
  },
  japanese: {
    name: '日语', icon: '🗾', color: 'red', intro: '从五十音、假名和基础会话开始，逐步进入语法、阅读和JLPT能力。',
    stages: {
      preschool: [
        { title: '五十音', lessons: [
          { title: '清音', type: 'chips', lang: 'ja-JP', items: [
            ['あ a','あ'],['い i','い'],['う u','う'],['え e','え'],['お o','お'],['か ka','か'],['き ki','き'],['く ku','く'],['け ke','け'],['こ ko','こ'],['さ sa','さ'],['し shi','し'],['す su','す'],['せ se','せ'],['そ so','そ'],['た ta','た'],['ち chi','ち'],['つ tsu','つ'],['て te','て'],['と to','と'],['な na','な'],['に ni','に'],['ぬ nu','ぬ'],['ね ne','ね'],['の no','の'],['は ha','は'],['ひ hi','ひ'],['ふ fu','ふ'],['へ he','へ'],['ほ ho','ほ'],['ま ma','ま'],['み mi','み'],['む mu','む'],['め me','め'],['も mo','も'],['や ya','や'],['ゆ yu','ゆ'],['よ yo','よ'],['ら ra','ら'],['り ri','り'],['る ru','る'],['れ re','れ'],['ろ ro','ろ'],['わ wa','わ'],['を o','を'],['ん n','ん']
          ]}
        ]},
        { title: '基础词语', lessons: [
          { title: '看图词汇', type: 'cards', lang: 'ja-JP', items: [
            { term: 'ねこ', sub: 'neko', body: '猫 🐱' },{ term: 'いぬ', sub: 'inu', body: '狗 🐶' },{ term: 'みず', sub: 'mizu', body: '水 💧' },{ term: 'やま', sub: 'yama', body: '山 ⛰️' },{ term: 'そら', sub: 'sora', body: '天空 ☁️' },{ term: 'はな', sub: 'hana', body: '花 🌸' }
          ]}
        ]}
      ],
      primary: [
        { title: '基础会话', lessons: [
          { title: '问候', type: 'sentences', lang: 'ja-JP', items: [
            ['おはようございます。','早上好。'],['こんにちは。','你好。'],['こんばんは。','晚上好。'],['ありがとうございます。','谢谢。'],['すみません。','对不起／劳驾。'],['またあした。','明天见。']
          ]},
          { title: '自我介绍', type: 'sentences', lang: 'ja-JP', items: [
            ['はじめまして。','初次见面。'],['わたしは リンです。','我是林。'],['シンガポールから きました。','我来自新加坡。'],['どうぞ よろしく おねがいします。','请多关照。']
          ]}
        ]},
        { title: '助词入门', lessons: [
          { title: 'は・が・を・に・で', type: 'table', rows: [
            ['助词','作用','例句'],['は','提示主题','わたしは学生です。'],['が','强调主语/新信息','猫がいます。'],['を','动作对象','本を読みます。'],['に','时间/目的地','七時に起きます。'],['で','动作场所/手段','学校で勉強します。']
          ]}
        ]}
      ],
      junior: [
        { title: '动词与形容词', lessons: [
          { title: '动词变化', type: 'table', rows: [
            ['形式','例：食べる','作用'],['ます形','食べます','礼貌叙述'],['て形','食べて','连接、请求、进行'],['ない形','食べない','否定'],['た形','食べた','过去/完成'],['可能形','食べられる','能够']
          ]},
          { title: '形容词', type: 'examples', items: [
            { q: 'この本はおもしろいです。', a: '这本书很有趣。い形容词直接修饰名词。' },
            { q: 'この町は静かです。', a: '这个城市很安静。な形容词句末加です。' },
            { q: '昨日は寒くなかったです。', a: '昨天不冷。い形容词过去否定。' }
          ]}
        ]},
        { title: '阅读', lessons: [
          { title: '短文', type: 'reading', passage: '日曜日に友だちと図書館へ行きました。午前中は日本語の本を読み、午後は一緒に宿題をしました。図書館は静かで、勉強しやすかったです。帰る前に、来週読む本を二冊借りました。', questions: [
            ['日曜日にどこへ行きましたか。','図書館へ行きました。'],['午後は何をしましたか。','友だちと宿題をしました。'],['本を何冊借りましたか。','二冊借りました。']
          ]}
        ]}
      ],
      senior: [
        { title: 'JLPT语法', lessons: [
          { title: 'N3–N2常见句型', type: 'cards', items: [
            { term: '～ようになる', body: '表示能力或习惯发生变化：日本語が話せるようになった。' },{ term: '～ことになっている', body: '表示规则或安排：ここでは靴を脱ぐことになっている。' },{ term: '～わけではない', body: '并非完全如此：嫌いなわけではない。' },{ term: '～に違いない', body: '强烈推测：彼は知っているに違いない。' },{ term: '～にもかかわらず', body: '尽管：雨にもかかわらず試合は行われた。' }
          ]}
        ]},
        { title: '长文阅读', lessons: [
          { title: '阅读步骤', type: 'steps', items: ['先读题目，确认问的是事实、理由还是主张','找しかし、つまり、たとえば等连接词','区分作者观点和他人观点','长句先找谓语，再还原修饰关系'] }
        ]}
      ]
    }
  },
  korean: {
    name: '韩语', icon: 'KR', color: 'violet', intro: '从韩文字母和拼读开始，逐步掌握生活表达、语法、阅读与TOPIK能力。',
    stages: {
      preschool: [
        { title: '韩文字母', lessons: [
          { title: '基本辅音', type: 'chips', lang: 'ko-KR', items: [['ㄱ','가'],['ㄴ','나'],['ㄷ','다'],['ㄹ','라'],['ㅁ','마'],['ㅂ','바'],['ㅅ','사'],['ㅇ','아'],['ㅈ','자'],['ㅊ','차'],['ㅋ','카'],['ㅌ','타'],['ㅍ','파'],['ㅎ','하']] },
          { title: '基本元音', type: 'chips', lang: 'ko-KR', items: [['ㅏ','아'],['ㅑ','야'],['ㅓ','어'],['ㅕ','여'],['ㅗ','오'],['ㅛ','요'],['ㅜ','우'],['ㅠ','유'],['ㅡ','으'],['ㅣ','이']] },
          { title: '拼读', type: 'table', rows: [['组合','读音'],['ㄱ＋ㅏ＝가','ga'],['ㄴ＋ㅏ＝나','na'],['ㅁ＋ㅗ＝모','mo'],['ㅂ＋ㅜ＝부','bu'],['ㅎ＋ㅏ＝하','ha']] }
        ]}
      ],
      primary: [
        { title: '生活会话', lessons: [
          { title: '问候与介绍', type: 'sentences', lang: 'ko-KR', items: [
            ['안녕하세요.','你好。'],['감사합니다.','谢谢。'],['제 이름은 민수예요.','我叫民秀。'],['저는 학생이에요.','我是学生。'],['만나서 반가워요.','很高兴见到你。'],['안녕히 가세요.','请慢走。']
          ]},
          { title: '日常表达', type: 'sentences', lang: 'ko-KR', items: [
            ['이게 뭐예요?','这是什么？'],['얼마예요?','多少钱？'],['물 주세요.','请给我水。'],['화장실이 어디예요?','洗手间在哪里？'],['잘 모르겠어요.','我不太清楚。'],['천천히 말해 주세요.','请说慢一点。']
          ]}
        ]},
        { title: '助词', lessons: [
          { title: '은/는・이/가・을/를', type: 'table', rows: [
            ['助词','作用','例句'],['은/는','主题','저는 학생이에요.'],['이/가','主语','비가 와요.'],['을/를','宾语','책을 읽어요.'],['에','时间/目的地','학교에 가요.'],['에서','动作场所','도서관에서 공부해요.']
          ]}
        ]}
      ],
      junior: [
        { title: '时态与连接', lessons: [
          { title: '时态', type: 'examples', items: [
            { q: '먹어요', a: '吃／正在吃。一般现在时。' },{ q: '먹었어요', a: '吃了。过去时。' },{ q: '먹을 거예요', a: '将要吃。将来时。' },{ q: '먹고 있어요', a: '正在吃。进行时。' }
          ]},
          { title: '连接表达', type: 'cards', items: [
            { term: '-고', body: '并列动作：밥을 먹고 학교에 가요。' },{ term: '-아서/어서', body: '原因或先后：비가 와서 집에 있어요。' },{ term: '-지만', body: '转折：어렵지만 재미있어요。' },{ term: '-으면', body: '条件：시간이 있으면 만나요。' }
          ]}
        ]},
        { title: '阅读', lessons: [
          { title: '短文', type: 'reading', passage: '저는 주말마다 공원에서 운동해요. 아침에는 친구와 같이 달리고, 그 후에 카페에서 아침을 먹어요. 비가 오는 날에는 집에서 영화를 보거나 책을 읽어요. 주말은 바쁘지만 즐거워요.', questions: [
            ['주말마다 어디에서 운동해요?','공원에서 운동해요.'],['비가 오는 날에는 무엇을 해요?','집에서 영화를 보거나 책을 읽어요.'],['주말은 어때요?','바쁘지만 즐거워요.']
          ]}
        ]}
      ],
      senior: [
        { title: 'TOPIK语法', lessons: [
          { title: '中高级表达', type: 'cards', items: [
            { term: '-는 반면에', body: '表示对比：도시는 편리한 반면에 복잡해요。' },{ term: '-기 때문에', body: '表示原因：시간이 없기 때문에 못 갔어요。' },{ term: '-도록', body: '表示目的或程度：잊지 않도록 메모했어요。' },{ term: '-을 뿐만 아니라', body: '不仅……而且……' },{ term: '-는 것으로 나타나다', body: '调查结果显示……，常见于说明文。' }
          ]}
        ]},
        { title: 'TOPIK写作', lessons: [
          { title: '图表题', type: 'steps', items: ['先写调查对象和主题','概括最高、最低和主要变化','用반면에、증가하다、감소하다比较','最后写一项可能原因'] },
          { title: '议论文', type: 'steps', items: ['明确问题和立场','每段一个理由','使用具体例子','用따라서、그러나、또한连接','结尾总结并提出建议'] }
        ]}
      ]
    }
  }
});