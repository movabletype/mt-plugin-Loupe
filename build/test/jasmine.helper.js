Mock = {};
DEBUG = true;

require(['jquery'], function ($) {
  $(document.body).append('<div id="container"><div id="menu"></div><div id="app"></div></div><div id="app-building"></div>');
})

require(['json!cards/cards.json', 'js/mtapi/mock', 'app', 'js/boot'])
