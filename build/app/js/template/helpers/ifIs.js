define('template/helpers/ifIs', ['handlebars'], function (Handlebars) {
  function ifIs(target, options) {
    if (target !== undefined) {
      var hash = options.hash;

      var map = {
        'eq': (target === options.hash.eq),
        'ne': (target !== options.hash.ne),
        'lt': (target <= options.hash.lt),
        'gt': (target >= options.hash.gt),
        'exists': (target !== undefined),
        'notNull': (target !== null)
      };

      var cond = hash.eq ? 'eq' : hash.ne ? 'ne' : hash.lt ? 'lt' : hash.gt ? 'gt' : hash.exists ? 'exists' : hash.notNull ? 'notNull' : ' ';
      if (map[cond]) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return '';
    }
  }
  Handlebars.registerHelper('ifIs', ifIs);
  return ifIs;
});
