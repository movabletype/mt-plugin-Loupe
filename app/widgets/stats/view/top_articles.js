define(['backbone.marionette', 'app', 'js/device', 'js/mtapi/stats_provider', 'widgets/stats/models/top_articles', 'widgets/stats/models/top_articles_itemview_collection', 'widgets/stats/models/top_articles_itemview', 'widgets/stats/view/top_articles_itemview', 'hbs!widgets/stats/templates/top_articles'],

function (Marionette, app, device, statsProvider, Model, Collection, ItemViewModel, ItemView, template) {
  "use strict";

  return Marionette.CompositeView.extend({
    numberOfArticles: 3,

    template: function (data) {
      return template(data);
    },

    itemView: ItemView,
    itemViewContainer: '#top-articles-list',

    appendHtml: function (cv, iv) {
      var $container = this.getItemViewContainer(cv);
      $container.find('#eid-' + iv.model.id).html(iv.el);
    },
    serializeData: function () {
      var data = {};
      var selectedItems = [];

      if (!this.loading) {
        data = this.model.toJSON();
        if (data.items && data.items.length) {
          var count = this.numberOfArticles;
          _.each(data.items, function (item) {
            var eid = item.entry && item.entry.id || null;
            if (count && eid) {
              count = count - 1;
              var num = this.numberOfArticles - count;
              item.num = num;
              selectedItems.push(item);
              if (!this.collection.get(eid)) {
                var itemViewModel = new ItemViewModel({
                  id: eid,
                  blogId: this.blogId,
                  pageviews: item.pageviews,
                  num: num
                });

                itemViewModel.fetch({
                  success: _.bind(function () {
                    this.collection.add(itemViewModel, {
                      sort: true
                    });
                  }, this),
                  error: _.bind(function () {
                    if (DEBUG) {
                      console.warn('could not get post ' + eid);
                    }
                    itemViewModel.set({
                      title: item.title
                    });
                    this.collection.add(itemViewModel, {
                      sort: true
                    });
                  }, this)
                });
              }
            }
          }, this);
          data.items = selectedItems;
        }
      }

      data.providerIsNotAvailable = this.providerIsNotAvailable ? true : false;
      data.error = this.error ? true : false;
      data.loading = this.loading ? true : false;
      data.itemLoading = this.itemLoading ? true : false;

      return data;
    },

    fetch: function () {
      this.model.fetch({
        blogId: this.blogId,
        success: _.bind(function () {
          this.loading = false;
          this.error = false;
          this.itemLoading = true;
          this.render();
        }, this),
        error: _.bind(function () {
          this.loading = false;
          this.error = true;
          this.render();
        }, this)
      });
    },

    initialize: function (options) {
      this.blogId = options.params.blogId;
      this.model = app.dashboardWidgetsData.topArticlesModel = app.dashboardWidgetsData.topArticlesModel || new Model();
      this.collection = app.dashboardWidgetsData.topArticlesCollection = app.dashboardWidgetsData.topArticlesCollection || new Collection();
      this.loading = true;

      if (!this.model.isSynced) {
        var statsProviderDfd = _.isFunction(statsProvider) ? statsProvider(this.blogId) : statsProvider;

        statsProviderDfd.done(_.bind(function () {
          this.providerIsNotAvailable = false;
          this.fetch();
        }, this));

        statsProviderDfd.fail(_.bind(function () {
          this.providerIsNotAvailable = true;
          this.loading = false;
          this.render();
        }, this));
      } else {
        this.loading = false;
      }
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
    },
  });
});
