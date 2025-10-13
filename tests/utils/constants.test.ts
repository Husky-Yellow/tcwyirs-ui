import { describe, it, expect } from 'vitest'
import {
  CommonStatusEnum,
  UserTypeEnum,
  SystemMenuTypeEnum,
  SystemRoleTypeEnum,
  SystemDataScopeEnum,
  SystemUserSocialTypeEnum,
  InfraCodegenTemplateTypeEnum,
  InfraJobStatusEnum,
  InfraApiErrorLogProcessStatusEnum,
  PayChannelEnum,
  PayDisplayModeEnum,
  PayType,
  PayOrderStatusEnum,
  ProductSpuStatusEnum,
  CouponTemplateValidityTypeEnum,
  CouponTemplateTakeTypeEnum,
  PromotionProductScopeEnum,
  PromotionConditionTypeEnum,
  PromotionDiscountTypeEnum,
  BrokerageBindModeEnum,
  BrokerageEnabledConditionEnum,
  BrokerageRecordBizTypeEnum,
  BrokerageWithdrawStatusEnum,
  BrokerageWithdrawTypeEnum,
  DeliveryTypeEnum,
  TradeOrderStatusEnum,
  ErpBizType,
  BpmModelType,
  BpmModelFormType,
  BpmProcessInstanceStatus,
  BpmAutoApproveType
} from '@/utils/constants'

