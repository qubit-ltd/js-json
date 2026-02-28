////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * A regular expression for testing whether a string represents an integer.
 *
 * @type {RegExp}
 * @private
 */
const INTEGER_REGEX = /^[+-]?\d+$/;

/**
 * Test whether a string represents an integer.
 *
 * @param value
 *     The string to test.
 * @return {boolean}
 *     true if the string contains an integer; false otherwise.
 */
function isInteger(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return INTEGER_REGEX.test(value);
}

export default isInteger;
