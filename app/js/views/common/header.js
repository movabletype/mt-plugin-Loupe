define(['backbone.marionette', 'js/device', 'js/commands', 'hbs!js/views/common/template/header'],

function (Marionette, device, commands, template) {
  "use strict";

  return Marionette.ItemView.extend({

    template: function (data) {
      return template(data);
    },

    ui: {
      showSideMenu: '#show-sidemenu'
    },

    initialize: function (data) {
      this.data = data;
    },

    onRender: function () {
      this.ui.showSideMenu.hammer(device.options.hammer()).on('tap', function () {
        commands.execute('sidemenu:toggle');
      });
    },

    serializeData: function () {
      return this.data;
    }
  });
});
