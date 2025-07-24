import type { AnyObject, DropdownOption, HexColor, PasswordStrength } from "./";
import { logger } from "./";
import { validate } from "./_typesValidation";

export const isBrowser = (): boolean => {
	return (typeof window !== 'undefined' && typeof document !== 'undefined');
};
export const isWindowAvailable = (): boolean => {
	return (typeof window !== 'undefined');
};
export const isDev = (): boolean => {
	return (process.env.NODE_ENV !== 'production');
};

export function checkPasswordStrength(password: string): PasswordStrength {
	if (password.length < 8) return { text: 'very weak', score: 0 };

	let score = 0;

	if (/[a-z]/.test(password)) score++;          // lettere minuscole
	if (/[A-Z]/.test(password)) score++;          // lettere maiuscole
	if (/\d/.test(password)) score++;             // numeri
	if (/[^A-Za-z0-9]/.test(password)) score++;   // simboli
	if (password.length >= 12) score++;           // lunghezza

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

export function capitalize(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formSubmit(callback: () => void | Promise<void>) {
	return async (event: SubmitEvent) => {
		event.preventDefault();
		await callback();
	};
}

export function capitalizeEachWord(input: string): string {
	return input
		.toLowerCase()
		.split(' ')
		.map(word =>
			word.charAt(0).toUpperCase() + word.slice(1)
		)
		.join(' ');
}

export function parseCookie(header: string): Record<string, string> {
	return Object.fromEntries(header.split('; ').map(c => c.split('=')));
}

export function isLocalhost(): boolean {
	if (typeof window === 'undefined') return false;

	return window.location.hostname.startsWith('localhost');
}

export function getUrlParam(param: string): string | null {
	if (typeof window === 'undefined') return null;

	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param);
}

export function sleep(seconds: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export const removeWWW = (host: string | null): string | null => {
	if (host && typeof host == "string") return host.replace(/^www\./, '');
	else return null;
}

export function mapToObject(value: any): any {
	try {
		if (value instanceof Map) {
			const obj: any = {};
			for (const [key, val] of value.entries()) {
				obj[key] = mapToObject(val);
			}
			return obj;
		} else if (Array.isArray(value)) {
			return value.map(mapToObject);
		} else if (typeof value === 'object' && value !== null) {
			const obj: any = {};
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

export function getRandomNumber(min: number = 0, max: number = 10000, integer: boolean = true): number {
	const rand = Math.random() * (max - min) + min;
	return integer ? Math.floor(rand) : rand;
}

export function getRandomString(options?: { length?: number, includeUppercase?: boolean, prefix?: string }): string {
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

	if (options?.prefix) return `${options?.prefix}${result}`
	else return result;
}


export function arrrayGetLast<T>(arr: T[]): T | undefined {
	return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

export function getPathList(path?: string): string[] | null | undefined {
	try {
		if (path) return path.split('/');
		return window.location.pathname.split('/');
	} catch (error) {
		logger.error(error);
		return null;
	}
}

export function getCurrentPath(path?: string): string | null | undefined {
	try {
		let pathList = getPathList(path);
		if (pathList) return arrrayGetLast(pathList);
		else return null
	} catch (error) {
		logger.error(error);
		return null;
	}
}

export function buildPath(parts: string[], endIndex?: number): string {
	const sliced = endIndex !== undefined ? parts.slice(0, endIndex + 1) : parts;
	return '/' + sliced.filter(Boolean).join('/');
}

export function detectAnalysisFileType(filename: string): string {
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

export function scrollToElement(target: string | HTMLElement, offset: number = 0, scrollBehavior: ScrollBehavior = "auto") {
	let element: HTMLElement | null = null;

	if (typeof target == 'string') {
		const normalizedId = target.startsWith('#') ? target.slice(1) : target;
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

export function clickOutside(node: HTMLElement, callback: () => void) {
	const handleClick = (event: MouseEvent) => {
		if (!node.contains(event.target as Node)) {
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


export const setHiddenStatus = (element: string | HTMLElement, hidden: boolean) => {
	let el: HTMLElement | null | undefined;
	if (typeof element === "string") {
		el = document.getElementById(element);
	} else {
		el = element
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
	};

}

export const toggleHiddenStatus = (element: string | HTMLElement) => {
	let el: HTMLElement | null | undefined;
	if (typeof element === "string") {
		el = document.getElementById(element);
	} else {
		el = element
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
	};
}

export function toHtmlId(str: string): string {
	return str
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-') // replace spaces with hyphens
		.replace(/[^a-z0-9\-_]/g, '') // remove invalid characters
		.replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
}

export function toggleArrayItem<T>(array: T[], item: T): T[] {
	return array.includes(item)
		? array.filter(i => i !== item) // remove if exists
		: [...array, item];             // add if not present
}

export function updateUniqueArray<T>(
	array: T[],
	item: T,
	action: 'add' | 'remove'
): T[] {
	if (action === 'add') {
		return array.includes(item) ? array : [...array, item];
	} else {
		return array.filter(i => i !== item);
	}
}

export function updateArrayByKey<T, K extends keyof T>(
	array: T[],
	item: T,
	action: "add" | "remove",
	key?: K
): T[] {
	const referenceKey = (key || "id") as K;

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

export function toCamelCase(input: string): string {
	// Normalize separators to space
	const normalized = input.replace(/[_\-\s]+/g, ' ').trim();

	// Split by space first
	const roughWords = normalized.split(' ');

	const words: string[] = [];

	for (const segment of roughWords) {
		// Split segment by camel case and acronym boundaries
		const parts = segment.match(/([A-Z]+(?=[A-Z][a-z]))|([A-Z]?[a-z]+)|([A-Z]+)|(\d+)/g);
		if (parts) words.push(...parts);
	}

	// Rebuild into camelCase
	return words
		.map((word, i) =>
			i === 0
				? word.toLowerCase()
				: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)
		.join('');
}



export function toSnakeCase(input: string): string {
	// Normalize separators to space
	const normalized = input.replace(/[_\-\s]+/g, ' ').trim();

	// Split by space
	const roughWords = normalized.split(' ');

	const words: string[] = [];

	for (const segment of roughWords) {
		// Split segment by camelCase / PascalCase / acronym transitions
		const parts = segment.match(/([A-Z]+(?=[A-Z][a-z]))|([A-Z]?[a-z]+)|([A-Z]+)|(\d+)/g);
		if (parts) words.push(...parts);
	}

	return words.map(w => w.toLowerCase()).join('_');
}

export function portal(
	node: HTMLElement,
	target: HTMLElement = document.body
) {
	target.appendChild(node);

	return {
		destroy() {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}
	};
}

export function isValidTimeStr(timeStr: string) {
	if (timeStr.trim() == "") return false;
	if (typeof timeStr !== 'string') return false;

	const parts = timeStr.trim().split(':');
	if (parts.length !== 2) return false;

	const [hStr, mStr] = parts;
	if (!/^\d+$/.test(hStr) || !/^\d+$/.test(mStr)) return false;

	const hours = Number(hStr);
	const minutes = Number(mStr);

	return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

export function isValidDate(date: Date) {
	return date && (date instanceof Date) && !isNaN(date.getTime());
}

export function formatDateForInput(date: Date) {
	if (!isValidDate(date)) {
		logger.warn("Invalid 'date' in function 'formatDateForInput(date: Date)'")
		return;
	};

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // mesi 0-indexed
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function addMinutesToTime(timeStr: string, minutesToAdd: number) {
	if (!isValidTimeStr(timeStr)) {
		logger.error("Invalid 'timeStr' at ddMinutesToTime(timeStr: string, minutesToAdd: number).")
		return;
	};
	const [hours, minutes] = timeStr.split(':').map(Number);
	const date = new Date();
	date.setHours(hours, minutes, 0, 0); // set to today, with given time

	date.setMinutes(date.getMinutes() + minutesToAdd); // add minutes

	const newHours = String(date.getHours()).padStart(2, '0');
	const newMinutes = String(date.getMinutes()).padStart(2, '0');

	return `${newHours}:${newMinutes}`;
}

export function setTimeForDate(date: Date, timeStr: string) {
	/*if(!isValidDate(date)) {
		logger.error("Invalid 'date' at setTimeForDate(date: Date, timeStr: string).")
		return;
	};*/
	if (!isValidTimeStr(timeStr)) {
		logger.error("Invalid 'timeStr' at setTimeForDate(date: Date, timeStr: string).");
		return date;
	};
	const [hours, minutes] = timeStr.split(':').map(Number);

	const newDate = new Date(date); // clone to avoid mutating original
	newDate.setHours(hours, minutes, 0, 0);
	newDate.setMinutes(newDate.getMinutes());

	return newDate;
}

export function addMinutesToDate(date: Date, minutesToAdd: number, dateTimeStr?: string) {
	if (!isValidDate(date)) {
		logger.error("Invalid 'date' at addMinutesToDate(date: Date, minutesToAdd: number, dateTimeStr?: string).");
		return;
	};

	let newDate = new Date(date); // clone to avoid mutating original

	if (dateTimeStr && isValidTimeStr(dateTimeStr)) newDate = setTimeForDate(newDate, dateTimeStr) as Date;


	newDate.setMinutes(newDate.getMinutes() + minutesToAdd);
	return newDate;
}

export function parseDate(dateStr: string, fallbackToToday?: boolean) {
	try {
		if (typeof dateStr !== 'string') return null;

		// ISO 8601 (safe and recommended)
		if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?/.test(dateStr)) {
			const isoDate = new Date(dateStr);
			return isNaN(isoDate.getTime()) ? null : isoDate;
		}

		// US format MM/DD/YYYY
		if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
			const [month, day, year] = dateStr.split('/').map(Number);
			const date = new Date(year, month - 1, day);
			return isNaN(date.getTime()) ? null : date;
		}

		// Optional: support DD/MM/YYYY format
		if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
			const [day, month, year] = dateStr.split('-').map(Number);
			const date = new Date(year, month - 1, day);
			return isNaN(date.getTime()) ? null : date;
		}

	} catch (error) {
		logger.devError(error);
	} finally {
		if (fallbackToToday) {
			return (new Date());
		} else {
			// Fallback attempt (not recommended in general)
			return new Date(dateStr);
		}
	}
}

export function dateToTime24h(date: Date) {
	if (!validate.date(date)) return null;

	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
}

export function dateToTime12h(date: Date) {
	if (!(date instanceof Date) || isNaN(date.getTime())) return null;

	let hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const ampm = hours >= 12 ? 'PM' : 'AM';

	hours = hours % 12;
	hours = hours === 0 ? 12 : hours; // 0 => 12

	return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

export function URLGetParam(paramName: string, url: string = window.location.href) {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.searchParams.get(paramName);
	} catch (e) {
		return null; // URL malformato
	}
}

export function isSameMonth(date1: Date, date2: Date): boolean {
	if (!validate.date(date1) || !validate.date(date2)) {
		logger.devError("One or more dates are invalid at isSameMonth(date1: Date, date2: Date)");
		return false;
	}

	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth()
	);
}

export function isSameYear(date1: unknown, date2: unknown): boolean {
	if (!(date1 instanceof Date) || isNaN(date1.getTime())) return false;
	if (!(date2 instanceof Date) || isNaN(date2.getTime())) return false;
	return date1.getFullYear() === date2.getFullYear();
}


export function getMidpointDate(date1: Date, date2: Date): Date {
	if (!(date1 instanceof Date) || isNaN(date1.getTime()) ||
		!(date2 instanceof Date) || isNaN(date2.getTime())) {
		throw new Error('Invalid date');
	}

	const time1 = date1.getTime();
	const time2 = date2.getTime();
	const midpoint = (time1 + time2) / 2;

	return new Date(midpoint);
}

export function getYearBounds(date?: Date): { start: Date; end: Date } {
	const d = (date instanceof Date && !isNaN(date.getTime())) ? date : new Date();

	const year = d.getFullYear();

	const start = new Date(year, 0, 1, 0, 0, 0, 0); // 1 gennaio alle 00:00
	const end = new Date(year, 11, 31, 23, 59, 59, 999); // 31 dicembre alle 23:59:59.999

	return { start, end };
}

export function callerName(level = 2): string {
	const err = new Error();
	const stack = err.stack?.split('\n');
	if (stack && stack.length > level) {
		const match = stack[level].trim().match(/^at\s+([^\s(]+)/);
		return match?.[1] || '<anonymous>';
	}
	return '<unknown>';
}

export function arrayGetByKey<T, K extends keyof T>(
	array: T[],
	value: T[K],
	key: K = 'id' as K
): T[] {
	if (!value) return [];
	if (!key) return [];
	if (!array) return [];
	return array.filter(item => item[key] === value);
}

export function checkFileSize(files: FileList | File[], maxSizeMB: number): { valid: boolean; message?: string } {
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


export function getMatchScore(text: string, term: string): number {
	if (text === term) return 100;
	if (text.startsWith(term)) return 80;
	if (text.includes(` ${term}`)) return 60;
	if (text.includes(term)) return 40;
	return 0;
}

export const componentCallbackDispatcher = (callback: Function, data?: any) => {
	if (callback) callback(data);
}

export function objectsDiffer<T extends Record<string, any>>(
	a: Partial<T>,
	b: Partial<T>,
	strict = false
): boolean {
	const clean = (obj: any): any => {
		// Rimuove Proxy, getter, reactive wrapper ecc.
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

function deepCompare(a: any, b: any, strict: boolean): boolean {
	if (a === b) return false;

	if (
		typeof a !== 'object' || a === null ||
		typeof b !== 'object' || b === null
	) {
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
			if (deepCompare(valA, valB, strict)) return true;
		} else if (valA !== valB) {
			return true;
		}
	}

	return false;
}


export function removeNullish<T extends object>(obj: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => value != null)
	) as Partial<T>;
}


type FlattenOptions = {
	useDotNotation?: boolean;
};

export function flattenObject(
	obj: Record<string, any>,
	options: FlattenOptions = {}
): Record<string, any> {
	return _flattenObject(obj, options, '', {}, new Set());
}

function _flattenObject(
	obj: Record<string, any>,
	options: FlattenOptions,
	_parentKey: string,
	_result: Record<string, any>,
	_seen: Set<any>
): Record<string, any> {
	const { useDotNotation = false } = options;

	if (_seen.has(obj)) {
		_result[_parentKey || '[Circular]'] = '[Circular]';
		return _result;
	}

	_seen.add(obj);

	for (const [key, value] of Object.entries(obj)) {
		const isPlainObject =
			value !== null &&
			typeof value === 'object' &&
			!Array.isArray(value) &&
			!(value instanceof Date);

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

/** 
 * @param normalizeMonthly If true and units is months or years, it will normalize the start and end date to the first and last day of the first and last month.
 */
export function getTimeBounds(
	midpoint: Date | string,
	before: number,
	after: number,
	unit: 'minutes' | 'days' | 'months' | 'years',
	normalizeMonthly?: boolean
): { start: Date; end: Date } {
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
			if (normalizeMonthly) start.setDate(1); // sicurezza (primo del mese)
			start.setMonth(start.getMonth() - before);
			end.setMonth(end.getMonth() + after);
			if (normalizeMonthly) {
				start.setDate(1);
				end.setMonth(end.getMonth() + 1, 0); // ultimo giorno del mese
			}
			start.setHours(0, 0, 0, 0);
			end.setHours(23, 59, 59, 999);
			break;

		case 'years':
			if (normalizeMonthly) start.setMonth(0, 1); // sicurezza (1 gennaio)
			start.setFullYear(start.getFullYear() - before);
			end.setFullYear(end.getFullYear() + after);
			if (normalizeMonthly) {
				start.setMonth(0, 1); // 1 gennaio
				end.setMonth(12, 0);  // 31 dicembre
			}
			start.setHours(0, 0, 0, 0);
			end.setHours(23, 59, 59, 999);
			break;

		default:
			throw new Error(`Unsupported unit: ${unit}`);
	}

	return { start, end };
}


export function listMonthsInRange(
	start: Date | string,
	end: Date | string,
	format: 'YYYY-MM' | 'YYYY-MMM' | 'YYYY-MMMM' = 'YYYY-MM',
	options?: {
		locale?: string;
		excludeStart?: boolean;
		excludeEnd?: boolean;
		descending?: boolean;
	}
): string[] {
	const {
		locale = 'en-US',
		excludeStart = false,
		excludeEnd = false,
		descending = false
	} = options || {};

	let startDate = new Date(start);
	let endDate = new Date(end);

	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
		throw new Error("Invalid start or end date");
	}

	// Normalizza inizio e fine al primo giorno del mese
	startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
	endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

	const months: string[] = [];
	let current = new Date(startDate);

	while (current <= endDate) {
		const isStart = current.getTime() === startDate.getTime();
		const isEnd = current.getTime() === endDate.getTime();

		if ((excludeStart && isStart) || (excludeEnd && isEnd)) {
			// salta questo mese
		} else {
			const year = current.getFullYear();
			const month = current.getMonth();

			let formatted: string;
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

/**
 * @param monthKey (deve essere in formato YYYY-MM)
 * @returns Restituisce un oggetto contente start e end
 */
export function getMonthBoundsByYearMonthString(monthKey: string): { start: Date; end: Date } {
	const [year, month] = monthKey.split("-").map(Number); // es. 2025, 6

	const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));         // primo giorno del mese
	const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)); // ultimo giorno del mese

	return { start, end };
}

/**
 * @returns The month of the passed date as string in the format YYYY-MM (eg. 2025-05), in UTC
 */
export function getYearMonthStringFromDate(date: Date): string {
	const year = date.getUTCFullYear();
	const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	return `${year}-${month}`;
}

/**
* @returns Restituisce un oggetto contente start e end
*/
export function getMonthBounds(date: Date): { start: Date; end: Date } {
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth(); // 0-based

	const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));         // primo giorno del mese
	const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)); // ultimo giorno del mese

	return { start, end };
}


/**
 * Unisce l'array originale con nuovi oggetti, sovrascrivendo quelli con la stessa chiave.
 * @param original Array originale
 * @param updates Nuovi oggetti da aggiungere o aggiornare
 * @param key Chiave identificativa (default: "id")
 * @returns Nuovo array aggiornato
 */
export function mergeByKey<T extends AnyObject>(
	original: T[],
	updates: T[],
	key: keyof T = "id"
): T[] {
	const map = new Map<any, T>();

	for (const item of original) {
		map.set(item[key], item);
	}

	for (const item of updates) {
		map.set(item[key], item);
	}

	return Array.from(map.values());
}

/**
 * Rimuove un elemento da un array di oggetti confrontando un campo chiave.
 *
 * @param array - L'array di oggetti da cui rimuovere l'elemento
 * @param value - Il valore da confrontare per la rimozione
 * @param key - Il campo su cui fare il confronto (default: "id")
 * @returns Un nuovo array senza l'elemento corrispondente
 */
export function removeFromArrayByKey<T extends Record<string, any>>(
	array: T[],
	value: any,
	key: string = "id"
): T[] {
	if (!validate.array(array)) throw new Error("Invalid array")
	return array.filter(item => item[key] !== value);
}


export function hexToRgb(hexString?: HexColor): string | "" {
	const hex = hexString || "#000000";
	const cleaned = hex.replace(/^#/, '');

	if (![3, 6].includes(cleaned.length)) return "(0,0,0)";

	const fullHex = cleaned.length === 3
		? cleaned.split('').map(c => c + c).join('')
		: cleaned;

	const num = parseInt(fullHex, 16);

	return (`(${((num >> 16) & 255) || 0},${((num >> 8) & 255) || 0},${(num & 255) || 0})`);
}

export async function copyToClipboard(text: string, callback?: Function): Promise<void> {
	try {
		await navigator.clipboard.writeText(text);
		logger.log('Text copied to clipboard');
		if(callback) callback();
	} catch (err) {
		logger.error('Failed to copy text: ', err);
	}
}

/**
 * Reloads the page with the given query parameters if they are not already present or different.
 * Prevents infinite loops by comparing current parameters with target ones.
 * Optionally appends a hash anchor (e.g., #section) for native browser scrolling.
 * 
 * @param newParams An object containing key-value pairs to be added to the URL.
 * @param anchor Optional ID of the element to scroll to after reload (e.g. 'comments')
 */
export function URLReload(newParams?: Record<string, string>, anchor?: string) {
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


export function flagEmojiToCountryCode(flag: string): string {
	const countryCode = [...flag]
		.map(char => String.fromCharCode(char.codePointAt(0)! - 0x1F1E6 + 0x61))
		.join('');

	return countryCode.trim().toLowerCase();
}


export const wait = (timeout: number = 100, callback?: VoidFunction): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback?.();
      resolve();
    }, timeout);
  });
};

export const dropdownOptionsFromStrings = (strings: string[]): DropdownOption[] => {
	const options: DropdownOption[]=[];
	const optionsIds: string[]=[];
	for (const str of strings) {
		if(!(str.trim()) || !validate.nonEmptyString(str)) continue;
		const sluggifiedStr: string = ((str.trim())?.replaceAll(" ","_")).toLowerCase();
		if(optionsIds?.includes(sluggifiedStr)) continue;
		optionsIds.push(sluggifiedStr);
		const option: DropdownOption = {
			label: str,
			value: sluggifiedStr,
			id: sluggifiedStr
		}
		options.push(option);
	}

	return options || [];
}