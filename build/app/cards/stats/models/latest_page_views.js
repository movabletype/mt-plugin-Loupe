define(['backbone', 'moment', 'js/mtapi'],

function (Backbone, moment, mtapi) {
  return Backbone.Model.extend({
    isSynced: false,
    initialize: function (blogId) {
      this.blogId = blogId;
    },
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred(),
          dfd2 = $.Deferred(),
          params = {
            startDate: moment().subtract('days', 6).format(),
            endDate: moment().format()
          };

        mtapi.api.listStatsPageviewsForDate(this.blogId, params, _.bind(function (resp) {
          if (!resp.error) {
            if (DEBUG) {
              console.log('listStatsPageviewsForDate success in latest_page_view');
              console.log(resp);
            }
            dfd.resolve(resp);
          } else {
            if (DEBUG) {
              console.log('listStatsPageviewsForDate fail in latest_page_view');
              console.log(resp);
            }
            dfd.reject(resp);
          }
        }, this));

        mtapi.api.listStatsVisitsForDate(this.blogId, params, _.bind(function (resp) {
          if (!resp.error) {
            if (DEBUG) {
              console.log('listStatsVisitsForDate success in latest_page_view');
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
