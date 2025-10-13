import { describe, it, expect } from 'vitest'
import {
  isHexColor,
  rgbToHex,
  hexToRGB,
  colorIsDark,
  darken,
  lighten,
  calculateBestTextColor,
  PREDEFINE_COLORS
} from '@/utils/color'

describe('utils/color', () => {
  describe('isHexColor', () => {
    it('should validate 3-character hex colors', () => {
      expect(isHexColor('#fff')).toBe(true)
      expect(isHexColor('#000')).toBe(true)
      expect(isHexColor('#abc')).toBe(true)
    })

    it('should validate 6-character hex colors', () => {
      expect(isHexColor('#ffffff')).toBe(true)
      expect(isHexColor('#000000')).toBe(true)
      expect(isHexColor('#123456')).toBe(true)
    })

    it('should reject invalid hex colors', () => {
      expect(isHexColor('#ggg')).toBe(false)
      expect(isHexColor('ffffff')).toBe(false)
      expect(isHexColor('#fffff')).toBe(false)
      expect(isHexColor('#fffffff')).toBe(false)
      expect(isHexColor('')).toBe(false)
    })

    it('should handle case insensitive hex colors', () => {
      expect(isHexColor('#FFF')).toBe(true)
      expect(isHexColor('#FFFFFF')).toBe(true)
      expect(isHexColor('#AbC')).toBe(true)
    })
  })

  describe('rgbToHex', () => {
    it('should convert RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000')
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00')
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff')
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff')
      expect(rgbToHex(0, 0, 0)).toBe('#000000')
    })

    it('should handle RGB values with leading zeros', () => {
      expect(rgbToHex(1, 2, 3)).toBe('#010203')
    })
  })

  describe('hexToRGB', () => {
    it('should convert 6-character hex to RGB', () => {
      expect(hexToRGB('#ff0000')).toBe('RGB(255,0,0)')
      expect(hexToRGB('#00ff00')).toBe('RGB(0,255,0)')
      expect(hexToRGB('#0000ff')).toBe('RGB(0,0,255)')
    })

    it('should convert 3-character hex to RGB', () => {
      expect(hexToRGB('#f00')).toBe('RGB(255,0,0)')
      expect(hexToRGB('#0f0')).toBe('RGB(0,255,0)')
      expect(hexToRGB('#00f')).toBe('RGB(0,0,255)')
    })

    it('should convert hex to RGBA with opacity', () => {
      expect(hexToRGB('#ff0000', 0.5)).toBe('RGBA(255,0,0,0.5)')
      expect(hexToRGB('#00ff00', 0.8)).toBe('RGBA(0,255,0,0.8)')
    })

    it('should handle case insensitive hex', () => {
      expect(hexToRGB('#FF0000')).toBe('RGB(255,0,0)')
      expect(hexToRGB('#F00')).toBe('RGB(255,0,0)')
    })

    it('should return original string for invalid hex', () => {
      expect(hexToRGB('invalid')).toBe('invalid')
    })
  })

  describe('colorIsDark', () => {
    it('should identify dark colors', () => {
      expect(colorIsDark('#000000')).toBe(true)
      expect(colorIsDark('#333333')).toBe(true)
      expect(colorIsDark('#666666')).toBe(true)
    })

    it('should identify light colors', () => {
      expect(colorIsDark('#ffffff')).toBe(false)
      expect(colorIsDark('#cccccc')).toBe(false)
      expect(colorIsDark('#999999')).toBe(false)
    })

    it('should return undefined for invalid hex', () => {
      expect(colorIsDark('invalid')).toBeUndefined()
    })
  })

  describe('darken', () => {
    it('should darken color by percentage', () => {
      const result = darken('#ffffff', 50)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
      expect(result).not.toBe('#ffffff')
    })

    it('should handle hex without #', () => {
      const result = darken('ffffff', 30)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('should not exceed 100% darkening', () => {
      const result = darken('#ffffff', 150)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  describe('lighten', () => {
    it('should lighten color by percentage', () => {
      const result = lighten('#000000', 50)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
      expect(result).not.toBe('#000000')
    })

    it('should handle hex without #', () => {
      const result = lighten('000000', 30)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })

    it('should not exceed 100% lightening', () => {
      const result = lighten('#000000', 150)
      expect(result).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })

  describe('calculateBestTextColor', () => {
    it('should return black for light backgrounds', () => {
      expect(calculateBestTextColor('#ffffff')).toBe('#000000')
      expect(calculateBestTextColor('#cccccc')).toBe('#000000')
    })

    it('should return white for dark backgrounds', () => {
      expect(calculateBestTextColor('#000000')).toBe('#FFFFFF')
      expect(calculateBestTextColor('#333333')).toBe('#FFFFFF')
    })

    it('should handle hex without #', () => {
      expect(calculateBestTextColor('ffffff')).toBe('#000000')
      expect(calculateBestTextColor('000000')).toBe('#FFFFFF')
    })
  })

  describe('PREDEFINE_COLORS', () => {
    it('should contain valid hex colors', () => {
      expect(PREDEFINE_COLORS).toHaveLength(17)
      PREDEFINE_COLORS.forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })

    it('should contain common color values', () => {
      expect(PREDEFINE_COLORS).toContain('#ff4500') // OrangeRed
      expect(PREDEFINE_COLORS).toContain('#409EFF') // Blue
      expect(PREDEFINE_COLORS).toContain('#909399') // Gray
    })
  })
})
