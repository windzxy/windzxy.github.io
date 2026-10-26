(function (global) {
  'use strict';
  var root = new URL('../', document.currentScript.src);
  var parts = {
    'topics.json': ['topics-01.json', 'topics-02.json', 'topics-03.json'],
    'questions.json': ['questions-01.json', 'questions-02.json', 'questions-03.json', 'questions-04.json', 'questions-05.json', 'questions-06.json', 'questions-07.json', 'questions-08.json', 'questions-09.json']
  };
  var cache = {};

  function get(file) {
    if (cache[file]) return cache[file];
    var names = parts[file] || [file];
    cache[file] = Promise.all(names.map(function (name) {
      return fetch(new URL('data/' + name, root)).then(function (response) {
        if (!response.ok) throw new Error(name + ' → HTTP ' + response.status);
        return response.json();
      });
    })).then(function (rows) {
      if (parts[file]) return rows.reduce(function (all, batch) { return all.concat(batch); }, []);
      return rows[0];
    });
    return cache[file];
  }

  global.WindData = { load: get };
})(window);
