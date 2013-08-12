describe("views", function () {
  'use strict';

  var Header, header, initData;
  var Controller, controller;

  var commandsOrig, commands, cmd, commandSpy, mainSpy, Main, flagSlideDown, flagSlideUp, flagToggle;
  beforeEach(function () {
    $('#dashboard').remove();

    commandsOrig = require('js/commands');
    commands = _.clone(commandsOrig);

    cmd = jasmine.createSpyObj('cmd', ['command', 'dashboard:slidedown', 'dashboard:slideup', 'menu:hide', 'menu:show', 'menu:header:toggle']);
    commandSpy = jasmine.createSpy('commandSpy');

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
      } else if (co === 'dashboard:slideup') {
        flagSlideUp = true;
      } else if (co === 'dashboard:toggle') {
        flagToggle = true;
      }
      if (cmd[co]) {
        cmd[co](data)
      };
      commandSpy(co, data);
    };

    undefRequireModule('js/commands');
    define('js/commands', [], function () {
      return commands;
    });

    reRequireModule(['js/router/controller', 'js/views/dashboard/header']);

    runs(function () {
      Controller = require('js/router/controller');
      controller = new Controller();

      controller.auth(function (data) {
        Header = require('js/views/dashboard/header');
        initData = _.extend({}, data);
        header = new Header(initData);
        spyOn(header, 'onRender').andCallThrough();
        spyOn(header, 'adjustHeader').andCallThrough();
        spyOn(header, 'handleSlide').andCallThrough();
        header.render();
        header.$el.appendTo($('#app'));
      });
    });

    waitsFor(function () {
      return header.onRender.calls && header.onRender.calls.length;
    }, 'controller authentication', 3000);

    runs(function () {
      var origFunc = controller.l10n.load;
      spyOn(controller.l10n, 'load').andCallFake(function (path, namespace) {
        var fakePath = '/spec/' + path;
        return origFunc.call(controller.l10n, fakePath, namespace);
      });
    });
  });

  describe("dashboard/header", function () {
    it("adjustHeader", function () {
      var flag;
      setTimeout(function () {
        flag = true;
      }, 100);

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(header.adjustHeader).toHaveBeenCalled();
        expect(header.$el.hasClass('show')).toBe(true);
      });
    });

    it("orientationchange and debouncedresize events trigger adjustHeader", function () {
      header.$el.remove();
      header = new Header(initData);
      spyOn(header, 'adjustHeader');
      spyOn(header, 'onRender').andCallThrough();
      header.render();
      header.$el.appendTo($('#app'));

      waitsFor(function () {
        return header.onRender.calls && header.onRender.calls.length;
      }, 'render', 3000);

      var flag, flag2;
      runs(function () {
        $(window).on('orientationchange', function () {
          setTimeout(function () {
            flag = true;
          }, 100);
        });
        $(window).trigger('orientationchange');
      });

      waitsFor(function () {
        return flag;
      }, 'listening to orientationchange event', 3000);

      runs(function () {
        expect(header.adjustHeader).toHaveBeenCalled();
        expect(header.adjustHeader.callCount).toEqual(2);
        $(window).on('debouncedresize', function () {
          setTimeout(function () {
            flag2 = true;
          }, 100);
        });
        $(window).trigger('debouncedresize');
      });

      waitsFor(function () {
        return flag2;
      }, 'listening to debouncedresize event', 3000);

      runs(function () {
        expect(header.adjustHeader.callCount).toEqual(3);
      })
    });

    it("handleSlide", function () {
      var $blognameArrow = $('#blogname-arrow');
      commands.execute('dashboard:toggle');

      waitsFor(function () {
        return flagToggle
      }, 'executed dashboard:toggle', 3000);

      runs(function () {
        expect(header.handleSlide).toHaveBeenCalled();
        expect($(document.body).hasClass('hide')).toBe(true);
        expect(cmd['menu:show']).toHaveBeenCalled();
        expect(cmd['dashboard:slidedown']).toHaveBeenCalled();
        expect(cmd['dashboard:slidedown']).toHaveBeenCalledWith(header.$el.height());
        expect(cmd['menu:header:toggle']).toHaveBeenCalled();
        expect($blognameArrow.hasClass('rotate')).toBe(true);
        flagToggle = null;
        commands.execute('dashboard:toggle');
      });

      waitsFor(function () {
        return flagToggle
      }, 'executed dashboard:toggle', 3000);

      runs(function () {
        expect(header.handleSlide.callCount).toEqual(2);
        expect($(document.body).hasClass('hide')).toBe(false);
        expect(cmd['menu:hide']).toHaveBeenCalled();
        expect(cmd['dashboard:slideup']).toHaveBeenCalled();
        expect(cmd['menu:header:toggle'].callCount).toEqual(2);
        expect($blognameArrow.hasClass('rotate')).toBe(false);
      });
    });
  });

  afterEach(function () {
    header.$el.remove();
    commandsOrig.execute('move:dashboard', initData);
    reRequireModule(['js/commands', 'js/router/controller', 'js/views/dashboard/header']);
  });
});
