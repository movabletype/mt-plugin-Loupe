define('template/helpers/removeHtml', ['handlebars'], function (Handlebars) {
  function removeHtml(str) {
    return new Handlebars.SafeString($('<div>').html(str).text());
  }
  Handlebars.registerHelper('removeHtml', removeHtml);
  return removeHtml;
});
