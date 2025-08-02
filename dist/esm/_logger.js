import { pageStore } from "./_pageStore";
import { callerName, isDev } from "./_utils";
const dev = isDev();
const noop = () => { };
export const logger = {
    log: dev ? console.log.bind(console) : noop,
    warn: dev ? console.warn.bind(console) : noop,
    error: console.error.bind(console),
    devError: dev ? console.error.bind(console) : noop,
    logCaller: dev
        ? (...args) => {
            const name = callerName(3);
            console.log(`${name}()`, ...args);
        }
        : noop,
    page: dev
        ? () => {
            console.log("Page:", pageStore().get());
        }
        : noop,
    prod: {
        log: console.log.bind(console),
        warn: console.warn.bind(console),
        logCaller: (...args) => {
            const name = callerName(3);
            console.log(`${name}()`, ...args);
        },
        page: () => {
            console.log("Page:", pageStore().get());
        }
    }
};
