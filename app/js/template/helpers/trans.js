define('template/helpers/trans', ['handlebars'], function (Handlebars) {
  function trans(trans, options) {
    var str = options.fn(this);

    if (trans) {
      var args = [].slice.call(arguments, 0, arguments.length - 2);
      args.unshift(str);
      str = trans.trans.apply(trans, args);
    }
    return str;
  }
  Handlebars.registerHelper('trans', trans);
  return trans;
});
