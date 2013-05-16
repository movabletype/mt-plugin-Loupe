define(['backbone.marionette', 'hbs!js/views/dashboard/templates/layout', 'js/views/common/header', 'js/views/dashboard/main'],

function (Marionette, template, HeaderView, MainLayout) {
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
      this.widgets = options.widgets;
      this.params = options.params;
    },

    onRender: function () {
      this.header.show(new HeaderView());
      this.$el.addClass('container');
      this.main.show(new MainLayout({
        widgets: this.widgets,
        params: this.params
      }));
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