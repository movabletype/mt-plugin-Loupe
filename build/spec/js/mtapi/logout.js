describe("mtapi", function () {
  'use strict';

  beforeEach(function () {
    var flag;
    require(['js/mtapi/logout'], function () {
      flag = true;
    });
    waitsFor(function () {
      return flag;
    }, 'requiring logout module', 3000);
  });

  describe("logout", function () {
    beforeEach(function () {
      window.Mock.alwaysFail = null;
    })

    it("logout", function () {
      var Logout = require('js/mtapi/logout');
      var dfd = new Logout();
      var flag;

      spyOn(dfd, 'done').andCallThrough();

      runs(function () {
        dfd.done(function () {
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      }, 'revoke authenticate', 3000);

      runs(function () {
        expect(dfd.done).toHaveBeenCalled();
      });
    });

    it("logout fail", function () {
      var Logout = require('js/mtapi/logout');
      window.Mock.alwaysFail = 'Get Logout Error';

      var dfd = new Logout();
      var flag;

      spyOn(dfd, 'fail').andCallThrough();

      runs(function () {
        dfd.done(function () {
          flag = true;
        });
        dfd.fail(function () {
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      }, 'logout failed', 3000);

      runs(function () {
        expect(dfd.fail).toHaveBeenCalled();
      });
    });
  });

  afterEach(function () {
    window.Mock.alwaysFail = null;
  });
});
