define(['morris'], function(Morris) {
  return function(data) {
    var i, staticPath, height, labelTemplate, graphConfig, pointStrokeColors, lineWidth, pointSize, yLength = this.config['yLength'],
      maxY = this.getMaxY_(data, yLength);

    var type = this.config['type'];
    staticPath = this.config['staticPath'] || '';

    // this magical value 0.6741573 is caliculated below
    // 240 / 356 (jQuery(window).height() of iPhone 4S)
    height = this.config['height'] || 280; //Math.max(Math.ceil(jQuery(window).height() * 0.6741573), 200);
    var width = this.config['width'] || 280;

    this.$graphEl = jQuery('<div id="' + this.id + '" style="height:' + height + 'px; width: ' + width + 'px">').prependTo(this.$graphContainer);

    if (this.config['labelTemplate']) {
      var that = this;
      labelTemplate = this.config['labelTemplate']['template'];
      var templateType = this.config['labelTemplate']['type'];
      require([templateType + '!' + staticPath + labelTemplate], function(template) {
        if (templateType === 'hbs' && typeof template === 'function') {
          template = template();
        }
        that.labelTemplate = that.labelTemplate || template; //jQuery.get(staticPath + labelTemplate, 'text');
        that.labels = new MTChart.Graph.Labels(that.$graphContainer, yLength, that.labelTemplate);
        for (i = 0; i < yLength; i++) {
          if (!that.config['hideTotalCount']) {
            that.labels.getTotalObject(i).createTotalCount(that.getTotalCount_(data, i));
          }
          if (!that.config['hideDeltaCount'] && that.range.isTimeline) {
            that.labels.getTotalObject(i).createDeltaCount(that.getDelta_(data, i));
          }
        }
      });
    }

    this.chartColors = this.chartColors || this.getChartColors_(this.config['chartColors'], this.config['chartColorsMethod']);

    pointStrokeColors = this.config['pointStrokeColors'] ? this.config['pointStrokeColors'].split(/,/) : ['none', 'none', 'none', 'none', 'none'];
    lineWidth = parseInt(this.config['lineWidth'], 10) || 6;
    pointSize = parseInt(this.config['pointSize'], 10) || 6;

    graphConfig = {
      'element': this.id,
      'data': data,
      'xkey': 'x',
      'ykeys': this.getYKeys_(yLength),
      'labels': this.getYLabels_(yLength, this.config['yLabels']),
      'ymax': maxY,
      'ymin': 0,
      'numLines': 1, //this.getNumLines_(maxY),
      'lineWidth': lineWidth,
      'pointSize': pointSize,
      'labelColor': '#444444',
      'barColors': this.chartColors,
      'lineColors': this.chartColors,
      'colors': this.chartColors,
      'pointStrokeColors': pointStrokeColors,
      'gridTextSize': 0,
      'gridLineColor': '#16878a'
    };

    // IE8 (might be VML) occured error setting smooth false
    // required Modernizr feature detection
    if (Modernizr && Modernizr.svg) {
      graphConfig['smooth'] = !! this.config['smooth'] || false;
    }

    // shows percentage as Y label when graph type is donut
    if (this.config['type'] === 'donut') {
      var totalCount = this.getTotalCount_(data, i);
      graphConfig['formatter'] = function(y) {
        return y + '(' + Math.ceil((y / totalCount * 10000)) / 100 + '%)';
      };
    }

    if (this.config['hideHover'] !== undefined) {
      graphConfig['hideHover'] = this.config['hideHover'];
    }

    ({
      'bar': Morris.Bar,
      'line': Morris.Line,
      'donut': Morris.Donut,
      'area': Morris.Area
    })[type](graphConfig);
  }
});