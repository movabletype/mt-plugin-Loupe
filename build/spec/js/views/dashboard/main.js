describe("views", function () {
  'use strict';

  describe("dashboard/main", function () {
    var Main, main, initData;
    var Controller, controller;

    var commandsOrig = require('js/commands');
    var commands = _.clone(commandsOrig);
    var commandSpy = jasmine.createSpy('commandSpy');
    var flagAfterL10N;
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

    reRequireModule(['js/router/controller', 'js/views/dashboard/main', 'js/views/card/itemview']);

    var initialize = function (cards, noUser) {
      var flag;

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
          console.log('fofo')
          console.log(dataClone)
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
    }

    beforeEach(function () {
      flagAfterL10N = null;
    })

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
      })

      var cards = [{
        "name": "Dashboard Test",
        "id": "dashboard_test",
        "dashboard": {
          "view": "dashboard/dashboard"
        }
      }];

      initialize(cards);

      waitsFor(function () {
        return cardSpy.calls && cardSpy.calls.length
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
          return '<div id="dashboardtest-template"></div>'
        });
        t.registerPartial("cards_dashboardtest_dashboard_template", s);
        return s
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
        return cardSpy.calls && cardSpy.calls.length
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
        return cardSpy.calls && cardSpy.calls.length
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
      })

      var cards = [{
        "name": "Dashboard Test",
        "id": "dashboard_test",
        "dashboard": {
          "view": "dashboard/dashboard"
        }
      }];

      initialize(cards, true);

      waitsFor(function () {
        return main.render.calls && main.render.calls.length
      }, 'cardSpy called', 3000);

      runs(function () {
        expect($('#card-dashboard_test').length).not.toBeTruthy();
        expect(cardSpy).not.toHaveBeenCalled();
        expect(main.render).toHaveBeenCalled();
      });
    });


    afterEach(function () {
      main.$el.remove();
    })
  });
});
