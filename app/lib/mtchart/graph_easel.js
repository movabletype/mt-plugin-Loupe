define(['easeljs'], function (createjs) {
  return function (data) {
    var lineWidth = 8;
    var lineColor = this.config['lineColors'];
    var barColor = this.config['barColors'];
    var graphLength = this.range['length'];
    var canvasWidth = this.config['width'];
    var paddingTop = lineWidth / 2;
    var canvasHeight = this.config['height'];

    var $canvas = $('<canvas id="canvas" width="' + canvasWidth + '" height="' + canvasHeight + '">').appendTo(this.$graphContainer);

    $canvas.get(0).getContext('2d');
    var stage = new createjs.Stage($canvas.get(0));
    stage.update();

    var s = new createjs.Shape();
    var g = s.graphics;

    var count = (graphLength - 1) * 2;
    var moveX = Math.floor(canvasWidth / graphLength) / 2;
    var paddingX = (canvasWidth - moveX * count) / 2;
    var x = paddingX;

    var dataY = _.flatten(_.map(data, function (d, i) {
      var arr;
      var y = parseInt(d.y, 10);
      if (i > 0) {
        var prevY = parseInt(data[i - 1].y, 10);
        var medium = prevY + Math.floor((y - prevY) / 2);
        arr = [medium, y];
      } else {
        arr = y;
      }
      return arr;
    }));

    var maxY = Math.max.apply(null, dataY) || 1;

    dataY = _.map(dataY, function (y) {
      return Math.floor((y / maxY) * (canvasHeight - lineWidth)) + paddingTop;
    });

    var barInterbal = 10;
    var barWidth = Math.floor(canvasWidth / graphLength) - 10;
    var paddingX0 = Math.floor((canvasWidth - (barWidth + 10) * graphLength) / 2) + barInterbal / 2;

    var dataY0 = _.map(data, function (d) {
      y = parseInt(d.y, 10);
      return Math.floor((y / maxY) * canvasHeight);
    });

    if (DEBUG) {
      console.log('barWidth: ' + barWidth);
      console.log('x0: ' + paddingX0);
      console.log(dataY0);
    }

    for (var i = 0; i < graphLength; i++) {
      var s0 = new createjs.Shape();
      var bar = s0.graphics;
      var x0 = i * (barWidth + barInterbal) + paddingX0;
      var y0 = dataY0[i];
      var y1 = canvasHeight - y0;

      bar.beginFill(barColor).drawRect(x0, y1, barWidth, y0);
      stage.addChild(s0);

      stage.addChild(s);
    }

    var y = canvasHeight - dataY[0];
    dataY = dataY.slice(1);

    if (DEBUG) {
      console.log('moveX: ' + moveX);
      console.log('x: ' + x);
      console.log('y: ' + y);
      console.log(dataY);
    }

    g.setStrokeStyle(lineWidth).beginStroke(lineColor).moveTo(x, y);

    var tick = function (e) {
      // if we are on the last frame of animation then remove the tick listener:
      count = count - 1;
      if (count === 0) {
        createjs.Ticker.removeEventListener("tick", tick);
      }

      x = x + moveX;
      y = canvasHeight - dataY[dataY.length - count - 1];

      g.lineTo(x, y);
      stage.update(e);
    };

    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener('tick', tick);

    stage.update();
  };
});
