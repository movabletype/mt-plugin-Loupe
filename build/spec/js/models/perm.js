describe("models", function () {
  'use strict';

  beforeEach(function () {
    requireModuleAndWait('js/models/perm');
  });

  describe("perm", function () {
    beforeEach(function () {
      resetMock();
    });

    it("new perm model", function () {
      var flag;
      var item = window.Mock.throwPermissionItems = {
        "permissions": ["administer_blog", "administer_website", "comment", "create_post", "edit_all_posts", "edit_assets", "edit_categories", "edit_config", "edit_notifications", "edit_tags", "edit_templates", "manage_feedback", "manage_member_blogs", "manage_pages", "manage_themes", "manage_users", "publish_post", "rebuild", "save_image_defaults", "send_notifications", "set_publish_paths", "upload", "view_blog_log"],
        "blog": {
          "id": "1"
        }
      };
      var Perm = require('js/models/perm');
      var perm = new Perm({
        id: 1
      });
      perm.fetch({
        success: function () {
          flag = true;
        }
      });

      waitsFor(function () {
        return flag;
      }, 'get perm model', 3000);

      runs(function () {
        expect(perm).toBeDefined();
        var model = perm.toJSON().items;
        expect(model.blog.id).toEqual('1');
        _.forEach(item.permissions, function (value, key) {
          expect(model.permissions[key]).toEqual(value);
        });
      });
    });

    it("when fetching failed, return fail", function () {
      window.Mock.alwaysFail = 'Fetching failed';
      var flag;
      var item = window.Mock.throwPermissionItems = {
        "permissions": ["administer_blog", "administer_website", "comment", "create_post", "edit_all_posts", "edit_assets", "edit_categories", "edit_config", "edit_notifications", "edit_tags", "edit_templates", "manage_feedback", "manage_member_blogs", "manage_pages", "manage_themes", "manage_users", "publish_post", "rebuild", "save_image_defaults", "send_notifications", "set_publish_paths", "upload", "view_blog_log"],
        "blog": {
          "id": "1"
        }
      };
      var Perm = require('js/models/perm');
      var perm = new Perm({
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
      perm.fetch(options);

      waitsFor(function () {
        return flag;
      }, 'get perm model (expected to fail)', 3000);

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
