/* 首页：统计和年级入口都从 data/*.json 计算，不写死数量。 */
(function () {
  'use strict';
  var raw = location.hash.replace(/^#/, '');
  try { raw = decodeURIComponent(raw); } catch (e) { /* 保持原样 */ }
  if (/^(?:cnm|cne|cnp|cnc)_[A-Za-z0-9]+$/.test(raw)) return;

  var CN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var subjectParam = new URLSearchParams(location.search).get('subject');
  var subject = subjectParam === 'english' || subjectParam === 'physics' || subjectParam === 'chinese' ? subjectParam : 'math';
  var PREFIX = { math: 'cnm_', english: 'cne_', physics: 'cnp_', chinese: 'cnc_' };
  var STD_PREFIX = { math: 'cms-', english: 'ces-', physics: 'cps-', chinese: 'ccs-' };

  function withSubject(href) {
    if (subject === 'math' || !href || href.indexOf('subject=') >= 0 || href.indexOf('http') === 0) return href;
    return href + (href.indexOf('?') >= 0 ? '&' : '?') + 'subject=' + subject;
  }

  document.body.classList.toggle('subject-english', subject === 'english');
  document.body.classList.toggle('subject-physics', subject === 'physics');
  document.body.classList.toggle('subject-chinese', subject === 'chinese');
  document.querySelectorAll('.subject-link').forEach(function (link) {
    var on = link.getAttribute('data-subject') === subject;
    link.classList.toggle('on', on);
    if (on) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('.site-nav a:not(.subject-link), a.brand').forEach(function (link) {
    var href = link.getAttribute('href');
    var next = withSubject(href);
    if (next && next !== href) link.setAttribute('href', next);
  });
  if (subject === 'english') {
    document.title = '英语 · 中小学·高中知识图谱';
    var eye = document.querySelector('.eyebrow');
    if (eye) eye.textContent = '英语：三年级到高中';
    var primary = document.querySelector('.hero-actions a.btn-primary');
    var browse = document.querySelector('.hero-actions a.btn:not(.btn-primary)');
    if (primary) primary.setAttribute('href', 'diagnose/?subject=english');
    if (browse) browse.setAttribute('href', 'explore/?subject=english');
    var demo = document.querySelector('.quiet-link a');
    if (demo) {
      demo.setAttribute('href', 'diagnose/?subject=english&grade=' + encodeURIComponent('四上') + '&demo=1');
      demo.textContent = '先看一遍演示：四年级上册英语';
    }
  } else if (subject === 'physics') {
    document.title = '物理 · 中小学·高中知识图谱';
    var peye = document.querySelector('.eyebrow');
    if (peye) peye.textContent = '物理：初中八、九年级 · 高中必修与选择性必修';
    var pprimary = document.querySelector('.hero-actions a.btn-primary');
    var pbrowse = document.querySelector('.hero-actions a.btn:not(.btn-primary)');
    if (pprimary) pprimary.setAttribute('href', 'diagnose/?subject=physics');
    if (pbrowse) pbrowse.setAttribute('href', 'explore/?subject=physics');
    var pdemo = document.querySelector('.quiet-link a');
    if (pdemo) {
      pdemo.setAttribute('href', 'diagnose/?subject=physics&grade=' + encodeURIComponent('八上') + '&demo=1');
      pdemo.textContent = '先看一遍演示：八年级上册物理';
    }
  } else if (subject === 'chinese') {
    document.title = '小学语文 · 中小学·高中知识图谱';
    var zeye = document.querySelector('.eyebrow');
    if (zeye) zeye.textContent = '语文：小学一至六年级 · 统编版';
    var zprimary = document.querySelector('.hero-actions a.btn-primary');
    var zbrowse = document.querySelector('.hero-actions a.btn:not(.btn-primary)');
    if (zprimary) zprimary.setAttribute('href', 'diagnose/?subject=chinese');
    if (zbrowse) zbrowse.setAttribute('href', 'explore/?subject=chinese');
    var zdemo = document.querySelector('.quiet-link a');
    if (zdemo) {
      zdemo.setAttribute('href', 'diagnose/?subject=chinese&grade=' + encodeURIComponent('一上') + '&demo=1');
      zdemo.textContent = '先看一遍演示：一年级上册语文';
    }
  }

  function setText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function fail(message) {
    var box = document.getElementById('load-error');
    if (!box) return;
    box.hidden = false;
    box.textContent = message;
  }

  Promise.all([
    WindData.load('topics.json'),
    WindData.load('dependencies.json'),
    WindData.load('questions.json'),
    WindData.load('cn-curriculum-standards.json')
  ]).then(function (data) {
    var topics = data[0];
    var deps = data[1];
    var questions = data[2];
    var standards = data[3];
    if (!Array.isArray(topics) || !Array.isArray(deps) || !Array.isArray(questions)) {
      throw new Error('数据格式无法识别');
    }
    var items = standards && Array.isArray(standards.items) ? standards.items : [];
    function subjectOfId(id) {
      id = String(id || '');
      if (id.indexOf('cne_') === 0) return 'english';
      if (id.indexOf('cnp_') === 0) return 'physics';
      if (id.indexOf('cnc_') === 0) return 'chinese';
      return 'math';
    }
    function subjectOfStd(id) {
      id = String(id || '');
      if (id.indexOf('ces-') === 0) return 'english';
      if (id.indexOf('cps-') === 0) return 'physics';
      if (id.indexOf('ccs-') === 0) return 'chinese';
      return 'math';
    }
    var wantEnglish = subject === 'english';
    var wantPhysics = subject === 'physics';
    var wantChinese = subject === 'chinese';
    topics = topics.filter(function (topic) { return (topic.subject || subjectOfId(topic.id)) === subject; });
    deps = deps.filter(function (edge) { return subjectOfId(edge.topicId) === subject; });
    questions = questions.filter(function (question) { return subjectOfId(question.topicId) === subject; });
    items = items.filter(function (item) { return subjectOfStd(item.id) === subject; });
    setText('n-topics', String(topics.length));
    setText('n-edges', String(deps.length));
    setText('n-questions', String(questions.length));
    setText('n-standards', String(items.length));

    var grades = document.getElementById('grades');
    if (!grades) return;
    grades.replaceChildren();
    grades.removeAttribute('aria-busy');
    function addCard(g, stageName, title, klass, splitText, href) {
      var list = topics.filter(function (topic) { return topic.grade === g; });
      var link = document.createElement('a');
      link.className = 'grade-card ' + klass;
      link.href = href;
      var stage = document.createElement('span');
      stage.className = 'grade-stage';
      stage.textContent = stageName;
      var name = document.createElement('strong');
      name.textContent = title;
      var count = document.createElement('span');
      count.className = 'grade-count';
      count.textContent = list.length + ' 个知识点';
      var split = document.createElement('span');
      split.className = 'grade-stage';
      split.textContent = splitText;
      link.append(stage, name, count, split);
      grades.append(link);
    }
    var from = wantPhysics ? 8 : (wantEnglish ? 3 : 1);
    var to = wantChinese ? 6 : 9;
    for (var g = from; g <= to; g++) {
      var list = topics.filter(function (topic) { return topic.grade === g; });
      var up = list.filter(function (topic) { return topic.semester === '上'; }).length;
      var down = list.filter(function (topic) { return topic.semester === '下'; }).length;
      var whole = list.filter(function (topic) { return topic.semester === '全'; }).length;
      var splitText = whole ? '全一册 ' + whole : '上 ' + up + ' · 下 ' + down;
      var href = subject !== 'math' ? 'explore/?subject=' + subject + '&grade=' + g : 'explore/?grade=' + g;
      addCard(g, g <= 6 ? '小学' : (wantPhysics ? '初中物理' : '初中'), CN[g] + '年级', g <= 6 ? 'is-primary' : 'is-junior', splitText, href);
    }
    if (wantChinese) {
      /* 小学语文只到六年级 */
    } else if (wantPhysics) {
      addCard(10, '高中物理', '必修一', 'is-senior', '必修第一册', 'explore/?subject=physics&grade=10');
      addCard(11, '高中物理', '必修二', 'is-senior', '必修第二册', 'explore/?subject=physics&grade=11');
      addCard(12, '高中物理', '必修三', 'is-senior', '必修第三册', 'explore/?subject=physics&grade=12');
      addCard(13, '高中物理', '选必一', 'is-senior', '选择性必修第一册', 'explore/?subject=physics&grade=13');
      addCard(14, '高中物理', '选必二', 'is-senior', '选择性必修第二册', 'explore/?subject=physics&grade=14');
      addCard(15, '高中物理', '选必三', 'is-senior', '选择性必修第三册', 'explore/?subject=physics&grade=15');
    } else if (wantEnglish) {
      addCard(10, '高中', '必修一', 'is-senior', '必修第一册', 'explore/?subject=english&grade=10');
      addCard(11, '高中', '必修二', 'is-senior', '必修第二册', 'explore/?subject=english&grade=11');
      addCard(12, '高中', '必修三', 'is-senior', '必修第三册', 'explore/?subject=english&grade=12');
      addCard(13, '高中', '选必一', 'is-senior', '选择性必修第一册', 'explore/?subject=english&grade=13');
      addCard(14, '高中', '选必二', 'is-senior', '选择性必修第二册', 'explore/?subject=english&grade=14');
      addCard(15, '高中', '选必三', 'is-senior', '选择性必修第三册', 'explore/?subject=english&grade=15');
      addCard(16, '高中', '选必四', 'is-senior', '选择性必修第四册', 'explore/?subject=english&grade=16');
    } else {
      addCard(10, '高中', '高一', 'is-senior', '必修第一册', 'explore/?grade=10');
      addCard(11, '高中', '高二', 'is-senior', '必修第二册', 'explore/?grade=11');
      addCard(12, '高中', '选必一', 'is-senior', '选择性必修第一册', 'explore/?grade=12');
      addCard(13, '高中', '选必二', 'is-senior', '选择性必修第二册', 'explore/?grade=13');
      addCard(14, '高中', '选必三', 'is-senior', '选择性必修第三册', 'explore/?grade=14');
    }
  }).catch(function (error) {
    fail('数据没有加载成功（' + (error && error.message ? error.message : error) + '）。请在项目根目录运行 python3 -m http.server 8000，再用浏览器打开，不要直接双击 html 文件。');
  });
})();
