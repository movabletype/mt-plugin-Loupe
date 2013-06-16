define('template/helpers/encodeURI', ['handlebars'], function (Handlebars) {
  function encodeURI(str) {
    return new Handlebars.SafeString(encodeURIComponent(str));
  }
  Handlebars.registerHelper('encodeURI', encodeURI);
  return encodeURI;
});
