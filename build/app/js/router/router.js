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
    initialize: function (options) {
      this.options = options;
      this.reservedRoutes = _.keys(appRoutes);
      this.setHandlers();
    },
    setHandlers: function () {
      commands.setHandlers({
        'router:addRoute': {
          context: this,
          callback: function (card, route, callback) {
            this.addRoute(card, route);
            if (callback) {
              callback();
            }
          }
        },
        'router:navigate': {
          context: this,
          callback: function (dest) {
            if (dest !== null && dest !== undefined) {
              commands.execute('app:beforeTransition');
              this.navigate(dest, true);
            }
          }
        }
      });
    },
    addRoute: function (card, route) {
      var routeName = route.route ? card.id + '/' + route.route : card.id;
      var routeMethodName = 'move:cardView:' + card.id + ':' + route.id;
      if (_.contains(this.reservedRoutes, routeName)) {
        console.log('card ID "' + card.id + '" is about to use reserved route, "' + routeName + '". you must change this route');
      } else {
        this._getController().addCardViewMethod(card, routeMethodName);
        this.appRoute(routeName, routeMethodName);
      }
    }
  });
});
