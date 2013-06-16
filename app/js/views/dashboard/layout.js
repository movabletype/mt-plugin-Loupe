define(['backbone.marionette', 'js/commands', 'hbs!js/views/dashboard/templates/layout', 'js/views/dashboard/header', 'js/views/dashboard/main'],

function (Marionette, commands, template, HeaderView, MainLayout) {
  "use strict";

  return Marionette.Layout.extend({
    template: function (data) {
      return template(data);
    },

    regions: {
      header: '#header',
      main: '#main',
      footer: '#footer'
    },

    initialize: function (options) {
      this.options = options;
    },

    onRender: function () {
      this.header.show(new HeaderView(this.options));
      this.$el.attr('id', 'dashboard');
      this.$el.addClass('container');
      this.main.show(new MainLayout(this.options));

      commands.setHandler('dashboard:slidedown', _.bind(function (height) {
        this.$el.css({
          top: $(window).height() - height + 'px'
        });
      }, this));

      commands.setHandler('dashboard:slideup', _.bind(function () {
        this.$el.css({
          top: '0'
        });
      }, this));
    },

    onShow: function () {
      var handleShadow = function () {
        var $this = $(this);
        if ($this.scrollTop() > 0) {
          $('#header').addClass('shadow');
        } else {
          $('#header').removeClass('shadow');
          $('.main-container').one('scroll', handleShadow);
        }
      };

      $('.main-container').one('scroll', handleShadow);
      $('.main-container').on('smartscroll', handleShadow);
    }
  });
});
