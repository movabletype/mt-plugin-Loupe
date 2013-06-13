define(['backbone', 'js/mtapi', 'cards/feedbacks/models/comments_model'], function (Backbone, mtapi, Model) {
  return Backbone.Collection.extend({
    model: Model,
    initialize: function (blogId) {
      this.blogId = blogId;
    },
    parse: function (resp) {
      this.totalResults = resp.totalResults;
      return resp.items;
    },
    sync: function (method, model, options) {
      var dfd = $.Deferred();
      dfd.done(options.success);
      dfd.fail(options.error);

      mtapi.api.listTrackbacks(this.blogId, {
        'limit': 1
      }, _.bind(function (resp) {
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
