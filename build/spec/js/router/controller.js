describe("router", function () {
  'use strict';

  var cache = require('js/cache');

  var blogs = [{
    "name": "メモログ",
    "url": "http://memolog.org/",
    "id": "1",
    "class": "blog"
  }, {
    "name": "First Website",
    "url": "http://memolog.org/",
    "id": "2",
    "class": "website"
  }];

  var blog = blogs[0];

  var user = {
    displayName: "Yutaka Yamaguchi",
    email: "yyamaguchi@sixapart.com",
    id: "1",
    language: "ja",
    name: "yyamaguchi",
    updatable: true,
    url: "",
    userpicUrl: ""
  };

  var perms = [{
    "permissions": ["administer", "create_blog", "create_website", "edit_templates", "manage_plugins", "view_log"],
    "blog": null
  }, {
    "permissions": ["administer_blog", "administer_website", "comment", "create_post", "edit_all_posts", "edit_assets", "edit_categories", "edit_config", "edit_notifications", "edit_tags", "edit_templates", "manage_feedback", "manage_member_blogs", "manage_pages", "manage_themes", "manage_users", "publish_post", "rebuild", "save_image_defaults", "send_notifications", "set_publish_paths", "upload", "view_blog_log"],
    "blog": {
      "id": "1"
    }
  }];

  beforeEach(function () {
    requireModuleAndWait('js/router/controller');
  });

  describe("controller", function () {
    beforeEach(function () {
      resetMock();
      window.Mock.throwBlogListItems = blogs;
      window.Mock.throwUserItem = user;
      window.Mock.throwPermissionItems = perms;
      cache.clearAll();
      localStorage.removeItem('currentBlogId');
      sessionStorage.removeItem('routeCache');
      Backbone.history.navigate('');
    });

    it("authenticate success without currentBlogId", function () {
      var Controller = require('js/router/controller');
      var controller = new Controller();
      var co;
      var flag;

      controller.auth(function (options) {
        co = options;
        flag = true;
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(co).toBeDefined();
        expect(co.userId).toEqual(user.id);
        expect(co.blogId).toEqual(blog.id);
        expect(co.user).toBeDefined();
        expect(_.size(co.user)).toEqual(_.size(user) + 1); // include system permission value
        _.forEach(co.user, function (value, key) {
          if (key === 'permissions') {
            var permissions = perms[0].permissions;
            expect(value.length).toEqual(permissions.length);
            _.forEach(value, function (v, k) {
              expect(v).toEqual(permissions[k]);
            });
          } else {
            expect(value).toEqual(user[key]);
          }
        });
        expect(_.size(co.blog)).toEqual(_.size(blog));
        _.forEach(co.blog, function (value, key) {
          expect(value).toEqual(blog[key]);
        });
        expect(_.size(co.blogs)).toEqual(_.size(blogs));
        var sortedBlogs = _.sortBy(co.blogs, function (blog) {
          return blog.id;
        });
        var sortedExpectBlogs = _.sortBy(blogs, function (blog) {
          return blog.id;
        });
        _.forEach(sortedBlogs, function (blog, i) {
          var expectBlog = sortedExpectBlogs[i];
          expect(_.size(blog)).toEqual(_.size(expectBlog));
          _.forEach(blog, function (value, key) {
            expect(value).toEqual(expectBlog[key]);
          });
        });
      });
    });

    it("authenticate success with currentBlogId", function () {
      localStorage.setItem('currentBlogId', '3');
      window.Mock.throwBlogItem = blog;

      var Controller = require('js/router/controller');
      var controller = new Controller();
      var co;
      var flag;

      controller.auth(function (options) {
        co = options;
        flag = true;
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(co).toBeDefined();
        expect(co.userId).toEqual(user.id);
        expect(co.blogId).toEqual(3);
        expect(co.user).toBeDefined();
        expect(_.size(co.user)).toEqual(_.size(user) + 1); // include system permission value
        _.forEach(co.user, function (value, key) {
          if (key === 'permissions') {
            var permissions = perms[0].permissions;
            expect(value.length).toEqual(permissions.length);
            _.forEach(value, function (v, k) {
              expect(v).toEqual(permissions[k]);
            });
          } else {
            expect(value).toEqual(user[key]);
          }
        });
        expect(_.size(co.blog)).toEqual(_.size(blog));
        _.forEach(co.blog, function (value, key) {
          if (key === 'id') {
            expect(value).toEqual(3);
          } else {
            expect(value).toEqual(blog[key]);
          }
        });
        expect(co.blogs).not.toBeDefined();
      });
    });

    it("user data already cached, throw cached data and go through getting blog", function () {
      localStorage.setItem('currentBlogId', '3');

      var userData = _.clone(user);
      userData.permissions = perms[0].permissions;
      cache.set('user', 'user', userData);

      window.Mock.throwBlogItem = blog;

      var stub = {
        stub: function () {}
      };
      undefRequireModule('js/mtapi/user');
      define('js/mtapi/user', [], function () {
        return stub.stub;
      });
      spyOn(stub, 'stub');

      reRequireModule('js/router/controller');
      var Controller, controller, co, flag;

      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();
        controller.auth(function (options) {
          co = options;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(stub.stub).not.toHaveBeenCalled();
        expect(co).toBeDefined();
        expect(co.userId).toEqual(user.id);
        expect(co.blogId).toEqual(3);
        expect(co.user).toBeDefined();
        expect(_.size(co.user)).toEqual(_.size(userData)); // include system permission value
        _.forEach(co.user, function (value, key) {
          if (key === 'permissions') {
            var permissions = perms[0].permissions;
            expect(value.length).toEqual(permissions.length);
            _.forEach(value, function (v, k) {
              expect(v).toEqual(permissions[k]);
            });
          } else {
            expect(value).toEqual(userData[key]);
          }
        });
        expect(_.size(co.blog)).toEqual(_.size(blog));
        _.forEach(co.blog, function (value, key) {
          if (key === 'id') {
            expect(value).toEqual(3);
          } else {
            expect(value).toEqual(blog[key]);
          }
        });
        expect(co.blogs).not.toBeDefined();
        reRequireModule('js/mtapi/user');
      });

      runs(function () {
        reRequireModule('js/router/controller');
      });
    });

    it("authenticate failed when get user and call this authenticate method", function () {
      window.Mock.returnFailRequest = 'Authenticate Failed';

      var Controller = require('js/router/controller');
      var controller = new Controller();

      var origFunc = controller.authenticate;
      var flag;
      spyOn(controller, 'authenticate').andCallFake(function () {
        origFunc.apply(controller, arguments);
        flag = true;
      });
      controller.auth();

      waitsFor(function () {
        return flag;
      }, 'move signin screen', 3000);

      runs(function () {
        expect(controller.authenticate).toHaveBeenCalled();
        expect(cache.get('user', 'user')).toBeNull();
      });
    });

    it("authenticate failed when get blog", function () {
      localStorage.setItem('currentBlogId', '3');
      window.Mock.failBlogItem = 'Authenticate Failed';

      var flag;

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'move:dashboard') {
          callbackData = data;
          flag = true;
        }
      };

      var callbackData;

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      reRequireModule('js/router/controller');

      var Controller, controller, authCallback;
      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();

        authCallback = {
          callback: function () {}
        };
        spyOn(authCallback, 'callback');
        controller.auth(authCallback.callback);
      });

      waitsFor(function () {
        return flag;
      }, 'return error message on dashboard', 3000);

      runs(function () {
        expect(authCallback.callback).not.toHaveBeenCalled();
        expect(callbackData).toBeDefined();
        expect(callbackData.blog.error).toBeDefined();
        expect(callbackData.blog.error.message).toEqual(window.Mock.failBlogItem);
        expect(callbackData.blogs).not.toBeDefined();
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("authenticate failed when get blogs (without currentBlogId)", function () {
      window.Mock.throwBlogListItems = null;
      window.Mock.failBlogListItems = 'Authenticate Failed';

      var flag;

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'move:dashboard') {
          callbackData = data;
          flag = true;
        }
      };

      var callbackData;

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      reRequireModule('js/router/controller');

      var Controller, controller, authCallback;
      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();

        authCallback = {
          callback: function () {}
        };
        spyOn(authCallback, 'callback');
        controller.auth(authCallback.callback);
      });

      waitsFor(function () {
        return flag;
      }, 'return error message on dashboard', 3000);

      runs(function () {
        expect(authCallback.callback).not.toHaveBeenCalled();
        expect(callbackData).toBeDefined();
        expect(callbackData.blog.error).toBeDefined();
        expect(callbackData.blog.error.message).toEqual(window.Mock.failBlogListItems);
        expect(callbackData.blogs).not.toBeDefined();
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("when blog collection already cached, return cached data (without currentBlogId)", function () {
      var stub = {
        stub: function () {}
      };
      undefRequireModule('js/mtapi/blogs');
      define('js/mtapi/blogs', [], function () {
        return stub.stub;
      });
      spyOn(stub, 'stub');

      reRequireModule('js/router/controller');

      var flag0;
      var BlogCollection = require('js/collections/blogs');
      var blogCollection = new BlogCollection();

      runs(function () {
        blogCollection.fetch({
          userId: 1,
          success: function () {
            flag0 = true;
          }
        });
      });

      waitsFor(function () {
        return flag0;
      });

      var Controller, controller, co, flag;
      runs(function () {
        cache.set('user', 'blogs', blogCollection);
        Controller = require('js/router/controller');
        controller = new Controller();
        controller.auth(function (options) {
          co = options;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(stub.stub).not.toHaveBeenCalled();
        expect(co).toBeDefined();
        expect(co.userId).toEqual(user.id);
        expect(co.blogId).toEqual(blog.id);
        expect(co.user).toBeDefined();
        expect(_.size(co.user)).toEqual(_.size(user) + 1); // include system permission value
        _.forEach(co.user, function (value, key) {
          if (key === 'permissions') {
            var permissions = perms[0].permissions;
            expect(value.length).toEqual(permissions.length);
            _.forEach(value, function (v, k) {
              expect(v).toEqual(permissions[k]);
            });
          } else {
            expect(value).toEqual(user[key]);
          }
        });
        expect(_.size(co.blog)).toEqual(_.size(blog));
        _.forEach(co.blog, function (value, key) {
          expect(value).toEqual(blog[key]);
        });
        expect(_.size(co.blogs)).toEqual(_.size(blogs));
        var sortedBlogs = _.sortBy(co.blogs, function (blog) {
          return blog.id;
        });
        var sortedExpectBlogs = _.sortBy(blogs, function (blog) {
          return blog.id;
        });
        _.forEach(sortedBlogs, function (blog, i) {
          var expectBlog = sortedExpectBlogs[i];
          expect(_.size(blog)).toEqual(_.size(expectBlog));
          _.forEach(blog, function (value, key) {
            expect(value).toEqual(expectBlog[key]);
          });
        });
      });

      runs(function () {
        reRequireModule('js/mtapi/blogs');
      });

      runs(function () {
        reRequireModule('js/router/controller');
      });
    });

    it("when blog data in cached blog collection, return cached data (with currentBlogId)", function () {
      localStorage.setItem('currentBlogId', '3');

      var stub = {
        stub: function () {}
      };
      undefRequireModule('js/mtapi/blog');
      define('js/mtapi/blog', [], function () {
        return stub.stub;
      });
      spyOn(stub, 'stub');

      reRequireModule('js/router/controller');

      var flag0;
      var BlogCollection = require('js/collections/blogs');
      var blogCollection = new BlogCollection();

      runs(function () {
        blogCollection.fetch({
          userId: 1,
          success: function () {
            flag0 = true;
          }
        });
      });

      waitsFor(function () {
        return flag0;
      });

      var Controller, controller, co, flag;
      runs(function () {
        cache.set('user', 'blogs', blogCollection);
        Controller = require('js/router/controller');
        controller = new Controller();
        controller.auth(function (options) {
          co = options;
          flag = true;
        });
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(stub.stub).not.toHaveBeenCalled();
        expect(co).toBeDefined();
        expect(co.userId).toEqual(user.id);
        expect(co.blogId).toEqual(blog.id);
        expect(co.user).toBeDefined();
        expect(_.size(co.user)).toEqual(_.size(user) + 1); // include system permission value
        _.forEach(co.user, function (value, key) {
          if (key === 'permissions') {
            var permissions = perms[0].permissions;
            expect(value.length).toEqual(permissions.length);
            _.forEach(value, function (v, k) {
              expect(v).toEqual(permissions[k]);
            });
          } else {
            expect(value).toEqual(user[key]);
          }
        });
        expect(_.size(co.blog)).toEqual(_.size(blog));
        _.forEach(co.blog, function (value, key) {
          expect(value).toEqual(blog[key]);
        });
        expect(co.blogs).not.toBeDefined();
      });

      runs(function () {
        reRequireModule('js/mtapi/blog');
      });

      runs(function () {
        reRequireModule('js/router/controller');
      });
    });

    it("when user has no blog, return error message", function () {
      window.Mock.throwBlogListItems = [];

      var flag;

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'move:dashboard') {
          callbackData = data;
          flag = true;
        }
      };

      var callbackData;

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      reRequireModule('js/router/controller');
      var Controller, controller, authCallback;

      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();

        authCallback = {
          callback: function () {}
        };
        spyOn(authCallback, 'callback');
        controller.auth(authCallback.callback);
      });

      waitsFor(function () {
        return flag;
      }, 'return error message on dashboard', 3000);

      runs(function () {
        expect(authCallback.callback).not.toHaveBeenCalled();
        expect(callbackData).toBeDefined();
        expect(callbackData.blog.error).toBeDefined();
        expect(callbackData.blog.error.message).toEqual('You have no blog to show in Loupe');
        expect(callbackData.blogs).not.toBeDefined();
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("when user already has token, use it", function () {
      var mtapi = require('js/mtapi');
      var Controller, controller, flag;

      Controller = require('js/router/controller');
      controller = new Controller();

      spyOn(mtapi.api, 'getTokenData').andCallThrough();

      controller.token = {
        accessToken: "YUilse0FLzaHYDVbG4pTl9TtUmAUgkrFBNuordXV",
        expiresIn: 3600
      };

      controller.auth(function () {
        flag = true;
      });

      waitsFor(function () {
        return flag;
      });

      runs(function () {
        expect(mtapi.api.getTokenData).not.toHaveBeenCalled();
      });
    });

    it("when could not get token data with getTokenData, move authenticate screen", function () {
      window.Mock.getTokenDataIsNull = true;

      var Controller, controller, flag;

      Controller = require('js/router/controller');
      controller = new Controller();
      spyOn(controller, 'authenticate').andCallFake(function () {
        flag = true;
      });

      var authCallback = {
        callback: function () {
          flag = true;
        }
      };

      controller.auth(authCallback);
      spyOn(authCallback, 'callback');

      waitsFor(function () {
        return flag;
      }, 'move authenticate screen', 3000);

      runs(function () {
        expect(controller.authenticate).toHaveBeenCalled();
        expect(authCallback.callback).not.toHaveBeenCalled();
      });
    });

    it("save routeCache before move authenticate screen", function () {
      sessionStorage.removeItem('routeCache');

      var Controller, controller, flag;

      Backbone.history.navigate('stats');
      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      var route;
      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'router:navigate') {
          route = data;
          flag = true;
        }
      };

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      reRequireModule('js/router/controller');

      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();
        controller.authenticate();
      });

      waitsFor(function () {
        return flag;
      }, 'router:navigate command executed', 3000);

      runs(function () {
        expect(sessionStorage.getItem('routeCache')).toEqual('stats');
        expect(route).toEqual('signin');
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("when user location is 'signin', only execute move:signin command", function () {
      sessionStorage.removeItem('routeCache');

      var Controller, controller, flag;

      Backbone.history.navigate('signin');
      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      var routerNavigate = jasmine.createSpy('routerNavigate');
      var movesignin = jasmine.createSpy('movesignin');

      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'router:navigate' && data === 'signin') {
          routerNavigate();
          flag = true;
        } else if (co === 'move:signin') {
          movesignin();
          flag = true;
        }
      };

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      reRequireModule('js/router/controller');

      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();
        spyOn(controller, 'signin').andCallThrough();
        controller.authenticate();
      });

      waitsFor(function () {
        return flag;
      }, 'router:navigate command executed', 3000);

      runs(function () {
        expect(sessionStorage.getItem('routeCache')).toBeNull();
        expect(controller.signin).toHaveBeenCalled();
        expect(routerNavigate).not.toHaveBeenCalled();
        expect(movesignin).toHaveBeenCalled();
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("execute signout", function () {
      localStorage.setItem('currentBlogId', '3');
      localStorage.setItem('recentBlogHistory', []);

      var userData = _.clone(user);
      userData.permissions = perms[0].permissions;
      cache.set('user', 'user', userData);

      var Controller, controller, flag;

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      var routerNavigate = jasmine.createSpy('routerNavigate');

      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'router:navigate' && data === 'signin') {
          routerNavigate();
          flag = true;
        }
      };

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      reRequireModule('js/router/controller');

      runs(function () {
        var mtapi = require('js/mtapi');
        Controller = require('js/router/controller');
        controller = new Controller();
        controller.token = mtapi.api.getTokenData();
        controller.signout();
      });

      waitsFor(function () {
        return flag;
      }, 'router:navigate command executed', 3000);

      runs(function () {
        expect(localStorage.getItem('currentBlogId')).toBeNull();
        expect(localStorage.getItem('recentBlogHistory')).toBeNull();
        expect(controller.token).not.toBeDefined();
        expect(cache.get('user', 'user')).toBeNull();
        expect(routerNavigate).toHaveBeenCalled();
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("commands execute authorizationCallback", function () {
      var Controller, controller, flag;

      var commands = require('js/commands');

      reRequireModule('js/router/controller');

      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();

        spyOn(controller, 'authorizationCallback').andCallFake(function () {
          flag = true;
        });

        commands.execute('authorizationCallback');
      });

      waitsFor(function () {
        return flag;
      }, 'execute authorizationCallback', 3000);

      runs(function () {
        expect(controller.authorizationCallback).toHaveBeenCalled();
      });
    });

    it("listen authorizationRequired", function () {
      sessionStorage.removeItem('authRetry');
      window.Mock.failAuth = true;
      var mtapi = require('js/mtapi');
      mtapi.api.callbacks = {};
      mtapi.api.on('authorizationRequired', function () {
        setTimeout(function () {
          flag = true;
        }, 1000);
      });

      var Controller, controller, flag;
      Controller = require('js/router/controller');
      controller = new Controller();

      spyOn(controller, 'authenticate').andCallThrough();

      controller.auth();

      waitsFor(function () {
        return flag;
      }, 'listen authorizationRequired', 3000);

      runs(function () {
        expect(sessionStorage.getItem('authRetry')).toEqual('1');
        expect(controller.authenticate).toHaveBeenCalled();
      });
    });

    it("error shown when authRetry is over 1 time", function () {
      sessionStorage.setItem('authRetry', 1);
      window.Mock.failAuth = true;

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      var appError = jasmine.createSpy('appError');
      var resp, flag;

      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'app:error') {
          appError();
          resp = data;
          flag = true;
        }
      };

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      var Controller, controller;
      reRequireModule('js/router/controller');
      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();
        controller.auth();
      });

      waitsFor(function () {
        return flag;
      }, 'listen authorizationRequired', 3000);

      runs(function () {
        expect(sessionStorage.getItem('authRetry')).toBeNull();
        expect(appError).toHaveBeenCalled();
        expect(resp).toBeDefined();
        expect(resp.blog.error.message).toEqual('authorizationRequired error occured over time for some reason');
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("error shown immediately when commicate error occurred", function () {
      sessionStorage.removeItem('authRetry');
      window.Mock.failAuthSPDY = true;

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      var appError = jasmine.createSpy('appError');
      var resp, flag;

      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'app:error') {
          appError();
          resp = data;
          flag = true;
        }
      };

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      var Controller, controller;
      reRequireModule('js/router/controller');
      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();
        controller.auth();
      });

      waitsFor(function () {
        return flag;
      }, 'listen authorizationRequired', 3000);

      runs(function () {
        expect(sessionStorage.getItem('authRetry')).toBeNull();
        expect(appError).toHaveBeenCalled();
        expect(resp).toBeDefined();
        expect(resp.blog.error.message).toEqual('Communication Error');
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("generate method for card's route handling and generated method should go through auth", function () {
      var cards = [{
        "name": "Stats",
        "id": "stats",
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

      var mtapi = require('js/mtapi');
      mtapi.api.callbacks = {};

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      var commandExec = jasmine.createSpy('commandExec');
      var resp, flag;

      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'move:cardView:stats:view') {
          commandExec();
          resp = data;
          flag = true;
        }
      };

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      var Controller, controller;
      reRequireModule('js/router/controller');

      var flag2;
      runs(function () {
        var commands = require('js/commands');
        commands.removeHandler('router:addRoute');
        Controller = require('js/router/controller');
        controller = new Controller();
        var appRouter = require('js/router/router');
        var router = new appRouter({
          controller: controller
        });

        var cardsMethod = require('js/cards');
        cardsMethod.add(cards).deploy().done(function () {
          flag2 = true;
        })
      });

      waitsFor(function () {
        return flag2;
      });

      runs(function () {
        spyOn(controller, 'auth').andCallThrough();
        expect(controller['move:cardView:stats:view']).toBeDefined();
        expect(controller['move:cardView:stats:view']).toBeDefined();
        controller['move:cardView:stats:view']();
      });

      waitsFor(function () {
        return flag;
      }, 'authenticate for cards', 3000);

      runs(function () {
        expect(controller.auth).toHaveBeenCalled();
        expect(commandExec).toHaveBeenCalled();
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });

    it("authorizationCallback", function () {
      sessionStorage.setItem('routeCache', 'stats');

      var commandsOrig = require('js/commands');
      var command = _.clone(commandsOrig);
      var commandExec = jasmine.createSpy('commandExec');
      var resp, flag;

      command.execute = function (co, data) {
        commandsOrig.execute.call(commandsOrig, co, data);
        if (co === 'router:navigate') {
          commandExec();
          resp = data;
          flag = true;
        }
      };

      undefRequireModule('js/commands');
      define('js/commands', [], function () {
        return command;
      });

      var Controller, controller;
      reRequireModule('js/router/controller');

      runs(function () {
        Controller = require('js/router/controller');
        controller = new Controller();
        controller.authorizationCallback();
      });

      waitsFor(function () {
        return flag;
      }, 'command execute', 3000);

      runs(function () {
        expect(commandExec).toHaveBeenCalled();
        expect(resp).toEqual('stats');
        require.undef('js/commands');
        requireModuleAndWait('js/commands');
      });
    });
  });

  afterEach(function () {
    resetMock();
  });
});
