/*
 RequireJS 2.1.9 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/

var requirejs,require,define;!function(Z){function H(e){return"[object Function]"===L.call(e)}function I(e){return"[object Array]"===L.call(e)}function y(e,t){if(e){var i;for(i=0;i<e.length&&(!e[i]||!t(e[i],i,e));i+=1);}}function M(e,t){if(e){var i;for(i=e.length-1;i>-1&&(!e[i]||!t(e[i],i,e));i-=1);}}function t(e,t){return ga.call(e,t)}function l(e,i){return t(e,i)&&e[i]}function F(e,i){for(var s in e)if(t(e,s)&&i(e[s],s))break}function Q(e,i,s,n){i&&F(i,function(i,r){(s||!t(e,r))&&(n&&"string"!=typeof i?(e[r]||(e[r]={}),Q(e[r],i,s,n)):e[r]=i)});return e}function u(e,t){return function(){return t.apply(e,arguments)}}function aa(e){throw e}function ba(e){if(!e)return e;var t=Z;y(e.split("."),function(e){t=t[e]});return t}function A(e,t,i,s){t=Error(t+"\nhttp://requirejs.org/docs/errors.html#"+e);t.requireType=e;t.requireModules=s;i&&(t.originalError=i);return t}function ha(e){function i(e,t,i){var s,n,r,a,o,c,d,h=t&&t.split("/");s=h;var u=S.map,p=u&&u["*"];if(e&&"."===e.charAt(0))if(t){s=l(S.pkgs,t)?h=[t]:h.slice(0,h.length-1);t=e=s.concat(e.split("/"));for(s=0;t[s];s+=1)if(n=t[s],"."===n)t.splice(s,1),s-=1;else if(".."===n){if(1===s&&(".."===t[2]||".."===t[0]))break;s>0&&(t.splice(s-1,2),s-=2)}s=l(S.pkgs,t=e[0]);e=e.join("/");s&&e===t+"/"+s.main&&(e=t)}else 0===e.indexOf("./")&&(e=e.substring(2));if(i&&u&&(h||p)){t=e.split("/");for(s=t.length;s>0;s-=1){r=t.slice(0,s).join("/");if(h)for(n=h.length;n>0;n-=1)if((i=l(u,h.slice(0,n).join("/")))&&(i=l(i,r))){a=i;o=s;break}if(a)break;!c&&p&&l(p,r)&&(c=l(p,r),d=s)}!a&&c&&(a=c,o=d);a&&(t.splice(0,o,a),e=t.join("/"))}return e}function s(e){z&&y(document.getElementsByTagName("script"),function(t){return t.getAttribute("data-requiremodule")===e&&t.getAttribute("data-requirecontext")===x.contextName?(t.parentNode.removeChild(t),!0):void 0})}function n(e){var t=l(S.paths,e);return t&&I(t)&&1<t.length?(t.shift(),x.require.undef(e),x.require([e]),!0):void 0}function r(e){var t,i=e?e.indexOf("!"):-1;i>-1&&(t=e.substring(0,i),e=e.substring(i+1,e.length));return[t,e]}function a(e,t,s,n){var a,o,c=null,d=t?t.name:null,h=e,u=!0,p="";e||(u=!1,e="_@r"+(M+=1));e=r(e);c=e[0];e=e[1];c&&(c=i(c,d,n),o=l(B,c));e&&(c?p=o&&o.normalize?o.normalize(e,function(e){return i(e,d,n)}):i(e,d,n):(p=i(e,d,n),e=r(p),c=e[0],p=e[1],s=!0,a=x.nameToUrl(p)));s=!c||o||s?"":"_unnormalized"+(q+=1);return{prefix:c,name:p,parentMap:t,unnormalized:!!s,url:a,originalName:h,isDefine:u,id:(c?c+"!"+p:p)+s}}function o(e){var t=e.id,i=l(E,t);i||(i=E[t]=new x.Module(e));return i}function c(e,i,s){var n=e.id,r=l(E,n);!t(B,n)||r&&!r.defineEmitComplete?(r=o(e),r.error&&"error"===i?s(r.error):r.on(i,s)):"defined"===i&&s(B[n])}function d(e,t){var i=e.requireModules,s=!1;t?t(e):(y(i,function(t){(t=l(E,t))&&(t.error=e,t.events.error&&(s=!0,t.emit("error",e)))}),s)||j.onError(e)}function h(){R.length&&(ia.apply(T,[T.length-1,0].concat(R)),R=[])}function p(e){delete E[e];delete D[e]}function f(e,t,i){var s=e.map.id;e.error?e.emit("error",e.error):(t[s]=!0,y(e.depMaps,function(s,n){var r=s.id,a=l(E,r);a&&!e.depMatched[n]&&!i[r]&&(l(t,r)?(e.defineDep(n,B[r]),e.check()):f(a,t,i))}),i[s]=!0)}function m(){var e,t,i,r,a=(i=1e3*S.waitSeconds)&&x.startTime+i<(new Date).getTime(),o=[],l=[],c=!1,h=!0;if(!_){_=!0;F(D,function(i){e=i.map;t=e.id;if(i.enabled&&(e.isDefine||l.push(i),!i.error))if(!i.inited&&a)n(t)?c=r=!0:(o.push(t),s(t));else if(!i.inited&&i.fetched&&e.isDefine&&(c=!0,!e.prefix))return h=!1});if(a&&o.length)return i=A("timeout","Load timeout for modules: "+o,null,o),i.contextName=x.contextName,d(i);h&&y(l,function(e){f(e,{},{})});a&&!r||!c||!z&&!da||C||(C=setTimeout(function(){C=0;m()},50));_=!1}}function v(e){t(B,e[0])||o(a(e[0],null,!0)).init(e[1],e[2])}function g(e){var e=e.currentTarget||e.srcElement,t=x.onScriptLoad;e.detachEvent&&!W?e.detachEvent("onreadystatechange",t):e.removeEventListener("load",t,!1);t=x.onScriptError;(!e.detachEvent||W)&&e.removeEventListener("error",t,!1);return{node:e,id:e&&e.getAttribute("data-requiremodule")}}function b(){var e;for(h();T.length;){e=T.shift();if(null===e[0])return d(A("mismatch","Mismatched anonymous define() module: "+e[e.length-1]));v(e)}}var _,w,x,k,C,S={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{},config:{}},E={},D={},$={},T=[],B={},N={},M=1,q=1;k={require:function(e){return e.require?e.require:e.require=x.makeRequire(e.map)},exports:function(e){e.usingExports=!0;return e.map.isDefine?e.exports?e.exports:e.exports=B[e.map.id]={}:void 0},module:function(e){return e.module?e.module:e.module={id:e.map.id,uri:e.map.url,config:function(){var t=l(S.pkgs,e.map.id);return(t?l(S.config,e.map.id+"/"+t.main):l(S.config,e.map.id))||{}},exports:B[e.map.id]}}};w=function(e){this.events=l($,e.id)||{};this.map=e;this.shim=l(S.shim,e.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};w.prototype={init:function(e,t,i,s){s=s||{};if(!this.inited){this.factory=t;i?this.on("error",i):this.events.error&&(i=u(this,function(e){this.emit("error",e)}));this.depMaps=e&&e.slice(0);this.errback=i;this.inited=!0;this.ignore=s.ignore;s.enabled||this.enabled?this.enable():this.check()}},defineDep:function(e,t){this.depMatched[e]||(this.depMatched[e]=!0,this.depCount-=1,this.depExports[e]=t)},fetch:function(){if(!this.fetched){this.fetched=!0;x.startTime=(new Date).getTime();var e=this.map;if(!this.shim)return e.prefix?this.callPlugin():this.load();x.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],u(this,function(){return e.prefix?this.callPlugin():this.load()}))}},load:function(){var e=this.map.url;N[e]||(N[e]=!0,x.load(this.map.id,e))},check:function(){if(this.enabled&&!this.enabling){var e,t,i=this.map.id;t=this.depExports;var s=this.exports,n=this.factory;if(this.inited){if(this.error)this.emit("error",this.error);else if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(H(n)){if(this.events.error&&this.map.isDefine||j.onError!==aa)try{s=x.execCb(i,n,t,s)}catch(r){e=r}else s=x.execCb(i,n,t,s);this.map.isDefine&&((t=this.module)&&void 0!==t.exports&&t.exports!==this.exports?s=t.exports:void 0===s&&this.usingExports&&(s=this.exports));if(e)return e.requireMap=this.map,e.requireModules=this.map.isDefine?[this.map.id]:null,e.requireType=this.map.isDefine?"define":"require",d(this.error=e)}else s=n;this.exports=s;this.map.isDefine&&!this.ignore&&(B[i]=s,j.onResourceLoad)&&j.onResourceLoad(x,this.map,this.depMaps);p(i);this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else this.fetch()}},callPlugin:function(){var e=this.map,s=e.id,n=a(e.prefix);this.depMaps.push(n);c(n,"defined",u(this,function(n){var r,h;h=this.map.name;var f=this.map.parentMap?this.map.parentMap.name:null,m=x.makeRequire(e.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){if(n.normalize&&(h=n.normalize(h,function(e){return i(e,f,!0)})||""),n=a(e.prefix+"!"+h,this.map.parentMap),c(n,"defined",u(this,function(e){this.init([],function(){return e},null,{enabled:!0,ignore:!0})})),h=l(E,n.id)){this.depMaps.push(n);this.events.error&&h.on("error",u(this,function(e){this.emit("error",e)}));h.enable()}}else r=u(this,function(e){this.init([],function(){return e},null,{enabled:!0})}),r.error=u(this,function(e){this.inited=!0;this.error=e;e.requireModules=[s];F(E,function(e){0===e.map.id.indexOf(s+"_unnormalized")&&p(e.map.id)});d(e)}),r.fromText=u(this,function(i,n){var l=e.name,c=a(l),h=O;n&&(i=n);h&&(O=!1);o(c);t(S.config,s)&&(S.config[l]=S.config[s]);try{j.exec(i)}catch(u){return d(A("fromtexteval","fromText eval for "+s+" failed: "+u,u,[s]))}h&&(O=!0);this.depMaps.push(c);x.completeLoad(l);m([l],r)}),n.load(e.name,m,r,S)}));x.enable(n,this);this.pluginMaps[n.id]=n},enable:function(){D[this.map.id]=this;this.enabling=this.enabled=!0;y(this.depMaps,u(this,function(e,i){var s,n;if("string"==typeof e){e=a(e,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[i]=e;if(s=l(k,e.id)){this.depExports[i]=s(this);return}this.depCount+=1;c(e,"defined",u(this,function(e){this.defineDep(i,e);this.check()}));this.errback&&c(e,"error",u(this,this.errback))}s=e.id;n=E[s];!t(k,s)&&n&&!n.enabled&&x.enable(e,this)}));F(this.pluginMaps,u(this,function(e){var t=l(E,e.id);t&&!t.enabled&&x.enable(e,this)}));this.enabling=!1;this.check()},on:function(e,t){var i=this.events[e];i||(i=this.events[e]=[]);i.push(t)},emit:function(e,t){y(this.events[e],function(e){e(t)});"error"===e&&delete this.events[e]}};x={config:S,contextName:e,registry:E,defined:B,urlFetched:N,defQueue:T,Module:w,makeModuleMap:a,nextTick:j.nextTick,onError:d,configure:function(e){e.baseUrl&&"/"!==e.baseUrl.charAt(e.baseUrl.length-1)&&(e.baseUrl+="/");var t=S.pkgs,i=S.shim,s={paths:!0,config:!0,map:!0};F(e,function(e,t){s[t]?"map"===t?(S.map||(S.map={}),Q(S[t],e,!0,!0)):Q(S[t],e,!0):S[t]=e});e.shim&&(F(e.shim,function(e,t){I(e)&&(e={deps:e});!e.exports&&!e.init||e.exportsFn||(e.exportsFn=x.makeShimExports(e));i[t]=e}),S.shim=i);e.packages&&(y(e.packages,function(e){e="string"==typeof e?{name:e}:e;t[e.name]={name:e.name,location:e.location||e.name,main:(e.main||"main").replace(ja,"").replace(ea,"")}}),S.pkgs=t);F(E,function(e,t){!e.inited&&!e.map.unnormalized&&(e.map=a(t))});(e.deps||e.callback)&&x.require(e.deps||[],e.callback)},makeShimExports:function(e){return function(){var t;e.init&&(t=e.init.apply(Z,arguments));return t||e.exports&&ba(e.exports)}},makeRequire:function(n,r){function c(i,s,l){var h,u;r.enableBuildCallback&&s&&H(s)&&(s.__requireJsBuild=!0);if("string"==typeof i){if(H(s))return d(A("requireargs","Invalid require call"),l);if(n&&t(k,i))return k[i](E[n.id]);if(j.get)return j.get(x,i,n,c);h=a(i,n,!1,!0);h=h.id;return t(B,h)?B[h]:d(A("notloaded",'Module name "'+h+'" has not been loaded yet for context: '+e+(n?"":". Use require([])")))}b();x.nextTick(function(){b();u=o(a(null,n));u.skipMap=r.skipMap;u.init(i,s,l,{enabled:!0});m()});return c}r=r||{};Q(c,{isBrowser:z,toUrl:function(e){var t,s=e.lastIndexOf("."),r=e.split("/")[0];-1!==s&&("."!==r&&".."!==r||s>1)&&(t=e.substring(s,e.length),e=e.substring(0,s));return x.nameToUrl(i(e,n&&n.id,!0),t,!0)},defined:function(e){return t(B,a(e,n,!1,!0).id)},specified:function(e){e=a(e,n,!1,!0).id;return t(B,e)||t(E,e)}});n||(c.undef=function(e){h();var t=a(e,n,!0),i=l(E,e);s(e);delete B[e];delete N[t.url];delete $[e];i&&(i.events.defined&&($[e]=i.events),p(e))});return c},enable:function(e){l(E,e.id)&&o(e).enable()},completeLoad:function(e){var i,s,r=l(S.shim,e)||{},a=r.exports;for(h();T.length;){s=T.shift();if(null===s[0]){s[0]=e;if(i)break;i=!0}else s[0]===e&&(i=!0);v(s)}s=l(E,e);if(!i&&!t(B,e)&&s&&!s.inited){if(S.enforceDefine&&(!a||!ba(a)))return n(e)?void 0:d(A("nodefine","No define call for "+e,null,[e]));v([e,r.deps||[],r.exportsFn])}m()},nameToUrl:function(e,t,i){var s,n,r,a,o,c;if(j.jsExtRegExp.test(e))a=e+(t||"");else{s=S.paths;n=S.pkgs;a=e.split("/");for(o=a.length;o>0;o-=1){if(c=a.slice(0,o).join("/"),r=l(n,c),c=l(s,c)){I(c)&&(c=c[0]);a.splice(0,o,c);break}if(r){e=e===r.name?r.location+"/"+r.main:r.location;a.splice(0,o,e);break}}a=a.join("/");a+=t||(/^data\:|\?/.test(a)||i?"":".js");a=("/"===a.charAt(0)||a.match(/^[\w\+\.\-]+:/)?"":S.baseUrl)+a}return S.urlArgs?a+((-1===a.indexOf("?")?"?":"&")+S.urlArgs):a},load:function(e,t){j.load(x,e,t)},execCb:function(e,t,i,s){return t.apply(s,i)},onScriptLoad:function(e){("load"===e.type||ka.test((e.currentTarget||e.srcElement).readyState))&&(P=null,e=g(e),x.completeLoad(e.id))},onScriptError:function(e){var t=g(e);return n(t.id)?void 0:d(A("scripterror","Script error for: "+t.id,e,[t.id]))}};x.require=x.makeRequire();return x}var j,w,x,C,J,D,P,K,q,fa,la=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,ma=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,ea=/\.js$/,ja=/^\.\//;w=Object.prototype;var L=w.toString,ga=w.hasOwnProperty,ia=Array.prototype.splice,z=!("undefined"==typeof window||"undefined"==typeof navigator||!window.document),da=!z&&"undefined"!=typeof importScripts,ka=z&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,W="undefined"!=typeof opera&&"[object Opera]"==""+opera,E={},s={},R=[],O=!1;if(void 0===define){if(void 0!==requirejs){if(H(requirejs))return;s=requirejs;requirejs=void 0}void 0!==require&&!H(require)&&(s=require,require=void 0);j=requirejs=function(e,t,i,s){var n,r="_";!I(e)&&"string"!=typeof e&&(n=e,I(t)?(e=t,t=i,i=s):e=[]);n&&n.context&&(r=n.context);(s=l(E,r))||(s=E[r]=j.s.newContext(r));n&&s.configure(n);return s.require(e,t,i)};j.config=function(e){return j(e)};j.nextTick="undefined"!=typeof setTimeout?function(e){setTimeout(e,4)}:function(e){e()};require||(require=j);j.version="2.1.9";j.jsExtRegExp=/^\/|:|\?|\.js$/;j.isBrowser=z;w=j.s={contexts:E,newContext:ha};j({});y(["toUrl","undef","defined","specified"],function(e){j[e]=function(){var t=E._;return t.require[e].apply(t,arguments)}});z&&(x=w.head=document.getElementsByTagName("head")[0],C=document.getElementsByTagName("base")[0])&&(x=w.head=C.parentNode);j.onError=aa;j.createNode=function(e){var t=e.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");t.type=e.scriptType||"text/javascript";t.charset="utf-8";t.async=!0;return t};j.load=function(e,t,i){var s=e&&e.config||{};if(z)return s=j.createNode(s,t,i),s.setAttribute("data-requirecontext",e.contextName),s.setAttribute("data-requiremodule",t),!s.attachEvent||s.attachEvent.toString&&0>(""+s.attachEvent).indexOf("[native code")||W?(s.addEventListener("load",e.onScriptLoad,!1),s.addEventListener("error",e.onScriptError,!1)):(O=!0,s.attachEvent("onreadystatechange",e.onScriptLoad)),s.src=i,K=s,C?x.insertBefore(s,C):x.appendChild(s),K=null,s;if(da)try{importScripts(i),e.completeLoad(t)}catch(n){e.onError(A("importscripts","importScripts failed for "+t+" at "+i,n,[t]))}};z&&!s.skipDataMain&&M(document.getElementsByTagName("script"),function(e){x||(x=e.parentNode);return(J=e.getAttribute("data-main"))?(q=J,s.baseUrl||(D=q.split("/"),q=D.pop(),fa=D.length?D.join("/")+"/":"./",s.baseUrl=fa),q=q.replace(ea,""),j.jsExtRegExp.test(q)&&(q=J),s.deps=s.deps?s.deps.concat(q):[q],!0):void 0});define=function(e,t,i){var s,n;"string"!=typeof e&&(i=t,t=e,e=null);I(t)||(i=t,t=null);!t&&H(i)&&(t=[],i.length&&((""+i).replace(la,"").replace(ma,function(e,i){t.push(i)}),t=(1===i.length?["require"]:["require","exports","module"]).concat(t)));if(O){(s=K)||(P&&"interactive"===P.readyState||M(document.getElementsByTagName("script"),function(e){return"interactive"===e.readyState?P=e:void 0}),s=P);s&&(e||(e=s.getAttribute("data-requiremodule")),n=E[s.getAttribute("data-requirecontext")])}(n?n.defQueue:R).push([e,t,i])};define.amd={jQuery:!0};j.exec=function(b){return eval(b)};j(s)}}(this);
var el=document.getElementById("init-script"),libPath=el&&(el.dataset?el.dataset.base:el.getAttribute("data-base"))||".";require.config({baseUrl:libPath,hbs:{disableI18n:!0,disableHelpers:!1,templateExtension:"hbs",compileOptions:{}}});
define("js/cards",[],function(){var e=[],t=[],i={add:function(t,i){t="[object Array]"===Object.prototype.toString.call(t)?t:void 0!==t?[t]:[];for(var s,n,r=t.length,a=[],o=0;r>o;o++){s=t[o];for(var l=e.length,c=!1,d=0;l>d;d++)if(e[d].id===s.id){c=!0;break}if(!c){n={};for(var h in s)n[h]=s[h];n.deployed=!1;e.push(n);a.push(n)}}!i&&"undefined"!=typeof Backbone&&Backbone.Wreqr&&require(["js/vent"],function(e){e.trigger("cards:add",a)});return this},deploy:function(){function i(e,t,s){if(t===s){e.deployed=!0;e.dfd.resolve()}else{var n=e.routes[t];
require(["js/commands"],function(r){r.execute("router:addRoute",e,n,function(){r.execute("app:setCardViewHandler",e,n,function(){i(e,t+1,s)})})})}}var s=$.Deferred();_.each(e,function(e){if(e.id&&!e.deployed&&!e.dfd){e.dfd=$.Deferred();t.push(e.dfd);var s=e.routes?e.routes.length:0;i(e,0,s)}});0===t.length?s.resolve():$.when.apply($,t).done(function(){s.resolve()});return s},getAll:function(){return _.map(e,function(e){return _.clone(e)})},clearAll:function(){e=[];t=[]}};return i});