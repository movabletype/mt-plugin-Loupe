describe("mtapi", function () {
  'use strict';

  var mtapi = require('js/mtapi');

  beforeEach(function () {
    var flag;
    require(['js/mtapi/stats_provider'], function () {
      flag = true;
    });
    waitsFor(function () {
      return flag;
    }, 'timeout for requiring stats provider', 3000);
  })

  describe("statsProvider", function () {
    beforeEach(function () {
      require('js/cache').clear(1, 'statsProvider');
      window.Mock.throwStatsProviderItem = null;
      window.Mock.alwaysFail = null;
    });

    it("get statsProvider", function () {
      window.Mock.throwStatsProviderItem = {
        id: "My Stats Provider"
      };

      var getStatsProvider = require('js/mtapi/stats_provider');
      spyOn(mtapi.api, 'getStatsProvider').andCallThrough();

      var statsProvider;
      var dfd = new getStatsProvider(1);
      var flag;

      spyOn(dfd, 'done').andCallThrough();

      runs(function () {
        dfd.done(function (resp) {
          statsProvider = resp;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      }, 'timeout for getStatsProvider', 3000);

      runs(function () {
        expect(dfd.done).toHaveBeenCalled();
        expect(mtapi.api.getStatsProvider).toHaveBeenCalled();
        expect(statsProvider.id).toEqual(window.Mock.throwStatsProviderItem.id);
      });
    });

    it("get statsProvider, but has no id in response, so error ocurred", function () {
      window.Mock.throwStatsProviderItem = {};

      var getStatsProvider = require('js/mtapi/stats_provider');

      var statsProvider;
      var dfd = new getStatsProvider(1);
      var flag;

      spyOn(dfd, 'fail').andCallThrough();

      runs(function () {
        dfd.done(function (resp) {
          statsProvider = resp;
          flag = true;
        });
        dfd.fail(function (resp) {
          statsProvider = resp;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      }, 'timeout for getStatsProvider', 3000);

      runs(function () {
        expect(dfd.fail).toHaveBeenCalled();
      });
    });


    it("return cached value when it has been already cached", function () {
      window.Mock.throwStatsProviderItem = {
        "id": "My Stats Provider"
      };

      var getStatsProvider = require('js/mtapi/stats_provider');
      var cache = require('js/cache');

      var statsProvider, statsProvider2;
      var dfd = new getStatsProvider(1);
      var dfd2
      var flag, flag2;

      runs(function () {
        dfd.done(function (resp) {
          statsProvider = resp;
          flag = true;
        });
        dfd.fail(function (resp) {
          statsProvider = resp;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      }, 'timeout for getStatsProvider', 3000);

      runs(function () {
        expect(statsProvider.id).toEqual(window.Mock.throwStatsProviderItem.id);
        spyOn(mtapi.api, 'getStatsProvider').andCallThrough();

        require(['js/mtapi/stats_provider'], function (lib) {
          getStatsProvider = lib;
          dfd2 = new getStatsProvider(1);
          dfd2.done(function (resp) {
            statsProvider2 = resp;
            flag2 = true;
          });
        });
      });

      waitsFor(function () {
        return flag2;
      }, 'timeout for getStatsProvider2', 3000);

      runs(function () {
        expect(mtapi.api.getStatsProvider).not.toHaveBeenCalled();
        expect(statsProvider.id).toEqual(window.Mock.throwStatsProviderItem.id);
      });
    });

    it("request failed", function () {
      var getStatsProvider = require('js/mtapi/stats_provider');
      window.Mock.alwaysFail = 'Got Error';

      var dfd = new getStatsProvider(1);
      spyOn(dfd, 'fail').andCallThrough();

      var flag;
      var statsProvider;

      runs(function () {
        dfd.done(function (resp) {
          statsProvider = resp;
          flag = true;
        });
        dfd.fail(function (resp) {
          statsProvider = resp;
          flag = true;
        })
      });

      waitsFor(function () {
        return flag;
      }, 'timeout for getStatsProvider', 3000);

      runs(function () {
        expect(dfd.fail).toHaveBeenCalled();
        expect(statsProvider.error).toBeDefined();
        expect(statsProvider.error.message).toEqual(window.Mock.alwaysFail);
      });
    });
  });

  afterEach(function () {
    window.Mock.throwStatsProviderItem = null;
  })
});
