define(['backbone', 'backbone.marionette', 'js/cache', 'js/device', 'js/commands', 'js/vent', 'js/router/router', 'js/router/controller', 'js/views/menu/layout', 'js/views/dashboard/layout', 'js/views/card/layout', 'js/views/login/login'],

  function (Backbone, Marionette, cache, device, commands, vent, AppRouter, Controller, MenuLayout, DashboardLayout, CardLayout, LoginView) {
    "use strict";

    var app = new Marionette.Application();
    if (DEBUG) {
      require(['perf'], function (perf) {
        perf.start();
      });
    }

    app.addInitializer(function (options) {
      cache.set('app', 'initial', true);
      this.initial = true;
      this.cards = options.cards;
      this.device = device;
      var $body = $(document.body);
      if (this.device.platform) {
        $body.addClass(this.device.platform);
        if (this.device.version) {
          $body.addClass(this.device.platform + this.device.versionShortStr);
          $body.addClass(this.device.platform + this.device.versionStr);
        }
      }
      if (this.device.browser) {
        $body.addClass(this.device.browser);
        if (this.device.browserVersion) {
          $body.addClass(this.device.browser + this.device.browserVersionShortStr);
          $body.addClass(this.device.browser + this.device.browserVersionStr);
        }
      }
      commands.setHandler('app:buildMenu', function (params) {
        app.menu.show(new MenuLayout(params));
      });

      commands.setHandler('app:beforeTransition', _.bind(function () {
        $(document.body).addClass('onmove');
        var $appBuilding = $('#app-building');
        if (this.device.isAndroid || this.device.isWindowsPhone) {
          var top = $(document.body).scrollTop();
          $appBuilding.css({
            top: top + 'px',
            bottom: '-' + top + 'px'
          });
        }
        $appBuilding.show();
      }, this));

      commands.setHandler('app:afterTransition', _.bind(function () {
        $(document.body).removeClass('onmove');
        $('#app-building').hide();
      }, this));

      commands.setHandler('move:login', function (params) {
        app.main.show(new LoginView(params));
        commands.execute('app:afterTransition');
      });

      commands.setHandler('move:dashboard', function (params) {
        params.cards = app.cards;
        app.main.show(new DashboardLayout(params));
        commands.execute('app:afterTransition');
      });

      commands.setHandler('app:error', _.bind(function (params) {
        app.main.show(new DashboardLayout(params));
        commands.execute('app:afterTransition');
      }));

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
                  commands.execute('app:afterTransition');
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
