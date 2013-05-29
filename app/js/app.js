define(['backbone', 'backbone.marionette', 'js/commands', 'js/vent', 'js/router/router', 'js/router/controller', 'js/views/sidemenu/layout', 'js/views/dashboard/layout', 'js/views/widget/layout'],

function (Backbone, Marionette, commands, vent, AppRouter, Controller, SidemenuLayout, DashboardLayout, WidgetLayout) {
  "use strict";

  var app = new Marionette.Application();

  app.addInitializer(function (options) {
    this.widgets = options.widgets;
    app.dashboardWidgetsData = {};
  });

  app.addRegions({
    main: '#app',
    sidemenu: '#sidemenu'
  });

  vent.on('app:building:after', function (params) {
    if (DEBUG) {
      console.log('[vent:app:building:after]');
    }
    app.sidemenu.show(new SidemenuLayout(params));
  });

  commands.setHandler('sidemenu:toggle', function () {
    var $el = app.main.$el;
    var $body = $(document.body);
    var $appMain = $el.find('#main');
    var $appMainContainer = $el.find('.main-container');
    var $header = $el.find('#header');
    var $headerMain = $el.find('#header-main');
    var isIE8 = $('.ie8').length !== 0;

    var initialOffset = $headerMain.offset().left;
    var secondOffset = $headerMain.offset().left + $headerMain.innerWidth() - 18;

    var returnX = {
      'left': '0px'
    };

    if (!app.sidemenuShow) {
      app.sidemenu.$el.css({
        'display': 'block'
      });

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
        $body.addClass('move');
        setTimeout(function () {
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

      var finalize = function () {
        $body.removeClass('move');
        app.sidemenu.$el.css({
          'display': 'none'
        });
        app.sidemenuShow = false;
      }

      if (isIE8) {
        finalize();
      } else {
        setTimeout(finalize, 300);
      }
    }
  });

  commands.setHandler('dashboard:rerender', function (params) {
    sessionStorage.removeItem('statsProvider');
    app.dashboardWidgetsData = {};

    app.main.show(new DashboardLayout({
      widgets: app.widgets,
      params: params
    }));
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
