define(['jquery', 'backbone.marionette', 'js/mtapi', 'js/commands'],

function ($, Marionette, mtapi, commands) {
  "use strict";
  return Marionette.Controller.extend({
    auth: function (callback, route) {
      var that = this;
      var accessTokenCookie = $.cookie('mt_api_access_token_default') || $.cookie('mt_api_access_token');
      if (accessTokenCookie && this.token && this.token.expire && this.token.expire > Date.now()) {
        if (DEBUG) {
          console.log(accessTokenCookie);
          console.log(this.token);
        }
        mtapi.api.getUser('me', function (resp) {
          console.log(resp)
          that.userId = resp.id;
          mtapi.api.listBlogs(that.userId, function (resp) {
            console.log(resp)
            that.blogId = resp.items[0].id;
            $('#app-building').remove();
            callback({
              userId: that.userId,
              blogId: that.blogId
            });
          })
        })
      } else {
        mtapi.api.token(function (res) {
          if (!res.error) {
            if (DEBUG) {
              console.log(res);
            }
            res.expire = Date.now() + res.expires_in * 1000;
            that.token = res;
            mtapi.api.getUser('me', function (resp) {
              console.log(resp)
              that.userId = resp.id;
              mtapi.api.listBlogs(that.userId, function (resp) {
                console.log(resp)
                that.blogId = resp.items[0].id;
                $('#app-building').remove();
                callback({
                  userId: that.userId,
                  blogId: that.blogId
                });
              })
            })
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
          var params = [].slice.call(arguments, 0);
          this.auth(function (data) {
            params.userId = data.userId;
            params.blogId = data.blogId;
            commands.execute('move:widget', {
              to: 'widget',
              widget: widget,
              params: params
            });
          }, widget.id);
        };
      }, this);
    },
    moveDashboard: function () {
      this.auth(function (data) {
        var params = {}
        params.userId = data.userId;
        params.blogId = data.blogId;
        commands.execute('move:dashboard', params);
      }, null);
    },
    authorizationCallback: function () {
      var route = window.sessionStorage.getItem('currentRoute') || '';
      window.sessionStorage.removeItem('currentRoute');
      commands.execute('router:navigate', route);
    }
  });
});