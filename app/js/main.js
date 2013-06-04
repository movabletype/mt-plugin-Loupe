require.config(
{
  "baseUrl": ".",
  "paths": {
    "underscore": "components/underscore/underscore",
    "backbone": "components/backbone/backbone",
    "backbone.localStorage": "components/backbone.localStorage/backbone.localStorage",
    "backbone.wreqr": "components/backbone.wreqr/lib/amd/backbone.wreqr",
    "backbone.babysitter": "components/backbone.babysitter/lib/amd/backbone.babysitter",
    "backbone.marionette": "components/backbone.marionette/lib/core/amd/backbone.marionette",
    "jquery": "lib/jquery/jquery-1.10.1",
    "jquery.hammer": "components/hammerjs/dist/jquery.hammer",
    "jquery.smartresize": "components/jquery-smartresize/jquery.debouncedresize",
    "jquery.smartscroll": "lib/smartscroll/smartscroll",
    "hbs": "components/require-handlebars-plugin/hbs",
    "handlebars": "components/require-handlebars-plugin/Handlebars",
    "i18nprecompile": "components/require-handlebars-plugin/hbs/i18nprecompile",
    "json2": "lib/json2/json2",
    "eve": "lib/raphael/eve",
    "raphael": "lib/raphael/raphael",
    "morris": "components/morris.js/morris",
    "moment": "components/moment/moment",
    "mtchart": "lib/chart-api/core/amd/mtchart.core.amd",
    "app": "js/app",
    "text": "components/requirejs-text/text",
    "json": "components/requirejs-plugins/src/json",
    "easeljs": "lib/EaselJS/easeljs-0.6.1.min",
    "perf": "js/perf"
  },
  "shim": {
    "underscore": {
      "exports": "_"
    },
    "backbone": {
      "exports": "Backbone",
      "deps": ["jquery", "underscore"]
    },
    "morris": {
      "exports": "Morris",
      "deps": ["raphael"]
    },
    "easeljs": {
      "exports": "createjs"
    },
    "json2": {
      "exports": "JSON"
    },
    "jquery.hammer": ["jquery"],
    "jquery.smartresize": ["jquery"],
    "jquery.smartscroll": ["jquery"]
  },
  "deps": ["json2", "jquery", "jquery.hammer", "jquery.smartresize", "jquery.smartscroll", "underscore", "backbone"],
  "locale": "ja_jp",
  "hbs": {
    "disableI18n": true,
    "disableHelpers": false,
    "templateExtension": "hbs",
    "compileOptions": {}
  }
}

);

window.DEBUG = true;
require(['js/boot'], function () {});
