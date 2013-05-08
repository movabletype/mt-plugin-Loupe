define(['mtchart.data', 'mtchart.date', 'mtchart.range'], function (MTChartData, MTChartDate, MTChartRange) {

  var MTChart = {};
  MTChart.Data = MTChartData;
  MTChart.Date = MTChartDate;
  MTChart.Range = MTChartRange;

  /**
   * create List Object
   * If you want to draw list, fire APPEND_LIST event for its container Element like this
   * $('.container').trigger('APPEND_LIST')
   *
   * @param {object} list setings
   * @param {object} range object
   * @return {jQuery} return jQuery object for chaining
   * @constructor
   */
  MTChart.List = function (config, range) {
    var data, template, staticPath, that = this;
    this.id = 'list-' + (new Date()).valueOf() + Math.floor(Math.random() * 100);
    this.config = config;

    staticPath = this.config['staticPath'] || '';

    if (this.config['data']) {
      data = staticPath + this.config['data'];
      this.origData_ = jQuery.getJSON(data);
    }

    if (this.config['template']) {
      template = staticPath + (this.config['template'] || 'list.template');
      this.template_ = jQuery.get(template, 'text');
    }

    this.range = MTChart.Range.generate(range);

    this.$listContainer = jQuery('<div id="' + this.id + '-container" class="list-container"></div>');

    this.$listContainer.on('UPDATE', function (e, range) {
      that.update_(range);
    });

    /**
     * @return {jQuery} return jQuery object for chaining
     * return back the graph data range to callback
     */
    this.$listContainer.on('GET_DATA_RANGE', function (e, callback) {
      that.getData(function (data) {
        callback(MTChart.Range.getDataRange(data, that.range.isTimeline));
      });
      return jQuery(this);
    });

    /**
     * @return {jQuery} return jQuery object for chaining
     * return back the graph label array to callback
     */
    this.$listContainer.on('GET_LABEL', function (e, indexArray, callback) {
      that.getData(function (data) {
        callback(that.getDataLabelByIndex(indexArray, data));
      });
      return jQuery(this);
    });

    /**
     * append graph container to the desinated container
     * @return {jQuery} return jQuery object for chaining
     */
    this.$listContainer.on('APPEND_TO', function (e, $container) {
      that.$listContainer.appendTo($container);
      that.getData(function (data) {
        that.draw_(data);
      });
      return jQuery(this);
    });

    return this.$listContainer;
  };

  /**
   * get list data JSON
   * @param {!Function} callback function which recieve jSON data
   */
  MTChart.List.prototype.getData = function (callback) {
    if (this.config['data']) {
      MTChart.Data.getData(this.origData_, this.$listContainer, callback, this);
    } else {
      callback();
    }
  };

  /**
   * get list template string
   * @param {!Function} callback function which recieve template string
   */
  MTChart.List.prototype.getTemplate = function (callback) {
    MTChart.Data.getData(this.template_, this.$listContainer, callback, this);
  };

  /**
   * generate html using template string
   * @param {!object} list JSON data
   */
  MTChart.List.prototype.draw_ = function (data) {
    var that = this;
    this.getTemplate(function (templateString) {
      that.$listContainer.html(_.template(templateString, that.createListData(data)));
    });
  };

  /**
   * provide x label data for slider
   * @param {!Array.<number>} array of index to get data
   * @param {!object} list JSON data
   */
  MTChart.List.prototype.getDataLabelByIndex = function (indexArray, data) {
    var label = this.config['dataLabel'] || 'x';
    return jQuery.map(indexArray, function (i) {
      return data[i][label];
    });
  };

  /**
   * @param {!object} list JSON data
   * @return {object} filtered data for using list template
   */
  MTChart.List.prototype.createListData = function (data) {
    var filteredData = '';
    if (data) {
      if (this.range.isTimeline) {
        filteredData = MTChart.Data.filterData(data, this.range.max, this.range.min, this.range.unit, 1, true);
      } else {
        filteredData = data.slice(this.range.min, this.range.max + 1);
      }
    }
    return {
      'data': filteredData
    };
  };

  /**
   * update list template
   * @param {=Array.<number>} array of number
   * @param {=string} graph unit type (yearly|quater|monthly|weekly|daily|hourly)
   */
  MTChart.List.prototype.update_ = function (newRange, unit) {
    var that = this;
    newRange = newRange || [];
    unit = unit || this.range.unit;
    this.range = MTChart.Range.generate({
      'start': newRange[0] || this.range.start,
      'end': newRange[1] || this.range.end,
      'length': null,
      'maxLength': this.range.maxLength,
      'unit': unit,
      'dataType': this.range.dataType
    });
    this.getData(function (data) {
      that.draw_(data);
    });
  };

  return MTChart.List;
});