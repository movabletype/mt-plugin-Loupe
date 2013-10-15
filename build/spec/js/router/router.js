  describe("router", function () {
    'use strict';

    var app, AppRouter, Controller, router, controller, commands, cards;

    cards = [{
      "name": "test",
      "id": "test",
      "dashboard": {
        "view": "dashboard"
      },
      "routes": [{
        "id": "view",
        "view": "view"
      }]
    }];

    var testSpy;

    beforeEach(function () {
      runs(function () {
        reRequireModule(['js/commands']);
      });

      runs(function () {
        reRequireModule(['js/router/router'])
      });

      runs(function () {
        reRequireModule(['js/router/controller'])
      });

      runs(function () {
        reRequireModule(['js/cards']);
      });

      runs(function () {
        reRequireModule(['js/app']);
      });

      runs(function () {
        AppRouter = require('js/router/router');
        Controller = require('js/router/controller');
        commands = require('js/commands');

        Backbone.history.stop();
        Backbone.history = new Backbone.History();

        testSpy = jasmine.createSpy('move:cardView:test:view');

        controller = new Controller();
        var origFunc = controller.addCardViewMethod;
        spyOn(controller, "addCardViewMethod").andCallFake(function (card, routeMethodName, callback) {
          if (routeMethodName === 'move:cardView:test:view') {
            controller['move:cardView:test:view'] = testSpy;
          } else {
            origFunc.call(controller, card, routeMethodName, callback);
          }
        });
        spyOn(controller, 'moveDashboard');

        router = new AppRouter({
          controller: controller
        });

        app = require('js/app');
        app.start({
          cards: cards,
          router: router
        });
      });

      waitsFor(function () {
        return Backbone.History.started;
      });
    });

    it("route to test card", function () {
      runs(function () {
        router.navigate('', true);
        router.navigate('test', true);
      });

      runs(function () {
        expect(testSpy).toHaveBeenCalled();
        app.stop();
      });
    });

    it("route to dashboard", function () {
      runs(function () {
        router.navigate('test', true);
        router.navigate('', true);
      });

      runs(function () {
        expect(controller.moveDashboard).toHaveBeenCalled();
        app.stop();
      });
    });

    it("route to dashboard even thought no cards", function () {
      runs(function () {
        router.navigate('test', true);
        app.stop();

        controller = new Controller();
        spyOn(controller, "moveDashboard");

        router = new AppRouter({
          controller: controller
        });

        app = require('js/app');
        app.start({
          router: router
        });
      });

      waitsFor(function () {
        return Backbone.History.started;
      });

      runs(function () {
        router.navigate('', true);
        expect(controller.moveDashboard).toHaveBeenCalled();
      });
    });

    it("router should listen navigate command and navigate it", function () {
      runs(function () {
        commands.execute('router:navigate', 'test');
      });

      runs(function () {
        expect(controller['move:cardView:test:view']).toHaveBeenCalled();
        router.navigate('', true);
      });
    });

    it("do nothing if navigate command have no params", function () {
      var count;
      runs(function () {
        router.navigate('test', true);
        count = controller.moveDashboard.callCount;
        commands.execute('router:navigate');
      });

      runs(function () {
        expect(controller.moveDashboard.callCount).toEqual(count);
        commands.execute('router:navigate', '');
      });

      runs(function () {
        expect(controller.moveDashboard.callCount).toEqual(count + 1);
      });
    });

    it("reserved route", function () {
      var spy;
      runs(function () {
        app.stop();
        spy = jasmine.createSpy('spy');

        define('cards/signout/view', [], function () {
          return function () {
            return spy;
          }
        });

        cards = [{
          "name": "signout",
          "id": "signout",
          "routes": [{
            "id": "view",
            "view": "view"
          }]
        }];

        controller = new Controller({
          cards: cards
        });
        spyOn(controller, 'signout');

        router = new AppRouter({
          controller: controller
        });

        app = require('js/app');
        app.start({
          cards: cards,
          router: router
        });
      });

      waitsFor(function () {
        return Backbone.History.started;
      });

      runs(function () {
        commands.execute('router:navigate', 'signout');
      });

      runs(function () {
        expect(controller.signout).toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
