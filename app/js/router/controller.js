define(['backbone', 'backbone.marionette', 'js/l10n', 'js/mtapi', 'js/commands', 'js/vent', 'js/mtapi/user', 'js/mtapi/blogs', 'js/mtapi/blog'],

function (Backbone, Marionette, L10N, mtapi, commands, vent, getUser, getBlogsList, getBlog) {
  "use strict";
  return Marionette.Controller.extend({
    auth: function (callback) {
      var getUserAndBlogs = _.bind(function (callback) {
        this.user = this.user || getUser();

        this.user.fail(_.bind(function () {
          delete this.user;
          this.authorization();
        }, this));

        this.user.done(_.bind(function (user) {
          var l10n = this.l10n = this.l10n || new L10N('ja');
          var currentBlogId = parseInt(localStorage.getItem('currentBlogId'), 10) || null;

          var finalize = function (user, blog, blogs) {
            if ($('#app-building').length) {
              l10n.waitLoadCommon(function () {
                $('#app-building').remove();
                vent.trigger('app:building:after', {
                  userId: user.id,
                  blogId: blog.id,
                  user: user,
                  blog: blog,
                  blogs: blogs
                });
              });
            }
            callback({
              userId: user.id,
              blogId: blog.id,
              user: user,
              blog: blog,
              blogs: blogs
            });
          };

          if (currentBlogId) {
            this.blog = this.blog || getBlog(currentBlogId);

            this.blog.fail(_.bind(function () {
              delete this.blog;
            }, this));

            this.blog.done(_.bind(function (blog) {
              finalize(user, blog);
            }, this));
          } else {
            this.blogs = this.blogs || getBlogsList(user.id);

            this.blogs.fail(_.bind(function () {
              delete this.blogs;
            }, this));

            this.blogs.done(_.bind(function (blogs) {
              if (blogs.items && blogs.items.length) {
                finalize(user, blogs.items[0], blogs);
              }
            }, this));
          }
        }, this));
      }, this);

      if (this.token) {
        if (DEBUG) {
          console.log('user already has token (authed)');
          console.log(this.token);
        }
        getUserAndBlogs(callback);
      } else {
        mtapi.api.token(_.bind(function (res) {
          if (!res.error) {
            if (DEBUG) {
              console.log('[mtapi:token:success]');
              console.log(res);
            }
            this.token = res;
            getUserAndBlogs(callback);
          } else {
            if (DEBUG) {
              console.log('[mtapi:token:error]');
              console.log(res.error);
              console.log('Move to Signin screen');
            }
            this.authorization();
          }
        }, this));
      }
    },
    authorization: function () {
      var hash = location.href.lastIndexOf('#'),
        route = hash !== -1 ? location.href.slice(hash + 1) : '';

      window.sessionStorage.setItem('routeCache', route);
      location.replace(mtapi.api.getAuthorizationUrl(location.href));
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

      commands.setHandler('l10n', _.bind(function (callback) {
        this.l10n.waitLoadCommon(callback);
      }, this));

      var cards = options.cards;
      _.forEach(cards, function (card) {
        var methodName = 'moveCardPage_' + card.id;
        this[methodName] = function () {
          var params = [].slice.call(arguments, 0);
          this.auth(function (data) {
            params = _.extend(params, data);
            commands.execute('move:card', {
              to: 'card',
              card: card,
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
