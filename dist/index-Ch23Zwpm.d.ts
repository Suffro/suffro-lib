import { AnySchema } from 'ajv';

type ColorInfo = {
    HEX: string;
    RGB: {
        R: number;
        G: number;
        B: number;
    };
    TAILWIND_CLASS: string;
};
type AppRoute = {
    id: string;
    title: string;
    description?: string;
};
type VoidFunction$1 = () => void;
type AuthMode = "signin" | "signup" | "forgot_password" | null | undefined;
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
type TailwindWidth = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
type TableData = {
    id?: string;
    title?: string;
    columns: string[];
    rows: (string | number | boolean | null)[][];
    enableHorizontalHeader?: boolean;
};
type CheckboxSetOption = {
    value: string | number;
    label: string;
    id?: string;
    description?: string;
};
type DropdownOption = {
    label: string;
    value: string | number;
    id: string;
    flag?: string;
};
type ComboboxOption = DropdownOption & {
    description?: string;
};
type AnyObject = Record<string, any>;
type HexColor = `#${string}`;
type RgbColor = `rgb(${number}, ${number}, ${number})`;
type RgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`;
type HslColor = `hsl(${number}, ${number}%, ${number}%)`;
type HslaColor = `hsla(${number}, ${number}%, ${number}%, ${number})`;
type ColorString = HexColor | RgbColor | RgbaColor | HslColor | HslaColor;
type CssNamedColor = 'aliceblue' | 'antiquewhite' | 'aqua' | 'aquamarine' | 'azure' | 'beige' | 'bisque' | 'black' | 'blanchedalmond' | 'blue' | 'blueviolet' | 'brown' | 'burlywood' | 'cadetblue' | 'chartreuse' | 'chocolate' | 'coral' | 'cornflowerblue' | 'cornsilk' | 'crimson' | 'cyan' | 'darkblue' | 'darkcyan' | 'darkgoldenrod' | 'darkgray' | 'darkgreen' | 'darkgrey' | 'darkkhaki' | 'darkmagenta' | 'darkolivegreen' | 'darkorange' | 'darkorchid' | 'darkred' | 'darksalmon' | 'darkseagreen' | 'darkslateblue' | 'darkslategray' | 'darkslategrey' | 'darkturquoise' | 'darkviolet' | 'deeppink' | 'deepskyblue' | 'dimgray' | 'dimgrey' | 'dodgerblue' | 'firebrick' | 'floralwhite' | 'forestgreen' | 'fuchsia' | 'gainsboro' | 'ghostwhite' | 'gold' | 'goldenrod' | 'gray' | 'green' | 'greenyellow' | 'grey' | 'honeydew' | 'hotpink' | 'indianred' | 'indigo' | 'ivory' | 'khaki' | 'lavender' | 'lavenderblush' | 'lawngreen' | 'lemonchiffon' | 'lightblue' | 'lightcoral' | 'lightcyan' | 'lightgoldenrodyellow' | 'lightgray' | 'lightgreen' | 'lightgrey' | 'lightpink' | 'lightsalmon' | 'lightseagreen' | 'lightskyblue' | 'lightslategray' | 'lightslategrey' | 'lightsteelblue' | 'lightyellow' | 'lime' | 'limegreen' | 'linen' | 'magenta' | 'maroon' | 'mediumaquamarine' | 'mediumblue' | 'mediumorchid' | 'mediumpurple' | 'mediumseagreen' | 'mediumslateblue' | 'mediumspringgreen' | 'mediumturquoise' | 'mediumvioletred' | 'midnightblue' | 'mintcream' | 'mistyrose' | 'moccasin' | 'navajowhite' | 'navy' | 'oldlace' | 'olive' | 'olivedrab' | 'orange' | 'orangered' | 'orchid' | 'palegoldenrod' | 'palegreen' | 'paleturquoise' | 'palevioletred' | 'papayawhip' | 'peachpuff' | 'peru' | 'pink' | 'plum' | 'powderblue' | 'purple' | 'rebeccapurple' | 'red' | 'rosybrown' | 'royalblue' | 'saddlebrown' | 'salmon' | 'sandybrown' | 'seagreen' | 'seashell' | 'sienna' | 'silver' | 'skyblue' | 'slateblue' | 'slategray' | 'slategrey' | 'snow' | 'springgreen' | 'steelblue' | 'tan' | 'teal' | 'thistle' | 'tomato' | 'turquoise' | 'violet' | 'wheat' | 'white' | 'whitesmoke' | 'yellow' | 'yellowgreen';
type StringLiteralJoin<T extends string[], Sep extends string = ''> = T extends [infer F extends string, ...infer R extends string[]] ? R['length'] extends 0 ? F : `${F}${Sep}${StringLiteralJoin<R, Sep>}` : '';

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
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    warn: LogFn;
    error: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    devError: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
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

export { toCamelCase as $, type AppRoute as A, sleep as B, type ColorInfo as C, type DropdownOption as D, removeWWW as E, mapToObject as F, getRandomNumber as G, type HexColor as H, getRandomString as I, arrrayGetLast as J, getPathList as K, getCurrentPath as L, buildPath as M, detectAnalysisFileType as N, scrollToElement as O, type PasswordStrength as P, clickOutside as Q, type RgbColor as R, type StringLiteralJoin as S, type TailwindWidth as T, setHiddenStatus as U, type VoidFunction$1 as V, toggleHiddenStatus as W, toHtmlId as X, toggleArrayItem as Y, updateUniqueArray as Z, updateArrayByKey as _, type AuthMode as a, RE_SLUG as a$, toSnakeCase as a0, portal as a1, isValidTimeStr as a2, isValidDate as a3, formatDateForInput as a4, addMinutesToTime as a5, setTimeForDate as a6, addMinutesToDate as a7, parseDate as a8, dateToTime24h as a9, dropdownOptionsFromStrings as aA, sanitizeMessageSensitiveData as aB, getErrorInfo as aC, serializeToString as aD, createHashInput as aE, arrayIncludesString as aF, logger as aG, validate as aH, type BrowserStorageType as aI, browserStorage as aJ, type PageInfo as aK, pageStore as aL, backoffNoJitter as aM, addJitter as aN, fullJitter as aO, decorrelatedJitter as aP, RE_WS as aQ, RE_QUERY_SENSITIVE as aR, RE_AUTH as aS, RE_AWS_ACCESS_KEY as aT, RE_SECRET40 as aU, RE_LONG_DIGITS as aV, RE_IPV4_NOLB as aW, RE_PATH_SECRET as aX, RE_PEM_BLOCK as aY, RE_WHITESPACE as aZ, RE_NON_WORD as a_, dateToTime12h as aa, URLGetParam as ab, isSameMonth as ac, isSameYear as ad, getMidpointDate as ae, getYearBounds as af, callerName as ag, arrayGetByKey as ah, checkFileSize as ai, getMatchScore as aj, componentCallbackDispatcher as ak, objectsDiffer as al, removeNullish as am, flattenObject as an, getTimeBounds as ao, listMonthsInRange as ap, getMonthBoundsByYearMonthString as aq, getYearMonthStringFromDate as ar, getMonthBounds as as, mergeByKey as at, removeFromArrayByKey as au, hexToRgb as av, copyToClipboard as aw, URLReload as ax, flagEmojiToCountryCode as ay, wait as az, type TableData as b, RE_PIVA_IT as b$, RE_USERNAME_SIMPLE as b0, RE_HASHTAG as b1, RE_MENTION as b2, RE_INT as b3, RE_FLOAT as b4, RE_NUMBER_THOUSANDS as b5, RE_HEX_PREFIXED as b6, RE_HEX_COLOR as b7, RE_RGB as b8, RE_RGBA as b9, RE_IBAN_GENERIC as bA, RE_CREDITCARD_GENERIC as bB, RE_VISA as bC, RE_MASTERCARD as bD, RE_CURRENCY_GENERIC as bE, RE_PERCENT as bF, RE_ZIP_US as bG, RE_CAP_IT as bH, RE_POSTCODE_UK_APPROX as bI, RE_FILENAME_SAFE as bJ, RE_UNIX_PATH as bK, RE_WINDOWS_PATH as bL, RE_EXTENSION as bM, RE_MIME_TYPE as bN, RE_LAT as bO, RE_LON as bP, RE_LATLON_PAIR as bQ, RE_CAMEL_CASE as bR, RE_PASCAL_CASE as bS, RE_SNAKE_CASE as bT, RE_KEBAB_CASE as bU, RE_HTML_TAG as bV, RE_CSV_LINE as bW, RE_PASSWORD_STRONG as bX, RE_IPV6 as bY, RE_CF_IT_STRICT as bZ, RE_CF_IT_OMOCODIA as b_, RE_HSL as ba, RE_HSLA as bb, RE_EMAIL as bc, RE_DOMAIN as bd, RE_URL_HTTP as be, RE_URL_SIMPLE as bf, RE_IPV4 as bg, RE_IPV6_SIMPLE as bh, RE_MAC as bi, RE_HOSTPORT as bj, RE_E164_PHONE as bk, RE_DATE_ISO as bl, RE_TIME_24H as bm, RE_TIME_12H as bn, RE_DATETIME_ISO as bo, RE_DATE_DDMMYYYY as bp, RE_DATE_MMDDYYYY as bq, RE_TZ_OFFSET as br, RE_UUID_ANY as bs, RE_UUID_V4 as bt, RE_ULID as bu, RE_BASE64 as bv, RE_JWT as bw, RE_SHA1 as bx, RE_SHA256 as by, RE_GIT_COMMIT as bz, type CheckboxSetOption as c, RE_PEC_IT_STRICT as c0, RE_PEC_GENERIC as c1, RE_VAT_AT as c2, RE_VAT_BE as c3, RE_VAT_BG as c4, RE_VAT_HR as c5, RE_VAT_CY as c6, RE_VAT_CZ as c7, RE_VAT_DK as c8, RE_VAT_EE as c9, RE_SEMVER_RANGE_COMPARATORS as cA, type Brand as cB, type U8 as cC, type U16 as cD, type U32 as cE, type U64 as cF, type I8 as cG, type I16 as cH, type I32 as cI, type I64 as cJ, type F32 as cK, type F64 as cL, type NumberPredicate as cM, type NumPredicates as cN, type Refinement as cO, type NumAPI as cP, Pred as cQ, Num as cR, type JsonTools as cS, jsonTools as cT, RE_VAT_FI as ca, RE_VAT_FR as cb, RE_VAT_DE as cc, RE_VAT_EL as cd, RE_VAT_HU as ce, RE_VAT_IE as cf, RE_VAT_IT as cg, RE_VAT_LV as ch, RE_VAT_LT as ci, RE_VAT_LU as cj, RE_VAT_MT as ck, RE_VAT_NL as cl, RE_VAT_PL as cm, RE_VAT_PT as cn, RE_VAT_RO as co, RE_VAT_SK as cp, RE_VAT_SI as cq, RE_VAT_ES as cr, RE_VAT_SE as cs, RE_S3_URI as ct, RE_S3_VHOST_URL as cu, RE_S3_PATH_URL as cv, RE_R2_PUBLIC_URL as cw, RE_R2_S3_COMPAT_URL as cx, RE_SEMVER as cy, RE_SEMVER_RANGE_SIMPLE as cz, type ComboboxOption as d, type AnyObject as e, type RgbaColor as f, type HslColor as g, type HslaColor as h, type ColorString as i, type CssNamedColor as j, isBrowser as k, isWindowAvailable as l, isDev as m, imageExistsAtURL as n, clearUrl as o, getSubdomain as p, checkPasswordStrength as q, redirectOrReload as r, stringStartsWith as s, capitalize as t, formSubmit as u, validateFile as v, capitalizeEachWord as w, parseCookie as x, isLocalhost as y, getUrlParam as z };
