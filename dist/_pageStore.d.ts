export interface PageInfo {
    url: URL;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    origin: string;
    pathname: string;
    fullPath: string;
    query: Record<string, string>;
    search: string;
    hash: string;
    params: Record<string, string>;
    referrer: string;
    userAgent: string;
    timestamp: number;
}
type PageStoreCallback = (page: PageInfo) => void;
export declare function pageStore(): {
    subscribe(callback: PageStoreCallback): () => void;
    get: () => PageInfo;
};
export {};
//# sourceMappingURL=_pageStore.d.ts.map