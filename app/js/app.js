define(['backbone', 'backbone.marionette', 'js/device', 'js/commands', 'js/vent', 'js/router/router', 'js/router/controller', 'js/views/sidemenu/layout', 'js/views/dashboard/layout', 'js/views/card/layout', 'js/views/card/item_layout'],

function (Backbone, Marionette, device, commands, vent, AppRouter, Controller, SidemenuLayout, DashboardLayout, CardLayout, CardItemLayout) {
  "use strict";

  var app = new Marionette.Application();
  if (DEBUG) {
    require(['perf'], function (perf) {
      perf.start();
    });
  }

  app.addInitializer(function (options) {
    this.cards = options.cards;
    app.dashboardCardsData = {};
    var $body = $(document.body);
    if (device.platform) {
      $body.addClass(device.platform);
      if (device.version) {
        $body.addClass(device.platform + device.versionShortStr);
        $body.addClass(device.platform + device.versionStr);
      }
    }
    if (device.browser) {
      $body.addClass(device.browser);
      if (device.browserVersion) {
        $body.addClass(device.browser + device.browserVersionShortStr);
        $body.addClass(device.browser + device.browserVersionStr);
      }
    }
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

    var width = $(window).width();
    var mainWidth = $appMain.width();

    if (width === mainWidth) {
      $body.addClass('move');
    }

    var initialOffset = $headerMain.offset().left;
    var secondOffset = $headerMain.offset().left + $headerMain.innerWidth() - 5;

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
        if (device.isIE8 || width !== mainWidth) {
          $body.addClass('move');
        }
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

      if (device.isIE8) {
        finalize();
      } else {
        setTimeout(finalize, 300);
      }
    }
  });

  commands.setHandler('dashboard:rerender', function (params) {
    sessionStorage.removeItem('statsProvider');
    app.dashboardCardsData = {};

    app.main.show(new DashboardLayout({
      cards: app.cards,
      params: params
    }));
  });

  commands.setHandler('move:dashboard', function (params) {
    app.main.show(new DashboardLayout({
      cards: app.cards,
      params: params
    }));
  });

  commands.setHandler('move:cardView', function (params) {
    console.log('fofifi');
    console.log(params)
    app.main.show(new CardLayout(params));
  });

  commands.setHandler('move:cardItemView', function (params) {
    app.main.show(new CardItemLayout(params));
  });

  return app;
});
