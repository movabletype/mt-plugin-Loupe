describe("views", function () {
  'use strict';

  var Main, main;
  var Controller, controller, initData;
  var commandSpies;
  var blogListViewSpy = jasmine.createSpy('blogListViewSpy');

  beforeEach(function () {
    var BlogListViewOrig = require('js/views/menu/blogs-list');
    undefRequireModule('js/views/menu/blogs-list');
    define('js/views/menu/blogs-list', [], function () {
      return BlogListViewOrig.extend({
        initialize: function (options) {
          BlogListViewOrig.prototype.initialize.apply(this, arguments);
          blogListViewSpy(options);
        }
      })
    });

    commandSpies = jasmine.createSpyObj('commandSpies', ['dashboard:toggle', 'menu:header:toggle'])
    initCommands(commandSpies, controller);
    runs(function () {
      reRequireModule(['js/router/controller', 'js/views/menu/main']);
    })

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = data;
        Main = require('js/views/menu/main');
        main = new Main(data);
      });
    });

    waitsFor(function () {
      return !!main;
    }, 'initialize main', 3000);
  });

  describe("dashboard/main", function () {
    it("onRender", function () {
      spyOn(main.blogs, 'show');
      main.render();
      expect(main.blogs.show).toHaveBeenCalled();
      expect(blogListViewSpy).toHaveBeenCalled();
      expect(blogListViewSpy).toHaveBeenCalledWith(main.options);
    });

    it("tap menu-header", function () {
      main.render();
      main.$el.appendTo($('#menu'));
      main.$el.find('#menu-header').trigger('tap');

      waitsFor(function () {
        return !!commandSpies['dashboard:toggle'].callCount;
      }, 'executed dashboard:toggle', 3000);

      runs(function () {
        expect(commandSpies['dashboard:toggle'].callCount).toEqual(1)
      });
    });

    it("execute menu:header:toggle", function () {
      spyOn(main, 'handleToggle').andCallThrough();
      main.render();
      main.$el.appendTo($('#menu'));
      require('js/commands').execute('menu:header:toggle');

      waitsFor(function () {
        return !!commandSpies['menu:header:toggle'].callCount;
      }, 'executed menu:header:toggle', 3000);

      runs(function () {
        expect(main.handleToggle).toHaveBeenCalled();
        expect(main.$el.find('#menu-header-arrow').hasClass('rotate')).toBe(true);
        require('js/commands').execute('menu:header:toggle');
      });

      waitsFor(function () {
        return commandSpies['menu:header:toggle'].callCount === 2;
      }, 'executed menu:header:toggle', 3000);

      runs(function () {
        expect(main.$el.find('#menu-header-arrow').hasClass('rotate')).toBe(false);
      });
    });
  });

  afterEach(function () {
    main.$el.remove();
    $('#dashboard').remove();
    reRequireModule(['js/commands', 'js/router/controller', 'js/views/menu/blogs-list']);
    runs(function () {
      backToDashboard(main.$el, initData);
    })
  });
});
