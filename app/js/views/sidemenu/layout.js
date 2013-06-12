define(['backbone.marionette', 'app', 'js/device', 'js/commands', 'js/views/sidemenu/main', 'hbs!js/views/sidemenu/templates/layout'],

function (Marionette, app, device, commands, MainView, template) {
  "use strict";

  return Marionette.Layout.extend({
    template: function (data) {
      return template(data);
    },
    initialize: function (params) {
      this.params = params;
      this.$el.addClass('container');
    },
    regions: {
      main: '#sidemenu-main'
    },
    onRender: function () {
      this.main.show(new MainView(this.params));

      commands.setHandler('sidemenu:show', _.bind(function () {
        this.$el.css({
          display: 'block'
        });
      }, this));

      commands.setHandler('sidemenu:toggle', function () {
        var $el = app.main.$el;
        var $body = $(document.body);
        var $appMain = $el.find('#main');
        var $appMainContainer = $el.find('.main-container');
        var $header = $el.find('#header');
        var $headerMain = $el.find('#header-main');

        var width = $(window).width();
        var mainWidth = $appMain.width();

        if (width === mainWidth) {
          $body.addClass('move');
        }

        var initialOffset = $headerMain.offset().left;
        var secondOffset = $headerMain.offset().left + $headerMain.innerWidth() - 5;

        var returnX = {
          'left': '0px'
        };

        if (!app.sidemenuShow) {

          app.sidemenu.$el.css({
            'display': 'block'
          });

          $headerMain.css({
            'margin-left': '0',
            'margin-right': '0'
          });
          $appMain.css({
            'margin-left': '0',
            'margin-right': '0'
          });

          $appMainContainer.css({
            'left': initialOffset + 'px'
          });
          $header.css({
            'left': initialOffset + 'px'
          });
          setTimeout(function () {
            if (device.isIE8 || width !== mainWidth) {
              $body.addClass('move');
            }
            setTimeout(function () {

              $appMainContainer.css({
                'left': secondOffset + 'px'
              });
              $header.css({
                'left': secondOffset + 'px'
              });
              setTimeout(function () {
                app.sidemenuShow = true;
              }, 300);
            }, 10);
          }, 10);
        } else {
          $headerMain.css({
            'margin-left': 'auto',
            'margin-right': 'auto'
          });
          $appMain.css({
            'margin-left': 'auto',
            'margin-right': 'auto'
          });
          $appMainContainer.css(returnX);
          $header.css(returnX);

          var finalize = function () {
            $body.removeClass('move');
            app.sidemenu.$el.css({
              'display': 'none'
            });
            app.sidemenuShow = false;
          };

          if (device.isIE8) {
            finalize();
          } else {
            setTimeout(finalize, 300);
          }
        }
      });
    }
  });
});
