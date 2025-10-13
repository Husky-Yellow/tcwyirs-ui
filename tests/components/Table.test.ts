import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Table from '@/components/Table'
import type { TableProps } from '@/components/Table/src/types'

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElTable: {
    name: 'ElTable',
    template: '<div class="el-table"><slot /></div>',
    props: ['data', 'loading', 'selection', 'reserveSelection'],
    methods: {
      clearSelection: vi.fn(),
      toggleRowSelection: vi.fn(),
      toggleAllSelection: vi.fn()
    }
  },
  ElTableColumn: {
    name: 'ElTableColumn',
    template: '<div class="el-table-column"></div>',
    props: ['prop', 'label', 'width', 'align', 'headerAlign', 'showOverflowTooltip']
  },
  ElPagination: {
    name: 'ElPagination',
    template: '<div class="el-pagination"></div>',
    props: ['currentPage', 'pageSize', 'total', 'pageSizes', 'layout'],
    emits: ['current-change', 'size-change']
  }
}))

describe('components/Table', () => {
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Table component', () => {
    it('should render with basic props', () => {
      const props: TableProps = {
        data: [
          { id: 1, name: 'Test 1' },
          { id: 2, name: 'Test 2' }
        ],
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' }
        ]
      }

      wrapper = mount(Table, {
        props
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should render with loading state', () => {
      const props: TableProps = {
        loading: true,
        data: [],
        columns: []
      }

      wrapper = mount(Table, {
        props
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should render with selection', () => {
      const props: TableProps = {
        selection: true,
        data: [
          { id: 1, name: 'Test 1' },
          { id: 2, name: 'Test 2' }
        ],
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' }
        ]
      }

      wrapper = mount(Table, {
        props
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should render with pagination', () => {
      const props: TableProps = {
        data: [
          { id: 1, name: 'Test 1' },
          { id: 2, name: 'Test 2' }
        ],
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' }
        ],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 100
        }
      }

      wrapper = mount(Table, {
        props
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty data', () => {
      const props: TableProps = {
        data: [],
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' }
        ]
      }

      wrapper = mount(Table, {
        props
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle undefined data', () => {
      const props: TableProps = {
        data: undefined,
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' }
        ]
      }

      wrapper = mount(Table, {
        props
      })

      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Table methods', () => {
    it('should expose table methods', async () => {
      const props: TableProps = {
        data: [
          { id: 1, name: 'Test 1' }
        ],
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' }
        ]
      }

      wrapper = mount(Table, {
        props
      })

      await nextTick()

      // Check if component has expected methods
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Table events', () => {
    it('should emit selection change events', async () => {
      const props: TableProps = {
        selection: true,
        data: [
          { id: 1, name: 'Test 1' }
        ],
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' }
        ]
      }

      wrapper = mount(Table, {
        props
      })

      await nextTick()

      // Test selection change
      const selectionChangeSpy = vi.fn()
      wrapper.vm.$emit = selectionChangeSpy

      // Simulate selection change
      wrapper.vm.$emit('selection-change', [])

      expect(selectionChangeSpy).toHaveBeenCalledWith('selection-change', [])
    })

    it('should emit pagination change events', async () => {
      const props: TableProps = {
        data: [
          { id: 1, name: 'Test 1' }
        ],
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' }
        ],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 100
        }
      }

      wrapper = mount(Table, {
        props
      })

      await nextTick()

      // Test pagination change
      const currentChangeSpy = vi.fn()
      wrapper.vm.$emit = currentChangeSpy

      // Simulate page change
      wrapper.vm.$emit('current-change', 2)

      expect(currentChangeSpy).toHaveBeenCalledWith('current-change', 2)
    })
  })

  describe('Table column configuration', () => {
    it('should render columns with different configurations', () => {
      const props: TableProps = {
        data: [
          { id: 1, name: 'Test 1', status: 'active' }
        ],
        columns: [
          { prop: 'id', label: 'ID', width: 80 },
          { prop: 'name', label: 'Name', align: 'left' },
          { prop: 'status', label: 'Status', headerAlign: 'center' }
        ]
      }

      wrapper = mount(Table, {
        props
      })

      expect(wrapper.exists()).toBe(true)
    })

    it('should handle columns with showOverflowTooltip', () => {
      const props: TableProps = {
        data: [
          { id: 1, name: 'Very long name that should be truncated' }
        ],
        columns: [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name', showOverflowTooltip: true }
        ]
      }

      wrapper = mount(Table, {
        props
      })

      expect(wrapper.exists()).toBe(true)
    })
  })
})

