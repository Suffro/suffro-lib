// src/_typesValidation.ts
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

// src/_utils.ts
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
  const query2 = current.toString();
  const newUrl = `${window.location.pathname}?${query2}${hash}`;
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

// src/_pageStore.ts
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

// src/_logger.ts
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

// src/_browserStorage.ts
var _isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
function browserStorage(type, namespace) {
  const _storage = _isBrowser ? type === "local" ? localStorage : sessionStorage : void 0;
  const _prefix = namespace ? `${namespace}:` : "";
  function _fullKey(key) {
    return `${_prefix}${key}`;
  }
  function getItem(key) {
    if (!_isBrowser) return null;
    const raw = _storage?.getItem(_fullKey(key));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        _storage?.removeItem(_fullKey(key));
        return null;
      }
      return parsed.value;
    } catch {
      return null;
    }
  }
  function getNamespaceItems() {
    if (!_isBrowser) return [];
    const items = [];
    for (let i = 0; i < (_storage?.length ?? 0); i++) {
      const fullKey = _storage?.key(i);
      if (!fullKey || _prefix && !fullKey.startsWith(_prefix)) continue;
      const key = fullKey.slice(_prefix.length);
      const raw = _storage?.getItem(fullKey);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) continue;
        items.push({ key, value: parsed.value });
      } catch {
      }
    }
    return items;
  }
  function getItemsByKeys(keys) {
    if (!_isBrowser) return [];
    const items = [];
    for (const key of keys) {
      const fullKey = _fullKey(key);
      const raw = _storage?.getItem(fullKey);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) continue;
        items.push({ key, value: parsed.value });
      } catch {
      }
    }
    return items;
  }
  function setItem(key, value, options) {
    if (!_isBrowser) return;
    const expiresAt = options?.expiresIn ? Date.now() + options.expiresIn * 1e3 : void 0;
    const payload = { value, expiresAt };
    try {
      _storage?.setItem(_fullKey(key), JSON.stringify(payload));
    } catch (err) {
      logger.warn(`[browserStorage] Failed to set key "${key}"`, err);
    }
  }
  function removeItem(key) {
    if (!_isBrowser) return;
    _storage?.removeItem(_fullKey(key));
  }
  function clear() {
    if (!_isBrowser) return;
    keysList().forEach((key) => _storage?.removeItem(key));
  }
  function clearExpired() {
    if (!_isBrowser) return;
    keysList().forEach((key) => {
      const raw = _storage?.getItem(key);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          _storage?.removeItem(key);
        }
      } catch {
      }
    });
  }
  function length() {
    if (!_isBrowser) return 0;
    return keysList().length;
  }
  function keysList() {
    if (!_isBrowser) return [];
    const keys = [];
    for (let i = 0; i < (_storage?.length ?? 0); i++) {
      const key = _storage?.key(i);
      if (key && (!_prefix || key.startsWith(_prefix))) {
        keys.push(key);
      }
    }
    return keys;
  }
  return {
    getItem,
    getNamespaceItems,
    getItemsByKeys,
    setItem,
    removeItem,
    clear,
    clearExpired,
    length,
    keysList
  };
}

// node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
var cursorRequestMap = /* @__PURE__ */ new WeakMap();
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);

// node_modules/idb/build/index.js
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));

