define(['js/views/card/itemview_layout',
    'js/cache',
    'cards/feedbacks/models/comments_collection',
    'cards/feedbacks/models/comments_model',
    'js/collections/entries',
    'js/models/entry',
    'hbs!cards/feedbacks/templates/layout',
    'cards/feedbacks/view/comment',
    'cards/feedbacks/view/reply',
    'cards/feedbacks/view/entry'
  ],

  function (CardItemViewLayout, cache, Collection, Model, EntryCollection, EntryModel, template, commentView, replyView, entryView) {
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
            this.fetchEntry();
          } else {
            this.render();
            this.model = new Model({
              id: this.commentId
            });
            this.fetch();
          }
        }, this));
      },

      fetch: function () {
        CardItemViewLayout.prototype.fetch.call(this, {
          blogId: this.blogId,
          successCallback: _.bind(function () {
            this.collection.add(this.model);
            this.loading = true;
            this.fetchEntry()
          }, this)
        })
      },

      fetchEntry: function () {
        var data = this.model.toJSON(),
          entryId = data.entry ? data.entry.id : null;

        this.entryCollection = cache.get(this.blogId, 'entries') || cache.set(this.blogId, 'entries', new EntryCollection(this.blogId));
        this.entryModel = this.entryCollection.get(entryId);
        if (this.entryModel) {
          this.loading = false;
          this.fetchError = false;
          this.render();
          setTimeout(_.bind(function () {
            this.build();
          }, this), 0)
        } else {
          this.entryModel = new EntryModel({
            blogId: this.blogId,
            id: entryId
          });
          var options = {
            success: _.bind(function () {
              this.loading = false;
              this.fetchError = false;
              this.render();
              setTimeout(_.bind(function () {
                this.entryCollection.add(this.entryModel);
                this.build();
              }, this), 0)
            }, this),
            error: _.bind(function () {
              this.loading = false;
              this.fetchError = true;
              this.render();
            }, this)
          };
          this.entryModel.fetch(options);
        }
      },

      build: function () {
        var data = this.model.toJSON();
        var options = _.extend(this.options, {
          model: this.model,
          collection: this.collection,
          type: this.type,
          blogId: this.blogId,
          commentId: this.commentId,
          entryModel: this.entryModel
        });
        this.comment.show(new commentView(options));
        this.reply.show(new replyView(options));
        this.entry.show(new entryView(options));
      },

      onRender: function () {
        if (this.fetchError) {
          this.handleRefetch();
          var options = _.extend(this.options, {
            fetchError: this.fetchError
          })
          this.comment.show(new commentView(options));
          this.entry.show(new entryView(options))
        }
      },

      serializeData: function () {
        var data = this.serializeDataInitialize();
        return data;
      }
    });
  });
