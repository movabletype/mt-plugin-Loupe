define(['backbone', 'backbone.marionette', 'js/commands', 'js/router/router', 'js/router/controller', 'js/views/sidemenu/layout', 'js/views/dashboard/layout', 'js/views/widget/layout'],

function (Backbone, Marionette, commands, AppRouter, Controller, SidemenuLayout, DashboardLayout, WidgetLayout) {
  "use strict";

  var app = new Marionette.Application();

  app.addInitializer(function (options) {
    this.widgets = options.widgets;
    app.dashboardWidgetsData = {};

    //$(document.body).on('touchmove', function (e) {
    //  e.preventDefault();
    //});
  });

  app.addRegions({
    main: '#app',
    sidemenu: '#sidemenu'
  });

  commands.setHandler('sidemenu:toggle', function () {
    var $el = app.main.$el;
    var $appMain = $el.find('#main');
    var $appMainContainer = $el.find('.main-container');
    var $header = $el.find('#header');
    var $headerMain = $el.find('#header-main');

    var initialOffset = $headerMain.offset().left;
    var secondOffset = $headerMain.offset().left + $headerMain.innerWidth() - 10;

    var returnX = {
      'left': '0px'
    };

    if (!app.sidemenuShow) {
      app.sidemenu.show(new SidemenuLayout());
      $headerMain.css({
        'margin-left': '0',
        'margin-right': '0'
      });
      $appMain.css({
        'margin-left': '0',
        'margin-right': '0'
      });

      $appMainContainer.css({
        'left': initialOffset + 'px'
      });
      $header.css({
        'left': initialOffset + 'px'
      });
      setTimeout(function () {
        $header.addClass('move');
        $appMainContainer.addClass('move');
        $appMainContainer.css({
          'left': secondOffset + 'px'
        });
        $header.css({
          'left': secondOffset + 'px'
        });
        setTimeout(function () {
          app.sidemenuShow = true;
        }, 300);
      }, 10);
    } else {
      $headerMain.css({
        'margin-left': 'auto',
        'margin-right': 'auto'
      });
      $appMain.css({
        'margin-left': 'auto',
        'margin-right': 'auto'
      });
      $appMainContainer.css(returnX);
      $header.css(returnX);
      setTimeout(function () {
        $header.removeClass('move');
        $appMainContainer.removeClass('move');
        app.sidemenu.close();
        app.sidemenuShow = false;
      }, 500);
    }
  });

  commands.setHandler('dashboard:rerender', function (params) {
    sessionStorage.removeItem('statsProvider');
    app.dashboardWidgetsData = {};

    app.main.show(new DashboardLayout({
      widgets: app.widgets,
      params: params
    }));
  })

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