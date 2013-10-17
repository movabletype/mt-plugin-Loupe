describe("collections", function () {
  'use strict';

  beforeEach(function () {
    requireModuleAndWait(['js/collections/entries', 'js/models/entry']);
  })

  describe("entries", function () {
    it("store entry model to collection", function () {
      var Collection = require('js/collections/entries');
      var Model = require('js/models/entry');

      var collection = new Collection();

      var model = new Model({
        id: 123,
        blogId: 1
      });

      var flag;
      model.fetch({
        success: function () {
          flag = true;
          collection.add(model);
        }
      });

      waitsFor(function () {
        return flag;
      }, 'fetching entry', 3000);

      runs(function () {
        console.log(collection)
        expect(collection.models.length).toEqual(1);
      })
    });
  });
});
