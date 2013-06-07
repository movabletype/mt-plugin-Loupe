define(['backbone.marionette', 'app', 'js/device', 'js/commands', 'js/trans', 'moment', 'moment.lang', 'cards/acception/models/collection', 'cards/acception/models/model', 'hbs!cards/acception/templates/view'],

function (Marionette, app, device, commands, Trans, moment, momentLang, Collection, Model, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    },

    ui: {
      button: '#accept-button'
    },

    initialize: function (options) {
      this.blogId = options.params[0];
      this.entryId = options.params[1];
      this.collection = app.dashboardCardsData.acception = app.dashboardCardsData.acception || new Collection();
      this.model = this.collection.get(this.entryId);
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
            this.model = new Model();
            this.model.fetch({
              blogId: this.blogId,
              entryId: this.entryId,
              success: _.bind(function () {
                this.collection.add(this.model);
                this.loading = false;
                this.render();
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

      commands.setHandler('card:acception:share:show', _.bind(function () {
        var data = this.serializeData();
        commands.execute('share:show', {
          share: {
            url: data.permalink,
            tweetText: (data.title + ' ' + data.excerpt)
          }
        });
      }, this))
    },

    onRender: function () {
      if (this.acceptionFailed) {
        this.$el.find('.acception-failed .close-me').hammer().on('tap', function () {
          $(this).parent().remove();
        });
      }

      this.ui.button.hammer(device.options.hammer()).on('tap', _.bind(function () {
        this.loading = true;
        this.render();
        var options = {
          success: _.bind(function (resp) {
            if (DEBUG) {
              console.log(resp);
              console.log('acception sccuess');
            }
            this.loading = false;
            this.accepted = true;
            this.collection.remove(this.model);
            this.collection.totalResults = this.collection.totalResults - 1;
            this.model.set(this.model.parse(resp));
            console.log(this.model.toJSON());
            this.render();
          }, this),
          error: _.bind(function () {
            if (DEBUG) {
              console.log('failed acception');
            }
            this.loading = false;
            this.acceptionFailed = true;
            this.render();
          }, this)
        };
        this.model.sync('update', this.model, options);
      }, this));
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
          data.date = moment(data.date).lang(lang).format('ll');
        }
        console.log(data);
        commands.execute('header:render', data);
      }
      data.trans = this.trans;
      data.error = this.error ? true : false;
      data.loading = this.loading ? true : false;
      data.accepted = this.accepted ? true : false;
      data.acceptionFailed = this.acceptionFailed ? true : false;
      return data;
    }
  });
});
