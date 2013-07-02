require(['backbone', 'app', 'js/router/router', 'js/router/controller', 'json!cards/cards.json'], function (Backbone, app, AppRouter, Controller, cards) {
  new AppRouter({
    controller: new Controller({
      cards: cards
    })
  }, cards);
  Backbone.history.start();
  var mtApiCGIPath = $('#main-script').data('mtapi');
  app.start({
    cards: cards,
    mtApiCGIPath: mtApiCGIPath
  });
});
