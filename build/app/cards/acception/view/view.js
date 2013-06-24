define(['js/views/card/itemview', 'js/cache', 'js/device', 'js/commands', 'js/trans', 'moment', 'moment.lang', 'cards/acception/models/collection', 'cards/acception/models/model', 'hbs!cards/acception/templates/view'],

function (CardItemView, cache, device, commands, Trans, moment, momentLang, Collection, Model, template) {
  "use strict";

  return CardItemView.extend({
    template: template,

    ui: {
      button: '#accept-button',
      undo: '#accept-undo'
    },

    initialize: function (options) {
      CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
      var routes = options.routes;
      this.blogId = routes[0];
      this.entryId = routes[1];
      this.perm = this.userHasPermission('edit_all_posts');

      if (this.perm) {
        this.collection = cache.get(this.blogId, 'acception') || cache.set(this.blogId, 'acception', new Collection(this.blogId));
        this.model = this.collection.get(this.entryId);

        this.setTranslation(_.bind(function () {
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
                this.fetchError = true;
                this.loading = false;
                this.render();
              }, this)
            });
          }
        }, this));

        commands.setHandler('card:acception:share:show', _.bind(function () {
          var data = this.serializeData();
          commands.execute('share:show', {
            share: {
              url: data.permalink,
              tweetText: (data.title + ' ' + data.excerpt)
            }
          });
        }, this));
      } else {
        this.setTranslation();
      }
    },

    update: function (status) {
      this.loading = true;
      this.render();
      var options = {
        status: status,
        success: _.bind(function (resp) {
          if (DEBUG) {
            console.log(resp);
            console.log('update sccuess');
          }
          this.loading = false;
          if (status === 'Publish') {
            this.accepted = true;
            this.collection.remove(this.model);
            this.collection.totalResults = this.collection.totalResults - 1;
          } else {
            this.accepted = true;
            this.collection.add(this.model);
            this.collection.totalResults = this.collection.totalResults + 1;
          }
          this.model.set(this.model.parse(resp));
          this.render();
        }, this),
        error: _.bind(function (resp) {
          if (DEBUG) {
            console.log('failed update');
          }
          this.error = resp.error && resp.error.message ? resp.error.message : 'Acception failed';
          this.loading = false;
          this.acceptionFailed = true;
          this.render();
        }, this)
      };
      this.model.sync('update', this.model, options);
    },

    onRender: function () {
      if (this.perm) {
        if (this.acceptionFailed) {
          this.$el.find('.acception-failed .close-me').hammer().on('tap', function () {
            $(this).parent().remove();
          });
        }

        this.ui.button.hammer(this.hammerOpts).on('tap', _.bind(function (e) {
          this.addTapClass(e.currentTarget, _.bind(function () {
            this.update('Publish');
          }, this));
        }, this));

        this.ui.undo.hammer(this.hammerOpts).on('tap', _.bind(function (e) {
          this.addTapClass($('#published-button'), _.bind(function () {
            this.update('Review');
          }, this));
        }, this));
      }
    },

    serializeData: function () {
      var data = {};
      if (this.perm) {
        data = this.serializeDataInitialize();
        data.perm = this.perm;
        if (this.model) {
          data = _.extend(data, this.model.toJSON());
          commands.execute('header:render', data);
        }
        data.accepted = this.accepted ? true : false;
        data.acceptionFailed = this.acceptionFailed ? true : false;
      } else {
        data.trans = this.trans;
      }
      return data;
    }
  });
});
