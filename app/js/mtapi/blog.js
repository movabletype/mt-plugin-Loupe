define(['jquery', 'js/mtapi'], function ($, mtapi) {
  return function (blogId) {
    var dfd = $.Deferred();

    mtapi.api.getBlog(blogId, function (resp) {
      if (DEBUG) {
        console.log(resp);
      }
      if (resp && !resp.error) {
        if (DEBUG) {
          console.log('get blog successfully');
        }
        dfd.resolve(resp);
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
