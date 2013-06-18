define(['js/mtapi'], function (mtapi) {
  return function (blogId, entryId) {
    var dfd = $.Deferred();

    mtapi.api.getEntry(blogId, entryId, function (resp) {
      if (DEBUG) {
        console.log(resp);
      }
      if (resp && !resp.error) {
        if (DEBUG) {
          console.log('get entry successfully');
        }
        dfd.resolve(resp);
      } else {
        if (DEBUG) {
          console.log('fail on get entry');
        }
        dfd.reject(resp);
      }
    });

    return dfd;
  };
});
