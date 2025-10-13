import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  hasClass,
  addClass,
  removeClass,
  getBoundingClientRect,
  getViewportOffset,
  on,
  off,
  once,
  getStyle,
  setStyle,
  isScroll,
  getScrollContainer,
  isInContainer
} from '@/utils/domUtils'

// Mock DOM elements
const createMockElement = (className = '', style = {}) => ({
  className,
  classList: {
    contains: vi.fn((cls) => className.includes(cls)),
    add: vi.fn(),
    remove: vi.fn()
  },
  style: { ...style },
  getBoundingClientRect: vi.fn(() => ({
    left: 0,
    top: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100
  })),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  parentNode: null
})

describe('utils/domUtils', () => {
  let mockElement: any

  beforeEach(() => {
    mockElement = createMockElement('test-class')

    // Mock document
    Object.defineProperty(document, 'documentElement', {
      value: {
        scrollLeft: 0,
        scrollTop: 0,
        clientLeft: 0,
        clientTop: 0,
        clientWidth: 1000,
        clientHeight: 1000
      },
      writable: true
    })

    // Mock window
    Object.defineProperty(window, 'pageXOffset', { value: 0, writable: true })
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true })
  })

  describe('hasClass', () => {
    it('should return true if element has class', () => {
      expect(hasClass(mockElement, 'test-class')).toBe(true)
    })

    it('should return false if element does not have class', () => {
      expect(hasClass(mockElement, 'other-class')).toBe(false)
    })

    it('should return false for null element', () => {
      expect(hasClass(null, 'test-class')).toBe(false)
    })

    it('should return false for empty class name', () => {
      expect(hasClass(mockElement, '')).toBe(false)
    })

    it('should throw error for class name with spaces', () => {
      expect(() => hasClass(mockElement, 'class with spaces')).toThrow()
    })

    it('should work with classList API', () => {
      mockElement.classList.contains.mockReturnValue(true)
      expect(hasClass(mockElement, 'test-class')).toBe(true)
    })
  })

  describe('addClass', () => {
    it('should add class to element', () => {
      addClass(mockElement, 'new-class')
      expect(mockElement.classList.add).toHaveBeenCalledWith('new-class')
    })

    it('should handle multiple classes', () => {
      addClass(mockElement, 'class1 class2')
      expect(mockElement.classList.add).toHaveBeenCalledWith('class1')
      expect(mockElement.classList.add).toHaveBeenCalledWith('class2')
    })

    it('should not add class to null element', () => {
      addClass(null, 'test-class')
      // Should not throw error
    })

    it('should handle empty class name', () => {
      addClass(mockElement, '')
      // Should not throw error
    })
  })

  describe('removeClass', () => {
    it('should remove class from element', () => {
      removeClass(mockElement, 'test-class')
      expect(mockElement.classList.remove).toHaveBeenCalledWith('test-class')
    })

    it('should handle multiple classes', () => {
      removeClass(mockElement, 'class1 class2')
      expect(mockElement.classList.remove).toHaveBeenCalledWith('class1')
      expect(mockElement.classList.remove).toHaveBeenCalledWith('class2')
    })

    it('should not remove class from null element', () => {
      removeClass(null, 'test-class')
      // Should not throw error
    })

    it('should handle empty class name', () => {
      removeClass(mockElement, '')
      // Should not throw error
    })
  })

  describe('getBoundingClientRect', () => {
    it('should return bounding rect for valid element', () => {
      const rect = getBoundingClientRect(mockElement)
      expect(rect).toEqual({
        left: 0,
        top: 0,
        right: 100,
        bottom: 100,
        width: 100,
        height: 100
      })
    })

    it('should return 0 for null element', () => {
      expect(getBoundingClientRect(null)).toBe(0)
    })

    it('should return 0 for element without getBoundingClientRect', () => {
      const elementWithoutRect = {}
      expect(getBoundingClientRect(elementWithoutRect)).toBe(0)
    })
  })

  describe('getViewportOffset', () => {
    it('should calculate viewport offset correctly', () => {
      const offset = getViewportOffset(mockElement)
      expect(offset).toHaveProperty('left')
      expect(offset).toHaveProperty('top')
      expect(offset).toHaveProperty('right')
      expect(offset).toHaveProperty('bottom')
      expect(offset).toHaveProperty('rightIncludeBody')
      expect(offset).toHaveProperty('bottomIncludeBody')
    })
  })

  describe('on', () => {
    it('should add event listener', () => {
      const handler = vi.fn()
      on(mockElement, 'click', handler)
      expect(mockElement.addEventListener).toHaveBeenCalledWith('click', handler, false)
    })

    it('should not add listener for null element', () => {
      const handler = vi.fn()
      on(null, 'click', handler)
      expect(mockElement.addEventListener).not.toHaveBeenCalled()
    })

    it('should not add listener for null event', () => {
      const handler = vi.fn()
      on(mockElement, null, handler)
      expect(mockElement.addEventListener).not.toHaveBeenCalled()
    })

    it('should not add listener for null handler', () => {
      on(mockElement, 'click', null)
      expect(mockElement.addEventListener).not.toHaveBeenCalled()
    })
  })

  describe('off', () => {
    it('should remove event listener', () => {
      const handler = vi.fn()
      off(mockElement, 'click', handler)
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('click', handler, false)
    })

    it('should not remove listener for null element', () => {
      const handler = vi.fn()
      off(null, 'click', handler)
      expect(mockElement.removeEventListener).not.toHaveBeenCalled()
    })
  })

  describe('once', () => {
    it('should add one-time event listener', () => {
      const handler = vi.fn()
      once(mockElement, 'click', handler)
      expect(mockElement.addEventListener).toHaveBeenCalled()
    })
  })

  describe('getStyle', () => {
    beforeEach(() => {
      // Mock computed style
      Object.defineProperty(document, 'defaultView', {
        value: {
          getComputedStyle: vi.fn(() => ({
            color: 'red',
            fontSize: '16px'
          }))
        },
        writable: true
      })
    })

    it('should get computed style', () => {
      const style = getStyle(mockElement, 'color')
      expect(style).toBe('red')
    })

    it('should return null for null element', () => {
      expect(getStyle(null, 'color')).toBeNull()
    })

    it('should return null for null style name', () => {
      expect(getStyle(mockElement, null)).toBeNull()
    })
  })

  describe('setStyle', () => {
    it('should set single style property', () => {
      setStyle(mockElement, 'color', 'red')
      expect(mockElement.style.color).toBe('red')
    })

    it('should set multiple style properties', () => {
      setStyle(mockElement, {
        color: 'red',
        fontSize: '16px'
      })
      expect(mockElement.style.color).toBe('red')
      expect(mockElement.style.fontSize).toBe('16px')
    })

    it('should not set style for null element', () => {
      setStyle(null, 'color', 'red')
      // Should not throw error
    })

    it('should not set style for null style name', () => {
      setStyle(mockElement, null, 'red')
      // Should not throw error
    })
  })

  describe('isScroll', () => {
    beforeEach(() => {
      // Mock getStyle to return scroll values
      vi.spyOn(require('@/utils/domUtils'), 'getStyle').mockImplementation((el, styleName) => {
        if (styleName === 'overflow' || styleName === 'overflow-y' || styleName === 'overflow-x') {
          return 'scroll'
        }
        return null
      })
    })

    it('should return true for scrollable element', () => {
      expect(isScroll(mockElement, true)).toBe(true)
    })

    it('should return false for non-scrollable element', () => {
      vi.spyOn(require('@/utils/domUtils'), 'getStyle').mockReturnValue('visible')
      expect(isScroll(mockElement, true)).toBe(false)
    })
  })

  describe('getScrollContainer', () => {
    it('should return window for document element', () => {
      const container = getScrollContainer(document.documentElement)
      expect(container).toBe(window)
    })

    it('should return parent scroll container', () => {
      const parentElement = createMockElement()
      parentElement.getBoundingClientRect = vi.fn(() => ({
        left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100
      }))
      mockElement.parentNode = parentElement

      // Mock isScroll to return true for parent
      vi.spyOn(require('@/utils/domUtils'), 'isScroll').mockReturnValue(true)

      const container = getScrollContainer(mockElement)
      expect(container).toBe(parentElement)
    })
  })

  describe('isInContainer', () => {
    it('should return true when element is in container', () => {
      const container = createMockElement()
      container.getBoundingClientRect = vi.fn(() => ({
        left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200
      }))

      mockElement.getBoundingClientRect = vi.fn(() => ({
        left: 50, top: 50, right: 150, bottom: 150, width: 100, height: 100
      }))

      expect(isInContainer(mockElement, container)).toBe(true)
    })

    it('should return false when element is outside container', () => {
      const container = createMockElement()
      container.getBoundingClientRect = vi.fn(() => ({
        left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100
      }))

      mockElement.getBoundingClientRect = vi.fn(() => ({
        left: 150, top: 150, right: 250, bottom: 250, width: 100, height: 100
      }))

      expect(isInContainer(mockElement, container)).toBe(false)
    })

    it('should return false for null element', () => {
      expect(isInContainer(null, mockElement)).toBe(false)
    })

    it('should return false for null container', () => {
      expect(isInContainer(mockElement, null)).toBe(false)
    })

    it('should handle window/document container', () => {
      mockElement.getBoundingClientRect = vi.fn(() => ({
        left: 50, top: 50, right: 150, bottom: 150, width: 100, height: 100
      }))

      expect(isInContainer(mockElement, window)).toBe(true)
      expect(isInContainer(mockElement, document)).toBe(true)
      expect(isInContainer(mockElement, document.documentElement)).toBe(true)
    })
  })
})
