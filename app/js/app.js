define(['backbone', 'backbone.marionette', 'js/device', 'js/commands', 'js/vent', 'js/router/router', 'js/router/controller', 'js/views/menu/layout', 'js/views/dashboard/layout', 'js/views/card/layout'],

function (Backbone, Marionette, device, commands, vent, AppRouter, Controller, MenuLayout, DashboardLayout, CardLayout) {
  "use strict";

  var app = new Marionette.Application();
  if (DEBUG) {
    require(['perf'], function (perf) {
      perf.start();
    });
  }

  app.addInitializer(function (options) {
    this.cards = options.cards;
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
    _.each(app.cards, function (card) {
      if (card.routes && card.routes.length) {
        _.each(card.routes, function (route) {
          commands.setHandler('move:cardView:' + card.id + ':' + route.id, function (params) {
            if (DEBUG) {
              console.log('move:cardView:' + card.id + ':' + route.id);
            }
            var path = 'cards/' + card.id + '/';
            if (route.layout) {
              require([path + route.layout.replace(/\.js$/, '')], function (Layout) {
                app.main.show(new Layout(params));
              });
            } else {
              params = _.extend(params, {
                viewHeader: route.header,
                viewView: route.view,
                viewTemplate: route.template,
                viewData: route.data
              });
              params.viewView = route.view;
              app.main.show(new CardLayout(params));
            }
          })
        })
      }
    });
  });

  app.addRegions({
    main: '#app',
    menu: '#menu'
  });

  vent.on('app:building:after', function (params) {
    if (DEBUG) {
      console.log('[vent:app:building:after]');
    }
    app.menu.show(new MenuLayout(params));
  });

  commands.setHandler('dashboard:rerender', function (params) {
    $(document.body).append('<div id="app-building"></div>');
    params.refetch = true;
    params.cards = app.cards;
    app.main.show(new DashboardLayout(params));
  });

  commands.setHandler('move:dashboard', function (params) {
    params.cards = app.cards;
    app.main.show(new DashboardLayout(params));
  });

  return app;
});
