define(['backbone', 'backbone.marionette', 'js/commands', 'js/router/router', 'js/router/controller', 'js/views/sidemenu/main', 'js/views/dashboard/layout', 'js/views/widget/layout'],

function (Backbone, Marionette, commands, AppRouter, Controller, SidemenuView, DashboardLayout, WidgetLayout) {
  "use strict";

  var app = new Marionette.Application();

  app.addInitializer(function (options) {
    this.widgets = options.widgets;

    app.sidemenu.show(new SidemenuView());

    $(document.body).on('touchmove', function (e) {
      e.preventDefault();
    });
  });

  app.addRegions({
    main: '#app',
    sidemenu: '#sidemenu'
  });

  commands.setHandler('move:dashboard', function (params) {
    app.main.show(new DashboardLayout({
      widgets: app.widgets,
      params: params
    }));
  });

  commands.setHandler('move:widget', function (params) {
    app.main.show(new WidgetLayout(params));
  });

  return app;
});