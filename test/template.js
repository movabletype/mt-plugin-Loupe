
/*
 RequireJS 2.1.5 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
var requirejs,require,define;
(function(aa){function I(b){return"[object Function]"===L.call(b)}function J(b){return"[object Array]"===L.call(b)}function y(b,c){if(b){var d;for(d=0;d<b.length&&(!b[d]||!c(b[d],d,b));d+=1);}}function M(b,c){if(b){var d;for(d=b.length-1;-1<d&&(!b[d]||!c(b[d],d,b));d-=1);}}function s(b,c){return ga.call(b,c)}function m(b,c){return s(b,c)&&b[c]}function G(b,c){for(var d in b)if(s(b,d)&&c(b[d],d))break}function R(b,c,d,m){c&&G(c,function(c,j){if(d||!s(b,j))m&&"string"!==typeof c?(b[j]||(b[j]={}),R(b[j],
c,d,m)):b[j]=c});return b}function u(b,c){return function(){return c.apply(b,arguments)}}function ba(b){if(!b)return b;var c=aa;y(b.split("."),function(b){c=c[b]});return c}function B(b,c,d,m){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=m;d&&(c.originalError=d);return c}function ha(b){function c(a,f,b){var e,n,c,g,d,S,i,h=f&&f.split("/");e=h;var j=k.map,l=j&&j["*"];if(a&&"."===a.charAt(0))if(f){e=m(k.pkgs,f)?h=[f]:h.slice(0,h.length-1);f=a=e.concat(a.split("/"));
for(e=0;f[e];e+=1)if(n=f[e],"."===n)f.splice(e,1),e-=1;else if(".."===n)if(1===e&&(".."===f[2]||".."===f[0]))break;else 0<e&&(f.splice(e-1,2),e-=2);e=m(k.pkgs,f=a[0]);a=a.join("/");e&&a===f+"/"+e.main&&(a=f)}else 0===a.indexOf("./")&&(a=a.substring(2));if(b&&j&&(h||l)){f=a.split("/");for(e=f.length;0<e;e-=1){c=f.slice(0,e).join("/");if(h)for(n=h.length;0<n;n-=1)if(b=m(j,h.slice(0,n).join("/")))if(b=m(b,c)){g=b;d=e;break}if(g)break;!S&&(l&&m(l,c))&&(S=m(l,c),i=e)}!g&&S&&(g=S,d=i);g&&(f.splice(0,d,
g),a=f.join("/"))}return a}function d(a){A&&y(document.getElementsByTagName("script"),function(f){if(f.getAttribute("data-requiremodule")===a&&f.getAttribute("data-requirecontext")===i.contextName)return f.parentNode.removeChild(f),!0})}function z(a){var f=m(k.paths,a);if(f&&J(f)&&1<f.length)return d(a),f.shift(),i.require.undef(a),i.require([a]),!0}function h(a){var f,b=a?a.indexOf("!"):-1;-1<b&&(f=a.substring(0,b),a=a.substring(b+1,a.length));return[f,a]}function j(a,f,b,e){var n,C,g=null,d=f?f.name:
null,j=a,l=!0,k="";a||(l=!1,a="_@r"+(M+=1));a=h(a);g=a[0];a=a[1];g&&(g=c(g,d,e),C=m(q,g));a&&(g?k=C&&C.normalize?C.normalize(a,function(a){return c(a,d,e)}):c(a,d,e):(k=c(a,d,e),a=h(k),g=a[0],k=a[1],b=!0,n=i.nameToUrl(k)));b=g&&!C&&!b?"_unnormalized"+(Q+=1):"";return{prefix:g,name:k,parentMap:f,unnormalized:!!b,url:n,originalName:j,isDefine:l,id:(g?g+"!"+k:k)+b}}function r(a){var f=a.id,b=m(p,f);b||(b=p[f]=new i.Module(a));return b}function t(a,f,b){var e=a.id,n=m(p,e);if(s(q,e)&&(!n||n.defineEmitComplete))"defined"===
f&&b(q[e]);else r(a).on(f,b)}function v(a,f){var b=a.requireModules,e=!1;if(f)f(a);else if(y(b,function(f){if(f=m(p,f))f.error=a,f.events.error&&(e=!0,f.emit("error",a))}),!e)l.onError(a)}function w(){T.length&&(ia.apply(H,[H.length-1,0].concat(T)),T=[])}function x(a){delete p[a];delete V[a]}function F(a,f,b){var e=a.map.id;a.error?a.emit("error",a.error):(f[e]=!0,y(a.depMaps,function(e,c){var g=e.id,d=m(p,g);d&&(!a.depMatched[c]&&!b[g])&&(m(f,g)?(a.defineDep(c,q[g]),a.check()):F(d,f,b))}),b[e]=!0)}
function D(){var a,f,b,e,n=(b=1E3*k.waitSeconds)&&i.startTime+b<(new Date).getTime(),c=[],g=[],h=!1,j=!0;if(!W){W=!0;G(V,function(b){a=b.map;f=a.id;if(b.enabled&&(a.isDefine||g.push(b),!b.error))if(!b.inited&&n)z(f)?h=e=!0:(c.push(f),d(f));else if(!b.inited&&(b.fetched&&a.isDefine)&&(h=!0,!a.prefix))return j=!1});if(n&&c.length)return b=B("timeout","Load timeout for modules: "+c,null,c),b.contextName=i.contextName,v(b);j&&y(g,function(a){F(a,{},{})});if((!n||e)&&h)if((A||da)&&!X)X=setTimeout(function(){X=
0;D()},50);W=!1}}function E(a){s(q,a[0])||r(j(a[0],null,!0)).init(a[1],a[2])}function K(a){var a=a.currentTarget||a.srcElement,b=i.onScriptLoad;a.detachEvent&&!Y?a.detachEvent("onreadystatechange",b):a.removeEventListener("load",b,!1);b=i.onScriptError;(!a.detachEvent||Y)&&a.removeEventListener("error",b,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}function L(){var a;for(w();H.length;){a=H.shift();if(null===a[0])return v(B("mismatch","Mismatched anonymous define() module: "+a[a.length-
1]));E(a)}}var W,Z,i,N,X,k={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{},config:{}},p={},V={},$={},H=[],q={},U={},M=1,Q=1;N={require:function(a){return a.require?a.require:a.require=i.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?a.exports:a.exports=q[a.map.id]={}},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return k.config&&m(k.config,a.map.id)||{}},exports:q[a.map.id]}}};Z=function(a){this.events=
m($,a.id)||{};this.map=a;this.shim=m(k.shim,a.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};Z.prototype={init:function(a,b,c,e){e=e||{};if(!this.inited){this.factory=b;if(c)this.on("error",c);else this.events.error&&(c=u(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.errback=c;this.inited=!0;this.ignore=e.ignore;e.enabled||this.enabled?this.enable():this.check()}},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=
!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0;i.startTime=(new Date).getTime();var a=this.map;if(this.shim)i.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],u(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=this.map.url;U[a]||(U[a]=!0,i.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id;b=this.depExports;
var e=this.exports,n=this.factory;if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(I(n)){if(this.events.error)try{e=i.execCb(c,n,b,e)}catch(d){a=d}else e=i.execCb(c,n,b,e);this.map.isDefine&&((b=this.module)&&void 0!==b.exports&&b.exports!==this.exports?e=b.exports:void 0===e&&this.usingExports&&(e=this.exports));if(a)return a.requireMap=this.map,a.requireModules=[this.map.id],a.requireType="define",v(this.error=
a)}else e=n;this.exports=e;if(this.map.isDefine&&!this.ignore&&(q[c]=e,l.onResourceLoad))l.onResourceLoad(i,this.map,this.depMaps);x(c);this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else this.fetch()}},callPlugin:function(){var a=this.map,b=a.id,d=j(a.prefix);this.depMaps.push(d);t(d,"defined",u(this,function(e){var n,d;d=this.map.name;var g=this.map.parentMap?this.map.parentMap.name:null,h=
i.makeRequire(a.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){if(e.normalize&&(d=e.normalize(d,function(a){return c(a,g,!0)})||""),e=j(a.prefix+"!"+d,this.map.parentMap),t(e,"defined",u(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),d=m(p,e.id)){this.depMaps.push(e);if(this.events.error)d.on("error",u(this,function(a){this.emit("error",a)}));d.enable()}}else n=u(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),n.error=u(this,
function(a){this.inited=!0;this.error=a;a.requireModules=[b];G(p,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&x(a.map.id)});v(a)}),n.fromText=u(this,function(e,c){var d=a.name,g=j(d),C=O;c&&(e=c);C&&(O=!1);r(g);s(k.config,b)&&(k.config[d]=k.config[b]);try{l.exec(e)}catch(ca){return v(B("fromtexteval","fromText eval for "+b+" failed: "+ca,ca,[b]))}C&&(O=!0);this.depMaps.push(g);i.completeLoad(d);h([d],n)}),e.load(a.name,h,n,k)}));i.enable(d,this);this.pluginMaps[d.id]=d},enable:function(){V[this.map.id]=
this;this.enabling=this.enabled=!0;y(this.depMaps,u(this,function(a,b){var c,e;if("string"===typeof a){a=j(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=m(N,a.id)){this.depExports[b]=c(this);return}this.depCount+=1;t(a,"defined",u(this,function(a){this.defineDep(b,a);this.check()}));this.errback&&t(a,"error",this.errback)}c=a.id;e=p[c];!s(N,c)&&(e&&!e.enabled)&&i.enable(a,this)}));G(this.pluginMaps,u(this,function(a){var b=m(p,a.id);b&&!b.enabled&&i.enable(a,
this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){y(this.events[a],function(a){a(b)});"error"===a&&delete this.events[a]}};i={config:k,contextName:b,registry:p,defined:q,urlFetched:U,defQueue:H,Module:Z,makeModuleMap:j,nextTick:l.nextTick,onError:v,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=k.pkgs,c=k.shim,e={paths:!0,config:!0,map:!0};G(a,function(a,b){e[b]?
"map"===b?(k.map||(k.map={}),R(k[b],a,!0,!0)):R(k[b],a,!0):k[b]=a});a.shim&&(G(a.shim,function(a,b){J(a)&&(a={deps:a});if((a.exports||a.init)&&!a.exportsFn)a.exportsFn=i.makeShimExports(a);c[b]=a}),k.shim=c);a.packages&&(y(a.packages,function(a){a="string"===typeof a?{name:a}:a;b[a.name]={name:a.name,location:a.location||a.name,main:(a.main||"main").replace(ja,"").replace(ea,"")}}),k.pkgs=b);G(p,function(a,b){!a.inited&&!a.map.unnormalized&&(a.map=j(b))});if(a.deps||a.callback)i.require(a.deps||[],
a.callback)},makeShimExports:function(a){return function(){var b;a.init&&(b=a.init.apply(aa,arguments));return b||a.exports&&ba(a.exports)}},makeRequire:function(a,f){function d(e,c,h){var g,k;f.enableBuildCallback&&(c&&I(c))&&(c.__requireJsBuild=!0);if("string"===typeof e){if(I(c))return v(B("requireargs","Invalid require call"),h);if(a&&s(N,e))return N[e](p[a.id]);if(l.get)return l.get(i,e,a,d);g=j(e,a,!1,!0);g=g.id;return!s(q,g)?v(B("notloaded",'Module name "'+g+'" has not been loaded yet for context: '+
b+(a?"":". Use require([])"))):q[g]}L();i.nextTick(function(){L();k=r(j(null,a));k.skipMap=f.skipMap;k.init(e,c,h,{enabled:!0});D()});return d}f=f||{};R(d,{isBrowser:A,toUrl:function(b){var d,f=b.lastIndexOf("."),g=b.split("/")[0];if(-1!==f&&(!("."===g||".."===g)||1<f))d=b.substring(f,b.length),b=b.substring(0,f);return i.nameToUrl(c(b,a&&a.id,!0),d,!0)},defined:function(b){return s(q,j(b,a,!1,!0).id)},specified:function(b){b=j(b,a,!1,!0).id;return s(q,b)||s(p,b)}});a||(d.undef=function(b){w();var c=
j(b,a,!0),d=m(p,b);delete q[b];delete U[c.url];delete $[b];d&&(d.events.defined&&($[b]=d.events),x(b))});return d},enable:function(a){m(p,a.id)&&r(a).enable()},completeLoad:function(a){var b,c,e=m(k.shim,a)||{},d=e.exports;for(w();H.length;){c=H.shift();if(null===c[0]){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);E(c)}c=m(p,a);if(!b&&!s(q,a)&&c&&!c.inited){if(k.enforceDefine&&(!d||!ba(d)))return z(a)?void 0:v(B("nodefine","No define call for "+a,null,[a]));E([a,e.deps||[],e.exportsFn])}D()},nameToUrl:function(a,
b,c){var e,d,h,g,j,i;if(l.jsExtRegExp.test(a))g=a+(b||"");else{e=k.paths;d=k.pkgs;g=a.split("/");for(j=g.length;0<j;j-=1)if(i=g.slice(0,j).join("/"),h=m(d,i),i=m(e,i)){J(i)&&(i=i[0]);g.splice(0,j,i);break}else if(h){a=a===h.name?h.location+"/"+h.main:h.location;g.splice(0,j,a);break}g=g.join("/");g+=b||(/\?/.test(g)||c?"":".js");g=("/"===g.charAt(0)||g.match(/^[\w\+\.\-]+:/)?"":k.baseUrl)+g}return k.urlArgs?g+((-1===g.indexOf("?")?"?":"&")+k.urlArgs):g},load:function(a,b){l.load(i,a,b)},execCb:function(a,
b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if("load"===a.type||ka.test((a.currentTarget||a.srcElement).readyState))P=null,a=K(a),i.completeLoad(a.id)},onScriptError:function(a){var b=K(a);if(!z(b.id))return v(B("scripterror","Script error",a,[b.id]))}};i.require=i.makeRequire();return i}var l,w,x,D,t,E,P,K,Q,fa,la=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ma=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,ea=/\.js$/,ja=/^\.\//;w=Object.prototype;var L=w.toString,ga=w.hasOwnProperty,ia=
Array.prototype.splice,A=!!("undefined"!==typeof window&&navigator&&document),da=!A&&"undefined"!==typeof importScripts,ka=A&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,Y="undefined"!==typeof opera&&"[object Opera]"===opera.toString(),F={},r={},T=[],O=!1;if("undefined"===typeof define){if("undefined"!==typeof requirejs){if(I(requirejs))return;r=requirejs;requirejs=void 0}"undefined"!==typeof require&&!I(require)&&(r=require,require=void 0);l=requirejs=function(b,c,d,z){var h,
j="_";!J(b)&&"string"!==typeof b&&(h=b,J(c)?(b=c,c=d,d=z):b=[]);h&&h.context&&(j=h.context);(z=m(F,j))||(z=F[j]=l.s.newContext(j));h&&z.configure(h);return z.require(b,c,d)};l.config=function(b){return l(b)};l.nextTick="undefined"!==typeof setTimeout?function(b){setTimeout(b,4)}:function(b){b()};require||(require=l);l.version="2.1.5";l.jsExtRegExp=/^\/|:|\?|\.js$/;l.isBrowser=A;w=l.s={contexts:F,newContext:ha};l({});y(["toUrl","undef","defined","specified"],function(b){l[b]=function(){var c=F._;return c.require[b].apply(c,
arguments)}});if(A&&(x=w.head=document.getElementsByTagName("head")[0],D=document.getElementsByTagName("base")[0]))x=w.head=D.parentNode;l.onError=function(b){throw b;};l.load=function(b,c,d){var l=b&&b.config||{},h;if(A)return h=l.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script"),h.type=l.scriptType||"text/javascript",h.charset="utf-8",h.async=!0,h.setAttribute("data-requirecontext",b.contextName),h.setAttribute("data-requiremodule",c),
h.attachEvent&&!(h.attachEvent.toString&&0>h.attachEvent.toString().indexOf("[native code"))&&!Y?(O=!0,h.attachEvent("onreadystatechange",b.onScriptLoad)):(h.addEventListener("load",b.onScriptLoad,!1),h.addEventListener("error",b.onScriptError,!1)),h.src=d,K=h,D?x.insertBefore(h,D):x.appendChild(h),K=null,h;if(da)try{importScripts(d),b.completeLoad(c)}catch(j){b.onError(B("importscripts","importScripts failed for "+c+" at "+d,j,[c]))}};A&&M(document.getElementsByTagName("script"),function(b){x||(x=
b.parentNode);if(t=b.getAttribute("data-main"))return r.baseUrl||(E=t.split("/"),Q=E.pop(),fa=E.length?E.join("/")+"/":"./",r.baseUrl=fa,t=Q),t=t.replace(ea,""),r.deps=r.deps?r.deps.concat(t):[t],!0});define=function(b,c,d){var l,h;"string"!==typeof b&&(d=c,c=b,b=null);J(c)||(d=c,c=[]);!c.length&&I(d)&&d.length&&(d.toString().replace(la,"").replace(ma,function(b,d){c.push(d)}),c=(1===d.length?["require"]:["require","exports","module"]).concat(c));if(O){if(!(l=K))P&&"interactive"===P.readyState||M(document.getElementsByTagName("script"),
function(b){if("interactive"===b.readyState)return P=b}),l=P;l&&(b||(b=l.getAttribute("data-requiremodule")),h=F[l.getAttribute("data-requirecontext")])}(h?h.defQueue:T).push([b,c,d])};define.amd={jQuery:!0};l.exec=function(b){return eval(b)};l(r)}})(this);

define("lib/require", function(){});

;
define("js/template", function(){});

/**
 * @license RequireJS text 2.0.5 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, window: false, process: false, Packages: false,
  java: false, location: false */

