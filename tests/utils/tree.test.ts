import { describe, it, expect } from 'vitest'
import {
  listToTree,
  treeToList,
  findNode,
  findNodeAll,
  findPath,
  findPathAll,
  filter,
  forEach,
  treeMap,
  treeMapEach,
  eachTree,
  handleTree,
  handleTree2,
  checkSelectedNode,
  treeToString,
  defaultProps
} from '@/utils/tree'

describe('utils/tree', () => {
  const mockList = [
    { id: 1, name: 'Node 1', pid: 0 },
    { id: 2, name: 'Node 2', pid: 1 },
    { id: 3, name: 'Node 3', pid: 1 },
    { id: 4, name: 'Node 4', pid: 2 },
    { id: 5, name: 'Node 5', pid: 0 }
  ]

  const mockTree = [
    {
      id: 1,
      name: 'Node 1',
      children: [
        {
          id: 2,
          name: 'Node 2',
          children: [
            { id: 4, name: 'Node 4' }
          ]
        },
        { id: 3, name: 'Node 3' }
      ]
    },
    { id: 5, name: 'Node 5' }
  ]

  describe('listToTree', () => {
    it('should convert list to tree structure', () => {
      const result = listToTree(mockList)
      expect(result).toHaveLength(2) // Root nodes
      expect(result[0].children).toHaveLength(2) // Node 1 has 2 children
      expect(result[0].children[0].children).toHaveLength(1) // Node 2 has 1 child
    })

    it('should handle custom config', () => {
      const customList = [
        { nodeId: 1, nodeName: 'Node 1', parentId: 0 },
        { nodeId: 2, nodeName: 'Node 2', parentId: 1 }
      ]

      const result = listToTree(customList, {
        id: 'nodeId',
        children: 'children',
        pid: 'parentId'
      })

      expect(result).toHaveLength(1)
      expect(result[0].children).toHaveLength(1)
    })

    it('should handle empty list', () => {
      const result = listToTree([])
      expect(result).toHaveLength(0)
    })
  })

  describe('treeToList', () => {
    it('should convert tree to flat list', () => {
      const result = treeToList(mockTree)
      expect(result).toHaveLength(5) // All nodes flattened
      expect(result.some(node => node.id === 1)).toBe(true)
      expect(result.some(node => node.id === 4)).toBe(true)
    })

    it('should handle custom config', () => {
      const customTree = [
        {
          nodeId: 1,
          nodeName: 'Node 1',
          childNodes: [
            { nodeId: 2, nodeName: 'Node 2' }
          ]
        }
      ]

      const result = treeToList(customTree, {
        id: 'nodeId',
        children: 'childNodes',
        pid: 'parentId'
      })

      expect(result).toHaveLength(2)
    })
  })

  describe('findNode', () => {
    it('should find node by condition', () => {
      const result = findNode(mockTree, (node) => node.id === 3)
      expect(result).toBeDefined()
      expect(result.id).toBe(3)
      expect(result.name).toBe('Node 3')
    })

    it('should return null if node not found', () => {
      const result = findNode(mockTree, (node) => node.id === 999)
      expect(result).toBeNull()
    })

    it('should handle custom config', () => {
      const customTree = [
        {
          nodeId: 1,
          nodeName: 'Node 1',
          childNodes: [
            { nodeId: 2, nodeName: 'Node 2' }
          ]
        }
      ]

      const result = findNode(customTree, (node) => node.nodeId === 2, {
        id: 'nodeId',
        children: 'childNodes',
        pid: 'parentId'
      })

      expect(result).toBeDefined()
      expect(result.nodeId).toBe(2)
    })
  })

  describe('findNodeAll', () => {
    it('should find all nodes matching condition', () => {
      const result = findNodeAll(mockTree, (node) => node.id > 2)
      expect(result).toHaveLength(3) // Nodes 3, 4, 5
      expect(result.every(node => node.id > 2)).toBe(true)
    })

    it('should return empty array if no nodes match', () => {
      const result = findNodeAll(mockTree, (node) => node.id > 999)
      expect(result).toHaveLength(0)
    })
  })

  describe('findPath', () => {
    it('should find path to node', () => {
      const result = findPath(mockTree, (node) => node.id === 4)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[result.length - 1].id).toBe(4)
    })

    it('should return null if path not found', () => {
      const result = findPath(mockTree, (node) => node.id === 999)
      expect(result).toBeNull()
    })
  })

  describe('findPathAll', () => {
    it('should find all paths matching condition', () => {
      const result = findPathAll(mockTree, (node) => node.id > 2)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('filter', () => {
    it('should filter tree nodes', () => {
      const result = filter(mockTree, (node) => node.id > 2)
      expect(result).toHaveLength(2) // Root nodes 1 and 5, but node 1 has children with id > 2
      expect(result.some(node => node.id === 1)).toBe(true)
      expect(result.some(node => node.id === 5)).toBe(true)
    })

    it('should preserve tree structure when filtering', () => {
      const result = filter(mockTree, (node) => node.id !== 2)
      expect(result).toHaveLength(2) // Root nodes
      expect(result[0].children).toHaveLength(1) // Node 1 has 1 child (Node 3)
    })
  })

  describe('forEach', () => {
    it('should iterate through all nodes', () => {
      const visitedNodes: number[] = []
      forEach(mockTree, (node) => {
        visitedNodes.push(node.id)
        return false // Continue iteration
      })

      expect(visitedNodes).toHaveLength(5)
      expect(visitedNodes).toContain(1)
      expect(visitedNodes).toContain(5)
    })

    it('should stop iteration when callback returns true', () => {
      const visitedNodes: number[] = []
      forEach(mockTree, (node) => {
        visitedNodes.push(node.id)
        return node.id === 2 // Stop after finding node 2
      })

      expect(visitedNodes.length).toBeLessThan(5)
    })
  })

  describe('treeMap', () => {
    it('should map tree structure', () => {
      const result = treeMap(mockTree, {
        children: 'children',
        conversion: (node) => ({ ...node, mapped: true })
      })

      expect(result).toHaveLength(2)
      expect(result[0].mapped).toBe(true)
      expect(result[0].children).toBeDefined()
    })
  })

  describe('treeMapEach', () => {
    it('should map each node in tree', () => {
      const result = treeMapEach(mockTree[0], {
        children: 'children',
        conversion: (node) => ({ ...node, processed: true })
      })

      expect(result.processed).toBe(true)
      expect(result.children).toBeDefined()
    })
  })

  describe('eachTree', () => {
    it('should iterate through tree with callback', () => {
      const processedNodes: any[] = []
      eachTree(mockTree, (node, parentNode) => {
        processedNodes.push({ ...node, parentId: parentNode?.id || 0 })
        return node
      })

      expect(processedNodes).toHaveLength(5)
      expect(processedNodes[0].parentId).toBe(0) // Root node
    })
  })

  describe('handleTree', () => {
    it('should build tree structure from flat data', () => {
      const result = handleTree(mockList)
      expect(result).toHaveLength(5) // All nodes since pid=0 is not in the list
      expect(result.some(node => node.id === 1)).toBe(true)
    })

    it('should handle custom field names', () => {
      const customList = [
        { nodeId: 1, nodeName: 'Node 1', parentId: 0 },
        { nodeId: 2, nodeName: 'Node 2', parentId: 1 }
      ]

      const result = handleTree(customList, 'nodeId', 'parentId', 'children')
      expect(result).toHaveLength(1)
      expect(result[0].children).toHaveLength(1)
    })

    it('should handle non-array input', () => {
      const result = handleTree(null)
      expect(result).toHaveLength(0)
    })
  })

  describe('handleTree2', () => {
    it('should build tree structure with rootId', () => {
      const result = handleTree2(mockList, 'id', 'pid', 'children', 0)
      expect(result).toHaveLength(2) // Root nodes
    })

    it('should handle empty data', () => {
      const result = handleTree2([], 'id', 'pid', 'children', 0)
      expect(result).toHaveLength(0)
    })
  })

  describe('checkSelectedNode', () => {
    it('should return false for invalid tree', () => {
      expect(checkSelectedNode(undefined, 1)).toBe(false)
      expect(checkSelectedNode(null, 1)).toBe(false)
      expect(checkSelectedNode([], 1)).toBe(false)
    })

    it('should return false for first level node', () => {
      expect(checkSelectedNode(mockTree, 1)).toBe(false)
      expect(checkSelectedNode(mockTree, 5)).toBe(false)
    })

    it('should return true for deeper level node', () => {
      expect(checkSelectedNode(mockTree, 4)).toBe(true)
    })

    it('should return false for non-existent node', () => {
      expect(checkSelectedNode(mockTree, 999)).toBe(false)
    })
  })

  describe('treeToString', () => {
    it('should return node name for first level node', () => {
      const result = treeToString(mockTree, 1)
      expect(result).toBe('Node 1')
    })

    it('should return path string for deeper node', () => {
      const result = treeToString(mockTree, 4)
      expect(result).toContain('Node 1')
      expect(result).toContain('Node 2')
      expect(result).toContain('Node 4')
    })

    it('should return empty string for invalid tree', () => {
      expect(treeToString(undefined, 1)).toBe('')
      expect(treeToString(null, 1)).toBe('')
      expect(treeToString([], 1)).toBe('')
    })

    it('should return empty string for non-existent node', () => {
      expect(treeToString(mockTree, 999)).toBe('')
    })
  })

  describe('defaultProps', () => {
    it('should have correct default properties', () => {
      expect(defaultProps.children).toBe('children')
      expect(defaultProps.label).toBe('name')
      expect(defaultProps.value).toBe('id')
      expect(defaultProps.isLeaf).toBe('leaf')
      expect(defaultProps.emitPath).toBe(false)
    })
  })
})
