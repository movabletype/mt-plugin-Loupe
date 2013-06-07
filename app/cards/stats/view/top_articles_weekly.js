define(['backbone.marionette', 'app', 'js/commands', 'js/device', 'moment', 'moment.lang', 'js/mtapi/stats_provider', 'cards/stats/models/top_articles', 'cards/stats/models/top_articles_itemview_collection', 'cards/stats/models/top_articles_itemview', 'cards/stats/view/top_articles_itemview_weekly', 'js/trans', 'hbs!cards/stats/templates/top_articles_weekly'],

function (Marionette, app, commands, device, momemt, momentLang, statsProvider, Model, Collection, ItemViewModel, ItemView, Trans, template) {
  "use strict";

  return Marionette.CompositeView.extend({
    numberOfArticles: 3,

    template: function (data) {
      return template(data);
    },

    itemView: ItemView,
    itemViewContainer: '#top-articles-list-weekly',

    appendHtml: function (cv, iv) {
      this.getItemViewContainer(cv).find('#eid-' + iv.model.id).html(iv.el);
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
              var itemViewModel = this.collection.get(eid);
              if (!itemViewModel) {
                itemViewModel = new ItemViewModel({
                  id: eid,
                  blogId: this.blogId,
                  num: num,
                  pageviews: item.pageviews
                });

                itemViewModel.fetch({
                  success: _.bind(function (resp) {
                    this.collection.add(itemViewModel, {
                      sort: true
                    })
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

      data.trans = this.trans;

      return data;
    },

    fetch: function () {
      this.model.fetch({
        blogId: this.blogId,
        startDate: moment().startOf(this.unit).format(),
        endDate: moment().endOf(this.unit).format(),
        limit: 10,
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
      this.model = app.dashboardCardsData.topArticlesWeeklyModel = app.dashboardCardsData.topArticlesWeeklyModel || new Model();
      this.collection = app.dashboardCardsData.topArticlesCollectionWeekly = app.dashboardCardsData.topArticlesCollectionWeekly || new Collection();
      this.loading = true;
      this.settings = options.settings;
      this.unit = options.unit || 'day';

      this.trans = null;
      commands.execute('l10n', _.bind(function (l10n) {
        var transId = 'card_' + this.settings.id;
        l10n.load('cards/stats/l10n', transId).done(_.bind(function () {
          this.trans = new Trans(l10n, transId);
          this.render();
        }, this));
      }, this));

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
    }
  });
});
