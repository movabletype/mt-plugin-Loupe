define(['js/views/card/itemview', 'js/cache', 'js/mtapi/stats_provider', 'cards/stats/models/latest_page_views', 'hbs!cards/stats/templates/recent_access', 'mtchart'],

  function (CardItemView, cache, statsProvider, Model, template, ChartAPI) {
    "use strict";
    return CardItemView.extend({
      template: template,

      serializeData: function () {
        var data = this.serializeDataInitialize();
        data.title = 'Access In Last Week';

        if (!this.loading) {
          data = _.extend(data, this.model.toJSON());
        }

        data.providerIsNotAvailable = this.providerIsNotAvailable ? true : false;
        return data;
      },

      initialize: function () {
        CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

        this.model = cache.get(this.blogId, 'stats_latest_page_views') || cache.set(this.blogId, 'stats_latest_page_views', new Model(this.blogId));

        this.setTranslation();

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
        }
      },

      onRender: function () {
        this.handleRefetch();

        if (this.model.isSynced) {
          var graphEl = this.$el.find('.content'),
            graphData = this.model.toJSON().pageviews.items,
            data = _.map(graphData, function (item) {
              return {
                x: item.date,
                y: item.pageviews
              };
            }),
            yLabel = _.map(graphData, function (item) {
              var label = item.pageviews;
              if (item.pageviews >= 1000000) {
                label = Math.round(item.pageviews / 1000000) + 'M';
              } else if (item.pageviews >= 1000) {
                label = Math.round(item.pageviews / 1000) + 'K';
              }
              return label;
            }),
            config = {
              type: "css.horizontalBar",
              data: data,
              yLength: 1,
              yLabel: yLabel,
              autoSized: false,
              pointSize: 6,
              barColor: "#efb330",
              barBackgroundColor: "#362c35",
              dateColor: "#444444",
              dateColorSaturday: "#4079e6",
              dateColorSunday: "#ec4b05",
              dateLabelSize: 16,
              labelSize: 22,
              labelColor: "#ffffff",
              showDate: true,
              barWidth: 40,
              barMarginLeft: 35,
              barInterval: 10
            },
            range = {
              dataType: "timeline",
              unit: 'daily',
              length: 7
            };

          new ChartAPI.Graph(config, range).trigger('APPEND_TO', graphEl);
        }
      }
    });
  });
