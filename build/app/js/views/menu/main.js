define(['backbone.marionette', 'json2', 'js/device', 'js/commands', 'js/mtapi/blogs', 'js/mtapi/blog', 'js/views/menu/blogs-list', 'hbs!js/views/menu/templates/main'], function (Marionette, JSON, device, commands, getBlogsList, getBlog, BlogsListView, template) {
  "use strict";

  return Marionette.Layout.extend({
    serializeData: function () {
      var data = {};
      data.user = this.user;
      return data;
    },

    ui: {
      menuHeaderArrow: '#menu-header-arrow'
    },

    template: template,

    regions: {
      blogs: '#menu-blogs-list'
    },

    initialize: function (options) {
      this.options = options;
      this.user = options.user;
    },

    handleToggle: function () {
      this.ui.menuHeaderArrow.toggleClass('rotate');
    },

    onRender: function () {
      var hammerOpts = device.options.hammer();
      this.blogs.show(new BlogsListView(this.options));

      commands.setHandler('menu:header:toggle', _.bind(this.handleToggle, this));

      this.$el.find('#menu-header').hammer(hammerOpts).on('tap', _.bind(function () {
        commands.execute('dashboard:toggle');
      }));
    }
  });
});
