/* 
 * smartscroll: debounced scroll event for jQuery *
 * https://github.com/lukeshumard/smartscroll
 * based on smartresize by @louis_remi: https://github.com/lrbabe/jquery.smartresize.js *
 * Copyright 2011 Louis-Remi & lukeshumard * Licensed under the MIT license. *
 */

var e = $.event,
  scrollTimeout;

e.special.smartscroll = {};

var handler = e.special.smartscroll.handler = function (vent, execAsap) {
  // Save the context
  var context = this,
    args = arguments;

  // set correct event type
  vent.type = "smartscroll";

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(function () {
    $(context).trigger('smartscroll', args);
  }, execAsap === "execAsap" ? 0 : 100);
};

e.special.smartscroll.setup = function () {
  $(this).bind("scroll", handler);
};

e.special.smartscroll.teardown = function () {
  $(this).unbind("scroll", handler);
};

$.fn.smartscroll = function (fn) {
  return fn ? this.bind("smartscroll", fn) : this.trigger("smartscroll", ["execAsap"]);
};