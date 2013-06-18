define(['backbone', 'moment', 'js/mtapi', 'cards/feedbacks/models/comments_model'], function (Backbone, moment, mtapi, Model) {
  return Backbone.Collection.extend({
    model: Model,
    initialize: function (blogId) {
      this.blogId = blogId;
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
        limit: options.limit,
      }

      if (options.offset) {
        params.offset = options.offset;
      }

      mtapi.api.listComments(this.blogId, params, _.bind(function (resp) {
        if (DEBUG) {
          console.log('comments_collection')
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
