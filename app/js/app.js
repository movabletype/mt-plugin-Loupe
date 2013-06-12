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
