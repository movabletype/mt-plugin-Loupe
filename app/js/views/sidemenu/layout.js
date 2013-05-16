define(['backbone.marionette', 'js/views/sidemenu/main', 'hbs!js/views/sidemenu/templates/layout'],

function (Marionette, MainView, template) {
  "use strict";

  return Marionette.Layout.extend({
    template: function (data) {
      return template(data);
    },
    initialize: function () {
      this.$el.addClass('container');
    },
    regions: {
      main: '#sidemenu-main',
    },
    onRender: function () {
      this.main.show(new MainView())
    }
  });
});