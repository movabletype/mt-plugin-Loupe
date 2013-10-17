define(function () {
  'use strict';

  var Device = function () {
    this.getNavigator();
    this.detectOS();
    this.detectBrowser();
    this.generateVersionStr();
    this.generateBrowserVersionStr();

    this.touch = 'ontouchstart' in window;
  };

  Device.prototype.getNavigator = function () {
    this.ua = navigator.userAgent;
    this.appName = navigator.appName;
    this.product = navigator.product;
  };

  Device.prototype.parseVersion = function (expression) {
    var version = this.ua.match(expression);
    version = (version && version[1]) ? (parseFloat(version[1].replace('_', '.'), 10) || null) : null;
    return version;
  };

  Device.prototype.detectOS = function () {
    if (/Android/.test(this.ua)) {
      this.isAndroid = true;
      this.platform = 'android';
      this.expression = /Android\s*([\.0-9]+)/;
    } else if (/iPhone|iPad|iPod/.test(this.ua)) {
      this.isIOS = true;
      this.platform = 'ios';
      this.expression = /(?:iPhone|iPad|iPod).*OS\s([_0-9]+)/;
    } else if (/Windows Phone/.test(this.ua)) {
      this.isWindowsPhone = true;
      this.platform = 'windows-phone';
      this.expression = /Windows Phone\s*(?:OS\s)?([\.0-9]+)/;
    }
    this.version = this.parseVersion(this.expression);
  };

  Device.prototype.detectBrowser = function () {
    if (/Trident/.test(this.ua)) {
      this.isIE = true;
      this.browser = 'ie';
      this.expressionBrowser = /(?:(?:MSIE|IE)|(?:(?:rv:)))\s*([\.0-9]+)/;
    } else if (/Firefox/.test(this.ua)) {
      this.isFirefox = true;
      this.browser = 'firefox';
      this.expressionBrowser = /(?:Firefox\/)\s*([\.0-9]+)/;
    }
    this.browserVersion = this.parseVersion(this.expressionBrowser);
  };

  Device.prototype.generateVersionStr = function () {
    var arr;
    if (this.version) {
      arr = this.version.toString().split('.');
      this.versionStr = arr.length === 1 ? arr.concat(['0']).join('-') : arr.join('-');
      this.versionShortStr = arr[0];
    } else {
      this.versionStr = '';
      this.versionShortStr = '';
    }
  };

  Device.prototype.generateBrowserVersionStr = function () {
    var arr;
    if (this.browser && this.browserVersion) {
      arr = this.browserVersion.toString().split('.');
      this.browserVersionStr = arr.concat(['0']).slice(0, 2).join('-');
      this.browserVersionShortStr = arr[0];
    } else {
      this.browserVersionStr = '';
      this.browserVersionShortStr = '';
    }
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
