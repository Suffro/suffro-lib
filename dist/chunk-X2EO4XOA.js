// src/utils/_pageStore.ts
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
      // da riempire se implementi parsing tipo /user/:id
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    };
  }
  function notify() {
    const page = getPage();
    for (const cb of listeners) cb(page);
  }
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    history[method] = function(...args) {
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

// src/utils/_regexPatterns.ts
var RE_WS = /\s+/g;
var RE_QUERY_SENSITIVE = /([?&])(token|api[_-]?key|key|signature|password|pass|pwd|code|secret|client[_-]?secret|access[_-]?token)=([^&#\s]+)/gi;
var RE_AUTH = /\b(authorization|bearer|basic)\b[: ]+\S+/gi;
var RE_AWS_ACCESS_KEY = /\bAKIA[0-9A-Z]{16}\b/g;
var RE_SECRET40 = /\b[A-Za-z0-9/+]{40}\b/g;
var RE_LONG_DIGITS = /\b(?:\d[ -]?){13,19}\b/g;
var RE_IPV4_NOLB = /(^|[^0-9])((?:\d{1,3}\.){3}\d{1,3})(?!\d)/g;
var RE_PATH_SECRET = /\/(token|key|secret|signature|passwd|password|code)\/[^\/?#\s]+/gi;
var RE_PEM_BLOCK = /-----BEGIN [A-Z ]+-----[\s\S]*?-----END [A-Z ]+-----/g;
var RE_WHITESPACE = /\s+/g;
var RE_NON_WORD = /\W+/g;
var RE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
var RE_USERNAME_SIMPLE = /^[A-Z0-9_]{3,20}$/i;
var RE_HASHTAG = /(^|\s)#([A-Z0-9_]{1,30})/gi;
var RE_MENTION = /(^|[^@\w])@([A-Z0-9_]{1,30})/gi;
var RE_INT = /^[+-]?\d+$/;
var RE_FLOAT = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
var RE_NUMBER_THOUSANDS = /^-?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?$/;
var RE_HEX_PREFIXED = /^0x[0-9A-F]+$/i;
var RE_HEX_COLOR = /^#(?:[0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
var RE_RGB = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
var RE_RGBA = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
var RE_HSL = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i;
var RE_HSLA = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
var RE_EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
var RE_DOMAIN = /^(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,}$/i;
var RE_URL_HTTP = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
var RE_URL_SIMPLE = /^(https?:\/\/)?(?:[A-Z0-9-]+\.)+[A-Z]{2,}(?:\/[^\s]*)?$/i;
var RE_IPV4 = /^(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
var RE_IPV6_SIMPLE = /^([A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/i;
var RE_MAC = /^([0-9A-F]{2}[:-]){5}[0-9A-F]{2}$/i;
var RE_HOSTPORT = /^(?:\[(?:[A-F0-9:]+)\]|(?:\d{1,3}\.){3}\d{1,3}|(?:[A-Z0-9-]+\.)+[A-Z]{2,})(?::\d{1,5})?$/i;
var RE_E164_PHONE = /^\+?[1-9]\d{1,14}$/;
var RE_DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;
var RE_TIME_24H = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
var RE_TIME_12H = /^(?:0?[1-9]|1[0-2]):[0-5]\d(?::[0-5]\d)?\s?(?:AM|PM)$/i;
var RE_DATETIME_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
var RE_DATE_DDMMYYYY = /^(0?[1-9]|[12]\d|3[01])[\/.-](0?[1-9]|1[0-2])[\/.-]\d{4}$/;
var RE_DATE_MMDDYYYY = /^(0?[1-9]|1[0-2])[\/.-](0?[1-9]|[12]\d|3[01])[\/.-]\d{4}$/;
var RE_TZ_OFFSET = /^[+-](?:0\d|1[0-4]):[0-5]\d$/;
var RE_UUID_ANY = /^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
var RE_UUID_V4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
var RE_ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var RE_BASE64 = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=)?$/i;
var RE_JWT = /\b([A-Za-z0-9-_]{10,})\.([A-Za-z0-9-_]{10,})(?:\.([A-Za-z0-9-_]{5,}))?\b/g;
var RE_SHA1 = /^[A-F0-9]{40}$/i;
var RE_SHA256 = /^[A-F0-9]{64}$/i;
var RE_GIT_COMMIT = /^[0-9A-F]{7,40}$/i;
var RE_IBAN_GENERIC = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
var RE_CREDITCARD_GENERIC = /^(?:4\d{12}(?:\d{3})?|5[1-5]\d{14}|3[47]\d{13}|3(?:0[0-5]|[68]\d)\d{11}|6(?:011|5\d{2})\d{12})$/;
var RE_VISA = /^4\d{12}(\d{3})?$/;
var RE_MASTERCARD = /^(5[1-5]\d{14}|2(?:2[2-9]\d|[3-6]\d{2}|7(?:[01]\d|20))\d{12})$/;
var RE_CURRENCY_GENERIC = /^(?:[A-Z]{3}|[$€£])\s?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?$/;
var RE_PERCENT = /^(?:100(?:\.0+)?|(?:\d{1,2})(?:\.\d+)?)%$/;
var RE_ZIP_US = /^\d{5}(?:-\d{4})?$/;
var RE_CAP_IT = /^\d{5}$/;
var RE_POSTCODE_UK_APPROX = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
var RE_FILENAME_SAFE = /^[A-Z0-9._-]+$/i;
var RE_UNIX_PATH = /^(\/[^/\0]+)+\/?$/;
var RE_WINDOWS_PATH = /^(?:[A-Z]:\\|\\\\)[^\s<>:"|?*]+$/i;
var RE_EXTENSION = /^[^.]+\.[A-Z0-9]+$/i;
var RE_MIME_TYPE = /^[a-z]+\/[a-z0-9+.-]+$/i;
var RE_LAT = /^-?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?)$/;
var RE_LON = /^-?(?:1[0-7]\d(?:\.\d+)?|[1-9]?\d(?:\.\d+)?|180(?:\.0+)?)$/;
var RE_LATLON_PAIR = /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/;
var RE_CAMEL_CASE = /^(?:[a-z]+(?:[A-Z][a-z0-9]+)*)$/;
var RE_PASCAL_CASE = /^(?:[A-Z][a-z0-9]+)+$/;
var RE_SNAKE_CASE = /^[a-z0-9]+(?:_[a-z0-9]+)+$/;
var RE_KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;
var RE_HTML_TAG = /<[^>]+>/;
var RE_CSV_LINE = /^(?:"[^"]*"|[^",]*)(?:,(?:"[^"]*"|[^",]*))*$/;
var RE_PASSWORD_STRONG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
var RE_IPV6 = /^((?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}|(?:[A-F0-9]{1,4}:){1,7}:|(?:[A-F0-9]{1,4}:){1,6}:[A-F0-9]{1,4}|(?:[A-F0-9]{1,4}:){1,5}(?::[A-F0-9]{1,4}){1,2}|(?:[A-F0-9]{1,4}:){1,4}(?::[A-F0-9]{1,4}){1,3}|(?:[A-F0-9]{1,4}:){1,3}(?::[A-F0-9]{1,4}){1,4}|(?:[A-F0-9]{1,4}:){1,2}(?::[A-F0-9]{1,4}){1,5}|[A-F0-9]{1,4}:(?::[A-F0-9]{1,4}){1,6}|:(?::[A-F0-9]{1,4}){1,7})(?:%\w+)?$/i;
var RE_CF_IT_STRICT = /^[A-Z]{6}\d{2}[A-EHLMPRST]\d{2}[A-Z]\d{3}[A-Z]$/;
var RE_CF_IT_OMOCODIA = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-EHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/;
var RE_PIVA_IT = /^(?:IT\s*)?\d{11}$/i;
var RE_PEC_IT_STRICT = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.PEC\.IT$/i;
var RE_PEC_GENERIC = /^[A-Z0-9._%+-]+@[A-Z0-9.-]*\.PEC\.[A-Z]{2,}$/i;
var RE_VAT_AT = /^ATU\d{8}$/;
var RE_VAT_BE = /^BE0?\d{9}$/;
var RE_VAT_BG = /^BG\d{9,10}$/;
var RE_VAT_HR = /^HR\d{11}$/;
var RE_VAT_CY = /^CY\d{8}[A-Z]$/i;
var RE_VAT_CZ = /^CZ\d{8,10}$/;
var RE_VAT_DK = /^DK\d{8}$/;
var RE_VAT_EE = /^EE\d{9}$/;
var RE_VAT_FI = /^FI\d{8}$/;
var RE_VAT_FR = /^FR[0-9A-Z]{2}\d{9}$/i;
var RE_VAT_DE = /^DE\d{9}$/;
var RE_VAT_EL = /^EL\d{9}$/;
var RE_VAT_HU = /^HU\d{8}$/;
var RE_VAT_IE = /^IE\d{7}[A-W][A-I]?$/i;
var RE_VAT_IT = /^IT\d{11}$/;
var RE_VAT_LV = /^LV\d{11}$/;
var RE_VAT_LT = /^LT(\d{9}|\d{12})$/;
var RE_VAT_LU = /^LU\d{8}$/;
var RE_VAT_MT = /^MT\d{8}$/;
var RE_VAT_NL = /^NL\d{9}B\d{2}$/;
var RE_VAT_PL = /^PL\d{10}$/;
var RE_VAT_PT = /^PT\d{9}$/;
var RE_VAT_RO = /^RO\d{2,10}$/;
var RE_VAT_SK = /^SK\d{10}$/;
var RE_VAT_SI = /^SI\d{8}$/;
var RE_VAT_ES = /^ES[A-Z0-9]\d{7}[A-Z0-9]$/i;
var RE_VAT_SE = /^SE\d{12}$/;
var RE_S3_URI = /^s3:\/\/[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]\/.+$/;
var RE_S3_VHOST_URL = /^https?:\/\/[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]\.s3[.-][a-z0-9-]+\.amazonaws\.com\/.+$/i;
var RE_S3_PATH_URL = /^https?:\/\/s3[.-][a-z0-9-]+\.amazonaws\.com\/[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]\/.+$/i;
var RE_R2_PUBLIC_URL = /^https?:\/\/[a-z0-9]{32}\.r2\.cloudflarestorage\.com\/[A-Za-z0-9._-]{3,63}\/.+$/;
var RE_R2_S3_COMPAT_URL = /^https?:\/\/[A-Z0-9.-]+\/[A-Za-z0-9._-]{3,63}\/.+$/i;
var RE_SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?(?:\+[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?$/i;
var RE_SEMVER_RANGE_SIMPLE = /^(?:[~^]?\d+\.\d+\.\d+(?:-[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?(?:\+[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?)(?:\s*\|\|\s*[~^]?\d+\.\d+\.\d+(?:-[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?(?:\+[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?)*$/i;
var RE_SEMVER_RANGE_COMPARATORS = /^(?:[<>]=?\s*\d+\.\d+\.\d+(?:-[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?(?:\+[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?\s*)+(?:\|\|\s*(?:[<>]=?\s*\d+\.\d+\.\d+(?:-[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?(?:\+[0-9A-Z-]+(?:\.[0-9A-Z-]+)*)?\s*)+)*$/i;

// src/utils/_typesValidation.ts
function validateUrl(input) {
  if (typeof input !== "string") return false;
  const s = input.trim();
  if (s.length === 0) return false;
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}
function isValidDateString(value) {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}
function isValidDateObject(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
var ISO_DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
var ISO_DATETIME_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(\.\d{1,3})?)?(Z|[+\-](?:[01]\d|2[0-3]):?[0-5]\d)$/;
function isIsoDateString(value) {
  if (typeof value !== "string" || !ISO_DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
function isIsoDateTimeString(value) {
  if (typeof value !== "string" || !ISO_DATETIME_RE.test(value)) return false;
  const dt = new Date(value);
  return !Number.isNaN(dt.getTime());
}
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
var IPV4_RE = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
var IPV6_RE = /^(([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(([0-9A-Fa-f]{1,4}:){1,7}:)|(([0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,5}(:[0-9A-Fa-f]{1,4}){1,2})|(([0-9A-Fa-f]{1,4}:){1,4}(:[0-9A-Fa-f]{1,4}){1,3})|(([0-9A-Fa-f]{1,4}:){1,3}(:[0-9A-Fa-f]{1,4}){1,4})|(([0-9A-Fa-f]{1,4}:){1,2}(:[0-9A-Fa-f]{1,4}){1,5})|([0-9A-Fa-f]{1,4}:((:[0-9A-Fa-f]{1,4}){1,6}))|(:((:[0-9A-Fa-f]{1,4}){1,7}|:)))(%[0-9A-Za-z]{1,})?$/;
var validate = {
  // base
  string: (v) => typeof v === "string",
  url: (v) => typeof v === "string" && validateUrl(v),
  nonEmptyString: (v) => typeof v === "string" && v.trim().length > 0,
  number: (v) => typeof v === "number" && !Number.isNaN(v),
  integer: (v) => typeof v === "number" && Number.isInteger(v),
  boolean: (v) => typeof v === "boolean",
  bigint: (v) => typeof v === "bigint",
  symbol: (v) => typeof v === "symbol",
  numeric: (v) => typeof v === "number" ? !Number.isNaN(v) : !Number.isNaN(Number(v)),
  finiteNumber: (v) => typeof v === "number" && Number.isFinite(v),
  // date
  dateString: (v) => typeof v === "string" && isValidDateString(v),
  date: (v) => isValidDateObject(v),
  isoDateString: (v) => typeof v === "string" && isIsoDateString(v),
  isoDateTimeString: (v) => typeof v === "string" && isIsoDateTimeString(v),
  // null/undefined
  null: (v) => v === null,
  undefined: (v) => typeof v === "undefined",
  defined: (v) => v !== null && v !== void 0,
  nan: (v) => typeof v === "number" && Number.isNaN(v),
  // oggetti/collezioni
  object: (v) => v !== null && typeof v === "object",
  plainObject: (v) => {
    if (v === null || typeof v !== "object" || Array.isArray(v)) return false;
    const proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
  },
  emptyObject: (v) => v !== null && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0,
  array: (v) => Array.isArray(v),
  nonEmptyArray: (v) => Array.isArray(v) && v.length > 0,
  set: (v) => v instanceof Set,
  map: (v) => v instanceof Map,
  weakSet: (v) => v instanceof WeakSet,
  weakMap: (v) => v instanceof WeakMap,
  // binari / typed arrays
  arrayBuffer: (v) => v instanceof ArrayBuffer,
  dataView: (v) => v instanceof DataView,
  typedArray: (v) => ArrayBuffer.isView(v) && !(v instanceof DataView),
  // regex / promise / function
  regexp: (v) => v instanceof RegExp,
  promise: (v) => !!v && typeof v.then === "function",
  function: (v) => typeof v === "function",
  asyncFunction: (v) => typeof v === "function" && v.constructor?.name === "AsyncFunction",
  generatorFunction: (v) => typeof v === "function" && v.constructor?.name === "GeneratorFunction",
  // stringhe con pattern
  email: (v) => typeof v === "string" && EMAIL_RE.test(v),
  uuid: (v) => typeof v === "string" && UUID_RE.test(v),
  hexColor: (v) => typeof v === "string" && HEX_COLOR_RE.test(v),
  ipv4: (v) => typeof v === "string" && IPV4_RE.test(v),
  ipv6: (v) => typeof v === "string" && IPV6_RE.test(v),
  jsonString: (v) => {
    if (typeof v !== "string") return false;
    try {
      JSON.parse(v);
      return true;
    } catch {
      return false;
    }
  },
  // truthiness
  truthy: (v) => !!v,
  falsy: (v) => !v
};

// src/utils/_utils.ts
var isBrowser = () => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};
var isWindowAvailable = () => {
  return typeof window !== "undefined";
};
var isDev = () => {
  const isLocalhost2 = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const nodeEnv = process?.env?.NODE_ENV;
  return nodeEnv !== "production" || isLocalhost2;
};
function stringStartsWith(input, prefix, caseSensitive = false) {
  if (!caseSensitive) {
    return input.toLowerCase().startsWith(prefix.toLowerCase());
  }
  return input.startsWith(prefix);
}
function validateFile(file, maxSizeMB = 2, allowedTypes = []) {
  if (!file) {
    return { valid: false, error: "No file provided." };
  }
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}.`
    };
  }
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File is too large. Max ${maxSizeMB} MB allowed.` };
  }
  return { valid: true };
}
function imageExistsAtURL(url, bustCache = true) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.referrerPolicy = "no-referrer";
    img.src = bustCache ? `${url}${url.includes("?") ? "&" : "?"}_=${Date.now()}` : url;
  });
}
function clearUrl(input, domainOnly = false) {
  if (!validate.nonEmptyString(input)) {
    console.error(`[invalid url string] ${input}`);
    return null;
  }
  let url = input.trim();
  if (stringStartsWith(url, "http://"))
    url = url?.replace("http://", "https://");
  if (!stringStartsWith(url, "https://")) url = "https://" + url;
  try {
    logger.log(`[url to clear] ${url}`);
    const parsed = new URL(url);
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();
    if (parsed.pathname.endsWith("/") && parsed.pathname !== "/") {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    const urlParsed = parsed.toString();
    if (!domainOnly) return urlParsed;
    else return urlParsed?.replace("https://", "");
  } catch {
    console.error(`[invalid url] ${input}`);
    return null;
  }
}
var getSubdomain = (url) => {
  const hostname = url ? new URL(url).hostname : window.location.hostname;
  const parts = hostname.split(".");
  if (parts.length >= 3) return parts[0];
  return null;
};
var redirectOrReload = (options) => {
  if (options?.reload) window.location.reload();
  if (!options?.reload && validate.nonEmptyString(options?.redirectUrl)) {
    const redirectUrl = new URL(options?.redirectUrl);
    if (redirectUrl?.href) {
      switch (options?.redirectReplace) {
        case true:
          window.location.replace(redirectUrl?.href);
          break;
        default:
          window.location.href = redirectUrl?.href;
          break;
      }
    }
  }
};
function checkPasswordStrength(password) {
  if (password.length < 8) return { text: "very weak", score: 0 };
  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  switch (score) {
    case 0:
    case 1:
      return { text: "weak", score: 1 };
    case 2:
      return { text: "medium", score: 2 };
    case 3:
      return { text: "strong", score: 3 };
    case 4:
    case 5:
      return { text: "very strong", score: 4 };
    default:
      return { text: "very weak", score: 0 };
  }
}
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function formSubmit(callback) {
  return async (event) => {
    event.preventDefault();
    await callback();
  };
}
function capitalizeEachWord(input) {
  return input.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
function parseCookie(header) {
  return Object.fromEntries(header.split("; ").map((c) => c.split("=")));
}
function isLocalhost() {
  if (typeof window === "undefined") return false;
  return window.location.hostname.startsWith("localhost");
}
function getUrlParam(param) {
  if (typeof window === "undefined") return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
}
var removeWWW = (host) => {
  if (host && typeof host == "string") return host.replace(/^www\./, "");
  else return null;
};
function mapToObject(value) {
  try {
    if (value instanceof Map) {
      const obj = {};
      for (const [key, val] of value.entries()) {
        obj[key] = mapToObject(val);
      }
      return obj;
    } else if (Array.isArray(value)) {
      return value.map(mapToObject);
    } else if (typeof value === "object" && value !== null) {
      const obj = {};
      for (const key in value) {
        obj[key] = mapToObject(value[key]);
      }
      return obj;
    } else {
      return value;
    }
  } catch (error) {
    logger.error(error);
    return value;
  }
}
function getRandomNumber(min = 0, max = 1e4, integer = true) {
  const rand = Math.random() * (max - min) + min;
  return integer ? Math.floor(rand) : rand;
}
function getRandomString(options) {
  const length = options?.length || 6;
  const includeUppercase = options?.includeUppercase || true;
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const upper = includeUppercase ? lower.toUpperCase() : "";
  const chars = lower + digits + upper;
  let result = "";
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * chars.length);
    result += chars[randIndex];
  }
  if (options?.prefix) return `${options?.prefix}${result}`;
  else return result;
}
function arrrayGetLast(arr) {
  return arr.length > 0 ? arr[arr.length - 1] : void 0;
}
function getPathList(path) {
  try {
    if (path) return path.split("/");
    return window.location.pathname.split("/");
  } catch (error) {
    logger.error(error);
    return null;
  }
}
function getCurrentPath(path) {
  try {
    let pathList = getPathList(path);
    if (pathList) return arrrayGetLast(pathList);
    else return null;
  } catch (error) {
    logger.error(error);
    return null;
  }
}
function buildPath(parts, endIndex) {
  const sliced = endIndex !== void 0 ? parts.slice(0, endIndex + 1) : parts;
  return "/" + sliced.filter(Boolean).join("/");
}
function detectAnalysisFileType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "vcf":
    case "fasta":
    case "fa":
    case "fastq":
    case "fq":
    case "gtf":
    case "gff":
    case "bed":
    case "csv":
    case "tsv":
      return ext;
    default:
      return "unknown";
  }
}
function scrollToElement(target, offset = 0, scrollBehavior = "auto") {
  let element = null;
  if (typeof target == "string") {
    const normalizedId = target.startsWith("#") ? target.slice(1) : target;
    element = document.getElementById(normalizedId);
  } else if (target instanceof HTMLElement) {
    element = target;
  }
  if (!element) return;
  const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({
    top: y,
    behavior: scrollBehavior
  });
}
function clickOutside(node, callback) {
  const handleClick = (event) => {
    if (!node.contains(event.target)) {
      callback();
    }
  };
  document.addEventListener("click", handleClick, true);
  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    }
  };
}
var setHiddenStatus = (element, hidden) => {
  let el;
  if (typeof element === "string") {
    el = document.getElementById(element);
  } else {
    el = element;
  }
  if (!el) {
    logger.error("Element is null running setHiddenStatus()");
    return;
  }
  if (hidden) {
    el?.classList.add("hidden");
  } else {
    el?.classList.remove("hidden");
    setTimeout(() => {
      if (!el) return;
      el.focus();
    }, 100);
  }
};
var toggleHiddenStatus = (element) => {
  let el;
  if (typeof element === "string") {
    el = document.getElementById(element);
  } else {
    el = element;
  }
  if (!el) {
    logger.error("Element is null running toggleHiddenStatus()");
    return;
  }
  const hasHidden = el?.classList.contains("hidden");
  if (!hasHidden) {
    el?.classList.add("hidden");
  } else {
    el?.classList.remove("hidden");
    setTimeout(() => {
      if (!el) return;
      el.focus();
    }, 100);
  }
};
function toHtmlId(str) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9\-_]/g, "").replace(/^-+|-+$/g, "");
}
function toggleArrayItem(array, item) {
  return array.includes(item) ? array.filter((i) => i !== item) : [...array, item];
}
function updateUniqueArray(array, item, action) {
  if (action === "add") {
    return array.includes(item) ? array : [...array, item];
  } else {
    return array.filter((i) => i !== item);
  }
}
function updateArrayByKey(array, item, action, key) {
  const referenceKey = key || "id";
  const index = array.findIndex(
    (el) => el[referenceKey] === item[referenceKey]
  );
  if (action === "add") {
    if (index === -1) {
      return [...array, item];
    }
    return array;
  }
  if (action === "remove") {
    if (index > -1) {
      return [...array.slice(0, index), ...array.slice(index + 1)];
    }
    return array;
  }
  throw new Error(`Unknown action: ${action}`);
}
function toCamelCase(input) {
  const normalized = input.replace(/[_\-\s]+/g, " ").trim();
  const roughWords = normalized.split(" ");
  const words = [];
  for (const segment of roughWords) {
    const parts = segment.match(
      /([A-Z]+(?=[A-Z][a-z]))|([A-Z]?[a-z]+)|([A-Z]+)|(\d+)/g
    );
    if (parts) words.push(...parts);
  }
  return words.map(
    (word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join("");
}
function toSnakeCase(input) {
  const normalized = input.replace(/[_\-\s]+/g, " ").trim();
  const roughWords = normalized.split(" ");
  const words = [];
  for (const segment of roughWords) {
    const parts = segment.match(
      /([A-Z]+(?=[A-Z][a-z]))|([A-Z]?[a-z]+)|([A-Z]+)|(\d+)/g
    );
    if (parts) words.push(...parts);
  }
  return words.map((w) => w.toLowerCase()).join("_");
}
function portal(node, target = document.body) {
  target.appendChild(node);
  return {
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    }
  };
}
function isValidTimeStr(timeStr) {
  if (timeStr.trim() == "") return false;
  if (typeof timeStr !== "string") return false;
  const parts = timeStr.trim().split(":");
  if (parts.length !== 2) return false;
  const [hStr, mStr] = parts;
  if (!/^\d+$/.test(hStr) || !/^\d+$/.test(mStr)) return false;
  const hours = Number(hStr);
  const minutes = Number(mStr);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}
function isValidDate(date) {
  return date && date instanceof Date && !isNaN(date.getTime());
}
function formatDateForInput(date) {
  if (!isValidDate(date)) {
    logger.warn("Invalid 'date' in function 'formatDateForInput(date: Date)'");
    return;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function addMinutesToTime(timeStr, minutesToAdd) {
  if (!isValidTimeStr(timeStr)) {
    logger.error(
      "Invalid 'timeStr' at ddMinutesToTime(timeStr: string, minutesToAdd: number)."
    );
    return;
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = /* @__PURE__ */ new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  const newHours = String(date.getHours()).padStart(2, "0");
  const newMinutes = String(date.getMinutes()).padStart(2, "0");
  return `${newHours}:${newMinutes}`;
}
function setTimeForDate(date, timeStr) {
  if (!isValidTimeStr(timeStr)) {
    logger.error(
      "Invalid 'timeStr' at setTimeForDate(date: Date, timeStr: string)."
    );
    return date;
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  newDate.setMinutes(newDate.getMinutes());
  return newDate;
}
function addMinutesToDate(date, minutesToAdd, dateTimeStr) {
  if (!isValidDate(date)) {
    logger.error(
      "Invalid 'date' at addMinutesToDate(date: Date, minutesToAdd: number, dateTimeStr?: string)."
    );
    return;
  }
  let newDate = new Date(date);
  if (dateTimeStr && isValidTimeStr(dateTimeStr))
    newDate = setTimeForDate(newDate, dateTimeStr);
  newDate.setMinutes(newDate.getMinutes() + minutesToAdd);
  return newDate;
}
function parseDate(dateStr, fallbackToToday) {
  try {
    if (typeof dateStr !== "string") return null;
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?/.test(dateStr)) {
      const isoDate = new Date(dateStr);
      return isNaN(isoDate.getTime()) ? null : isoDate;
    }
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      const [month, day, year] = dateStr.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      return isNaN(date.getTime()) ? null : date;
    }
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch (error) {
    logger.devError(error);
  } finally {
    if (fallbackToToday) {
      return /* @__PURE__ */ new Date();
    } else {
      return new Date(dateStr);
    }
  }
}
function dateToTime24h(date) {
  if (!validate.date(date)) return null;
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
function dateToTime12h(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return null;
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}
function URLGetParam(paramName, url = window.location.href) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.searchParams.get(paramName);
  } catch (e) {
    return null;
  }
}
function isSameMonth(date1, date2) {
  if (!validate.date(date1) || !validate.date(date2)) {
    logger.devError(
      "One or more dates are invalid at isSameMonth(date1: Date, date2: Date)"
    );
    return false;
  }
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}
function isSameYear(date1, date2) {
  if (!(date1 instanceof Date) || isNaN(date1.getTime())) return false;
  if (!(date2 instanceof Date) || isNaN(date2.getTime())) return false;
  return date1.getFullYear() === date2.getFullYear();
}
function getMidpointDate(date1, date2) {
  if (!(date1 instanceof Date) || isNaN(date1.getTime()) || !(date2 instanceof Date) || isNaN(date2.getTime())) {
    throw new Error("Invalid date");
  }
  const time1 = date1.getTime();
  const time2 = date2.getTime();
  const midpoint = (time1 + time2) / 2;
  return new Date(midpoint);
}
function getYearBounds(date) {
  const d = date instanceof Date && !isNaN(date.getTime()) ? date : /* @__PURE__ */ new Date();
  const year = d.getFullYear();
  const start = new Date(year, 0, 1, 0, 0, 0, 0);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);
  return { start, end };
}
function callerName(level = 2) {
  const err = new Error();
  const stack = err.stack?.split("\n");
  if (stack && stack.length > level) {
    const match = stack[level].trim().match(/^at\s+([^\s(]+)/);
    return match?.[1] || "<anonymous>";
  }
  return "<unknown>";
}
function arrayGetByKey(array, value, key = "id") {
  if (!value) return [];
  if (!key) return [];
  if (!array) return [];
  return array.filter((item) => item[key] === value);
}
function checkFileSize(files, maxSizeMB) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  let iterable = Array.from(files);
  for (const file of iterable) {
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        message: `Il file "${file.name}" supera la dimensione massima di ${maxSizeMB} MB.`
      };
    }
  }
  return { valid: true };
}
function getMatchScore(text, term) {
  if (text === term) return 100;
  if (text.startsWith(term)) return 80;
  if (text.includes(` ${term}`)) return 60;
  if (text.includes(term)) return 40;
  return 0;
}
var componentCallbackDispatcher = (callback, data) => {
  if (callback) callback(data);
};
function objectsDiffer(a, b, strict = false) {
  const clean = (obj) => {
    try {
      return structuredClone(obj);
    } catch {
      return JSON.parse(JSON.stringify(obj));
    }
  };
  const cleanA = clean(a);
  const cleanB = clean(b);
  return deepCompare(cleanA, cleanB, strict);
}
function deepCompare(a, b, strict) {
  if (a === b) return false;
  if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
    return a !== b;
  }
  const keys = strict ? /* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(b)]) : new Set([...Object.keys(a)].filter((key) => key in b));
  for (const key of keys) {
    const valA = a[key];
    const valB = b[key];
    const bothObjects = typeof valA === "object" && valA !== null && typeof valB === "object" && valB !== null;
    if (bothObjects) {
      if (deepCompare(valA, valB, strict)) return true;
    } else if (valA !== valB) {
      return true;
    }
  }
  return false;
}
function removeNullish(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null)
  );
}
function flattenObject(obj, options = {}) {
  return _flattenObject(obj, options, "", {}, /* @__PURE__ */ new Set());
}
function _flattenObject(obj, options, _parentKey, _result, _seen) {
  const { useDotNotation = false } = options;
  if (_seen.has(obj)) {
    _result[_parentKey || "[Circular]"] = "[Circular]";
    return _result;
  }
  _seen.add(obj);
  for (const [key, value] of Object.entries(obj)) {
    const isPlainObject = value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date);
    const fullKey = useDotNotation && _parentKey ? `${_parentKey}.${key}` : key;
    if (isPlainObject) {
      _flattenObject(value, options, fullKey, _result, _seen);
    } else {
      if (useDotNotation) {
        _result[fullKey] = value;
      } else {
        _result[key] = value;
      }
    }
  }
  _seen.delete(obj);
  return _result;
}
function getTimeBounds(midpoint, before, after, unit, normalizeMonthly) {
  const center = new Date(midpoint);
  const start = new Date(center);
  const end = new Date(center);
  switch (unit) {
    case "minutes":
      start.setMinutes(start.getMinutes() - before);
      end.setMinutes(end.getMinutes() + after);
      break;
    case "days":
      start.setDate(start.getDate() - before);
      end.setDate(end.getDate() + after);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "months":
      if (normalizeMonthly) start.setDate(1);
      start.setMonth(start.getMonth() - before);
      end.setMonth(end.getMonth() + after);
      if (normalizeMonthly) {
        start.setDate(1);
        end.setMonth(end.getMonth() + 1, 0);
      }
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case "years":
      if (normalizeMonthly) start.setMonth(0, 1);
      start.setFullYear(start.getFullYear() - before);
      end.setFullYear(end.getFullYear() + after);
      if (normalizeMonthly) {
        start.setMonth(0, 1);
        end.setMonth(12, 0);
      }
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }
  return { start, end };
}
function listMonthsInRange(start, end, format = "YYYY-MM", options) {
  const {
    locale = "en-US",
    excludeStart = false,
    excludeEnd = false,
    descending = false
  } = options || {};
  let startDate = new Date(start);
  let endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid start or end date");
  }
  startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  const months = [];
  let current = new Date(startDate);
  while (current <= endDate) {
    const isStart = current.getTime() === startDate.getTime();
    const isEnd = current.getTime() === endDate.getTime();
    if (excludeStart && isStart || excludeEnd && isEnd) {
    } else {
      const year = current.getFullYear();
      const month = current.getMonth();
      let formatted;
      switch (format) {
        case "YYYY-MM":
          formatted = `${year}-${String(month + 1).padStart(2, "0")}`;
          break;
        case "YYYY-MMM":
          formatted = `${year}-${current.toLocaleString(locale, {
            month: "short"
          })}`;
          break;
        case "YYYY-MMMM":
          formatted = `${year}-${current.toLocaleString(locale, {
            month: "long"
          })}`;
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
      months.push(formatted);
    }
    current.setMonth(current.getMonth() + 1);
  }
  return descending ? months.reverse() : months;
}
function getMonthBoundsByYearMonthString(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
  return { start, end };
}
function getYearMonthStringFromDate(date) {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  return `${year}-${month}`;
}
function getMonthBounds(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
  return { start, end };
}
function mergeByKey(original, updates, key = "id") {
  const map = /* @__PURE__ */ new Map();
  for (const item of original) {
    map.set(item[key], item);
  }
  for (const item of updates) {
    map.set(item[key], item);
  }
  return Array.from(map.values());
}
function removeFromArrayByKey(array, value, key = "id") {
  if (!validate.array(array)) throw new Error("Invalid array");
  return array.filter((item) => item[key] !== value);
}
function hexToRgb(hexString) {
  const hex = hexString || "#000000";
  const cleaned = hex.replace(/^#/, "");
  if (![3, 6].includes(cleaned.length)) return "(0,0,0)";
  const fullHex = cleaned.length === 3 ? cleaned.split("").map((c) => c + c).join("") : cleaned;
  const num = parseInt(fullHex, 16);
  return `(${num >> 16 & 255 || 0},${num >> 8 & 255 || 0},${num & 255 || 0})`;
}
async function copyToClipboard(text, callback) {
  try {
    await navigator.clipboard.writeText(text);
    logger.log("Text copied to clipboard");
    if (callback) callback();
  } catch (err) {
    logger.error("Failed to copy text: ", err);
  }
}
function URLReload(newParams, anchor) {
  const current = new URLSearchParams(window.location.search);
  let changed = false;
  if (!validate.object(newParams)) {
    const hash2 = anchor ? `#${anchor}` : "";
    location.replace(
      `${window.location.pathname}${window.location.search}${hash2}`
    );
    return location.reload();
  }
  for (const [key, value] of Object.entries(newParams)) {
    if (current.get(key) !== value) {
      current.set(key, value);
      changed = true;
    }
  }
  const hash = anchor ? `#${anchor}` : "";
  const query = current.toString();
  const newUrl = `${window.location.pathname}?${query}${hash}`;
  window.location.replace(newUrl);
  return location.reload();
}
function flagEmojiToCountryCode(flag) {
  const countryCode = [...flag].map((char) => String.fromCharCode(char.codePointAt(0) - 127462 + 97)).join("");
  return countryCode.trim().toLowerCase();
}
var wait = (timeout = 100, callback) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback?.();
      resolve();
    }, timeout);
  });
};
var dropdownOptionsFromStrings = (strings) => {
  const options = [];
  const optionsIds = [];
  for (const str of strings) {
    if (!str.trim() || !validate.nonEmptyString(str)) continue;
    const sluggifiedStr = str.trim()?.replaceAll(" ", "_").toLowerCase();
    if (optionsIds?.includes(sluggifiedStr)) continue;
    optionsIds.push(sluggifiedStr);
    const option = {
      label: str,
      value: sluggifiedStr,
      id: sluggifiedStr
    };
    options.push(option);
  }
  return options || [];
};
function sanitizeMessageSensitiveData(msg, maxLen = 300) {
  let s = typeof msg === "string" ? msg : String(msg);
  s = s.replace(RE_WS, " ").trim();
  s = s.replace(RE_EMAIL, "[EMAIL]");
  s = s.replace(RE_QUERY_SENSITIVE, (_m, sep, k) => `${sep}${k}=[REDACTED]`);
  s = s.replace(RE_AUTH, (_m, k) => `${k} [REDACTED]`);
  s = s.replace(RE_AWS_ACCESS_KEY, "[AWS_ACCESS_KEY]");
  s = s.replace(RE_SECRET40, "[SECRET_40]");
  s = s.replace(RE_JWT, "[JWT]");
  s = s.replace(RE_LONG_DIGITS, "[NUMBER]");
  s = s.replace(RE_PEM_BLOCK, "[PEM]");
  s = s.replace(RE_IPV4_NOLB, (_m, pre) => `${pre}[IP]`);
  s = s.replace(RE_PATH_SECRET, (m) => {
    const i = m.lastIndexOf("/");
    return m.slice(0, i + 1) + "[REDACTED]";
  });
  if (s.length > maxLen) s = s.slice(0, maxLen) + "\u2026 (truncated)";
  return s;
}
function getErrorInfo(err, sanitize = true) {
  let message;
  let code;
  const pull = (e, depth = 0) => {
    if (!e || depth > 3) return;
    if (!message && typeof e.message === "string") message = e.message;
    if (code == null) {
      code = e.code ?? e.status ?? e.statusCode ?? e.errorCode ?? e.response?.status ?? e.body?.status;
    }
    if (!message) {
      const m = e.response?.data?.message ?? e.response?.data?.error?.message ?? e.data?.message ?? e.error?.message ?? e.body?.message;
      if (typeof m === "string") message = m;
    }
    if (!message && Array.isArray(e.errors) && e.errors.length) pull(e.errors[0], depth + 1);
    if (!message && e.cause) pull(e.cause, depth + 1);
  };
  if (err instanceof Error || typeof err === "object" && err !== null) {
    pull(err);
  } else if (typeof err === "string") {
    message = err;
  }
  if (!message) message = "Unknown error";
  let finalMessage = "";
  if (sanitize) finalMessage = sanitizeMessageSensitiveData(message);
  else finalMessage = message;
  return code != null ? { message: finalMessage, code } : { message: finalMessage };
}
function serializeToString(value) {
  if (value === null || value === void 0) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  if (value instanceof File) {
    return `file:${value.name}:${value.size}:${value.lastModified}`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(serializeToString).join(",")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value).sort(
      ([a], [b]) => a.localeCompare(b)
    );
    return `{${entries.map(([k, v]) => `${k}:${serializeToString(v)}`).join(",")}}`;
  }
  return String(value);
}
function createHashInput(values, separator = "|") {
  return values.map(serializeToString).join(separator);
}
function arrayIncludesString(arr, needle, caseSensitive = false) {
  if (!Array.isArray(arr) || typeof needle !== "string") return false;
  if (caseSensitive) return arr.includes(needle);
  const n = needle.toLowerCase();
  return arr.some((s) => typeof s === "string" && s.toLowerCase() === n);
}

// src/utils/_logger.ts
var dev = isDev();
var noop = () => {
};
var logger = {
  log: dev ? console.log.bind(console) : noop,
  warn: dev ? console.warn.bind(console) : noop,
  error: console.error.bind(console),
  // always logs
  devError: dev ? console.error.bind(console) : noop,
  logCaller: dev ? (...args) => {
    const name = callerName(3);
    console.log(`${name}()`, ...args);
  } : noop,
  page: dev ? () => {
    console.log("Page:", pageStore().get());
  } : noop,
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

export {
  pageStore,
  logger,
  RE_WS,
  RE_QUERY_SENSITIVE,
  RE_AUTH,
  RE_AWS_ACCESS_KEY,
  RE_SECRET40,
  RE_LONG_DIGITS,
  RE_IPV4_NOLB,
  RE_PATH_SECRET,
  RE_PEM_BLOCK,
  RE_WHITESPACE,
  RE_NON_WORD,
  RE_SLUG,
  RE_USERNAME_SIMPLE,
  RE_HASHTAG,
  RE_MENTION,
  RE_INT,
  RE_FLOAT,
  RE_NUMBER_THOUSANDS,
  RE_HEX_PREFIXED,
  RE_HEX_COLOR,
  RE_RGB,
  RE_RGBA,
  RE_HSL,
  RE_HSLA,
  RE_EMAIL,
  RE_DOMAIN,
  RE_URL_HTTP,
  RE_URL_SIMPLE,
  RE_IPV4,
  RE_IPV6_SIMPLE,
  RE_MAC,
  RE_HOSTPORT,
  RE_E164_PHONE,
  RE_DATE_ISO,
  RE_TIME_24H,
  RE_TIME_12H,
  RE_DATETIME_ISO,
  RE_DATE_DDMMYYYY,
  RE_DATE_MMDDYYYY,
  RE_TZ_OFFSET,
  RE_UUID_ANY,
  RE_UUID_V4,
  RE_ULID,
  RE_BASE64,
  RE_JWT,
  RE_SHA1,
  RE_SHA256,
  RE_GIT_COMMIT,
  RE_IBAN_GENERIC,
  RE_CREDITCARD_GENERIC,
  RE_VISA,
  RE_MASTERCARD,
  RE_CURRENCY_GENERIC,
  RE_PERCENT,
  RE_ZIP_US,
  RE_CAP_IT,
  RE_POSTCODE_UK_APPROX,
  RE_FILENAME_SAFE,
  RE_UNIX_PATH,
  RE_WINDOWS_PATH,
  RE_EXTENSION,
  RE_MIME_TYPE,
  RE_LAT,
  RE_LON,
  RE_LATLON_PAIR,
  RE_CAMEL_CASE,
  RE_PASCAL_CASE,
  RE_SNAKE_CASE,
  RE_KEBAB_CASE,
  RE_HTML_TAG,
  RE_CSV_LINE,
  RE_PASSWORD_STRONG,
  RE_IPV6,
  RE_CF_IT_STRICT,
  RE_CF_IT_OMOCODIA,
  RE_PIVA_IT,
  RE_PEC_IT_STRICT,
  RE_PEC_GENERIC,
  RE_VAT_AT,
  RE_VAT_BE,
  RE_VAT_BG,
  RE_VAT_HR,
  RE_VAT_CY,
  RE_VAT_CZ,
  RE_VAT_DK,
  RE_VAT_EE,
  RE_VAT_FI,
  RE_VAT_FR,
  RE_VAT_DE,
  RE_VAT_EL,
  RE_VAT_HU,
  RE_VAT_IE,
  RE_VAT_IT,
  RE_VAT_LV,
  RE_VAT_LT,
  RE_VAT_LU,
  RE_VAT_MT,
  RE_VAT_NL,
  RE_VAT_PL,
  RE_VAT_PT,
  RE_VAT_RO,
  RE_VAT_SK,
  RE_VAT_SI,
  RE_VAT_ES,
  RE_VAT_SE,
  RE_S3_URI,
  RE_S3_VHOST_URL,
  RE_S3_PATH_URL,
  RE_R2_PUBLIC_URL,
  RE_R2_S3_COMPAT_URL,
  RE_SEMVER,
  RE_SEMVER_RANGE_SIMPLE,
  RE_SEMVER_RANGE_COMPARATORS,
  validate,
  isBrowser,
  isWindowAvailable,
  isDev,
  stringStartsWith,
  validateFile,
  imageExistsAtURL,
  clearUrl,
  getSubdomain,
  redirectOrReload,
  checkPasswordStrength,
  capitalize,
  formSubmit,
  capitalizeEachWord,
  parseCookie,
  isLocalhost,
  getUrlParam,
  sleep,
  removeWWW,
  mapToObject,
  getRandomNumber,
  getRandomString,
  arrrayGetLast,
  getPathList,
  getCurrentPath,
  buildPath,
  detectAnalysisFileType,
  scrollToElement,
  clickOutside,
  setHiddenStatus,
  toggleHiddenStatus,
  toHtmlId,
  toggleArrayItem,
  updateUniqueArray,
  updateArrayByKey,
  toCamelCase,
  toSnakeCase,
  portal,
  isValidTimeStr,
  isValidDate,
  formatDateForInput,
  addMinutesToTime,
  setTimeForDate,
  addMinutesToDate,
  parseDate,
  dateToTime24h,
  dateToTime12h,
  URLGetParam,
  isSameMonth,
  isSameYear,
  getMidpointDate,
  getYearBounds,
  callerName,
  arrayGetByKey,
  checkFileSize,
  getMatchScore,
  componentCallbackDispatcher,
  objectsDiffer,
  removeNullish,
  flattenObject,
  getTimeBounds,
  listMonthsInRange,
  getMonthBoundsByYearMonthString,
  getYearMonthStringFromDate,
  getMonthBounds,
  mergeByKey,
  removeFromArrayByKey,
  hexToRgb,
  copyToClipboard,
  URLReload,
  flagEmojiToCountryCode,
  wait,
  dropdownOptionsFromStrings,
  sanitizeMessageSensitiveData,
  getErrorInfo,
  serializeToString,
  createHashInput,
  arrayIncludesString
};
//# sourceMappingURL=chunk-X2EO4XOA.js.map