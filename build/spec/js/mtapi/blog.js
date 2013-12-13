describe("mtapi", function () {
  'use strict';

  describe("blog", function () {
    var Blog = require('js/mtapi/blog'),
      cache = require('js/cache');

    beforeEach(function () {
      cache.clearAll();
    });

    it("get blog", function () {
      window.Mock.throwBlogItem = {
        "name": "Blog 1",
        "url": "http://memolog.org/blog1",
        "class": "blog",
      };
      window.Mock.throwPermissionItems = [{
        "permissions": ["administer_blog"],
        "blog": {
          "id": "1"
        }
      }];


      var dfd = new Blog(1);
      var blog, flag, permCollection;

      runs(function () {
        dfd.done(function (resp) {
          blog = resp;
          permCollection = cache.get('user', 'perms');
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(blog).toBeDefined();
        expect(blog.id).toEqual(1);
        expect(blog.name).toEqual('Blog 1');
        expect(blog.url).toEqual('http://memolog.org/blog1');
        expect(blog.class).toEqual('blog');

        expect(permCollection).toBeDefined();
        expect(permCollection.get(1).get('permissions')).toEqual(['administer_blog']);
      });
    });

    it("get blog and cannot get any permissions", function () {
      window.Mock.throwBlogItem = {
        "name": "Blog 1",
        "url": "http://memolog.org/blog1",
        "class": "blog",
      };
      window.Mock.throwPermissionItems = [];


      var dfd = new Blog(1);
      var blog, flag, permCollection;

      runs(function () {
        dfd.done(function (resp) {
          blog = resp;
          permCollection = cache.get('user', 'perms');
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(permCollection).toBeDefined();
        expect(permCollection.get(1).get('permissions')).toEqual([]);
      });
    });

    it("get blog fail", function () {
      window.Mock.alwaysFail = 'Get Blog Error';

      var dfd = new Blog(1);
      var blog, flag, permCollection;

      spyOn(dfd, 'fail').andCallThrough();

      runs(function () {
        dfd.done(function (resp) {
          blog = resp;
          permCollection = cache.get('user', 'perms');
          flag = true;
        });
        dfd.fail(function (resp) {
          blog = resp;
          permCollection = cache.get('user', 'perms');
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(dfd.fail).toHaveBeenCalled();
        expect(blog).toBeDefined();
        expect(blog.error).toBeDefined();
        expect(blog.error.message).toEqual(window.Mock.alwaysFail);

        expect(permCollection).toBeNull();
      });
    });
  });

  afterEach(function () {
    window.Mock.throwBlogItem = null;
    window.Mock.alwaysFail = null;
  });
});
