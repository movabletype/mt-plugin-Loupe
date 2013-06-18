define(['backbone.marionette', 'hbs!js/views/share/templates/share', 'js/device', 'js/commands', 'js/trans'],

function (Marionette, template, device, commands, Trans) {
  "use strict";

  return Marionette.ItemView.extend({

    template: function (data) {
      return template(data);
    },

    initialize: function (options) {
      this.share = options ? options.share : {};
      this.$el.addClass('share-inner');

      this.trans = null;
      commands.execute('l10n', _.bind(function (l10n) {
        this.trans = new Trans(l10n, null);
        this.render();
      }, this));
    },

    onRender: function () {
      this.$el.find('#share-close').hammer(device.options.hammer()).on('tap', _.bind(function () {
        commands.execute('share:close');
      }, this));
    },

    serializeData: function () {
      var data = this.share;
      data.tweetUrl = data.url;
      data.tweetText = $('<div>').html(data.tweetText).text();
      if ((data.tweetUrl + data.tweetText).length > 140) {
        var length = 140 - data.tweetUrl.length - 4;
        data.tweetText = data.tweetText.slice(0, length) + '...';
      }

      data.trans = this.trans;
      return data;
    }
  });
});
