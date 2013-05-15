define(['modernizr', 'mtchart.data', 'mtchart.date', 'mtchart.range'],

function(Modernizr, MTChartData, MTChartDate, MTChartRange) {

  var MTChart = {};
  MTChart.Data = MTChartData;
  MTChart.Date = MTChartDate;
  MTChart.Range = MTChartRange;

  /**
   * Creates Graph Object
   * If you want to draw graph, fire APPEND_GRAPH event for its container Element like this
   * $container is the jQuery object to which the graph append
   * $('#graphContainer').trigger('APPEND_TO',[$container])
   * you want to update graph as well, fire UPDATE event like the same manner above.
   *
   * @param {object} graph setings
   * @param {object} object including range settings
   * @return {jQuery} return container jQuery object
   * @constructor
   */
  MTChart.Graph = function(config, range) {
    var data, that = this,
      defaultConf;
    this.id = 'graph-' + (new Date()).valueOf() + Math.floor(Math.random() * 100);

    defaultConf = {
      'dataType': 'timeline',
      'type': 'bar',
      'yLength': 1,
      'autoSized': true
    };

    this.config = jQuery.extend(defaultConf, config);
    this.config.yLength = parseInt(this.config['yLength'], 10) || 1;

    range['autoSized'] = this.config['autoSized'];
    this.range = MTChart.Range.generate(range);

    if (!this.config['json']) {
      data = (this.config['staticPath'] || '') + (this.config['data'] || 'graph.json');
      this.origData_ = $.getJSON(data);
    } else {
      data = $.Deferred();
      data.resolve(this.config['json']);
      this.origData_ = data;
    }

    this.graphData = {};
    this.graphData[this.range.unit] = jQuery.Deferred();

    this.getData(function(data) {
      var graphData = that.generateGraphData(data);
      that.graphData[that.range.unit].resolve(graphData);
    });


    this.$graphContainer = jQuery('<div id="' + this.id + '-container" class="graph-container">');

    /**
     * @return {jQuery} return jQuery object for chaining
     * update graph
     */
    this.$graphContainer.on('UPDATE', function(e, newRange, unit) {
      that.update_(newRange, unit);
      return jQuery(this);
    });

    jQuery(window).on('orientationchange debouncedresize', function() {
      that.update_();
    });

    /**
     * @return {jQuery} return jQuery object for chaining
     * return back the graph data range to callback
     */
    this.$graphContainer.on('GET_DATA_RANGE', function(e, callback) {
      that.getData(function(data) {
        callback(MTChart.Range.getDataRange(data, that.range.isTimeline));
      });
      return jQuery(this);
    });

    /**
     * @return {jQuery} return jQuery object for chaining
     * return back the graph label array to callback
     */
    this.$graphContainer.on('GET_LABEL', function(e, indexArray, callback) {
      that.getData(function(data) {
        callback(that.getDataLabelByIndex(indexArray, data));
      });
      return jQuery(this);
    });

    /**
     * append graph container to the desinated container
     * @return {jQuery} return jQuery object for chaining
     */
    this.$graphContainer.on('APPEND_TO', function(e, container) {
      that.$graphContainer.appendTo(container);
      that.graphData[that.range.unit].done(function(data) {
        var filteredData;
        if (that.range.isTimeline) {
          filteredData = jQuery.grep(data, function(v) {
            return that.range.start <= v.timestamp && v.timestamp <= that.range.end;
          });
        } else {
          filteredData = data.slice(that.range.min, that.range.max + 1);
        }
        that.draw_(filteredData);
      });
      return jQuery(this);
    });

    return this.$graphContainer;
  };

  /**
   * call getData function for getting graph JSON data
   * @param {Function} callback function recieve graph JSON data
   */
  MTChart.Graph.prototype.getData = function(callback) {
    MTChart.Data.getData(this.origData_, this.$graphContainer, callback, this);
  };

  /**
   * return data label array with array indexes
   * @param {!Array.<number>} array of indexes
   * @param {!Array.<object>} graph JSON data
   * @return {Array.<string>}
   */
  MTChart.Graph.prototype.getDataLabelByIndex = function(indexArray, data) {
    var label = this.config['dataLabel'] || 'x';
    return jQuery.map(indexArray, function(i) {
      return data[i][label];
    });
  };

  /**
   * get total count of desinated Y data set.
   * @param {!object} graph JSON data
   * @param {!number} the number of set of Y data
   * @return {number} return the number of total count in current range
   */
  MTChart.Graph.prototype.getTotalCount_ = function(data, index) {
    var total = 0,
      str = 'y' + (index || '');
    jQuery.each(data, function(i, v) {
      total = total + (v[str] || v.value || 0);
    });
    return total;
  };

  /**
   * get maximum value among the desinated Y data set
   * @param {!Array.<object>} graph data to get max Y
   * @param {!number} number of set of Y data
   * @return {number} return the number of maxY for graph
   */
  MTChart.Graph.prototype.getMaxY_ = function(data, yLength) {
    var i, maxY, array, sum, key;

    if (this.config['type'] !== 'area') {
      array = [];
      jQuery.each(data, function(index, value) {
        for (i = 0; i < yLength; i++) {
          key = 'y' + (i || '');
          array.push(value[key]);
        }
      });
      maxY = Math.max.apply(null, array);
    } else {
      maxY = Math.max.apply(null, jQuery.map(data, function(value) {
        sum = 0;
        for (i = 0; i < yLength; i++) {
          key = 'y' + (i || '');
          sum = sum + value[key];
        }
        return sum;
      }));
    }

    if (!maxY) {
      return 1;
    }

    if (maxY % 2 !== 0) {
      maxY = maxY + 1;
    }

    return maxY;
  };

  /**
   * caliculate the number of horizental lines in graph
   * @param {!number} maximum value among the Y data set.
   * @return {number}
   */
  MTChart.Graph.prototype.getNumLines_ = function(maxY) {
    var numlines;
    if (maxY >= 18) {
      numlines = 9;
    } else if (maxY === 2) {
      numlines = 3;
    } else {
      numlines = (maxY / 2) + 1;
    }
    return numlines;
  };

  /**
   * return the delta number and className between last and last second count
   * @param {!object} graph JSON data
   * @param {!number} number of set of Y data
   * @return {y:[number,string],y1:[number,string]}
   */
  MTChart.Graph.prototype.getDelta_ = function(data, index) {
    var e, s, delta, key, length = data.length;

    key = 'y' + (index || '');
    e = data[length - 1];
    s = data[length - 2];
    delta = (s && e && s[key]) ? e[key] - s[key] : e[key];
    return delta === undefined ? '' : delta;
  };

  /**
   * return YKeys array for graph setting
   * @param {!number} number of set of y data
   * @return {Array.<string>} array of y key strings
   */
  MTChart.Graph.prototype.getYKeys_ = function(yLength) {
    var i, array = [];
    for (i = 0; i < yLength; i++) {
      array.push('y' + (i || ''));
    }
    return array;
  };

  /**
   * return YLables array for graph setting
   * @param {!number} number of set of y data
   * @return {Array.<string>} array of y key strings
   */
  MTChart.Graph.prototype.getYLabels_ = function(yLength, yLabel) {
    var i, array = [];
    yLabel = yLabel ? yLabel.split(/,/) : [];
    for (i = 0; i < yLength; i++) {
      array.push((yLabel[i] || 'Count'));
    }
    return array;
  };

  MTChart.Graph.prototype.getChartColors_ = function(colors, type) {
    var func = {
      'reverse': function(arr) {
        return arr.reverse();
      },
      'shuffle': function(arr) {
        var i, j, length, tmp;
        length = arr.length;
        for (i = 0; i < length; i++) {
          j = Math.floor(Math.random() * length);
          tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
        }
        return colors;
      },
      'def': function(arr) {
        return arr;
      }
    };
    colors = colors || ['#6AAC2B', '#FFBE00', '#CF6DD3', '#8F2CFF', '#2D85FF', '#5584D4', '#5ED2B8', '#9CCF41', '#F87085', '#2C8087', '#8EEC6A', '#FFE700', '#FF5E19', '#FF4040', '#976BD6', '#503D99', '#395595'];
    return func[(type || 'def')](colors);
  };


  /**
   * Draw Graph
   * @param {!Array.<object>} graph data
   * @param {=string} graph type (bar|line|area|donut)
   * @return nothing
   */
  MTChart.Graph.prototype.draw_ = function(data) {
    var library;

    if (/^canvas/.test(this.config['type'])) {
      library = 'mtchart.graph.easel';
    } else if (/^css/.test(this.config['type'])) {
      library = 'mtchart.graph.cssgraph'
    } else {
      library = 'mtchart.graph.morris';
    }

    require([library], _.bind(function(drawGraph) {
      drawGraph.call(this, data);
    }, this));
  };

  MTChart.Graph.prototype.hexToRgb = function(hexColor) {
    var r = parseInt(hexColor.substr(1, 2), 16);
    var g = parseInt(hexColor.substr(3, 2), 16);
    var b = parseInt(hexColor.substr(5, 2), 16);
    return [r, g, b];
  };

  /**
   * update Graph
   * @param {=Array.<number>}
   * @param {=string} graph unit type (yearly|quater|monthly|weekly|daily|hourly)
   */
  MTChart.Graph.prototype.update_ = function(newRange, unit) {
    var that = this;
    newRange = newRange || [];
    this.$graphEl.remove();
    this.labels.remove();
    this.range = MTChart.Range.generate({
      'start': (newRange[0] || this.range.start),
      'end': (newRange[1] || this.range.end),
      'length': null,
      'maxLength': this.range.maxLength,
      'unit': (unit || this.range.unit),
      'dataType': this.range.dataType,
      'autoSized': this.config['autoSized']
    });
    this.graphData[this.range.unit].done(function(data) {
      var filteredData;
      if (that.range.isTimeline) {
        filteredData = jQuery.grep(data, function(v) {
          return that.range.min <= v.timestamp && v.timestamp <= that.range.max;
        });
      } else {
        filteredData = data.slice(that.range.min, that.range.max + 1);
      }
      that.draw_(filteredData);
    });
  };

  /**
   * @param {!jQuery} jQuery object to which attach label element (typically graph container)
   * @param {!number} length of set of data to use
   * @param {=string} template data to use label
   * @constructor
   */
  MTChart.Graph.Labels = function($container, yLength, template) {
    var i, key;

    this.$labelContainer = jQuery('<div class="graph-labels"></div>');

    if (template) {
      console.log(template);
      this.importLabelTemplateAndAppend_(template);
    }

    this.totals = {};
    for (i = 0; i < yLength; i++) {
      key = 'y' + (i || '');
      this.totals[key] = new MTChart.Graph.Labels.Total(this.$labelContainer, i);
    }

    this.$labelContainer.appendTo($container);
  };

  /**
   * remove label container
   */
  MTChart.Graph.Labels.prototype.remove = function() {
    this.$labelContainer.remove();
  };

  /**
   * get MTChart.Graph.Labels.Total object
   * @param {=number} the number of Y data set
   * @return {MTChart.Graph.Labels.Total}
   */
  MTChart.Graph.Labels.prototype.getTotalObject = function(i) {
    return this.totals['y' + (i || '')];
  };

  /**
   * build html with template string and append its container
   * @param {!string} template data
   * @return nothing
   */
  MTChart.Graph.Labels.prototype.importLabelTemplateAndAppend_ = function(template) {
    var that = this;

    jQuery('<div class="graph-label"></div>')
      .html(_.template(template))
      .prependTo(that.$labelContainer);

    //  MTChart.Data.getData(template, this.$labelContainer, function (templateString) {
    //    jQuery('<div class="graph-label"></div>')
    //      .html(_.template(templateString))
    //      .prependTo(that.$labelContainer);
    //  }, this);
  };

  /**
   * @constructor
   * @param {!jQuery} jQuery object to attach
   * @param {!number} number for identify what Y data is associated with
   */
  MTChart.Graph.Labels.Total = function(container, index) {
    this.index = index;
    this.$totalContainer = jQuery('<div class="graph-total"></div>')
      .appendTo(container);
  };

  /**
   * create element for displaying total count and append its container
   * @param {!number} total count
   */
  MTChart.Graph.Labels.Total.prototype.createTotalCount = function(count) {
    jQuery('<span class="graph-total-count graph-total-count-y"' + (this.index || '') + ' >' + count + '</span>')
      .appendTo(this.$totalContainer);
  };

  /**
   * create element for displaying delta
   * @param {!number} delta count
   */
  MTChart.Graph.Labels.Total.prototype.createDeltaCount = function(delta) {
    var deltaClass = delta ? (delta < 0 ? 'minus' : 'plus') : 'zero';

    jQuery('<span class="graph-delta graph-delta-y"' + (this.index || '') + ' ><span class="' + deltaClass + '">(' + delta + ')</span></span>')
      .appendTo(this.$totalContainer);
  };

  MTChart.Graph.prototype.generateGraphData = function(data) {
    var i, j, td, key, range = this.range,
      start = range.start,
      end = range.end,
      u = range.unit,
      length = range.length,
      array = [],
      yLength = this.config.yLength || 1,
      filteredData, obj, str;
    if (this.range.isTimeline) {
      var dataRange = MTChart.Range.getDataRange(data, this.range.isTimeline);
      start = new Date(Math.min(this.range.min, dataRange.min));
      end = new Date(Math.max(this.range.max, dataRange.max));
      length = MTChart.Range.getLength(start, end, u);
      filteredData = MTChart.Data.filterData(data, dataRange.max, dataRange.min, u, yLength);

      for (i = 0; i < length; i++) {
        td = MTChart.Range.getNextDate(start, end, i, u);
        if (td) {
          key = MTChart.Date.createId(td, u);
          obj = {
            timestamp: td.valueOf(),
            x: MTChart.Date.createXLabel(td, u)
          };
          for (j = 0; j < yLength; j++) {
            str = 'y' + (j || '');
            obj[str] = filteredData[key] ? (filteredData[key][str] || 0) : 0;
          }
          array.push(obj);
        } else {
          break;
        }
      }
    } else {
      array = data;
    }
    if (this.config.type === 'donut') {
      jQuery.each(array, function(i, v) {
        jQuery.extend(v, {
          label: (v.xLabel || v.x),
          value: v.y
        });
      });
    }
    return array;
  };

  return MTChart.Graph;
});