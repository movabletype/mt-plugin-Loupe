define(['jquery', 'backbone.marionette', 'backbone.marionette.handlebars', 'js/mtapi/stats_provider', 'widgets/stats/models/latest_page_views', 'js/commands', 'hbs!widgets/stats/templates/dashboard', 'mtchart.graph'],

function ($, Marionette, MarionetteHandlebars, statsProvider, model, commands, template, Graph) {
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
          this.$el.hammer().on('tap', this.navigatePage);
          this.render();
        }, this),
        error: _.bind(function () {
          this.loading = false;
          this.error = true;
          this.$el.hammer().off('tap', this.navigatePage);
          this.render();
        }, this)
      });
    },

    navigatePage: function () {
      commands.execute('router:navigate', 'stats');
    },

    initialize: function (options) {
      this.blogId = options.params.blogId;
      this.model = model;
      this.loading = true;

      this.$el.hammer().on('tap', '.refetch', _.bind(function () {
        this.loading = true;
        this.error = false;
        this.render();
        this.fetch();
      }, this));

      if (!this.model.isSynced) {
        statsProvider = _.isFunction(statsProvider) ? statsProvider(this.blogId) : statsProvider;

        statsProvider.done(_.bind(function () {
          this.providerIsNotAvailable = false;
          this.fetch();
        }, this));

        statsProvider.fail(_.bind(function () {
          this.providerIsNotAvailable = true;
          this.loading = false;
          this.render();
        }, this));
      } else {
        this.loading = false;
        this.$el.hammer().on('tap', this.navigatePage);
      }
    },

    onRender: function () {
      if (this.model.isSynced) {
        var graphData = this.model.toJSON().items;
        graphData = _.map(graphData, function (item) {
          return {
            x: item.date,
            y: item.pageviews
          };
        });

        var config = {
          type: 'canvas.bar',
          json: graphData,
          autoSized: false,
          lineWidth: 8,
          lineColors: 'rgb(254,213,99)',
          barColors: 'rgba(255,255,255,0.1)',
          width: 330,
          height: 170
        };

        var range = {
          length: 7,
          maxLength: 7,
          unit: 'daily'
        };

        new Graph(config, range).trigger('APPEND_TO', this.$el.find('#stats-dashboard-graph'));
      }
    }
  });
});