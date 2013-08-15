describe("js", function () {
  'use strict';

  var device, Device;
  var Controller, controller, initData;
  var commandSpies;
  var cardLayoutSpy = jasmine.createSpy('cardLayoutSpy');
  var menuLayoutSpy = jasmine.createSpy('menuLayoutSpy');
  var loginViewSpy = jasmine.createSpy('loginViewSpy');
  var dashboardLayoutSpy = jasmine.createSpy('dashboardLayoutSpy');

  beforeEach(function () {
    requireModuleAndWait(['js/device']);

    runs(function () {
      device = require('js/device');
      var origFunc = device.getNavigator;
      Device = device.constructor;
      Device.prototype.getNavigator = function () {
        origFunc.apply(this);
        this.ua = window.Mock.userAgent;
        this.appName = window.Mock.appName;
      };
    });

    runs(function () {
      commandSpies = jasmine.createSpyObj('commandSpies', ['move:cardView:firstCard:view', 'app:beforeTransition', 'app:afterTransition', 'app:buildMenu', 'move:login', 'app:error']);
      initCommands(commandSpies, controller);

      runs(function () {
        var cardLayoutOrig = require('js/views/card/layout');
        undefRequireModule('js/views/card/layout');
        define('js/views/card/layout', [], function () {
          return cardLayoutOrig.extend({
            initialize: function (options) {
              cardLayoutOrig.prototype.initialize.apply(this, arguments);
              cardLayoutSpy(options);
            }
          });
        });

        var menuLayoutOrig = require('js/views/menu/layout');
        undefRequireModule('js/views/menu/layout');
        define('js/views/menu/layout', [], function () {
          return menuLayoutOrig.extend({
            initialize: function (options) {
              menuLayoutOrig.prototype.initialize.apply(this, arguments);
              menuLayoutSpy(options);
            }
          });
        });

        var loginViewOrig = require('js/views/login/login');
        undefRequireModule('js/views/login/login');
        define('js/views/login/login', [], function () {
          return loginViewOrig.extend({
            initialize: function (options) {
              loginViewOrig.prototype.initialize.apply(this, arguments);
              loginViewSpy(options);
            }
          });
        });

        var dashboardLayoutOrig = require('js/views/dashboard/layout');
        undefRequireModule('js/views/dashboard/layout');
        define('js/views/dashboard/layout', [], function () {
          return dashboardLayoutOrig.extend({
            initialize: function (options) {
              dashboardLayoutOrig.prototype.initialize.apply(this, arguments);
              dashboardLayoutSpy(options);
            }
          });
        });
      });

      runs(function () {
        reRequireModule(['js/app', 'js/router/controller']);
      });
    });

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = data;
      });
    });

    waitsFor(function () {
      return !!initData;
    }, 'initialize main', 3000);
  });

  var reRequireDevice = function () {
    undefRequireModule(['js/device']);
    window.define('js/device', [], function () {
      return new Device();
    });
    reRequireModule(['js/app']);
  };

  describe("app", function () {

    beforeEach(function () {
      resetMock();
      $('body').attr('class', '');
      $('#app-building').attr('style', '');
      window.Mock.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25';
    });

    it("start app with iOS", function () {
      window.Mock.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25';

      reRequireDevice();

      var spy = jasmine.createSpy('spy');
      var app;

      runs(function () {
        app = require('js/app');
        app.addInitializer(spy);
        app.start();
      });

      waitsFor(function () {
        return spy.callCount === 1;
      }, 'starting app', 3000);

      runs(function () {
        expect(app.initial).toBe(true);
        var $body = $('body');
        expect($body.hasClass('ios')).toBe(true);
        expect($body.hasClass('ios6')).toBe(true);
        expect($body.hasClass('ios6-1')).toBe(true);
        expect(app.device.browser).toBeFalsy();
      });
    });

    it("start app with Windows Phone 8", function () {
      window.Mock.userAgent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 620)';

      reRequireDevice();

      var spy = jasmine.createSpy('spy');
      var app;

      runs(function () {
        app = require('js/app');
        app.addInitializer(spy);
        app.start();
      });

      waitsFor(function () {
        return spy.callCount === 1;
      }, 'starting app', 3000);

      runs(function () {
        expect(app.initial).toBe(true);
        var $body = $('body');
        expect($body.hasClass('windows-phone')).toBe(true);
        expect($body.hasClass('windows-phone8')).toBe(true);
        expect($body.hasClass('windows-phone8-0')).toBe(true);
        expect($body.hasClass('ie')).toBe(true);
        expect($body.hasClass('ie10')).toBe(true);
        expect($body.hasClass('ie10-0')).toBe(true);
      });
    });

    it("generate card view handler with route.layout", function () {
      var layoutViewSpy = jasmine.createSpy('layoutViewSpy');
      define('cards/firstCard/view/layout', function () {
        return function (params) {
          return layoutViewSpy(params);
        };
      });

      var cards = [{
        "name": "first card",
        "id": "firstCard",
        "dashboard": {
          "view": "dashboard/dashboard"
        },
        "routes": [{
          "id": "view",
          "layout": "view/layout"
        }]
      }];

      reRequireDevice();

      var spy = jasmine.createSpy('spy');
      var app;
      var commands = require('js/commands');
      var count;

      runs(function () {
        app = require('js/app');
        spyOn(app.main, 'show');
        app.addInitializer(spy);
        app.start({
          cards: cards
        });
      });

      waitsFor(function () {
        return spy.callCount === 1;
      }, 'starting app', 3000);

      runs(function () {
        count = commandSpies['app:afterTransition'].callCount;
        commands.execute('move:cardView:firstCard:view', initData);
      });

      waitsFor(function () {
        return commandSpies['app:afterTransition'].callCount > count;
      }, 'requiring layout view', 3000);

      runs(function () {
        expect(layoutViewSpy).toHaveBeenCalled();
        expect(layoutViewSpy.mostRecentCall.args[0]).toEqual(initData);
        expect(app.main.show).toHaveBeenCalled();
      });
    });

    it("generate card view handler without route.layout", function () {
      var cards = [{
        "name": "second card",
        "id": "secondCard",
        "dashboard": {
          "view": "dashboard/dashboard"
        },
        "routes": [{
          "id": "view",
          "header": "header",
          "view": "view",
          "template": "template",
          "data": "data"
        }]
      }];

      reRequireDevice();

      var spy = jasmine.createSpy('spy');
      var app;
      var commands = require('js/commands');
      var count;

      runs(function () {
        app = require('js/app');
        spyOn(app.main, 'show');
        app.addInitializer(spy);
        app.start({
          cards: cards
        });
      });

      waitsFor(function () {
        return spy.callCount === 1;
      }, 'starting app', 3000);

      runs(function () {
        count = commandSpies['app:afterTransition'].callCount;
        commands.execute('move:cardView:secondCard:view', initData);
      });

      waitsFor(function () {
        return commandSpies['app:afterTransition'].callCount > count;
      }, 'requiring layout view', 3000);

      runs(function () {
        expect(cardLayoutSpy).toHaveBeenCalled();
        var params = cardLayoutSpy.mostRecentCall.args[0];
        var expected = cards[0].routes[0];
        expect(params.viewHeader).toEqual(expected.header);
        expect(params.viewView).toEqual(expected.view);
        expect(params.viewTemplate).toEqual(expected.template);
        expect(params.viewData).toEqual(expected.data);
        expect(app.main.show).toHaveBeenCalled();
      });
    });

    describe("handlers", function () {
      var spy;
      var app;

      beforeEach(function () {
        reRequireDevice();

        runs(function () {
          spy = jasmine.createSpy('spy');
          app = require('js/app');
          spyOn(app.menu, 'show');
          app.addInitializer(spy);
          app.start();
        });

        waitsFor(function () {
          return spy.callCount === 1;
        }, 'starting app', 3000);
      });

      it("app:buildMenu", function () {
        var commands = require('js/commands');
        var count = commandSpies['app:buildMenu'].callCount;
        commands.execute('app:buildMenu', initData);

        waitsFor(function () {
          return commandSpies['app:buildMenu'].callCount > count;
        }, 'executed app:buildMenu', 3000);

        runs(function () {
          expect(app.menu.show).toHaveBeenCalled();
          expect(menuLayoutSpy).toHaveBeenCalled();
          expect(menuLayoutSpy.mostRecentCall.args[0]).toEqual(initData);
        });
      });

      it("app:beforeTransition with normal device", function () {
        var commands = require('js/commands');
        var $appBuilding = $('#app-building').hide();
        commands.execute('app:beforeTransition');

        waitsFor(function () {
          return $('body').hasClass('onmove');
        }, 'executed app:beforeTransition', 3000);

        runs(function () {
          expect($appBuilding.attr('style')).toMatch(/display: block/);
          expect($appBuilding.attr('style')).not.toMatch(/top:/);
          expect($appBuilding.attr('style')).not.toMatch(/bottom:/);
        });
      });

      it("app:beforeTransition with Android", function () {
        runs(function () {
          window.Mock.userAgent = 'Mozilla/5.0 (Linux; U; Android 2.3.4; ja-jp; SonyEricssonSO-01C Build/4.0.1.C.1.31) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';
          $('body').attr('class', '');
          $('#app-building').attr('style', '');
          reRequireDevice();
        });

        var spy;
        runs(function () {
          spy = jasmine.createSpy('spy');
          app = require('js/app');
          app.addInitializer(spy);
          app.start();
        });

        waitsFor(function () {
          return spy.callCount === 1;
        }, 'starting app', 3000);

        var $appBuilding;
        runs(function () {
          $appBuilding = $('#app-building').hide();
          var commands = require('js/commands');

          commands.execute('app:beforeTransition');
        });

        waitsFor(function () {
          return $('body').hasClass('onmove');
        }, 'executed app:beforeTransition', 3000);

        runs(function () {
          expect($appBuilding.attr('style')).toMatch(/display: block/);
          expect($appBuilding.attr('style')).toMatch(/top:/);
          expect($appBuilding.attr('style')).toMatch(/bottom:/);
        });
      });

      it("move:login", function () {
        var count;
        runs(function () {
          spyOn(app.main, 'show');
          var commands = require('js/commands');
          count = commandSpies['move:login'].callCount;
          commands.execute('move:login', initData);
        });

        waitsFor(function () {
          return commandSpies['move:login'].callCount > count;
        }, 'executed move:login', 3000);

        runs(function () {
          expect(app.main.show).toHaveBeenCalled();
          expect(loginViewSpy).toHaveBeenCalled();
          expect(loginViewSpy.mostRecentCall.args[0]).toEqual(initData);
        });
      });

      it("app:error", function () {
        var count;
        runs(function () {
          spyOn(app.main, 'show');
          var commands = require('js/commands');
          count = commandSpies['app:error'].callCount;
          commands.execute('app:error', initData);
        });

        waitsFor(function () {
          return commandSpies['app:error'].callCount > count;
        }, 'executed app:error', 3000);

        runs(function () {
          expect(app.main.show).toHaveBeenCalled();
          expect(dashboardLayoutSpy).toHaveBeenCalled();
          expect(dashboardLayoutSpy.mostRecentCall.args[0]).toEqual(initData);
        });
      });
    });
  });

  afterEach(function () {
    resetMock();
    reRequireModule(['js/commands', 'js/app']);
  });
});
