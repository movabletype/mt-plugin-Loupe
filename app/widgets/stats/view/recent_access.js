define(['backbone.marionette', 'app', 'js/mtapi/stats_provider', 'widgets/stats/models/latest_page_views', 'hbs!widgets/stats/templates/recent_access', 'mtchart'],

function (Marionette, app, statsProvider, Model, template, ChartAPI) {
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

      return data;
    },

    fetch: function () {
      this.model.fetch({
        blogId: this.blogId,
        success: _.bind(function () {
          this.loading = false;
          this.error = false;
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
      this.model = app.dashboardWidgetsData.stats = app.dashboardWidgetsData.stats || new Model();
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
        this.$el.find('.refetch').hammer().one('tap', _.bind(function () {
          this.loading = true;
          this.error = false;
          this.render();
          this.fetch();
        }, this));
      }

      if (this.model.isSynced) {
        var graphEl = this.$el.find('.content');
        var graphData = this.model.toJSON().pageviews.items;
        var data = _.map(graphData, function (item) {
          return {
            x: item.date,
            y: item.pageviews
          };
        });

        var yLabel = _.map(graphData, function (item) {
          return item.pageviews > 1000 ? (Math.round(item.pageviews / 100) / 10) + 'K' : item.pageviews;
        });

        var config = {
          type: "css.horizontalBar",
          data: data,
          yLength: 1,
          yLabel: yLabel,
          autoSized: false,
          pointSize: 6,
          barColor: "#fed563",
          barBackgroundColor: "#003130",
          dateColor: "#ffffff",
          labelColor: "#ffffff",
          showDate: true,
          barWidth: 40,
          barInterval: 10
        };

        var range = {
          dataType: "timeline",
          unit: 'daily',
          length: 7
        };

        new ChartAPI.Graph(config, range).trigger('APPEND_TO', graphEl);
      }
    }
  });
});