define(['jquery', 'backbone', 'js/mtapi', 'backbone.localStorage'], function ($, Backbone, mtapi) {
  return Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage('acceptions'),
    publish: function (options) {
      var dfd = $.Deferred();
      var model = this;
      dfd.done(options.success);
      dfd.fail(options.error);
      var blogId = model.get('blog').id;
      var entryId = model.get('id');
      var entry = model.toJSON();
      entry.status = 'Publish';
      mtapi.api.updateEntry(blogId, entryId, entry, function (resp) {
        dfd.resolve(resp);
      });
      return dfd;
    },
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