define(['js/views/card/itemview', 'json2', 'js/cache', 'js/device', 'js/commands', 'js/vent', 'js/trans', 'js/collections/blogs', 'js/mtapi/blogs', 'js/mtapi/blog', 'hbs!js/views/menu/templates/blogs-list'],

  function (CardItemView, JSON, cache, device, commands, vent, Trans, Collection, getBlogsList, getBlog, template) {
    "use strict";

    return CardItemView.extend({
      serializeData: function () {
        var data = {};

        if (this.trans) {

          if (this.offset === 0) {
            this.next = this.offset + 25 - this.histories.length;
            this.prev = null;
            data.histories = this.histories;
          } else {
            this.next = this.offset + 25;
            this.prev = Math.max(0, this.offset - 25);
            data.histories = [];
          }

          this.blogs = this.collection.toJSON() || [];
          this.blogs = (this.blogs.length > this.offset) ? this.blogs.slice(this.offset, this.next) : [];

          data = _.extend(data, {
            totalResults: parseInt(this.collection.totalResults, 10) || 0,
            blogs: this.blogs,
            user: this.user,
            trans: this.trans,
            next: this.next,
            prev: this.prev,
            blogsLoading: this.blogsLoading ? true : false,
            historiesLoading: this.historiesLoading ? true : false,
            error: this.error
          });
        }
        return data;
      },

      selectCurrentBlog: function (target) {
        target = parseInt((target || this.currentBlogId), 10);

        var selectBlog = _.bind(function (blog) {
          if (parseInt(blog.id, 10) === target) {
            blog.selected = true;
            this.blog = blog;
          } else {
            delete blog.selected;
          }
        }, this);

        _.each(this.blogs, selectBlog);

        if (this.offset === 0) {
          _.each(this.histories, selectBlog);
        }
      },

      template: template,

      initialize: function () {
        CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));

        this.currentBlogId = this.selectedBlogId = parseInt(localStorage.getItem('currentBlogId'), 10) || (this.blog && this.blog.id ? this.blog.id : null);

        this.blogsLoading = true;
        this.collection = cache.get('user', 'blogs') || null;

        this.histories = this.getRecentBlogHistory() || [];
        this.historiesLoading = true;

        this.offset = 0;
        this.prev = null;
        this.next = this.offset + 25 - this.histories.length;

        this.refetchBlogHistoryData();

        commands.execute('l10n', _.bind(function (l10n) {
          this.trans = new Trans(l10n);
          if (this.collection && this.collection.totalResults > this.offset && this.collection.length >= this.offset) {
            this.blogsLoading = false;
            this.selectCurrentBlog(this.currentBlogId);
            this.render();
          } else {
            this.collection = cache.set('user', 'blogs', new Collection());
            this.blogsLoading = true;
            this.fetch();
          }
        }, this));

        commands.setHandler('menu:getRecentBlogHistory', this.getRecentBlogHistory);
        commands.setHandler('menu:setRecentBlogHistory', this.setRecentBlogHistory);
        commands.setHandler('menu:resetRecentBlogHistory', this.resetRecentBlogHistory);
      },

      fetch: function () {
        var options = {
          userId: this.user.id,
          success: _.bind(function () {
            if (DEBUG) {
              console.log('[menu:main:fetch:success]');
            }
            this.selectCurrentBlog(this.currentBlogId);
            this.blogsLoading = false;
            this.render();
          }, this),
          error: _.bind(function (collection, resp) {
            if (DEBUG) {
              console.log('error on fetching');
              console.log(resp);
            }
            this.error = resp ? resp.error : {
              message: ''
            };
            this.blogsLoading = false;
            this.render();
          }, this),
          offset: parseInt(this.offset, 10) || 0,
          limit: this.next - this.offset,
          merge: true,
          remove: false
        };
        if (this.histories && this.histories.length) {
          options.excludeIds = _.map(this.histories, function (b) {
            return b.id;
          }).join(',');
        }
        this.blogsLoading = true;
        this.render();
        this.collection.fetch(options);
      },

      selectBlogHandler: function (bid) {
        var $blogList = this.$el;
        this.selectedBlogId = parseInt(bid, 10);
        $blogList.find('.selected').removeClass('selected');
        $blogList.find('[data-id=' + this.selectedBlogId + ']').addClass('selected');
        this.saveChangesHandler();
      },

      saveChangesHandler: function () {
        if (DEBUG) {
          console.log('switching blog from ' + this.currentBlogId + ' to ' + this.selectedBlogId);
        }
        commands.execute('dashboard:toggle');
        if (this.currentBlogId !== this.selectedBlogId) {
          this.currentBlogId = this.selectedBlogId;
          localStorage.setItem('currentBlogId', this.selectedBlogId);

          this.blog = this.collection.get(this.selectedBlogId);
          this.blog = this.blog ? this.blog.toJSON() : _.find(this.histories, _.bind(function (blog) {
            return parseInt(blog.id, 10) === parseInt(this.selectedBlogId, 10);
          }, this));

          this.setRecentBlogHistory(this.blog);
          this.collection.remove(this.blog);

          this.offset = 0;
          this.selectCurrentBlog(this.currentBlogId);
          this.render();

          setTimeout(_.bind(function () {
            commands.execute('move:dashboard', {
              userId: this.user.id,
              blogId: this.blog.id,
              user: this.user,
              blog: this.blog,
              blogs: this.blogs
            });
          }, this), 300);
        }
      },

      getRecentBlogHistory: function () {
        var str = localStorage.getItem('recentBlogHistory') || '[]';
        return JSON.parse(str);
      },

      setRecentBlogHistory: function (blog) {
        if (DEBUG) {
          console.log('[menu:blog-list:setRecentBlogHistory]');
        }
        var recentBlogHistory = this.getRecentBlogHistory();
        blog = _.extend(blog, {
          selected: false
        });
        recentBlogHistory.unshift(blog);
        recentBlogHistory = _.uniq(recentBlogHistory, function (blog) {
          return blog.id;
        });
        recentBlogHistory = recentBlogHistory.slice(0, 5);
        localStorage.setItem('recentBlogHistory', JSON.stringify(recentBlogHistory));
        this.histories = recentBlogHistory;
      },

      removeRecentBlogHistory: function () {
        localStorage.removeItem('recentBlogHistory');
        this.histories = [];
      },

      refetchBlogHistoryData: function () {
        var params,
          dfd,
          finalize = _.bind(function () {
            this.selectCurrentBlog(this.currentBlogId);
            this.historiesLoading = false;
            this.render();
          }, this);

        if (this.histories.length) {
          params = {
            includeIds: _.map(this.histories, function (blog) {
              return blog.id;
            }).join(',')
          };
          dfd = getBlogsList(this.user.id, params);
          dfd.done(_.bind(function (blogs) {
            var findBlog = function (items, blog) {
              return _.find(items, function (b) {
                return parseInt(b.id, 10) === parseInt(blog.id, 10);
              });
            };

            this.histories = _.map(this.histories, function (history) {
              var blog = findBlog(blogs.items, history);
              if (blog) {
                history = blog;
              } else {
                history.remove = true;
              }
              return history;
            });

            this.histories = _.reject(this.histories, function (history) {
              return history.remove;
            });

            localStorage.setItem('recentBlogHistory', JSON.stringify(this.histories));

            finalize();
          }, this));

          dfd.fail(_.bind(function () {
            console.warn('getBlogList failed at refetchBlogHistoryData, so removing histories');
            // this.removeRecentBlogHistory();
            finalize();
          }, this));
        } else {
          finalize();
        }
      },

      navigationHandler: function () {
        if (this.collection.length > this.offset) {
          this.render();
        } else {
          this.fetch();
        }
      },

      onRender: function () {
        this.$el.find('a').hammer(this.hammerOpts).on('tap', _.bind(function (e) {
          this.addTapClass(e.currentTarget, _.bind(function () {
            var $link = $(e.currentTarget);
            e.preventDefault();
            e.stopPropagation();
            if ($link.data('id') === 'signout') {
              vent.on('after:signout', commands.execute('dashboard:toggle'));
              commands.execute('router:navigate', 'signout');
            } else {
              this.selectBlogHandler($link.data('id'));
            }
            return false;
          }, this));
        }, this));

        this.$el.find('.blog-item-nav').hammer(this.hammerOpts).on('tap', _.bind(function (e) {
          this.addTapClass(e.currentTarget, _.bind(function () {
            this.offset = $(e.currentTarget).data('offset') !== undefined ? parseInt($(e.currentTarget).data('offset'), 10) : this.offset;
            this.offset = this.offset < 0 ? 0 : this.offset;
            this.navigationHandler();
          }, this));
        }, this));

        $('#menu-blogs-list').scrollTop(0);
      }
    });

  });
