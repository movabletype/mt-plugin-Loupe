define(['cards/stats/view/top_articles'],

function (TopArciclesView, cache, Model, itemViewCollection) {
  'use strict';
  return TopArciclesView.extend({
    itemViewContainer: '#top-articles-list-week',
  });
});
