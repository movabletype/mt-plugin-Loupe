define(['backbone.marionette', 'app', 'js/device', 'js/commands', 'js/trans', 'cards/feedbacks/models/comments_collection', 'hbs!cards/feedbacks/templates/dashboard', 'cards/feedbacks/dashboard/comments_itemview'],

function (Marionette, app, device, commands, Trans, CommentsCollection, template, commentsItemView) {
  "use strict";

  return Marionette.CompositeView.extend({
    template: function (data) {
      return template(data);
    },

    itemView: commentsItemView,
    itemViewContainer: '#feedback-comments-list',

    appendHtml: function (cv, iv) {
      if (!this.loading) {
        var $container = this.getItemViewContainer(cv);
        $container.append(iv.el);
      }
    },

    serializeData: function () {
      var data = {};
      if (!this.loading) {
        data.totalResults = parseInt(this.collection.totalResults, 10);
        if (data.totalResults > this.collection.length) {
          data.showMoreButton = true
        }
      }
      data.loading = this.loading ? true : false;
      data.moreLoading = this.moreLoading ? true : false;
      data.name = this.settings.name || '';
      data.trans = this.trans;
      return data;
    },

    fetch: function (limit, offset) {
      this.collection.fetch({
        blogId: this.blogId,
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        merge: true,
        remove: false,
        success: _.bind(function () {
          this.loading = false;
          this.moreLoading = false;
          this.render();
        }, this)
      });
    },

    initialize: function (options) {
      this.blogId = options.params.blog.id;
      this.collection = app.dashboardCardsData.feedbacks = app.dashboardCardsData.feedbacks || new CommentsCollection();
      this.settings = options.settings;
      this.loading = true;

      this.trans = null;
      commands.execute('l10n', _.bind(function (l10n) {
        var transId = 'card_' + this.settings.id;
        l10n.load('cards/' + this.settings.id + '/l10n', transId).done(_.bind(function () {
          this.trans = new Trans(l10n, transId);
          if (!this.collection.isSynced) {
            this.render();
            this.fetch(3);
          } else {
            this.loading = false;
            this.render();
          }
        }, this));
      }, this));

      this.$el.hammer(device.options.hammer()).on('tap', '#feedbacks-readmore', _.bind(function () {
        var offset = this.collection.length;
        this.moreLoading = true;
        this.render();
        this.fetch(5, offset);
      }, this));

      this.$el.hammer(device.options.hammer()).on('tap', 'a', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var route = $(this).data('route') || '';
        commands.execute('router:navigate', route);
        return false;
      });
    },

    onRender: function () {
      if (this.error) {
        this.$el.find('.refetch').hammer(device.options.hammer()).one('tap', _.bind(function () {
          this.loading = true;
          this.error = false;
          this.render();
          this.fetch();
        }, this));
      }
    }
  });
});
