/**
 * 类型判断工具函数
 *
 * ⚠️ 注意：大部分基础类型判断函数已被 es-toolkit 提供，推荐使用 es-toolkit
 *
 * es-toolkit 提供的函数（可直接替换）：
 * - isString, isNumber, isBoolean, isFunction → 'es-toolkit'
 * - isDate, isRegExp, isMap, isPromise, isPrimitive → 'es-toolkit'
 * - isPlainObject, isNil, isNotNil → 'es-toolkit'
 * - isObject, isArray, isElement, isInteger, isUndefined, isEmpty → 'es-toolkit/compat'
 *
 * 本文件仅保留项目特定的工具函数
 */

// ============= 重新导出 es-toolkit 函数（向后兼容）=============
export {
  isString,
  isBoolean,
  isFunction,
  isDate,
  isRegExp,
  isMap,
  isSet,
  isPromise,
  isPrimitive,
  isPlainObject,
  isNil as isNullOrUnDef,
  isNotNil as isNonNullable,
  isNull,
  isUndefined as isUnDef
} from 'es-toolkit'

export {
  isObject,
  isArray,
  isElement,
  isInteger,
  isEmpty,
  isNumber as isNumberStrict
} from 'es-toolkit/compat'

// ============= 类型定义 =============
type AnyObject = Record<string | number | symbol, unknown>

// ============= 缓存常量 =============
const toString = Object.prototype.toString

// 缓存正则表达式，避免重复创建
const URL_REGEX =
  /(((^https?:(?:\/\/)?)(?:[-:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%#\/.\w-_]*)?\??(?:[-\+=&%@.\w_]*)#?(?:[\w]*))?)$/
const IMAGE_REGEX = /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/i
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^1[3-9]\d{9}$/
const ID_CARD_REGEX = /^\d{15}$|^\d{18}$|^\d{17}[0-9Xx]$/

// ============= 项目特定工具函数 =============

/**
 * 通用类型检查（使用 Object.prototype.toString）
 */
export const is = (val: unknown, type: string): boolean => {
  return toString.call(val) === `[object ${type}]`
}

/**
 * 判断是否已定义（常用简写）
 */
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined'
}

/**
 * 兼容 isNumber（过滤 NaN）
 * @deprecated 推荐使用 es-toolkit/compat 的 isNumber
 */
export const isNumber = (val: unknown): val is number => {
  return typeof val === 'number' && !Number.isNaN(val)
}

/**
 * 判断是否为空值（包括空字符串）
 */
export const isEmptyVal = (val: unknown): val is '' | null | undefined => {
  return val === '' || val == null
}

/**
 * 判断是否为 Record 对象（排除数组、日期等）
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => {
  if (val == null || typeof val !== 'object') return false
  if (Array.isArray(val)) return false
  const proto = Object.getPrototypeOf(val)
  return proto === null || proto === Object.prototype
}

/**
 * 判断是否为空对象
 */
export const isEmptyObject = (val: unknown): val is Record<string, never> => {
  return isRecord(val) && Object.keys(val).length === 0
}

/**
 * 判断是否为非空数组
 */
export const isNonEmptyArray = <T>(val: unknown): val is [T, ...T[]] => {
  return Array.isArray(val) && val.length > 0
}

/**
 * 判断数组的所有元素是否都满足条件
 */
export const isArrayOf = <T>(val: unknown, predicate: (item: unknown) => item is T): val is T[] => {
  return Array.isArray(val) && val.every(predicate)
}

/**
 * 判断对象是否有指定属性
 */
export const hasProperty = <T extends AnyObject, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> => {
  return obj != null && typeof obj === 'object' && key in obj
}

/**
 * 判断是否为正数
 */
export const isPositiveNumber = (val: unknown): val is number => {
  return typeof val === 'number' && !Number.isNaN(val) && val > 0
}

/**
 * 判断是否为负数
 */
export const isNegativeNumber = (val: unknown): val is number => {
  return typeof val === 'number' && !Number.isNaN(val) && val < 0
}

// ============= DOM/环境相关 =============

/**
 * 判断是否为 Window 对象
 */
export const isWindow = (val: unknown): val is Window => {
  return typeof window !== 'undefined' && val === window
}

/**
 * 判断是否在服务端环境
 */
export const isServer = typeof window === 'undefined'

/**
 * 判断是否在客户端环境
 */
export const isClient = !isServer

/**
 * 判断是否支持暗黑模式
 */
export const isDark = (): boolean => {
  return isClient && window.matchMedia('(prefers-color-scheme: dark)').matches
}

// ============= URL 和路径判断 =============

/**
 * 判断是否为 URL
 */
export const isUrl = (path: string): boolean => {
  return typeof path === 'string' && URL_REGEX.test(path)
}

/**
 * 判断是否为图片路径
 */
export const isImgPath = (path: string): boolean => {
  return typeof path === 'string' && IMAGE_REGEX.test(path)
}

// ============= 业务验证函数 =============

/**
 * 判断是否为邮箱
 */
export const isEmail = (val: string): boolean => {
  return typeof val === 'string' && EMAIL_REGEX.test(val)
}

/**
 * 判断是否为手机号（中国大陆）
 */
export const isPhoneNumber = (val: string): boolean => {
  return typeof val === 'string' && PHONE_REGEX.test(val)
}

/**
 * 判断是否为身份证号（中国大陆）
 */
export const isIdCard = (val: string): boolean => {
  return typeof val === 'string' && ID_CARD_REGEX.test(val)
}
