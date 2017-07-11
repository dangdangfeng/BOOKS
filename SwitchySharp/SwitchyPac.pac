function regExpMatch(url, pattern) {    try { return new RegExp(pattern).test(url); } catch(ex) { return false; }    }
    function FindProxyForURL(url, host) {
	if (shExpMatch(url, "*://*.csdn.net/*") || shExpMatch(url, "*://csdn.net/*")) return 'PROXY proxy.corp.qihoo.net:8080';
	return 'DIRECT';
}