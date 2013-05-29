define(['backbone.marionette', 'json2', 'js/commands', 'js/mtapi/blogs', 'js/mtapi/blog', 'js/views/sidemenu/blogs-list', 'hbs!js/views/sidemenu/templates/main'],

function (Marionette, JSON, commands, getBlogsList, getBlog, BlogsListView, template) {
  "use strict";

  return Marionette.Layout.extend({
    serializeData: function () {
      var data = {
        user: this.user
      };

      if (DEBUG) {
        console.log('[sidebar:main:serializeData]');
        console.log(data);
      }
      return data;
    },

    template: function (data) {
      return template(data);
    },

    regions: {
      blogs: '#sidemenu-blogs-list'
    },

    initialize: function (params) {
      this.params = params;
      this.user = params.user || {};
    },

    onRender: function () {
      this.blogs.show(new BlogsListView(this.params));

      this.$el.find('.save-changes').hammer().on('tap', _.bind(function () {
        this.blogs.currentView.saveChagesHandler();
      }, this));

      this.$el.find('.close-sidemenu').hammer().on('tap', function () {
        commands.execute('sidemenu:toggle');
      });
    }
  });
});
