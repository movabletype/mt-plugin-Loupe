define(['mtchart.date', 'mtchart.range'], function (MTChartDate, MTChartRange) {
  var MTChart = {};
  MTChart.Date = MTChartDate;
  MTChart.Range = MTChartRange;

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
    var that = this;
    this.id = 'slider-' + (new Date()).valueOf() + Math.floor(Math.random() * 100);
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
    this.$sliderContainer.on('BUILD_SLIDER', function () {
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


    this.$sliderContainer.on('ERASE', function () {
      that.erase_();
      return jQuery(this);
    });

    this.$sliderContainer.on('REDRAW', function () {
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
      'stop': function (e, ui) {
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
    var s, e, u, newRange, maxLength = this.range.maxLength,
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

  return MTChart.Slider;
});