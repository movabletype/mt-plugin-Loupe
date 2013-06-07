define(['backbone.marionette', 'js/views/common/view_header', 'hbs!cards/stats/templates/post_header', 'js/device', 'js/commands', 'js/trans'],

function (Marionette, viewHeader, template, device, commands, Trans) {
  "use strict";

  return viewHeader.extend({
    template: function (data) {
      return template(data);
    },

    ui: {
      backDashboardButton: '#back-dashboard',
      shareButton: '#share-button'
    },

    onRender: function () {
      this.ui.backDashboardButton.hammer(device.options.hammer()).on('tap', function () {
        commands.execute('router:navigate', '');
      });

      this.ui.shareButton.hammer(device.options.hammer()).on('tap', _.bind(function () {
        commands.execute('card:stats:share:show', '');
      }, this));
    },

    serializeData: function () {
      var data = viewHeader.prototype.serializeData.apply(this);
      data.post = this.object || {};
      return data;
    }
  });
});
