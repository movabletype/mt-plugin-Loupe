var el = document.getElementById('init-script'),
  libPath = (el && el.dataset ? el.dataset.base : el.getAttribute('data-base')) || '.';

require.config({
  "baseUrl": libPath,
  "hbs": {
    "disableI18n": true,
    "disableHelpers": false,
    "templateExtension": "hbs",
    "compileOptions": {}
  }
});
