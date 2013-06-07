define('template/helpers/sanitize', ['handlebars'], function (Handlebars) {
  function sanitize(str, options) {
    str = saniTize($('<div></div>').html(str));

    function trimAttributes($el) {
      // only allow a href and img src
      var tagName = $el.get(0).tagName;

      var $newEl;
      if (tagName) {
        $newEl = $('<' + tagName + '>').html($el.html());

        if (tagName === 'A') {
          var href = $el.attr('href');
          if (href && !/(java|vb|live)script/i.test(href)) {
            $newEl.attr('href', href);
          }
        } else if (tagName === 'IMG') {
          var src = $el.attr('src');
          if (src && !/(java|vb|live)script/i.test(src)) {
            $newEl.attr('src', src);
          }
        }
      } else {
        $newEl = $el;
      }
      return $newEl;
    }

    function saniTize(el) {
      var s;
      var $el = $(el);
      if ($el.children().length) {
        var arr = [];
        $el.contents().each(function (i, el) {
          arr.push(saniTize(el));
        });
        s = $('<div></div>').html(trimAttributes($el.html(arr.join('')))).html();
      } else {
        if (/script|iframe/i.test(el.tagName)) {
          s = ''
        } else {
          s = $('<div></div>').html(trimAttributes($el)).html();
        }
      }
      return s;
    }
    return new Handlebars.SafeString(str);
  }
  Handlebars.registerHelper('sanitize', sanitize);
  return sanitize;
});
