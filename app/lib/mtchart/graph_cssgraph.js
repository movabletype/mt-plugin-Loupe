define(function () {
  return function (data) {
    var len = 7;

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
      $count.text(this.config['yLabel'][i] || dataY[i]);
      $el.appendTo($CSSGraphContainer);
    }

    $CSSGraphContainer.appendTo(this.$graphContainer);
  };
});