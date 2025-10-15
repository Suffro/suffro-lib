// jsonTools.ts
// --- All comments are in English as requested ---

import Ajv, { AnySchema, DefinedError } from "ajv";
import addFormats from "ajv-formats";
import { validate as _validate } from "./_typesValidation";

/**
 * A parsed JSON validation result: either success with data, or failure with readable errors.
 * @template T Parsed JSON value type (defaults to unknown)
 * @property {true} ok Indicates success
 * @property {T} data Parsed JSON value
 */
/**
 * @template T
 * @typedef {object} Ok
 * @property {true} ok
 * @property {T} data
 */

/**
 * A parsed JSON validation failure result.
 * @property {false} ok Indicates failure
 * @property {string[]} errors Human-readable error messages
 */
/**
 * @typedef {object} Err
 * @property {false} ok
 * @property {string[]} errors
 */

/**
 * Union result type for validation outcomes.
 * @template T
 * @typedef {(Ok<T> | Err)} ValidationResult
 */

/** Global singleton Ajv to avoid recompilation overhead */
const ajv = new Ajv({
  allErrors: true, // richer error messages
  strict: false    // plays nice with draft-07 and relaxed schemas
});
addFormats(ajv);

/** Cache compiled validators per schema object for efficiency */
const validatorCache = new WeakMap<object, (data: unknown) => boolean>();

/**
 * A small toolkit for working with JSON strings.
 *
 * @remarks
 * - The only exported API is this default object `jsonTools`.
 * - All functions are documented with JSDoc so tooltips are shown in IDEs.
 */
const jsonTools = {
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
  validate<T = unknown>(
    jsonStr: string,
    schema?: AnySchema | string
  ):
    | { ok: true; data: T }
    | { ok: false; errors: string[] } {
    // 1) Parse the JSON safely
    let parsed: unknown;
    let isValidJSON: boolean=false;
    let notValidJSONError: unknown;
    try {
      parsed = JSON.parse(jsonStr);
      isValidJSON = _validate.jsonString(jsonStr);
    } catch (err) {
      isValidJSON = false;
      notValidJSONError = err;
    } finally {
        if(!isValidJSON) {
            let e = notValidJSONError;
            return {
                ok: false,
                errors: ["JSON malformato: " + (e instanceof Error ? e.message : String(e))]
            };
        }
    }

    // 2) If no schema, parsing success is enough
    if (schema === undefined) {
      return { ok: true, data: parsed as T };
    }

    // 3) Normalize schema (accept object/boolean or JSON string)
    let normalizedSchema: AnySchema;
    if (typeof schema === "string") {
      try {
        normalizedSchema = JSON.parse(schema) as AnySchema;
      } catch (e) {
        return {
          ok: false,
          errors: [
            "Schema malformato (non è JSON valido): " +
              (e instanceof Error ? e.message : String(e))
          ]
        };
      }
    } else {
      normalizedSchema = schema;
    }

    // 4) Compile (with cache) and validate
    let validateFn: ((data: unknown) => boolean) | undefined;

    if (normalizedSchema && typeof normalizedSchema === "object") {
      validateFn = validatorCache.get(normalizedSchema as object);
      if (!validateFn) {
        validateFn = ajv.compile(normalizedSchema);
        validatorCache.set(normalizedSchema as object, validateFn);
      }
    } else {
      // boolean schemas (true/false) or non-object: compile directly (no cache)
      validateFn = ajv.compile(normalizedSchema);
    }

    const isValid = validateFn(parsed);
    if (isValid) {
      return { ok: true, data: parsed as T };
    }

    // 5) Collect and format Ajv errors
    const ajvErrors = (validateFn as any).errors as DefinedError[] | null | undefined;
    const errors =
      ajvErrors?.map((err) => {
        const path = err.instancePath || "(root)";
        const keyword = err.keyword;
        const msg = err.message || "schema validation error";
        const params = err.params ? JSON.stringify(err.params) : "";
        return `${path} – ${keyword}: ${msg}${params ? ` ${params}` : ""}`;
      }) ?? ["Schema validation failed (unknown error)"];

    return { ok: false, errors };
  }
} as const;

export default jsonTools;