define(['js/views/card/itemview', 'hbs!js/views/card/templates/header', 'js/device', 'js/commands'],

function (CardItemView, template, device, commands) {
  "use strict";

  return CardItemView.extend({

    template: template,

    ui: {
      backDashboardButton: '#back-dashboard',
      shareButton: '#share-button'
    },

    initialize: function () {
      CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
      this.setTranslation();
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
        commands.execute('card:' + this.card.id + ':share:show', '');
      }, this));
    },

    serializeData: function () {
      var data = this.serializeDataInitialize();
      data = _.extend(data, _.clone(this.card));
      data.trans = this.trans;
      return data;
    }
  });
});
