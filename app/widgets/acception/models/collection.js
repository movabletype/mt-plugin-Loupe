define(['jquery', 'backbone', 'js/mtapi', 'widgets/acception/models/model', 'backbone.localStorage'], function ($, Backbone, mtapi, Model) {
  return Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage('acceptions'),
    model: Model,
    initialize: function () {
      this.comparator = function (item) {
        return item.get('id');
      };
    },
    parse: function (resp) {
      this.totalResults = resp.totalResults;
      return resp.items;
    },
    sync: function (method, model, options) {
      switch (method) {
        case 'read':
          var dfd = $.Deferred();
          var blogId = options.blogId;
          dfd.done(options.success);
          dfd.fail(options.error);
          mtapi.api.listEntries(blogId, {
            'status': 'Review'
          }, function (resp) {
            if (DEBUG) {
              console.log('fetch resolved');
              console.log(resp);
            }
            dfd.resolve(resp);
          });
          return dfd;
        default:
          Backbone.sync(method, model, options);
      }
    }
  });
});