import { type RouteLocationNormalized } from "vue-router";

export function trackPageView(to: RouteLocationNormalized, from?: RouteLocationNormalized): void {
	const url = to.fullPath;
	const referrer = from?.fullPath;
	const title = to.meta["title"] ?? document.title;

	window._paq?.push(["setReferrerUrl", referrer]);
	window._paq?.push(["setCustomUrl", url]);
	window._paq?.push(["setDocumentTitle", title]);
	window._paq?.push(["trackPageView"]);
	window._paq?.push(["enableLinkTracking"]);
}

declare global {
	interface Window {
		_paq?: Array<unknown>;
	}
}

export function createAnalyticsScript(baseUrl: string, id: string): string {
	return `
  var _paq = (window._paq = window._paq || [])
  _paq.push(['disableCookies'])
  _paq.push(['enableHeartBeatTimer'])
  ;(function () {
    var u = '${baseUrl}'
    _paq.push(['setTrackerUrl', u + 'matomo.php'])
    _paq.push(['setSiteId', '${id}'])
    var d = document,
      g = d.createElement('script'),
      s = d.getElementsByTagName('script')[0]
    g.async = true
    g.src = u + 'matomo.js'
    s.parentNode.insertBefore(g, s)
  })()`;
}
