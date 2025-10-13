import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  withInstall,
  humpToUnderline,
  underlineToHump,
  humpToDash,
  setCssVar,
  findIndex,
  trim,
  formatTime,
  toAnyString,
  generateRandomStr,
  generateAcceptedFileTypes,
  firstUpperCase,
  generateUUID,
  fileSizeFormatter,
  copyValueToTarget,
  getUrlValue,
  getUrlNumberValue,
  buildSortingField,
  getSumValue,
  formatToFraction,
  floatToFixed2,
  convertToInteger,
  yuanToFen,
  fenToYuan,
  calculateRelativeRate,
  erpNumberFormatter,
  erpCountInputFormatter,
  erpCountTableColumnFormatter,
  erpPriceInputFormatter,
  erpPriceTableColumnFormatter,
  erpPriceMultiply,
  erpCalculatePercentage,
  areaReplace,
  jsonParse,
  subString
} from '@/utils/index'

describe('utils/index', () => {
  describe('withInstall', () => {
    it('should install component with name', () => {
      const mockComponent = { name: 'TestComponent' }
      const result = withInstall(mockComponent)

      expect(result).toBe(mockComponent)
      expect(result.install).toBeDefined()
    })

    it('should install component with alias', () => {
      const mockComponent = { name: 'TestComponent' }
      const mockApp = { component: vi.fn(), config: { globalProperties: {} } }

      const result = withInstall(mockComponent, 'testAlias')
      result.install(mockApp)

      expect(mockApp.component).toHaveBeenCalledWith('TestComponent', mockComponent)
      expect(mockApp.config.globalProperties.testAlias).toBe(mockComponent)
    })
  })

  describe('humpToUnderline', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(humpToUnderline('camelCase')).toBe('camel-case')
      expect(humpToUnderline('myVariableName')).toBe('my-variable-name')
      expect(humpToUnderline('XMLHttpRequest')).toBe('-x-m-l-http-request')
    })
  })

  describe('underlineToHump', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(underlineToHump('camel-case')).toBe('camelCase')
      expect(underlineToHump('my-variable-name')).toBe('myVariableName')
      expect(underlineToHump('xml-http-request')).toBe('xmlHttpRequest')
    })

    it('should handle empty string', () => {
      expect(underlineToHump('')).toBe('')
    })
  })

  describe('humpToDash', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(humpToDash('camelCase')).toBe('camel-case')
      expect(humpToDash('myVariableName')).toBe('my-variable-name')
    })
  })

  describe('setCssVar', () => {
    it('should set CSS variable on element', () => {
      const mockElement = { style: { setProperty: vi.fn() } }
      setCssVar('--test-var', 'red', mockElement)

      expect(mockElement.style.setProperty).toHaveBeenCalledWith('--test-var', 'red')
    })

    it('should use document.documentElement as default', () => {
      const mockSetProperty = vi.fn()
      Object.defineProperty(document, 'documentElement', {
        value: { style: { setProperty: mockSetProperty } },
        writable: true
      })

      setCssVar('--test-var', 'blue')
      expect(mockSetProperty).toHaveBeenCalledWith('--test-var', 'blue')
    })
  })

  describe('findIndex', () => {
    it('should find index using native findIndex', () => {
      const array = [1, 2, 3, 4, 5]
      const result = findIndex(array, (item) => item === 3)
      expect(result).toBe(2)
    })

    it('should return -1 if not found', () => {
      const array = [1, 2, 3, 4, 5]
      const result = findIndex(array, (item) => item === 6)
      expect(result).toBe(-1)
    })
  })

  describe('trim', () => {
    it('should trim whitespace from string', () => {
      expect(trim('  hello world  ')).toBe('hello world')
      expect(trim('\t\nhello\t\n')).toBe('hello')
    })
  })

  describe('formatTime', () => {
    it('should format date with custom format', () => {
      const date = new Date('2023-01-01T12:30:45')
      expect(formatTime(date, 'yyyy-MM-dd')).toBe('2023-01-01')
      expect(formatTime(date, 'yyyy-MM-dd HH:mm:ss')).toBe('2023-01-01 12:30:45')
    })

    it('should handle number timestamp', () => {
      const timestamp = 1672575045000
      expect(formatTime(timestamp, 'yyyy-MM-dd')).toBe('2023-01-01')
    })

    it('should handle string date', () => {
      expect(formatTime('2023-01-01', 'yyyy-MM-dd')).toBe('2023-01-01')
    })

    it('should return empty string for falsy input', () => {
      expect(formatTime(null, 'yyyy-MM-dd')).toBe('')
      expect(formatTime(undefined, 'yyyy-MM-dd')).toBe('')
    })
  })

  describe('toAnyString', () => {
    it('should generate random string with UUID format', () => {
      const result = toAnyString()
      expect(result).toMatch(/^[0-9a-f]{5}-[0-9a-f]{5}-4[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{5}$/)
    })
  })

  describe('generateRandomStr', () => {
    it('should generate random string with specified length', () => {
      const result = generateRandomStr(10)
      expect(result).toHaveLength(10)
      expect(typeof result).toBe('string')
    })

    it('should generate different strings', () => {
      const str1 = generateRandomStr(10)
      const str2 = generateRandomStr(10)
      expect(str1).not.toBe(str2)
    })
  })

  describe('generateAcceptedFileTypes', () => {
    it('should generate accept string for supported file types', () => {
      const result = generateAcceptedFileTypes(['PDF', 'DOC', 'DOCX'])
      expect(result).toContain('application/pdf')
      expect(result).toContain('application/msword')
      expect(result).toContain('.pdf')
      expect(result).toContain('.doc')
      expect(result).toContain('.docx')
    })

    it('should handle multiple file types', () => {
      const result = generateAcceptedFileTypes(['TXT', 'CSV', 'XLSX'])
      expect(result).toContain('text/plain')
      expect(result).toContain('text/csv')
      expect(result).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    })
  })

  describe('firstUpperCase', () => {
    it('should capitalize first letter of each word', () => {
      expect(firstUpperCase('hello world')).toBe('Hello World')
      expect(firstUpperCase('test string')).toBe('Test String')
    })
  })

  describe('generateUUID', () => {
    it('should generate UUID using crypto.randomUUID if available', () => {
      const result = generateUUID()
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
  })

  describe('fileSizeFormatter', () => {
    it('should format file size correctly', () => {
      expect(fileSizeFormatter(null, null, 1024)).toBe('1.00 KB')
      expect(fileSizeFormatter(null, null, 1048576)).toBe('1.00 MB')
      expect(fileSizeFormatter(null, null, 1073741824)).toBe('1.00 GB')
    })
  })

  describe('copyValueToTarget', () => {
    it('should copy values from source to target', () => {
      const target = { a: 1, b: 2 }
      const source = { a: 3, b: 4, c: 5 }

      copyValueToTarget(target, source)

      expect(target.a).toBe(3)
      expect(target.b).toBe(4)
      expect(target.c).toBeUndefined()
    })
  })

  describe('getUrlValue', () => {
    beforeEach(() => {
      // Mock location.href
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://example.com?test=value&id=123'
        },
        writable: true
      })
    })

    it('should get URL parameter value', () => {
      expect(getUrlValue('test')).toBe('value')
      expect(getUrlValue('id')).toBe('123')
    })

    it('should return empty string for non-existent parameter', () => {
      expect(getUrlValue('nonexistent')).toBe('')
    })

    it('should work with custom URL', () => {
      const customUrl = 'https://test.com?param=testValue'
      expect(getUrlValue('param', customUrl)).toBe('testValue')
    })
  })

  describe('getUrlNumberValue', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://example.com?num=123&str=abc'
        },
        writable: true
      })
    })

    it('should get URL parameter as number', () => {
      expect(getUrlNumberValue('num')).toBe(123)
      expect(getUrlNumberValue('str')).toBe(0) // NaN converted to 0
    })
  })

  describe('buildSortingField', () => {
    it('should build sorting field for ascending order', () => {
      const result = buildSortingField({ prop: 'name', order: 'ascending' })
      expect(result).toEqual({ field: 'name', order: 'asc' })
    })

    it('should build sorting field for descending order', () => {
      const result = buildSortingField({ prop: 'date', order: 'descending' })
      expect(result).toEqual({ field: 'date', order: 'desc' })
    })
  })

  describe('getSumValue', () => {
    it('should sum array of numbers', () => {
      expect(getSumValue([1, 2, 3, 4, 5])).toBe(15)
      expect(getSumValue([1.5, 2.5, 3.5])).toBe(7.5)
    })

    it('should handle NaN values', () => {
      expect(getSumValue([1, NaN, 3])).toBe(4)
      expect(getSumValue([NaN, NaN])).toBe(0)
    })

    it('should return 0 for empty array', () => {
      expect(getSumValue([])).toBe(0)
    })
  })

  describe('formatToFraction', () => {
    it('should convert integer to fraction with 2 decimal places', () => {
      expect(formatToFraction(100)).toBe('1.00')
      expect(formatToFraction(150)).toBe('1.50')
      expect(formatToFraction('200')).toBe('2.00')
    })

    it('should handle undefined input', () => {
      expect(formatToFraction(undefined)).toBe('0.00')
    })
  })

  describe('floatToFixed2', () => {
    it('should format number to 2 decimal places', () => {
      expect(floatToFixed2(0.01)).toBe('0.01')
      expect(floatToFixed2(1.5)).toBe('1.50')
      expect(floatToFixed2(1.25)).toBe('1.25')
    })

    it('should handle undefined input', () => {
      expect(floatToFixed2(undefined)).toBe('0.00')
    })
  })

  describe('convertToInteger', () => {
    it('should convert fraction to integer', () => {
      expect(convertToInteger(1.5)).toBe(150)
      expect(convertToInteger('2.25')).toBe(225)
    })

    it('should handle undefined input', () => {
      expect(convertToInteger(undefined)).toBe(0)
    })
  })

  describe('yuanToFen', () => {
    it('should convert yuan to fen', () => {
      expect(yuanToFen(1.5)).toBe(150)
      expect(yuanToFen('2.25')).toBe(225)
    })
  })

  describe('fenToYuan', () => {
    it('should convert fen to yuan', () => {
      expect(fenToYuan(150)).toBe('1.50')
      expect(fenToYuan('225')).toBe('2.25')
    })
  })

  describe('calculateRelativeRate', () => {
    it('should calculate relative rate correctly', () => {
      expect(calculateRelativeRate(120, 100)).toBe('20')
      expect(calculateRelativeRate(80, 100)).toBe('-20')
    })

    it('should return 0 when reference is 0', () => {
      expect(calculateRelativeRate(100, 0)).toBe(0)
      expect(calculateRelativeRate(100, null)).toBe(0)
    })
  })

  describe('erpNumberFormatter', () => {
    it('should format number with specified digits', () => {
      expect(erpNumberFormatter(1.2345, 2)).toBe('1.23')
      expect(erpNumberFormatter(1.2345, 3)).toBe('1.234')
    })

    it('should handle null/undefined input', () => {
      expect(erpNumberFormatter(null, 2)).toBe('')
      expect(erpNumberFormatter(undefined, 2)).toBe('')
    })

    it('should handle string input', () => {
      expect(erpNumberFormatter('1.2345', 2)).toBe('1.23')
    })
  })

  describe('erpCountInputFormatter', () => {
    it('should format count with 3 decimal places', () => {
      expect(erpCountInputFormatter(1.2345)).toBe('1.234')
    })
  })

  describe('erpCountTableColumnFormatter', () => {
    it('should format table column count', () => {
      expect(erpCountTableColumnFormatter(null, null, 1.2345)).toBe('1.234')
    })
  })

  describe('erpPriceInputFormatter', () => {
    it('should format price with 2 decimal places', () => {
      expect(erpPriceInputFormatter(1.2345)).toBe('1.23')
    })
  })

  describe('erpPriceTableColumnFormatter', () => {
    it('should format table column price', () => {
      expect(erpPriceTableColumnFormatter(null, null, 1.2345)).toBe('1.23')
    })
  })

  describe('erpPriceMultiply', () => {
    it('should multiply price and count', () => {
      expect(erpPriceMultiply(10.5, 2)).toBe(21)
      expect(erpPriceMultiply(1.25, 4)).toBe(5)
    })

    it('should return undefined for null inputs', () => {
      expect(erpPriceMultiply(null, 2)).toBeUndefined()
      expect(erpPriceMultiply(10, null)).toBeUndefined()
    })
  })

  describe('erpCalculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(erpCalculatePercentage(25, 100)).toBe('25.00')
      expect(erpCalculatePercentage(1, 3)).toBe('33.33')
    })

    it('should return 0 when total is 0', () => {
      expect(erpCalculatePercentage(100, 0)).toBe(0)
    })
  })

  describe('areaReplace', () => {
    it('should replace area name suffixes', () => {
      expect(areaReplace('新疆维吾尔自治区')).toBe('新疆')
      expect(areaReplace('广西壮族自治区')).toBe('广西')
      expect(areaReplace('宁夏回族自治区')).toBe('宁夏')
      expect(areaReplace('内蒙古自治区')).toBe('内蒙古')
      expect(areaReplace('广东省')).toBe('广东')
    })

    it('should return original string if no match', () => {
      expect(areaReplace('北京市')).toBe('北京市')
    })

    it('should handle empty string', () => {
      expect(areaReplace('')).toBe('')
    })
  })

  describe('jsonParse', () => {
    it('should parse valid JSON string', () => {
      expect(jsonParse('{"name": "test"}')).toEqual({ name: 'test' })
      expect(jsonParse('[1, 2, 3]')).toEqual([1, 2, 3])
    })

    it('should return original string for invalid JSON', () => {
      expect(jsonParse('invalid json')).toBe('invalid json')
    })
  })

  describe('subString', () => {
    it('should return substring when string is longer than end', () => {
      expect(subString('hello world', 0, 5)).toBe('hello')
    })

    it('should return original string when shorter than end', () => {
      expect(subString('hi', 0, 10)).toBe('hi')
    })
  })
})
