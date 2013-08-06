describe("mtapi", function () {
  'use strict';

  describe("blog", function () {
    var Blog = require('js/mtapi/blog');

    it("get blog", function () {
      window.Mock.throwBlogItem = {
        "name": "Blog 1",
        "url": "http://memolog.org/blog1",
        "class": "blog",
      };


      var dfd = new Blog(1);
      var blog, flag;

      runs(function () {
        dfd.done(function (resp) {
          blog = resp;
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
      });
    });

    it("get blog fail", function () {
      window.Mock.alwaysFail = 'Get Blog Error';

      var dfd = new Blog(1);
      var blog, flag;

      spyOn(dfd, 'fail').andCallThrough();

      runs(function () {
        dfd.done(function (resp) {
          blog = resp;
          flag = true;
        });
        dfd.fail(function (resp) {
          blog = resp;
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
      });
    });
  });

  afterEach(function () {
    window.Mock.throwBlogItem = null;
    window.Mock.alwaysFail = null;
  });
});
