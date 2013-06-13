define(['js/mtapi', 'js/device', 'js/commands', 'js/views/card/itemview', 'hbs!cards/upload/templates/dashboard'],

function (mtapi, device, commands, CardItemView, template) {
  'use strict';

  return CardItemView.extend({
    template: template,

    ui: {
      uploadForm: '#upload-file-input',
      uploadButton: '#upload-file',
      retryButton: '#retry',
      refreshButton: '#refresh'
    },

    initialize: function () {
      CardItemView.prototype.initialize.apply(this, Array.prototype.slice.call(arguments));
      this.setTranslation();
    },

    onRender: function () {
      var upload = _.bind(function (files) {
        this.uploadedImages = [];
        this.error = [];
        this.errorImages = [];
        this.uploading = true;
        this.render();
        var dfds = [];
        _.each(files, _.bind(function (file) {
          var dfd = $.Deferred();
          dfds.push(dfd);
          mtapi.api.uploadAsset(this.blogId, {
            file: file,
            autoRenameIfExists: true
          },
            _.bind(function (resp) {
            if (!resp.error) {
              dfd.resolve();
              this.uploadedImages.push(resp);
            } else {
              this.errorImages.push(file);
              this.error.push(resp.error);
              dfd.reject();
            }
            this.render();
          }, this));
        }, this));
        $.when.apply(this, dfds).done(_.bind(function () {
          this.error = false;
          this.uploadCompleted = true;
        }, this)).always(_.bind(function () {
          this.uploading = false;
          this.render();
        }, this));
      }, this);
      /*
      this.ui.uploadButton.hammer(this.hammerOpts).on('tap', _.bind(function () {
        this.ui.uploadForm.trigger('click');
      }, this));
*/
      this.ui.retryButton.hammer(this.hammerOpts).on('tap', _.bind(function () {
        upload(this.errorImages);
      }, this));

      this.ui.uploadForm.on('change', function (e) {
        if ((window.FileReader && device.platform !== 'windows-phone')) {
          upload(e.target.files);
        } else {
          upload([$('#upload-file-input').get(0)]);
        }
      });
    },

    serializeData: function () {
      var data = this.serializeDataInitialize();
      data.title = 'Media Upload';
      data.loading = false;
      data.uploading = this.uploading ? true : false;
      data.uploadCompleted = this.uploadCompleted ? true : false;
      data.uploadedImages = this.uploadedImages;
      return data;
    }
  });
});
