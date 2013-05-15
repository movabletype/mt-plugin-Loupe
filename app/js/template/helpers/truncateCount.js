define('template/helpers/truncateCount', ['handlebars'], function (Handlebars) {
  function todaysPageViews(count) {

    if (count) {
      count = parseFloat(count, 10);

      if (count > 1000) {
        count = (Math.round(count / 100) / 10) + 'K';
      }
    }

    return count;
  }
  Handlebars.registerHelper('truncateCount', truncateCount);
  return truncateCount;
});