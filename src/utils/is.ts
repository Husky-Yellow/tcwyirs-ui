// copy to vben-admin

// 定义常用类型
type Primitive = string | number | boolean | null | undefined | symbol | bigint
type AnyObject = Record<string | number | symbol, unknown>
type AnyArray = readonly unknown[]

const toString = Object.prototype.toString

export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`
}

export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined'
}

export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val)
}

export const isObject = (val: unknown): val is Record<string | number | symbol, unknown> => {
  return val !== null && is(val, 'Object')
}

export const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined || typeof val === 'undefined') {
    return true
  }
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

export const isDate = (val: unknown): val is Date => {
  return is(val, 'Date')
}

export const isNull = (val: unknown): val is null => {
  return val === null
}

export const isNullAndUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) && isNull(val)
}

export const isNullOrUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) || isNull(val)
}

export const isNumber = (val: unknown): val is number => {
  return is(val, 'Number')
}

export const isPromise = <T = unknown>(val: unknown): val is Promise<T> => {
  return (
    is(val, 'Promise') &&
    isObject(val) &&
    'then' in val &&
    isFunction(val.then) &&
    'catch' in val &&
    isFunction(val.catch)
  )
}

export const isString = (val: unknown): val is string => {
  return is(val, 'String')
}

export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}

export const isBoolean = (val: unknown): val is boolean => {
  return is(val, 'Boolean')
}

export const isRegExp = (val: unknown): val is RegExp => {
  return is(val, 'RegExp')
}

export const isArray = <T = unknown>(val: unknown): val is T[] => {
  return Array.isArray(val)
}

export const isWindow = (val: unknown): val is Window => {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export const isElement = (val: unknown): val is Element => {
  return isObject(val) && 'tagName' in val && typeof val.tagName === 'string'
}

export const isMap = <K = unknown, V = unknown>(val: unknown): val is Map<K, V> => {
  return is(val, 'Map')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export const isUrl = (path: string): boolean => {
  // fix:修复hash路由无法跳转的问题
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%#\/.\w-_]*)?\??(?:[-\+=&%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

export const isDark = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 是否是图片链接
export const isImgPath = (path: string): boolean => {
  return /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/gi.test(path)
}

export const isEmptyVal = (val: unknown): val is '' | null | undefined => {
  return val === '' || val === null || val === undefined
}

// 新增的类型守卫函数
export const isPrimitive = (val: unknown): val is Primitive => {
  return (
    typeof val === 'string' ||
    typeof val === 'number' ||
    typeof val === 'boolean' ||
    typeof val === 'symbol' ||
    typeof val === 'bigint' ||
    val === null ||
    val === undefined
  )
}

export const isNonNullable = <T>(val: T): val is NonNullable<T> => {
  return val !== null && val !== undefined
}

export const isArrayOf = <T>(val: unknown, predicate: (item: unknown) => item is T): val is T[] => {
  return isArray(val) && val.every(predicate)
}

export const hasProperty = <T extends AnyObject, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> => {
  return isObject(obj) && key in obj
}

export const isRecord = (val: unknown): val is Record<string, unknown> => {
  return isObject(val) && !isArray(val) && !isDate(val) && !isRegExp(val)
}

export const isPlainObject = (val: unknown): val is Record<string, unknown> => {
  if (!isObject(val)) return false

  const proto = Object.getPrototypeOf(val)
  return proto === null || proto === Object.prototype
}

export const isEmptyObject = (val: unknown): val is Record<string, never> => {
  return isObject(val) && Object.keys(val).length === 0
}

export const isNonEmptyArray = <T>(val: unknown): val is [T, ...T[]] => {
  return isArray(val) && val.length > 0
}

export const isInteger = (val: unknown): val is number => {
  return isNumber(val) && Number.isInteger(val)
}

export const isPositiveNumber = (val: unknown): val is number => {
  return isNumber(val) && val > 0
}

export const isNegativeNumber = (val: unknown): val is number => {
  return isNumber(val) && val < 0
}

export const isEmail = (val: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return isString(val) && emailRegex.test(val)
}

export const isPhoneNumber = (val: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return isString(val) && phoneRegex.test(val)
}

export const isIdCard = (val: string): boolean => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return isString(val) && idCardRegex.test(val)
}
