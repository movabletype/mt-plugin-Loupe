define(['backbone', 'js/mtapi', 'cards/feedbacks/models/comments_model'], function (Backbone, mtapi, Model) {
  return Backbone.Collection.extend({
    model: Model,
    parse: function (resp) {
      this.totalResults = resp.totalResults;
      return resp.items;
    },
    sync: function (method, model, options) {
      var dfd = $.Deferred();
      var blogId = options.blogId;
      dfd.done(options.success);
      dfd.fail(options.error);

      var params = {
        limit: options.limit,
      }

      if (options.offset) {
        params.offset = options.offset;
      }

      mtapi.api.listComments(blogId, params, _.bind(function (resp) {
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
