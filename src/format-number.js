////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import LosslessNumber from './utils/lossless-number';

/**
 * Formats a number value.
 *
 * @param {string} key
 *     The key of the property.
 * @param {string} value
 *     The value of the property.
 * @param {string} type
 *     The type of the value.
 * @return {undefined|string}
 *     The formatted value. If the value is not a number, then return undefined.
 * @private
 */
function formatNumber(key, value, type) {
  switch (type) {
    case 'bigint':
      return value.toString();
    case 'object':
      // if (value instanceof Set) {
      //   return Array.from(value);
      // }
      // if (value instanceof Map) {
      //   return Array.from(value);
      // }
      if (value instanceof LosslessNumber) {
        return value.toString();
      }
      return undefined;
    default:
      return undefined;
  }
}

export default formatNumber;
