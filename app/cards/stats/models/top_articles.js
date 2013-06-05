define(['backbone', 'js/mtapi', 'moment'],

function (Backbone, mtapi, moment) {
  return Backbone.Model.extend({
    isSynced: false,
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred(),
          params = {
            startDate: moment().startOf('month').format(),
            endDate: moment().endOf('month').format(),
            limit: 10
          };

        dfd.done(options.success);
        dfd.fail(options.error);

        mtapi.api.statsPageviewsForPath(options.blogId, params, _.bind(function (resp) {
          if (!resp.error) {
            if (DEBUG) {
              console.log('top articles');
              console.log(resp);
            }
            this.isSynced = true;
            dfd.resolve(resp);
          } else {
            dfd.reject(resp);
          }
        }, this));
        return dfd;
      }
    }
  });
});
