define(['backbone.marionette', 'app', 'js/device', 'js/mtapi/stats_provider', 'widgets/stats/models/latest_page_views', 'js/commands', 'js/trans', 'hbs!widgets/stats/templates/dashboard', 'mtchart'],

function (Marionette, app, device, statsProvider, Model, commands, Trans, template, ChartAPI) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    },

    serializeData: function () {
      var data = {};

      if (!this.loading) {
        data = this.model.toJSON();
      }

      data.providerIsNotAvailable = this.providerIsNotAvailable ? true : false;
      data.error = this.error ? true : false;
      data.loading = this.loading ? true : false;

      if (this.trans) {
        data.trans = this.trans;
      }

      return data;
    },

    fetch: function () {
      this.model.fetch({
        blogId: this.blogId,
        success: _.bind(function () {
          this.loading = false;
          this.error = false;
          this.$el.hammer(this.hammerOpts).on('tap', this.navigatePage);
          this.$el.addClass('tap-enabled');
          this.render();
        }, this),
        error: _.bind(function () {
          this.loading = false;
          this.error = true;
          this.$el.hammer(this.hammerOpts).off('tap', this.navigatePage);
          this.$el.removeClass('tap-enabled');
          this.render();
        }, this)
      });
    },

    navigatePage: function () {
      commands.execute('router:navigate', 'stats');
    },

    initialize: function (options) {
      this.blogId = options.params.blogId;
      this.model = app.dashboardWidgetsData.stats = app.dashboardWidgetsData.stats || new Model();
      this.loading = true;

      this.trans = null;

      commands.execute('l10n', _.bind(function (l10n) {
        l10n.load('widgets/stats/l10n', 'widgetStats').done(_.bind(function () {
          this.trans = new Trans(l10n, 'widgetStats');
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
        this.$el.hammer(this.hammerOpts).on('tap', this.navigatePage);
        this.$el.addClass('tap-enabled');
      }
    },

    hammerOpts: device.options.hammer(),

    onRender: function () {
      if (this.error) {
        this.$el.hammer(this.hammerOpts).one('tap', '.refetch', _.bind(function () {
          this.loading = true;
          this.error = false;
          this.render();
          this.fetch();
        }, this));
      }

      if (this.model.isSynced) {
        var data = this.model.toJSON(),
          pageviews = data.pageviews.items,
          visits = data.visits.items,
          graphData = [],
          p, v;

        for (var i = 0, len = pageviews.length; i < len; i++) {
          p = pageviews[i];
          v = visits[i];
          graphData.push({
            x: p.date,
            y: p.pageviews,
            y1: v.visits
          });
        }

        var config = {
          type: 'easel.mix',
          data: graphData,
          yLength: 2,
          mix: [{
              type: 'bar',
              yLength: 1,
              chartColors: ['#ffffff'],
              chartColorsAlpha: [0.1]
            }, {
              type: 'motionLine',
              yLength: 1,
              lineWidth: 8,
              chartColors: ['#fed563']
            }
          ],
          fallback: {
            test: 'canvas',
            type: 'morris.line',
            data: graphData,
            chartColors: ['#fed563'],
            gridLineColor: '#ffffff',
            gridTextColor: '#ffffff',
            hideHover: 'always'
          },
          height: 170
        };

        var range = {
          length: 7,
          unit: 'daily'
        };

        new ChartAPI.Graph(config, range).trigger('APPEND_TO', this.$el.find('#stats-dashboard-graph'));
      }
    }
  });
});
