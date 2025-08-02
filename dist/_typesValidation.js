"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
exports.validate = {
    string: (v) => typeof v === 'string',
    nonEmptyString: (v) => typeof v === 'string' && v.trim().length > 0,
    number: (v) => typeof v === 'number' && !isNaN(v),
    integer: (v) => Number.isInteger(v),
    boolean: (v) => typeof v === 'boolean',
    numeric: (v) => typeof v === 'number' ? !isNaN(v) : !isNaN(Number(v)),
    finiteNumber: (v) => typeof v === 'number' && Number.isFinite(v),
    null: (v) => v === null,
    undefined: (v) => typeof v === 'undefined',
    defined: (v) => v !== null && v !== undefined,
    nan: (v) => typeof v === 'number' && Number.isNaN(v),
    object: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
    array: (v) => Array.isArray(v),
    nonEmptyArray: (v) => Array.isArray(v) && v.length > 0,
    date: (v) => v instanceof Date && !isNaN(v.getTime()),
    regexp: (v) => v instanceof RegExp,
    promise: (v) => !!v && typeof v.then === 'function',
    function: (v) => typeof v === 'function'
};
