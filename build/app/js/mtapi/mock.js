define(function () {
  'use strict';

  var Mock = function () {

  };

  Mock.prototype.base = function (name, resp, args) {
    var callback = null;
    args = Array.prototype.slice.call(args);
    args.unshift(name);
    console.log(args);
    _.each(args, function (arg) {
      if (typeof arg === 'function') {
        callback = arg;
      }
    });

    if (callback) {
      callback(resp);
    } else {
      return resp;
    }
  };

  Mock.prototype.token = function () {
    this.base('token', {
      accessToken: "YUilse0FLzaHYDVbG4pTl9TtUmAUgkrFBNuordXV",
      expiresIn: 3600
    }, arguments);
  },

  Mock.prototype.getUser = function () {
    this.base('getUser', {
      displayName: "yyamaguchi",
      email: "yyamaguchi@sixapart.com",
      id: "1",
      language: "ja",
      name: "yyamaguchi",
      updatable: true,
      url: "",
      userpicUrl: ""
    }, arguments);
  };

  Mock.prototype.getBlog = function (id) {
    this.base('getBlog', {
      archiveUrl: "http://memolog.org/",
      class: "blog",
      description: "",
      id: (id || "2"),
      name: "メモログ",
      url: "http://memolog.org/"
    }, arguments);
  };

  Mock.prototype.listBlogs = function () {
    this.base('listBlogs', {
      "totalResults": 2,
      "items": [{
          "name": "メモログ",
          "url": "http://memolog.org/",
          "archiveUrl": "http://memolog.org/",
          "id": "1",
          "class": "blog",
          "description": ""
        }, {
          "name": "First Website",
          "url": "http://memolog.org/",
          "archiveUrl": "http://memolog.org/",
          "id": "2",
          "class": "website",
          "description": ""
        }
      ]
    }, arguments);
  };

  Mock.prototype.statsProvider = function () {
    this.base('statsProvide', {
      id: "GoogleAnalytics"
    }, arguments);
  };

  Mock.prototype.statsPageviewsForDate = function () {
    this.base('statsPageviewsForDate', {
      "totalResults": 7,
      "totals": {
        "pageviews": "595"
      },
      "items": [{
          "pageviews": "105",
          "date": "2013-06-13"
        }, {
          "pageviews": "107",
          "date": "2013-06-14"
        }, {
          "pageviews": "37",
          "date": "2013-06-15"
        }, {
          "pageviews": "47",
          "date": "2013-06-16"
        }, {
          "pageviews": "119",
          "date": "2013-06-17"
        }, {
          "pageviews": "127",
          "date": "2013-06-18"
        }, {
          "pageviews": "53",
          "date": "2013-06-19"
        }
      ]
    }, arguments);
  };

  Mock.prototype.statsVisitsForDate = function () {
    this.base('statsVisitsForDate', {
      "totalResults": 7,
      "totals": {
        "visits": "492"
      },
      "items": [{
          "visits": "81",
          "date": "2013-06-13"
        }, {
          "visits": "90",
          "date": "2013-06-14"
        }, {
          "visits": "31",
          "date": "2013-06-15"
        }, {
          "visits": "43",
          "date": "2013-06-16"
        }, {
          "visits": "101",
          "date": "2013-06-17"
        }, {
          "visits": "103",
          "date": "2013-06-18"
        }, {
          "visits": "43",
          "date": "2013-06-19"
        }
      ]
    }, arguments);
  };

  Mock.prototype.listComments = function () {
    this.base('listComments', {
      "totalResults": "169",
      "items": [{
          "link": "http://memolog.org/memolog2/2009/06/kamakura-enoshima.html#comment-338",
          "entry": {
            "id": "806"
          },
          "parent": null,
          "date": "2009-06-14T22:53:43\u002b09:00",
          "status": "Approved",
          "updatable": true,
          "author": {
            "userpicUrl": null,
            "id": null,
            "displayName": "yamaguchi"
          },
          "blog": {
            "id": "3"
          },
          "body": "\u306a\u306b\u305b\u4e00\u30f6\u6708\u524d\u306e\u51fa\u6765\u4e8b\u3067\u3059\u304b\u3089\u30fb\u30fb\u5199\u771f\u304c\u306a\u304b\u3063\u305f\u3089\u5b8c\u5168\u306b\u5fd8\u308c\u3066\u3044\u308b\u3068\u3053\u308d\u3067\u3059\u3002\n\n\u5927\u4ecf\u69d8\u306e\u4e2d\u306b\u5165\u308b\u305f\u3081\u306b\u3001\u5927\u4ecf\u69d8\u3092\u534a\u5468\u3061\u3087\u3063\u3068\u56de\u3089\u306a\u3044\u3068\u5165\u308c\u306a\u3044\u307b\u3069\u4e26\u3093\u3067\u3044\u307e\u3057\u305f\u3002\u4eba\u6c17\u30b9\u30dd\u30c3\u30c8\u306f\u6709\u7d66\u3068\u3063\u3066\u884c\u304f\u306b\u9650\u308a\u307e\u3059\u306d\u3002",
          "id": 338
        }, {
          "link": "http://memolog.org/memolog2/2009/06/kamakura-enoshima.html#comment-337",
          "entry": {
            "id": "806"
          },
          "parent": null,
          "date": "2009-06-14T12:56:00\u002b09:00",
          "status": "Approved",
          "updatable": true,
          "author": {
            "userpicUrl": null,
            "id": null,
            "displayName": "Jun Kaneko"
          },
          "blog": {
            "id": "3"
          },
          "body": "\u306e\u3069\u304b\u3067\u3044\u3044\u52a0\u6e1b\u306e\u8a18\u4e8b\u3067\u3059\u306a\u3002\u5927\u4ecf\u4e26\u3073\u904e\u304e\u3067\u3057\u3087\u3046w",
          "id": 337
        }, {
          "link": "http://memolog.org/memolog2/2009/05/dp1.html#comment-336",
          "entry": {
            "id": "802"
          },
          "parent": null,
          "date": "2009-05-07T11:58:35\u002b09:00",
          "status": "Approved",
          "updatable": true,
          "author": {
            "userpicUrl": null,
            "id": null,
            "displayName": "yamaguchi"
          },
          "blog": {
            "id": "3"
          },
          "body": "\u305d\u308c\u306f\u305d\u308c\u3067\u3044\u304b\u304c\u306a\u3082\u306e\u304b\u3068\u601d\u308f\u306a\u304f\u3082\u306a\u3044\u3067\u3059\u304c\u3001\u8912\u3081\u8a00\u8449\u3068\u3057\u3066\u4f4e\u8abf\u4e01\u91cd\u306b\u627f\u308a\u305f\u3044\u3068\u601d\u3044\u307e\u3059\u3002",
          "id": 336
        }
      ]
    }, arguments)
  };

  Mock.prototype.listEntries = function () {
    this.base('listComments', {
      "totalResults": "4",
      "items": [{
          "excerpt": " \u6700\u8fd1\u3001\u65b0\u3057\u3044\u30d6\u30ed\u30b0\u30b5\u30fc\u30d3\u30b9\u306b\u3064\u3044\u3066\u3001\u3064\u3089\u3064\u3089\u3068\u8003\u3048\u3066\u3044\u307e\u3059\u3002 \u3044\u307e\u306e\u5927\u534a\u306e\u30d6\u30ed\u30b0\u306f\u3001\u6700\u65b0\u9806\u306b\u8a18\u4e8b\u304c\u4e26\u3073\u307e\u3059\u3002 \u3064\u307e\u308a\u3001\u300c\u66f4\u65b0\u3055\u308c\u7d9a\u3051\u308b\u3053\u3068\u300d\u304c\u524d\u63d0\u306e\u30c7\u30b6\u30a4\u30f3\u306b\u306a\u3063\u3066\u3044\u307e\u3059\u3002 \u3060\u304b\u3089\u3001\u66f4\u65b0\u304c\u6b62\u307e\u3063\u305f\u30d6\u30ed\u30b0\u306f\u3001\u30da\u30fc\u30b8\u305d\u306e\u3082\u306e\u306b\u5168\u304f\u5909\u5316\u304c\u306a\u304f\u306a\u308a\u3001\u3068\u3066\u3082\u5bc2\u3057\u3052\u306b\u898b\u3048\u307e\u3059\u3002 \u3057\u304b\u3057\u3001\u305d\u306e\u30d6\u30ed\u30b0\u7ba1\u7406\u4eba\u306f\u3001\u305d\u3082\u305d\u3082\u3001\u66f8\u304d\u305f\u304b\u3063\u305f\u3053\u3068\u306f\uff12\u3064\u304b\uff13\u3064\u304f\u3089\u3044\u3060\u3051\u3060\u3063\u305f\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002 \u300c\u65c5\u884c\u306e\u8a18\u9332\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u300c\u5b9a\u5e74\u9000\u8077\u5f8c\u306b\u81ea\u53d9\u4f1d\u7684\u306a\u3053\u3068\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u3067\u3042\u308a\u3001\u305d\u308c\u306f\u5168\u3066\u66f8\u304d\u7d42\u308f\u3063\u305f\u304b\u3089\u66f4\u65b0\u7d42\u308f\u308a\uff01\u3068\u3044\u3046\u3053\u3068\u306a\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002 Twitter\u3084Facebook\u306b\u66f8\u3051\u3070\u3044\u3044\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002 \u3057\u304b\u3057\u3001\u30d5\u30ec\u30f3\u30c9\u3068\u60c5\u5831\u3092\u30b7\u30a7\u30a2\u3059\u308b\u3060\u3051\u3058\u3083\u6e80\u8db3\u3067\u304d\u306a\u3044\u3068\u304d\u3082\u3042\u308b\u3067\u3057\u3087\u3046\u3002 \u3082\u3046\u3061\u3087\u3063\u3068\u91ce\u5fc3\u304c\u3042\u308b\u3002 \u5e83\u304f\u30cd\u30c3\u30c8\u5168\u4f53\u306b\u516c\u958b\u3057\u3066\u3001\u77e5\u308a\u5408\u3044\u4ee5\u5916\u306e\u5927\u52e2\u306e\u4eba\u306b\u8aad\u3093\u3067\u6b32\u3057\u3044\u3002 \u307e\u305f\u306f\u3001\u81ea\u5206\u304c\u3069\u306e\u304f\u3089\u3044\u53cb\u3060\u3061\u304c\u591a\u3044\u304b\uff0f\u5c11\u306a\u3044\u304b\u3001\u6709\u540d\u304b\uff0f\u7121\u540d\u304b\u3001\u3067\u306f\u306a\u304f\u3001\u7d14\u7c8b\u306b\u66f8\u3044\u305f\u5185\u5bb9\u306e\u5584\u3057\u60aa\u3057\u3067\u52dd\u8ca0\u3057\u305f\u3044\u3002 \u305d\u3053\u3067\u3002 \u3044\u307e\u3001\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u30b5\u30fc\u30d3\u30b9\u3092\u8003\u3048\u3066\u3044\u307e\u3059\u3002...",
          "status": "Review",
          "date": "2013-06-14T18:17:59\u002b09:00",
          "updatable": true,
          "author": {
            "userpicUrl": null,
            "id": "6",
            "displayName": "yyamaguchi6"
          },
          "allowComments": true,
          "comments": [],
          "permalink": "http://172.17.0.56/blog6/new/memolog3/2013/06/okokokokok.html",
          "keywords": "",
          "body": "\u003cdiv class=\"entry-content\"\u003e\r\n\r\n\u003cp\u003e\u6700\u8fd1\u3001\u65b0\u3057\u3044\u30d6\u30ed\u30b0\u30b5\u30fc\u30d3\u30b9\u306b\u3064\u3044\u3066\u3001\u3064\u3089\u3064\u3089\u3068\u8003\u3048\u3066\u3044\u307e\u3059\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cimg alt=\"kdp2013060601.jpg\" src=\"http://blog.sixapart.jp/kdp2013060601.jpg\" width=\"375\" height=\"200\" class=\"mt-image-center\" style=\"text-align: center; display: block; margin: 0 auto 20px;\"\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3044\u307e\u306e\u5927\u534a\u306e\u30d6\u30ed\u30b0\u306f\u3001\u6700\u65b0\u9806\u306b\u8a18\u4e8b\u304c\u4e26\u3073\u307e\u3059\u3002\u003cbr\u003e\r\n\u3064\u307e\u308a\u3001\u300c\u66f4\u65b0\u3055\u308c\u7d9a\u3051\u308b\u3053\u3068\u300d\u304c\u524d\u63d0\u306e\u30c7\u30b6\u30a4\u30f3\u306b\u306a\u3063\u3066\u3044\u307e\u3059\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3060\u304b\u3089\u3001\u66f4\u65b0\u304c\u6b62\u307e\u3063\u305f\u30d6\u30ed\u30b0\u306f\u3001\u30da\u30fc\u30b8\u305d\u306e\u3082\u306e\u306b\u5168\u304f\u5909\u5316\u304c\u306a\u304f\u306a\u308a\u3001\u3068\u3066\u3082\u5bc2\u3057\u3052\u306b\u898b\u3048\u307e\u3059\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3057\u304b\u3057\u3001\u305d\u306e\u30d6\u30ed\u30b0\u7ba1\u7406\u4eba\u306f\u3001\u305d\u3082\u305d\u3082\u3001\u66f8\u304d\u305f\u304b\u3063\u305f\u3053\u3068\u306f\uff12\u3064\u304b\uff13\u3064\u304f\u3089\u3044\u3060\u3051\u3060\u3063\u305f\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u003cbr\u003e\r\n\u300c\u65c5\u884c\u306e\u8a18\u9332\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u300c\u5b9a\u5e74\u9000\u8077\u5f8c\u306b\u81ea\u53d9\u4f1d\u7684\u306a\u3053\u3068\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u3067\u3042\u308a\u3001\u305d\u308c\u306f\u5168\u3066\u66f8\u304d\u7d42\u308f\u3063\u305f\u304b\u3089\u66f4\u65b0\u7d42\u308f\u308a\uff01\u3068\u3044\u3046\u3053\u3068\u306a\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003eTwitter\u3084Facebook\u306b\u66f8\u3051\u3070\u3044\u3044\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3057\u304b\u3057\u3001\u30d5\u30ec\u30f3\u30c9\u3068\u60c5\u5831\u3092\u30b7\u30a7\u30a2\u3059\u308b\u3060\u3051\u3058\u3083\u6e80\u8db3\u3067\u304d\u306a\u3044\u3068\u304d\u3082\u3042\u308b\u3067\u3057\u3087\u3046\u3002\u003cbr\u003e\r\n\u3082\u3046\u3061\u3087\u3063\u3068\u91ce\u5fc3\u304c\u3042\u308b\u3002\u003cbr\u003e\r\n\u5e83\u304f\u30cd\u30c3\u30c8\u5168\u4f53\u306b\u516c\u958b\u3057\u3066\u3001\u77e5\u308a\u5408\u3044\u4ee5\u5916\u306e\u5927\u52e2\u306e\u4eba\u306b\u8aad\u3093\u3067\u6b32\u3057\u3044\u3002\u003cbr\u003e\r\n\u307e\u305f\u306f\u3001\u81ea\u5206\u304c\u3069\u306e\u304f\u3089\u3044\u53cb\u3060\u3061\u304c\u591a\u3044\u304b\uff0f\u5c11\u306a\u3044\u304b\u3001\u6709\u540d\u304b\uff0f\u7121\u540d\u304b\u3001\u3067\u306f\u306a\u304f\u3001\u7d14\u7c8b\u306b\u66f8\u3044\u305f\u5185\u5bb9\u306e\u5584\u3057\u60aa\u3057\u3067\u52dd\u8ca0\u3057\u305f\u3044\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u305d\u3053\u3067\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3044\u307e\u3001\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u30b5\u30fc\u30d3\u30b9\u3092\u8003\u3048\u3066\u3044\u307e\u3059\u3002\u003cbr\u003e\r\n\u003c/p\u003e\r\n\r\n    \u003c/div\u003e",
          "allowTrackbacks": false,
          "id": 1054,
          "trackbacks": [],
          "modifiedDate": "2013-06-14T18:17:59\u002b09:00",
          "trackbackCount": "0",
          "categories": [],
          "blog": {
            "id": "5"
          },
          "commentCount": "0",
          "tags": [],
          "basename": "okokokokok",
          "assets": [],
          "pingsSentUrl": [],
          "title": "\u4e00\u751f\u306b\u4e00\u5ea6\u3060\u3051\u66f8\u304f\u3067\u3082OK\u306a\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u7cfb\u30b5\u30fc\u30d3\u30b9\u4e00\u751f\u306b\u4e00\u5ea6\u3060\u3051\u66f8\u304f\u3067\u3082OK\u306a\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u7cfb\u30b5\u30fc\u30d3\u30b9\u4e00\u751f\u306b\u4e00\u5ea6\u3060\u3051\u66f8\u304f\u3067\u3082OK\u306a\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u7cfb\u30b5\u30fc\u30d3\u30b9\u4e00\u751f\u306b\u4e00\u5ea6\u3060\u3051\u66f8\u304f\u3067\u3082OK\u306a\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u7cfb\u30b5\u30fc\u30d3\u30b9\u4e00\u751f\u306b\u4e00\u5ea6\u3060\u3051\u66f8\u304f\u3067\u3082OK\u306a\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u7cfb\u30b5\u30fc\u30d3\u30b9",
          "class": "entry",
          "createdDate": "2013-06-14T18:17:59\u002b09:00",
          "more": ""
        }, {
          "excerpt": "\u3070\u30fc\u3069...",
          "status": "Review",
          "date": "2013-06-14T16:48:44\u002b09:00",
          "updatable": true,
          "author": {
            "userpicUrl": null,
            "id": "6",
            "displayName": "yyamaguchi6"
          },
          "allowComments": true,
          "comments": [],
          "permalink": "http://172.17.0.56/blog6/new/memolog3/2013/06/post-5.html",
          "body": "\u3070\u30fc\u3069",
          "keywords": "",
          "allowTrackbacks": false,
          "id": 1051,
          "trackbacks": [],
          "modifiedDate": "2013-06-14T16:48:44\u002b09:00",
          "trackbackCount": "0",
          "categories": [],
          "blog": {
            "id": "5"
          },
          "commentCount": "0",
          "tags": [],
          "basename": "post_5",
          "assets": [],
          "pingsSentUrl": [],
          "title": "\u306f\u3081\u3093\u3050\u3070\u30fc\u3054",
          "class": "entry",
          "createdDate": "2013-06-14T16:48:44\u002b09:00",
          "more": ""
        }, {
          "excerpt": "\u307b\u3052\u307b\u3052\u307b\u3052...",
          "status": "Review",
          "date": "2013-06-11T17:52:23\u002b09:00",
          "updatable": true,
          "author": {
            "userpicUrl": null,
            "id": "6",
            "displayName": "yyamaguchi6"
          },
          "allowComments": true,
          "comments": [],
          "permalink": "http://172.17.0.56/blog6/new/memolog3/2013/06/post-2.html",
          "body": "\u307b\u3052\u307b\u3052\u307b\u3052",
          "keywords": "",
          "allowTrackbacks": false,
          "id": 1047,
          "trackbacks": [],
          "modifiedDate": "2013-06-11T17:52:23\u002b09:00",
          "trackbackCount": "0",
          "categories": [],
          "blog": {
            "id": "5"
          },
          "commentCount": "0",
          "tags": [],
          "basename": "post_2",
          "assets": [],
          "pingsSentUrl": [],
          "title": "\u307b\u3052\u307b\u3052",
          "class": "entry",
          "createdDate": "2013-06-11T17:52:23\u002b09:00",
          "more": ""
        }
      ]
    }, arguments)
  };

  Mock.prototype.statsPageviewsForPath = function () {
    this.base('statsPageviewsForPath', {
      "totalResults": 81,
      "totals": {
        "pageviews": "353"
      },
      "items": [{
          "pageviews": "34",
          "entry": {
            "id": "418"
          },
          "path": "/2012/06/set_input_width_to_100_percent.php",
          "title": "input\u3067width:100%\u3092\u4f7f\u3046\u3068\u82e5\u5e72\u306f\u307f\u51fa\u308b - \u30e1\u30e2\u30ed\u30b0",
          "archiveType": "Individual",
          "category": null,
          "author": null
        }, {
          "pageviews": "26",
          "entry": null,
          "path": "/",
          "title": "\u30e1\u30e2\u30ed\u30b0",
          "archiveType": "index",
          "category": null,
          "author": null
        }, {
          "pageviews": "20",
          "entry": {
            "id": "408"
          },
          "path": "/2012/05/float_and_width_auto.php",
          "title": "float\u3068width:auto - \u30e1\u30e2\u30ed\u30b0",
          "archiveType": "Individual",
          "category": null,
          "author": null
        }, {
          "pageviews": "16",
          "entry": {
            "id": "445"
          },
          "path": "/2013/01/jquery_peformance_about_creating_element.php",
          "title": "jQuery\u3067\u8981\u7d20\u3092\u4f5c\u6210\u3059\u308b\u3068\u304d\u306e\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9 - \u30e1\u30e2\u30ed\u30b0",
          "archiveType": "Individual",
          "category": null,
          "author": null
        }, {
          "pageviews": "16",
          "entry": {
            "id": "452"
          },
          "path": "/2013/02/webkit-overflow-scrolling-touch.php",
          "title": "-webkit-overflow-scrolling\u3068\u6163\u6027\u30b9\u30af\u30ed\u30fc\u30eb - \u30e1\u30e2\u30ed\u30b0",
          "archiveType": "Individual",
          "category": null,
          "author": null
        }, {
          "pageviews": "15",
          "entry": {
            "id": "410"
          },
          "path": "/2012/05/sublime_text_2_zen_coding.php",
          "title": "Sublime Text 2 \u3067 Zen Coding (Emmet) - \u30e1\u30e2\u30ed\u30b0",
          "archiveType": "Individual",
          "category": null,
          "author": null
        }, {
          "pageviews": "14",
          "entry": {
            "id": "455"
          },
          "path": "/2013/04/preparation_for_xxhdpi.php",
          "title": "xxhdpi\u306e\u6e96\u5099\u3068dpi\u3068dp\u306b\u3064\u3044\u3066 - \u30e1\u30e2\u30ed\u30b0",
          "archiveType": "Individual",
          "category": null,
          "author": null
        }, {
          "pageviews": "13",
          "entry": null,
          "path": "/2013/06/ghost_with_android_4_canvas.php",
          "title": "Android 4.1/4.2 \u3067Canvas\u3092\u4f7f\u3046\u3068\u30b4\u30fc\u30b9\u30c8\u304c\u767a\u751f\u3059\u308b - \u30e1\u30e2\u30ed\u30b0",
          "archiveType": null,
          "category": null,
          "author": null
        }, {
          "pageviews": "11",
          "entry": {
            "id": "409"
          },
          "path": "/2012/05/last-child-required-the-last-child-in-the-parent-element.php",
          "title": ":last-child \u306f\u89aa\u8981\u7d20\u304b\u3089\u307f\u3066\u6700\u5f8c\u306e\u5b50\u8981\u7d20 - \u30e1\u30e2\u30ed\u30b0",
          "archiveType": "Individual",
          "category": null,
          "author": null
        }, {
          "pageviews": "11",
          "entry": {
            "id": "420"
          },
          "path": "/2012/06/jquery_masonry.php",
          "title": "\u7e26\u65b9\u5411\u306efloat\u3092\u5b9f\u73fe\u3059\u308bjQuery Masonry - \u30e1\u30e2\u30ed\u30b0",
          "archiveType": "Individual",
          "category": null,
          "author": null
        }
      ]
    }, arguments)
  }

  Mock.prototype.getComment = function (blogId, commentId) {
    this.base('getComment', {
      "link": "http://memolog.org/memolog2/2009/06/kamakura-enoshima.html#comment-338",
      "entry": {
        "id": "806"
      },
      "parent": null,
      "date": "2009-06-14T22:53:43\u002b09:00",
      "status": commentId == 338 ? "Pending" : "Approved",
      "updatable": true,
      "author": {
        "userpicUrl": null,
        "id": null,
        "displayName": "yamaguchi"
      },
      "blog": {
        "id": blogId
      },
      "body": "\u306a\u306b\u305b\u4e00\u30f6\u6708\u524d\u306e\u51fa\u6765\u4e8b\u3067\u3059\u304b\u3089\u30fb\u30fb\u5199\u771f\u304c\u306a\u304b\u3063\u305f\u3089\u5b8c\u5168\u306b\u5fd8\u308c\u3066\u3044\u308b\u3068\u3053\u308d\u3067\u3059\u3002\n\n\u5927\u4ecf\u69d8\u306e\u4e2d\u306b\u5165\u308b\u305f\u3081\u306b\u3001\u5927\u4ecf\u69d8\u3092\u534a\u5468\u3061\u3087\u3063\u3068\u56de\u3089\u306a\u3044\u3068\u5165\u308c\u306a\u3044\u307b\u3069\u4e26\u3093\u3067\u3044\u307e\u3057\u305f\u3002\u4eba\u6c17\u30b9\u30dd\u30c3\u30c8\u306f\u6709\u7d66\u3068\u3063\u3066\u884c\u304f\u306b\u9650\u308a\u307e\u3059\u306d\u3002",
      "id": commentId
    }, arguments)
  }

  Mock.prototype.updateComment = function (blogId, commentId) {
    this.base('updateComment', {
      "link": "http://memolog.org/memolog2/2009/06/kamakura-enoshima.html#comment-338",
      "entry": {
        "id": "806"
      },
      "parent": null,
      "date": "2009-06-14T22:53:43\u002b09:00",
      "status": "Approved",
      "updatable": true,
      "author": {
        "userpicUrl": null,
        "id": null,
        "displayName": "yamaguchi"
      },
      "blog": {
        "id": blogId
      },
      "body": "\u306a\u306b\u305b\u4e00\u30f6\u6708\u524d\u306e\u51fa\u6765\u4e8b\u3067\u3059\u304b\u3089\u30fb\u30fb\u5199\u771f\u304c\u306a\u304b\u3063\u305f\u3089\u5b8c\u5168\u306b\u5fd8\u308c\u3066\u3044\u308b\u3068\u3053\u308d\u3067\u3059\u3002\n\n\u5927\u4ecf\u69d8\u306e\u4e2d\u306b\u5165\u308b\u305f\u3081\u306b\u3001\u5927\u4ecf\u69d8\u3092\u534a\u5468\u3061\u3087\u3063\u3068\u56de\u3089\u306a\u3044\u3068\u5165\u308c\u306a\u3044\u307b\u3069\u4e26\u3093\u3067\u3044\u307e\u3057\u305f\u3002\u4eba\u6c17\u30b9\u30dd\u30c3\u30c8\u306f\u6709\u7d66\u3068\u3063\u3066\u884c\u304f\u306b\u9650\u308a\u307e\u3059\u306d\u3002",
      "id": commentId
    }, arguments)
  }

  Mock.prototype.createReplyComment = function (blogId, entryId, commentId, reply) {
    this.base('createReplyComment', {
      "link": "http://memolog.org/memolog2/2009/06/kamakura-enoshima.html#comment-371",
      "entry": {
        "id": entryId
      },
      "parent": 337,
      "date": "2013-06-19T16:06:28\u002b09:00",
      "status": "Approved",
      "updatable": true,
      "author": reply.author,
      "blog": {
        "id": blogId
      },
      "body": reply.body,
      "id": commentId
    }, arguments)
  }

  Mock.prototype.getEntry = function (blogId, entryId) {
    this.base('getEntry', {
      "excerpt": " \u6700\u8fd1\u3001\u65b0\u3057\u3044\u30d6\u30ed\u30b0\u30b5\u30fc\u30d3\u30b9\u306b\u3064\u3044\u3066\u3001\u3064\u3089\u3064\u3089\u3068\u8003\u3048\u3066\u3044\u307e\u3059\u3002 \u3044\u307e\u306e\u5927\u534a\u306e\u30d6\u30ed\u30b0\u306f\u3001\u6700\u65b0\u9806\u306b\u8a18\u4e8b\u304c\u4e26\u3073\u307e\u3059\u3002 \u3064\u307e\u308a\u3001\u300c\u66f4\u65b0\u3055\u308c\u7d9a\u3051\u308b\u3053\u3068\u300d\u304c\u524d\u63d0\u306e\u30c7\u30b6\u30a4\u30f3\u306b\u306a\u3063\u3066\u3044\u307e\u3059\u3002 \u3060\u304b\u3089\u3001\u66f4\u65b0\u304c\u6b62\u307e\u3063\u305f\u30d6\u30ed\u30b0\u306f\u3001\u30da\u30fc\u30b8\u305d\u306e\u3082\u306e\u306b\u5168\u304f\u5909\u5316\u304c\u306a\u304f\u306a\u308a\u3001\u3068\u3066\u3082\u5bc2\u3057\u3052\u306b\u898b\u3048\u307e\u3059\u3002 \u3057\u304b\u3057\u3001\u305d\u306e\u30d6\u30ed\u30b0\u7ba1\u7406\u4eba\u306f\u3001\u305d\u3082\u305d\u3082\u3001\u66f8\u304d\u305f\u304b\u3063\u305f\u3053\u3068\u306f\uff12\u3064\u304b\uff13\u3064\u304f\u3089\u3044\u3060\u3051\u3060\u3063\u305f\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002 \u300c\u65c5\u884c\u306e\u8a18\u9332\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u300c\u5b9a\u5e74\u9000\u8077\u5f8c\u306b\u81ea\u53d9\u4f1d\u7684\u306a\u3053\u3068\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u3067\u3042\u308a\u3001\u305d\u308c\u306f\u5168\u3066\u66f8\u304d\u7d42\u308f\u3063\u305f\u304b\u3089\u66f4\u65b0\u7d42\u308f\u308a\uff01\u3068\u3044\u3046\u3053\u3068\u306a\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002 Twitter\u3084Facebook\u306b\u66f8\u3051\u3070\u3044\u3044\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002 \u3057\u304b\u3057\u3001\u30d5\u30ec\u30f3\u30c9\u3068\u60c5\u5831\u3092\u30b7\u30a7\u30a2\u3059\u308b\u3060\u3051\u3058\u3083\u6e80\u8db3\u3067\u304d\u306a\u3044\u3068\u304d\u3082\u3042\u308b\u3067\u3057\u3087\u3046\u3002 \u3082\u3046\u3061\u3087\u3063\u3068\u91ce\u5fc3\u304c\u3042\u308b\u3002 \u5e83\u304f\u30cd\u30c3\u30c8\u5168\u4f53\u306b\u516c\u958b\u3057\u3066\u3001\u77e5\u308a\u5408\u3044\u4ee5\u5916\u306e\u5927\u52e2\u306e\u4eba\u306b\u8aad\u3093\u3067\u6b32\u3057\u3044\u3002 \u307e\u305f\u306f\u3001\u81ea\u5206\u304c\u3069\u306e\u304f\u3089\u3044\u53cb\u3060\u3061\u304c\u591a\u3044\u304b\uff0f\u5c11\u306a\u3044\u304b\u3001\u6709\u540d\u304b\uff0f\u7121\u540d\u304b\u3001\u3067\u306f\u306a\u304f\u3001\u7d14\u7c8b\u306b\u66f8\u3044\u305f\u5185\u5bb9\u306e\u5584\u3057\u60aa\u3057\u3067\u52dd\u8ca0\u3057\u305f\u3044\u3002 \u305d\u3053\u3067\u3002 \u3044\u307e\u3001\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u30b5\u30fc\u30d3\u30b9\u3092\u8003\u3048\u3066\u3044\u307e\u3059\u3002...",
      "status": entryId == 1054 ? "Review" : "Publish",
      "date": "2013-06-14T18:17:59\u002b09:00",
      "updatable": true,
      "author": {
        "userpicUrl": null,
        "id": "6",
        "displayName": "yyamaguchi"
      },
      "allowComments": true,
      "comments": [],
      "permalink": "http://172.17.0.56/blog6/new/memolog3/2013/06/okokokokok.html",
      "keywords": "",
      "body": "\u003cdiv class=\"entry-content\"\u003e\r\n\r\n\u003cp\u003e\u6700\u8fd1\u3001\u65b0\u3057\u3044\u30d6\u30ed\u30b0\u30b5\u30fc\u30d3\u30b9\u306b\u3064\u3044\u3066\u3001\u3064\u3089\u3064\u3089\u3068\u8003\u3048\u3066\u3044\u307e\u3059\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cimg alt=\"kdp2013060601.jpg\" src=\"http://blog.sixapart.jp/kdp2013060601.jpg\" width=\"375\" height=\"200\" class=\"mt-image-center\" style=\"text-align: center; display: block; margin: 0 auto 20px;\"\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3044\u307e\u306e\u5927\u534a\u306e\u30d6\u30ed\u30b0\u306f\u3001\u6700\u65b0\u9806\u306b\u8a18\u4e8b\u304c\u4e26\u3073\u307e\u3059\u3002\u003cbr\u003e\r\n\u3064\u307e\u308a\u3001\u300c\u66f4\u65b0\u3055\u308c\u7d9a\u3051\u308b\u3053\u3068\u300d\u304c\u524d\u63d0\u306e\u30c7\u30b6\u30a4\u30f3\u306b\u306a\u3063\u3066\u3044\u307e\u3059\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3060\u304b\u3089\u3001\u66f4\u65b0\u304c\u6b62\u307e\u3063\u305f\u30d6\u30ed\u30b0\u306f\u3001\u30da\u30fc\u30b8\u305d\u306e\u3082\u306e\u306b\u5168\u304f\u5909\u5316\u304c\u306a\u304f\u306a\u308a\u3001\u3068\u3066\u3082\u5bc2\u3057\u3052\u306b\u898b\u3048\u307e\u3059\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3057\u304b\u3057\u3001\u305d\u306e\u30d6\u30ed\u30b0\u7ba1\u7406\u4eba\u306f\u3001\u305d\u3082\u305d\u3082\u3001\u66f8\u304d\u305f\u304b\u3063\u305f\u3053\u3068\u306f\uff12\u3064\u304b\uff13\u3064\u304f\u3089\u3044\u3060\u3051\u3060\u3063\u305f\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u003cbr\u003e\r\n\u300c\u65c5\u884c\u306e\u8a18\u9332\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u300c\u5b9a\u5e74\u9000\u8077\u5f8c\u306b\u81ea\u53d9\u4f1d\u7684\u306a\u3053\u3068\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u3067\u3042\u308a\u3001\u305d\u308c\u306f\u5168\u3066\u66f8\u304d\u7d42\u308f\u3063\u305f\u304b\u3089\u66f4\u65b0\u7d42\u308f\u308a\uff01\u3068\u3044\u3046\u3053\u3068\u306a\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003eTwitter\u3084Facebook\u306b\u66f8\u3051\u3070\u3044\u3044\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3057\u304b\u3057\u3001\u30d5\u30ec\u30f3\u30c9\u3068\u60c5\u5831\u3092\u30b7\u30a7\u30a2\u3059\u308b\u3060\u3051\u3058\u3083\u6e80\u8db3\u3067\u304d\u306a\u3044\u3068\u304d\u3082\u3042\u308b\u3067\u3057\u3087\u3046\u3002\u003cbr\u003e\r\n\u3082\u3046\u3061\u3087\u3063\u3068\u91ce\u5fc3\u304c\u3042\u308b\u3002\u003cbr\u003e\r\n\u5e83\u304f\u30cd\u30c3\u30c8\u5168\u4f53\u306b\u516c\u958b\u3057\u3066\u3001\u77e5\u308a\u5408\u3044\u4ee5\u5916\u306e\u5927\u52e2\u306e\u4eba\u306b\u8aad\u3093\u3067\u6b32\u3057\u3044\u3002\u003cbr\u003e\r\n\u307e\u305f\u306f\u3001\u81ea\u5206\u304c\u3069\u306e\u304f\u3089\u3044\u53cb\u3060\u3061\u304c\u591a\u3044\u304b\uff0f\u5c11\u306a\u3044\u304b\u3001\u6709\u540d\u304b\uff0f\u7121\u540d\u304b\u3001\u3067\u306f\u306a\u304f\u3001\u7d14\u7c8b\u306b\u66f8\u3044\u305f\u5185\u5bb9\u306e\u5584\u3057\u60aa\u3057\u3067\u52dd\u8ca0\u3057\u305f\u3044\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u305d\u3053\u3067\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3044\u307e\u3001\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u30b5\u30fc\u30d3\u30b9\u3092\u8003\u3048\u3066\u3044\u307e\u3059\u3002\u003cbr\u003e\r\n\u003c/p\u003e\r\n\r\n    \u003c/div\u003e",
      "allowTrackbacks": false,
      "id": entryId,
      "trackbacks": [],
      "modifiedDate": "2013-06-14T18:17:59\u002b09:00",
      "trackbackCount": "0",
      "categories": [],
      "blog": {
        "id": blogId
      },
      "commentCount": "0",
      "tags": [],
      "basename": "okokokokok",
      "assets": [],
      "pingsSentUrl": [],
      "title": "\u4e00\u751f\u306b\u4e00\u5ea6\u3060\u3051\u66f8\u304f\u3067\u3082OK\u306a\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u7cfb\u30b5\u30fc\u30d3\u30b9",
      "class": "entry",
      "createdDate": "2013-06-14T18:17:59\u002b09:00",
      "more": ""
    }, arguments);
  }

  Mock.prototype.updateEntry = function (blogId, entryId) {
    this.base('updateEntry', {
      "excerpt": " \u6700\u8fd1\u3001\u65b0\u3057\u3044\u30d6\u30ed\u30b0\u30b5\u30fc\u30d3\u30b9\u306b\u3064\u3044\u3066\u3001\u3064\u3089\u3064\u3089\u3068\u8003\u3048\u3066\u3044\u307e\u3059\u3002 \u3044\u307e\u306e\u5927\u534a\u306e\u30d6\u30ed\u30b0\u306f\u3001\u6700\u65b0\u9806\u306b\u8a18\u4e8b\u304c\u4e26\u3073\u307e\u3059\u3002 \u3064\u307e\u308a\u3001\u300c\u66f4\u65b0\u3055\u308c\u7d9a\u3051\u308b\u3053\u3068\u300d\u304c\u524d\u63d0\u306e\u30c7\u30b6\u30a4\u30f3\u306b\u306a\u3063\u3066\u3044\u307e\u3059\u3002 \u3060\u304b\u3089\u3001\u66f4\u65b0\u304c\u6b62\u307e\u3063\u305f\u30d6\u30ed\u30b0\u306f\u3001\u30da\u30fc\u30b8\u305d\u306e\u3082\u306e\u306b\u5168\u304f\u5909\u5316\u304c\u306a\u304f\u306a\u308a\u3001\u3068\u3066\u3082\u5bc2\u3057\u3052\u306b\u898b\u3048\u307e\u3059\u3002 \u3057\u304b\u3057\u3001\u305d\u306e\u30d6\u30ed\u30b0\u7ba1\u7406\u4eba\u306f\u3001\u305d\u3082\u305d\u3082\u3001\u66f8\u304d\u305f\u304b\u3063\u305f\u3053\u3068\u306f\uff12\u3064\u304b\uff13\u3064\u304f\u3089\u3044\u3060\u3051\u3060\u3063\u305f\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002 \u300c\u65c5\u884c\u306e\u8a18\u9332\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u300c\u5b9a\u5e74\u9000\u8077\u5f8c\u306b\u81ea\u53d9\u4f1d\u7684\u306a\u3053\u3068\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u3067\u3042\u308a\u3001\u305d\u308c\u306f\u5168\u3066\u66f8\u304d\u7d42\u308f\u3063\u305f\u304b\u3089\u66f4\u65b0\u7d42\u308f\u308a\uff01\u3068\u3044\u3046\u3053\u3068\u306a\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002 Twitter\u3084Facebook\u306b\u66f8\u3051\u3070\u3044\u3044\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002 \u3057\u304b\u3057\u3001\u30d5\u30ec\u30f3\u30c9\u3068\u60c5\u5831\u3092\u30b7\u30a7\u30a2\u3059\u308b\u3060\u3051\u3058\u3083\u6e80\u8db3\u3067\u304d\u306a\u3044\u3068\u304d\u3082\u3042\u308b\u3067\u3057\u3087\u3046\u3002 \u3082\u3046\u3061\u3087\u3063\u3068\u91ce\u5fc3\u304c\u3042\u308b\u3002 \u5e83\u304f\u30cd\u30c3\u30c8\u5168\u4f53\u306b\u516c\u958b\u3057\u3066\u3001\u77e5\u308a\u5408\u3044\u4ee5\u5916\u306e\u5927\u52e2\u306e\u4eba\u306b\u8aad\u3093\u3067\u6b32\u3057\u3044\u3002 \u307e\u305f\u306f\u3001\u81ea\u5206\u304c\u3069\u306e\u304f\u3089\u3044\u53cb\u3060\u3061\u304c\u591a\u3044\u304b\uff0f\u5c11\u306a\u3044\u304b\u3001\u6709\u540d\u304b\uff0f\u7121\u540d\u304b\u3001\u3067\u306f\u306a\u304f\u3001\u7d14\u7c8b\u306b\u66f8\u3044\u305f\u5185\u5bb9\u306e\u5584\u3057\u60aa\u3057\u3067\u52dd\u8ca0\u3057\u305f\u3044\u3002 \u305d\u3053\u3067\u3002 \u3044\u307e\u3001\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u30b5\u30fc\u30d3\u30b9\u3092\u8003\u3048\u3066\u3044\u307e\u3059\u3002...",
      "status": "Publish",
      "date": "2013-06-14T18:17:59\u002b09:00",
      "updatable": true,
      "author": {
        "userpicUrl": null,
        "id": "6",
        "displayName": "yyamaguchi"
      },
      "allowComments": true,
      "comments": [],
      "permalink": "http://172.17.0.56/blog6/new/memolog3/2013/06/okokokokok.html",
      "keywords": "",
      "body": "\u003cdiv class=\"entry-content\"\u003e\r\n\r\n\u003cp\u003e\u6700\u8fd1\u3001\u65b0\u3057\u3044\u30d6\u30ed\u30b0\u30b5\u30fc\u30d3\u30b9\u306b\u3064\u3044\u3066\u3001\u3064\u3089\u3064\u3089\u3068\u8003\u3048\u3066\u3044\u307e\u3059\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u003cimg alt=\"kdp2013060601.jpg\" src=\"http://blog.sixapart.jp/kdp2013060601.jpg\" width=\"375\" height=\"200\" class=\"mt-image-center\" style=\"text-align: center; display: block; margin: 0 auto 20px;\"\u003e\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3044\u307e\u306e\u5927\u534a\u306e\u30d6\u30ed\u30b0\u306f\u3001\u6700\u65b0\u9806\u306b\u8a18\u4e8b\u304c\u4e26\u3073\u307e\u3059\u3002\u003cbr\u003e\r\n\u3064\u307e\u308a\u3001\u300c\u66f4\u65b0\u3055\u308c\u7d9a\u3051\u308b\u3053\u3068\u300d\u304c\u524d\u63d0\u306e\u30c7\u30b6\u30a4\u30f3\u306b\u306a\u3063\u3066\u3044\u307e\u3059\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3060\u304b\u3089\u3001\u66f4\u65b0\u304c\u6b62\u307e\u3063\u305f\u30d6\u30ed\u30b0\u306f\u3001\u30da\u30fc\u30b8\u305d\u306e\u3082\u306e\u306b\u5168\u304f\u5909\u5316\u304c\u306a\u304f\u306a\u308a\u3001\u3068\u3066\u3082\u5bc2\u3057\u3052\u306b\u898b\u3048\u307e\u3059\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3057\u304b\u3057\u3001\u305d\u306e\u30d6\u30ed\u30b0\u7ba1\u7406\u4eba\u306f\u3001\u305d\u3082\u305d\u3082\u3001\u66f8\u304d\u305f\u304b\u3063\u305f\u3053\u3068\u306f\uff12\u3064\u304b\uff13\u3064\u304f\u3089\u3044\u3060\u3051\u3060\u3063\u305f\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u003cbr\u003e\r\n\u300c\u65c5\u884c\u306e\u8a18\u9332\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u300c\u5b9a\u5e74\u9000\u8077\u5f8c\u306b\u81ea\u53d9\u4f1d\u7684\u306a\u3053\u3068\u3092\u66f8\u304d\u305f\u304b\u3063\u305f\u3060\u3051\u300d\u3067\u3042\u308a\u3001\u305d\u308c\u306f\u5168\u3066\u66f8\u304d\u7d42\u308f\u3063\u305f\u304b\u3089\u66f4\u65b0\u7d42\u308f\u308a\uff01\u3068\u3044\u3046\u3053\u3068\u306a\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003eTwitter\u3084Facebook\u306b\u66f8\u3051\u3070\u3044\u3044\u306e\u304b\u3082\u3057\u308c\u307e\u305b\u3093\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3057\u304b\u3057\u3001\u30d5\u30ec\u30f3\u30c9\u3068\u60c5\u5831\u3092\u30b7\u30a7\u30a2\u3059\u308b\u3060\u3051\u3058\u3083\u6e80\u8db3\u3067\u304d\u306a\u3044\u3068\u304d\u3082\u3042\u308b\u3067\u3057\u3087\u3046\u3002\u003cbr\u003e\r\n\u3082\u3046\u3061\u3087\u3063\u3068\u91ce\u5fc3\u304c\u3042\u308b\u3002\u003cbr\u003e\r\n\u5e83\u304f\u30cd\u30c3\u30c8\u5168\u4f53\u306b\u516c\u958b\u3057\u3066\u3001\u77e5\u308a\u5408\u3044\u4ee5\u5916\u306e\u5927\u52e2\u306e\u4eba\u306b\u8aad\u3093\u3067\u6b32\u3057\u3044\u3002\u003cbr\u003e\r\n\u307e\u305f\u306f\u3001\u81ea\u5206\u304c\u3069\u306e\u304f\u3089\u3044\u53cb\u3060\u3061\u304c\u591a\u3044\u304b\uff0f\u5c11\u306a\u3044\u304b\u3001\u6709\u540d\u304b\uff0f\u7121\u540d\u304b\u3001\u3067\u306f\u306a\u304f\u3001\u7d14\u7c8b\u306b\u66f8\u3044\u305f\u5185\u5bb9\u306e\u5584\u3057\u60aa\u3057\u3067\u52dd\u8ca0\u3057\u305f\u3044\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u305d\u3053\u3067\u3002\u003c/p\u003e\r\n\r\n\u003cp\u003e\u3044\u307e\u3001\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u30b5\u30fc\u30d3\u30b9\u3092\u8003\u3048\u3066\u3044\u307e\u3059\u3002\u003cbr\u003e\r\n\u003c/p\u003e\r\n\r\n    \u003c/div\u003e",
      "allowTrackbacks": false,
      "id": entryId,
      "trackbacks": [],
      "modifiedDate": "2013-06-14T18:17:59\u002b09:00",
      "trackbackCount": "0",
      "categories": [],
      "blog": {
        "id": blogId
      },
      "commentCount": "0",
      "tags": [],
      "basename": "okokokokok",
      "assets": [],
      "pingsSentUrl": [],
      "title": "\u4e00\u751f\u306b\u4e00\u5ea6\u3060\u3051\u66f8\u304f\u3067\u3082OK\u306a\u300c\u305f\u307e\u306b\u66f8\u304f\u30d6\u30ed\u30b0\u300d\u7cfb\u30b5\u30fc\u30d3\u30b9",
      "class": "entry",
      "createdDate": "2013-06-14T18:17:59\u002b09:00",
      "more": ""
    }, arguments);
  }

  Mock.prototype.uploadAsset = function (blogId, entryId) {
    this.base('uploadAsset', {
      error: 'error'
    }, arguments)
  };

  Mock.prototype.revokeAuthentication = function () {
    this.base('revokeAuthentication', {
      status: 'success'
    }, arguments)
  };

  window.MT = window.MT || {};
  MT.DataAPI = Mock;

  return Mock;
});