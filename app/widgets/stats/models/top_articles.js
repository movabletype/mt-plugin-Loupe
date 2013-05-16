define(['jquery', 'backbone', 'js/mtapi', 'mtchart.range'],

function ($, Backbone, mtapi, chartRange) {
  return Backbone.Model.extend({
    isSynced: false,
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);

        var today = new Date();
        var startDate = chartRange.getStartDate(today, 'monthly');
        var endDate = chartRange.getEndDate(today, 'monthly');

        var params = {
          startDate: startDate,
          endDate: endDate,
          limit: 10
        };

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