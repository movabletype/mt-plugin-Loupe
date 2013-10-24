describe("views", function () {
  'use strict';

  var BlogList, blogList;
  var Controller, controller, initData;
  var commandSpies, stub;
  var cache = require('js/cache');
  var fetchingSpy, renderSpy, selectCurrentBlogSpy;

  beforeEach(function () {
    resetMock();

    var origFunc = require('js/mtapi/blogs');
    stub = {
      getBlogsList: origFunc
    };
    spyOn(stub, 'getBlogsList').andCallThrough();
    undefRequireModule('js/mtapi/blogs');
    define('js/mtapi/blogs', [], function () {
      return function (userId, options) {
        return stub.getBlogsList(userId, options);
      };
    });

    commandSpies = jasmine.createSpyObj('commandSpies', ['dashboard:toggle', 'move:dashboard', 'router:navigate']);
    initCommands(commandSpies, controller);

    runs(function () {
      reRequireModule(['js/views/menu/blogs-list', 'js/collections/blogs']);
    });

    runs(function () {
      fetchingSpy = jasmine.createSpy('fetchingSpy');
      renderSpy = jasmine.createSpy('renderSpy');
      selectCurrentBlogSpy = jasmine.createSpy('selectCurrentBlogSpy');

      var orig = require('js/views/menu/blogs-list');
      undefRequireModule('js/views/menu/blogs-list');
      define('js/views/menu/blogs-list', [], function () {
        return orig.extend({
          initialize: function () {
            orig.prototype.initialize.apply(this, arguments);
          },
          fetch: function (options) {
            orig.prototype.fetch.apply(this, arguments);
            fetchingSpy(options);
          },
          render: function () {
            orig.prototype.render.apply(this, arguments);
            renderSpy();
          },
          selectCurrentBlog: function (target) {
            orig.prototype.selectCurrentBlog.apply(this, arguments);
            selectCurrentBlogSpy(target);
          }
        });
      });
      requireModuleAndWait(['js/views/menu/blogs-list']);
      runs(function () {
        reRequireModule(['js/router/controller']);
      })
    });

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = data;
        BlogList = require('js/views/menu/blogs-list');
      });
    });

    waitsFor(function () {
      return !!BlogList;
    }, 'initialize blogList', 3000);
  });

  describe("dashboard/blogs-list", function () {
    beforeEach(function () {
      resetMock();
      localStorage.removeItem('currentBlogId');
      localStorage.removeItem('recentBlogHistory');
      cache.clear('user', 'blogs');

      var len = 51;
      var items = [];
      var id;
      for (var i = 0; i < len; i++) {
        id = (i + 1).toString();
        items.push({
          "name": "Blog " + id,
          "url": "http://memolog.org/blog" + id,
          "id": id,
          "class": "blog"
        });
      }
      window.Mock.throwBlogListItems = items;
    });

    it("initialize with no cache/storage", function () {
      blogList = new BlogList(initData);
      expect(blogList.currentBlogId).toEqual(initData.blog.id);
      expect(blogList.offset).toEqual(0);
      expect(blogList.collection).toBeNull();
      expect(cache.get('user', 'blogs')).not.toBeNull();
    });

    it("initialize with localstorage", function () {
      localStorage.setItem('currentBlogId', 4);
      blogList = new BlogList(initData);
      expect(blogList.currentBlogId).toEqual(4);
    });

    it("initialize with cached collection", function () {
      var flag;
      var Collection = require('js/collections/blogs');
      var collection = new Collection();
      collection.fetch({
        success: function () {
          flag = true;
        }
      });
      waitsFor(function () {
        return flag;
      }, 'collection fetch', 3000);

      cache.set('user', 'blogs', collection);
      blogList = new BlogList(initData);
      expect(blogList.collection).toEqual(collection);
    });

    it("fetch success without histories", function () {
      blogList = new BlogList(initData);

      waitsFor(function () {
        return fetchingSpy.callCount === 1;
      }, 'render', 3000);

      runs(function () {
        expect(selectCurrentBlogSpy).toHaveBeenCalled();
        expect(blogList.blogsLoading).toBe(false);
      });
    });

    it("fetch with histories", function () {
      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 1
      }, {
        id: 2
      }, {
        id: 29
      }]));
      blogList = new BlogList(initData);
      var count = stub.getBlogsList.callCount;

      waitsFor(function () {
        return stub.getBlogsList.callCount > count;
      }, 'fetching blogList', 3000);

      runs(function () {
        var options = stub.getBlogsList.mostRecentCall.args[1];
        console.log('bobobobo')
        console.log(stub.getBlogsList.mostRecentCall.args[1])
        expect(options.excludeIds).toBeDefined();
        expect(options.excludeIds).toEqual('1,2,29');
      });
    });

    it("fetch error", function () {
      window.Mock.alwaysFail = 'Fetch error';
      blogList = new BlogList(initData);

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'render', 3000);

      runs(function () {
        expect(blogList.error.message).toEqual('Fetch error');
        expect(blogList.$el.find('.error').text()).toMatch(/Fetch error/);
      });
    });

    it("selectBlogHandler", function () {
      blogList = new BlogList(initData);
      spyOn(blogList, 'saveChangesHandler');

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'fetching data', 3000);

      runs(function () {
        blogList.selectBlogHandler(3);
        var $elements = blogList.$el.find('a.selected');
        expect($elements.length).toEqual(1);
        expect($elements.data('id')).toEqual(3);
        expect(blogList.saveChangesHandler).toHaveBeenCalled();
      });
    });

    it("saveChangesHandler with no history", function () {
      blogList = new BlogList(initData);

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'fetching data', 3000);

      runs(function () {
        blogList.currentBlogId = 2;
        blogList.selectedBlogId = 3;
        blogList.saveChangesHandler();
      });

      var flag;
      runs(function () {
        expect(commandSpies['dashboard:toggle']).toHaveBeenCalled();
        expect(blogList.currentBlogId).toEqual(3);
        expect(localStorage.getItem('currentBlogId')).toEqual('3');
        expect(blogList.blog.id).toEqual('3');
        expect(blogList.histories.length).toEqual(1);
        expect(blogList.histories[0].id).toEqual('3');
        expect(blogList.collection.get(3)).toBeUndefined();
        setTimeout(function () {
          flag = true;
        }, 500);
      });

      waitsFor(function () {
        return flag;
      }, 'setTimeout', 3000);

      runs(function () {
        expect(commandSpies['move:dashboard']).toHaveBeenCalled();
      });
    });

    it("saveChangesHandler with history", function () {
      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 2
      }]));
      blogList = new BlogList(initData);

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'fetching data', 3000);

      runs(function () {
        blogList.histories.push({
          id: '999'
        });
        localStorage.setItem('recentBlogHistory', JSON.stringify(blogList.histories));
        blogList.currentBlogId = 2;
        blogList.selectedBlogId = 999;
        blogList.saveChangesHandler();
      });

      runs(function () {
        expect(blogList.currentBlogId).toEqual(999);
        expect(localStorage.getItem('currentBlogId')).toEqual('999');
        expect(blogList.blog.id).toEqual('999');
        expect(blogList.histories.length).toEqual(2);
        expect(blogList.histories[0].id).toEqual('999');
      });
    });

    it("history data limited by 5", function () {
      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 2
      }, {
        id: 21
      }, {
        id: 3
      }, {
        id: 4
      }, {
        id: 5
      }]));
      blogList = new BlogList(initData);

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'fetching data', 3000);

      runs(function () {
        blogList.currentBlogId = 2;
        blogList.selectedBlogId = 22;
        blogList.saveChangesHandler();
      });

      runs(function () {
        expect(blogList.currentBlogId).toEqual(22);
        expect(localStorage.getItem('currentBlogId')).toEqual('22');
        expect(blogList.blog.id).toEqual('22');
        expect(blogList.histories.length).toEqual(5);
        expect(blogList.histories[0].id).toEqual('22');
        expect(blogList.histories[4].id).toEqual('4');
      });
    });

    it("removeRecentBlogHistory", function () {
      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 2
      }, {
        id: 26
      }]));
      blogList = new BlogList(initData);
      blogList.removeRecentBlogHistory();
      expect(localStorage.getItem('recentBlogHistory')).toBeNull();
      expect(blogList.histories).toEqual([]);
    });

    it("refetchBlogHistoryData", function () {
      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 2
      }, {
        id: 26
      }]));
      blogList = new BlogList(initData);

      waitsFor(function () {
        return !blogList.historiesLoading;
      }, 'refetching blog history data', 3000);

      runs(function () {
        expect(stub.getBlogsList).toHaveBeenCalled();
        var includeIds = stub.getBlogsList.mostRecentCall.args[1].includeIds;
        expect(includeIds).toEqual('2,26');
        expect(blogList.histories[0].name).toEqual('Blog 2');
        expect(blogList.histories[1].url).toEqual('http://memolog.org/blog26');
      });
    });


    it("remove unknown blog id from histories", function () {
      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 2
      }, {
        id: 999999
      }]));
      blogList = new BlogList(initData);

      waitsFor(function () {
        return !blogList.historiesLoading;
      }, 'refetching blog history data', 3000);

      runs(function () {
        expect(stub.getBlogsList).toHaveBeenCalled();
        var includeIds = stub.getBlogsList.mostRecentCall.args[1].includeIds;
        expect(includeIds).toEqual('2,999999');
        expect(blogList.histories.length).toEqual(1);
        expect(blogList.histories[0].name).toEqual('Blog 2');
      });
    });

    it("refetchBlogHistoryData fail, then do nothing", function () {
      window.Mock.throwBlogListItems = null;
      window.Mock.failBlogListItems = 'Fetching failed';
      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 2
      }, {
        id: 999999
      }]));
      blogList = new BlogList(initData);

      waitsFor(function () {
        return !blogList.historiesLoading;
      }, 'refetching blog history data', 3000);

      runs(function () {
        expect(stub.getBlogsList).toHaveBeenCalled();
        expect(blogList.histories.length).toEqual(2);
      });
    });

    it("when blogList already fetched, render immediately after refetching blog history data", function () {
      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 2
      }, {
        id: 26
      }]));
      blogList = new BlogList(initData);

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'fetching blog data', 3000);

      runs(function () {
        blogList.historiesLoading = true;
        spyOn(blogList, 'render');
        blogList.refetchBlogHistoryData();
      });

      waitsFor(function () {
        return !blogList.historiesLoading;
      }, 'refetching blog history data', 3000);

      runs(function () {
        expect(blogList.render).toHaveBeenCalled();
      });
    });

    it("tap blog item", function () {
      blogList = new BlogList(initData);
      spyOn(blogList, 'addTapClass').andCallThrough();
      spyOn(blogList, 'selectBlogHandler');

      var $target, event;

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'fetching data', 3000);

      runs(function () {
        $target = blogList.$el.find('a[data-id="3"]');
        event = jQuery.Event('tap', {
          currentTarget: $target.get(0)
        });
        spyOn(event, 'stopPropagation').andCallThrough();
        $target.trigger(event);
      });

      waitsFor(function () {
        return !!event.stopPropagation.callCount;
      }, 'add tap class', 3000);

      runs(function () {
        expect(blogList.addTapClass).toHaveBeenCalled();
        expect(blogList.selectBlogHandler).toHaveBeenCalled();
        expect(blogList.selectBlogHandler.mostRecentCall.args[0]).toEqual(3);
      });
    });

    it("tap signout", function () {
      blogList = new BlogList(initData);
      spyOn(blogList, 'addTapClass').andCallThrough();
      var $target, event;

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'fetching data', 3000);

      runs(function () {
        $target = blogList.$el.find('a[data-id="signout"]');
        event = jQuery.Event('tap', {
          currentTarget: $target.get(0)
        });
        spyOn(event, 'stopPropagation').andCallThrough();
        $target.trigger(event);
      });

      waitsFor(function () {
        return !!event.stopPropagation.callCount;
      }, 'add tap class', 3000);

      runs(function () {
        expect(blogList.addTapClass).toHaveBeenCalled();
        expect(commandSpies['router:navigate']).toHaveBeenCalled();
        expect(commandSpies['router:navigate'].mostRecentCall.args[0]).toEqual('signout');
        Backbone.history.navigate('');
      });
    });

    it("tap navigation", function () {
      blogList = new BlogList(initData);

      var $target, event;

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'fetching data', 3000);

      var count;
      runs(function () {
        expect(blogList.offset).toEqual(0);
        expect(blogList.next).toEqual(25);
        expect(blogList.prev).toBeNull();
        expect(blogList.$el.find('.blog-item-nav-prev').length).toBeFalsy();
        expect(blogList.$el.find('.blog-item').length).toEqual(25);

        spyOn(blogList, 'addTapClass').andCallThrough();
        $target = blogList.$el.find('.blog-item-nav-next');
        event = jQuery.Event('tap', {
          currentTarget: $target.get(0)
        });

        count = renderSpy.callCount;
        $target.trigger(event);
      });

      waitsFor(function () {
        return renderSpy.callCount > count + 1;
      }, 'add tap class', 3000);

      runs(function () {
        expect(blogList.addTapClass).toHaveBeenCalled();
        expect(blogList.offset).toEqual(25);
        expect(blogList.next).toEqual(50);
        expect(blogList.prev).toEqual(0);
        expect(blogList.$el.find('.blog-item').length).toEqual(25);

        $target = blogList.$el.find('.blog-item-nav-next');
        event = jQuery.Event('tap', {
          currentTarget: $target.get(0)
        });
        count = renderSpy.callCount;
        $target.trigger(event);
      });

      waitsFor(function () {
        return renderSpy.callCount > count + 1;
      }, 'add tap class', 3000);

      runs(function () {
        expect(blogList.offset).toEqual(50);
        expect(blogList.next).toEqual(75);
        expect(blogList.prev).toEqual(25);

        expect(blogList.$el.find('.blog-item-nav-next').length).toBeFalsy();
        expect(blogList.$el.find('.blog-item').length).toEqual(1);

        $target = blogList.$el.find('.blog-item-nav-prev');
        event = jQuery.Event('tap', {
          currentTarget: $target.get(0)
        });
        count = renderSpy.callCount;
        $target.trigger(event);
      });

      waitsFor(function () {
        return renderSpy.callCount > count;
      }, 'add tap class', 3000);

      runs(function () {
        expect(blogList.offset).toEqual(25);

        expect(blogList.$el.find('.blog-item-nav-next').length).toBeTruthy();
        expect(blogList.$el.find('.blog-item').length).toEqual(25);

        $target = blogList.$el.find('.blog-item-nav-prev');
        event = jQuery.Event('tap', {
          currentTarget: $target.get(0)
        });
        count = renderSpy.callCount;
        $target.trigger(event);
      });

      waitsFor(function () {
        return renderSpy.callCount > count;
      }, 'add tap class', 3000);

      runs(function () {
        expect(blogList.offset).toEqual(0);
        expect(blogList.$el.find('.blog-item-nav-prev').length).toBeFalsy();
        expect(blogList.$el.find('.blog-item').length).toEqual(25);
      });
    });

    it("serializeData and fetching", function () {
      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 1
      }, {
        id: 2
      }, {
        id: 29
      }]));

      blogList = new BlogList(initData);
      var count, fetchCount;

      waitsFor(function () {
        return !!blogList.trans;
      }, 'fetching data', 3000);

      runs(function () {
        count = renderSpy.callCount;
        expect(blogList.offset).toEqual(0);
        expect(blogList.next).toEqual(22);
        blogList.offset = 22;
        blogList.navigationHandler();
      });

      waitsFor(function () {
        return renderSpy.callCount > count;
      }, 'render call 1', 3000);

      runs(function () {
        count = renderSpy.callCount;
        expect(blogList.collection.length).toEqual(47);
        expect(blogList.next).toEqual(47);
        blogList.offset = 47;
        blogList.navigationHandler();
      });

      waitsFor(function () {
        return renderSpy.callCount > count;
      }, 'render call 2', 3000);

      runs(function () {
        count = renderSpy.callCount;
        fetchCount = fetchingSpy.callCount;
        expect(blogList.collection.length).toEqual(48);
        blogList.offset = 25;
        blogList.navigationHandler();
      });

      waitsFor(function () {
        return renderSpy.callCount > count;
      }, 'render call 3', 3000);

      runs(function () {
        expect(fetchingSpy.callCount).toEqual(fetchCount);
      });
    });

    it("all blogs included histories", function () {
      var len = 3;
      var items = [];
      var id;
      for (var i = 0; i < len; i++) {
        id = (i + 1).toString();
        items.push({
          "name": "Blog " + id,
          "url": "http://memolog.org/blog" + id,
          "id": id,
          "class": "blog"
        });
      }
      window.Mock.throwBlogListItems = items;

      localStorage.setItem('recentBlogHistory', JSON.stringify([{
        id: 1
      }, {
        id: 2
      }, {
        id: 3
      }]));

      blogList = new BlogList(initData);

      waitsFor(function () {
        return !blogList.blogsLoading;
      }, 'fetching data', 3000);

      runs(function () {
        expect(blogList.blogs).toEqual([]);
      });
    });

    afterEach(function () {
      blogList.$el.remove();
    });
  });

  afterEach(function () {
    Backbone.history.navigate('');
    resetMock();
    reRequireModule(['js/commands', 'js/mtapi/blogs', 'js/router/controller', 'js/views/menu/blogs-list']);
  });
});
