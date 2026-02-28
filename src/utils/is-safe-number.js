////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isInteger from './is-integer';
import extractSignificantDigits from './extract-significant-digits';
import isNumber from './is-number';

const DEFAULT_APPROX = false;
const DEFAULT_REQUIRED_DIGITS = 14;

/**
 * Test whether a string can be safely represented with a number without
 * information loss.
 *
 * When the argument `approx` is true, floating point numbers that lose a few
 * digits but are still approximately equal in value are considered safe too.
 * Integer numbers must still be exactly equal.
 *
 * @param {string} value
 *     The string to test.
 * @param {object} options
 *     The options of the test. It may contain the following properties:
 *     - `approx: boolean`: indicates whether to consider approximately equal
 *       floating point numbers as safe. Default is `false`.
 *     - `requiredDigits: number`: the number of significant digits required for
 *        a floating point number to be considered approximately equal. Default
 *        is `14`.
 * @return {boolean}
 *     true if the string can be safely represented with a number; false
 *     otherwise.
 */
function isSafeNumber(value, options = undefined) {
  // handle the edge cases
  if (!isNumber(value) || value === '' || value === 'NaN') {
    return false;
  }

  const num = parseFloat(value);
  const str = String(num);
  if (value === str) {
    return true;
  }
  const v = extractSignificantDigits(value);
  const s = extractSignificantDigits(str);
  if (v === s) {
    return true;
  }

  // use the default options
  const approx = options?.approx ?? DEFAULT_APPROX;
  if (!approx) {
    return false;
  }

  // A value is approximately equal when:
  // 1. it is a floating point number, not an integer
  // 2. both v and s have at least requiredDigits digits
  // 3. the first requiredDigits digits are equal
  const requiredDigits = options?.requiredDigits ?? DEFAULT_REQUIRED_DIGITS;

  // check if the value is an integer
  const isIntegerVal = isInteger(value);
  if (isIntegerVal) {
    return true;  // when the input is an integer and approx=true, return true
  }

  // check if s has at least requiredDigits digits
  const sLengthOk = s.length >= requiredDigits;
  if (!sLengthOk) {
    return false;
  }

  // check if v has at least requiredDigits digits
  const vLengthOk = v.length >= requiredDigits;

  if (vLengthOk) {
    // check if the first requiredDigits digits are equal
    const vPrefix = v.substring(0, requiredDigits);
    const sPrefix = s.substring(0, requiredDigits);
    return vPrefix === sPrefix;
  } else {
    // if v length is not enough, return true
    return true;
  }
}

export {
  DEFAULT_APPROX,
  DEFAULT_REQUIRED_DIGITS,
  isSafeNumber,
};

export default isSafeNumber;
