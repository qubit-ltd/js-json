////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { isBigInt } from '../../src';

describe('isBigInt', () => {
  it('returns true for a valid positive BigInt string', () => {
    expect(isBigInt('123n')).toBe(true);
  });

  it('returns true for a valid negative BigInt string', () => {
    expect(isBigInt('-123n')).toBe(true);
  });

  it('returns true for a valid BigInt string with a plus sign', () => {
    expect(isBigInt('+123n')).toBe(true);
  });

  it('returns false for a string without "n" suffix', () => {
    expect(isBigInt('123')).toBe(false);
  });

  it('returns false for a string with "n" not at the end', () => {
    expect(isBigInt('123n456')).toBe(false);
  });

  it('returns false for a string with non-numeric characters', () => {
    expect(isBigInt('12a3n')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isBigInt('')).toBe(false);
  });

  it('returns false for a string with only "n"', () => {
    expect(isBigInt('n')).toBe(false);
  });

  it('returns false for a string with only a sign and "n"', () => {
    expect(isBigInt('+n')).toBe(false);
    expect(isBigInt('-n')).toBe(false);
  });

  it('returns false for non-string inputs', () => {
    expect(isBigInt(123)).toBe(false);
    expect(isBigInt(null)).toBe(false);
    expect(isBigInt(undefined)).toBe(false);
    expect(isBigInt({})).toBe(false);
    expect(isBigInt([])).toBe(false);
  });
});
