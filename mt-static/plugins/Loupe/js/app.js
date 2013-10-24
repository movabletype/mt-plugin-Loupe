define("js/cache",[],function(){var e={};return{get:function(t,i){return e[t]?e[t][i]:null},set:function(t,i,s){e[t]=e[t]||{};e[t][i]=s;return e[t][i]},clear:function(t,i){i?e[t]&&delete e[t][i]:delete e[t]},clearAll:function(){e={}}}});
define("js/device",[],function(){var e=function(){this.getNavigator();this.detectOS();this.detectBrowser();this.generateVersionStr();this.generateBrowserVersionStr();this.touch="ontouchstart"in window};e.prototype.getNavigator=function(){this.ua=navigator.userAgent;this.appName=navigator.appName;this.product=navigator.product};e.prototype.parseVersion=function(e){var t=this.ua.match(e);t=t&&t[1]?parseFloat(t[1].replace("_","."),10)||null:null;return t};e.prototype.detectOS=function(){if(/Android/.test(this.ua)){this.isAndroid=!0;this.platform="android";this.expression=/Android\s*([\.0-9]+)/}else if(/iPhone|iPad|iPod/.test(this.ua)){this.isIOS=!0;this.platform="ios";this.expression=/(?:iPhone|iPad|iPod).*OS\s([_0-9]+)/}else if(/Windows Phone/.test(this.ua)){this.isWindowsPhone=!0;this.platform="windows-phone";this.expression=/Windows Phone\s*(?:OS\s)?([\.0-9]+)/}this.version=this.parseVersion(this.expression)};e.prototype.detectBrowser=function(){if(/Trident/.test(this.ua)){this.isIE=!0;this.browser="ie";this.expressionBrowser=/(?:(?:MSIE|IE)|(?:(?:rv:)))\s*([\.0-9]+)/}else if(/Firefox/.test(this.ua)){this.isFirefox=!0;this.browser="firefox";this.expressionBrowser=/(?:Firefox\/)\s*([\.0-9]+)/}this.browserVersion=this.parseVersion(this.expressionBrowser)};e.prototype.generateVersionStr=function(){var e;if(this.version){e=(""+this.version).split(".");this.versionStr=1===e.length?e.concat(["0"]).join("-"):e.join("-");this.versionShortStr=e[0]}else{this.versionStr="";this.versionShortStr=""}};e.prototype.generateBrowserVersionStr=function(){var e;if(this.browser&&this.browserVersion){e=(""+this.browserVersion).split(".");this.browserVersionStr=e.concat(["0"]).slice(0,2).join("-");this.browserVersionShortStr=e[0]}else{this.browserVersionStr="";this.browserVersionShortStr=""}};e.prototype.options={};e.prototype.options.hammer=function(e){var t={drag:!1,hold:!1,prevent_default:!0,prevent_mouseevents:!0,release:!1,show_touches:!1,stop_browser_behavior:{userSelect:"none",touchAction:"auto",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"},swipe:!1,tap:!0,tap_always:!0,tap_max_distance:10,tap_max_touchtime:1e3,touch:!1,transform:!1};this.touch||(t.prevent_mouseevents=!1);e=_.extend({},t,e);return e};return new e});
define("js/commands",["backbone","backbone.wreqr"],function(e){return new e.Wreqr.Commands});
define("js/vent",["backbone","backbone.wreqr"],function(e){return new e.Wreqr.EventAggregator});
define("js/router/router",["backbone.marionette","js/commands"],function(e,t){var i={"":"moveDashboard",signout:"signout",signin:"signin",_login:"authorizationCallback"};return e.AppRouter.extend({appRoutes:i,initialize:function(e){this.options=e;this.reservedRoutes=_.keys(i);this.setHandlers()},setHandlers:function(){t.setHandlers({"router:addRoute":{context:this,callback:function(e,t,i){this.addRoute(e,t);i&&i()}},"router:navigate":{context:this,callback:function(e){if(null!==e&&void 0!==e){t.execute("app:beforeTransition");this.navigate(e,!0)}}}})},addRoute:function(e,t){var i=t.route?e.id+"/"+t.route:e.id,s="move:cardView:"+e.id+":"+t.id;if(_.contains(this.reservedRoutes,i))console.log('card ID "'+e.id+'" is about to use reserved route, "'+i+'". you must change this route');else{this._getController().addCardViewMethod(e,s);this.appRoute(i,s)}}})});
define("js/l10n",[],function(){var e=function(e){this.libPath=$("#main-script").data("base")||".";this.userLang=e||"en-us";this.lexicon={};this.loadCommon()};e.prototype.get=function(e,t){return this[e]?this[e][t]:null};e.prototype.load=function(e,t){var i=$.Deferred();if(this.userLang&&!this[t]){e="json!"+e+"/"+this.userLang+".json";
require([e],_.bind(function(e){this[t]=e;i.resolve(this)},this),_.bind(function(e){this[t]={};i.resolve(this)},this))}else i.resolve(this);return i};e.prototype.loadCommon=function(){var e=this.loadCommonDfd=$.Deferred(),t=_.bind(function(t){this.common=t;e.resolve(this)},this),i=_.bind(function(){this.userLang="en-us";s()},this),s=_.bind(function(e){void 0!==window.basket&&void 0!==window.buildTime?basket.require({url:this.libPath+"/js/l10n/"+this.userLang+".js",unique:window.buildTime}).then(_.bind(function(){require(["json!l10n/"+this.userLang+".json"],t,e)},this),e):require(["json!l10n/"+this.userLang+".json"],t,e)},this);this.userLang&&!this.common?s(i):e.resolve(this);return e};e.prototype.waitLoadCommon=function(e){this.loadCommonDfd?this.loadCommonDfd.done(e):this.loadCommon().done(e)};return e});
define("js/mtapi",["jquery"],function(e){var t=e("#main-script").data("mtapi"),i=e("#main-script").data("client")||"loupe",s=new MT.DataAPI({baseUrl:t,clientId:i});return{api:s,baseUrl:t}});
define("js/models/perm",["backbone","js/mtapi"],function(e,t){return e.Model.extend({sync:function(e,i,s){if("read"===e){var n=$.Deferred();n.done(s.success);n.fail(s.error);t.api.listPermissionsForUser("me",{blogIds:this.id},function(e){e.error?n.reject(e):n.resolve(e)});return n}}})});
define("js/collections/perms",["backbone","js/models/perm"],function(e,t){return e.Collection.extend({model:t,parse:function(e){return _.map(e,function(e){return{id:e.blog.id,permissions:e.permissions}})}})});
define("js/mtapi/user",["js/mtapi","js/cache","js/models/perm","js/collections/perms"],function(e,t,i,s){return function(){var i=$.Deferred();e.api.getUser("me",function(n){n&&!n.error?e.api.listPermissionsForUser("me",function(e){if(e.error)i.reject(e);else{var r,o=e.items;if(o[0]&&!o[0].blog){r={permissions:o[0].permissions};o=o.slice(1)}else r={permissions:null};n=_.extend({},n,r);var a=t.set("user","perms",new s);a.set(a.parse(o));i.resolve(n)}}):i.reject(n)});return i}});
define("js/mtapi/blogs",["js/mtapi"],function(e){return function(t,i){var s=$.Deferred();e.api.listBlogsForUser(t,i,function(e){e&&!e.error?s.resolve(e):s.reject(e)});return s}});
define("js/mtapi/blog",["js/mtapi"],function(e){return function(t,i){var s=$.Deferred();e.api.getBlog(t,i,function(e){e&&!e.error?s.resolve(e):s.reject(e)});return s}});
define("js/models/blog",["backbone","js/mtapi/blog"],function(e,t){return e.Model.extend({sync:function(e,i,s){if("read"===e){var n=t(this.id,{fields:"id,name,class,url"});n.done(s.success);n.fail(s.error);return n}}})});
define("js/collections/blogs",["backbone","js/mtapi/blogs","js/models/blog"],function(e,t,i){return e.Collection.extend({model:i,parse:function(e){this.totalResults=parseInt(e.totalResults,10);return e.items},sync:function(e,i,s){var n=$.Deferred();n.done(s.success);n.fail(s.error);var r={};void 0!==s.offset&&(r.offset=parseInt(s.offset,10)||0);s.excludeIds&&(r.excludeIds=s.excludeIds);s.limit&&(r.limit=parseInt(s.limit,10)||25);r.fields="id,name,class,url";var o=t(s.userId,r);o.done(function(e){n.resolve(e)});o.fail(function(e){n.reject(e)});return n}})});
define("js/mtapi/signout",["js/mtapi"],function(e){return function(){var t=$.Deferred();e.api.revokeAuthentication(function(e){e.status&&"success"===e.status?t.resolve(e):t.reject(e)});return t}});
define("js/router/controller",["backbone.marionette","js/l10n","js/cache","js/mtapi","js/commands","js/vent","js/mtapi/user","js/collections/blogs","js/models/blog","js/mtapi/signout"],function(e,t,i,s,n,r,o,a,h,l){return e.Controller.extend({auth:function(e){var r=_.bind(function(e){var s,r=i.get("user","user");if(r){s=$.Deferred();s.resolve(r)}else s=o();s.fail(_.bind(function(e){i.clear("user","user");this.authenticate()},this));s.done(_.bind(function(s){i.set("user","user",s);var r,o,l=this.l10n=this.l10n||new t(s.language),d=parseInt(localStorage.getItem("currentBlogId"),10)||null,c=function(t,s,r){var o=i.get("app","initial");(o||null===o)&&l.waitLoadCommon(function(){n.execute("app:buildMenu",{userId:t.id,blogId:s.id,user:t,blog:s,blogs:r});i.set("app","initial",!1)});e({userId:t.id,blogId:s.id,user:t,blog:s,blogs:r})},u=i.get("user","blogs")||i.set("user","blogs",new a);if(d){var f=u.get(d);o=_.bind(function(e){c(s,e.toJSON())},this);r=_.bind(function(t,i){e=function(e){e=e||{};n.execute("move:dashboard",e)};c(s,{error:i.error})},this);if(f)o(f);else{f=new h({id:d});f.fetch({success:o,error:r})}}else{r=_.bind(function(t,r){i.clear("user","blogs");e=function(e){e=e||{};n.execute("move:dashboard",e)};c(s,{error:r.error})},this);o=_.bind(function(e){var t=e.toJSON();t.length?c(s,t[0],t):r(e,{error:{message:"You have no blog to show in Loupe"}})},this);u.length?o(u):u.fetch({userId:s.id,success:o,error:r})}},this))},this);if(this.token)r(e);else{var l=s.api.getTokenData();if(l){void 0!==window.sessionStorage.getItem("routeCache")&&window.sessionStorage.removeItem("routeCache");void 0!==window.sessionStorage.getItem("authRetry")&&window.sessionStorage.removeItem("authRetry");this.token=l;r(e)}else this.authenticate()}},signin:function(){n.execute("move:signin")},authenticate:function(){var e=location.href.lastIndexOf("#"),t=-1!==e?location.href.slice(e+1):"";if("signin"!==t){window.sessionStorage.setItem("routeCache",t);n.execute("router:navigate","signin")}else this.signin()},signout:function(){l().done(_.bind(function(){localStorage.removeItem("currentBlogId");localStorage.removeItem("recentBlogHistory");delete this.token;i.clearAll();r.trigger("after:signout");n.execute("router:navigate","signin")},this))},initialize:function(){n.setHandler("l10n",_.bind(function(e){this.l10n&&this.l10n.waitLoadCommon(e)},this));n.setHandler("authorizationCallback",_.bind(function(){this.authorizationCallback()},this));s.api.on("authorizationRequired",_.bind(function(e){var t=window.sessionStorage.getItem("authRetry")||0;if(1>t)if(e.error&&0===parseInt(e.error.code,10)&&e.error.message)n.execute("app:error",{blog:{error:{message:e.error.message}}});else{t=parseInt(t,10)+1;window.sessionStorage.setItem("authRetry",t);this.authenticate()}else{var i="authorizationRequired error occured over time for some reason";window.sessionStorage.removeItem("authRetry");n.execute("app:error",{blog:{error:{message:i}}})}},this))},addCardViewMethod:function(e,t){t&&!this[t]&&(this[t]=_.bind(function(){var i=[].slice.call(arguments,0);this.auth(function(s){var r=_.extend({},s,{routes:i,card:e});n.execute(t,r)})},this))},moveDashboard:function(){var e=[].slice.call(arguments,0);this.auth(function(t){var i=_.extend({},t,{routes:e});n.execute("move:dashboard",i)})},authorizationCallback:function(){var e=window.sessionStorage.getItem("routeCache")||"";n.execute("router:navigate",e)}})});
define("js/trans",[],function(){var e=function(e,t){this.l10n=e;this.namespace=t||null};e.prototype.trans=function(e){e=this.l10n?this.l10n.get(this.namespace,e)||this.l10n.get("common",e)||e:e;if(arguments.length>1)for(var t=1;t<=arguments.length;t++){e=e.replace(RegExp("\\[_"+t+"(?::[^\\]]+)?\\]","g"),arguments[t]);for(var i,s=RegExp("\\[quant,_"+t+",(.+?)(?:,(.+?))?(?::[^\\]]+)?\\]");i=e.match(s);)e=1!==arguments[t]?e.replace(s,arguments[t]+" "+(void 0!==i[2]?i[2]:i[1]+"s")):e.replace(s,arguments[t]+" "+i[1])}return e};return e});
define("js/views/card/itemview",["backbone.marionette","js/cache","js/commands","js/device","js/trans"],function(e,t,i,s,n){var r={initialize:function(e){e=e||{};this.blogId=e.blogId;this.blog=e.blog;this.user=e.user;this.userId=e.userId;this.card=e.card;this.loading=!0;this.trans=null;this.hammerOpts=s.options.hammer();var i=t.get("user","perms");this.perms=i&&i.get(this.blogId)?i.get(this.blogId).get("permissions"):null},permissionCheck:function(e,t){if(t){var i,s=t.length;for(i=0;s>i;i++)if(t[i]===e)return!0;return!1}return!1},userHasPermission:function(e){return this.permissionCheck(e,this.perms)},userHasSystemPermission:function(e){return this.permissionCheck(e,this.user.permissions)},userIsSystemAdmin:function(){return this.userHasSystemPermission("administer")},dashboardShowWithPermission:function(e){var t=$.Deferred(),i=$("#card-"+this.card.id);if(e){i.show();t.resolve()}else{i.hide();t.reject()}return t},setTranslation:function(e){i.execute("l10n",_.bind(function(t){var i="card_"+this.card.id;this.l10n=t;var s=_.bind(function(t,i){this.trans=new n(t,i);e?e():this.render()},this),r=this.card.l10n,o=void 0===r||r&&_.isArray(r)&&_.contains(r,t.userLang);o?t.load("cards/"+this.card.id+"/l10n",i).done(function(){s(t,i)}):s(t,i)},this))},addTapClass:function(e,t){var i=$(e);i.addClass("tapped");setTimeout(function(){t&&t()},100);setTimeout(function(){i.removeClass("tapped")},300)},handleRefetch:function(e){this.fetchError&&this.$el.hammer(this.hammerOpts).on("tap",".refetch",_.bind(function(t){this.addTapClass(t.currentTarget,_.bind(function(){this.loading=!0;this.fetchError=!1;this.render();this.fetch(e)},this))},this))},fetch:function(e){e=e||{};var t={success:_.bind(function(){this.loading=!1;this.fetchError=!1;e.successCallback&&e.successCallback();this.render()},this),error:_.bind(function(){this.loading=!1;this.fetchError=!0;e.errorCallback&&e.errorCallback();this.render()},this)};t=_.extend(t,e);this.model.fetch(t)},serializeDataInitialize:function(){var e={};if(this.l10n){var t=this.l10n.userLang?this.l10n.userLang:"";"en-us"===t&&(t="");e.lang=t}e.name=this.card.name;e.id=this.card.id;e.fetchError=this.fetchError;e.loading=this.loading;e.loadingReadmore=this.loadingReadmore;e.trans=this.trans;return e}};return e.ItemView.extend(r,{cardItemViewProto:r})});
define("template/helpers/trans",["handlebars"],function(e){function t(e,t){var i=[];if(arguments.length>2){i=[].slice.call(arguments,1,arguments.length-1);t=arguments[arguments.length-1]}var s=t.fn?t.fn(this):t;if(e){i.unshift(s);s=e.trans.apply(e,i)}else s="";return s}e.registerHelper("trans",t);return t});
define("template/helpers/ifIs",["handlebars"],function(e){function t(e,t){if(void 0!==e){var i=t.hash,s={eq:e===t.hash.eq,ne:e!==t.hash.ne,lt:e<=t.hash.lt,gt:e>=t.hash.gt,exists:void 0!==e,notNull:null!==e},n=i.eq?"eq":i.ne?"ne":i.lt?"lt":i.gt?"gt":i.exists?"exists":i.notNull?"notNull":" ";return s[n]?t.fn(this):t.inverse(this)}return""}e.registerHelper("ifIs",t);return t});
define("js/views/menu/blogs-list",["js/views/card/itemview","json2","js/cache","js/device","js/commands","js/vent","js/trans","js/collections/blogs","js/mtapi/blogs","js/mtapi/blog","hbs!js/views/menu/templates/blogs-list"],function(e,t,i,s,n,r,o,a,h,l,d){return e.extend({serializeData:function(){var e={};if(this.trans){if(0===this.offset){this.next=this.offset+25-this.histories.length;this.prev=null;e.histories=this.histories}else{this.next=this.offset+25;this.prev=Math.max(0,this.offset-25);e.histories=[]}this.blogs=this.collection.toJSON()||[];this.blogs=this.blogs.length>this.offset?this.blogs.slice(this.offset,this.next):[];e=_.extend(e,{totalResults:parseInt(this.collection.totalResults,10)||0,blogs:this.blogs,user:this.user,trans:this.trans,next:this.next,prev:this.prev,blogsLoading:this.blogsLoading?!0:!1,historiesLoading:this.historiesLoading?!0:!1,error:this.error})}return e},selectCurrentBlog:function(e){e=parseInt(e||this.currentBlogId,10);var t=_.bind(function(t){if(parseInt(t.id,10)===e){t.selected=!0;this.blog=t}else delete t.selected},this);_.each(this.blogs,t);0===this.offset&&_.each(this.histories,t)},template:d,initialize:function(){e.prototype.initialize.apply(this,Array.prototype.slice.call(arguments));this.currentBlogId=this.selectedBlogId=parseInt(localStorage.getItem("currentBlogId"),10)||(this.blog&&this.blog.id?this.blog.id:null);this.blogsLoading=!0;this.collection=i.get("user","blogs")||null;this.histories=this.getRecentBlogHistory()||[];this.historiesLoading=!0;this.offset=0;this.prev=null;this.next=this.offset+25-this.histories.length;this.refetchBlogHistoryData();n.execute("l10n",_.bind(function(e){this.trans=new o(e);if(this.collection&&this.collection.totalResults>this.offset&&this.collection.length>=this.offset){this.blogsLoading=!1;this.selectCurrentBlog(this.currentBlogId);this.render()}else{this.collection=i.set("user","blogs",new a);this.blogsLoading=!0;this.fetch()}},this));n.setHandler("menu:getRecentBlogHistory",this.getRecentBlogHistory);n.setHandler("menu:setRecentBlogHistory",this.setRecentBlogHistory);n.setHandler("menu:resetRecentBlogHistory",this.resetRecentBlogHistory)},fetch:function(){var e={userId:this.user.id,success:_.bind(function(){this.selectCurrentBlog(this.currentBlogId);this.blogsLoading=!1;this.render()},this),error:_.bind(function(e,t){this.error=t?t.error:{message:""};this.blogsLoading=!1;this.render()},this),offset:parseInt(this.offset,10)||0,limit:this.next-this.offset,merge:!0,remove:!1};this.histories&&this.histories.length&&(e.excludeIds=_.map(this.histories,function(e){return e.id}).join(","));this.blogsLoading=!0;this.render();this.collection.fetch(e)},selectBlogHandler:function(e){var t=this.$el;this.selectedBlogId=parseInt(e,10);t.find(".selected").removeClass("selected");t.find("[data-id="+this.selectedBlogId+"]").addClass("selected");this.saveChangesHandler()},saveChangesHandler:function(){n.execute("dashboard:toggle");if(this.currentBlogId!==this.selectedBlogId){this.currentBlogId=this.selectedBlogId;localStorage.setItem("currentBlogId",this.selectedBlogId);this.blog=this.collection.get(this.selectedBlogId);this.blog=this.blog?this.blog.toJSON():_.find(this.histories,_.bind(function(e){return parseInt(e.id,10)===parseInt(this.selectedBlogId,10)},this));this.setRecentBlogHistory(this.blog);this.collection.remove(this.blog);this.offset=0;this.selectCurrentBlog(this.currentBlogId);this.render();setTimeout(_.bind(function(){n.execute("move:dashboard",{userId:this.user.id,blogId:this.blog.id,user:this.user,blog:this.blog,blogs:this.blogs})},this),300)}},getRecentBlogHistory:function(){var e=localStorage.getItem("recentBlogHistory")||"[]";return t.parse(e)},setRecentBlogHistory:function(e){var i=this.getRecentBlogHistory();e=_.extend(e,{selected:!1});i.unshift(e);i=_.uniq(i,function(e){return e.id});i=i.slice(0,5);localStorage.setItem("recentBlogHistory",t.stringify(i));this.histories=i},removeRecentBlogHistory:function(){localStorage.removeItem("recentBlogHistory");this.histories=[]},refetchBlogHistoryData:function(){var e,i,s=_.bind(function(){this.selectCurrentBlog(this.currentBlogId);this.historiesLoading=!1;this.render()},this);if(this.histories.length){e={includeIds:_.map(this.histories,function(e){return e.id}).join(",")};i=h(this.user.id,e);i.done(_.bind(function(e){var i=function(e,t){return _.find(e,function(e){return parseInt(e.id,10)===parseInt(t.id,10)})};this.histories=_.map(this.histories,function(t){var s=i(e.items,t);s?t=s:t.remove=!0;return t});this.histories=_.reject(this.histories,function(e){return e.remove});localStorage.setItem("recentBlogHistory",t.stringify(this.histories));s()},this));i.fail(_.bind(function(){console.warn("getBlogList failed at refetchBlogHistoryData, so removing histories");s()},this))}else s()},navigationHandler:function(){this.collection.length>this.offset?this.render():this.fetch()},onClose:function(){r.off("after:signout");n.removeHandler("menu:getRecentBlogHistory",this.getRecentBlogHistory);n.removeHandler("menu:setRecentBlogHistory",this.setRecentBlogHistory);n.removeHandler("menu:resetRecentBlogHistory",this.resetRecentBlogHistory)},onRender:function(){this.$el.find("a").hammer(this.hammerOpts).on("tap",_.bind(function(e){this.addTapClass(e.currentTarget,_.bind(function(){var t=$(e.currentTarget);e.preventDefault();e.stopPropagation();if("signout"===t.data("id")){r.on("after:signout",n.execute("dashboard:toggle"));n.execute("router:navigate","signout")}else this.selectBlogHandler(t.data("id"));return!1},this))},this));this.$el.find(".blog-item-nav").hammer(this.hammerOpts).on("tap",_.bind(function(e){this.addTapClass(e.currentTarget,_.bind(function(){this.offset=void 0!==$(e.currentTarget).data("offset")?parseInt($(e.currentTarget).data("offset"),10):this.offset;this.offset=this.offset<0?0:this.offset;this.navigationHandler()},this))},this));$("#menu-blogs-list").scrollTop(0)}})});
define("js/views/menu/main",["backbone.marionette","json2","js/device","js/commands","js/mtapi/blogs","js/mtapi/blog","js/views/menu/blogs-list","hbs!js/views/menu/templates/main"],function(e,t,i,s,n,r,o,a){return e.Layout.extend({serializeData:function(){var e={};e.user=this.user;return e},ui:{menuHeaderArrow:"#menu-header-arrow"},template:a,regions:{blogs:"#menu-blogs-list"},initialize:function(e){this.options=e;this.user=e.user},handleToggle:function(){this.ui.menuHeaderArrow.toggleClass("rotate")},onRender:function(){var e=i.options.hammer();this.blogs.show(new o(this.options));s.setHandler("menu:header:toggle",_.bind(this.handleToggle,this));this.$el.find("#menu-header").hammer(e).on("tap",_.bind(function(){s.execute("dashboard:toggle")}))}})});
define("js/views/menu/layout",["backbone.marionette","app","js/device","js/commands","js/views/menu/main","hbs!js/views/menu/templates/layout"],function(e,t,i,s,n,r){return e.Layout.extend({template:r,initialize:function(e){this.options=e;this.$el.addClass("container")},regions:{main:"#menu-main"},onRender:function(){this.main.show(new n(this.options));s.setHandler("menu:show",_.bind(function(){this.$el.css({display:"block"})},this));s.setHandler("menu:hide",_.bind(function(){this.$el.css({display:"none"})},this))}})});
define("js/views/dashboard/header",["backbone.marionette","js/device","js/commands","hbs!js/views/dashboard/templates/header"],function(e,t,i,s){return e.ItemView.extend({template:s,ui:{blognameArrow:"#blogname-arrow"},initialize:function(e){this.blog=e.blog},handleSlide:function(){var e=this.ui.blognameArrow;if(e.hasClass("rotate")){$(document.body).toggleClass("hide");i.execute("menu:hide");i.execute("dashboard:slideup");i.execute("menu:header:toggle");e.toggleClass("rotate")}else{$(document.body).toggleClass("hide");i.execute("menu:show");i.execute("dashboard:slidedown",this.$el.height());i.execute("menu:header:toggle");e.toggleClass("rotate")}},adjustHeader:function(){var e=this.$el.find("#blogname-inner"),t=this.$el.find("#blogname-circle"),i=this.ui.blognameArrow;if(e.length){var s=e.offset(),n=e.width();t&&t.offset&&s&&t.offset({left:s.left-t.outerWidth(!0)-10});i&&i.offset&&s&&i.offset({left:s.left+n});this.$el.addClass("show")}},onClose:function(){i.removeHandler("dashboard:toggle",this.handleSlide);$(window).off("orientationchange debouncedresize");this.$el.hammer().off("tap")},onRender:function(){if(t.isIE&&t.version<=8){setTimeout(_.bind(function(){this.adjustHeader()},this),0);$(window).on("orientationchange debouncedresize",_.bind(this.adjustHeader,this))}i.setHandler("dashboard:toggle",this.handleSlide,this);this.$el.hammer(t.options.hammer()).on("tap",_.bind(this.handleSlide,this))},serializeData:function(){var e={};e.blog=this.blog||{};e.blog.name=e.blog.name||"Loupe";return e}})});
define("js/views/dashboard/main",["backbone.marionette","js/commands","js/cards","js/trans","js/mtapi/blog","js/views/card/itemview","hbs!js/views/dashboard/templates/main"],function(e,t,i,s,n,r,o){return e.Layout.extend({serializeData:function(){var e={};e.error=this.error;e.trans=this.trans;return e},template:o,insertCard:function(e){if(e.dashboard){var t=e.id,i="card-"+t,s=parseFloat(e.dashboard.order,10)||null;e.$el=$('<section id="'+i+'" class="card"></section>');e.$el.selector="#"+i;if("number"!=typeof s){e.$el.appendTo(this.$el);e.inserted=!0}else{for(var n=this.cards.length,r=_.sortBy(this.cards,function(e){return e.dashboard?parseFloat(e.dashboard.order,10)||1e19:1e19}),o=0;n>o;o++){var a=r[o],h=a.dashboard?parseFloat(a.dashboard.order,10)||null:null,l=a.$el;if(a.inserted&&a.id!==e.id&&(!h||h>s)){e.$el.insertBefore(l);e.inserted=!0;break}}if(!e.inserted){e.$el.appendTo(this.$el);e.inserted=!0}}this[t+"Handler"]=this.createHandler(e);this.on("region:add",function(e,t){this[e+"Handler"](e,t)},this);this.addRegion(t,e.$el)}},createHandler:function(e){return function(t,i){var s=e.id,n=e.dashboard,o=(e.root||"cards/")+s+"/";if(n.view)require([o+n.view.replace(/\.js$/,"")],_.bind(function(t){i.show(new t(_.extend(this.options,{card:e})))},this));else if(n.template){var a,h,l=n.template.match(/^(.*)\.(.*)$/);if("hbs"===l[2]){a="hbs";h=l[1]}else{a="text";h=l[0]}var d=n.data?[o+n.data.replace(/\.js$/,"")]:[],c=a+"!"+o+h,u=[c].concat(d);require(u,_.bind(function(t,s){t="hbs"===a?t:c;s=s?s:{};var n=r.extend({template:t,serializeData:function(){var e=this.serializeDataInitialize();e=_.extend(e,s);return e}});i.show(new n(_.extend(this.options,{card:e})))},this))}}},onClose:function(){t.removeHandler("dashboard:insertCard")},prepareCards:function(e){if(e.user)t.execute("l10n",_.bind(function(e){this.trans=new s(e);this.cardsDfds=[];this.cards&&this.cards.length?_.each(this.cards,function(e){this.insertCard(e)},this):this.render()},this));else{this.trans=new s;this.render()}},initialize:function(e){this.options=e;this.blog=e.blog;this.blog&&(this.error=this.blog.error);this.cards=this.error||!e.cards?[]:e.cards},setHandler:function(){t.setHandler("dashboard:insertCard",function(e){e=$.isArray(e)?e:e?[e]:[];_.each(e,function(e){if(!_.find(this.cards,function(t){return t.id===e.id})){this.cards.push(e);this.insertCard(e)}},this)},this)},onRender:function(){if(!this.buildOnlyOnce){this.buildOnlyOnce=!0;this.prepareCards(this.options);this.setHandler()}}})});
define("js/views/dashboard/layout",["backbone.marionette","js/commands","hbs!js/views/dashboard/templates/layout","js/views/dashboard/header","js/views/dashboard/main"],function(e,t,i,s,n){return e.Layout.extend({template:function(e){return i(e)},regions:{header:"#header",main:"#main",footer:"#footer"},initialize:function(e){this.options=e},onClose:function(){t.removeHandler("dashboard:slidedown");t.removeHandler("dashboard:slideup")},onRender:function(){this.header.show(new s(this.options));this.$el.attr("id","dashboard");this.$el.addClass("dashboard container");this.main.show(new n(this.options));t.setHandler("dashboard:slidedown",function(e){this.$el.css({top:$(window).height()-e+"px"})},this);t.setHandler("dashboard:slideup",function(){this.$el.css({top:"0"})},this)},onShow:function(){var e=function(){var t=$(this);if(t.scrollTop()>0)$("#header").addClass("shadow");else{$("#header").removeClass("shadow");$(".main-container").one("scroll",e)}};$(".main-container").one("scroll",e);$(".main-container").on("smartscroll",e)}})});
define("js/views/card/header",["js/views/card/itemview","hbs!js/views/card/templates/header","js/device","js/commands"],function(e,t,i,s){return e.extend({template:t,ui:{backDashboardButton:"#back-dashboard",shareButton:"#share-button"},initialize:function(){e.prototype.initialize.apply(this,Array.prototype.slice.call(arguments));this.setTranslation();s.setHandler("header:render",_.bind(function(e){this.object=e;this.render()},this))},backButtonRoute:function(){return""},handleBackButton:function(e){this.addTapClass(e.currentTarget,_.bind(function(){s.execute("app:beforeTransition");s.execute("router:navigate",this.backButtonRoute())},this))},onClose:function(){s.removeHandler("header:render")},onRender:function(){this.ui.backDashboardButton.hammer(i.options.hammer()).on("tap",_.bind(function(e){this.handleBackButton(e)},this));this.ui.shareButton.hammer(i.options.hammer()).on("tap",_.bind(function(e){this.addTapClass(e.currentTarget,_.bind(function(){s.execute("card:"+this.card.id+":share:show","")},this))},this))},serializeData:function(){var e=this.serializeDataInitialize();e=_.extend(e,_.clone(this.card));e.trans=this.trans;return e}})});
define("template/helpers/encodeURI",["handlebars"],function(e){function t(t){return new e.SafeString(encodeURIComponent(t))}e.registerHelper("encodeURI",t);return t});
define("js/views/share/share",["backbone.marionette","hbs!js/views/share/templates/share","js/device","js/commands","js/trans"],function(e,t,i,s,n){return e.ItemView.extend({template:t,initialize:function(e){this.share=e&&e.share?e.share:{};this.$el.addClass("share-inner");this.trans=null;s.execute("l10n",_.bind(function(e){this.trans=new n(e,null);this.render()},this))},onRender:function(){this.$el.find("#share-close").hammer(i.options.hammer()).on("tap",_.bind(function(){s.execute("share:close")},this))},serializeData:function(){var e=_.clone(this.share||{});e.tweetUrl=e.url;e.tweetText=$("<div>").html(e.tweetText).text();if((e.tweetUrl+e.tweetText).length>140){var t=140-e.tweetUrl.length-4;e.tweetText=e.tweetText.slice(0,t)+"..."}e.trans=this.trans;return e}})});
define("js/views/card/layout",["backbone.marionette","js/views/card/itemview","js/commands","hbs!js/views/card/templates/layout","js/views/card/header","js/views/share/share"],function(e,t,i,s,n,r){return e.Layout.extend({initialize:function(e){this.options=e;this.card=e.card;this.viewHeader=e.viewHeader;this.viewView=e.viewView;this.viewTemplate=e.viewTemplate;this.viewData=e.viewData},template:s,regions:{header:"#header",main:"#main"},shareShow:function(e){this.$el.append('<section id="share"></section>');this.addRegion("share","#share");this.share.show(new r(e))},shareClose:function(){this.share&&this.share.close();$("#share").remove()},setShareHandler:function(){i.setHandler("share:show",this.shareShow,this);i.setHandler("share:close",this.shareClose,this)},onClose:function(){i.removeHandler("share:show");i.removeHandler("share:close")},onRender:function(){this.$el.addClass("container");var e=this,i=this.card.id,s="cards/"+i+"/";this.main.on("show",_.bind(function(){this.main.$el.addClass("card-view-"+this.card.id)},this));this.viewHeader?require([s+this.viewHeader.replace(/\.js$/,"")],function(t){e.header.show(new t(e.options))}):this.header.show(new n(this.options));if(this.viewView)require([s+this.viewView.replace(/\.js$/,"")],function(t){e.main.show(new t(e.options))});else{var r,o,a=this.viewTemplate.match(/^(.*)\.(.*)$/);if("hbs"===a[2]){r="hbs";o=a[1]}else{r="text";o=a[0]}var h=this.viewData?[s+this.viewData.replace(/\.js$/,"")]:[],l=r+"!"+s+o,d=[l].concat(h);require(d,function(i,s){i="hbs"===r?i:l;s=s||{};var n=t.extend({template:i,serializeData:function(){var e=this.serializeDataInitialize();e=_.extend(e,s);return e}});e.main.show(new n(e.options))})}this.setShareHandler()},onShow:function(){var e=function(){var t=$(this);if(t.scrollTop()>0)$("#header").addClass("shadow");else{$("#header").removeClass("shadow");$(".main-container").one("scroll",e)}};$(".main-container").one("scroll",e);$(".main-container").on("smartscroll",e)}})});
define("js/views/signin/signin",["backbone.marionette","js/device","js/commands","js/mtapi","hbs!js/views/signin/templates/signin"],function(e,t,i,s,n){return e.ItemView.extend({template:n,ui:{username:"#username",password:"#password",button:"#signin-button"},initialize:function(e){e=e||{};this.username=e.username;this.password=e.password;i.setHandler("signin:error",_.bind(function(e){i.execute("app:afterTransition");this.signinError=e;this.render()},this))},timeout:15e3,authenticate:function(){i.execute("app:beforeTransition");this.username=this.ui.username.val();this.password=this.ui.password.val();var e=setTimeout(_.bind(function(){i.execute("app:afterTransition");this.signinError="Timeout Error";this.render()},this),this.timeout);s.api.authenticate({username:this.username,password:this.password,remember:!0,bustCache:(new Date).valueOf()},_.bind(function(t){clearTimeout(e);if(t.error){i.execute("app:afterTransition");this.signinError=t.error.message||"Sign in authencation was failed for some reason";this.render()}else i.execute("authorizationCallback")},this))},onRender:function(){this.signinError&&this.$el.find(".close-me").hammer(this.hammerOpts).on("tap",_.bind(function(){this.$el.find(".signin-error").remove()},this));this.$el.find(".signin-input").on("keypress",_.bind(function(e){13===e.which&&this.authenticate()},this));this.ui.button.hammer(this.hammerOpts).on("tap",_.bind(function(){this.authenticate()},this))},hammerOpts:t.options.hammer(),serializeData:function(){var e={};e.username=this.username;e.password=this.password;e.signinError=this.signinError;return e}})});
define("app",["backbone","backbone.marionette","js/cards","js/cache","js/device","js/commands","js/vent","js/router/router","js/router/controller","js/views/menu/layout","js/views/dashboard/layout","js/views/card/layout","js/views/signin/signin"],function(e,t,i,s,n,r,o,a,h,l,d,c,u){var f=t.Application.extend({setCardViewHandler:function(e,t){r.setHandler("move:cardView:"+e.id+":"+t.id,function(i){var s="cards/"+e.id+"/";if(t.layout)require([s+t.layout.replace(/\.js$/,"")],_.bind(function(e){this.main.show(new e(i));r.execute("app:afterTransition")},this));else{i=_.extend(i,{viewHeader:t.header,viewView:t.view,viewTemplate:t.template,viewData:t.data});i.viewView=t.view;this.main.show(new c(i));r.execute("app:afterTransition")}},this)},deployAddedCard:function(e){e&&e.length&&i.deploy().done(function(){r.execute("dashboard:insertCard",e)})},appendDeviceClass:function(e){var t=$(document.body);if(e.platform){t.addClass(e.platform);if(e.version){t.addClass(e.platform+e.versionShortStr);t.addClass(e.platform+e.versionStr)}}if(e.browser){t.addClass(e.browser);if(e.browserVersion){t.addClass(e.browser+e.browserVersionShortStr);t.addClass(e.browser+e.browserVersionStr)}}},setCommandHandlers:function(){r.setHandlers({"app:buildMenu":{context:this,callback:function(e){this.menu.show(new l(e))}},"app:beforeTransition":{context:this,callback:function(){$(document.body).addClass("onmove");var e=$("#app-building");if(this.device.isAndroid||this.device.isWindowsPhone){var t=$(document.body).scrollTop();e.css({top:t+"px",bottom:"-"+t+"px"})}e.show()}},"app:afterTransition":{context:this,callback:function(){$(document.body).removeClass("onmove");$("#app-building").hide()}},"move:signin":{context:this,callback:function(e){this.main.show(new u(e));r.execute("app:afterTransition")}},"move:dashboard":{context:this,callback:function(e){e.cards=_.map(this.cards,function(e){return _.clone(e)});this.main.show(new d(e));r.execute("app:afterTransition")}},"app:error":{context:this,callback:function(e){this.main.show(new d(e));r.execute("app:afterTransition")}},"app:setCardViewHandler":{context:this,callback:function(e,t,i){this.setCardViewHandler(e,t);i&&i()}}})},stop:function(){this.closeRegions();i.clearAll();o.off();r.removeAllHandlers();s.clearAll();this._initCallbacks.reset();e.history.stop();e.history=new e.History},initialize:function(t){this.id=(new Date).valueOf();t=t||{};s.set("app","initial",!0);s.set("app","staticPath",$("#main-script").data("base"));this.initial=!0;this.cards=i.add(t.cards,!0).getAll();this.device=n;this.addRegions({main:"#app",menu:"#menu"});this.router=t.router||new a({controller:new h});this.appendDeviceClass(n);this.setCommandHandlers();o.on("cards:add",this.deployAddedCard,this);i.deploy().done(function(){e.History.started||e.history.start();o.trigger("app:cards:deploy:end")})}}),m=new f;m.addInitializer(m.initialize);return m});