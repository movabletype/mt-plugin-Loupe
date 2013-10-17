define(['js/views/card/itemview',
    'js/cache',
    'js/commands',
    'moment',
    'moment.lang',
    'cards/stats/models/top_articles_itemview',
    'cards/stats/models/top_articles_itemview_collection',
    'hbs!cards/stats/templates/post',
    'cards/stats/models/top_articles'
  ],

  function (CardItemView, cache, commands, moment, momentLang, Model, ItemViewCollection, template, StatsModel) {
    'use strict';
    return CardItemView.extend({
      template: template,

      initialize: function (options) {
        CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

        var routes = options.routes;
        this.blogId = routes[0];
        this.entryId = routes[1];
        this.unit = routes[2];

        this.collection = cache.get(this.blogId, 'toparticle_itemview_' + this.unit + '_collection') || cache.set(this.blogId, 'toparticle_itemview_' + this.unit + '_collection', new ItemViewCollection());
        this.model = this.collection.get(this.entryId) || null;
        this.setTranslation(_.bind(function () {
          if (this.model) {
            this.loading = false;
            this.render();
          } else {
            this.render();
            this.fetch();
          }
        }, this));

        commands.setHandler('card:stats:share:show', _.bind(function () {
          var data = this.serializeData();
          commands.execute('share:show', {
            share: {
              url: data.permalink,
              tweetText: (data.title + ' ' + data.excerpt)
            }
          });
        }, this))
      },

      fetch: function () {
        this.model = new Model({
          id: this.entryId,
          blogId: this.blogId
        });
        this.model.fetch({
          success: _.bind(function () {
            var permalink = this.model.toJSON().permalink || null;
            var path;
            if (permalink) {
              permalink = permalink.match(/http(?:s)?:\/\/[^\/]+\/(.*)/);
              path = permalink.length > 1 ? permalink[1] : null;
            }

            if (path) {
              this.statsModel = new StatsModel();
              this.statsModel.fetch({
                blogId: this.blogId,
                startDate: moment().startOf(this.unit).format(),
                endDate: moment().endOf(this.unit).format(),
                limit: 1,
                path: path,
                success: _.bind(function (resp) {
                  this.loading = false;
                  this.fetchError = false;
                  this.pageviews = resp.toJSON().items[0] ? resp.toJSON().items[0].pageviews : 0;
                  this.render();
                }, this),
                error: _.bind(function () {
                  this.loading = false;
                  this.fetchError = true;
                  this.render();
                }, this)
              });
            }
          }, this),
          error: _.bind(function () {
            this.fetchError = true;
            this.loading = false;
            this.render();
          }, this)
        });
      },

      onRender: function () {
        this.handleRefetch();
      },

      serializeData: function () {
        var data = this.serializeDataInitialize();
        if (this.model) {
          data = _.extend(data, this.model.toJSON());
          commands.execute('header:render', data);
        }
        var map = {
          day: "Today's",
          week: "This Week's",
          month: "This Month's",
          year: "This Year's"
        }

        data.label = map[this.unit] + ' access';
        if (data.pageviews === undefined) {
          data.pageviews = this.pageviews;
        }
        return data;
      }
    });
  });
