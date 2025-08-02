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
    nan(v: any): v is number;
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
export declare const validate: Validate;
