define(['js/mtapi', 'js/cache', 'js/models/perm', 'js/collections/perms'], function (mtapi, cache, PermModel, PermCollection) {
  return function (blogId, options) {
    var dfd = $.Deferred();

    mtapi.api.getBlog(blogId, options, function (resp) {
      if (DEBUG) {
        console.log(resp);
      }
      if (resp && !resp.error) {
        function resolve() {
            return dfd.resolve(resp);
        }

        if (DEBUG) {
          console.log('get blog successfully');
        }

        var permCollection = cache.get('user', 'perms') || cache.set('user', 'perms', new PermCollection());
        if (   !permCollection.get(blogId)
            && (   !permCollection.totalResults
                || (permCollection.totalResults > permCollection.length)))
        {
          var perm = new PermModel({id: blogId, permissions: []});
          perm.fetch({
              success: function(model, resp) {
                if (resp.totalResults === 1) {
                    perm.set('permissions', resp.items[0].permissions);
                }
                permCollection.add(perm);
                resolve();
              },
              error: function(model, resp) {
                if (DEBUG) {
                  console.log('fail on get permission data');
                }
                dfd.reject(resp);
              }
          });
        }
        else {
          resolve();
        }
      } else {
        if (DEBUG) {
          console.log('fail on get blog');
        }
        dfd.reject(resp);
      }
    });

    return dfd;
  };
});
