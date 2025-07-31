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
    prod: {
        log: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
        warn: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
        logCaller: (...args: any[]) => void;
        page: () => void;
    };
};
export {};
