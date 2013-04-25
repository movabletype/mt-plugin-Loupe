define(['backbone', 'backbone.marionette', 'js/vent', 'js/router/router', 'js/router/controller', 'js/views/sidemenu/main', 'js/views/dashboard/layout', 'js/views/widget/layout'],

function (Backbone, Marionette, vent, AppRouter, Controller, SidemenuView, DashboardLayout, WidgetLayout) {
  "use strict";

  var app = new Marionette.Application();

  app.addInitializer(function (options) {
    this.widgets = options.widgets;
    Backbone.history.start();
    app.sidemenu.show(new SidemenuView());

    var left = parseInt($(app.sidemenu.el).css('left'), 10);

    $(document.body).on('touchmove', function (e) {
      e.preventDefault();
    });

    app.sidemenu.$el.hammer()
      .on('swiperight', function (e) {
      e.preventDefault();
      $(app.sidemenu.el).css({
        'left': '0px',
        'z-index': 11
      });
    })
      .on('swipeleft', function (e) {
      e.preventDefault();
      $(app.sidemenu.el).css({
        'left': left + 'px'
      });
      setTimeout(function () {
        $(app.sidemenu.el).css({
          'z-index': 9
        });
      }, 250);
    });
  });

  app.addRegions({
    main: '#app',
    sidemenu: '#sidemenu'
  });

  vent.on("app:move", function (param) {
    var layout = {
      'dashboard': DashboardLayout,
      'widget': WidgetLayout
    },
    left = parseInt($(app.sidemenu.el).css('left'), 10),
      to = (param && param.to) ? param.to : 'dashboard',
      data = {};
    data.widgets = app.widgets;
    data.widget = param.widget ? param.widget : null;
    app.main.show(new layout[to](data));

    app.main.$el.hammer()
      .on('swiperight', function (e) {
      e.preventDefault();
      $(app.sidemenu.el).css({
        'left': '0px',
        'z-index': 11
      });
    })
      .on('swipeleft', function (e) {
      e.preventDefault();
      $(app.sidemenu.el).css({
        'left': left + 'px'
      });
      setTimeout(function () {
        $(app.sidemenu.el).css({
          'z-index': 9
        });
      }, 250);
    });
  });

  return app;
});