define(['backbone', 'js/mtapi'], function (Backbone, mtapi) {
  return Backbone.Model.extend({
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);
        mtapi.api.listPermissions('me', this.id, function (resp) {
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
