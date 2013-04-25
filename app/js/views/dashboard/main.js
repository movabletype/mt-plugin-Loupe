define(['underscore', 'backbone', 'backbone.marionette', 'backbone.marionette.handlebars', 'hbs!js/views/dashboard/templates/main'],

function (_, Backbone, Marionette, MarionetteHandlebars, template) {
  "use strict";

  return Marionette.Layout.extend({
    serializeData: function () {
      return {
        name: 'Six Apart ブログ'
      };
    },

    template: function (data) {
      return template(data);
    },

    initialize: function (options) {
      this.widgets = options.widgets;
    },

    onRender: function () {
      _.forEach(this.widgets, function (widget) {
        var id = widget.id;
        $('<section id="widget-' + id + '"></section>').appendTo(this.el);
        this.addRegion(id, "#widget-" + id);
        var that = this;
        var path = 'widgets/' + id + '/';

        if (widget.dashboardView) {
          require([path + widget.dashboardView.replace(/\.js$/, '')], function (View) {
            that[id].show(new View());
          });
        } else {
          var match = widget.dashboardTemplate.match(/^(.*)\.(.*)$/);
          var type, filename;
          if (match[2] === 'hbs') {
            type = 'hbs';
            filename = match[1];
          } else {
            type = 'text';
            filename = match[0];
          }

          var script = widget.dashboardData ? [path + widget.dashboardData.replace(/\.js$/, '')] : [];
          var requirements = [type + '!' + path + filename].concat(script);

          require(requirements, function (template, data) {
            if (type === 'hbs') {
              template = template(data);
            } else {
              template = _.template(template, data);
            }
            var View = Marionette.ItemView.extend({
              template: template
            });

            that[id].show(new View());
          });
        }
      }, this);
    }
  });
});