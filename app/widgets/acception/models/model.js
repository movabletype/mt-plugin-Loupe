define(['jquery', 'backbone', 'js/mtapi'], function ($, Backbone, mtapi) {
  return Backbone.Model.extend({
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);
        mtapi.api.getEntry(options.blogId, options.entryId, function (resp) {
          if (!resp.error) {
            dfd.resolve(resp);
          } else {
            dfd.reject(resp);
          }
        });
        return dfd;
      } else if (method === 'update') {
        // only update status to 'Publish'
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);
        var blogId = model.get('blog').id;
        var entryId = model.get('id');
        var entry = model.toJSON();
        entry.status = 'Publish';
        mtapi.api.updateEntry(blogId, entryId, entry, function (resp) {
          if (!resp.error) {
            dfd.resolve(resp);
          } else {
            dfd.reject(resp);
          }
        });
        return dfd;
      }
    }
  });
});