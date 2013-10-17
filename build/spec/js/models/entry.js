describe("models", function () {
  'use strict';

  beforeEach(function () {
    requireModuleAndWait('js/models/entry');
  });

  describe("entry", function () {
    beforeEach(function () {
      resetMock();
    });

    it("new entry model", function () {
      var flag;
      var item = window.Mock.throwEntryItem = {
        "status": "Publish",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title",
        "body": "body",
        "blog": {}
      };
      var Entry = require('js/models/entry');
      var entry = new Entry({
        id: 123,
        blogId: 1
      });
      entry.fetch({
        success: function () {
          flag = true;
        }
      });

      waitsFor(function () {
        return flag;
      }, 'get entry model', 3000);

      runs(function () {
        expect(entry).toBeDefined();
        var model = entry.toJSON();
        expect(model.id).toEqual(123);
        _.forEach(item, function (value, key) {
          expect(model[key]).toEqual(value);
        });
      });
    });

    it("when fetching failed, return fail", function () {
      window.Mock.alwaysFail = 'Fetching failed';
      var flag;
      var Entry = require('js/models/entry');
      var entry = new Entry({
        id: 123,
        blogId: 1,
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
      entry.fetch(options);

      waitsFor(function () {
        return flag;
      }, 'get entry model (expected to fail)', 3000);

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
