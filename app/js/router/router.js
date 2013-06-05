define(['backbone.marionette', 'js/commands'],

function (Marionette, commands) {
  'use strict';

  var appRoutes = {
    '': 'moveDashboard',
    '_login': 'authorizationCallback'
  };

  return Marionette.AppRouter.extend({
    appRoutes: appRoutes,
    initialize: function (options, cards) {
      _.forEach(cards, function (card) {
        if (card.id && (card.viewTemplate || card.viewView)) {
          var name;
          if (card.viewRoute) {
            name = card.id + '/' + card.viewRoute;
          } else {
            name = card.id;
          }
          var methodName = 'moveCardPage_' + card.id;
          var controller = options.controller;
          this.route(name, methodName, _.bind(controller[methodName], controller));
        }
      }, this);

      commands.setHandler('router:navigate', function (dest) {
        if (dest !== null && dest !== undefined) {
          this.navigate(dest, true);
        }
      }, this);
    }
  });
});
