define(['modernizr','jquery','underscore','raphael','morris','underscore','jquery'],function(Modernizr,jQuery,_,Raphael,Morris){
  
var MTChart = {};

/**
 * @param {string} prefix for generate ID
 * @return {string} unique ID for MTChart objects
 */
MTChart.generateID = function (prefix) {
  return prefix + (new Date()).valueOf() + Math.floor(Math.random() * 100);
};

MTChart.isSmartPhone = function () {
  var userAgent = window.navigator ? window.navigator.userAgent : '';
  return (/android|iphone|ipod|ipad/i).test(userAgent);
};

MTChart.Data = {};

//MTChart.Data.getBasePath = function(){
//  var path = location.href.replace(/^http[s]?:\/\/[^\/]*/,'');
//  path = path.replace(/\/[^\/]?*$/,'/');
//}

/**
 * return back cloned data to callback.
 * @param {!jQuery} jQuery ajax/deffered object
 * @param {=jQuery} jQuery objecto of container element to attach ajax response status message which is required when this keyword has context(not null).
 * @param {Function} callback function
 * @param {=Object} current context
 * @return {object}
 */
MTChart.Data.getData = function (obj, $container, callback, that) {
  var cloneData, status, def, errorClassName;
  if (obj) {
    obj.done(function (data) {
      if (!cloneData) {
        if (typeof data === 'string') {
          cloneData = data.toString();
        } else if (jQuery.isArray(data)) {
          cloneData = jQuery.map(data, function (v) {
            return jQuery.extend({}, v);
          });
        } else {
          cloneData = jQuery.extend({}, data);
        }
      }
      callback(cloneData);
    })
      .fail(function (e) {
      status = {
        '404': 'Data is not found',
        '403': 'Data is forbidden to access'
      };
      def = 'Some error occured in the data fetching process';
      errorClassName = e.status ? 'error-' + e.status : 'error-unknown';
      if (that) {
        that.$errormsg = jQuery('<div class="error ' + errorClassName + '">' + (status[e.status] || def) + '</div>')
          .appendTo($container);
      }
    })
      .always(function () {
      if (that && that.$progress && that.$progress.parent().length > 0) {
        that.$progress.remove();
      }
    })
      .progress(function () {
      if (that && (!that.$progress || that.$progress.parent().length === 0)) {
        that.$progress = jQuery('<div class="progress">fetching data...</div>')
          .appendTo($container);
      }
    });
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
MTChart.Data.filterData = function (data, max, min, u, yLength, noConcat) {
  var i, str, hash = {};

  yLength = yLength || 1;
  jQuery.each(data, function (i, v) {
    var td, key;
    td = MTChart.Date.parse(v.x);
    if (td && td >= min && td <= max) {
      if (noConcat) {
        key = MTChart.Date.createId(td, 'daily');
        hash[key] = v;
      } else {
        if (u === 'weekly') {
          td = MTChart.Date.getWeekStartday(td);
        }
        key = MTChart.Date.createId(td, u);
        if (hash[key]) {
          for (i = 0; i < yLength; i++) {
            str = i ? 'y' + i : 'y';
            hash[key][str] = hash[key][str] + v[str];
          }
        } else { /* clone the object to prevent changing original */
          hash[key] = jQuery.extend({}, v);
        }
      }
    }
  });
  return hash;
};

/**
 * utility class for manipulation Date object
 */
MTChart.Date = {};

/**
 * return the week start day
 * @param {!Date}
 * @return Date
 */
MTChart.Date.getWeekStartday = function (d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
};

/**
 * return Date string array with padding zero which is for ISO 8601 string
 * @param {!Date}
 * @param {!string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @return {Array.<string>}
 */
MTChart.Date.zeroPadArray = function (d, unit) {
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
  return jQuery.map(array, function (v, i) {
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
MTChart.Date.createId = function (d, u) {
  return MTChart.Date.zeroPadArray(d, u).join('');
};

/**
 * return uniformalized Date string to use kinds of Date label
 * @param {!Date}
 * @param {!string} unit type (yearly|quarter|monthly|weekly|daily|hourly)
 * @return {string}
 */
MTChart.Date.createXLabel = function (d, u) {
  var hour, str, array = MTChart.Date.zeroPadArray(d, u);
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
MTChart.Date.parse = function (d) {
  var date;
  if (!d || d instanceof Date) {
    date = d || null;
  } else if (typeof d === 'number') {
    date = new Date(d);
  } else {
    date = new Date(Date.parse(d.toString()));
  }
  if (date && /NaN|Invalid Date/.test(date.toString())) {
    date = d.replace(/-/g, '/').split('+')[0];
    if (date.split('/').length === 1) {
      // parse the string like 20130305T00:00:00
      date = d.match(/([0-9]{4})([0-9]{1,2})([0-9]{1,2})/);
      date = [date[1], date[2], date[3]].join('/');
    }
    if (date.split('/').length === 2) {
      date = date + '/01';
    }
    date = jQuery.each(date.split('/'), function (i, v) {
      return v.length === 1 ? '0' + v : v;
    }).join('/');
    date = new Date(Date.parse(date));
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
MTChart.Date.calcDate = function (date, l, u, sym) {
  var y, m, d, h;
  y = date.getFullYear();
  m = date.getMonth();
  d = date.getDate();
  h = 0;
  l = l - 1;
  sym = sym ? -1 : 1;
  ({
    'yearly': function () {
      y = y + (sym * l);
    },
    'monthly': function () {
      m = m + (sym * l);
    },
    'quarter': function () {
      m = m + (sym * l * 4);
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

MTChart.Range = {};

/**
 * return unified Range data object (plain object which does not have prototyped method)
 * @param {{start: string|number|Date|null, end: string|number|Date|null, length: string|number|null, maxLength: string|number|null, unit: string|null, dataType: string|null}}
 * @return {{start: Date, end: Date, length: number, maxLength: number, unit: string, dataType: string, max: Date|number, min: Date|number, isTimeline: boolean}}
 */
MTChart.Range.generate = function (obj) {
  var fn;
  obj = obj || {};
  obj['maxLength'] = obj['maxLength'] || 90;
  obj.isTimeline = MTChart.Range.isTimeline(obj['dataType']);
  fn = obj.isTimeline ? MTChart.Range.calcDate : MTChart.Range.calcNum;
  return fn(obj['start'], obj['end'], obj['length'], obj['maxLength'], obj['unit'], obj['dataType'], obj['autoSized']);
};

/**
 * @param {string|null} data type
 * @return {boolean}
 */
MTChart.Range.isTimeline = function (dataType) {
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
 */
MTChart.Range.calcDate = function (s, e, length, maxLength, unit, dataType, autoSized) {
  unit = unit || 'monthly';
  length = length || (unit === 'hourly' ? 24 : 10);

  if (autoSized) {
    var width = jQuery(window).width();
    maxLength = Math.min(Math.ceil(width * 0.021875), maxLength);
    length = maxLength;
  }

  s = MTChart.Date.parse(s);
  e = MTChart.Date.parse(e);

  if (!s && !e) {
    e = new Date();
  }

  if (!s) {
    s = MTChart.Date.calcDate(e, length, unit, true);
  }
  if (!e) {
    e = MTChart.Date.calcDate(s, length, unit, false);
  }
  if (e > new Date()) {
    e = new Date();
  }
  if (s > e) {
    s = e;
  }
  length = MTChart.Range.getLength(s, e, unit);
  if (length > maxLength) {
    length = maxLength;
    s = MTChart.Date.calcDate(e, length, unit, true);
  }
  return {
    start: s,
    end: e,
    length: length,
    maxLength: maxLength,
    unit: unit,
    dataType: dataType,
    max: MTChart.Range.getEndDate(e, unit),
    min: MTChart.Range.getStartDate(s, unit),
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
MTChart.Range.calcNum = function (s, e, length, maxLength, unit, dataType, autoSized) {
  length = length || 10;

  if (autoSized) {
    var width = jQuery(window).width();
    maxLength = Math.min(Math.ceil(width * 0.021875), maxLength);
    length = Math.min(length, maxLength);
  }

  if (!s && !e) {
    s = 0;
    e = length;
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
  length = e - s;
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
MTChart.Range.getStartDate = function (d, unit) {
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
MTChart.Range.getEndDate = function (d, unit) {
  var end, year = d.getFullYear(),
    month = d.getMonth(),
    date = d.getDate();
  ({
    'yearly': function () {
      end = new Date(year, 11, 31, 23, 59, 59);
    },
    'monthly': function () {
      end = new Date(new Date(year, month + 1, 1, 0, 0, 0).valueOf() - 1);
    },
    'quarter': function () {
      end = new Date(new Date(year, month + 1, 1, 0, 0, 0).valueOf() - 1);
    },
    'weekly': function () {
      end = new Date(year, month, date - d.getDay() + 6, 23, 59, 59);
    },
    'daily': function () {
      end = new Date(year, month, date, 23, 59, 59);
    },
    'hourly': function () {
      end = new Date(year, month, date, d.getHours(), 0, 0);
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
MTChart.Range.getNextDate = function (s, e, i, u) {
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
      d = new Date(year, month + i * 4, 1);
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
MTChart.Range.getDataRange = function (data, isTimeline) {
  var map, max, min;

  if (isTimeline) {
    map = jQuery.map(data, function (v, i) {
      return MTChart.Date.parse(v.x)
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
MTChart.Range.getLength = function (s, e, u) {
  var length;
  ({
    'yearly': function () {
      length = Math.ceil(e.getFullYear() - s.getFullYear());
    },
    'monthly': function () {
      length = Math.ceil(e.getFullYear() * 12 + e.getMonth() - (s.getFullYear() * 12 + s.getMonth()));
    },
    'quarter': function () {
      length = Math.ceil((e.getFullYear() * 12 + e.getMonth() - (s.getFullYear() * 12 + s.getMonth())) / 4);
    },
    'weekly': function () {
      length = Math.ceil((MTChart.Date.getWeekStartday(e) - MTChart.Date.getWeekStartday(s)) / (7 * 24 * 60 * 60 * 1000));
    },
    'daily': function () {
      length = Math.ceil((e - s) / (24 * 60 * 60 * 1000));
    },
    'hourly': function () {
      length = Math.ceil((e - s) / (60 * 60 * 1000));
    }
  })[u]();
  return length > 0 ? length + 1 : 1;
};

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
MTChart.Graph = function (config, range) {
  var data, that = this,
    defaultConf;
  this.id = MTChart.generateID('graph-');

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

  data = (this.config['staticPath'] || '') + (this.config['data'] || 'graph.json');
  this.origData_ = jQuery.getJSON(data);

  this.graphData = {};
  this.graphData[this.range.unit] = jQuery.Deferred();

  this.getData(function (data) {
    var graphData = that.generateGraphData(data);
    that.graphData[that.range.unit].resolve(graphData);
  });


  this.$graphContainer = jQuery('<div id="' + this.id + '-container" class="graph-container">');

  /**
   * @return {jQuery} return jQuery object for chaining
   * update graph
   */
  this.$graphContainer.on('UPDATE', function (e, newRange, unit) {
    that.update_(newRange, unit);
    return jQuery(this);
  });

  jQuery(window).on('orientationchange debouncedresize', function (e) {
    that.update_();
  });

  /**
   * @return {jQuery} return jQuery object for chaining
   * return back the graph data range to callback
   */
  this.$graphContainer.on('GET_DATA_RANGE', function (e, callback) {
    that.getData(function (data) {
      callback(MTChart.Range.getDataRange(data, that.range.isTimeline));
    });
    return jQuery(this);
  });

  /**
   * @return {jQuery} return jQuery object for chaining
   * return back the graph label array to callback
   */
  this.$graphContainer.on('GET_LABEL', function (e, indexArray, callback) {
    that.getData(function (data) {
      callback(that.getDataLabelByIndex(indexArray, data));
    });
    return jQuery(this);
  });

  /**
   * append graph container to the desinated container
   * @return {jQuery} return jQuery object for chaining
   */
  this.$graphContainer.on('APPEND_TO', function (e, container) {
    that.$graphContainer.appendTo(container);
    console.log(container)
    //that.getData(function (data) {
    //  that.draw_(that.generateGraphData(data));
    //});
    that.graphData[that.range.unit].done(function (data) {
      var filteredData;
      if (that.range.isTimeline) {
        filteredData = jQuery.grep(data, function (v) {
          return that.range.start <= v.timestamp && v.timestamp <= that.range.end;
        });
      } else {
        filteredData = data.slice(that.range.min, that.range.max + 1);
      }
      that.draw_(filteredData);
    });
    return jQuery(this);
  });

  // I want to get resize event only when user resize acition tortaly end..
  // what should I do?
  //jQuery(window).on('resize',function(e){
  //  that.update_();
  //})

  return this.$graphContainer;
};

/**
 * call getData function for getting graph JSON data
 * @param {Function} callback function recieve graph JSON data
 */
MTChart.Graph.prototype.getData = function (callback) {
  MTChart.Data.getData(this.origData_, this.$graphContainer, callback, this);
};

/**
 * return data label array with array indexes
 * @param {!Array.<number>} array of indexes
 * @param {!Array.<object>} graph JSON data
 * @return {Array.<string>}
 */
MTChart.Graph.prototype.getDataLabelByIndex = function (indexArray, data) {
  var label = this.config['dataLabel'] || 'x';
  return jQuery.map(indexArray, function (i) {
    return data[i][label];
  });
};

/**
 * get total count of desinated Y data set.
 * @param {!object} graph JSON data
 * @param {!number} the number of set of Y data
 * @return {number} return the number of total count in current range
 */
MTChart.Graph.prototype.getTotalCount_ = function (data, index) {
  var total = 0,
    str = 'y' + (index || '');
  jQuery.each(data, function (i, v) {
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
MTChart.Graph.prototype.getMaxY_ = function (data, yLength) {
  var i, maxY, array, sum, key;

  if (this.config['type'] !== 'area') {
    array = [];
    jQuery.each(data, function (index, value) {
      for (i = 0; i < yLength; i++) {
        key = 'y' + (i || '');
        array.push(value[key]);
      }
    });
    maxY = Math.max.apply(null, array);
  } else {
    maxY = Math.max.apply(null, jQuery.map(data, function (value) {
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
MTChart.Graph.prototype.getNumLines_ = function (maxY) {
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
MTChart.Graph.prototype.getDelta_ = function (data, index) {
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
MTChart.Graph.prototype.getYKeys_ = function (yLength) {
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
MTChart.Graph.prototype.getYLabels_ = function (yLength, yLabel) {
  var i, array = [];
  yLabel = yLabel ? yLabel.split(/,/) : [];
  for (i = 0; i < yLength; i++) {
    array.push((yLabel[i] || 'Count'));
  }
  return array;
};

MTChart.Graph.prototype.getChartColors_ = function (colors, type) {
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
      return colors;
    },
    'def': function (arr) {
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
MTChart.Graph.prototype.draw_ = function (data, type) {
  var i, staticPath, height, labelTemplate, graphConfig, barColors, pointStrokeColors, lineWidth, pointSize, yLength = this.config['yLength'],
    maxY = this.getMaxY_(data, yLength);

  type = type || this.config['type'];
  staticPath = this.config['staticPath'] || '';

  // this magical value 0.6741573 is caliculated below
  // 240 / 356 (jQuery(window).height() of iPhone 4S)
  height = Math.max(Math.ceil(jQuery(window).height() * 0.6741573), 200);
  this.$graphEl = jQuery('<div id="' + this.id + '" style="height:' + height + 'px">').prependTo(this.$graphContainer);
  
  if (this.config['labelTemplate']) {
    var that = this;
    labelTemplate = this.config['labelTemplate']['template'];
    var templateType = this.config['labelTemplate']['type'];
    require([templateType+'!'+staticPath + labelTemplate],function(template){
      if(templateType==='hbs' && typeof template === 'function'){ template = template(); }
      that.labelTemplate = that.labelTemplate || template;//jQuery.get(staticPath + labelTemplate, 'text');
      that.labels = new MTChart.Graph.Labels(that.$graphContainer, yLength, that.labelTemplate);
      for (i = 0; i < yLength; i++) {
        if (!that.config['hideTotalCount']) {
          that.labels.getTotalObject(i).createTotalCount(that.getTotalCount_(data, i));
        }
        if (!that.config['hideDeltaCount'] && that.range.isTimeline) {
          that.labels.getTotalObject(i).createDeltaCount(that.getDelta_(data, i));
        }
      }
    })
//    labelTemplate = this.config['labelTemplate'];
//    this.labelTemplate = this.labelTemplate || jQuery.get(staticPath + labelTemplate, 'text');
//    this.labels = new MTChart.Graph.Labels(this.$graphContainer, yLength, this.labelTemplate);
  }

//  for (i = 0; i < yLength; i++) {
//    if (!this.config['hideTotalCount']) {
//      this.labels.getTotalObject(i).createTotalCount(this.getTotalCount_(data, i));
//    }
//    if (!this.config['hideDeltaCount'] && this.range.isTimeline) {
//      this.labels.getTotalObject(i).createDeltaCount(this.getDelta_(data, i));
//    }
//  }

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
    'numLines': this.getNumLines_(maxY),
    'lineWidth': lineWidth,
    'pointSize': pointSize,
    'labelColor': '#444444',
    'barColors': this.chartColors,
    'lineColors': this.chartColors,
    'colors': this.chartColors,
    'pointStrokeColors': pointStrokeColors
  };

  // IE8 (might be VML) occured error setting smooth false
  // required Modernizr feature detection
  if (Modernizr && Modernizr.svg) {
    graphConfig['smooth'] = !!this.config['smooth'] || false;
  }

  // shows percentage as Y label when graph type is donut
  if (this.config['type'] === 'donut') {
    var totalCount = this.getTotalCount_(data, i);
    graphConfig['formatter'] = function (y, data) {
      return y + '(' + Math.ceil((y / totalCount * 10000)) / 100 + '%)';
    };
  }

  ({
    'bar': Morris.Bar,
    'line': Morris.Line,
    'donut': Morris.Donut,
    'area': Morris.Area
  })[type](graphConfig);
};

/**
 * update Graph
 * @param {=Array.<number>}
 * @param {=string} graph unit type (yearly|quater|monthly|weekly|daily|hourly)
 */
MTChart.Graph.prototype.update_ = function (newRange, unit) {
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
  this.graphData[this.range.unit].done(function (data) {
    var filteredData;
    if (that.range.isTimeline) {
      filteredData = jQuery.grep(data, function (v) {
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
MTChart.Graph.Labels = function ($container, yLength, template) {
  var i, key;

  this.$labelContainer = jQuery('<div class="graph-labels"></div>');

  if (template) {
    console.log(template)
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
MTChart.Graph.Labels.prototype.remove = function () {
  this.$labelContainer.remove();
};

/**
 * get MTChart.Graph.Labels.Total object
 * @param {=number} the number of Y data set
 * @return {MTChart.Graph.Labels.Total}
 */
MTChart.Graph.Labels.prototype.getTotalObject = function (i) {
  return this.totals['y' + (i || '')];
};

/**
 * build html with template string and append its container
 * @param {!string} template data
 * @return nothing
 */
MTChart.Graph.Labels.prototype.importLabelTemplateAndAppend_ = function (template) {
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
MTChart.Graph.Labels.Total = function (container, index) {
  this.index = index;
  this.$totalContainer = jQuery('<div class="graph-total"></div>')
    .appendTo(container);
};

/**
 * create element for displaying total count and append its container
 * @param {!number} total count
 */
MTChart.Graph.Labels.Total.prototype.createTotalCount = function (count) {
  jQuery('<span class="graph-total-count graph-total-count-y"' + (this.index || '') + ' >' + count + '</span>')
    .appendTo(this.$totalContainer);
};

/**
 * create element for displaying delta
 * @param {!number} delta count
 */
MTChart.Graph.Labels.Total.prototype.createDeltaCount = function (delta) {
  var deltaClass = delta ? (delta < 0 ? 'minus' : 'plus') : 'zero';

  jQuery('<span class="graph-delta graph-delta-y"' + (this.index || '') + ' ><span class="' + deltaClass + '">(' + delta + ')</span></span>')
    .appendTo(this.$totalContainer);
};

MTChart.Graph.prototype.generateGraphData = function (data) {
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
    jQuery.each(array, function (i, v) {
      jQuery.extend(v, {
        label: (v.xLabel || v.x),
        value: v.y
      });
    });
  }
  return array;
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
 * @param {Array.<jQuery>} array of jQuery object to fire event for getting amount labels (this event fired when range is timeline)
 * @return {object} jQuery object of slider container for chaining
 * @constructor
 */
MTChart.Slider = function (config, range, $dataRangeTarget, updateTarget, amountTarget) {
  var max, min, that = this;
  this.id = MTChart.generateID('slider-');
  this.config = config;
  this.range = MTChart.Range.generate(range);
  this.$dataRangeTarget = $dataRangeTarget;
  this.$sliderContainer = jQuery('<div id="' + this.id + '-container" class="slider-container"></div>');

  this.eventTargetList = {
    update: this.initEventTarget(),
    amount: this.initEventTarget()
  };

  jQuery.each(updateTarget, function (i, v) {
    that.eventTargetList.update.add(v);
  });

  jQuery.each(amountTarget, function (i, v) {
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
    return jQuery(this);
  });

  /**
   * for building slider UI
   * @param {object} jQuery event object
   * @return {jQuery} return jQuery object for chaining
   */
  this.$sliderContainer.on('BUILD_SLIDER', function (e) {
    that.$dataRangeTarget.trigger('GET_DATA_RANGE', function (dataRange) {
      that.buildSlider(dataRange.min, dataRange.max);
    });
    return jQuery(this);
  });

  /**
   * @param {object} jQuery event object
   * @param {jQuery} jQuery object of container for graph|list object to get data range
   * @return {jQuery} return jQuery object for chaining
   */
  this.$sliderContainer.on('SET_DATA_RANGE', function (e, $target) {
    that.$dataRangeTarget = $target;
    return jQuery(this);
  });

  /**
   * @param {object} jQuery event object
   * @param {string} the type of event (update|amount) to fire on
   * @param {Array.<jQuery>} array of jQuery object to add event target
   * @return {jQuery} return jQuery object for chaining
   */
  this.$sliderContainer.on('ADD_EVENT_LIST', function (e, type, $targets) {
    $targets = jQuery.isArray($targets) ? $targets : [$targets];
    jQuery.each($targets, function (i, $target) {
      that.eventTargetList[type].add($target);
    });
    return jQuery(this);
  });

  /**
   * @param {object} jQuery event object
   * @param {string} the type of event (update|amount) to fire on
   * @param {Array.<jQuery>} array of jQuery object to remove from event targets
   * @return {jQuery} return jQuery object for chaining
   */
  this.$sliderContainer.on('REMOVE_EVENT_LIST', function (e, type, $targets) {
    $targets = jQuery.isArray($targets) ? $targets : [$targets];
    jQuery.each($targets, function (i, $target) {
      that.eventTargetList[type].remove($target);
    });
    return jQuery(this);
  });


  this.$sliderContainer.on('ERASE', function (e) {
    that.erase_();
    return jQuery(this);
  });

  this.$sliderContainer.on('REDRAW', function (e) {
    var $this = jQuery(this);
    $this.trigger('BUILD_SLIDER').trigger('APPEND_TO', [that.$container]);
    return jQuery(this);
  });

  this.$sliderContainer.on('UPDATE', function (e, values) {
    that.$slider("values", values);
    that.updateSliderAmount(values);
    return jQuery(this);
  });

  return this.$sliderContainer;
};

/**
 * return event target object encapsulated target array
 * @return {{add:Function, remove:Function, get:Function}}
 */
MTChart.Slider.prototype.initEventTarget = function () {
  var target = [];
  return {
    add: function (newTarget) {
      target.push(newTarget);
    },
    remove: function (removeTarget) {
      target = jQuery.grep(target, function (v) {
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
MTChart.Slider.prototype.buildSlider = function (sliderMin, sliderMax, values) {
  var that = this;
  values = values || [this.range.min, this.range.max];

  if (this.$slider) {
    this.$slider.destroy();
    this.$slider.remove();
  }
  this.$slider = jQuery('<div class="slider"></div>').slider({
    'range': true,
    'min': sliderMin,
    'max': sliderMax,
    'values': values,
    'slide': function (e, ui) {
      that.updateSliderAmount(ui['values'], ui);
    },
    'stop': function (e, ui, newUnit) {
      that.updateGraphAndList(ui['values']);
    }
  }).appendTo(that.$sliderContainer);

  if (!this.config['hideSliderAmount']) {
    this.$amount = jQuery('<div class="amount"></div>');

    if (!this.config['appendSliderAmountBottom']) {
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
MTChart.Slider.prototype.draw_ = function ($container) {
  this.$sliderContainer.appendTo($container);
};

/**
 * erase Slider by removing the container
 * if you want to redraw Slider, trigger 'REDRAW' for the slider container.
 */
MTChart.Slider.prototype.erase_ = function () {
  if (this.$slider) {
    this.$slider.destroy();
  }
  this.$sliderContainer.html('');
};

/**
 * update Slider Amount contents
 * @param {Array.<number>} values of slider position
 * @param {object} ui object returned from Slider event
 */
MTChart.Slider.prototype.updateSliderAmount = function (values, ui) {
  var s, e, u, newRange, target, maxLength = this.range.maxLength,
    $amount = this.$amount;

  if (this.range.isTimeline) {
    s = MTChart.Date.parse(values[0]);
    e = MTChart.Date.parse(values[1]);
    u = this.range.unit;

    newRange = MTChart.Range.getLength(s, e, u);

    if (ui && newRange > maxLength) {
      if (ui['value'] === ui['values'][0]) {
        e = MTChart.Date.calcDate(s, maxLength, u, false);
        this.$slider.slider('values', 1, e.valueOf());
      } else {
        s = MTChart.Date.calcDate(e, maxLength, u, true);
        this.$slider.slider('values', 0, s.valueOf());
      }
    }

    if ($amount) {
      $amount.text([MTChart.Date.createXLabel(s, u), MTChart.Date.createXLabel(e, u)].join(' - '));
    }
  } else {
    s = values[0];
    e = values[1];
    if ((e - s) > maxLength) {
      if (ui['value'] === ui['values'][0]) {
        e = maxLength - s;
        this.$slider.slider('values', 1, e);
      } else {
        s = e - maxLength;
        this.$slider.slider('values', 0, s);
      }
    }
    if ($amount) {
      jQuery.each(this.eventTargetList.amount.get(), function (i, $target) {
        $target.trigger('GET_LABEL', [
          [s, e], function (a) {
            $amount.text([a[0], a[1]].join(' - '));
          }]);
      });
    }
  }
};

/**
 * @param {Array.<number>} values of slider handler position
 * @param {=string} graph unit type (yearly|quater|monthly|weekly|daily|hourly)
 */
MTChart.Slider.prototype.updateGraphAndList = function (values, newUnit) {
  jQuery.each(this.eventTargetList.update.get(), function (i, $target) {
    $target.trigger('UPDATE', [values, newUnit]);
  });
};

/**
 * update slider handlers position
 * @param {number} index of slider handler (left is 0, right is 1)
 * @param {number} value of slider handler position
 */
MTChart.Slider.prototype.update_ = function (index, value) {
  this.$slider.slider('values', index, value);
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
MTChart.List = function (config, range) {
  var data, template, staticPath, that = this;
  this.id = MTChart.generateID('list-');
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
  unit = unit || this.range.unit
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

/**
 * builder funciton. return jQuery object for chaining and triggering events
 * @return {jQuery}
 */
MTChart.Build = function (settings) {
  var $container;
  if (typeof settings === 'string' && (/\.json$/).test(settings)) {
    $container = jQuery('<div class="mtchart-container">');
    MTChart.Data.getData(jQuery.getJSON(settings), null, function (data) {
      data['$container'] = $container;
      MTChart.Build_(data).trigger('APPEND');
    });
  } else {
    $container = MTChart.Build_(settings).trigger('APPEND');
  }
  return $container;
}

/**
 * internal method for building graph|slider|list objects
 * @param {Object} settings
 * @param {=jQuery} jQuery object to attach graph|slider|list object
 */
MTChart.Build_ = function (settings) {
  var chartId, $container, $graphContainer, $sliderContainer, $listContainer, dataRangeTarget, sliderUpdateTarget, sliderAmountTarget;

  $container = settings['$container'] || jQuery('<div class="mtchart-container">');
  console.log($container)

  sliderUpdateTarget = [];

  if (settings['graph']) {
    $graphContainer = new MTChart.Graph(settings['graph'], settings['range']);
    sliderUpdateTarget.push($graphContainer);
  }

  if (settings['list']) {
    $listContainer = new MTChart.List(settings['list'], settings['range']);
    if (settings['list']['data']) {
      sliderUpdateTarget.push($listContainer);
    }
  }

  if (settings['graph'] && settings['graph']['type'] !== 'donut') {
    dataRangeTarget = $graphContainer;
    sliderAmountTarget = [$graphContainer];
  } else {
    dataRangeTarget = $listContainer;
    sliderAmountTarget = [$listContainer];
  }

  if (settings['slider'] && !MTChart.isSmartPhone()) {
    $sliderContainer = new MTChart.Slider(settings['slider'], settings['range'], dataRangeTarget, sliderUpdateTarget, sliderAmountTarget);
  }

  $container.on('APPEND', function (e) {
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

// export properties for the compiled script
/*
if (!window['MTChart']) {
  window['MTChart'] = {
    'Graph': MTChart.Graph,
    'Slider': MTChart.Slider,
    'List': MTChart.List,
    'Build': MTChart.Build
  };
}
*/

return MTChart;

});
