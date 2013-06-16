define('template/helpers/log', ['handlebars'], function (Handlebars) {
  function log(str) {
    console.log('handlebars log:');
    console.log(str);
  }
  Handlebars.registerHelper('log', log);
  return log;
});
