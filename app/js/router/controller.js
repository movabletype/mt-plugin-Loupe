define(['backbone.marionette', 'js/l10n', 'js/cache', 'js/mtapi', 'js/commands', 'js/vent', 'js/mtapi/user', 'js/mtapi/blogs', 'js/mtapi/blog', 'js/mtapi/logout'],

function (Marionette, L10N, cache, mtapi, commands, vent, getUser, getBlogsList, getBlog, logout) {
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
          var l10n = this.l10n = this.l10n || new L10N(user.language);
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
            if (!this.blog || this.blog.id !== currentBlogId) {
              this.blog = getBlog(currentBlogId);
            }

            this.blog.fail(_.bind(function (resp) {
              delete this.blog;
              callback = function (data) {
                var params = data || {};
                commands.execute('move:dashboard', params);
              };
              finalize(user, {
                error: resp.error
              });
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

    logout: function () {
      logout().done(_.bind(function () {
        localStorage.removeItem('currentBlogId');
        localStorage.removeItem('recentBlogHistory');
        delete this.token;
        cache.clearAll();
        vent.trigger('after:logout');
        commands.execute('router:navigate', '');
      }, this));
    },

    initialize: function (options) {
      commands.setHandler('l10n', _.bind(function (callback) {
        this.l10n.waitLoadCommon(callback);
      }, this));

      var cards = options.cards;
      var methodFactory = _.bind(function (command, card) {
        return _.bind(function () {
          var routes = [].slice.call(arguments, 0);
          this.auth(function (data) {
            var params = _.extend({}, data, {
              routes: routes,
              card: card
            });
            commands.execute(command, params);
          });
        }, this);
      }, this);

      _.forEach(cards, function (card) {
        if (card.routes && card.routes.length) {
          _.each(card.routes, function (route) {
            var routeMethodName = 'moveCardPage_' + card.id + route.id;
            this[routeMethodName] = methodFactory('move:cardView:' + card.id + ':' + route.id, card);
          }, this)
        }
      }, this);
    },
    moveDashboard: function () {
      var routes = [].slice.call(arguments, 0);
      this.auth(function (data) {
        var params = _.extend({}, data, {
          routes: routes
        });
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
