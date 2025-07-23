

export interface Validate {
  string(v: any): v is string;
  nonEmptyString(v: any): v is string;
  number(v: any): v is number;
  integer(v: any): v is number;
  boolean(v: any): v is boolean;
  numeric(v: any): boolean;
  finiteNumber(v: any): v is number;

  null(v: any): v is null;
  undefined(v: any): v is undefined;
  defined<T>(v: T | null | undefined): v is T;
  nan(v: any): v is number

  object(v: any): v is Record<string, any>;
  array<T = unknown>(v: any): v is T[];
  nonEmptyArray<T = unknown>(v: any): v is T[];
  date(v: any): v is Date;
  regexp(v: any): v is RegExp;
  promise<T = any>(v: any): v is Promise<T>;
  function(v: any): v is Function;
}

/**
 * A collection of type guards and validation helpers for core JavaScript types.
 * Each method returns a boolean and acts as a type guard where applicable.
 *
 * Usage example:
 *   if (validate.date(value)) {
 *     value.toISOString();
 *   }
 */
export const validate: Validate = {
  /** Checks if the value is a string. */
  string: (v): v is string => typeof v === 'string',

  /** Checks if the value is a non-empty string (after trimming whitespace). */
  nonEmptyString: (v): v is string => typeof v === 'string' && v.trim().length > 0,

  /** Checks if the value is a number and not NaN. */
  number: (v): v is number => typeof v === 'number' && !isNaN(v),

  /** Checks if the value is an integer. */
  integer: (v): v is number => Number.isInteger(v),

  /** Checks if the value is a boolean. */
  boolean: (v): v is boolean => typeof v === 'boolean',

  /** Checks if the value is numeric (number or numeric string). */
  numeric: (v: any): boolean => typeof v === 'number' ? !isNaN(v) : !isNaN(Number(v)),

  /** Checks if the value is a finite number (excludes NaN and Infinity). */
  finiteNumber: (v: any): v is number => typeof v === 'number' && Number.isFinite(v),

  /** Checks if the value is exactly null. */
  null: (v): v is null => v === null,

  /** Checks if the value is undefined. */
  undefined: (v): v is undefined => typeof v === 'undefined',

  /** Checks if the value is not null or undefined. */
  defined: <T>(v: T | null | undefined): v is T => v !== null && v !== undefined,

  /** Checks if the value is NaN (Not-a-Number). */
  nan: (v): v is number => typeof v === 'number' && Number.isNaN(v),

  /** Checks if the value is a plain object (excluding arrays and null). */
  object: (v): v is Record<string, any> =>
    v !== null && typeof v === 'object' && !Array.isArray(v),

  /** Checks if the value is an array. */
  array: <T = unknown>(v: any): v is T[] => Array.isArray(v),

  /** Checks if the value is a non-empty array. */
  nonEmptyArray: <T = unknown>(v: any): v is T[] =>
    Array.isArray(v) && v.length > 0,

  /** Checks if the value is a valid Date instance (not Invalid Date). */
  date: (v): v is Date => v instanceof Date && !isNaN(v.getTime()),

  /** Checks if the value is a RegExp instance. */
  regexp: (v): v is RegExp => v instanceof RegExp,

  /** Checks if the value is a Promise-like object (has a .then function). */
  promise: <T = any>(v: any): v is Promise<T> =>
    !!v && typeof v.then === 'function',

  /** Checks if the value is a function. */
  function: (v): v is Function => typeof v === 'function'
};

