////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

const EXPONENTIAL_PART_REGEX = /[eE][+-]?\d+$/;
const LEADING_MINUS_AND_ZEROS_REGEX = /^-?(0*)?/;
const DOT_REGEX = /\./;
const TRAILING_ZEROS_REGEX = /0+$/;

/**
 * Get the significant digits of a number.
 *
 * For example:
 * - '2.34' returns '234'
 * - '-77' returns '77'
 * - '0.003400' returns '34'
 * - '120.5e+30' returns '1205'
 *
 * @param {string} value
 *     The string representation of the number.
 * @return {string}
 *     The significant digits of the number.
 * @private
 */
function extractSignificantDigits(value) {
  const result = value
    .replace(EXPONENTIAL_PART_REGEX, '')          // from "-0.250e+30" to "-0.250"
    .replace(DOT_REGEX, '')                       // from "-0.250" to "-0250"
    .replace(TRAILING_ZEROS_REGEX, '')            // from "-0250" to "-025"
    .replace(LEADING_MINUS_AND_ZEROS_REGEX, '');  // from "-025" to "25"
  return result;
}

export default extractSignificantDigits;
