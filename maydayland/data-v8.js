window.MAYDAYLAND_ARCHIVE = (() => {
  const sources = {
    liveHistory: 'https://www.mayday.jp/biography/',
    discography: 'https://www.mayday.jp/discography/',
    live: 'https://www.mayday.jp/live/',
    blue: 'https://www.mayday.jp/blue/tw/',
    redna: 'https://www.mayday.jp/redna2017/tw/',
    life: 'https://www.mayday.jp/life2018/tw/',
    justRockIt: 'https://www.mayday.jp/justrockit/',
    bin5525: 'https://www.bin-music.com.tw/news/1985',
    binTaipei: 'https://www.bin-music.com.tw/news/2121',
    binTaichung: 'https://bin-music.com/news/2326'
  };

  const C = {
    taipei:[25.0375,121.5637], taichung:[24.1477,120.6736], tainan:[22.9999,120.2270], kaohsiung:[22.6273,120.3014],
    hongkong:[22.3193,114.1694], shanghai:[31.2304,121.4737], beijing:[39.9042,116.4074], chengdu:[30.5728,104.0668],
    xiamen:[24.4798,118.0894], guangzhou:[23.1291,113.2644], changsha:[28.2282,112.9388], tianjin:[39.3434,117.3616],
    harbin:[45.8038,126.5349], hangzhou:[30.2741,120.1551], nanjing:[32.0603,118.7969], foshan:[23.0215,113.1214],
    chongqing:[29.4316,106.9123], zhengzhou:[34.7466,113.6254], wuhan:[30.5928,114.3055], xian:[34.3416,108.9398],
    shenzhen:[22.5431,114.0579], quanzhou:[24.8741,118.6757], taiyuan:[37.8706,112.5489], guiyang:[26.6470,106.6302],
    singapore:[1.3521,103.8198], kualalumpur:[3.1390,101.6869], tokyo:[35.6762,139.6503], osaka:[34.6937,135.5023],
    losangeles:[34.0522,-118.2437], sanjose:[37.3382,-121.8863], toronto:[43.6532,-79.3832], vancouver:[49.2827,-123.1207],
    connecticut:[41.6032,-73.0877], auckland:[-36.8509,174.7645], brisbane:[-27.4698,153.0251], melbourne:[-37.8136,144.9631],
    sydney:[-33.8688,151.2093], london:[51.5072,-0.1276], paris:[48.8566,2.3522],
    lasvegas:[36.1699,-115.1398], newyork:[40.7128,-74.0060], chicago:[41.8781,-87.6298]
  };
  const stop = (city, key, extra={}) => ({city, lat:C[key][0], lng:C[key][1], ...extra});

  const tours = [
    {
      id:'168', name:'第168场演唱会', english:'Number 168th Concert', years:'1999', color:'#40c8ff',
      summary:'五月天首场大型演唱会，官方档案记载于台北市立体育场举行，动员约两万人。',
      source:sources.liveHistory, image:'https://www.mayday.jp/img/biography-oversea-1.jpg',
      stops:[stop('台北','taipei',{date:'1999',venue:'台北市立体育场'})]
    },
    {
      id:'standout', name:'十万青年站出来', english:'Stand Out 100,000 Youths', years:'2000', color:'#78e08f',
      summary:'北、中、南三地巡演，官方档案列出台北、彰化、高雄，总动员十万人。',
      source:sources.liveHistory, image:'https://www.mayday.jp/img/biography-oversea-2.jpg',
      stops:[stop('台北','taipei'),{city:'彰化',lat:24.0518,lng:120.5161},stop('高雄','kaohsiung')]
    },
    {
      id:'where', name:'你要去哪里', english:'Where Are You Going?', years:'2001', color:'#ffc857',
      summary:'官方档案记载为五月天首次售票演唱会；地图只标示已核实的台北主要场次，不补写未核实城市。',
      source:sources.liveHistory, image:'https://www.mayday.jp/img/biography-oversea-3.jpg',
      stops:[stop('台北','taipei',{date:'2001'})]
    },
    {
      id:'sky', name:'天空之城复出演唱会', english:'City of the Sky', years:'2003', color:'#8e9cff',
      summary:'五月天复出大型演唱会，官方档案记载于台北举行，动员约四万人。',
      source:sources.liveHistory, image:'https://www.mayday.jp/img/biography-oversea-4.jpg',
      stops:[stop('台北','taipei',{date:'2003'})]
    },
    {
      id:'finalhome', name:'Final Home 当我们混在一起', english:'Final Home World Tour', years:'2004–2005', color:'#ff7b72',
      summary:'五月天首轮世界巡演。下列城市依官方日本站 Live History 的列示顺序绘制；官方页注明全程共14场，列示城市并非逐场日期表。',
      source:sources.liveHistory, image:'https://www.mayday.jp/img/biography-oversea-5.jpg',
      stops:[stop('台南','tainan'),stop('台中','taichung'),stop('台北','taipei'),stop('洛杉矶','losangeles'),stop('圣荷西','sanjose'),stop('上海','shanghai'),stop('北京','beijing'),stop('新加坡','singapore'),stop('成都','chengdu'),stop('吉隆坡','kualalumpur'),stop('大阪','osaka'),stop('香港','hongkong')]
    },
    {
      id:'jump', name:'JUMP！离开地球表面', english:'JUMP World Tour', years:'2007', color:'#f78fb3',
      summary:'官方档案列出15个主要巡演城市、共20场与约40万人次；路线依官方城市列示顺序呈现。',
      source:sources.liveHistory, image:'https://www.mayday.jp/img/biography-oversea-7.jpg',
      stops:[stop('台北','taipei'),stop('香港','hongkong'),stop('厦门','xiamen'),stop('新加坡','singapore'),stop('广州','guangzhou'),stop('北京','beijing'),stop('多伦多','toronto'),stop('洛杉矶','losangeles'),stop('温哥华','vancouver'),stop('长沙','changsha'),stop('东京','tokyo'),stop('成都','chengdu'),stop('上海','shanghai'),stop('天津','tianjin'),stop('吉隆坡','kualalumpur')]
    },
    {
      id:'back', name:'回到地球表面', english:'Back to the Surface of the Earth', years:'2008', color:'#38d9a9',
      summary:'官方档案记载台中、新加坡、上海、香港共4场。', source:sources.liveHistory,
      image:'https://www.mayday.jp/img/biography-oversea-8.jpg',
      stops:[stop('台中','taichung'),stop('新加坡','singapore'),stop('上海','shanghai'),stop('香港','hongkong')]
    },
    {
      id:'dna', name:'D.N.A. 创造', english:'D.N.A. World Tour', years:'2009–2010', color:'#ff9f43',
      summary:'官方档案记载2009主巡演44场、约60万人次；2010无限放大版再加入北美、纽澳与亚洲城市。地图合并两阶段，按官方列示顺序呈现。',
      source:sources.liveHistory, secondary:sources.redna, image:'https://www.mayday.jp/img/biography-oversea-8.jpg',
      stops:[stop('台中','taichung'),stop('香港','hongkong'),stop('墨尔本','melbourne'),stop('悉尼','sydney'),stop('上海','shanghai'),stop('北京','beijing'),stop('哈尔滨','harbin'),stop('杭州','hangzhou'),stop('新加坡','singapore'),stop('南京','nanjing'),stop('佛山','foshan'),stop('重庆','chongqing'),stop('东京','tokyo'),stop('广州','guangzhou'),stop('郑州','zhengzhou'),stop('长沙','changsha'),stop('康涅狄格州','connecticut',{phase:'2010 无限放大版'}),stop('洛杉矶','losangeles',{phase:'2010 无限放大版'}),stop('圣荷西','sanjose',{phase:'2010 无限放大版'}),stop('厦门','xiamen',{phase:'2010 无限放大版'}),stop('奥克兰','auckland',{phase:'2010 无限放大版'}),stop('布里斯班','brisbane',{phase:'2010 无限放大版'}),stop('墨尔本','melbourne',{phase:'2010 无限放大版'}),stop('悉尼','sydney',{phase:'2010 无限放大版'}),stop('武汉','wuhan',{phase:'2010 无限放大版'}),stop('吉隆坡','kualalumpur',{phase:'2010 无限放大版'}),stop('西安','xian',{phase:'2010 无限放大版'})]
    },
    {
      id:'nowhere', name:'诺亚方舟 NOWHERE', english:'NOWHERE World Tour', years:'2011–2014', color:'#5c7cfa',
      summary:'官方档案记载巡演涵盖台北、中国31座城市、香港、新加坡与马来西亚；日本官方单曲页另记载全巡演82场、约246万人次。此图先标出官方明确点名与具代表性的已核实城市。',
      source:sources.liveHistory, image:'https://www.mayday.jp/img/biography-oversea-9a.jpg',
      stops:[stop('台北','taipei'),stop('北京・鸟巢','beijing',{date:'2012-04',venue:'国家体育场（鸟巢）'}),stop('上海','shanghai'),stop('广州','guangzhou'),stop('香港','hongkong'),stop('新加坡','singapore'),stop('吉隆坡','kualalumpur'),stop('洛杉矶','losangeles'),stop('温哥华','vancouver'),stop('悉尼','sydney'),stop('墨尔本','melbourne')]
    },
    {
      id:'jri', name:'Just Rock It!', english:'Just Rock It! Asia / Special Shows', years:'2015–2016', color:'#22b8cf',
      summary:'2015首次日本武道馆2日；2016亚洲巡演官方档案记载29场、约110万人次。',
      source:sources.liveHistory, secondary:sources.justRockIt, image:'https://www.mayday.jp/blue/img/header-tw.jpg',
      stops:[stop('东京・日本武道馆','tokyo',{date:'2015-08-28—29',venue:'日本武道馆'}),stop('香港','hongkong',{phase:'2016 亚洲巡演'}),stop('台北','taipei',{phase:'2016 亚洲巡演'}),stop('新加坡','singapore',{phase:'2016 亚洲巡演'}),stop('高雄','kaohsiung',{phase:'2016 亚洲巡演'}),stop('北京','beijing',{phase:'2016 亚洲巡演'}),stop('西安','xian',{phase:'2016 亚洲巡演'}),stop('成都','chengdu',{phase:'2016 亚洲巡演'}),stop('武汉','wuhan',{phase:'2016 亚洲巡演'}),stop('深圳','shenzhen',{phase:'2016 亚洲巡演'}),stop('上海','shanghai',{phase:'2016 亚洲巡演'}),stop('吉隆坡','kualalumpur',{phase:'2016 亚洲巡演'}),stop('泉州','quanzhou',{phase:'2016 亚洲巡演'})]
    },
    {
      id:'life', name:'人生无限公司 LiFE', english:'LiFE World Tour', years:'2017–2019', color:'#845ef7',
      summary:'五月天第10次大型世界巡演。官方档案列出高雄、台北、香港、北京、马来西亚、北美、新加坡、伦敦、巴黎、悉尼、奥克兰、台中等，总计132场、440万人次。',
      source:sources.liveHistory, secondary:sources.life, image:'https://www.mayday.jp/wp-content/uploads/ffb31aec0c0adb49e80f9fc7e18b284f-500x399.jpg',
      stops:[stop('高雄','kaohsiung',{date:'2017-03',phase:'巡演首站'}),stop('台北','taipei'),stop('香港','hongkong'),stop('北京','beijing'),stop('吉隆坡','kualalumpur'),stop('洛杉矶','losangeles'),stop('纽约','newyork'),stop('温哥华','vancouver'),stop('多伦多','toronto'),stop('新加坡','singapore'),stop('伦敦','london'),stop('巴黎','paris'),stop('悉尼','sydney'),stop('奥克兰','auckland'),stop('台中','taichung')]
    },
    {
      id:'blue', name:'Just Rock It!!! 蓝 | BLUE', english:'Back to BLUE', years:'2019', color:'#339af0',
      summary:'官方日本站记载2019年4月6、7日于大阪城Hall举行两场，主题呼应出道前三张“蓝色三部曲”。',
      source:sources.blue, image:'https://www.mayday.jp/blue/img/header-tw.jpg',
      stops:[stop('大阪','osaka',{date:'2019-04-06—07',venue:'大阪城Hall'})]
    },
    {
      id:'5525', name:'回到那一天 5525', english:'5525 / 5525+1 / 5525+2', years:'2023–2026', color:'#ff6b9a',
      summary:'25周年巡演自2023年台中跨年起跑。官方相信音乐资料可核实台中、高雄、香港、北京、深圳、太原、武汉、成都、上海、台北、贵阳等站；下列已知日期直接标示，只有城市级资料的站点不补写未核实日期。',
      source:sources.bin5525, secondary:sources.binTaipei, image:'https://www.mayday.jp/wp-content/uploads/5b5c7eed8c21d28d399c608497ab94561-500x500.jpg',
      stops:[
        stop('台中','taichung',{date:'2023-12-31；2024-01-01/02/05/06/07',venue:'台中洲际棒球场'}),
        stop('高雄','kaohsiung',{date:'2024-03-23/24/29/30/31',venue:'高雄世运主场馆'}),
        stop('香港','hongkong',{date:'2024'}),stop('北京','beijing',{date:'2024、2025'}),stop('深圳','shenzhen',{date:'2024'}),stop('太原','taiyuan',{date:'2024'}),stop('武汉','wuhan',{date:'2024'}),stop('成都','chengdu',{date:'2024'}),stop('上海','shanghai',{date:'2024'}),
        stop('台北','taipei',{date:'2025-06-27/28/29；07-04/05/06/11/12',venue:'台北大巨蛋'}),
        stop('贵阳','guiyang',{date:'2025-09-12—14',venue:'贵阳市奥林匹克体育中心'}),
        stop('台中','taichung',{date:'2025-12-27/28/31；2026-01-01/03/04',venue:'台中洲际棒球场',phase:'5525+1'}),
        stop('台北','taipei',{date:'2026-07-03/04/05/08/10/11/12',venue:'台北大巨蛋',phase:'5525+2'})
      ]
    }
  ];

  const albums = [
    ['1999-07-07','五月天第一张创作专辑','Mayday’s First Album','https://www.mayday.jp/img/biography-oversea-1.jpg'],
    ['2000-07-07','爱情万岁','Viva Love','https://www.mayday.jp/img/biography-oversea-2.jpg'],
    ['2001-07-06','人生海海','People Life, Ocean Wild','https://www.mayday.jp/img/biography-oversea-3.jpg'],
    ['2003-11-11','时光机','Time Machine','https://www.mayday.jp/img/biography-oversea-4.jpg'],
    ['2004-11-05','神的孩子都在跳舞','God’s Children Are All Dancing','https://www.mayday.jp/img/biography-oversea-5.jpg'],
    ['2005-08-26','知足最真杰作选','Just My Pride Best Of Album','https://www.mayday.jp/img/biography-oversea-6.jpg'],
    ['2006-12-29','为爱而生','Born to Love','https://www.mayday.jp/img/biography-oversea-7.jpg'],
    ['2008-10-23','后青春期的诗','Poetry of the Day After','https://www.mayday.jp/img/biography-oversea-8.jpg'],
    ['2011-12-16','第二人生','Second Round','https://www.mayday.jp/img/biography-oversea-9a.jpg'],
    ['2016-07-21','自传','History of Tomorrow','https://www.mayday.jp/wp-content/uploads/5b5c7eed8c21d28d399c608497ab94561-500x500.jpg']
  ].map(([date,title,english,image],index)=>({id:`album-${index+1}`,date,title,english,image,source:sources.discography}));

  const books = [
    {year:'2001／2025典藏版',title:'五月天的素人自拍',author:'五月天',publisher:'时报出版',note:'五月天第一本书；典藏纪念版于2025年出版，282页。',url:'https://www.books.com.tw/products/0011029694'},
    {year:'初版／2025复刻',title:'下课后，怪兽家点名！五月天乐谱特号',author:'五月天',publisher:'台湾角川',note:'乐器故事、创作访谈、乐谱与写真；2025推出25复刻版。',url:'https://www.books.com.tw/products/0011029696'},
    {year:'2006',title:'Happy.Birth.Day──阿信・摇滚诗的诞生与转生',author:'五月天阿信',publisher:'平装本',note:'阿信文字与创作相关个人出版品。',url:'https://www.books.com.tw/products/0010323996'},
    {year:'2008',title:'浪漫的逃亡',author:'阿信',publisher:'相信音乐',note:'游日非流行指南 Exile to Japan.',url:'https://www.books.com.tw/products/0020123340'},
    {year:'2008',title:'我的摇滚妈咪',author:'石头',publisher:'相信音乐',note:'石头首本创作，书写家庭与生命。',url:'https://www.books.com.tw/products/0020124828'},
    {year:'2019',title:'因为留不住',author:'石头',publisher:'时报出版',note:'人生无限公司巡演期间与之后的文字、摄影与生活记录。',url:'https://www.books.com.tw/products/0010810244'}
  ];

  const timeline = [
    ['1997','成军','So Band 时期后以五月天之名正式出发。'],['1999','正式发片与第168场','第一张创作专辑与首场大型演唱会。'],
    ['2000','爱情万岁／十万青年','第二张专辑与北中南巡演。'],['2001','人生海海／暂别','你要去哪里演唱会后，部分团员服役或游学。'],
    ['2003','天空之城复出','回到舞台并发行《时光机》。'],['2004–05','Final Home','首轮世界巡演。'],['2007','JUMP','离开地球表面世界巡演。'],
    ['2009–10','D.N.A. 创造','44场主巡演与无限放大版。'],['2011–14','第二人生／诺亚方舟','完整概念专辑与大型世界巡演。'],
    ['2015–16','Just Rock It!','日本武道馆与亚洲巡演。'],['2017–19','自传／人生无限公司','132场世界巡演、440万人次。'],
    ['2019','BLUE','回到蓝色三部曲。'],['2023–26','5525 回到那一天','25周年巡演持续扩张。']
  ];

  return {sources,tours,albums,books,timeline};
})();