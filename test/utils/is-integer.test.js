////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isInteger } from '../../src';

describe('isInteger', () => {
  it('returns true for a valid positive integer string', () => {
    expect(isInteger('123')).toBe(true);
  });

  it('returns true for a valid negative integer string', () => {
    expect(isInteger('-123')).toBe(true);
  });

  it('returns true for a valid integer string with a plus sign', () => {
    expect(isInteger('+123')).toBe(true);
  });

  it('returns false for a string with non-numeric characters', () => {
    expect(isInteger('12a3')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isInteger('')).toBe(false);
  });

  it('returns false for a string with only a sign', () => {
    expect(isInteger('+')).toBe(false);
    expect(isInteger('-')).toBe(false);
  });

  it('returns false for a string with decimal point', () => {
    expect(isInteger('123.45')).toBe(false);
  });

  it('returns false for a string with spaces', () => {
    expect(isInteger(' 123 ')).toBe(false);
  });

  it('returns true for a string with leading zeros', () => {
    expect(isInteger('0123')).toBe(true);
  });

  it('returns false for non-string inputs', () => {
    expect(isInteger(123)).toBe(false);
    expect(isInteger(null)).toBe(false);
    expect(isInteger(undefined)).toBe(false);
    expect(isInteger({})).toBe(false);
    expect(isInteger([])).toBe(false);
  });
});
