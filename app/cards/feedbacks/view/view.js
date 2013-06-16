define(['js/views/card/itemview',
    'js/cache',
    'js/mtapi',
    'js/device',
    'js/commands',
    'js/trans',
    'moment',
    'moment.lang',
    'cards/feedbacks/models/comments_collection',
    'cards/feedbacks/models/comments_model',
    'js/models/entry',
    'js/collections/entries',
    'hbs!cards/feedbacks/templates/view',
    'hbs!cards/feedbacks/templates/reply'
],

function (CardItemView, cache, mtapi, device, commands, Trans, moment, momentLang, CommentsCollection, Model, EntryModel, EntryCollection, template, replyTemplate) {
  'use strict';

  return CardItemView.extend({
    template: template,

    ui: {
      button: '#accept-button',
      replyContainer: '#reply-container',
      reply: '#reply-button'
    },

    initialize: function (options) {
      CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

      var routes = options.routes;
      this.type = routes[0];
      this.blogId = routes[1];
      this.commentId = routes[2];

      this.collection = cache.get(this.blogId, 'feedbacks_comments') || cache.set(this.blogId, 'feedbacks_comments', new CommentsCollection(this.blogId));
      this.entryCollection = cache.get(this.blogId, 'entries') || cache.set(this.blogId, 'entries', new EntryCollection(this.blogId));
      this.model = this.collection.get(this.commentId);

      this.entryLoading = true;

      this.setTranslation(_.bind(function () {
        if (this.model) {
          this.loading = false;
          this.render();
        } else {
          this.render();
          this.model = new Model({
            blogId: this.blogId,
            id: this.commentId
          });
          this.model.fetch({
            success: _.bind(function () {
              this.collection.add(this.model);
              this.loading = false;
              this.render();
            }, this),
            error: _.bind(function () {
              this.fetchError = true;
              this.entryError = true;
              this.entryLoading = false;
              this.loading = false;
              this.render();
            }, this)
          });
        }
      }, this));

      commands.setHandler('card:acception:share:show', _.bind(function () {
        var data = this.serializeData();
        commands.execute('share:show', {
          share: {
            url: data.permalink,
            tweetText: (data.title + ' ' + data.excerpt)
          }
        });
      }, this))
    },

    onRender: function () {
      if (this.acceptionFailed) {
        this.$el.find('.acception-failed .close-me').hammer().on('tap', function () {
          $(this).parent().remove();
        });
      }

      if (this.model) {
        var data = this.model.toJSON();
        if (data.entry && !data.entry.fetched) {
          var entry = this.entryCollection.get(data.entry.id) || null
          var success = _.bind(function (entry) {
            this.entryLoading = false;
            entry.fetched = true;
            this.model.set({
              entry: entry
            });
            this.render();
          }, this);

          if (entry) {
            success(entry.toJSON());
          } else {
            entry = new EntryModel({
              blogId: this.blogId,
              id: data.entry.id
            });
            entry.fetch({
              blogId: data.blog.id,
              success: _.bind(function (entry) {
                success(entry.toJSON());
                this.entryCollection.add(entry);
              }, this),
              fail: _.bind(function () {
                this.entryError = true;
                this.entryLoading = false;
              })
            })
          }
        }
      }

      this.ui.replyContainer.hammer(device.options.hammer()).on('tap', '#reply-button', _.bind(function () {
        this.ui.replyContainer.html(replyTemplate({
          replied: false,
          trans: this.trans
        }));
      }, this));

      this.ui.replyContainer.hammer(device.options.hammer()).on('tap', '#do-reply-button', _.bind(function () {
        var body = $('#reply-textarea').val();
        var data = this.model.toJSON();
        if (body.length) {
          var reply = {
            author: this.user,
            entry: data.entry,
            blog: data.blog,
            parent: this.commentId,
            date: moment().format(),
            body: body,
            trans: this.trans
          }
          this.ui.replyContainer.prepend('<div class="loading"></div>');
          mtapi.api.createReplyComment(this.blogId, data.entry.id, this.commentId, reply, _.bind(function (resp) {
            if (!resp.error) {
              this.ui.replyContainer.html(replyTemplate({
                replied: true,
                body: body,
                trans: this.trans
              }));
              var newComment = new Model({
                blogId: this.blogId
              });
              newComment.set(resp);
              this.collection.unshift(newComment);
            } else {
              // error handling
            }
          }, this));
        }
      }, this));

      this.ui.button.hammer(this.hammerOpts).on('tap', _.bind(function () {
        this.loading = true;
        this.render();
        var options = {
          success: _.bind(function (resp) {
            if (DEBUG) {
              console.log(resp);
              console.log('approve sccuess');
            }
            this.loading = false;
            this.accepted = true;
            this.model.set(this.model.parse(resp));
            this.render();
          }, this),
          error: _.bind(function () {
            if (DEBUG) {
              console.log('failed approve');
            }
            this.loading = false;
            this.acceptionFailed = true;
            this.render();
          }, this)
        };
        this.model.sync('update', this.model, options);
      }, this));
    },

    serializeData: function () {
      var data = this.serializeDataInitialize();
      if (this.model) {
        data = _.extend(data, this.model.toJSON());
        if (data.entry && data.entry.fetched) {
          this.entryLoading = false;
        }
      }
      data.entryError = this.entryError;
      data.entryLoading = this.entryLoading;
      data.accepted = this.accepted;
      data.acceptionFailed = this.acceptionFailed;
      return data;
    }
  });
});
