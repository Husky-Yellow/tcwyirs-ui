import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from '@/config/axios'
import {
  login,
  register,
  getTenantIdByName,
  getTenantByWebsite,
  loginOut,
  getInfo,
  sendSmsCode,
  smsLogin,
  socialLogin,
  socialAuthRedirect,
  getCode,
  reqCheck,
  smsResetPassword
} from '@/api/login'
import type { UserLoginVO, RegisterVO, SmsCodeVO, SmsLoginVO } from '@/api/login'

// Mock axios request
vi.mock('@/config/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    postOriginal: vi.fn()
  }
}))

describe('api/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('login', () => {
    it('should call login API with correct data', () => {
      const loginData: UserLoginVO = {
        username: 'testuser',
        password: 'password123',
        captchaVerification: 'captcha123'
      }

      login(loginData)

      expect(request.post).toHaveBeenCalledWith({
        url: '/system/auth/login',
        data: loginData
      })
    })

    it('should handle social login data', () => {
      const socialLoginData: UserLoginVO = {
        username: 'testuser',
        password: 'password123',
        captchaVerification: 'captcha123',
        socialType: 'wechat',
        socialCode: 'code123',
        socialState: 'state123'
      }

      login(socialLoginData)

      expect(request.post).toHaveBeenCalledWith({
        url: '/system/auth/login',
        data: socialLoginData
      })
    })
  })

  describe('register', () => {
    it('should call register API with correct data', () => {
      const registerData: RegisterVO = {
        tenantName: 'Test Tenant',
        username: 'newuser',
        password: 'password123',
        captchaVerification: 'captcha123'
      }

      register(registerData)

      expect(request.post).toHaveBeenCalledWith({
        url: '/system/auth/register',
        data: registerData
      })
    })
  })

  describe('getTenantIdByName', () => {
    it('should call getTenantIdByName API with correct name', () => {
      const tenantName = 'Test Tenant'

      getTenantIdByName(tenantName)

      expect(request.get).toHaveBeenCalledWith({
        url: '/system/tenant/get-id-by-name?name=' + tenantName
      })
    })
  })

  describe('getTenantByWebsite', () => {
    it('should call getTenantByWebsite API with correct website', () => {
      const website = 'https://example.com'

      getTenantByWebsite(website)

      expect(request.get).toHaveBeenCalledWith({
        url: '/system/tenant/get-by-website?website=' + website
      })
    })
  })

  describe('loginOut', () => {
    it('should call logout API', () => {
      loginOut()

      expect(request.post).toHaveBeenCalledWith({
        url: '/system/auth/logout'
      })
    })
  })

  describe('getInfo', () => {
    it('should call getInfo API', () => {
      getInfo()

      expect(request.get).toHaveBeenCalledWith({
        url: '/system/auth/get-permission-info'
      })
    })
  })

  describe('sendSmsCode', () => {
    it('should call sendSmsCode API with correct data', () => {
      const smsData: SmsCodeVO = {
        mobile: '13800138000',
        scene: 1
      }

      sendSmsCode(smsData)

      expect(request.post).toHaveBeenCalledWith({
        url: '/system/auth/send-sms-code',
        data: smsData
      })
    })
  })

  describe('smsLogin', () => {
    it('should call smsLogin API with correct data', () => {
      const smsLoginData: SmsLoginVO = {
        mobile: '13800138000',
        code: '123456'
      }

      smsLogin(smsLoginData)

      expect(request.post).toHaveBeenCalledWith({
        url: '/system/auth/sms-login',
        data: smsLoginData
      })
    })
  })

  describe('socialLogin', () => {
    it('should call socialLogin API with correct parameters', () => {
      const type = 'wechat'
      const code = 'auth_code_123'
      const state = 'state_123'

      socialLogin(type, code, state)

      expect(request.post).toHaveBeenCalledWith({
        url: '/system/auth/social-login',
        data: {
          type,
          code,
          state
        }
      })
    })
  })

  describe('socialAuthRedirect', () => {
    it('should call socialAuthRedirect API with correct parameters', () => {
      const type = 1
      const redirectUri = 'https://example.com/callback'

      socialAuthRedirect(type, redirectUri)

      expect(request.get).toHaveBeenCalledWith({
        url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
      })
    })
  })

  describe('getCode', () => {
    it('should call getCode API with correct data', () => {
      const data = { type: 'login' }

      getCode(data)

      expect(request.postOriginal).toHaveBeenCalledWith({
        url: 'system/captcha/get',
        data
      })
    })
  })

  describe('reqCheck', () => {
    it('should call reqCheck API with correct data', () => {
      const data = {
        captchaVerification: 'captcha123',
        pointJson: '{"x":100,"y":200}'
      }

      reqCheck(data)

      expect(request.postOriginal).toHaveBeenCalledWith({
        url: 'system/captcha/check',
        data
      })
    })
  })

  describe('smsResetPassword', () => {
    it('should call smsResetPassword API with correct data', () => {
      const data = {
        mobile: '13800138000',
        code: '123456',
        password: 'newpassword123'
      }

      smsResetPassword(data)

      expect(request.post).toHaveBeenCalledWith({
        url: '/system/auth/reset-password',
        data
      })
    })
  })
})

