describe("views", function () {
  'use strict';

  var Layout, layout;
  var Controller, controller, initData;
  var commandSpies;
  var mainViewSpy = jasmine.createSpy('mainViewSpy');

  beforeEach(function () {
    var MainViewOrig = require('js/views/menu/main');
    undefRequireModule('js/views/menu/main');
    define('js/views/menu/main', [], function () {
      return MainViewOrig.extend({
        initialize: function (options) {
          MainViewOrig.prototype.initialize.apply(this, arguments);
          mainViewSpy(options);
        }
      });
    });

    commandSpies = jasmine.createSpyObj('commandSpies', ['menu:show', 'menu:hide']);
    initCommands(commandSpies, controller);

    runs(function () {
      reRequireModule(['js/router/controller', 'js/views/menu/layout']);
    })

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = data;
        Layout = require('js/views/menu/layout');
        layout = new Layout(data);
      });
    });

    waitsFor(function () {
      return !!layout;
    }, 'initialize main', 3000);
  });

  describe("dashboard/main", function () {
    it("onRender", function () {
      spyOn(layout.main, 'show');
      layout.render();
      expect(layout.$el.hasClass('container')).toBe(true);
      expect(layout.main.show).toHaveBeenCalled();
      expect(mainViewSpy).toHaveBeenCalled();
      expect(mainViewSpy).toHaveBeenCalledWith(layout.options);
    });

    it("main show/hide handler", function () {
      layout.render();
      var commands = require('js/commands');
      commands.execute('menu:hide');

      waitsFor(function () {
        return commandSpies['menu:hide'].callCount === 1;
      }, 'executed menu:hide', 3000);

      runs(function () {
        expect(layout.$el.attr('style')).toMatch(/display:\s?none/);
        commands.execute('menu:show');
      });

      waitsFor(function () {
        return commandSpies['menu:show'].callCount === 1;
      }, 'executed menu:show', 3000);

      runs(function () {
        expect(layout.$el.attr('style')).toMatch(/display:\s?block/);
      });
    });
  });

  afterEach(function () {
    reRequireModule(['js/commands', 'js/router/controller', 'js/views/menu/main']);
  });
});
