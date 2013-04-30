define(['jquery', 'mtapi', 'mtendpoints'], function ($, API) {
  var mtApiCGIPath = $('#main-script').data('mtapi');
  var api = new API({
    baseUrl: mtApiCGIPath
  });
  return {
    api: api,
    baseUrl: mtApiCGIPath
  }
});