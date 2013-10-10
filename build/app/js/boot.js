require(['backbone', 'backbone.marionette', 'app', 'js/cache', 'js/router/router', 'js/router/controller', 'json!cards/cards.json'], function (Backbone, Marionette, app, cache, AppRouter, Controller, cardsJSON) {
  // override for AMD
  Marionette.TemplateCache.prototype.loadTemplate = function (templateId) {
    return require(templateId);
  };

  new AppRouter({
    controller: new Controller()
  });

  var $mainScript = $('#main-script'),
    mtApiCGIPath = $mainScript.data('mtapi');

  cache.set('app', 'staticPath', $mainScript.data('base'));

  app.start({
    cards: cardsJSON,
    mtApiCGIPath: mtApiCGIPath
  });
});
