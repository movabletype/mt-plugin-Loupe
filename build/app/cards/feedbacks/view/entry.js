define(['js/views/card/itemview', 'hbs!cards/feedbacks/templates/entry'],

function (CardItemView, template) {
  'use strict';

  return CardItemView.extend({
    template: template,

    initialize: function (options) {
      CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
      this.type = options.type;
      this.fetchError = options.fetchError || false;
      if (!this.fetchError) {
        this.model = options.entryModel;
      }
      this.loading = false;
      this.setTranslation();
    },

    serializeData: function () {
      var data = this.serializeDataInitialize();
      if (this.model) {
        data = _.extend(data, this.model.toJSON());
      }
      return data;
    }
  });
});
