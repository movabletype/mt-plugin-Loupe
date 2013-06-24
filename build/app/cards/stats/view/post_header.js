define(['backbone.marionette', 'js/views/card/header', 'js/device', 'js/commands'],

function (Marionette, viewHeader, device, commands) {
  'use strict';

  return viewHeader.extend({
    backButtonRoute: function () {
      return this.card.id;
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
