"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageStore = pageStore;
function pageStore() {
    let listeners = [];
    function getPage() {
        const url = new URL(window.location.href);
        return {
            url,
            protocol: url.protocol,
            host: url.host,
            hostname: url.hostname,
            port: url.port,
            origin: url.origin,
            pathname: url.pathname,
            fullPath: url.pathname + url.search + url.hash,
            query: Object.fromEntries(url.searchParams.entries()),
            search: url.search,
            hash: url.hash,
            params: {},
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        };
    }
    function notify() {
        const page = getPage();
        for (const cb of listeners)
            cb(page);
    }
    window.addEventListener('popstate', notify);
    window.addEventListener('hashchange', notify);
    for (const method of ['pushState', 'replaceState']) {
        const original = history[method];
        history[method] = function (...args) {
            original.apply(this, args);
            notify();
        };
    }
    return {
        subscribe(callback) {
            listeners.push(callback);
            callback(getPage());
            return () => {
                listeners = listeners.filter((cb) => cb !== callback);
            };
        },
        get: getPage
    };
}
