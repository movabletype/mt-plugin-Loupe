define(['backbone.marionette', 'js/l10n', 'js/cache', 'js/mtapi', 'js/commands', 'js/vent', 'js/mtapi/user', 'js/collections/blogs', 'js/models/blog', 'js/mtapi/signout'],

  function (Marionette, L10N, cache, mtapi, commands, vent, getUser, BlogCollection, BlogModel, signout) {
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
            this.authenticate();
          }, this));

          dfd.done(_.bind(function (user) {
            cache.set('user', 'user', user);
            var l10n = this.l10n = this.l10n || new L10N(user.language);
            var currentBlogId = parseInt(localStorage.getItem('currentBlogId'), 10) || null;

            var finalize = function (user, blog, blogs) {
              var initialBuild = cache.get('app', 'initial');
              if (initialBuild || initialBuild === null) {
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

            var blogError, blogSuccess,
              blogCollection = cache.get('user', 'blogs') || cache.set('user', 'blogs', new BlogCollection());

            if (currentBlogId) {
              var blogModel = blogCollection.get(currentBlogId);

              blogSuccess = _.bind(function (blogModel) {
                finalize(user, blogModel.toJSON());
              }, this);

              blogError = _.bind(function (blogModel, resp) {
                if (DEBUG) {
                  console.log('get blog fail');
                  console.log(blogModel);
                }
                callback = function (data) {
                  data = data || {};
                  commands.execute('move:dashboard', data);
                };
                finalize(user, {
                  error: resp.error
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
              blogError = _.bind(function (collection, resp) {
                if (DEBUG) {
                  console.log('get blog list fail');
                  console.log(resp);
                }
                cache.clear('user', 'blogs');
                callback = function (data) {
                  data = data || {};
                  commands.execute('move:dashboard', data);
                };
                finalize(user, {
                  error: resp.error
                });
              }, this);

              blogSuccess = _.bind(function (blogCollection) {
                var blogs = blogCollection.toJSON();
                if (blogs.length) {
                  finalize(user, blogs[0], blogs);
                } else {
                  blogError(blogCollection, {
                    error: {
                      message: 'You have no blog to show in Loupe'
                    }
                  });
                }
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
          var resp = mtapi.api.getTokenData();
          if (resp) {
            if (DEBUG) {
              console.log('getTokenData success');
              console.log(resp);
            }
            if (window.sessionStorage.getItem('routeCache') !== undefined) {
              window.sessionStorage.removeItem('routeCache');
            }
            if (window.sessionStorage.getItem('authRetry') !== undefined) {
              window.sessionStorage.removeItem('authRetry');
            }
            this.token = resp;
            getUserAndBlogs(callback);
          } else {
            // assume user have never been authorized
            this.authenticate();
          }
        }
      },

      signin: function () {
        commands.execute('move:signin');
      },

      authenticate: function () {
        var hash = location.href.lastIndexOf('#'),
          route = hash !== -1 ? location.href.slice(hash + 1) : '';

        if (route !== 'signin') {
          window.sessionStorage.setItem('routeCache', route);
          commands.execute('router:navigate', 'signin');
        } else {
          this.signin();
        }
      },

      signout: function () {
        signout().done(_.bind(function () {
          localStorage.removeItem('currentBlogId');
          localStorage.removeItem('recentBlogHistory');
          delete this.token;
          cache.clearAll();
          vent.trigger('after:signout');
          commands.execute('router:navigate', 'signin');
        }, this));
      },

      initialize: function (options) {
        commands.setHandler('l10n', _.bind(function (callback) {
          if (this.l10n) {
            this.l10n.waitLoadCommon(callback);
          }
        }, this));

        commands.setHandler('authorizationCallback', _.bind(function () {
          this.authorizationCallback();
        }, this));

        commands.setHandler('addCardViewMethod', _.bind(function (card) {
          this.addCardViewMethod(card);
        }, this))

        mtapi.api.on('authorizationRequired', _.bind(function (resp) {
          if (DEBUG) {
            console.log('getTokenData error');
            console.log(resp.error);
          }
          var authRetry = window.sessionStorage.getItem('authRetry') || 0;
          if (authRetry < 1) {
            if (resp.error && parseInt(resp.error.code, 10) === 0 && resp.error.message) {
              // error handling for SPDY, case https://movabletype.fogbugz.com/default.asp?110201
              commands.execute('app:error', {
                blog: {
                  error: {
                    message: resp.error.message
                  }
                }
              });
            } else {
              authRetry = parseInt(authRetry, 10) + 1;
              window.sessionStorage.setItem('authRetry', authRetry);
              this.authenticate();
            }
          } else {
            if (DEBUG) {
              console.log('user retries signin for ' + authRetry + ' times, so giving up signin');
            }
            var message = 'authorizationRequired error occured over time for some reason';
            window.sessionStorage.removeItem('authRetry');
            commands.execute('app:error', {
              blog: {
                error: {
                  message: message
                }
              }
            });
          }
        }, this));

        _.forEach(options.cards, function (card) {
          this.addCardViewMethod(card);
        }, this);
      },
      addCardViewMethod: function (card) {
        if (card.routes && card.routes.length) {
          _.each(card.routes, function (route) {
            var routeMethodName = 'moveCardPage_' + card.id + route.id;
            if (!this[routeMethodName]) {
              this[routeMethodName] = _.bind(function () {
                var routes = [].slice.call(arguments, 0);
                this.auth(function (data) {
                  var params = _.extend({}, data, {
                    routes: routes,
                    card: card
                  });
                  commands.execute('move:cardView:' + card.id + ':' + route.id, params);
                });
              }, this);
            }
          }, this);
        }
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
        commands.execute('router:navigate', route);
      }
    });
  });
