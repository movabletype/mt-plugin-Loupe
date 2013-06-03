define(['backbone.marionette', 'hbs!js/views/widget/templates/layout', 'js/views/common/view_header'],

function (Marionette, template, HeaderView) {
  "use strict";

  return Marionette.Layout.extend({
    initialize: function (options) {
      this.widget = options.widget;
      this.params = options.params;
    },

    template: function (data) {
      return template(data);
    },

    regions: {
      header: '#header',
      main: '#main',
      footer: '#footer'
    },

    onRender: function () {
      this.$el.addClass('container');
      var that = this;
      var id = this.widget.id;
      var params = this.params;
      var path = 'widgets/' + id + '/';

      if (DEBUG) {
        require(['perf'], function (perf) {
          perf.log('startBuildingWidgetView_' + id);
          that.main.on('show', function () {
            perf.log('endBuildingWidgetView_' + id);
            perf.info('endBuildingWidgetView_' + id, 'startBuildingWidgetView_' + id);
            perf.info();
          });
        });
      }

      this.header.show(new HeaderView());

      if (this.widget.viewView) {
        require([path + that.widget.viewView.replace(/\.js$/, '')], function (View) {
          that.main.show(new View({
            params: params
          }));
        });
      } else {
        var match = this.widget.viewTemplate.match(/^(.*)\.(.*)$/);
        var type, filename;
        if (match[2] === 'hbs') {
          type = 'hbs';
          filename = match[1];
        } else {
          type = 'text';
          filename = match[0];
        }
        var script = this.widget.viewData ? [path + this.widget.viewData.replace(/\.js$/, '')] : [];
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
          that.main.show(new View({
            params: params
          }));
        });
      }
    },

    onShow: function () {
      var handleShadow = function () {
        var $this = $(this);
        if ($this.scrollTop() > 0) {
          $('#header').addClass('shadow');
        } else {
          $('#header').removeClass('shadow');
          $('.main-container').one('scroll', handleShadow);
        }
      };

      $('.main-container').one('scroll', handleShadow);
      $('.main-container').on('smartscroll', handleShadow);
    }
  });
});
