"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
/**
 * A collection of type guards and validation helpers for core JavaScript types.
 * Each method returns a boolean and acts as a type guard where applicable.
 *
 * Usage example:
 *   if (validate.date(value)) {
 *     value.toISOString();
 *   }
 */
exports.validate = {
    /** Checks if the value is a string. */
    string: (v) => typeof v === 'string',
    /** Checks if the value is a non-empty string (after trimming whitespace). */
    nonEmptyString: (v) => typeof v === 'string' && v.trim().length > 0,
    /** Checks if the value is a number and not NaN. */
    number: (v) => typeof v === 'number' && !isNaN(v),
    /** Checks if the value is an integer. */
    integer: (v) => Number.isInteger(v),
    /** Checks if the value is a boolean. */
    boolean: (v) => typeof v === 'boolean',
    /** Checks if the value is numeric (number or numeric string). */
    numeric: (v) => typeof v === 'number' ? !isNaN(v) : !isNaN(Number(v)),
    /** Checks if the value is a finite number (excludes NaN and Infinity). */
    finiteNumber: (v) => typeof v === 'number' && Number.isFinite(v),
    /** Checks if the value is exactly null. */
    null: (v) => v === null,
    /** Checks if the value is undefined. */
    undefined: (v) => typeof v === 'undefined',
    /** Checks if the value is not null or undefined. */
    defined: (v) => v !== null && v !== undefined,
    /** Checks if the value is NaN (Not-a-Number). */
    nan: (v) => typeof v === 'number' && Number.isNaN(v),
    /** Checks if the value is a plain object (excluding arrays and null). */
    object: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
    /** Checks if the value is an array. */
    array: (v) => Array.isArray(v),
    /** Checks if the value is a non-empty array. */
    nonEmptyArray: (v) => Array.isArray(v) && v.length > 0,
    /** Checks if the value is a valid Date instance (not Invalid Date). */
    date: (v) => v instanceof Date && !isNaN(v.getTime()),
    /** Checks if the value is a RegExp instance. */
    regexp: (v) => v instanceof RegExp,
    /** Checks if the value is a Promise-like object (has a .then function). */
    promise: (v) => !!v && typeof v.then === 'function',
    /** Checks if the value is a function. */
    function: (v) => typeof v === 'function'
};
//# sourceMappingURL=_typesValidation.js.map