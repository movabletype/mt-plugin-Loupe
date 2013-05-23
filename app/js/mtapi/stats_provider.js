define(['jquery', 'js/mtapi', 'json2'], function ($, mtapi, JSON) {
  return function (blogId) {
    var dfd = $.Deferred();

    var storedData = sessionStorage.getItem('statsProvider') ? JSON.parse(sessionStorage.getItem('statsProvider')) : {};

    if (storedData[blogId]) {
      if (DEBUG) {
        console.log('stats provider has been already stored');
      }
      dfd.resolve({
        id: storedData[blogId]
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
          storedData[blogId] = resp;
          sessionStorage.setItem('statsProvider', JSON.stringify(storedData));
          dfd.resolve(resp);
        } else {
          dfd.reject(resp);
        }
      });
    }

    return dfd;
  };
});
