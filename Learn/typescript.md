### TS 自带类型源码解析

- 【对类型的操作】 最基础的 合并和排除 操作(集合操作)

```typescript
type AA = "string" | "name"
type BB = "name"
type AExcludeB = Exclude<AA, BB> // "string" <- 挑出不含 BB 有的部分
type AExtractB = Extract<AA, BB> // "name" <- 挑出只含 BB 有的部分

type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
```

- 【对类型的操作】 加减限制 （可选/必填，只读）
- 必填：```Required```，只读：```Readonly```，可选：```Partial```
- in 相当于遍历操作，例如 A in B 即，A 是每一个 B
- keyof 获取对象所有属性，例如 keyof A

```typescript
type B = "name" | "age"
// A in B => A = "name"; A = "age"
type TypeA = {
  name: string
  age: number
}
// typeof TypeA => "name" | "age"

// 合并上面操作
// A in typeof TypeA => A in (typeof TypeA = "name" | "age")

type TypeName<T> = {
    __part1__ [P in keyof T] __part2__: T[P];
};
// __part1__ : readonly 添加只读
// __part2__ : +/- ? 添加/去除 可选
```

- 【对类型属性的操作】 属性挑选

```typescript
// Pick 从 属性中挑选部分属性
// 简化版本，从 T 中挑选名字为 K 的属性
// 例如
type T = {
  name: string,
  age: number,
}
type K = "string"
type PickSimple<T, K> = {
  [P in K]: T[P]
}

// 但是这里要保证 K 是 T 属性之一
// 所以 K in keyof T
// 这里 K extends keyof T 等效 Extract<keyof T, K>
// 官方源码如下
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
// 可以等同
type Pick<T, K> = {
  [P in Extract<keyof T, K>]: T[P]
}

// Omit 和 Pick 相反，想排除掉指定的 K
// 所以代码和 Pick 等效，可以参考 Pick 的最后一种实现
type Omit<T, K> = {
  [P in Exclude<keyof T, K>]: T[P]
}
// 其实 操作就是 keyof T - K => Exclude<keyof T, K>
// 也就是 Pick<T, Exclude<keyof T, K>>
// 也就是 从 T 中挑选不是 K 的字段，显而易见源码就是这样写的
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

- 【对函数的操作】

- 这里先给出函数写法的模板

```typescript
// type TypeName<T extends A> = T extends A' ? X1 : X2;
// 这里 A 一般是 (...args:any) => any
// 表示一个一般函数
// A' 是 (arg1: infer A1,arg2: infer A2,<...> ...args:infer An) => infer R
// 这里如果 <...> 可以继续定义第三、四、五...个参数的推断类型，看实际需要

// 这里如果需要获取返回值的类型，很简单，直接写
// type ReturnType<T extends A> = T extends A' ? R : any
// A = (...args:any) => any
// A' = (...args:any) => infer R
// 完整写法为
type Fun = (...args:any) => any
type Funr<T> = T extends (...args:any) => infer R ? R : any
type ReturnType<T extends Fun> = Funr<T>
// 同样的写法我们可以获取参数的类型
type Funp<T> = T extends (...args: infer A) => any ? A : any
type Parameters<T extends Fun> = Funp<T>
// 可以看到，左边只要 T 是一个函数，右边只需要在需要的地方进行 infer 即可
// 例如获取的类型，相当于函数的第一个属性
// 这里需要获取到第一个参数，所以对第一个参数进行 infer
type Funt<T> = T extends (this: infer U, ...args: never) => any ? U : unkonw
type ThisParameterType<T extends Fun> = Funt<T>
```

### type 和 interface 异同

- type 可以通过 ```&``` 继承 interface
- interface 可以通过 ```externs``` 继承 type

```typescript
type T = {
    Age: number
}
// 不能自动合并属性，只能通过 & 合并
// type T = {
//     Name: string
// }
type TT = T & {
    Name: string
}


interface I {
    Age: number
}
// 自动合并属性
interface I {
    Name: string
}
```

- interface 不能映射属性

```typescript
// 正确
type PointCopy1 = {
  [Key in keyof Point]: Point[Key];
};

// 报错
interface PointCopy2 {
  [Key in keyof Point]: Point[Key];
};
```

- type 不能使用 this 关键字

```typescript
// 正确
interface Foo {
  add(num: number): this;
}

// 报错
type Foo = {
  add(num: number): this;
};
```


## 类型断言

```typescript
const adadf = new PersonI() as PersonI
const adadf1 = <PersonI>new PersonI()
```

## 利用装饰器实现单例

```typescript
function Singleton(target, context) {
    let instance = null;
    function getInstance(...args) {
        if (instance) {
            return instance;
        } else {
            instance = new target(...args);
            return instance;
        }
    }
    return getInstance;
}

// @ts-ignore
@Singleton
class TestParam{
    name !: string
    age: number

    constructor(age :number = 10) {
        this.age = age;
    }

}

let tp = new TestParam(100)
let tp2 = new TestParam(200)
console.log(`tp.age = ${tp.age}\ttp2.age = ${tp2.age}`)
console.log(tp === tp2)
// tp.age = 100    tp2.age = 100
// true
```

## new.target 等价 instanceof

```typescript
const N = (function() {
    let fn = function() {
        // if (new.target !== undefined) {
        if (this && this instanceof fn) {
            console.log(`call by new`);
        } else {
            console.log(`call by function`);
        }
    }
    return fn;
})();
new N();
// call by new
N();
// call by function
```

装饰器对象如下

```typescript
const contextKind = "class" | "method" | "getter" | "setter" | "field" | "accessor";
type Decorator = (
  value: DecoratedValue,
  context: {
    kind: string;
    name: string | symbol;
    addInitializer?(initializer: () => void): void;
    static?: boolean;
    private?: boolean;
    access: {
      get?(): unknown;
      set?(value: unknown): void;
    };
  }
) => void | ReplacementValue;
```