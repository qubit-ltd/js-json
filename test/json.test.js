////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import Json from '../src';
import LosslessNumber from '../src/utils/lossless-number';

/* eslint-disable no-magic-numbers */

describe('Unit test of the Json object', () => {
  it('should have the parse method', () => {
    expect(Json.parse).toBeDefined();
    expect(Json.parse).toBeInstanceOf(Function);
  });

  it('should have the stringify method', () => {
    expect(Json.stringify).toBeDefined();
    expect(Json.stringify).toBeInstanceOf(Function);
  });

  it('should be a JSON object', () => {
    expect(Json[Symbol.toStringTag]).toBe('JSON');
  });

  it('should be a customized JSON object', () => {
    expect(Json).not.toBe(globalThis.JSON);
  });

  it('should parse and stringify the non-numeric values', () => {
    const text = '{"x":"2.370","y":"9007199254740991"}';
    const obj = Json.parse(text);
    expect(typeof obj.x).toBe('string');
    expect(obj.x).toBe('2.370');
    expect(typeof obj.y).toBe('string');
    expect(obj.y).toBe('9007199254740991');
    const str = Json.stringify(obj);
    expect(str).toBe(text);
  });

  it('should parse and stringify the safe number', () => {
    const text = '{"x":2.370,"y":9007199254740991}';
    const obj = Json.parse(text);
    expect(typeof obj.x).toBe('number');
    expect(obj.x).toBe(2.37);
    expect(typeof obj.y).toBe('number');
    expect(obj.y).toBe(9007199254740991);
    const str = Json.stringify(obj);
    expect(str).toBe('{"x":2.37,"y":9007199254740991}');
  });

  it('should parse and stringify the unsafe integer as bigint', () => {
    const text = '{"x":9007199254740993}';
    const obj = Json.parse(text);
    expect(typeof obj.x).toBe('bigint');
    expect(obj.x).toBe(9007199254740993n);
    const str = Json.stringify(obj);
    expect(str).toBe(text);
  });

  it('should parse and stringify the unsafe decimal as LosslessNumber', () => {
    const text = '{"x":2.3e+500}';
    const obj = Json.parse(text);
    expect(typeof obj.x).toBe('object');
    expect(obj.x).toBeInstanceOf(LosslessNumber);
    expect(String(obj.x)).toBe('2.3e+500');
    const str = Json.stringify(obj);
    expect(str).toBe(text);
  });

  it('should parse the number without lose of precision', () => {
    const text = '{"decimal":2.370,"big_int":9123372036854000123,"big_float":2.3e+500}';
    const obj = Json.parse(text);
    expect(typeof obj.decimal).toBe('number');
    expect(obj.decimal).toBe(2.37);
    expect(typeof obj.big_int).toBe('bigint');
    expect(obj.big_int).toBe(9123372036854000123n);

    expect(typeof obj.big_float).toBe('object');
    expect(obj.big_float).toBeInstanceOf(LosslessNumber);
    expect(String(obj.big_float)).toBe('2.3e+500');
    const str = Json.stringify(obj);
    const expected = '{"decimal":2.37,"big_int":9123372036854000123,"big_float":2.3e+500}';
    expect(str).toBe(expected);

    console.log(obj);
  });

  // it('should parse and stringify the bigint', () => {
  //   const text = '{"x": 9007199254740993n}';
  //   const obj = Json.parse(text);
  //   expect(typeof obj.x).toBe('bigint');
  //   expect(obj.x).toBe(9007199254740993n);
  //   const str = Json.stringify(obj);
  //   // note that when stringifying the bigint is converted to number
  //   expect(str).toBe('{"x": 9007199254740993}');
  // });

  it('should stringify Set of primitives as array', () => {
    const obj = { x: new Set([1, 2, 3]) };
    const str = Json.stringify(obj);
    expect(str).toBe('{"x":[1,2,3]}');
  });

  it('should stringify Set of objects as array', () => {
    const obj = { x: new Set([{ a: 1 }, { b: 2 }, { c: 3 }]) };
    const str = Json.stringify(obj);
    expect(str).toBe('{"x":[{"a":1},{"b":2},{"c":3}]}');
  });

  it('should recursively stringify Set values as array', () => {
    const obj = { x: new Set([new Set([1, 2]), new Set([3, 4])]) };
    const str = Json.stringify(obj);
    expect(str).toBe('{"x":[[1,2],[3,4]]}');
  });

  it('should stringify Map of primitives as array', () => {
    const obj = { x: new Map([[1, 2], [3, 4]]) };
    const str = Json.stringify(obj);
    expect(str).toBe('{"x":[[1,2],[3,4]]}');
  });

  it('should stringify Map of objects as array', () => {
    const obj = { x: new Map([[{ a: 1 }, { b: 2 }], [{ c: 3 }, { d: 4 }]]) };
    const str = Json.stringify(obj);
    expect(str).toBe('{"x":[[{"a":1},{"b":2}],[{"c":3},{"d":4}]]}');
  });

  it('should recursively stringify Map values as array', () => {
    const obj = { x: new Map([[new Map([[1, 2], [3, 4]]), new Map([[5, 6], [7, 8]])]]) };
    const str = Json.stringify(obj);
    expect(str).toBe('{"x":[[[[1,2],[3,4]],[[5,6],[7,8]]]]}');
  });

  it('should parse Set of primitives as array', () => {
    const text = '{"x":[1,2,3]}';
    const obj = Json.parse(text);
    expect(obj.x).toBeInstanceOf(Array);
    expect(obj.x).toEqual([1, 2, 3]);
  });

  it('should parse Set of objects as array', () => {
    const text = '{"x":[{"a":1},{"b":2},{"c":3}]}';
    const obj = Json.parse(text);
    expect(obj.x).toBeInstanceOf(Array);
    expect(obj.x).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
  });

  it('should recursively parse Set values as array', () => {
    const text = '{"x":[[1,2],[3,4]]}';
    const obj = Json.parse(text);
    expect(obj.x).toBeInstanceOf(Array);
    expect(obj.x).toEqual([[1, 2], [3, 4]]);
  });

  it('should stringify Set of objects as array and use a customized replacer', () => {
    const obj = { x: new Set([{ a: 1 }, { b: 2 }, { c: 3 }]), y: 'hello', z: 'abc' };
    const str = Json.stringify(obj, (k, v) => (v === 'hello' ? 'world' : v));
    expect(str).toBe('{"x":[{"a":1},{"b":2},{"c":3}],"y":"world","z":"abc"}');
  });

  it('stringify with spaces', () => {
    const obj = {
      x: new Set([{ a: 1 }, { b: 2 }, { c: 3 }]),
      y: new Map([[1, { a: 2 }], [2, { b: 4 }]]),
    };
    const str = Json.stringify(obj, null, 2);
    expect(str).toBe(`{
  "x": [
    {
      "a": 1
    },
    {
      "b": 2
    },
    {
      "c": 3
    }
  ],
  "y": [
    [
      1,
      {
        "a": 2
      }
    ],
    [
      2,
      {
        "b": 4
      }
    ]
  ]
}`);
  });

  it('stringify int', () => {
    expect(Json.stringify(123)).toBe('123');
  });

  it('stringify bigint', () => {
    expect(Json.stringify(123n)).toBe('123');
  });

  it('stringify string representing int', () => {
    expect(Json.stringify('123')).toBe('"123"');
  });

  it('stringify LosslessNumber representing int', () => {
    const v = new LosslessNumber('123456789012134567890');
    expect(Json.stringify(v)).toBe('123456789012134567890');
  })

  it('parse int', () => {
    expect(Json.parse('123')).toBe(123);
  });

  it('parse bigint', () => {
    expect(Json.parse('123456789012134567890')).toBe(123456789012134567890n);
  });

  it('parse string representing int', () => {
    expect(Json.parse('"123"')).toBe('123');
  });

  it('stringify null', () => {
    expect(Json.stringify(null)).toBe('null');
  });

  it('stringify undefined', () => {
    expect(Json.stringify(undefined)).toBe(undefined);
  });

  it('parse null', () => {
    expect(Json.parse('null')).toBe(null);
  });

  it('parse timestamp string', () => {
    expect(Json.parse('"2025-01-10T07:40:08.140Z"')).toBe('2025-01-10T07:40:08.140Z');
  });

  // Test error handling for parse method
  it('should throw TypeError for non-string input to parse', () => {
    expect(() => Json.parse(123)).toThrow(TypeError);
    expect(() => Json.parse(123)).toThrow('JSON.parse requires a string argument');
    expect(() => Json.parse(null)).toThrow(TypeError);
    expect(() => Json.parse(undefined)).toThrow(TypeError);
    expect(() => Json.parse({})).toThrow(TypeError);
  });

  it('should throw TypeError for invalid reviver in parse', () => {
    expect(() => Json.parse('{"a":1}', 'not a function')).toThrow(TypeError);
    expect(() => Json.parse('{"a":1}', 123)).toThrow(TypeError);
    expect(() => Json.parse('{"a":1}', {})).toThrow(TypeError);
  });

  it('should throw SyntaxError for invalid JSON in parse', () => {
    expect(() => Json.parse('invalid json')).toThrow(SyntaxError);
    expect(() => Json.parse('{"a":}')).toThrow(SyntaxError);
    expect(() => Json.parse('{a:1}')).toThrow(SyntaxError);
  });

  // Test error handling for stringify method
  it('should throw TypeError for invalid replacer in stringify', () => {
    expect(() => Json.stringify({a: 1}, 'not a function')).toThrow(TypeError);
    expect(() => Json.stringify({a: 1}, 123)).toThrow(TypeError);
    expect(() => Json.stringify({a: 1}, {})).toThrow(TypeError);
  });

  it('should throw TypeError for invalid space in stringify', () => {
    expect(() => Json.stringify({a: 1}, null, {})).toThrow(TypeError);
    expect(() => Json.stringify({a: 1}, null, true)).toThrow(TypeError);
    expect(() => Json.stringify({a: 1}, null, [])).toThrow(TypeError);
  });

  it('should handle circular references in stringify', () => {
    const obj = { a: 1 };
    obj.self = obj;
    expect(() => Json.stringify(obj)).toThrow(TypeError);
    expect(() => Json.stringify(obj)).toThrow('Converting circular structure to JSON');
  });

  it('should allow null and undefined for optional parameters', () => {
    expect(() => Json.parse('{"a":1}', null)).not.toThrow();
    expect(() => Json.parse('{"a":1}', undefined)).not.toThrow();
    expect(() => Json.stringify({a: 1}, null)).not.toThrow();
    expect(() => Json.stringify({a: 1}, undefined)).not.toThrow();
    expect(() => Json.stringify({a: 1}, null, null)).not.toThrow();
    expect(() => Json.stringify({a: 1}, null, undefined)).not.toThrow();
  });

  it('should re-throw non-SyntaxError errors from parse', () => {
    // 使用 jest.spyOn 来模拟 parseJson 函数
    const jsonCustomNumbers = require('json-custom-numbers');
    const mockError = new TypeError('Mock error for testing');
    const parseJsonSpy = jest.spyOn(jsonCustomNumbers, 'parse').mockImplementation(() => {
      throw mockError;
    });

    expect(() => Json.parse('{"a":1}')).toThrow(mockError);

    // 恢复原始函数
    parseJsonSpy.mockRestore();
  });

  it('should re-throw non-circular errors from stringify', () => {
    // 使用 jest.spyOn 来模拟 stringifyJson 函数
    const jsonCustomNumbers = require('json-custom-numbers');
    const mockError = new Error('Some other stringify error');
    const stringifyJsonSpy = jest.spyOn(jsonCustomNumbers, 'stringify').mockImplementation(() => {
      throw mockError;
    });

    expect(() => Json.stringify({a: 1})).toThrow(mockError);

    // 恢复原始函数
    stringifyJsonSpy.mockRestore();
  });
});
