define(['js/views/card/composite',
    'js/cache',
    'moment',
    'moment.lang',
    'js/mtapi/stats_provider',
    'cards/stats/models/top_articles',
    'cards/stats/models/top_articles_itemview_collection',
    'cards/stats/models/top_articles_itemview',
    'cards/stats/view/top_articles_itemview',
    'hbs!cards/stats/templates/top_articles'
  ],

  function (CardCompositeView, cache, moment, momentLang, statsProvider, Model, ItemViewCollection, ItemViewModel, ItemView, template) {
    'use strict';

    return CardCompositeView.extend({
      numberOfArticles: 3,

      template: template,

      itemView: ItemView,
      itemViewContainer: '#top-articles-list-day',

      appendHtml: function (cv, iv) {
        this.getItemViewContainer(cv).find('#eid-' + iv.model.id).html(iv.el);
      },

      serializeData: function () {
        var data = this.serializeDataInitialize();
        var selectedItems = [];

        if (!this.loading) {
          data = _.extend(data, this.model.toJSON());
          if (data.items && data.items.length) {
            var count = this.numberOfArticles;

            var entries = _.filter(data.items, function (item) {
              return item.entry && item.entry.id;
            }) || [];

            data.count = entries.length;

            _.each(entries, function (item) {
              var eid = item.entry ? item.entry.id : null;
              if (count && eid) {
                count = count - 1;
                var num = this.numberOfArticles - count;
                item.num = num;
                selectedItems.push(item);
                var itemViewModel = this.collection.get(eid);

                this.dfd.done(_.bind(function () {
                  if (!itemViewModel) {
                    itemViewModel = new ItemViewModel({
                      id: eid,
                      blogId: this.blogId,
                      num: num,
                      pageviews: item.pageviews,
                      unit: this.unit
                    });

                    itemViewModel.fetch({
                      success: _.bind(function () {
                        itemViewModel.set({
                          arrow: true
                        });
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
                }, this));
              }
            }, this);
            data.items = selectedItems;
          }
        }

        data.providerIsNotAvailable = this.providerIsNotAvailable ? true : false;
        data.itemLoading = this.itemLoading ? true : false;

        var strMap = {
          'day': 'Day',
          'week': 'Week',
          'month': 'Month',
          'year': 'Year'
        };
        data.title = 'Top [_1] of The ' + strMap[this.unit];
        data.numberOfArticles = this.numberOfArticles;
        data.unit = this.unit;

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
            this.fetchError = false;
            this.itemLoading = true;
            this.render();
          }, this),
          error: _.bind(function () {
            this.loading = false;
            this.fetchError = true;
            this.render();
          }, this)
        });
      },

      initialize: function (options) {
        CardCompositeView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

        this.unit = options.unit || 'day';
        this.model = cache.get(this.blogId, 'toparticle_' + this.unit + '_model') || cache.set(this.blogId, 'toparticle_' + this.unit + '_model', new Model());
        this.collection = cache.get(this.blogId, 'toparticle_itemview_' + this.unit + '_collection') || cache.set(this.blogId, 'toparticle_itemview_' + this.unit + '_collection', new ItemViewCollection());

        this.setTranslation();
        this.dfd = $.Deferred();

        if (!this.model.isSynced) {
          var statsProviderDfd = statsProvider(this.blogId);

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
          this.render();
        }

        this.handleItemViewNavigate();
      },

      onRender: function () {
        this.handleRefetch();
        if (!this.loading && this.itemLoading) {
          this.dfd.resolve();
        }
      }
    });
  });
