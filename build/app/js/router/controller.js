define(['backbone.marionette', 'js/l10n', 'js/cache', 'js/mtapi', 'js/commands', 'js/vent', 'js/mtapi/user', 'js/collections/blogs', 'js/models/blog', 'js/mtapi/logout'],

function (Marionette, L10N, cache, mtapi, commands, vent, getUser, BlogCollection, BlogModel, logout) {
  "use strict";
  return Marionette.Controller.extend({
    auth: function (callback) {
      var getUserAndBlogs = _.bind(function (callback) {
        var dfd,
          user = cache.get('user', 'user');

        if (user) {
          dfd = $.Deferred();
          dfd.resolve(user);
        } else {
          dfd = getUser();
        }

        dfd.fail(_.bind(function (user) {
          cache.clear('user', 'user');
          if (DEBUG) {
            console.log(user);
          }
          this.authorization();
        }, this));

        dfd.done(_.bind(function (user) {
          cache.set('user', 'user', user);
          var l10n = this.l10n = this.l10n || new L10N(user.language);
          var currentBlogId = parseInt(localStorage.getItem('currentBlogId'), 10) || null;

          var finalize = function (user, blog, blogs) {
            if (cache.get('app', 'initial')) {
              l10n.waitLoadCommon(function () {
                commands.execute('app:buildMenu', {
                  userId: user.id,
                  blogId: blog.id,
                  user: user,
                  blog: blog,
                  blogs: blogs
                });
                cache.set('app', 'initial', false);
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

          var blog, blogError, blogSuccess,
            blogCollection = cache.get('user', 'blogs') || cache.set('user', 'blogs', new BlogCollection());

          if (currentBlogId) {
            var blogModel = blogCollection.get(currentBlogId);

            blogSuccess = _.bind(function (blogModel) {
              finalize(user, blogModel.toJSON());
            }, this),
            blogError = _.bind(function (blogModel) {
              if (DEBUG) {
                console.log('get blog fail');
                console.log(blogModel);
              }
              callback = function (data) {
                data = data || {};
                commands.execute('move:dashboard', data);
              };
              finalize(user, {
                error: blogModel.error
              });
            }, this);

            if (blogModel) {
              blogSuccess(blogModel);
            } else {
              blogModel = new BlogModel({
                id: currentBlogId
              });
              blogModel.fetch({
                success: blogSuccess,
                error: blogError
              });
            }
          } else {
            blogError = _.bind(function (resp) {
              if (DEBUG) {
                console.log('get blog list fail');
                console.log(resp);
              }
              cache.clear('user', 'blogs');
            }, this);

            blogSuccess = _.bind(function (blogCollection) {
              var blogs = blogCollection.toJSON();
              blog = blogs.length ? blogs[0] : null;
              finalize(user, blog, blogs);
            }, this);

            if (blogCollection.length) {
              blogSuccess(blogCollection);
            } else {
              blogCollection.fetch({
                userId: user.id,
                success: blogSuccess,
                error: blogError
              });
            }
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
        mtapi.api.getToken(_.bind(function (res) {
          if (!res.error) {
            if (DEBUG) {
              console.log('getToken success');
              console.log(res);
            }
            this.token = res;
            getUserAndBlogs(callback);
          } else {
            if (DEBUG) {
              console.log('getToken error');
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
        if (this.l10n) {
          this.l10n.waitLoadCommon(callback);
        } else {
          this.auth(_.bind(function () {
            this.l10n.waitLoadCommon(callback);
          }, this));
        }
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
          }, this);
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
