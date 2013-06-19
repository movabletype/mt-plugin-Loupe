define(['js/views/card/itemview', 'js/cache', 'js/models/entry', 'js/collections/entries', 'hbs!cards/feedbacks/templates/entry'],

function (CardItemView, cache, Model, Collection, template) {
  'use strict';

  return CardItemView.extend({
    template: template,

    initialize: function (options) {
      CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

      this.type = options.type;
      this.entryId = options.entryId;
      this.fetchError = options.fetchError || false;

      this.collection = cache.get(this.blogId, 'entries') || cache.set(this.blogId, 'entries', new Collection(this.blogId));
      this.model = this.collection.get(this.entryId);

      if (this.model) {
        this.loading = false;
      }

      this.setTranslation();
    },

    onRender: function () {
      if (!this.model && this.entryId) {
        this.model = new Model({
          blogId: this.blogId,
          id: this.entryId
        });
        this.fetch();
      }
    },

    fetch: function () {
      CardItemView.prototype.fetch.call(this, {
        successCallback: _.bind(function () {
          this.collection.add(this.model);
        }, this)
      })
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
