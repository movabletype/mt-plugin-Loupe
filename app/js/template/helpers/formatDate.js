define('template/helpers/formatDate', ['handlebars', 'moment', 'moment.lang'], function (Handlebars, moment) {
  function formatDate(date, lang, options) {
    lang = lang || ''
    return new Handlebars.SafeString(moment(date).lang(lang).format('ll'));
  }
  Handlebars.registerHelper('formatDate', formatDate);
  return formatDate;
});
