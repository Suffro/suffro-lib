import { AnySchema } from 'ajv';

type PasswordStrength = {
    text: 'very weak';
    score: 0;
} | {
    text: 'weak';
    score: 1;
} | {
    text: 'medium';
    score: 2;
} | {
    text: 'strong';
    score: 3;
} | {
    text: 'very strong';
    score: 4;
};
type DropdownOption = {
    label: string;
    value: string | number;
    id: string;
    flag?: string;
};
type AnyObject = Record<string, any>;
type HexColor = `#${string}`;

declare const isBrowser: () => boolean;
declare const isWindowAvailable: () => boolean;
declare const isDev: () => boolean;
declare function stringStartsWith(input: string, prefix: string, caseSensitive?: boolean): boolean;
type FileValidationResult = {
    valid: boolean;
    error?: string;
};
/**
 * Validates a file by checking its MIME type and maximum size.
 * @param file - The file to validate (can be null or undefined).
 * @param maxSizeMB - Maximum allowed size in MB (default: 2).
 * @param allowedTypes - Allowed MIME types (default: empty = all types allowed).
 * @returns Validation result object.
 */
declare function validateFile(file: File | Blob | null | undefined, maxSizeMB?: number, allowedTypes?: string[]): FileValidationResult;
declare function imageExistsAtURL(url: string, bustCache?: boolean): Promise<boolean>;
declare function clearUrl(input: string, domainOnly?: boolean): string | null;
/**
 * Estrae il sottodominio da un URL o dal dominio corrente (es. builder.bubbledesk.app → "builder").
 *
 * ⚠️ Restituisce `null` se non è presente alcun sottodominio (es. bubbledesk.app o localhost).
 *
 * @param url - (opzionale) Una stringa URL da cui estrarre il sottodominio. Se non fornita, usa `window.location.hostname`.
 * @returns Il sottodominio come stringa, oppure `null` se non rilevabile.
 *
 * @example
 * getSubdomain("https://auth.bubbledesk.app"); // "auth"
 * getSubdomain(); // se eseguito su builder.bubbledesk.app → "builder"
 * getSubdomain("https://bubbledesk.app"); // null
 * getSubdomain("http://localhost:5173"); // null
 */
declare const getSubdomain: (url?: string) => string | null;
/**
 *
 * @param options.reload If true, redirect url and related logic will be ignored
 */
