////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { getUnsafeReason } from '../../src';

describe('getUnsafeReason', () => {
  it('returns none for a safe integer', () => {
    expect(getUnsafeReason('123')).toBe('none');
  });

  it('returns none for a safe float', () => {
    expect(getUnsafeReason('123.45')).toBe('none');
  });

  it('returns truncate_integer for an unsafe integer', () => {
    expect(getUnsafeReason('12345678901234567890')).toBe('truncate_integer');
  });

  it('returns truncate_float for an unsafe float', () => {
    expect(getUnsafeReason('12345678901234567890.123')).toBe('truncate_float');
    expect(getUnsafeReason('0.12345678901234567890')).toBe('truncate_float');
    expect(getUnsafeReason('1.234567890123456789e+30')).toBe('truncate_float');
  });

  it('returns overflow for a number in scientific notation that overflows', () => {
    expect(getUnsafeReason('1e+1000')).toBe('overflow');
  });

  it('returns underflow for very small number', () => {
    expect(getUnsafeReason('1e-324')).toBe('underflow');
  });

  it('returns truncate_float for a negative unsafe float', () => {
    expect(getUnsafeReason('-12345678901234567890.123')).toBe('truncate_float');
  });

  it('returns truncate_integer for a negative unsafe integer', () => {
    expect(getUnsafeReason('-12345678901234567890')).toBe('truncate_integer');
  });

  it('returns overflow for a negative number in scientific notation that overflows', () => {
    expect(getUnsafeReason('-1e+1000')).toBe('overflow');
  });

  it('returns none for a small safe float', () => {
    expect(getUnsafeReason('0.0000001')).toBe('none');
  });

  it('returns none for non-string or invalid inputs', () => {
    expect(getUnsafeReason(123)).toBe('none');
    expect(getUnsafeReason(null)).toBe('none');
    expect(getUnsafeReason(undefined)).toBe('none');
    expect(getUnsafeReason('')).toBe('none');
    expect(getUnsafeReason('abc')).toBe('none');
    expect(getUnsafeReason('NaN')).toBe('none');
  });
});
