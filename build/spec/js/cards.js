describe("cards", function () {
  'use strict';

  var cards;

  beforeEach(function () {
    cards = require('js/cards');
    cards.clearAll();
  });

  it('add cards', function () {
    cards.add({
      id: 'foobar'
    });
    expect(cards.getAll()[0].id).toEqual('foobar');
  });

  it('ignore card when already existed', function () {
    cards.add({
      id: 'foobar'
    });
    expect(cards.getAll()[0].id).toEqual('foobar');
    expect(cards.getAll().length).toEqual(1);
    cards.add({
      id: 'foobar'
    });
    expect(cards.getAll().length).toEqual(1);
  });

  it('deploy once', function () {
    var app,
      foobar = {
        id: 'foobar',
        routes: [{
          id: 'view',
          view: 'view'
        }, {
          id: 'detail',
          view: 'detail',
          route: 'detail'
        }]
      },
      flag, flag2;

    runs(function () {
      reRequireModule(['js/router/router', 'js/router/controller', 'js/app']);
    });

    runs(function () {
      app = require('js/app');
      spyOn(app, 'setCardViewHandler').andCallThrough();
      app.stop();
      app.start();
    });

    waitsFor(function () {
      return Backbone.History.started;
    });

    runs(function () {
      spyOn(app.router, 'addRoute').andCallThrough();
      spyOn(app.main, 'show');
      app.router.setHandlers();
      cards.add(foobar, true);
      cards.deploy().done(function () {
        flag = true;
      });
    });

    waitsFor(function () {
      return flag;
    }, 'deploy end');

    var count, count2;
    runs(function () {
      expect(app.router.addRoute).toHaveBeenCalled();
      expect(app.setCardViewHandler).toHaveBeenCalled();
      count = app.router.addRoute.callCount;
      count2 = app.setCardViewHandler.callCount;
      cards.deploy().done(function () {
        flag2 = true;
      });
    });

    waitsFor(function () {
      return flag2;
    });

    runs(function () {
      expect(app.router.addRoute.callCount).toEqual(count);
      expect(app.setCardViewHandler.callCount).toEqual(count2);
    });
  });

  it('added card after app started', function () {
    var app;
    reRequireModule(['js/vent', 'js/commands', 'js/cards', 'js/app', 'js/router/router', 'js/router/controller', 'js/views/dashboard/layout', 'js/views/dashboard/main'])

    runs(function () {
      app = require('js/app');
      spyOn(app, 'deployAddedCard').andCallThrough();
      Backbone.history.navigate('');
      app.stop();
      app.start();
    })

    waitsFor(function () {
      return Backbone.History.started
    });

    runs(function () {
      spyOn(app.main.currentView.main.currentView, 'insertCard');
      app.main.currentView.main.currentView.setHandler();
      var commands = require('js/commands')
      cards = require('js/cards');
      cards.add({
        id: 'foobarbaz'
      });
    });

    waitsFor(function () {
      return !!app.main.currentView.main.currentView.insertCard.callCount
    });

    runs(function () {
      expect(app.deployAddedCard).toHaveBeenCalled();
      var args = app.main.currentView.main.currentView.insertCard.mostRecentCall.args;
      expect(args[0].id).toEqual('foobarbaz')
    });
  });
});
