define(['jquery', 'backbone', 'moment', 'js/mtapi'],

function ($, Backbone, moment, mtapi) {
  return Backbone.Model.extend({
    isSynced: false,
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred(),
          params = {
            startDate: moment().subtract('days', 6).format(),
            endDate: moment().format()
          };

        dfd.done(options.success);
        dfd.fail(options.error);

        mtapi.api.statsPageviewsForDate(options.blogId, params, _.bind(function (resp) {
          if (!resp.error) {
            if (DEBUG) {
              console.log('statsPageviewsForDate success in latest_page_view');
              console.log(resp);
            }
            this.isSynced = true;
            dfd.resolve(resp);
          } else {
            if (DEBUG) {
              console.log('statsPageviewsForDate fail in latest_page_view');
              console.log(resp);
            }
            dfd.reject(resp);
          }
        }, this));
        return dfd;
      }
    }
  });
});
