define(['jquery'], function ($) {
  var mtApiCGIPath = $('#main-script').data('mtapi');
  var clientId = $('#main-script').data('client');
  if (!clientId) {
    clientId = 'loupe';
  }
  var api = new MT.DataAPI({
    baseUrl: mtApiCGIPath,
    clientId: clientId
  });
  return {
    api: api,
    baseUrl: mtApiCGIPath,
  }
});
