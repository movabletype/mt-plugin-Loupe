define(['backbone.marionette', 'js/device', 'js/commands', 'hbs!js/views/dashboard/templates/header'], function (Marionette, device, commands, template) {
  "use strict";

  return Marionette.ItemView.extend({

    template: template,

    ui: {
      blognameArrow: '#blogname-arrow'
    },

    initialize: function (options) {
      this.blog = options.blog;
    },

    handleSlide: function () {
      var $blognameArrow = this.ui.blognameArrow;
      if ($blognameArrow.hasClass('rotate')) {
        $(document.body).toggleClass('hide');
        commands.execute('menu:hide');
        commands.execute('dashboard:slideup');
        commands.execute('menu:header:toggle');
        $blognameArrow.toggleClass('rotate');
      } else {
        $(document.body).toggleClass('hide');
        commands.execute('menu:show');
        commands.execute('dashboard:slidedown', this.$el.height());
        commands.execute('menu:header:toggle');
        $blognameArrow.toggleClass('rotate');
      }
    },

    adjustHeader: function () {
      var $blognameInner = this.$el.find('#blogname-inner');
      var $loupeCircle = this.$el.find('#blogname-circle');
      var $blognameArrow = this.ui.blognameArrow;
      if ($blognameInner.length) {
        var offset = $blognameInner.offset();
        var width = $blognameInner.width();
        if ($loupeCircle && $loupeCircle.offset && offset) {
          $loupeCircle.offset({
            left: offset.left - $loupeCircle.outerWidth(true)
          });
        }
        if ($blognameArrow && $blognameArrow.offset && offset) {
          $blognameArrow.offset({
            left: offset.left + width
          });
        }
        this.$el.addClass('show');
      }
    },

    onRender: function () {
      setTimeout(_.bind(function () {
        this.adjustHeader();
      }, this), 0);

      commands.setHandler('dashboard:toggle', _.bind(this.handleSlide, this));
      $(window).on('orientationchange debouncedresize', _.bind(this.adjustHeader, this));

      this.$el.hammer(device.options.hammer()).on('tap', _.bind(this.handleSlide, this));
    },

    serializeData: function () {
      var data = {};
      data.blog = this.blog || {};
      data.blog.name = data.blog.name || 'Loupe';
      return data;
    }
  });
});
