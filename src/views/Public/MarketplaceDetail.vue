<template>
  <div class="marketplace-detail">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="container">
        <div class="nav-wrapper">
          <!-- Logo区域 -->
          <div class="logo-section" @click="goHome">
            <img src="@/assets/imgs/logo.png" alt="TCWYIRS" class="logo" />
            <span class="logo-text">泰城万业信息资源共享平台</span>
          </div>

          <!-- 导航菜单 -->
          <nav class="nav-menu">
            <span class="nav-item active" @click="goToMarketplace">智能要素超市</span>
            <span class="nav-item">产品介绍</span>
            <span class="nav-item">服务支持</span>
            <span class="nav-item">关于我们</span>
          </nav>

          <!-- 登录按钮 -->
          <div class="auth-section">
            <el-button type="primary" @click="goToLogin">登录</el-button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 面包屑导航 -->
      <section class="breadcrumb-section">
        <div class="container">
          <div class="breadcrumb">
            <span @click="goHome" class="breadcrumb-item">首页</span>
            <span class="breadcrumb-separator">/</span>
            <span @click="goToMarketplace" class="breadcrumb-item">智能要素超市</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">{{ product?.title || '详情' }}</span>
          </div>
        </div>
      </section>

      <div v-if="product" class="product-detail-content">
        <!-- 产品基本信息 -->
        <section class="product-header">
          <div class="container">
            <div class="product-info">
              <div class="product-main">
                <div class="product-icon">
                  <el-icon>
                    <component :is="getProductIcon(product.category)" />
                  </el-icon>
                </div>
                <div class="product-details">
                  <div class="product-category">{{ getCategoryLabel(product.category) }}</div>
                  <h1 class="product-title">{{ product.title }}</h1>
                  <p class="product-description">{{ product.description }}</p>

                  <div class="product-meta">
                    <div class="meta-item">
                      <el-rate
                        v-model="product.rating"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value} 分"
                      />
                    </div>
                    <div class="meta-item">
                      <el-icon><View /></el-icon>
                      <span>{{ formatNumber(product.views) }} 次浏览</span>
                    </div>
                    <div class="meta-item">
                      <el-icon><Download /></el-icon>
                      <span>{{ formatNumber(product.usage) }} 次使用</span>
                    </div>
                    <div class="meta-item">
                      <el-icon><Calendar /></el-icon>
                      <span>更新于 {{ formatDate(product.updateTime) }}</span>
                    </div>
                  </div>

                  <div class="product-tags">
                    <el-tag v-for="tag in product.tags" :key="tag" class="tag">
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <div class="product-action">
                <div class="price-info">
                  <div class="price">{{ product.price === 0 ? '免费' : `¥${product.price}` }}</div>
                  <div class="price-unit" v-if="product.price > 0">{{
                    product.priceUnit || '永久授权'
                  }}</div>
                </div>
                <div class="action-buttons">
                  <el-button type="primary" size="large" @click="handleUse">
                    {{ product.price === 0 ? '立即使用' : '立即购买' }}
                  </el-button>
                  <el-button size="large" @click="handleConsult">咨询客服</el-button>
                  <el-button size="large" @click="handleDemo">申请试用</el-button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 产品详细信息 -->
        <section class="product-content">
          <div class="container">
            <el-tabs v-model="activeTab" class="product-tabs">
              <!-- 产品介绍 -->
              <el-tab-pane label="产品介绍" name="introduction">
                <div class="tab-content">
                  <div class="content-section">
                    <h3>产品概述</h3>
                    <p>{{ product.fullDescription || product.description }}</p>
                  </div>

                  <div class="content-section">
                    <h3>核心功能</h3>
                    <div class="features-grid">
                      <div
                        v-for="feature in product.features"
                        :key="feature.title"
                        class="feature-item"
                      >
                        <div class="feature-icon">
                          <el-icon>
                            <Star />
                          </el-icon>
                        </div>
                        <div class="feature-info">
                          <h4>{{ feature.title }}</h4>
                          <p>{{ feature.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="content-section">
                    <h3>技术规格</h3>
                    <div class="specs-table">
                      <div v-for="spec in product.specifications" :key="spec.name" class="spec-row">
                        <div class="spec-name">{{ spec.name }}</div>
                        <div class="spec-value">{{ spec.value }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 使用案例 -->
              <el-tab-pane label="使用案例" name="cases">
                <div class="tab-content">
                  <div class="cases-grid">
                    <div v-for="case_ in product.cases" :key="case_.title" class="case-item">
                      <div class="case-header">
                        <h4>{{ case_.title }}</h4>
                        <span class="case-industry">{{ case_.industry }}</span>
                      </div>
                      <p class="case-description">{{ case_.description }}</p>
                      <div class="case-results">
                        <div v-for="result in case_.results" :key="result" class="result-item">
                          <el-icon><CircleCheck /></el-icon>
                          <span>{{ result }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 服务支持 -->
              <el-tab-pane label="服务支持" name="support">
                <div class="tab-content">
                  <div class="support-grid">
                    <div class="support-item">
                      <div class="support-icon">
                        <el-icon><Headset /></el-icon>
                      </div>
                      <h4>技术支持</h4>
                      <p>提供专业的技术支持团队，7x24小时在线服务</p>
                    </div>
                    <div class="support-item">
                      <div class="support-icon">
                        <el-icon><Document /></el-icon>
                      </div>
                      <h4>文档资料</h4>
                      <p>详细的API文档、使用手册和最佳实践指南</p>
                    </div>
                    <div class="support-item">
                      <div class="support-icon">
                        <el-icon><School /></el-icon>
                      </div>
                      <h4>培训服务</h4>
                      <p>定期举办线上线下培训，帮助快速上手</p>
                    </div>
                    <div class="support-item">
                      <div class="support-icon">
                        <el-icon><Tools /></el-icon>
                      </div>
                      <h4>定制开发</h4>
                      <p>根据特殊需求提供定制化开发服务</p>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 评价反馈 -->
              <el-tab-pane label="评价反馈" name="reviews">
                <div class="tab-content">
                  <div class="reviews-summary">
                    <div class="rating-overview">
                      <div class="rating-score">{{ product.rating }}</div>
                      <div class="rating-info">
                        <el-rate v-model="product.rating" disabled />
                        <div class="rating-count">基于 {{ product.reviewCount || 156 }} 条评价</div>
                      </div>
                    </div>
                  </div>

                  <div class="reviews-list">
                    <div v-for="review in product.reviews" :key="review.id" class="review-item">
                      <div class="review-header">
                        <el-avatar :size="40">{{ review.user.charAt(0) }}</el-avatar>
                        <div class="review-info">
                          <div class="review-user">{{ review.user }}</div>
                          <div class="review-meta">
                            <el-rate v-model="review.rating" disabled size="small" />
                            <span class="review-date">{{ formatDate(review.date) }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="review-content">{{ review.content }}</div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </section>

        <!-- 服务商信息 -->
        <section class="provider-section">
          <div class="container">
            <div class="provider-card">
              <div class="provider-info">
                <el-avatar :size="60" :src="product.provider.avatar">
                  {{ product.provider.name.charAt(0) }}
                </el-avatar>
                <div class="provider-details">
                  <h3>{{ product.provider.name }}</h3>
                  <p>{{ product.provider.description || '专业的技术服务提供商' }}</p>
                  <div class="provider-stats">
                    <span>成立时间：{{ product.provider.founded || '2020年' }}</span>
                    <span>服务客户：{{ product.provider.clients || '1000+' }}</span>
                    <span>技术专家：{{ product.provider.experts || '50+' }}</span>
                  </div>
                </div>
              </div>
              <div class="provider-actions">
                <el-button @click="handleContactProvider">联系服务商</el-button>
                <el-button @click="handleViewMore">查看更多产品</el-button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 加载状态 -->
      <div v-else class="loading-container">
        <el-skeleton :loading="loading" animated>
          <template #template>
            <div class="container">
              <el-skeleton-item variant="h1" style="width: 60%; margin-bottom: 20px" />
              <el-skeleton-item variant="p" style="width: 80%; margin-bottom: 10px" />
              <el-skeleton-item variant="p" style="width: 70%; margin-bottom: 20px" />
              <el-skeleton :rows="5" animated />
            </div>
          </template>
        </el-skeleton>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <img src="@/assets/imgs/logo.png" alt="TCWYIRS" />
              <span>泰城万业信息资源共享平台</span>
            </div>
          </div>
          <div class="footer-section">
            <h4>产品服务</h4>
            <ul>
              <li>智能要素超市</li>
              <li>数字化解决方案</li>
              <li>技术咨询服务</li>
              <li>平台运维支持</li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>关于我们</h4>
            <ul>
              <li>公司介绍</li>
              <li>发展历程</li>
              <li>企业文化</li>
              <li>联系我们</li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>服务支持</h4>
            <ul>
              <li>帮助中心</li>
              <li>技术支持</li>
              <li>意见反馈</li>
              <li>服务条款</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 泰城万业信息资源共享平台 版权所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  View,
  Download,
  Calendar,
  Star,
  CircleCheck,
  Headset,
  Document,
  School,
  Tools,
  Monitor,
  Cpu,
  Connection,
  Lock,
  Phone,
  Setting
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'MarketplaceDetail' })

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(true)
const product = ref<any>(null)
const activeTab = ref('introduction')

// 模拟产品详细数据
const productDetails = {
  '1': {
    id: '1',
    title: '智能数据库管理系统',
    description: '高效的数据库管理和优化工具，支持多种数据库类型，提供可视化管理界面和性能监控功能',
    fullDescription:
      '这是一款专为企业级应用设计的智能数据库管理系统，集成了先进的AI算法和机器学习技术，能够自动优化数据库性能，预测潜在问题，并提供智能化的解决方案。系统支持MySQL、PostgreSQL、Oracle等主流数据库，提供统一的管理界面和API接口。',
    category: 'database',
    rating: 4.8,
    views: 12340,
    usage: 2340,
    price: 0,
    priceUnit: '永久免费',
    provider: {
      name: '数据科技有限公司',
      avatar: '',
      description: '专注于数据库技术研发的高新技术企业，拥有10年数据库管理经验',
      founded: '2014年',
      clients: '2000+',
      experts: '80+'
    },
    tags: ['MySQL', 'PostgreSQL', '监控', '优化', 'AI智能'],
    updateTime: '2024-03-15',
    features: [
      {
        title: '多数据库支持',
        description: '支持MySQL、PostgreSQL、Oracle、SQL Server等主流数据库'
      },
      {
        title: '智能优化',
        description: '基于AI算法自动分析和优化数据库性能，提升查询效率'
      },
      {
        title: '可视化监控',
        description: '实时监控数据库状态，提供直观的图表和报告'
      },
      {
        title: '安全管理',
        description: '多层次的安全防护机制，确保数据安全和访问控制'
      }
    ],
    specifications: [
      { name: '支持数据库', value: 'MySQL 5.7+, PostgreSQL 10+, Oracle 11g+' },
      { name: '操作系统', value: 'Linux, Windows, macOS' },
      { name: '部署方式', value: '本地部署, 云端部署, 混合部署' },
      { name: '并发连接', value: '最大10000个并发连接' },
      { name: 'API接口', value: 'REST API, GraphQL' }
    ],
    cases: [
      {
        title: '某大型电商平台数据库优化',
        industry: '电子商务',
        description:
          '为某知名电商平台提供数据库性能优化服务，通过智能分析和优化，显著提升了系统性能。',
        results: ['查询性能提升80%', '系统响应时间减少60%', '存储成本降低30%']
      },
      {
        title: '金融机构核心系统改造',
        industry: '金融服务',
        description: '协助某银行完成核心业务系统的数据库架构升级和性能优化。',
        results: ['系统稳定性提升95%', '交易处理能力增加3倍', '运维成本减少50%']
      }
    ],
    reviews: [
      {
        id: '1',
        user: '技术总监李先生',
        rating: 5,
        date: '2024-03-10',
        content:
          '非常好用的数据库管理工具，界面简洁，功能强大。AI优化功能特别实用，为我们节省了大量的运维时间。'
      },
      {
        id: '2',
        user: 'DBA张女士',
        rating: 4,
        date: '2024-03-08',
        content: '监控功能很棒，能够及时发现性能瓶颈。不过希望能增加更多的数据库类型支持。'
      },
      {
        id: '3',
        user: '系统架构师王先生',
        rating: 5,
        date: '2024-03-05',
        content: '部署简单，使用方便。智能优化建议很准确，帮助我们解决了很多复杂的性能问题。'
      }
    ],
    reviewCount: 156
  }
  // 可以添加更多产品详情...
}

const categories = [
  { label: '全部', value: 'all' },
  { label: '数据管理', value: 'database' },
  { label: '云计算', value: 'cloud' },
  { label: '人工智能', value: 'ai' },
  { label: '物联网', value: 'iot' },
  { label: '区块链', value: 'blockchain' },
  { label: '大数据', value: 'bigdata' },
  { label: '网络安全', value: 'security' },
  { label: '移动开发', value: 'mobile' }
]

// 计算属性
const productId = computed(() => route.params.id as string)

// 方法
const goHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToMarketplace = () => {
  router.push('/marketplace')
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getCategoryLabel = (category: string) => {
  const found = categories.find((c) => c.value === category)
  return found ? found.label : category
}

const getProductIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    database: Monitor,
    cloud: Monitor,
    ai: Cpu,
    iot: Connection,
    blockchain: Lock,
    bigdata: Setting,
    security: Lock,
    mobile: Phone
  }
  return iconMap[category] || Setting
}

const handleUse = () => {
  ElMessage.info('请登录后使用此功能')
}

const handleConsult = () => {
  ElMessage.info('客服功能开发中...')
}

const handleDemo = () => {
  ElMessage.info('试用申请功能开发中...')
}

const handleContactProvider = () => {
  ElMessage.info('联系服务商功能开发中...')
}

const handleViewMore = () => {
  goToMarketplace()
}

// 生命周期
onMounted(() => {
  // 模拟加载数据
  setTimeout(() => {
    const details = productDetails[productId.value as keyof typeof productDetails]
    if (details) {
      product.value = details
    } else {
      // 如果没有找到产品详情，创建一个默认的
      product.value = {
        id: productId.value,
        title: '产品详情',
        description: '产品描述信息...',
        category: 'ai',
        rating: 4.5,
        views: 1000,
        usage: 500,
        price: 199,
        provider: {
          name: '技术服务商',
          avatar: ''
        },
        tags: ['智能', '高效'],
        updateTime: '2024-03-15',
        features: [],
        specifications: [],
        cases: [],
        reviews: []
      }
    }
    loading.value = false
  }, 1000)
})
</script>

<style scoped lang="scss">
.marketplace-detail {
  min-height: 100vh;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

// 顶部导航栏
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
  }

  .logo-section {
    display: flex;
    align-items: center;
    cursor: pointer;

    .logo {
      width: 40px;
      height: 40px;
      margin-right: 12px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }
  }

  .nav-menu {
    display: flex;
    gap: 32px;

    .nav-item {
      color: #666;
      font-size: 16px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover,
      &.active {
        color: #409eff;
      }
    }
  }
}

// 面包屑导航
.breadcrumb-section {
  background: #f5f5f5;
  padding: 16px 0;

  .breadcrumb {
    .breadcrumb-item {
      color: #666;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #409eff;
      }

      &.active {
        color: #1a1a1a;
        cursor: default;
      }
    }

    .breadcrumb-separator {
      color: #999;
      margin: 0 8px;
    }
  }
}

