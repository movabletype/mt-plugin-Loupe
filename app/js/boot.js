require(['jquery', 'app', 'js/router/router', 'js/router/controller', 'json!widgets/widgets.json'], function ($, app, AppRouter, Controller, widgets) {
  new AppRouter({
    controller: new Controller({
      widgets: widgets
    })
  }, widgets);
  Backbone.history.start();
  var mtApiCGIPath = $('#main-script').data('mtapi');
  app.start({
    widgets: widgets,
    mtApiCGIPath: mtApiCGIPath
  });
});