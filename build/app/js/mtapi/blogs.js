define(['js/mtapi'], function (mtapi) {
  return function (userId, options) {
    var dfd = $.Deferred();

    mtapi.api.listBlogsForUser(userId, options, function (resp) {
      if (DEBUG) {
        console.log(resp);
      }
      if (resp && !resp.error) {
        if (DEBUG) {
          console.log('get blogs list successfully');
        }
        dfd.resolve(resp);
      } else {
        if (DEBUG) {
          console.log('fail on get blogs');
        }
        dfd.reject(resp);
      }
    });

    return dfd;
  };
});
