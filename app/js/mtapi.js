define(['jquery', 'mtapi'], function ($, DataAPI) {
  var mtApiCGIPath = $('#main-script').data('mtapi');
  var api = new DataAPI({
    baseUrl: mtApiCGIPath
  });
  return {
    api: api,
    baseUrl: mtApiCGIPath
  }
});
