define(['backbone.marionette', 'js/device', 'js/commands', 'js/mtapi', 'hbs!js/views/signin/templates/signin'],

  function (Marionette, device, commands, mtapi, template) {
    "use strict";

    return Marionette.ItemView.extend({
      template: template,

      ui: {
        username: '#username',
        password: '#password',
        button: '#signin-button'
      },

      initialize: function (options) {
        options = options || {};
        this.username = options.username;
        this.password = options.password;

        commands.setHandler('signin:error', _.bind(function (error) {
          commands.execute('app:afterTransition');
          this.signinError = error;
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
          this.signinError = 'Timeout Error';
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
            this.signinError = resp.error.message || 'Sign in authencation was failed for some reason';
            this.render();
          }
        }, this));
      },

      onRender: function () {
        if (this.signinError) {
          this.$el.find('.close-me').hammer(this.hammerOpts).on('tap', _.bind(function () {
            this.$el.find('.signin-error').remove();
          }, this));
        }

        this.$el.find('.signin-input').on('keypress', _.bind(function (e) {
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
        data.signinError = this.signinError;
        return data;
      }
    });
  });
