////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { parse as parseJson, stringify as stringifyJson } from 'json-custom-numbers';
import parseNumber from './parse-number';
import formatNumber from './format-number';
import collectionReplacer from './collection-replacer';

/**
 * A customized class for JSON object which supports lossless number parsing and
 * stringifying.
 *
 * The instance of this class is similar to the standard `JSON` object, but with
 * enhanced capabilities for handling large integers, floating-point numbers, and
 * collections like `Set` and `Map`.
 *
 * Features:
 * - Lossless parsing of large integers (converted to BigInt)
 * - Lossless parsing of large floating-point numbers (converted to LosslessNumber)
 * - Support for Set and Map serialization/deserialization
 * - Compatible with standard JSON.parse/stringify API
 *
 * @example
 * // Parse large integers without precision loss
 * const obj = json.parse('{"bigInt": 9007199254740993}');
 * console.log(typeof obj.bigInt); // 'bigint'
 *
 * // Parse large floats without precision loss
 * const obj2 = json.parse('{"bigFloat": 2.3e+500}');
 * console.log(obj2.bigFloat instanceof LosslessNumber); // true
 *
 * // Stringify collections
 * const obj3 = { set: new Set([1, 2, 3]), map: new Map([['a', 1]]) };
 * console.log(json.stringify(obj3)); // '{"set":[1,2,3],"map":[["a",1]]}'
 *
 * @author Haixing Hu
 */
class Json {
  /**
   * The string tag used by Object.prototype.toString() to identify this object.
   *
   * This property makes instances of the Json class return '[object JSON]' when
   * converted to string via Object.prototype.toString.call(), providing better
   * debugging and inspection experience.
   *
   * @type {string}
   * @readonly
   * @example
   * const json = new Json();
   * console.log(Object.prototype.toString.call(json)); // '[object JSON]'
   */
  [Symbol.toStringTag] = 'JSON';

  /**
   * Parses the specified JSON string and returns the resulting object.
   *
   * This method works like the standard JSON.parse(), but with enhanced number
   * handling:
   * - Safe numbers are parsed as regular JavaScript numbers
   * - Large integers are parsed as BigInt
   * - Large floating-point numbers are parsed as LosslessNumber instances
   *
   * @param {string} text
   *     The JSON string to be parsed. Must be a valid JSON string.
   * @param {Function} [reviver]
   *     Optional function to transform the results. This function is called for
   *     each member of the object. If a member contains nested objects, the nested
   *     objects are transformed before the parent object is.
   * @returns {*}
   *     The resulting JavaScript value/object. The type depends on the JSON content.
   * @throws {SyntaxError}
   *     Thrown if the text is not valid JSON.
   * @example
   * // Parse regular JSON
   * const obj = json.parse('{"name": "John", "age": 30}');
   *
   * // Parse with large integer (becomes BigInt)
   * const obj2 = json.parse('{"id": 9007199254740993}');
   * console.log(typeof obj2.id); // 'bigint'
   *
   * // Parse with reviver function
   * const obj3 = json.parse('{"date": "2023-01-01"}', (key, value) => {
   *   if (key === 'date') return new Date(value);
   *   return value;
   * });
   */
  parse(text, reviver) {
    if (typeof text !== 'string') {
      throw new TypeError('JSON.parse requires a string argument');
    }
    if ((reviver != null) && (typeof reviver !== 'function')) {
      throw new TypeError('JSON.parse reviver argument must be a function');
    }
    try {
      return parseJson(text, reviver, parseNumber);
    } catch (error) {
      // Re-throw with more context if needed
      if (error instanceof SyntaxError) {
        throw new SyntaxError(`Invalid JSON: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Stringifies the specified value and returns the resulting JSON string.
   *
   * This method works like the standard JSON.stringify(), but with enhanced
   * support for:
   * - BigInt values (converted to number strings)
   * - LosslessNumber instances (converted to their string representation)
   * - Set instances (converted to arrays)
   * - Map instances (converted to arrays of key-value pairs)
   *
   * @param {*} value
   *     The value to be stringified. Can be any JavaScript value.
   * @param {Function|Array} [replacer]
   *     Optional function or array to transform the results. If a function, it's
   *     called for each member of the object. If an array, it specifies the
   *     properties to be included in the result.
   * @param {string|number} [space]
   *     Optional string or number to control spacing in the output. If a number,
   *     it indicates the number of space characters to use as white space. If a
   *     string, it's used as white space.
   * @returns {string|undefined}
   *     The resulting JSON string, or undefined if the value cannot be serialized.
   * @example
   * // Stringify regular object
   * const str = json.stringify({name: "John", age: 30});
   *
   * // Stringify with BigInt (preserved as number)
   * const str2 = json.stringify({id: 9007199254740993n});
   * // Result: '{"id":9007199254740993}'
   *
   * // Stringify with collections
   * const str3 = json.stringify({
   *   set: new Set([1, 2, 3]),
   *   map: new Map([['a', 1], ['b', 2]])
   * });
   * // Result: '{"set":[1,2,3],"map":[["a",1],["b",2]]}'
   *
   * // Stringify with custom replacer
   * const str4 = json.stringify({a: 1, b: 2}, (key, value) => {
   *   return key === 'a' ? undefined : value;
   * });
   * // Result: '{"b":2}'
   */
  stringify(value, replacer, space) {
    // Validate replacer parameter
    if ((replacer != null) && (typeof replacer !== 'function') && (!Array.isArray(replacer))) {
      throw new TypeError('JSON.stringify replacer argument must be a function or array');
    }
    // Validate space parameter
    if ((space != null) && (typeof space !== 'string') && (typeof space !== 'number')) {
      throw new TypeError('JSON.stringify space argument must be a string or number');
    }
    try {
      // Optimize: create combined replacer function only when needed
      const combinedReplacer = replacer
        ? (k, v) => collectionReplacer(k, v, replacer)
        : collectionReplacer;

      return stringifyJson(value, combinedReplacer, space, formatNumber);
    } catch (error) {
      // Handle circular reference and other stringify errors
      if ((error.message.includes('circular'))
          || (error.message.includes('Converting circular structure'))) {
        throw new TypeError('Converting circular structure to JSON');
      }
      throw error;
    }
  }
}

/**
 * A customized JSON object which supports lossless number parsing and stringifying.
 *
 * This object provides two methods: `parse` and `stringify`, which are the same as the
 * `JSON.parse` and `JSON.stringify` methods, except that they support lossless number
 * parsing and stringifying.
 *
 * Key differences from standard JSON:
 * - Large integers are preserved as BigInt instead of losing precision
 * - Large floating-point numbers are preserved as LosslessNumber instances
 * - Set and Map collections are automatically serialized as arrays
 * - Maintains full compatibility with standard JSON API
 *
 * @type {Json}
 * @example
 * import json from '@qubit-ltd/json';
 *
 * // Use exactly like standard JSON
 * const obj = json.parse('{"value": 9007199254740993}');
 * const str = json.stringify(obj);
 *
 * // Works with collections
 * const data = { items: new Set([1, 2, 3]) };
 * const serialized = json.stringify(data); // '{"items":[1,2,3]}'
 */
const json = new Json();

export default json;
