/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'MTIcon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-user' : '&#x6f;',
			'icon-arrow-down-right' : '&#x64;',
			'icon-arrow-up-right' : '&#x75;',
			'icon-arrow-right' : '&#x3d;',
			'icon-arrow-up' : '&#x5e;',
			'icon-arrow-down' : '&#x62;',
			'icon-arrow' : '&#x3e;',
			'icon-upload' : '&#x23;',
			'icon-undo-arrow' : '&#x24;',
			'icon-twitter' : '&#x25;',
			'icon-comment' : '&#x28;',
			'icon-close' : '&#x29;',
			'icon-check' : '&#x2a;',
			'icon-browser' : '&#x2b;',
			'icon-arrow-left' : '&#x3c;',
			'icon-upload-fail' : '&#x21;',
			'icon-share' : '&#x26;',
			'icon-loading' : '&#x27;',
			'icon-plus' : '&#x22;',
			'icon-app_icon_outline' : '&#x2c;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};