declare const redirectOrReload: (options?: {
    redirectUrl?: string;
    reload?: boolean;
    redirectReplace?: boolean;
}) => void;
declare function checkPasswordStrength(password: string): PasswordStrength;
declare function capitalize(str: string): string;
declare function formSubmit(callback: () => void | Promise<void>): (event: SubmitEvent) => Promise<void>;
declare function capitalizeEachWord(input: string): string;
declare function parseCookie(header: string): Record<string, string>;
declare function isLocalhost(): boolean;
declare function getUrlParam(param: string): string | null;
declare function sleep(seconds: number): Promise<void>;
declare const removeWWW: (host: string | null) => string | null;
declare function mapToObject(value: any): any;
declare function getRandomNumber(min?: number, max?: number, integer?: boolean): number;
declare function getRandomString(options?: {
    length?: number;
    includeUppercase?: boolean;
    prefix?: string;
}): string;
declare function arrrayGetLast<T>(arr: T[]): T | undefined;
declare function getPathList(path?: string): string[] | null | undefined;
declare function getCurrentPath(path?: string): string | null | undefined;
declare function buildPath(parts: string[], endIndex?: number): string;
declare function detectAnalysisFileType(filename: string): string;
declare function scrollToElement(target: string | HTMLElement, offset?: number, scrollBehavior?: ScrollBehavior): void;
declare function clickOutside(node: HTMLElement, callback: () => void): {
    destroy(): void;
};
declare const setHiddenStatus: (element: string | HTMLElement, hidden: boolean) => void;
declare const toggleHiddenStatus: (element: string | HTMLElement) => void;
declare function toHtmlId(str: string): string;
declare function toggleArrayItem<T>(array: T[], item: T): T[];
declare function updateUniqueArray<T>(array: T[], item: T, action: "add" | "remove"): T[];
declare function updateArrayByKey<T, K extends keyof T>(array: T[], item: T, action: "add" | "remove", key?: K): T[];
declare function toCamelCase(input: string): string;
declare function toSnakeCase(input: string): string;
declare function portal(node: HTMLElement, target?: HTMLElement): {
    destroy(): void;
};
declare function isValidTimeStr(timeStr: string): boolean;
declare function isValidDate(date: Date): boolean;
declare function formatDateForInput(date: Date): string | undefined;
declare function addMinutesToTime(timeStr: string, minutesToAdd: number): string | undefined;
declare function setTimeForDate(date: Date, timeStr: string): Date;
declare function addMinutesToDate(date: Date, minutesToAdd: number, dateTimeStr?: string): Date | undefined;
declare function parseDate(dateStr: string, fallbackToToday?: boolean): Date | null;
declare function dateToTime24h(date: Date): string | null;
declare function dateToTime12h(date: Date): string | null;
declare function URLGetParam(paramName: string, url?: string): string | null;
declare function isSameMonth(date1: Date, date2: Date): boolean;
declare function isSameYear(date1: unknown, date2: unknown): boolean;
declare function getMidpointDate(date1: Date, date2: Date): Date;
declare function getYearBounds(date?: Date): {
    start: Date;
    end: Date;
};
declare function callerName(level?: number): string;
declare function arrayGetByKey<T, K extends keyof T>(array: T[], value: T[K], key?: K): T[];
declare function checkFileSize(files: FileList | File[], maxSizeMB: number): {
    valid: boolean;
    message?: string;
};
declare function getMatchScore(text: string, term: string): number;
declare const componentCallbackDispatcher: (callback: Function, data?: any) => void;
declare function objectsDiffer<T extends Record<string, any>>(a: Partial<T>, b: Partial<T>, strict?: boolean): boolean;
declare function removeNullish<T extends object>(obj: T): Partial<T>;
type FlattenOptions = {
    useDotNotation?: boolean;
};
declare function flattenObject(obj: Record<string, any>, options?: FlattenOptions): Record<string, any>;
/**
 * @param normalizeMonthly If true and units is months or years, it will normalize the start and end date to the first and last day of the first and last month.
 */
declare function getTimeBounds(midpoint: Date | string, before: number, after: number, unit: "minutes" | "days" | "months" | "years", normalizeMonthly?: boolean): {
    start: Date;
    end: Date;
};
declare function listMonthsInRange(start: Date | string, end: Date | string, format?: "YYYY-MM" | "YYYY-MMM" | "YYYY-MMMM", options?: {
    locale?: string;
    excludeStart?: boolean;
    excludeEnd?: boolean;
    descending?: boolean;
}): string[];
/**
 * @param monthKey (deve essere in formato YYYY-MM)
 * @returns Restituisce un oggetto contente start e end
 */
declare function getMonthBoundsByYearMonthString(monthKey: string): {
    start: Date;
    end: Date;
};
/**
 * @returns The month of the passed date as string in the format YYYY-MM (eg. 2025-05), in UTC
 */
declare function getYearMonthStringFromDate(date: Date): string;
/**
 * @returns Restituisce un oggetto contente start e end
 */
declare function getMonthBounds(date: Date): {
    start: Date;
    end: Date;
};
/**
 * Unisce l'array originale con nuovi oggetti, sovrascrivendo quelli con la stessa chiave.
 * @param original Array originale
 * @param updates Nuovi oggetti da aggiungere o aggiornare
 * @param key Chiave identificativa (default: "id")
 * @returns Nuovo array aggiornato
 */
declare function mergeByKey<T extends AnyObject>(original: T[], updates: T[], key?: keyof T): T[];
/**
 * Rimuove un elemento da un array di oggetti confrontando un campo chiave.
 *
 * @param array - L'array di oggetti da cui rimuovere l'elemento
 * @param value - Il valore da confrontare per la rimozione
 * @param key - Il campo su cui fare il confronto (default: "id")
 * @returns Un nuovo array senza l'elemento corrispondente
 */
declare function removeFromArrayByKey<T extends Record<string, any>>(array: T[], value: any, key?: string): T[];
declare function hexToRgb(hexString?: HexColor): string | "";
declare function copyToClipboard(text: string, callback?: Function): Promise<void>;
/**
 * Reloads the page with the given query parameters if they are not already present or different.
 * Prevents infinite loops by comparing current parameters with target ones.
 * Optionally appends a hash anchor (e.g., #section) for native browser scrolling.
 *
 * @param newParams An object containing key-value pairs to be added to the URL.
 * @param anchor Optional ID of the element to scroll to after reload (e.g. 'comments')
 */
