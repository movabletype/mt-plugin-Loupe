define(['backbone', 'js/mtapi', 'cards/stats/models/top_articles_itemview'], function (Backbone, mtapi, Model) {
  return Backbone.Collection.extend({
    model: Model,
    comparator: function (item) {
      return parseInt(item.get('pageviews'), 10) * -1;
    }
  });
});
