/**
 * Mock 数据生成工具
 * 替代 mockjs 的 Mock.Random 功能
 */

// 中文姓氏
const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡']
// 中文名字用字
const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟']

export const Random = {
  /**
   * 从数组中随机选择一个元素
   */
  pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  },

  /**
   * 生成随机整数
   */
  integer(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  /**
   * 生成随机浮点数
   */
  float(min: number, max: number, minDecimals: number = 2, maxDecimals: number = 2): number {
    const decimals = this.integer(minDecimals, maxDecimals)
    const value = Math.random() * (max - min) + min
    return parseFloat(value.toFixed(decimals))
  },

  /**
   * 生成随机中文名
   */
  cname(): string {
    const surname = this.pick(surnames)
    const given = this.pick(givenNames) + (Math.random() > 0.5 ? this.pick(givenNames) : '')
    return surname + given
  },

  /**
   * 生成随机手机号
   */
  phone(): string {
    const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
                      '150', '151', '152', '153', '155', '156', '157', '158', '159',
                      '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
    const prefix = this.pick(prefixes)
    const suffix = String(this.integer(10000000, 99999999))
    return prefix + suffix
  },

  /**
   * 生成随机日期时间
   */
  datetime(format: string = 'yyyy-MM-dd HH:mm:ss'): string {
    const now = new Date()
    const past = new Date(now.getTime() - this.integer(0, 365 * 24 * 60 * 60 * 1000))

    const pad = (n: number) => n.toString().padStart(2, '0')

    return format
      .replace('yyyy', String(past.getFullYear()))
      .replace('MM', pad(past.getMonth() + 1))
      .replace('dd', pad(past.getDate()))
      .replace('HH', pad(past.getHours()))
      .replace('mm', pad(past.getMinutes()))
      .replace('ss', pad(past.getSeconds()))
  },

  /**
   * 生成随机 UUID
   */
  uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },

  /**
   * 生成随机 GUID (别名)
   */
  guid(): string {
    return this.uuid()
  },

  /**
   * 生成随机布尔值
   */
  boolean(): boolean {
    return Math.random() > 0.5
  },

  /**
   * 生成随机邮箱
   */
  email(): string {
    const domains = ['gmail.com', 'qq.com', '163.com', 'example.com', 'company.com']
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let name = ''
    for (let i = 0; i < this.integer(5, 10); i++) {
      name += chars[this.integer(0, chars.length - 1)]
    }
    return `${name}@${this.pick(domains)}`
  },

  /**
   * 生成随机 IP 地址
   */
  ip(): string {
    return `${this.integer(1, 255)}.${this.integer(0, 255)}.${this.integer(0, 255)}.${this.integer(1, 254)}`
  },

  /**
   * 生成随机段落
   */
  paragraph(): string {
    const sentences = [
      '这是一段示例文本。',
      '系统运行正常，一切顺利。',
      '数据已成功处理完毕。',
      '请检查相关配置信息。',
      '操作已完成，请查看结果。'
    ]
    const count = this.integer(2, 4)
    return Array.from({ length: count }, () => this.pick(sentences)).join('')
  },

  /**
   * 生成随机标题
   */
  title(): string {
    const prefixes = ['关于', '通知：', '公告：', '重要：', '【通知】']
    const topics = ['系统升级', '服务更新', '业务调整', '功能优化', '安全提醒']
    return this.pick(prefixes) + this.pick(topics)
  },

  /**
   * 生成随机中文句子
   */
  csentence(min: number = 5, max: number = 15): string {
    const phrases = [
      '数据处理完成',
      '系统运行正常',
      '操作执行成功',
      '请检查相关配置',
      '已完成数据同步',
      '任务已提交处理',
      '信息更新完毕',
      '状态变更通知'
    ]
    const count = this.integer(min, max)
    let result = ''
    while (result.length < count) {
      result += this.pick(phrases)
    }
    return result.substring(0, count) + '。'
  },

  /**
   * 生成随机中文段落
   */
  cparagraph(minSentences: number = 2, maxSentences: number = 5): string {
    const count = this.integer(minSentences, maxSentences)
    return Array.from({ length: count }, () => this.csentence(10, 30)).join('')
  },

  /**
   * 生成随机单词
   */
  word(min: number = 3, max: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    const length = this.integer(min, max)
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[this.integer(0, chars.length - 1)]
    }
    return result
  },

  /**
   * 生成随机字符串
   */
  string(pool: 'upper' | 'lower' | 'alpha' | 'number' = 'alpha', length: number = 8): string {
    const pools = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      number: '0123456789'
    }
    const chars = pools[pool]
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars[this.integer(0, chars.length - 1)]
    }
    return result
  },

  /**
   * 生成随机日期
   */
  date(format: string = 'yyyy-MM-dd'): string {
    return this.datetime(format)
  }
}

/**
 * 根据正则表达式模式生成字符串
 */
export function mockPattern(pattern: RegExp): string {
  const source = pattern.source

  // 简单的手机号正则处理
  if (source.includes('1[3-9]\\d{9}')) {
    return Random.phone()
  }

  // 默认返回随机字符串
  return Random.uuid().substring(0, 10)
}
