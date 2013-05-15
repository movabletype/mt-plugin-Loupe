define(['backbone.marionette', 'backbone.marionette.handlebars', 'hbs!widgets/stats/templates/layout', 'widgets/stats/view/recent_access', 'widgets/stats/view/top_articles'],

function (Marionette, MarionetteHandlebars, template, RecentAccessView, TopArticlesView) {
  "use strict";

  return Marionette.Layout.extend({
    template: {
      type: 'handlebars',
      template: template
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