describe("upload", function () {
  'use strict';

  var Dashboard, dashboard;
  var Controller, controller, initData;
  var commandSpies, spy;
  var card = {
    "name": "Media Upload",
    "id": "upload",
    "dashboard": {
      "view": "dashboard/dashboard"
    }
  };

  var mtapi;

  beforeEach(function () {
    commandSpies = jasmine.createSpyObj('commandSpies', ['router:navigate']);
    spy = jasmine.createSpyObj('spy', ['init', 'fetch', 'render', 'onRender', 'dashboardShowWithPermission']);

    runs(function () {
      initCommands(commandSpies, controller);
    })

    runs(function () {
      reRequireModule(['js/views/card/itemview', 'cards/upload/dashboard/dashboard']);
    });

    runs(function () {
      insertSpy('cards/upload/dashboard/dashboard', spy);

      runs(function () {
        reRequireModule(['js/router/controller']);
      });
    });

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = _.extend({}, data, {
          card: card
        });
      });
    });

    waitsFor(function () {
      return !!initData;
    }, 'initialize dashboard', 3000);

    runs(function () {
      var cache = require('js/cache');
      cache.clear(initData.blogId);
    });
  });

  describe("dashboard", function () {
    it("initialize, fetch, render", function () {
      Dashboard = require('cards/upload/dashboard/dashboard');
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.render.callCount === 1;
      }, 'render', 3000);

      runs(function () {
        expect(dashboard.$el.find('#upload-file').length).toBeTruthy();
      });
    });

    it("check file upload support: iOS5 is not supported", function () {
      $('#app').empty();

      var $el = $('<section id="card-' + card.id + '" class="card"></section>').appendTo($('#app'));
      $el.hide();
      $el.show();

      undefRequireModule('js/device');
      define('js/device', [], function () {
        return {
          isIOS: true,
          version: 5.0
        };
      });
      reRequireModule('cards/upload/dashboard/dashboard');
      runs(function () {
        insertSpy('cards/upload/dashboard/dashboard', spy);
      });

      runs(function () {
        Dashboard = require('cards/upload/dashboard/dashboard');
        dashboard = new Dashboard(initData);
      })

      waitsFor(function () {
        return spy.dashboardShowWithPermission.callCount === 1;
      }, 'dashboard permission check', 3000);

      runs(function () {
        expect(dashboard.checkSupport()).toBe(false);
        expect($el.attr('style')).toMatch(/display: none/);
      })
    });

    it("check file upload support (2): Windows Phone is not supported", function () {
      $('#app').empty();
      var $el = $('<section id="card-' + card.id + '" class="card"></section>').appendTo($('#app'));
      $el.hide();
      $el.show();

      undefRequireModule('js/device');
      define('js/device', [], function () {
        return {
          isWindowsPhone: true
        };
      });

      reRequireModule('cards/upload/dashboard/dashboard');
      runs(function () {
        insertSpy('cards/upload/dashboard/dashboard', spy);
      });

      runs(function () {
        Dashboard = require('cards/upload/dashboard/dashboard');
        dashboard = new Dashboard(initData);
      });

      waitsFor(function () {
        return spy.dashboardShowWithPermission.callCount === 1;
      }, 'dashboard permission check', 3000);

      runs(function () {
        expect(dashboard.checkSupport()).toBe(false);
        expect($el.attr('style')).toMatch(/display: none/);
      });
    });

    it("check FileAPI support", function () {
      var origFunc = window.FileReader;
      window.FileReader = undefined;

      Dashboard = require('cards/upload/dashboard/dashboard');
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.dashboardShowWithPermission.callCount === 1;
      }, 'dashboard permission check', 3000);

      runs(function () {
        expect(dashboard.checkFileAPISupport()).toBe(false);
        expect(dashboard.supportedFileAPI).toBe(false);
        window.FileReader = origFunc;
      });
    });

    it("check FileAPI support (2): windows phone", function () {
      undefRequireModule('js/device');
      define('js/device', [], function () {
        return {
          isWindowsPhone: true
        };
      });
      reRequireModule('cards/upload/dashboard/dashboard');
      runs(function () {
        insertSpy('cards/upload/dashboard/dashboard', spy);
      });

      runs(function () {
        Dashboard = require('cards/upload/dashboard/dashboard');
        dashboard = new Dashboard(initData);
      })

      waitsFor(function () {
        return spy.dashboardShowWithPermission.callCount === 1;
      }, 'dashboard permission check', 3000);

      runs(function () {
        expect(dashboard.checkFileAPISupport()).toBe(false);
        expect(dashboard.supportedFileAPI).toBe(false);
      });
    });

    it("check NeedLabel", function () {
      undefRequireModule('js/device');
      define('js/device', [], function () {
        return {
          isIE: true,
          browserVersion: 8.0
        };
      });
      reRequireModule('cards/upload/dashboard/dashboard');
      runs(function () {
        insertSpy('cards/upload/dashboard/dashboard', spy);
      });

      runs(function () {
        Dashboard = require('cards/upload/dashboard/dashboard');
        dashboard = new Dashboard(initData);
      })

      waitsFor(function () {
        return spy.dashboardShowWithPermission.callCount === 1;
      }, 'dashboard permission check', 3000);

      runs(function () {
        expect(dashboard.checkNeedLabel()).toBe(true);
        expect(dashboard.isLabelNeeded).toBe(true);
      });
    });

    it("system administrator is allowed to upload file", function () {
      $('#app').empty();
      var $el = $('<section id="card-' + card.id + '" class="card"></section>').appendTo($('#app'));
      $el.hide();

      window.Mock.throwPermissionItems = [{
        "permissions": ["administer"],
        "blog": null
      }];
      var cache = require('js/cache');
      cache.clear('user');

      initController(Controller, controller, function (data) {
        data = _.extend({}, data, {
          card: card
        });
        Dashboard = require('cards/upload/dashboard/dashboard');
        dashboard = new Dashboard(data);
      });

      waitsFor(function () {
        return spy.dashboardShowWithPermission.callCount === 1;
      }, 'dashboard permission check', 3000);

      runs(function () {
        expect(dashboard.userIsSystemAdmin()).toBe(true);
        expect(dashboard.perm).toBe(true);
        expect($el.attr('style')).toMatch(/display: block/);
      });
    });

    it("non system administrator but has upload permission is allowed to upload file", function () {
      $('#app').empty();
      var $el = $('<section id="card-' + card.id + '" class="card"></section>').appendTo($('#app'));
      $el.hide();

      window.Mock.throwPermissionItems = [{
        "permissions": ["upload"],
        "blog": {
          "id": initData.blogId
        }
      }];
      var cache = require('js/cache');
      cache.clear('user');

      initController(Controller, controller, function (data) {
        data = _.extend({}, data, {
          card: card
        });
        Dashboard = require('cards/upload/dashboard/dashboard');
        dashboard = new Dashboard(data);
      });

      waitsFor(function () {
        return spy.dashboardShowWithPermission.callCount === 1;
      }, 'dashboard permission check', 3000);

      runs(function () {
        expect(dashboard.userIsSystemAdmin()).toBe(false);
        expect(dashboard.perm).toBe(true);
        expect($el.attr('style')).toMatch(/display: block/);
      });
    });

    it("user is not system administrator and not have upload permission is not allowed to upload file", function () {
      $('#app').empty();
      var $el = $('<section id="card-' + card.id + '" class="card"></section>').appendTo($('#app'));
      $el.hide();
      $el.show();

      window.Mock.throwPermissionItems = [{
        "permissions": ["comment", "create_post", "edit_all_posts", "edit_assets"],
        "blog": {
          "id": initData.blogId
        }
      }];
      var cache = require('js/cache');
      cache.clear('user');

      initController(Controller, controller, function (data) {
        data = _.extend({}, data, {
          card: card
        });
        Dashboard = require('cards/upload/dashboard/dashboard');
        dashboard = new Dashboard(data);
      });

      waitsFor(function () {
        return spy.dashboardShowWithPermission.callCount === 1;
      }, 'dashboard permission check', 3000);

      runs(function () {
        expect(dashboard.userIsSystemAdmin()).toBe(false);
        expect(dashboard.perm).toBe(false);
        expect($el.attr('style')).toMatch(/display: none/);
      });
    });

    it("file upload", function () {
      Dashboard = require('cards/upload/dashboard/dashboard');
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.render.callCount === 1;
      }, 'render', 3000);

      var $target, count;
      runs(function () {
        count = spy.render.callCount;
        spyOn(dashboard.ui.uploadForm, 'val').andReturn('foobar');
        dashboard.upload(['fileObj']);
      });

      waitsFor(function () {
        return spy.render.callCount > count;
      }, 'render after uploading', 3000);

      runs(function () {
        expect(dashboard.uploading).toBe(false);
        expect(dashboard.uploadCompleted).toBe(true);
      });
    });

    it("failed to upload", function () {
      window.Mock.failUploadAsset = 'failed to upload by some reason';

      Dashboard = require('cards/upload/dashboard/dashboard');
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.render.callCount === 1;
      }, 'render', 3000);

      var $target, count;
      runs(function () {
        count = spy.render.callCount;
        spyOn(dashboard.ui.uploadForm, 'val').andReturn('foobar');
        dashboard.upload(['fileObj']);
      });

      waitsFor(function () {
        return spy.render.callCount > count;
      }, 'render after uploading', 3000);

      runs(function () {
        expect(dashboard.uploadError).not.toEqual([]);
        expect(dashboard.uploadError[0].message).toEqual(window.Mock.failUploadAsset);
        expect(dashboard.errorImages).not.toEqual([]);
        expect(dashboard.errorImages[0]).toEqual('fileObj');
        expect(dashboard.uploading).toBe(false);
      });
    });

    it("handle tap", function () {
      Dashboard = require('cards/upload/dashboard/dashboard');
      dashboard = new Dashboard(initData);

      waitsFor(function () {
        return spy.render.callCount === 1;
      }, 'render', 3000);

      var $target, flag;
      runs(function () {
        spyOn(dashboard.ui.uploadForm, 'click');
        $target = dashboard.$el.find('#upload-file');
        var event = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(event);
        setTimeout(function () {
          flag = true;
        }, 500);
      });

      waitsFor(function () {
        return flag;
      }, 'callback from tap event', 3000);

      runs(function () {
        expect(dashboard.ui.uploadForm.click).toHaveBeenCalled();
      });
    });

    it("handle upload form change evnet", function () {
      Dashboard = require('cards/upload/dashboard/dashboard');
      dashboard = new Dashboard(initData);
      spyOn(dashboard, 'upload');

      waitsFor(function () {
        return spy.render.callCount === 1;
      }, 'render', 3000);

      runs(function () {
        var event = $.Event('click', {
          target: {
            files: ['fileObj']
          }
        });
        dashboard.handleUploadFormChange(event);
        expect(dashboard.upload).toHaveBeenCalled();
      });
    });

    it("handle upload form change evnet (without fileAPISupport)", function () {
      Dashboard = require('cards/upload/dashboard/dashboard');
      dashboard = new Dashboard(initData);
      spyOn(dashboard, 'upload');

      waitsFor(function () {
        return spy.render.callCount === 1;
      }, 'render', 3000);

      runs(function () {
        dashboard.$el.appendTo('#app');

        dashboard.supportedFileAPI = false;
        var event = $.Event('click', {
          target: {
            files: ['fileObj']
          }
        });
        dashboard.handleUploadFormChange(event);
        expect(dashboard.upload).toHaveBeenCalled();
        var arg = dashboard.upload.mostRecentCall.args[0];
        expect(arg[0]).toEqual(dashboard.$el.find('#upload-file-input').get(0));
      });
    });
  });

  afterEach(function () {
    resetMock();
    var cache = require('js/cache');
    cache.clear('user');
    reRequireModule(['js/device', 'js/commands', 'js/router/controller']);
  });
});
