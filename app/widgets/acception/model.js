define(['jquery', 'backbone', 'js/mtapi'], function ($, Backbone, mtapi) {
  return Backbone.Model.extend({
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);
        mtapi.api.getEntry(options.blogId, options.entryId, function (resp) {
          dfd.resolve(resp);
        });
      }
    }
  });
});