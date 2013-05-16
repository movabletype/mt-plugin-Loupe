define(function () {
  var cssGraph = {};

  cssGraph.bar = function (data, config, $container) {
    var len = data.length;

    var $CSSGraphContainer = $('<div class="css-graph">');

    var createCSSGraphBarEl = function () {
      return $('<div class="css-graph-container"><div class="css-graph-date"></div><div class="css-graph-bar-container"><div class="css-graph-bar"></div><div class="css-graph-bar-background"><div class="css-graph-bar-count"></div></div></div></div>');
    };

    var dataY = _.map(data, function (d) {
      return parseInt(d.y, 10);
    });

    var label = _.map(data, function (d) {
      return parseInt(d.x.substr(d.x.lastIndexOf('-') + 1), 10).toString();
    });

    var maxY = Math.max.apply(null, dataY) || 1;

    var width, $el, $bar, $count, $date;
    for (var i = len; i > 0;) {
      i = i - 1;
      width = Math.floor((dataY[i] / maxY) * 100) - 15;
      $el = createCSSGraphBarEl();
      $date = $el.find('.css-graph-date');
      $date.text(label[i]);
      $bar = $el.find('.css-graph-bar');
      $bar.css({
        'width': width + '%',
        'background-color': '#fed363'
      });
      $count = $el.find('.css-graph-bar-count');
      $count.text(config['yLabel'][i] || dataY[i]);
      $el.appendTo($CSSGraphContainer);
    }

    $CSSGraphContainer.appendTo($container);
  };

  cssGraph.ratioBar = function (data, config, $container) {
    var len = data.length;
    var yLength = config['yLength'];
    var chartColors = config['chartColors'];
    var chartClasses = config['chartClasses'];
    var i, j;

    var $CSSGraphContainer = $('<div class="css-graph">');

    var d, dataY, totalY, $el, $bar, width;
    for (i = 0; i < len; i++) {
      d = data[i];
      dataY = [];
      totalY = 0;
      for (j = 0; j < yLength; j++) {
        dataY.push(d['y' + (j || '')]);
        totalY = totalY + parseInt(d['y' + (j || '')], 10);
      }

      $el = $('<div class="css-graph-container"></div>');

      for (j = 0; j < yLength; j++) {
        width = Math.floor((dataY[j] / totalY) * 100);
        if (width) {
          $bar = $('<div class="css-graph-y css-graph-y' + (j || '') + '"></div>');
          $bar.css({
            'width': width + '%',
            'background-color': chartColors[j]
          });

          if (chartClasses && chartClasses[j]) {
            $bar.addClass(chartClasses[j]);
          }

          $bar.appendTo($el);
        }
      }

      $el.appendTo($CSSGraphContainer);
    }
    $CSSGraphContainer.appendTo($container);
  };

  return cssGraph;
});