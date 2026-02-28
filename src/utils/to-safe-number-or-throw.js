////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getUnsafeReason from './get-unsafe-reason';
import { DEFAULT_APPROX } from './is-safe-number';

/**
 * Convert a string into a number when it is safe to do so.
 * Throws an error otherwise, explaining the reason.
 *
 * @param {string} value
 *     The string to convert into a number.
 * @param {object} options
 *     The options for conversion.
 * @return {number}
 *     The converted safe number.
 * @throws {Error}
 *     When the value is not safe to convert.
 */
export function toSafeNumberOrThrow(value, options = undefined) {
  const number = parseFloat(value);
  const unsafeReason = getUnsafeReason(value);
  if (unsafeReason === 'none') {
    return number;
  }
  const approx = options?.approx ?? DEFAULT_APPROX;
  // when approx is true, we allow truncating float values
  if (approx && (unsafeReason === 'truncate_float')) {
    return number;
  }
  const unsafeReasonText = unsafeReason?.replace(/_/, ' ');
  throw new Error('Cannot safely convert to number: '
      + `the value '${value}' would ${unsafeReasonText} and become ${number}`);
}

export default toSafeNumberOrThrow;
