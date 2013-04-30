define(['jquery', 'backbone.marionette', 'js/mtapi', 'js/vent'],

function ($, Marionette, mtapi, vent) {
  "use strict";
  return Marionette.Controller.extend({
    auth: function (callback, route) {
      var accessTokenCookie = $.cookie('mt_api_access_token_default') || $.cookie('mt_api_access_token');
      if (accessTokenCookie && this.token && this.token.expire && this.token.expire > Date.now()) {
        if (DEBUG) {
          console.log(accessTokenCookie);
          console.log(this.token);
        }
        $('#app-building').remove();
        callback();
      } else {
        var that = this;
        mtapi.api.token(function (res) {
          if (!res.error) {
            if (DEBUG) {
              console.log(res);
            }
            res.expire = Date.now() + res.expires_in * 1000;
            that.token = res;
            $('#app-building').remove();
            callback();
          } else {
            if (DEBUG) {
              console.log(res.error);
              console.log('move to Signin screen');
            }
            route = route || '';
            window.sessionStorage.setItem('currentRoute', route);
            location.replace(mtapi.baseUrl + '/v' + mtapi.api.getVersion() + '/authorization?redirect_uri=' + location.href);
          }
        });
      }
    },
    initialize: function (options) {
      var widgets = options.widgets;
      _.forEach(widgets, function (widget) {
        var methodName = 'moveWidgetPage_' + widget.id;
        this[methodName] = function () {
          this.auth(function () {
            vent.trigger('app:move', {
              to: 'widget',
              widget: widget
            });
          }, widget.id);
        };
      }, this);
    },
    moveDashboard: function () {
      this.auth(function () {
        vent.trigger('app:move', {
          to: 'dashboard'
        });
      }, null);
    },
    authorizationCallback: function () {
      var route = window.sessionStorage.getItem('currentRoute');
      if (route) {
        window.sessionStorage.removeItem('currentRoute');
        vent.trigger('router:navigate', route);
      } else {
        // move dashboard
        var href = location.href.replace(/#.*$/, '');
        location.replace(href);
      }
    }
  });
});