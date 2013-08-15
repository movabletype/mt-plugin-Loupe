describe("acception", function () {
  'use strict';

  var Dashboard, dashboard;
  var Controller, controller, initData;
  var commandSpies;
  var dashboardSpy;

  beforeEach(function () {
    window.Mock.userLang = 'en-us';
    dashboardSpy = jasmine.createSpy();
    commandSpies = {} //jasmine.createSpyObj('commandSpies', ['dashboard:toggle', 'menu:header:toggle'])
    initCommands(commandSpies, controller);

    runs(function () {
      requireModuleAndWait(['cards/acception/dashboard/dashboard']);
    });

    runs(function () {
      var dashboardOrig = require('cards/acception/dashboard/dashboard');
      undefRequireModule('cards/acception/dashboard/dashboard');
      define('cards/acception/dashboard/dashboard', [], function () {
        return dashboardOrig.extend({
          appendHtml: function () {
            dashboardOrig.prototype.appendHtml.apply(this, arguments);
            dashboardSpy();
          }
        });
      });
      requireModuleAndWait(['cards/acception/dashboard/dashboard']);
      reRequireModule(['js/router/controller']);
    });

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = _.extend({}, data, {
          card: {
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
        });
        Dashboard = require('cards/acception/dashboard/dashboard');
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
    it("initialize, fetch and then render", function () {
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

      window.Mock.throwListEntryItemsLength = 30;
      window.Mock.throwListEntryItems = items;

      var cache = require('js/cache');
      cache.clear(initData.blogId);
      var count = dashboardSpy.callCount;
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        // fetching 3 items in initialize
        return dashboardSpy.callCount === count + 4;
      }, 'fetching collection', 3000);

      runs(function () {
        expect(dashboard.collection.length).toEqual(3);
        expect(dashboard.collection.isSynced).toBe(true);

        var data = dashboard.serializeData();
        expect(data.title).toEqual('Acception');
        expect(data.perm).toBe(true);
        expect(data.count).toBe(30);
        expect(data.showMoreButton).toBe(true);
      });
    })
  });

  afterEach(function () {
    resetMock();
    reRequireModule(['js/commands', 'js/router/controller']);
  });
});
