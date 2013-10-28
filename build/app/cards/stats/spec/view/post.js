describe("stats", function () {
  'use strict';

  var Post, post
  var Controller, controller, initData;
  var commandSpies, postSpy, postModelSpy, statsModelSpy;
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
    commandSpies = jasmine.createSpyObj('commandSpies', ['router:navigate', 'card:stats:share:show', 'share:show']);
    postSpy = jasmine.createSpyObj('postSpy', ['initialize', 'fetch', 'render', 'onRender']);
    postModelSpy = jasmine.createSpyObj('postModelSpy', ['fetch']);
    statsModelSpy = jasmine.createSpyObj('statsModelSpy', ['fetch']);

    initCommands(commandSpies, controller);

    runs(function () {
      reRequireModule(['cards/stats/models/top_articles_itemview_collection', 'cards/stats/models/top_articles_itemview', 'cards/stats/models/top_articles'])
    })

    runs(function () {
      insertSpy('cards/stats/models/top_articles_itemview', postModelSpy);
      insertSpy('cards/stats/models/top_articles', statsModelSpy);

      runs(function () {
        reRequireModule(['cards/stats/view/post'])
        insertSpy('cards/stats/view/post', postSpy);
      });

      runs(function () {
        reRequireModule(['js/router/controller', 'js/views/card/header', 'cards/stats/view/post_header']);
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

  describe("post", function () {
    it("initialize, fetch, render (day)", function () {
      var routes = [initData.blogId, '1', 'day'];
      var data = _.extend({}, initData, {
        routes: routes
      });

      Post = require('cards/stats/view/post');
      post = new Post(data);

      waitsFor(function () {
        return postSpy.onRender.callCount === 2;
      }, 'render post', 3000);

      runs(function () {
        expect(post.blogId).toEqual(initData.blogId);
        expect(post.entryId).toEqual('1');
        expect(post.unit).toEqual('day');
        expect(post.model.id).toEqual(routes[1]);
        expect(post.model.blogId).toEqual(routes[0]);
        expect(post.pageviews).toBeDefined();
        var serializedData = post.serializeData();
        expect(serializedData.label).toEqual('Today\'s access');
      });
    });

    it("use stored post data", function () {
      var routes = [initData.blogId, '1', 'day'];
      var data = _.extend({}, initData, {
        routes: routes
      });

      var Collection = require('cards/stats/models/top_articles_itemview_collection');
      var collection = new Collection();
      var Model = require('cards/stats/models/top_articles_itemview');
      var model = new Model({
        id: '1',
        blogId: initData.blogId,
        num: 1,
        pageviews: '200',
        unit: 'day'
      });
      var flag;
      model.fetch({
        success: function () {
          flag = true
        }
      });

      waitsFor(function () {
        return flag;
      }, 'fetch model', 3000);

      runs(function () {
        collection.add(model);
        var cache = require('js/cache');
        cache.set(initData.blogId, 'toparticle_itemview_day_collection', collection);

        Post = require('cards/stats/view/post');
        post = new Post(data);
      });

      waitsFor(function () {
        return postSpy.render.callCount === 1;
      }, 'render', 3000);

      runs(function () {
        expect(postModelSpy.fetch.callCount).toEqual(1);
        expect(statsModelSpy.fetch).not.toHaveBeenCalled();
        expect(post.model.id).toEqual('1');
      });
    });

    it("failed to fetch model", function () {
      window.Mock.failEntryItem = 'fetch failed';
      var routes = [initData.blogId, '1', 'day'];
      var data = _.extend({}, initData, {
        routes: routes
      });

      Post = require('cards/stats/view/post');
      post = new Post(data);

      waitsFor(function () {
        return postSpy.onRender.callCount === 2;
      }, 'render post', 3000);

      var count, $target;
      runs(function () {
        expect(post.fetchError).toBe(true);
        window.Mock.failEntryItem = null;
        count = postSpy.render.callCount;
        $target = assertRefetch(post);
      });

      waitsFor(function () {
        return postSpy.render.callCount > count;
      }, 'refetch', 3000);

      runs(function () {
        expect(post.fetchError).toBe(false);
      });
    });

    it("failed to fetch model stats", function () {
      window.Mock.failListStatsPageviewsForPath = 'fetch failed';
      var routes = [initData.blogId, '1', 'day'];
      var data = _.extend({}, initData, {
        routes: routes
      });

      Post = require('cards/stats/view/post');
      post = new Post(data);

      waitsFor(function () {
        return postSpy.onRender.callCount === 2;
      }, 'render post', 3000);

      var count, $target;
      runs(function () {
        expect(post.fetchError).toBe(true);
        expect(postModelSpy.fetch).toHaveBeenCalled();
        expect(statsModelSpy.fetch).toHaveBeenCalled();

        window.Mock.failListStatsPageviewsForPath = null;
        count = postSpy.render.callCount;
        $target = assertRefetch(post);
      });

      waitsFor(function () {
        return postSpy.render.callCount > count;
      }, 'refetch', 3000);

      runs(function () {
        expect(post.fetchError).toBe(false);
        expect(postModelSpy.fetch.callCount).toEqual(2);
        expect(statsModelSpy.fetch.callCount).toEqual(2);
      });
    });

    it("header back button route", function () {
      var routes = [initData.blogId, '1', 'day'];
      var data = _.extend({}, initData, {
        routes: routes
      });

      var item = window.Mock.throwEntryItem = {
        "status": "Publish",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body",
        "blog": {},
        "excerpt": "excerpt",
        "permalink": "http://memolog.org/2013/08/05/foobar.html"
      };

      var Layout = require('js/views/card/layout');
      var layout = new Layout(_.extend({}, data, {
        viewHeader: card.routes[1].header,
        viewView: card.routes[1].view
      }));
      layout.render();

      var header;
      waitsFor(function () {
        return postSpy.render.callCount === 3;
      }, 'render', 3000);

      runs(function () {
        header = layout.header.currentView;
        expect(header.backButtonRoute()).toEqual(card.id);
      });
    });

    it("share entry", function () {
      var routes = [initData.blogId, '1', 'day'];
      var data = _.extend({}, initData, {
        routes: routes
      });

      var item = window.Mock.throwEntryItem = {
        "status": "Publish",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body",
        "blog": {},
        "excerpt": "excerpt",
        "permalink": "http://memolog.org/2013/08/05/foobar.html"
      };

      var Layout = require('js/views/card/layout');
      var layout = new Layout(_.extend({}, data, {
        viewHeader: card.routes[1].header,
        viewView: card.routes[1].view
      }));
      layout.render();
      var header;

      waitsFor(function () {
        return postSpy.render.callCount === 3;
      }, 'render', 3000);

      var count;
      runs(function () {
        header = layout.header.currentView;
        post = layout.main.currentView;
        var $shareButton = header.$el.find('#share-button');
        expect($shareButton.length).toBeTruthy();
        var e = $.Event('tap', {
          currentTarget: $shareButton.get(0)
        });
        count = commandSpies['card:stats:share:show'].callCount;
        $shareButton.trigger(e);
      });

      waitsFor(function () {
        return commandSpies['card:stats:share:show'].callCount > count;
      }, 'callback from tapping share button');

      runs(function () {
        expect(commandSpies['share:show']).toHaveBeenCalled();
        var share = commandSpies['share:show'].mostRecentCall.args[0].share;
        expect(share.url).toEqual(item.permalink);
        expect(share.tweetText).toEqual(item.title + ' ' + item.excerpt);
      });
    });

    it('remove command handler on close', function () {
      var commands = require('js/commands');
      var routes = [initData.blogId, '1', 'day'];
      var data = _.extend({}, initData, {
        routes: routes
      });
      var flag;

      Post = require('cards/stats/view/post');
      post = new Post(data);
      post.on('item:closed', function () {
        flag = true;
      })

      waitsFor(function () {
        return postSpy.onRender.callCount === 2;
      }, 'render post', 3000);

      runs(function () {
        expect(commands._wreqrHandlers['card:stats:share:show']).toBeDefined();
        post.close();
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(commands._wreqrHandlers['card:stats:share:show']).toBeUndefined();
      })
    })
  });

  afterEach(function () {
    resetMock();
    reRequireModule(['js/commands', 'js/router/controller']);
  });
});
