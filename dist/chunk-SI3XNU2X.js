import {
  logger,
  validate
} from "./chunk-54MRKUDF.js";

// src/utils/_browserStorage.ts
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

// src/utils/_jitter.ts
var backoffNoJitter = (attempt, baseMin = 15, capMin = 240) => Math.min(capMin, baseMin * Math.pow(2, Math.max(0, attempt - 1)));
var addJitter = (minutes, ratio = 0.1) => {
  const min = minutes * (1 - ratio);
  const max = minutes * (1 + ratio);
  return Math.round(min + Math.random() * (max - min));
};
var fullJitter = (attempt, baseMin = 15, capMin = 240) => {
  const d = backoffNoJitter(attempt, baseMin, capMin);
  return Math.round(Math.random() * d);
};
var decorrelatedJitter = (prevMin, baseMin = 15, capMin = 240) => {
  const next = Math.min(capMin, Math.max(baseMin, Math.random() * (prevMin * 3)));
  return Math.round(next);
};

// src/utils/_integerUtils.ts
function isIntegerInRange(v, min, max) {
  return typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;
}
function isF32Runtime(v) {
  return typeof v === "number" && Math.fround(v) === v;
}
var Pred = {
  // Unsigned
  isU8: (v) => isIntegerInRange(v, 0, 255),
  isU16: (v) => isIntegerInRange(v, 0, 65535),
  isU32: (v) => isIntegerInRange(v, 0, 4294967295),
  isU64: (v) => isIntegerInRange(v, 0, Number.MAX_SAFE_INTEGER),
  // Signed
  isI8: (v) => isIntegerInRange(v, -128, 127),
  isI16: (v) => isIntegerInRange(v, -32768, 32767),
  isI32: (v) => isIntegerInRange(v, -2147483648, 2147483647),
  isI64: (v) => typeof v === "number" && Number.isInteger(v) && v >= Number.MIN_SAFE_INTEGER && v <= Number.MAX_SAFE_INTEGER,
  // Floats
  isF32: (v) => isF32Runtime(v),
  isF64: (v) => typeof v === "number"
};
function makeRefinement(tag, isFn) {
  return {
    is: (v) => isFn(v),
    as: (v) => {
      if (!isFn(v)) throw new TypeError(`Expected ${tag}, got ${String(v)}`);
      return v;
    },
    try: (v) => isFn(v) ? v : null,
    parse: (s) => {
      const n = Number(s);
      if (!Number.isFinite(n) || !isFn(n)) {
        throw new TypeError(`Invalid ${tag} from "${s}"`);
      }
      return n;
    }
  };
}
var Num = {
  // Predicates (stile number.is...)
  isU8: Pred.isU8,
  isU16: Pred.isU16,
  isU32: Pred.isU32,
  isU64: Pred.isU64,
  isI8: Pred.isI8,
  isI16: Pred.isI16,
  isI32: Pred.isI32,
  isI64: Pred.isI64,
  isF32: Pred.isF32,
  isF64: Pred.isF64,
  // Branded constructors / refiners
  U8: makeRefinement("u8", Pred.isU8),
  U16: makeRefinement("u16", Pred.isU16),
  U32: makeRefinement("u32", Pred.isU32),
  U64: makeRefinement("u64", Pred.isU64),
  I8: makeRefinement("i8", Pred.isI8),
  I16: makeRefinement("i16", Pred.isI16),
  I32: makeRefinement("i32", Pred.isI32),
  I64: makeRefinement("i64", Pred.isI64),
  F32: makeRefinement("f32", Pred.isF32),
  F64: makeRefinement("f64", Pred.isF64)
};

