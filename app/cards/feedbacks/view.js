define(['backbone.marionette', 'hbs!cards/feedbacks/templates/view'], function (Marionette, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    }
  });
});
