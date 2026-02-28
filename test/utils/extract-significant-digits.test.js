////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import extractSignificantDigits from '../../src/utils/extract-significant-digits';

describe('extractSignificantDigits', () => {
  it('returns significant digits for a positive decimal number', () => {
    expect(extractSignificantDigits('2.34')).toBe('234');
  });

  it('returns significant digits for a negative integer', () => {
    expect(extractSignificantDigits('-77')).toBe('77');
  });

  it('returns significant digits for a small decimal number with leading zeros', () => {
    expect(extractSignificantDigits('0.003400')).toBe('34');
  });

  it('returns significant digits for a number in scientific notation', () => {
    expect(extractSignificantDigits('120.5e+30')).toBe('1205');
  });

  it('returns significant digits for a negative number in scientific notation', () => {
    expect(extractSignificantDigits('-0.250e+30')).toBe('25');
  });

  it('returns significant digits for a number with trailing zeros', () => {
    expect(extractSignificantDigits('1000')).toBe('1');
  });

  it('returns significant digits for a number with leading and trailing zeros', () => {
    expect(extractSignificantDigits('000123000')).toBe('123');
  });

  it('returns significant digits for a number with no decimal point or exponent', () => {
    expect(extractSignificantDigits('456')).toBe('456');
  });

  it('returns significant digits for a negative number with leading zeros', () => {
    expect(extractSignificantDigits('-000123')).toBe('123');
  });

  it('returns significant digits for a number with multiple decimal points', () => {
    expect(extractSignificantDigits('1.2.3')).toBe('12.3');
  });

  it('returns empty string for "0"', () => {
    expect(extractSignificantDigits('0')).toBe('');
  });

  it('returns empty string for "0.0"', () => {
    expect(extractSignificantDigits('0.0')).toBe('');
  });

  it('returns empty string for "-0"', () => {
    expect(extractSignificantDigits('-0')).toBe('');
  });

  it('returns empty string for "000"', () => {
    expect(extractSignificantDigits('000')).toBe('');
  });
});
