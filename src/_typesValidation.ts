// ---- helpers ----
function validateUrl(input: string): boolean {
  if (typeof input !== "string") return false;
  const s = input.trim();
  if (s.length === 0) return false;
  try {
    // Richiede schema esplicito (es. https://)
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

function isValidDateString(value: string): boolean {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

// ---- interface ----
interface Validate {
  string(v: unknown): v is string;
  url(v: unknown): v is string;
  nonEmptyString(v: unknown): v is string;

  number(v: unknown): v is number;
  integer(v: unknown): v is number;
  boolean(v: unknown): v is boolean;
  numeric(v: unknown): boolean;
  finiteNumber(v: unknown): v is number;

  dateString(v: unknown): v is string;
  date(v: unknown): v is Date;

  null(v: unknown): v is null;
  undefined(v: unknown): v is undefined;
  defined<T>(v: T | null | undefined): v is T;
  nan(v: unknown): v is number;

  object(v: unknown): v is Record<string, unknown>;
  plainObject(v: unknown): v is Record<string, unknown>;
  array<T = unknown>(v: unknown): v is T[];
  nonEmptyArray<T = unknown>(v: unknown): v is T[];

  regexp(v: unknown): v is RegExp;
  promise<T = unknown>(v: unknown): v is Promise<T>;
  function(v: unknown): v is (...args: any[]) => any;
}

// ---- implementation ----
export const validate: Validate = {
  string: (v): v is string => typeof v === "string",
  url: (v): v is string => typeof v === "string" && validateUrl(v),
  nonEmptyString: (v): v is string => typeof v === "string" && v.trim().length > 0,

  number: (v): v is number => typeof v === "number" && !Number.isNaN(v),
  integer: (v): v is number => typeof v === "number" && Number.isInteger(v),
  boolean: (v): v is boolean => typeof v === "boolean",
  numeric: (v): boolean => typeof v === "number" ? !Number.isNaN(v) : !Number.isNaN(Number(v)),
  finiteNumber: (v): v is number => typeof v === "number" && Number.isFinite(v),

  dateString: (v): v is string => typeof v === "string" && isValidDateString(v),
  date: (v): v is Date => isValidDate(v),

  null: (v): v is null => v === null,
  undefined: (v): v is undefined => typeof v === "undefined",
  defined: <T>(v: T | null | undefined): v is T => v !== null && v !== undefined,
  nan: (v): v is number => typeof v === "number" && Number.isNaN(v),

  object: (v): v is Record<string, unknown> =>
    v !== null && typeof v === "object",

  // solo plain objects (no array, no class instances)
  plainObject: (v): v is Record<string, unknown> => {
    if (v === null || typeof v !== "object" || Array.isArray(v)) return false;
    const proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
  },

  array: <T = unknown>(v: unknown): v is T[] => Array.isArray(v),
  nonEmptyArray: <T = unknown>(v: unknown): v is T[] =>
    Array.isArray(v) && v.length > 0,

  regexp: (v): v is RegExp => v instanceof RegExp,
  promise: <T = unknown>(v: unknown): v is Promise<T> =>
    !!v && (typeof (v as any).then === "function"),
  function: (v): v is (...args: any[]) => any => typeof v === "function",
};
