describe("app", function () {
  'use strict';

  var app, commands, cache, AppRouter, Controller, cards;

  require('js/boot');

  app = require('app');
  commands = require('js/commands');
  cache = require('js/cache');
  AppRouter = require('js/router/router');
  Controller = require('js/router/controller');
  cards = require('json!cards/cards.json');

  beforeEach(function () {
    commands.execute('router:navigate', '')
  })

  it("should be start", function () {
    expect(app.initial).toBe(true);
  });

  it("app:buildMenu", function () {

    var user = cache.get('user', 'user'),
      blogs = cache.get('user', 'blogs'),
      blog = blogs.models[0];

    var params = {
      userId: user.id,
      blogId: blog.id,
      user: user,
      blogs: blogs,
      blog: blog
    };

    spyOn(app.menu, 'show').andCallThrough();
    commands.execute('app:buildMenu', params);
    expect(app.menu.show).toHaveBeenCalled();
  });

  it("toggled onmove class in body before and after transition", function () {
    var $appBuilding, $body;
    commands.execute('app:beforeTransition');
    $body = $(document.body);
    expect($body.hasClass('onmove')).toBe(true);
    $appBuilding = $('#app-building');
    expect($appBuilding.length).toBeTruthy();
    commands.execute('app:afterTransition');
    expect($body.hasClass('onmove')).toBe(false);
  });

  it("android has scrollTop before transition", function () {
    var $appBuilding, device, flag, style;
    var deviceBak = _.clone(app.device);
    app.device = {
      isAndroid: true
    };
    commands.execute('app:beforeTransition');
    $appBuilding = $('#app-building');
    style = $appBuilding.attr('style');
    expect(style).toMatch(/top:\s*[0-9]+px/);
    expect(style).toMatch(/bottom:\s*[0-9]+px/);
    app.device = deviceBak;
  });
});
