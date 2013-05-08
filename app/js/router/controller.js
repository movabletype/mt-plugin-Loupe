define(['jquery', 'backbone', 'backbone.marionette', 'js/mtapi', 'js/commands', 'js/mtapi/user', 'js/mtapi/blogs'],

function ($, Backbone, Marionette, mtapi, commands, userApi, blogsApi) {
  "use strict";
  return Marionette.Controller.extend({
    auth: function (callback) {
      var getUserAndBlogs = _.bind(function (callback) {
        this.user = this.user || userApi();
        this.user.done(function (user) {
          this.blogs = this.blogs || blogsApi(user.id);
          this.blogs.done(function (blogs) {
            $('#app-building').remove();
            callback({
              userId: user.id,
              blogId: blogs.items[0].id
            });
          });
        });
      }, this);

      if (this.token && this.token.expire && this.token.expire > Date.now()) {
        if (DEBUG) {
          console.log('user already has token, so skip request token');
          console.log(this.token);
        }
        getUserAndBlogs(callback);
      } else {
        mtapi.api.token(_.bind(function (res) {
          if (!res.error) {
            if (DEBUG) {
              console.log('got token successfully');
              console.log(res);
            }
            res.expire = Date.now() + res.expires_in * 1000;
            this.token = res;
            getUserAndBlogs(callback);
          } else {
            if (DEBUG) {
              console.log(res.error);
              console.log('Requesting token is failed. Move to Signin screen');
            }
            var hash = location.href.indexOf(/#/);
            var route = hash !== -1 ? location.href.slice(hash + 1) : '';
            window.sessionStorage.setItem('routeCache', route);
            location.replace(mtapi.baseUrl + '/v' + mtapi.api.getVersion() + '/authorization?redirect_uri=' + location.href);
          }
        }, this));
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
          });
        };
      }, this);
    },
    moveDashboard: function () {
      this.auth(function (data) {
        var params = {};
        params.userId = data.userId;
        params.blogId = data.blogId;
        commands.execute('move:dashboard', params);
      });
    },
    authorizationCallback: function () {
      var route = window.sessionStorage.getItem('routeCache') || '';
      window.sessionStorage.removeItem('routeCache');
      commands.execute('router:navigate', route);
    }
  });
});