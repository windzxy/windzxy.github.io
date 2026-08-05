(() => {
  'use strict';

  const catalog = window.WIND_CATALOG;
  if (!catalog) return;

  const languageSubjects = new Set(['chinese','english','cantonese','japanese','korean']);
  const stageNames = catalog.stages;
  const version = '20260805-2';
  const completedKey = 'wind-deep-course-v6';
  const voiceProfiles = {
    chinese: {label:'普通话', langs:['zh-CN','cmn-CN'], names:['Xiaoxiao','Yunxi','Huihui','Kangkang','Ting-Ting','Mei-Jia','普通话','Mandarin']},
    cantonese: {label:'粤语', langs:['yue-HK','yue','zh-HK'], names:['HiuMaan','HiuGaai','Sin-Ji','Cantonese','Hong Kong','粤语','粵語']},
    english: {label:'英语', langs:['en-GB','en-US','en-AU','en-CA'], names:['Sonia','Ryan','Aria','Jenny','Guy','English']},
    japanese: {label:'日语', langs:['ja-JP','ja'], names:['Nanami','Ayumi','Haruka','Kyoko','Otoya','Japanese','日本語']},
    korean: {label:'韩语', langs:['ko-KR','ko'], names:['SunHi','Heami','Korean','한국어']}
  };
  const resources = {
    chinese: [
      ['香港教育局中国语文课程文件','https://www.edb.gov.hk/sc/curriculum-development/kla/chi-edu/curriculum-documents.html'],
      ['国家中小学智慧教育平台','https://basic.smartedu.cn/']
    ],
    english: [
      ['香港教育局英语课程文件','https://www.edb.gov.hk/en/curriculum-development/kla/eng-edu/curriculum-documents.html'],
      ['British Council LearnEnglish','https://learnenglish.britishcouncil.org/']
    ],
    cantonese: [
      ['香港语言学学会粤拼方案','https://jyutping.org/yue_hans/jyutping/'],
      ['粤拼学习资源','https://jyutping.org/learn/']
    ],
    japanese: [
      ['国际交流基金 JF 日语教育标准','https://www.jfstandard.jpf.go.jp/summary/ja/render.do'],
      ['NHK 简明日语','https://www.nhk.or.jp/lesson/zh/']
    ],
    korean: [
      ['韩国国立国语院学习资源','https://www.korean.go.kr/front_eng/main.do'],
      ['世宗学堂在线课程','https://www.iksi.or.kr/']
    ],
    general: [
      ['香港教育局课程发展','https://www.edb.gov.hk/sc/curriculum-development/'],
      ['新加坡教育部课程资料','https://www.moe.gov.sg/education-in-sg/our-programmes']
    ]
  };

  const poems = {
    '古诗文启蒙': [
      {
        title:'《春晓》', author:'孟浩然', dynasty:'唐', kind:'poem',
        background:'诗人从春日清晨醒来的感受写起。全诗不直接描画繁复景物，而是用听觉、回忆和想象，把春晨的明快与对落花的惋惜连在一起。',
        text:['春眠不觉晓，','处处闻啼鸟。','夜来风雨声，','花落知多少。'],
        notes:[
          ['春眠不觉晓','春日睡意正浓，不知不觉天已经亮了。','“不觉”写睡眠安稳，也从侧面表现春日气候宜人。'],
          ['处处闻啼鸟','醒来后，四处都能听见鸟儿鸣叫。','诗人先写声音，不写鸟的形状，让读者自己想象清晨生机。'],
          ['夜来风雨声','想到昨夜曾经听见风雨之声。','由眼前的鸟鸣转入回忆，时间从“今晨”回到“昨夜”。'],
          ['花落知多少','不知道风雨吹落了多少花朵。','“知多少”不是询问数量，而是含蓄表达惜春、惜花之情。']
        ],
        thought:['从“不觉晓”写醒来','以“闻啼鸟”呈现春晨生机','由鸟鸣联想到昨夜风雨','以落花收束，喜春中含惜春'],
        theme:'全诗写春日清晨的听觉与联想，既表现春天的生机，也流露对花落、春光易逝的怜惜。',
        techniques:[
          ['听觉入诗','啼鸟、风雨都由声音呈现，画面虽少却富有空间感。'],
          ['时空转换','由今晨转到昨夜，再由声音想到落花。'],
          ['含蓄留白','不直接写花落景象，以“知多少”留给读者想象。']
        ],
        famous:[['春眠不觉晓，处处闻啼鸟。','常用于描写春日清晨的舒适与生机。'],['夜来风雨声，花落知多少。','常考“由听觉引发联想”以及惜春情感。']],
        exam:['“晓”指天亮，不是“知道”。','“处处”突出鸟鸣范围广、春意浓。','后两句由实听转为回忆和想象。','情感不是单纯欢喜，而是喜春与惜春交织。'],
        errors:['把“知多少”理解成真的计算花朵数量。','只写“热爱春天”，忽略对落花的惋惜。','分析手法时只写“拟人”，但诗中重点并非拟人。'],
        questions:[
          ['诗人醒来后先感受到什么？','先听见四处鸟鸣，感受到春晨的生机。'],
          ['“花落知多少”表达怎样的情感？','表达对昨夜风雨后落花的关切与惜春之情。'],
          ['全诗的思路如何推进？','醒来—听鸟—忆风雨—想落花。']
        ]
      },
      {
        title:'《静夜思》', author:'李白', dynasty:'唐', kind:'poem',
        background:'这首五言绝句写客居异乡的夜晚。诗人由眼前月光产生错觉，再通过抬头与低头两个动作完成由写景到抒情的转换。',
        text:['床前明月光，','疑是地上霜。','举头望明月，','低头思故乡。'],
        notes:[
          ['床前明月光','明亮的月光洒在床前。','“明”突出月色清澈，也奠定安静、清冷的氛围。'],
          ['疑是地上霜','一时误以为地上铺着白霜。','“疑”写出半梦半醒间的真实感受，月光与霜都洁白清冷。'],
          ['举头望明月','抬起头来望着天空中的明月。','动作由近处的地面转向远处天空。'],
          ['低头思故乡','低下头来思念故乡。','“低头”不仅是动作，也表现情绪沉静、思乡深切。']
        ],
        thought:['先写床前月光','由月光产生“霜”的错觉','抬头望月确认眼前景象','低头由月入情，落到思乡'],
        theme:'诗人借明月这一共同景物表达客居异乡时朴素而深沉的思乡之情。',
        techniques:[['借景抒情','以月光、明月触发思乡。'],['动作传情','“举头—低头”使情绪变化可见。'],['比喻联想','月光如霜，强化清冷氛围。']],
        famous:[['举头望明月，低头思故乡。','名句常考动作描写、借月抒情和思乡主题。']],
        exam:['“疑”表现错觉，不是确定判断。','“举头”和“低头”构成动作对照。','明月既是眼前之景，也是故乡联想的媒介。'],
        errors:['把“霜”理解为真的下霜。','只答“看月亮”，没有说明由月触发思乡。'],
        questions:[['“疑”字有什么作用？','写出月光洁白、清冷，也使半梦半醒的感受更真实。'],['后两句怎样由景入情？','先抬头望月，再低头思乡，以动作完成情感转折。']]
      },
      {
        title:'《登鹳雀楼》', author:'王之涣', dynasty:'唐', kind:'poem',
        background:'诗人登楼远望，先写落日、黄河的壮阔景象，再由“看得更远”推出“再上一层”的行动和哲理。',
        text:['白日依山尽，','黄河入海流。','欲穷千里目，','更上一层楼。'],
        notes:[
          ['白日依山尽','夕阳依傍群山缓缓落下。','“依”使落日与山势相连，“尽”写太阳逐渐隐没。'],
          ['黄河入海流','黄河奔腾着流向大海。','由近处山日转向远处大河，画面开阔。'],
          ['欲穷千里目','想要把更远的景物全都看尽。','“穷”是尽、达到极点。'],
          ['更上一层楼','就要再登上一层楼。','写行动，也揭示站得更高才能看得更远的道理。']
        ],
        thought:['写落日依山','写黄河奔海','提出看尽远景的愿望','以登高行动回应愿望并升华哲理'],
        theme:'全诗把壮阔景象与积极进取的精神结合起来，说明要获得更广阔的视野，需要不断提升自己。',
        techniques:[['对仗','“白日—黄河”“依山尽—入海流”结构整齐。'],['由景入理','前两句写景，后两句由景生发哲理。'],['空间扩展','山、河、海与千里视野构成宏大空间。']],
        famous:[['欲穷千里目，更上一层楼。','常用来说明不断进取、提升层次才能拓展眼界。']],
        exam:['“穷”解释为“尽”。','前两句是写景，后两句抒志说理。','哲理必须结合“登高望远”回答。'],
        errors:['把“穷”解释成贫穷。','只写“要爬楼”，没有概括进取哲理。'],
        questions:[['前两句展现怎样的画面？','夕阳依山而落，黄河奔流入海，气势雄浑、空间开阔。'],['后两句告诉我们什么？','要看得更远、取得更高认识，需要不断向上提升。']]
      },
      {
        title:'《悯农（其二）》', author:'李绅', dynasty:'唐', kind:'poem',
        background:'诗人从农民烈日下劳动的具体场景写起，追问每一粒粮食的来源，引导读者珍惜劳动成果。',
        text:['锄禾日当午，','汗滴禾下土。','谁知盘中餐，','粒粒皆辛苦。'],
        notes:[
          ['锄禾日当午','正午烈日下，农民仍在田里锄禾。','时间“日当午”突出天气炎热、劳动艰苦。'],
          ['汗滴禾下土','汗水一滴滴落进庄稼下面的泥土。','“滴”让辛劳变得具体可见。'],
          ['谁知盘中餐','有谁真正知道碗中饭食从何而来？','反问促使读者思考。'],
          ['粒粒皆辛苦','每一粒粮食都凝结着劳动者的辛苦。','“粒粒”强调没有一粒粮食来得轻易。']
        ],
        thought:['呈现正午劳动场景','特写汗滴','由田间转向餐桌提出反问','点明珍惜粮食的道理'],
        theme:'赞美农民辛勤劳动，提醒人们尊重劳动、珍惜粮食。',
        techniques:[['场景与特写','烈日与汗滴形成具体劳动图景。'],['反问','“谁知”增强提醒和教育作用。'],['以小见大','从一粒饭写到劳动价值。']],
        famous:[['谁知盘中餐，粒粒皆辛苦。','常用于倡导节约粮食、尊重劳动。']],
        exam:['“皆”解释为都。','前两句写劳动，后两句说理。','主旨应包含珍惜粮食和尊重劳动。'],
        errors:['只答“天气很热”，没有指出劳动艰辛。','把主题简单写成“农民很可怜”，忽略尊重劳动。'],
        questions:[['“汗滴禾下土”为什么有表现力？','把抽象的辛苦化为可见的汗滴，突出劳动艰辛。'],['全诗对今天有什么启示？','珍惜粮食，尊重生产者的劳动成果。']]
      }
    ],
    '诗词鉴赏': [
      {
        title:'《次北固山下》', author:'王湾', dynasty:'唐', kind:'poem',
        background:'诗人在旅途中停泊北固山下，面对江上早春景象，既写行舟的开阔，也寄托羁旅思乡。',
        text:['客路青山外，行舟绿水前。','潮平两岸阔，风正一帆悬。','海日生残夜，江春入旧年。','乡书何处达？归雁洛阳边。'],
        notes:[
          ['客路青山外，行舟绿水前。','旅途延伸到青山之外，小舟行驶在碧绿江水之上。','“客路”点明羁旅身份。'],
          ['潮平两岸阔，风正一帆悬。','潮水涨平，两岸显得开阔；顺风和缓，船帆高高悬起。','“阔”“悬”写出江面平稳开阔。'],
          ['海日生残夜，江春入旧年。','夜色尚未完全消退，太阳已从海上升起；旧年未尽，江南春意已先到来。','“生”“入”赋予日与春主动性，表现新旧交替。'],
          ['乡书何处达？归雁洛阳边。','家书怎样寄到故乡？希望北归大雁把它带到洛阳。','借雁传书寄托思乡。']
        ],
        thought:['点明旅途与行舟','写江面开阔平稳','由日出春来感受新旧交替','以归雁寄书收束思乡'],
        theme:'描写江南早春壮阔清新的景色，表达旅途中的思乡之情，也包含新事物孕育于旧事物中的哲理。',
        techniques:[['对偶','“潮平两岸阔，风正一帆悬”结构工整。'],['拟人炼字','“生”“入”写新日、新春主动到来。'],['借雁抒情','归雁连接江南与洛阳。']],
        famous:[['海日生残夜，江春入旧年。','常考炼字、哲理和新旧交替。'],['潮平两岸阔，风正一帆悬。','常考江面开阔、顺风行舟的画面。']],
        exam:['“次”是停宿、停泊。','“生”“入”不仅写景，也有哲理意味。','结尾归雁与乡书明确思乡。'],
        errors:['把“江春入旧年”理解为已经过完旧年。','答哲理时脱离诗句空泛谈人生。'],
        questions:[['“一帆悬”的“悬”有什么表达效果？','写船帆端直高挂，表现风顺、江平、航行平稳。'],['颈联为何成为名句？','写残夜中生新日、旧年中入新春，景象鲜明且富有新旧交替哲理。']]
      },
      {
        title:'《钱塘湖春行》', author:'白居易', dynasty:'唐', kind:'poem',
        background:'诗人游览西湖，从孤山寺、贾亭一路行至白沙堤，以行踪串联早春景物。',
        text:['孤山寺北贾亭西，水面初平云脚低。','几处早莺争暖树，谁家新燕啄春泥。','乱花渐欲迷人眼，浅草才能没马蹄。','最爱湖东行不足，绿杨阴里白沙堤。'],
        notes:[
          ['孤山寺北贾亭西，水面初平云脚低。','行至孤山寺北、贾亭西，春水初涨与岸相平，低云贴近湖面。','交代地点，展示水天相接。'],
          ['几处早莺争暖树，谁家新燕啄春泥。','几处早来的黄莺争占向阳树枝，新归燕子衔泥筑巢。','“早”“新”紧扣早春。'],
          ['乱花渐欲迷人眼，浅草才能没马蹄。','野花逐渐繁多，浅草刚刚能够遮住马蹄。','“渐欲”“才能”写春意正在发展。'],
          ['最爱湖东行不足，绿杨阴里白沙堤。','最爱湖东白沙堤，绿杨成阴，让人游赏不够。','直抒喜爱，收束行踪。']
        ],
        thought:['交代行踪和湖面','写莺燕活动','写花草生长','直抒对白沙堤的喜爱'],
        theme:'通过早莺、新燕、乱花、浅草等早春景物，表现西湖春日的生机和诗人的喜悦。',
        techniques:[['移步换景','地点和景物随游踪推进。'],['动静结合','湖面、云脚较静；莺争、燕啄较动。'],['炼字','“争”“啄”“渐欲”“才能”准确写早春状态。']],
        famous:[['几处早莺争暖树，谁家新燕啄春泥。','常考早春特征与动词炼字。'],['乱花渐欲迷人眼，浅草才能没马蹄。','常考“渐欲”“才能”体现春意初盛。']],
        exam:['全诗写早春而非暮春。','线索是诗人的游踪。','“行不足”是游赏不够，表现喜爱。'],
        errors:['把“乱花”理解为杂乱难看。','忽略“几处、谁家、浅、渐欲”等早春限定词。'],
        questions:[['哪些词最能说明是早春？','初平、早莺、新燕、渐欲、浅草、才能。'],['全诗如何做到景中有情？','以游踪选取富有生机的景物，末句直接表达最爱与流连。']]
      },
      {
        title:'《天净沙·秋思》', author:'马致远', dynasty:'元', kind:'poem',
        background:'这首散曲以一组秋日黄昏意象构成羁旅图景，结尾点出断肠游子。',
        text:['枯藤老树昏鸦，','小桥流水人家，','古道西风瘦马。','夕阳西下，','断肠人在天涯。'],
        notes:[
          ['枯藤老树昏鸦','枯藤缠绕老树，黄昏乌鸦归巢。','“枯、老、昏”共同营造衰飒氛围。'],
          ['小桥流水人家','小桥下流水潺潺，旁边有人家。','温暖人家与游子漂泊形成反衬。'],
          ['古道西风瘦马','古老驿道上吹着西风，游子骑着瘦马。','“瘦马”映照旅途劳顿。'],
          ['夕阳西下','夕阳正在落下。','点明时间，暮色加深。'],
          ['断肠人在天涯','极度悲伤的游子远在天涯。','最后点明人物与情感，使前面的景物都成为乡愁载体。']
        ],
        thought:['连续铺陈九个景物','插入温暖人家形成反衬','推出古道游子','以夕阳收紧时空','点明天涯断肠之情'],
        theme:'通过秋日黄昏的萧瑟景象，表现漂泊游子的孤独、疲惫和思乡。',
        techniques:[['意象组合','名词性意象密集排列，少用动词。'],['反衬','“小桥流水人家”的温馨反衬游子无家可归。'],['景情交融','前四句景物都服务于末句乡愁。']],
        famous:[['夕阳西下，断肠人在天涯。','直接点明游子身份与思乡悲情。']],
        exam:['“秋思”是秋日思绪、乡愁。','“小桥流水人家”不是单纯欢快，而有反衬作用。','可概括为“枯藤图—人家图—古道图—夕阳游子”。'],
        errors:['只看见“小桥流水”就判断全曲轻快。','把九个意象逐个翻译，却没有说明整体氛围。'],
        questions:[['“小桥流水人家”在全曲中有什么作用？','描写温馨生活图景，反衬天涯游子的孤独和思乡。'],['为什么称它为“秋思之祖”？','它用极凝练的意象组合创造典型秋思意境，情景高度融合。']]
      }
    ],
    '古诗文综合': [
      {
        title:'《登高》', author:'杜甫', dynasty:'唐', kind:'poem',
        background:'杜甫晚年流寓夔州，重阳登高。诗中既有长江秋景，也有漂泊、年老、多病和国家动荡造成的深重感慨。',
        text:['风急天高猿啸哀，渚清沙白鸟飞回。','无边落木萧萧下，不尽长江滚滚来。','万里悲秋常作客，百年多病独登台。','艰难苦恨繁霜鬓，潦倒新停浊酒杯。'],
        notes:[
          ['风急天高猿啸哀，渚清沙白鸟飞回。','秋风急、天空高，猿声凄哀；水中小洲清冷、沙岸洁白，鸟在风中盘旋。','六种景物密集出现，视听结合，色彩与声音共同营造悲凉。'],
          ['无边落木萧萧下，不尽长江滚滚来。','无边落叶纷纷飘落，不尽长江滚滚奔来。','落木写生命衰谢，长江写时间永恒；空间开阔，气势雄浑。'],
          ['万里悲秋常作客，百年多病独登台。','漂泊万里，常年客居；暮年多病，独自登高。','“万里、悲秋、作客、常作客、百年、多病、独”层层加重身世之悲。'],
          ['艰难苦恨繁霜鬓，潦倒新停浊酒杯。','世事艰难、身世困苦，使白发增多；因病刚刚戒酒，更添愁苦。','“艰难”兼含个人与时代，“新停”写连借酒排愁也不能。']
        ],
        thought:['首联近景，写风天猿渚沙鸟','颔联远景，写落木长江','颈联由景入情，集中身世之悲','尾联写时代艰难与病中停酒，愁情收深'],
        theme:'诗人借夔州秋景抒发长期漂泊、年老多病、孤独困顿以及忧国伤时的复杂悲情。',
        techniques:[['对仗严整','四联皆对仗，语言高度凝练。'],['情景交融','落木、长江既是景物，也承载生命与时间感。'],['层层递进','由自然秋景到身世，再到时代与疾病。']],
        famous:[['无边落木萧萧下，不尽长江滚滚来。','常考意象、空间、对仗和生命／时间意蕴。'],['万里悲秋常作客，百年多病独登台。','常考多重悲意的叠加。']],
        exam:['“落木”比“落叶”更有疏朗、衰飒感。','“艰难”既指个人处境，也关联时代动乱。','“百年”在古诗中可指一生、暮年。'],
        errors:['只答“思乡”，遗漏年老多病、孤独和忧国。','分析颔联只写“对偶”，不说明落木与长江的对照。'],
        questions:[['颔联为何被称为千古名句？','它以无边落木与不尽长江构成时空对照，既雄浑又悲凉，包含生命短暂与时间永恒的感慨。'],['颈联包含哪些“悲”？','万里漂泊、秋景触发、常年客居、暮年、多病、独自登台。']]
      },
      {
        title:'《念奴娇·赤壁怀古》', author:'苏轼', dynasty:'宋', kind:'poem',
        background:'苏轼被贬黄州期间游赤壁，面对长江与古战场，追想周瑜功业，再回到自身处境，以旷达方式化解人生感慨。',
        text:['大江东去，浪淘尽，千古风流人物。','故垒西边，人道是，三国周郎赤壁。','乱石穿空，惊涛拍岸，卷起千堆雪。','江山如画，一时多少豪杰。','遥想公瑾当年，小乔初嫁了，雄姿英发。','羽扇纶巾，谈笑间，樯橹灰飞烟灭。','故国神游，多情应笑我，早生华发。','人生如梦，一尊还酹江月。'],
        notes:[
          ['大江东去，浪淘尽，千古风流人物。','长江滚滚东流，仿佛把千古英雄都淘洗而去。','开篇把自然江流、历史时间和英雄人物连在一起。'],
          ['乱石穿空，惊涛拍岸，卷起千堆雪。','陡峭乱石直插云天，惊涛猛烈拍岸，浪花如千堆白雪。','“穿、拍、卷”三个动词写出雄奇壮阔。'],
          ['遥想公瑾当年……樯橹灰飞烟灭。','想象周瑜年轻从容，谈笑之间取得赤壁大捷。','外貌、装束与行动共同塑造儒将形象。'],
          ['故国神游……一尊还酹江月。','神游古战场后回到现实，自笑多情早生白发，最终举酒祭月。','由仰慕英雄转向自我感慨，并以旷达收束。']
        ],
        thought:['以大江引出历史','写赤壁雄奇景象','赞叹江山豪杰','集中塑造周瑜','由周瑜反观自身','以祭江月表达旷达'],
        theme:'通过赤壁壮景和周瑜形象，抒发对英雄功业的向往、对自身早衰失意的感慨，并表现超越现实困顿的旷达胸襟。',
        techniques:[['写景雄奇','动词、比喻和夸张形成豪放气象。'],['衬托对比','周瑜年轻得志反衬词人早生华发。'],['古今转换','从现实江景进入历史想象，再回到自我。']],
        famous:[['乱石穿空，惊涛拍岸，卷起千堆雪。','常考炼字、比喻、视听和豪放风格。'],['羽扇纶巾，谈笑间，樯橹灰飞烟灭。','常考周瑜从容儒雅、指挥若定。']],
        exam:['“风流人物”指有杰出才华功业的人。','“樯橹”借代曹军战船。','“人生如梦”不可只理解为消极，应结合“酹江月”的自我排遣。'],
        errors:['把赤壁景物理解为纯客观写景。','只写怀古，不说明借古伤今和旷达。'],
        questions:[['周瑜形象为何具有反衬作用？','周瑜年轻、从容、功业显赫，反衬苏轼仕途失意、早生白发。'],['结尾是否完全消极？','不是。虽有生命短暂之叹，但举酒祭江月表现自我排遣与旷达。']]
      },
      {
        title:'《蜀相》', author:'杜甫', dynasty:'唐', kind:'poem',
        background:'杜甫游成都武侯祠，借凭吊诸葛亮表达对其才能、品格和未竟功业的敬仰与惋惜。',
        text:['丞相祠堂何处寻？锦官城外柏森森。','映阶碧草自春色，隔叶黄鹂空好音。','三顾频烦天下计，两朝开济老臣心。','出师未捷身先死，长使英雄泪满襟。'],
        notes:[
          ['丞相祠堂何处寻？锦官城外柏森森。','武侯祠在哪里？成都城外柏树茂密处。','设问引路，“柏森森”营造庄严肃穆。'],
          ['映阶碧草自春色，隔叶黄鹂空好音。','碧草映阶独自呈现春色，黄鹂隔叶徒然发出好听声音。','“自、空”写景物虽美却无人赏，衬托祠堂寂寥和诗人感物伤怀。'],
          ['三顾频烦天下计，两朝开济老臣心。','刘备三顾茅庐，诸葛亮谋划天下；辅佐两朝，尽显老臣忠心。','高度概括诸葛亮才能与忠诚。'],
          ['出师未捷身先死，长使英雄泪满襟。','北伐未成功便去世，令后世英雄长久悲泣。','由个人凭吊提升为后世共同惋惜。']
        ],
        thought:['设问寻找祠堂','写祠堂环境','概括诸葛亮一生功业与忠心','叹未捷先死，升华惋惜'],
        theme:'赞颂诸葛亮的才智、忠诚和献身精神，哀悼其壮志未酬，也寄托诗人对理想政治与济世人才的向往。',
        techniques:[['设问开篇','自然引出地点和凭吊对象。'],['乐景写哀','春草、黄鹂之美反衬祠堂寂寥。'],['高度概括','用“三顾、两朝、出师”提炼人物一生。']],
        famous:[['出师未捷身先死，长使英雄泪满襟。','常考壮志未酬、后世共悲及诗人自我寄托。'],['映阶碧草自春色，隔叶黄鹂空好音。','常考“自、空”炼字与乐景写哀。']],
        exam:['“锦官城”指成都。','“开济”指开创、扶助。','诗人不仅怀人，也寄托自身忧国济世情怀。'],
        errors:['把颔联只答成“春景优美”。','只写诸葛亮悲剧，不写诗人的敬仰。'],
        questions:[['“自”“空”两个字有什么作用？','写草木鸟声无人赏识，反衬祠堂寂寥，寄托凭吊哀情。'],['诗人为何称诸葛亮为“老臣”？','突出其辅佐两朝、竭尽忠诚和一生奉献。']]
      }
    ]
  };

  const originalTexts = {
    chineseReading: {
      title:'《窗台上的小苗》',
      text:[
        '清晨，我发现窗台花盆里钻出一株小苗。它的茎细得像一根绿色的线，两片嫩叶紧紧合在一起。',
        '我每天给它浇一点水，却发现水太多时泥土会变得黏湿。于是我改为先摸一摸土，干了再浇。几天后，小苗慢慢挺直，叶片也舒展开来。',
        '一个星期后，阳光被窗帘挡住，小苗朝着亮处弯去。我把花盆转了半圈。第二天，它又悄悄朝阳光的方向生长。',
        '原来，照料植物不是“做得越多越好”，而是要观察它真正需要什么。'
      ]
    },
    englishPhonics: {
      title:'A Day at the Lake',
      text:[
        'Jake and Kate ride their bikes to the lake.',
        'They take a red kite and a small cake.',
        'A strong wind makes the kite shake, but Jake keeps it safe.',
        'At the end of the day, they sit by the gate and share the cake.'
      ]
    },
    cantoneseDialogue: {
      title:'在茶餐厅点餐',
      text:[
        '顾客：唔该，我想要一个菠萝包同一杯冻奶茶。',
        '店员：冻奶茶要少甜定正常甜？',
        '顾客：少甜，唔该。请问一共几多钱？',
        '店员：四十二蚊。多谢。',
        '顾客：唔该晒。'
      ],
      reading:[
        'm4 goi1, ngo5 soeng2 jiu3 jat1 go3 bo1 lo4 baau1 tung4 jat1 bui1 dung3 naai5 caa4.',
        'dung3 naai5 caa4 jiu3 siu2 tim4 ding6 zing3 soeng4 tim4?',
        'siu2 tim4, m4 goi1. cing2 man6 jat1 gung6 gei2 do1 cin2?',
        'sei3 sap6 ji6 man1. do1 ze6.',
        'm4 goi1 saai3.'
      ]
    },
    japaneseDialogue: {
      title:'コンビニで買い物',
      text:[
        '店員：いらっしゃいませ。',
        '客：このおにぎりを二つください。',
        '店員：温めますか。',
        '客：はい、お願いします。それから、水も一本ください。',
        '店員：全部で五百円です。'
      ],
      reading:['Irasshaimase.','Kono onigiri o futatsu kudasai.','Atatamemasu ka.','Hai, onegai shimasu. Sorekara, mizu mo ippon kudasai.','Zenbu de gohyaku-en desu.']
    },
    koreanDialogue: {
      title:'카페에서 주문하기',
      text:[
        '직원: 어서 오세요. 무엇을 드릴까요?',
        '손님: 아메리카노 한 잔하고 샌드위치 하나 주세요.',
        '직원: 커피는 따뜻한 것으로 드릴까요?',
        '손님: 네, 따뜻하게 주세요.',
        '직원: 모두 만 이천 원입니다.'
      ],
      reading:['Eoseo oseyo. Mueoseul deurilkkayo?','Amerikano han janhago saendeuwichi hana juseyo.','Keopineun ttatteuthan geoseuro deurilkkayo?','Ne, ttatteuthage juseyo.','Modu man icheon wonimnida.']
    }
  };

  const subjectMethods = {
    math:['读清条件与问题','画图或设未知量','建立数量关系','分步计算或推导','代回原题检验'],
    science:['提出可检验问题','区分变量并设计对照','记录现象和数据','用证据解释结论','说明误差与改进'],
    physics:['画受力图或过程图','确定研究对象','选择物理规律','统一单位并计算','检查方向、数量级与条件'],
    chemistry:['识别物质与反应条件','写出符号或方程式','守恒配平','联系宏观现象与微观粒子','检查条件、状态和单位'],
    biology:['明确结构层级','描述过程顺序','建立结构与功能联系','结合证据解释适应性','比较正常与异常情况'],
    history:['确定时间、地点和主体','区分史实与观点','分析背景、过程、结果','比较不同史料','形成有证据的评价'],
    geography:['定位区域与尺度','读图提取信息','分析自然与人文条件','解释空间差异','提出可持续方案'],
    computing:['拆解输入、处理、输出','设计数据结构和算法','手动追踪样例','处理边界与异常','测试复杂度和可维护性'],
    finance:['明确目标与约束','列出现金流与风险','比较机会成本','计算并验证方案','评估最坏情况'],
    logic:['识别前提与结论','形式化论证结构','检查必要与充分','寻找反例','判断结论强度']
  };

  const genericCases = {
    math: {
      geometry:{title:'组合图形面积',material:['一个长方形长12厘米、宽8厘米，右上角挖去一个边长3厘米的正方形。求剩余图形面积和周长。'],explain:['面积可用“大图形减小图形”：12×8−3×3=87平方厘米。','周长不能用原长方形周长直接减去两条3厘米边，因为挖去后同时增加两条新的3厘米边，周长仍为40厘米。'],exam:['面积与周长使用不同思路。','组合图形优先分割、补形或作差。','长度单位与面积单位不能混用。']},
      function:{title:'一次函数与变化率',material:['出租车起步价12元，包含3千米；超过3千米后每千米2.4元。设路程为x千米，总费用为y元。'],explain:['当0≤x≤3时，y=12。','当x>3时，y=12+2.4(x−3)。','斜率2.4表示每多行1千米，费用增加2.4元；分段点x=3必须单独检查。'],exam:['先确定自变量范围。','分段函数每一段都有适用条件。','解释斜率要带实际单位。']},
      probability:{title:'不放回抽样概率',material:['袋中有3个红球、2个蓝球，随机连续取2个球且不放回。求两球同色的概率。'],explain:['总的无序取法有C(5,2)=10种。','两红有C(3,2)=3种，两蓝有C(2,2)=1种。','同色概率=(3+1)/10=2/5。'],exam:['先判断是否放回。','排列与组合取决于顺序是否重要。','答案可用树状图交叉检验。']},
      algebra:{title:'方程建模',material:['一件商品先提价20%，再降价20%，现价为96元。求原价。'],explain:['设原价为x元。提价后为1.2x，再降价20%得到1.2x×0.8=0.96x。','0.96x=96，所以x=100。','提价20%再降价20%并不回到原价，因为两次百分比对应的基数不同。'],exam:['百分比变化要写成乘法因子。','连续变化必须逐次相乘。','计算后用原价100检验：120再降24得96。']}
    }
  };

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function currentSubject() {
    return document.body.dataset.subject || new URLSearchParams(location.search).get('subject') || document.querySelector('#subject-select')?.value || 'chinese';
  }

  function currentStage() {
    return new URLSearchParams(location.search).get('stage') || document.body.dataset.stage || document.querySelector('#subject-stage')?.value || localStorage.getItem('wind-stage-v4') || 'primary';
  }

  function notify(message) {
    const toast = document.querySelector('#toast');
    if (!toast) {
      window.alert(message);
      return;
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('show'), 3600);
  }

  let cachedVoices = [];
  function refreshVoices() {
    if (!('speechSynthesis' in window)) return [];
    cachedVoices = window.speechSynthesis.getVoices();
    return cachedVoices;
  }
  if ('speechSynthesis' in window) {
    refreshVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
  }

  function selectVoice(subject) {
    const profile = voiceProfiles[subject];
    if (!profile) return null;
    const voices = refreshVoices();
    const normal = value => String(value || '').toLowerCase();
    const langMatch = voice => profile.langs.some(lang => {
      const a = normal(voice.lang);
      const b = normal(lang);
      return a === b || a.startsWith(`${b}-`) || b.startsWith(`${a}-`);
    });
    const nameMatch = voice => profile.names.some(name => normal(voice.name).includes(normal(name)));
    if (subject === 'cantonese') {
      return voices.find(v => normal(v.lang).startsWith('yue') && nameMatch(v))
        || voices.find(v => normal(v.lang).startsWith('yue'))
        || voices.find(v => normal(v.lang) === 'zh-hk' && nameMatch(v))
        || voices.find(v => normal(v.lang) === 'zh-hk')
        || voices.find(v => nameMatch(v) && !normal(v.lang).startsWith('zh-cn'))
        || null;
    }
    return voices.find(v => langMatch(v) && nameMatch(v))
      || voices.find(langMatch)
      || voices.find(nameMatch)
      || null;
  }

  async function speak(text, subject) {
    if (!('speechSynthesis' in window)) {
      notify('当前浏览器不支持语音朗读。');
      return;
    }
    let voice = selectVoice(subject);
    if (!voice) {
      await new Promise(resolve => setTimeout(resolve, 700));
      voice = selectVoice(subject);
    }
    const profile = voiceProfiles[subject];
    if (!voice || !profile) {
      notify(`当前设备未安装${profile?.label || '对应语言'}语音，已停止播放，不会改用普通话。请在系统语音设置中安装对应语言语音包。`);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.voice = voice;
    utterance.lang = voice.lang || profile.langs[0];
    utterance.rate = subject === 'cantonese' || subject === 'japanese' || subject === 'korean' ? 0.82 : 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function poemLessons(topic) {
    return poems[topic.title] || null;
  }

  function chooseMathCase(topic) {
    const key = `${topic.title} ${(topic.concepts || []).join(' ')}`;
    if (/图形|几何|面积|周长|空间/.test(key)) return genericCases.math.geometry;
    if (/函数|变化率|图像/.test(key)) return genericCases.math.function;
    if (/概率|统计|数据|随机/.test(key)) return genericCases.math.probability;
    return genericCases.math.algebra;
  }

  function buildChineseLesson(stage, topic) {
    const reading = originalTexts.chineseReading;
    return {
      kind:'text',
      title:topic.title,
      subtitle:stageNames[stage],
      objective:`完整学习“${topic.title}”：先读全文，再梳理结构、理解关键语句，最后完成迁移表达。`,
      sourceTitle:reading.title,
      source:reading.text,
      sourceMeta:'本站原创阅读材料',
      overview:'这篇短文以一株小苗的生长为线索，写“发现—照料—调整—领悟”的过程。学习重点不是摘取一句话，而是理解细节怎样推动事件、结尾怎样从事件中提炼道理。',
      sections:[
        ['结构梳理','第一段发现小苗；第二段通过浇水过多学会观察；第三段发现向光性并调整花盆；第四段总结“照料要基于真实需要”。'],
        ['关键细节','“先摸一摸土，干了再浇”表现主人公从盲目行动转向观察判断；“又悄悄朝阳光的方向生长”具体说明植物向光。'],
        ['作者思路','从一个日常发现切入，用两次“问题—观察—调整”形成推进，最后由具体养苗经验上升为普遍道理。'],
        ['表达方法','按时间顺序叙事；用比喻“像一根绿色的线”写外形；用动作细节说明变化；结尾议论点明主题。']
      ],
      famous:[['照料植物不是“做得越多越好”，而是要观察它真正需要什么。','中心句，概括全文道理。']],
      exam:['概括题要写清对象、过程和结果。','作用题同时回答内容、结构和主题。','品味句子要结合具体词语，不只写“生动形象”。','中心句与前文两次调整相互照应。'],
      errors:['把全文概括为“小苗长大了”，遗漏主人公的观察与调整。','只抄结尾，不说明道理如何由前文得出。'],
      questions:[
        ['主人公为什么改变浇水方法？','因为发现水太多会使泥土黏湿，于是先判断土是否干燥再浇水。'],
        ['第三段写小苗向亮处弯有什么作用？','说明植物有向光性，也推动主人公再次观察和调整。'],
        ['结尾道理如何从前文得出？','两次照料都不是越多越好，而是先观察需要，再采取合适行动。']
      ],
      task:'以“我学会了先观察”为中心，写一段150字左右的经历，必须包含一次错误尝试、一次调整和一个具体细节。'
    };
  }

  function buildMathLesson(stage, topic) {
    const item = chooseMathCase(topic);
    return {
      kind:'case',
      title:topic.title,
      subtitle:stageNames[stage],
      objective:`完整掌握“${topic.title}”中的核心关系：理解概念、看懂推导、完成典型例题并能解释为什么。`,
      sourceTitle:item.title,
      source:item.material,
      sourceMeta:'完整例题',
      overview:'数学学习不能只记结论。应先确定对象和条件，再建立关系；每一步都要说明依据，并通过代入、估算、图形或逆运算检查。',
      sections:[
        ['概念与条件',`本课涉及：${(topic.concepts || []).join('、')}。每个公式都必须写明适用条件，不能脱离题意套用。`],
        ['完整推导',item.explain.join(' ')],
        ['解题思路',subjectMethods.math.join(' → ')],
        ['多方法验证','完成代数计算后，再用图示、估算、特殊值或逆运算检查；两种方法一致时，结论更可靠。']
      ],
      famous:[],
      exam:item.exam,
      errors:['看到数字就立即计算，没有先建立关系。','列式正确但漏写单位或答语。','只保留答案，无法判断中间逻辑是否可靠。'],
      questions:[
        ['解题第一步应做什么？','明确已知条件、未知量和问题要求，再决定是否画图或设未知量。'],
        ['为什么必须检验？','检验能发现运算错误、条件遗漏和不符合实际的答案。'],
        ['怎样把本题迁移到新情境？','保留数量关系，替换数据或背景，再重新判断条件是否变化。']
      ],
      task:`把“${item.title}”改编成一道新题，改变至少两个数据，完整写出建模、计算和检验过程。`
    };
  }

  function buildEnglishLesson(stage, topic) {
    const reading = originalTexts.englishPhonics;
    return {
      kind:'language',
      language:'english',
      title:topic.title,
      subtitle:stageNames[stage],
      objective:`通过完整短文学习“${topic.title}”：先听读全文，再分析语音、词汇、句型和篇章，最后独立复述与写作。`,
      sourceTitle:reading.title,
      source:reading.text,
      sourceMeta:'Decodable passage',
      readings:reading.text,
      overview:'The passage repeatedly uses long-vowel patterns. Learners first listen for the target sounds, then mark the spelling patterns, read in phrases, answer meaning questions, and finally retell the whole event.',
      sections:[
        ['Pronunciation','Jake, Kate, lake, take, cake and gate share the a_e pattern. Kite uses i_e. The final e is silent but changes the vowel sound.'],
        ['Vocabulary in context','ride bikes = travel by bicycle; keep it safe = prevent it from being lost or damaged; share the cake = eat it together.'],
        ['Sentence structure','“A strong wind makes the kite shake” uses make + object + base verb. “At the end of the day” is a time phrase that organises the final event.'],
        ['Text structure','Sentence 1 gives place and movement; sentence 2 introduces objects; sentence 3 presents a problem and response; sentence 4 closes the event.']
      ],
      famous:[['A strong wind makes the kite shake, but Jake keeps it safe.','Use but to connect a problem with a contrasting response.']],
      exam:['Distinguish letter names from letter sounds.','Read a_e as a long vowel in regular words, but check irregular high-frequency words separately.','Answer comprehension questions with evidence from the passage.','In writing, keep the sequence clear with time phrases.'],
      errors:['Reading every final e aloud.','Focusing only on phonics and ignoring sentence meaning.','Retelling isolated words instead of complete events.'],
      questions:[
        ['Where do Jake and Kate go?','They ride their bikes to the lake.'],
        ['What problem happens?','A strong wind makes the kite shake.'],
        ['How does the story end?','They sit by the gate and share the cake.']
      ],
      task:'Read the whole passage aloud, retell it in four sentences, then write a new version by changing the place, object and problem.'
    };
  }

  function buildCantoneseLesson(stage, topic) {
    const data = originalTexts.cantoneseDialogue;
    return {
      kind:'language',
      language:'cantonese',
      title:topic.title,
      subtitle:stageNames[stage],
      objective:`用粤语完成真实日常任务：先听完整对话，再学习粤拼、声调、词汇、句式和语用，最后脱离文本完成角色扮演。`,
      sourceTitle:data.title,
      source:data.text,
      sourceMeta:'完整生活对话',
      readings:data.reading,
      overview:'本课不是背零散词语，而是完成一次完整点餐。学习者先听懂人物、物品、数量和选择，再逐句跟读，最后替换饮品、数量、甜度和价格。',
      sections:[
        ['发音与声调','粤拼声调数字必须保留。唔该 m4 goi1、冻 dung3、奶 naai5、茶 caa4 分别包含4、1、3、5、4调。先慢速跟读音节，再按短语连读。'],
        ['逐句语义','第一句提出请求；第二句提供甜度选择；第三句确认选择并询价；第四句报总价并致谢；第五句结束互动。'],
        ['语法结构','“想要＋数量＋量词＋名词”表达需求；“A定B”表示二选一；“几多钱”询问价格；“一共”要求合计。'],
        ['语用区别','“唔该”常用于请求、接受服务和轻度感谢；“多谢”更常用于感谢礼物、恩惠或较郑重的帮助。不能把两个词机械互换。']
      ],
      famous:[['唔该，我想要一个菠萝包同一杯冻奶茶。','完整请求句：礼貌语＋意愿＋数量量词＋物品。'],['少甜，唔该。请问一共几多钱？','确认选择后继续询价，符合真实交际顺序。']],
      exam:['粤拼的声调数字是读音组成部分。','-p、-t、-k 收尾时要短促收音，不增加元音。','量词要和名词搭配：一个菠萝包、一杯奶茶。','听力题先抓数量、选择和总价。'],
      errors:['用普通话声调朗读粤拼。','把“唔该”和“多谢”全部翻译成同一种“谢谢”。','漏读声调数字对应的音高。','逐字翻译而忽略粤语固定表达。'],
      questions:[
        ['顾客点了什么？','一个菠萝包和一杯少甜冻奶茶。'],
        ['店员为什么问“少甜定正常甜”？','让顾客在两种甜度之间选择。'],
        ['“唔该晒”在这里有什么作用？','在服务完成后表示感谢并结束对话。']
      ],
      task:'两人完成60秒角色扮演：点两样食物和一杯饮品，必须包含数量、量词、二选一、询价、确认和道谢。'
    };
  }

  function buildJapaneseLesson(stage, topic) {
    const data = originalTexts.japaneseDialogue;
    return {
      kind:'language', language:'japanese', title:topic.title, subtitle:stageNames[stage],
      objective:`通过完整购物对话学习“${topic.title}”：听懂、跟读、拆解句型，再替换商品、数量和价格完成新对话。`,
      sourceTitle:data.title, source:data.text, sourceMeta:'完整情境会话', readings:data.reading,
      overview:'会话从迎客、提出购买、确认加热、追加商品到结账，形成完整交际链。学习时要同时关注假名、音拍、助词和量词。',
      sections:[
        ['发音与节奏','日语按音拍保持较均匀节奏。“おにぎり”有四拍，“ください”有四拍。长音、促音和拨音都各占一拍。'],
        ['逐句作用','いらっしゃいませ用于迎客；〜を二つください提出购买；温めますか确认服务；それから追加信息；全部で〜円です报总价。'],
        ['语法','を标记动作对象；も表示“也”；二つ是通用数量词，一本用于细长物；〜てください是礼貌请求。'],
        ['语用','店员与顾客使用礼貌体。不能只替换词汇，还要保持敬体结尾和适当停顿。']
      ],
      famous:[['このおにぎりを二つください。','指示词＋名词＋を＋数量＋ください。'],['それから、水も一本ください。','用それから追加信息，用も表达“也”。']],
      exam:['区分は、が、を、に的功能。','数量词位置可在名词后或动词前，但搭配要正确。','长音、促音漏读会改变词义或造成不自然。'],
      errors:['把每个假名读成重音很强的独立音节。','忽略助词は读作 wa、へ读作 e。','数量词与物品类别不匹配。'],
      questions:[['客人买了什么？','两个饭团和一瓶水。'],['店员问了什么服务？','是否需要加热。'],['“も”表达什么？','表示“也”，追加另一项商品。']],
      task:'设计一段便利店对话，购买三样物品，包含数量词、追加信息、一次服务确认和总价。'
    };
  }

  function buildKoreanLesson(stage, topic) {
    const data = originalTexts.koreanDialogue;
    return {
      kind:'language', language:'korean', title:topic.title, subtitle:stageNames[stage],
      objective:`通过完整咖啡店对话学习“${topic.title}”：掌握韩文音节、收音、数量表达和礼貌请求，并完成独立点餐。`,
      sourceTitle:data.title, source:data.text, sourceMeta:'完整情境会话', readings:data.reading,
      overview:'对话依次完成迎客、点单、确认冷热、确认选择和结账。学习者应把每句视为交际功能，而不是只背单词。',
      sections:[
        ['音节与收音','韩文音节写成方块。한 的收音 ㄴ 会影响后接音；잔、샌、원 等都要完整收音，不把末辅音拖成长音。'],
        ['逐句作用','무엇을 드릴까요? 提供服务；한 잔하고…하나 주세요提出数量；〜으로 드릴까요确认选择；모두…원입니다报总价。'],
        ['语法','하고连接名词；을/를标记宾语；은/는标记话题；주세요是礼貌请求；〜으로表示选择、方向或方式。'],
        ['语用','服务场景使用敬语。回答“네”后应补充明确选择，避免只说一个孤立形容词。']
      ],
      famous:[['아메리카노 한 잔하고 샌드위치 하나 주세요.','名词＋数量单位＋하고＋名词＋数量＋주세요。'],['커피는 따뜻한 것으로 드릴까요?','以话题标记后提出选择确认。']],
      exam:['有无收音会影响助词和部分读音。','固有数词与汉字数词使用场景不同。','连音时书写不变，但实际发音会跨音节连接。'],
      errors:['只看罗马字，不认韩文字母。','把收音后的辅音额外加元音。','忽略敬语层级。'],
      questions:[['客人点了什么？','一杯美式咖啡和一个三明治。'],['咖啡选择了什么温度？','热的。'],['하고有什么作用？','连接两个名词，相当于“和”。']],
      task:'完成一段咖啡店角色扮演，点两杯不同饮品和一份食物，并包含冷热、大小或甜度选择。'
    };
  }

  function buildScienceLesson(subject, stage, topic) {
    const names = {
      science:'种子萌发条件实验',
      physics:'小车运动与受力',
      chemistry:'质量守恒与化学反应',
      biology:'光照对植物生长的影响',
      history:'工业革命的条件与影响',
      geography:'河流流域开发与生态保护',
      computing:'校园图书借阅程序',
      finance:'三个月零用钱预算',
      logic:'学校是否应延长图书馆开放时间'
    };
    const material = {
      science:['准备相同种子三组：A组适量水和空气，B组无水，C组浸没在水中；保持温度相同，连续记录五天。'],
      physics:['质量相同的小车在光滑程度不同的轨道上运动，记录相同初速度下的停止距离，并分析摩擦力影响。'],
      chemistry:['密闭容器中让碳酸钠与盐酸反应，反应前后分别称量，观察气泡但总质量保持不变。'],
      biology:['选择长势相近的幼苗，设置正常光照和弱光两组，控制水、温度、土壤相同，测量两周内高度和叶色。'],
      history:['比较18世纪英国煤铁资源、殖民市场、资本积累、技术发明和制度环境等材料，判断哪些是条件、哪些是结果。'],
      geography:['某流域上游森林减少、中游城市扩张、下游洪涝频发。结合地形、降水、土地利用和人口图提出治理方案。'],
      computing:['设计图书借阅程序：输入学生编号与图书编号，检查库存和借阅上限，更新记录并输出结果。'],
      finance:['每月零用钱600元，固定交通120元、学习用品80元，希望三个月存下600元，同时保留应急金。'],
      logic:['论点：学校应延长图书馆开放时间。材料包括使用人数、运营成本、学生需求调查和安全安排。']
    };
    const methods = subjectMethods[subject] || subjectMethods.science;
    return {
      kind:'case', title:topic.title, subtitle:stageNames[stage],
      objective:`围绕一个完整案例学习“${topic.title}”，从材料、证据和方法出发形成可检验、可解释的结论。`,
      sourceTitle:names[subject] || topic.title, source:material[subject] || material.science, sourceMeta:'完整案例',
      overview:'本课以一个完整问题为主线。学习者需要先读完材料，明确研究对象和限制，再按学科方法处理证据，最后评价结论是否充分。',
      sections:[
        ['核心概念',`本课涉及${(topic.concepts || []).join('、')}。概念要通过案例中的对象、变量、时间和空间关系来理解。`],
        ['完整方法',methods.join(' → ')],
        ['证据解释','结论必须对应观察、数据、史料、图表或程序测试。不能把个人印象写成确定结论，也不能忽略不支持观点的证据。'],
        ['迁移应用','改变一个条件，预测结果如何变化，并说明其他条件是否仍需控制。']
      ],
      famous:[],
      exam:['先区分题目要求描述、解释、比较还是评价。','每个结论至少引用一项具体证据。','因果判断必须排除重要替代解释。','方案题同时考虑效果、成本、风险和可执行性。'],
      errors:['只复述材料，没有形成解释。','写出结论但不引用证据。','把同时发生误判为因果关系。'],
      questions:[
        ['本案例最关键的研究对象是什么？',names[subject] || topic.title],
        ['怎样提高结论可靠性？','控制无关变量、增加样本或重复次数，并记录完整数据。'],
        ['如果结果与预期不一致怎么办？','检查方法、测量和条件，保留异常数据并提出新的解释。']
      ],
      task:'把本案例改为一个新情境，写出问题、证据来源、分析步骤、预期结论和至少一个局限。'
    };
  }

  function buildLesson(subject, stage, topic) {
    if (subject === 'chinese') return buildChineseLesson(stage, topic);
    if (subject === 'math') return buildMathLesson(stage, topic);
    if (subject === 'english') return buildEnglishLesson(stage, topic);
    if (subject === 'cantonese') return buildCantoneseLesson(stage, topic);
    if (subject === 'japanese') return buildJapaneseLesson(stage, topic);
    if (subject === 'korean') return buildKoreanLesson(stage, topic);
    return buildScienceLesson(subject, stage, topic);
  }

  function expandedTopics(subject, stage) {
    const topics = catalog.subjects[subject]?.stages?.[stage] || [];
    const result = [];
    topics.forEach(topic => {
      const special = subject === 'chinese' ? poemLessons(topic) : null;
      if (special) {
        special.forEach(item => result.push({...item, catalogTopic:topic, id:`${topic.title}|${item.title}`}));
      } else {
        result.push({...topic, id:topic.title, catalogTopic:topic});
      }
    });
    return result;
  }

  function completedState() {
    try {
      const data = JSON.parse(localStorage.getItem(completedKey) || '{}');
      return data && typeof data === 'object' ? data : {};
    } catch {
      return {};
    }
  }

  function setCompleted(subject, stage, id, done) {
    const data = completedState();
    const key = `${subject}|${stage}`;
    const set = new Set(data[key] || []);
    if (done) set.add(id); else set.delete(id);
    data[key] = [...set];
    localStorage.setItem(completedKey, JSON.stringify(data));
  }

  function sourceHtml(lesson, subject) {
    if (lesson.kind === 'poem') {
      return `<section class="deep-panel">
        <div class="work-meta"><span>${esc(lesson.dynasty)}</span><strong>${esc(lesson.author)}</strong><button class="audio-main" type="button" data-speak="${esc(lesson.text.join(''))}" data-language="chinese">▶ 朗读全文</button></div>
        <div class="poem-sheet"><h3>${esc(lesson.title)}</h3>${lesson.text.map(line => `<p>${esc(line)}<button type="button" class="line-audio" data-speak="${esc(line)}" data-language="chinese">▶</button></p>`).join('')}</div>
        <article class="background-card"><b>作者与背景</b><p>${esc(lesson.background)}</p></article>
      </section>`;
    }
    const lines = lesson.source || [];
    const readings = lesson.readings || [];
    return `<section class="deep-panel">
      <div class="source-head"><div><span>${esc(lesson.sourceMeta)}</span><h3>${esc(lesson.sourceTitle)}</h3></div>${languageSubjects.has(subject) ? `<button class="audio-main" type="button" data-speak="${esc(lines.join(' '))}" data-language="${esc(lesson.language || subject)}">▶ 播放全文</button>` : ''}</div>
      <div class="full-source">${lines.map((line,index) => `<article><b>${String(index+1).padStart(2,'0')}</b><div><p>${esc(line)}</p>${readings[index] ? `<code>${esc(readings[index])}</code>` : ''}</div>${languageSubjects.has(subject) ? `<button type="button" class="line-audio" data-speak="${esc(line)}" data-language="${esc(lesson.language || subject)}">▶</button>` : ''}</article>`).join('')}</div>
      <article class="background-card"><b>整体导读</b><p>${esc(lesson.overview)}</p></article>
    </section>`;
  }

  function explainHtml(lesson) {
    if (lesson.kind === 'poem') {
      return `<section class="deep-panel"><div class="line-notes">${lesson.notes.map(([line,meaning,analysis],index) => `<article><span>${index+1}</span><div><h3>${esc(line)}</h3><p>${esc(meaning)}</p><small>${esc(analysis)}</small></div></article>`).join('')}</div><div class="theme-card"><b>整体主旨</b><p>${esc(lesson.theme)}</p></div></section>`;
    }
    return `<section class="deep-panel"><div class="analysis-grid">${lesson.sections.map(([title,text]) => `<article><b>${esc(title)}</b><p>${esc(text)}</p></article>`).join('')}</div></section>`;
  }

  function thinkingHtml(lesson) {
    if (lesson.kind === 'poem') {
      return `<section class="deep-panel"><div class="thinking-flow">${lesson.thought.map((item,index) => `<article><b>${index+1}</b><span>${esc(item)}</span></article>`).join('')}</div><div class="technique-grid">${lesson.techniques.map(([name,text]) => `<article><b>${esc(name)}</b><p>${esc(text)}</p></article>`).join('')}</div></section>`;
    }
    return `<section class="deep-panel"><div class="thinking-flow">${(subjectMethods[lesson.language] || ['完整阅读材料','识别核心结构','逐步分析依据','连接前后关系','独立迁移输出']).map((item,index) => `<article><b>${index+1}</b><span>${esc(item)}</span></article>`).join('')}</div><article class="background-card"><b>学习任务</b><p>${esc(lesson.task)}</p></article></section>`;
  }

  function examHtml(lesson) {
    return `<section class="deep-panel">
      ${lesson.famous?.length ? `<div class="famous-list"><h3>名句／核心表达</h3>${lesson.famous.map(([line,text]) => `<article><strong>${esc(line)}</strong><p>${esc(text)}</p></article>`).join('')}</div>` : ''}
      <div class="exam-grid"><article><h3>高频考点</h3><ul>${lesson.exam.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article><article><h3>常见易错</h3><ul>${lesson.errors.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article></div>
    </section>`;
  }

  function practiceHtml(lesson, subject, stage, id) {
    const task = lesson.task || `熟读并背诵${lesson.title}，用自己的话概括主旨，再完成一题炼字或表现手法分析。`;
    return `<section class="deep-panel">
      <div class="deep-questions">${lesson.questions.map(([q,a],index) => `<article><span>题 ${index+1}</span><h3>${esc(q)}</h3><button type="button" class="answer-toggle">查看答案</button><p hidden>${esc(a)}</p></article>`).join('')}</div>
      <article class="transfer-task"><span>完整输出</span><h3>${esc(task)}</h3></article>
      <a class="deep-practice-link" href="practice.html?subject=${esc(subject)}&stage=${esc(stage)}&autostart=1">进入随机题库巩固</a>
    </section>`;
  }

  function resourceHtml(subject) {
    const links = [...(resources[subject] || []), ...(resources.general || [])];
    return `<section class="deep-panel"><div class="resource-grid-v6">${links.map(([name,url]) => `<a href="${esc(url)}" target="_blank" rel="noopener"><strong>${esc(name)}</strong><span>打开公开资源 ↗</span></a>`).join('')}</div></section>`;
  }

  function addStyles() {
    if (document.querySelector(`link[data-deep-v6="${version}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `assets/learning-v6.css?v=${version}`;
    link.dataset.deepV6 = version;
    document.head.append(link);
  }

  function mount() {
    const subject = currentSubject();
    const original = document.querySelector('#topic-grid');
    if (!original || !catalog.subjects[subject] || document.querySelector('#deep-course-v6')) return false;
    addStyles();
    original.hidden = true;
    document.querySelector('#cycle-tabs')?.setAttribute('hidden','');

    const root = document.createElement('section');
    root.id = 'deep-course-v6';
    original.before(root);

    let activeIndex = 0;
    let activeTab = 'source';

    const render = () => {
      const stage = currentStage();
      const topics = expandedTopics(subject, stage);
      if (!topics.length) {
        root.innerHTML = '<div class="deep-empty">该阶段课程正在整理。</div>';
        return;
      }
      if (activeIndex >= topics.length) activeIndex = 0;
      const item = topics[activeIndex];
      const topic = item.catalogTopic || item;
      const lesson = item.kind === 'poem' ? item : buildLesson(subject, stage, topic);
      const state = completedState();
      const done = new Set(state[`${subject}|${stage}`] || []);
      const isDone = done.has(item.id);
      const progress = Math.round(done.size / topics.length * 100);
      const panels = {
        source:sourceHtml(lesson, subject),
        explain:explainHtml(lesson),
        thinking:thinkingHtml(lesson),
        exam:examHtml(lesson),
        practice:practiceHtml(lesson, subject, stage, item.id),
        resources:resourceHtml(subject)
      };

      root.innerHTML = `<aside class="deep-outline">
        <div class="outline-head"><span>${esc(stageNames[stage])}</span><strong>完整课程</strong><div><i style="width:${progress}%"></i></div><small>${done.size}/${topics.length}</small></div>
        <nav>${topics.map((entry,index) => `<button type="button" data-course-index="${index}" class="${index===activeIndex?'active':''} ${done.has(entry.id)?'done':''}"><b>${String(index+1).padStart(2,'0')}</b><span>${esc(entry.title)}</span></button>`).join('')}</nav>
      </aside>
      <article class="deep-course">
        <header class="deep-header"><div><span>${esc(catalog.subjects[subject].name)} · ${esc(stageNames[stage])}</span><h2>${esc(lesson.title)}</h2><p>${esc(lesson.objective || lesson.background || '')}</p></div><button id="deep-complete" type="button" class="${isDone?'done':''}">${isDone?'已完成':'完成本课'}</button></header>
        <div class="deep-tabs">${[
          ['source',lesson.kind==='poem'?'完整原文':'完整材料'],
          ['explain','逐层讲解'],
          ['thinking',lesson.kind==='poem'?'作者思路':'方法思路'],
          ['exam',lesson.kind==='poem'?'名句考点':'考点易错'],
          ['practice','分层练习'],
          ['resources','资源']
        ].map(([key,label]) => `<button type="button" data-deep-tab="${key}" class="${activeTab===key?'active':''}">${label}</button>`).join('')}</div>
        <div class="deep-content">${panels[activeTab]}</div>
        <footer class="deep-footer"><button id="deep-prev" type="button" ${activeIndex===0?'disabled':''}>上一课</button><span>${activeIndex+1} / ${topics.length}</span><button id="deep-next" type="button" ${activeIndex===topics.length-1?'disabled':''}>下一课</button></footer>
      </article>`;

      root.querySelectorAll('[data-course-index]').forEach(button => button.addEventListener('click', () => {
        activeIndex = Number(button.dataset.courseIndex);
        activeTab = 'source';
        render();
      }));
      root.querySelectorAll('[data-deep-tab]').forEach(button => button.addEventListener('click', () => {
        activeTab = button.dataset.deepTab;
        render();
      }));
      root.querySelectorAll('[data-speak]').forEach(button => button.addEventListener('click', () => speak(button.dataset.speak, button.dataset.language || subject)));
      root.querySelectorAll('.answer-toggle').forEach(button => button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        answer.hidden = !answer.hidden;
        button.textContent = answer.hidden ? '查看答案' : '收起答案';
      }));
      root.querySelector('#deep-complete')?.addEventListener('click', () => {
        setCompleted(subject, stage, item.id, !isDone);
        render();
      });
      root.querySelector('#deep-prev')?.addEventListener('click', () => {
        if (activeIndex > 0) {
          activeIndex -= 1;
          activeTab = 'source';
          render();
        }
      });
      root.querySelector('#deep-next')?.addEventListener('click', () => {
        if (activeIndex < topics.length - 1) {
          activeIndex += 1;
          activeTab = 'source';
          render();
        }
      });
    };

    document.querySelector('#subject-stage')?.addEventListener('change', () => {
      activeIndex = 0;
      activeTab = 'source';
      setTimeout(render, 0);
    });
    render();
    return true;
  }

  const start = () => {
    if (mount()) return;
    const observer = new MutationObserver(() => {
      if (mount()) observer.disconnect();
    });
    observer.observe(document.body, {childList:true, subtree:true});
    setTimeout(() => observer.disconnect(), 15000);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();