describe("mtapi", function () {
  'use strict';

  beforeEach(function () {
    var flag;
    require(['js/mtapi/user'], function () {
      flag = true;
    });
    waitsFor(function () {
      return flag;
    });
  });

  describe("user", function () {
    beforeEach(function () {
      window.Mock.alwaysFail = null;
      window.Mock.returnFailRequest = null;
      window.Mock.failPermission = null;

      window.Mock.throwUserItem = {
        displayName: "Yutaka Yamaguchi",
        email: "yyamaguchi@sixapart.com",
        id: "1",
        language: "ja",
        name: "yyamaguchi",
        updatable: true,
        url: "",
        userpicUrl: ""
      };

      window.Mock.throwPermissionItems = [{
        "permissions": ["administer", "create_blog", "create_website", "edit_templates", "manage_plugins", "view_log"],
        "blog": null
      }, {
        "permissions": ["administer_blog", "administer_website", "comment", "create_post", "edit_all_posts", "edit_assets", "edit_categories", "edit_config", "edit_notifications", "edit_tags", "edit_templates", "manage_feedback", "manage_member_blogs", "manage_pages", "manage_themes", "manage_users", "publish_post", "rebuild", "save_image_defaults", "send_notifications", "set_publish_paths", "upload", "view_blog_log"],
        "blog": {
          "id": "1"
        }
      }];
    });

    it("get user", function () {
      var getUser = require('js/mtapi/user');
      var dfd = getUser();
      var user, flag;
      runs(function () {
        dfd.done(function (resp) {
          user = resp;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      }, 'get user with js/mtapi/user', 3000);

      runs(function () {
        expect(user).toBeDefined();
        expect(user.id).toEqual(window.Mock.throwUserItem.id);
        expect(user.language).toEqual(window.Mock.throwUserItem.language);
        expect(user.displayName).toEqual(window.Mock.throwUserItem.displayName);
        expect(user.permissions).toBeDefined();
        var expectedSystemPerm = window.Mock.throwPermissionItems[0].permissions;
        expect(user.permissions.length).toEqual(expectedSystemPerm.length);
        _.forEach(user.permissions, function (perm) {
          var find = _.find(expectedSystemPerm, function (expectPerm) {
            return perm === expectPerm;
          });
          expect(find).not.toBeNull();
        });
      });
    });

    it("when user request failed, return failed", function () {
      window.Mock.returnFailRequest = 'get User request failed';

      var mtapi = require('js/mtapi');
      spyOn(mtapi.api, 'listPermissionsForUser').andCallThrough();

      var getUser = require('js/mtapi/user');
      var dfd = getUser();
      spyOn(dfd, 'fail').andCallThrough();

      var user, flag;
      runs(function () {
        dfd.done(function (resp) {
          user = resp;
          flag = true;
        });
        dfd.fail(function (resp) {
          user = resp;
          flag = true;
        })
      });

      waitsFor(function () {
        return flag;
      }, 'get user with js/mtapi/user', 3000);

      runs(function () {
        expect(dfd.fail).toHaveBeenCalled();
        expect(mtapi.api.listPermissionsForUser).not.toHaveBeenCalled();
        expect(user.error).toBeDefined();
        expect(user.error.message).toEqual(window.Mock.returnFailRequest);
        expect(user.id).not.toBeDefined();
        expect(user.permissions).not.toBeDefined();
      });
    });

    it("when user only has blog permissions, user.permissions should be null", function () {
      window.Mock.throwPermissionItems = [{
        "permissions": ["administer_blog", "administer_website", "comment", "create_post", "edit_all_posts", "edit_assets", "edit_categories", "edit_config", "edit_notifications", "edit_tags", "edit_templates", "manage_feedback", "manage_member_blogs", "manage_pages", "manage_themes", "manage_users", "publish_post", "rebuild", "save_image_defaults", "send_notifications", "set_publish_paths", "upload", "view_blog_log"],
        "blog": {
          "id": "1"
        }
      }];

      var getUser = require('js/mtapi/user');
      var dfd = getUser();
      var user, flag;
      runs(function () {
        dfd.done(function (resp) {
          user = resp;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      }, 'get user with js/mtapi/user', 3000);

      runs(function () {
        expect(user).toBeDefined();
        expect(user.id).toEqual(window.Mock.throwUserItem.id);
        expect(user.language).toEqual(window.Mock.throwUserItem.language);
        expect(user.displayName).toEqual(window.Mock.throwUserItem.displayName);
        expect(user.permissions).toBeNull();
      });
    });

    it("when permission request failed, get user request should be failed", function () {
      window.Mock.failPermission = 'Failed to get permissions';

      var getUser = require('js/mtapi/user');
      var dfd = getUser();
      spyOn(dfd, 'fail').andCallThrough();

      var user, flag;
      runs(function () {
        dfd.done(function (resp) {
          user = resp;
          flag = true;
        });
        dfd.fail(function (resp) {
          user = resp;
          flag = true;
        })
      });

      waitsFor(function () {
        return flag;
      }, 'get user with js/mtapi/user', 3000);

      runs(function () {
        expect(dfd.fail).toHaveBeenCalled();
        expect(user.error).toBeDefined();
        expect(user.error.message).toEqual(window.Mock.failPermission)
        expect(user.id).not.toBeDefined();
        expect(user.permissions).not.toBeDefined();
      });
    });
  });

  afterEach(function () {
    window.Mock.throwUserItem = null;
    window.Mock.throwPermissionItems = null;
    window.Mock.returnFailRequest = null;
    window.Mock.alwaysFail = null;
    window.Mock.failPermission = null;
  });
});
