define('template/helpers/trans', ['handlebars'], function (Handlebars) {
  function trans(func, options) {

    var args = [];
    if (arguments.length > 2) {
      args = [].slice.call(arguments, 1, arguments.length - 1);
      options = arguments[arguments.length - 1];
    }

    var str = options.fn ? options.fn(this) : options;

    if (func) {
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
