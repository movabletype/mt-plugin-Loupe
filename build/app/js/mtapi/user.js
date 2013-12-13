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
        mtapi.api.listPermissionsForUser('me', function (perm) {
          if (DEBUG) {
            console.log('list permissions');
            console.log(perm);
          }
          if (!perm.error) {
            var perms = perm.items,
              systemPerm;

            if (perms[0] && !perms[0].blog) {
              // It's system level permissions if blog param is null
              systemPerm = {
                permissions: perms[0].permissions
              };
              perms = perms.slice(1);
            } else {
              systemPerm = {
                permissions: null
              };
            }
            user = _.extend({}, user, systemPerm);
            var permCollection = cache.set('user', 'perms', new PermCollection());
            permCollection.set(permCollection.parse(perms));
            permCollection.totalResults = perm.totalResults;
            if (DEBUG) {
              console.log('user permissions');
              console.log(user);
            }
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
