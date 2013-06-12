define(['backbone.marionette', 'js/commands', 'hbs!js/views/dashboard/templates/layout', 'js/views/common/header', 'js/views/dashboard/main'],

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
      this.cards = options.cards;
      this.params = options.params;
    },

    onRender: function () {
      this.header.show(new HeaderView({
        params: this.params
      }));
      this.$el.attr('id', 'dashboard');
      this.$el.addClass('container');
      this.main.show(new MainLayout({
        cards: this.cards,
        params: this.params
      }));

      commands.setHandler('dashboard:slidedown', _.bind(function (height) {
        this.$el.css({
          top: $(window).height() - height + 'px'
        })
      }, this));

      commands.setHandler('dashboard:slideup', _.bind(function (height) {
        this.$el.css({
          top: '0'
        })
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
