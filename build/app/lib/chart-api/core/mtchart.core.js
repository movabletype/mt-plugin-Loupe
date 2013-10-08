var ChartAPI = (function (global, $) {
  "use strict";
  var jQuery = $;
  var ChartAPI = {};
  var MT = global.MT = global.MT || {};
  MT.ChartAPI = ChartAPI;

  ChartAPI.Data = {};

/**
 * return back cloned data to callback.
 * @param {!jQuery} jQuery ajax/deffered object
 * @param {=jQuery} jQuery objecto of container element to attach ajax response status message which is required when this keyword has context(not null).
 * @param {Function} callback function
 * @param {=Object} current context
 * @return {object}
 */
ChartAPI.Data.getData = function (obj, $container, callback, ctx) {
  var cloneData, status, def, errorClassName;

  /**
   * simple clone method which is supported only primitives, array and object
   */

  function clone(data) {
    var result, $ = jQuery;
    if ($.isArray(data)) {
      result = [];
      $.each(data, function (i, d) {
        result.push(clone(d));
      });
    } else if ($.isPlainObject(data)) {
      result = {};
      $.each(data, function (k, v) {
        result[k] = clone(v);
      });
    } else {
      result = data;
    }
    return result;
  }

  if (obj) {
    obj.done(function (data) {
      if (!cloneData && data) {
        cloneData = clone(data);
      }
      callback(cloneData);
    });

    if (ctx && $container) {
      obj.fail(function (e) {
        status = {
          '404': 'Data is not found',
          '403': 'Data is forbidden to access'
        };
        def = 'Some error occured in the data fetching process';
        errorClassName = e.status ? 'error-' + e.status : 'error-unknown';
        ctx.$errormsg = jQuery('<div class="error ' + errorClassName + '">' + (status[e.status] || def) + '</div>')
          .appendTo($container);
      })
        .always(function () {
          if (ctx.$progress) {
            ctx.$progress.remove();
          }
        })
        .progress(function () {
          if (!ctx.$progress) {
            ctx.$progress = jQuery('<div class="progress">fetching data...</div>')
              .appendTo($container);
          }
        });
    }
  }
};
/**
 * @param {!object} JSON data to filter
 * @param {!Date|number} maximum threshold value for filtering
 * @param {!Date|number} minimum threshold value for filtering
 * @param {!string} graph unit type (yearly|quater|monthly|weekly|daily|hourly)
 * @param {=number} the number of set of Y data
 * @param {boolean} true if you do not want to unify data into a weekly data.
 * @return {object} filtered JSON data
 */
ChartAPI.Data.filterData = function (data, max, min, u, yLength, noConcat) {
  var str, hash = {};
  yLength = yLength || 1;

  jQuery.each(data, function (i, v) {
    var td, key;
    td = ChartAPI.Date.parse(v.x);
    if (td && td >= min && td <= max) {
      key = noConcat ? ChartAPI.Date.createId(td, 'daily') : (function () {
        if (u === 'weekly') {
          td = ChartAPI.Date.getWeekStartday(td);
        }
        return ChartAPI.Date.createId(td, u);
      }());

      if (noConcat) {
        hash[key] = v;
      } else {
        hash[key] = hash[key] || {
          x: v.x
        };
        for (i = 0; i < yLength; i++) {
          str = i ? 'y' + i : 'y';
          hash[key][str] = (hash[key][str] || 0) + ChartAPI.Data.parseFloat(v[str], 10);
        }
      }
    }
  });

  return hash;
};

/**
 * allow parse string with comma
 * @param {string|Number}
 * @return {number}
 */
ChartAPI.Data.parseFloat = function (str) {
  str = (str + '').replace(/,/g, '');
  return parseFloat(str, 10);
};

ChartAPI.Data.addCommas = function (str) {
  str = str.toString ? str.toString() : '';
  while (str !== (str = str.replace(/^(-?\d+)(\d{3})/, '$1,$2'))) {}
  return str;
};

  ChartAPI.Date = {};

/**
 * return the week start day
 * @param {!Date}
 * @return Date
 */
ChartAPI.Date.getWeekStartday = function (d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
};

/**
 * return Date string array with padding zero which is for ISO 8601 string
 * @param {!Date}
 * @param {!string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @return {Array.<string>}
 */
ChartAPI.Date.zeroPadArray = function (d, unit) {
  var array;
  ({
    'yearly': function () {
      array = [d.getFullYear()];
    },
    'monthly': function () {
      array = [d.getFullYear(), d.getMonth() + 1];
    },
    'quarter': function () {
      array = [d.getFullYear(), d.getMonth() + 1];
    },
    'weekly': function () {
      array = [d.getFullYear(), d.getMonth() + 1, d.getDate() - d.getDay()];
    },
    'daily': function () {
      array = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
    },
    'hourly': function () {
      array = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours()];
    }
  })[unit]();
  return jQuery.map(array, function (v) {
    v = v.toString();
    return v.length === 1 ? '0' + v : v;
  });
};

/**
 * return uniformalized Date string to use kinds of Date ID
 * @param {!Date}
 * @param {!string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @return {string}
 */
ChartAPI.Date.createId = function (d, u) {
  return ChartAPI.Date.zeroPadArray(d, u).join('');
};

/**
 * return uniformalized Date string to use kinds of Date label
 * @param {!Date}
 * @param {!string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @return {string}
 */
ChartAPI.Date.createXLabel = function (d, u) {
  var hour, str, array = ChartAPI.Date.zeroPadArray(d, u);
  if (u === 'hourly') {
    hour = array.pop();
    str = array.join('-') + ' ' + hour + ':00';
  } else {
    str = array.join('-');
  }
  return str;
};

/**
 * parse argument and return back Date object
 * reformeded date string and try again when Date.parser returns NaN or Invalid
 * @param {Date|number|string|null}
 * @return {Date|null}
 */
ChartAPI.Date.parse = function (d) {
  var date;
  if (!d || d instanceof Date) {
    date = d || null;
  } else if (typeof d === 'number') {
    date = new Date(d);
  } else {
    date = new Date(Date.parse(d.toString()));
  }
  if (date && /NaN|Invalid Date/.test(date.toString())) {
    var arr, today = new Date();
    arr = d.toString().split(/[T\s]/);
    date = arr[0].split(/\D/);

    var year, month, day;
    year = parseInt(date[0], 10) || today.getFullYear();
    year = year < 100 ? year + 1900 : year;
    month = date[1] ? parseInt(date[1], 10) - 1 : 0;
    day = parseInt(date[2], 10) || 1;

    var time, timezone, timezoneOffset;

    if (arr[1]) {
      var arr2 = arr[1].split(/[\+\-Z]/);
      time = arr2[0] ? arr2[0].split(/[:\.]/) : [0, 0, 0, 0];
      if (/Z$/.test(d)) {
        timezoneOffset = 0;
      } else {
        timezone = arr2[1] ? arr2[1].split(/\D/) : [0, 0];
        var sym = /\+/.test(arr[1]) ? -1 : 1;
        timezoneOffset = sym * ((parseInt(timezone[0], 10) || 0) * 60 + (parseInt(timezone[1], 10) || 0));
      }
    } else {
      time = [0, 0, 0];
      /* if the string is like ISO8601 date-only, use UTC (follows ES5 convention) */
      timezoneOffset = /\d{4}-\d{2}-\d{2}/.test(arr[0]) ? 0 : today.getTimezoneOffset();
    }

    var hour, minute, second, millisecond;
    hour = parseInt(time[0], 10) || 0;
    minute = parseInt(time[1], 10) || 0;

    second = parseInt(time[2], 10) || 0;
    millisecond = parseInt(time[3], 10) || 0;

    date = new Date(year, month, day, hour, minute, second, millisecond);

    if (timezoneOffset !== today.getTimezoneOffset()) {
      var utc = date.valueOf() - today.getTimezoneOffset() * 1000 * 60;
      date = new Date(utc + timezoneOffset * 1000 * 60);
    }
  }
  return date;
};

/**
 * @param  {Date|String} date Date class to get end date of month
 * @return {Date}      last date of month
 */
ChartAPI.Date.getEndOfMonth = function (date) {
  date = date instanceof Date ? date : (ChartAPI.Date.parse(date) || date);
  if (date instanceof Date) {
    var month = date.getMonth();
    date = new Date((new Date(date.getFullYear(), month + 1, 1, 0, 0, 0)) - 1);
  }
  return date;
};

/**
 * @param {!Date}
 * @param {!number} number of data
 * @param {!string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @param {boolean} calculates as start date when true
 * @return {Date}
 */
ChartAPI.Date.calcDate = function (date, l, u, sym) {
  var y, m, d, h;
  y = date.getFullYear();
  m = date.getMonth();
  d = date.getDate();
  h = 0;
  l = l - 1;
  sym = sym ? -1 : 1;

  var adjustEndDate = function () {
    if (d > 27) {
      var endOfMonth = ChartAPI.Date.getEndOfMonth((new Date(y, m, 27, h)));
      if (endOfMonth.getDate) {
        endOfMonth = endOfMonth.getDate();
        d = d > endOfMonth ? endOfMonth : d;
      }
    }
  };

  ({
    'yearly': function () {
      y = y + (sym * l);
      adjustEndDate();
    },
    'monthly': function () {
      m = m + (sym * l);
      adjustEndDate();
    },
    'quarter': function () {
      m = m + (sym * l * 3);
      adjustEndDate();
    },
    'weekly': function () {
      d = d + (sym * l * 7) - date.getDay();
    },
    'daily': function () {
      d = d + (sym * l);
    },
    'hourly': function () {
      h = date.getHours() + (sym * l);
    }
  })[u]();
  return new Date(y, m, d, h);
};

  ChartAPI.Range = {};
/**
 * return unified Range data object (plain object which does not have prototyped method)
 * @param {{start: string|number|Date|null, end: string|number|Date|null, length: string|number|null, maxLength: string|number|null, unit: string|null, dataType: string|null}}
 * @return {{start: Date, end: Date, length: number, maxLength: number, unit: string, dataType: string, max: Date|number, min: Date|number, isTimeline: boolean}}
 */
ChartAPI.Range.factory = function (obj) {
  var fn;
  obj = obj || {};
  obj.maxLength = obj.maxLength || 90;
  obj.dataType = obj.dataType || 'timeline';
  obj.isTimeline = ChartAPI.Range.isTimeline(obj.dataType);
  fn = obj.isTimeline ? ChartAPI.Range.calcDate : ChartAPI.Range.calcNum;
  return fn(obj.start, obj.end, obj.length, obj.maxLength, obj.unit, obj.dataType, obj.autoSized);
};

ChartAPI.Range.generate = ChartAPI.Range.factory;

/**
 * @param {string|null} data type
 * @return {boolean}
 */
ChartAPI.Range.isTimeline = function (dataType) {
  return !dataType || dataType === 'timeline';
};

/**
 * @param {=Date|null} start date
 * @param {=Date|null} end date
 * @param {=number|null} length: number of data from start date or end date. length is required when both start and end dates are null
 * @param {=number|null} maxinum length for data
 * @param {=string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @param {boolean} when true, auto caliculate length of data according to window width
 * @return {{start: Date, end: Date, length: number, maxLength: number, unit: string, dataType: string, max: Date|number, min: Date|number, isTimeline: boolean}}
 * When unit is monthly, quarterly, or yearly, adjust date not to carry over to next month. for example, new Date(2013,1,30) (which returns 2 Mar) ajusts new Date(2013,1,28)
 */
ChartAPI.Range.calcDate = function (s, e, length, maxLength, unit, dataType, autoSized) {
  unit = unit || 'monthly';
  length = length || (unit === 'hourly' ? 24 : 10);

  if (autoSized) {
    var width = jQuery(window).width();
    maxLength = Math.min(Math.ceil(width * 0.021875), maxLength);
    length = maxLength;
  }

  s = ChartAPI.Date.parse(s);
  e = ChartAPI.Date.parse(e);

  if (!s && !e) {
    e = ChartAPI.Range.getEndDate(new Date(), unit);
  }

  if (!s) {
    length = unit.match(/(?:hourly)/) ? length - 1 : length;
    s = ChartAPI.Range.getStartDate(ChartAPI.Date.calcDate(e, length, unit, true), unit);
  }
  if (!e) {
    length = unit.match(/(?:hourly)/) ? length - 1 : length;
    e = ChartAPI.Range.getEndDate(ChartAPI.Date.calcDate(s, length, unit, false), unit);
  }
  if (e > new Date()) {
    e = new Date();
  }
  if (s > e) {
    s = e;
  }
  length = ChartAPI.Range.getLength(s, e, unit);
  if (length > maxLength) {
    length = maxLength;
    s = ChartAPI.Date.calcDate(e, length, unit, true);
  }
  return {
    start: s,
    end: e,
    length: length,
    maxLength: maxLength,
    unit: unit,
    dataType: dataType,
    max: ChartAPI.Range.getEndDate(e, unit),
    min: ChartAPI.Range.getStartDate(s, unit),
    isTimeline: true
  };
};

/**
 * @param {=Date|null} start date
 * @param {=Date|null} end date
 * @param {=number|null} length: number of data from start date or end date. length is required when both start and end dates are null
 * @param {=number|null} maxinum length for data
 * @param {=string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @param {boolean} when true, auto caliculate length of data according to window width
 * @return {{start: Date, end: Date, length: number, maxLength: number, unit: string, dataType: string, max: Date|number, min: Date|number, isTimeline: boolean}}
 */
ChartAPI.Range.calcNum = function (s, e, length, maxLength, unit, dataType, autoSized) {
  length = length || 10;

  if (autoSized) {
    var width = jQuery(window).width();
    maxLength = Math.min(Math.ceil(width * 0.021875), maxLength);
    length = Math.min(length, maxLength);
  }

  if (!s && !e) {
    s = 0;
    e = length - 1;
  }

  s = parseInt(s, 10) || (s === 0 ? 0 : null);
  e = parseInt(e, 10) || (e === 0 ? 0 : null);

  if (s === null) {
    s = e - length;
    if (s < 0) {
      s = 0;
    }
  }
  if (e === null) {
    e = s + length;
  }
  if (s > e) {
    s = e;
  }
  length = e - s + 1;
  if (length > maxLength) {
    length = maxLength;
    s = e - maxLength;
  }
  return {
    start: s,
    end: e,
    length: length,
    maxLength: maxLength,
    dataType: dataType,
    unit: null,
    max: e,
    min: s,
    isTimeline: false
  };
};

/**
 * return start date within the date's unit range
 * @param {!Date}
 * @param {!string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @return {Date}
 */
ChartAPI.Range.getStartDate = function (d, unit) {
  var start, year = d.getFullYear(),
    month = d.getMonth(),
    date = d.getDate();
  ({
    'yearly': function () {
      start = new Date(year, 0, 1, 0, 0, 0);
    },
    'monthly': function () {
      start = new Date(year, month, 1, 0, 0, 0);
    },
    'quarter': function () {
      start = new Date(year, month, 1, 0, 0, 0);
    },
    'weekly': function () {
      start = new Date(year, month, date - d.getDay(), 0, 0, 0);
    },
    'daily': function () {
      start = new Date(year, month, date, 0, 0, 0);
    },
    'hourly': function () {
      start = new Date(year, month, date, d.getHours(), 0, 0);
    }
  })[unit]();
  return start;
};

/**
 * return end date within the date's unit range
 * @param {!Date}
 * @param {!string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @return {Date}
 */
ChartAPI.Range.getEndDate = function (d, unit) {
  var end, year = d.getFullYear(),
    month = d.getMonth(),
    date = d.getDate();
  ({
    'yearly': function () {
      end = new Date(year, 11, 31, 23, 59, 59, 999);
    },
    'monthly': function () {
      end = new Date(new Date(year, month + 1, 1, 0, 0, 0).valueOf() - 1);
    },
    'quarter': function () {
      end = new Date(new Date(year, month + 1, 1, 0, 0, 0).valueOf() - 1);
    },
    'weekly': function () {
      end = new Date(year, month, date - d.getDay() + 6, 23, 59, 59, 999);
    },
    'daily': function () {
      end = new Date(year, month, date, 23, 59, 59, 999);
    },
    'hourly': function () {
      end = new Date(year, month, date, d.getHours(), 59, 59, 999);
    }
  })[unit]();
  return end < new Date() ? end : new Date();
};

/**
 * return next date against the desinated range unit
 * @param {Date} start date
 * @param {Date} end date
 * @param {number} increment number from start date
 * @param {string} data u
 * @return {Date}
 */
ChartAPI.Range.getNextDate = function (s, e, i, u) {
  var d, year = s.getFullYear(),
    month = s.getMonth(),
    date = s.getDate();
  ({
    'yearly': function (i) {
      d = new Date(year + i, 0, 1);
    },
    'monthly': function (i) {
      d = new Date(year, month + i, 1);
    },
    'quarter': function (i) {
      d = new Date(year, month + i * 3, 1);
    },
    'weekly': function (i) {
      d = new Date(year, month, date + i * 7 - s.getDay());
    },
    'daily': function (i) {
      d = new Date(year, month, date + i);
    },
    'hourly': function (i) {
      d = new Date(year, month, date, s.getHours() + i);
    }
  })[u](i);
  return d < e ? d : null;
};

/**
 * return max and min value in JSON data
 * @param {!object} JSON data
 * @param {=boolean} true when data type is timeline
 * @return {{max:number, min:number}}
 */
ChartAPI.Range.getDataRange = function (data, isTimeline) {
  var map, max, min;

  if (isTimeline) {
    map = jQuery.map(data, function (v) {
      return ChartAPI.Date.parse(v.x)
        .valueOf();
    });
    max = Math.max.apply(null, map);
    min = Math.min.apply(null, map);
  } else {
    min = 0;
    max = data.length - 1;
  }

  return {
    max: max,
    min: min
  };
};

/**
 * return number of data between start and end date
 * @param {!Date}
 * @param {!Date}
 * @param {!string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @param {number}
 */
ChartAPI.Range.getLength = function (s, e, u) {
  var length;
  ({
    'yearly': function () {
      length = Math.ceil(e.getFullYear() - s.getFullYear());
    },
    'monthly': function () {
      length = Math.ceil(e.getFullYear() * 12 + e.getMonth() - (s.getFullYear() * 12 + s.getMonth()));
    },
    'quarter': function () {
      length = Math.ceil((e.getFullYear() * 12 + e.getMonth() - (s.getFullYear() * 12 + s.getMonth())) / 3);
    },
    'weekly': function () {
      length = Math.ceil((ChartAPI.Date.getWeekStartday(e) - ChartAPI.Date.getWeekStartday(s)) / (7 * 24 * 60 * 60 * 1000));
    },
    'daily': function () {
      s = new Date(s.getFullYear(), s.getMonth(), s.getDate());
      length = Math.ceil((e - s) / (24 * 60 * 60 * 1000)) - 1;
    },
    'hourly': function () {
      length = Math.ceil((e - s) / (60 * 60 * 1000));
    }
  })[u]();
  return length > 0 ? length + 1 : 1;
};

  /**
 * @typedef {Object} graphConfig
 * @property {string=} type - Graph type. default is morris.bar
 * @property {string=} staticPath - staticPath is the base path for getting JSON files with ajax
 * @property {(string|object)=} data - data object to use as graph data. you can use JSON file name for it. ChartAPI gets its file with ajax. When this value is not set, try to fetch 'graph.json' file
 * @property {number=} yLength - you can set how many y data set use in the graph. default is 1.
 * @property {boolean=} autoSized - If true, graph will rerender when window resized. default is false.
 * @property {string=} dataLabel - you can set the desinated data value for data label, which is used with Graph List. default is 'x'
 * @property {graphConfig=} fallback - When browser does not have capavilities for the graph type, use fallback setting as graphConfig
 * @property {array=} chartColors - Hex colors list to use in graph bar/line. default is preset colors
 * @property {object=} label - label settings. If it's not set, graph label is not appeared.
 */

/**
 * @typedef {Object} graphRange
 * @property {(string|number|Date)=} start - start date time. paramater should be parse enabled format with Date
 * @property {(string|number|Date)=} end - end date time. paramater should be parse enabled format with Date
 * @property {number=} length - The length of range. default is 10
 * @property {number=} maxLength - max length of range. default is 90
 * @property {string=} unit - duration unit for data
 * @property {string=} dataType - 'timeline' or 'general'. default is timeline.
 */

/**
 * ChartAPI.Graph creates Graph Object and encapsulates it, which returns jQuery object to iteract graph object.<br><br>
 * If you want to draw graph, fire APPEND_GRAPH event for its container Element like following
 * $container is the jQuery object to which the graph append
 * $('#graphContainer').trigger('APPEND_TO',[$container])
 * you want to update graph as well, fire UPDATE event like the same manner above.
 *
 * @param {graphConfig=} config - graph config
 * @param {graphRange=} range - graph range
 * @returns {jQuery} return container element wrapped with jQuery
 * @constructor
 */
ChartAPI.Graph = function (config, range) {
  this.config = $.extend({
    type: 'morris.bar',
    staticPath: '',
    data: 'graph.json'
  }, config);

  this.config.id = 'graph-' + (new Date()).valueOf() + Math.floor(Math.random() * 100);
  this.config.yLength = parseInt(this.config.yLength, 10) || 1;

  this.range = ChartAPI.Range.generate(range);

  if (typeof this.config.data === 'string') {
    this.origData_ = $.getJSON(this.config.staticPath + this.config.data);
  } else {
    this.origData_ = $.Deferred();
    this.origData_.resolve(this.config.data);
  }

  this.graphData = {};
  this.graphData[this.range.unit] = $.Deferred();
  this.graphData[this.range.unit].notify();

  this.getData($.proxy(function (data) {
    this.graphData[this.range.unit].resolve(this.generateGraphData(data));
  }, this));

  var $graphContainer = this.$graphContainer = $('<div id="' + this.config.id + '-container" class="graph-container">');

  /**
   * @return {jQuery} return jQuery object for chaining
   * update graph
   */
  $graphContainer.on('UPDATE', $.proxy(function (e, newRange, unit) {
    this.update_(newRange, unit);
    return $graphContainer;
  }, this));

  $graphContainer.on('REMOVE', $.proxy(function () {
    this.remove_();
  }, this));

  // IE8 fires resize event even when document.body.innerWidht/innerHeight changing
  // so check window.width and update only when window.width changing.
  var windowWidth = $(window).width();
  this.updateFunc = $.proxy(function () {
    if (windowWidth && windowWidth !== $(window).width()) {
      windowWidth = $(window).width();
      this.update_();
    }
  }, this);

  this.setAutoResizeUpdate();

  var isTimeline = this.range.isTimeline;

  /**
   * @return {jQuery} return jQuery object for chaining
   * return back the graph data range to callback
   */
  $graphContainer.on('GET_DATA_RANGE', $.proxy(function (e, callback) {
    this.getData(function (data) {
      callback(ChartAPI.Range.getDataRange(data, isTimeline));
    });
    return $graphContainer;
  }, this));

  /**
   * @return {jQuery} return jQuery object for chaining
   * return back the graph label array to callback
   */
  $graphContainer.on('GET_LABEL', $.proxy(function (e, indexArray, callback) {
    $.proxy(this.getData($.proxy(function (data) {
      callback(this.getDataLabelByIndex(indexArray, data));
    }, this), this));
    return $graphContainer;
  }, this));

  /**
   * append graph container to the desinated container
   * @return {jQuery} return jQuery object for chaining
   */
  $graphContainer.on('APPEND_TO', $.proxy(function (e, container) {
    $graphContainer.appendTo(container);

    this.graphData[this.range.unit].done($.proxy(function (data) {
      this.draw_(data, this.range, this.config);
    }, this));

    return $graphContainer;
  }, this));

  return this.$graphContainer;
};

ChartAPI.Graph.prototype.sliceData = function (data, range) {
  return range.isTimeline ? $.grep(data, $.proxy(function (v) {
    return range.min <= v.timestamp && v.timestamp <= range.max;
  }, this)) : data.slice(range.min, range.max + 1);
};

ChartAPI.Graph.prototype.setAutoResizeUpdate = function () {
  if (this.config.autoResize) {
    $(window).on('orientationchange debouncedresize', this.updateFunc);
  }
};


/**
 * call getData function for getting graph JSON data
 * @param {Function} callback function recieve graph JSON data
 */
ChartAPI.Graph.prototype.getData = function (callback) {
  ChartAPI.Data.getData(this.origData_, this.$graphContainer, callback, this);
};

/**
 * return data label array with array indexes
 * @param {!(Array.<number>)} indexArray - array of indexes
 * @param {!(Array.<object>)} data - array of graph data
 * @return {Array.<string>}
 */
ChartAPI.Graph.prototype.getDataLabelByIndex = function (indexArray, data) {
  var label = this.config.dataLabel || 'x';
  return $.map(indexArray, function (i) {
    return data[i][label];
  });
};

/**
 * get total count of desinated Y data set.
 * @param {!object} graph JSON data
 * @param {!number} the number of set of Y data
 * @return {number} return the number of total count in current range
 */
ChartAPI.Graph.prototype.getTotalCount_ = function (data, index) {
  var total = 0,
    str = 'y' + (index || '');
  $.each(data, function (i, v) {
    total = total + parseInt((v[str] || v.value || 0), 10);
  });
  return total;
};

/**
 * return the delta number and className between last and last second count
 * @param {!object} graph JSON data
 * @param {!number} number of set of Y data
 * @return {!(number|string)}
 */
ChartAPI.Graph.prototype.getDelta_ = function (data, index) {
  var e, s, delta, key, length = data.length;

  key = 'y' + (index || '');
  e = data[length - 1];
  s = data[length - 2];
  delta = (s && e && s[key]) ? e[key] - s[key] : e[key];
  return delta === undefined ? '' : delta;
};

/**
 * return array of the preset colors
 * @returns ['#6AAC2B', '#FFBE00', '#CF6DD3', '#8F2CFF', '#2D85FF', '#5584D4', '#5ED2B8', '#9CCF41', '#F87085', '#2C8087', '#8EEC6A', '#FFE700', '#FF5E19', '#FF4040', '#976BD6', '#503D99', '#395595']
 */
ChartAPI.Graph.presetColors = function () {
  return ['#6AAC2B', '#FFBE00', '#CF6DD3', '#8F2CFF', '#2D85FF', '#5584D4', '#5ED2B8', '#9CCF41', '#F87085', '#2C8087', '#8EEC6A', '#FFE700', '#FF5E19', '#FF4040', '#976BD6', '#503D99', '#395595'];
};

/**
 * return colors with some manipulations
 * @param  {(Array.<string>)=} colors
 * colors to use, default is ChartAPI.Graph.presetColors colors
 * @param  {string=} type
 * you can use 'reverse' or 'shuffle' manipulation types. default is the straightfoward
 * @return {Array.<string>} the array of colors
 */
ChartAPI.Graph.getChartColors = function (colors, type) {
  var func = {
    'reverse': function (arr) {
      return arr.reverse();
    },
    'shuffle': function (arr) {
      var i, j, length, tmp;
      length = arr.length;
      for (i = 0; i < length; i++) {
        j = Math.floor(Math.random() * length);
        tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
      return arr;
    },
    'def': function (arr) {
      return arr;
    }
  };
  return func[(type || 'def')](colors || ChartAPI.Graph.presetColors());
};

ChartAPI.Graph.cachedChartColors = {};
ChartAPI.Graph.getCachedChartColors = function (graphId, colors, type) {
  ChartAPI.Graph.cachedChartColors[graphId] = ChartAPI.Graph.cachedChartColors[graphId] || ChartAPI.Graph.getChartColors(colors, type);
  return ChartAPI.Graph.cachedChartColors[graphId];
};

/**
 * Draw Graph
 * @param {!(Array.<object>)} graph data
 * @param {string=} graph type (bar|line|area|donut)
 */
ChartAPI.Graph.prototype.draw_ = function (data, range, config) {
  var graphData = this.sliceData(data, range);

  var arr = config.type.split('.'),
    lib = arr[0],
    method = arr[1],
    labelTemplate = this.labelTemplate;

  if (config.fallback && config.fallback.test) {
    if (!ChartAPI.Graph.test[config.fallback.test]()) {
      arr = config.fallback.type.split('.');
      lib = arr[0];
      method = arr[1];
      config = $.extend(config, config.fallback);
    }
  }
  if (config.chartColors && typeof config.chartColors === 'string') {
    config.chartColors = config.chartColors.split(',');
  }

  this.graphObject = ChartAPI.Graph[lib][method](graphData, config, range, this.$graphContainer);

  var finalize = $.proxy(function () {
    this.generateLabel(labelTemplate, config, range, graphData);
  }, this);

  if (config.label) {
    if (labelTemplate) {
      finalize(labelTemplate);
    } else {
      if (config.label.template) {
        labelTemplate = config.label.template;
        if (window.require && typeof require === 'function') {
          var templateType = config.label.type;
          require([templateType + '!' + config.staticPath + labelTemplate], $.proxy(function (template) {
            labelTemplate = this.labelTemplate = template;
            finalize();
          }, this));
        } else {
          var dfd = $.get(config.staticPath + labelTemplate, 'text');
          ChartAPI.Data.getData(dfd, this.$graphContainer, $.proxy(function (template) {
            labelTemplate = this.labelTemplate = template;
            finalize();
          }, this));
        }
      } else {
        labelTemplate = this.labelTemplate = '<span class="graph-label-label"></span>';
        finalize();
      }
    }
  }
};

ChartAPI.Graph.test = {};

ChartAPI.Graph.test.canvas = function () {
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
};

ChartAPI.Graph.test.svg = function () {
  var ns = {
    'svg': 'http://www.w3.org/2000/svg'
  };
  return !!document.createElementNS && !! document.createElementNS(ns.svg, 'svg').createSVGRect;
};

/*
 * this test checks suport both VML and SVG since we only use VML for SVG fallback
 */
ChartAPI.Graph.test.vml = function () {
  var vmlSupported;
  var svgSupported = ChartAPI.Graph.test.svg();
  // http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser
  if (!svgSupported) {
    var a = document.body.appendChild(document.createElement('div'));
    a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
    var b = a.firstChild;
    b.style.behavior = "url(#default#VML)";
    vmlSupported = b ? typeof b.adj === "object" : true;
    a.parentNode.removeChild(a);
  }
  return (svgSupported || vmlSupported);
};

ChartAPI.Graph.prototype.generateLabel = function (template, config, range, graphData) {
  var labelData = config.label.data ? config.label.data : {},
    yLength = config.label.yLength || config.yLength,
    labels,
    dfd;

  if (labelData && typeof labelData === 'string') {
    dfd = $.getJSON(config.staticPath + labelData);
  } else {
    dfd = $.Deferred();
    dfd.resolve(labelData);
  }

  dfd.done($.proxy(function (data) {
    if (template && typeof template === 'function') {
      template = template(data);
    } else if ( !! window._) {
      template = _.template(template, data);
    } else {
      template = template;
    }

    labels = this.labels = new ChartAPI.Graph.Labels(this.$graphContainer, yLength, template);

    this.getData($.proxy(function (data) {
      for (var i = 0; i < yLength; i++) {
        if (!config.label.hideTotalCount) {
          labels.getTotalObject(i).createTotalCount(this.getTotalCount_(data, i), config.label.noComma);
        }
        if (!config.label.hideDeltaCount && range.isTimeline) {
          labels.getTotalObject(i).createDeltaCount(this.getDelta_(graphData, i), config.label.noComma);
        }
      }
    }, this));

  }, this));
};

/**
 * update Graph
 * @param {(Array.<number>)=}
 * @param {string=} graph unit type (yearly|quater|monthly|weekly|daily|hourly)
 */
ChartAPI.Graph.prototype.update_ = function (newRange, unit) {
  newRange = newRange || [];
  if (this.graphObject && this.graphObject.remove) {
    this.graphObject.remove();
  }
  if (this.labels) {
    this.labels.remove();
  }
  this.range = ChartAPI.Range.generate({
    'start': (newRange[0] || this.range.start),
    'end': (newRange[1] || this.range.end),
    'length': null,
    'maxLength': this.range.maxLength,
    'unit': (unit || this.range.unit),
    'dataType': this.range.dataType,
    'autoSized': this.range.autoSized
  });

  this.graphData[this.range.unit].done($.proxy(function (data) {
    this.draw_(data, this.range, this.config);
  }, this));
};

ChartAPI.Graph.prototype.remove_ = function () {
  if (this.config.autoResize) {
    $(window).off('orientationchange debouncedresize', this.updateFunc);
  }
  if (this.graphObject && this.graphObject.remove) {
    this.graphObject.remove();
  }
  if (this.labels) {
    this.labels.remove();
  }
  this.$graphContainer.remove();
};

ChartAPI.Graph.prototype.generateGraphData = function (data) {
  var i, j, td, key, range = this.range,
    start = range.start,
    end = range.end,
    u = range.unit,
    length = range.length,
    array = [],
    yLength = this.config.yLength || 1,
    filteredData, obj, str;
  if (this.range.isTimeline) {
    var dataRange = ChartAPI.Range.getDataRange(data, this.range.isTimeline);
    start = new Date(Math.min(this.range.min, dataRange.min));
    end = new Date(Math.max(this.range.max, dataRange.max));
    length = ChartAPI.Range.getLength(start, end, u);
    filteredData = ChartAPI.Data.filterData(data, dataRange.max, dataRange.min, u, yLength);

    for (i = 0; i < length; i++) {
      td = ChartAPI.Range.getNextDate(start, end, i, u);
      if (td) {
        key = ChartAPI.Date.createId(td, u);
        obj = {
          timestamp: td.valueOf(),
          x: ChartAPI.Date.createXLabel(td, u)
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
  if (this.config.type === 'morris.donut') {
    $.each(array, function (i, v) {
      $.extend(v, {
        label: (v.xLabel || v.x),
        value: v.y
      });
    });
  }

  return array;
};

  /**
 * @param {!jQuery}
 jQuery object to which attach label element(typically graph container)
 * @param {!number} length of set of data to use
 * @param {=string} html string to use label
 * @constructor
 */
ChartAPI.Graph.Labels = function ($container, yLength, template) {
  var i, key;

  this.$labelContainer = $('<div class="graph-labels"></div>');
  if (template) {
    $('<div class="graph-label"></div>').html(template).prependTo(this.$labelContainer);
  }

  this.totals = {};
  for (i = 0; i < yLength; i++) {
    key = 'y' + (i || '');
    this.totals[key] = new ChartAPI.Graph.Labels.Total(this.$labelContainer, i);
  }

  this.$labelContainer.appendTo($container);
};

/**
 * remove label container
 */
ChartAPI.Graph.Labels.prototype.remove = function () {
  this.$labelContainer.remove();
};

/**
 * get ChartAPI.Graph.Labels.Total object
 * @param {=number} the number of Y data set
 * @return {ChartAPI.Graph.Labels.Total}
 */
ChartAPI.Graph.Labels.prototype.getTotalObject = function (i) {
  return this.totals['y' + (i || '')];
};

/**
 * @constructor
 * @param {!jQuery} jQuery object to attach
 * @param {!number} number for identify what Y data is associated with
 */
ChartAPI.Graph.Labels.Total = function (container, index) {
  this.index = index;
  this.$totalContainer = jQuery('<div class="graph-total"></div>').appendTo(container);
};

/**
 * create element for displaying total count and append its container
 * @param {!number} total count
 */
ChartAPI.Graph.Labels.Total.prototype.createTotalCount = function (count, noComma) {
  this.count = noComma ? count + '' : ChartAPI.Data.addCommas(count);
  jQuery('<span class="graph-total-count graph-total-count-y' + (this.index || '') + '">' + this.count + '</span>').appendTo(this.$totalContainer);
};

/**
 * create element for displaying delta
 * @param {!number} delta count
 */
ChartAPI.Graph.Labels.Total.prototype.createDeltaCount = function (delta, noComma) {
  this.deltaClass = delta ? (delta < 0 ? 'minus' : 'plus') : 'zero';
  this.delta = noComma ? delta + '' : ChartAPI.Data.addCommas(delta);

  jQuery('<span class="graph-delta graph-delta-y"' + (this.index || '') + '><span class="' + this.deltaClass + '">(' + this.delta + ')</span></span>').appendTo(this.$totalContainer);
};

  ChartAPI.Graph.css = {};

ChartAPI.Graph.css.Base = function (data, config, range, $container) {
  this.data = data;
  this.config = config;
  this.range = range;
  this.$container = $container;
  this.len = data.length;
  this.$graphEl = $('<div id="' + config.id + '" class="css-graph">');
};

ChartAPI.Graph.css.Base.prototype.remove = function () {
  this.$graphEl.remove();
};

ChartAPI.Graph.css.Base.prototype.horizontalBar = function (data, config, range, $container) {
  if (config.width) {
    this.$graphEl.css({
      'width': config.width,
      'max-width': '100%',
      'margin': '0 auto'
    });
  }

  var barColor = config.barColor || ChartAPI.Graph.getCachedChartColors(config.id, null, config.chartColorsMethod)[1],
    barBackgroundColor = config.barBackgroundColor || '#f0f0f0',
    dateColor = config.dateColor || '#999999',
    dateColorSaturday = config.dateColorSaturday || dateColor,
    dateColorSunday = config.dateColorSunday || dateColor,
    labelColor = config.labelColor || '#999999',
    barWidth = parseInt(config.barWidth, 10) || 30,
    barMarginLeft = parseInt(config.barMarginLeft, 10) || 30,
    barInterval = parseInt(config.barInterval, 10) || 5,
    labelSize = parseInt(config.labelSize, 10) || barWidth * 0.45,
    dateLabelSize = parseInt(config.dateLabelSize, 10) || labelSize,
    createCSSGraphBarEl = function () {
      return $('<div class="css-graph-container"><div class="css-graph-date"></div><div class="css-graph-bar-container" style="height:' + barWidth + 'px; margin-bottom:' + barInterval + 'px"><div class="css-graph-bar"></div><div class="css-graph-bar-background"><div class="css-graph-bar-count"></div></div></div>');
    },
    dataY = $.map(data, function (d) {
      return parseInt(d.y, 10);
    }),
    label = $.map(data, function (d) {
      return {
        value: parseInt(d.x.substr(d.x.lastIndexOf('-') + 1), 10).toString(),
        weekday: ChartAPI.Date.parse(d.x) ? ChartAPI.Date.parse(d.x).getDay() : null
      };
    }),
    maxY = Math.max.apply(null, dataY) || 1,
    yLabel = config.yLabel || dataY,
    width, $el, $background, $bar, $count, $date;

  for (var i = this.len; i > 0;) {
    i = i - 1;
    width = Math.floor((dataY[i] / maxY) * 100) - 15;
    $el = createCSSGraphBarEl();
    $background = $el.find('.css-graph-bar-background');
    $background.css({
      'background-color': barBackgroundColor
    });

    if (config.showDate) {
      $date = $el.find('.css-graph-date');
      $date.text(label[i].value).css({
        'color': dateColor,
        'font-size': dateLabelSize + 'px',
        'line-height': barWidth + 'px'
      });
      if (label[i].weekday === 6) {
        $date.addClass('saturday').css({
          'color': dateColorSaturday
        });
      } else if (label[i].weekday === 0) {
        $date.addClass('sunday').css({
          'color': dateColorSunday
        });
      }

      $el.find('.css-graph-bar-container').css({
        'margin-left': barMarginLeft + 'px'
      });
    }

    $bar = $el.find('.css-graph-bar');
    $bar.css({
      'width': width + '%',
      'background-color': barColor
    });
    $count = $el.find('.css-graph-bar-count');
    $count.text(yLabel[i]).css({
      'color': labelColor,
      'font-size': labelSize + 'px',
      'line-height': barWidth + 'px'
    });
    $el.appendTo(this.$graphEl);
  }

  this.$graphEl.appendTo($container);
};

ChartAPI.Graph.css.Base.prototype.ratioHorizontalBar = function (data, config, range, $container) {
  /*jshint maxcomplexity: 25*/
  var yLength = config.yLength,
    barWidth = parseInt(config.barWidth, 10) || 30,
    barMarginLeft = parseInt(config.barMarginLeft, 10) || 30,
    barInterval = parseInt(config.barInterval, 10) || 5,
    labelSize = parseInt(config.labelSize, 10) || barWidth * 0.45,
    dateColor = config.dateColor || '#999999',
    barColors = config.barColors || ChartAPI.Graph.getCachedChartColors(config.id, null, config.chartColorsMethod),
    labelColors = config.labelColors,
    labelClasses = config.labelClasses,
    i, j,
    d, dataY, totalY, $barContainer, $el, $bar, label, $date, width, totalWidth;

  for (i = 0; i < this.len; i++) {
    d = data[i];
    dataY = [];
    totalY = 0;
    totalWidth = 0;
    for (j = 0; j < yLength; j++) {
      dataY.push(d['y' + (j || '')]);
      totalY = totalY + parseInt(d['y' + (j || '')], 10);
    }

    $barContainer = $('<div class="css-graph-container"></div>').appendTo(this.$graphEl);
    if (config.showDate && d.x) {
      label = parseInt(d.x.substr(d.x.lastIndexOf('-') + 1), 10).toString();
      $date = $('<div class="css-graph-date" style="color:' + dateColor + ';font-size: ' + labelSize + 'px; line-height:' + barWidth + 'px">' + label + '</div>').appendTo($barContainer);
    }

    $el = $('<div class="css-graph-bar-container" style="height:' + barWidth + 'px; margin-bottom:' + barInterval + 'px"></div>').appendTo($barContainer);

    if (config.showDate) {
      $el.css({
        'margin-left': barMarginLeft + 'px'
      });
    }

    for (j = 0; j < yLength; j++) {
      width = Math.floor((dataY[j] / totalY) * 1000) / 10;
      if (width) {
        if (yLength === j + 1) {
          width = 100 - totalWidth;
        }
        totalWidth = totalWidth + width;

        $bar = $('<div class="css-graph-y css-graph-y' + (j || '') + '" data-count="' + dataY[j] + '" style="line-height:' + barWidth + 'px; font-size:' + labelSize + 'px"></div>');
        $bar.css({
          'width': width + '%',
          'background-color': barColors[j]
        });

        if (config.showCount) {
          $bar.text(dataY[j]);
        }

        if (labelClasses && labelClasses[j]) {
          $bar.addClass(labelClasses[j]);
        }

        if (labelColors && labelColors[j]) {
          $bar.css({
            'color': labelColors[j]
          });
        }

        $bar.appendTo($el);
      }
    }

    $el.appendTo($barContainer);
  }
  this.$graphEl.appendTo($container);
};

ChartAPI.Graph.css.horizontalBar = ChartAPI.Graph.css.ratioHorizontalBar = function (data, config, range, $container) {
  var cssGraph = new ChartAPI.Graph.css.Base(data, config, range, $container);
  var method = config.type.slice(config.type.lastIndexOf('.') + 1);
  cssGraph[method](data, config, range, $container);
  return cssGraph;
};

  ChartAPI.Graph.easel = {};

ChartAPI.Graph.easel.Base = function (data, config, range, $container) {
  this.data = data;
  this.config = config;
  this.range = range;
  this.$container = $container;
  if (!window.createjs && typeof window.require === 'function') {
    require(['easeljs'], $.proxy(function () {
      this.buildCanvas(createjs);
    }, this));
  } else {
    var width = parseInt((config.width || $container.width()), 10);

    if (width) {
      this.buildCanvas(createjs);
    } else {
      setTimeout($.proxy(function () {
        this.buildCanvas(createjs);
      }, this), 100);
    }
  }
};

ChartAPI.Graph.easel.Base.prototype.buildCanvas = function (createjs) {
  this.width = parseInt((this.config.width || this.$container.width()), 10) || 300;
  this.height = parseInt((this.config.height || this.$container.height()), 10) || 300;

  this.$canvas = this.$graphEl = $('<canvas id="' + this.config.id + '" class="graph-canvas" width="' + this.width + '" height="' + this.height + '">').appendTo(this.$container);
  this.canvas = this.$canvas.get(0);
  this.canvas.getContext('2d');

  this.stage = this.graph = new createjs.Stage(this.canvas);
  this.stage.update();
  var method = this.config.type.split('.')[1];
  this[method](this.data, this.config);
};

ChartAPI.Graph.easel.Base.prototype.remove = function () {
  if (this.tick) {
    createjs.Ticker.removeEventListener('tick', this.tick);
  }
  this.$canvas.remove();
};

ChartAPI.Graph.easel.Base.prototype.bar = function (data, config) {
  var length = data.length,
    barColorAlpha = config.chartColorsAlpha ? config.chartColorsAlpha[0] : 1,
    barColors = config.chartColors || ChartAPI.Graph.getCachedChartColors(config.id, null, config.chartColorsMethod),
    barColor = this.convertColor(barColors[0], barColorAlpha),
    barMargin = parseInt(config.barMargin, 10) || 10,
    barContentWidth = Math.floor(this.width / length),
    barWidth = barContentWidth - barMargin,
    leftMargin = Math.floor((this.width - (barContentWidth * length)) / 2) + barMargin / 2,
    dataY = $.map(data, function (d) {
      return parseInt(d.y, 10);
    }),
    maxY = Math.max.apply(null, dataY) || 1,
    shape,
    bar,
    x,
    y,
    barHeight;

  for (var i = 0; i < length; i++) {
    shape = new createjs.Shape();
    bar = shape.graphics;
    x = i * barContentWidth + leftMargin;
    barHeight = Math.floor(dataY[i] / maxY * this.height);
    y = this.height - barHeight;

    bar.beginFill(barColor).drawRect(x, y, barWidth, barHeight);
    this.stage.addChild(shape);
  }
  this.stage.update();
};

ChartAPI.Graph.easel.Base.prototype.motionLine = function (data, config) {
  var length = data.length,
    lineWidth = parseInt(config.lineWidth, 10) || 8,
    yLength = config.yLength || 1,
    lineColors = config.lineColors || config.chartColors || ChartAPI.Graph.getCachedChartColors(config.id, null, config.chartColorsMethod),
    lineColorsAlpha = config.chartColorsAlpha || [null],
    pointerColors = config.pointerColors || config.chartColors || ChartAPI.Graph.getCachedChartColors(config.id, null, config.chartColorsMethod),
    pointerColorsAlpha = config.pointerColorsAlpha || [null],
    pointerRadius = config.pointerRadius || 10,
    paddingTop = lineWidth / 2,
    paddingBottom = lineWidth / 2,
    count = (length - 1) * 2,
    moveX = Math.floor(this.width / length) / 2,
    paddingLeft = (this.width - (moveX * count)) / 2,
    height = this.height,
    canvasInnerHeight,
    dataYs = [],
    dataY,
    mapfunc = function (d) {
      return parseInt(d['y' + (i || '')], 10);
    };

  if (config.drawPointer) {
    paddingBottom = paddingBottom + pointerRadius;
  }

  canvasInnerHeight = this.height - (paddingTop + paddingBottom);

  for (var i = 0; i < yLength; i++) {
    dataY = $.map(data, mapfunc);
    dataYs.push(dataY);
  }

  var dataYAll = [];
  $.each(dataYs, function (i, dataY) {
    dataYAll = dataYAll.concat(dataY);
  });

  var maxY = Math.max.apply(null, dataYAll) || 1,
    moveYs = [];

  var generateMoveY = function (dataY) {
    var moveY = [];
    $.each(dataY, function (i, y) {
      if (i > 0) {
        var prevY = dataY[i - 1];
        var medium = prevY + Math.floor((y - prevY) / 2);

        medium = Math.floor((medium / maxY) * canvasInnerHeight) + paddingBottom;
        y = Math.floor((y / maxY) * canvasInnerHeight) + paddingBottom;
        moveY = moveY.concat([medium, y]);
      } else {
        y = Math.floor((y / maxY) * canvasInnerHeight) + paddingBottom;
        moveY.push(y);
      }
    });
    return moveY;
  };

  $.each(dataYs, function (i, dataY) {
    moveYs.push(generateMoveY(dataY));
  });

  var lineColor,
    shapes = [],
    lines = [],
    x = paddingLeft,
    y,
    circles = [],
    pointerColor;

  for (i = 0; i < yLength; i++) {
    lineColor = this.convertColor(lineColors[i], lineColorsAlpha[i]);
    shapes[i] = new createjs.Shape();
    lines[i] = shapes[i].graphics;
    y = height - moveYs[i][0];
    lines[i].setStrokeStyle(lineWidth).beginStroke(lineColor).moveTo(x, y);
    this.stage.addChild(shapes[i]);
    if (config.drawPointer) {
      pointerColor = this.convertColor(pointerColors[i], pointerColorsAlpha[i]);
      circles[i] = new createjs.Shape();
      circles[i].graphics.beginFill(pointerColor).drawCircle(0, 0, pointerRadius);
      this.stage.addChild(circles[i]);
    }
  }

  var stage = this.stage;

  var tick = this.tick = function (e) {
    // if we are on the last frame of animation then remove the tick listener:
    count = count - 1;
    if (count === 0) {
      createjs.Ticker.removeEventListener("tick", tick);
    }

    x = x + moveX;

    var moveY;
    for (var i = 0; i < yLength; i++) {
      moveY = moveYs[i];
      y = height - moveY[moveY.length - count - 1];
      lines[i].lineTo(x, y);
      if (config.drawPointer) {
        circles[i].x = x;
        circles[i].y = Math.max(y, pointerRadius);
      }
    }

    stage.update(e);
  };

  createjs.Ticker.useRAF = true;
  createjs.Ticker.setFPS(30);
  createjs.Ticker.addEventListener('tick', tick);
};

ChartAPI.Graph.easel.Base.prototype.convertColor = function (str, alpha) {
  if (str.indexOf('#') !== -1) {
    str = str.replace('#', '0x');
    str = createjs.Graphics.getRGB(str, alpha);
  } else if (str.indexOf('rgb') !== -1) {
    str = str.replace(/^rgba?\(/, '').replace(/\)$/, '');
    str = createjs.Graphics.getRGB.apply(null, str.split(/,/));
  }
  return str;
};

ChartAPI.Graph.easel.Base.prototype.mix = function (data, config) {
  var count = 0;

  var splitData = function (length, data) {
    length = length || 1;
    var map = $.map(data, function (d) {
      var obj = {
        x: d.x
      }, key, val;

      for (var i = 0; i < length; i++) {
        key = 'y' + (i || '');
        val = 'y' + (count + i || '');
        obj[key] = d[val];
      }
      return obj;
    });
    count = count + length;
    return map;
  };

  var chartColors = config.chartColors || ChartAPI.Graph.getCachedChartColors(config.id, null, config.chartColorsMethod);

  $.each(config.mix, $.proxy(function (index, conf) {
    var colors = {
      chartColors: chartColors.slice(count, count + conf.yLength)
    };
    var partialData = splitData(conf.yLength, data);
    conf = $.extend({}, config, colors, conf);
    this[conf.type](partialData, conf);
  }, this));
};

ChartAPI.Graph.easel.bar = ChartAPI.Graph.easel.motionLine = ChartAPI.Graph.easel.mix = function (data, config, range, $container) {
  if (ChartAPI.Graph.test.canvas()) {
    var easelGraph = new ChartAPI.Graph.easel.Base(data, config, range, $container);
    return easelGraph;
  } else {
    console.warn('EaselJS graph requires for HTML5 Canvas capability');
    $container.trigger('REMOVE');
  }
};

  ChartAPI.Graph.morris = {};

ChartAPI.Graph.morris.Base = function (data, config, range, $container) {
  this.data = data;
  this.config = config;
  this.range = range;
  this.$container = $container;
  if (!window.Morris && typeof window.require === 'function') {
    require(['raphael', 'morris'], $.proxy(function () {
      this.build_(Morris, data, config, range, $container);
    }, this));
  } else {
    var width = config.width || $container.width();
    if (width) {
      this.build_(Morris, data, config, range, $container);
    } else {
      setTimeout($.proxy(function () {
        this.build_(Morris, data, config, range, $container);
      }, this), 100);
    }
  }
};

ChartAPI.Graph.morris.Base.prototype.build_ = function (Morris, data, config, range, $container) {
  var i,
    graphDefaults, graphConfig,
    method = config.type.split('.')[1],
    yLength = config.yLength,
    width = config.width || $container.width() || 300,
    height = config.height || $container.height() || 300;

  this.$graphEl = $('<div id="' + config.id + '" class="graph-element"></div>').css({
    'height': height + 'px',
    'width': width + 'px'
  }).prependTo($container);

  config = $.extend({}, config, {
    element: this.$graphEl,
    data: data,
    xkey: 'x',
    labels: this.getYLabels_(yLength, config.labels),
    ykeys: this.getYKeys_(yLength),
    ymax: this.getYMax_(data, method, yLength),
    ymin: config.ymin || 0,
    lineWidth: parseInt(config.lineWidth, 10) || 6,
    pointSize: parseInt(config.pointSize, 10) || 6,
    smooth: config.smooth || false
  });

  config.barColors = config.barColors || this.getChartColors(config);
  config.colors = config.colors || this.getChartColors(config);
  config.lineColors = config.lineColors || this.getChartColors(config);
  config.numLines = parseInt(config.numLines, 10) || this.getNumLines_(config.ymax, height);

  config.pointStrokeColors = config.pointStrokeColors ? config.pointStrokeColors.split(/,/) : [];
  if (!config.pointStrokeColors.length) {
    for (i = 0; i < yLength; i++) {
      config.pointStrokeColors.push('none');
    }
  }

  graphDefaults = {
    element: null,
    data: null,
    xkey: 'x',
    labels: [],
    ykeys: [],

    // gridDefaults
    dateFormat: null,
    axes: true,
    grid: true,
    gridLineColor: '#aaa',
    gridStrokeWidth: 0.5,
    gridTextColor: '#888',
    gridTextSize: 12,
    hideHover: false,
    hoverCallback: null,
    yLabelFormat: null,
    numLines: 5,
    padding: 25,
    parseTime: true,
    postUnits: '',
    preUnits: '',
    ymax: 'auto',
    ymin: 'auto 0',
    goals: [],
    goalStrokeWidth: 1.0,
    goalLineColors: ['#666633', '#999966', '#cc6666', '#663333'],
    events: [],
    eventStrokeWidth: 1.0,
    eventLineColors: ['#005a04', '#ccffbb', '#3a5f0b', '#005502'],

    // Line defaults
    lineWidth: 3,
    pointSize: 4,
    lineColors: ['#0b62a4', '#7A92A3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
    pointWidths: [1],
    pointStrokeColors: ['#ffffff'],
    pointFillColors: [],
    smooth: true,
    xLabels: 'auto',
    xLabelFormat: null,
    xLabelMargin: 50,
    continuousLine: true,

    // Bar defaults
    barSizeRatio: 0.75,
    barGap: 3,
    barColors: ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],

    // Donut defaults
    colors: ['#0B62A4', '#3980B5', '#679DC6', '#95BBD7', '#B0CCE1', '#095791', '#095085', '#083E67', '#052C48', '#042135'],
    backgroundColor: '#FFFFFF',
    labelColor: '#000000',
    formatter: Morris.commas
  };

  graphConfig = {};
  $.each(config, function (key, value) {
    if (graphDefaults[key] !== undefined) {
      graphConfig[key] = value;
    }
  });

  // IE8(VML) occured error setting smooth false
  if (!ChartAPI.Graph.test.svg()) {
    graphConfig.smooth = true;
  }

  // shows percentage as Y label when graph method is donut
  if (method === 'donut') {
    var totalCount = this.getTotalCount_(data, 0);

    graphConfig.formatter = function (y) {
      var str = (y + '').replace(/,/g, '');
      var percent = Math.ceil((str / totalCount * 10000)) / 100;

      if (!config.noCommaOnYLabel) {
        str = ChartAPI.Data.addCommas(str);
      }

      var ret;
      if (config.donutsFormatter && typeof config.donutsFormatter === 'function') {
        ret = config.donutsFormatter(str, percent + '%', y);
      } else {
        ret = str + '(' + percent + '%)';
      }

      return ret;
    };
  }

  var M = ({
    'bar': Morris.Bar,
    'line': Morris.Line,
    'donut': Morris.Donut,
    'area': Morris.Area
  })[method];

  this.graph = new M(graphConfig);
};

/**
 * get maximum value among the desinated Y data set
 * @param {!Array.<object>} graph data to get max Y
 * @param {!number} number of set of Y data
 * @return {number} return the number of maxY for graph
 */
ChartAPI.Graph.morris.Base.prototype.getYMax_ = function (data, method, yLength) {
  var i, maxY, array, sum, key;

  if (method !== 'area') {
    array = [];
    $.each(data, function (index, value) {
      for (i = 0; i < yLength; i++) {
        key = 'y' + (i || '');
        array.push(parseInt(value[key], 10));
      }
    });
    maxY = Math.max.apply(null, array);
  } else {
    maxY = Math.max.apply(null, $.map(data, function (value) {
      sum = 0;
      for (i = 0; i < yLength; i++) {
        key = 'y' + (i || '');
        sum = sum + parseInt(value[key], 10);
      }
      return sum;
    }));
  }

  if (!maxY) {
    maxY = 1;
  }

  if (maxY % 2 !== 0) {
    maxY = maxY + 1;
  }

  return maxY;
};

ChartAPI.Graph.morris.Base.prototype.getChartColors = function (config) {
  if (!this.chartColors) {
    this.chartColors = config.chartColors || ChartAPI.Graph.getCachedChartColors(config.id, null, config.chartColorsMethod);
  }
  return this.chartColors;
};

/**
 * return YKeys array for graph setting
 * @param {!number} number of set of y data
 * @return {Array.<string>} array of y key strings
 */
ChartAPI.Graph.morris.Base.prototype.getYKeys_ = function (yLength) {
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
ChartAPI.Graph.morris.Base.prototype.getYLabels_ = function (yLength, yLabel) {
  var i, array = [];
  yLabel = yLabel ? yLabel.split(/,/) : [];
  for (i = 0; i < yLength; i++) {
    array.push((yLabel[i] || 'Count'));
  }
  return array;
};

/**
 * caliculate the number of horizental lines in graph
 * @param {!number} maximum value among the Y data set.
 * @return {number}
 */
ChartAPI.Graph.morris.Base.prototype.getNumLines_ = function (maxY, height) {
  var numlines;
  height = height || 56;

  if (maxY >= 18) {
    numlines = 9;
  } else if (maxY === 2) {
    numlines = 3;
  } else {
    numlines = Math.floor((maxY / 2)) + 1;
  }

  numlines = Math.min((numlines || 1), Math.floor(height / 56));

  return numlines;
};

/**
 * get total count of desinated Y data set.
 * @param {!object} graph JSON data
 * @param {!number} the number of set of Y data
 * @return {number} return the number of total count in current range
 */
ChartAPI.Graph.morris.Base.prototype.getTotalCount_ = function (data, index) {
  var total = 0,
    str = 'y' + (index || ''),
    num;
  $.each(data, function (i, v) {
    num = v[str] || v.value || 0;
    if (typeof num === 'string') {
      num = ChartAPI.Data.parseFloat(num);
    }
    total = total + num;
  });
  return total;
};

ChartAPI.Graph.morris.Base.prototype.remove = function () {
  this.$graphEl.remove();
};

ChartAPI.Graph.morris.bar = ChartAPI.Graph.morris.line = ChartAPI.Graph.morris.donut = ChartAPI.Graph.morris.area = function (data, config, range, $container) {
  if (ChartAPI.Graph.test.vml()) {
    var morrisGraph = new ChartAPI.Graph.morris.Base(data, config, range, $container);
    return morrisGraph;
  } else {
    console.warn('Morris graph requires for SVG/VML capability');
    $container.trigger('REMOVE');
  }
};

  /**
 * create Slider Object
 * If you want to draw slider, fire APPEND_SLIDER event for its container Element like this
 * $('.container').trigger('APPEND_SLIDER')
 *
 * @param {object} slider setings
 * @param {object} range object
 * @param {jQuery} jQuery object of graph/list container element for getting data range
 * @param {Array.<jQuery>} array of jQuery object to fire update event
 * @param {
   Array.<jQuery>
 }
 array of jQuery object to fire event
 for getting amount labels(this event fired when range is timeline)
 * @return {object} jQuery object of slider container for chaining
 * @constructor
 */
ChartAPI.Slider = function (config, range, $dataRangeTarget, updateTarget, amountTarget) {
  if (!$.ui || !$.ui.slider) {
    throw 'ChartAPI.Slider requied jQuery UI Slider';
  }
  var that = this;
  this.id = 'slider-' + (new Date()).valueOf() + Math.floor(Math.random() * 100);
  this.config = config;
  this.range = ChartAPI.Range.generate(range);
  this.$dataRangeTarget = $dataRangeTarget;
  this.$sliderContainer = $('<div id="' + this.id + '-container" class="slider-container"></div>');

  this.eventTargetList = {
    update: this.initEventTarget(),
    amount: this.initEventTarget()
  };

  $.each(updateTarget, function (i, v) {
    that.eventTargetList.update.add(v);
  });

  $.each(amountTarget, function (i, v) {
    that.eventTargetList.amount.add(v);
  });

  /**
   * @param {object} jQuery event object
   * @param {jQuery} jQuery object to attach slider
   * @return {jQuery} return jQuery object for chaining
   */
  this.$sliderContainer.on('APPEND_TO', function (e, $container) {
    that.$container = $container;
    that.draw_($container);
    return $(this);
  });

  /**
   * for building slider UI
   * @param {object} jQuery event object
   * @return {jQuery} return jQuery object for chaining
   */
  this.$sliderContainer.on('BUILD_SLIDER', function () {
    that.$dataRangeTarget.trigger('GET_DATA_RANGE', function (dataRange) {
      that.buildSlider(dataRange.min, dataRange.max);
    });
    return $(this);
  });

  /**
   * @param {object} jQuery event object
   * @param {jQuery} jQuery object of container for graph|list object to get data range
   * @return {jQuery} return jQuery object for chaining
   */
  this.$sliderContainer.on('SET_DATA_RANGE', function (e, $target) {
    that.$dataRangeTarget = $target;
    return $(this);
  });

  /**
   * @param {object} jQuery event object
   * @param {string} the type of event (update|amount) to fire on
   * @param {Array.<jQuery>} array of jQuery object to add event target
   * @return {jQuery} return jQuery object for chaining
   */
  this.$sliderContainer.on('ADD_EVENT_LIST', function (e, type, $targets) {
    $targets = $.isArray($targets) ? $targets : [$targets];
    $.each($targets, function (i, $target) {
      that.eventTargetList[type].add($target);
    });
    return $(this);
  });

  /**
   * @param {object} jQuery event object
   * @param {string} the type of event (update|amount) to fire on
   * @param {Array.<jQuery>} array of jQuery object to remove from event targets
   * @return {jQuery} return jQuery object for chaining
   */
  this.$sliderContainer.on('REMOVE_EVENT_LIST', function (e, type, $targets) {
    $targets = $.isArray($targets) ? $targets : [$targets];
    $.each($targets, function (i, $target) {
      that.eventTargetList[type].remove($target);
    });
    return $(this);
  });


  this.$sliderContainer.on('ERASE', function () {
    that.erase_();
    return $(this);
  });

  this.$sliderContainer.on('REDRAW', function () {
    var $this = $(this);
    $this.trigger('BUILD_SLIDER').trigger('APPEND_TO', [that.$container]);
    return $(this);
  });

  this.$sliderContainer.on('UPDATE', function (e, values) {
    that.$slider.slider("values", values);
    that.updateSliderAmount(values);
    return $(this);
  });

  return this.$sliderContainer;
};

/**
 * return event target object encapsulated target array
 * @return {{add:Function, remove:Function, get:Function}}
 */
ChartAPI.Slider.prototype.initEventTarget = function () {
  var target = [];
  return {
    add: function (newTarget) {
      target.push(newTarget);
    },
    remove: function (removeTarget) {
      target = $.grep(target, function (v) {
        return v !== removeTarget;
      });
    },
    get: function () {
      return target;
    }
  };
};

/**
 * build Slider UI
 * @param {number} number of the left slider handler position
 * @param {number} number of the right slider handler position
 * @param {{max:number, min:number}} Object which has max and min values
 * @return nothing
 */
ChartAPI.Slider.prototype.buildSlider = function (sliderMin, sliderMax, values) {
  var that = this;
  values = values || [this.range.min, this.range.max];

  if (this.$slider) {
    this.$slider.slider('destroy');
    this.$slider.remove();
  }
  this.$slider = $('<div class="slider"></div>').slider({
    'range': true,
    'min': sliderMin,
    'max': sliderMax,
    'values': values,
    'slide': function (e, ui) {
      that.updateSliderAmount(ui.values, ui);
    },
    'stop': function (e, ui) {
      that.updateGraphAndList(ui.values);
    }
  }).appendTo(that.$sliderContainer);

  if (!this.config.hideSliderAmount) {
    this.$amount = $('<div class="amount"></div>');

    if (!this.config.appendSliderAmountBottom) {
      this.$amount.prependTo(this.$sliderContainer);
    } else {
      this.$amount.appendTo(this.$sliderContainer);
    }

    this.updateSliderAmount(values);
  }
};

/**
 * append Slider container to desinated element
 * @param {jQuery}
 * @return nothing
 */
ChartAPI.Slider.prototype.draw_ = function ($container) {
  this.$sliderContainer.appendTo($container);
};

/**
 * erase Slider by removing the container
 * if you want to redraw Slider, trigger 'REDRAW' for the slider container.
 */
ChartAPI.Slider.prototype.erase_ = function () {
  this.$slider.slider('destroy');
  this.$sliderContainer.html('');
};

/**
 * update Slider Amount contents
 * @param {Array.<number>} values of slider position
 * @param {object} ui object returned from Slider event
 */
ChartAPI.Slider.prototype.updateSliderAmount = function (values, ui) {
  var s, e, u, newRange, maxLength = this.range.maxLength,
    $amount = this.$amount;

  if (this.range.isTimeline) {
    s = ChartAPI.Date.parse(values[0]);
    e = ChartAPI.Date.parse(values[1]);
    u = this.range.unit;

    newRange = ChartAPI.Range.getLength(s, e, u);

    if (ui && newRange > maxLength) {
      if (ui.value === ui.values[0]) {
        e = ChartAPI.Date.calcDate(s, maxLength, u, false);
        this.$slider.slider('values', 1, e.valueOf());
      } else {
        s = ChartAPI.Date.calcDate(e, maxLength, u, true);
        this.$slider.slider('values', 0, s.valueOf());
      }
    }

    if ($amount) {
      $amount.text([ChartAPI.Date.createXLabel(s, u), ChartAPI.Date.createXLabel(e, u)].join(' - '));
    }
  } else {
    s = values[0];
    e = values[1];
    if ((e - s) > maxLength) {
      if (ui.value === ui.values[0]) {
        e = s + maxLength;
        this.$slider.slider('values', 1, e);
      } else {
        s = e - maxLength;
        this.$slider.slider('values', 0, s);
      }
    }
    if ($amount) {
      $.each(this.eventTargetList.amount.get(), function (i, $target) {
        $target.trigger('GET_LABEL', [
          [s, e],
          function (a) {
            $amount.text([a[0], a[1]].join(' - '));
          }
        ]);
      });
    }
  }
};

/**
 * @param {Array.<number>} values of slider handler position
 * @param {=string} graph unit type (yearly|quater|monthly|weekly|daily|hourly)
 */
ChartAPI.Slider.prototype.updateGraphAndList = function (values, newUnit) {
  $.each(this.eventTargetList.update.get(), function (i, $target) {
    $target.trigger('UPDATE', [values, newUnit]);
  });
};

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
ChartAPI.List = function (config, range) {
  this.id = 'list-' + (new Date()).valueOf() + Math.floor(Math.random() * 100);
  this.config = config || {};

  this.config.staticPath = this.config.staticPath || '';

  if (this.config.data && typeof this.config.data === 'string') {
    this.origData_ = $.getJSON(this.config.staticPath + this.config.data);
  } else {
    this.origData_ = $.Deferred();
    this.origData_.resolve(this.config.data);
  }

  if (this.config.template) {
    if (window.require && typeof require === 'function') {
      var templateType = this.config.type || 'text';
      this.template_ = $.Deferred();
      require([templateType + '!' + this.config.staticPath + this.config.template], $.proxy(function (template) {
        this.template_.resolve(template);
      }, this));
    } else {
      this.template_ = $.get(this.config.staticPath + this.config.template, 'text');
    }

    this.range = ChartAPI.Range.generate(range);

    this.$listContainer = $('<div id="' + this.id + '-container" class="list-container"></div>');

    this.$listContainer.on('UPDATE', $.proxy(function (e, range) {
      this.update_(range);
    }, this));

    /**
     * @return {jQuery} return jQuery object for chaining
     * return back the graph data range to callback
     */
    this.$listContainer.on('GET_DATA_RANGE', $.proxy(function (e, callback) {
      this.getData($.proxy(function (data) {
        callback(ChartAPI.Range.getDataRange(data, this.range.isTimeline));
      }, this));
      return this.$listContainer;
    }, this));

    /**
     * @return {jQuery} return jQuery object for chaining
     * return back the graph label array to callback
     */

    this.$listContainer.on('GET_LABEL', $.proxy(function (e, indexArray, callback) {
      this.getData($.proxy(function (data) {
        callback(this.getDataLabelByIndex(indexArray, data));
      }, this));
      return this.$listContainer;
    }, this));

    /**
     * append graph container to the desinated container
     * @return {jQuery} return jQuery object for chaining
     */

    this.$listContainer.on('APPEND_TO', $.proxy(function (e, $container) {
      this.$listContainer.appendTo($container);
      this.getData($.proxy(function (data) {
        this.draw_(data);
      }, this));
      return this.$listContainer;
    }, this));

    return this.$listContainer;
  }
};

/**
 * get list data JSON
 * @param {!Function} callback function which recieve jSON data
 */
ChartAPI.List.prototype.getData = function (callback) {
  if (this.config.data) {
    ChartAPI.Data.getData(this.origData_, this.$listContainer, callback, this);
  } else {
    callback();
  }
};

/**
 * get list template string
 * @param {!Function} callback function which recieve template string
 */
ChartAPI.List.prototype.getTemplate = function (callback) {
  ChartAPI.Data.getData(this.template_, this.$listContainer, callback, this);
};

/**
 * generate html using template string
 * @param {!object} list JSON data
 */
ChartAPI.List.prototype.draw_ = function (data) {
  var that = this;
  this.getTemplate(function (templateString) {
    data = that.createListData(data);
    that.$listContainer.html(_.template(templateString, data));
  });
};

/**
 * provide x label data for slider
 * @param {!Array.<number>} array of index to get data
 * @param {!object} list JSON data
 */
ChartAPI.List.prototype.getDataLabelByIndex = function (indexArray, data) {
  var label = this.config.dataLabel || 'x';
  return $.map(indexArray, function (i) {
    return data[i][label];
  });
};

/**
 * @param {!object} list JSON data
 * @return {object} filtered data for using list template
 */
ChartAPI.List.prototype.createListData = function (data) {
  var filteredData = '';
  if (data) {
    if (this.range.isTimeline) {
      filteredData = ChartAPI.Data.filterData(data, this.range.max, this.range.min, this.range.unit, 1, true);
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
ChartAPI.List.prototype.update_ = function (newRange, unit) {
  var that = this;
  newRange = newRange || [];
  unit = unit || this.range.unit;
  this.range = ChartAPI.Range.generate({
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

  /**
 * builder funciton. return jQuery object for chaining and triggering events
 * @return {jQuery}
 */
ChartAPI.Build = function (settings) {
  var $container;
  if (typeof settings === 'string' && (/\.json$/).test(settings)) {
    $container = $('<div class="mtchart-container">');
    ChartAPI.Data.getData($.getJSON(settings), null, function (settings) {
      settings.$container = $container;
      ChartAPI.Build_(settings).trigger('APPEND');
    });
  } else {
    $container = ChartAPI.Build_(settings).trigger('APPEND');
  }
  return $container;
};

/**
 * internal method for building graph|slider|list objects
 * @param {Object} settings
 * @param {=jQuery} jQuery object to attach graph|slider|list object
 */
ChartAPI.Build_ = function (settings) {
  var $container, $graphContainer, $sliderContainer, $listContainer, dataRangeTarget, sliderUpdateTarget, sliderAmountTarget;

  $container = settings.$container || $('<div class="mtchart-container">');

  sliderUpdateTarget = [];

  if (settings.graph) {
    $graphContainer = new ChartAPI.Graph(settings.graph, settings.range);
    sliderUpdateTarget.push($graphContainer);
  }

  if (settings.list) {
    $listContainer = new ChartAPI.List(settings.list, settings.range);
    if (settings.list.data) {
      sliderUpdateTarget.push($listContainer);
    }
  }

  if (settings.graph && settings.graph.type !== 'donut') {
    dataRangeTarget = $graphContainer;
    sliderAmountTarget = [$graphContainer];
  } else {
    dataRangeTarget = $listContainer;
    sliderAmountTarget = [$listContainer];
  }

  var isSmartPhone = function () {
    var userAgent = window.navigator ? window.navigator.userAgent : '';
    return (/android|iphone|ipod|ipad/i).test(userAgent);
  };

  if (settings.slider && (settings.slider.force || !isSmartPhone())) {
    $sliderContainer = new ChartAPI.Slider(settings.slider, settings.range, dataRangeTarget, sliderUpdateTarget, sliderAmountTarget);
  }

  $container.on('APPEND', function () {
    if ($graphContainer) {
      $graphContainer.trigger('APPEND_TO', [$container]);
    }
    if ($sliderContainer) {
      $sliderContainer.trigger('BUILD_SLIDER')
        .trigger('APPEND_TO', [$container]);
    }
    if ($listContainer) {
      $listContainer.trigger('APPEND_TO', [$container]);
    }
  });

  $container.on('GET_CONTAINER', function (e, type, callback) {
    callback({
      'graph': $graphContainer,
      'slider': $sliderContainer,
      'list': $listContainer
    }[type]);
  });

  return $container;
};


  return ChartAPI;
})(this, jQuery);
