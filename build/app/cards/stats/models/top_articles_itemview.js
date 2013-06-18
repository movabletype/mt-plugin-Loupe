define(['backbone', 'js/cache', 'js/mtapi', 'js/models/entry', 'js/collections/entries'], function (Backbone, cache, mtapi, EntryModel, EntryCollection) {
  return Backbone.Model.extend({
    initialize: function (options) {
      this.blogId = options.blogId;
      this.num = options.num;
      this.pageviews = options.pageviews;
      this.unit = options.unit;
    },
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);
        var entryCollection = cache.get(this.blogId, 'entries') || cache.set(this.blogId, 'entries', new EntryCollection(this.blogId));
        if (entryCollection.get(this.id)) {
          dfd.resolve(entryCollection.get(this.id).toJSON());
        } else {
          var entry = new EntryModel({
            id: this.id,
            blogId: this.blogId
          });

          entry.fetch({
            success: function () {
              entryCollection.add(entry);
              dfd.resolve(entry.toJSON())
            },
            error: function (resp) {
              dfd.reject(entry.toJSON());
            }
          });
        }
        return dfd;
      }
    }
  });
});
