describe("mtapi", function () {
  'use strict';

  beforeEach(function () {
    var flag;
    require(['js/mtapi/signout'], function () {
      flag = true;
    });
    waitsFor(function () {
      return flag;
    }, 'requiring signout module', 3000);
  });

  describe("signout", function () {
    beforeEach(function () {
      window.Mock.alwaysFail = null;
    })

    it("signout", function () {
      var Logout = require('js/mtapi/signout');
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

    it("signout fail", function () {
      var Logout = require('js/mtapi/signout');
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
      }, 'signout failed', 3000);

      runs(function () {
        expect(dfd.fail).toHaveBeenCalled();
      });
    });
  });

  afterEach(function () {
    Backbone.history.navigate('');
    window.Mock.alwaysFail = null;
  });
});
