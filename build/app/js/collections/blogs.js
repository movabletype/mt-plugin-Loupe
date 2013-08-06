define(['backbone', 'js/mtapi/blogs', 'js/models/blog'], function (Backbone, getBlogsList, Model) {
  return Backbone.Collection.extend({
    model: Model,
    parse: function (resp) {
      this.totalResults = parseInt(resp.totalResults, 10);
      return resp.items;
    },
    sync: function (method, model, options) {
      var dfd = $.Deferred();
      dfd.done(options.success);
      dfd.fail(options.error);

      var params = {};
      if (options.offset !== undefined) {
        params.offset = parseInt(options.offset, 10) || 0;
      }
      if (options.excludeIds) {
        params.excludeIds = options.excludeIds;
      }
      if (options.limit) {
        params.limit = parseInt(options.limit, 10) || 25;
      }

      params.fields = 'id,name,class,url';
      var getBlogList = getBlogsList(options.userId, params);

      getBlogList.done(function (resp) {
        dfd.resolve(resp);
      });

      getBlogList.fail(function (resp) {
        dfd.reject(resp);
      });

      return dfd;
    }
  });
});
