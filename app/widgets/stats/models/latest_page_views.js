define(['jquery', 'backbone', 'js/mtapi', 'mtchart.date'],

function ($, Backbone, mtapi, chartDate) {
  return new(Backbone.Model.extend({
    isSynced: false,
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);

        var today = new Date();
        var startDate = chartDate.zeroPadArray(chartDate.parse(today.valueOf() - (6 * 24 * 60 * 60 * 1000)), 'daily').join('-');
        var endDate = chartDate.zeroPadArray(today, 'daily').join('-');

        var params = {
          startDate: startDate,
          endDate: endDate
        };

        mtapi.api.statsPageviewsForDate(options.blogId, params, _.bind(function (resp) {
          if (!resp.error) {
            if (DEBUG) {
              console.log('latest pageviews');
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
  }))();
});