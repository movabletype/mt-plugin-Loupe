define(['backbone.marionette', 'js/commands', 'hbs!cards/stats/templates/layout', 'cards/stats/view/recent_access', 'cards/stats/view/top_articles', 'cards/stats/view/top_articles_weekly'],

function (Marionette, commands, template, RecentAccessView, TopArticlesView, TopArticlesWeeklyView) {
  "use strict";

  return Marionette.Layout.extend({
    template: template,

    regions: {
      recentAccess: '#recent-access',
      topArticles: '#top-articles',
      topArticlesWeekly: '#top-articles-weekly'
    },

    initialize: function (options) {
      this.options = options;
    },

    onRender: function () {
      this.recentAccess.show(new RecentAccessView(this.options));

      this.topArticles.show(new TopArticlesView(
        _.extend(this.options, {
        unit: 'day'
      })));

      this.topArticlesWeekly.show(new TopArticlesWeeklyView(
        _.extend(this.options, {
        unit: 'week'
      })));
    }
  });
});
