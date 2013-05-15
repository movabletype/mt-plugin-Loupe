define(['jquery', 'backbone', 'js/mtapi', 'widgets/stats/models/top_articles_itemview'], function ($, Backbone, mtapi, Model) {
  return new(Backbone.Collection.extend({
    model: Model,
    comparator: function (item) {
      return parseInt(item.get('pageviews'), 10) * -1;
    }
  }))();
});