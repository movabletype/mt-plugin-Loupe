describe("views", function () {
  'use strict';

  var Main, main, initData;
  var Controller, controller;
  var commandsOrig, commands, commandSpy, flagAfterL10N;

  beforeEach(function () {
    commandsOrig = require('js/commands');
    commands = _.clone(commandsOrig);
    commandSpy = jasmine.createSpy('commandSpy');

    commands.execute = function (co, data) {
      if (co === 'l10n') {
        if (controller) {
          controller.l10n.waitLoadCommon(data);
          flagAfterL10N = true;
        }
      } else {
        commandsOrig.execute.call(commandsOrig, co, data);
      }
      commandSpy(co, data);
    };

    undefRequireModule('js/commands');
    define('js/commands', [], function () {
      return commands;
    });

    reRequireModule(['js/router/controller', 'js/views/dashboard/layout', 'js/views/dashboard/main', 'js/views/card/itemview', 'js/app']);

    runs(function () {
      var app = require('js/app');
      app.start({});
      app.router.navigate('', true);
    });

    waitsFor(function () {
      return !(/signin|signout$/).test(location.href);
    });
  });

  describe("dashboard/main", function () {
    var initialize = function (cards, noUser) {
      Controller = require('js/router/controller');
      controller = new Controller({
        cards: cards
      });

      controller.auth(function (data) {
        Main = require('js/views/dashboard/main');
        initData = _.extend({}, data, {
          cards: cards
        });
        var dataClone = _.clone(initData);
        if (noUser) {
          dataClone.user = null;
        }
        main = new Main(dataClone);
        spyOn(main, 'render').andCallThrough();
        main.render();
        main.$el.appendTo($('#app'));
      });

      waitsFor(function () {
        if (noUser) {
          flagAfterL10N = (main.render.calls && !! main.render.calls.length);
        }
        return flagAfterL10N;
      }, 'controller authentication', 3000);

      runs(function () {
        var origFunc = controller.l10n.load;
        spyOn(controller.l10n, 'load').andCallFake(function (path, namespace) {
          var fakePath = '/spec/' + path;
          return origFunc.call(controller.l10n, fakePath, namespace);
        });
      });
    };

    beforeEach(function () {
      flagAfterL10N = null;
    });

    it("prepare cards with view", function () {
      var cardSpy = jasmine.createSpy('cardSpy');
      define('cards/dashboard_test/dashboard/dashboard', ['js/views/card/itemview'], function (ItemView) {
        return ItemView.extend({
          initialize: function (options) {
            ItemView.prototype.initialize.apply(this, arguments);
            cardSpy(options);
          },
          render: function () {}
        });
      });

      var cards = [{
        "name": "Dashboard Test",
        "id": "dashboard_test",
        "dashboard": {
          "view": "dashboard/dashboard"
        }
      }];

      initialize(cards);

      waitsFor(function () {
        return cardSpy.calls && cardSpy.calls.length;
      }, 'cardSpy called', 3000);

      runs(function () {
        expect($('#card-dashboard_test').length).toBeTruthy();
        expect(cardSpy).toHaveBeenCalled();
        var options = cardSpy.mostRecentCall.args[0];
        expect(options.card.id).toEqual('dashboard_test');
      });
    });

    it("prepare cards with template (.hbs)", function () {
      var cardSpy = jasmine.createSpy('cardSpy');
      define("hbs!cards/dashboardtest/dashboard/template", ["hbs", "handlebars"], function (e, t) {
        var s = t.template(function (e, t, s) {
          s = s || e.helpers;
          cardSpy();
          return '<div id="dashboardtest-template"></div>';
        });
        t.registerPartial("cards_dashboardtest_dashboard_template", s);
        return s;
      });

      var cards = [{
        "name": "Dashboard Test",
        "id": "dashboardtest",
        "dashboard": {
          "template": "dashboard/template.hbs"
        }
      }];

      initialize(cards);

      waitsFor(function () {
        return cardSpy.calls && cardSpy.calls.length;
      }, 'cardSpy called', 3000);

      runs(function () {
        expect(cardSpy).toHaveBeenCalled();
        expect($('#dashboardtest-template').length).toBeTruthy();
      });
    });

    it("prepare cards with template (.html) and data", function () {
      var cardSpy = jasmine.createSpy('cardSpy');
      define("text!cards/dashboardtest/dashboard/template.html", [], function () {
        cardSpy();
        return '<div id="dashboardtest-template-html"><%= foo %></div>';
      });

      define("cards/dashboardtest/dashboard/data", [], function () {
        return {
          foo: 'bar'
        };
      });

      var cards = [{
        "name": "Dashboard Test",
        "id": "dashboardtest",
        "dashboard": {
          "template": "dashboard/template.html",
          "data": "dashboard/data"
        }
      }];

      initialize(cards);

      waitsFor(function () {
        return cardSpy.calls && cardSpy.calls.length;
      }, 'cardSpy called', 3000);

      runs(function () {
        expect(cardSpy).toHaveBeenCalled();
        expect($('#dashboardtest-template-html').length).toBeTruthy();
      });
    });

    it("show nothing when no user data", function () {
      var cardSpy = jasmine.createSpy('cardSpy');
      define('cards/dashboard_test/dashboard/dashboard', ['js/views/card/itemview'], function (ItemView) {
        return ItemView.extend({
          initialize: function (options) {
            ItemView.prototype.initialize.apply(this, arguments);
            cardSpy(options);
          },
          render: function () {}
        });
      });

      var cards = [{
        "name": "Dashboard Test",
        "id": "dashboard_test",
        "dashboard": {
          "view": "dashboard/dashboard"
        }
      }];

      initialize(cards, true);

      waitsFor(function () {
        return main.render.calls && main.render.calls.length;
      }, 'cardSpy called', 3000);

      runs(function () {
        expect($('#card-dashboard_test').length).not.toBeTruthy();
        expect(cardSpy).not.toHaveBeenCalled();
        expect(main.render).toHaveBeenCalled();
      });
    });

    it("show nothing with error", function () {
      var data = _.clone(initData);
      data.blog = {
        error: 'some error occured'
      };
      main = new Main(data);
      spyOn(main, 'render').andCallThrough();
      main.render();

      waitsFor(function () {
        return main.render.callCount === 2
      }, 'render', 3000);

      runs(function () {
        expect(main.$el.find('.error-in-dashboard').length).toBeTruthy();
      })
    });

    it("order dashboard cards with order paramater", function () {
      var cards = require('json!cards/cards.json');

      delete cards[0].dashboard.order;
      cards[1].dashboard.order = 100;
      cards[2].dashboard.order = 300;
      cards[3].dashboard.order = 200;

      define('cards/dashboard_test/dashboard/dashboard', ['js/views/card/itemview'], function (ItemView) {
        return ItemView.extend({
          initialize: function (options) {
            ItemView.prototype.initialize.apply(this, arguments);
          },
          template: '<span>TEST</span>'
        });
      });

      var app, cards, flag, newCard;

      reRequireModule(['js/commands', 'js/vent', 'js/cards', 'js/app', 'js/router/router', 'js/router/controller', 'js/views/dashboard/layout', 'js/views/dashboard/main'])

      runs(function () {
        app = require('js/app');
        app.stop();
      });

      waitsFor(function () {
        return !Backbone.History.started;
      }, 'history stopped');

      runs(function () {
        app.start({
          cards: cards
        });
      })

      waitsFor(function () {
        return (app.main.currentView && app.main.currentView.main && app.main.currentView.main.currentView);
      }, 'history started');

      runs(function () {
        var cardsMethod = require('js/cards');
        app.main.currentView.main.currentView.setHandler();
        newCard = {
          name: 'Dadhboard Test',
          id: 'dashboard_test',
          dashboard: {
            order: 150,
            view: 'dashboard/dashboard'
          }
        };
        main = app.main.currentView.main.currentView;
        cardsMethod.add(newCard);
        cardsMethod.deploy();
      });

      waitsFor(function () {
        return !!main.$el.find('#card-dashboard_test').html();
      }, 'cards deployed');

      runs(function () {
        var $cards = main.$el.find('.card');
        expect($($cards[0]).attr('id')).toEqual('card-' + cards[1].id);
        expect($($cards[1]).attr('id')).toEqual('card-' + newCard.id);
        expect($($cards[2]).attr('id')).toEqual('card-' + cards[3].id);
        expect($($cards[3]).attr('id')).toEqual('card-' + cards[2].id);
        expect($($cards[4]).attr('id')).toEqual('card-' + cards[0].id);
      });
    });

    it("none order card should be ordered last", function () {
      var cards = require('json!cards/cards.json');

      cards[0].dashboard.order = 200;
      cards[1].dashboard.order = 100;
      delete cards[2].dashboard.order;
      cards[3].dashboard.order = 300;

      define('cards/dashboard_test/dashboard/dashboard', ['js/views/card/itemview'], function (ItemView) {
        return ItemView.extend({
          initialize: function (options) {
            ItemView.prototype.initialize.apply(this, arguments);
          },
          template: '<span>TEST</span>'
        });
      });

      var app, cards, flag, newCard;

      reRequireModule(['js/commands', 'js/vent', 'js/cards', 'js/app', 'js/router/router', 'js/router/controller', 'js/views/dashboard/layout', 'js/views/dashboard/main'])

      runs(function () {
        app = require('js/app');
        app.stop();
      });

      waitsFor(function () {
        return !Backbone.History.started;
      }, 'history stopped');

      runs(function () {
        app.start({
          cards: cards
        });
      })

      waitsFor(function () {
        return (app.main.currentView && app.main.currentView.main && app.main.currentView.main.currentView);
      }, 'history started');

      runs(function () {
        var cardsMethod = require('js/cards');
        app.main.currentView.main.currentView.setHandler();
        newCard = {
          name: 'Dadhboard Test',
          id: 'dashboard_test',
          dashboard: {
            view: 'dashboard/dashboard'
          }
        };
        main = app.main.currentView.main.currentView;
        cardsMethod.add(newCard);
        cardsMethod.deploy();
      });

      waitsFor(function () {
        return !!main.$el.find('#card-dashboard_test').html();
      }, 'cards deployed');

      runs(function () {
        var $cards = main.$el.find('.card');
        expect($($cards[0]).attr('id')).toEqual('card-' + cards[1].id);
        expect($($cards[1]).attr('id')).toEqual('card-' + cards[0].id);
        expect($($cards[2]).attr('id')).toEqual('card-' + cards[3].id);
        expect($($cards[3]).attr('id')).toEqual('card-' + cards[2].id);
        expect($($cards[4]).attr('id')).toEqual('card-' + newCard.id);
      });
    });

    afterEach(function () {
      main.$el.remove();
      reRequireModule(['js/commands']);
    });
  });
});
