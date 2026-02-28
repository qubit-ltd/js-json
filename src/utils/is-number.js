////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * A regular expression for testing whether a string represents a number.
 *
 * @type {RegExp}
 * @see http://stackoverflow.com/questions/13340717/json-numbers-regular-expression
 * @private
 */
const NUMBER_REGEX = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

/**
 * Test whether a string represents a number
 *
 * @param {string} value
 *     The string to test.
 * @return {boolean}
 *     true if the string contains a number; false otherwise.
 */
function isNumber(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return NUMBER_REGEX.test(value);
}

export default isNumber;