define('text',['module'], function (module) {
    

    var text, fs,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = [],
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.5',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node)) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback) {
            var file = fs.readFileSync(url, 'utf8');
            //Remove BOM (Byte Mark Order) from utf8 files if it is there.
            if (file.indexOf('\uFEFF') === 0) {
                file = file.substring(1);
            }
            callback(file);
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                stringBuffer.append(line);

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    }

    return text;
});

/** @license
 * RequireJS plugin for loading JSON files
 * - depends on Text plugin and it was HEAVILY "inspired" by it as well.
 * Author: Miller Medeiros
 * Version: 0.3.1 (2013/02/04)
 * Released under the MIT license
 */
define('json',['text'], function(text){

    var CACHE_BUST_QUERY_PARAM = 'bust',
        CACHE_BUST_FLAG = '!bust',
        jsonParse = (typeof JSON !== 'undefined' && typeof JSON.parse === 'function')? JSON.parse : function(val){
            return eval('('+ val +')'); //quick and dirty
        },
        buildMap = {};

    function cacheBust(url){
        url = url.replace(CACHE_BUST_FLAG, '');
        url += (url.indexOf('?') < 0)? '?' : '&';
        return url + CACHE_BUST_QUERY_PARAM +'='+ Math.round(2147483647 * Math.random());
    }

    //API
    return {

        load : function(name, req, onLoad, config) {
            if ( config.isBuild && (config.inlineJSON === false || name.indexOf(CACHE_BUST_QUERY_PARAM +'=') !== -1) ) {
                //avoid inlining cache busted JSON or if inlineJSON:false
                onLoad(null);
            } else {
                text.get(req.toUrl(name), function(data){
                    if (config.isBuild) {
                        buildMap[name] = data;
                        onLoad(data);
                    } else {
                        onLoad(jsonParse(data));
                    }
                },
                    onLoad.error, {
                        accept: 'application/json'
                    }
                );
            }
        },

        normalize : function (name, normalize) {
            //used normalize to avoid caching references to a "cache busted" request
            return (name.indexOf(CACHE_BUST_FLAG) === -1)? name : cacheBust(name);
        },

        //write method based on RequireJS official text plugin by James Burke
        //https://github.com/jrburke/requirejs/blob/master/text.js
        write : function(pluginName, moduleName, write){
            if(moduleName in buildMap){
                var content = buildMap[moduleName];
                write('define("'+ pluginName +'!'+ moduleName +'", function(){ return '+ content +';});\n');
            }
        }

    };
});

