describe("stats", function () {
  'use strict';

  var Dashboard, dashboard;
  var Controller, controller, initData;
  var commandSpies, spy;
  var card = {
    "name": "Stats",
    "id": "stats",
    "dashboard": {
      "view": "dashboard/dashboard"
    },
    "routes": [{
      "id": "view",
      "view": "view/view"
    }, {
      "id": "post",
      "route": ":blog_id/:id/:unit",
      "view": "view/post",
      "header": "view/post_header"
    }]
  };

  var mtapi;

  beforeEach(function () {
    commandSpies = jasmine.createSpyObj('commandSpies', ['router:navigate']);
    spy = jasmine.createSpyObj('spy', ['init', 'fetch', 'render', 'onRender', 'navigatePage']);
    initCommands(commandSpies, controller);

    runs(function () {
      reRequireModule(['cards/stats/models/latest_page_views', 'cards/stats/dashboard/dashboard']);
    });

    runs(function () {
      runs(function () {
        var origFunc = require('cards/stats/dashboard/dashboard');
        undefRequireModule('cards/stats/dashboard/dashboard');
        define('cards/stats/dashboard/dashboard', [], function () {
          return origFunc.extend({
            initialize: function (options) {
              origFunc.prototype.initialize.apply(this, arguments);
              spy.init(options);
            },
            fetch: function (options) {
              origFunc.prototype.fetch.apply(this, arguments);
              spy.fetch(options);
            },
            render: function () {
              origFunc.prototype.render.apply(this, arguments);
              spy.render();
            },
            onRender: function () {
              origFunc.prototype.onRender.apply(this, arguments);
              spy.onRender();
            },
            navigatePage: function () {
              origFunc.prototype.navigatePage.apply(this, arguments);
              spy.navigatePage();
            }
          });
        });

        requireModuleAndWait(['cards/stats/dashboard/dashboard']);

        runs(function () {
          reRequireModule(['js/router/controller']);
        });
      });
    });

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = _.extend({}, data, {
          card: card
        });
        Dashboard = require('cards/stats/dashboard/dashboard');
      });
    });

    waitsFor(function () {
      return !!initData;
    }, 'initialize dashboard', 3000);

    runs(function () {
      var cache = require('js/cache');
      cache.clear(initData.blogId);
    });
  });

  describe("dashboard", function () {
    it("initialize, fetch, render", function () {
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.onRender.callCount === 2;
      }, 'render', 3000);

      runs(function () {
        expect(dashboard.providerIsNotAvailable).toBe(false);
        expect(spy.fetch).toHaveBeenCalled();
        expect(spy.render).toHaveBeenCalled();
        var data = dashboard.serializeData();
        expect(data.title).toEqual("Today's Page Views");
      });
    });

    it("tap screen and navigate view page", function () {
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.onRender.callCount >= 2;
      }, 'render', 3000);

      runs(function () {
        var $target = dashboard.$el;
        expect($target.hasClass('tap-enabled')).toBeTruthy();
        var event = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(event);
      });

      waitsFor(function () {
        return !!commandSpies['router:navigate'].callCount;
      }, 'navigatePage', 3000);

      runs(function () {
        expect(commandSpies['router:navigate'].mostRecentCall.args[0]).toEqual('stats');
      });
    });

    it("statsProvider failed", function () {
      window.Mock.failStatsProvider = 'failed by some reason';
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.onRender.callCount >= 1;
      }, 'render', 3000);

      var flag;
      runs(function () {
        expect(dashboard.providerIsNotAvailable).toBe(true);
        var data = dashboard.serializeData();
        expect(data.pageviews.items[0].pageviews).toEqual(770000);
        expect(data.diffIcon).toEqual('icon-arrow-up-right');

        var $graph = dashboard.$el.find('#stats-dashboard-graph img');
        expect($graph.length).toBeTruthy();
        expect($graph.attr('src')).toMatch(/welcome\.png/);

        var $target = dashboard.$el;
        expect($target.hasClass('tap-enabled')).toBeFalsy();

        var event = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(event);

        setTimeout(function () {
          flag = true;
        }, 1000);
      });

      waitsFor(function () {
        return flag
      }, 'return flag being true', 3000);

      runs(function () {
        expect(spy.navigatePage).not.toHaveBeenCalled();
      });
    });

    it("fetch failed (listStatsPageviewsForDate)", function () {
      window.Mock.failListStatsPageviewsForDate = 'fetch fail';

      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.onRender.callCount >= 1;
      }, 'render', 3000);

      var flag;
      runs(function () {
        expect(dashboard.providerIsNotAvailable).toBe(false);

        var $target = dashboard.$el;
        expect($target.hasClass('tap-enabled')).toBeFalsy();

        var event = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(event);

        setTimeout(function () {
          flag = true;
        }, 1000);
      });

      waitsFor(function () {
        return flag
      }, 'return flag being true', 3000);

      runs(function () {
        expect(spy.navigatePage).not.toHaveBeenCalled();
      });
    });

    it("fetch failed (listStatsVisitsForDate)", function () {
      window.Mock.failListStatsVisitsForDate = 'fetch fail';

      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.onRender.callCount >= 1;
      }, 'render', 3000);

      var flag;
      runs(function () {
        expect(dashboard.providerIsNotAvailable).toBe(false);

        var $target = dashboard.$el;
        expect($target.hasClass('tap-enabled')).toBeFalsy();

        var event = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(event);

        setTimeout(function () {
          flag = true;
        }, 1000);
      });

      waitsFor(function () {
        return flag
      }, 'return flag being true', 3000);

      runs(function () {
        expect(spy.navigatePage).not.toHaveBeenCalled();
      });
    });

    it("diff down icon", function () {
      var moment = require('moment');
      var getDate = function (num) {
        return moment().subtract('days', parseInt(num, 10)).format("YYYY-MM-DD");
      };

      window.Mock.throwListStatsPageviewsForDate = {
        "totalResults": 7,
        "totals": {
          "pageviews": "10"
        },
        "items": [{
          "pageviews": "1",
          "date": getDate(6)
        }, {
          "pageviews": "2",
          "date": getDate(5)
        }, {
          "pageviews": "1",
          "date": getDate(4)
        }, {
          "pageviews": "3",
          "date": getDate(3)
        }, {
          "pageviews": "0",
          "date": getDate(2)
        }, {
          "pageviews": "2",
          "date": getDate(1)
        }, {
          "pageviews": "1",
          "date": getDate(0)
        }]
      };

      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.onRender.callCount >= 2;
      }, 'render', 3000);

      runs(function () {
        var data = dashboard.serializeData();
        expect(data.diffIcon).toEqual('icon-arrow-down-right');
      });
    });

    it("diff up icon", function () {
      var moment = require('moment');
      var getDate = function (num) {
        return moment().subtract('days', parseInt(num, 10)).format("YYYY-MM-DD");
      };

      window.Mock.throwListStatsPageviewsForDate = {
        "totalResults": 7,
        "totals": {
          "pageviews": "10"
        },
        "items": [{
          "pageviews": "1",
          "date": getDate(6)
        }, {
          "pageviews": "2",
          "date": getDate(5)
        }, {
          "pageviews": "1",
          "date": getDate(4)
        }, {
          "pageviews": "3",
          "date": getDate(3)
        }, {
          "pageviews": "0",
          "date": getDate(2)
        }, {
          "pageviews": "1",
          "date": getDate(1)
        }, {
          "pageviews": "2",
          "date": getDate(0)
        }]
      };

      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.onRender.callCount >= 2;
      }, 'render', 3000);

      runs(function () {
        var data = dashboard.serializeData();
        expect(data.diffIcon).toEqual('icon-arrow-up-right');
      });
    });

    it("diff equal icon", function () {
      var moment = require('moment');
      var getDate = function (num) {
        return moment().subtract('days', parseInt(num, 10)).format("YYYY-MM-DD");
      };

      window.Mock.throwListStatsPageviewsForDate = {
        "totalResults": 7,
        "totals": {
          "pageviews": "10"
        },
        "items": [{
          "pageviews": "1",
          "date": getDate(6)
        }, {
          "pageviews": "2",
          "date": getDate(5)
        }, {
          "pageviews": "1",
          "date": getDate(4)
        }, {
          "pageviews": "4",
          "date": getDate(3)
        }, {
          "pageviews": "0",
          "date": getDate(2)
        }, {
          "pageviews": "1",
          "date": getDate(1)
        }, {
          "pageviews": "1",
          "date": getDate(0)
        }]
      };

      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.onRender.callCount >= 2;
      }, 'render', 3000);

      runs(function () {
        var data = dashboard.serializeData();
        expect(data.diffIcon).toEqual('icon-arrow-right');
      });
    });

    it("use stored collection", function () {
      var Model = require('cards/stats/models/latest_page_views');
      var model = new Model(initData.blogId);
      var flag;
      model.fetch({
        success: function () {
          flag = true;
        }
      });

      waitsFor(function () {
        return flag;
      }, 'fetch model', 3000);

      runs(function () {
        var cache = require('js/cache');
        cache.set(initData.blogId, 'stats_latest_page_views', model);
        dashboard = new Dashboard(initData);
      })

      waitsFor(function () {
        return spy.onRender.callCount >= 1;
      }, 'render', 3000);

      runs(function () {
        var $target = dashboard.$el;
        expect($target.hasClass('tap-enabled')).toBeTruthy();
        var event = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(event);
      });

      waitsFor(function () {
        return !!commandSpies['router:navigate'].callCount;
      }, 'navigatePage', 3000);

      runs(function () {
        expect(commandSpies['router:navigate'].mostRecentCall.args[0]).toEqual('stats');
        expect(dashboard.model).toEqual(model);
      });
    });
  });

  afterEach(function () {
    resetMock();
    reRequireModule(['js/commands', 'js/router/controller']);
  });
});
