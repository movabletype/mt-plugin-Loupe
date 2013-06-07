define(['backbone', 'js/mtapi'], function (Backbone, mtapi) {
  return Backbone.Model.extend({
    initialize: function (options) {
      this.blogId = options.blogId;
      this.num = options.num;
      this.pageviews = options.pageviews;
    },
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);
        mtapi.api.getEntry(this.blogId, this.id, _.bind(function (resp) {
          if (!resp.error) {
            dfd.resolve(resp);
          } else {
            dfd.reject(resp);
          }
        }, this));
        return dfd;
      }
    }
  });
});
