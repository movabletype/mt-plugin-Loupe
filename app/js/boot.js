require(['app', 'js/router/router', 'js/router/controller', 'json!widgets/widgets.json'], function (app, AppRouter, Controller, widgets) {
  new AppRouter({
    controller: new Controller({
      widgets: widgets
    })
  }, widgets);
  app.start({
    widgets: widgets,
  });
});