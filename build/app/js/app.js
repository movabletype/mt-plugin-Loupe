define(['backbone', 'backbone.marionette', 'js/cards', 'js/cache', 'js/device', 'js/commands', 'js/vent', 'js/router/router', 'js/router/controller', 'js/views/menu/layout', 'js/views/dashboard/layout', 'js/views/card/layout', 'js/views/signin/signin'],

  function (Backbone, Marionette, cards, cache, device, commands, vent, AppRouter, Controller, MenuLayout, DashboardLayout, CardLayout, SigninView) {
    "use strict";

    var Loupe = Marionette.Application.extend({
      setCardViewHandler: function (card, route) {
        commands.setHandler('move:cardView:' + card.id + ':' + route.id, function (params) {
          if (DEBUG) {
            console.log('move:cardView:' + card.id + ':' + route.id);
          }
          var path = 'cards/' + card.id + '/';
          if (route.layout) {
            require([path + route.layout.replace(/\.js$/, '')], _.bind(function (Layout) {
              this.main.show(new Layout(params));
              commands.execute('app:afterTransition');
            }, this));
          } else {
            params = _.extend(params, {
              viewHeader: route.header,
              viewView: route.view,
              viewTemplate: route.template,
              viewData: route.data
            });
            params.viewView = route.view;
            this.main.show(new CardLayout(params));
            commands.execute('app:afterTransition');
          }
        }, this);
      },
      deployAddedCard: function (addedCards) {
        if (addedCards && addedCards.length) {
          cards.deploy().done(function () {
            commands.execute('dashboard:insertCard', addedCards);
          });
        }
      },
      appendDeviceClass: function (device) {
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
      },
      setCommandHandlers: function () {
        commands.setHandlers({
          'app:buildMenu': {
            context: this,
            callback: function (params) {
              this.menu.show(new MenuLayout(params));
            }
          },
          'app:beforeTransition': {
            context: this,
            callback: function () {
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
            }
          },
          'app:afterTransition': {
            context: this,
            callback: function () {
              $(document.body).removeClass('onmove');
              $('#app-building').hide();
            }
          },
          'move:signin': {
            context: this,
            callback: function (params) {
              this.main.show(new SigninView(params));
              commands.execute('app:afterTransition');
            }
          },
          'move:dashboard': {
            context: this,
            callback: function (params) {
              params.cards = _.map(this.cards, function (card) {
                return _.clone(card);
              });
              this.main.show(new DashboardLayout(params));
              commands.execute('app:afterTransition');
            }
          },
          'app:error': {
            context: this,
            callback: function (params) {
              this.main.show(new DashboardLayout(params));
              commands.execute('app:afterTransition');
            }
          },
          'app:setCardViewHandler': {
            context: this,
            callback: function (card, route, callback) {
              this.setCardViewHandler(card, route);
              if (callback) {
                callback();
              }
            }
          }
        });
      },
      stop: function () {
        this.closeRegions();
        cards.clearAll();
        vent.off();
        commands.removeAllHandlers();
        cache.clearAll();
        this._initCallbacks.reset();
        Backbone.history.stop();
        Backbone.history = new Backbone.History();
      },
      initialize: function (options) {
        if (DEBUG) {
          require(['perf'], function (perf) {
            perf.start();
          });
        }
        this.id = (new Date()).valueOf();
        options = options || {};
        cache.set('app', 'initial', true);
        cache.set('app', 'staticPath', $('#main-script').data('base'));

        this.initial = true;
        this.cards = cards.add(options.cards, true).getAll();
        this.device = device;

        this.addRegions({
          main: '#app',
          menu: '#menu'
        });

        this.router = options.router || new AppRouter({
          controller: new Controller()
        });

        this.appendDeviceClass(device);
        this.setCommandHandlers();

        vent.on('cards:add', this.deployAddedCard, this);

        cards.deploy().done(function () {
          if (!Backbone.History.started) {
            Backbone.history.start();
          }
          vent.trigger('app:cards:deploy:end');
        });
      }
    });

    var app = new Loupe();
    app.addInitializer(app.initialize);

    return app;
  });
