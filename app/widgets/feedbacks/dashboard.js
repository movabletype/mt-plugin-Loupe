define(['backbone.marionette', 'widgets/feedbacks/models/comments_collection', 'widgets/feedbacks/models/trackbacks_collection', 'hbs!widgets/feedbacks/templates/dashboard', 'mtchart.graph'],

function (Marionette, CommentsCollection, TrackbacksCollection, template, Graph) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    },

    serializeData: function () {
      var data = {};
      if (!this.loading) {
        data.commentTotalResults = parseInt(this.commentsCollection.totalResults, 10);
        data.trackbacksTotalResults = parseInt(this.trackbacksCollection.totalResults, 10);
        data.totalResults = data.commentTotalResults + data.trackbacksTotalResults;
      }
      _.extend(data, {
        loading: this.loading
      });
      return data;
    },

    fetch: function () {
      this.commentsCollection.fetch({
        blogId: this.blogId,
        success: _.bind(function () {
          this.trackbacksCollection.fetch({
            blogId: this.blogId,
            success: _.bind(function () {
              this.loading = false;
              this.render();
            }, this)
          });
        }, this)
      });
    },

    initialize: function (options) {
      this.blogId = options.params.blog.id;
      this.commentsCollection = new CommentsCollection();
      this.trackbacksCollection = new TrackbacksCollection();
      this.loading = true;
      this.fetch();
    },

    onRender: function () {
      if (this.error) {
        this.$el.find('.refetch').hammer().one('tap', _.bind(function () {
          this.loading = true;
          this.error = false;
          this.render();
          this.fetch();
        }, this));
      } else if (!this.loading) {
        var graphEl = this.$el.find('.content');

        var graphData = [{
          y: parseInt(this.commentsCollection.totalResults, 10),
          y1: parseInt(this.trackbacksCollection.totalResults, 10)
        }];

        var config = {
          type: "css.ratioBar",
          json: graphData,
          yLength: 2,
          chartColors: ["#fed563", "#fffae6"],
          chartClasses: ['icon-bubble', 'icon-paper-plane']
        };

        var range = {
          dataType: "general",
          maxLength: 1,
          length: 1
        };

        new Graph(config, range).trigger('APPEND_TO', graphEl);
      }
    }
  });
});