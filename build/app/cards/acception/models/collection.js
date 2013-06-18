define(['backbone', 'moment', 'js/mtapi', 'cards/acception/models/model'], function (Backbone, moment, mtapi, Model) {
  return Backbone.Collection.extend({
    model: Model,
    initialize: function (blogId) {
      this.blogId = blogId;
      this.isSynced = false;
    },
    comparator: function (item) {
      return -1 * moment(item.get('date')).valueOf();
    },
    parse: function (resp) {
      this.totalResults = resp.totalResults;
      return resp.items;
    },
    sync: function (method, model, options) {
      var dfd = $.Deferred();
      dfd.done(options.success);
      dfd.fail(options.error);

      var params = {
        status: 'Review'
      };

      if (options.limit) {
        params.limit = parseInt(options.limit, 10);
      }

      if (options.offset) {
        params.offset = parseInt(options.offset, 10);
      }

      mtapi.api.listEntries(this.blogId, params, _.bind(function (resp) {
        if (DEBUG) {
          console.log(resp);
        }
        if (!resp.error) {
          this.isSynced = true;
          dfd.resolve(resp);
        } else {
          dfd.reject(resp);
        }
      }, this));
      return dfd;
    }
  });
});
