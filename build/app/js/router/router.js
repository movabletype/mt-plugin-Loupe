define(['backbone.marionette', 'js/commands'],

function (Marionette, commands) {
  'use strict';

  var appRoutes = {
    '': 'moveDashboard',
    'logout': 'logout',
    '_login': 'authorizationCallback'
  };

  return Marionette.AppRouter.extend({
    appRoutes: appRoutes,
    initialize: function (options, cards) {
      _.forEach(cards, function (card) {
        if (card.id) {
          var controller = options.controller;
          if (card.routes && card.routes.length) {
            _.each(card.routes, function (route) {
              var routeName = route.route ? card.id + '/' + route.route : card.id;
              var routeMethodName = 'moveCardPage_' + card.id + route.id;
              this.route(routeName, routeMethodName, _.bind(controller[routeMethodName], controller));
            }, this);
          }
        }
      }, this);

      commands.setHandler('router:navigate', function (dest) {
        if (dest !== null && dest !== undefined) {
          commands.execute('app:beforeTransition');
          this.navigate(dest, true);
        }
      }, this);
    }
  });
});