define("json!widgets/stats/settings.json", function(){ return {
  "graph": {
    "type": "bar",
    "staticPath": "",
    "labelTemplate": {
      "type":"hbs",
      "template":"assets/mtchart/graph_label"
    },
    "data": "assets/mtchart/graph_data.json",
    "hideTotalCount": false,
    "hideDeltaCount": false,
    "yLength": 1,
    "yLabels": "foo,bar",
    "autoSized": false,
    "lineWidth": 6,
    "pointSize": 6,
    "chartColorsMethod": "shuffle"
  },
  "range": {
    "dataType": "timeline",
    "unit": "monthly",
    "maxLength": 90,
    "length": 10,
    "start": null,
    "end": null
  }
}
;});

define("json!widgets/widgets.json", function(){ return [
{
  "name": "stats",
  "id": "stats",
  "dashboardView": "dashboard",
  "viewView": "view"
}, {
  "name": "acception",
  "id": "acception",
  "dashboardView": "dashboard",
  "viewView": "view"
}, {
  "name": "feedbacks",
  "id": "feedbacks",
  "dashboardView": "dashboard",
  "viewView": "view"
}];});

/* START_TEMPLATE */
define('hbs!js/views/common/template/header',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  foundHelper = helpers.title;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\n";
  return buffer;});
