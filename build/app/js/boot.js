require(['backbone', 'backbone.marionette', 'app', 'js/cache', 'js/router/router', 'js/router/controller', 'json!cards/cards.json'], function (Backbone, Marionette, app, cache, AppRouter, Controller, cards) {
  // override for AMD
  Marionette.TemplateCache.prototype.loadTemplate = function (templateId) {
    return require(templateId);
  };

  new AppRouter({
    controller: new Controller({
      cards: cards
    })
  }, cards);
  Backbone.history.start();
  var $mainScript = $('#main-script'),
    mtApiCGIPath = $mainScript.data('mtapi');

  cache.set('app', 'staticPath', $mainScript.data('base'));

  app.start({
    cards: cards,
    mtApiCGIPath: mtApiCGIPath
  });
});
