import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  is,
  isDef,
  isUnDef,
  isObject,
  isEmpty,
  isDate,
  isNull,
  isNullAndUnDef,
  isNullOrUnDef,
  isNumber,
  isPromise,
  isString,
  isFunction,
  isBoolean,
  isRegExp,
  isArray,
  isWindow,
  isElement,
  isMap,
  isServer,
  isClient,
  isUrl,
  isDark,
  isImgPath,
  isEmptyVal,
  isPrimitive,
  isNonNullable,
  isArrayOf,
  hasProperty,
  isRecord,
  isPlainObject,
  isEmptyObject,
  isNonEmptyArray,
  isInteger,
  isPositiveNumber,
  isNegativeNumber,
  isEmail,
  isPhoneNumber,
  isIdCard
} from '@/utils/is'

describe('utils/is', () => {
  beforeEach(() => {
    // Mock window for server-side tests
    Object.defineProperty(global, 'window', {
      value: {
        matchMedia: vi.fn(() => ({
          matches: false
        }))
      },
      writable: true
    })
  })

  describe('is', () => {
    it('should check object type correctly', () => {
      expect(is('string', 'String')).toBe(true)
      expect(is(123, 'Number')).toBe(true)
      expect(is(true, 'Boolean')).toBe(true)
      expect(is([], 'Array')).toBe(true)
      expect(is({}, 'Object')).toBe(true)
      expect(is(null, 'Null')).toBe(true)
      expect(is(undefined, 'Undefined')).toBe(true)
    })

    it('should return false for incorrect types', () => {
      expect(is('string', 'Number')).toBe(false)
      expect(is(123, 'String')).toBe(false)
    })
  })

  describe('isDef', () => {
    it('should return true for defined values', () => {
      expect(isDef('string')).toBe(true)
      expect(isDef(0)).toBe(true)
      expect(isDef(false)).toBe(true)
      expect(isDef(null)).toBe(true)
    })

    it('should return false for undefined values', () => {
      expect(isDef(undefined)).toBe(false)
    })
  })

  describe('isUnDef', () => {
    it('should return true for undefined values', () => {
      expect(isUnDef(undefined)).toBe(true)
    })

    it('should return false for defined values', () => {
      expect(isUnDef('string')).toBe(false)
      expect(isUnDef(0)).toBe(false)
      expect(isUnDef(false)).toBe(false)
      expect(isUnDef(null)).toBe(false)
    })
  })

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ key: 'value' })).toBe(true)
      expect(isObject(new Date())).toBe(true)
    })

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
      expect(isObject([])).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty(null)).toBe(true)
      expect(isEmpty(undefined)).toBe(true)
      expect(isEmpty('')).toBe(true)
      expect(isEmpty([])).toBe(true)
      expect(isEmpty({})).toBe(true)
      expect(isEmpty(new Map())).toBe(true)
      expect(isEmpty(new Set())).toBe(true)
    })

    it('should return false for non-empty values', () => {
      expect(isEmpty('string')).toBe(false)
      expect(isEmpty([1, 2, 3])).toBe(false)
      expect(isEmpty({ key: 'value' })).toBe(false)
      expect(isEmpty(new Map([['key', 'value']]))).toBe(false)
      expect(isEmpty(new Set([1, 2, 3]))).toBe(false)
    })
  })

  describe('isDate', () => {
    it('should return true for Date objects', () => {
      expect(isDate(new Date())).toBe(true)
      expect(isDate(new Date('2023-01-01'))).toBe(true)
    })

    it('should return false for non-Date values', () => {
      expect(isDate('2023-01-01')).toBe(false)
      expect(isDate(123)).toBe(false)
      expect(isDate({})).toBe(false)
    })
  })

  describe('isNull', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true)
    })

    it('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false)
      expect(isNull('string')).toBe(false)
      expect(isNull(0)).toBe(false)
    })
  })

  describe('isNullAndUnDef', () => {
    it('should return true for null and undefined', () => {
      expect(isNullAndUnDef(null)).toBe(true)
      expect(isNullAndUnDef(undefined)).toBe(true)
    })

    it('should return false for other values', () => {
      expect(isNullAndUnDef('string')).toBe(false)
      expect(isNullAndUnDef(0)).toBe(false)
    })
  })

  describe('isNullOrUnDef', () => {
    it('should return true for null or undefined', () => {
      expect(isNullOrUnDef(null)).toBe(true)
      expect(isNullOrUnDef(undefined)).toBe(true)
    })

    it('should return false for other values', () => {
      expect(isNullOrUnDef('string')).toBe(false)
      expect(isNullOrUnDef(0)).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(123)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(-123)).toBe(true)
      expect(isNumber(123.45)).toBe(true)
    })

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber({})).toBe(false)
    })
  })

  describe('isPromise', () => {
    it('should return true for Promise objects', () => {
      expect(isPromise(Promise.resolve())).toBe(true)
      expect(isPromise(new Promise(() => {}))).toBe(true)
    })

    it('should return false for non-Promise values', () => {
      expect(isPromise({})).toBe(false)
      expect(isPromise('string')).toBe(false)
      expect(isPromise({ then: 'not a function' })).toBe(false)
    })
  })

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('string')).toBe(true)
      expect(isString('')).toBe(true)
    })

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false)
      expect(isString({})).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true)
      expect(isFunction(function() {})).toBe(true)
      expect(isFunction(Array.isArray)).toBe(true)
    })

    it('should return false for non-functions', () => {
      expect(isFunction('string')).toBe(false)
      expect(isFunction({})).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true)
      expect(isBoolean(false)).toBe(true)
    })

    it('should return false for non-booleans', () => {
      expect(isBoolean('string')).toBe(false)
      expect(isBoolean(0)).toBe(false)
    })
  })

  describe('isRegExp', () => {
    it('should return true for RegExp objects', () => {
      expect(isRegExp(/test/)).toBe(true)
      expect(isRegExp(new RegExp('test'))).toBe(true)
    })

    it('should return false for non-RegExp values', () => {
      expect(isRegExp('string')).toBe(false)
      expect(isRegExp({})).toBe(false)
    })
  })

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true)
      expect(isArray([1, 2, 3])).toBe(true)
    })

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false)
      expect(isArray('string')).toBe(false)
    })
  })

  describe('isWindow', () => {
    it('should return true for window object', () => {
      expect(isWindow(window)).toBe(true)
    })

    it('should return false for non-window objects', () => {
      expect(isWindow({})).toBe(false)
      expect(isWindow('string')).toBe(false)
    })
  })

  describe('isElement', () => {
    it('should return true for DOM elements', () => {
      const element = document.createElement('div')
      expect(isElement(element)).toBe(true)
    })

    it('should return false for non-elements', () => {
      expect(isElement({})).toBe(false)
      expect(isElement('string')).toBe(false)
    })
  })

  describe('isMap', () => {
    it('should return true for Map objects', () => {
      expect(isMap(new Map())).toBe(true)
      expect(isMap(new Map([['key', 'value']]))).toBe(true)
    })

    it('should return false for non-Map values', () => {
      expect(isMap({})).toBe(false)
      expect(isMap('string')).toBe(false)
    })
  })

  describe('isServer', () => {
    it('should return true when window is undefined', () => {
      // This test runs in Node.js environment where window is undefined
      expect(isServer).toBe(true)
    })
  })

  describe('isClient', () => {
    it('should return false when window is undefined', () => {
      // This test runs in Node.js environment where window is undefined
      expect(isClient).toBe(false)
    })
  })

  describe('isUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isUrl('https://example.com')).toBe(true)
      expect(isUrl('http://example.com')).toBe(true)
      expect(isUrl('https://example.com/path')).toBe(true)
      expect(isUrl('https://example.com/path?query=value')).toBe(true)
      expect(isUrl('https://example.com/path#hash')).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      expect(isUrl('not-a-url')).toBe(false)
      expect(isUrl('')).toBe(false)
      expect(isUrl('ftp://example.com')).toBe(false)
    })
  })

  describe('isDark', () => {
    it('should return dark mode preference', () => {
      // Mock matchMedia to return dark mode
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn(() => ({
          matches: true
        })),
        writable: true
      })

      expect(isDark()).toBe(true)
    })
  })

  describe('isImgPath', () => {
    it('should return true for image URLs', () => {
      expect(isImgPath('https://example.com/image.png')).toBe(true)
      expect(isImgPath('https://example.com/image.jpg')).toBe(true)
      expect(isImgPath('https://example.com/image.jpeg')).toBe(true)
      expect(isImgPath('https://example.com/image.gif')).toBe(true)
      expect(isImgPath('https://example.com/image.svg')).toBe(true)
      expect(isImgPath('data:image/png;base64,abc123')).toBe(true)
    })

    it('should return false for non-image URLs', () => {
      expect(isImgPath('https://example.com/document.pdf')).toBe(false)
      expect(isImgPath('https://example.com/page.html')).toBe(false)
      expect(isImgPath('not-a-url')).toBe(false)
    })
  })

  describe('isEmptyVal', () => {
    it('should return true for empty values', () => {
      expect(isEmptyVal('')).toBe(true)
      expect(isEmptyVal(null)).toBe(true)
      expect(isEmptyVal(undefined)).toBe(true)
    })

    it('should return false for non-empty values', () => {
      expect(isEmptyVal('string')).toBe(false)
      expect(isEmptyVal(0)).toBe(false)
      expect(isEmptyVal(false)).toBe(false)
    })
  })

  describe('isPrimitive', () => {
    it('should return true for primitive values', () => {
      expect(isPrimitive('string')).toBe(true)
      expect(isPrimitive(123)).toBe(true)
      expect(isPrimitive(true)).toBe(true)
      expect(isPrimitive(Symbol('test'))).toBe(true)
      expect(isPrimitive(BigInt(123))).toBe(true)
      expect(isPrimitive(null)).toBe(true)
      expect(isPrimitive(undefined)).toBe(true)
    })

    it('should return false for non-primitive values', () => {
      expect(isPrimitive({})).toBe(false)
      expect(isPrimitive([])).toBe(false)
      expect(isPrimitive(() => {})).toBe(false)
    })
  })

  describe('isNonNullable', () => {
    it('should return true for non-nullable values', () => {
      expect(isNonNullable('string')).toBe(true)
      expect(isNonNullable(123)).toBe(true)
      expect(isNonNullable({})).toBe(true)
    })

    it('should return false for nullable values', () => {
      expect(isNonNullable(null)).toBe(false)
      expect(isNonNullable(undefined)).toBe(false)
    })
  })

  describe('isArrayOf', () => {
    it('should return true for array of matching type', () => {
      expect(isArrayOf([1, 2, 3], (item): item is number => typeof item === 'number')).toBe(true)
      expect(isArrayOf(['a', 'b', 'c'], (item): item is string => typeof item === 'string')).toBe(true)
    })

    it('should return false for non-array or mixed types', () => {
      expect(isArrayOf({}, (item): item is number => typeof item === 'number')).toBe(false)
      expect(isArrayOf([1, '2', 3], (item): item is number => typeof item === 'number')).toBe(false)
    })
  })

  describe('hasProperty', () => {
    it('should return true if object has property', () => {
      expect(hasProperty({ key: 'value' }, 'key')).toBe(true)
      expect(hasProperty({ a: 1, b: 2 }, 'a')).toBe(true)
    })

    it('should return false if object does not have property', () => {
      expect(hasProperty({ key: 'value' }, 'other')).toBe(false)
      expect(hasProperty({}, 'key')).toBe(false)
    })
  })

  describe('isRecord', () => {
    it('should return true for record objects', () => {
      expect(isRecord({})).toBe(true)
      expect(isRecord({ key: 'value' })).toBe(true)
    })

    it('should return false for non-record values', () => {
      expect(isRecord([])).toBe(false)
      expect(isRecord(new Date())).toBe(false)
      expect(isRecord(/test/)).toBe(false)
      expect(isRecord('string')).toBe(false)
    })
  })

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true)
      expect(isPlainObject({ key: 'value' })).toBe(true)
      expect(isPlainObject(Object.create(null))).toBe(true)
    })

    it('should return false for non-plain objects', () => {
      expect(isPlainObject([])).toBe(false)
      expect(isPlainObject(new Date())).toBe(false)
      expect(isPlainObject(null)).toBe(false)
    })
  })

  describe('isEmptyObject', () => {
    it('should return true for empty objects', () => {
      expect(isEmptyObject({})).toBe(true)
    })

    it('should return false for non-empty objects', () => {
      expect(isEmptyObject({ key: 'value' })).toBe(false)
      expect(isEmptyObject([])).toBe(false)
    })
  })

  describe('isNonEmptyArray', () => {
    it('should return true for non-empty arrays', () => {
      expect(isNonEmptyArray([1, 2, 3])).toBe(true)
      expect(isNonEmptyArray(['a'])).toBe(true)
    })

    it('should return false for empty arrays or non-arrays', () => {
      expect(isNonEmptyArray([])).toBe(false)
      expect(isNonEmptyArray({})).toBe(false)
    })
  })

  describe('isInteger', () => {
    it('should return true for integers', () => {
      expect(isInteger(123)).toBe(true)
      expect(isInteger(0)).toBe(true)
      expect(isInteger(-123)).toBe(true)
    })

    it('should return false for non-integers', () => {
      expect(isInteger(123.45)).toBe(false)
      expect(isInteger('123')).toBe(false)
      expect(isInteger(NaN)).toBe(false)
    })
  })

  describe('isPositiveNumber', () => {
    it('should return true for positive numbers', () => {
      expect(isPositiveNumber(123)).toBe(true)
      expect(isPositiveNumber(0.1)).toBe(true)
    })

    it('should return false for non-positive numbers', () => {
      expect(isPositiveNumber(0)).toBe(false)
      expect(isPositiveNumber(-123)).toBe(false)
      expect(isPositiveNumber('123')).toBe(false)
    })
  })

  describe('isNegativeNumber', () => {
    it('should return true for negative numbers', () => {
      expect(isNegativeNumber(-123)).toBe(true)
      expect(isNegativeNumber(-0.1)).toBe(true)
    })

    it('should return false for non-negative numbers', () => {
      expect(isNegativeNumber(0)).toBe(false)
      expect(isNegativeNumber(123)).toBe(false)
      expect(isNegativeNumber('123')).toBe(false)
    })
  })

  describe('isEmail', () => {
    it('should return true for valid emails', () => {
      expect(isEmail('test@example.com')).toBe(true)
      expect(isEmail('user.name@domain.co.uk')).toBe(true)
      expect(isEmail('user+tag@example.org')).toBe(true)
    })

    it('should return false for invalid emails', () => {
      expect(isEmail('invalid-email')).toBe(false)
      expect(isEmail('@example.com')).toBe(false)
      expect(isEmail('test@')).toBe(false)
      expect(isEmail('')).toBe(false)
    })
  })

  describe('isPhoneNumber', () => {
    it('should return true for valid Chinese phone numbers', () => {
      expect(isPhoneNumber('13812345678')).toBe(true)
      expect(isPhoneNumber('15912345678')).toBe(true)
      expect(isPhoneNumber('18812345678')).toBe(true)
    })

    it('should return false for invalid phone numbers', () => {
      expect(isPhoneNumber('1234567890')).toBe(false)
      expect(isPhoneNumber('1381234567')).toBe(false)
      expect(isPhoneNumber('138123456789')).toBe(false)
      expect(isPhoneNumber('')).toBe(false)
    })
  })

  describe('isIdCard', () => {
    it('should return true for valid Chinese ID cards', () => {
      expect(isIdCard('123456789012345')).toBe(true) // 15 digits
      expect(isIdCard('123456789012345678')).toBe(true) // 18 digits
      expect(isIdCard('12345678901234567X')).toBe(true) // 18 digits with X
    })

    it('should return false for invalid ID cards', () => {
      expect(isIdCard('12345678901234')).toBe(false) // 14 digits
      expect(isIdCard('1234567890123456789')).toBe(false) // 19 digits
      expect(isIdCard('')).toBe(false)
    })
  })
})
