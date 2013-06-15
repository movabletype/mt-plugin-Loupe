define(['backbone.marionette', 'js/device', 'js/commands', 'hbs!js/views/common/template/header'],

function (Marionette, device, commands, template) {
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
        commands.execute('dashboard:slideup');
        commands.execute('sidemenu:header:toggle')
        $blognameArrow.toggleClass('rotate');
      } else {
        $(document.body).toggleClass('hide');
        commands.execute('sidemenu:show');
        commands.execute('dashboard:slidedown', this.$el.height());
        commands.execute('sidemenu:header:toggle');
        $blognameArrow.toggleClass('rotate');
      }
    },

    onRender: function () {
      var $blognameInner = this.$el.find('#blogname-inner');
      var $loupeCircle = this.$el.find('#blogname-circle');
      var $blognameArrow = this.ui.blognameArrow;

      setTimeout(_.bind(function () {
        var offset = $blognameInner.offset();
        var width = $blognameInner.width();
        $loupeCircle.offset({
          left: offset.left - $loupeCircle.outerWidth(true)
        })
          .css({
          display: 'block'
        });
        $blognameArrow.offset({
          left: offset.left + width
        })
          .css({
          display: 'block'
        });
      }, this), 0);

      commands.setHandler('dashboard:toggle', _.bind(this.handleSlide, this));

      this.$el.hammer(device.options.hammer()).on('tap', _.bind(this.handleSlide, this));
    },

    serializeData: function () {
      var data = {};
      if (this.blog) {
        data.blog = this.blog;
        if (!this.blog.name) {
          data.blog.name = 'Loupe'
        }
      }
      return data;
    }
  });
});
