export interface CouponTemplateVO {
  id: number
  name: string
  status: number
  totalCount: number
  takeLimitCount: number
  takeType: number
  usePrice: number
  productScope: number
  productScopeValues: number[]
  validityType: number
  validStartTime: Date
  validEndTime: Date
  fixedStartTerm: number
  fixedEndTerm: number
  discountType: number
  discountPercent: number
  discountPrice: number
  discountLimitPrice: number
  takeCount: number
  useCount: number
}

// 创建优惠劵模板
export function createCouponTemplate(_data: CouponTemplateVO) {
  return Promise.reject(new Error('oldApi 已废弃，不可用'));
}

// 更新优惠劵模板
export function updateCouponTemplate(_data: CouponTemplateVO) {
  return Promise.reject(new Error('oldApi 已废弃，不可用'));
}

// 更新优惠劵模板的状态
export function updateCouponTemplateStatus(_id: number, _status: [0, 1]) {
  return Promise.reject(new Error('oldApi 已废弃，不可用'));
}

// 删除优惠劵模板
export function deleteCouponTemplate(_id: number) {
  return Promise.reject(new Error('oldApi 已废弃，不可用'));
}

// 获得优惠劵模板
export function getCouponTemplate(_id: number) {
  return Promise.reject(new Error('oldApi 已废弃，不可用'));
}

// 获得优惠劵模板分页
export function getCouponTemplatePage(_params: PageParam) {
  return Promise.reject(new Error('oldApi 已废弃，不可用'));
}

// 获得优惠劵模板分页
export function getCouponTemplateList(_ids: number[]): Promise<CouponTemplateVO[]> {
  return Promise.reject(new Error('oldApi 已废弃，不可用'));
}

// 导出优惠劵模板 Excel
export function exportCouponTemplateExcel(_params: PageParam) {
  return Promise.reject(new Error('oldApi 已废弃，不可用'));
}