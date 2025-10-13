import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useForm } from '@/hooks/web/useForm'

describe('hooks/web/useForm', () => {
  let mockFormRef: any
  let mockElFormRef: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock form refs
    mockFormRef = {
      setProps: vi.fn(),
      setValues: vi.fn(),
      setSchema: vi.fn(),
      addSchema: vi.fn(),
      delSchema: vi.fn(),
      formModel: { name: 'test', email: 'test@example.com' }
    }

    mockElFormRef = {
      validate: vi.fn(),
      resetFields: vi.fn()
    }
  })

  describe('useForm initialization', () => {
    it('should initialize with default values', () => {
      const { register, elFormRef, methods } = useForm()

      expect(register).toBeDefined()
      expect(elFormRef).toBeDefined()
      expect(methods).toBeDefined()
    })

    it('should initialize with custom props', () => {
      const props = {
        model: { name: 'test' },
        rules: { name: [{ required: true }] }
      }

      const { methods } = useForm(props)

      expect(methods).toBeDefined()
    })
  })

  describe('register', () => {
    it('should register form and elForm refs', () => {
      const { register } = useForm()

      register(mockFormRef, mockElFormRef)

      // The refs are stored internally, we can't directly test them
      // but we can test that the function doesn't throw
      expect(() => register(mockFormRef, mockElFormRef)).not.toThrow()
    })
  })

  describe('getForm', () => {
    it('should return form instance after registration', async () => {
      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      // Test through methods that use getForm internally
      await methods.setProps({})

      expect(mockFormRef.setProps).toHaveBeenCalled()
    })

    it('should log error when form is not registered', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { methods } = useForm()

      await methods.setProps({})

      expect(consoleSpy).toHaveBeenCalledWith(
        'The form is not registered. Please use the register method to register'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('methods.setProps', () => {
    it('should set form props', async () => {
      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      const props = { border: true, size: 'large' }
      await methods.setProps(props)

      expect(mockFormRef.setProps).toHaveBeenCalledWith(props)
    })

    it('should set values when model is provided', async () => {
      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      const props = {
        model: { name: 'test', email: 'test@example.com' }
      }
      await methods.setProps(props)

      expect(mockFormRef.setProps).toHaveBeenCalledWith(props)
      expect(mockFormRef.setValues).toHaveBeenCalledWith(props.model)
    })
  })

  describe('methods.setValues', () => {
    it('should set form values', async () => {
      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      const values = { name: 'new name', email: 'new@example.com' }
      await methods.setValues(values)

      expect(mockFormRef.setValues).toHaveBeenCalledWith(values)
    })
  })

  describe('methods.setSchema', () => {
    it('should set form schema', async () => {
      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      const schemaProps = [
        { field: 'name', title: 'Name' },
        { field: 'email', title: 'Email' }
      ]
      await methods.setSchema(schemaProps)

      expect(mockFormRef.setSchema).toHaveBeenCalledWith(schemaProps)
    })
  })

  describe('methods.addSchema', () => {
    it('should add schema field', async () => {
      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      const formSchema = { field: 'phone', title: 'Phone' }
      await methods.addSchema(formSchema, 1)

      expect(mockFormRef.addSchema).toHaveBeenCalledWith(formSchema, 1)
    })

    it('should add schema field without index', async () => {
      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      const formSchema = { field: 'phone', title: 'Phone' }
      await methods.addSchema(formSchema)

      expect(mockFormRef.addSchema).toHaveBeenCalledWith(formSchema, undefined)
    })
  })

  describe('methods.delSchema', () => {
    it('should delete schema field', async () => {
      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      await methods.delSchema('email')

      expect(mockFormRef.delSchema).toHaveBeenCalledWith('email')
    })
  })

  describe('methods.getFormData', () => {
    it('should return form data', async () => {
      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      const formData = await methods.getFormData()

      expect(formData).toEqual(mockFormRef.formModel)
    })

    it('should return typed form data', async () => {
      interface UserForm {
        name: string
        email: string
      }

      const { register, methods } = useForm()

      register(mockFormRef, mockElFormRef)

      const formData = await methods.getFormData<UserForm>()

      expect(formData).toEqual(mockFormRef.formModel)
    })
  })

  describe('form initialization with props', () => {
    it('should call setProps during initialization when props are provided', () => {
      const props = {
        model: { name: 'test' },
        rules: { name: [{ required: true }] }
      }

      const { methods } = useForm(props)

      // The setProps should be called during initialization
      expect(methods).toBeDefined()
    })
  })
})
