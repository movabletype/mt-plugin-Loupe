define(['jquery', 'backbone.marionette', 'backbone.marionette.handlebars', 'js/mtapi', 'hbs!widgets/acception/templates/dashboard'],

function ($, Marionette, MarionetteHandlebars, mtapi, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (items) {
      return template(items);
    },

    initialize: function (options) {
      var that = this;
      var blogId = options.params.blogId;
      this.items = {
        loading: true
      };
      mtapi.api.listEntries(blogId, {
        'status': 'Review'
      }, function (res) {
        if (DEBUG) {
          console.log(res);
        }
        that.items = {
          loading: false,
          items: res.items
        };
        that.render();
      });
    },

    serializeData: function () {
      return this.items;
    }
  });
});