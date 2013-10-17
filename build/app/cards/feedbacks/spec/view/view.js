describe("feedbacks", function () {
  'use strict';

  var Layout, layout, View, view;
  var Controller, controller, initData;
  var commandSpies;
  var initSpy, dashboardSpy, fetchingSpy, renderSpy, modelFetchSpy, modelSyncSpy;
  var card = {
    "name": "Feedbacks",
    "id": "feedbacks",
    "dashboard": {
      "view": "dashboard/dashboard"
    },
    "routes": [{
      "id": "view",
      "view": "view/layout",
      "route": ":type/:blog_id/:id"
    }]
  };

  var mtapi;

  beforeEach(function () {
    initSpy = jasmine.createSpy('initSpy');
    dashboardSpy = jasmine.createSpy('dashboardSpy');
    fetchingSpy = jasmine.createSpy('fetchingSpy');
    renderSpy = jasmine.createSpy('renderSpy');
    modelFetchSpy = jasmine.createSpy('modelFetchSpy');
    modelSyncSpy = jasmine.createSpy('modelSyncSpy');
    commandSpies = jasmine.createSpyObj('commandSpies', ['card:feedbacks:share:show', 'share:show', 'router:navigate', 'header:render']);
    initCommands(commandSpies, controller);

    runs(function () {
      requireModuleAndWait(['cards/feedbacks/dashboard/dashboard', 'cards/feedbacks/view/layout', 'cards/feedbacks/models/comments_model']);
    });

    runs(function () {
      mtapi = require('js/mtapi');
      spyOn(mtapi.api, 'getEntry').andCallThrough();
      spyOn(mtapi.api, 'updateEntry').andCallThrough();
      spyOn(mtapi.api, 'getComment').andCallThrough();
      spyOn(mtapi.api, 'updateComment').andCallThrough();

      var modelOrig = require('cards/feedbacks/models/comments_model');
      undefRequireModule('cards/feedbacks/models/comments_model');
      define('cards/feedbacks/models/comments_model', [], function () {
        return modelOrig.extend({
          fetch: function (options) {
            modelOrig.prototype.fetch.apply(this, arguments);
            modelFetchSpy(options);
          },
          sync: function (method, model, options) {
            modelOrig.prototype.sync.apply(this, arguments);
            modelSyncSpy(method, model, options);
          }
        });
      });

      requireModuleAndWait(['cards/feedbacks/models/comments_model']);

      var viewOrig;
      runs(function () {
        reRequireModule(['js/views/card/itemview', 'js/views/card/composite', 'cards/feedbacks/dashboard/dashboard', 'cards/feedbacks/view/layout', 'cards/feedbacks/models/comments_collection']);
      });

      runs(function () {
        viewOrig = require('cards/feedbacks/view/layout');
        undefRequireModule('cards/feedbacks/view/layout');
        define('cards/feedbacks/view/layout', [], function () {
          return viewOrig.extend({
            initialize: function (options) {
              viewOrig.prototype.initialize.apply(this, arguments);
              initSpy(options);
            },
            fetch: function (options) {
              viewOrig.prototype.fetch.apply(this, arguments);
              fetchingSpy(options);
            },
            render: function () {
              viewOrig.prototype.render.apply(this, arguments);
              renderSpy();
            }
          });
        });

        requireModuleAndWait(['cards/feedbacks/view/layout']);

        runs(function () {
          reRequireModule(['js/views/card/header', 'js/views/card/layout', 'js/router/router', 'js/router/controller', 'js/collections/entries', 'js/models/entry']);
        });
      });
    });

    runs(function () {
      initController(Controller, controller, function (data) {
        initData = _.extend({}, data, {
          card: card
        });
        View = require('cards/feedbacks/view/layout');
      });
    });

    waitsFor(function () {
      return !!initData;
    }, 'initialize main', 3000);

    runs(function () {
      reRequireModule(['moment']);
    });
  });

  describe("dashboard/view", function () {

    beforeEach(function () {
      resetMock();
      var cache = require('js/cache');
      cache.clear(initData.blogId);
    });

    it("initialize, fetch and render, and move individual view screen", function () {
      var Dashboard = require('cards/feedbacks/dashboard/dashboard');
      var dashboard = new Dashboard(initData);

      waitsFor(function () {
        return !!dashboard.$el.find('.card-item-list a').length;
      }, 'fetching collection', 3000);

      var route, count;
      runs(function () {
        var $link = dashboard.$el.find('.card-item-list a');
        route = $link.data('route');
        var event = $.Event('tap', {
          currentTarget: $link.get(0)
        });
        count = commandSpies['router:navigate'].callCount;
        $link.trigger(event);
      });

      waitsFor(function () {
        return commandSpies['router:navigate'].callCount > count;
      }, 'render view', 3000);

      runs(function () {
        var arg = commandSpies['router:navigate'].mostRecentCall.args[0];
        expect(route).toEqual(route);
      });
    });

    it("fetch entry data", function () {
      var blogId = '1';
      var commentId = '34';
      var entryId = '806';

      var comment = window.Mock.throwCommentItem = {
        "link": "http://memolog.org/1192/09/kamakura-bakufu.html#comment-" + commentId,
        "entry": {
          "id": entryId
        },
        "parent": null,
        "date": "2009-06-14T22:53:43\u002b09:00",
        "status": "Approved",
        "updatable": true,
        "author": {
          "userpicUrl": null,
          "id": null,
          "displayName": "yamaguchi"
        },
        "body": "body",
        "id": commentId
      };

      var item = window.Mock.throwEntryItem = {
        "status": "Publish",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body"
      };
      var routes = ['comments', blogId, commentId];
      var count = mtapi.api.getEntry.callCount;

      Layout = require('cards/feedbacks/view/layout');
      layout = new Layout(_.extend({}, initData, {
        routes: routes
      }));

      waitsFor(function () {
        return mtapi.api.getEntry.callCount > count;
      }, 'fetching entry', 3000);

      runs(function () {
        expect(layout.model.id).toEqual(commentId);
        var data = layout.model.toJSON();
        expect(data.body).toEqual(comment.body);
        expect(modelFetchSpy).toHaveBeenCalled();
        expect(modelSyncSpy).toHaveBeenCalled();
        var method = modelSyncSpy.mostRecentCall.args[0];
        expect(method).toEqual('read');
        expect(mtapi.api.getComment).toHaveBeenCalled();
        var args = mtapi.api.getComment.mostRecentCall.args;
        expect(args[0]).toEqual(blogId);
        expect(args[1]).toEqual(commentId);
        expect(mtapi.api.updateComment).not.toHaveBeenCalled();

        expect(layout.entryModel.id).toEqual(entryId);
        var entry = layout.entryModel.toJSON();
        expect(entry.id).toEqual(entryId);
        expect(entry.title).toEqual(item.title);
      });
    });

    it("use stored data", function () {
      var entryId = '1';
      var blogId = '1';
      var commentId = 2;

      var entry = window.Mock.throwEntryItem = {
        "status": "Publish",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body"
      };

      window.Mock.throwListCommentItemsLength = 30;
      var Collection = require('cards/feedbacks/models/comments_collection');
      var collection = new Collection(blogId);

      var EntryCollection = require('js/collections/entries');
      var entryCollection = new EntryCollection(blogId);
      var EntryModel = require('js/models/entry');
      var entryModel = new EntryModel({
        blogId: blogId,
        id: entryId
      });

      spyOn(mtapi.api, 'listComments').andCallThrough();
      collection.fetch();
      entryModel.fetch();

      waitsFor(function () {
        return mtapi.api.listComments.callCount === 1 && mtapi.api.getEntry.callCount === 1;
      }, 'fetching collection', 3000);

      var cache = require('js/cache');
      var routes = ['comments', blogId, commentId];

      runs(function () {
        entryCollection.add(entryModel);
        cache.set(blogId, 'feedbacks_comments', collection);
        cache.set(blogId, 'entries', entryCollection);
        Layout = require('cards/feedbacks/view/layout');
        layout = new Layout(_.extend({}, initData, {
          routes: routes
        }));
      });

      waitsFor(function () {
        return renderSpy.callCount === 1;
      }, 'render', 3000);

      runs(function () {
        expect(layout.model.id).toEqual(commentId);
        var data = layout.model.toJSON();
        expect(data.body).toEqual('body' + commentId);
        expect(modelFetchSpy).not.toHaveBeenCalled();
        expect(modelSyncSpy).not.toHaveBeenCalled();

        expect(layout.entryModel.id).toEqual(entryId);
        var ent = layout.entryModel.toJSON();
        expect(ent.title).toEqual(entry.title);
        expect(mtapi.api.getEntry.callCount).toEqual(1);
      });
    });

    it("approve pendint comment and then, undo", function () {
      var entryId = '1';
      var blogId = '3';
      var commentId = '2';

      var cache = require('js/cache');
      cache.clear(blogId);

      var comment = window.Mock.throwCommentItem = {
        "link": "http://memolog.org/1192/09/kamakura-bakufu.html#comment-" + commentId,
        "entry": {
          "id": entryId
        },
        "parent": null,
        "date": "2009-06-14T22:53:43\u002b09:00",
        "status": "Pending",
        "updatable": true,
        "author": {
          "userpicUrl": null,
          "id": null,
          "displayName": "yamaguchi"
        },
        "body": "body",
        "id": commentId
      };

      var item = window.Mock.throwEntryItem = {
        "status": "Publish",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body"
      };
      var routes = ['comments', blogId, commentId];

      Layout = require('cards/feedbacks/view/layout');
      layout = new Layout(_.extend({}, initData, {
        routes: routes
      }));

      var flag;
      layout.comment.on('show', function () {
        flag = true;
      });

      waitsFor(function () {
        return flag;
      }, 'render', 3000);

      runs(function () {
        var $target = layout.$el.find('#approve');

        expect($target.length).toBeTruthy();

        var e = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(e);
        var count = modelSyncSpy.callCount;

        waitsFor(function () {
          return modelSyncSpy.callCount > count;
        }, 'callback from tapping approve button', 3000);
      });

      runs(function () {
        expect(modelFetchSpy).toHaveBeenCalled();
        expect(modelSyncSpy).toHaveBeenCalled();
        var method = modelSyncSpy.mostRecentCall.args[0];
        var options = modelSyncSpy.mostRecentCall.args[2];
        expect(method).toEqual('update');
        expect(options.status).toEqual('Approved');
        expect(mtapi.api.getComment.callCount).toEqual(1);
        expect(mtapi.api.updateComment).toHaveBeenCalled();
        var args = mtapi.api.updateComment.mostRecentCall.args;
        expect(args[0]).toEqual(blogId);
        expect(args[1]).toEqual(commentId);
        var comment = args[2];
        expect(comment.status).toEqual('Approved');
      });

      runs(function () {
        var $target = layout.$el.find('#comment-undo');
        var e = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(e);

        waitsFor(function () {
          return modelSyncSpy.mostRecentCall.args[2].status === 'Pending';
        }, 'callback from tapping undo button', 3000);
      });

      runs(function () {
        var method = modelSyncSpy.mostRecentCall.args[0];
        var options = modelSyncSpy.mostRecentCall.args[2];
        expect(method).toEqual('update');
        expect(options.status).toEqual('Pending');
        expect(mtapi.api.getComment.callCount).toEqual(1);
        expect(mtapi.api.updateComment.callCount).toEqual(2);
        var args = mtapi.api.updateComment.mostRecentCall.args;
        expect(args[0]).toEqual(blogId);
        expect(args[1]).toEqual(commentId);
        var entry = args[2];
        expect(entry.status).toEqual('Pending');
      });
    });

    it("failed fetching Entry", function () {
      var blogId = '1';
      var commentId = '2';
      var entryId = '1';
      var error = window.Mock.failEntryItem = 'Authorization failed';

      var comment = window.Mock.throwCommentItem = {
        "link": "http://memolog.org/1192/09/kamakura-bakufu.html#comment-" + commentId,
        "entry": {
          "id": entryId
        },
        "parent": null,
        "date": "2009-06-14T22:53:43\u002b09:00",
        "status": "Pending",
        "updatable": true,
        "author": {
          "userpicUrl": null,
          "id": null,
          "displayName": "yamaguchi"
        },
        "body": "body",
        "id": commentId
      };

      var routes = ['comments', blogId, commentId];

      Layout = require('cards/feedbacks/view/layout');
      layout = new Layout(_.extend({}, initData, {
        routes: routes
      }));

      waitsFor(function () {
        return layout.fetchError;
      }, 'render', 3000);

      runs(function () {
        expect(layout.fetchError).toBe(true);
        expect(layout.comment.currentView.fetchError).toBe(true);
        expect(layout.entry.currentView.fetchError).toBe(true);
      });
    });

    it("failed update comments", function () {
      var blogId = '1';
      var commentId = '2';
      var entryId = '1';
      var error = window.Mock.failUpdateComment = 'Authorization failed';

      var comment = window.Mock.throwCommentItem = {
        "link": "http://memolog.org/1192/09/kamakura-bakufu.html#comment-" + commentId,
        "entry": {
          "id": entryId
        },
        "parent": null,
        "date": "2009-06-14T22:53:43\u002b09:00",
        "status": "Pending",
        "updatable": true,
        "author": {
          "userpicUrl": null,
          "id": null,
          "displayName": "yamaguchi"
        },
        "body": "body",
        "id": commentId
      };

      var item = window.Mock.throwEntryItem = {
        "status": "Publish",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": "Yutaka Yamaguchi",
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body"
      };

      var routes = ['comments', blogId, commentId];

      Layout = require('cards/feedbacks/view/layout');
      layout = new Layout(_.extend({}, initData, {
        routes: routes
      }));

      var flag;
      layout.comment.on('show', function () {
        flag = true;
      });

      waitsFor(function () {
        return flag;
      }, 'render', 3000);

      runs(function () {
        var $target = layout.$el.find('#approve');

        expect($target.length).toBeTruthy();

        var e = $.Event('tap', {
          currentTarget: $target.get(0)
        });
        $target.trigger(e);
        var count = modelSyncSpy.callCount;

        waitsFor(function () {
          return modelSyncSpy.callCount > count;
        }, 'callback from tapping approve button', 3000);
      });

      runs(function () {
        expect(mtapi.api.updateComment).toHaveBeenCalled();
        expect(layout.comment.currentView.error.message).toEqual(error);
        expect(layout.comment.currentView.acceptionFailed).toBe(true);
        var model = layout.model.toJSON();
        expect(model.status).toEqual('Pending');

        var $el = layout.$el.find('.close-me');
        expect($el.length).toBeTruthy();
        $el.trigger('tap');
        $el = layout.$el.find('.close-me');
        var $overlay = layout.$el.find('.overlay');
        expect($el.length).toBeFalsy();
        expect($overlay.length).toBeFalsy();
      });
    });

    it("comment permission check", function () {
      var blogId = '1';
      var entryId = '1';

      var routes = ['comments', '1', 123];
      var CommentView, commentView;

      var user = window.Mock.throwUserItem = {
        displayName: "yyamaguchi",
        email: "yyamaguchi@sixapart.com",
        id: "1",
        language: "ja",
        name: "Yutaka Yamaguchi",
        updatable: true,
        url: "",
        userpicUrl: ""
      }

      var entry = window.Mock.throwEntryItem = {
        "status": "Publish",
        "date": "2013-08-05T09:00:00\u002b09:00",
        "author": {
          "displayName": "Yutaka Yamaguchi"
        },
        "class": "entry",
        "title": "title" + (new Date()).valueOf(),
        "body": "body",
        "blog": {}
      };

      var EntryModel = require('js/models/entry');
      var entryModel = new EntryModel({
        blogId: blogId,
        id: entryId
      });

      var setTranslationSpy = jasmine.createSpy('setTranslationSpy');
      var orig = require('cards/feedbacks/view/comment');
      undefRequireModule('cards/feedbacks/view/comment');
      define('cards/feedbacks/view/comment', [], function () {
        return orig.extend({
          setTranslation: setTranslationSpy
        });
      });

      requireModuleAndWait(['cards/feedbacks/view/comment']);

      runs(function () {
        entryModel.fetch();
      });

      waitsFor(function () {
        return mtapi.api.getEntry.callCount === 1;
      }, 'fetch entry', 3000);

      // first round
      runs(function () {
        var cache = require('js/cache');
        cache.clear('user', 'user');

        window.Mock.throwPermissionItems = [{
          "permissions": ['view_log'],
          "blog": {
            "id": null
          }
        }];
        initController(Controller, controller, function (data) {
          CommentView = require('cards/feedbacks/view/comment');
          commentView = new CommentView(_.extend({}, data, {
            card: card,
            routes: routes,
            entryModel: entryModel
          }));
        });
      });

      waitsFor(function () {
        return setTranslationSpy.callCount === 1;
      }, 'initializing', 3000);

      runs(function () {
        expect(commentView.commentApprovePerm).toBe(false);
      });

      // second round
      runs(function () {
        var cache = require('js/cache');
        cache.clear('user', 'user');

        window.Mock.throwPermissionItems = [{
          "permissions": ['administer'],
          "blog": null
        }];
        initController(Controller, controller, function (data) {
          CommentView = require('cards/feedbacks/view/comment');
          commentView = new CommentView(_.extend({}, data, {
            card: card,
            routes: routes,
            entryModel: entryModel
          }));
        });
      });

      waitsFor(function () {
        return setTranslationSpy.callCount === 2;
      }, 'initializing', 3000);

      runs(function () {
        expect(commentView.commentApprovePerm).toBe(true);
      });

      // third round
      runs(function () {
        var cache = require('js/cache');
        cache.clear('user', 'user');

        window.Mock.throwPermissionItems = [{
          "permissions": ['manage_feedback'],
          "blog": {
            "id": blogId
          }
        }];
        initController(Controller, controller, function (data) {
          CommentView = require('cards/feedbacks/view/comment');
          commentView = new CommentView(_.extend({}, data, {
            card: card,
            routes: routes,
            entryModel: entryModel
          }));
        });
      });

      waitsFor(function () {
        return setTranslationSpy.callCount === 3;
      }, 'initializing', 3000);

      runs(function () {
        expect(commentView.commentApprovePerm).toBe(true);
      });

      // forth round
      runs(function () {
        var cache = require('js/cache');
        cache.clear('user', 'user');

        window.Mock.throwPermissionItems = [{
          "permissions": ['edit_all_posts'],
          "blog": {
            "id": blogId
          }
        }];
        initController(Controller, controller, function (data) {
          CommentView = require('cards/feedbacks/view/comment');
          commentView = new CommentView(_.extend({}, data, {
            card: card,
            routes: routes,
            entryModel: entryModel
          }));
        });
      });

      waitsFor(function () {
        return setTranslationSpy.callCount === 4;
      }, 'initializing', 3000);

      runs(function () {
        expect(commentView.commentApprovePerm).toBe(true);
      });

      // fifth round
      runs(function () {
        var cache = require('js/cache');
        cache.clear('user', 'user');

        window.Mock.throwPermissionItems = [{
          "permissions": ['publish_post'],
          "blog": {
            "id": blogId
          }
        }];

        initController(Controller, controller, function (data) {
          CommentView = require('cards/feedbacks/view/comment');
          commentView = new CommentView(_.extend({}, data, {
            card: card,
            routes: routes,
            entryModel: entryModel
          }));
        });
      });

      waitsFor(function () {
        return setTranslationSpy.callCount === 5;
      }, 'initializing', 3000);

      runs(function () {
        expect(commentView.commentApprovePerm).toBe(true);
      });

      // sixth round
      runs(function () {
        var cache = require('js/cache');
        cache.clear('user', 'user');

        var user = window.Mock.throwUserItem = {
          displayName: "yyamaguchi",
          email: "yyamaguchi@sixapart.com",
          id: "1",
          language: "ja",
          name: "Yutaka Tamaguchi",
          updatable: true,
          url: "",
          userpicUrl: ""
        }

        window.Mock.throwPermissionItems = [{
          "permissions": ['publish_post'],
          "blog": {
            "id": blogId
          }
        }];

        initController(Controller, controller, function (data) {
          CommentView = require('cards/feedbacks/view/comment');
          commentView = new CommentView(_.extend({}, data, {
            card: card,
            routes: routes,
            entryModel: entryModel
          }));
        });
      });

      waitsFor(function () {
        return setTranslationSpy.callCount === 6;
      }, 'initializing', 3000);

      runs(function () {
        expect(commentView.commentApprovePerm).toBe(false);
      });
    });

    describe("Reply Comment", function () {
      var blogId = '1',
        commentId = '2',
        entryId = '1',
        routes = ['comments', blogId, commentId],
        entryCollection, entryModel, model, collection,
        data,
        replyRenderSpy;

      beforeEach(function () {
        var orig = require('cards/feedbacks/view/reply');
        replyRenderSpy = jasmine.createSpy('replyRenderSpy');

        undefRequireModule('cards/feedbacks/view/reply');
        define('cards/feedbacks/view/reply', [], function () {
          return orig.extend({
            render: function () {
              orig.prototype.render.apply(this, arguments);
              replyRenderSpy();
            }
          });
        });
        requireModuleAndWait(['cards/feedbacks/view/reply']);

        var entry = window.Mock.throwEntryItem = {
          "status": "Publish",
          "date": "2013-08-05T09:00:00\u002b09:00",
          "author": "Yutaka Yamaguchi",
          "class": "entry",
          "title": "title" + (new Date()).valueOf(),
          "body": "body"
        };

        window.Mock.throwListCommentItemsLength = 30;
        window.Mock.throwListCommentItemsStaus = 'Approved';

        var Collection = require('cards/feedbacks/models/comments_collection');
        collection = new Collection(blogId);

        var EntryCollection = require('js/collections/entries');
        entryCollection = new EntryCollection(blogId);
        var EntryModel = require('js/models/entry');
        entryModel = new EntryModel({
          blogId: blogId,
          id: entryId
        });

        spyOn(mtapi.api, 'listComments').andCallThrough();
        spyOn(mtapi.api, 'createReplyComment').andCallThrough();

        collection.fetch();
        entryModel.fetch();

        waitsFor(function () {
          return mtapi.api.listComments.callCount === 1 && mtapi.api.getEntry.callCount === 1;
        }, 'fetching collection', 3000);

        runs(function () {
          model = collection.get(commentId);

          data = _.extend({}, initData, {
            type: 'comments',
            routes: routes,
            blogId: blogId,
            commentId: commentId,
            model: model,
            collection: collection,
            entryModel: entryModel,
          });
        });
      });

      it("initialize comment block", function () {
        var Reply = require('cards/feedbacks/view/reply');
        var reply = new Reply(data);
        expect(reply.type).toEqual('comments');
        expect(reply.blogId).toEqual(blogId);
        expect(reply.initial).toBe(true);
      });

      it("reply comment", function () {
        var Reply = require('cards/feedbacks/view/reply');
        var reply = new Reply(data);

        waitsFor(function () {
          return replyRenderSpy.callCount === 2
        }, 'rendering', 3000);

        var count;
        runs(function () {
          var $target = reply.$el.find('#reply-button');
          expect($target.length).toBeTruthy();
          var event = $.Event('tap', {
            currentTarget: $target.get(0)
          });
          count = replyRenderSpy.callCount;
          $target.trigger(event);
        });

        waitsFor(function () {
          return replyRenderSpy.callCount > count;
        }, 'callback tap', 3000);

        var body = 'Lorem ipsum';
        runs(function () {
          expect(reply.initial).toBe(false);
          expect(reply.replied).toBe(false);
          expect(reply.form).toBe(true);
          expect(reply.body).toBe(false);

          window.Mock.replyCommentId = 1234;
          var $textarea = reply.$el.find('#reply-textarea');
          $textarea.val(body);
          var $target = reply.$el.find('#do-reply-button');
          expect($target.length).toBeTruthy();
          var event = $.Event('tap', {
            currentTarget: $target.get(0)
          });
          count = replyRenderSpy.callCount;
          $target.trigger(event);
        });

        waitsFor(function () {
          return replyRenderSpy.callCount > count;
        }, 'callback tap', 3000);

        runs(function () {
          expect(reply.form).toBe(false);
          expect(reply.replied).toBe(true);
          expect(reply.body).toEqual(body);
          var newComment = reply.collection.get(window.Mock.replyCommentId)
          expect(newComment).toBeTruthy();
          var cmt = newComment.toJSON();
          expect(cmt.id).toEqual(window.Mock.replyCommentId);
          expect(cmt.body).toEqual(body);

          // one more comment
          var $target = reply.$el.find('#reply-button');
          expect($target.length).toBeTruthy();
          var event = $.Event('tap', {
            currentTarget: $target.get(0)
          });
          count = replyRenderSpy.callCount;
          $target.trigger(event);
        });

        waitsFor(function () {
          return replyRenderSpy.callCount > count;
        }, 'callback tap', 3000);

        runs(function () {
          body = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
          expect(reply.initial).toBe(false);
          expect(reply.replied).toBe(false);
          expect(reply.form).toBe(true);
          expect(reply.body).toBe(false);

          window.Mock.replyCommentId = 9876;
          var $textarea = reply.$el.find('#reply-textarea');
          $textarea.val(body);
          var $target = reply.$el.find('#do-reply-button');
          expect($target.length).toBeTruthy();
          var event = $.Event('tap', {
            currentTarget: $target.get(0)
          });
          count = replyRenderSpy.callCount;
          $target.trigger(event);
        });

        waitsFor(function () {
          return replyRenderSpy.callCount > count;
        }, 'callback tap', 3000);

        runs(function () {
          expect(reply.form).toBe(false);
          expect(reply.replied).toBe(true);
          expect(reply.body).toEqual(body);
          var $textarea = reply.$el.find('#reply-textarea');
          expect($textarea.length).toBeFalsy();
          var newComment = reply.collection.get(window.Mock.replyCommentId)
          expect(newComment).toBeTruthy();
          var cmt = newComment.toJSON();
          expect(cmt.id).toEqual(window.Mock.replyCommentId);
          expect(cmt.body).toEqual(body);
        });
      });

      it("reply comment failed", function () {
        window.Mock.failCreateReplyComment = 'some error occurred';

        var Reply = require('cards/feedbacks/view/reply');
        var reply = new Reply(data);

        waitsFor(function () {
          return replyRenderSpy.callCount > 2
        }, 'rendering', 3000);

        var count;
        runs(function () {
          var $target = reply.$el.find('#reply-button');
          expect($target.length).toBeTruthy();
          var event = $.Event('tap', {
            currentTarget: $target.get(0)
          });
          count = replyRenderSpy.callCount;
          $target.trigger(event);
        });

        waitsFor(function () {
          return replyRenderSpy.callCount > count;
        }, 'callback tap', 3000);

        var body = 'Lorem ipsum';
        runs(function () {
          expect(reply.initial).toBe(false);
          expect(reply.replied).toBe(false);
          expect(reply.form).toBe(true);
          expect(reply.body).toBe(false);

          window.Mock.replyCommentId = 1234;
          var $textarea = reply.$el.find('#reply-textarea');
          $textarea.val(body);
          var $target = reply.$el.find('#do-reply-button');
          expect($target.length).toBeTruthy();
          var event = $.Event('tap', {
            currentTarget: $target.get(0)
          });
          count = replyRenderSpy.callCount;
          $target.trigger(event);
        });

        waitsFor(function () {
          return replyRenderSpy.callCount > count;
        }, 'callback tap', 3000);

        runs(function () {
          expect(reply.error).toEqual(window.Mock.failCreateReplyComment);

          expect(reply.form).toBe(true);
          expect(reply.replied).toBe(false);
          expect(reply.body).toEqual(body);
          var $textarea = reply.$el.find('#reply-textarea');
          expect($textarea.length).toBeTruthy();
          expect($textarea.val()).toEqual(body);
          var newComment = reply.collection.get(window.Mock.replyCommentId)
          expect(newComment).toBeFalsy();
        });
      });
    });
  });

  afterEach(function () {
    resetMock();
    var cache = require('js/cache');
    cache.clear('user', 'user');
    cache.clear(initData.blogId);
    reRequireModule(['js/commands', 'js/router/controller', 'js/app']);
  });
});
