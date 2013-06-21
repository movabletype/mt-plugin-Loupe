define(['js/views/card/itemview',
    'js/commands',
    'hbs!cards/feedbacks/templates/comment'
],

function (CardItemView, commands, template) {
  'use strict';

  return CardItemView.extend({
    template: template,

    ui: {
      button: '#accept-button',
      undo: '#comment-undo'
    },

    initialize: function (options) {
      CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
      this.fetchError = options.fetchError;
      if (!this.fetchError) {
        this.collection = options.collection;
        this.model = options.model;
        this.entryModel = options.entryModel;

        this.commentApprovePerm = false;

        var entry = this.entryModel.toJSON();
        if (entry.status === 'Publish') {
          if (this.userIsSystemAdmin() || (this.userHasPermission('manage_feedback') || this.userHasPermission('edit_all_posts'))) {
            this.commentApprovePerm = true;
          } else {
            if ((entry.author && entry.author.displayName === this.user.name) && this.userHasPermission('publish_post')) {
              this.commentApprovePerm = true;
            }
          }
        }
      }
      this.loading = false;
      this.setTranslation();
    },

    update: function (status) {
      this.loading = true;
      this.render();
      var options = {
        status: status,
        success: _.bind(function (resp) {
          if (DEBUG) {
            console.log(resp);
            console.log('update sccuess');
          }
          this.loading = false;
          this.accepted = true;
          this.model.set(this.model.parse(resp));
          this.render();
          commands.execute('card:feedbacks:reply:render');
        }, this),
        error: _.bind(function (resp) {
          if (DEBUG) {
            console.log(resp);
            console.log('failed update');
          }
          this.error = resp.error;
          this.loading = false;
          this.acceptionFailed = true;
          this.render();
        }, this)
      };
      this.model.sync('update', this.model, options);
    },

    onRender: function () {
      if (this.acceptionFailed) {
        this.$el.find('.acception-failed .close-me').hammer().on('tap', function () {
          $(this).parent().remove();
        });
      }

      this.ui.button.hammer(this.hammerOpts).on('tap', _.bind(function (e) {
        this.addTapClass(e.currentTarget);
        this.update('Approved');
      }, this));

      this.ui.undo.hammer(this.hammerOpts).on('tap', _.bind(function (e) {
        this.addTapClass(e.currentTarget);
        this.update('Pending');
      }, this))
    },

    serializeData: function () {
      var data = this.serializeDataInitialize();
      if (this.model) {
        data = _.extend(data, this.model.toJSON());
      }
      data.accepted = this.accepted;
      data.acceptionFailed = this.acceptionFailed;
      data.error = this.error;
      data.commentApprovePerm = this.commentApprovePerm;
      return data;
    }
  });
});
