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
      this.perm = this.userIsSystemAdmin() || this.userHasPermission('upload');
      this.FileUploadSupport = this.checkSupport();
      this.dashboardShowWithPermission(this.perm && this.FileUploadSupport)
        .done(_.bind(function () {
        this.setTranslation();
      }, this))
    },

    onRender: function () {
      if (this.perm) {
        if (this.FileInputNotSupported) {
          this.$el.parent().hide();
        }

        var upload = _.bind(function (files) {
          this.uploadedImages = [];
          this.uploadError = [];
          this.errorImages = [];
          this.uploading = true;
          this.$el.find('#upload-file-uploading').css({
            display: 'block'
          });
          this.$el.find('#upload-file').css({
            display: 'none'
          });
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
                this.uploadError.push(resp.error);
                dfd.reject();
              }
              this.render();
            }, this));
          }, this));
          $.when.apply(this, dfds).done(_.bind(function () {
            this.uploadError = [];
            this.uploadCompleted = true;
          }, this)).always(_.bind(function () {
            this.uploading = false;
            this.render();
          }, this));
        }, this);

        this.ui.uploadButton.hammer(this.hammerOpts).on('tap', _.bind(function (e) {
          this.addTapClass(e.currentTarget);
        }, this));

        this.ui.retryButton.hammer(this.hammerOpts).on('tap', _.bind(function (e) {
          this.addTapClass(e.currentTarget);
          this.ui.retryButton.remove();
          upload(this.errorImages);
        }, this));

        this.ui.uploadForm.on('change', function (e) {
          if ((window.FileReader && device.platform !== 'windows-phone')) {
            upload(e.target.files);
          } else {
            upload([$('#upload-file-input').get(0)]);
          }
        });
      }
    },

    checkSupport: function () {
      if ((device.isIOS && device.version && device.version < 6.0) || (device.isWindowsPhone)) {
        return false;
      } else {
        return true;
      }
    },

    serializeData: function () {
      var data = {};
      if (this.perm) {
        data = this.serializeDataInitialize();
        data.title = 'Media Upload';
        data.FileUploadSupport = this.FileUploadSupport;
        data.loading = false;
        data.uploadError = this.uploadError || [];
        data.uploading = this.uploading ? true : false;
        data.uploadCompleted = this.uploadCompleted ? true : false;
        data.uploadedImages = this.uploadedImages;
      }
      data.perm = this.perm;
      data.trans = this.trans;
      return data;
    }
  });
});
