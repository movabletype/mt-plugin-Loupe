define("template/helpers/eachOnly",["handlebars"],function(e){function t(e,t,s){var n,i="";n=0>t?e[e.length-t]:e[t];n&&(i=s.fn?s.fn(n):n);return i}e.registerHelper("eachOnly",t);return t});
define("template/helpers/encodeURI",["handlebars"],function(e){function t(t){return new e.SafeString(encodeURIComponent(t))}e.registerHelper("encodeURI",t);return t});
define("template/helpers/formatDate",["handlebars","moment","moment.lang"],function(e,t){function s(s,n){n=n||"";return new e.SafeString(t(s).lang(n).format("ll"))}e.registerHelper("formatDate",s);return s});
define("template/helpers/ifIs",["handlebars"],function(e){function t(e,t){if(void 0!==e){var s=t.hash,n={eq:e===t.hash.eq,ne:e!==t.hash.ne,lt:e<=t.hash.lt,gt:e>=t.hash.gt,exists:void 0!==e},i=s.eq?"eq":s.ne?"ne":s.lt?"lt":s.gt?"gt":s.exists?"exists":" ";return n[i]?t.fn(this):t.inverse(this)}return""}e.registerHelper("ifIs",t);return t});
define("template/helpers/log",["handlebars"],function(e){function t(e){console.log("handlebars log:");console.log(e)}e.registerHelper("log",t);return t});
define("template/helpers/removeHtml",["handlebars"],function(e){function t(t){return new e.SafeString($("<div>").html(t).text())}e.registerHelper("removeHtml",t);return t});
define("template/helpers/sanitize",["handlebars"],function(e){function t(t){function s(e){var t,i=$(e);if(i.children().length){var a=[];i.contents().each(function(e,t){a.push(s(t))});t=$("<div></div>").html(n(i.html(a.join("")))).html()}else t=/script|iframe/i.test(e.tagName)?"":$("<div></div>").html(n(i)).html();return t}function n(e){var t,s=e.get(0).tagName;if(s){t=$("<"+s+">").html(e.html());if("A"===s){var n=e.attr("href");n&&!/(java|vb|live)script/i.test(n)&&t.attr("href",n)}else if("IMG"===s){var i=e.attr("src");i&&!/(java|vb|live)script/i.test(i)&&t.attr("src",i)}}else t=e;return t}t=s($("<div></div>").html(t));return new e.SafeString(t)}e.registerHelper("sanitize",t);return t});
define("template/helpers/todaysPageViews",["handlebars"],function(e){function t(e){var t="";if(e){t=parseFloat(e[e.length-1].pageviews,10);t>1e6?t=Math.round(t/1e6)+"M":t>1e3&&(t=Math.round(t/1e3)+"K");return t}}e.registerHelper("todaysPageViews",t);return t});
define("template/helpers/trans",["handlebars"],function(e){function t(e,t){var s=[];if(arguments.length>2){s=[].slice.call(arguments,1,arguments.length-1);t=arguments[arguments.length-1]}var n=t.fn?t.fn(this):t;if(e){s.unshift(n);n=e.trans.apply(e,s)}else n="";return n}e.registerHelper("trans",t);return t});
define("hbs!js/views/card/partials/fetchError",["hbs","handlebars","template/helpers/trans"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(e,t){var n,i,a="";a+='\n<div class="fetch-error error">\n  <div class="message">\n    <div class="message-inner">';n=e.trans;i=s.trans;n=i?i.call(e,n,{hash:{},inverse:h.noop,fn:h.program(2,r,t)}):d.call(e,"trans",n,{hash:{},inverse:h.noop,fn:h.program(2,r,t)});(n||0===n)&&(a+=n);a+='</div>\n  </div>\n  <div class="refetch button">';n=e.trans;i=s.trans;n=i?i.call(e,n,{hash:{},inverse:h.noop,fn:h.program(4,o,t)}):d.call(e,"trans",n,{hash:{},inverse:h.noop,fn:h.program(4,o,t)});(n||0===n)&&(a+=n);a+="</div>\n</div>\n";return a}function r(){return"Failed Fetching Data"}function o(){return"Re-Fetch Data"}s=s||e.helpers;var l,c="",h=this,d=s.helperMissing;l=t.fetchError;l=s["if"].call(t,l,{hash:{},inverse:h.noop,fn:h.program(1,a,i)});(l||0===l)&&(c+=l);c+="\n\n";return c});t.registerPartial("js_views_card_partials_fetchError",s);return s});
define("hbs!js/views/card/partials/loading",["hbs","handlebars"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(){return'\n<div class="loading"></div>\n'}function r(){return'\n<div class="loading"></div>\n'}s=s||e.helpers;var o,l="",c=this;o=t.loading;o=s["if"].call(t,o,{hash:{},inverse:c.noop,fn:c.program(1,a,i)});(o||0===o)&&(l+=o);l+="\n";o=t.loadingReadmore;o=s["if"].call(t,o,{hash:{},inverse:c.noop,fn:c.program(3,r,i)});(o||0===o)&&(l+=o);l+="\n";return l});t.registerPartial("js_views_card_partials_loading",s);return s});
define("hbs!js/views/card/partials/noItem",["hbs","handlebars","template/helpers/trans"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(e,t){var n,i="";i+="\n";n=e.loading;n=s.unless.call(e,n,{hash:{},inverse:d.noop,fn:d.program(2,r,t)});(n||0===n)&&(i+=n);i+="\n";return i}function r(e,t){var n,i="";i+="\n";n=e.count;n=s.unless.call(e,n,{hash:{},inverse:d.noop,fn:d.program(3,o,t)});(n||0===n)&&(i+=n);i+="\n";return i}function o(e,t){var n,i,a="";a+='\n<div class="no-item">\n  <div class="no-item-inner">';n=e.trans;i=s.trans;n=i?i.call(e,n,{hash:{},inverse:d.noop,fn:d.program(4,l,t)}):u.call(e,"trans",n,{hash:{},inverse:d.noop,fn:d.program(4,l,t)});(n||0===n)&&(a+=n);a+="</div>\n</div>\n";return a}function l(){return"You have no available item in this card"}s=s||e.helpers;var c,h="",d=this,u=s.helperMissing;c=t.fetchError;c=s.unless.call(t,c,{hash:{},inverse:d.noop,fn:d.program(1,a,i)});(c||0===c)&&(h+=c);h+="\n";return h});t.registerPartial("js_views_card_partials_noItem",s);return s});
define("hbs!js/views/card/partials/noPermission",["hbs","handlebars","template/helpers/trans"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(){return"User has no permission for this card"}s=s||e.helpers;var r,o,l="",c=this,h=s.helperMissing;l+='<div class="error">\n  <span class="message">\n    <span class="message-inner">';r=t.trans;o=s.trans;r=o?o.call(t,r,{hash:{},inverse:c.noop,fn:c.program(1,a,i)}):h.call(t,"trans",r,{hash:{},inverse:c.noop,fn:c.program(1,a,i)});(r||0===r)&&(l+=r);l+="</span>\n  </span>\n</div>\n";return l});t.registerPartial("js_views_card_partials_noPermission",s);return s});
define("hbs!js/views/card/partials/providerIsNotAvailable",["hbs","handlebars","template/helpers/trans"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(e,t){var n,i,a="";a+='\n<div class="error provider-is-not-available-container">\n  <span class="message provider-is-not-available">\n    <span class="message-inner">';n=e.trans;i=s.trans;n=i?i.call(e,n,{hash:{},inverse:c.noop,fn:c.program(2,r,t)}):h.call(e,"trans",n,{hash:{},inverse:c.noop,fn:c.program(2,r,t)});(n||0===n)&&(a+=n);a+="</span>\n  </span>\n</div>\n";return a}function r(){return"Analytics service is not enabled"}s=s||e.helpers;var o,l="",c=this,h=s.helperMissing;o=t.providerIsNotAvailable;o=s["if"].call(t,o,{hash:{},inverse:c.noop,fn:c.program(1,a,i)});(o||0===o)&&(l+=o);l+="\n";return l});t.registerPartial("js_views_card_partials_providerIsNotAvailable",s);return s});
define("hbs!js/views/card/partials/readmore",["hbs","handlebars","template/helpers/trans"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(e,t){var n,i="";i+="\n";n=e.showMoreButton;n=s["if"].call(e,n,{hash:{},inverse:p.noop,fn:p.program(2,r,t)});(n||0===n)&&(i+=n);i+="\n";return i}function r(e,t){var n,i,a="";a+='\n<div id="';i=s.name;if(i)n=i.call(e,{hash:{}});else{n=e.name;n=typeof n===d?n():n}a+=u(n)+'-readmore" class="readmore button ';n=e.loadingReadmore;n=s["if"].call(e,n,{hash:{},inverse:p.noop,fn:p.program(3,o,t)});(n||0===n)&&(a+=n);a+='">\n  ';n=e.trans;i=s.trans;n=i?i.call(e,n,{hash:{},inverse:p.noop,fn:p.program(5,l,t)}):f.call(e,"trans",n,{hash:{},inverse:p.noop,fn:p.program(5,l,t)});(n||0===n)&&(a+=n);a+="\n</div>\n";return a}function o(){return"button-loading"}function l(){return"Read More"}s=s||e.helpers;var c,h="",d="function",u=this.escapeExpression,p=this,f=s.helperMissing;c=t.fetchError;c=s.unless.call(t,c,{hash:{},inverse:p.noop,fn:p.program(1,a,i)});(c||0===c)&&(h+=c);h+="\n";return h});t.registerPartial("js_views_card_partials_readmore",s);return s});
define("hbs!js/views/card/partials/title",["hbs","handlebars","template/helpers/trans"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(e){var t,n;n=s.title;if(n)t=n.call(e,{hash:{}});else{t=e.title;t=typeof t===h?t():t}return t||0===t?t:""}function r(e){var t,n,i="";i+='<p id="';n=s.name;if(n)t=n.call(e,{hash:{}});else{t=e.name;t=typeof t===h?t():t}i+=d(t)+'-count" class="card-header-count">';n=s.count;if(n)t=n.call(e,{hash:{}});else{t=e.count;t=typeof t===h?t():t}i+=d(t)+"</p>";return i}s=s||e.helpers;var o,l,c="",h="function",d=this.escapeExpression,u=this,p=s.helperMissing;c+='<header>\n<h1 id="';l=s.name;if(l)o=l.call(t,{hash:{}});else{o=t.name;o=typeof o===h?o():o}c+=d(o)+'-title">';o=t.trans;l=s.trans;o=l?l.call(t,o,{hash:{},inverse:u.noop,fn:u.program(1,a,i)}):p.call(t,"trans",o,{hash:{},inverse:u.noop,fn:u.program(1,a,i)});(o||0===o)&&(c+=o);c+="</h1>\n";o=t.count;o=s["if"].call(t,o,{hash:{},inverse:u.noop,fn:u.program(3,r,i)});(o||0===o)&&(c+=o);c+="\n</header>\n";return c});t.registerPartial("js_views_card_partials_title",s);return s});
define("hbs!js/views/card/templates/header",["hbs","handlebars","template/helpers/trans"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(){return"Back"}function r(e){var t,n;n=s.name;if(n)t=n.call(e,{hash:{}});else{t=e.name;t=typeof t===d?t():t}return u(t)}function o(){return'<div class="share-button-container"><a id="share-button" class="icon-share"></a></div>'}s=s||e.helpers;var l,c,h="",d="function",u=this.escapeExpression,p=this,f=s.helperMissing;h+='<div id="header-main">\n  <nav>\n    <div id="back-dashboard" class="header-button-container">\n      <div class="header-button"><div class="header-button-inner">\n        <a>';l=t.trans;c=s.trans;l=c?c.call(t,l,{hash:{},inverse:p.noop,fn:p.program(1,a,i)}):f.call(t,"trans",l,{hash:{},inverse:p.noop,fn:p.program(1,a,i)});(l||0===l)&&(h+=l);h+='</a>\n      </div></div>\n    </div>\n    <div class="header-title"><div class="header-title-inner">';l=t.trans;c=s.trans;l=c?c.call(t,l,{hash:{},inverse:p.noop,fn:p.program(3,r,i)}):f.call(t,"trans",l,{hash:{},inverse:p.noop,fn:p.program(3,r,i)});(l||0===l)&&(h+=l);h+="</div></div>\n    ";l=t.shareEnabled;l=s["if"].call(t,l,{hash:{},inverse:p.noop,fn:p.program(5,o,i)});(l||0===l)&&(h+=l);h+="\n  </nav>\n</div>\n";return h});t.registerPartial("js_views_card_templates_header",s);return s});
define("hbs!js/views/card/templates/layout",["hbs","handlebars"],function(e,t){var s=t.template(function(e,t,s){s=s||e.helpers;return'<header id="header"></header>\n<div class="main-container"><main id="main" class="card-view"></main></div>\n<footer id="footer"></footer>\n'});t.registerPartial("js_views_card_templates_layout",s);return s});
define("hbs!js/views/card/templates/title",["hbs","handlebars","template/helpers/trans"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(e){var t,n;n=s.title;if(n)t=n.call(e,{hash:{}});else{t=e.title;t=typeof t===h?t():t}return t||0===t?t:""}function r(e){var t,n,i="";i+='<p id="';n=s.name;if(n)t=n.call(e,{hash:{}});else{t=e.name;t=typeof t===h?t():t}i+=d(t)+'-count" class="card-header-count">';n=s.count;if(n)t=n.call(e,{hash:{}});else{t=e.count;t=typeof t===h?t():t}i+=d(t)+"</p>";return i}s=s||e.helpers;var o,l,c="",h="function",d=this.escapeExpression,u=this,p=s.helperMissing;c+='<header>\n<h1 id="';l=s.name;if(l)o=l.call(t,{hash:{}});else{o=t.name;o=typeof o===h?o():o}c+=d(o)+'-title">';o=t.trans;l=s.trans;o=l?l.call(t,o,{hash:{},inverse:u.noop,fn:u.program(1,a,i)}):p.call(t,"trans",o,{hash:{},inverse:u.noop,fn:u.program(1,a,i)});(o||0===o)&&(c+=o);c+="</h1>\n";o=t.count;o=s["if"].call(t,o,{hash:{},inverse:u.noop,fn:u.program(3,r,i)});(o||0===o)&&(c+=o);c+="\n</header>\n";return c});t.registerPartial("js_views_card_templates_title",s);return s});
define("hbs!js/views/dashboard/templates/header",["hbs","handlebars"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(e){var t,s="";s+='\n  <div id="blogname-circle" class="circle"><div class="circle-inner"></div></div>\n  <h1 id="blogname"><span id="blogname-inner">';t=e.blog;t=null==t||t===!1?t:t.name;t=typeof t===l?t():t;s+=c(t)+'</span></h1>\n  <div id="blogname-arrow" class="icon-arrow-down"></div>\n  ';return s}s=s||e.helpers;var r,o="",l="function",c=this.escapeExpression,h=this;o+='<div id="header-main">\n  ';r=t.blog;r=s["if"].call(t,r,{hash:{},inverse:h.noop,fn:h.program(1,a,i)});(r||0===r)&&(o+=r);o+="\n</div>\n";return o});t.registerPartial("js_views_dashboard_templates_header",s);return s});
define("hbs!js/views/dashboard/templates/layout",["hbs","handlebars"],function(e,t){var s=t.template(function(e,t,s){s=s||e.helpers;return'<header id="header"></header>\n<div class="main-container"><main id="main" class="main"></main></div>\n<footer id="footer"></footer>\n'});t.registerPartial("js_views_dashboard_templates_layout",s);return s});
define("hbs!js/views/dashboard/templates/main",["hbs","handlebars","template/helpers/trans"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(e,t){var n,i,a="";a+='\n<div class="error-in-dashboard">';n=e.trans;i=s.trans;n=i?i.call(e,n,{hash:{},inverse:d.noop,fn:d.program(2,r,t)}):u.call(e,"trans",n,{hash:{},inverse:d.noop,fn:d.program(2,r,t)});(n||0===n)&&(a+=n);a+="</div>\n";return a}function r(e){var t;t=e.error;t=null==t||t===!1?t:t.message;t=typeof t===c?t():t;return h(t)}s=s||e.helpers;var o,l="",c="function",h=this.escapeExpression,d=this,u=s.helperMissing;o=t.error;o=s["if"].call(t,o,{hash:{},inverse:d.noop,fn:d.program(1,a,i)});(o||0===o)&&(l+=o);l+="\n";return l});t.registerPartial("js_views_dashboard_templates_main",s);return s});
define("hbs!js/views/menu/templates/blogs-list",["hbs","handlebars","template/helpers/trans","template/helpers/ifIs"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(){return'\n  <div class="loading"></div>\n  '}function r(e,t){var n,i="";i+='\n    <ul class="histories-list">\n    ';n=e.histories;n=s.each.call(e,n,{hash:{},inverse:A.noop,fn:A.program(4,o,t)});(n||0===n)&&(i+=n);i+="\n    </ul>\n  ";return i}function o(e,t){var n,i,a="";a+='\n      <li data-id="';i=s.id;if(i)n=i.call(e,{hash:{}});else{n=e.id;n=typeof n===T?n():n}a+=C(n)+'" class="blog-item';n=e.selected;n=s["if"].call(e,n,{hash:{},inverse:A.noop,fn:A.program(5,l,t)});(n||0===n)&&(a+=n);a+='">\n        <a href="#" data-id="';i=s.id;if(i)n=i.call(e,{hash:{}});else{n=e.id;n=typeof n===T?n():n}a+=C(n)+'">\n          <span class="circle blog-asset"><span class="circle-inner"></span></span>\n          <span class="blog-name">';n=e.name;n=typeof n===T?n():n;a+=C(n)+"</span>\n        </a>\n      </li>\n    ";return a}function l(){return" selected"}function c(){return'\n  <div class="loading"></div>\n  '}function h(e){var t,s="";s+='\n    <li class="blog-item error">\n      ';t=e.error;t=null==t||t===!1?t:t.message;t=typeof t===T?t():t;s+=C(t)+"\n    </li>\n  ";return s}function d(e,t){var n,i,a="";a+='\n    <li data-id="';i=s.id;if(i)n=i.call(e,{hash:{}});else{n=e.id;n=typeof n===T?n():n}a+=C(n)+'" class="blog-item';n=e.selected;n=s["if"].call(e,n,{hash:{},inverse:A.noop,fn:A.program(12,u,t)});(n||0===n)&&(a+=n);a+='">\n      <a href="#" data-id="';i=s.id;if(i)n=i.call(e,{hash:{}});else{n=e.id;n=typeof n===T?n():n}a+=C(n)+'">\n        <span class="circle blog-asset"><span class="circle-inner"></span></span>\n        <span class="blog-name">';n=e.name;n=typeof n===T?n():n;a+=C(n)+"</span>\n      </a>\n    </li>\n  ";return a}function u(){return" selected"}function p(e,t){var n,i="";i+="\n      ";n=e.user;n=s["with"].call(e,n,{hash:{},inverse:A.noop,fn:A.programWithDepth(f,t,e)});(n||0===n)&&(i+=n);i+="\n      ";return i}function f(e,t,n){var i,a,r="";r+='\n      <a href="#" data-id="logout">\n        ';i=e.userpicUrl;i=s["if"].call(e,i,{hash:{},inverse:A.program(18,v,t),fn:A.program(16,m,t)});(i||0===i)&&(r+=i);r+='\n        <div class="display-name">';i=n.trans;a=s.trans;i=a?a.call(e,i,{hash:{},inverse:A.noop,fn:A.program(20,g,t)}):D.call(e,"trans",i,{hash:{},inverse:A.noop,fn:A.program(20,g,t)});(i||0===i)&&(r+=i);r+="</div>\n      </a>\n      ";return r}function m(e){var t,n,i="";i+='\n          <div class="circle userpic" style="background-image: url(';n=s.userpicUrl;if(n)t=n.call(e,{hash:{}});else{t=e.userpicUrl;t=typeof t===T?t():t}i+=C(t)+"); -pie-background: url(";n=s.userpicUrl;if(n)t=n.call(e,{hash:{}});else{t=e.userpicUrl;t=typeof t===T?t():t}i+=C(t)+') no-repeat center center / cover"></div>\n        ';return i}function v(){return'\n          <div class="userpic no-image icon-user"></div>\n        '}function g(){return"Logout"}function b(e,t){var n,i,a="";a+='\n  <div class="blog-item-nav blog-item-nav-prev" data-offset="';i=s.prev;if(i)n=i.call(e,{hash:{}});else{n=e.prev;n=typeof n===T?n():n}a+=C(n)+'"><span class="icon-arrow-left"></span>';n=e.trans;i=s.trans;n=i?i.call(e,n,{hash:{},inverse:A.noop,fn:A.program(23,_,t)}):D.call(e,"trans",n,{hash:{},inverse:A.noop,fn:A.program(23,_,t)});(n||0===n)&&(a+=n);a+="</div>\n";return a}function _(){return"previous"}function w(e,t){var n,i,a="";a+='\n  <div class="blog-item-nav blog-item-nav-next" data-offset="';i=s.next;if(i)n=i.call(e,{hash:{}});else{n=e.next;n=typeof n===T?n():n}a+=C(n)+'">';n=e.trans;i=s.trans;n=i?i.call(e,n,{hash:{},inverse:A.noop,fn:A.program(26,y,t)}):D.call(e,"trans",n,{hash:{},inverse:A.noop,fn:A.program(26,y,t)});(n||0===n)&&(a+=n);a+='<span class="icon-arrow"></span></div>\n';return a}function y(){return"next"}s=s||e.helpers;var j,I,k,P,x="",T="function",C=this.escapeExpression,A=this,D=s.helperMissing;x+='<div class="histories">\n  ';j=t.historiesLoading;j=s["if"].call(t,j,{hash:{},inverse:A.noop,fn:A.program(1,a,i)});(j||0===j)&&(x+=j);x+="\n  ";j=t.histories;j=null==j||j===!1?j:j.length;j=s["if"].call(t,j,{hash:{},inverse:A.noop,fn:A.program(3,r,i)});(j||0===j)&&(x+=j);x+='\n</div>\n<div class="blogs">\n  ';j=t.blogsLoading;j=s["if"].call(t,j,{hash:{},inverse:A.noop,fn:A.program(7,c,i)});(j||0===j)&&(x+=j);x+="\n  <ul>\n  ";j=t.error;j=s["if"].call(t,j,{hash:{},inverse:A.noop,fn:A.program(9,h,i)});(j||0===j)&&(x+=j);x+="\n  ";j=t.blogs;j=s.each.call(t,j,{hash:{},inverse:A.noop,fn:A.program(11,d,i)});(j||0===j)&&(x+=j);x+='\n    <li class="user-info">\n      ';j=t.user;j=s["if"].call(t,j,{hash:{},inverse:A.noop,fn:A.program(14,p,i)});(j||0===j)&&(x+=j);x+='\n    </li>\n  </ul>\n</div>\n<div class="blog-item-nav-container">\n';j=t.prev;I={};I.exists=!0;P=s.ifIs;j=P?P.call(t,j,{hash:I,inverse:A.noop,fn:A.program(22,b,i)}):D.call(t,"ifIs",j,{hash:I,inverse:A.noop,fn:A.program(22,b,i)});(j||0===j)&&(x+=j);x+="\n";j=t.totalResults;I={};k=t.next;I.gt=k;P=s.ifIs;j=P?P.call(t,j,{hash:I,inverse:A.noop,fn:A.program(25,w,i)}):D.call(t,"ifIs",j,{hash:I,inverse:A.noop,fn:A.program(25,w,i)});(j||0===j)&&(x+=j);x+="\n</div>\n";return x});t.registerPartial("js_views_menu_templates_blogs-list",s);return s});
define("hbs!js/views/menu/templates/layout",["hbs","handlebars"],function(e,t){var s=t.template(function(e,t,s){s=s||e.helpers;return'<div class="menu-main-container">\n  <aside id="menu-main">\n  </aside>\n</div>\n'});t.registerPartial("js_views_menu_templates_layout",s);return s});
define("hbs!js/views/menu/templates/main",["hbs","handlebars"],function(e,t){var s=t.template(function(e,t,s){s=s||e.helpers;return'<header id="menu-header">\n  <h1 id="menu-header-logo">Loupe</h1>\n  <div id="menu-header-arrow" class="icon-arrow-up"></div>\n</header>\n<section id="menu-blogs-list" class="blogs-list">\n</section>\n'});t.registerPartial("js_views_menu_templates_main",s);return s});
define("hbs!js/views/share/templates/share",["hbs","handlebars","template/helpers/trans","template/helpers/encodeURI"],function(e,t){var s=t.template(function(e,t,s,n,i){function a(){return"Share The Post"}s=s||e.helpers;var r,o,l="",c=this,h=s.helperMissing,d=this.escapeExpression;l+='<div id="share-close" class="icon-close">\n</div>\n<header>\n  <h1>';r=t.trans;o=s.trans;r=o?o.call(t,r,{hash:{},inverse:c.noop,fn:c.program(1,a,i)}):h.call(t,"trans",r,{hash:{},inverse:c.noop,fn:c.program(1,a,i)});(r||0===r)&&(l+=r);l+='</h1>\n</header>\n<div class="share-contents">\n<ul class="share-list">\n  <li>\n  <a href="https://twitter.com/intent/tweet?url=';r=t.tweetUrl;o=s.encodeURI;r=o?o.call(t,r,{hash:{}}):h.call(t,"encodeURI",r,{hash:{}});l+=d(r)+"&text=";r=t.tweetText;o=s.encodeURI;r=o?o.call(t,r,{hash:{}}):h.call(t,"encodeURI",r,{hash:{}});l+=d(r)+'" target="blank" class="icon-twitter"></a>\n  </li>\n</ul>\n</div>\n';return l});t.registerPartial("js_views_share_templates_share",s);return s});