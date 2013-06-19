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
  if (DEBUG) {
    if (Mock) {
      console.log('use mock');
      var MockObject = require('js/mtapi/mock');
      api = new MockObject();
    }
  }
  return {
    api: api,
    baseUrl: mtApiCGIPath,
  }
});
