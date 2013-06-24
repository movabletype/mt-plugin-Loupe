define(['backbone', 'backbone.marionette', 'js/cache', 'js/device', 'js/commands', 'js/vent', 'js/router/router', 'js/router/controller', 'js/views/menu/layout', 'js/views/dashboard/layout', 'js/views/card/layout'],

function (Backbone, Marionette, cache, device, commands, vent, AppRouter, Controller, MenuLayout, DashboardLayout, CardLayout) {
  "use strict";

  var app = new Marionette.Application();
  if (DEBUG) {
    require(['perf'], function (perf) {
      perf.start();
    });
  }

  app.addInitializer(function (options) {
    cache.set('app', 'initial', true);
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
    commands.setHandler('app:buildMenu', function (params) {
      app.menu.show(new MenuLayout(params));
    });

    commands.setHandler('app:beforeTransition', _.bind(function () {
      $(document.body).addClass('onmove');
      $('#app-building').show();
    }, this));

    commands.setHandler('app:afterTransition', _.bind(function () {
      $(document.body).removeClass('onmove');
      $('#app-building').hide();
    }, this));

    commands.setHandler('move:dashboard', function (params) {
      params.cards = app.cards;
      app.main.show(new DashboardLayout(params));
      commands.execute('app:afterTransition');
    });

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
              commands.execute('app:afterTransition');
            } else {
              params = _.extend(params, {
                viewHeader: route.header,
                viewView: route.view,
                viewTemplate: route.template,
                viewData: route.data
              });
              params.viewView = route.view;
              app.main.show(new CardLayout(params));
              commands.execute('app:afterTransition');
            }
          });
        });
      }
    });
  });

  app.addRegions({
    main: '#app',
    menu: '#menu'
  });

  return app;
});
