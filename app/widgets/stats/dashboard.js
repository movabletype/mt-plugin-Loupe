define(['jquery', 'backbone.marionette', 'backbone.marionette.handlebars', 'js/vent', 'hbs!widgets/stats/templates/dashboard', 'easeljs'],

function ($, Marionette, MarionetteHandlebars, vent, template, createjs) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    },

    serializeData: function () {
      return {
        count: '33K'
      };
    },

    initialize: function () {
      this.$el.hammer().on('tap', function () {
        vent.trigger('router:navigate', 'stats');
      });
    },

    onRender: function () {
      var $canvas = $('<canvas id="canvas" width="400" height="200">').appendTo(this.$el);
      var ctx = $canvas.get(0).getContext('2d');
      var stage = new createjs.Stage($canvas.get(0));
      var shape = new createjs.Shape();
      stage.update();

      var s = new createjs.Shape();
      var g = s.graphics;
      g.setStrokeStyle(8).beginStroke('rgb(254,213,99)').moveTo(50, 50);

      var x = 50;
      var y = 50;
      var count = 14;
      //.lineTo(100, 100);
      //g.lineTo(150, 50).lineTo(200, 100).lineTo(300, 140).lineTo(350, 30);

      var tick = function (e) {
        // if we are on the last frame of animation then remove the tick listener:
        if (--count == 1) {
          createjs.Ticker.removeEventListener("tick", tick);
        }

        x = x + 24;

        var a = (Math.floor(Math.random() * 4) % 2) ? -1 : 1;
        y = y + (Math.floor(Math.random() * 40) * a);
        y = y < 30 ? 30 : y;
        y = y > 180 ? 180 : y;

        g.lineTo(x, y);
        stage.update(e);
      };

      createjs.Ticker.useRAF = true;
      createjs.Ticker.setFPS(30);
      createjs.Ticker.addEventListener('tick', tick);

      for (var i = 0; i < 7; i++) {
        var s0 = new createjs.Shape();
        var bar = s0.graphics;
        var x0 = i * 40 + 70;
        var y0 = Math.floor(Math.random() * 140);
        var y1 = 30 + 140 - y0;
        bar.beginFill('rgba(255,255,255,0.1)').drawRect(x0, y1, 30, y0);
        stage.addChild(s0);

        stage.addChild(s);
      }
      stage.update();
    }
  });
});