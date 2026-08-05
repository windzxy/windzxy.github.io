(() => {
  'use strict';

  const catalog = window.WIND_CATALOG;
  if (!catalog) return;

  const languageSubjects = new Set(['chinese','english','cantonese','japanese','korean']);
  const stageNames = catalog.stages;
  const resourceMap = {
    chinese: [
      ['香港教育局：中国语文课程文件','https://www.edb.gov.hk/sc/curriculum-development/kla/chi-edu/curriculum-documents.html'],
      ['香港教育局：汉字学习资源','https://www.edb.gov.hk/sc/curriculum-development/kla/chi-edu/chi-character-main.html']
    ],
    english: [
      ['香港教育局：英语课程文件','https://www.edb.gov.hk/en/curriculum-development/kla/eng-edu/curriculum-documents.html'],
      ['香港教育局：小学英语学与教资源','https://www.edb.gov.hk/en/curriculum-development/kla/eng-edu/references-resources/resource%20Pri_AaL.html']
    ],
    cantonese: [
      ['香港语言学学会粤拼方案','https://jyutping.org/yue_hans/jyutping/'],
      ['一文掌握粤拼','https://jyutping.org/learn/'],
      ['香港教育局：粤语正音资源','https://sense.edb.gov.hk/en/types-of-special-educational-needs/speech-and-language-impairment/resources/teaching-resources/36.html']
    ],
    japanese: [
      ['国际交流基金：JF日语教育标准','https://www.jfstandard.jpf.go.jp/summaryen/ja/render.do'],
      ['国际交流基金：日语教育资源','https://www.jpf.go.jp/e/urawa/e_rsorcs/e_rsorcs.html']
    ],
    korean: [
      ['韩国国立国语院：学习者资源','https://www.korean.go.kr/front_eng/main.do'],
      ['国际通用韩国语标准课程','https://www.korean.go.kr/front_eng/down/down_02V.do?etc_seq=588&pageIndex=2']
    ],
    general: [
      ['香港教育局：八大学习领域','https://www.edb.gov.hk/en/curriculum-development/curriculum-area/life-wide-learning/know-more/8kla.html']
    ]
  };

  const languageProfiles = {
    chinese: {
      lang: 'zh-CN',
      labels: ['汉字','拼音','词句','阅读','表达'],
      stages: {
        preschool: {
          canDo: '能听辨普通话声母、韵母和四声，认读常用汉字，并用完整句描述日常事物。',
          knowledge: [
            ['音节结构','普通话音节通常由声母、韵母和声调组成。先听清音节，再分辨声调，最后整体拼读。'],
            ['四声辨析','第一声高而平，第二声由中升高，第三声先降后升，第四声快速下降。轻声短而轻。'],
            ['识字方法','先观察整体字形，再拆分笔画和部件，最后把字放进词语与句子中巩固。']
          ],
          examples: [
            ['妈妈','mā ma','母亲','“妈”是第一声，第二个“妈”常读轻声。'],
            ['苹果','píng guǒ','一种水果','“苹”第二声，“果”第三声。'],
            ['小鸟在飞。','xiǎo niǎo zài fēi','完整句','谁＋在哪里／怎样＋做什么。']
          ],
          dialogue: [
            ['老师','你叫什么名字？','nǐ jiào shén me míng zi','询问姓名'],
            ['学生','我叫小雨。','wǒ jiào xiǎo yǔ','介绍自己']
          ],
          practice: [
            ['“马、麻、骂”有什么不同？','声调不同，词义也不同：mǎ、má、mà。'],
            ['描述一幅图片时先说什么？','先说人物或事物，再说位置、动作和特点。']
          ],
          output: '选一个身边物品，说出名称、颜色、数量和用途，组成两句完整的话。'
        },
        primary: {
          canDo: '能准确理解字词句，朗读古诗和短文，概括主要内容，并完成结构清楚的短篇习作。',
          knowledge: [
            ['语境理解','词义要放在上下文中判断。遇到多义词，比较哪一个义项与句子最吻合。'],
            ['阅读结构','先找人物、时间、地点和事件，再用“谁做了什么，结果怎样”概括叙事文本。'],
            ['古诗学习','按节奏朗读，圈出意象，结合题目和关键字理解画面与情感。'],
            ['习作修改','先检查内容是否完整，再检查句子是否通顺，最后补充动作、语言和感受。']
          ],
          examples: [
            ['画蛇添足','huà shé tiān zú','做了多余的事反而不好','成语要结合故事和使用情境掌握。'],
            ['春眠不觉晓，处处闻啼鸟。','chūn mián bù jué xiǎo','《春晓》诗句','“晓”是天亮，“啼鸟”营造春日清晨的声音。'],
            ['小明跑进教室，放下书包，立刻打开课本。','—','动作描写','连续动词让过程更清楚。']
          ],
          dialogue: [
            ['同学甲','这段话主要写了什么？','—','提出阅读问题'],
            ['同学乙','主要写小树在大家照料下长高了。','—','人物／事物＋事件＋结果']
          ],
          practice: [
            ['概括段意时应避免什么？','避免抄下所有细节，也不要遗漏关键人物和主要事件。'],
            ['成语能否只背字面意思？','不能，还要理解典故、感情色彩和适用语境。']
          ],
          output: '用“起因—经过—结果”写一段80至150字的小故事，并至少加入一个动作描写。'
        },
        junior: {
          canDo: '能分析现代文结构与语言，翻译基础文言句子，鉴赏诗词意象，并完成有中心、有证据的作文。',
          knowledge: [
            ['现代文阅读','先判断文体，再梳理线索与段落功能。回答作用题要同时说明内容、结构和表达效果。'],
            ['文言翻译','坚持“字字落实、句式调整”。先译实词和虚词，再处理省略、倒装等句式。'],
            ['诗词鉴赏','从意象、炼字、修辞和结构入手，最后回到作者情感与主题。'],
            ['写作论证','观点必须明确，材料必须与观点直接相关，并说明材料为什么能证明观点。']
          ],
          examples: [
            ['醉翁之意不在酒','—','“意”指情趣','词义需结合“在乎山水之间也”的上下文。'],
            ['“月”在送别诗中常寄托思念。','—','意象作用','不能机械套用，要结合具体诗句判断。'],
            ['论点：阅读能拓宽视野。论据：比较两种文化的阅读经历。','—','观点与证据','论据之后还需要分析其关联。']
          ],
          dialogue: [
            ['学生','为什么这个句子是拟人？','—','提出判断依据'],
            ['老师','因为作者把无生命事物写成会思考、会行动的人。','—','定义＋文本证据']
          ],
          practice: [
            ['文言翻译只写大意可以吗？','不够。关键实词、虚词和特殊句式都要落实。'],
            ['赏析“炼字”要写哪三步？','解释字义，结合句子描写画面，说明表达效果和情感。']
          ],
          output: '选择一段短文，写出中心句、结构层次和两处语言特色，并用原文作证。'
        },
        senior: {
          canDo: '能评价复杂文本的观点与证据，比较古诗文表达，完成任务明确、论证严密的高中写作。',
          knowledge: [
            ['论述文本','区分事实、观点和推断；检查论据的相关性、真实性、代表性与推理链。'],
            ['文学文本','结合叙事视角、象征、细节和语言风格解释主题，避免脱离文本空谈。'],
            ['古诗文综合','整理常见实词、虚词、句式和文化常识，并通过比较阅读形成迁移。'],
            ['任务写作','先圈定对象、情境、目的和限制，再提出中心观点和分层论证。']
          ],
          examples: [
            ['相关性不等于因果性。','—','论证判断','两个现象同时出现，不代表一个必然导致另一个。'],
            ['有限视角能保留悬念，也限制读者获得的信息。','—','叙事视角','分析形式如何影响阅读体验。'],
            ['反方观点应被准确复述后再回应。','—','反驳策略','避免把对方观点弱化成容易攻击的版本。']
          ],
          dialogue: [],
          practice: [
            ['评价一则论据要问什么？','来源是否可靠、样本是否有代表性、是否直接支持论点。'],
            ['材料作文第一步是什么？','识别材料中的核心关系和写作任务，而不是立即堆砌素材。']
          ],
          output: '围绕一个公共议题写出论点、两个分论点、反方观点和回应，每一层都注明证据类型。'
        },
        advanced: {
          canDo: '能进行学术阅读、资料评价和规范写作，形成清晰的问题意识与可检验的论证。',
          knowledge: [
            ['研究问题','问题应具体、可研究、有资料基础，并明确对象、范围和核心概念。'],
            ['资料评价','判断作者、出处、时间、方法、证据和潜在立场，不以搜索排名代替可靠性。'],
            ['引用规范','直接引用、转述和数据都要标明来源；引用不能替代自己的分析。'],
            ['研究写作','摘要说明目的、方法、结果和结论；正文用证据链回答研究问题。']
          ],
          examples: [
            ['“社交媒体是否影响青少年阅读？”范围过大。','—','问题收窄','可限定地区、年龄、平台、时间和阅读指标。'],
            ['同一结论需要比较不同来源。','—','交叉验证','优先使用原始资料和权威统计。']
          ],
          dialogue: [],
          practice: [
            ['文献综述是不是资料摘要的堆积？','不是，应按主题或观点组织，并指出共识、分歧和空白。'],
            ['引用越多越好吗？','不是，关键是与论证相关、来源可靠，并有自己的分析。']
          ],
          output: '确定一个可研究问题，建立五张资料卡，分别记录来源、观点、证据、限制和可用位置。'
        }
      }
    },
    english: {
      lang: 'en-GB',
      labels: ['sound','word','sentence','text','communication'],
      stages: {
        preschool: {
          canDo: '能听辨常见字母音，拼读简单CVC单词，并使用问候、介绍、颜色、数字等生活短句。',
          knowledge: [
            ['Phonemic awareness','先听声音，再看字母。能够把 cat 分成 /k/ /æ/ /t/，也能把三个音合成为一个词。'],
            ['Letter sounds','字母名和字母音不同。A 的字母名是 /eɪ/，在 cat 中的短音接近 /æ/。'],
            ['CVC blending','从左到右连续发音，不在每个音之间停顿：c-a-t → cat。'],
            ['Useful chunks','初学阶段优先记整块表达，如 “My name is …” 和 “I like …”。']
          ],
          examples: [
            ['cat','c-a-t','猫','short a'],
            ['pen','p-e-n','钢笔','short e'],
            ['I am six.','—','我六岁。','I + am + age'],
            ['This is my book.','—','这是我的书。','This is + noun']
          ],
          dialogue: [
            ['A','Hello! What is your name?','—','你好！你叫什么名字？'],
            ['B','My name is Amy.','—','我叫Amy。']
          ],
          practice: [
            ['Which word begins with /b/: ball or cat?','ball'],
            ['Complete: I ___ a student.','am']
          ],
          output: '用英语说出姓名、年龄、喜欢的颜色和一个喜欢的物品。'
        },
        primary: {
          canDo: '能运用自然拼读规律拼读新词，理解常用语法，在短文中获取主旨和细节，并写出连贯段落。',
          knowledge: [
            ['Phonics patterns','学习 magic e、辅音组合、元音组合和 r-controlled vowels，并比较同一词族。'],
            ['High-frequency words','有些常用词不能完全按基础规则拼读，需要在句子中反复识别。'],
            ['Grammar in context','语法服务于表达。先观察例句中的意义，再归纳形式和使用条件。'],
            ['Paragraph structure','一个段落通常包含主题句、支持细节和收束句。']
          ],
          examples: [
            ['kit → kite','short i → long i','小工具包 → 风筝','final e changes the vowel sound'],
            ['rain / train / paint','ai','雨／火车／油漆','vowel team ai'],
            ['Yesterday, she went to school.','—','昨天她上学了。','time word + past tense'],
            ['Tom waters the plant every day. It grows well.','—','主旨：Tom takes care of a plant.','combine repeated ideas']
          ],
          dialogue: [
            ['A','How do you go to school?','—','你怎样上学？'],
            ['B','I usually go by bus, but I walk on Fridays.','—','频率副词和交通方式']
          ],
          practice: [
            ['Why does “bike” have a long i sound?','The final silent e makes i say its name.'],
            ['What should a topic sentence do?','State the main idea of the paragraph.']
          ],
          output: '写一个80词左右的段落介绍日常作息，使用时间连接词和至少两个频率副词。'
        },
        junior: {
          canDo: '能综合运用时态、语态和从句，使用略读与寻读策略，完成对话、陈述和多种实用文体。',
          knowledge: [
            ['Grammar system','把形式、意义和使用情境连起来，例如被动语态强调动作承受者或结果。'],
            ['Reading strategies','先略读掌握主题和结构，再寻读定位人名、数字、原因和例证。'],
            ['Listening notes','只记录关键词、逻辑关系和数字，不试图写下每一个词。'],
            ['Writing for purpose','邮件、报告、故事和议论文的语气、结构与受众不同。']
          ],
          examples: [
            ['English is spoken worldwide.','be + past participle','英语在世界各地被使用。','present passive'],
            ['Although it was raining, we continued.','although + contrast','尽管下雨，我们仍继续。','complex sentence'],
            ['however / therefore / for example','—','转折／结果／举例','cohesive devices']
          ],
          dialogue: [
            ['A','I think school uniforms are useful because…','—','提出观点与理由'],
            ['B','I see your point. However, …','—','礼貌回应并提出不同观点']
          ],
          practice: [
            ['When is passive voice useful?','When the action or result is more important than the doer.'],
            ['What is the difference between skimming and scanning?','Skimming finds the overall idea; scanning locates specific information.']
          ],
          output: '围绕一个校园议题进行两分钟陈述：观点、两个理由、一个例子和结论。'
        },
        senior: {
          canDo: '能理解复杂文本的论证、语气与修辞，写出有中心论点、证据和反驳的英语文章。',
          knowledge: [
            ['Critical reading','区分作者的主张、证据、假设和语气，并判断信息来源与推理质量。'],
            ['Academic grammar','使用名词化、复杂句和衔接手段提升正式度，但避免句子过长和意义模糊。'],
            ['Essay architecture','引言提出 thesis，主体段以 topic sentence 开始，证据后必须解释。'],
            ['Editing','按内容、结构、句法、词汇和拼写五层进行修改。']
          ],
          examples: [
            ['The data suggest that…','—','数据表明……','cautious academic claim'],
            ['Some argue that… However, this view overlooks…','—','引入反方并回应','counterargument'],
            ['A clear thesis is focused and arguable.','—','中心论点要明确且可论证。','not merely a fact']
          ],
          dialogue: [],
          practice: [
            ['What follows evidence in a strong paragraph?','Analysis explaining how the evidence supports the claim.'],
            ['Why use cautious language such as “may”?','To match the strength and limits of the evidence.']
          ],
          output: '写一个四段式议论文提纲：thesis、两个主体段、反方观点与回应、结论。'
        },
        advanced: {
          canDo: '能应对大学英语、雅思、托福和专业英语任务，并进行学术阅读、综合写作和正式口语表达。',
          knowledge: [
            ['Integrated skills','听读材料后要准确综合观点与证据，不能把个人意见混入信息复述任务。'],
            ['Academic vocabulary','优先掌握词族、搭配和语域，而不是孤立背单词。'],
            ['Timed performance','先分析任务和分配时间，再写作或作答；最后保留检查时间。'],
            ['Speaking quality','内容组织、语言准确、流利度、发音可懂度和互动能力共同决定表现。']
          ],
          examples: [
            ['The lecture challenges the reading by…','—','讲座通过……质疑阅读材料。','integrated writing'],
            ['This trend can be attributed to…','—','这一趋势可归因于……','data commentary'],
            ['From my perspective…, primarily because…','—','表达立场与主要理由','structured speaking']
          ],
          dialogue: [],
          practice: [
            ['What should an integrated response prioritise?','Accurate relationships between the sources.'],
            ['How should unfamiliar vocabulary be learned?','Through word families, collocations, context and spaced review.']
          ],
          output: '选择一个考试任务，完成限时练习后按内容、组织、语言和任务完成度四项自评。'
        }
      }
    },
    cantonese: {
      lang: 'zh-HK',
      labels: ['听辨','粤拼','声调','会话','语用'],
      stages: {
        preschool: {
          canDo: '能听辨常见粤语音节和六个声调，使用问候、姓名、数字和家庭等日常表达。',
          knowledge: [
            ['音节结构','粤拼把粤语音节写成声母、韵腹／韵尾和声调数字，例如 hou2。'],
            ['六个声调','初学先稳定辨认1至6调的高低与走向，再练习同一音节的声调对比。'],
            ['听后模仿','先完整听一句，再分短语模仿，最后恢复正常速度；重点保持声调和节奏。'],
            ['口语优先','先掌握能立即使用的整句，再逐步分析词汇和语法。']
          ],
          examples: [
            ['你好','nei5 hou2','你好','日常问候'],
            ['早晨','zou2 san4','早上好','香港常见早晨问候'],
            ['我叫小明','ngo5 giu3 siu2 ming4','我叫小明','介绍姓名'],
            ['多谢','do1 ze6','谢谢','多用于感谢礼物或较具体的帮助']
          ],
          dialogue: [
            ['A','你好，你叫咩名呀？','nei5 hou2, nei5 giu3 me1 meng2 aa3','你好，你叫什么名字？'],
            ['B','我叫阿晴。','ngo5 giu3 aa3 cing4','我叫阿晴。']
          ],
          practice: [
            ['“你好”的粤拼是什么？','nei5 hou2'],
            ['感谢别人递给你一件物品，可以说什么？','唔该；收到礼物或郑重感谢可说多谢。']
          ],
          output: '完成20秒自我介绍：问候、姓名、年龄或身份、喜欢的事物。'
        },
        primary: {
          canDo: '能认读常见粤拼声母、韵母和声调，完成购物、问路、学校和家庭等生活对话。',
          knowledge: [
            ['声母与韵母','先练高频声母，再按韵尾分组学习韵母；把相近音放在最小对立词中比较。'],
            ['塞音韵尾','以 -p、-t、-k 收尾的音节短促，发音结束时不额外加元音。'],
            ['量词','粤语量词使用频繁，例如一个人、一架车、一张纸；选择取决于名词类别。'],
            ['句末语气词','呀、啦、喇、啫等表达态度和互动关系，不能只按字面翻译。']
          ],
          examples: [
            ['唔该，呢个几多钱？','m4 goi1, ni1 go3 gei2 do1 cin2','请问，这个多少钱？','购物'],
            ['我想要两杯水。','ngo5 soeng2 jiu3 loeng5 bui1 seoi2','我想要两杯水。','数量＋量词＋名词'],
            ['洗手间喺边度？','sai2 sau2 gaan1 hai2 bin1 dou6','洗手间在哪里？','问路']
          ],
          dialogue: [
            ['顾客','唔该，呢本书几多钱？','m4 goi1, ni1 bun2 syu1 gei2 do1 cin2','请问，这本书多少钱？'],
            ['店员','五十蚊。','ng5 sap6 man1','五十元。']
          ],
          practice: [
            ['“一___书”应使用哪个量词？','本：jat1 bun2 syu1。'],
            ['-p、-t、-k韵尾的共同特点是什么？','收音短促，不释放额外元音。']
          ],
          output: '设计一段购物对话，包含问价、数量、量词、确认和道谢。'
        },
        junior: {
          canDo: '能理解常见口语语法与语气词，区分粤语口语和书面中文，并完成较长的生活与校园交流。',
          knowledge: [
            ['口语与书面语','“我哋、佢、冇、喺”常见于粤语口语；正式书面中文通常写“我们、他／她、没有、在”。'],
            ['体貌标记','咗表示完成或变化，紧表示进行，过表示经历；需结合语境理解。'],
            ['焦点与语气','句末语气词可以表达确认、提醒、惊讶、催促或缓和语气。'],
            ['听力策略','先抓人物关系、地点、目的和态度，再补充数字与细节。']
          ],
          examples: [
            ['我食咗饭。','ngo5 sik6 zo2 faan6','我吃过饭了／已经吃饭。','完成体'],
            ['佢睇紧书。','keoi5 tai2 gan2 syu1','他／她正在看书。','进行体'],
            ['你去过澳门未？','nei5 heoi3 gwo3 ou3 mun2 mei6','你去过澳门吗？','经历＋疑问']
          ],
          dialogue: [
            ['A','你做完功课未呀？','nei5 zou6 jyun4 gung1 fo3 mei6 aa3','你做完作业了吗？'],
            ['B','做完喇，而家温紧书。','zou6 jyun4 laa3, ji4 gaa1 wan1 gan2 syu1','做完了，现在正在复习。']
          ],
          practice: [
            ['“咗”和“紧”有什么区别？','咗强调完成或变化；紧表示动作正在进行。'],
            ['为什么不能把每个语气词机械翻译成普通话词语？','它们主要表达说话态度、关系和语境功能。']
          ],
          output: '把一段书面中文对话改写成自然粤语口语，并说明三处词汇或语法差异。'
        },
        senior: {
          canDo: '能根据场合调整粤语语体，进行报告、访问和观点讨论，并分析媒体与文学语言。',
          knowledge: [
            ['语域选择','家庭闲谈、课堂报告、求职面试和公开演讲需要不同词汇、句式和礼貌程度。'],
            ['篇章组织','较长表达要有开场、主题、例证、转折和总结，避免只靠语气词连接。'],
            ['朗读与朗诵','准确读音之外，还要处理停连、重音、节奏和情感层次。'],
            ['跨语码能力','香港语境常见粤语、书面中文和英语切换，应判断对象与目的后选择。']
          ],
          examples: [
            ['我想补充一点……','ngo5 soeng2 bou2 cung1 jat1 dim2','正式讨论中的补充表达','比“我仲有嘢讲”更适合正式场合。'],
            ['根据以上资料，可以见到……','gan1 geoi3 ji5 soeng6 zi1 liu2','资料陈述','先引用证据再提出判断。']
          ],
          dialogue: [],
          practice: [
            ['正式汇报为什么要减少过多语气词？','为了让结构和论证更清楚，并匹配正式语域。'],
            ['朗诵中的“停连”有什么作用？','划分意义单位，突出逻辑和情感。']
          ],
          output: '录制两分钟粤语观点陈述，包含明确观点、两个理由、例子和总结。'
        },
        advanced: {
          canDo: '能分析粤语音系、语法、书写和社会变体，并进行规范转写、教学或研究型表达。',
          knowledge: [
            ['粤拼规范','使用香港语言学学会粤拼记录声母、韵母和1至6调；入声音节仍使用相应调号。'],
            ['音系分析','通过最小对立、音位分布和语流变化分析声母、韵母与声调。'],
            ['口语书写','粤语字要区分通行写法、语源和语境；研究材料应说明转写原则。'],
            ['社会语言学','年龄、地区、身份、场合和媒介都会影响词汇、语音与语码选择。']
          ],
          examples: [
            ['诗 si1／时 si4／事 si6','—','同一音节不同声调','可用于声调最小对立练习。'],
            ['食 sik6／识 sik1','—','声调区分词义','-k为塞音韵尾。']
          ],
          dialogue: [],
          practice: [
            ['粤拼为什么保留声调数字？','粤语声调能区别词义，转写时不可省略。'],
            ['做口语语料转写时应记录什么？','说话者、场景、停顿、重叠、非语言信息和转写规范。']
          ],
          output: '选取30秒自然粤语语料，完成汉字、粤拼和语用标注，并说明两处语流现象。'
        }
      }
    },
    japanese: {
      lang: 'ja-JP',
      labels: ['音拍','假名','词块','任务','文化'],
      stages: {
        preschool: {
          canDo: '能辨认基础平假名和五个元音，完成问候、姓名和简单物品指认。',
          knowledge: [
            ['音拍节奏','日语按音拍保持较均匀节奏，长音、促音和拨音都各占一个音拍。'],
            ['五十音','先掌握あ・い・う・え・お，再按行练习清音，读写与听辨同步。'],
            ['整句输入','初学先学“わたしは～です”“これは～です”等高频句型。']
          ],
          examples: [
            ['あ・い・う・え・お','a i u e o','五个元音','保持短而清楚'],
            ['こんにちは','konnichiwa','你好','固定问候'],
            ['わたしは リンです。','watashi wa Rin desu','我是林。','は在此读wa']
          ],
          dialogue: [
            ['A','こんにちは。おなまえは？','konnichiwa. onamae wa?','你好，你叫什么名字？'],
            ['B','リンです。','Rin desu.','我叫林。']
          ],
          practice: [
            ['“あ”读什么？','a'],
            ['“わたしは学生です”中的は怎么读？','读作wa。']
          ],
          output: '用日语完成问候和姓名介绍，并认读あ行与か行。'
        },
        primary: {
          canDo: '能读写平假名和常用片假名，使用助词完成家庭、学校、时间和购物等基础交流。',
          knowledge: [
            ['假名自动化','通过词中认读而不是只背表格，提高阅读速度。'],
            ['主题与信息','は标记主题，が常突出新信息或主语，を标记动作对象。'],
            ['礼貌体','です／ます体适合初次见面、课堂和一般正式交流。'],
            ['Can-do任务','以“能买东西”“能介绍家人”等实际任务组织词汇和语法。']
          ],
          examples: [
            ['わたしは学生です。','watashi wa gakusei desu','我是学生。','主题は'],
            ['パンを食べます。','pan o tabemasu','吃面包。','宾语を'],
            ['三時に帰ります。','sanji ni kaerimasu','三点回家。','时间点に']
          ],
          dialogue: [
            ['店员','いらっしゃいませ。','irasshaimase','欢迎光临。'],
            ['顾客','これをください。','kore o kudasai','请给我这个。']
          ],
          practice: [
            ['动作对象通常用哪个助词？','を。'],
            ['具体时间点常用哪个助词？','に。']
          ],
          output: '完成一段便利店购物对话，包含询问、数量、价格和道谢。'
        },
        junior: {
          canDo: '能运用て形、过去式、否定式和连接表达，叙述经历、计划并进行简单讨论。',
          knowledge: [
            ['动词分类','先判断一段、五段和不规则动词，再进行活用。'],
            ['て形功能','用于连接动作、请求、许可、禁止、进行和状态等多种结构。'],
            ['信息结构','日语常省略可从语境恢复的主语，理解时要追踪话题。'],
            ['阅读策略','识别接续词、指示词和段落末句，梳理因果与转折。']
          ],
          examples: [
            ['食べる → 食べて','taberu → tabete','吃 → て形','一段动词去る加て'],
            ['本を読んで、寝ました。','hon o yonde, nemashita','读完书后睡了。','动作连接'],
            ['日本へ行ったことがあります。','—','去过日本。','经历']
          ],
          dialogue: [
            ['A','週末、何をしましたか。','—','周末做了什么？'],
            ['B','友だちと映画を見ました。','—','和朋友看了电影。']
          ],
          practice: [
            ['て形只有“正在进行”一个功能吗？','不是，还可连接动作、请求、许可等。'],
            ['为什么阅读时要追踪话题？','日语经常省略主语，话题决定省略成分。']
          ],
          output: '用过去式和连接表达叙述一次周末经历，至少写六句。'
        },
        senior: {
          canDo: '能理解较复杂句式和语体差异，进行观点表达、摘要和JLPT中高级阅读。',
          knowledge: [
            ['从句与修饰','日语修饰从句置于名词之前，阅读时先找中心名词和句末谓语。'],
            ['语体选择','普通体用于亲密交流和书面叙述，敬体用于礼貌交流；场合决定选择。'],
            ['论述连接','一方で、したがって、にもかかわらず等标记对比、结果与让步。'],
            ['摘要','删除例子和重复，保留主题、关键理由和结论。']
          ],
          examples: [
            ['雨にもかかわらず、試合は続いた。','—','尽管下雨，比赛仍继续。','让步'],
            ['この結果から、次のことが分かる。','—','由此结果可知……','资料说明']
          ],
          dialogue: [],
          practice: [
            ['长句阅读先找什么？','句末谓语、中心名词和连接关系。'],
            ['摘要是否保留所有例子？','通常不保留，只保留核心信息。']
          ],
          output: '阅读一段说明文，写出80至120字日语摘要，并标出三个逻辑连接词。'
        },
        advanced: {
          canDo: '能按JF标准完成学术、职场和跨文化任务，进行高阶阅读、讨论、报告和研究写作。',
          knowledge: [
            ['Can-do设计','学习目标应描述“能用日语完成什么任务”，并配合可观察的评价标准。'],
            ['互动能力','高级表达不仅看语法，还看回应、协商、修正和维持对话的能力。'],
            ['学术语域','使用定义、分类、因果、比较和限制表达，避免口语缩略。'],
            ['跨文化反思','比较表达习惯和价值前提，避免把差异简单判断为对错。']
          ],
          examples: [
            ['本稿では～を明らかにする。','—','本文旨在阐明……','研究目的'],
            ['確かに～。しかし、～という点も考慮する必要がある。','—','承认后提出限制','平衡论证']
          ],
          dialogue: [],
          practice: [
            ['JF标准用什么描述水平？','用Can-do描述能完成的语言任务。'],
            ['高级互动只看词汇量吗？','不，还包括协商意义、回应和修正策略。']
          ],
          output: '完成五分钟日语报告并设计自评量表：任务完成、组织、准确、流利和互动。'
        }
      }
    },
    korean: {
      lang: 'ko-KR',
      labels: ['字母','音节','词尾','敬语','任务'],
      stages: {
        preschool: {
          canDo: '能辨认基础辅音和元音，拼读简单音节，并完成问候和姓名介绍。',
          knowledge: [
            ['韩文结构','韩文字母按音节组合成方块，基本结构包括辅音＋元音，也可加收音。'],
            ['元音方向','竖形元音写在辅音右侧，横形元音写在辅音下方。'],
            ['声音与字形','先把字母音合成音节，再合成词，避免只按罗马字记忆。']
          ],
          examples: [
            ['ㅏ','a','基本元音','竖线右侧短横'],
            ['가','ga','ㄱ＋ㅏ','辅音和元音组成音节'],
            ['안녕하세요','annyeonghaseyo','你好','礼貌问候']
          ],
          dialogue: [
            ['A','안녕하세요. 이름이 뭐예요?','annyeonghaseyo. ireumi mwoyeyo?','你好，你叫什么名字？'],
            ['B','저는 민수예요.','jeoneun Minsuyeyo.','我是民洙。']
          ],
          practice: [
            ['“가”由哪两个字母组成？','ㄱ和ㅏ。'],
            ['初次见面可用什么问候？','안녕하세요。']
          ],
          output: '拼读五个基础音节，并完成一句姓名介绍。'
        },
        primary: {
          canDo: '能读写基础韩文，使用主题、主格和宾格助词，完成家庭、学校、时间和饮食对话。',
          knowledge: [
            ['助词选择','은／는标记话题，이／가标记主语或新信息，을／를标记宾语。'],
            ['有无收音','助词形式常取决于名词末尾是否有收音，例如은／는。'],
            ['礼貌终结','-아요／어요是常用礼貌体，适合一般生活交流。'],
            ['词块学习','把“주세요”“어디예요”“얼마예요”作为完整交际块练习。']
          ],
          examples: [
            ['저는 학생이에요.','jeoneun haksaeng-ieyo','我是学生。','主题助词는'],
            ['사과를 먹어요.','sagwareul meogeoyo','吃苹果。','宾语助词를'],
            ['이거 얼마예요?','igeo eolmayeyo','这个多少钱？','购物']
          ],
          dialogue: [
            ['顾客','김밥 하나 주세요.','gimbap hana juseyo','请给我一份紫菜包饭。'],
            ['店员','네, 여기 있습니다.','ne, yeogi itsseumnida','好的，给您。']
          ],
          practice: [
            ['元音结尾名词作主题通常接什么？','는。'],
            ['“请给我……”常用什么表达？','～ 주세요。']
          ],
          output: '设计一段点餐对话，包含数量、食物、请求和道谢。'
        },
        junior: {
          canDo: '能运用过去、将来、原因、转折和连接表达，叙述经历并参与校园生活交流。',
          knowledge: [
            ['时态','-았／었어요表示过去，-(으)ㄹ 거예요表示计划或推测。'],
            ['连接语尾','-고连接并列动作，-아서／어서常表示原因或先后关系。'],
            ['敬语意识','根据对象、关系和场合选择词汇、助词和终结形式。'],
            ['收音变化','语流中部分辅音会发生连音、鼻音化等变化，听力要结合拼写和规则。']
          ],
          examples: [
            ['먹다 → 먹었어요','meokda → meogeosseoyo','吃 → 吃了','过去式'],
            ['공부하고 운동했어요.','—','学习后又运动了。','动作并列'],
            ['비가 와서 집에 있었어요.','—','因为下雨，所以在家。','原因']
          ],
          dialogue: [
            ['A','주말에 뭐 했어요?','—','周末做了什么？'],
            ['B','친구를 만나서 같이 공부했어요.','—','见了朋友，一起学习。']
          ],
          practice: [
            ['-고与-아서／어서的常见区别是什么？','-고多连接并列动作；-아서／어서常表达原因或紧密先后。'],
            ['为什么要学习语流音变？','实际听到的声音可能与孤立拼写不同。']
          ],
          output: '用过去式和两个连接语尾写六句周末日记。'
        },
        senior: {
          canDo: '能理解间接引语、复杂连接和正式语体，完成观点讨论、图表说明和TOPIK中高级阅读写作。',
          knowledge: [
            ['间接引语','-다고 하다等结构用于转述陈述、疑问、命令和建议。'],
            ['正式书面语','图表和论述写作应减少口语终结，使用客观连接和概括表达。'],
            ['段落组织','先概括总体趋势，再比较关键数据，最后解释可能原因或意义。'],
            ['阅读推断','结合连接词、指代和语气判断未直接说明的关系。']
          ],
          examples: [
            ['그는 내일 온다고 했어요.','—','他说他明天来。','间接引语'],
            ['전체적으로 증가하는 경향을 보인다.','—','总体呈增长趋势。','图表概括']
          ],
          dialogue: [],
          practice: [
            ['图表题第一句通常做什么？','概括总体趋势或最显著特征。'],
            ['间接引语需要注意什么？','原句类型、时态、说话者立场和终结形式。']
          ],
          output: '根据一组虚拟数据写150字左右韩语图表说明，包含总体趋势和两项比较。'
        },
        advanced: {
          canDo: '能按照国际通用韩国语标准课程完成学术与职场任务，进行高阶阅读、讨论和正式写作。',
          knowledge: [
            ['任务能力','以真实任务组织语法、词汇、互动和文化能力，并用可观察表现评价。'],
            ['话语策略','高级讨论需要澄清、追问、让步、总结和协商，而非只追求长句。'],
            ['学术表达','明确研究目的、资料来源、方法、结果与限制，使用一致的术语。'],
            ['语用与文化','敬语、称谓和间接表达与人际关系密切相关，不能脱离场景学习。']
          ],
          examples: [
            ['본 연구의 목적은 ～을 분석하는 데 있다.','—','本研究旨在分析……','研究目的'],
            ['한편, 이러한 결과에는 한계가 있다.','—','另一方面，这一结果存在局限。','限制表达']
          ],
          dialogue: [],
          practice: [
            ['高阶口语为什么要练协商策略？','真实互动中需要确认理解、修正和共同推进任务。'],
            ['学术写作如何避免断言过强？','使用与证据强度匹配的限制和可能性表达。']
          ],
          output: '准备三分钟韩语研究简介，包含目的、方法、主要发现、限制和下一步。'
        }
      }
    }
  };

  const conceptNotes = {
    '四则运算':'先确定运算顺序：括号优先，乘除在加减之前，同级从左到右。',
    '分数':'分数表示整体被平均分后的若干份；比较和运算前要关注单位“1”和分母。',
    '方程':'方程是含未知数的等式。解方程的每一步都要保持等式两边相等。',
    '函数':'函数描述两个变量之间的对应关系，可从解析式、表格和图像三种表示互相转换。',
    '导数':'导数刻画函数在某一点的瞬时变化率，也对应曲线切线斜率。',
    '概率':'概率建立在样本空间上，先列清所有等可能结果，再数有利结果。',
    '光合作用':'绿色植物利用光能，把二氧化碳和水转化为有机物并释放氧气。',
    'DNA':'DNA储存遗传信息；基因是具有特定功能的DNA片段。',
    '力':'力会改变物体的运动状态或形状，分析时要明确受力物体、方向和大小。',
    '欧姆定律':'在适用条件下，电压、电流和电阻满足U=IR。',
    '酸碱':'常温水溶液中pH小于7偏酸，大于7偏碱，等于7为中性。',
    '化学方程式':'化学方程式用化学式表示反应物、生成物和条件，并必须满足原子守恒。',
    '史料':'史料需要判断来源、时间、作者、目的和局限，多种材料应相互印证。',
    '因果':'历史和社会现象常由多重因素共同作用，要区分长期原因、直接原因和触发因素。',
    '地图':'读图先看标题、图例、比例尺和方向，再提取空间分布与关系。',
    '气候':'气候是长期平均状态，受纬度、海陆、地形和大气环流等因素影响。',
    '算法':'算法是解决问题的明确步骤，应具有输入、输出、有限性和可执行性。',
    '循环':'循环用于重复执行一组指令，要明确重复次数或终止条件。',
    '预算':'预算先区分固定与可变支出，再安排储蓄和风险准备。',
    '复利':'复利会让本金和已产生的收益共同增长，时间和利率都会显著影响结果。',
    '论证':'论证由主张、证据和推理组成；证据必须可靠，推理必须把证据与主张连接起来。',
    '不变量':'不变量是在操作过程中保持不变的量或性质，常用于判断能否达到目标状态。'
  };

  const disciplineProfiles = {
    math: ['表示问题','选择方法','逐步计算','检验结果'],
    science: ['提出问题','控制变量','记录证据','解释结论'],
    physics: ['确定研究对象','画出条件与受力','选择定律','检查单位'],
    chemistry: ['识别物质与条件','用微粒观解释','守恒配平','联系实验现象'],
    biology: ['结构与功能','过程与调节','证据与模型','系统与环境'],
    history: ['时间与背景','多源史料','因果与变化','观点与证据'],
    geography: ['空间位置','自然与人文因素','尺度比较','区域联系'],
    computing: ['分解问题','设计算法','实现与测试','评价效率'],
    finance: ['明确目标','识别现金流','比较风险收益','复盘决策'],
    logic: ['澄清命题','识别前提','检查推理','寻找反例']
  };

  const workedExamples = {
    math: {
      preschool: ['7可以分成5和2，所以5＋2＝7；反过来7－5＝2。','用实物摆一摆，说明加减互逆。'],
      primary: ['计算 36÷4＋7：先算36÷4＝9，再算9＋7＝16。','检查是否遵守先乘除后加减。'],
      junior: ['解2x＋5＝17：两边减5得2x＝12，再除以2得x＝6。','把x＝6代回原式，左右都等于17。'],
      senior: ['研究f(x)=x²−4x＋3：配方得(x−2)²−1，因此顶点为(2,−1)。','解析式和图像信息相互验证。'],
      advanced: ['证明问题先寻找对称性、单调性或不变量，再决定代数、数论或组合方法。','每一步写明使用条件，避免只给结论。']
    },
    science: {
      preschool: ['比较植物和石头：植物会生长、需要水和光，石头不会。','用可观察特征而不是“感觉”分类。'],
      primary: ['研究光照对幼苗的影响：两组只改变光照，水、土和温度保持相同。','重复测量高度并记录表格。'],
      junior: ['同一实验多次测量后取平均，可降低偶然误差，但不能消除系统误差。','异常值要检查原因，不应随意删除。'],
      senior: ['评价结论时检查样本、变量控制、测量方法、统计处理和可重复性。','相关性结果不能自动解释因果。'],
      advanced: ['研究方案应预先定义变量、样本、分析方法和停止规则。','公开方法与数据有助于复现。']
    },
    physics: {
      primary: ['同样的玩具车，向前推力越大，加速度通常越大；摩擦会抵消部分推力。','先确定合力方向。'],
      junior: ['物体以5 m/s运动8 s，路程s=vt=5×8=40 m。','单位相乘得到米。'],
      senior: ['电阻6 Ω、电流2 A，电压U=IR=12 V。','先确认欧姆定律适用。'],
      advanced: ['复杂模型要写出理想化假设，并比较理论预测与实验误差。','模型有效范围同样重要。']
    },
    chemistry: {
      primary: ['食盐溶于水不是消失，而是微粒均匀分散；蒸发水后可重新得到食盐。','用可逆操作验证。'],
      junior: ['配平H₂＋O₂→H₂O：2H₂＋O₂→2H₂O。','左右氢、氧原子数分别相等。'],
      senior: ['pH=3的溶液呈酸性；判断还需考虑浓度、温度和具体体系。','实验结论以测量条件为准。'],
      advanced: ['反应机理用多个基元步骤解释速率式，不能只由总方程直接推出。','结合实验数据检验机理。']
    },
    biology: {
      primary: ['叶片接受光照并进行光合作用，根吸收水和无机盐，结构与功能相互配合。','观察后画结构功能图。'],
      junior: ['食物链“草→兔→鹰”中，草是生产者，兔是初级消费者。','箭头表示物质和能量流动方向。'],
      senior: ['有氧呼吸主要在线粒体进行，产生ATP供细胞活动。','区分场所、原料、产物和意义。'],
      advanced: ['用对照、重复和统计分析区分真实效应与随机波动。','生物系统结论通常具有条件性。']
    },
    history: {
      primary: ['把事件按时间排序，再区分人物、地点、原因和结果。','时间线帮助看清先后与变化。'],
      junior: ['比较两份史料时，先看作者身份、写作时间和目的，再判断可信范围。','不同立场不等于毫无价值。'],
      senior: ['解释历史转折要结合结构因素、直接原因、偶发事件和人物选择。','避免单一原因论。'],
      advanced: ['研究问题要用一手和二手资料交叉验证，并说明史料沉默和保存偏差。','结论应与证据强度匹配。']
    },
    geography: {
      primary: ['读地图先看图例与方向，再判断河流、道路和聚落的相对位置。','比例尺决定图上距离对应的实际距离。'],
      junior: ['分析气候图：先读气温年变化，再读降水总量与季节分配。','联系纬度、海陆和地形解释。'],
      senior: ['区域问题同时考虑自然条件、人口、产业、交通、政策和全球联系。','不同尺度可能得到不同结论。'],
      advanced: ['空间数据分析要关注分辨率、投影、采样偏差和空间自相关。','地图并非中性的现实复制。']
    },
    computing: {
      primary: ['把重复10次的动作写成循环，比复制10段指令更清楚。','先写循环体，再设次数。'],
      junior: ['二分查找每次排除一半范围，前提是数据已排序。','记录左端、右端和中点。'],
      senior: ['比较算法不仅看能否运行，还看时间复杂度、空间复杂度和可维护性。','用测试用例覆盖边界情况。'],
      advanced: ['系统设计要明确需求、接口、数据流、失败模式和安全威胁。','性能与正确性都需可测量。']
    },
    finance: {
      primary: ['收入100元，先存20元，再安排必要支出和可选支出。','预算不是限制一切，而是按目标分配。'],
      junior: ['比较商品价格要看单位价格、质量、使用次数和隐性成本。','折扣不一定代表更划算。'],
      senior: ['投资决策要同时比较收益、波动、流动性、期限和承受能力。','高收益通常伴随更高风险。'],
      advanced: ['用情景分析和敏感性分析检验假设变化对结果的影响。','不要把历史表现当作保证。']
    },
    logic: {
      primary: ['分类题先确定统一标准，再检查每个对象是否只属于一个类别。','标准改变，分类结果也可能改变。'],
      junior: ['若“A且B”为真，则A和B都必须为真；找到一个为假即可否定合取。','把语言改写成逻辑结构。'],
      senior: ['有效推理保证：若前提都真，结论不可能假。前提是否真实是另一个问题。','区分有效性与真实性。'],
      advanced: ['反例只需满足前提但不满足结论，即可推翻全称命题或无效论证。','优先寻找边界和极端情况。']
    }
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const currentSubject = () => document.body.dataset.subject || new URLSearchParams(location.search).get('subject') || '';
  const currentStage = () => document.querySelector('#subject-stage')?.value || new URLSearchParams(location.search).get('stage') || 'primary';

  function addStyles() {
    if (document.querySelector('link[data-learning-v5]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/learning-v5.css?v=20260805-1';
    link.dataset.learningV5 = '1';
    document.head.append(link);
  }

  function speak(text, lang) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang === 'zh-HK' ? 0.82 : 0.9;
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.toLowerCase() === lang.toLowerCase()) ||
      voices.find(v => v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase()));
    if (preferred) utterance.voice = preferred;
    speechSynthesis.speak(utterance);
  }

  function loadCompleted() {
    try { return JSON.parse(localStorage.getItem('wind-lessons-completed-v5') || '{}'); }
    catch { return {}; }
  }

  function saveCompleted(value) {
    localStorage.setItem('wind-lessons-completed-v5', JSON.stringify(value));
  }

  function markComplete(subject, stage, index, total) {
    const completed = loadCompleted();
    const key = `${subject}|${stage}`;
    const set = new Set(completed[key] || []);
    set.add(index);
    completed[key] = [...set];
    saveCompleted(completed);
    try {
      const state = JSON.parse(localStorage.getItem('wind-academy-v4') || '{}');
      state.progress ||= {};
      state.progress[subject] ||= {};
      state.progress[subject][stage] = Math.round(Math.min(100, set.size / Math.max(1,total) * 100));
      state.stars = Number(state.stars || 0) + 1;
      localStorage.setItem('wind-academy-v4', JSON.stringify(state));
      const star = document.querySelector('#star-count');
      if (star) star.textContent = state.stars;
    } catch {}
  }

  function getTopicData(subject, stage) {
    const data = catalog.subjects[subject];
    return data?.stages?.[stage] || data?.stages?.primary || [];
  }

  function conceptExplanation(concept, subject) {
    if (conceptNotes[concept]) return conceptNotes[concept];
    const methods = disciplineProfiles[subject] || ['明确概念','观察例子','完成练习','解释结果'];
    return `学习“${concept}”时，先用自己的话说明它是什么，再辨认适用条件，通过正例和反例建立边界，最后在${methods.join('、')}中应用。`;
  }

  function disciplineExample(subject, stage, topic) {
    const source = workedExamples[subject] || workedExamples.science;
    const selected = source[stage] || source.primary || Object.values(source)[0];
    return {
      title: topic.title,
      canDo: `能解释“${topic.title}”中的核心概念，完成一个示例，并把方法迁移到新情境。`,
      knowledge: (topic.concepts || []).map(c => [c, conceptExplanation(c, subject)]),
      examples: [[selected[0],'',selected[1],'分步示例']],
      dialogue: [],
      practice: [
        [`本单元最重要的第一步是什么？`, (disciplineProfiles[subject] || ['明确问题'])[0] + '。'],
        [`完成后怎样检查？`, `回到条件、单位、证据或逻辑链，验证结果是否合理。`]
      ],
      output: topic.challenge || `用图、表、文字或步骤讲清本单元方法，并设计一道变式题。`,
      lang: 'zh-CN'
    };
  }

  function makeLesson(subject, stage, topic) {
    const profile = languageProfiles[subject];
    if (profile) return {...profile.stages[stage], lang: profile.lang};
    return disciplineExample(subject, stage, topic);
  }

  function resourceCards(subject) {
    const links = [...(resourceMap[subject] || []), ...(resourceMap.general || [])];
    return links.map(([name,url]) => `<a class="learning-resource" href="${esc(url)}" target="_blank" rel="noopener"><strong>${esc(name)}</strong><span>打开权威公开资源 ↗</span></a>`).join('');
  }

  function renderKnowledge(lesson, topic, subject) {
    const concepts = (topic.concepts || []).map(c => `<span>${esc(c)}</span>`).join('');
    return `<section class="learning-section">
      <div class="learning-goal"><b>本课目标</b><p>${esc(lesson.canDo)}</p></div>
      <div class="concept-strip">${concepts}</div>
      <div class="knowledge-grid">${lesson.knowledge.map(([title,text]) => `<article><b>${esc(title)}</b><p>${esc(text)}</p></article>`).join('')}</div>
      <div class="method-card"><b>学习顺序</b><ol>${(languageSubjects.has(subject) ? ['先听或观察','分解声音、字形或结构','模仿并替换练习','在真实任务中输出','回听或复盘修正'] : (disciplineProfiles[subject] || ['理解概念','观察示例','独立练习','解释与迁移'])).map(item => `<li>${esc(item)}</li>`).join('')}</ol></div>
    </section>`;
  }

  function renderExamples(lesson, subject) {
    const audio = languageSubjects.has(subject);
    return `<section class="learning-section">
      <div class="example-list">${lesson.examples.map(([text,reading,meaning,note],index) => `<article class="example-card">
        <div class="example-index">${String(index+1).padStart(2,'0')}</div>
        <div class="example-body"><strong>${esc(text)}</strong>${reading ? `<code>${esc(reading)}</code>` : ''}<p>${esc(meaning)}</p><small>${esc(note)}</small></div>
        ${audio ? `<button class="sound-btn" type="button" data-speak="${esc(text)}" aria-label="朗读">▶</button>` : ''}
      </article>`).join('')}</div>
      ${lesson.dialogue?.length ? `<div class="dialogue-card"><h3>情境对话</h3>${lesson.dialogue.map(([speaker,text,reading,meaning]) => `<div class="dialogue-line"><b>${esc(speaker)}</b><div><strong>${esc(text)}</strong>${reading ? `<code>${esc(reading)}</code>` : ''}<span>${esc(meaning)}</span></div>${audio ? `<button class="sound-btn small" type="button" data-speak="${esc(text)}">▶</button>` : ''}</div>`).join('')}</div>` : ''}
    </section>`;
  }

  function renderPractice(lesson, subject) {
    return `<section class="learning-section">
      <div class="micro-practice">${lesson.practice.map((item,index) => `<article>
        <span>练习 ${index+1}</span><h3>${esc(item[0])}</h3>
        <button class="reveal-btn" type="button">查看答案</button>
        <p class="micro-answer" hidden>${esc(item[1])}</p>
      </article>`).join('')}</div>
      <div class="output-task"><span>输出任务</span><h3>${esc(lesson.output)}</h3><p>${languageSubjects.has(subject) ? '先模仿示例，再替换关键信息，最后脱离示例独立完成。' : '写出过程、依据和检查方法，不只保留最终答案。'}</p></div>
    </section>`;
  }

  function renderReview(lesson, topic) {
    return `<section class="learning-section">
      <div class="review-board">
        <article><b>闭眼回忆</b><p>不用看页面，说出本课${(topic.concepts || []).slice(0,3).join('、')}的核心意思。</p></article>
        <article><b>错误检查</b><p>${esc(topic.review || '检查概念、条件、步骤和表达是否准确。')}</p></article>
        <article><b>间隔复习</b><p>今天完成一次，明天快速回忆，三天后再做一道新情境题。</p></article>
        <article><b>迁移提升</b><p>${esc(topic.challenge || lesson.output)}</p></article>
      </div>
    </section>`;
  }

  function renderResources(subject) {
    return `<section class="learning-section"><div class="resource-grid">${resourceCards(subject)}</div><p class="resource-note">外部资源用于延伸学习。课程正文为本站根据公开课程框架重新组织的原创内容，不复制教材正文或真题。</p></section>`;
  }

  function mount() {
    const subject = currentSubject();
    if (!subject || !catalog.subjects[subject]) return;
    const original = document.querySelector('#topic-grid');
    const cycleTabs = document.querySelector('#cycle-tabs');
    if (!original || document.querySelector('#learning-v5-root')) return;
    addStyles();
    original.classList.add('learning-original-hidden');
    if (cycleTabs) cycleTabs.classList.add('learning-original-hidden');

    const root = document.createElement('section');
    root.id = 'learning-v5-root';
    root.className = 'learning-workspace';
    original.before(root);

    let activeUnit = 0;
    let activeTab = 'knowledge';

    const render = () => {
      const stage = currentStage();
      const topics = getTopicData(subject, stage);
      if (!topics.length) {
        root.innerHTML = '<div class="learning-empty"><strong>该阶段课程正在整理</strong></div>';
        return;
      }
      if (activeUnit >= topics.length) activeUnit = 0;
      const topic = topics[activeUnit];
      const lesson = makeLesson(subject, stage, topic);
      const completed = new Set(loadCompleted()[`${subject}|${stage}`] || []);
      const progress = Math.round(completed.size / topics.length * 100);
      const panels = {
        knowledge: renderKnowledge(lesson, topic, subject),
        examples: renderExamples(lesson, subject),
        practice: renderPractice(lesson, subject),
        review: renderReview(lesson, topic),
        resources: renderResources(subject)
      };

      root.innerHTML = `<aside class="learning-units">
        <div class="unit-head"><span>${esc(stageNames[stage])}</span><strong>课程路线</strong><div><i style="width:${progress}%"></i></div><small>${completed.size}/${topics.length} 已完成</small></div>
        <nav>${topics.map((item,index) => `<button type="button" data-unit="${index}" class="${index===activeUnit?'active':''} ${completed.has(index)?'done':''}"><b>${String(index+1).padStart(2,'0')}</b><span>${esc(item.title)}</span></button>`).join('')}</nav>
      </aside>
      <article class="learning-lesson">
        <header class="lesson-header">
          <div><span class="lesson-kicker">${esc(catalog.subjects[subject].name)} · ${esc(stageNames[stage])}</span><h2>${esc(topic.title)}</h2><p>${esc(topic.preview || lesson.canDo)}</p></div>
          <button class="complete-btn ${completed.has(activeUnit)?'completed':''}" type="button" id="lesson-complete">${completed.has(activeUnit)?'已完成':'完成本课'}</button>
        </header>
        <div class="lesson-tabs">
          ${[['knowledge','讲解'],['examples','示例'],['practice','操练'],['review','复习'],['resources','资源']].map(([key,label]) => `<button type="button" data-lesson-tab="${key}" class="${key===activeTab?'active':''}">${label}</button>`).join('')}
        </div>
        <div id="lesson-panel">${panels[activeTab]}</div>
        <footer class="lesson-footer"><button type="button" id="prev-unit" ${activeUnit===0?'disabled':''}>上一课</button><a href="practice.html?subject=${esc(subject)}&stage=${esc(stage)}&topic=${encodeURIComponent(topic.title)}&autostart=1">本课练习</a><button type="button" id="next-unit" ${activeUnit===topics.length-1?'disabled':''}>下一课</button></footer>
      </article>`;

      root.querySelectorAll('[data-unit]').forEach(button => button.addEventListener('click', () => {
        activeUnit = Number(button.dataset.unit);
        activeTab = 'knowledge';
        render();
        root.scrollIntoView({behavior:'smooth',block:'start'});
      }));
      root.querySelectorAll('[data-lesson-tab]').forEach(button => button.addEventListener('click', () => {
        activeTab = button.dataset.lessonTab;
        render();
      }));
      root.querySelectorAll('[data-speak]').forEach(button => button.addEventListener('click', () => speak(button.dataset.speak, lesson.lang || 'zh-CN')));
      root.querySelectorAll('.reveal-btn').forEach(button => button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        answer.hidden = !answer.hidden;
        button.textContent = answer.hidden ? '查看答案' : '收起答案';
      }));
      root.querySelector('#lesson-complete')?.addEventListener('click', () => {
        if (!completed.has(activeUnit)) markComplete(subject, stage, activeUnit, topics.length);
        render();
      });
      root.querySelector('#prev-unit')?.addEventListener('click', () => { if (activeUnit > 0) { activeUnit--; activeTab='knowledge'; render(); } });
      root.querySelector('#next-unit')?.addEventListener('click', () => { if (activeUnit < topics.length-1) { activeUnit++; activeTab='knowledge'; render(); } });
    };

    document.querySelector('#subject-stage')?.addEventListener('change', () => {
      activeUnit = 0;
      activeTab = 'knowledge';
      setTimeout(render, 0);
    });
    document.querySelector('#subject-system')?.addEventListener('change', () => setTimeout(render, 0));
    render();
  }

  function boot() {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(mount, 0), {once:true});
    else setTimeout(mount, 0);
  }

  boot();
})();