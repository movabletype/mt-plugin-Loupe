define(['backbone.marionette', 'js/views/card/header'],

function (Marionette, viewHeader) {
  "use strict";

  return viewHeader.extend({
    serializeData: function () {
      var data = viewHeader.prototype.serializeData.apply(this);
      data.post = this.object || {};
      if (data.post.status === 'Publish') {
        data.shareEnabled = true;
      }
      return data;
    }
  });
});
