define(function () {
	'use strict'

	var Perf = function () {
		this.data = {};
	};

	Perf.prototype.now = function () {
		if ('performance' in window) {
			return window.performance.now();
		} else {
			return (new Date()).valueOf();
		}
	};

	Perf.prototype.log = function (keyword) {
		var now = this.now();
		if (keyword) {
			this.data[keyword] = now;
		}
		this.data.end = now;
	};

	Perf.prototype.start = function () {
		this.log('start');
	}

	Perf.prototype.info = function (endKey, startKey) {
		startKey = startKey || 'start';
		endKey = endKey || 'end';
		var diff = this.data[endKey] - this.data[startKey];
		var msg = '[perf:' + startKey + ':' + endKey + '] ' + diff;
		if ('console' in window) {
			if ('debug' in window.console) {
				console.debug(msg);
			} else {
				console.log(msg);
			}
		}
	};

	return new Perf();
});
