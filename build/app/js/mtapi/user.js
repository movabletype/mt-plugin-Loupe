define(['js/mtapi', 'js/cache', 'js/models/perm', 'js/collections/perms'], function (mtapi, cache, PermModel, PermCollection) {
  // get user and user permission
  return function () {
    var dfd = $.Deferred();

    mtapi.api.getUser('me', function (user) {
      if (DEBUG) {
        console.log(user);
      }
      if (user && !user.error) {
        if (DEBUG) {
          console.log('get user data successfully');
        }
        mtapi.api.listPermissions('me', function (perm) {
          if (DEBUG) {
            console.log('list permissions');
            console.log(perm);
          }
          if (!perm.error) {
            var perms = perm.items;
            user = _.extend({}, user, {
              permissions: perms[0].permissions
            });

            var permCollection = cache.set('user', 'perms', new PermCollection());
            permCollection.set(permCollection.parse(perms.slice(1)));
            dfd.resolve(user);
          } else {
            dfd.reject(perm);
          }
        });
      } else {
        if (DEBUG) {
          console.log('get user data failed');
        }
        dfd.reject(user);
      }
    });

    return dfd;
  };
});
