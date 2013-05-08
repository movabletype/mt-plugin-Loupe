define(['backbone.marionette', 'backbone.marionette.handlebars', 'hbs!js/views/common/template/view_header', 'js/commands'],

function (Marionette, MarionetteHandlebars, template, commands) {
  "use strict";

  return Marionette.ItemView.extend({

    template: function (data) {
      return template(data);
    },

    ui: {
      backDashboardButton: '#back-dashboard'
    },

    initialize: function (data) {
      this.data = data;
    },

    onRender: function () {
      this.ui.backDashboardButton.hammer().on('tap', function () {
        commands.execute('router:navigate', '');
      });
    },

    serializeData: function () {
      return this.data;
    }
  });
});