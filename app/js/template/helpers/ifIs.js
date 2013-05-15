define('template/helpers/ifIs', ['handlebars'], function(Handlebars) {
  function ifIs(target, options) {
    var hash = options.hash;

    var map = {
      'eq': (target === options.hash.eq),
      'ne': (target !== options.hash.ne),
      'lt': (target <= options.hash.lt),
      'gt': (target >= options.hash.gt)
    }

    var cond = hash.eq ? 'eq' : hash.ne ? 'ne' : hash.lt ? 'lt' : hash.gt ? 'gt' : ' ';
    if (map[cond]) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
  Handlebars.registerHelper('ifIs', ifIs);
  return ifIs;
});