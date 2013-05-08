define(['jquery', 'js/mtapi'], function ($, mtapi) {
  return function (userId) {
    var dfd = $.Deferred();

    mtapi.api.listBlogs(userId, function (resp) {
      if (DEBUG) {
        console.log(resp);
      }
      if (resp && !resp.error) {
        if (DEBUG) {
          console.log('get blogs list successfully');
        }
        dfd.resolve(resp);
      } else {
        dfd.fail(resp);
      }
    });

    return dfd;
  };
});