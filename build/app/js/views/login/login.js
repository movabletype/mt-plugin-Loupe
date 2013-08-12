define(['backbone.marionette', 'js/device', 'js/commands', 'js/mtapi', 'hbs!js/views/login/templates/login'],

  function (Marionette, device, commands, mtapi, template) {
    "use strict";

    return Marionette.ItemView.extend({
      template: template,

      ui: {
        username: '#username',
        password: '#password',
        button: '#sign-in-button'
      },

      initialize: function (options) {
        options = options || {};
        this.username = options.username;
        this.password = options.password;

        commands.setHandler('login:error', _.bind(function (error) {
          commands.execute('app:afterTransition');
          this.loginError = error;
          this.render();
        }, this));
      },

      timeout: 15000,

      authenticate: function () {
        commands.execute('app:beforeTransition');
        this.username = this.ui.username.val();
        this.password = this.ui.password.val();

        var timerId = setTimeout(_.bind(function () {
          commands.execute('app:afterTransition');
          this.loginError = 'Timeout Error';
          this.render();
        }, this), this.timeout);

        mtapi.api.authenticate({
          username: this.username,
          password: this.password,
          remember: true,
          bustCache: (new Date()).valueOf()
        }, _.bind(function (resp) {
          clearTimeout(timerId);
          if (!resp.error) {
            commands.execute('authorizationCallback');
          } else {
            if (DEBUG) {
              console.log('authenticate error');
              console.log(resp.error);
            }
            commands.execute('app:afterTransition');
            this.loginError = resp.error.message || 'Login authencation was failed for some reason';
            this.render();
          }
        }, this));
      },

      onRender: function () {
        if (this.loginError) {
          this.$el.find('.close-me').hammer(this.hammerOpts).on('tap', function () {
            $(this).parent().remove();
          });
        }

        this.$el.find('.login-input').on('keypress', _.bind(function (e) {
          if (e.which === 13) {
            this.authenticate();
          }
        }, this));

        this.ui.button.hammer(this.hammerOpts).on('tap', _.bind(function () {
          this.authenticate();
        }, this));
      },

      hammerOpts: device.options.hammer(),

      serializeData: function () {
        var data = {};
        data.username = this.username;
        data.password = this.password;
        data.loginError = this.loginError;
        return data;
      }
    });
  });
