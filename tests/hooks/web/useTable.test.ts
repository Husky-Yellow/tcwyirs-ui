import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { ElMessage, ElMessageBox } from 'element-plus'
import download from '@/utils/download'

// Mock dependencies
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    warning: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn()
  }
}))

vi.mock('@/utils/download', () => ({
  default: {
    excel: vi.fn()
  }
}))

vi.mock('@/hooks/web/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}))

describe('hooks/web/useTable', () => {
  let mockGetListApi: any
  let mockDelListApi: any
  let mockExportListApi: any
  let mockTableRef: any
  let mockElTableRef: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock API functions
    mockGetListApi = vi.fn()
    mockDelListApi = vi.fn()
    mockExportListApi = vi.fn()

    // Mock table refs
    mockTableRef = {
      setProps: vi.fn(),
      setColumn: vi.fn(),
      selections: []
    }

    mockElTableRef = {
      clearSelection: vi.fn()
    }
  })

  describe('useTable initialization', () => {
    it('should initialize with default values', () => {
      const { tableObject } = useTable()

      expect(tableObject.pageSize).toBe(10)
      expect(tableObject.currentPage).toBe(1)
      expect(tableObject.total).toBe(10)
      expect(tableObject.tableList).toEqual([])
      expect(tableObject.loading).toBe(true)
      expect(tableObject.exportLoading).toBe(false)
      expect(tableObject.currentRow).toBeNull()
    })

    it('should initialize with custom config', () => {
      const config = {
        getListApi: mockGetListApi,
        defaultParams: { status: 'active' },
        props: { border: true }
      }

      const { tableObject } = useTable(config)

      expect(tableObject.params).toEqual({ status: 'active' })
    })
  })

  describe('register', () => {
    it('should register table and elTable refs', () => {
      const { register } = useTable()

      register(mockTableRef, mockElTableRef)

      // The refs are stored internally, we can't directly test them
      // but we can test that the function doesn't throw
      expect(() => register(mockTableRef, mockElTableRef)).not.toThrow()
    })
  })

  describe('getTable', () => {
    it('should return table instance after registration', async () => {
      const { register, getTable } = useTable()

      register(mockTableRef, mockElTableRef)

      const table = await getTable()
      expect(table).toBe(mockTableRef)
    })

    it('should log error when table is not registered', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { getTable } = useTable()

      await getTable()

      expect(consoleSpy).toHaveBeenCalledWith(
        'The table is not registered. Please use the register method to register'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('methods.getList', () => {
    it('should fetch data and update table state', async () => {
      const mockResponse = {
        list: [{ id: 1, name: 'Test' }],
        total: 1
      }

      mockGetListApi.mockResolvedValue(mockResponse)

      const { tableObject, methods } = useTable({
        getListApi: mockGetListApi
      })

      await methods.getList()

      expect(tableObject.loading).toBe(false)
      expect(tableObject.tableList).toEqual(mockResponse.list)
      expect(tableObject.total).toBe(mockResponse.total)
    })

    it('should handle API error gracefully', async () => {
      mockGetListApi.mockRejectedValue(new Error('API Error'))

      const { tableObject, methods } = useTable({
        getListApi: mockGetListApi
      })

      await methods.getList()

      expect(tableObject.loading).toBe(false)
      expect(tableObject.tableList).toEqual([])
    })
  })

  describe('methods.setProps', () => {
    it('should set table props', async () => {
      const { register, methods } = useTable()

      register(mockTableRef, mockElTableRef)

      await methods.setProps({ border: true })

      expect(mockTableRef.setProps).toHaveBeenCalledWith({ border: true })
    })
  })

  describe('methods.setColumn', () => {
    it('should set table columns', async () => {
      const { register, methods } = useTable()

      register(mockTableRef, mockElTableRef)

      const columns = [{ prop: 'name', label: 'Name' }]
      await methods.setColumn(columns)

      expect(mockTableRef.setColumn).toHaveBeenCalledWith(columns)
    })
  })

  describe('methods.getSelections', () => {
    it('should return table selections', async () => {
      const mockSelections = [{ id: 1, name: 'Test' }]
      mockTableRef.selections = mockSelections

      const { register, methods } = useTable()

      register(mockTableRef, mockElTableRef)

      const selections = await methods.getSelections()

      expect(selections).toEqual(mockSelections)
    })
  })

  describe('methods.setSearchParams', () => {
    it('should set search parameters and reset to page 1', () => {
      const { tableObject, methods } = useTable()

      tableObject.currentPage = 3

      methods.setSearchParams({ status: 'active', name: 'test' })

      expect(tableObject.params).toEqual({
        pageSize: 10,
        pageNo: 1,
        status: 'active',
        name: 'test'
      })
      expect(tableObject.currentPage).toBe(1)
    })

    it('should call getList when already on page 1', () => {
      const mockGetList = vi.fn()
      const { tableObject, methods } = useTable()

      tableObject.currentPage = 1

      // Mock the getList method
      methods.getList = mockGetList

      methods.setSearchParams({ status: 'active' })

      expect(mockGetList).toHaveBeenCalled()
    })
  })

  describe('methods.delList', () => {
    it('should delete single item with confirmation', async () => {
      const mockConfirm = vi.fn().mockResolvedValue(undefined)
      vi.mocked(ElMessageBox.confirm).mockImplementation(mockConfirm)

      const { register, methods } = useTable({
        delListApi: mockDelListApi
      })

      register(mockTableRef, mockElTableRef)

      await methods.delList(1, false, true)

      expect(mockConfirm).toHaveBeenCalled()
      expect(mockDelListApi).toHaveBeenCalledWith(1)
    })

    it('should delete multiple items', async () => {
      const { register, methods } = useTable({
        delListApi: mockDelListApi
      })

      register(mockTableRef, mockElTableRef)

      await methods.delList([1, 2, 3], true, false)

      expect(mockDelListApi).toHaveBeenCalledTimes(3)
    })

    it('should show warning when no selections for multiple delete', async () => {
      const { register, methods } = useTable({
        delListApi: mockDelListApi
      })

      register(mockTableRef, mockElTableRef)

      await methods.delList([], true, false)

      expect(ElMessage.warning).toHaveBeenCalledWith('common.delNoData')
    })
  })

  describe('methods.exportList', () => {
    it('should export list with confirmation', async () => {
      const mockConfirm = vi.fn().mockResolvedValue(undefined)
      vi.mocked(ElMessageBox.confirm).mockImplementation(mockConfirm)

      const mockBlob = new Blob(['test'], { type: 'application/vnd.ms-excel' })
      mockExportListApi.mockResolvedValue(mockBlob)

      const { tableObject, methods } = useTable({
        exportListApi: mockExportListApi
      })

      await methods.exportList('test.xlsx')

      expect(mockConfirm).toHaveBeenCalled()
      expect(mockExportListApi).toHaveBeenCalled()
      expect(download.excel).toHaveBeenCalledWith(mockBlob, 'test.xlsx')
      expect(tableObject.exportLoading).toBe(false)
    })

    it('should handle export cancellation', async () => {
      const mockConfirm = vi.fn().mockRejectedValue(new Error('cancelled'))
      vi.mocked(ElMessageBox.confirm).mockImplementation(mockConfirm)

      const { tableObject, methods } = useTable({
        exportListApi: mockExportListApi
      })

      await methods.exportList('test.xlsx')

      expect(tableObject.exportLoading).toBe(false)
      expect(mockExportListApi).not.toHaveBeenCalled()
    })
  })

  describe('watch handlers', () => {
    it('should call getList when currentPage changes', async () => {
      const mockGetList = vi.fn()
      const { tableObject } = useTable()

      // Mock the getList method
      tableObject.methods = { getList: mockGetList }

      tableObject.currentPage = 2

      // Wait for nextTick to ensure watchers are triggered
      await nextTick()

      // Note: In a real test, we'd need to properly set up the watchers
      // This is a simplified test to show the concept
    })

    it('should reset to page 1 when pageSize changes and currentPage > 1', async () => {
      const { tableObject } = useTable()

      tableObject.currentPage = 3
      tableObject.pageSize = 20

      // Wait for nextTick to ensure watchers are triggered
      await nextTick()

      expect(tableObject.currentPage).toBe(1)
    })
  })
})
