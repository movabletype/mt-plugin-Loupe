define(function () {
  'use strict';

  var Device = function () {
    if (DEBUG) {
      this.ua = window.Mock.userAgent || navigator.userAgent;
    } else {
      this.ua = navigator.userAgent;
    }

    this.parseVersion = function (expression) {
      var version = this.ua.match(expression);
      version = (version && version[1]) ? (parseFloat(version[1].replace('_', '.'), 10) || null) : null;
      return version;
    };

    if (/Android/.test(this.ua)) {
      this.isAndroid = true;
      this.platform = 'android';
      this.version = this.parseVersion(/Android\s*([\.0-9]+)/);
    } else if (/iPhone|iPad|iPod/.test(this.ua)) {
      this.isIOS = true;
      this.platform = 'ios';
      this.version = this.parseVersion(/(?:iPhone|iPad|iPod).*OS\s([_0-9]+)/);
    } else if (navigator.appName === 'Microsoft Internet Explorer') {
      if (/Windows Phone/.test(this.ua)) {
        this.isWindowsPhone = true;
        this.platform = 'windows-phone';
        this.version = this.parseVersion(/Windows Phone\s*([\.0-9]+)/);
      }
      this.isIE = true;
      this.browser = 'ie';
      this.browserVersion = this.parseVersion(/(?:MSIE|IE)\s*([\.0-9]+)/);
      this.isIE8 = parseInt(this.browserVersion, 10) === 8;
    } else if (/Firefox/.test(this.ua)) {
      this.isFirefox = true;
      this.browser = 'firefox';
      this.browserVersion = this.parseVersion(/(?:Firefox\/)\s*([\.0-9]+)/);
    }

    var arr;
    if (this.version) {
      arr = this.version.toString().split('.');
      this.versionStr = arr.length === 1 ? arr.concat(['0']).join('-') : arr.join('-');
      this.versionShortStr = arr[0];
    } else {
      this.versionStr = '';
      this.versionShortStr = '';
    }

    if (this.browser) {
      arr = this.browserVersion.toString().split('.');
      this.browserVersionStr = arr.length === 1 ? arr.concat(['0']).join('-') : arr.join('-');
      this.browserVersionShortStr = arr[0];
    } else {
      this.browserVersionStr = '';
      this.browserVersionShortStr = '';
    }

    this.touch = 'ontouchstart' in window;
  };

  Device.prototype.options = {};
  Device.prototype.options.hammer = function (options) {
    var def = {
      drag: false,
      hold: false,
      prevent_default: true,
      prevent_mouseevents: true,
      release: false,
      show_touches: false,
      stop_browser_behavior: {
        // this also triggers onselectstart=false for IE
        userSelect: 'none',
        // this makes the element blocking in IE10 >, you could experiment with the value
        // see for more options this issue; https://github.com/EightMedia/hammer.js/issues/241
        touchAction: 'auto',
        touchCallout: 'none',
        contentZooming: 'none',
        userDrag: 'none',
        tapHighlightColor: 'rgba(0,0,0,0)'
      },
      swipe: false,
      tap: true,
      tap_always: true,
      tap_max_distance: 10,
      tap_max_touchtime: 1000,
      touch: false,
      transform: false
    };

    if (!this.touch) {
      // not touch enable device use mouse event
      def.prevent_mouseevents = false;
    }

    options = _.extend({}, def, options);
    return options;
  };

  return new Device();
});
