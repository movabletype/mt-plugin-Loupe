define(['backbone.marionette', 'js/commands'],

function (Marionette, commands) {
  'use strict';

  var appRoutes = {
    '': 'moveDashboard',
    '_login': 'authorizationCallback'
  };

  return Marionette.AppRouter.extend({
    appRoutes: appRoutes,
    initialize: function (options, widgets) {
      _.forEach(widgets, function (widget) {
        if (widget.id && (widget.viewTemplate || widget.viewView)) {
          var name;
          if (widget.viewRoute) {
            name = widget.id + '/' + widget.viewRoute;
          } else {
            name = widget.id;
          }
          var methodName = 'moveWidgetPage_' + widget.id;
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