// 产品基本信息
.product-header {
  padding: 40px 0;
  background: #fafafa;

  .product-info {
    display: flex;
    gap: 40px;
    align-items: flex-start;

    .product-main {
      flex: 1;
      display: flex;
      gap: 24px;

      .product-icon {
        width: 80px;
        height: 80px;
        background: #409eff;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .el-icon {
          color: #fff;
          font-size: 40px;
        }
      }

      .product-details {
        flex: 1;

        .product-category {
          font-size: 14px;
          color: #409eff;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .product-title {
          font-size: 32px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .product-description {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .product-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          margin-bottom: 20px;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: #666;

            .el-icon {
              font-size: 16px;
            }
          }
        }

        .product-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .tag {
            background: #409eff;
            color: #fff;
            border: none;
          }
        }
      }
    }

    .product-action {
      width: 300px;
      background: #fff;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

      .price-info {
        text-align: center;
        margin-bottom: 24px;

        .price {
          font-size: 32px;
          font-weight: 600;
          color: #409eff;
          line-height: 1;
        }

        .price-unit {
          font-size: 14px;
          color: #999;
          margin-top: 4px;
        }
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .el-button {
          width: 100%;
        }
      }
    }
  }
}

// 产品详细内容
.product-content {
  padding: 60px 0;

  .product-tabs {
    :deep(.el-tabs__nav-wrap::after) {
      background: #e6e6e6;
    }

    :deep(.el-tabs__active-bar) {
      background: #409eff;
    }

    :deep(.el-tabs__item.is-active) {
      color: #409eff;
      font-weight: 600;
    }
  }

  .tab-content {
    padding: 40px 0;

    .content-section {
      margin-bottom: 40px;

      h3 {
        font-size: 24px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 20px;
      }

      p {
        font-size: 16px;
        color: #666;
        line-height: 1.6;
        margin-bottom: 16px;
      }
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;

      .feature-item {
        display: flex;
        gap: 16px;
        padding: 24px;
        background: #fafafa;
        border-radius: 8px;

        .feature-icon {
          width: 48px;
          height: 48px;
          background: #409eff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          .el-icon {
            color: #fff;
            font-size: 24px;
          }
        }

        .feature-info {
          h4 {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
          }

          p {
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            margin: 0;
          }
        }
      }
    }

    .specs-table {
      .spec-row {
        display: flex;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .spec-name {
          width: 200px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .spec-value {
          flex: 1;
          color: #666;
        }
      }
    }

    .cases-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 32px;

      .case-item {
        padding: 32px;
        background: #fff;
        border: 1px solid #e6e6e6;
        border-radius: 8px;

        .case-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          h4 {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
          }

          .case-industry {
            background: #409eff;
            color: #fff;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
          }
        }

        .case-description {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .case-results {
          .result-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 14px;

            .el-icon {
              color: #67c23a;
              font-size: 16px;
            }
          }
        }
      }
    }

    .support-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;

      .support-item {
        text-align: center;
        padding: 32px 20px;

        .support-icon {
          width: 80px;
          height: 80px;
          background: #409eff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;

          .el-icon {
            color: #fff;
            font-size: 32px;
          }
        }

        h4 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        p {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }
      }
    }

    .reviews-summary {
      margin-bottom: 32px;
      padding: 32px;
      background: #fafafa;
      border-radius: 8px;

      .rating-overview {
        display: flex;
        align-items: center;
        gap: 24px;

        .rating-score {
          font-size: 48px;
          font-weight: 600;
          color: #409eff;
        }

        .rating-info {
          .rating-count {
            font-size: 14px;
            color: #666;
            margin-top: 8px;
          }
        }
      }
    }

    .reviews-list {
      .review-item {
        padding: 24px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .review-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;

          .review-info {
            .review-user {
              font-size: 16px;
              font-weight: 500;
              color: #1a1a1a;
              margin-bottom: 4px;
            }

            .review-meta {
              display: flex;
              align-items: center;
              gap: 12px;

              .review-date {
                font-size: 12px;
                color: #999;
              }
            }
          }
        }

        .review-content {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        }
      }
    }
  }
}

