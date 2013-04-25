define(['backbone.marionette', 'js/vent'],

function (Marionette, vent) {
  "use strict";
  return Marionette.Controller.extend({
    initialize: function (options) {
      var widgets = options.widgets;
      _.forEach(widgets, function (widget) {
        var methodName = 'moveWidgetPage_' + widget.id;
        this[methodName] = function () {
          vent.trigger('app:move', {
            to: 'widget',
            widget: widget
          });
        };
      }, this);
    },
    moveDashboard: function () {
      vent.trigger('app:move', {
        to: 'dashboard'
      });
    }
  });
});