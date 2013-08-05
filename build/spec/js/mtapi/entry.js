describe("mtapi", function () {
  'use strict';

  beforeEach(function () {
    var flag;
    require(['js/mtapi/entry'], function () {
      flag = true;
    });
    waitsFor(function () {
      return flag;
    });
  });

  describe("entry", function () {

    it("get entry", function () {
      var Entry = require('js/mtapi/entry');
      window.Mock.throwEntryItem = {
        "status": "Publish",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title",
        "body": "body",
        "blog": {}
      };

      var dfd = new Entry(1, 123);
      var entry, flag;

      runs(function () {
        dfd.done(function (resp) {
          entry = resp;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(entry).toBeDefined();
        expect(entry.id).toEqual(123);
        expect(entry.blog.id).toEqual(1);
        expect(entry.status).toEqual(window.Mock.throwEntryItem.status);
        expect(entry.date).toEqual(window.Mock.throwEntryItem.date);
        expect(entry.author).toEqual(window.Mock.throwEntryItem.author);
        expect(entry.class).toEqual('entry');
        expect(entry.title).toEqual('title');
        expect(entry.body).toEqual('body');
      });
    });

    it("get entry fail", function () {
      var Entry = require('js/mtapi/entry');
      window.Mock.alwaysFail = 'Get Entry Error';

      var dfd = new Entry(123);
      var entry, flag;

      spyOn(dfd, 'fail').andCallThrough();

      runs(function () {
        dfd.done(function (resp) {
          entry = resp;
          flag = true;
        });
        dfd.fail(function (resp) {
          entry = resp;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(dfd.fail).toHaveBeenCalled();
        expect(entry).toBeDefined();
        expect(entry.error).toBeDefined();
        expect(entry.error.message).toEqual(window.Mock.alwaysFail);
      });
    });
  });

  afterEach(function () {
    window.Mock.throwEntryItem = null;
    window.Mock.alwaysFail = null;
  });
});
