define(['backbone', 'moment', 'js/mtapi'],

function (Backbone, moment, mtapi) {
  return Backbone.Model.extend({
    isSynced: false,
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred(),
          dfd2 = $.Deferred(),
          params = {
            startDate: moment().subtract('days', 6).format(),
            endDate: moment().format()
          };

        mtapi.api.statsPageviewsForDate(options.blogId, params, _.bind(function (resp) {
          if (!resp.error) {
            if (DEBUG) {
              console.log('statsPageviewsForDate success in latest_page_view');
              console.log(resp);
            }
            dfd.resolve(resp);
          } else {
            if (DEBUG) {
              console.log('statsPageviewsForDate fail in latest_page_view');
              console.log(resp);
            }
            dfd.reject(resp);
          }
        }, this));

        mtapi.api.statsVisitsForDate(options.blogId, params, _.bind(function (resp) {
          if (!resp.error) {
            if (DEBUG) {
              console.log('statsVisitsForDate success in latest_page_view');
              console.log(resp);
            }
            this.isSynced = true;
            dfd2.resolve(resp);
          } else {
            if (DEBUG) {
              console.log('statsVisitsForDate fail in latest_page_view');
              console.log(resp);
            }
            dfd2.reject(resp);
          }
        }, this));

        $.when(dfd, dfd2).then(_.bind(function (pageviews, visits) {
          this.isSynced = true;
          options.success({
            pageviews: pageviews,
            visits: visits
          }, options);
        }, this), options.error);

        return [dfd, dfd2];
      }
    }
  });
});
