describe("views", function () {
  'use strict';

  var commandSpy;
  beforeEach(function () {
    var commandsOrig = require('js/commands');
    var command = _.clone(commandsOrig);
    commandSpy = jasmine.createSpy('commandSpy');
    command.execute = function (co, data) {
      if (co === 'router:navigate') {
        commandSpy(co, data);
      }
      commandsOrig.execute.call(commandsOrig, co, data);
    };

    undefRequireModule('js/commands');
    define('js/commands', [], function () {
      return command;
    });

    reRequireModule(['js/commands', 'js/views/card/composite', 'js/collections/blogs']);
  });

  describe("card/composite", function () {
    var Controller, controller, CompositeView, compositeView;
    var cards = [{
      "name": "CompositeView",
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
      resetMock();
      var flag;

      Controller = require('js/router/controller');
      controller = new Controller({
        cards: cards
      });
      controller.auth(function (data) {
        CompositeView = require('js/views/card/composite');
        data = _.extend({}, data, {
          card: cards[0]
        });
        compositeView = new CompositeView(data);
        flag = true;
      });

      waitsFor(function () {
        return flag;
      }, 'controller authentication', 3000);
    });

    it("handleReadmore", function () {
      var $el = $('<div class="readmore"></div>').appendTo(compositeView.$el);
      compositeView.$el.appendTo($('#main'));

      var flag;
      var origFunc = compositeView.addTapClass;
      spyOn(compositeView, 'render');
      spyOn(compositeView, 'fetch');
      spyOn(compositeView, 'addTapClass').andCallFake(function () {
        origFunc.apply(compositeView, arguments);
        setTimeout(function () {
          flag = true;
        }, 500);
      });

      var options = {
        limit: 5
      };

      compositeView.handleReadmore(options);

      $el.trigger('tap');

      waitsFor(function () {
        return flag;
      }, 'tap action', 3000);

      runs(function () {
        expect(compositeView.render).toHaveBeenCalled();
        expect(compositeView.fetch).toHaveBeenCalled();
        expect(compositeView.fetch.mostRecentCall.args[0]).toEqual(options);
        expect(compositeView.loadingReadmore).toBe(true);
        compositeView.$el.remove();
      })
    });

    it("handleItemViewNavigate", function () {
      var $el = $('<a href="#" data-route="foo/bar/baz">Lorem ipsum</a>').appendTo(compositeView.$el);
      compositeView.$el.appendTo($('#app'));

      var flag;
      var origFunc = compositeView.addTapClass;
      spyOn(compositeView, 'addTapClass').andCallFake(function () {
        origFunc.apply(compositeView, arguments);
        setTimeout(function () {
          flag = true;
        }, 1000);
      });

      compositeView.handleItemViewNavigate();

      $el.trigger('tap');

      waitsFor(function () {
        return flag;
      }, 'tap action', 3000);

      runs(function () {
        expect(commandSpy).toHaveBeenCalled();
        var args = commandSpy.mostRecentCall.args;
        expect(args[1]).toEqual('foo/bar/baz');
        compositeView.$el.remove();
      });
    });

    it("fetch with success option", function () {
      var Collection = require('js/collections/blogs');
      var collection = new Collection(1);
      compositeView.collection = collection;
      var flag;
      var options = {
        successCallback: function () {}
      }
      spyOn(compositeView, 'render');
      spyOn(options, 'successCallback').andCallFake(function () {
        flag = true;
      });
      compositeView.fetch(options);

      waitsFor(function () {
        return flag;
      }, 'fetching', 3000);

      runs(function () {
        expect(compositeView.loading).toBe(false);
        expect(compositeView.loadingReadmore).toBe(false);
        expect(compositeView.fetchError).toBe(false);
        expect(compositeView.render).toHaveBeenCalled();
        expect(options.successCallback).toHaveBeenCalled();
      });
    });

    it("fetch with error option", function () {
      window.Mock.alwaysFail = 'Fetching error';
      var Collection = require('js/collections/blogs');
      var collection = new Collection(1);
      compositeView.collection = collection;
      var flag;
      var options = {
        errorCallback: function () {}
      }
      spyOn(compositeView, 'render');
      spyOn(options, 'errorCallback').andCallFake(function () {
        flag = true;
      });
      compositeView.fetch(options);

      waitsFor(function () {
        return flag;
      }, 'fetching', 3000);

      runs(function () {
        expect(compositeView.loading).toBe(false);
        expect(compositeView.loadingReadmore).toBe(false);
        expect(compositeView.fetchError).toBe(true);
        expect(compositeView.render).toHaveBeenCalled();
        expect(options.errorCallback).toHaveBeenCalled();
      });
    })
  });

  afterEach(function () {
    resetMock();
    reRequireModule('js/commands');
  });
});
