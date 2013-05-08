define(['jquery', 'mtchart.data', 'mtchart.date', 'mtchart.range'],

function (jQuery, MTChartData, MTChartDate, MTChartRange) {

  var MTChart = {};
  MTChart.Data = MTChartData;
  MTChart.Date = MTChartDate;
  MTChart.Range = MTChartRange;

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
  };

  /**
   * internal method for building graph|slider|list objects
   * @param {Object} settings
   * @param {=jQuery} jQuery object to attach graph|slider|list object
   */
  MTChart.Build_ = function (settings) {
    var $container, $graphContainer, $sliderContainer, $listContainer, dataRangeTarget, sliderUpdateTarget, sliderAmountTarget;

    $container = settings['$container'] || jQuery('<div class="mtchart-container">');

    sliderUpdateTarget = [];

    if (settings['graph']) {
      require(['mtchart.graph'], function (MTChartGraph) {
        MTChart.Graph = MTChartGraph;
        $graphContainer = new MTChart.Graph(settings['graph'], settings['range']);
        sliderUpdateTarget.push($graphContainer);
        $graphContainer.trigger('APPEND_TO', [$container]);
      });
    }

    if (settings['list']) {
      reuqire(['mtchart.list'], function (MTChartList) {
        MTChart.List = MTChartList;
        $listContainer = new MTChart.List(settings['list'], settings['range']);
        if (settings['list']['data']) {
          sliderUpdateTarget.push($listContainer);
        }
      });
    }

    if (settings['graph'] && settings['graph']['type'] !== 'donut') {
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

    if (settings['slider'] && !isSmartPhone()) {
      require(['mtchart.slider'], function (MTChartSlider) {
        MTChart.Slider = MTChartSlider;
        $sliderContainer = new MTChart.Slider(settings['slider'], settings['range'], dataRangeTarget, sliderUpdateTarget, sliderAmountTarget);
      });
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

  return MTChart;
});