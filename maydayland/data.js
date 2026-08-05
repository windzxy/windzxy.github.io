window.MAYDAYLAND_DATA = (() => {
  const IMG={
    band:'https://www.mayday.jp/wp-content/uploads/ffb31aec0c0adb49e80f9fc7e18b284f-500x399.jpg',
    blue:'https://www.mayday.jp/blue/img/header-tw.jpg',
    first:'https://www.mayday.jp/img/biography-oversea-1.jpg',viva:'https://www.mayday.jp/img/biography-oversea-2.jpg',
    ocean:'https://www.mayday.jp/img/biography-oversea-3.jpg',time:'https://www.mayday.jp/img/biography-oversea-4.jpg',
    god:'https://www.mayday.jp/img/biography-oversea-5.jpg',best:'https://www.mayday.jp/img/biography-oversea-6.jpg',
    born:'https://www.mayday.jp/img/biography-oversea-7.jpg',poetry:'https://www.mayday.jp/img/biography-oversea-8.jpg',
    second:'https://www.mayday.jp/img/biography-oversea-9a.jpg',secondAlt:'https://www.mayday.jp/img/biography-oversea-9b.jpg',
    history:'https://www.mayday.jp/wp-content/uploads/5b5c7eed8c21d28d399c608497ab94561-500x500.jpg'
  };
  const MOJO={
    orange:'https://i01.istayreal.com/inner/2024-08-07/2b9a6f5e3d4e90433e296a313dae1016.jpg',
    peach:'https://i01.istayreal.com/inner/2025-08-22/7fe2e4a3149993016160114fcc1e44fe.jpg',
    banana:'https://i01.istayreal.com/inner/2025-07-30/c4ee0aa7c535232bb1642655c0ffd55e.jpg',
    apple:'https://i01.istayreal.com/inner/2024-12-04/74cb782b99a71a679bf43aef6f8fef31.jpg',
    watermelon:'https://i01.istayreal.com/inner/2026-02-04/fd4836fe5bec4290f5cfe0bd9633a14d.jpg',
    cherry:'https://i01.istayreal.com/inner/2025-10-24/a96f39729b81908b9cfd29b9c99f2745.jpg'
  };
  const signals=[
    ['first','album','1999','第一張創作專輯','一切從這裡開始','第一批青春訊號正式上線。從校園、野台與第168場演唱會開始，五月天的世界第一次被完整記錄。',250,345,IMG.first,'orange',['五月天 第一張創作專輯'],'1999.168'],
    ['viva','album','2000','愛情萬歲','愛與搖滾的第二章','更直接、更狂熱的樂團聲響，把愛情與青春推向更明亮也更疼痛的方向。',380,175,IMG.viva,'peach',['五月天 愛情萬歲'],'2000.0707'],
    ['ocean','album','2001','人生海海','在人生海上繼續前進','告別與等待被寫進旋律。即使暫時離開舞台，訊號仍留在每一個人的生活裡。',595,105,IMG.ocean,'banana',['五月天 人生海海'],'2001.0706'],
    ['time','album','2003','時光機','重新集合的時空座標','復出後的第一個完整世界。過去、現在與未來，在同一台時光機裡重新接軌。',850,125,IMG.time,'apple',['五月天 時光機'],'2003.1111'],
    ['god','album','2004','神的孩子都在跳舞','讓搖滾重新起飛','更密集、更銳利的樂團能量，與 Final Home 時期的舞台共同構成新的現場語言。',1120,180,IMG.god,'watermelon',['五月天 神的孩子都在跳舞'],'2004.1105'],
    ['born','album','2006','為愛而生','所有選擇都因愛開始','把溫柔、勇氣與責任放進更遼闊的編曲，連接下一個世界巡迴時代。',1360,345,IMG.born,'cherry',['五月天 為愛而生'],'2006.1229'],
    ['poetry','album','2008','後青春期的詩','青春之後，仍然繼續','成長不是青春的終點。那些沒有說完的話，在新的生命階段再次被唱起。',1365,675,IMG.poetry,'orange',['五月天 後青春期的詩'],'2008.1023'],
    ['second','album','2011','第二人生','末日之後的另一種選擇','兩種版本、兩種世界線。諾亞方舟巡演把末日、重生與選擇擴展成完整宇宙。',1115,835,IMG.second,'peach',['五月天 第二人生'],'2011.1216'],
    ['history','album','2016','自傳','把走過的路寫成歌','不是回顧，而是繼續前進前的一次自我註解。每一段人生都在作品中留下座標。',805,900,IMG.history,'banana',['五月天 自傳'],'2016.0721'],
    ['5525','live','2023 — NOW','回到那一天','#5525 二十五週年巡演','搭上時光列車，重新經過二十五年的每一次相遇，再前往還沒有抵達的下一站。',520,785,IMG.history,'apple',['五月天 回到那一天 Live','五月天 5525 Live'],'0529.5525'],
    ['noah','live','2011 — 2014','諾亞方舟','NOWHERE 世界巡迴','世界沒有末日，我們便有機會選擇自己的第二人生。這個舞台把概念、影像與音樂連成完整航線。',285,680,IMG.secondAlt,'watermelon',['五月天 諾亞方舟 Live'],'2012.NOWHERE'],
    ['life','live','2017 — 2019','人生無限公司','LiFE 世界巡迴','將舞台、電影與人生企劃連結在一起，讓每一夜都像一部只上映一次的作品。',1310,515,IMG.first,'cherry',['五月天 人生無限公司 Live'],'2017.LIFE'],
    ['blue','live','2019','Just Rock It!!! BLUE','藍色三部曲二十週年','回到最初的藍，重新打開早期作品與現場記憶，讓青春再次覆蓋整座場館。',1030,570,IMG.blue,'orange',['五月天 Just Rock It BLUE Live'],'2019.BLUE'],
    ['ost','ost','ALL YEARS','OST 任意門','電影、戲劇與特別企劃','從銀幕與故事的另一扇門進入五月天，包括電影主題曲、戲劇歌曲、合作與特別單曲。',760,645,IMG.best,'peach',['五月天 電影主題曲','五月天 OST'],'FILM.0529'],
    ['origin','history','1997','成軍原點','So Band 到五月天','從校園與野台開始，五個人的樂團故事逐漸成形，並在 1997 年以五月天之名正式出發。',475,500,IMG.band,'banana',['五月天 1997 Live','五月天 憨人'],'1997.0329'],
    ['forever','history','1997 — FOREVER','Mayday Forever Radio','所有時代持續廣播','專輯、現場、OST、合作與特別單曲組成全宇宙隨機電台。打開網站後，訊號會自動搜尋與播放。',1135,400,IMG.band,'apple',['五月天','五月天 Live','五月天 OST','五月天 單曲'],'FM.0529']
  ].map(([id,type,year,title,subtitle,description,x,y,image,mojo,queries,coord])=>({id,type,year,title,subtitle,description,x,y,image,mojo,queries,coord}));
  const timeline=[['1997','五月天成軍','從校園與野台開始。'],['1999','正式發片','第一張創作專輯與第168場演唱會。'],['2001','人生海海與暫別','等待再次集合。'],['2003','天空之城復出','回到舞台。'],['2004','Final Home','第一次世界巡迴。'],['2011','第二人生／諾亞方舟','末日與重生的世界觀。'],['2017','人生無限公司','舞台、電影與人生企劃。'],['2023','回到那一天','二十五週年的時光列車。']];
  const core=['五月天','五月天 Live','五月天 第一張創作專輯','五月天 愛情萬歲','五月天 人生海海','五月天 時光機','五月天 神的孩子都在跳舞','五月天 為愛而生','五月天 後青春期的詩','五月天 第二人生','五月天 自傳','五月天 OST'];
  return {IMG,MOJO,signals,timeline,core};
})();