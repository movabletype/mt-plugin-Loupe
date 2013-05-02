define(['backbone.marionette', 'backbone.marionette.handlebars', 'hbs!js/views/dashboard/templates/layout', 'js/views/common/header', 'js/views/dashboard/main'],

function (Marionette, MarionetteHandlebars, template, HeaderView, MainLayout) {
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
      this.params = options.params;
    },

    onRender: function () {
      this.$el.addClass('container');
      this.header.show(new HeaderView());
      this.main.show(new MainLayout({
        widgets: this.widgets,
        params: this.params
      }));
    }
  });
});