declare function URLReload(newParams?: Record<string, string>, anchor?: string): void;
declare function flagEmojiToCountryCode(flag: string): string;
declare const wait: (timeout?: number, callback?: VoidFunction) => Promise<void>;
declare const dropdownOptionsFromStrings: (strings: string[]) => DropdownOption[];
/** Redact likely-sensitive data and normalize message */
declare function sanitizeMessageSensitiveData(msg: string, maxLen?: number): string;
type ErrorInfo = {
    message: string;
    code?: string | number;
};
/**
 *
 * @param err The error to extract message and code from
 * @param sanitize Wether to sanitize the error message, removing potential sensitive data
 * @returns Error info in the format of { message, code}
 */
declare function getErrorInfo(err: unknown, sanitize?: boolean): ErrorInfo;
/**
 * Serializes an arbitrary values into a deterministic, hash-friendly string.
 *
 * - Objects are serialized with sorted keys to ensure stable ordering.
 * - Arrays are serialized by preserving element order.
 * - Dates are converted to ISO strings.
 * - Files are represented by stable metadata (name, size, lastModified).
 *
 * @param value - The value or values to serialize.
 * @returns A deterministic string representation.
 */
declare function serializeToString(value: unknown): string;
declare function createHashInput(values: unknown[], separator?: string): string;
declare function arrayIncludesString(arr: string[], needle: string, caseSensitive?: boolean): boolean;

