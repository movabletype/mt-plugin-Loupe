define(['backbone.marionette', 'hbs!widgets/feedbacks/templates/dashboard'],

function (Marionette, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    }
  });
});