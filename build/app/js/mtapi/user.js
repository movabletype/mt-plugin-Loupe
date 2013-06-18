define(['js/mtapi'], function (mtapi) {
  return function () {
    var dfd = $.Deferred();

    mtapi.api.getUser('me', function (resp) {
      if (DEBUG) {
        console.log(resp);
      }
      if (resp && !resp.error) {
        if (DEBUG) {
          console.log('get user data successfully');
        }
        dfd.resolve(resp);
      } else {
        if (DEBUG) {
          console.log('get user data failed');
        }
        dfd.reject(resp);
      }
    });

    return dfd;
  };
});
