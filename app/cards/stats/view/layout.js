define(['backbone.marionette', 'js/commands', 'js/device', 'hbs!cards/stats/templates/layout', 'cards/stats/view/recent_access', 'cards/stats/view/top_articles', 'cards/stats/view/top_articles_weekly'],

function (Marionette, commands, device, template, RecentAccessView, TopArticlesView, TopArticlesWeeklyView) {
  "use strict";

  return Marionette.Layout.extend({
    template: function (data) {
      return template(data);
    },

    regions: {
      recentAccess: '#recent-access',
      topArticles: '#top-articles',
      topArticlesWeekly: '#top-articles-weekly'
    },

    initialize: function (options) {
      this.params = options.params;
      this.settings = options.settings;
    },

    onRender: function () {
      this.recentAccess.show(new RecentAccessView({
        params: this.params,
        settings: this.settings
      }));

      this.topArticles.show(new TopArticlesView({
        params: this.params,
        settings: this.settings,
        unit: 'day'
      }));

      this.topArticlesWeekly.show(new TopArticlesWeeklyView({
        params: this.params,
        settings: this.settings,
        unit: 'week'
      }));

      this.$el.find('.top-articles').hammer(device.options.hammer()).on('tap', 'a', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var route = $(this).data('route') || '';
        commands.execute('router:navigate', route);
        return false;
      });
    }
  });
});
