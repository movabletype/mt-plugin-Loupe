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
    "hbs": "components/require-handlebars-plugin/hbs",
    "handlebars": "components/require-handlebars-plugin/Handlebars",
    "i18nprecompile": "components/require-handlebars-plugin/hbs/i18nprecompile",
    "json2": "lib/json2/json2",
    "eve": "lib/raphael/eve",
    "raphael": "lib/raphael/raphael",
    "morris": "components/morris.js/morris",
    "mtchart.all": "lib/mtchart/mtchart_all",
    "mtchart": "lib/mtchart/mtchart",
    "mtchart.data": "lib/mtchart/data",
    "mtchart.date": "lib/mtchart/date",
    "mtchart.range": "lib/mtchart/range",
    "mtchart.graph": "lib/mtchart/graph",
    "mtchart.graph.cssgraph": "lib/mtchart/graph_cssgraph",
    "mtchart.graph.easel": "lib/mtchart/graph_easel",
    "mtchart.graph.morris": "lib/mtchart/graph_morris",
    "mtchart.list": "lib/mtchart/list",
    "mtchart.slider": "lib/mtchart/slider",
    "app": "js/app",
    "text": "components/requirejs-text/text",
    "json": "components/requirejs-plugins/src/json",
    "easeljs": "lib/EaselJS/easeljs-0.6.1.min",
    "mtapi": "lib/data-api/v1/js/app",
    "mtendpoints": "lib/data-api/v1/js/endpoints"
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
      exports: 'MT.DataAPI'
    },
    'mtendpoints': {
      deps: ['mtapi']
    },
    'json2': {
      exports: 'JSON'
    }
  },
  deps: ['mtapi', 'mtendpoints', 'json2', 'jquery', 'jquery.hammer', 'jquery.cookie', 'jquery.smartresize', 'jquery.smartscroll', 'underscore', 'backbone', 'easeljs'],
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