// src/_idb.ts
async function idb(dbName, version, storeDefs) {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    console.error("[IDB] IndexedDB is not available in this context.");
    return null;
  }
  const DB_INSTANCE = await openDB(dbName, version, {
    upgrade(db) {
      if (!storeDefs) return;
      for (const [storeName, schema] of Object.entries(storeDefs)) {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, {
            keyPath: schema.keyPath ?? "id"
          });
          if (schema.indices) {
            for (const index of schema.indices) {
              store.createIndex(index.name, index.keyPath, index.options);
            }
          }
        }
      }
    }
  });
  async function _get() {
    return DB_INSTANCE;
  }
  async function _state(storeName) {
    try {
      const db = await _get();
      if (!db.objectStoreNames.contains(storeName)) {
        return "not-found";
      }
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const count = await store.count();
      return count === 0 ? "empty" : "populated";
    } catch (err) {
      logger.error("Error on DB check:", err);
      return "not-found";
    }
  }
  async function _exists(storeName) {
    const res = await _state(storeName);
    return !(res === "not-found");
  }
  async function _isPopulated(storeName) {
    const res = await _state(storeName);
    return res === "populated";
  }
  async function _clearStore(storeName) {
    const db = await _get();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    await store.clear();
    await tx.done;
    _notifyChange({ type: "clearStore", store: storeName });
  }
  function _deleteDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => console.warn("Delete blocked: close all tabs.");
    });
  }
  async function _getAllKeys(storeName) {
    const db = await _get();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    return await store.getAllKeys();
  }
  async function _findByField(storeName, field, value) {
    const db = await _get();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    if (!store.indexNames.contains(field)) {
      throw new Error(`Index "${String(field)}" does not exist`);
    }
    const index = store.index(field);
    return await index.getAll(value);
  }
  async function _delete(storeName, keys) {
    const db = await _get();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    for (const key of keys) {
      await store.delete(key);
    }
    await tx.done;
    _notifyChange({ type: "delete", store: storeName, keys });
  }
  async function _put(storeName, doc2) {
    const db = await _get();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    await store.put(doc2);
    await tx.done;
    _notifyChange({ type: "put", store: storeName, doc: doc2 });
  }
  async function _bulkPut(storeName, docs) {
    const db = await _get();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    for (const doc2 of docs) {
      await store.put(doc2);
    }
    await tx.done;
    _notifyChange({ type: "bulkPut", store: storeName, count: docs.length });
  }
  const channel = new BroadcastChannel("indexeddb-sync");
  function _onChange(callback) {
    channel.onmessage = (event) => {
      callback(event.data);
    };
  }
  function _notifyChange(payload) {
    channel.postMessage(payload);
  }
  async function _paginate(storeName, limit, offset) {
    const db = await _get();
    const tx = db.transaction(storeName);
    const store = tx.objectStore(storeName);
    const results = [];
    let skipped = 0;
    const cursor = await store.openCursor();
    while (cursor && results.length < limit) {
      if (skipped < offset) {
        skipped++;
        await cursor.continue();
        continue;
      }
      results.push(cursor.value);
      await cursor.continue();
    }
    return results;
  }
  const endpoints = {
    get: _get,
    state: _state,
    delete: _delete,
    exists: _exists,
    isPopulated: _isPopulated,
    put: _put,
    bulkPut: _bulkPut,
    findByField: _findByField,
    getAllKeys: _getAllKeys,
    notifyChange: _notifyChange,
    onChange: _onChange,
    deleteDb: _deleteDb,
    clearStore: _clearStore,
    paginate: _paginate
  };
  return endpoints;
}

// src/_crypto.ts
async function digestHex(input, algorithm) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hmacSha256Hex(key, message) {
  const enc = new TextEncoder();
  const keyData = enc.encode(key);
  const msgData = enc.encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function encodeBase64(input) {
  const bytes = new TextEncoder().encode(input);
  return btoa(String.fromCharCode(...bytes));
}
function decodeBase64(base64) {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function generateRandomInitializationVector() {
  return crypto.getRandomValues(new Uint8Array(12));
}
async function aesGcmEncrypt(plaintext, key, iv) {
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  return new Uint8Array(ciphertext);
}
async function aesGcmDecrypt(ciphertext, key, iv) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}
var cryptoTools = {
  digest: {
    digestHex,
    hmacSha256Hex
  },
  base64: {
    encode: encodeBase64,
    decode: decodeBase64
  },
  AES: {
    encode: aesGcmEncrypt,
    decode: aesGcmDecrypt,
    randomInitializationVector: generateRandomInitializationVector
  }
};

// src/appConfig/_config.ts
var _config = null;
function initAppConfig(config) {
  if (_config) {
    console.error("AppConfig already initialized, returning active configuration");
    return;
  }
  _config = config;
}
function getAppConfig() {
  if (!_config) {
    throw new Error("No AppConfig initializtion. Use initAppConfig(config) to initialize it");
  }
  return _config;
}

// src/firebase/_reCaptchaVerifier.ts
var recaptchaVerifier = null;
async function getRecaptchaVerifier(auth) {
  if (typeof window === "undefined") throw new Error("reCAPTCHA can only be used in the browser.");
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
  const { RecaptchaVerifier } = await import("firebase/auth");
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible"
    });
  }
  if (!recaptchaVerifier) throw new Error("Failed to create reCAPTCHA verifier");
  return recaptchaVerifier;
}

