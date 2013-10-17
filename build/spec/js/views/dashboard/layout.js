describe("views", function () {
  'use strict';

  var Layout, layout, initData;
  var Controller, controller;

  var commandsOrig, commands, commandSpy, mainSpy, Main, flagSlideDown, flagSlideUp, slideDownSpy;
  beforeEach(function () {
    $('#dashboard').remove();

    commandsOrig = require('js/commands');
    commands = _.clone(commandsOrig);
    commandSpy = jasmine.createSpy('commandSpy');
    slideDownSpy = jasmine.createSpy('slideDownSpy');
    commands.execute = function (co, data) {
      if (co === 'l10n') {
        if (controller) {
          controller.l10n.waitLoadCommon(data);
        }
      } else {
        commandsOrig.execute.call(commandsOrig, co, data);
      }
      if (co === 'dashboard:slidedown') {
        flagSlideDown = true;
        slideDownSpy(data);
      } else if (co === 'dashboard:slideup') {
        flagSlideUp = true;
      }
      commandSpy(co, data);
    };

    undefRequireModule('js/commands');
    define('js/commands', [], function () {
      return commands;
    });

    var MainOrig = require('js/views/dashboard/main');
    mainSpy = jasmine.createSpy('mainSpy');
    Main = MainOrig.extend({
      initialize: function (options) {
        mainSpy(options);
        MainOrig.prototype.initialize.apply(this, arguments);
      }
    });

    undefRequireModule('js/views/dashboard/main');
    define('js/views/dashboard/main', [], function () {
      return Main;
    });

    reRequireModule(['js/router/controller', 'js/views/dashboard/layout']);

    runs(function () {
      Controller = require('js/router/controller');
      controller = new Controller();

      controller.auth(function (data) {
        Layout = require('js/views/dashboard/layout');
        initData = _.extend({}, data);
        layout = new Layout(initData);
        spyOn(layout, 'onRender').andCallThrough();
        spyOn(layout.main, 'show');
        layout.render();
        layout.$el.appendTo($('#app'));
      });
    });

    waitsFor(function () {
      return layout.onRender.calls && layout.onRender.calls.length;
    }, 'controller authentication', 3000);

    runs(function () {
      var origFunc = controller.l10n.load;
      spyOn(controller.l10n, 'load').andCallFake(function (path, namespace) {
        var fakePath = '/spec/' + path;
        return origFunc.call(controller.l10n, fakePath, namespace);
      });
    });
  });

  describe("dashboard/layout", function () {
    it("onRender", function () {
      expect(layout.onRender).toHaveBeenCalled();
      expect(layout.$el.attr('id')).toEqual('dashboard');
      expect(layout.$el.hasClass('container')).toBe(true);
      expect(mainSpy).toHaveBeenCalled();
      var args = mainSpy.mostRecentCall.args[0];
      expect(args).toEqual(layout.options);
    });

    it("onShow", function () {
      var $mainC = $('.main-container');
      $mainC.css({
        height: '100px',
        overflow: 'auto'
      });
      var $inner = $('<div style="height:1000px"></div>').appendTo($mainC);

      waitsFor(function () {
        return !!$inner.length;
      }, 'append inner to main container', 3000);

      runs(function () {
        layout.onShow();
        $mainC.scrollTop(100);
        $mainC.trigger('scroll');
        expect($('#header').hasClass('shadow')).toBe(true);

        $mainC.scrollTop(0);
        $mainC.trigger('smartscroll');

        expect($('#header').hasClass('shadow')).toBe(false);

        $inner.remove();
      });
    });

    it("slide up / slide down", function () {
      flagSlideDown = null;
      flagSlideUp = null;
      layout.$el.css('position', 'absolute');
      var windowHeight = $(window).height();
      commands.execute('dashboard:slidedown', 60);

      waitsFor(function () {
        return flagSlideDown;
      }, 'executed slide down', 3000);

      runs(function () {
        expect(slideDownSpy).toHaveBeenCalled();
        expect(slideDownSpy.mostRecentCall.args[0]).toEqual(60);
        expect(layout.$el.css('top')).toEqual((windowHeight - 60) + 'px');
        commands.execute('dashboard:slideup');
      });

      waitsFor(function () {
        return flagSlideUp;
      }, 'executed slide up', 3000);

      runs(function () {
        expect(layout.$el.css('top')).toEqual('0px');
      });
    });
  });

  afterEach(function () {
    layout.$el.remove();
    commandsOrig.execute('move:dashboard', initData);
    reRequireModule(['js/commands', 'js/router/controller', 'js/views/dashboard/layout']);
  });
});
