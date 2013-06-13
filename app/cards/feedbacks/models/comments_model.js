define(['backbone', 'js/mtapi'], function (Backbone, mtapi) {
  return Backbone.Model.extend({
    initialize: function (options) {
      this.blogId = options.blogId;
    },
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);
        mtapi.api.getComment(this.blogId, this.id, function (resp) {
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
        var id = model.get('id');
        var comment = model.toJSON();
        comment.status = 'Approved';
        mtapi.api.updateComment(blogId, id, comment, function (resp) {
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
