define(['backbone.marionette', 'backbone.marionette.handlebars', 'hbs!widgets/stats/templates/view', 'mtchart', 'json!widgets/stats/settings.json'],

function (Marionette, MarionetteHandlebars, template, MTChart, settings) {
  "use strict";

  return Marionette.ItemView.extend({
    template: {
      type: 'handlebars',
      template: template
    },

    onShow: function () {
      MTChart.Build(settings).appendTo($('#my-graph'));
    }
  });
});