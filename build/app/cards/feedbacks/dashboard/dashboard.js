define(['js/cache', 'js/device', 'js/commands', 'template/helpers/trans', 'cards/feedbacks/models/comments_collection', 'hbs!cards/feedbacks/templates/dashboard', 'cards/feedbacks/dashboard/comments_itemview', 'js/views/card/composite'],

  function (cache, device, commands, translation, CommentsCollection, template, commentsItemView, CardCompositeView) {
    "use strict";

    return CardCompositeView.extend({
      template: template,

      itemView: commentsItemView,
      itemViewContainer: '#feedback-comments-list',

      initialize: function (options) {
        CardCompositeView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

        this.collection = cache.get(this.blogId, 'feedbacks_comments') || cache.set(this.blogId, 'feedbacks_comments', new CommentsCollection(this.blogId));

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
        this.handleRefetch((this.fetchErrorOption || options));
      },

      serializeData: function () {
        var data = this.serializeDataInitialize();
        data.title = data.name;
        if (!this.loading) {
          data.count = parseInt(this.collection.totalResults, 10);
          if (data.count > this.collection.length) {
            data.showMoreButton = true
          }
          if (data.count === 0) {
            var item = {
              id: null,
              body: translation(this.trans, 'welcome to Loupe! - this card lists the new comments')
            };
            data.items = [];
            for (var i = 0; i < 3; i++) {
              data.items.push(item);
            }
          }
        }
        return data;
      }
    });
  });
