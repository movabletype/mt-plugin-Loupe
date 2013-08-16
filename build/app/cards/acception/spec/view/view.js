describe("acception", function () {
  'use strict';

  var View, view;
  var Controller, controller, initData;
  var commandSpies;
  var dashboardSpy, fetchingSpy, renderSpy;
  var card = {
    "name": "Acception",
    "id": "acception",
    "dashboard": {
      "view": "dashboard/dashboard"
    },
    "routes": [{
      "id": "view",
      "route": ":blog_id/:id",
      "view": "view/view",
      "header": "view/view_header"
    }]
  }

  beforeEach(function () {
    window.Mock.userLang = 'en-us';
    dashboardSpy = jasmine.createSpy();
    fetchingSpy = jasmine.createSpy();
    renderSpy = jasmine.createSpy();
    commandSpies = {};
    initCommands(commandSpies, controller);

    runs(function () {
      requireModuleAndWait(['cards/acception/dashboard/dashboard', 'cards/acception/view/view']);
    });

    runs(function () {
      var viewOrig = require('cards/acception/view/view');
      undefRequireModule('cards/acception/view/view');
      define('cards/acception/view/view', [], function () {
        return viewOrig.extend({
          fetch: function (options) {
            viewOrig.prototype.fetch.apply(this, arguments);
            fetchingSpy(options);
          },
          render: function () {
            console.log('render');
            viewOrig.prototype.render.apply(this, arguments);
            renderSpy();
          }
        });
      });
      requireModuleAndWait(['cards/acception/view/view']);
      reRequireModule(['js/router/controller']);
    });

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = _.extend({}, data, {
          card: card
        });
        View = require('cards/acception/view/view');
      });
    });

    waitsFor(function () {
      return !!initData;
    }, 'initialize main', 3000);

    runs(function () {
      reRequireModule(['moment']);
    })
  });

  describe("dashboard/main", function () {

    beforeEach(function () {
      var moment = require('moment');
      var len = 30;
      var items = [];
      var id;
      for (var i = 0; i < len; i++) {
        id = (i + 1).toString();
        items.push({
          "author": {
            "userpicUrl": null,
            "id": "2",
            "displayName": "Yutaka Yamaguchi"
          },
          "blog": {
            "id": "1"
          },
          "categories": [],
          "id": id,
          "status": "Review",
          "title": "title" + id,
          "body": "body" + id,
          "permalink": "http://172.17.3.216/foo/bar/" + id + ".html",
          "date": moment().subtract(len - i).format(),
          "excerpt": "excerpt" + id
        });
      }

      resetMock();
      window.Mock.throwListEntryItemsLength = 30;
      window.Mock.throwListEntryItems = items;

      var cache = require('js/cache');
      cache.clear(initData.blogId);
    })

    it("initialize, fetch and render, and move individual view screen", function () {
      var Dashboard = require('cards/acception/dashboard/dashboard')
      var dashboard = new Dashboard(initData);

      waitsFor(function () {
        return !!dashboard.$el.find('.card-item-list a').length;
      }, 'fetching collection', 3000);

      var route;
      runs(function () {
        var $link = dashboard.$el.find('.card-item-list a');
        route = $link.data('route');
        var event = $.Event('tap', {
          currentTarget: $link.get(0)
        });
        $link.trigger(event);
      });

      waitsFor(function () {
        return renderSpy.callCount > 0;
      }, 'render view', 3000);

      runs(function () {
        expect(location.href).toMatch(new RegExp(route));
      });
    });
  });

  afterEach(function () {
    resetMock();
    var cache = require('js/cache');
    cache.clear('user', 'user');
    cache.clear(initData.blogId);
    reRequireModule(['js/commands', 'js/router/controller', 'js/app']);
  });
});
