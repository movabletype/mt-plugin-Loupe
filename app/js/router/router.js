define(['backbone.marionette', 'js/vent'],

function (Marionette, vent) {
  'use strict';

  var appRoutes = {
    '': 'moveDashboard'
  };

  return Marionette.AppRouter.extend({
    appRoutes: appRoutes,
    initialize: function (options, widgets) {
      _.forEach(widgets, function (widget) {
        if (widget.id && (widget.viewTemplate || widget.viewView)) {
          var name = widget.id;
          var methodName = 'moveWidgetPage_' + name;
          var controller = options.controller;
          this.route(name, methodName, _.bind(controller[methodName], controller));
        }
      }, this);

      vent.on('navigate', function (dest) {
        if (dest) {
          this.navigate(dest, true);
        }
      }, this);
    }
  });
});