define(['backbone.marionette', 'hbs!cards/acception/templates/dashboardItemview'],

function (Marionette, template) {
  "use strict";
  return Marionette.ItemView.extend({
    tagName: 'li',
    template: template
  });
});
