define(['backbone.marionette', 'js/commands', 'js/views/card/itemview'],

function (Marionette, commands, CardItemView) {
  "use strict";

  var cardItemViewLayoutProto = _.extend({}, CardItemView.cardItemViewProto, {

  });

  return Marionette.Layout.extend(cardItemViewLayoutProto, {
    cardItemViewLayoutProto: cardItemViewLayoutProto
  });
});
