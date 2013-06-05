define(['backbone', 'js/mtapi', 'cards/acception/models/model'], function (Backbone, mtapi, Model) {
  return Backbone.Collection.extend({
    model: Model,
    initialize: function () {
      this.isSynced = false;
    },
    comparator: function (item) {
      return item.get('id');
    },
    parse: function (resp) {
      this.totalResults = resp.totalResults;
      return resp.items;
    },
    sync: function (method, model, options) {
      var dfd = $.Deferred();
      var blogId = options.blogId;
      dfd.done(options.success);
      dfd.fail(options.error);

      mtapi.api.listEntries(blogId, {
        'status': 'Review'
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
