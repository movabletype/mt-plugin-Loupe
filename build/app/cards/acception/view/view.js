define(['js/views/card/itemview', 'js/cache', 'js/device', 'js/commands', 'js/trans', 'moment', 'moment.lang', 'cards/acception/models/collection', 'cards/acception/models/model', 'hbs!cards/acception/templates/view'],

  function (CardItemView, cache, device, commands, Trans, moment, momentLang, Collection, Model, template) {
    "use strict";

    return CardItemView.extend({
      template: template,

      ui: {
        button: '#accept',
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
              this.model = new Model({
                id: this.entryId
              });
              this.fetch();
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

      fetch: function () {
        CardItemView.prototype.fetch.call(this, {
          blogId: this.blogId,
          successCallback: _.bind(function () {
            this.collection.add(this.model);
          }, this)
        });
      },

      update: function (status) {
        this.loading = true;
        this.render();
        var options = {
          blogId: this.blogId,
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
            this.error = (resp.error && resp.error.message) ? resp.error.message : 'Acception failed';
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
            this.$el.find('.close-me').hammer(this.hammerOpts).on('tap', _.bind(function () {
              this.$el.find('.overlay').remove();
            }, this));
          }

          this.ui.button.hammer(this.hammerOpts).on('tap', _.bind(function (e) {
            this.addTapClass(e.currentTarget, _.bind(function () {
              this.update('Publish');
            }, this));
          }, this));

          this.ui.undo.hammer(this.hammerOpts).on('tap', _.bind(function () {
            this.addTapClass(this.$el.find('.button-container-undo'), _.bind(function () {
              this.update('Review');
            }, this));
          }, this));

          this.handleRefetch();
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
        data.error = this.error;
        return data;
      }
    });
  });
