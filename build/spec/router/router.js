  describe("router", function () {
    'use strict';

    var AppRouter, Controller, router, controller, commands, cards;

    var app = require('js/app');
    var mtapi = require('js/mtapi');
    AppRouter = require('js/router/router');
    Controller = require('js/router/controller');
    commands = require('js/commands');

    cards = [{
        "name": "test",
        "id": "test",
        "dashboardView": "dashboard",
        "viewView": "view"
      }
    ];

    beforeEach(function () {
      app.start({
        cards: cards
      });
      controller = new Controller({
        cards: cards
      });
    });

    it("route to test card", function () {
      spyOn(controller, "moveCardPage_test");
      router = new AppRouter({
        controller: controller
      }, cards);
      router.navigate('test', true);
      expect(controller.moveCardPage_test).toHaveBeenCalled();
    });

    it("route to dashboard", function () {
      spyOn(controller, "moveDashboard");
      router = new AppRouter({
        controller: controller
      }, cards);
      router.navigate('', true);
      expect(controller.moveDashboard).toHaveBeenCalled();
    });

    it("should not route unused cards", function () {
      spyOn(controller, "moveCardPage_test");
      router = new AppRouter({
        controller: controller
      }, cards);
      router.navigate('test', true);
      expect(controller.moveCardPage_test);

      controller = new Controller({
        cards: cards
      });
      spyOn(controller, "moveCardPage_test");
      router = new AppRouter({
        controller: controller
      }, [{}]);
      router.navigate('test', true);
      expect(controller.moveCardPage_test).not.toHaveBeenCalled();
    });

    it("route to dashboard even thought no cards", function () {
      spyOn(controller, "moveDashboard");
      router = new AppRouter({
        controller: controller
      }, []);
      router.navigate('', true);
      expect(controller.moveDashboard).toHaveBeenCalled();
    });

    it("router should listen navigate command and navigate it", function () {
      spyOn(controller, "moveCardPage_test");
      router = new AppRouter({
        controller: controller
      }, cards);
      runs(function () {
        commands.execute('router:navigate', 'test');
      });
      runs(function () {
        expect(controller.moveCardPage_test).toHaveBeenCalled();
      });
    });

    it("do nothing if navigate command have no params", function () {
      spyOn(controller, "moveDashboard").andCallThrough();
      router = new AppRouter({
        controller: controller
      }, cards);
      runs(function () {
        commands.execute('router:navigate');
      });
      runs(function () {
        expect(controller.moveDashboard).not.toHaveBeenCalled();
      });
    });
  });
