require.config({
  baseUrl: '.',
  paths: {
    "modernizr": "lib/modernizr/modernizr",
    "underscore": "components/underscore/underscore",
    "backbone": "components/backbone/backbone",
    "backbone.localStorage": "components/backbone.localStorage/backbone.localStorage",
    "jquery": "components/jquery/jquery",
    "jquery.hammer": "components/hammerjs/dist/jquery.hammer",
    "jquery.cookie": "components/jquery.cookie/jquery.cookie",
    "jquery.smartresize": "components/jquery-smartresize/jquery.debouncedresize",
    "jquery.smartscroll": "lib/smartscroll/smartscroll",
    "backbone.wreqr": "components/backbone.wreqr/lib/amd/backbone.wreqr",
    "backbone.babysitter": "components/backbone.babysitter/lib/amd/backbone.babysitter",
    "backbone.marionette": "components/backbone.marionette/lib/core/amd/backbone.marionette",
    "backbone.marionette.handlebars": "components/backbone.marionette.handlebars/backbone.marionette.handlebars",
    "hbs": "components/require-handlebars-plugin/hbs",
    "handlebars": "components/require-handlebars-plugin/Handlebars",
    "i18nprecompile": "components/require-handlebars-plugin/hbs/i18nprecompile",
    "json2": "components/require-handlebars-plugin/hbs/json2",
    "eve": "lib/raphael/eve",
    "raphael": "lib/raphael/raphael",
    "morris": "components/morris.js/morris",
    "mtchart": "lib/mtchart/mtchart",
    "app": "js/app",
    "text": "components/requirejs-text/text",
    "json": "components/requirejs-plugins/src/json",
    "easeljs": "components/EaselJS/lib/easeljs-0.6.0.min",
    "mtapi": "lib/api/v1/js/app",
    "mtendpoints": "lib/api/v1/js/endpoints"
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      exports: 'Backbone',
      deps: ['jquery', 'underscore']
    },
    'jquery.hammer': ['jquery'],
    'jquery.smartresize': ['jquery'],
    'jquery.smartscroll': ['jquery', 'jquery.smartresize'],
    'jquery.cookie': ['jquery'],
    'modernizr': {
      exports: 'Modernizr'
    },
    'morris': {
      exports: 'Morris',
      deps: ['jquery', 'raphael']
    },
    'easeljs': {
      exports: 'createjs'
    },
    'mtapi': {
      exports: 'MT.API'
    },
    'mtendpoints': {
      deps: ['mtapi']
    }
  },
  deps: ['mtapi', 'mtendpoints', 'jquery', 'jquery.hammer', 'jquery.cookie', 'jquery.smartresize', 'jquery.smartscroll', 'underscore', 'backbone', 'backbone.localStorage', 'easeljs'],
  locale: 'ja_jp',
  hbs: {
    disableI18n: false,
    disableHelpers: false,
    templateExtension: "hbs",
    compileOptions: {}
  }
});

window.DEBUG = true;
require(['js/boot'], function () {});