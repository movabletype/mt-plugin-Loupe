define(['js/views/card/itemview',
    'js/mtapi',
    'js/commands',
    'moment',
    'moment.lang',
    'cards/feedbacks/models/comments_model',
    'hbs!cards/feedbacks/templates/reply'
  ],

  function (CardItemView, mtapi, commands, moment, momentLang, Model, template) {
    'use strict';

    return CardItemView.extend({
      template: template,

      ui: {
        replyButton: '#reply-button',
        doReplyButton: '#do-reply-button',
        replyTextarea: '#reply-textarea'
      },


      initialize: function (options) {
        CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
        this.type = options.type;
        this.blogId = options.blogId;
        this.commentId = options.commentId;
        this.model = options.model;
        this.collection = options.collection;
        this.entryModel = options.entryModel;
        this.initial = true;
        this.loading = false;
        this.setTranslation();
        commands.setHandler('card:feedbacks:reply:render', this.render);
      },

      commentIsApproved: function () {
        var comment = this.model.toJSON();
        return comment.status === 'Approved';
      },

      entryIsPublished: function () {
        var entry = this.entryModel.toJSON();
        return entry.status === 'Publish';
      },

      commentApprovePerm: function () {
        var entry = this.entryModel.toJSON(),
          ret = false;

        if (entry.status === 'Publish') {
          if (this.userIsSystemAdmin() || (this.userHasPermission('manage_feedback') || this.userHasPermission('edit_all_posts'))) {
            ret = true;
          } else {
            if ((entry.author && entry.author.displayName === this.user.name) && this.userHasPermission('publish_post')) {
              ret = true;
            }
          }
        }
        return ret;
      },

      onRender: function () {
        if (this.entryIsPublished() && this.commentIsApproved() && this.commentApprovePerm()) {
          this.ui.replyButton.hammer(this.hammerOpts).on('tap', _.bind(function (e) {
            this.addTapClass(e.currentTarget, _.bind(function () {
              this.initial = false;
              this.form = true;
              this.body = false;
              this.replied = false;
              this.loading = false;
              this.render();
            }, this));
          }, this));

          this.ui.doReplyButton.hammer(this.hammerOpts).on('tap', _.bind(function (e) {
            this.addTapClass(e.currentTarget, _.bind(function () {
              var body = this.ui.replyTextarea.val();
              var data = this.model.toJSON();
              if (body.length) {
                var reply = {
                  author: this.user,
                  entry: data.entry,
                  blog: data.blog,
                  parent: this.commentId,
                  date: moment().format(),
                  body: body
                }
                this.body = body;
                this.loading = true;
                this.render();

                mtapi.api.createReplyComment(this.blogId, data.entry.id, this.commentId, reply, _.bind(function (resp) {
                  if (!resp.error) {
                    this.form = false;
                    this.replied = true;
                    this.body = body;
                    this.loading = false;
                    var newComment = new Model();
                    newComment.set(resp);
                    this.collection.unshift(newComment);
                    this.render();
                  } else {
                    this.form = true;
                    this.replied = false;
                    this.body = body;
                    this.loading = false;
                    this.error = resp.error && resp.error.message ? resp.error.message : 'request failed';
                    this.render();
                  }
                }, this));
              }
            }, this));
          }, this));
        }
      },

      serializeData: function () {
        var data = this.serializeDataInitialize();
        data = _.extend(data, this.model.toJSON());
        data.commentIsApproved = this.commentIsApproved();
        data.entryIsPublished = this.entryIsPublished();
        data.commentApprovePerm = this.commentApprovePerm();
        data.error = this.error;
        data.initial = this.initial;
        data.form = this.form;
        data.replied = this.replied;
        data.body = this.body || '';
        return data;
      }
    });
  });
