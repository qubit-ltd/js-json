# 增强的 JSON 解析器，支持大整数和集合

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/json.svg)](https://npmjs.com/package/@qubit-ltd/json)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![English Document](https://img.shields.io/badge/Document-English-blue.svg)](README.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/qubit-ltd/js-json/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/qubit-ltd/js-json/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/qubit-ltd/js-json/badge.svg?branch=master)](https://coveralls.io/github/qubit-ltd/js-json?branch=master)

[@qubit-ltd/json] 是一个 JavaScript 库，它扩展了标准 JSON 对象的功能，提供了对超出 JavaScript 
安全范围的大数字的强大支持。该库增强了解析和字符串化能力，使其非常适合处理大型数据集和复杂的数值操作，
同时保持 JSON 的结构。

## 主要功能

- **`BigInt` 支持**：在解析 JSON 字符串时，超出 JavaScript 安全整数范围的数字会自动转换为原生 `BigInt`，
  确保精度不丢失。
- **`LosslessNumber` 处理**：对于无法在 JavaScript 中准确表示的浮点数，该库引入了 `LosslessNumber` 对象。
  这个轻量级对象以字符串形式保存完整的数值精度，允许灵活地转换为数字或 `BigInt` 进行数学运算。
- **精确的字符串化**：在字符串化过程中，`BigInt` 值会作为字符串序列化，不带 "n" 后缀，以保持与标准 JSON 格式的兼容性。
  同样，`LosslessNumber` 对象使用其内部字符串表示进行序列化。
- **集合序列化**：JavaScript 原生的集合类型如 `Set` 和 `Map` 会无缝地序列化为数组，以便更好地与 JSON 结构兼容。

有关为什么 JSON 解析可能会破坏大数字以及该库如何帮助解决该问题的更多详细信息，请参阅
[Why does JSON.parse corrupt large numbers and how to solve this?]。

## 安装

使用 npm 或 yarn 安装该库：
```sh
npm install @qubit-ltd/json
```
或
```sh
yarn add @qubit-ltd/json
```

## 核心功能

### 类似 JSON 的对象

该库提供了一个类似于标准 JSON 对象的对象，但具有增强的功能，用于处理大整数、浮点数以及集合类型如 Set 和 Map。

```javascript
import Json from '@qubit-ltd/json';

// 解析超出安全范围的数字
const str1 = '{"decimal":2.370,"big_int":9123372036854000123,"big_float":2.3e+500}';
const obj1 = Json.parse(str1);
console.log(obj1.decimal);   // 2.37
console.log(obj1.big_int);   // 9123372036854000123n
console.log(obj1.big_float); // LosslessNumber { value: '2.3e+500', isLosslessNumber: true }
console.log(String(obj1.big_float)); // '2.3e+500'

// 序列化超出安全范围的数字
const json1 = Json.stringify(obj1);
console.log(json1); // '{"decimal":2.37,"big_int":9123372036854000123,"big_float":"2.3e+500"}'

// 序列化集合类型
const obj2 = { 
  x: new Set([{ a: 1 }, { b: 2 }, { c: 3 }]),
  y: new Map([[1, { a: 2 }], [2, { b: 4 }]]),
};
const json2 = Json.stringify(obj2);
console.log(json2); // '{"x":[{"a":1},{"b":2},{"c":3}],"y":[[1,{"a":2}],[2,{"b":4}]]}'

// 格式化输出（带缩进）
const json3 = Json.stringify(obj2, null, 2);
console.log(json3);
/* 输出:
{
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
}
*/
```

### LosslessNumber 类

`LosslessNumber` 类用于处理具有完整精度的浮点数，避免截断或舍入问题。

```javascript
import Json from '@qubit-ltd/json';
import { LosslessNumber } from '@qubit-ltd/json';

// 解析高精度数字
const parsed = Json.parse('{"float": 1.234567891234567891234}');
console.log(parsed.float);  // LosslessNumber { value: '1.234567891234567891234' }

// 将 LosslessNumber 转换为标准数字
console.log(parsed.float.valueOf());  // 1.2345678912345679（标准 JS 数字，有精度损失）

// 直接创建 LosslessNumber
const largeNumber = new LosslessNumber('9876543210.123456789012345678901234567890');
console.log(largeNumber.toString());  // '9876543210.123456789012345678901234567890'
console.log(largeNumber.valueOf());   // 9876543210.123457（标准 JS 数字，有精度损失）

// 数学运算
const num1 = new LosslessNumber('1234567890.123456789');
const num2 = 100;
// 对于数学运算，LosslessNumber 会转换为标准数字（可能有精度损失）
console.log(num1 * num2);  // 123456789012.34578
```

### 实用函数

该库提供了一组实用函数，用于处理大数字并确保安全转换。

#### `isBigInt(value)`

检查一个字符串是否表示 `BigInt`（即是否以 "n" 结尾）。

```javascript
import { isBigInt } from '@qubit-ltd/json';

console.log(isBigInt('12345n'));  // true
console.log(isBigInt('12345'));   // false
```

#### `isInteger(value)`

检查一个字符串是否表示整数。

```javascript
import { isInteger } from '@qubit-ltd/json';

console.log(isInteger('12345'));  // true
console.log(isInteger('123.45')); // false
console.log(isInteger('123e5'));  // true（12300000 是整数）
console.log(isInteger('123e-5')); // false（0.00123 不是整数）
```

#### `isNumber(value)`

检查一个字符串是否表示数字。

```javascript
import { isNumber } from '@qubit-ltd/json';

console.log(isNumber('12345'));     // true
console.log(isNumber('-123.45'));   // true
console.log(isNumber('1.23e-11'));  // true
console.log(isNumber('abc'));       // false
console.log(isNumber('123abc'));    // false
console.log(isNumber('0xFF'));      // false（不支持十六进制表示法）
```

#### `isSafeNumber(value, options)`

检查一个字符串是否表示在 JavaScript 安全范围内的数字。

```javascript
import { isSafeNumber } from '@qubit-ltd/json';

console.log(isSafeNumber('12345'));     // true
console.log(isSafeNumber('12345678901234567890')); // false（对于 JavaScript 的数字类型来说太大）
console.log(isSafeNumber('123.45678901234567890')); // false（有效数字太多）

// 使用选项
console.log(isSafeNumber('123.45678901234567890', { 
  approx: true,         // 允许近似表示
  requiredDigits: 16    // 要求至少保留 16 位有效数字精度
})); // true
``` 

#### `getUnsafeReason(value)`

解释为什么由字符串表示的数字不安全，返回以下原因之一：

- `'overflow'`（溢出）：数字太大，超出了 JavaScript 可表示的范围
- `'underflow'`（下溢）：数字太小，低于 JavaScript 可表示的范围
- `'truncate_integer'`（整数截断）：如果转换为 JavaScript 数字，整数部分会被截断
- `'truncate_float'`（浮点数截断）：如果转换为 JavaScript 数字，浮点部分会失去精度
- `'none'`：值是安全的，可以安全地转换为 JavaScript 数字

```javascript
import { getUnsafeReason } from '@qubit-ltd/json';

console.log(getUnsafeReason('12345'));     // 输出: 'none'
console.log(getUnsafeReason('12345678901234567890')); // 输出: 'truncate_integer'
console.log(getUnsafeReason('-12345678901234567890.123'));  //  输出: 'truncate_float'
console.log(getUnsafeReason('-1e+1000'));   // 输出: 'overflow'
console.log(getUnsafeReason('1e-324'));     // 输出: 'underflow'
```

#### `toSafeNumberOrThrow(value, options)`

如果可以安全转换，将字符串转换为数字。如果数字不安全，则抛出错误并解释原因。这对于验证数字输入非常有用。

```javascript
import { toSafeNumberOrThrow } from '@qubit-ltd/json';

try {
  console.log(toSafeNumberOrThrow('-12345678901234567890'));
} catch (e) {
  console.error(e.message);  // 输出: 'Cannot safely convert to number: the value '-12345678901234567890' would truncate integer and become -12345678901234567000'
}

// 安全转换示例
console.log(toSafeNumberOrThrow('9007199254740991'));  // 输出: 9007199254740991

// 使用选项
try {
  console.log(toSafeNumberOrThrow('123.45678901234567890', { 
    approx: false,        // 不允许近似表示
    requiredDigits: 20    // 要求至少保留 20 位有效数字精度
  }));
} catch (e) {
  console.error(e.message);  // 将抛出关于精度损失的错误
}
```

## 高级用法

### 自定义解析选项

您可以使用选项自定义数字的解析方式：

```javascript
import Json from '@qubit-ltd/json';

const json = '{"bigInt": 9007199254740993, "largeFloat": 1.234567890123456789}';

// 使用自定义解析选项
const result = Json.parse(json, {
  useBigInt: true,  // 默认为 true - 将大整数转换为 BigInt
  losslessNumbers: true,  // 默认为 true - 为高精度浮点数使用 LosslessNumber
});

console.log(typeof result.bigInt);  // 'bigint'
console.log(result.bigInt);         // 9007199254740993n
console.log(result.largeFloat);     // LosslessNumber { value: '1.234567890123456789' }

// 禁用自定义数字处理
const standardResult = Json.parse(json, {
  useBigInt: false,
  losslessNumbers: false,
});

console.log(typeof standardResult.bigInt);  // 'number'
console.log(standardResult.bigInt);         // 9007199254740992（精度损失！）
console.log(standardResult.largeFloat);     // 1.2345678901234568（精度损失！）
```

### 自定义字符串化选项

您可以自定义值的字符串化方式：

```javascript
import Json from '@qubit-ltd/json';

const data = {
  bigInt: BigInt('9007199254740993'),
  largeFloat: new LosslessNumber('1.234567890123456789'),
  set: new Set([1, 2, 3]),
  map: new Map([['a', 1], ['b', 2]]),
};

// 默认字符串化（处理 BigInt、LosslessNumber、Set、Map）
console.log(Json.stringify(data));
// '{"bigInt":9007199254740993,"largeFloat":"1.234567890123456789","set":[1,2,3],"map":[["a",1],["b",2]]}'

// 使用自定义选项和缩进
console.log(Json.stringify(data, null, 2));
/* 输出:
{
  "bigInt": 9007199254740993,
  "largeFloat": "1.234567890123456789",
  "set": [
    1,
    2,
    3
  ],
  "map": [
    [
      "a",
      1
    ],
    [
      "b",
      2
    ]
  ]
}
*/
```

## <span id="contributing">贡献</span>

如果您发现任何问题或有改进建议，请随时在 [GitHub 仓库] 上提交 issue 或 pull request。

### 开发设置

1. 克隆仓库：
   ```sh
   git clone https://github.com/qubit-ltd/js-json.git
   cd js-json
   ```

2. 安装依赖：
   ```sh
   yarn install
   ```

3. 运行测试：
   ```sh
   yarn test
   ```

4. 构建库：
   ```sh
   yarn build
   ```

### 发布流程

1. 更新 package.json 中的版本号
2. 运行测试和 lint 检查：
   ```sh
   yarn lint && yarn test
   ```
3. 构建库：
   ```sh
   yarn build:all
   ```
4. 发布到 npm：
   ```sh
   yarn deploy
   ```

## <span id="license">许可证</span>

[@qubit-ltd/json] 根据 Apache 2.0 许可证分发。详情请参阅 [LICENSE](LICENSE) 文件。

## <span id="acknowledgements">致谢</span>

该项目基于并集成了多个开源库的代码，这些库在处理大数字和自定义 JSON 解析方面做出了重要贡献。我们想特别感谢以下项目的作者：

- [json-bigint]：提供对使用 BigInt 解析和字符串化 JSON 的支持，使得可以精确处理大数字。
- [lossless-json]：一个确保在处理浮点数时保持完全精度的库，提供无损的 JSON 数字处理。
- [json-custom-numbers]：允许在 JSON 解析和字符串化过程中自定义数字处理，提供灵活的数值表示。

我们对这些贡献者的工作表示感谢，这些工作对本库功能的实现起到了至关重要的作用。

[@qubit-ltd/json]: https://npmjs.com/package/@qubit-ltd/json
[GitHub 仓库]: https://github.com/qubit-ltd/js-json
[Why does JSON.parse corrupt large numbers and how to solve this?]: https://jsoneditoronline.org/indepth/parse/why-does-json-parse-corrupt-large-numbers/
[json-bigint]: https://github.com/sidorares/json-bigint
[lossless-json]: https://github.com/josdejong/lossless-json
[json-custom-numbers]: https://github.com/jawj/json-custom-numbers
