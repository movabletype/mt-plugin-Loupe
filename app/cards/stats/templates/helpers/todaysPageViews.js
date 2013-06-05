define('template/helpers/todaysPageViews', ['handlebars'], function (Handlebars) {
  function todaysPageViews(items) {
    var pageviews = '';

    if (items) {
      pageviews = parseFloat(items[items.length - 1].pageviews, 10);

      if (pageviews > 1000) {
        pageviews = (Math.round(pageviews / 100) / 10) + 'K';
      }
    }

    return pageviews;
  }
  Handlebars.registerHelper('todaysPageViews', todaysPageViews);
  return todaysPageViews;
});
