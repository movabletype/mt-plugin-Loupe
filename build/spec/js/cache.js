describe("cache", function () {
  'use strict';

  var cache = require('js/cache');
  var serial = (new Date()).valueOf();
  var serial2 = serial + Math.floor(Math.random() * 10000);

  beforeEach(function () {
    cache.set(serial, 'foo', 'bar');
    cache.set(serial, 'bar', 'baz');
    cache.set(serial2, 'baz', 'qux');
  });

  it("get cache", function () {
    var val = cache.get(serial, 'foo');
    expect(val).toEqual('bar');
    val = cache.get(serial, 'bar');
    expect(val).toEqual('baz');
  });

  it("when no cache, return null", function () {
    var val = cache.get('baz', 'foo');
    expect(val).toBeNull();
    val = cache.get(serial, 'bar');
    expect(val).not.toBeNull();
  });

  it("set cache (simple string)", function () {
    var random = Math.floor(Math.random() * 100000);
    cache.set(random, 'Lorem', 'ipsum');
    var val = cache.get(random, 'Lorem');
    expect(val).toEqual('ipsum');
  });

  it("set cache (JSON data)", function () {
    var random = Math.floor(Math.random() * 100000);
    cache.set(random, 'Lorem', {
      ipsum: 'dolor',
      sit: 777,
      amet: {
        foo: 'bar'
      }
    });
    var val = cache.get(random, 'Lorem');
    expect(val.ipsum).toEqual('dolor');
    expect(val.sit).toEqual(777);
    expect(val.amet.foo).toEqual('bar');
  });

  it("clear cache (only one key)", function () {
    var val = cache.get(serial, 'foo');
    expect(val).toEqual('bar');
    val = cache.get(serial, 'bar');
    expect(val).toEqual('baz');
    cache.clear(serial, 'foo');
    val = cache.get(serial, 'foo');
    expect(val).not.toBeDefined();
    val = cache.get(serial, 'bar');
    expect(val).toEqual('baz');
  });

  it("clear cache (for id)", function () {
    var val = cache.get(serial, 'foo');
    expect(val).toEqual('bar');
    val = cache.get(serial, 'bar');
    expect(val).toEqual('baz');
    cache.clear(serial);
    val = cache.get(serial2, 'baz');
    expect(val).toEqual('qux');
    val = cache.get(serial, 'foo');
    expect(val).toBeDefined();
    val = cache.get(serial, 'bar');
    expect(val).toBeDefined();
  });

  it("clear all", function () {
    var val = cache.get(serial, 'foo');
    expect(val).toEqual('bar');
    val = cache.get(serial, 'bar');
    expect(val).toEqual('baz');
    val = cache.get(serial2, 'baz');
    expect(val).toEqual('qux');
    cache.clearAll();
    val = cache.get(serial, 'foo');
    expect(val).toBeNull();
    val = cache.get(serial, 'bar');
    expect(val).toBeNull();
    val = cache.get(serial2, 'baz');
    expect(val).toBeNull();
  });
});
