////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
/**
 * A regular expression for testing whether a string represents a BigInt.
 *
 * @type {RegExp}
 * @private
 */
const BIG_INTEGER_REGEX = /^[+-]?\d+n$/;

/**
 * Test whether a string represents a BigInt.
 *
 * @param value
 *     The string to test.
 * @return {boolean}
 *     true if the string contains a BigInt; false otherwise.
 */
function isBigInt(value) {
  return BIG_INTEGER_REGEX.test(value);
}

export default isBigInt;
