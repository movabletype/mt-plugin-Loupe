define(['backbone.marionette', 'app', 'js/commands', 'js/device', 'moment', 'moment.lang', 'js/mtapi/stats_provider', 'cards/stats/models/top_articles_itemview', 'cards/stats/models/top_articles_itemview_collection', 'js/trans', 'hbs!cards/stats/templates/post', 'cards/stats/models/top_articles'],

function (Marionette, app, commands, device, moment, momentLang, statsProvider, Model, Collection, Trans, template, StatsModel) {
  "use strict";
  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    },

    initialize: function (options) {
      this.blogId = options.params[0];
      this.entryId = options.params[1];
      this.unit = options.params[2];
      if (this.unit === 'day') {
        this.collection = app.dashboardCardsData.topArticlesCollection = app.dashboardCardsData.topArticlesCollection || new Collection();
      } else {
        this.collection = app.dashboardCardsData.topArticlesCollectionWeekly = app.dashboardCardsData.topArticlesCollectionWeekly || new Collection();
      }
      this.model = this.collection.get(this.entryId) || null;
      this.loading = true;
      this.settings = options.settings;

      this.trans = null;
      commands.execute('l10n', _.bind(function (l10n) {
        var transId = 'card_' + this.settings.id;
        l10n.load('cards/' + this.settings.id + '/l10n', transId).done(_.bind(function () {
          this.trans = new Trans(l10n, transId);
          if (this.model) {
            this.loading = false;
            this.render();
          } else {
            this.render();

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
                    startDate: moment().startOf('day').format(),
                    endDate: moment().endOf('day').format(),
                    limit: 1,
                    path: path,
                    success: _.bind(function (resp) {
                      this.loading = false;
                      this.error = false;
                      this.pageviews = resp.toJSON().items[0].pageviews;
                      // this.collection.add(this.model);
                      this.render();
                    }, this),
                    error: _.bind(function () {
                      this.loading = false;
                      this.error = true;
                      this.render();
                    }, this)
                  });
                }
              }, this),
              error: _.bind(function () {
                this.error = true;
                this.loading = false;
                this.render();
              }, this)
            });
          }
        }, this));
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

    serializeData: function () {
      var data = {};
      if (this.model) {
        data = this.model.toJSON();
        if (data.author) {
          var lang = data.author.language.split('-');
          if (lang === 'us') {
            lang = ''
          }
          data.lang = lang;
        }
        commands.execute('header:render', data);
      }
      data.pageviews = data.pageviews || this.pageviews || null;
      data.trans = this.trans;
      data.error = this.error ? true : false;
      data.loading = this.loading ? true : false;
      console.log('post')
      console.log(data);
      return data;
    }
  });
});
