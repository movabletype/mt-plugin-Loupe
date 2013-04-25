  describe("router", function () {
    'use strict';

    var AppRouter, Controller, router, controller, vent, widgets;

    var app = require('js/app');
    AppRouter = require('js/router/router');
    Controller = require('js/router/controller');
    vent = require('js/vent');

    widgets = [{
      "name": "test",
      "id": "test",
      "dashboardView": "dashboard",
      "viewView": "view"
    }];

    beforeEach(function () {
      app.start({
        widgets: widgets
      });
      controller = new Controller({
        widgets: widgets
      });
    });

    it("route to test widget", function () {
      spyOn(controller, "moveWidgetPage_test");
      router = new AppRouter({
        controller: controller
      }, widgets);
      router.navigate('test', true);
      expect(controller.moveWidgetPage_test).toHaveBeenCalled();
    });

    it("route to dashboard", function () {
      spyOn(controller, "moveDashboard");
      router = new AppRouter({
        controller: controller
      }, widgets);
      router.navigate('', true);
      expect(controller.moveDashboard).toHaveBeenCalled();
    });

    it("should not route unused widgets", function () {
      spyOn(controller, "moveWidgetPage_test");
      router = new AppRouter({
        controller: controller
      }, widgets);
      router.navigate('test', true);
      expect(controller.moveWidgetPage_test);

      controller = new Controller({
        widgets: widgets
      });
      spyOn(controller, "moveWidgetPage_test");
      router = new AppRouter({
        controller: controller
      }, [{}]);
      router.navigate('test', true);
      expect(controller.moveWidgetPage_test).not.toHaveBeenCalled();
    });

    it("route to dashboard even thought no widgets", function () {
      spyOn(controller, "moveDashboard");
      router = new AppRouter({
        controller: controller
      }, []);
      router.navigate('', true);
      expect(controller.moveDashboard).toHaveBeenCalled();
    });

    it("router should listen navigate event and navigate it", function () {
      spyOn(controller, "moveWidgetPage_test");
      router = new AppRouter({
        controller: controller
      }, widgets);
      runs(function () {
        vent.trigger('navigate', 'test');
      });
      runs(function () {
        expect(controller.moveWidgetPage_test).toHaveBeenCalled();
      });
    });

    it("do nothing if navigate event have no params", function () {
      spyOn(controller, "moveDashboard").andCallThrough();
      router = new AppRouter({
        controller: controller
      }, widgets);
      runs(function () {
        vent.trigger('navigate');
      });
      runs(function () {
        expect(controller.moveDashboard).not.toHaveBeenCalled();
      });
    });
  });