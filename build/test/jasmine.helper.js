Mock = {};
DEBUG = true;
window.jasmineRequirePath = '';

require(['jquery'], function ($) {
  $(document.body).append('<div id="container"><div id="menu"></div><div id="app"></div></div><div id="app-building"></div>');
});

require(['json!cards/cards.json', 'js/mtapi/mock', 'app', 'js/boot']);

// initialzing module in case which is not required yet.

function requireModuleAndWait(path) {
  var flag;
  path = typeof path === 'string' ? [path] : path;
  require(path, function () {
    flag = true;
  });
  waitsFor(function () {
    return flag;
  }, 'requiring ' + path, 3000);
}

function resetMock() {
  window.Mock = {};
}

function undefRequireModule(path) {
  path = typeof path === 'string' ? [path] : path;
  _.forEach(path, function (p) {
    require.undef(p);
    $('script[src$="' + p + '.js"]').remove();
  });
}

function reRequireModule(path) {
  path = typeof path === 'string' ? [path] : path;
  undefRequireModule(path);
  requireModuleAndWait(path);
}

function initCommands(commandSpies, spyTarget, controller) {
  spyTarget = spyTarget || ['command'];
  reRequireModule(['js/commands']);
  //  commandSpies = jasmine.createSpyObj('commandSpies', spyTarget);
  var flag;
  runs(function () {
    var commandsOrig = require('js/commands');
    var commands = _.clone(commandsOrig);
    commands.execute = function (command, data) {
      if (command === 'l10n' && controller) {
        controller.l10n.waitLoadCommon(data);
      } else {
        commandsOrig.execute.apply(commandsOrig, arguments);
      }
      if (commandSpies[command]) {
        commandSpies[command](data);
      }
    };
    commands.commandsOrig = commandsOrig;
    commands.foobar = 'yes I\'m foobar'
    undefRequireModule('js/commands');
    window.define('js/commands', [], function () {
      return commands;
    });
  });
}

function initController(Controller, controller, callback, cards, router) {
  var options = cards ? {
    cards: cards
  } : {};

  if (!controller) {
    Controller = require('js/router/controller');
    controller = new Controller(options);
  }

  if (router) {
    var AppRouter = require('js/router/router')
    new AppRouter({
      controller: controller
    });
  }

  controller.auth(function (data) {
    data = _.extend({}, data);
    if (cards && cards.length) {
      data.card = cards[0];
    }
    callback(data, controller);
  });
};

function fakeCardPath(controller) {
  var origFunc = controller.l10n.load;
  spyOn(controller.l10n, 'load').andCallFake(function (path, namespace) {
    return origFunc.call(controller.l10n, '/spec/' + path, namespace);
  });
};

function backToDashboard($el, initData) {
  if ($el) {
    $el.remove();
  }
  runs(function () {
    require('js/commands').execute('move:dashboard', initData);
  });
};

function insertSpy(path, spy) {
  runs(function () {
    var origFunc = require(path);
    undefRequireModule(path);
    define(path, [], function () {
      var ext = {}
      for (var key in spy) {
        if (spy.hasOwnProperty(key)) {
          ext[key] = function (k, p) {
            return function () {
              var temp = origFunc.prototype[k].apply(this, [].slice.call(arguments));
              spy[k].apply(spy, arguments);
              return temp;
            }
          }(key, path)
        }
      }
      return origFunc.extend(ext);
    });
    requireModuleAndWait([path]);
  });
};

function assertRefetch(view) {
  var $target = view.$el.find('.refetch');
  expect($target.length).toBeTruthy();
  var event = $.Event('tap', {
    currentTarget: $target.get(0)
  });
  $target.trigger(event);
  return $target;
}
