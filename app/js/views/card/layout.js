define(['backbone.marionette', 'hbs!js/views/card/templates/layout', 'js/views/common/view_header'],

function (Marionette, template, HeaderView) {
  "use strict";

  return Marionette.Layout.extend({
    initialize: function (options) {
      this.card = options.card;
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
      var id = this.card.id;
      var params = this.params;
      var path = 'cards/' + id + '/';

      if (DEBUG) {
        require(['perf'], function (perf) {
          perf.log('startBuildingCardView_' + id);
          that.main.on('show', function () {
            perf.log('endBuildingCardView_' + id);
            perf.info('endBuildingCardView_' + id, 'startBuildingCardView_' + id);
            perf.info();
          });
        });
      }

      this.header.show(new HeaderView());

      if (this.card.viewView) {
        require([path + that.card.viewView.replace(/\.js$/, '')], function (View) {
          that.main.show(new View({
            params: params
          }));
        });
      } else {
        var match = this.card.viewTemplate.match(/^(.*)\.(.*)$/);
        var type, filename;
        if (match[2] === 'hbs') {
          type = 'hbs';
          filename = match[1];
        } else {
          type = 'text';
          filename = match[0];
        }
        var script = this.card.viewData ? [path + this.card.viewData.replace(/\.js$/, '')] : [];
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
