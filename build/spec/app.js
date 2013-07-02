describe("app", function () {
  'use strict';

  it("should be start", function () {
    var app = require('app');
    expect(app.initial).toBe(true);
  });
});
