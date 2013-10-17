describe("stats", function () {
  'use strict';

  var todaysPageViews;
  beforeEach(function () {
    undefRequireModule('template/helpers/todaysPageViews');

    runs(function () {
      $('script[src$="app/cards/stats/templates/helpers/todaysPageViews.js"]').remove();
      $('head').append('<script src="' + window.jasmineRequirePath + 'app/cards/stats/templates/helpers/todaysPageViews.js">');
      requireModuleAndWait('template/helpers/todaysPageViews');
    })

    runs(function () {
      todaysPageViews = require('template/helpers/todaysPageViews');
    })
  })

  describe("helpers/todaysPageViews", function () {

    it("pageviews is 1000", function () {
      var items = [{
        pageviews: 1000
      }];
      expect(todaysPageViews(items)).toEqual(1000);
    });

    it("pageviews is 1K", function () {
      var items = [{
        pageviews: 1001
      }];
      expect(todaysPageViews(items)).toEqual('1K');
    });

    it("pageviews is 1000K", function () {
      var items = [{
        pageviews: 1000000
      }];
      expect(todaysPageViews(items)).toEqual('1000K');
    });

    it("pageviews is 1M", function () {
      var items = [{
        pageviews: 1000001
      }];
      expect(todaysPageViews(items)).toEqual('1M');
    });

    it("pageviews is null", function () {
      var items = null;
      expect(todaysPageViews(items)).toBeFalsy();
    });

  });

  afterEach(function () {
    $('script[src$="app/cards/stats/templates/helpers/todaysPageViews.js"]').remove();
  })
});
