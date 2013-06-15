define(['js/mtapi'], function (mtapi) {
  return function () {
    var dfd = $.Deferred();

    mtapi.api.revokeAuthentication(function (resp) {
      if (DEBUG) {
        console.log(resp)
      }
      if (resp.status && resp.status === 'success') {
        if (DEBUG) {
          console.log('revoke authentication success');
        }
        dfd.resolve(resp);
      } else {
        if (DEBUG) {
          console.log('revoke authentication failed');
        }
        dfd.reject(resp);
      }
    });

    return dfd;
  };
});
