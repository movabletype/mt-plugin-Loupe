Mock = {};
DEBUG = true;

require(['jquery'], function ($) {
  $(document.body).append('<div id="container"><div id="menu"></div><div id="app"></div></div><div id="app-building"></div>');
})

require(['json!cards/cards.json', 'js/mtapi/mock', 'app', 'js/boot']);

// initialzing module in case which is not required yet.

function requireModuleAndWait(path) {
  var flag;
  path = typeof path === 'string' ? [path] : path
  require(path, function () {
    flag = true;
  });
  waitsFor(function () {
    return flag;
  }, 'requiring ' + path, 3000);
}

function resetMock() {
  window.Mock = {};
}

function undefRequireModule(path) {
  path = typeof path === 'string' ? [path] : path;
  _.forEach(path, function (p) {
    require.undef(p);
    $('script[src$="' + p + '.js"]').remove();
  });
}

function reRequireModule(path) {
  path = typeof path === 'string' ? [path] : path;
  undefRequireModule(path);
  requireModuleAndWait(path);
}
