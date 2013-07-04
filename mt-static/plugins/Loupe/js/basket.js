!function(a){"use strict";function b(a,b){d.async(function(){a.trigger("promise:resolved",{detail:b}),a.isResolved=!0,a.resolvedValue=b})}function c(a,b){d.async(function(){a.trigger("promise:failed",{detail:b}),a.isRejected=!0,a.rejectedValue=b})}var d,e,f="undefined"!=typeof window?window:{},g=f.MutationObserver||f.WebKitMutationObserver;if("undefined"!=typeof process&&"[object process]"==={}.toString.call(process))e=function(a,b){process.nextTick(function(){a.call(b)})};else if(g){var h=[],i=new g(function(){var a=h.slice();h=[],a.forEach(function(a){var b=a[0],c=a[1];b.call(c)})}),j=document.createElement("div");i.observe(j,{attributes:!0}),e=function(a,b){h.push([a,b]),j.setAttribute("drainQueue","drainQueue")}}else e=function(a,b){setTimeout(function(){a.call(b)},1)};var k=function(a,b){this.type=a;for(var c in b)b.hasOwnProperty(c)&&(this[c]=b[c])},l=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c][0]===b)return c;return-1},m=function(a){var b=a._promiseCallbacks;return b||(b=a._promiseCallbacks={}),b},n={mixin:function(a){return a.on=this.on,a.off=this.off,a.trigger=this.trigger,a},on:function(a,b,c){var d,e,f=m(this);a=a.split(/\s+/),c=c||this;for(;e=a.shift();)d=f[e],d||(d=f[e]=[]),-1===l(d,b)&&d.push([b,c])},off:function(a,b){var c,d,e,f=m(this);a=a.split(/\s+/);for(;d=a.shift();)b?(c=f[d],e=l(c,b),-1!==e&&c.splice(e,1)):f[d]=[]},trigger:function(a,b){var c,d,e,f,g,h=m(this);if(c=h[a])for(var i=0,j=c.length;j>i;i++)d=c[i],e=d[0],f=d[1],"object"!=typeof b&&(b={detail:b}),g=new k(a,b),e.call(f,g)}},o=function(){this.on("promise:resolved",function(a){this.trigger("success",{detail:a.detail})},this),this.on("promise:failed",function(a){this.trigger("error",{detail:a.detail})},this)},p=function(){},q=function(a,b,c,d){var e,f;if(c)try{e=c(d.detail)}catch(g){f=g}else e=d.detail;e instanceof o?e.then(function(a){b.resolve(a)},function(a){b.reject(a)}):c&&e?b.resolve(e):f?b.reject(f):b[a](e)};o.prototype={then:function(a,b){var c=new o;return this.isResolved&&d.async(function(){q("resolve",c,a,{detail:this.resolvedValue})},this),this.isRejected&&d.async(function(){q("reject",c,b,{detail:this.rejectedValue})},this),this.on("promise:resolved",function(b){q("resolve",c,a,b)}),this.on("promise:failed",function(a){q("reject",c,b,a)}),c},resolve:function(a){b(this,a),this.resolve=p,this.reject=p},reject:function(a){c(this,a),this.resolve=p,this.reject=p}},n.mixin(o.prototype),d={async:e,Promise:o,Event:k,EventTarget:n},a.RSVP=d}(window),function(a,b){"use strict";RSVP.all=function(a){var b,c=[],d=new RSVP.Promise,e=a.length,f=function(a){return function(b){g(a,b)}},g=function(a,b){c[a]=b,0===--e&&d.resolve(c)},h=function(a){d.reject(a)};for(b=0;e>b;b++)a[b].then(f(b),h);return d};var c=b.head||b.getElementsByTagName("head")[0],d="basket-",e=5e3,f=function(a,b){try{return localStorage.setItem(d+a,JSON.stringify(b)),!0}catch(c){if(c.name.toUpperCase().indexOf("QUOTA")>=0){var e,g=[];for(e in localStorage)0===e.indexOf(d)&&g.push(JSON.parse(localStorage[e]));if(g.length)return g.sort(function(a,b){return a.stamp-b.stamp}),basket.remove(g[0].key),f(a,b);return}return}},g=function(a){var b=new XMLHttpRequest,c=new RSVP.Promise;return b.open("GET",a),b.onreadystatechange=function(){4===b.readyState&&(200===b.status?c.resolve(b.responseText):c.reject(Error(b.statusText)))},b.send(),c},h=function(a){return g(a.url).then(function(b){var c=j(a,b);return f(a.key,c),b})},i=function(a){var d=b.createElement("script");d.defer=!0,d.text=a,c.appendChild(d)},j=function(a,b){var c=+new Date;return a.data=b,a.stamp=c,a.expire=c+1e3*60*60*(a.expire||e),a},k=function(a){var b,c;return a.url?(a.key=a.key||a.url,b=basket.get(a.key),a.execute=a.execute!==!1,!b||b.expire-+new Date<0||a.unique!==b.unique?(a.unique&&(a.url+=(a.url.indexOf("?")>0?"&":"?")+"basket-unique="+a.unique),c=h(a)):(c=new RSVP.Promise,c.resolve(b.data)),a.execute?c.then(i):c):void 0};a.basket={require:function(){var a,b,c=[];for(a=0,b=arguments.length;b>a;a++)c.push(k(arguments[a]));return RSVP.all(c)},remove:function(a){return localStorage.removeItem(d+a),this},get:function(a){var b=localStorage.getItem(d+a);try{return JSON.parse(b||"false")}catch(c){return!1}},clear:function(a){var b,c,e=+new Date;for(b in localStorage)c=b.split(d)[1],c&&(!a||this.get(c).expire<=e)&&this.remove(c);return this}},basket.clear(!0)}(this,document);!function(a){var b,c=document.getElementById("main-script");b=c.dataset?c.dataset.base:c.getAttribute("data-base");a.buildTime=1372919410473;basket.require({url:b+"/js/vendor.js",unique:a.buildTime}).then(function(){basket.require({url:b+"/js/template.js",unique:a.buildTime},{url:b+"/js/card.js",unique:a.buildTime},{url:b+"/js/app.js",unique:a.buildTime}).then(function(){require(["backbone","app","js/router/router","js/router/controller","json!cards/cards.json"],function(a,b,c,d,e){new c({controller:new d({cards:e})},e);a.history.start();var f=$("#main-script").data("mtapi");b.start({cards:e,mtApiCGIPath:f})})})})}(this);