// 服务商信息
.provider-section {
  background: #f8f9fa;
  padding: 40px 0;

  .provider-card {
    background: #fff;
    border-radius: 8px;
    padding: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .provider-info {
      display: flex;
      align-items: center;
      gap: 24px;

      .provider-details {
        h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        p {
          font-size: 14px;
          color: #666;
          margin-bottom: 12px;
        }

        .provider-stats {
          display: flex;
          gap: 24px;
          font-size: 12px;
          color: #999;
        }
      }
    }

    .provider-actions {
      display: flex;
      gap: 12px;
    }
  }
}

// 页脚
.footer {
  background: #1a1a1a;
  color: #fff;
  padding: 60px 0 20px;

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    span {
      font-weight: 600;
    }
  }

  .footer-section {
    h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        font-size: 14px;
        color: #ccc;
        margin-bottom: 8px;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #409eff;
        }
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid #333;
    padding-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #999;
  }
}

// 加载状态
.loading-container {
  padding: 60px 0;
}

// 响应式设计
@media (max-width: 768px) {
  .header .nav-menu {
    display: none;
  }

  .product-header .product-info {
    flex-direction: column;

    .product-action {
      width: 100%;
    }

    .product-main {
      flex-direction: column;
      text-align: center;

      .product-details {
        .product-meta {
          justify-content: center;
        }
      }
    }
  }

  .provider-section .provider-card {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
}
</style>
