define(['backbone.marionette', 'hbs!widgets/stats/templates/layout', 'widgets/stats/view/recent_access', 'widgets/stats/view/top_articles'],

function (Marionette, template, RecentAccessView, TopArticlesView) {
  "use strict";

  return Marionette.Layout.extend({
    template: function (data) {
      return template(data);
    },

    regions: {
      recentAccess: '#recent-access',
      topArticles: '#top-articles'
    },

    initialize: function (options) {
      this.params = options.params;
    },

    onRender: function () {
      this.recentAccess.show(new RecentAccessView({
        params: this.params
      }));
      this.topArticles.show(new TopArticlesView({
        params: this.params
      }));
    }
  });
});