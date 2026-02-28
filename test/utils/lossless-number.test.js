////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import LosslessNumber from '../../src/utils/lossless-number';
import * as getUnsafeReasonModule from '../../src/utils/get-unsafe-reason';

describe('LosslessNumber', () => {
  it('should construct a LosslessNumber with a valid number string', () => {
    const ln = new LosslessNumber('123.456');
    expect(ln.value).toBe('123.456');
    expect(ln.isLosslessNumber).toBe(true);
  });

  it('should throw an error when constructed with an invalid number string', () => {
    expect(() => new LosslessNumber('abc')).toThrow('Invalid number (value: "abc")');
  });

  it('should throw an error when constructed with a non-string input', () => {
    expect(() => new LosslessNumber(123)).toThrow('Invalid number (value: "123")');
    expect(() => new LosslessNumber(null)).toThrow('Invalid number (value: "null")');
    expect(() => new LosslessNumber({})).toThrow('Invalid number (value: "[object Object]")');
  });

  it('should return a safe integer as a number', () => {
    const ln = new LosslessNumber('123');
    expect(ln.valueOf()).toBe(123);
  });

  it('should return a safe float as a number', () => {
    const ln = new LosslessNumber('123.45');
    expect(ln.valueOf()).toBe(123.45);
  });

  it('should return a big integer as a bigint', () => {
    const ln = new LosslessNumber('12345678901234567890');
    const result = ln.valueOf();
    expect(typeof result).toBe('bigint');
    expect(result.toString()).toBe('12345678901234567890');
  });

  it('should return a truncated float for a float that cannot be safely represented', () => {
    const ln = new LosslessNumber('12345678901234567890.123');
    expect(ln.valueOf()).toBe(parseFloat('12345678901234567890.123'));
  });

  it('should throw an error for a number that overflows', () => {
    const ln = new LosslessNumber('1e+1000');
    expect(() => ln.valueOf()).toThrow(/Cannot safely CONVERT TO NUMBER.*overflow/);
  });

  it('should throw an error for a number that underflows', () => {
    const ln = new LosslessNumber('1e-324');
    expect(() => ln.valueOf()).toThrow(/Cannot safely CONVERT TO NUMBER.*underflow/);
  });

  it('should throw an error for an unknown unsafe reason', () => {
    const ln = new LosslessNumber('123');
    
    // 保存原始的getUnsafeReason函数
    const originalGetUnsafeReason = getUnsafeReasonModule.default;
    
    // 模拟getUnsafeReason返回未知的reason
    getUnsafeReasonModule.default = jest.fn().mockReturnValue('unknown_reason');
    
    try {
      // 这应该会触发default分支
      expect(() => ln.valueOf()).toThrow('Unknown unsafe reason');
    } finally {
      // 恢复原始函数
      getUnsafeReasonModule.default = originalGetUnsafeReason;
    }
  });

  it('should return the string representation of the LosslessNumber', () => {
    const ln = new LosslessNumber('123.456');
    expect(ln.toString()).toBe('123.456');
  });
});
