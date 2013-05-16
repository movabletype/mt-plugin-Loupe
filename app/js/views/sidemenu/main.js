define(['backbone.marionette', 'js/commands', 'hbs!js/views/sidemenu/templates/main'],

function (Marionette, commands, template) {
  "use strict";

  return Marionette.Layout.extend({
    serializeData: function () {
      var data = {};
      commands.execute('controller:getUser', _.bind(function (user) {
        data.user = this.user = user;
      }, this));
      commands.execute('controller:getBlogList', _.bind(function (blogs) {
        data.blogs = this.blogs = blogs.items;
        if (this.currentBlogId) {
          _.each(data.blogs, _.bind(function (blog) {
            if (blog.id === this.currentBlogId) {
              blog.selected = true;
              this.blog = blog;
            } else {
              delete blog.selected;
            }
          }, this));
        }
      }, this));
      if (DEBUG) {
        console.log('sidebar:serializeData');
        console.log(data);
      }
      return data;
    },

    template: function (data) {
      return template(data);
    },

    blogs: null,

    initialize: function () {
      this.currentBlogId = this.selectedBlogId = localStorage.getItem('currentBlogId') || null;
    },

    selectBlogHandler: function (bid) {
      var $blogList = this.$el.find('.blogs-list');
      this.selectedBlogId = parseInt(bid, 10);
      _.each(this.blogs, function (blog) {
        if (parseInt(blog.id, 10) === this.selectedBlogId) {
          blog.selected = true;
          this.blog = blog;
        } else {
          delete blog.selected;
        }
      }, this);
      $blogList.find('.selected').removeClass('selected');
      $blogList.find('[data-id=' + this.selectedBlogId + ']').addClass('selected');
    },

    saveChagesHandler: function () {
      if (DEBUG) {
        console.log('switching blog from ' + this.currentBlogId + ' to ' + this.selectedBlogId);
      }
      commands.execute('sidemenu:toggle');
      if (this.currentBlogId !== this.selectedBlogId) {
        this.currentBlogId = this.selectedBlogId;
        localStorage.setItem('currentBlogId', this.selectedBlogId);
        setTimeout(_.bind(function () {
          commands.execute('dashboard:rerender', {
            userId: this.user.id,
            blogId: this.blog.id,
            user: this.user,
            blog: this.blog
          });
        }, this), 300);
      }
    },

    onRender: function () {
      var that = this;

      this.$el.find('.blogs-list').hammer().on('tap', 'a', function () {
        that.selectBlogHandler($(this).data('id'));
      });

      this.$el.find('.save-changes').hammer().on('tap', function () {
        that.saveChagesHandler();
      });

      this.$el.find('.close-sidemenu').hammer().on('tap', function () {
        commands.execute('sidemenu:toggle');
      })
    }
  });
});