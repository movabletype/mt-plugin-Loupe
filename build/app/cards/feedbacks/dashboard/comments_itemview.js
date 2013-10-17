define(['backbone.marionette', 'hbs!cards/feedbacks/templates/dashboardItemview'],

  function (Marionette, template) {
    "use strict";
    return Marionette.ItemView.extend({
      tagName: 'li',
      template: template
    });
  });