type LogFn = (...args: any[]) => void;
declare const logger: {
    log: LogFn;
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

type AnyFunc = (...args: any[]) => any;
type AsyncFunc = (...args: any[]) => Promise<any>;
type GenFunc = (...args: any[]) => Generator<any, any, any>;
interface Validate {
    string(v: unknown): v is string;
    url(v: unknown): v is string;
    nonEmptyString(v: unknown): v is string;
    number(v: unknown): v is number;
    integer(v: unknown): v is number;
    boolean(v: unknown): v is boolean;
    bigint(v: unknown): v is bigint;
    symbol(v: unknown): v is symbol;
    numeric(v: unknown): boolean;
    finiteNumber(v: unknown): v is number;
    dateString(v: unknown): v is string;
    date(v: unknown): v is Date;
    isoDateString(v: unknown): v is string;
    isoDateTimeString(v: unknown): v is string;
    null(v: unknown): v is null;
    undefined(v: unknown): v is undefined;
    defined<T>(v: T | null | undefined): v is T;
    nan(v: unknown): v is number;
    object(v: unknown): v is Record<string, unknown>;
    plainObject(v: unknown): v is Record<string, unknown>;
    emptyObject(v: unknown): v is Record<string, never>;
    array<T = unknown>(v: unknown): v is T[];
    nonEmptyArray<T = unknown>(v: unknown): v is T[];
    set<T = unknown>(v: unknown): v is Set<T>;
    map<K = unknown, V = unknown>(v: unknown): v is Map<K, V>;
    weakSet<T extends object = object>(v: unknown): v is WeakSet<T>;
    weakMap<K extends object = object, V = unknown>(v: unknown): v is WeakMap<K, V>;
    arrayBuffer(v: unknown): v is ArrayBuffer;
    dataView(v: unknown): v is DataView;
    typedArray(v: unknown): v is Exclude<ArrayBufferView, DataView>;
    regexp(v: unknown): v is RegExp;
    promise<T = unknown>(v: unknown): v is Promise<T>;
    function(v: unknown): v is AnyFunc;
    asyncFunction(v: unknown): v is AsyncFunc;
    generatorFunction(v: unknown): v is GenFunc;
    email(v: unknown): v is string;
    uuid(v: unknown): v is string;
    hexColor(v: unknown): v is string;
    ipv4(v: unknown): v is string;
    ipv6(v: unknown): v is string;
    jsonString(v: unknown): v is string;
    truthy(v: unknown): boolean;
    falsy(v: unknown): boolean;
}
declare const validate: Validate;

type BrowserStorageType = "local" | "session";
interface _BrowserStorageAPI {
    getItem(key: string): unknown | null;
    getNamespaceItems(): {
        key: string;
        value: unknown;
    }[];
    getItemsByKeys(keys: string[]): {
        key: string;
        value: unknown;
    }[];
    setItem(key: string, value: unknown, options?: {
        expiresIn?: number;
    }): void;
    removeItem(key: string): void;
    clear(): void;
    clearExpired(): void;
    length(): number;
    keysList(): string[];
}
declare function browserStorage(type: BrowserStorageType, namespace?: string): _BrowserStorageAPI;

/**
 * Descrive tutte le informazioni rilevanti sulla pagina corrente,
 * ispirato allo store `$page` di SvelteKit ma in ambiente JavaScript puro.
 */
interface PageInfo {
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
/**
 * Crea uno store reattivo che fornisce informazioni aggiornate sulla pagina corrente.
 * Si comporta in modo simile allo store `$page` di SvelteKit ma in ambiente JS puro.
 * Reagisce a popstate, hashchange, pushState e replaceState.
 *
 * @returns Un oggetto con due metodi:
 *  - `subscribe(callback)`: riceve aggiornamenti quando cambia l’URL
 *  - `get()`: restituisce lo stato corrente della pagina
 *  - Utilizza come 'const page=pageStore()' e poi 'page.get()' o 'page.subscribe((info)=>{})'
 */
declare function pageStore(): {
    subscribe(callback: PageStoreCallback): () => void;
    get: () => PageInfo;
};

declare const backoffNoJitter: (attempt: number, baseMin?: number, capMin?: number) => number;
declare const addJitter: (minutes: number, ratio?: number) => number;
declare const fullJitter: (attempt: number, baseMin?: number, capMin?: number) => number;
declare const decorrelatedJitter: (prevMin: number, baseMin?: number, capMin?: number) => number;

declare const RE_WS: RegExp;
declare const RE_QUERY_SENSITIVE: RegExp;
declare const RE_AUTH: RegExp;
declare const RE_AWS_ACCESS_KEY: RegExp;
declare const RE_SECRET40: RegExp;
declare const RE_LONG_DIGITS: RegExp;
declare const RE_IPV4_NOLB: RegExp;
declare const RE_PATH_SECRET: RegExp;
declare const RE_PEM_BLOCK: RegExp;
declare const RE_WHITESPACE: RegExp;
declare const RE_NON_WORD: RegExp;
declare const RE_SLUG: RegExp;
declare const RE_USERNAME_SIMPLE: RegExp;
declare const RE_HASHTAG: RegExp;
declare const RE_MENTION: RegExp;
declare const RE_INT: RegExp;
declare const RE_FLOAT: RegExp;
declare const RE_NUMBER_THOUSANDS: RegExp;
declare const RE_HEX_PREFIXED: RegExp;
declare const RE_HEX_COLOR: RegExp;
declare const RE_RGB: RegExp;
declare const RE_RGBA: RegExp;
declare const RE_HSL: RegExp;
declare const RE_HSLA: RegExp;
declare const RE_EMAIL: RegExp;
declare const RE_DOMAIN: RegExp;
declare const RE_URL_HTTP: RegExp;
declare const RE_URL_SIMPLE: RegExp;
declare const RE_IPV4: RegExp;
declare const RE_IPV6_SIMPLE: RegExp;
declare const RE_MAC: RegExp;
declare const RE_HOSTPORT: RegExp;
declare const RE_E164_PHONE: RegExp;
declare const RE_DATE_ISO: RegExp;
declare const RE_TIME_24H: RegExp;
declare const RE_TIME_12H: RegExp;
declare const RE_DATETIME_ISO: RegExp;
declare const RE_DATE_DDMMYYYY: RegExp;
declare const RE_DATE_MMDDYYYY: RegExp;
declare const RE_TZ_OFFSET: RegExp;
declare const RE_UUID_ANY: RegExp;
declare const RE_UUID_V4: RegExp;
declare const RE_ULID: RegExp;
declare const RE_BASE64: RegExp;
declare const RE_JWT: RegExp;
declare const RE_SHA1: RegExp;
declare const RE_SHA256: RegExp;
declare const RE_GIT_COMMIT: RegExp;
declare const RE_IBAN_GENERIC: RegExp;
declare const RE_CREDITCARD_GENERIC: RegExp;
declare const RE_VISA: RegExp;
declare const RE_MASTERCARD: RegExp;
declare const RE_CURRENCY_GENERIC: RegExp;
declare const RE_PERCENT: RegExp;
declare const RE_ZIP_US: RegExp;
declare const RE_CAP_IT: RegExp;
declare const RE_POSTCODE_UK_APPROX: RegExp;
declare const RE_FILENAME_SAFE: RegExp;
declare const RE_UNIX_PATH: RegExp;
declare const RE_WINDOWS_PATH: RegExp;
declare const RE_EXTENSION: RegExp;
declare const RE_MIME_TYPE: RegExp;
declare const RE_LAT: RegExp;
declare const RE_LON: RegExp;
declare const RE_LATLON_PAIR: RegExp;
declare const RE_CAMEL_CASE: RegExp;
declare const RE_PASCAL_CASE: RegExp;
declare const RE_SNAKE_CASE: RegExp;
declare const RE_KEBAB_CASE: RegExp;
declare const RE_HTML_TAG: RegExp;
declare const RE_CSV_LINE: RegExp;
declare const RE_PASSWORD_STRONG: RegExp;
declare const RE_IPV6: RegExp;
declare const RE_CF_IT_STRICT: RegExp;
declare const RE_CF_IT_OMOCODIA: RegExp;
declare const RE_PIVA_IT: RegExp;
declare const RE_PEC_IT_STRICT: RegExp;
declare const RE_PEC_GENERIC: RegExp;
declare const RE_VAT_AT: RegExp;
declare const RE_VAT_BE: RegExp;
declare const RE_VAT_BG: RegExp;
declare const RE_VAT_HR: RegExp;
declare const RE_VAT_CY: RegExp;
declare const RE_VAT_CZ: RegExp;
declare const RE_VAT_DK: RegExp;
declare const RE_VAT_EE: RegExp;
declare const RE_VAT_FI: RegExp;
declare const RE_VAT_FR: RegExp;
declare const RE_VAT_DE: RegExp;
declare const RE_VAT_EL: RegExp;
declare const RE_VAT_HU: RegExp;
declare const RE_VAT_IE: RegExp;
declare const RE_VAT_IT: RegExp;
declare const RE_VAT_LV: RegExp;
declare const RE_VAT_LT: RegExp;
declare const RE_VAT_LU: RegExp;
declare const RE_VAT_MT: RegExp;
declare const RE_VAT_NL: RegExp;
declare const RE_VAT_PL: RegExp;
declare const RE_VAT_PT: RegExp;
declare const RE_VAT_RO: RegExp;
declare const RE_VAT_SK: RegExp;
declare const RE_VAT_SI: RegExp;
declare const RE_VAT_ES: RegExp;
declare const RE_VAT_SE: RegExp;
declare const RE_S3_URI: RegExp;
declare const RE_S3_VHOST_URL: RegExp;
declare const RE_S3_PATH_URL: RegExp;
declare const RE_R2_PUBLIC_URL: RegExp;
declare const RE_R2_S3_COMPAT_URL: RegExp;
declare const RE_SEMVER: RegExp;
declare const RE_SEMVER_RANGE_SIMPLE: RegExp;
declare const RE_SEMVER_RANGE_COMPARATORS: RegExp;

type Brand<Base, Tag extends string> = Base & {
    readonly __brand: Tag;
};
type U8 = Brand<number, "u8">;
type U16 = Brand<number, "u16">;
type U32 = Brand<number, "u32">;
type U64 = Brand<number, "u64">;
type I8 = Brand<number, "i8">;
type I16 = Brand<number, "i16">;
type I32 = Brand<number, "i32">;
type I64 = Brand<number, "i64">;
type F32 = Brand<number, "f32">;
type F64 = Brand<number, "f64">;
type NumberPredicate = (v: unknown) => v is number;
interface NumPredicates {
    isU8: NumberPredicate;
    isU16: NumberPredicate;
    isU32: NumberPredicate;
    isU64: NumberPredicate;
    isI8: NumberPredicate;
    isI16: NumberPredicate;
    isI32: NumberPredicate;
    isI64: NumberPredicate;
    isF32: NumberPredicate;
    isF64: NumberPredicate;
}
interface Refinement<TBrand extends string> {
    /** Type guard verso il tipo brandizzato */
    is(v: unknown): v is Brand<number, TBrand>;
    /** Costruttore che valida e lancia su input invalido */
    as(v: unknown): Brand<number, TBrand>;
    /** Costruttore “safe” che restituisce null se non valido */
    try(v: unknown): Brand<number, TBrand> | null;
    /** Parser da stringa (usa Number), valida e lancia su input invalido */
    parse(s: string): Brand<number, TBrand>;
}
interface NumAPI extends NumPredicates {
    U8: Refinement<"u8">;
    U16: Refinement<"u16">;
    U32: Refinement<"u32">;
    U64: Refinement<"u64">;
    I8: Refinement<"i8">;
    I16: Refinement<"i16">;
    I32: Refinement<"i32">;
    I64: Refinement<"i64">;
    F32: Refinement<"f32">;
    F64: Refinement<"f64">;
}
declare const Pred: Readonly<NumPredicates>;
declare const Num: NumAPI;

/**
 * Public interface for the jsonTools utility.
 * Import this if you want to type variables or parameters that expose
 * the same API surface as `jsonTools`.
 */
interface JsonTools {
    /**
     * Validate a JSON string against an optional schema.
     * - If `schema` is omitted: only checks JSON validity and returns the parsed value.
     * - If `schema` is provided: validates using Ajv (draft-07 friendly).
     */
    validate<T = unknown>(jsonStr: string, schema?: AnySchema | string): {
        ok: true;
        data: T;
    } | {
        ok: false;
        errors: string[];
    };
    /** Safely parse a JSON string without throwing. */
    parse<T = unknown>(jsonStr: string): {
        ok: true;
        data: T;
    } | {
        ok: false;
        error: string;
    };
    /** Safely stringify any value to JSON (handles circular refs and never throws). */
    stringify(value: any, space?: number): string;
    /** Pretty-print a JSON string with a given indentation (returns original if invalid). */
    pretty(jsonStr: string, indent?: number): string;
    /** Minify a JSON string by removing whitespace (returns original if invalid). */
    compact(jsonStr: string): string;
    /** Deep structural equality for JSON-compatible values (key-order insensitive for objects). */
    isEqual(a: unknown, b: unknown): boolean;
    /** Safely access nested properties via dot-path (supports numeric indices). */
    get<T = unknown>(obj: any, path: string): T | undefined;
    /**
     * Non-mutating deep merge of two objects (arrays are overwritten).
     * Returns a new object typed as the intersection T & U.
     */
    merge<T extends object, U extends object>(target: T, source: U): T & U;
    /**
     * Compute a flat diff map of paths to old/new values.
     * Paths use dot notation; "(root)" indicates the root value.
     */
    diff(a: unknown, b: unknown): Record<string, {
        oldValue: any;
        newValue: any;
    }>;
    /** Summarize a JSON Schema for quick inspection (types, enums, properties). */
    schemaSummary(schema: AnySchema): string;
    /** Infer a minimal JSON Schema from an example value. */
    inferSchema(example: unknown): AnySchema;
}
/**
 * A small toolkit for working with JSON strings.
 *
 * @remarks
 * - The only exported API is this default object `jsonTools`.
 * - All functions are documented with JSDoc so tooltips are shown in IDEs.
 */
declare const jsonTools: JsonTools;

export { type Brand, type BrowserStorageType, type F32, type F64, type I16, type I32, type I64, type I8, type JsonTools, Num, type NumAPI, type NumPredicates, type NumberPredicate, type PageInfo, Pred, RE_AUTH, RE_AWS_ACCESS_KEY, RE_BASE64, RE_CAMEL_CASE, RE_CAP_IT, RE_CF_IT_OMOCODIA, RE_CF_IT_STRICT, RE_CREDITCARD_GENERIC, RE_CSV_LINE, RE_CURRENCY_GENERIC, RE_DATETIME_ISO, RE_DATE_DDMMYYYY, RE_DATE_ISO, RE_DATE_MMDDYYYY, RE_DOMAIN, RE_E164_PHONE, RE_EMAIL, RE_EXTENSION, RE_FILENAME_SAFE, RE_FLOAT, RE_GIT_COMMIT, RE_HASHTAG, RE_HEX_COLOR, RE_HEX_PREFIXED, RE_HOSTPORT, RE_HSL, RE_HSLA, RE_HTML_TAG, RE_IBAN_GENERIC, RE_INT, RE_IPV4, RE_IPV4_NOLB, RE_IPV6, RE_IPV6_SIMPLE, RE_JWT, RE_KEBAB_CASE, RE_LAT, RE_LATLON_PAIR, RE_LON, RE_LONG_DIGITS, RE_MAC, RE_MASTERCARD, RE_MENTION, RE_MIME_TYPE, RE_NON_WORD, RE_NUMBER_THOUSANDS, RE_PASCAL_CASE, RE_PASSWORD_STRONG, RE_PATH_SECRET, RE_PEC_GENERIC, RE_PEC_IT_STRICT, RE_PEM_BLOCK, RE_PERCENT, RE_PIVA_IT, RE_POSTCODE_UK_APPROX, RE_QUERY_SENSITIVE, RE_R2_PUBLIC_URL, RE_R2_S3_COMPAT_URL, RE_RGB, RE_RGBA, RE_S3_PATH_URL, RE_S3_URI, RE_S3_VHOST_URL, RE_SECRET40, RE_SEMVER, RE_SEMVER_RANGE_COMPARATORS, RE_SEMVER_RANGE_SIMPLE, RE_SHA1, RE_SHA256, RE_SLUG, RE_SNAKE_CASE, RE_TIME_12H, RE_TIME_24H, RE_TZ_OFFSET, RE_ULID, RE_UNIX_PATH, RE_URL_HTTP, RE_URL_SIMPLE, RE_USERNAME_SIMPLE, RE_UUID_ANY, RE_UUID_V4, RE_VAT_AT, RE_VAT_BE, RE_VAT_BG, RE_VAT_CY, RE_VAT_CZ, RE_VAT_DE, RE_VAT_DK, RE_VAT_EE, RE_VAT_EL, RE_VAT_ES, RE_VAT_FI, RE_VAT_FR, RE_VAT_HR, RE_VAT_HU, RE_VAT_IE, RE_VAT_IT, RE_VAT_LT, RE_VAT_LU, RE_VAT_LV, RE_VAT_MT, RE_VAT_NL, RE_VAT_PL, RE_VAT_PT, RE_VAT_RO, RE_VAT_SE, RE_VAT_SI, RE_VAT_SK, RE_VISA, RE_WHITESPACE, RE_WINDOWS_PATH, RE_WS, RE_ZIP_US, type Refinement, type U16, type U32, type U64, type U8, URLGetParam, URLReload, addJitter, addMinutesToDate, addMinutesToTime, arrayGetByKey, arrayIncludesString, arrrayGetLast, backoffNoJitter, browserStorage, buildPath, callerName, capitalize, capitalizeEachWord, checkFileSize, checkPasswordStrength, clearUrl, clickOutside, componentCallbackDispatcher, copyToClipboard, createHashInput, dateToTime12h, dateToTime24h, decorrelatedJitter, detectAnalysisFileType, dropdownOptionsFromStrings, flagEmojiToCountryCode, flattenObject, formSubmit, formatDateForInput, fullJitter, getCurrentPath, getErrorInfo, getMatchScore, getMidpointDate, getMonthBounds, getMonthBoundsByYearMonthString, getPathList, getRandomNumber, getRandomString, getSubdomain, getTimeBounds, getUrlParam, getYearBounds, getYearMonthStringFromDate, hexToRgb, imageExistsAtURL, isBrowser, isDev, isLocalhost, isSameMonth, isSameYear, isValidDate, isValidTimeStr, isWindowAvailable, jsonTools, listMonthsInRange, logger, mapToObject, mergeByKey, objectsDiffer, pageStore, parseCookie, parseDate, portal, redirectOrReload, removeFromArrayByKey, removeNullish, removeWWW, sanitizeMessageSensitiveData, scrollToElement, serializeToString, setHiddenStatus, setTimeForDate, sleep, stringStartsWith, toCamelCase, toHtmlId, toSnakeCase, toggleArrayItem, toggleHiddenStatus, updateArrayByKey, updateUniqueArray, validate, validateFile, wait };
