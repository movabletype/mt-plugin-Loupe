describe("models", function () {
  'use strict';

  beforeEach(function () {
    requireModuleAndWait('js/models/blog');
  });

  describe("blog", function () {
    beforeEach(function () {
      resetMock();
    });

    it("new blog model", function () {
      var flag;
      var item = window.Mock.throwBlogItem = {
        class: "blog",
        name: "メモログ",
        url: "http://memolog.org/"
      };
      var Blog = require('js/models/blog');
      var blog = new Blog({
        id: 1
      });
      blog.fetch({
        success: function () {
          flag = true;
        }
      });

      waitsFor(function () {
        return flag;
      }, 'get blog model', 3000);

      runs(function () {
        expect(blog).toBeDefined();
        var model = blog.toJSON();
        expect(model.id).toEqual(1);
        _.forEach(item, function (value, key) {
          expect(model[key]).toEqual(value);
        });
      });
    });

    it("when fetching failed, return fail", function () {
      window.Mock.alwaysFail = 'Fetching failed';
      var flag;
      var Blog = require('js/models/blog');
      var blog = new Blog({
        id: 1
      });
      var error;
      var options = {
        success: function () {
          flag = true;
        },
        error: function (model, resp) {
          error = resp.error;
          flag = true;
        }
      };
      spyOn(options, 'error').andCallThrough();
      blog.fetch(options);

      waitsFor(function () {
        return flag;
      }, 'get blog model (expected to fail)', 3000);

      runs(function () {
        expect(options.error).toHaveBeenCalled();
        expect(error).toBeDefined();
        expect(error.message).toEqual(window.Mock.alwaysFail);
      })
    });
  });

  afterEach(function () {
    resetMock();
  });
});