// src/firebase/storage/_methods.ts
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getBlob,
  deleteObject
} from "firebase/storage";
var getFilePath = (fileName, folderSegments) => {
  const cleanedFileName = fileName.trim().replaceAll(" ", "_").replaceAll("/", "");
  const cleanedSegments = folderSegments.filter((str) => str.trim() !== "");
  const segmentsString = cleanedSegments.join("/").trim();
  const folderPath = segmentsString.trim().replaceAll("//", "/").replaceAll(" ", "_");
  const rawFullPath = `${folderPath}/${cleanedFileName}`;
  const fullPath = rawFullPath.trim().replaceAll("//", "/").replaceAll(" ", "_");
  if (!(typeof fullPath === "string" && fullPath.trim().length > 0))
    throw "The file path is empty or invalid";
  return {
    folderPath,
    fullPath,
    fileName: cleanedFileName
  };
};
var initStorageMethods = (storage) => ({
  /**
   * Carica un file su Firebase Storage in un path dinamico.
   * @param file - Il file da caricare
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   * @returns URL pubblico al file caricato
   */
  uploadFile: async function _uploadFile(file, fileName, folderSegments) {
    logger.logCaller();
    if (folderSegments.length === 0) {
      throw new Error("Storage path is required");
    }
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  },
  /**
   * Elimina un file da Firebase Storage.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   */
  deleteFile: async function _deleteFile(fileName, folderSegments) {
    logger.logCaller();
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);
    await deleteObject(fileRef);
  },
  /**
   * Elenca tutti i file in una cartella.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   */
  listFiles: async function _listFiles(folderSegments) {
    logger.logCaller();
    const folderPath = getFilePath("", folderSegments)?.folderPath;
    const folderRef = ref(storage, folderPath);
    const res = await listAll(folderRef);
    const urls = await Promise.all(
      res.items.map((itemRef) => getDownloadURL(itemRef))
    );
    return urls;
  },
  /**
   * Scarica un file come Blob.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   * @returns Un Blob del file
   */
  downloadFile: async function _downloadFileAsBlob(fileName, folderSegments) {
    logger.logCaller();
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);
    return await getBlob(fileRef);
  },
  /**
   * Ottiene l'URL pubblico di un file.
   * @param folderSegments - Array di stringhe che formano il path della cartella dove si trova il file (es. per branding/icons/logo.png dovrai passare ['branding', 'icons'])
   */
  getFileUrl: async function _getPublicDownloadURL(fileName, folderSegments) {
    logger.logCaller();
    const filePath = getFilePath(fileName, folderSegments);
    const fileRef = ref(storage, filePath?.fullPath);
    return await getDownloadURL(fileRef);
  }
});

