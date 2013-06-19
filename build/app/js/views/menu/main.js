define(['backbone.marionette', 'json2', 'js/device', 'js/commands', 'js/mtapi/blogs', 'js/mtapi/blog', 'js/views/menu/blogs-list', 'hbs!js/views/menu/templates/main'],

function (Marionette, JSON, device, commands, getBlogsList, getBlog, BlogsListView, template) {
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

    ui: {
      menuHeaderArrow: '#menu-header-arrow'
    },

    template: function (data) {
      return template(data);
    },

    regions: {
      blogs: '#menu-blogs-list'
    },

    initialize: function (params) {
      this.params = params;
      this.user = params.user || {};
    },

    hanldeToggle: function () {
      this.ui.menuHeaderArrow.toggleClass('rotate');
    },

    onRender: function () {
      var hammerOpts = device.options.hammer();
      this.blogs.show(new BlogsListView(this.params));

      commands.setHandler('menu:header:toggle', _.bind(this.hanldeToggle, this));

      this.$el.find('#menu-header').hammer(hammerOpts).on('tap', _.bind(function () {
        commands.execute('dashboard:toggle');
      }));

      this.$el.find('.save-changes').hammer(hammerOpts).on('tap', _.bind(function () {
        this.blogs.currentView.saveChagesHandler();
      }, this));

      this.$el.find('.close-menu').hammer(hammerOpts).on('tap', function () {
        commands.execute('menu:toggle');
      });
    }
  });
});