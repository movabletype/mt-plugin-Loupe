define(['js/cache', 'js/mtapi'], function (cache, mtapi) {
  return function (blogId) {
    var dfd = $.Deferred(),
      storedData = cache.get(blogId, 'statsProvider') || null;

    if (storedData) {
      if (DEBUG) {
        console.log('stats provider has been already stored');
      }
      dfd.resolve({
        id: storedData
      });
    } else {
      mtapi.api.statsProvider(blogId, {
        'bustCache': (new Date()).valueOf()
      }, function (resp) {
        if (DEBUG) {
          console.log(resp);
        }
        if (resp && !resp.error) {
          if (DEBUG) {
            console.log('stats provider is ' + resp.id);
          }
          cache.set(blogId, 'statsProvider', resp);
          dfd.resolve(resp);
        } else {
          dfd.reject(resp);
        }
      });
    }
    return dfd;
  };
});
