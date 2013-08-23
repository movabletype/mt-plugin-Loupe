describe("stats", function () {
  'use strict';

  var Layout, layout
  var Controller, controller, initData;
  var commandSpies, recentAccessSpy, topArticlesSpy, topArticlesWeeklySpy, ChartAPISpy, itemViewModelSpy;
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
    recentAccessSpy = jasmine.createSpyObj('recentAccessSpy', ['initialize', 'fetch', 'render', 'onRender']);
    topArticlesSpy = jasmine.createSpyObj('topArticlesSpy', ['initialize', 'fetch', 'render', 'onRender']);
    topArticlesWeeklySpy = jasmine.createSpyObj('topArticlesWeeklySpy', ['initialize', 'fetch', 'render', 'onRender']);;
    ChartAPISpy = jasmine.createSpyObj('ChartAPISpy', ['Graph']);
    itemViewModelSpy = jasmine.createSpyObj('itemViewModelSpy', ['fetch']);

    initCommands(commandSpies, controller);

    runs(function () {
      requireModuleAndWait('mtchart');

      runs(function () {
        var chartAPIOrig = require('mtchart');
        undefRequireModule('mtchart');
        $('script[src$="mtchart.core.amd.js"]').remove();
        define('mtchart', [], function () {
          var stub = _.extend({}, chartAPIOrig);
          stub.Graph = function () {
            var result = chartAPIOrig.Graph.apply(this, arguments);
            ChartAPISpy.Graph.apply(ChartAPISpy, arguments);
            return result;
          };
          stub.Graph.prototype = chartAPIOrig.Graph.prototype;
          window.MT.ChartAPI = stub;
          return stub;
        });
        requireModuleAndWait('mtchart');
      });
    });

    runs(function () {
      reRequireModule(['cards/stats/models/top_articles_itemview']);
    });

    var insertSpy = function (path, spy) {
      runs(function () {
        var origFunc = require(path);
        undefRequireModule(path);
        define(path, [], function () {
          var ext = {}
          for (var key in spy) {
            if (spy.hasOwnProperty(key)) {
              ext[key] = function (k, p) {
                return function () {
                  origFunc.prototype[k].apply(this, [].slice.call(arguments));
                  spy[k].apply(spy, arguments);
                }
              }(key, path)
            }
          }
          return origFunc.extend(ext);
        });
        requireModuleAndWait([path]);
      });
    };

    runs(function () {
      insertSpy('cards/stats/models/top_articles_itemview', itemViewModelSpy);
    })

    runs(function () {
      reRequireModule(['cards/stats/models/latest_page_views', 'cards/stats/view/recent_access', 'cards/stats/view/top_articles', 'cards/stats/models/top_articles', 'cards/stats/models/top_articles_itemview_collection']);
    });


    runs(function () {
      insertSpy('cards/stats/view/recent_access', recentAccessSpy);
      insertSpy('cards/stats/view/top_articles', topArticlesSpy);

      runs(function () {
        reRequireModule('cards/stats/view/top_articles_weekly');
        insertSpy('cards/stats/view/top_articles_weekly', topArticlesWeeklySpy);
      });

      runs(function () {
        reRequireModule(['js/router/controller', 'cards/stats/view/layout']);
      });
    });

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = _.extend({}, data, {
          card: card
        });
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

  describe("layout", function () {
    it("initialize, fetch, render", function () {
      Layout = require('cards/stats/view/layout');
      layout = new Layout(initData);
      spyOn(layout, 'onRender').andCallThrough();
      layout.render();

      waitsFor(function () {
        return layout.onRender.callCount === 1;
      }, 'render layout', 3000);

      runs(function () {
        expect(recentAccessSpy.initialize).toHaveBeenCalled();
        expect(topArticlesSpy.initialize).toHaveBeenCalled();
        expect(topArticlesWeeklySpy.initialize).toHaveBeenCalled();
        expect(topArticlesSpy.initialize.calls[0].args[0].unit).toEqual('day')
        expect(topArticlesWeeklySpy.initialize.calls[0].args[0].unit).toEqual('week')
      });
    });
  });

  describe("recent access", function () {
    it("use stored data", function () {
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
      }, 'fetching model', 3000);

      var RecentAccess, recentAccess;
      var cache;
      runs(function () {
        cache = require('js/cache');
        cache.set(initData.blogId, 'stats_latest_page_views', model);

        RecentAccess = require('cards/stats/view/recent_access');
        recentAccess = new RecentAccess(initData);
      });

      waitsFor(function () {
        return recentAccessSpy.onRender.callCount === 1;
      }, 'render', 3000);

      runs(function () {
        expect(recentAccess.model.isSynced).toBe(true);
        expect(recentAccessSpy.fetch).not.toHaveBeenCalled();
      });
    });

    it("statsProvider failed", function () {
        window.Mock.failStatsProvider = 'failed by some reason';
        var RecentAccess = require('cards/stats/view/recent_access');
        var recentAccess = new RecentAccess(initData);

        waitsFor(function () {
          return recentAccessSpy.render.callCount === 2;
        }, 'render', 3000);

        var count, fCount;
        runs(function () {
          expect(recentAccess.providerIsNotAvailable).toBe(true);
        });
    });

    it("pageviews label format", function () {
      var moment = require('moment');
      var getDate = function (num) {
        return moment().subtract('days', parseInt(num, 10)).format("YYYY-MM-DD");
      };

      window.Mock.throwListStatsPageviewsForDate = {
        "totalResults": 7,
        "totals": {
          "pageviews": "1111111"
        },
        "items": [{
          "pageviews": "1",
          "date": getDate(6)
        }, {
          "pageviews": "10",
          "date": getDate(5)
        }, {
          "pageviews": "100",
          "date": getDate(4)
        }, {
          "pageviews": "1000",
          "date": getDate(3)
        }, {
          "pageviews": "10000",
          "date": getDate(2)
        }, {
          "pageviews": "100000",
          "date": getDate(1)
        }, {
          "pageviews": "1000000",
          "date": getDate(0)
        }]
      };

      var count = ChartAPISpy.Graph.callCount;
      var RecentAccess = require('cards/stats/view/recent_access');
      var recentAccess = new RecentAccess(initData);

      waitsFor(function () {
        return ChartAPISpy.Graph.callCount > count;
      }, 'render', 3000);

      runs(function () {
        var yLabel = ChartAPISpy.Graph.mostRecentCall.args[0].yLabel;
        expect(yLabel[0]).toEqual('1');
        expect(yLabel[1]).toEqual('10');
        expect(yLabel[2]).toEqual('100');
        expect(yLabel[3]).toEqual('1K');
        expect(yLabel[4]).toEqual('10K');
        expect(yLabel[5]).toEqual('100K');
        expect(yLabel[6]).toEqual('1M');
      })
    });

    describe("top articles", function () {
      it("use stored data", function () {
        var data = _.extend({}, initData, {
          unit: 'day'
        });

        var Collection = require('cards/stats/models/top_articles_itemview_collection');
        var collection = new Collection();
        var Model = require('cards/stats/models/top_articles');
        var model = new Model();
        var moment = require('moment');
        var flag;

        model.fetch({
          blogId: initData.blogId,
          startDate: moment().startOf('day').format(),
          endDate: moment().endOf('day').format(),
          limit: 10,
          success: function () {
            flag = true;
          }
        });

        waitsFor(function () {
          return flag;
        }, 'fetch model', 3000);

        var TopArticles, topArticles;
        runs(function () {
          var cache = require('js/cache');
          cache.set(initData.blogId, 'toparticle_day_model', model);
          cache.set(initData.blogId, 'toparticle_itemview_day_collection', collection);
          TopArticles = require('cards/stats/view/top_articles');
          topArticles = new TopArticles(data);
        });

        waitsFor(function () {
          return topArticlesSpy.render.calls.length === 2;
        }, 'render', 3000);

        runs(function () {
          expect(topArticlesSpy.fetch).not.toHaveBeenCalled();
        });
      });

      it("statsProvider failed", function () {
        window.Mock.failStatsProvider = 'failed by some reason';

        var data = _.extend({}, initData, {
          unit: 'day'
        });

        var TopArticles = require('cards/stats/view/top_articles');
        var topArticles = new TopArticles(data);

        waitsFor(function () {
          return topArticlesSpy.render.callCount === 2;
        }, 'render', 3000);

        var count, fCount;
        runs(function () {
          expect(topArticles.providerIsNotAvailable).toBe(true);
        });
      });

      it("failed to fetch pageviews model", function () {
        window.Mock.failListStatsPageviewsForPath = 'fetch failed';
        var data = _.extend({}, initData, {
          unit: 'day'
        });

        var TopArticles = require('cards/stats/view/top_articles');
        var topArticles = new TopArticles(data);

        waitsFor(function () {
          return topArticlesSpy.render.callCount === 2;
        }, 'itemview model fetch', 3000);

        var count;
        runs(function () {
          expect(topArticles.fetchError).toBe(true);
          window.Mock.failListStatsPageviewsForPath = null;

          var $target = topArticles.$el.find('.refetch');
          expect($target.length).toBeTruthy();
          var event = $.Event('tap', {
            currentTarget: $target.get(0)
          });
          count = topArticlesSpy.render.callCount;
          $target.trigger(event);
        });

        waitsFor(function () {
          return topArticlesSpy.render.callCount > count;
        }, 'render after refetch', 3000);

        runs(function () {
          expect(topArticles.fetchError).toBe(false);
        })
      });

      it("fetch itemView model", function () {
        var data = _.extend({}, initData, {
          unit: 'day'
        });

        var item = window.Mock.throwEntryItem = {
          "status": "Publish",
          "date": "2013-08-05T09:00:00\u002b09:00",
          "author": "Yutaka Yamaguchi",
          "class": "entry",
          "title": "title" + (new Date()).valueOf(),
          "body": "body",
          "blog": {}
        };

        var pv = window.Mock.throwListStatsPageviewsForPathItems = [{
          "pageviews": "100",
          "entry": {
            "id": "1"
          },
          "path": "foo/bar/baz.html",
          "title": "foobar",
          "archiveType": "individual",
          "category": null,
          "author": null
        }];

        var TopArticles = require('cards/stats/view/top_articles');
        var topArticles = new TopArticles(data);

        waitsFor(function () {
          return itemViewModelSpy.fetch.callCount > 0;
        }, 'itemview model fetch', 3000);

        runs(function () {
          expect(topArticles.collection.length).toEqual(1);
          var itemview = topArticles.collection.toJSON()[0];
          expect(itemview.title).toEqual(item.title);
          expect(itemview.pageviews).toEqual(pv[0].pageviews);
          expect(itemview.num).toEqual(1);
          expect(itemview.unit).toEqual('day');
        });
      });

      it("failed to fetch itemView model", function () {
        var data = _.extend({}, initData, {
          unit: 'day'
        });

        window.Mock.failEntryItem = 'failed fetch';

        window.Mock.throwListStatsPageviewsForPathItems = [{
          "pageviews": "100",
          "entry": {
            "id": "1"
          },
          "path": "foo/bar/baz.html",
          "title": "foobar",
          "archiveType": "individual",
          "category": null,
          "author": null
        }];

        var TopArticles = require('cards/stats/view/top_articles');
        var topArticles = new TopArticles(data);

        waitsFor(function () {
          return itemViewModelSpy.fetch.callCount > 0;
        }, 'itemview model fetch', 3000);

        runs(function () {
          expect(topArticles.collection.length).toEqual(1);
          var itemview = topArticles.collection.toJSON()[0];
          expect(itemview.title).toEqual('foobar');
        });
      });

      it("use path option in top article model",function(){
        var mtapi = require('js/mtapi');
        spyOn(mtapi.api,'listStatsPageviewsForPath').andCallThrough();

        var Model = require('cards/stats/models/top_articles');
        var model = new Model();

        var moment = require('moment');
        var flag;

        var options = {
          blogId: initData.blogId,
          startDate: moment().startOf('day').format(),
          endDate: moment().endOf('day').format(),
          limit: 10,
          path: '/',
          success: function () {
            flag = true;
          }
        };
        model.fetch(options);

        waitsFor(function(){
          return flag;
        },'fetch',3000);

        runs(function(){
          expect(mtapi.api.listStatsPageviewsForPath).toHaveBeenCalled();
          var blogId = mtapi.api.listStatsPageviewsForPath.mostRecentCall.args[0];
          var opts = mtapi.api.listStatsPageviewsForPath.mostRecentCall.args[1];
          expect(blogId).toEqual(options.blogId);
          expect(opts.path).toEqual(options.path);
          expect(opts.startDate).toEqual(options.startDate);
          expect(opts.endDate).toEqual(options.endDate);
          expect(opts.limit).toEqual(options.limit);
        })
      });
    });
  })

  afterEach(function () {
    resetMock();
    reRequireModule(['js/commands', 'js/router/controller', 'mtchart']);
  });
});
