import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  defaultShortcuts,
  formatDate,
  getNowDateTime,
  getWeek,
  formatPast,
  formatAxis,
  formatPast2,
  dateFormatter,
  dateFormatter2,
  beginOfDay,
  endOfDay,
  betweenDay,
  addTime,
  convertDate,
  isSameDay,
  getDayRange,
  getLast7Days,
  getLast30Days,
  getLast1Year,
  getDateRange
} from '@/utils/formatTime'
import dayjs from 'dayjs'

describe('utils/formatTime', () => {
  describe('defaultShortcuts', () => {
    it('should contain expected shortcut options', () => {
      expect(defaultShortcuts).toHaveLength(6)
      expect(defaultShortcuts[0].text).toBe('今天')
      expect(defaultShortcuts[1].text).toBe('昨天')
      expect(defaultShortcuts[2].text).toBe('最近七天')
      expect(defaultShortcuts[3].text).toBe('最近 30 天')
      expect(defaultShortcuts[4].text).toBe('本月')
      expect(defaultShortcuts[5].text).toBe('今年')
    })

    it('should return Date objects for shortcuts', () => {
      const today = defaultShortcuts[0].value()
      expect(today).toBeInstanceOf(Date)

      const yesterday = defaultShortcuts[1].value()
      expect(yesterday).toBeInstanceOf(Array)
      expect(yesterday).toHaveLength(2)
    })
  })

  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2023-01-01T12:30:45')
      const result = formatDate(date)
      expect(result).toMatch(/2023-01-01 12:30:45/)
    })

    it('should format date with custom format', () => {
      const date = new Date('2023-01-01T12:30:45')
      const result = formatDate(date, 'YYYY-MM-DD')
      expect(result).toBe('2023-01-01')
    })

    it('should return empty string for null/undefined date', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
    })
  })

  describe('getNowDateTime', () => {
    it('should return current dayjs object', () => {
      const result = getNowDateTime()
      expect(result).toBeDefined()
      expect(typeof result.format).toBe('function')
    })
  })

  describe('getWeek', () => {
    it('should calculate week number correctly', () => {
      // Test with a known date
      const date = new Date('2023-01-01') // Sunday
      const week = getWeek(date)
      expect(typeof week).toBe('number')
      expect(week).toBeGreaterThan(0)
    })
  })

  describe('formatPast', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-01-01T12:00:00'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "刚刚" for very recent time', () => {
      const recentTime = new Date('2023-01-01T11:59:55')
      expect(formatPast(recentTime)).toBe('刚刚')
    })

    it('should return seconds ago for recent time', () => {
      const recentTime = new Date('2023-01-01T11:59:30')
      expect(formatPast(recentTime)).toBe('30秒前')
    })

    it('should return minutes ago', () => {
      const recentTime = new Date('2023-01-01T11:30:00')
      expect(formatPast(recentTime)).toBe('30分钟前')
    })

    it('should return hours ago', () => {
      const recentTime = new Date('2023-01-01T06:00:00')
      expect(formatPast(recentTime)).toBe('6小时前')
    })

    it('should return days ago', () => {
      const recentTime = new Date('2022-12-30T12:00:00')
      expect(formatPast(recentTime)).toBe('2天前')
    })

    it('should return formatted date for older time', () => {
      const oldTime = new Date('2022-01-01T12:00:00')
      const result = formatPast(oldTime)
      expect(result).toMatch(/2022-01-01/)
    })

    it('should handle string date input', () => {
      const result = formatPast('2023-01-01T11:30:00')
      expect(result).toBe('30分钟前')
    })
  })

  describe('formatAxis', () => {
    it('should return appropriate greeting based on hour', () => {
      expect(formatAxis(new Date('2023-01-01T05:00:00'))).toBe('凌晨好')
      expect(formatAxis(new Date('2023-01-01T08:00:00'))).toBe('早上好')
      expect(formatAxis(new Date('2023-01-01T10:00:00'))).toBe('上午好')
      expect(formatAxis(new Date('2023-01-01T13:00:00'))).toBe('中午好')
      expect(formatAxis(new Date('2023-01-01T15:00:00'))).toBe('下午好')
      expect(formatAxis(new Date('2023-01-01T18:00:00'))).toBe('傍晚好')
      expect(formatAxis(new Date('2023-01-01T20:00:00'))).toBe('晚上好')
      expect(formatAxis(new Date('2023-01-01T23:00:00'))).toBe('夜里好')
    })
  })

  describe('formatPast2', () => {
    it('should format milliseconds to readable string', () => {
      expect(formatPast2(1000)).toBe('1 秒')
      expect(formatPast2(60000)).toBe('1 分钟')
      expect(formatPast2(3600000)).toBe('1 小时 0 分钟')
      expect(formatPast2(86400000)).toBe('1 天 0 小时 0 分钟')
    })

    it('should handle complex time combinations', () => {
      const ms = 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 30 * 60 * 1000 // 2 days, 3 hours, 30 minutes
      const result = formatPast2(ms)
      expect(result).toContain('2 天')
      expect(result).toContain('3 小时')
      expect(result).toContain('30 分钟')
    })

    it('should return "0 秒" for zero milliseconds', () => {
      expect(formatPast2(0)).toBe('0 秒')
    })
  })

  describe('dateFormatter', () => {
    it('should format date for table column', () => {
      const mockColumn = {}
      const result = dateFormatter({}, mockColumn, '2023-01-01T12:30:45')
      expect(result).toMatch(/2023-01-01 12:30:45/)
    })

    it('should return empty string for null value', () => {
      const mockColumn = {}
      const result = dateFormatter({}, mockColumn, null)
      expect(result).toBe('')
    })
  })

  describe('dateFormatter2', () => {
    it('should format date with YYYY-MM-DD format', () => {
      const mockColumn = {}
      const result = dateFormatter2({}, mockColumn, '2023-01-01T12:30:45')
      expect(result).toBe('2023-01-01')
    })
  })

  describe('beginOfDay', () => {
    it('should set time to 00:00:00', () => {
      const date = new Date('2023-01-01T12:30:45')
      const result = beginOfDay(date)
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
      expect(result.getSeconds()).toBe(0)
    })
  })

  describe('endOfDay', () => {
    it('should set time to 23:59:59', () => {
      const date = new Date('2023-01-01T12:30:45')
      const result = endOfDay(date)
      expect(result.getHours()).toBe(23)
      expect(result.getMinutes()).toBe(59)
      expect(result.getSeconds()).toBe(59)
    })
  })

  describe('betweenDay', () => {
    it('should calculate days between two dates', () => {
      const date1 = new Date('2023-01-01')
      const date2 = new Date('2023-01-05')
      expect(betweenDay(date1, date2)).toBe(4)
    })

    it('should handle string dates', () => {
      const date1 = '2023-01-01'
      const date2 = '2023-01-03'
      expect(betweenDay(date1, date2)).toBe(2)
    })
  })

  describe('addTime', () => {
    it('should add milliseconds to date', () => {
      const date = new Date('2023-01-01T12:00:00')
      const result = addTime(date, 3600000) // Add 1 hour
      expect(result.getTime() - date.getTime()).toBe(3600000)
    })

    it('should handle string date', () => {
      const date = '2023-01-01T12:00:00'
      const result = addTime(date, 3600000)
      expect(result).toBeInstanceOf(Date)
    })
  })

  describe('convertDate', () => {
    it('should return Date object for string input', () => {
      const result = convertDate('2023-01-01')
      expect(result).toBeInstanceOf(Date)
    })

    it('should return Date object for Date input', () => {
      const date = new Date('2023-01-01')
      const result = convertDate(date)
      expect(result).toBe(date)
    })
  })

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = '2023-01-01T12:00:00'
      const date2 = '2023-01-01T18:00:00'
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('should return false for different days', () => {
      const date1 = '2023-01-01T12:00:00'
      const date2 = '2023-01-02T12:00:00'
      expect(isSameDay(date1, date2)).toBe(false)
    })

    it('should return false for null/undefined inputs', () => {
      expect(isSameDay(null, '2023-01-01')).toBe(false)
      expect(isSameDay('2023-01-01', undefined)).toBe(false)
    })
  })

  describe('getDayRange', () => {
    it('should return day range with specified days offset', () => {
      const date = dayjs('2023-01-01')
      const result = getDayRange(date, 7)
      expect(result).toHaveLength(2)
      expect(result[0]).toMatch(/2023-01-08 00:00:00/)
      expect(result[1]).toMatch(/2023-01-08 23:59:59/)
    })
  })

  describe('getLast7Days', () => {
    it('should return last 7 days range', () => {
      const result = getLast7Days()
      expect(result).toHaveLength(2)
      expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2} 00:00:00$/)
      expect(result[1]).toMatch(/^\d{4}-\d{2}-\d{2} 23:59:59$/)
    })
  })

  describe('getLast30Days', () => {
    it('should return last 30 days range', () => {
      const result = getLast30Days()
      expect(result).toHaveLength(2)
      expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2} 00:00:00$/)
      expect(result[1]).toMatch(/^\d{4}-\d{2}-\d{2} 23:59:59$/)
    })
  })

  describe('getLast1Year', () => {
    it('should return last 1 year range', () => {
      const result = getLast1Year()
      expect(result).toHaveLength(2)
      expect(result[0]).toMatch(/^\d{4}-\d{2}-\d{2} 00:00:00$/)
      expect(result[1]).toMatch(/^\d{4}-\d{2}-\d{2} 23:59:59$/)
    })
  })

  describe('getDateRange', () => {
    it('should return formatted date range', () => {
      const beginDate = dayjs('2023-01-01')
      const endDate = dayjs('2023-01-31')
      const result = getDateRange(beginDate, endDate)

      expect(result).toHaveLength(2)
      expect(result[0]).toBe('2023-01-01 00:00:00')
      expect(result[1]).toBe('2023-01-31 23:59:59')
    })
  })
})
