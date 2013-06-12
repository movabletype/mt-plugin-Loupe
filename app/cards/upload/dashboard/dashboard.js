define(['backbone.marionette', 'app', 'js/mtapi', 'js/device', 'js/commands', 'js/trans', 'hbs!cards/upload/templates/dashboard'],

function (Marionette, app, mtapi, device, commands, Trans, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    },

    ui: {
      uploadForm: '#upload-file-input',
      uploadButton: '#upload-file',
      retryButton: '#retry',
      refreshButton: '#refresh'
    },

    initialize: function (options) {
      this.trans = null;
      this.blog = options.params.blog || null;
      // this.FileAPINotAvailable = (!window.FileReader || device.platform === 'windows-phone') ? true : false;

      commands.execute('l10n', _.bind(function (l10n) {
        l10n.load('cards/upload/l10n', 'cardUpload').done(_.bind(function () {
          this.trans = new Trans(l10n, 'cardUpload');
          this.render();
        }, this));
      }, this));
    },

    onRender: function () {
      var blogId = this.blog.id;
      var that = this;
      var hammerOpts = device.options.hammer();

      var upload = _.bind(function (files) {
        console.log('upload Start')
        this.uploadedImages = [];
        this.error = [];
        this.errorImages = [];
        this.uploading = true;
        this.render();
        var dfds = [];
        console.log('files')
        console.log(files)
        _.each(files, function (file) {
          console.log('in file')
          console.log(file)
          var dfd = $.Deferred();
          dfds.push(dfd);
          mtapi.api.uploadAsset(blogId, {
            file: file,
            autoRenameIfExists: true
          },
            _.bind(function (resp) {
            console.log(resp);
            if (!resp.error) {
              dfd.resolve();
              this.uploadedImages.push(resp);
              console.log(this.uploadedImages);
            } else {
              this.errorImages.push(file);
              this.error.push(resp.error);
              dfd.reject();
            }
            this.render();
          }, that));
        });
        $.when.apply(that, dfds).done(_.bind(function () {
          this.error = false;
          this.uploadCompleted = true;
        }, this)).always(_.bind(function () {
          this.uploading = false;
          this.render();
        }, this));
      }, this);

      this.ui.uploadButton.hammer(hammerOpts).on('tap', _.bind(function () {
        this.ui.uploadForm.trigger('click');
      }, this));

      this.ui.retryButton.hammer(hammerOpts).on('tap', _.bind(function () {
        upload(this.errorImages);
      }, this));

      this.ui.uploadForm.on('change', function (e) {
        if ((window.FileReader && device.platform !== 'windows-phone')) {
          var files = e.target.files;
          upload(files);
        } else {
          upload([$('#upload-file-input').get(0)]);
        }
      });
    },

    serializeData: function () {
      var data = {};
      if (!this.loading) {}
      data.error = this.error ? (this.error.length ? this.error : false) : false;
      data.loading = this.loading ? true : false;
      data.trans = this.trans;
      data.uploading = this.uploading ? true : false;
      data.uploadCompleted = this.uploadCompleted ? true : false;
      data.uploadedImages = this.uploadedImages;
      data.FileAPINotAvailable = this.FileAPINotAvailable ? true : false;
      return data;
    }
  });
});
