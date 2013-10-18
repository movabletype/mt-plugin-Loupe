describe("acception", function () {
  'use strict';

  var Dashboard, dashboard;
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

    runs(function () {
      reRequireModule(['js/router/controller']);
    });

    runs(function () {
      Controller = require('js/router/controller');
      controller = new Controller({
        cards: [card]
      });
      initCommands(commandSpies, controller);
    });

    var flag
    runs(function () {
      require(['js/commands'], function () {
        flag = true;
      })
    });

    waitsFor(function () {
      return flag;
    });

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
          },
          fetch: function (options) {
            dashboardOrig.prototype.fetch.apply(this, arguments);
            fetchingSpy(options);
          },
          render: function () {
            dashboardOrig.prototype.render.apply(this, arguments);
            renderSpy();
          }
        });
      });
      requireModuleAndWait(['cards/acception/dashboard/dashboard']);
    });

    runs(function () {
      var cache = require('js/cache');
      cache.clear('user');
      initController(Controller, controller, function (data) {
        initData = _.extend({}, data, {
          card: card
        });
        Dashboard = require('cards/acception/dashboard/dashboard');
      });
    });

    waitsFor(function () {
      return !!initData;
    }, 'initialize main', 3000);

    runs(function () {
      reRequireModule(['moment', 'js/router/router']);
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
          "permalink": "http://memolog.org/foo/bar/" + id + ".html",
          "date": moment().subtract(len - i).format(),
          "excerpt": "excerpt" + id
        });
      }

      resetMock();
      window.Mock.userLang = 'en-us';
      window.Mock.throwListEntryItemsLength = 30;
      window.Mock.throwListEntryItems = items;

      var cache = require('js/cache');
      cache.clear(initData.blogId);
    })

    it("initialize, fetch and then render", function () {
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        // fetching 3 items in initialize
        return !!fetchingSpy.callCount;
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
    });

    it("initialize with cached collection synced already", function () {
      var Collection = require('cards/acception/models/collection');
      var collection = new Collection(1);
      var flag;
      var count = dashboardSpy.callCount;
      var fCount = fetchingSpy.callCount;

      collection.fetch({
        limit: 3,
        success: function () {
          flag = true;
        }
      });

      waitsFor(function () {
        return flag;
      }, 'fetching collection', 3000);

      runs(function () {
        expect(collection.isSynced).toBe(true);
        var cache = require('js/cache');
        cache.set(1, 'acception', collection);
        dashboard = new Dashboard(initData);
      });

      waitsFor(function () {
        return dashboardSpy.callCount > count;
      }, 'render dashboard', 3000);

      runs(function () {
        expect(fetchingSpy.callCount).toEqual(fCount);
      });
    });

    it("shows default message when collection has no item", function () {
      window.Mock.throwListEntryItemsLength = 0;
      window.Mock.throwListEntryItems = [];

      runs(function () {
        dashboard = new Dashboard(initData);
      })

      waitsFor(function () {
        return !dashboard.loading;
      }, 'fetching collection', 3000);

      runs(function () {
        expect(dashboard.collection.length).toEqual(0);
        expect(dashboard.collection.isSynced).toBe(true);

        var data = dashboard.serializeData();
        var item = data.items[0];
        expect(item.id).toBeNull();
        expect(item.assets[0].url).toMatch(/welcome.png/);
        expect(item.title).toMatch(/welcome to Loupe/);
      });
    });

    it("when user has no permission for blog (and not administorator), should not show anything in dashboad", function () {
      runs(function () {
        $('#dashboard').remove();
        resetMock();
        window.Mock.throwPermissionItems = [{
          "permissions": [],
          "blog": {
            "id": "1"
          }
        }];
        var cache = require('js/cache');
        cache.clearAll();
        reRequireModule(['js/cards', 'js/app']);
      });

      var app, flag;
      runs(function () {
        app = require('js/app');
        var commands = require('js/commands');
        commands.removeHandler('router:addRoute');
        var vent = require('js/vent');
        vent.on('app:cards:deploy:end', function () {
          flag = true;
        });
        var AppRouter = require('js/router/router');
        var router = new AppRouter({
          controller: controller
        });
        app.start({
          cards: [initData.card],
          router: router
        });
      });

      waitsFor(function () {
        return flag;
      }, 'app started');

      var flag
      runs(function () {
        var commands = require('js/commands');
        commands.execute('move:dashboard', initData);
      })

      waitsFor(function () {
        return !!renderSpy.callCount;
      }, 'initialize dashboard', 3000);

      runs(function () {
        expect($('#card-acception').attr('style')).toMatch(/display: none/);
        var cache = require('js/cache');
        cache.clear('user', 'user');
        app.stop();
      });
    });

    it("handle Readmore", function () {
      runs(function () {
        window.Mock.throwListEntryItemsLength = 10;
        window.Mock.throwListEntryItems = window.Mock.throwListEntryItems.slice(0, 10);
        dashboard = new Dashboard(initData);
      });

      waitsFor(function () {
        return !dashboard.loading;
      }, 'fetching collection', 3000);

      var count, $readmore;
      runs(function () {
        count = renderSpy.callCount;
        $readmore = dashboard.$el.find('.readmore');
        expect($readmore.length).toBeTruthy();
        expect(dashboard.collection.length).toEqual(3);
        $readmore.trigger('tap');
      });

      waitsFor(function () {
        return renderSpy.callCount > count;
      }, 'more fetching items', 3000);

      runs(function () {
        var options = fetchingSpy.mostRecentCall.args[0];
        expect(options.limit).toEqual(5);
        expect(options.offset).toEqual(3);
        expect(dashboard.collection.length).toEqual(8);
        expect(dashboard.$el.find('.card-item-list li').length).toEqual(8);
        $readmore = dashboard.$el.find('.readmore');
        expect($readmore.length).toBeTruthy();
        count = renderSpy.callCount;
        $readmore.trigger('tap');
      });

      waitsFor(function () {
        return renderSpy.callCount > count;
      }, 'more more fetching items', 3000);

      runs(function () {
        var options = fetchingSpy.mostRecentCall.args[0];
        expect(options.limit).toEqual(5);
        expect(options.offset).toEqual(8);
        expect(dashboard.collection.length).toEqual(10);
        expect(dashboard.$el.find('.card-item-list li').length).toEqual(10);
        $readmore = dashboard.$el.find('.readmore');
        expect($readmore.length).toBeFalsy();
      })
    });

    it("handle refetch", function () {
      window.Mock.alwaysFail = 'fetching error';
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return !dashboard.loading;
      }, 'fetching collection', 3000);

      var count, fcount, $error, $button, flag;
      runs(function () {
        $error = dashboard.$el.find('.fetch-error');
        $button = dashboard.$el.find('.refetch');
        expect(dashboard.fetchError).toBe(true);
        expect($error.length).toBeTruthy();
        expect($button.length).toBeTruthy();
        window.Mock.alwaysFail = null;
        count = renderSpy.callCount;
        var event = $.Event('tap', {
          currentTraget: $button.get(0)
        });
        $button.trigger(event);
      });

      waitsFor(function () {
        return dashboard.collection.length >= 3
      }, 'refetching', 3000);

      runs(function () {
        var options = fetchingSpy.mostRecentCall.args[0];
        expect(options.limit).toEqual(3);
        expect(options.offset).toBeUndefined();
        expect(dashboard.collection.length).toEqual(3);
        $button = dashboard.$el.find('.refetch');
        $error = dashboard.$el.find('.fetch-error');
        $button = dashboard.$el.find('.refetch');
        expect(dashboard.fetchError).toBe(false);
        expect($error.length).toBeFalsy();
        expect($button.length).toBeFalsy();
        window.Mock.alwaysFail = 'fetching error';
        var $readmore = dashboard.$el.find('.readmore');
        count = renderSpy.callCount;
        fcount = fetchingSpy.callCount;
        $readmore.trigger('tap');
      });

      waitsFor(function () {
        return (renderSpy.callCount > count + 1 && fetchingSpy.calls.length > fcount);
      }, 'refetching', 3000);

      runs(function () {
        $error = dashboard.$el.find('.fetch-error');
        $button = dashboard.$el.find('.refetch');
        expect(dashboard.fetchError).toBe(true);
        expect($error.length).toBeTruthy();
        expect($button.length).toBeTruthy();
        window.Mock.alwaysFail = null;
        count = renderSpy.callCount;
        fcount = fetchingSpy.callCount;
        $button.trigger('tap');
      });

      waitsFor(function () {
        // Spy object sometimes updates mostRecentCall slowly
        return (renderSpy.callCount > count + 1 && fetchingSpy.mostRecentCall.args[0].limit === 5);
      }, 'refetching', 3000);

      runs(function () {
        var options = fetchingSpy.mostRecentCall.args[0];
        expect(options.limit).toEqual(5);
        expect(options.offset).toEqual(3);
        expect(dashboard.collection.length).toEqual(8);
        $button = dashboard.$el.find('.refetch');
        $error = dashboard.$el.find('.fetch-error');
        $button = dashboard.$el.find('.refetch');
        expect(dashboard.fetchError).toBe(false);
        expect($error.length).toBeFalsy();
        expect($button.length).toBeFalsy();
      });

      runs(function () {
        var cache = require('js/cache');
        cache.clear('user', 'user');
        cache.clear(initData.blogId);
      })
    })
  });

  afterEach(function () {
    resetMock();
    reRequireModule(['js/commands', 'js/router/controller', 'js/app']);
  });
});
