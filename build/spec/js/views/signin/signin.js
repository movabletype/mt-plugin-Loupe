describe("views", function () {
  'use strict';

  var Signin, initData;
  var Controller, controller;

  var commandsOrig, commands, cmd, flagAuthenticate;
  beforeEach(function () {
    $('#app').empty();

    commandsOrig = require('js/commands');
    commands = _.clone(commandsOrig);

    cmd = jasmine.createSpyObj('cmd', ['authorizationCallback', 'app:afterTransition', 'signin:error']);

    commands.execute = function (co, data) {
      if (co === 'l10n') {
        if (controller) {
          controller.l10n.waitLoadCommon(data);
        }
      } else {
        commandsOrig.execute.call(commandsOrig, co, data);
      }
      if (cmd[co]) {
        cmd[co](data);
      }
    };

    var mtapi = require('js/mtapi');
    var origFunc = mtapi.api.authenticate;
    spyOn(mtapi.api, 'authenticate').andCallFake(function () {
      origFunc.apply(mtapi.api, arguments);
      flagAuthenticate = true;
    });

    undefRequireModule('js/commands');
    define('js/commands', [], function () {
      return commands;
    });

    reRequireModule(['js/views/signin/signin']);

    runs(function () {
      Signin = require('js/views/signin/signin');
    });
  });

  describe("signin/signin", function () {
    var signin;

    it("render signin screen", function () {
      signin = new Signin();
      signin.render();
      signin.$el.appendTo($('#app'));
      var $username = $('#username');
      var $password = $('#password');
      expect($username.length).toBeTruthy();
      expect($username.val()).toEqual('');
      expect($password.length).toBeTruthy();
      expect($password.val()).toEqual('');
    });

    it("render signin screen with username and password", function () {
      signin = new Signin({
        username: 'foo',
        password: 'bar'
      });
      signin.render();
      signin.$el.appendTo($('#app'));
      var $username = $('#username');
      var $password = $('#password');
      expect($username.length).toBeTruthy();
      expect($username.val()).toEqual('foo');
      expect($password.length).toBeTruthy();
      expect($password.val()).toEqual('bar');
    });

    it("tap button and then start authenticate", function () {
      signin = new Signin();
      spyOn(signin, 'authenticate');
      signin.render();
      signin.$el.appendTo($('#app'));
      $('#signin-button').trigger('tap');
      expect(signin.authenticate).toHaveBeenCalled();
    });

    it("pressing enter key in signin form and then start authenticate", function () {
      signin = new Signin();
      spyOn(signin, 'authenticate');
      signin.render();
      signin.$el.appendTo($('#app'));
      var e = jQuery.Event('keypress', {
        which: 13
      });
      $('#username').trigger(e);
      expect(signin.authenticate).toHaveBeenCalled();
      $('#password').trigger(e);
      expect(signin.authenticate.callCount).toEqual(2);
    });

    it("authenticate first error and then success", function () {
      flagAuthenticate = null;
      window.Mock.authOnly = 'foo,bar';
      signin = new Signin();
      spyOn(signin, 'authenticate').andCallThrough();
      signin.render();
      signin.$el.appendTo($('#app'));
      $('#username').val('lorem');
      $('#password').val('ipsum');
      signin.authenticate();

      waitsFor(function () {
        return flagAuthenticate;
      }, 'authenticate', 3000);

      runs(function () {
        expect(signin.signinError).toEqual('Invalid Sign in');
        expect($('.signin-error').text()).toMatch(/Invalid Sign in/);
        expect(cmd['authorizationCallback']).not.toHaveBeenCalled();
        expect(cmd['app:afterTransition']).toHaveBeenCalled();
        var $closeMe = signin.$el.find('.close-me');
        expect($closeMe.length).toBeTruthy();
        $closeMe.trigger('tap');
        var $closeMe = signin.$el.find('.close-me');
        expect($closeMe.length).toBeFalsy();

        $('#username').val('foo');
        $('#password').val('bar');
        flagAuthenticate = null;
        signin.authenticate();
      });

      waitsFor(function () {
        return flagAuthenticate;
      }, 'authenticate', 3000);

      runs(function () {
        expect(cmd['authorizationCallback']).toHaveBeenCalled();
      });
    });

    it("signin:error handler", function () {
      var count = cmd['app:afterTransition'].callCount;
      signin = new Signin();
      spyOn(signin, 'authenticate');
      signin.render();
      signin.$el.appendTo($('#app'));
      var commands = require('js/commands');
      commands.execute('signin:error', 'signin Error');

      waitsFor(function () {
        return !!cmd['signin:error'].callCount
      }, 'signin error', 3000);

      runs(function () {
        expect(signin.signinError).toEqual('signin Error');
        expect($('.signin-error').text()).toMatch(/signin Error/);
        expect(cmd['app:afterTransition'].callCount).toEqual(count + 1);
      });
    });

    it("timeout error", function () {
      window.Mock.slowResponse = 1000;
      var count = cmd['app:afterTransition'].callCount;
      signin = new Signin();
      signin.timeout = 500;
      signin.render();
      signin.$el.appendTo($('#app'));
      signin.authenticate();

      var flag;
      setTimeout(function () {
        flag = true;
      }, 800);

      waitsFor(function () {
        return flag;
      }, 'signin error', 3000);

      runs(function () {
        expect(signin.signinError).toEqual('Timeout Error');
        expect($('.signin-error').text()).toMatch(/Timeout Error/);
        expect(cmd['app:afterTransition'].callCount).toEqual(count + 1);
      });
    });

    it("show default error message", function () {
      flagAuthenticate = null;
      window.Mock.customAuthError = '';
      signin = new Signin();
      spyOn(signin, 'authenticate').andCallThrough();
      signin.render();
      signin.$el.appendTo($('#app'));
      signin.authenticate();

      waitsFor(function () {
        return flagAuthenticate;
      }, 'authenticate', 3000);

      runs(function () {
        var msg = 'Sign in authencation was failed for some reason';
        expect(signin.signinError).toEqual(msg);
        expect($('.signin-error').text()).toMatch(new RegExp('Sign in authencation was failed for some reason'));
      });
    });

    afterEach(function () {
      signin.$el.remove();
      resetMock();
      Backbone.history.navigate('');
    });
  });

  afterEach(function () {
    commandsOrig.execute('move:dashboard', initData);
    reRequireModule(['js/commands', 'js/router/controller', 'js/views/signin/signin']);
  });
});
