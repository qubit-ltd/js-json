////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2026.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Json from './json';
import LosslessNumber from './utils/lossless-number';
import isBigInt from './utils/is-bigint';
import isInteger from './utils/is-integer';
import isNumber from './utils/is-number';
import isSafeNumber from './utils/is-safe-number';
import getUnsafeReason from './utils/get-unsafe-reason';
import toSafeNumberOrThrow from './utils/to-safe-number-or-throw';

export {
  getUnsafeReason,
  isBigInt,
  isInteger,
  isNumber,
  isSafeNumber,
  Json,
  LosslessNumber,
  toSafeNumberOrThrow,
};

export default Json;
