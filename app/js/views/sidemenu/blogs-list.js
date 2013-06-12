define(['backbone.marionette', 'json2', 'js/device', 'js/commands', 'js/trans', 'js/collections/blogs', 'js/mtapi/blogs', 'js/mtapi/blog', 'hbs!js/views/sidemenu/templates/blogs-list'],

function (Marionette, JSON, device, commands, Trans, Collection, getBlogsList, getBlog, template) {
  "use strict";

  return Marionette.ItemView.extend({
    serializeData: function () {
      var data = {};
      if (this.trans) {
        var blogs = this.collection.toJSON() || [],
          totalResults = this.collection.totalResults,
          prev;

        if (DEBUG) {
          console.log('[sidemenu:blogs:serializeData]');
          console.log(blogs);
          console.log(totalResults);
        }

        this.histories = this.histories || [];
        this.offset = parseInt(this.offset, 10) || 0;
        this.offset = this.offset < 0 ? 0 : this.offset;

        if (this.offset !== 0) {
          prev = (this.offset - 25 < -1) ? 0 : this.offset - 25;
        }

        this.next = this.offset === 0 ? this.offset + 25 - this.histories.length : this.offset + 25;

        if (blogs.length > this.offset) {
          this.blogsLoading = false;
          this.blogs = blogs.slice(this.offset, this.next);
        } else {
          if (totalResults !== undefined && totalResults < this.offset + this.histories.length) {
            this.blogsLoading = false;
            this.blogs = [];
          } else {
            if (!this.blogLoading) {
              this.blogsLoading = true;
              this.fetch();
            }
          }
        }

        if (!this.blogsLoading && !this.historiesLoading) {
          this.selectCurrentBlog();
        }

        data = {
          totalResults: parseInt(this.collection.totalResults, 10),
          blogs: this.blogs,
          user: this.user,
          trans: this.trans,
          next: this.next,
          prev: prev,
          blogsLoading: this.blogsLoading ? true : false,
          historiesLoading: this.historiesLoading ? true : false
        };

        data.histories = this.offset === 0 ? this.histories : [];
      }

      return data;
    },

    selectCurrentBlog: function (target) {
      target = parseInt((target || this.currentBlogId), 10);
      this.histories = this.getRecentBlogHistory() || [];

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

    collection: new Collection(),

    template: function (data) {
      return template(data);
    },

    blogs: null,

    initialize: function (params) {
      this.user = params.user || null;
      this.blogs = (params.blogs && params.blogs.items) ? params.blogs.items : [];

      this.blog = params.blog || null;
      this.currentBlogId = this.selectedBlogId = parseInt(localStorage.getItem('currentBlogId'), 10) || (this.blog && this.blog.id ? this.blog.id : null);

      this.offset = 0;
      this.blogsLoading = true;

      if (this.blogs.length) {
        this.collection.totalResults = params.blogs.totalResults;
        this.collection.set(this.blogs);
      }

      this.historiesLoading = true;
      this.refetchBlogHistoryData();

      this.trans = null;
      commands.execute('l10n', _.bind(function (l10n) {
        this.trans = new Trans(l10n);
        this.render();
      }, this));

      if (DEBUG) {
        console.log('[sidemenu:blogs:initialize]');
      }

      commands.setHandler('sidemenu:getRecentBlogHistory', this.getRecentBlogHistory);
      commands.setHandler('sidemenu:setRecentBlogHistory', this.setRecentBlogHistory);
      commands.setHandler('sidemenu:resetRecentBlogHistory', this.resetRecentBlogHistory);
    },

    fetch: function () {
      if (this.user && this.user.id) {
        var options = {
          userId: this.user.id,
          success: _.bind(function () {
            if (DEBUG) {
              console.log('[sidemenu:main:fetch:success]');
            }
            this.selectCurrentBlog();
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
        this.collection.fetch(options);
      }
    },

    selectBlogHandler: function (bid) {
      var $blogList = this.$el;
      this.selectedBlogId = parseInt(bid, 10);
      this.selectCurrentBlog(this.selectedBlogId);
      $blogList.find('.selected').removeClass('selected');
      $blogList.find('[data-id=' + this.selectedBlogId + ']').addClass('selected');
      this.saveChagesHandler();
    },

    saveChagesHandler: function () {
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
        this.render();

        setTimeout(_.bind(function () {
          commands.execute('dashboard:rerender', {
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
      return JSON.parse(localStorage.getItem('recentBlogHistory')) || [];
    },

    setRecentBlogHistory: function (blog) {
      if (DEBUG) {
        console.log('[sidemenu:blog-list:setRecentBlogHistory]');
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
      this.histories = this.getRecentBlogHistory() || [];

      var params,
        dfd,
        finalize = _.bind(function () {
          this.historiesLoading = false;
          if (!this.blogsLoading) {
            this.render();
          }
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

          _.each(this.histories, function (history) {
            var blog = findBlog(blogs.items, history);
            if (blog) {
              history = blog;
            } else {
              history.remove = true;
            }
          });

          this.histories = _.reject(this.histories, function (history) {
            return history.remove;
          });

          localStorage.setItem('recentBlogHistory', JSON.stringify(this.histories));

          finalize();
        }, this));

        dfd.fail(_.bind(function () {
          console.warn('getBlogList failed at refetchBlogHistoryData, so removing histories');
          this.removeRecentBlogHistory();
          finalize();
        }, this));
      } else {
        finalize();
      }
    },

    onRender: function () {
      var that = this;
      var hammerOpts = device.options.hammer();

      this.$el.find('a').hammer(hammerOpts).on('tap', function () {
        that.selectBlogHandler($(this).data('id'));
      });

      this.$el.find('.blog-item-nav').hammer(hammerOpts).on('tap', function () {
        that.offset = parseInt($(this).data('offset'), 10) || 0;
        that.render();
      });

      $('#sidemenu-blogs-list').scrollTop(0);
    }
  });
});
