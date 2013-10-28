describe("acception", function () {
  'use strict';

  var View, view;
  var Controller, controller, initData;
  var commandSpies;
  var initSpy, dashboardSpy, fetchingSpy, renderSpy, modelFetchSpy, modelSyncSpy;
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
  };
  var mtapi;

  beforeEach(function () {
    initSpy = jasmine.createSpy('initSpy');
    dashboardSpy = jasmine.createSpy('dashboardSpy');
    fetchingSpy = jasmine.createSpy('fetchingSpy');
    renderSpy = jasmine.createSpy('renderSpy');
    modelFetchSpy = jasmine.createSpy('modelFetchSpy');
    modelSyncSpy = jasmine.createSpy('modelSyncSpy');
    commandSpies = jasmine.createSpyObj('commandSpies', ['card:acception:share:show', 'share:show', 'router:navigate', 'header:render']);
    initCommands(commandSpies, controller);

    runs(function () {
      requireModuleAndWait(['cards/acception/dashboard/dashboard', 'cards/acception/view/view', 'cards/acception/models/model']);
    });

    runs(function () {
      mtapi = require('js/mtapi');
      spyOn(mtapi.api, 'getEntry').andCallThrough();
      spyOn(mtapi.api, 'updateEntry').andCallThrough();

      var modelOrig = require('cards/acception/models/model');
      undefRequireModule('cards/acception/models/model');
      define('cards/acception/models/model', [], function () {
        return modelOrig.extend({
          fetch: function (options) {
            modelOrig.prototype.fetch.apply(this, arguments);
            modelFetchSpy(options);
          },
          sync: function (method, model, options) {
            modelOrig.prototype.sync.apply(this, arguments);
            modelSyncSpy(method, model, options);
          }
        });
      });

      requireModuleAndWait(['cards/acception/models/model']);

      var viewOrig;
      runs(function () {
        reRequireModule(['js/views/card/itemview', 'js/views/card/composite', 'cards/acception/dashboard/dashboard', 'cards/acception/view/view', 'cards/acception/models/collection']);
      });

      runs(function () {
        viewOrig = require('cards/acception/view/view');
        undefRequireModule('cards/acception/view/view');
        define('cards/acception/view/view', [], function () {
          return viewOrig.extend({
            initialize: function (options) {
              viewOrig.prototype.initialize.apply(this, arguments);
              initSpy(options);
            },
            fetch: function (options) {
              viewOrig.prototype.fetch.apply(this, arguments);
              fetchingSpy(options);
            },
            render: function () {
              viewOrig.prototype.render.apply(this, arguments);
              renderSpy();
            }
          });
        });

        requireModuleAndWait(['cards/acception/view/view']);

        runs(function () {
          reRequireModule(['js/views/card/header', 'cards/acception/view/view_header', 'js/views/card/layout', 'js/router/router', 'js/router/controller']);
        });
      });
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
    });
  });

  describe("dashboard/view", function () {

    beforeEach(function () {
      resetMock();
      var cache = require('js/cache');
      cache.clear(initData.blogId);
    });

    it("initialize, fetch and render, and move individual view screen", function () {
      var Dashboard = require('cards/acception/dashboard/dashboard');
      var dashboard = new Dashboard(initData);

      waitsFor(function () {
        return !!dashboard.$el.find('.card-item-list a').length;
      }, 'fetching collection', 3000);

      var flag, route, count;
      runs(function () {
        var $link = dashboard.$el.find('.card-item-list a');
        route = $link.data('route');
        var event = $.Event('tap', {
          currentTarget: $link.get(0)
        });
        count = commandSpies['router:navigate'].callCount;
        $link.trigger(event);
      });

      waitsFor(function () {
        return commandSpies['router:navigate'].callCount > count;
      }, 'render view', 3000);

      runs(function () {
        var arg = commandSpies['router:navigate'].mostRecentCall.args[0];
        expect(route).toEqual(route);
      });
    });

    it("fetch entry data", function () {
      var item = window.Mock.throwEntryItem = {
        "status": "Review",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body",
        "blog": {}
      };
      var routes = [1, 123];

      View = require('cards/acception/view/view');
      view = new View(_.extend({}, initData, {
        routes: routes
      }));

      waitsFor(function () {
        return renderSpy.callCount === 2;
      }, 'render', 3000);

      runs(function () {
        expect(view.model.id).toEqual(123);
        var data = view.model.toJSON();
        expect(data.title).toEqual(item.title);
        expect(modelFetchSpy).toHaveBeenCalled();
        expect(modelSyncSpy).toHaveBeenCalled();
        var method = modelSyncSpy.mostRecentCall.args[0];
        expect(method).toEqual('read');
        expect(mtapi.api.getEntry).toHaveBeenCalled();
        var args = mtapi.api.getEntry.mostRecentCall.args;
        expect(args[0]).toEqual(1);
        expect(args[1]).toEqual(123);
        expect(mtapi.api.updateEntry).not.toHaveBeenCalled();
      });
    });

    it("use stored data", function () {
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

      var Collection = require('cards/acception/models/collection');
      var collection = new Collection(1);

      spyOn(mtapi.api, 'listEntries').andCallThrough();
      collection.fetch();

      waitsFor(function () {
        return mtapi.api.listEntries.callCount === 1;
      }, 'fetching collection', 3000);

      var cache = require('js/cache');
      var routes = [1, 2];

      runs(function () {
        cache.set(1, 'acception', collection);
        View = require('cards/acception/view/view');
        view = new View(_.extend({}, initData, {
          routes: routes
        }));
      })

      waitsFor(function () {
        return renderSpy.callCount === 1;
      }, 'render', 3000);

      runs(function () {
        expect(view.model.id).toEqual('2');
        var data = view.model.toJSON();
        expect(data.title).toEqual('title2');
        expect(modelFetchSpy).not.toHaveBeenCalled();
        expect(modelSyncSpy).not.toHaveBeenCalled();
      });
    });

    it("accept reviewed entry and then, undo", function () {
      var item = window.Mock.throwEntryItem = {
        "status": "Review",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body",
        "blog": {}
      };
      var routes = [1, 123];
      var count = renderSpy.callCount;

      View = require('cards/acception/view/view');
      view = new View(_.extend({}, initData, {
        routes: routes
      }));

      waitsFor(function () {
        return renderSpy.callCount === 2;
      }, 'render', 3000);

      runs(function () {
        var $target = view.$el.find('#accept')
        var e = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(e);
        var flag;
        setTimeout(function () {
          flag = true;
        }, 500);

        waitsFor(function () {
          return flag;
        }, 'callback from tapping accept button', 3000);
      })

      runs(function () {
        expect(modelFetchSpy).toHaveBeenCalled();
        expect(modelSyncSpy).toHaveBeenCalled();
        var method = modelSyncSpy.mostRecentCall.args[0];
        var options = modelSyncSpy.mostRecentCall.args[2];
        expect(method).toEqual('update');
        expect(options.status).toEqual('Publish');
        expect(mtapi.api.getEntry.callCount).toEqual(1);
        expect(mtapi.api.updateEntry).toHaveBeenCalled();
        var args = mtapi.api.updateEntry.mostRecentCall.args;
        expect(args[0]).toEqual(1);
        expect(args[1]).toEqual(123);
        var entry = args[2];
        expect(entry.status).toEqual('Publish');
      });

      runs(function () {
        var $target = view.$el.find('#accept-undo');
        var e = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(e);
        var flag;
        setTimeout(function () {
          flag = true;
        }, 500);

        waitsFor(function () {
          return flag && (modelSyncSpy.mostRecentCall.args[2].status === 'Review');
        }, 'callback from tapping undo button', 3000);
      });

      runs(function () {
        var method = modelSyncSpy.mostRecentCall.args[0];
        var options = modelSyncSpy.mostRecentCall.args[2];
        expect(method).toEqual('update');
        expect(options.status).toEqual('Review');
        expect(mtapi.api.getEntry.callCount).toEqual(1);
        expect(mtapi.api.updateEntry.callCount).toEqual(2);
        var args = mtapi.api.updateEntry.mostRecentCall.args;
        expect(args[0]).toEqual(1);
        expect(args[1]).toEqual(123);
        var entry = args[2];
        expect(entry.status).toEqual('Review');
      });
    });

    it("share entry", function () {
      var item = window.Mock.throwEntryItem = {
        "status": "Review",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body",
        "blog": {},
        "excerpt": "excerpt",
        "permalink": "http://memolog.org/2013/08/05/foobar.html"
      };

      window.Mock.throwUpdateEntryItem = _.extend({}, item, {
        status: 'Publish'
      });

      var routes = [1, 123];
      var options = _.extend({}, initData, {
        routes: routes
      });

      var Layout = require('js/views/card/layout');
      var layout = new Layout(_.extend({}, options, {
        viewHeader: card.routes[0].header,
        viewView: card.routes[0].view
      }));
      layout.render();
      var header, view;

      waitsFor(function () {
        return renderSpy.callCount === 3;
      }, 'render', 3000);

      runs(function () {
        header = layout.header.currentView;
        view = layout.main.currentView;

        expect(header.$el.find('#share-button').length).toBeFalsy();

        var $target = view.$el.find('#accept')
        var e = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        var count = renderSpy.callCount;
        $target.trigger(e);

        waitsFor(function () {
          return renderSpy.callCount > count + 1;
        }, 'callback from tapping accept button', 3000);
      })

      var count;
      runs(function () {
        var $shareButton = header.$el.find('#share-button');
        expect($shareButton.length).toBeTruthy();
        var e = $.Event('tap', {
          currentTarget: $shareButton.get(0)
        });
        count = commandSpies['card:acception:share:show'].callCount;
        $shareButton.trigger(e);
      });

      waitsFor(function () {
        return commandSpies['card:acception:share:show'].callCount > count;
      }, 'callback from tapping share button');

      runs(function () {
        expect(commandSpies['share:show']).toHaveBeenCalled();
        var share = commandSpies['share:show'].mostRecentCall.args[0].share;
        expect(share.url).toEqual(item.permalink);
        expect(share.tweetText).toEqual(item.title + ' ' + item.excerpt);
      });
    });

    it("failed acception", function () {
      var error = window.Mock.failUpdateEntry = 'Authorization failed'

      var item = window.Mock.throwEntryItem = {
        "status": "Review",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body",
        "blog": {}
      };
      var routes = [1, 123];

      View = require('cards/acception/view/view');
      view = new View(_.extend({}, initData, {
        routes: routes
      }));

      waitsFor(function () {
        return renderSpy.callCount === 2;
      }, 'render', 3000);

      runs(function () {
        var $target = view.$el.find('#accept')
        var e = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(e);
        var flag;
        setTimeout(function () {
          flag = true;
        }, 800);

        waitsFor(function () {
          return flag;
        }, 'callback from tapping accept button', 3000);
      });

      runs(function () {
        expect(mtapi.api.updateEntry).toHaveBeenCalled();
        expect(view.error).toEqual(error);
        expect(view.acceptionFailed).toBe(true);
        var model = view.model.toJSON();
        expect(model.status).toEqual('Review');

        var $el = view.$el.find('.close-me');
        expect($el.length).toBeTruthy();
        $el.trigger('tap');
        $el = view.$el.find('.close-me');
        var $overlay = view.$el.find('.overlay');
        expect($el.length).toBeFalsy();
        expect($overlay.length).toBeFalsy();
      });
    });

    it("when user has no permission for blog (and not administorator), should not show anything in dashboad", function () {
      window.Mock.throwPermissionItems = [{
        "permissions": [],
        "blog": {
          "id": "1"
        }
      }];
      var routes = [1, 123];

      var cache = require('js/cache');
      cache.clear('user', 'user');

      var noUserPermissionData, flag;
      initController(Controller, controller, function (data) {
        View = require('cards/acception/view/view');
        view = new View(_.extend({}, data, {
          card: card,
          routes: routes
        }));
      });

      waitsFor(function () {
        return renderSpy.callCount === 1;
      }, 'get user permissions', 3000);

      runs(function () {
        expect(view.perm).toBe(false);
        expect(view.model).toBeUndefined();
        expect(view.collection).toBeUndefined();
      });
    });

    it("remove command handler on close", function () {
      var commands = require('js/commands');

      var routes = [1, 123],
        flag;

      View = require('cards/acception/view/view');
      view = new View(_.extend({}, initData, {
        routes: routes
      }));
      view.on('item:closed', function () {
        flag = true;
      })

      waitsFor(function () {
        return renderSpy.callCount === 2;
      }, 'render', 3000);

      runs(function () {
        expect(commands._wreqrHandlers['card:acception:share:show']).toBeDefined();
        view.close();
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(commands._wreqrHandlers['card:acception:share:show']).toBeUndefined();
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
