define(['backbone.marionette', 'js/cache', 'js/device', 'js/commands', 'js/trans', 'js/views/card/composite', 'cards/acception/models/collection', 'cards/acception/dashboard/itemview', 'hbs!cards/acception/templates/dashboard'],

function (Marionette, cache, device, commands, Trans, CardCompositeView, Collection, ItemView, template) {
  "use strict";

  return CardCompositeView.extend({
    template: template,
    itemView: ItemView,
    itemViewContainer: '#acceptions-list',

    initialize: function () {
      CardCompositeView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
      this.perm = this.userHasPermission('edit_all_posts');

      this.dashboardShowWithPermission(this.perm)
        .done(_.bind(function () {
        this.collection = cache.get(this.blogId, 'acception') || cache.set(this.blogId, 'acception', new Collection(this.blogId));

        this.setTranslation(_.bind(function () {
          if (!this.collection.isSynced) {
            this.render();
            this.fetch({
              limit: 3,
              reset: true
            });
          } else {
            this.loading = false;
            this.render();
          }
        }, this));

        this.handleItemViewNavigate();
      }, this));
    },

    onRender: function () {
      if (this.perm) {
        var options = {
          limit: 5,
          offset: this.collection.length
        };
        this.handleReadmore(options);
        this.handleRefetch(options);
      }
    },

    serializeData: function () {
      var data = {};
      if (this.perm) {
        data = this.serializeDataInitialize();
        data.perm = this.perm;
        data.title = data.name;
        if (!this.loading) {
          data.count = parseInt(this.collection.totalResults, 10);
          if (data.count > this.collection.length) {
            data.showMoreButton = true;
          }
          data.items = this.collection.toJSON();
        }
      }
      return data;
    }
  });
});
