type LogFn = (...args: any[]) => void;
export declare const logger: {
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    warn: LogFn;
    error: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    devError: LogFn;
    logCaller: LogFn;
    page: LogFn;
};
export {};
