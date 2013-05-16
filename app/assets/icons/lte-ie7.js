/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'MTIcon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-arrow-left' : '&#x3c;',
			'icon-menu' : '&#x3d;',
			'icon-checkmark' : '&#x76;',
			'icon-pen' : '&#x23;',
			'icon-user' : '&#x6f;',
			'icon-arrow-right' : '&#x3e;',
			'icon-cog' : '&#x2a;',
			'icon-bubble' : '&#x63;',
			'icon-paper-plane' : '&#x74;'
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