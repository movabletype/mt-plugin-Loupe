define(['backbone.marionette', 'js/commands'], function (Marionette, commands) {
  'use strict';

  var appRoutes = {
    '': 'moveDashboard',
    'signout': 'signout',
    'signin': 'signin',
    '_login': 'authorizationCallback'
  };

  return Marionette.AppRouter.extend({
    appRoutes: appRoutes,
    initialize: function (options, cards) {
      this.options = options;

      this.reservedRoutes = _.keys(appRoutes);
      _.forEach(cards, function (card) {
        if (card.id && card.routes && card.routes.length) {
          _.each(card.routes, function (route) {
            this.addRoute(card, route);
          }, this);
        }
      }, this);

      commands.setHandler('router:addRoute', _.bind(function (card, route, callback) {
        this.addRoute(card, route);
        if (callback) {
          callback();
        }
      }, this));

      commands.setHandler('router:navigate', function (dest) {
        if (dest !== null && dest !== undefined) {
          commands.execute('app:beforeTransition');
          this.navigate(dest, true);
        }
      }, this);
    },
    addRoute: function (card, route) {
      var routeName = route.route ? card.id + '/' + route.route : card.id;
      var routeMethodName = 'move:cardView:' + card.id + ':' + route.id;
      if (_.contains(this.reservedRoutes, routeName)) {
        console.log('card ID "' + card.id + '" is about to use reserved route, "' + routeName + '". you must change this route');
      } else {
        this.appRoute(routeName, routeMethodName);
      }
    }
  });
});
