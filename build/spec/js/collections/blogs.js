describe("blogs", function () {
  'use strict';

  describe("blogs", function () {

    var BlogCollection = require('js/collections/blogs');
    var Mock = require('js/mtapi/mock');

    it("get blog collection", function () {
      var len = 30;
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

      var blogCollection = new BlogCollection();
      var flag;

      blogCollection.fetch({
        userId: 1,
        success: function () {
          flag = true;
        }
      });

      waitsFor(function () {
        return flag;
      }, 'timeout error on fetching blogCollection', 3000);

      runs(function () {
        expect(blogCollection.totalResults).toEqual(len);
        var blogs = blogCollection.toJSON();
        var blog = blogs[0];
        expect(blog).toBeDefined();
        expect(blog.name).toEqual("Blog 1");
        expect(blog.url).toEqual("http://memolog.org/blog1");
        expect(blog.id).toEqual("1");
        expect(blog.class).toEqual("blog");
        window.Mock.throwBlogListItems = null;
      });
    });

    it("should handle error error when getBlogList has error", function () {
      window.Mock.alwaysFail = true;

      var blogCollection = new BlogCollection();
      var flag;

      var options = {
        userId: 1,
        success: function () {
          flag = true;
        },
        error: function () {
          flag = true;
        }
      };
      spyOn(options, 'error').andCallThrough();

      blogCollection.fetch(options);

      waitsFor(function () {
        return flag;
      }, 'timeout error on fetching blogCollection', 3000);

      runs(function () {
        expect(options.error).toHaveBeenCalled();
        window.Mock.alwaysFail = null;
      });
    });

    it('params thrown properly', function () {
      var getBlogList = {
        stub: function () {
          var dfd = $.Deferred(),
            mock = new Mock(),
            resp = mock.listBlogsForUser();
          dfd.resolve(resp);
          return dfd;
        }
      };
      var flag, flag2;
      var blogCollection;

      require.undef('js/mtapi/blogs');
      $('script[src$="js/mtapi/blogs.js"]').remove();

      define('js/mtapi/blogs', [], function () {
        return getBlogList.stub;
      });
      spyOn(getBlogList, 'stub').andCallThrough();

      require.undef('js/collections/blogs');
      $('script[src$="js/collections/blogs"]').remove();

      require(['js/collections/blogs'], function (lib) {
        BlogCollection = lib;
        flag = true;
      });

      waitsFor(function () {
        return flag;
      }, 'timeout error on require js/collection/blogs', 3000);

      runs(function () {
        blogCollection = new BlogCollection();

        blogCollection.fetch({
          userId: 1,
          offset: 5,
          excludeIds: '1,2',
          limit: 7,
          success: function () {
            flag2 = true;
          }
        });
      });

      waitsFor(function () {
        return flag2;
      }, 'timeout error on fetching blogCollection', 3000);

      runs(function () {
        var params = getBlogList.stub.mostRecentCall.args[1];
        expect(params.offset).toEqual(5);
        expect(params.excludeIds).toEqual('1,2');
        expect(params.limit).toEqual(7);
      });
    });

    it('use default value when offset/limit is not able to be parsed', function () {
      var getBlogList = {
        stub: function () {
          var dfd = $.Deferred(),
            mock = new Mock(),
            resp = mock.listBlogsForUser();
          dfd.resolve(resp);
          return dfd;
        }
      };
      var flag, flag2;
      var blogCollection;

      require.undef('js/mtapi/blogs');
      $('script[src$="js/mtapi/blogs.js"]').remove();

      define('js/mtapi/blogs', [], function () {
        return getBlogList.stub;
      });
      spyOn(getBlogList, 'stub').andCallThrough();

      require.undef('js/collections/blogs');
      $('script[src$="js/collections/blogs"]').remove();

      require(['js/collections/blogs'], function (lib) {
        BlogCollection = lib;
        flag = true;
      });

      waitsFor(function () {
        return flag;
      }, 'timeout error on require js/collection/blogs', 3000);

      runs(function () {
        blogCollection = new BlogCollection();

        blogCollection.fetch({
          userId: 1,
          offset: 'foobar',
          limit: 'foobar',
          success: function () {
            flag2 = true;
          }
        });
      });

      waitsFor(function () {
        return flag2;
      }, 'timeout error on fetching blogCollection', 3000);

      runs(function () {
        var params = getBlogList.stub.mostRecentCall.args[1];
        expect(params.offset).toEqual(0);
        expect(params.limit).toEqual(25);
      });
    });

    it('should make no thrown params stay undefined', function () {
      var getBlogList = {
        stub: function () {
          var dfd = $.Deferred(),
            mock = new Mock(),
            resp = mock.listBlogsForUser();
          dfd.resolve(resp);
          return dfd;
        },
        func: function () {
          return getBlogList.stub;
        }
      };
      var flag, flag2;
      var blogCollection;

      require.undef('js/mtapi/blogs');
      $('script[src$="js/mtapi/blogs.js"]').remove();

      define('js/mtapi/blogs', [], getBlogList.func);
      spyOn(getBlogList, 'stub').andCallThrough();

      require.undef('js/collections/blogs');
      $('script[src$="js/collections/blogs"]').remove();

      require(['js/collections/blogs'], function (lib) {
        BlogCollection = lib;
        flag = true;
      });

      waitsFor(function () {
        return flag;
      }, 'timeout error on require js/collection/blogs', 3000);

      runs(function () {
        blogCollection = new BlogCollection();

        blogCollection.fetch({
          userId: 1,
          success: function () {
            flag2 = true;
          }
        });
      });

      waitsFor(function () {
        return flag2;
      }, 'timeout error on fetching blogCollection', 3000);

      runs(function () {
        var params = getBlogList.stub.mostRecentCall.args[1];
        expect(params.offset).not.toBeDefined();
        expect(params.excludeIds).not.toBeDefined();
        expect(params.limit).not.toBeDefined();
      });
    });
  });

  afterEach(function () {
    require.undef('js/mtapi/blogs');
    $('script[src$="js/mtapi/blogs.js"]').remove();

    require.undef('js/collections/blogs');
    $('script[src$="js/collections/blogs"]').remove();

    var flag;

    require(['js/mtapi/blogs', 'js/collections/blogs'], function () {
      flag = true;
    });

    waitsFor(function () {
      return flag;
    }, 'timeout error on afterEach', 3000);
  });
});