// src/firebase/auth/_methods.ts
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateEmail,
  updatePassword
} from "firebase/auth";
var initAuthMethods = (auth) => ({
  //////////////////// SIGNOUT ////////////////////
  signout: async function firebaseSignout(options) {
    try {
      logger.logCaller();
      await signOut(auth);
      try {
        await wait(400);
        redirectOrReload(options);
      } catch (error) {
        logger.error(error);
      }
    } catch (err) {
      logger.devError("Logout failed:", err);
    }
  },
  //////////////////// SIGNUP ////////////////////
  signup: async function firebaseSignup(email, password, passwordConfirmation, redirectPath) {
    try {
      logger.logCaller();
      if (password != passwordConfirmation)
        throw new Error("Passwords do not match");
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      logger.log("User signed up:", userCredential.user);
    } catch (err) {
      logger.devError("Signup error:", err);
    }
  },
  //////////////////// SIGNIN ////////////////////
  signin: async function firebaseSignin(email, password, remember, redirectPath) {
    try {
      logger.logCaller();
      const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      logger.log("\u2705 persistence set");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      logger.log("\u2705 Signed in:", userCredential.user);
    } catch (err) {
      logger.devError(err);
    }
  },
  //////////////////// FORGOT PASSWORD ////////////////////
  forgotPassword: async function forgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      logger.devError(error);
    }
  },
  //////////////////// GOOGLE AUTH ////////////////////
  googleAuth: async function googleAuth(withRedirect) {
    try {
      logger.logCaller();
      const provider = new GoogleAuthProvider();
      await setPersistence(auth, browserLocalPersistence);
      logger.log("Auth persistence set");
      if (withRedirect) {
        console.log(`Starting Google auth [redirect]`);
        await signInWithRedirect(auth, provider);
      } else {
        console.log(`Starting Google auth [popup]`);
        const result = await signInWithPopup(auth, provider);
        const user = result?.user;
      }
    } catch (error) {
      logger.devError("Google auth error:\n", error?.message);
    }
  },
  //////////////////// GITHUB AUTH ////////////////////
  githubAuth: async function gitHubAuth(withRedirect) {
    try {
      logger.logCaller();
      const provider = new GithubAuthProvider();
      await setPersistence(auth, browserLocalPersistence);
      logger.log("Auth persistence set");
      if (withRedirect) {
        console.log(`Starting GitHub auth [redirect]`);
        await signInWithRedirect(auth, provider);
      } else {
        console.log(`Starting GitHub auth [popup]`);
        const result = await signInWithPopup(auth, provider);
        const user = result?.user;
      }
    } catch (error) {
      logger.devError("GitHub auth error:\n", error?.message);
    }
  },
  isLoggedIn: () => {
    logger.logCaller();
    if (!auth) return false;
    const currentUser = auth?.currentUser;
    logger.log(currentUser);
    if (!currentUser) return false;
    const isAnonymus = currentUser?.isAnonymous;
    logger.log(isAnonymus);
    if (isAnonymus) return false;
    const uid = currentUser?.uid;
    logger.log(uid);
    if (!validate.nonEmptyString(uid)) return false;
    return true;
  },
  // --- Helper: Reauthenticate with email/password ---
  reauthenticate: async function reauthenticateUser(email, currentPassword) {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    const credential = EmailAuthProvider.credential(email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  },
  // --- Update Email ---
  updateEmail: async function updateUserEmail(newEmail) {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    await updateEmail(user, newEmail);
  },
  // --- Update Password ---
  updatePassword: async function updateUserPassword(newPassword) {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    await updatePassword(user, newPassword);
  },
  // --- Update Password ---
  get: function get2() {
    logger.logCaller();
    const user = auth?.currentUser;
    if (!user) throw "User is not authenticated.";
    return user;
  }
});

// src/firebase/auth/_authState.ts
import { onAuthStateChanged } from "firebase/auth";
var observer = null;
function authStateObsverver(appAuth) {
  if (observer) {
    console.warn("authStateObsverver() already initialized, returning active instance");
    return observer;
  }
  ;
  let listeners = [];
  let current = null;
  function notify(user) {
    current = user;
    for (const cb of listeners) cb(user);
  }
  onAuthStateChanged(appAuth, (user) => {
    notify(user);
  });
  const _observer = {
    /** 
     * callback: (user) => void  
     * restituisce un unsubscribe 
     */
    subscribe(callback) {
      listeners.push(callback);
      callback(current);
      return () => {
        listeners = listeners.filter((cb) => cb !== callback);
      };
    },
    /** sincrono: leggi l’ultimo valore noto */
    user() {
      return current;
    },
    /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
    logged() {
      const uid = current?.uid;
      return validate.nonEmptyString(uid);
    },
    /** sincrono: leggi l’ultimo valore noto e se risulta loggato restituisci true altrimenti false */
    get() {
      return appAuth;
    }
  };
  observer = _observer;
  return _observer;
}

