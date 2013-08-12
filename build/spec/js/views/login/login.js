describe("views", function () {
  'use strict';

  var Login, initData;
  var Controller, controller;

  var commandsOrig, commands, cmd, flagAuthenticate;
  beforeEach(function () {
    $('#app').empty();

    commandsOrig = require('js/commands');
    commands = _.clone(commandsOrig);

    cmd = jasmine.createSpyObj('cmd', ['authorizationCallback', 'app:afterTransition', 'login:error']);

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

    reRequireModule(['js/views/login/login']);

    runs(function () {
      Login = require('js/views/login/login');
    });
  });

  describe("login/login", function () {
    var login;

    it("render login screen", function () {
      login = new Login();
      login.render();
      login.$el.appendTo($('#app'));
      var $username = $('#username');
      var $password = $('#password');
      expect($username.length).toBeTruthy();
      expect($username.val()).toEqual('');
      expect($password.length).toBeTruthy();
      expect($password.val()).toEqual('');
      login.$el.remove();
    });

    it("render login screen with username and password", function () {
      login = new Login({
        username: 'foo',
        password: 'bar'
      });
      login.render();
      login.$el.appendTo($('#app'));
      var $username = $('#username');
      var $password = $('#password');
      expect($username.length).toBeTruthy();
      expect($username.val()).toEqual('foo');
      expect($password.length).toBeTruthy();
      expect($password.val()).toEqual('bar');
      login.$el.remove();
    });

    it("tap button and then start authenticate", function () {
      login = new Login();
      spyOn(login, 'authenticate');
      login.render();
      login.$el.appendTo($('#app'));
      $('#sign-in-button').trigger('tap');
      expect(login.authenticate).toHaveBeenCalled();
    });

    it("pressing enter key in login form and then start authenticate", function () {
      login = new Login();
      spyOn(login, 'authenticate');
      login.render();
      login.$el.appendTo($('#app'));
      var e = jQuery.Event('keypress', {
        which: 13
      });
      $('#username').trigger(e);
      expect(login.authenticate).toHaveBeenCalled();
      $('#password').trigger(e);
      expect(login.authenticate.callCount).toEqual(2);
    });

    it("authenticate first error and then success", function () {
      flagAuthenticate = null;
      window.Mock.authOnly = 'foo,bar';
      login = new Login();
      spyOn(login, 'authenticate').andCallThrough();
      login.render();
      login.$el.appendTo($('#app'));
      $('#username').val('lorem');
      $('#password').val('ipsum');
      login.authenticate();

      waitsFor(function () {
        return flagAuthenticate;
      }, 'authenticate', 3000);

      runs(function () {
        expect(login.loginError).toEqual('Invalid Login');
        expect($('.login-error').text()).toMatch(/Invalid Login/);
        expect(cmd['authorizationCallback']).not.toHaveBeenCalled();
        expect(cmd['app:afterTransition']).toHaveBeenCalled();
        var $closeMe = login.$el.find('.close-me');
        expect($closeMe.length).toBeTruthy();
        $closeMe.trigger('tap');
        var $closeMe = login.$el.find('.close-me');
        expect($closeMe.length).toBeFalsy();

        $('#username').val('foo');
        $('#password').val('bar');
        flagAuthenticate = null;
        login.authenticate();
      });

      waitsFor(function () {
        return flagAuthenticate;
      }, 'authenticate', 3000);

      runs(function () {
        expect(cmd['authorizationCallback']).toHaveBeenCalled();
      });
    });

    it("login:error handler", function () {
      var count = cmd['app:afterTransition'].callCount;
      login = new Login();
      spyOn(login, 'authenticate');
      login.render();
      login.$el.appendTo($('#app'));
      var commands = require('js/commands');
      commands.execute('login:error', 'Login Error');

      waitsFor(function () {
        return !!cmd['login:error'].callCount
      }, 'login error', 3000);

      runs(function () {
        expect(login.loginError).toEqual('Login Error');
        expect($('.login-error').text()).toMatch(/Login Error/);
        expect(cmd['app:afterTransition'].callCount).toEqual(count + 1);
      });
    });

    it("timeout error", function () {
      window.Mock.slowResponse = 1000;
      var count = cmd['app:afterTransition'].callCount;
      login = new Login();
      login.timeout = 500;
      login.render();
      login.$el.appendTo($('#app'));
      login.authenticate();

      var flag;
      setTimeout(function () {
        flag = true;
      }, 800);

      waitsFor(function () {
        return flag;
      }, 'login error', 3000);

      runs(function () {
        expect(login.loginError).toEqual('Timeout Error');
        expect($('.login-error').text()).toMatch(/Timeout Error/);
        expect(cmd['app:afterTransition'].callCount).toEqual(count + 1);
      });
    });

    it("show default error message", function () {
      flagAuthenticate = null;
      window.Mock.customAuthError = '';
      login = new Login();
      spyOn(login, 'authenticate').andCallThrough();
      login.render();
      login.$el.appendTo($('#app'));
      login.authenticate();

      waitsFor(function () {
        return flagAuthenticate;
      }, 'authenticate', 3000);

      runs(function () {
        var msg = 'Login authencation was failed for some reason';
        expect(login.loginError).toEqual(msg);
        expect($('.login-error').text()).toMatch(new RegExp('Login authencation was failed for some reason'));
      });
    });

    afterEach(function () {
      login.$el.remove();
      resetMock();
    });
  });

  afterEach(function () {
    commandsOrig.execute('move:dashboard', initData);
    reRequireModule(['js/commands', 'js/router/controller', 'js/views/login/login']);
  });
});
