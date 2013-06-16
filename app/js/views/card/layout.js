define(['backbone.marionette', 'js/views/card/itemview', 'js/commands', 'hbs!js/views/card/templates/layout', 'js/views/card/header', 'js/views/share/share'],

function (Marionette, CardItemView, commands, template, CommonHeaderView, ShareView) {
  "use strict";

  return Marionette.Layout.extend({
    initialize: function (options) {
      this.options = options;
      this.card = options.card;
      this.viewHeader = options.viewHeader || this.card.viewHeader;
      this.viewView = options.viewView || this.card.viewView;
      this.viewTemplate = options.viewTemplate || this.card.viewTemplate;
      this.viewData = options.viewData || this.card.viewData;
    },

    template: function (data) {
      return template(data);
    },

    regions: {
      header: '#header',
      main: '#main'
    },

    setShareHandler: function () {
      commands.setHandler('share:show', _.bind(function (options) {
        this.$el.append('<section id="share">');
        this.addRegion('share', '#share');
        this.share.show(new ShareView(options));
      }, this));

      commands.setHandler('share:close', _.bind(function () {
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

      this.main.on('show', _.bind(function () {
        this.main.$el.addClass('card-view-' + this.card.id);
      }, this));

      if (this.viewHeader) {
        require([path + this.viewHeader.replace(/\.js$/, '')], function (HeaderView) {
          that.header.show(new HeaderView(that.options));
        });
      } else {
        this.header.show(new CommonHeaderView(this.options));
      }

      if (this.viewView) {
        require([path + this.viewView.replace(/\.js$/, '')], function (View) {
          that.main.show(new View(that.options));
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
          var View = CardItemView.extend({
            template: template,
            initialize: function () {
              CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
              this.setTranslation();
            }
          });
          that.main.show(new View(that.options));
        });
      }
      this.setShareHandler();
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
