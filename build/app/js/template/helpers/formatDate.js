define('template/helpers/formatDate', ['handlebars', 'moment'], function (Handlebars, moment) {
  function formatDate(date, lang) {
    lang = lang || '';
    return new Handlebars.SafeString(moment(date).lang(lang).format('ll'));
  }
  Handlebars.registerHelper('formatDate', formatDate);
  return formatDate;
});
