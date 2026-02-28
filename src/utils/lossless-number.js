////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isNumber from './is-number';
import getUnsafeReason from './get-unsafe-reason';

/**
 * The class of lossless numbers, which stores its numeric value as string.
 */
class LosslessNumber {
  /**
   * The string representation of the number.
   *
   * @type {string}
   */
  value = '';

  /**
   * Whether the value is a lossless number.
   *
   * @type {boolean}
   */
  isLosslessNumber = true;

  /**
   * Constructs a new instance of `LosslessNumber`.
   *
   * @param {string} value
   *     The string representation of the number.
   */
  constructor(value) {
    if (!isNumber(value)) {
      throw new Error(`Invalid number (value: "${value}")`);
    }
    this.value = value;
  }

  /**
   * Get the value of the LosslessNumber as number or bigint.
   *
   * - a number is returned for safe numbers and decimal values that only lose
   *   some insignificant digits;
   * - a bigint is returned for big integer numbers;
   * - an Error is thrown for values that will overflow or underflow;
   *
   * Note that you can implement your own strategy for conversion by just
   * getting the value as string via `.toString()`, and using util functions
   * like `isInteger`, `isSafeNumber`, `getUnsafeReason`, and `toSafeNumberOrThrow`
   * to convert it to a numeric value.
   *
   * @return {number|bigint}
   *     the numeric value of the LosslessNumber, as number or bigint.
   */
  valueOf() {
    const unsafeReason = getUnsafeReason(this.value);
    switch (unsafeReason) {
      case 'none':
        return parseFloat(this.value);
      case 'truncate_float':
        return parseFloat(this.value);
      case 'truncate_integer':
        return BigInt(this.value);
      case 'overflow':
      case 'underflow':
        throw new Error('Cannot safely CONVERT TO NUMBER: '
          + `the value '${this.value}' would ${unsafeReason} `
          + `and become ${parseFloat(this.value)}`);
      default:
        throw new Error('Unknown unsafe reason');
    }
  }

  /**
   * Get the value of this `LosslessNumber` as string.
   *
   * @return {string}
   *     the string representation of this `LosslessNumber`.
   */
  toString() {
    return this.value;
  }

  // Note: we do NOT implement a .toJSON() method, and you should not implement
  // or use that, it cannot safely turn the numeric value in the string into
  // stringified JSON since it has to be parsed into a number first.
}

export default LosslessNumber;
