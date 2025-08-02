import { logger } from "./";
import { validate } from "./_typesValidation";
export const isBrowser = () => {
    return (typeof window !== 'undefined' && typeof document !== 'undefined');
};
export const isWindowAvailable = () => {
    return (typeof window !== 'undefined');
};
export const isDev = () => {
    const isLocalhost = typeof window !== 'undefined' &&
        ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const nodeEnv = process?.env?.NODE_ENV;
    return ((nodeEnv !== 'production') || isLocalhost);
};
export const getSubdomain = (url) => {
    const hostname = url ? new URL(url).hostname : window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3)
        return parts[0];
    return null;
};
export const redirectOrReload = (options) => {
    if (options?.reload)
        window.location.reload();
    if (!(options?.reload) && validate.nonEmptyString(options?.redirectUrl)) {
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
        ;
    }
};
export function checkPasswordStrength(password) {
    if (password.length < 8)
        return { text: 'very weak', score: 0 };
    let score = 0;
    if (/[a-z]/.test(password))
        score++;
    if (/[A-Z]/.test(password))
        score++;
    if (/\d/.test(password))
        score++;
    if (/[^A-Za-z0-9]/.test(password))
        score++;
    if (password.length >= 12)
        score++;
    switch (score) {
        case 0:
        case 1:
            return { text: 'weak', score: 1 };
        case 2:
            return { text: 'medium', score: 2 };
        case 3:
            return { text: 'strong', score: 3 };
        case 4:
        case 5:
            return { text: 'very strong', score: 4 };
        default:
            return { text: 'very weak', score: 0 };
    }
}
export function capitalize(str) {
    if (!str)
        return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function formSubmit(callback) {
    return async (event) => {
        event.preventDefault();
        await callback();
    };
}
export function capitalizeEachWord(input) {
    return input
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
export function parseCookie(header) {
    return Object.fromEntries(header.split('; ').map(c => c.split('=')));
}
export function isLocalhost() {
    if (typeof window === 'undefined')
        return false;
    return window.location.hostname.startsWith('localhost');
}
export function getUrlParam(param) {
    if (typeof window === 'undefined')
        return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
export function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
export const removeWWW = (host) => {
    if (host && typeof host == "string")
        return host.replace(/^www\./, '');
    else
        return null;
};
export function mapToObject(value) {
    try {
        if (value instanceof Map) {
            const obj = {};
            for (const [key, val] of value.entries()) {
                obj[key] = mapToObject(val);
            }
            return obj;
        }
        else if (Array.isArray(value)) {
            return value.map(mapToObject);
        }
        else if (typeof value === 'object' && value !== null) {
            const obj = {};
            for (const key in value) {
                obj[key] = mapToObject(value[key]);
            }
            return obj;
        }
        else {
            return value;
        }
    }
    catch (error) {
        logger.error(error);
        return value;
    }
}
export function getRandomNumber(min = 0, max = 10000, integer = true) {
    const rand = Math.random() * (max - min) + min;
    return integer ? Math.floor(rand) : rand;
}
export function getRandomString(options) {
    const length = options?.length || 6;
    const includeUppercase = options?.includeUppercase || true;
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const upper = includeUppercase ? lower.toUpperCase() : '';
    const chars = lower + digits + upper;
    let result = '';
    for (let i = 0; i < length; i++) {
        const randIndex = Math.floor(Math.random() * chars.length);
        result += chars[randIndex];
    }
    if (options?.prefix)
        return `${options?.prefix}${result}`;
    else
        return result;
}
export function arrrayGetLast(arr) {
    return arr.length > 0 ? arr[arr.length - 1] : undefined;
}
export function getPathList(path) {
    try {
        if (path)
            return path.split('/');
        return window.location.pathname.split('/');
    }
    catch (error) {
        logger.error(error);
        return null;
    }
}
export function getCurrentPath(path) {
    try {
        let pathList = getPathList(path);
        if (pathList)
            return arrrayGetLast(pathList);
        else
            return null;
    }
    catch (error) {
        logger.error(error);
        return null;
    }
}
export function buildPath(parts, endIndex) {
    const sliced = endIndex !== undefined ? parts.slice(0, endIndex + 1) : parts;
    return '/' + sliced.filter(Boolean).join('/');
}
export function detectAnalysisFileType(filename) {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'vcf':
        case 'fasta':
        case 'fa':
        case 'fastq':
        case 'fq':
        case 'gtf':
        case 'gff':
        case 'bed':
        case 'csv':
        case 'tsv':
            return ext;
        default:
            return 'unknown';
    }
}
export function scrollToElement(target, offset = 0, scrollBehavior = "auto") {
    let element = null;
    if (typeof target == 'string') {
        const normalizedId = target.startsWith('#') ? target.slice(1) : target;
        element = document.getElementById(normalizedId);
    }
    else if (target instanceof HTMLElement) {
        element = target;
    }
    if (!element)
        return;
    const y = element.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({
        top: y,
        behavior: scrollBehavior
    });
}
export function clickOutside(node, callback) {
    const handleClick = (event) => {
        if (!node.contains(event.target)) {
            callback();
        }
    };
    document.addEventListener('click', handleClick, true);
    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    };
}
export const setHiddenStatus = (element, hidden) => {
    let el;
    if (typeof element === "string") {
        el = document.getElementById(element);
    }
    else {
        el = element;
    }
    if (!el) {
        logger.error("Element is null running setHiddenStatus()");
        return;
    }
    if (hidden) {
        el?.classList.add("hidden");
    }
    else {
        el?.classList.remove("hidden");
        setTimeout(() => {
            if (!el)
                return;
            el.focus();
        }, 100);
    }
    ;
};
export const toggleHiddenStatus = (element) => {
    let el;
    if (typeof element === "string") {
        el = document.getElementById(element);
    }
    else {
        el = element;
    }
    if (!el) {
        logger.error("Element is null running toggleHiddenStatus()");
        return;
    }
    const hasHidden = el?.classList.contains("hidden");
    if (!hasHidden) {
        el?.classList.add("hidden");
    }
    else {
        el?.classList.remove("hidden");
        setTimeout(() => {
            if (!el)
                return;
            el.focus();
        }, 100);
    }
    ;
};
export function toHtmlId(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_]/g, '')
        .replace(/^-+|-+$/g, '');
}
export function toggleArrayItem(array, item) {
    return array.includes(item)
        ? array.filter(i => i !== item)
        : [...array, item];
}
export function updateUniqueArray(array, item, action) {
    if (action === 'add') {
        return array.includes(item) ? array : [...array, item];
    }
    else {
        return array.filter(i => i !== item);
    }
}
export function updateArrayByKey(array, item, action, key) {
    const referenceKey = (key || "id");
    const index = array.findIndex(el => el[referenceKey] === item[referenceKey]);
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
export function toCamelCase(input) {
    const normalized = input.replace(/[_\-\s]+/g, ' ').trim();
    const roughWords = normalized.split(' ');
    const words = [];
    for (const segment of roughWords) {
        const parts = segment.match(/([A-Z]+(?=[A-Z][a-z]))|([A-Z]?[a-z]+)|([A-Z]+)|(\d+)/g);
        if (parts)
            words.push(...parts);
    }
    return words
        .map((word, i) => i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}
export function toSnakeCase(input) {
    const normalized = input.replace(/[_\-\s]+/g, ' ').trim();
    const roughWords = normalized.split(' ');
    const words = [];
    for (const segment of roughWords) {
        const parts = segment.match(/([A-Z]+(?=[A-Z][a-z]))|([A-Z]?[a-z]+)|([A-Z]+)|(\d+)/g);
        if (parts)
            words.push(...parts);
    }
    return words.map(w => w.toLowerCase()).join('_');
}
export function portal(node, target = document.body) {
    target.appendChild(node);
    return {
        destroy() {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }
    };
}
export function isValidTimeStr(timeStr) {
    if (timeStr.trim() == "")
        return false;
    if (typeof timeStr !== 'string')
        return false;
    const parts = timeStr.trim().split(':');
    if (parts.length !== 2)
        return false;
    const [hStr, mStr] = parts;
    if (!/^\d+$/.test(hStr) || !/^\d+$/.test(mStr))
        return false;
    const hours = Number(hStr);
    const minutes = Number(mStr);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}
export function isValidDate(date) {
    return date && (date instanceof Date) && !isNaN(date.getTime());
}
export function formatDateForInput(date) {
    if (!isValidDate(date)) {
        logger.warn("Invalid 'date' in function 'formatDateForInput(date: Date)'");
        return;
    }
    ;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
export function addMinutesToTime(timeStr, minutesToAdd) {
    if (!isValidTimeStr(timeStr)) {
        logger.error("Invalid 'timeStr' at ddMinutesToTime(timeStr: string, minutesToAdd: number).");
        return;
    }
    ;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setMinutes(date.getMinutes() + minutesToAdd);
    const newHours = String(date.getHours()).padStart(2, '0');
    const newMinutes = String(date.getMinutes()).padStart(2, '0');
    return `${newHours}:${newMinutes}`;
}
export function setTimeForDate(date, timeStr) {
    if (!isValidTimeStr(timeStr)) {
        logger.error("Invalid 'timeStr' at setTimeForDate(date: Date, timeStr: string).");
        return date;
    }
    ;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    newDate.setMinutes(newDate.getMinutes());
    return newDate;
}
export function addMinutesToDate(date, minutesToAdd, dateTimeStr) {
    if (!isValidDate(date)) {
        logger.error("Invalid 'date' at addMinutesToDate(date: Date, minutesToAdd: number, dateTimeStr?: string).");
        return;
    }
    ;
    let newDate = new Date(date);
    if (dateTimeStr && isValidTimeStr(dateTimeStr))
        newDate = setTimeForDate(newDate, dateTimeStr);
    newDate.setMinutes(newDate.getMinutes() + minutesToAdd);
    return newDate;
}
export function parseDate(dateStr, fallbackToToday) {
    try {
        if (typeof dateStr !== 'string')
            return null;
        if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?/.test(dateStr)) {
            const isoDate = new Date(dateStr);
            return isNaN(isoDate.getTime()) ? null : isoDate;
        }
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
            const [month, day, year] = dateStr.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? null : date;
        }
        if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
            const [day, month, year] = dateStr.split('-').map(Number);
            const date = new Date(year, month - 1, day);
            return isNaN(date.getTime()) ? null : date;
        }
    }
    catch (error) {
        logger.devError(error);
    }
    finally {
        if (fallbackToToday) {
            return (new Date());
        }
        else {
            return new Date(dateStr);
        }
    }
}
export function dateToTime24h(date) {
    if (!validate.date(date))
        return null;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
export function dateToTime12h(date) {
    if (!(date instanceof Date) || isNaN(date.getTime()))
        return null;
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}
export function URLGetParam(paramName, url = window.location.href) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.searchParams.get(paramName);
    }
    catch (e) {
        return null;
    }
}
export function isSameMonth(date1, date2) {
    if (!validate.date(date1) || !validate.date(date2)) {
        logger.devError("One or more dates are invalid at isSameMonth(date1: Date, date2: Date)");
        return false;
    }
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth());
}
export function isSameYear(date1, date2) {
    if (!(date1 instanceof Date) || isNaN(date1.getTime()))
        return false;
    if (!(date2 instanceof Date) || isNaN(date2.getTime()))
        return false;
    return date1.getFullYear() === date2.getFullYear();
}
export function getMidpointDate(date1, date2) {
    if (!(date1 instanceof Date) || isNaN(date1.getTime()) ||
        !(date2 instanceof Date) || isNaN(date2.getTime())) {
        throw new Error('Invalid date');
    }
    const time1 = date1.getTime();
    const time2 = date2.getTime();
    const midpoint = (time1 + time2) / 2;
    return new Date(midpoint);
}
export function getYearBounds(date) {
    const d = (date instanceof Date && !isNaN(date.getTime())) ? date : new Date();
    const year = d.getFullYear();
    const start = new Date(year, 0, 1, 0, 0, 0, 0);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);
    return { start, end };
}
export function callerName(level = 2) {
    const err = new Error();
    const stack = err.stack?.split('\n');
    if (stack && stack.length > level) {
        const match = stack[level].trim().match(/^at\s+([^\s(]+)/);
        return match?.[1] || '<anonymous>';
    }
    return '<unknown>';
}
export function arrayGetByKey(array, value, key = 'id') {
    if (!value)
        return [];
    if (!key)
        return [];
    if (!array)
        return [];
    return array.filter(item => item[key] === value);
}
export function checkFileSize(files, maxSizeMB) {
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
export function getMatchScore(text, term) {
    if (text === term)
        return 100;
    if (text.startsWith(term))
        return 80;
    if (text.includes(` ${term}`))
        return 60;
    if (text.includes(term))
        return 40;
    return 0;
}
export const componentCallbackDispatcher = (callback, data) => {
    if (callback)
        callback(data);
};
export function objectsDiffer(a, b, strict = false) {
    const clean = (obj) => {
        try {
            return structuredClone(obj);
        }
        catch {
            return JSON.parse(JSON.stringify(obj));
        }
    };
    const cleanA = clean(a);
    const cleanB = clean(b);
    return deepCompare(cleanA, cleanB, strict);
}
function deepCompare(a, b, strict) {
    if (a === b)
        return false;
    if (typeof a !== 'object' || a === null ||
        typeof b !== 'object' || b === null) {
        return a !== b;
    }
    const keys = strict
        ? new Set([...Object.keys(a), ...Object.keys(b)])
        : new Set([...Object.keys(a)].filter(key => key in b));
    for (const key of keys) {
        const valA = a[key];
        const valB = b[key];
        const bothObjects = typeof valA === 'object' && valA !== null &&
            typeof valB === 'object' && valB !== null;
        if (bothObjects) {
            if (deepCompare(valA, valB, strict))
                return true;
        }
        else if (valA !== valB) {
            return true;
        }
    }
    return false;
}
export function removeNullish(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value != null));
}
export function flattenObject(obj, options = {}) {
    return _flattenObject(obj, options, '', {}, new Set());
}
function _flattenObject(obj, options, _parentKey, _result, _seen) {
    const { useDotNotation = false } = options;
    if (_seen.has(obj)) {
        _result[_parentKey || '[Circular]'] = '[Circular]';
        return _result;
    }
    _seen.add(obj);
    for (const [key, value] of Object.entries(obj)) {
        const isPlainObject = value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            !(value instanceof Date);
        const fullKey = useDotNotation && _parentKey ? `${_parentKey}.${key}` : key;
        if (isPlainObject) {
            _flattenObject(value, options, fullKey, _result, _seen);
        }
        else {
            if (useDotNotation) {
                _result[fullKey] = value;
            }
            else {
                _result[key] = value;
            }
        }
    }
    _seen.delete(obj);
    return _result;
}
export function getTimeBounds(midpoint, before, after, unit, normalizeMonthly) {
    const center = new Date(midpoint);
    const start = new Date(center);
    const end = new Date(center);
    switch (unit) {
        case 'minutes':
            start.setMinutes(start.getMinutes() - before);
            end.setMinutes(end.getMinutes() + after);
            break;
        case 'days':
            start.setDate(start.getDate() - before);
            end.setDate(end.getDate() + after);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'months':
            if (normalizeMonthly)
                start.setDate(1);
            start.setMonth(start.getMonth() - before);
            end.setMonth(end.getMonth() + after);
            if (normalizeMonthly) {
                start.setDate(1);
                end.setMonth(end.getMonth() + 1, 0);
            }
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'years':
            if (normalizeMonthly)
                start.setMonth(0, 1);
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
export function listMonthsInRange(start, end, format = 'YYYY-MM', options) {
    const { locale = 'en-US', excludeStart = false, excludeEnd = false, descending = false } = options || {};
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
        if ((excludeStart && isStart) || (excludeEnd && isEnd)) {
        }
        else {
            const year = current.getFullYear();
            const month = current.getMonth();
            let formatted;
            switch (format) {
                case 'YYYY-MM':
                    formatted = `${year}-${String(month + 1).padStart(2, '0')}`;
                    break;
                case 'YYYY-MMM':
                    formatted = `${year}-${current.toLocaleString(locale, { month: 'short' })}`;
                    break;
                case 'YYYY-MMMM':
                    formatted = `${year}-${current.toLocaleString(locale, { month: 'long' })}`;
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
export function getMonthBoundsByYearMonthString(monthKey) {
    const [year, month] = monthKey.split("-").map(Number);
    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    return { start, end };
}
export function getYearMonthStringFromDate(date) {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    return `${year}-${month}`;
}
export function getMonthBounds(date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    return { start, end };
}
export function mergeByKey(original, updates, key = "id") {
    const map = new Map();
    for (const item of original) {
        map.set(item[key], item);
    }
    for (const item of updates) {
        map.set(item[key], item);
    }
    return Array.from(map.values());
}
export function removeFromArrayByKey(array, value, key = "id") {
    if (!validate.array(array))
        throw new Error("Invalid array");
    return array.filter(item => item[key] !== value);
}
export function hexToRgb(hexString) {
    const hex = hexString || "#000000";
    const cleaned = hex.replace(/^#/, '');
    if (![3, 6].includes(cleaned.length))
        return "(0,0,0)";
    const fullHex = cleaned.length === 3
        ? cleaned.split('').map(c => c + c).join('')
        : cleaned;
    const num = parseInt(fullHex, 16);
    return (`(${((num >> 16) & 255) || 0},${((num >> 8) & 255) || 0},${(num & 255) || 0})`);
}
export async function copyToClipboard(text, callback) {
    try {
        await navigator.clipboard.writeText(text);
        logger.log('Text copied to clipboard');
        if (callback)
            callback();
    }
    catch (err) {
        logger.error('Failed to copy text: ', err);
    }
}
export function URLReload(newParams, anchor) {
    const current = new URLSearchParams(window.location.search);
    let changed = false;
    if (!validate.object(newParams)) {
        const hash = anchor ? `#${anchor}` : '';
        location.replace(`${window.location.pathname}${window.location.search}${hash}`);
        return location.reload();
    }
    for (const [key, value] of Object.entries(newParams)) {
        if (current.get(key) !== value) {
            current.set(key, value);
            changed = true;
        }
    }
    const hash = anchor ? `#${anchor}` : '';
    const query = current.toString();
    const newUrl = `${window.location.pathname}?${query}${hash}`;
    window.location.replace(newUrl);
    return location.reload();
}
export function flagEmojiToCountryCode(flag) {
    const countryCode = [...flag]
        .map(char => String.fromCharCode(char.codePointAt(0) - 0x1F1E6 + 0x61))
        .join('');
    return countryCode.trim().toLowerCase();
}
export const wait = (timeout = 100, callback) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            callback?.();
            resolve();
        }, timeout);
    });
};
export const dropdownOptionsFromStrings = (strings) => {
    const options = [];
    const optionsIds = [];
    for (const str of strings) {
        if (!(str.trim()) || !validate.nonEmptyString(str))
            continue;
        const sluggifiedStr = ((str.trim())?.replaceAll(" ", "_")).toLowerCase();
        if (optionsIds?.includes(sluggifiedStr))
            continue;
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