describe('utils/constants', () => {
  describe('CommonStatusEnum', () => {
    it('should have correct status values', () => {
      expect(CommonStatusEnum.ENABLE).toBe(0)
      expect(CommonStatusEnum.DISABLE).toBe(1)
    })
  })

  describe('UserTypeEnum', () => {
    it('should have correct user type values', () => {
      expect(UserTypeEnum.MEMBER).toBe(1)
      expect(UserTypeEnum.ADMIN).toBe(2)
    })
  })

  describe('SystemMenuTypeEnum', () => {
    it('should have correct menu type values', () => {
      expect(SystemMenuTypeEnum.DIR).toBe(1)
      expect(SystemMenuTypeEnum.MENU).toBe(2)
      expect(SystemMenuTypeEnum.BUTTON).toBe(3)
    })
  })

  describe('SystemRoleTypeEnum', () => {
    it('should have correct role type values', () => {
      expect(SystemRoleTypeEnum.SYSTEM).toBe(1)
      expect(SystemRoleTypeEnum.CUSTOM).toBe(2)
    })
  })

  describe('SystemDataScopeEnum', () => {
    it('should have correct data scope values', () => {
      expect(SystemDataScopeEnum.ALL).toBe(1)
      expect(SystemDataScopeEnum.DEPT_CUSTOM).toBe(2)
      expect(SystemDataScopeEnum.DEPT_ONLY).toBe(3)
      expect(SystemDataScopeEnum.DEPT_AND_CHILD).toBe(4)
      expect(SystemDataScopeEnum.DEPT_SELF).toBe(5)
    })
  })

  describe('SystemUserSocialTypeEnum', () => {
    it('should have correct social type properties', () => {
      expect(SystemUserSocialTypeEnum.DINGTALK.title).toBe('钉钉')
      expect(SystemUserSocialTypeEnum.DINGTALK.type).toBe(20)
      expect(SystemUserSocialTypeEnum.DINGTALK.source).toBe('dingtalk')
      expect(SystemUserSocialTypeEnum.DINGTALK.img).toContain('ax1x.com')

      expect(SystemUserSocialTypeEnum.WECHAT_ENTERPRISE.title).toBe('企业微信')
      expect(SystemUserSocialTypeEnum.WECHAT_ENTERPRISE.type).toBe(30)
      expect(SystemUserSocialTypeEnum.WECHAT_ENTERPRISE.source).toBe('wechat_enterprise')
      expect(SystemUserSocialTypeEnum.WECHAT_ENTERPRISE.img).toContain('ax1x.com')
    })
  })

  describe('InfraCodegenTemplateTypeEnum', () => {
    it('should have correct template type values', () => {
      expect(InfraCodegenTemplateTypeEnum.CRUD).toBe(1)
      expect(InfraCodegenTemplateTypeEnum.TREE).toBe(2)
      expect(InfraCodegenTemplateTypeEnum.SUB).toBe(15)
    })
  })

  describe('InfraJobStatusEnum', () => {
    it('should have correct job status values', () => {
      expect(InfraJobStatusEnum.INIT).toBe(0)
      expect(InfraJobStatusEnum.NORMAL).toBe(1)
      expect(InfraJobStatusEnum.STOP).toBe(2)
    })
  })

  describe('InfraApiErrorLogProcessStatusEnum', () => {
    it('should have correct process status values', () => {
      expect(InfraApiErrorLogProcessStatusEnum.INIT).toBe(0)
      expect(InfraApiErrorLogProcessStatusEnum.DONE).toBe(1)
      expect(InfraApiErrorLogProcessStatusEnum.IGNORE).toBe(2)
    })
  })

  describe('PayChannelEnum', () => {
    it('should have correct payment channel properties', () => {
      expect(PayChannelEnum.WX_PUB.code).toBe('wx_pub')
      expect(PayChannelEnum.WX_PUB.name).toBe('微信 JSAPI 支付')

      expect(PayChannelEnum.ALIPAY_PC.code).toBe('alipay_pc')
      expect(PayChannelEnum.ALIPAY_PC.name).toBe('支付宝 PC 网站支付')

      expect(PayChannelEnum.MOCK.code).toBe('mock')
      expect(PayChannelEnum.MOCK.name).toBe('模拟支付')
    })
  })

  describe('PayDisplayModeEnum', () => {
    it('should have correct display mode values', () => {
      expect(PayDisplayModeEnum.URL.mode).toBe('url')
      expect(PayDisplayModeEnum.IFRAME.mode).toBe('iframe')
      expect(PayDisplayModeEnum.FORM.mode).toBe('form')
      expect(PayDisplayModeEnum.QR_CODE.mode).toBe('qr_code')
      expect(PayDisplayModeEnum.APP.mode).toBe('app')
    })
  })

  describe('PayType', () => {
    it('should have correct payment type values', () => {
      expect(PayType.WECHAT).toBe('WECHAT')
      expect(PayType.ALIPAY).toBe('ALIPAY')
      expect(PayType.MOCK).toBe('MOCK')
    })
  })

  describe('PayOrderStatusEnum', () => {
    it('should have correct order status properties', () => {
      expect(PayOrderStatusEnum.WAITING.status).toBe(0)
      expect(PayOrderStatusEnum.WAITING.name).toBe('未支付')

      expect(PayOrderStatusEnum.SUCCESS.status).toBe(10)
      expect(PayOrderStatusEnum.SUCCESS.name).toBe('已支付')

      expect(PayOrderStatusEnum.CLOSED.status).toBe(20)
      expect(PayOrderStatusEnum.CLOSED.name).toBe('未支付')
    })
  })

  describe('ProductSpuStatusEnum', () => {
    it('should have correct product status properties', () => {
      expect(ProductSpuStatusEnum.RECYCLE.status).toBe(-1)
      expect(ProductSpuStatusEnum.RECYCLE.name).toBe('回收站')

      expect(ProductSpuStatusEnum.DISABLE.status).toBe(0)
      expect(ProductSpuStatusEnum.DISABLE.name).toBe('下架')

      expect(ProductSpuStatusEnum.ENABLE.status).toBe(1)
      expect(ProductSpuStatusEnum.ENABLE.name).toBe('上架')
    })
  })

  describe('CouponTemplateValidityTypeEnum', () => {
    it('should have correct validity type properties', () => {
      expect(CouponTemplateValidityTypeEnum.DATE.type).toBe(1)
      expect(CouponTemplateValidityTypeEnum.DATE.name).toBe('固定日期可用')

      expect(CouponTemplateValidityTypeEnum.TERM.type).toBe(2)
      expect(CouponTemplateValidityTypeEnum.TERM.name).toBe('领取之后可用')
    })
  })

  describe('CouponTemplateTakeTypeEnum', () => {
    it('should have correct take type properties', () => {
      expect(CouponTemplateTakeTypeEnum.USER.type).toBe(1)
      expect(CouponTemplateTakeTypeEnum.USER.name).toBe('直接领取')

      expect(CouponTemplateTakeTypeEnum.ADMIN.type).toBe(2)
      expect(CouponTemplateTakeTypeEnum.ADMIN.name).toBe('指定发放')

      expect(CouponTemplateTakeTypeEnum.REGISTER.type).toBe(3)
      expect(CouponTemplateTakeTypeEnum.REGISTER.name).toBe('新人券')
    })
  })

  describe('PromotionProductScopeEnum', () => {
    it('should have correct product scope properties', () => {
      expect(PromotionProductScopeEnum.ALL.scope).toBe(1)
      expect(PromotionProductScopeEnum.ALL.name).toBe('通用劵')

      expect(PromotionProductScopeEnum.SPU.scope).toBe(2)
      expect(PromotionProductScopeEnum.SPU.name).toBe('商品劵')

      expect(PromotionProductScopeEnum.CATEGORY.scope).toBe(3)
      expect(PromotionProductScopeEnum.CATEGORY.name).toBe('品类劵')
    })
  })

  describe('PromotionConditionTypeEnum', () => {
    it('should have correct condition type properties', () => {
      expect(PromotionConditionTypeEnum.PRICE.type).toBe(10)
      expect(PromotionConditionTypeEnum.PRICE.name).toBe('满 N 元')

      expect(PromotionConditionTypeEnum.COUNT.type).toBe(20)
      expect(PromotionConditionTypeEnum.COUNT.name).toBe('满 N 件')
    })
  })

  describe('PromotionDiscountTypeEnum', () => {
    it('should have correct discount type properties', () => {
      expect(PromotionDiscountTypeEnum.PRICE.type).toBe(1)
      expect(PromotionDiscountTypeEnum.PRICE.name).toBe('满减')

      expect(PromotionDiscountTypeEnum.PERCENT.type).toBe(2)
      expect(PromotionDiscountTypeEnum.PERCENT.name).toBe('折扣')
    })
  })

  describe('BrokerageBindModeEnum', () => {
    it('should have correct bind mode properties', () => {
      expect(BrokerageBindModeEnum.ANYTIME.mode).toBe(1)
      expect(BrokerageBindModeEnum.ANYTIME.name).toBe('首次绑定')

      expect(BrokerageBindModeEnum.REGISTER.mode).toBe(2)
      expect(BrokerageBindModeEnum.REGISTER.name).toBe('注册绑定')

      expect(BrokerageBindModeEnum.OVERRIDE.mode).toBe(3)
      expect(BrokerageBindModeEnum.OVERRIDE.name).toBe('覆盖绑定')
    })
  })

  describe('BrokerageEnabledConditionEnum', () => {
    it('should have correct enabled condition properties', () => {
      expect(BrokerageEnabledConditionEnum.ALL.condition).toBe(1)
      expect(BrokerageEnabledConditionEnum.ALL.name).toBe('人人分销')

      expect(BrokerageEnabledConditionEnum.ADMIN.condition).toBe(2)
      expect(BrokerageEnabledConditionEnum.ADMIN.name).toBe('指定分销')
    })
  })

  describe('BrokerageRecordBizTypeEnum', () => {
    it('should have correct record biz type properties', () => {
      expect(BrokerageRecordBizTypeEnum.ORDER.type).toBe(1)
      expect(BrokerageRecordBizTypeEnum.ORDER.name).toBe('获得推广佣金')

      expect(BrokerageRecordBizTypeEnum.WITHDRAW.type).toBe(2)
      expect(BrokerageRecordBizTypeEnum.WITHDRAW.name).toBe('提现申请')
    })
  })

  describe('BrokerageWithdrawStatusEnum', () => {
    it('should have correct withdraw status properties', () => {
      expect(BrokerageWithdrawStatusEnum.AUDITING.status).toBe(0)
      expect(BrokerageWithdrawStatusEnum.AUDITING.name).toBe('审核中')

      expect(BrokerageWithdrawStatusEnum.AUDIT_SUCCESS.status).toBe(10)
      expect(BrokerageWithdrawStatusEnum.AUDIT_SUCCESS.name).toBe('审核通过')

      expect(BrokerageWithdrawStatusEnum.WITHDRAW_SUCCESS.status).toBe(11)
      expect(BrokerageWithdrawStatusEnum.WITHDRAW_SUCCESS.name).toBe('提现成功')
    })
  })

  describe('BrokerageWithdrawTypeEnum', () => {
    it('should have correct withdraw type properties', () => {
      expect(BrokerageWithdrawTypeEnum.WALLET.type).toBe(1)
      expect(BrokerageWithdrawTypeEnum.WALLET.name).toBe('钱包')

      expect(BrokerageWithdrawTypeEnum.BANK.type).toBe(2)
      expect(BrokerageWithdrawTypeEnum.BANK.name).toBe('银行卡')

      expect(BrokerageWithdrawTypeEnum.WECHAT.type).toBe(3)
      expect(BrokerageWithdrawTypeEnum.WECHAT.name).toBe('微信')

      expect(BrokerageWithdrawTypeEnum.ALIPAY.type).toBe(4)
      expect(BrokerageWithdrawTypeEnum.ALIPAY.name).toBe('支付宝')
    })
  })

  describe('DeliveryTypeEnum', () => {
    it('should have correct delivery type properties', () => {
      expect(DeliveryTypeEnum.EXPRESS.type).toBe(1)
      expect(DeliveryTypeEnum.EXPRESS.name).toBe('快递发货')

      expect(DeliveryTypeEnum.PICK_UP.type).toBe(2)
      expect(DeliveryTypeEnum.PICK_UP.name).toBe('到店自提')
    })
  })

  describe('TradeOrderStatusEnum', () => {
    it('should have correct trade order status properties', () => {
      expect(TradeOrderStatusEnum.UNPAID.status).toBe(0)
      expect(TradeOrderStatusEnum.UNPAID.name).toBe('待支付')

      expect(TradeOrderStatusEnum.UNDELIVERED.status).toBe(10)
      expect(TradeOrderStatusEnum.UNDELIVERED.name).toBe('待发货')

      expect(TradeOrderStatusEnum.DELIVERED.status).toBe(20)
      expect(TradeOrderStatusEnum.DELIVERED.name).toBe('已发货')

      expect(TradeOrderStatusEnum.COMPLETED.status).toBe(30)
      expect(TradeOrderStatusEnum.COMPLETED.name).toBe('已完成')

      expect(TradeOrderStatusEnum.CANCELED.status).toBe(40)
      expect(TradeOrderStatusEnum.CANCELED.name).toBe('已取消')
    })
  })

  describe('ErpBizType', () => {
    it('should have correct ERP business type values', () => {
      expect(ErpBizType.PURCHASE_ORDER).toBe(10)
      expect(ErpBizType.PURCHASE_IN).toBe(11)
      expect(ErpBizType.PURCHASE_RETURN).toBe(12)
      expect(ErpBizType.SALE_ORDER).toBe(20)
      expect(ErpBizType.SALE_OUT).toBe(21)
      expect(ErpBizType.SALE_RETURN).toBe(22)
    })
  })

  describe('BpmModelType', () => {
    it('should have correct BPM model type values', () => {
      expect(BpmModelType.BPMN).toBe(10)
      expect(BpmModelType.SIMPLE).toBe(20)
    })
  })

  describe('BpmModelFormType', () => {
    it('should have correct BPM model form type values', () => {
      expect(BpmModelFormType.NORMAL).toBe(10)
      expect(BpmModelFormType.CUSTOM).toBe(20)
    })
  })

  describe('BpmProcessInstanceStatus', () => {
    it('should have correct BPM process instance status values', () => {
      expect(BpmProcessInstanceStatus.NOT_START).toBe(-1)
      expect(BpmProcessInstanceStatus.RUNNING).toBe(1)
      expect(BpmProcessInstanceStatus.APPROVE).toBe(2)
      expect(BpmProcessInstanceStatus.REJECT).toBe(3)
      expect(BpmProcessInstanceStatus.CANCEL).toBe(4)
    })
  })

  describe('BpmAutoApproveType', () => {
    it('should have correct BPM auto approve type values', () => {
      expect(BpmAutoApproveType.NONE).toBe(0)
      expect(BpmAutoApproveType.APPROVE_ALL).toBe(1)
      expect(BpmAutoApproveType.APPROVE_SEQUENT).toBe(2)
    })
  })
})
