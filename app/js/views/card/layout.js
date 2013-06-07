define(['backbone.marionette', 'js/commands', 'hbs!js/views/card/templates/layout', 'js/views/common/view_header', 'js/views/common/share'],

function (Marionette, commands, template, CommonHeaderView, shareView) {
  "use strict";

  return Marionette.Layout.extend({
    initialize: function (options) {
      console.log(options)
      this.card = options.card;
      this.params = options.params;
      this.viewHeader = this.card.viewHeader;
      this.viewView = this.card.viewView;
      this.viewTemplate = this.card.viewTemplate;
      this.viewData = this.card.viewData;
    },

    template: function (data) {
      return template(data);
    },

    regions: {
      header: '#header',
      main: '#main',
    },

    setShareHandler: function () {
      commands.setHandler('share:show', _.bind(function (options) {
        this.$el.append('<section id="share">');
        this.addRegion('share', '#share');
        this.share.show(new shareView(options));
      }, this));

      commands.setHandler('share:close', _.bind(function (options) {
        if (this.share) {
          this.share.close();
        }
        $('#share').remove();
      }, this));
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

      if (this.viewHeader) {
        require([path + this.viewHeader.replace(/\.js$/, '')], function (HeaderView) {
          that.header.show(new HeaderView({
            params: params,
            settings: that.card
          }));
        });
      } else {
        this.header.show(new CommonHeaderView({
          params: params,
          settings: that.card
        }));
      }

      if (this.viewView) {
        require([path + this.viewView.replace(/\.js$/, '')], function (View) {
          that.main.show(new View({
            params: params,
            settings: that.card
          }));
        });
      } else {
        var match = this.viewTemplate.match(/^(.*)\.(.*)$/);
        var type, filename;
        if (match[2] === 'hbs') {
          type = 'hbs';
          filename = match[1];
        } else {
          type = 'text';
          filename = match[0];
        }
        var script = this.viewData ? [path + this.viewData.replace(/\.js$/, '')] : [];
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
            params: params,
            settings: that.card
          }));
        });
      }
      this.setShareHandler();
    }
  });
});