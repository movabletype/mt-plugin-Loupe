define('template/helpers/log', ['handlebars'], function (Handlebars) {
  function log(log) {
    console.log('handlebars log:')
    console.log(log);
  }
  Handlebars.registerHelper('log', log);
  return log;
});
