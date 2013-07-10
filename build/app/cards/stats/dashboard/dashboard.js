define([
  'js/cache',
  'js/commands',
  'js/device',
  'js/mtapi/stats_provider',
  'js/views/card/itemview',
  'cards/stats/models/latest_page_views',
  'hbs!cards/stats/templates/dashboard',
  'mtchart'
], function (cache, commands, device, statsProvider, CardItemView, Model, template, ChartAPI) {
  'use strict';

  return CardItemView.extend({
    template: template,

    initialize: function () {
      CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

      this.model = cache.get(this.blogId, 'stats_latest_page_views') || cache.set(this.blogId, 'stats_latest_page_views', new Model(this.blogId));

      this.setTranslation();

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
        this.$el.hammer(this.hammerOpts).on('tap', this.navigatePage);
        this.$el.addClass('tap-enabled');
      }
    },

    fetch: function () {
      CardItemView.prototype.fetch.call(this, {
        successCallback: _.bind(function () {
          this.$el.hammer(this.hammerOpts).on('tap', this.navigatePage);
          this.$el.addClass('tap-enabled');
        }, this),
        errorCallback: _.bind(function () {
          this.$el.hammer(this.hammerOpts).off('tap', this.navigatePage);
          this.$el.removeClass('tap-enabled');
        }, this)
      });
    },

    navigatePage: function () {
      commands.execute('router:navigate', 'stats');
    },

    onRender: function () {
      this.handleRefetch();

      var data, pageviews, visits, graphData = [],
        p, v, i, len, config, range;

      if (this.model.isSynced) {
        data = this.model.toJSON();
        pageviews = data.pageviews.items;
        visits = data.visits.items;

        for (i = 0, len = pageviews.length; i < len; i++) {
          p = pageviews[i];
          v = visits[i];
          graphData.push({
            x: p.date,
            y: v.visits,
            y1: p.pageviews
          });
        }

        config = {
          type: 'easel.mix',
          data: graphData,
          yLength: 2,
          mix: [{
            type: 'bar',
            yLength: 1,
            chartColors: ['#cccccc'],
            chartColorsAlpha: [0.5]
          }, {
            type: 'motionLine',
            yLength: 1,
            lineWidth: 8,
            chartColors: ['#55a038'],
            drawPointer: device.isAndroid ? false : true,
            pointerColors: ['#ea4b29']
          }],
          fallback: {
            test: 'canvas',
            type: 'morris.bar',
            data: graphData,
            yLength: 1,
            chartColors: ['#55a038'],
            gridLineColor: '#f3f3f5',
            gridTextColor: '#f3f3f5',
            hideHover: 'always'
          },
          height: 170
        };

        range = {
          length: 7,
          unit: 'daily'
        };

        new ChartAPI.Graph(config, range).trigger('APPEND_TO', this.$el.find('#stats-dashboard-graph'));
      } else if (this.providerIsNotAvailable) {
        this.$el.find('#stats-dashboard-graph').append('<img src="' + cache.get('app', 'staticPath') + '/cards/stats/assets/welcome.png" class="stats-welcome" height="170">')
      }
    },

    serializeData: function () {
      var data = this.serializeDataInitialize();
      data.title = "Today's Page Views";

      if (!this.loading) {
        data = _.extend({}, data, this.model.toJSON());
        if (data.pageviews && data.pageviews.items) {
          var len = data.pageviews.items.length;
          if (len > 1) {
            var yesterday = parseInt(data.pageviews.items[len - 2].pageviews, 10);
            var today = parseInt(data.pageviews.items[len - 1].pageviews, 10);
            this.diff = today - yesterday;
            if (this.diff < 0) {
              data.diffIcon = 'icon-arrow-down-right';
            } else if (this.diff > 0) {
              data.diffIcon = 'icon-arrow-up-right';
            } else {
              data.diffIcon = 'icon-arrow-right';
            }
          }
        } else {
          if (this.providerIsNotAvailable) {
            data.pageviews = {
              items: [{
                pageviews: 770000
              }]
            };
            data.diffIcon = 'icon-arrow-up-right';
          }
        }
        data.today = (new Date()).valueOf();
      }
      data.providerIsNotAvailable = this.providerIsNotAvailable ? true : false;
      return data;
    }
  });
});
