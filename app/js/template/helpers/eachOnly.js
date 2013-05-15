define('template/helpers/eachOnly', ['handlebars'], function(Handlebars) {
  function eachOnly(array, index, options) {
    var ret = '';
    var item;
    if (index < 0) {
      item = array[(array.length - index)];
    } else {
      item = array[index];
    }
    if (item) {
      ret = options.fn ? options.fn(item) : item;
    }
    return ret;
  }
  Handlebars.registerHelper('eachOnly', eachOnly);
  return eachOnly;
});