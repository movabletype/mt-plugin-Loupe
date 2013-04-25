define(['backbone.marionette', 'backbone.marionette.handlebars', 'js/vent', 'hbs!js/views/dashboard/templates/layout', 'js/views/common/header', 'js/views/dashboard/main'],

function (Marionette, MarionetteHandlebars, vent, template, HeaderView, MainLayout) {
  "use strict";

  return Marionette.Layout.extend({
    template: {
      type: 'handlebars',
      template: template
    },

    regions: {
      header: '#header',
      main: '#main',
      footer: '#footer'
    },

    initialize: function (options) {
      this.widgets = options.widgets;
    },

    onRender: function () {
      this.$el.addClass('container');
      this.header.show(new HeaderView({
        title: 'Dashboard'
      }));
      this.main.show(new MainLayout({
        widgets: this.widgets
      }));
    }
  });
});