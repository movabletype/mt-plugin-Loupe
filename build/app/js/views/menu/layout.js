define(['backbone.marionette', 'app', 'js/device', 'js/commands', 'js/views/menu/main', 'hbs!js/views/menu/templates/layout'],

function (Marionette, app, device, commands, MainView, template) {
  "use strict";

  return Marionette.Layout.extend({
    template: template,

    initialize: function (options) {
      this.options = options;
      this.$el.addClass('container');
    },
    regions: {
      main: '#menu-main'
    },
    onRender: function () {
      this.main.show(new MainView(this.options));

      commands.setHandler('menu:show', _.bind(function () {
        this.$el.css({
          display: 'block'
        });
      }, this));

      commands.setHandler('menu:hide', _.bind(function () {
        this.$el.css({
          display: 'none'
        });
      }, this));
    }
  });
});
