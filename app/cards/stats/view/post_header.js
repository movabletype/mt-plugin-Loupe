define(['backbone.marionette', 'js/views/common/view_header', 'js/device', 'js/commands', 'js/trans'],

function (Marionette, viewHeader, device, commands, Trans) {
  "use strict";

  return viewHeader.extend({
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
      if (this.object) {
        data.post = this.object || {};
        data.shareEnabled = data.post.status === 'Publish';
      }
      return data;
    }
  });
});
