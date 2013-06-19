define(['js/views/card/itemview_layout',
    'js/cache',
    'cards/feedbacks/models/comments_collection',
    'cards/feedbacks/models/comments_model',
    'hbs!cards/feedbacks/templates/layout',
    'cards/feedbacks/view/comment',
    'cards/feedbacks/view/reply',
    'cards/feedbacks/view/entry'
],

function (CardItemViewLayout, cache, Collection, Model, template, commentView, replyView, entryView) {
  'use strict';

  return CardItemViewLayout.extend({
    template: template,

    regions: {
      comment: '#comment',
      reply: '#reply',
      entry: '#feedbacks-comment-entry'
    },

    initialize: function (options) {
      CardItemViewLayout.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

      var routes = options.routes;
      this.options = options;

      this.type = routes[0];
      this.blogId = routes[1];
      this.commentId = routes[2];

      this.collection = cache.get(this.blogId, 'feedbacks_comments') || cache.set(this.blogId, 'feedbacks_comments', new Collection(this.blogId));
      this.model = this.collection.get(this.commentId);

      this.setTranslation(_.bind(function () {
        if (this.model) {
          this.loading = false;
        } else {
          this.render();
          this.model = new Model({
            blogId: this.blogId,
            id: this.commentId
          });
          this.fetch();
        }
      }, this));
    },

    fetch: function () {
      CardItemViewLayout.prototype.fetch.call(this, {
        successCallback: _.bind(function () {
          this.collection.add(this.model);
        }, this)
      })
    },

    build: function () {
      var data = this.model.toJSON();
      var options = _.extend(this.options, {
        model: this.model,
        collection: this.collection,
        type: this.type,
        blogId: this.blogId,
        commentId: this.commentId,
        entryId: data.entry ? data.entry.id : null
      });
      this.comment.show(new commentView(options));
      this.reply.show(new replyView(options));
      this.entry.show(new entryView(options));
    },

    onRender: function () {
      if (this.fetchError) {
        this.comment.show(new commentView({
          fetchError: this.fetchError
        }));
        this.entry.show(new entryView({
          fetchError: this.fetchError
        }))
      } else {
        if (this.model) {
          this.build();
        }
      }
    },

    serializeData: function () {
      var data = this.serializeDataInitialize();
      return data;
    }
  });
});
