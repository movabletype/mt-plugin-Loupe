define(['backbone.marionette', 'hbs!js/views/common/template/view_header', 'js/device', 'js/commands', 'js/trans'],

function (Marionette, template, device, commands, Trans) {
  "use strict";

  return Marionette.ItemView.extend({

    template: function (data) {
      return template(data);
    },

    ui: {
      backDashboardButton: '#back-dashboard',
      shareButton: '#share-button'
    },

    initialize: function (options) {
      this.params = options.params;
      this.settings = options.settings;

      this.trans = null;
      commands.execute('l10n', _.bind(function (l10n) {
        var transId = 'card_' + this.settings.id;
        l10n.load('cards/' + this.settings.id + '/l10n', transId).done(_.bind(function () {
          this.trans = new Trans(l10n, transId);
          this.render();
        }, this));
      }, this));

      commands.setHandler('header:render', _.bind(function (data) {
        this.object = data;
        this.render();
      }, this));
    },

    onRender: function () {
      this.ui.backDashboardButton.hammer(device.options.hammer()).on('tap', function () {
        commands.execute('router:navigate', '');
      });

      this.ui.shareButton.hammer(device.options.hammer()).on('tap', _.bind(function () {
        commands.execute('card:' + this.settings.id + ':share:show', '');
      }, this));
    },

    serializeData: function () {
      var data = this.settings;
      data.trans = this.trans;
      return data;
    }
  });
});
