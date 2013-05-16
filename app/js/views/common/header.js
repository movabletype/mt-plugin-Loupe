define(['backbone.marionette', 'js/commands', 'hbs!js/views/common/template/header'],

function (Marionette, commands, template) {
  "use strict";

  return Marionette.ItemView.extend({

    template: function (data) {
      return template(data);
    },

    ui: {
      showSideMenu: '#show-sidemenu'
    },

    initialize: function (data) {
      // this.$el.addClass('header-container');
      this.data = data;
    },

    onRender: function () {
      this.ui.showSideMenu.hammer().on('tap', function () {
        commands.execute('sidemenu:toggle');
      });
    },

    serializeData: function () {
      return this.data;
    }
  });
});