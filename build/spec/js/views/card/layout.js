describe("views", function () {
  'use strict';

  var initData, commandSpy, shareInitializeSpy, flagShare, flagShareClose, commandsOrig, controller;
  beforeEach(function () {
    commandsOrig = require('js/commands');
    var command = _.clone(commandsOrig);
    commandSpy = jasmine.createSpy('commandSpy');
    command.execute = function (co, data) {
      commandSpy(co, data);

      if (co === 'l10n') {
        controller.l10n.waitLoadCommon(data);
      } else {
        commandsOrig.execute.call(commandsOrig, co, data);
      }

      if (co === 'share:show') {
        flagShare = true;
      } else if (co === 'share:close') {
        flagShareClose = true;
      }
    };

    undefRequireModule('js/commands');
    define('js/commands', [], function () {
      return command;
    });

    requireModuleAndWait('js/views/share/share');

    runs(function () {
      var origShare = require('js/views/share/share');
      shareInitializeSpy = jasmine.createSpy('shareInitialize');

      undefRequireModule('js/views/share/share');
      define('js/views/share/share', [], function () {
        return origShare.extend({
          initialize: function (options) {
            origShare.prototype.initialize.apply(this, arguments);
            shareInitializeSpy(options);
          }
        });
      });

      reRequireModule(['js/views/card/layout', 'js/views/card/itemview', 'js/views/card/header']);
    });
  });

  describe("card/layout", function () {
    var Controller, LayoutView, layoutView;
    var cards = [{
      "name": "LayoutView",
      "id": "layoutview",
      "dashboard": {
        "view": "dashboard/dashboard"
      },
      "routes": [{
        "id": "view",
        "view": "view/layout"
      }, {
        "id": "post",
        "route": ":blog_id/:id/:unit",
        "view": "view/post",
        "header": "view/post_header"
      }]
    }];

    beforeEach(function () {
      resetMock();
      var flag;

      Controller = require('js/router/controller');
      controller = new Controller({
        cards: cards
      });
      controller.auth(function (data) {
        LayoutView = require('js/views/card/layout');
        data = initData = _.extend({}, data, {
          card: cards[0]
        });
        layoutView = new LayoutView(data);
        flag = true;
      });

      var origFunc = controller.l10n.load;
      spyOn(controller.l10n, 'load').andCallFake(function (path, namespace) {
        var fakePath = '/spec/cards/layoutview/l10n';
        var dfd = origFunc.call(controller.l10n, fakePath, namespace);
        return dfd;
      });

      waitsFor(function () {
        return flag;
      }, 'controller authentication', 3000);

      runs(function () {
        $('#dashboard').remove();
      });
    });

    it("share:show", function () {
      layoutView.setShareHandler();
      var options = {
        url: 'http://memolog.org/',
        tweetText: 'foobar',
        tweetUrl: 'http://memolog.org/web/'
      };
      var commands = require('js/commands');
      commands.execute('share:show', options);

      waitsFor(function () {
        return flagShare;
      }, 'share:show command executed', 3000);

      runs(function () {
        expect(layoutView.$el.find('#share').html()).toBeTruthy();
        expect(layoutView.share).toBeDefined();
        expect(shareInitializeSpy).toHaveBeenCalled();
        expect(shareInitializeSpy.mostRecentCall.args[0]).toEqual(options);
        layoutView.$el.remove();
      });
    });

    it("share:close", function () {
      layoutView.setShareHandler();
      var commands = require('js/commands');
      commands.execute('share:show');

      waitsFor(function () {
        return flagShare;
      }, 'share:show command executed', 3000);

      runs(function () {
        spyOn(layoutView.share, 'close').andCallThrough();
        commands.execute('share:close');
      });

      waitsFor(function () {
        return flagShareClose;
      }, 'share:close command executed', 3000);

      runs(function () {
        expect(layoutView.$el.find('#share').html()).toBeFalsy();
        expect(layoutView.share).toBeDefined();
        expect(layoutView.share.close).toHaveBeenCalled();
        layoutView.$el.remove();
      });
    });

    it("onShow", function () {
      var $header = $('<div id="header"></div>').appendTo('#app');
      var $mainC = $('<div class="main-container" style="height:100px; overflow:auto;"><div style="height:1000px"></div></div>').appendTo('#app');
      layoutView.$el.appendTo($('#app'));

      layoutView.onShow();
      $mainC.scrollTop(100);
      $mainC.trigger('scroll');

      expect($('#header').hasClass('shadow')).toBe(true);

      $mainC.scrollTop(0);
      $mainC.trigger('smartscroll');

      expect($('#header').hasClass('shadow')).toBe(false);

      $header.remove();
      $mainC.remove();
    });

    describe("onRender", function () {
      var initialize = function (data) {
        layoutView = new LayoutView(data);
        layoutView.$el.appendTo($('#app'));
        spyOn(layoutView, 'onRender').andCallThrough();

        layoutView.render();

        waitsFor(function () {
          return !!layoutView.onRender.calls.length;
        }, 'call onRender', 3000);
      };

      it("render with viewView (& initial check)", function () {
        define('cards/layoutview/view', ['js/views/card/itemview'], function (ItemView) {
          return ItemView.extend({
            render: function () {}
          });
        });

        var data = _.extend({}, initData, {
          viewView: 'view'
        });

        initialize(data);

        var flag;
        expect(layoutView.$el.hasClass('container')).toBe(true);
        layoutView.main.on('show', function () {
          flag = true;
        });

        waitsFor(function () {
          return flag;
        }, 'listening show event', 3000);

        runs(function () {
          expect(layoutView.main.$el.hasClass('card-view-layoutview')).toBe(true);
        });
      });

      it("render with viewHeader", function () {
        define('cards/layoutview/view', ['js/views/card/itemview'], function (ItemView) {
          return ItemView.extend({
            render: function () {}
          });
        });

        var renderSpy = jasmine.createSpy('renderSpy');
        define('cards/layoutview/header', ['js/views/card/itemview'], function (ItemView) {
          return ItemView.extend({
            render: renderSpy
          });
        });

        var data = _.extend({}, initData, {
          viewView: 'view',
          viewHeader: 'header'
        });

        initialize(data);

        var flag;
        layoutView.main.on('show', function () {
          flag = true;
        });

        waitsFor(function () {
          return flag;
        }, 'listening show event', 3000);

        runs(function () {
          expect(renderSpy).toHaveBeenCalled();
        });
      });

      it("render with viewTemplate(.hbs)", function () {
        define("hbs!cards/layoutview/template", ["hbs", "handlebars"], function (e, t) {
          var s = t.template(function (e, t, s) {
            s = s || e.helpers;
            return '<div id="layoutview-template"></div>';
          });
          t.registerPartial("cards_layoutview_templates", s);
          return s;
        });

        var data = _.extend({}, initData, {
          viewTemplate: 'template.hbs'
        });

        initialize(data);

        var flag;
        layoutView.main.on('show', function () {
          flag = true;
        });

        waitsFor(function () {
          return flag;
        }, 'listening show event', 3000);

        runs(function () {
          var $template = $('#layoutview-template');
          expect( !! $template.length).toBe(true);
        });
      });

      it("render with viewTemplate(.html) and viewData", function () {
        define("text!cards/layoutview/template.html", [], function () {
          return '<div id="layoutview-template-html"><%= foo %></div>';
        });

        define("cards/layoutview/viewData", [], function () {
          return {
            foo: 'bar'
          };
        });

        var data = _.extend({}, initData, {
          viewTemplate: 'template.html',
          viewData: 'viewData'
        });

        initialize(data);

        var flag;
        layoutView.main.on('show', function () {
          flag = true;
        });

        waitsFor(function () {
          return flag;
        }, 'listening show event', 3000);

        runs(function () {
          var $template = $('#layoutview-template-html');
          expect( !! $template.length).toBe(true);
          expect($template.html()).toEqual('bar');
        });
      });

      afterEach(function () {
        layoutView.$el.remove();
      });
    });

    it("remove command handlers on close", function () {
      layoutView.setShareHandler();
      var options = {
        url: 'http://memolog.org/',
        tweetText: 'foobar',
        tweetUrl: 'http://memolog.org/web/'
      };

      var flag;
      layoutView.on('item:closed', function () {
        flag = true;
      });

      var commands = require('js/commands');
      expect(commands._wreqrHandlers['share:show']).toBeDefined();
      expect(commands._wreqrHandlers['share:close']).toBeDefined();
      layoutView.close();

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(commands._wreqrHandlers['share:show']).toBeUndefined();
        expect(commands._wreqrHandlers['share:close']).toBeUndefined();
      });
    });
  });

  afterEach(function () {
    resetMock();
    commandsOrig.execute('move:dashboard', initData);
    reRequireModule(['js/commands', 'js/views/share/share']);
  });
});
