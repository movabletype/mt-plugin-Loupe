require(['backbone', 'app', 'js/cache', 'js/router/router', 'js/router/controller', 'json!cards/cards.json'], function (Backbone, app, cache, AppRouter, Controller, cards) {
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
