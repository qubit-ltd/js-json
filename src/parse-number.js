////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isInteger from './utils/is-integer';
import isSafeNumber from './utils/is-safe-number';
import LosslessNumber from './utils/lossless-number';

/**
 * A custom function to parse a number from a string, which supports lossless
 * number parsing.
 *
 * @param {string} key
 *     The key of the property.
 * @param {string} value
 *     The value of the property.
 * @return {any}
 *     The parsed value.
 * @private
 */
function parseNumber(key, value) {
  // if (isBigInt(value)) {
  //   return BigInt(value.slice(0, -1));
  // }
  if (isSafeNumber(value, { approx: false })) {
    return parseFloat(value);
  }
  if (isInteger(value)) {
    return BigInt(value);
  }
  return new LosslessNumber(value);
}

export default parseNumber;
