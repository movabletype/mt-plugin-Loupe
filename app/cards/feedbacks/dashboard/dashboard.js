define(['js/cache', 'js/device', 'js/commands', 'js/trans', 'cards/feedbacks/models/comments_collection', 'hbs!cards/feedbacks/templates/dashboard', 'cards/feedbacks/dashboard/comments_itemview', 'js/views/card/composite'],

function (cache, device, commands, Trans, CommentsCollection, template, commentsItemView, CardCompositeView) {
  "use strict";

  return CardCompositeView.extend({
    template: template,

    itemView: commentsItemView,
    itemViewContainer: '#feedback-comments-list',

    serializeData: function () {
      var data = this.serializeDataInitialize();
      data.title = data.name;
      if (!this.loading) {
        data.count = parseInt(this.collection.totalResults, 10);
        if (data.count > this.collection.length) {
          data.showMoreButton = true
        }
      }
      return data;
    },

    initialize: function (options) {
      CardCompositeView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

      this.collection = cache.get('feedbacks_comments_' + this.blogId) || cache.set('feedbacks_comments_' + this.blogId, new CommentsCollection(this.blogId));

      this.setTranslation(_.bind(function () {
        if (!this.collection.isSynced) {
          this.render();
          this.fetch({
            limit: 3,
            reset: true
          });
        } else {
          this.loading = false;
          this.render();
        }
      }, this));

      this.handleItemViewNavigate();
    },

    onRender: function () {
      var options = {
        limit: 5,
        offset: this.collection.length
      }
      this.handleReadmore(options);
      this.handleRefetch(options);
    }
  });
});
