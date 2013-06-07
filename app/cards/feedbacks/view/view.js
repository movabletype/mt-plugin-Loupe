define(['backbone.marionette', 'app', 'js/mtapi', 'js/device', 'js/commands', 'js/trans', 'moment', 'moment.lang', 'cards/feedbacks/models/comments_collection', 'cards/feedbacks/models/comments_model', 'cards/feedbacks/models/comments_entry_model', 'cards/feedbacks/models/comments_entry_collection', 'hbs!cards/feedbacks/templates/view', 'hbs!cards/feedbacks/templates/reply'],

function (Marionette, app, mtapi, device, commands, Trans, moment, momentLang, Collection, Model, EntryModel, EntryCollection, template, replyTemplate) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    },

    ui: {
      button: '#accept-button',
      replyContainer: '#reply-container',
      reply: '#reply-button'
    },

    initialize: function (options) {
      this.user = options.user;
      this.type = options.params[0];
      this.blogId = options.params[1];
      this.commentId = options.params[2];
      this.collection = app.dashboardCardsData.feedbacks = app.dashboardCardsData.feedbacks || new Collection();
      this.entryCollection = app.dashboardCardsData.feedbacksCommentsEntry = app.dashboardCardsData.feedbacksCommentsEntry || new EntryCollection();
      this.model = this.collection.get(this.commentId);
      this.loading = true;
      this.entryLoading = true;
      this.settings = options.settings;

      this.trans = null;
      commands.execute('l10n', _.bind(function (l10n) {
        var transId = 'card_' + this.settings.id;
        this.l10n = l10n;
        l10n.load('cards/' + this.settings.id + '/l10n', transId).done(_.bind(function () {
          this.trans = new Trans(l10n, transId);
          if (this.model) {
            this.loading = false;
            this.render();
          } else {
            this.render();
            this.model = new Model({
              id: this.commentId
            });
            this.model.fetch({
              blogId: this.blogId,
              success: _.bind(function () {
                this.collection.add(this.model);
                this.loading = false;
                this.render();
              }, this),
              error: _.bind(function () {
                this.error = true;
                this.loading = false;
                this.render();
              }, this)
            });
          }
        }, this));
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
            console.log('success')
            console.log(this.model.toJSON());
            this.render();
          }, this);

          if (entry) {
            success(entry.toJSON());
          } else {
            entry = new EntryModel({
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
          replied: false
        }));
      }, this));

      this.ui.replyContainer.hammer(device.options.hammer()).on('tap', '#do-reply-button', _.bind(function () {
        var body = $('#reply-textarea').val();
        var data = this.model.toJSON();
        console.log(data.entry.id)
        if (body.length) {
          var reply = {
            author: this.user,
            entry: data.entry,
            blog: data.blog,
            parent: this.commentId,
            date: moment().format(),
            body: body
          }
          this.ui.replyContainer.prepend('<div class="loading"></div>');
          mtapi.api.createReplyComment(this.blogId, data.entry.id, this.commentId, reply, _.bind(function (resp) {
            if (!resp.error) {
              this.ui.replyContainer.html(replyTemplate({
                replied: true,
                body: body
              }));
              var newComment = new Model();
              newComment.set(resp);
              this.collection.unshift(newComment);
            } else {
              // error handling
            }
          }, this));
        }
      }, this));

      this.ui.button.hammer(device.options.hammer()).on('tap', _.bind(function () {
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
            console.log(this.model.toJSON());
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
      var data = {};
      if (this.model) {
        data = this.model.toJSON();
        if (data.author) {
          var lang = this.l10n.userLang.split('-');
          if (lang === 'us') {
            lang = ''
          }
          data.lang = lang;
        }
        if (data.entry && data.entry.fetched) {
          this.entryLoading = false;
        }
      }
      data.trans = this.trans;
      data.error = this.error ? true : false;
      data.loading = this.loading ? true : false;
      data.entryError = this.entryError ? true : false;
      data.entryLoading = this.entryLoading ? true : false;
      data.accepted = this.accepted ? true : false;
      data.acceptionFailed = this.acceptionFailed ? true : false;
      return data;
    }
  });
});
