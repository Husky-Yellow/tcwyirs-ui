import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import download from '@/utils/download'

describe('utils/download', () => {
  let mockCreateObjectURL: any
  let mockRevokeObjectURL: any
  let mockCreateElement: any
  let mockClick: any
  let mockCanvas: any
  let mockContext: any
  let mockImage: any

  beforeEach(() => {
    // Mock URL methods
    mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
    mockRevokeObjectURL = vi.fn()

    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL
      },
      writable: true
    })

    // Mock document.createElement
    mockClick = vi.fn()
    mockCreateElement = vi.fn((tagName) => {
      if (tagName === 'a') {
        return {
          href: '',
          download: '',
          click: mockClick
        }
      }
      if (tagName === 'canvas') {
        return mockCanvas
      }
      return {}
    })

    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement,
      writable: true
    })

    // Mock canvas
    mockContext = {
      clearRect: vi.fn(),
      drawImage: vi.fn()
    }

    mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockContext),
      toDataURL: vi.fn(() => 'data:image/png;base64,mock-data')
    }

    // Mock Image
    mockImage = {
      src: '',
      width: 100,
      height: 100,
      onload: vi.fn()
    }

    global.Image = vi.fn(() => mockImage) as any
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('download.excel', () => {
    it('should download Excel file', () => {
      const mockBlob = new Blob(['test data'], { type: 'application/vnd.ms-excel' })
      const fileName = 'test.xlsx'

      download.excel(mockBlob, fileName)

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockClick).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })

  describe('download.word', () => {
    it('should download Word file', () => {
      const mockBlob = new Blob(['test data'], { type: 'application/msword' })
      const fileName = 'test.docx'

      download.word(mockBlob, fileName)

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockClick).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })

  describe('download.zip', () => {
    it('should download Zip file', () => {
      const mockBlob = new Blob(['test data'], { type: 'application/zip' })
      const fileName = 'test.zip'

      download.zip(mockBlob, fileName)

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockClick).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })

  describe('download.html', () => {
    it('should download HTML file', () => {
      const mockBlob = new Blob(['<html>test</html>'], { type: 'text/html' })
      const fileName = 'test.html'

      download.html(mockBlob, fileName)

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockClick).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })

  describe('download.markdown', () => {
    it('should download Markdown file', () => {
      const mockBlob = new Blob(['# Test'], { type: 'text/markdown' })
      const fileName = 'test.md'

      download.markdown(mockBlob, fileName)

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockClick).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })

  describe('download.json', () => {
    it('should download JSON file', () => {
      const mockBlob = new Blob(['{"test": "data"}'], { type: 'application/json' })
      const fileName = 'test.json'

      download.json(mockBlob, fileName)

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob)
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockClick).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
  })

  describe('download.image', () => {
    it('should download image with default settings', (done) => {
      const url = 'https://example.com/image.png'

      download.image({ url })

      // Simulate image load
      setTimeout(() => {
        mockImage.onload()

        expect(mockCanvas.width).toBe(100) // image.width
        expect(mockCanvas.height).toBe(100) // image.height
        expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 100, 100)
        expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, 0, 0, 100, 100)
        expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png')
        expect(mockClick).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should download image with custom canvas size', (done) => {
      const url = 'https://example.com/image.png'
      const canvasWidth = 200
      const canvasHeight = 150

      download.image({ url, canvasWidth, canvasHeight })

      setTimeout(() => {
        mockImage.onload()

        expect(mockCanvas.width).toBe(canvasWidth)
        expect(mockCanvas.height).toBe(canvasHeight)
        done()
      }, 0)
    })

    it('should download image without image size when drawWithImageSize is false', (done) => {
      const url = 'https://example.com/image.png'

      download.image({ url, drawWithImageSize: false })

      setTimeout(() => {
        mockImage.onload()

        expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, 0, 0)
        done()
      }, 0)
    })
  })

  describe('download.base64ToFile', () => {
    it('should convert base64 to file', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      const fileName = 'test'

      const result = download.base64ToFile(base64, fileName)

      expect(result).toBeInstanceOf(File)
      expect(result.name).toBe('test.png')
      expect(result.type).toBe('image/png')
    })

    it('should handle different image types', () => {
      const base64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD'
      const fileName = 'test'

      const result = download.base64ToFile(base64, fileName)

      expect(result.name).toBe('test.jpeg')
      expect(result.type).toBe('image/jpeg')
    })

    it('should handle webp format', () => {
      const base64 = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA'
      const fileName = 'test'

      const result = download.base64ToFile(base64, fileName)

      expect(result.name).toBe('test.webp')
      expect(result.type).toBe('image/webp')
    })
  })
})
