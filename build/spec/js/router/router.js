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
      })
    });

    it("route to test card", function () {
      runs(function () {
        controller = new Controller({
          cards: cards
        });
        spyOn(controller, "move:cardView:test:view");

        router = new AppRouter({
          controller: controller
        });

        app = require('js/app');
        app.start({
          cards: cards
        });
      });

      waitsFor(function () {
        return Backbone.History.started;
      });

      runs(function () {
        router.navigate('', true);
        router.navigate('test', true);
      });

      runs(function () {
        expect(controller['move:cardView:test:view']).toHaveBeenCalled();
      });
    });

    it("route to dashboard", function () {
      runs(function () {
        controller = new Controller({
          cards: cards
        });
        spyOn(controller, "moveDashboard");

        router = new AppRouter({
          controller: controller
        });

        app = require('js/app');
        app.start({
          cards: cards
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

    it("should not route unused cards", function () {
      runs(function () {
        controller = new Controller({
          cards: cards
        });
        spyOn(controller, "move:cardView:test:view");

        router = new AppRouter({
          controller: controller
        });

        app = require('js/app');
        app.start();
      });

      waitsFor(function () {
        return Backbone.History.started;
      });

      runs(function () {
        router.navigate('test', true);
        expect(controller['move:cardView:test:view']).not.toHaveBeenCalled();
      });
    });

    it("route to dashboard even thought no cards", function () {
      runs(function () {
        controller = new Controller({
          cards: cards
        });
        spyOn(controller, "moveDashboard");

        router = new AppRouter({
          controller: controller
        });

        app = require('js/app');
        app.start({
          cards: cards
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
        controller = new Controller({
          cards: cards
        });
        spyOn(controller, "moveDashboard");
        spyOn(controller, "move:cardView:test:view");

        router = new AppRouter({
          controller: controller
        });

        app = require('js/app');
        app.start({
          cards: cards
        });
      });

      waitsFor(function () {
        return Backbone.History.started;
      });

      runs(function () {
        commands.execute('router:navigate', 'test');
      });

      runs(function () {
        expect(controller['move:cardView:test:view']).toHaveBeenCalled();
        router.navigate('', true);
      });
    });

    it("do nothing if navigate command have no params", function () {
      runs(function () {
        controller = new Controller({
          cards: cards
        });
        spyOn(controller, "moveDashboard");

        router = new AppRouter({
          controller: controller
        });

        app = require('js/app');
        app.start({
          cards: cards
        });
      });

      waitsFor(function () {
        return Backbone.History.started;
      });

      var count;
      runs(function () {
        count = controller.moveDashboard.callCount;
        commands.execute('router:navigate');
      });

      runs(function () {
        expect(controller.moveDashboard.callCount).toEqual(count);
        commands.execute('router:navigate', '');
      });
    });

    it("reserved route", function () {
      var spy;
      runs(function () {
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
          cards: cards
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
