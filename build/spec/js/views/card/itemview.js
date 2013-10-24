describe("views", function () {
  'use strict';

  beforeEach(function () {
    requireModuleAndWait(['js/views/card/itemview', 'js/models/entry']);
  });

  describe("card/itemview", function () {
    var Controller, controller, ItemView, itemView;
    var cards = [{
      "name": "ItemView",
      "id": "itemview",
      "dashboard": {
        "view": "dashboard/dashboard"
      },
      "routes": [{
        "id": "view",
        "view": "view/layout"
      }, {
        "id": "post",
        "route": ":blog_id/:id/:unit",
        "view": "view/post",
        "header": "view/post_header"
      }]
    }];

    beforeEach(function () {

      var flag;

      Controller = require('js/router/controller');
      controller = new Controller({
        cards: cards
      });
      controller.auth(function (data) {
        ItemView = require('js/views/card/itemview');
        data = _.extend({}, data, {
          card: cards[0]
        });
        itemView = new ItemView(data);
        flag = true;
      });

      waitsFor(function () {
        return flag;
      }, 'controller authentication', 3000);
    });

    describe("permissionCheck", function () {
      var perms = ["administer_blog", "administer_website", "comment", "create_post", "edit_all_posts", "edit_assets", "edit_categories", "edit_config", "edit_notifications", "edit_tags", "edit_templates", "manage_feedback", "manage_member_blogs", "manage_pages", "manage_themes", "manage_users", "publish_post", "rebuild", "save_image_defaults", "send_notifications", "set_publish_paths", "upload", "view_blog_log"];

      it("permissionCheck", function () {
        var check = itemView.permissionCheck('administer_website', perms);
        expect(check).toBe(true);
      });

      it("permissionCheck (not found)", function () {
        var check = itemView.permissionCheck('foobar', perms);
        expect(check).toBe(false);
      });

      it("permissionCheck (no perms)", function () {
        var check = itemView.permissionCheck('comment');
        expect(check).toBe(false);
      });

      it("userHasPermission", function () {
        var check = itemView.userHasPermission('comment');
        expect(check).toBe(true);
      });

      it("userHasSystemPermission", function () {
        var check = itemView.userHasSystemPermission('administer');
        expect(check).toBe(true);
      });

      it("userIsSystemAdmin", function () {
        var check = itemView.userIsSystemAdmin();
        expect(check).toBe(true);
      });

      it("show Dashboard block with permission", function () {
        var $el = $('<section id="card-' + itemView.card.id + '" class="card"></section>').appendTo($('#app'));
        $el.hide();

        var flag;
        var done = jasmine.createSpy('done');

        itemView.dashboardShowWithPermission(true).done(function () {
          done();
        }).always(function () {
          flag = true;
        });

        waitsFor(function () {
          return flag;
        }, 'Deferred resolved', 3000);

        runs(function () {
          expect($el.attr('style')).toMatch(/display: block/);
          expect(done).toHaveBeenCalled();
          $el.remove();
        });
      });

      it("hide Dashboard block with no permission", function () {
        var $el = $('<section id="card-' + itemView.card.id + '" class="card"></section>').appendTo($('#app'));
        $el.hide();
        $el.show();

        var flag;
        var fail = jasmine.createSpy('fail');

        itemView.dashboardShowWithPermission(false).fail(function () {
          fail();
        }).always(function () {
          flag = true;
        });

        waitsFor(function () {
          return flag;
        }, 'Deferred resolved', 3000);

        runs(function () {
          expect($el.attr('style')).toMatch(/display: none/);
          expect(fail).toHaveBeenCalled();
          $el.remove();
        });
      });
    });

    it("setTranslation with no callback", function () {
      var flag, actualPath;

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      command.execute = function (co, data) {
        if (co === 'l10n') {
          controller.l10n.waitLoadCommon(data);
        } else {
          commandsOrig.execute.call(commandsOrig, co, data);
        }
      };

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      reRequireModule('js/views/card/itemview');

      var flag0;
      runs(function () {
        ItemView = require('js/views/card/itemview');
        controller.auth(function (data) {
          ItemView = require('js/views/card/itemview');
          data = _.extend({}, data, {
            card: cards[0]
          });
          itemView = new ItemView(data);
          flag0 = true;
        });
      });

      waitsFor(function () {
        return flag0;
      }, 'require itemview', 3000);

      runs(function () {
        var origFunc = controller.l10n.load;
        spyOn(controller.l10n, 'load').andCallFake(function (path, namespace) {
          actualPath = path;
          var fakePath = '/spec/cards/itemview';
          var dfd = origFunc.call(controller.l10n, fakePath, namespace);
          dfd.done(function () {
            flag = true;
          });
          return dfd;
        });

        spyOn(itemView, 'render');
        itemView.setTranslation();
      });

      waitsFor(function () {
        return flag;
      }, 'load l10n common', 3000);

      runs(function () {
        expect(itemView.trans).toBeDefined();
        var Trans = require('js/trans');
        expect(itemView.trans instanceof Trans).toBe(true);
        expect(itemView.render).toHaveBeenCalled();
        expect(actualPath).toEqual('cards/itemview/l10n');
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("setTranslation with callback", function () {
      var flag, actualPath;

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      command.execute = function (co, data) {
        if (co === 'l10n') {
          controller.l10n.waitLoadCommon(data);
        } else {
          commandsOrig.execute.call(commandsOrig, co, data);
        }
      };

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      reRequireModule('js/views/card/itemview');

      var flag0;
      runs(function () {
        ItemView = require('js/views/card/itemview');
        controller.auth(function (data) {
          ItemView = require('js/views/card/itemview');
          data = _.extend({}, data, {
            card: cards[0]
          });
          itemView = new ItemView(data);
          flag0 = true;
        });
      });

      waitsFor(function () {
        return flag0;
      }, 'require itemview', 3000);

      var callback;
      runs(function () {
        var origFunc = controller.l10n.load;
        spyOn(controller.l10n, 'load').andCallFake(function (path, namespace) {
          actualPath = path;
          var fakePath = '/spec/cards/itemview';
          var dfd = origFunc.call(controller.l10n, fakePath, namespace);
          dfd.done(function () {
            flag = true;
          });
          return dfd;
        });

        spyOn(itemView, 'render');
        callback = jasmine.createSpy('callback');
        itemView.setTranslation(callback);
      });

      waitsFor(function () {
        return flag;
      }, 'load l10n common', 3000);

      runs(function () {
        expect(itemView.trans).toBeDefined();
        var Trans = require('js/trans');
        expect(itemView.trans instanceof Trans).toBe(true);
        expect(itemView.render).not.toHaveBeenCalled();
        expect(callback).toHaveBeenCalled();
        expect(actualPath).toEqual('cards/itemview/l10n');
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("addTapClass", function () {
      var $el = $('<div id="addtapclass"></div>').appendTo($('#app'));
      var flag, hasClass;
      itemView.addTapClass($el, function () {
        hasClass = $el.hasClass('tapped');
        flag = true;
      });
      waitsFor(function () {
        return flag;
      }, 'add tapped class', 3000);
      runs(function () {
        expect(hasClass).toBe(true);
        setTimeout(function () {
          expect($el.hasClass('tapped')).toBe(false);
          $el.remove();
        }, 500);
      });
    });

    it("handleRefetch", function () {
      itemView.$el.appendTo($('#main'));
      var $el = $('<div class="refetch"></div>').appendTo(itemView.$el);
      itemView.fetchError = true;
      spyOn(itemView.$el, 'hammer').andCallThrough();

      var origFunc = itemView.addTapClass;
      var flag;

      spyOn(itemView, 'addTapClass').andCallFake(function () {
        origFunc.apply(itemView, arguments);
        setTimeout(function () {
          flag = true;
        }, 400);
      });

      itemView.handleRefetch();
      expect(itemView.$el.hammer).toHaveBeenCalled();
      $el.trigger('tap');

      waitsFor(function () {
        return flag;
      }, 'tap action ended', 3000);

      spyOn(itemView, 'render');
      spyOn(itemView, 'fetch');

      runs(function () {
        expect(itemView.loading).toBe(true);
        expect(itemView.fetchError).toBe(false);
        expect(itemView.render).toHaveBeenCalled();
        expect(itemView.fetch).toHaveBeenCalled();
      })
    });

    it("handleRefetch: go through nothing when no fetchError", function () {
      itemView.fetchError = null;
      spyOn(itemView.$el, 'hammer');
      itemView.handleRefetch();
      expect(itemView.$el.hammer).not.toHaveBeenCalled();
    });

    it("fetch with no options", function () {
      var Model = require('js/models/entry');
      var model = new Model({
        id: 123
      });
      var flag;

      var origFunc = model.sync;
      spyOn(model, 'sync').andCallFake(function () {
        origFunc.apply(model, arguments);
        flag = true;
      });
      spyOn(itemView, 'render');
      itemView.model = model;
      itemView.template = function () {
        return ''
      };
      itemView.fetch();

      waitsFor(function () {
        return flag;
      }, 'fetching model', 3000);


      runs(function () {
        expect(itemView.loading).toBe(false);
        expect(itemView.fetchError).toBe(false);
        expect(itemView.render).toHaveBeenCalled();
      });
    });

    it("fetch error with no error options", function () {
      window.Mock.alwaysFail = 'Fetching error';

      var Model = require('js/models/entry');
      var model = new Model({
        id: 123
      });
      var flag;

      var origFunc = model.sync;
      spyOn(model, 'sync').andCallFake(function () {
        origFunc.apply(model, arguments);
        flag = true;
      });
      spyOn(itemView, 'render');

      itemView.model = model;
      itemView.template = function () {
        return ''
      };
      itemView.fetch();

      waitsFor(function () {
        return flag;
      }, 'fetching model', 3000);


      runs(function () {
        expect(itemView.loading).toBe(false);
        expect(itemView.fetchError).toBe(true);
        expect(itemView.render).toHaveBeenCalled();
      });
    });

    it("fetch error with error options", function () {
      window.Mock.alwaysFail = 'Fetching error';

      var Model = require('js/models/entry');
      var model = new Model({
        id: 123
      });
      var flag;

      var origFunc = model.sync;
      spyOn(model, 'sync').andCallFake(function () {
        origFunc.apply(model, arguments);
        flag = true;
      });
      spyOn(itemView, 'render');

      var callback = {
        callback: function () {}
      };
      spyOn(callback, 'callback');

      itemView.model = model;
      itemView.template = function () {
        return ''
      };
      itemView.fetch({
        errorCallback: callback.callback
      });

      waitsFor(function () {
        return flag;
      }, 'fetching model', 3000);


      runs(function () {
        expect(itemView.loading).toBe(false);
        expect(itemView.fetchError).toBe(true);
        expect(itemView.render).toHaveBeenCalled();
        expect(callback.callback).toHaveBeenCalled();

        var data = itemView.serializeDataInitialize();
        expect(data.fetchError).toBe(true);
        expect(data.loading).toBe(false);
      });
    });

    it("serializeDataInitialize with no l10n", function () {
      var data = itemView.serializeDataInitialize();
      expect(data.name).toEqual('ItemView');
      expect(data.fetchError).toEqual(itemView.fetchError);
      expect(data.loading).toEqual(itemView.loading);
      expect(data.loadingReadmore).toEqual(itemView.loadingReadmore);
      expect(data.trans).toEqual(itemView.trans);
    });

    it("serializeDataInitialize with l10n", function () {
      var flag;
      itemView.setTranslation(function () {
        flag = true;
      });
      waitsFor(function () {
        return flag;
      }, 'set translation', 3000);
      runs(function () {
        expect(itemView.l10n).toBeDefined();
        var data = itemView.serializeDataInitialize();
        expect(data.name).toEqual('ItemView');
        expect(data.lang).toEqual('ja');
        expect(data.fetchError).toEqual(itemView.fetchError);
        expect(data.loading).toEqual(itemView.loading);
        expect(data.loadingReadmore).toEqual(itemView.loadingReadmore);
        expect(data.trans).toEqual(itemView.trans);
      });
    });

    it("serializeDataInitialize: when user language is en-us, set data.lang blank", function () {
      var flag;
      itemView.setTranslation(function () {
        flag = true;
      });
      waitsFor(function () {
        return flag;
      }, 'set translation', 3000);
      runs(function () {
        itemView.l10n.userLang = 'en-us';
        var data = itemView.serializeDataInitialize();
        expect(data.lang).toEqual('');
      });
    });
  });

  afterEach(function () {
  Backbone.history.navigate('');
})
});
