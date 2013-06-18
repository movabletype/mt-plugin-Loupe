define(['jquery'], function ($) {
  var mtApiCGIPath = $('#main-script').data('mtapi');
  var clientId = $('#main-script').data('client');
  if (!clientId) {
    clientId = sessionStorage.getItem('clientId', clientId) || 'loupe' + (new Date()).valueOf();
    sessionStorage.setItem('clientId', clientId);
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
