(function(e){"use strict";function t(e,t){n.async(function(){e.trigger("promise:resolved",{detail:t}),e.isResolved=!0,e.resolvedValue=t})}function r(e,t){n.async(function(){e.trigger("promise:failed",{detail:t}),e.isRejected=!0,e.rejectedValue=t})}var n,i,s="undefined"!=typeof window?window:{},o=s.MutationObserver||s.WebKitMutationObserver;if("undefined"!=typeof process&&"[object process]"==={}.toString.call(process))i=function(e,t){process.nextTick(function(){e.call(t)})};else if(o){var a=[],u=new o(function(){var e=a.slice();a=[],e.forEach(function(e){var t=e[0],r=e[1];t.call(r)})}),c=document.createElement("div");u.observe(c,{attributes:!0}),i=function(e,t){a.push([e,t]),c.setAttribute("drainQueue","drainQueue")}}else i=function(e,t){setTimeout(function(){e.call(t)},1)};var l=function(e,t){this.type=e;for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r])},f=function(e,t){for(var r=0,n=e.length;n>r;r++)if(e[r][0]===t)return r;return-1},d=function(e){var t=e._promiseCallbacks;return t||(t=e._promiseCallbacks={}),t},h={mixin:function(e){return e.on=this.on,e.off=this.off,e.trigger=this.trigger,e},on:function(e,t,r){var n,i,s=d(this);e=e.split(/\s+/),r=r||this;for(;i=e.shift();)n=s[i],n||(n=s[i]=[]),-1===f(n,t)&&n.push([t,r])},off:function(e,t){var r,n,i,s=d(this);e=e.split(/\s+/);for(;n=e.shift();)t?(r=s[n],i=f(r,t),-1!==i&&r.splice(i,1)):s[n]=[]},trigger:function(e,t){var r,n,i,s,o,a=d(this);if(r=a[e])for(var u=0,c=r.length;c>u;u++)n=r[u],i=n[0],s=n[1],"object"!=typeof t&&(t={detail:t}),o=new l(e,t),i.call(s,o)}},p=function(){this.on("promise:resolved",function(e){this.trigger("success",{detail:e.detail})},this),this.on("promise:failed",function(e){this.trigger("error",{detail:e.detail})},this)},v=function(){},m=function(e,t,r,n){var i,s;if(r)try{i=r(n.detail)}catch(o){s=o}else i=n.detail;i instanceof p?i.then(function(e){t.resolve(e)},function(e){t.reject(e)}):r&&i?t.resolve(i):s?t.reject(s):t[e](i)};p.prototype={then:function(e,t){var r=new p;return this.isResolved&&n.async(function(){m("resolve",r,e,{detail:this.resolvedValue})},this),this.isRejected&&n.async(function(){m("reject",r,t,{detail:this.rejectedValue})},this),this.on("promise:resolved",function(t){m("resolve",r,e,t)}),this.on("promise:failed",function(e){m("reject",r,t,e)}),r},resolve:function(e){t(this,e),this.resolve=v,this.reject=v},reject:function(e){r(this,e),this.resolve=v,this.reject=v}},h.mixin(p.prototype),n={async:i,Promise:p,Event:l,EventTarget:h},e.RSVP=n})(window),function(e,t){"use strict";RSVP.all=function(e){var t,r=[],n=new RSVP.Promise,i=e.length,s=function(e){return function(t){o(e,t)}},o=function(e,t){r[e]=t,0===--i&&n.resolve(r)},a=function(e){n.reject(e)};for(t=0;i>t;t++)e[t].then(s(t),a);return n};var r=t.head||t.getElementsByTagName("head")[0],n="basket-",i=5e3,s=function(e,t){try{return localStorage.setItem(n+e,JSON.stringify(t)),!0}catch(r){if(r.name.toUpperCase().indexOf("QUOTA")>=0){var i,o=[];for(i in localStorage)0===i.indexOf(n)&&o.push(JSON.parse(localStorage[i]));if(o.length)return o.sort(function(e,t){return e.stamp-t.stamp}),basket.remove(o[0].key),s(e,t);return}return}},o=function(e){var t=new XMLHttpRequest,r=new RSVP.Promise;return t.open("GET",e),t.onreadystatechange=function(){4===t.readyState&&(200===t.status?r.resolve(t.responseText):r.reject(Error(t.statusText)))},t.send(),r},a=function(e){return o(e.url).then(function(t){var r=c(e,t);return s(e.key,r),t})},u=function(e){var n=t.createElement("script");n.defer=!0,n.text=e,r.appendChild(n)},c=function(e,t){var r=+new Date;return e.data=t,e.stamp=r,e.expire=r+1e3*60*60*(e.expire||i),e},l=function(e){var t,r;return e.url?(e.key=e.key||e.url,t=basket.get(e.key),e.execute=e.execute!==!1,!t||0>t.expire-+new Date||e.unique!==t.unique?(e.unique&&(e.url+=(e.url.indexOf("?")>0?"&":"?")+"basket-unique="+e.unique),r=a(e)):(r=new RSVP.Promise,r.resolve(t.data)),e.execute?r.then(u):r):void 0};e.basket={require:function(){var e,t,r=[];for(e=0,t=arguments.length;t>e;e++)r.push(l(arguments[e]));return RSVP.all(r)},remove:function(e){return localStorage.removeItem(n+e),this},get:function(e){var t=localStorage.getItem(n+e);try{return JSON.parse(t||"false")}catch(r){return!1}},clear:function(e){var t,r,i=+new Date;for(t in localStorage)r=t.split(n)[1],r&&(!e||i>=this.get(r).expire)&&this.remove(r);return this}},basket.clear(!0)}(this,document);(function(e){var t,r=document.getElementById("main-script");t=r.dataset?r.dataset.base:r.getAttribute("data-base");e.buildTime=1377598103635;basket.require({url:t+"/js/vendor.js",unique:e.buildTime}).then(function(){basket.require({url:t+"/js/template.js",unique:e.buildTime},{url:t+"/js/card.js",unique:e.buildTime},{url:t+"/js/app.js",unique:e.buildTime}).then(function(){require(["backbone","backbone.marionette","app","js/cache","js/router/router","js/router/controller","json!cards/cards.json"],function(e,t,r,n,i,s,o){t.TemplateCache.prototype.loadTemplate=function(e){return require(e)};new i({controller:new s({cards:o})},o);e.history.start();var a=$("#main-script"),u=a.data("mtapi");n.set("app","staticPath",a.data("base"));r.start({cards:o,mtApiCGIPath:u})})})})})(this);