// src/firebase/firestore/_methods.ts
import {
  doc,
  setDoc,
  updateDoc,
  Timestamp,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import {
  PhoneAuthProvider,
  linkWithCredential,
  updateProfile
} from "firebase/auth";
var _userCollectionRestriction = (collectionName) => {
  if (collectionName === "users")
    throw new Error("Do NOT use this function for the user doc");
};
var _getFsUser = (auth) => {
  if (!auth?.currentUser) throw new Error("User not found");
  return auth.currentUser;
};
async function _getDoc(db, collectionName, id) {
  logger.logCaller();
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const ref2 = doc(db, collectionName, id);
  const snap = await getDoc(ref2);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
async function create(auth, db, collectionName, data) {
  logger.logCaller();
  _userCollectionRestriction(collectionName);
  const date = /* @__PURE__ */ new Date();
  const createdAt = Timestamp.fromDate(date);
  const preRef = doc(collection(db, collectionName));
  const raw = `${preRef.id}_${createdAt.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await setDoc(preRef, {
    id: preRef.id,
    hash,
    locale: navigator?.language || (await appUserGet(auth, db))?.locale,
    createdAt,
    lastModified: createdAt,
    ...data
  });
  return preRef.id;
}
async function update(db, collectionName, id, data) {
  logger.logCaller();
  _userCollectionRestriction(collectionName);
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const date = /* @__PURE__ */ new Date();
  const lastModified = Timestamp.fromDate(date);
  const preRef = doc(collection(db, collectionName));
  const raw = `${id}_${lastModified.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    hash,
    lastModified
  });
  return id;
}
async function set(db, collectionName, id, data) {
  _userCollectionRestriction(collectionName);
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const date = /* @__PURE__ */ new Date();
  const lastModified = Timestamp.fromDate(date);
  const preRef = doc(collection(db, collectionName));
  const raw = `${id}_${lastModified.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await setDoc(doc(db, collectionName, id), {
    ...data,
    id,
    hash,
    lastModified
  }, { merge: true });
  return id;
}
async function get(db, collectionName, id) {
  logger.logCaller();
  _userCollectionRestriction(collectionName);
  return await _getDoc(db, collectionName, id);
}
async function listDocs(db, collectionName, conditions) {
  logger.logCaller();
  let q;
  if (conditions && conditions?.length > 0) {
    q = query(
      collection(db, collectionName),
      ...conditions.map(([field, op, value]) => where(field, op, value))
    );
  } else {
    q = collection(db, collectionName);
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}
async function remove(db, collection2, id) {
  logger.logCaller();
  if (!validate.string(id)) throw new Error("Missing document ID.");
  const docRef = doc(db, collection2, id);
  await deleteDoc(docRef);
  return id;
}
async function removeWhere(db, collectionName, conditions) {
  logger.logCaller();
  const q = query(
    collection(db, collectionName),
    ...conditions.map(([field, op, value]) => where(field, op, value))
  );
  const snapshot = await getDocs(q);
  const deletions = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
  await Promise.all(deletions);
  return snapshot.docs.map((docSnap) => docSnap.id);
}
async function createInSubcollection(db, parentCollection, parentId, subcollection, data, isUser) {
  logger.logCaller();
  if (!validate.string(parentId)) throw new Error("Missing parent document ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const subRef = collection(db, parentCollection, parentId, subcollection);
  const preRef = doc(subRef);
  const createdAt = Timestamp.fromDate(/* @__PURE__ */ new Date());
  const raw = `${preRef.id}_${createdAt.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await setDoc(preRef, {
    ...data,
    id: preRef.id,
    hash,
    createdAt
  });
  return preRef.id;
}
async function setInSubcollection(db, parentCollection, parentId, subcollection, docId, data, isUser) {
  logger.logCaller();
  if (!validate.string(parentId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const ref2 = doc(db, parentCollection, parentId, subcollection, docId);
  const lastModified = Timestamp.fromDate(/* @__PURE__ */ new Date());
  const raw = `${docId}_${lastModified.toMillis()}`;
  const hash = await cryptoTools.digest.digestHex(raw, "SHA-256") || "";
  await setDoc(ref2, {
    ...data,
    id: docId,
    hash,
    lastModified
  }, { merge: true });
  return docId;
}
async function getFromSubcollection(db, parentCollection, parentId, subcollection, docId, isUser) {
  logger.logCaller();
  if (!validate.string(parentId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const ref2 = doc(db, parentCollection, parentId, subcollection, docId);
  const snap = await getDoc(ref2);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
async function listFromSubcollection(db, parentCollection, parentId, subcollection, isUser) {
  logger.logCaller();
  if (!validate.string(parentId))
    throw new Error("Missing parent document ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const colRef = collection(db, parentCollection, parentId, subcollection);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}
async function removeFromSubcollection(db, parentCollection, parentId, subcollection, docId, isUser) {
  logger.logCaller();
  if (!validate.string(parentId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  if (!isUser) _userCollectionRestriction(parentCollection);
  const ref2 = doc(db, parentCollection, parentId, subcollection, docId);
  await deleteDoc(ref2);
  return docId;
}
async function appUserSet(auth, db, data, opts = { merge: true }) {
  logger.logCaller();
  const user = _getFsUser(auth);
  const { merge, id } = opts;
  const userId = id ?? user?.uid;
  if (!validate.string(userId))
    throw new Error("Could not find User or its uid.");
  await setDoc(
    doc(db, "users", userId),
    {
      ...data,
      displayName: data?.displayName ?? user.displayName
    },
    { merge }
  );
}
async function appUserGet(auth, db) {
  logger.logCaller();
  const userId = auth.currentUser?.uid;
  if (!validate.string(userId))
    throw new Error("Could not find User or its uid.");
  const userData = await _getDoc(db, "users", userId);
  if (!userData) logger.warn("\u26A0\uFE0F No user document found.");
  return userData;
}
async function appUserCreateInSubcollection(db, userId, subcollection, data) {
  logger.logCaller();
  if (!validate.string(userId)) throw new Error("Missing user document ID.");
  const id = await createInSubcollection(db, "users", userId, subcollection, data, true);
  return id;
}
async function appUserSetInSubcollection(db, userId, subcollection, docId, data) {
  logger.logCaller();
  if (!validate.string(userId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  await setInSubcollection(db, "users", userId, subcollection, docId, data, true);
  return docId;
}
async function appUserGetFromSubcollection(db, userId, subcollection, docId) {
  logger.logCaller();
  if (!validate.string(userId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  const res = await getFromSubcollection(db, "users", userId, subcollection, docId, true);
  return res;
}
async function appUserListFromSubcollection(db, userId, subcollection) {
  logger.logCaller();
  if (!validate.string(userId))
    throw new Error("Missing parent document ID.");
  const res = await listFromSubcollection(db, "users", userId, subcollection, true);
  return res;
}
async function appUserRemoveFromSubcollection(db, userId, subcollection, docId) {
  logger.logCaller();
  if (!validate.string(userId) || !validate.string(docId))
    throw new Error("Missing parent or subdocument ID.");
  await removeFromSubcollection(db, "users", userId, subcollection, docId, true);
  return docId;
}
var initFirestoreDocsMethods = (auth, db, usersCollectionName = "users") => ({
  create: async function _create(collectionName, data) {
    return await create(auth, db, collectionName, data);
  },
  update: async function _update(collectionName, id, data) {
    return await update(db, collectionName, id, data);
  },
  set: async function _set(collectionName, id, data) {
    return await set(db, collectionName, id, data);
  },
  get: async function _get(collectionName, id) {
    return await get(db, collectionName, id);
  },
  list: async function _list(collectionName, conditions) {
    if (conditions && conditions?.length > 0) return await listDocs(db, collectionName, conditions);
    else return await listDocs(db, collectionName);
  },
  remove: async function _remove(collectionName, id) {
    return await remove(db, collectionName, id);
  },
  removeWhere: async function _removeWhere(collectionName, conditions) {
    return await removeWhere(db, collectionName, conditions);
  },
  subcollections: {
    create: async function _create(parentCollection, parentId, subcollection, data) {
      const res = await createInSubcollection(db, parentCollection, parentId, subcollection, data);
      return res;
    },
    set: async function _set(parentCollection, parentId, subcollection, docId, data) {
      const res = await setInSubcollection(db, parentCollection, parentId, subcollection, docId, data);
      return res;
    },
    get: async function _get(parentCollection, parentId, subcollection, docId) {
      const res = await getFromSubcollection(db, parentCollection, parentId, subcollection, docId);
      return res;
    },
    list: async function _list(parentCollection, parentId, subcollection) {
      const res = await listFromSubcollection(db, parentCollection, parentId, subcollection);
      return res;
    },
    remove: async function _remove(parentCollection, parentId, subcollection, docId) {
      const res = await removeFromSubcollection(db, parentCollection, parentId, subcollection, docId);
      return res;
    }
  },
  users: {
    create: async function _create(data) {
      return await create(auth, db, usersCollectionName, data);
    },
    update: async function _update(id, data) {
      return await update(db, usersCollectionName, id, data);
    },
    set: async function _set(id, data) {
      return await set(db, usersCollectionName, id, data);
    },
    get: async function _get(id) {
      return await get(db, usersCollectionName, id);
    },
    remove: async function _remove(id) {
      return await remove(db, usersCollectionName, id);
    },
    removeWhere: async function _removeWhere(conditions) {
      return await removeWhere(db, usersCollectionName, conditions);
    },
    subcollections: {
      create: async function _create(userId, subcollection, data) {
        const res = await appUserCreateInSubcollection(db, userId, subcollection, data);
        return res;
      },
      set: async function _set(userId, subcollection, docId, data) {
        const res = await appUserSetInSubcollection(db, userId, subcollection, docId, data);
        return res;
      },
      get: async function _get(userId, subcollection, docId) {
        const res = await appUserGetFromSubcollection(db, userId, subcollection, docId);
        return res;
      },
      list: async function _list(userId, subcollection) {
        const res = await appUserListFromSubcollection(db, userId, subcollection);
        return res;
      },
      remove: async function _remove(userId, subcollection, docId) {
        const res = await appUserRemoveFromSubcollection(db, userId, subcollection, docId);
        return res;
      }
    }
  }
});
var initFirestoreCurrentUserDocMethods = (auth, db) => ({
  set: async function _set(data, opts) {
    return await appUserSet(auth, db, data, opts);
  },
  get: async function _get() {
    return await appUserGet(auth, db);
  }
});

// src/firebase/firestore/_firestoreTypesValidation.ts
import {
  Timestamp as Timestamp2,
  GeoPoint
} from "firebase/firestore";

// src/firebase/_client.ts
import { getApp, getApps } from "firebase/app";
var client;
var initializeFirebaseClient = (services) => {
  if (client) {
    console.warn("Firebase client already initialized, returning active instance");
    return client;
  }
  const apps = getApps() || [];
  if (apps?.length && apps?.length === 0) throw "Couldn't find any Firebase initialization";
  let _client = {
    instances: {
      app: getApp(),
      ...services
    }
  };
  if (services?.storage) _client.storage = initStorageMethods(services.storage);
  const auth = services?.auth;
  if (auth) _client["currentUser"] = initAuthMethods(auth);
  else return _client;
  if (services?.firestore) _client["currentUser"]["doc"] = initFirestoreCurrentUserDocMethods(auth, services.firestore);
  if (services?.firestore) _client["firestore"] = initFirestoreDocsMethods(auth, services.firestore);
  client = _client;
  return _client;
};

// src/firebase/_init.ts
import {
  getApp as getApp2,
  getApps as getApps2,
  initializeApp
} from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";
var _context;
var _functions;
var initFunctions = (app, region) => {
  try {
    if (!_functions) {
      const fns = getFunctions(app, region);
      _functions = fns;
    }
  } catch (error) {
    console.error(error);
    _functions = null;
  } finally {
    return;
  }
};
var initializeFirebaseContext = (configuration, logs) => {
  if (!configuration) throw new Error("Missing Firebase configuration");
  if (_context) {
    console.warn("Firebase app already initialized, returning active instance");
    return _context;
  }
  const apps = getApps2();
  let alreadyInitialized = false;
  if (apps && validate.array(apps) && validate.nonEmptyArray(apps) && apps.length > 0)
    alreadyInitialized = true;
  if (alreadyInitialized) throw "Firebase app already initialized";
  const dev2 = isDev();
  if (logs && dev2) console.log("Initializing Firebase instances...");
  const app = alreadyInitialized ? getApp2() : initializeApp(configuration);
  if (logs && dev2) console.log("Firebase app initialized");
  const auth = getAuth(app);
  if (logs && dev2) console.log("Firebase auth initialized");
  const storage = configuration.storageBucket ? getStorage(app) : void 0;
  if (logs && configuration.storageBucket)
    console.log("Firebase storage initialized");
  const firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  if (logs && dev2) console.log("Firebase firestore initialized");
  if (logs && dev2) console.log("Firebase instances initialized successfully");
  if (logs && dev2) console.log("Initializing Firebase client...");
  const client2 = initializeFirebaseClient({
    auth,
    firestore,
    storage
  });
  if (logs && dev2) console.log("Firebase client initialization completed.");
  if (logs && dev2) console.log("Initializing Firebase functions...");
  if (!_functions) initFunctions(app, configuration?.regionOrCustomDomain);
  if (_functions && logs && dev2) console.log("Firebase functions initialization completed.");
  if (!_functions && logs && dev2) console.warn("Couldn't initialize Firebase functions.");
  const callableFunction = (functionName, data, region, options) => {
    if (!_functions) initFunctions(app, region);
    if (!_functions) return null;
    const callable = httpsCallable(_functions, functionName, options);
    return callable;
  };
  const context = {
    app,
    auth,
    firestore,
    storage,
    client: client2,
    functions: {
      get: () => _functions,
      callable: callableFunction
    }
  };
  if (logs && dev2) console.log("Created Firebase context");
  _context = context;
  return context;
};
export {
  URLGetParam,
  URLReload,
  addMinutesToDate,
  addMinutesToTime,
  arrayGetByKey,
  arrrayGetLast,
  authStateObsverver,
  browserStorage,
  buildPath,
  callerName,
  capitalize,
  capitalizeEachWord,
  checkFileSize,
  checkPasswordStrength,
  clearUrl,
  clickOutside,
  componentCallbackDispatcher,
  copyToClipboard,
  cryptoTools,
  dateToTime12h,
  dateToTime24h,
  detectAnalysisFileType,
  dropdownOptionsFromStrings,
  flagEmojiToCountryCode,
  flattenObject,
  formSubmit,
  formatDateForInput,
  getAppConfig,
  getCurrentPath,
  getMatchScore,
  getMidpointDate,
  getMonthBounds,
  getMonthBoundsByYearMonthString,
  getPathList,
  getRandomNumber,
  getRandomString,
  getRecaptchaVerifier,
  getSubdomain,
  getTimeBounds,
  getUrlParam,
  getYearBounds,
  getYearMonthStringFromDate,
  hexToRgb,
  idb,
  initAppConfig,
  initializeFirebaseClient,
  initializeFirebaseContext,
  isBrowser,
  isDev,
  isLocalhost,
  isSameMonth,
  isSameYear,
  isValidDate,
  isValidTimeStr,
  isWindowAvailable,
  listMonthsInRange,
  logger,
  mapToObject,
  mergeByKey,
  objectsDiffer,
  pageStore,
  parseCookie,
  parseDate,
  portal,
  redirectOrReload,
  removeFromArrayByKey,
  removeNullish,
  removeWWW,
  scrollToElement,
  setHiddenStatus,
  setTimeForDate,
  sleep,
  stringStartsWith,
  toCamelCase,
  toHtmlId,
  toSnakeCase,
  toggleArrayItem,
  toggleHiddenStatus,
  updateArrayByKey,
  updateUniqueArray,
  validate,
  wait
};
//# sourceMappingURL=index.js.map