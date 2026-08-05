(() => {
  'use strict';
  const banks = {
    japanese: [
      {
        id:'convenience-store', title:'コンビニで買い物', sequence:'japanese/convenience-store', stages:['preschool','primary','junior'],
        goal:'在便利店完成数量表达、加热确认、追加商品和结账。',
        lines:[
          ['店員','いらっしゃいませ。','Irasshaimase.','欢迎光临。'],
          ['客','このおにぎりを二つください。','Kono onigiri o futatsu kudasai.','请给我两个这个饭团。'],
          ['店員','温めますか。','Atatamemasu ka.','需要加热吗？'],
          ['客','はい、お願いします。それから、水も一本ください。','Hai, onegai shimasu. Sorekara, mizu mo ippon kudasai.','好的。另外请给我一瓶水。'],
          ['店員','全部で五百円です。','Zenbu de gohyaku-en desu.','一共五百日元。']
        ],
        points:['を标记购买对象；二つ是通用数量词，一本用于瓶装或细长物。','それから用于追加信息；も表示“也”。','长音、促音和拨音各占一个音拍。'],
        examples:['このパンを一つください。','袋はいりません。','電子マネーで払います。'],
        checks:[['客人买了什么？','两个饭团和一瓶水。'],['店员确认了什么？','是否需要加热。']]
      },
      {
        id:'station-directions', title:'駅で道を聞く', sequence:'japanese/station-directions', stages:['primary','junior','senior'],
        goal:'询问路线、听懂站数，并确认是否需要换乘。',
        lines:[
          ['旅行者','すみません。東京駅へはどう行きますか。','Sumimasen. Tōkyō-eki e wa dō ikimasu ka.','不好意思，请问怎么去东京站？'],
          ['駅員','この電車で二つ目の駅まで行ってください。','Kono densha de futatsume no eki made itte kudasai.','请乘这班电车到第二站。'],
          ['旅行者','乗り換えは必要ですか。','Norikae wa hitsuyō desu ka.','需要换乘吗？'],
          ['駅員','いいえ、乗り換えなくても大丈夫です。','Iie, norikaenakute mo daijōbu desu.','不换乘也没问题。'],
          ['旅行者','分かりました。ありがとうございます。','Wakarimashita. Arigatō gozaimasu.','明白了，谢谢。']
        ],
        points:['へ表示移动方向；で表示交通手段；まで表示终点。','〜なくても大丈夫表示“不做也可以”。','二つ目表示第二个，与普通数量二つ不同。'],
        examples:['新宿駅まで何分かかりますか。','どこで乗り換えますか。','この電車は渋谷に止まりますか。'],
        checks:[['坐到第几站？','第二站。'],['需要换乘吗？','不需要。']]
      },
      {
        id:'restaurant', title:'レストランで注文する', sequence:'japanese/restaurant', stages:['primary','junior','senior'],
        goal:'说明人数、询问座位、请求推荐并完成点餐。',
        lines:[
          ['店員','いらっしゃいませ。何名様ですか。','Irasshaimase. Nanmei-sama desu ka.','欢迎光临，请问几位？'],
          ['客','二人です。窓側の席は空いていますか。','Futari desu. Madogawa no seki wa aite imasu ka.','两位。靠窗座位空着吗？'],
          ['店員','はい、こちらへどうぞ。','Hai, kochira e dōzo.','有，请这边走。'],
          ['客','おすすめの料理は何ですか。','Osusume no ryōri wa nan desu ka.','推荐菜是什么？'],
          ['店員','今日は焼き魚定食がおすすめです。','Kyō wa yakizakana teishoku ga osusume desu.','今天推荐烤鱼套餐。']
        ],
        points:['何名様是服务场景的敬语人数问法。','空いています表示空着；窓側表示靠窗一侧。','おすすめ既可以作名词，也能用于推荐句。'],
        examples:['予約したリンです。','辛くない料理はありますか。','別々に払えますか。'],
        checks:[['客人有几位？','两位。'],['推荐什么菜？','烤鱼套餐。']]
      },
      {
        id:'school-introduction', title:'学校で自己紹介する', sequence:'japanese/school-introduction', stages:['junior','senior','advanced'],
        goal:'介绍姓名、来源、学习时长和学习目标。',
        lines:[
          ['先生','はじめまして。お名前を教えてください。','Hajimemashite. Onamae o oshiete kudasai.','初次见面，请告诉我你的名字。'],
          ['学生','リンです。シンガポールから来ました。','Rin desu. Shingapōru kara kimashita.','我是林，来自新加坡。'],
          ['先生','日本語をどのくらい勉強しましたか。','Nihongo o dono kurai benkyō shimashita ka.','学日语多久了？'],
          ['学生','半年ぐらいです。会話をもっと練習したいです。','Hantoshi gurai desu. Kaiwa o motto renshū shitai desu.','大约半年，想多练习会话。'],
          ['先生','一緒に頑張りましょう。','Issho ni ganbarimashō.','一起努力吧。']
        ],
        points:['〜から来ました说明来源；どのくらい询问程度或时长。','〜たいです表达愿望。','〜ましょう用于邀请共同做某事。'],
        examples:['将来、日本で働きたいです。','漢字を読むのが少し苦手です。','毎日三十分ぐらい勉強しています。'],
        checks:[['学生来自哪里？','新加坡。'],['希望加强什么？','会话。']]
      }
    ],
    korean: [
      {
        id:'cafe-order', title:'카페에서 주문하기', sequence:'korean/cafe-order', stages:['preschool','primary','junior'],
        goal:'完成迎客、点单、冷热确认和结账。',
        lines:[
          ['직원','어서 오세요. 무엇을 드릴까요?','Eoseo oseyo. Mueoseul deurilkkayo?','欢迎光临。需要什么？'],
          ['손님','아메리카노 한 잔하고 샌드위치 하나 주세요.','Amerikano han janhago saendeuwichi hana juseyo.','请给我一杯美式咖啡和一个三明治。'],
          ['직원','커피는 따뜻한 것으로 드릴까요?','Keopineun ttatteuthan geoseuro deurilkkayo?','咖啡要热的吗？'],
          ['손님','네, 따뜻하게 주세요.','Ne, ttatteuthage juseyo.','是的，请给我热的。'],
          ['직원','모두 만 이천 원입니다.','Modu man icheon wonimnida.','一共一万二千韩元。']
        ],
        points:['한 잔、하나分别搭配不同数量单位。','하고连接名词；주세요是礼貌请求。','〜으로表示选择、方向或方式。'],
        examples:['아이스 라테 한 잔 주세요.','설탕은 빼 주세요.','카드로 계산할게요.'],
        checks:[['点了什么？','一杯美式咖啡和一个三明治。'],['咖啡要热还是冰？','热的。']]
      },
      {
        id:'subway-directions', title:'지하철에서 길 묻기', sequence:'korean/subway-directions', stages:['primary','junior','senior'],
        goal:'询问去首尔站的路线、听懂站数，并确认换乘。',
        lines:[
          ['여행자','실례합니다. 서울역에 어떻게 가요?','Sillyehamnida. Seoullyeoge eotteoke gayo?','打扰一下，怎么去首尔站？'],
          ['직원','이 지하철을 타고 세 정거장 가세요.','I jihacheoreul tago se jeonggeojang gaseyo.','乘这趟地铁坐三站。'],
          ['여행자','갈아타야 해요?','Garataya haeyo?','需要换乘吗？'],
          ['직원','아니요, 갈아타지 않아도 돼요.','Aniyo, garataji anado dwaeyo.','不换乘也可以。'],
          ['여행자','알겠습니다. 감사합니다.','Algetseumnida. Gamsahamnida.','明白了，谢谢。']
        ],
        points:['〜을/를 타고表示乘坐交通工具后继续行动。','〜아/어야 해요表示必须；〜지 않아도 돼요表示不做也可以。','세用于数站数，注意固有数词。'],
        examples:['몇 번 출구로 나가야 해요?','홍대입구역에서 갈아타세요.','여기에서 얼마나 걸려요?'],
        checks:[['要坐几站？','三站。'],['需要换乘吗？','不需要。']]
      },
      {
        id:'clothes-shopping', title:'옷 가게에서 쇼핑하기', sequence:'korean/clothes-shopping', stages:['primary','junior','senior'],
        goal:'询问颜色、请求试穿、找到试衣间并作购买决定。',
        lines:[
          ['손님','이 셔츠 다른 색도 있어요?','I syeocheu dareun saekdo isseoyo?','这件衬衫还有其他颜色吗？'],
          ['직원','네, 파란색하고 검은색이 있어요.','Ne, paransaekhago geomeunsaegi isseoyo.','有蓝色和黑色。'],
          ['손님','파란색을 입어 봐도 돼요?','Paransaekeul ibeo bwado dwaeyo?','可以试穿蓝色的吗？'],
          ['직원','네, 탈의실은 오른쪽에 있습니다.','Ne, taruisireun oreunjjoge itseumnida.','可以，试衣间在右边。'],
          ['손님','감사합니다. 이걸로 살게요.','Gamsahamnida. Igeollo salgeyo.','谢谢，我买这个。']
        ],
        points:['〜도 있어요表示“也有”；하고连接列举项目。','〜아/어 봐도 돼요询问是否可以尝试。','〜(으)ㄹ게요表达当场决定或承诺。'],
        examples:['더 큰 사이즈가 있어요?','이 옷은 얼마예요?','현금으로 계산할게요.'],
        checks:[['有哪些颜色？','蓝色和黑色。'],['最后决定怎样？','买下蓝色衬衫。']]
      },
      {
        id:'school-introduction', title:'학교에서 자기소개하기', sequence:'korean/school-introduction', stages:['junior','senior','advanced'],
        goal:'介绍姓名、来源、学习时长和学习目标。',
        lines:[
          ['선생님','처음 뵙겠습니다. 이름이 뭐예요?','Cheoeum boepgetseumnida. Ireumi mwoyeyo?','初次见面，你叫什么名字？'],
          ['학생','민수예요. 싱가포르에서 왔어요.','Minsuyeyo. Singgaporeueseo wasseoyo.','我是民秀，来自新加坡。'],
          ['선생님','한국어를 얼마나 공부했어요?','Hangugeoreul eolmana gongbuhaesseoyo?','学韩语多久了？'],
          ['학생','여섯 달 정도 공부했어요. 말하기를 더 연습하고 싶어요.','Yeoseot dal jeongdo gongbuhaesseoyo. Malhagireul deo yeonseuphago sipeoyo.','学了约六个月，想多练口语。'],
          ['선생님','좋아요. 같이 열심히 공부해요.','Joayo. Gachi yeolsimhi gongbuhaeyo.','好，一起努力学习吧。']
        ],
        points:['〜에서 왔어요说明来源；얼마나询问程度或时长。','〜고 싶어요表达愿望。','뵙겠습니다是보다的敬语形式。'],
        examples:['발음을 더 정확하게 하고 싶어요.','한국 드라마를 자막 없이 보고 싶어요.','매일 한 시간 정도 공부해요.'],
        checks:[['学生来自哪里？','新加坡。'],['希望多练什么？','口语。']]
      }
    ]
  };

  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const subject = () => document.body.dataset.subject || new URLSearchParams(location.search).get('subject');
  const stage = () => new URLSearchParams(location.search).get('stage') || document.body.dataset.stage || document.querySelector('#subject-stage')?.value || localStorage.getItem('wind-stage-v4') || 'primary';
  const dailyIndex = (length, key) => {
    const date = new Date();
    return (Number(`${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`) + [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % length;
  };

  function renderLesson(lesson, language) {
    return `<div class="east-lesson-head"><div><span>完整情境课程</span><h2>${esc(lesson.title)}</h2><p>${esc(lesson.goal)}</p></div><button class="east-play-all" type="button" data-audio-sequence="${esc(lesson.sequence)}" data-language="${language}">▶ 播放完整对话</button></div><div class="east-lines">${lesson.lines.map((line,index) => `<article><b>${esc(line[0])}</b><div><p>${esc(line[1])}</p><code>${esc(line[2])}</code><small>${esc(line[3])}</small></div><button type="button" data-audio-key="${esc(`${lesson.sequence}/${String(index+1).padStart(2,'0')}`)}" data-language="${language}">▶</button></article>`).join('')}</div><div class="east-grid"><article><h3>语言重点</h3><ul>${lesson.points.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article><article><h3>替换例句</h3><ul>${lesson.examples.map(item => `<li>${esc(item)}</li>`).join('')}</ul></article></div><div class="east-checks"><h3>理解检查</h3>${lesson.checks.map(([question,answer]) => `<details><summary>${esc(question)}</summary><p>${esc(answer)}</p></details>`).join('')}</div>`;
  }

  function mount() {
    const language = subject();
    const anchor = document.querySelector('#deep-course-v6');
    if (!anchor || !banks[language] || document.querySelector('#east-language-library')) return false;
    let lessons = banks[language];
    const filtered = lessons.filter(item => item.stages.includes(stage()));
    if (filtered.length) lessons = filtered;
    let index = dailyIndex(lessons.length, language);
    const root = document.createElement('section');
    root.id = 'east-language-library';
    anchor.after(root);
    const render = () => {
      root.innerHTML = `<header class="east-library-title"><div><span>持续扩充</span><h2>更多日常语言课程</h2><p>当前学段共 ${lessons.length} 组完整情境；每日推荐一课，也可手动切换。</p></div><button id="east-random" type="button">换一课</button></header>${renderLesson(lessons[index], language)}<footer><button id="east-prev" type="button">上一课</button><span>${index+1} / ${lessons.length}</span><button id="east-next" type="button">下一课</button></footer>`;
      root.querySelector('#east-random').onclick = () => { index = lessons.length > 1 ? (index + 1 + Math.floor(Math.random() * (lessons.length - 1))) % lessons.length : 0; render(); };
      root.querySelector('#east-prev').onclick = () => { index = (index - 1 + lessons.length) % lessons.length; render(); };
      root.querySelector('#east-next').onclick = () => { index = (index + 1) % lessons.length; render(); };
    };
    render();
    return true;
  }

  const style = document.createElement('style');
  style.textContent = '#east-language-library{margin:22px 0 40px;background:#fff;border:1px solid rgba(31,45,78,.08);border-radius:22px;box-shadow:0 16px 42px rgba(49,61,104,.08);overflow:hidden}.east-library-title,.east-lesson-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding:24px 27px}.east-library-title{border-bottom:1px solid #edf0f7}.east-library-title span,.east-lesson-head span{font-size:12px;color:#7f899e}.east-library-title h2,.east-lesson-head h2{margin:5px 0 8px;color:#22304d}.east-library-title p,.east-lesson-head p{margin:0;color:#68748c;line-height:1.65}.east-library-title button,.east-play-all,#east-language-library footer button{border:0;border-radius:11px;padding:10px 14px;background:#eef1ff;color:#4e5de3;font-weight:800;cursor:pointer;white-space:nowrap}.east-lines{display:grid;gap:10px;padding:0 27px 22px}.east-lines article{display:grid;grid-template-columns:76px minmax(0,1fr) 40px;gap:13px;align-items:start;padding:15px 16px;border:1px solid #e8ebf2;border-radius:15px}.east-lines article>b{color:#4e5de3}.east-lines p{margin:0 0 7px;line-height:1.7;color:#27334e}.east-lines code{display:block;white-space:normal;color:#6b7690}.east-lines small{display:block;margin-top:5px;color:#8a93a7}.east-lines article>button{width:36px;height:36px;border:0;border-radius:10px;background:#eef1ff;color:#4e5de3;font-weight:900;cursor:pointer}.east-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding:0 27px 20px}.east-grid article{padding:18px 20px;background:#f7f8fc;border-radius:16px}.east-grid h3,.east-checks h3{margin:0 0 10px;color:#283550}.east-grid li{color:#606c84;line-height:1.75;margin-bottom:7px}.east-checks{display:grid;gap:8px;padding:0 27px 25px}.east-checks details{border:1px solid #e8ebf2;border-radius:12px;padding:11px 14px}.east-checks summary{cursor:pointer;font-weight:750;color:#34415e}.east-checks p{color:#627089;line-height:1.7}#east-language-library footer{display:flex;justify-content:center;align-items:center;gap:16px;padding:15px;border-top:1px solid #edf0f7}#east-language-library footer span{color:#7d879d}@media(max-width:800px){.east-library-title,.east-lesson-head{display:grid}.east-grid{grid-template-columns:1fr}.east-lines article{grid-template-columns:1fr 40px}.east-lines article>b{grid-column:1/-1}}';
  document.head.append(style);
  const start = () => { if (mount()) return; const observer = new MutationObserver(() => { if (mount()) observer.disconnect(); }); observer.observe(document.body,{childList:true,subtree:true}); setTimeout(() => observer.disconnect(),16000); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true}); else start();
})();
