////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isNumber } from '../../src';

describe('isNumber', () => {
  it('returns true for a valid positive integer string', () => {
    expect(isNumber('123')).toBe(true);
  });

  it('returns true for a valid negative integer string', () => {
    expect(isNumber('-123')).toBe(true);
  });

  it('returns true for a valid positive decimal string', () => {
    expect(isNumber('123.45')).toBe(true);
  });

  it('returns true for a valid negative decimal string', () => {
    expect(isNumber('-123.45')).toBe(true);
  });

  it('returns true for a valid number in scientific notation', () => {
    expect(isNumber('1.23e4')).toBe(true);
    expect(isNumber('-1.23e-4')).toBe(true);
  });

  it('returns false for a string with non-numeric characters', () => {
    expect(isNumber('12a3')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isNumber('')).toBe(false);
  });

  it('returns false for a string with only a sign', () => {
    expect(isNumber('+')).toBe(false);
    expect(isNumber('-')).toBe(false);
  });

  it('returns false for a string with multiple decimal points', () => {
    expect(isNumber('123.45.67')).toBe(false);
  });

  it('returns false for a string with spaces', () => {
    expect(isNumber(' 123 ')).toBe(false);
  });

  it('returns false for a string with leading zeros', () => {
    expect(isNumber('0123')).toBe(false);
  });

  it('returns false for non-string inputs', () => {
    expect(isNumber(123)).toBe(false);
    expect(isNumber(123.45)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
  });
});