Handlebars.registerPartial('js_views_common_template_header', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!js/views/dashboard/templates/layout',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<header id=\"header\"></header>\n<main id=\"main\" class=\"main\"></main>\n<footer id=\"footer\"></footer>\n";});
Handlebars.registerPartial('js_views_dashboard_templates_layout', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!js/views/dashboard/templates/main',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h1 id=\"blogname\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</h1>\n";
  return buffer;});
Handlebars.registerPartial('js_views_dashboard_templates_main', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!js/views/sidemenu/templates/main',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<section id=\"stats\">\n俺はサイドメニュー\n</section>\n";});
Handlebars.registerPartial('js_views_sidemenu_templates_main', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!js/views/widget/templates/layout',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<header id=\"header\"></header>\n<main id=\"main\" class=\"widget\"></main>\n<footer id=\"footer\"></footer>\n";});
Handlebars.registerPartial('js_views_widget_templates_layout', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!assets/mtchart/graph_label',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<span style=\"font-size:1.5em;\">Today</span><br/>2013年2月27日\n";});
Handlebars.registerPartial('assets_mtchart_graph_label', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!widgets/acception/templates/dashboard',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<header>\n<p id=\"acception-count\">3</p>\n<h1 id=\"acception-label\">承認待ちの記事</h1>\n</header>\n<ul>\n<li><img src=\"widgets/acception/assets/a.jpg\"></li>\n<li><img src=\"widgets/acception/assets/b.jpg\"></li>\n<li><img src=\"widgets/acception/assets/c.jpg\"></li>\n</ul>\n\n";});
Handlebars.registerPartial('widgets_acception_templates_dashboard', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!widgets/acception/templates/view',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<section id=\"accept\">\n俺は承認するページ\n</section>\n";});
Handlebars.registerPartial('widgets_acception_templates_view', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!widgets/feedbacks/templates/dashboard',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<header>\n<p id=\"feedbacks-count\">18</p>\n<h1 id=\"feedbacks-label\">コメント&トラックバック</h1>\n</header>\n";});
Handlebars.registerPartial('widgets_feedbacks_templates_dashboard', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!widgets/feedbacks/templates/view',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "";


  buffer += "<section id=\"feedback\">\n";
  buffer += "ここはフィードバックのページかもしれませんょ";
  buffer += "\n</section>\n";
  return buffer;});
Handlebars.registerPartial('widgets_feedbacks_templates_view', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!widgets/sample/dashboard',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<section class=\"widget\">\n<a href=\"#sample\">ウィジェット的なやつのダッシュボード</a>\n</section>\n";});
Handlebars.registerPartial('widgets_sample_dashboard', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!widgets/sample/view',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<section class=\"widget\">\nウィジェット的なやつのビュー的なの\n</section>\n";});
Handlebars.registerPartial('widgets_sample_view', t);
return t;
});
/* END_TEMPLATE */
;
define('text!widgets/sample2/dashboard.html',[],function () { return '<div class="widget">\nウィジェット的なやつのダッシュボードその2\n</div>\n';});

define('text!widgets/sample2/view.html',[],function () { return '<div class="widget">\nウィジェット的なやつでサンプル2的なの\n</div>\n';});

define('text!widgets/sample3/dashboard.template',[],function () { return '<section class="widget">\nウィジェット的なやつのダッシュボードその3（<strong><%= title %></strong>）\n</section>\n';});

/* START_TEMPLATE */
define('hbs!widgets/sample3/view',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<section class=\"widget\">\n";
  foundHelper = helpers.title;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\nウィジェット的なやつでサンプル3的なの\n</section>\n";
  return buffer;});
Handlebars.registerPartial('widgets_sample3_view', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!widgets/stats/templates/dashboard',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<header>\n<p>";
  foundHelper = helpers.count;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.count; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</p>\n<h1>今日のページビュー</h1>\n</header>\n";
  return buffer;});
Handlebars.registerPartial('widgets_stats_templates_dashboard', t);
return t;
});
/* END_TEMPLATE */
;
/* START_TEMPLATE */
define('hbs!widgets/stats/templates/view',['hbs','handlebars'], function( hbs, Handlebars ){ 
var t = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<section id=\"main-stats\">\n俺はスタッツかもしれない\n</section>\n\n<div id=\"my-graph\"></div>\n";});
Handlebars.registerPartial('widgets_stats_templates_view', t);
return t;
});
/* END_TEMPLATE */
;