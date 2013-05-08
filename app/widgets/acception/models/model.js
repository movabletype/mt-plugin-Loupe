define(['jquery', 'backbone', 'js/mtapi', 'backbone.localStorage'], function ($, Backbone, mtapi) {
  return Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage('acceptions'),
    sync: function (method, model, options) {
      switch (method) {
        case 'read':
          var dfd = $.Deferred();
          dfd.done(options.success);
          dfd.fail(options.error);
          mtapi.api.getEntry(options.blogId, options.entryId, function (resp) {
            dfd.resolve(resp);
          });
          return dfd;
          break;
        default:
          Backbone.sync(method, model, options);
      }
    }
  });
});