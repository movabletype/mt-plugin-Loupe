define(['backbone.marionette', 'js/commands', 'hbs!js/views/card/templates/layout', 'js/views/card/layout', 'js/views/common/view_header', 'js/views/common/share'],

function (Marionette, commands, template, CardLayout, CommonHeaderView, shareView) {
  "use strict";

  return CardLayout.extend({
    initialize: function (options) {
      this.card = options.card;
      this.params = options.params;
      this.viewHeader = this.card.viewItemHeader;
      this.viewView = this.card.viewItemView;
      this.viewTemplate = this.card.viewItemTemplate;
      this.viewData = this.card.viewItemData;
    },

    template: function (data) {
      return template(data);
    }
  });
});
