define('template/helpers/trans', ['handlebars'], function (Handlebars) {
  function trans(func, options) {
    var str = options.fn(this);

    if (func) {
      var args = [].slice.call(arguments, 0, arguments.length - 2);
      args.unshift(str);
      str = func.trans.apply(func, args);
    } else {
      str = '';
    }

    return str;
  }
  Handlebars.registerHelper('trans', trans);
  return trans;
});
