////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * A JSON replacer which serialize collections as arrays.
 *
 * @param {string} key
 *     The key of the property.
 * @param {any} value
 *     The value of the property.
 * @param {undefined|null|function} fallbackReplacer
 *     The fallback replacer.
 * @return {any}
 *     The serialized value.
 * @private
 */
function collectionReplacer(key, value, fallbackReplacer) {
  if (value instanceof Set) {
    return Array.from(value);
  }
  if (value instanceof Map) {
    return Array.from(value);
  }
  if (fallbackReplacer) {
    return fallbackReplacer(key, value);
  }
  return value;
}

export default collectionReplacer;
