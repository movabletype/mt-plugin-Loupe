define(['jquery', 'backbone', 'backbone.marionette', 'js/mtapi', 'js/commands', 'js/vent', 'js/mtapi/user', 'js/mtapi/blogs'],

function ($, Backbone, Marionette, mtapi, commands, vent, userApi, blogsApi) {
  "use strict";
  return Marionette.Controller.extend({
    auth: function (callback) {
      var getUserAndBlogs = _.bind(function (callback) {
        this.user = this.user || userApi();

        this.user.fail(_.bind(function () {
          delete this.user;
          this.authorization();
        }, this));

        this.user.done(_.bind(function (user) {
          this.blogs = this.blogs || blogsApi(user.id);

          this.blogs.fail(_.bind(function () {
            delete this.blogs;
          }));

          this.blogs.done(_.bind(function (blogs) {
            var blog;
            var currentBlogId = localStorage.getItem('currentBlogId') || null;
            if (currentBlogId) {
              blog = _.find(blogs.items, function (b) {
                return b.id === currentBlogId;
              });
            } else {
              if (blogs.items && blogs.items.length) {
                blog = blogs.items[0];
              }
            }
            if ($('#app-building').length) {
              $('#app-building').remove();
              vent.trigger('app:building:after', {
                user: user,
                blogs: blogs,
                blog: blog
              });
            }
            callback({
              userId: user.id,
              blogId: blog.id,
              user: user,
              blog: blog
            });
          }, this));
        }, this));
      }, this);

      if (this.token && this.token.expire && this.token.expire > new Date()) {
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
            res.expire = new Date() + parseInt(res.expires_in, 10) * 1000;
            this.token = res;
            getUserAndBlogs(callback);
          } else {
            if (DEBUG) {
              console.log(res.error);
              console.log('Requesting token is failed. Move to Signin screen');
            }
            this.authorization();
          }
        }, this));
      }
    },
    authorization: function () {
      var hash = location.href.lastIndexOf('#');
      var route = hash !== -1 ? location.href.slice(hash + 1) : '';
      window.sessionStorage.setItem('routeCache', route);
      location.replace(mtapi.baseUrl + '/v' + mtapi.api.getVersion() + '/authorization?redirect_uri=' + location.href);
    },
    initialize: function (options) {
      commands.setHandler('controller:getUser', _.bind(function (callback) {
        this.user.done(_.bind(function (user) {
          callback(user);
        }, this));
      }, this));

      commands.setHandler('controller:getBlogList', _.bind(function (callback) {
        this.blogs.done(_.bind(function (blogs) {
          callback(blogs);
        }, this));
      }, this));

      var widgets = options.widgets;
      _.forEach(widgets, function (widget) {
        var methodName = 'moveWidgetPage_' + widget.id;
        this[methodName] = function () {
          var params = [].slice.call(arguments, 0);
          this.auth(function (data) {
            params = _.extend(params, data);
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
        var params = data || {};
        commands.execute('move:dashboard', params);
      });
    },
    authorizationCallback: function () {
      var route = window.sessionStorage.getItem('routeCache') || '';
      this.auth(function () {
        window.sessionStorage.removeItem('routeCache');
        commands.execute('router:navigate', route);
      });
    }
  });
});
