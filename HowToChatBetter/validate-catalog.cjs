// Run with: node HowToChatBetter/validate-catalog.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="\.\/(catalog[^\"]*\.js)"><\/script>/g)].map(m => m[1]);
const context = vm.createContext({window: {}});
for (const file of scripts) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, {filename: file});
const rows = context.window.CHAT_SCENARIOS || [];
const errors = [];
const seen = {id: new Map(), hant: new Map(), hans: new Map(), en: new Map()};
const clean = value => value.normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]/gu, '');
function required(value, label) {
  if (typeof value !== 'string' || !value.trim()) errors.push(`Missing ${label}`);
}
for (const scene of rows) {
  required(scene.id, 'id');
  required(scene.domain, `${scene.id}.domain`);
  for (const field of ['domainLabel', 'relation', 'goal', 'title']) {
    for (const lang of ['hant', 'hans', 'en']) required(scene[field]?.[lang], `${scene.id}.${field}.${lang}`);
  }
  for (const key of ['id', 'hant', 'hans', 'en']) {
    const raw = key === 'id' ? scene.id : scene.title?.[key];
    if (typeof raw !== 'string') continue;
    const value = key === 'id' ? raw : clean(raw);
    if (seen[key].has(value)) errors.push(`Duplicate ${key}: ${seen[key].get(value)} and ${scene.id}`);
    else seen[key].set(value, scene.id);
  }
  const keys = ['zh', 'en', 'yue'].map(lang => Object.keys(scene.replies?.[lang] || {}).sort());
  if (keys[0].length < 30) errors.push(`${scene.id}: only ${keys[0].length} reply variants; minimum is 30`);
  if (!keys[0].length || JSON.stringify(keys[0]) !== JSON.stringify(keys[1]) || JSON.stringify(keys[1]) !== JSON.stringify(keys[2])) {
    errors.push(`${scene.id}: reply languages have different or empty variant sets`);
  }
  for (const lang of ['zh', 'en', 'yue']) {
    const texts = new Set();
    for (const tone of Object.keys(scene.replies?.[lang] || {})) {
      const value = scene.replies[lang][tone];
      const variants = lang === 'zh' ? [value?.hant, value?.hans] : [value];
      for (const [index, text] of variants.entries()) {
        required(text, `${scene.id}.${lang}.${tone}.${index}`);
        if (typeof text === 'string') {
          const fingerprint = clean(text);
          const id = `${lang}.${index}.${fingerprint}`;
          if (texts.has(id)) errors.push(`${scene.id}: duplicate ${lang} reply variant ${tone}`);
          texts.add(id);
        }
      }
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  const counts = Object.entries(rows.reduce((acc, s) => (acc[s.domain] = (acc[s.domain] || 0) + 1, acc), {}));
  console.log(`${rows.length} distinct situations across ${counts.length} topics; complete UI metadata and three reply languages.`);
  console.log(counts.map(([name, count]) => `${name}:${count}`).join('  '));
}