// src/utils/_json.ts
import Ajv from "ajv";
import addFormats from "ajv-formats";
var ajv = new Ajv({
  allErrors: true,
  // richer error messages
  strict: false
  // plays nice with draft-07 and relaxed schemas
});
addFormats(ajv);
var validatorCache = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function safeStringify(value, space) {
  const seen = /* @__PURE__ */ new WeakSet();
  const replacer = (key, val) => {
    if (typeof val === "object" && val !== null) {
      if (seen.has(val)) return "[Circular]";
      seen.add(val);
    }
    return val === void 0 ? void 0 : val;
  };
  try {
    return JSON.stringify(value, replacer, space);
  } catch {
    return String(value);
  }
}
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  const ta = typeof a;
  const tb = typeof b;
  if (ta !== tb) return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (isPlainObject(a)) {
    if (!isPlainObject(b)) return false;
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) {
      if (!(k in b)) return false;
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  if (ta === "number" && Number.isNaN(a) && Number.isNaN(b)) return true;
  return false;
}
function deepMerge(a, b) {
  const out = { ...a };
  for (const key of Object.keys(b)) {
    const vB = b[key];
    const vA = a[key];
    if (Array.isArray(vB)) {
      out[key] = vB.slice();
    } else if (isPlainObject(vB) && isPlainObject(vA)) {
      out[key] = deepMerge(vA, vB);
    } else if (isPlainObject(vB)) {
      out[key] = deepMerge({}, vB);
    } else {
      out[key] = vB;
    }
  }
  return out;
}
function computeDiff(a, b, basePath = "") {
  if (deepEqual(a, b)) return {};
  const changes = {};
  const pathOf = (p, key) => p ? `${p}.${String(key)}` : String(key);
  if (Array.isArray(a) && Array.isArray(b)) {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      const sub = computeDiff(a[i], b[i], pathOf(basePath, i));
      Object.assign(changes, sub);
    }
    return changes;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = /* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      const sub = computeDiff(a[k], b[k], pathOf(basePath, k));
      Object.assign(changes, sub);
    }
    return changes;
  }
  changes[basePath || "(root)"] = { oldValue: a, newValue: b };
  return changes;
}
function inferSimpleSchema(value) {
  const t = typeof value;
  if (value === null) return { type: "null" };
  if (t === "string" || t === "number" || t === "boolean") {
    return { type: t };
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: "array" };
    }
    const itemsSchemas = value.map(inferSimpleSchema);
    const allSame = itemsSchemas.every((s) => JSON.stringify(s) === JSON.stringify(itemsSchemas[0]));
    return allSame ? { type: "array", items: itemsSchemas[0] } : { type: "array", items: { anyOf: itemsSchemas } };
  }
  if (isPlainObject(value)) {
    const props = {};
    const required = [];
    for (const key of Object.keys(value)) {
      required.push(key);
      props[key] = inferSimpleSchema(value[key]);
    }
    return {
      type: "object",
      properties: props,
      required,
      additionalProperties: false
    };
  }
  return { type: "string" };
}
var jsonTools = {
  /**
   * Validate a JSON string.
   *
   * - If `schema` is **omitted**: only checks that the string is valid JSON and returns the parsed value.
   * - If `schema` is **provided** (object/boolean or JSON string): validates against the schema using Ajv.
   *
   * @template T
   * @param {string} jsonStr The JSON string to parse.
   * @param {AnySchema | string} [schema] Optional JSON Schema as an object/boolean or as a JSON string.
   * @returns {ValidationResult<T>} On success, `{ ok: true, data }`; on failure, `{ ok: false, errors }`.
   *
   * @example
   * // Just check if it's valid JSON
   * const r1 = jsonTools.validate('{"a":1}');
   * if (r1.ok) {
   *   // r1.data is the parsed value
   *   console.log(r1.data);
   * }
   *
   * @example
   * // Validate against a schema (object)
   * const schema = {
   *   type: "object",
   *   required: ["a"],
   *   properties: { a: { type: "number" } },
   *   additionalProperties: false
   * } as const;
   * const r2 = jsonTools.validate<{ a: number }>('{"a":1}', schema);
   * console.log(r2.ok ? "valid" : r2.errors.join("\\n"));
   *
   * @example
   * // Validate against a schema (string)
   * const schemaStr = JSON.stringify({ type: "array", items: { type: "string" } });
   * const r3 = jsonTools.validate<string[]>('["x","y"]', schemaStr);
   * if (r3.ok) console.log(r3.data.length);
   */
  validate(jsonStr, schema) {
    let parsed;
    let isValidJSON = false;
    let notValidJSONError;
    try {
      parsed = JSON.parse(jsonStr);
      isValidJSON = validate.jsonString(jsonStr);
    } catch (err) {
      isValidJSON = false;
      notValidJSONError = err;
    } finally {
      if (!isValidJSON) {
        let e = notValidJSONError;
        return {
          ok: false,
          errors: ["JSON malformato: " + (e instanceof Error ? e.message : String(e))]
        };
      }
    }
    if (schema === void 0) {
      return { ok: true, data: parsed };
    }
    let normalizedSchema;
    if (typeof schema === "string") {
      try {
        normalizedSchema = JSON.parse(schema);
      } catch (e) {
        return {
          ok: false,
          errors: [
            "Schema malformato (non \xE8 JSON valido): " + (e instanceof Error ? e.message : String(e))
          ]
        };
      }
    } else {
      normalizedSchema = schema;
    }
    let validateFn;
    if (normalizedSchema && typeof normalizedSchema === "object") {
      validateFn = validatorCache.get(normalizedSchema);
      if (!validateFn) {
        validateFn = ajv.compile(normalizedSchema);
        validatorCache.set(normalizedSchema, validateFn);
      }
    } else {
      validateFn = ajv.compile(normalizedSchema);
    }
    const isValid = validateFn(parsed);
    if (isValid) {
      return { ok: true, data: parsed };
    }
    const ajvErrors = validateFn.errors;
    const errors = ajvErrors?.map((err) => {
      const path = err.instancePath || "(root)";
      const keyword = err.keyword;
      const msg = err.message || "schema validation error";
      const params = err.params ? JSON.stringify(err.params) : "";
      return `${path} \u2013 ${keyword}: ${msg}${params ? ` ${params}` : ""}`;
    }) ?? ["Schema validation failed (unknown error)"];
    return { ok: false, errors };
  },
  /**
   * Safely parse a JSON string without throwing.
   * @template T
   * @param {string} jsonStr The JSON string to parse.
   * @returns {{ ok: true; data: T } | { ok: false; error: string }}
   * Returns the parsed value on success, or a readable error on failure.
   */
  parse(jsonStr) {
    try {
      if (!validate.jsonString(jsonStr)) {
        return { ok: false, error: "Invalid JSON string." };
      }
      return { ok: true, data: JSON.parse(jsonStr) };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : String(e)
      };
    }
  },
  /**
   * Safely stringify any value to JSON.
   * - Handles circular references by inserting the literal string "[Circular]".
   * - Skips `undefined` fields like native JSON.stringify.
   * - Never throws: returns a string representation even on edge cases.
   * @param {any} value The value to serialize.
   * @param {number} [space] Optional indentation (e.g., 2).
   * @returns {string} The JSON string (or a safe fallback string).
   */
  stringify(value, space) {
    return safeStringify(value, space);
  },
  /**
   * Beautify (pretty-print) a JSON string.
   * - If input is invalid JSON, the original string is returned unchanged.
   * @param {string} jsonStr The JSON string to format.
   * @param {number} [indent=2] Number of spaces for indentation.
   * @returns {string} A formatted JSON string, or the original input if invalid.
   */
  pretty(jsonStr, indent = 2) {
    try {
      if (!validate.jsonString(jsonStr)) return jsonStr;
      const obj = JSON.parse(jsonStr);
      return safeStringify(obj, indent);
    } catch {
      return jsonStr;
    }
  },
  /**
   * Compact (minify) a JSON string by removing whitespace and indentation.
   * - If input is invalid JSON, the original string is returned unchanged.
   * @param {string} jsonStr The JSON string to minify.
   * @returns {string} A minified JSON string, or the original input if invalid.
   */
  compact(jsonStr) {
    try {
      if (!validate.jsonString(jsonStr)) return jsonStr;
      const obj = JSON.parse(jsonStr);
      return safeStringify(obj);
    } catch {
      return jsonStr;
    }
  },
  /**
   * Deep equality check for JSON-compatible values.
   * - Order-insensitive for object keys.
   * - Arrays must match in order and length.
   * @param {unknown} a First value.
   * @param {unknown} b Second value.
   * @returns {boolean} True if structurally equal, false otherwise.
   */
  isEqual(a, b) {
    return deepEqual(a, b);
  },
  /**
   * Safely access nested properties using a dot path.
   * - Example: `jsonTools.get(obj, "user.settings.theme")`
   * - Returns `undefined` if any segment is missing.
   * @template T
   * @param {any} obj The object to query.
   * @param {string} path Dot-separated path (supports numeric indices for arrays).
   * @returns {T | undefined} The found value or undefined.
   */
  get(obj, path) {
    if (!path) return obj;
    const parts = path.split(".");
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return void 0;
      const idx = Number(p);
      if (Array.isArray(cur) && Number.isInteger(idx)) {
        cur = cur[idx];
      } else {
        cur = cur[p];
      }
    }
    return cur;
  },
  /**
   * Deep merge two JSON-compatible objects (non-mutating).
   * - Arrays are overwritten by default.
   * - Objects are merged recursively.
   * @template T extends object
   * @template U extends object
   * @param {T} target Base object.
   * @param {U} source Override object.
   * @returns {T & U} A new merged object.
   */
  merge(target, source) {
    const a = isPlainObject(target) ? target : {};
    const b = isPlainObject(source) ? source : {};
    const merged = deepMerge(a, b);
    return merged;
  },
  /**
   * Compute a structural diff between two JSON-compatible values.
   * - Returns a flat map of `path -> { oldValue, newValue }` for changed leaves.
   * - Paths use dot notation; "(root)" indicates the root value.
   * @param {unknown} a Original value.
   * @param {unknown} b New value.
   * @returns {Record<string, { oldValue: any; newValue: any }>} Diff map.
   */
  diff(a, b) {
    return computeDiff(a, b);
  },
  /**
   * Generate a short human-readable summary of a JSON Schema.
   * - Lists top-level `type`, enumerations and object properties (with required flags).
   * - Intended for debugging and quick docs.
   * @param {AnySchema} schema A JSON Schema object.
   * @returns {string} A readable, multi-line summary.
   */
  schemaSummary(schema) {
    try {
      const lines = [];
      const s = schema;
      if (s.type) lines.push(`type: ${Array.isArray(s.type) ? s.type.join("|") : s.type}`);
      if (s.enum) lines.push(`enum: [${s.enum.join(", ")}]`);
      const defs = s.definitions || s.$defs;
      if (defs && isPlainObject(defs)) {
        lines.push(`definitions: ${Object.keys(defs).length}`);
      }
      const props = s.properties;
      if (props && isPlainObject(props)) {
        const required = Array.isArray(s.required) ? s.required : [];
        lines.push("properties:");
        for (const key of Object.keys(props)) {
          const prop = props[key];
          const t = prop && typeof prop === "object" && "type" in prop ? Array.isArray(prop.type) ? prop.type.join("|") : prop.type : "(any)";
          const req = required.includes(key) ? " (required)" : "";
          lines.push(`  - ${key}: ${t}${req}`);
        }
      }
      return lines.join("\n") || "[empty schema]";
    } catch {
      return "[unreadable schema]";
    }
  },
  /**
   * Infer a minimal JSON Schema from a JSON-compatible example.
   * - Produces a conservative, validation-ready schema:
   *   * objects -> `type: object`, `properties`, `required` (all present keys), `additionalProperties: false`
   *   * arrays  -> `type: array`, `items` inferred (union if mixed)
   * @param {unknown} example Example value to infer from.
   * @returns {AnySchema} A minimal JSON Schema.
   */
  inferSchema(example) {
    return inferSimpleSchema(example);
  }
};

export {
  browserStorage,
  backoffNoJitter,
  addJitter,
  fullJitter,
  decorrelatedJitter,
  Pred,
  Num,
  jsonTools
};
//# sourceMappingURL=chunk-SI3XNU2X.js.map