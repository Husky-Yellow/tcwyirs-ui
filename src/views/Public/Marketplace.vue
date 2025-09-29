<template>
  <div class="marketplace">
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
      <!-- 页面标题区域 -->
      <section class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <span @click="goHome" class="breadcrumb-item">首页</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">智能要素超市</span>
          </div>
          <h1 class="page-title">智能要素超市</h1>
          <p class="page-subtitle">发现和使用优质的智能化解决方案</p>
        </div>
      </section>

      <!-- 搜索和筛选区域 -->
      <section class="search-section">
        <div class="container">
          <div class="search-bar">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索智能要素..."
              size="large"
              class="search-input"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-button type="primary" size="large" @click="handleSearch">搜索</el-button>
          </div>

          <!-- 筛选条件 -->
          <div class="filter-bar">
            <div class="filter-group">
              <span class="filter-label">分类：</span>
              <el-tag
                v-for="category in categories"
                :key="category.value"
                :class="{ active: selectedCategory === category.value }"
                class="filter-tag"
                @click="selectCategory(category.value)"
              >
                {{ category.label }}
              </el-tag>
            </div>
            <div class="filter-group">
              <span class="filter-label">排序：</span>
              <el-select v-model="sortBy" placeholder="选择排序方式" size="small">
                <el-option label="最新发布" value="latest" />
                <el-option label="最多使用" value="usage" />
                <el-option label="评分最高" value="rating" />
              </el-select>
            </div>
          </div>
        </div>
      </section>

      <!-- 产品列表区域 -->
      <section class="products-section">
        <div class="container">
          <div class="products-grid">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card"
              @click="goToDetail(product)"
            >
              <div class="card-header">
                <div class="product-icon">
                  <el-icon>
                    <component :is="getProductIcon(product.category)" />
                  </el-icon>
                </div>
                <div class="product-meta">
                  <span class="product-category">{{ getCategoryLabel(product.category) }}</span>
                  <div class="product-rating">
                    <el-rate
                      v-model="product.rating"
                      disabled
                      show-score
                      text-color="#ff9900"
                      score-template="{value}"
                      size="small"
                    />
                  </div>
                </div>
              </div>

              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-description">{{ product.description }}</p>

              <div class="product-stats">
                <div class="stat-item">
                  <el-icon><View /></el-icon>
                  <span>{{ formatNumber(product.views) }}次浏览</span>
                </div>
                <div class="stat-item">
                  <el-icon><Download /></el-icon>
                  <span>{{ formatNumber(product.usage) }}次使用</span>
                </div>
              </div>

              <div class="product-footer">
                <div class="product-provider">
                  <el-avatar :size="24" :src="product.provider.avatar">
                    {{ product.provider.name.charAt(0) }}
                  </el-avatar>
                  <span>{{ product.provider.name }}</span>
                </div>
                <div class="product-price">
                  <span class="price-label">{{
                    product.price === 0 ? '免费' : `¥${product.price}`
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="totalProducts"
              layout="total, prev, pager, next, jumper"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </section>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  View,
  Download,
  Monitor,
  Cpu,
  Connection,
  Lock,
  Phone,
  Setting
} from '@element-plus/icons-vue'

defineOptions({ name: 'Marketplace' })

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const selectedCategory = ref('all')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(12)

// 分类数据
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

// 产品数据
const products = ref([
  {
    id: '1',
    title: '智能数据库管理系统',
    description: '高效的数据库管理和优化工具，支持多种数据库类型，提供可视化管理界面和性能监控功能',
    category: 'database',
    rating: 4.8,
    views: 12340,
    usage: 2340,
    price: 0,
    provider: {
      name: '数据科技有限公司',
      avatar: ''
    },
    tags: ['MySQL', 'PostgreSQL', '监控', '优化'],
    updateTime: '2024-03-15'
  },
  {
    id: '2',
    title: '云计算弹性伸缩平台',
    description: '弹性可扩展的云计算解决方案，提供全面的基础设施即服务和平台即服务，支持自动伸缩',
    category: 'cloud',
    rating: 4.7,
    views: 9870,
    usage: 1890,
    price: 299,
    provider: {
      name: '云端科技',
      avatar: ''
    },
    tags: ['Docker', 'Kubernetes', '自动伸缩', 'CI/CD'],
    updateTime: '2024-03-10'
  },
  {
    id: '3',
    title: 'AI智能算法库',
    description: '丰富的AI算法集合，涵盖机器学习、深度学习等多个领域的前沿算法，提供API调用服务',
    category: 'ai',
    rating: 4.9,
    views: 15670,
    usage: 3210,
    price: 199,
    provider: {
      name: '人工智能研究院',
      avatar: ''
    },
    tags: ['机器学习', 'TensorFlow', 'PyTorch', 'API'],
    updateTime: '2024-03-20'
  },
  {
    id: '4',
    title: '物联网设备接入平台',
    description: '支持海量设备接入的物联网平台，提供设备管理、数据采集、远程控制等核心功能',
    category: 'iot',
    rating: 4.6,
    views: 8900,
    usage: 1650,
    price: 399,
    provider: {
      name: '物联网科技',
      avatar: ''
    },
    tags: ['MQTT', '设备管理', '数据采集', '远程控制'],
    updateTime: '2024-03-12'
  },
  {
    id: '5',
    title: '区块链开发框架',
    description: '开箱即用的区块链开发工具，简化智能合约开发和部署流程，支持多种区块链网络',
    category: 'blockchain',
    rating: 4.5,
    views: 5670,
    usage: 987,
    price: 599,
    provider: {
      name: '区块链实验室',
      avatar: ''
    },
    tags: ['智能合约', 'Ethereum', 'Solidity', 'Web3'],
    updateTime: '2024-03-08'
  },
  {
    id: '6',
    title: '大数据实时分析平台',
    description: '强大的大数据处理和分析平台，支持实时数据流处理和批量数据分析，提供可视化报表',
    category: 'bigdata',
    rating: 4.8,
    views: 11200,
    usage: 2750,
    price: 799,
    provider: {
      name: '大数据科技',
      avatar: ''
    },
    tags: ['Spark', 'Kafka', '实时处理', '可视化'],
    updateTime: '2024-03-18'
  },
  {
    id: '7',
    title: '网络安全防护系统',
    description: '全方位的网络安全解决方案，提供威胁检测、防护和应急响应能力，保护企业数字资产',
    category: 'security',
    rating: 4.7,
    views: 7890,
    usage: 1320,
    price: 999,
    provider: {
      name: '网络安全公司',
      avatar: ''
    },
    tags: ['威胁检测', '防火墙', '入侵检测', '应急响应'],
    updateTime: '2024-03-14'
  },
  {
    id: '8',
    title: '跨平台移动应用开发套件',
    description: '跨平台移动应用开发解决方案，支持iOS、Android等多个平台，一次开发多端部署',
    category: 'mobile',
    rating: 4.6,
    views: 9450,
    usage: 2100,
    price: 199,
    provider: {
      name: '移动开发工作室',
      avatar: ''
    },
    tags: ['React Native', 'Flutter', '跨平台', '一键部署'],
    updateTime: '2024-03-16'
  }
])

// 计算属性
const filteredProducts = computed(() => {
  let filtered = products.value

  // 分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((product) => product.category === selectedCategory.value)
  }

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.tags.some((tag) => tag.toLowerCase().includes(keyword))
    )
  }

  // 排序
  switch (sortBy.value) {
    case 'usage':
      filtered = filtered.sort((a, b) => b.usage - a.usage)
      break
    case 'rating':
      filtered = filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'latest':
    default:
      filtered = filtered.sort(
        (a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
      )
  }

  return filtered
})

const totalProducts = computed(() => filteredProducts.value.length)

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

const goToDetail = (product: any) => {
  router.push(`/marketplace/detail/${product.id}`)
}

const handleSearch = () => {
  currentPage.value = 1
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
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
</script>

<style scoped lang="scss">
.marketplace {
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

// 页面标题区域
.page-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 0;

  .breadcrumb {
    margin-bottom: 16px;

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

  .page-title {
    font-size: 36px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .page-subtitle {
    font-size: 16px;
    color: #666;
  }
}

// 搜索筛选区域
.search-section {
  padding: 32px 0;
  background: #fafafa;

  .search-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;

    .search-input {
      flex: 1;
      max-width: 600px;
    }
  }

  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;

    .filter-group {
      display: flex;
      align-items: center;
      gap: 12px;

      .filter-label {
        font-weight: 500;
        color: #666;
        white-space: nowrap;
      }

      .filter-tag {
        cursor: pointer;
        transition: all 0.3s;

        &:hover,
        &.active {
          background: #409eff;
          color: #fff;
          border-color: #409eff;
        }
      }
    }
  }
}

// 产品列表区域
.products-section {
  padding: 40px 0 80px;

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }

  .product-card {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #f0f0f0;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
      border-color: #409eff;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .product-icon {
        width: 48px;
        height: 48px;
        background: #409eff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-icon {
          color: #fff;
          font-size: 24px;
        }
      }

      .product-meta {
        text-align: right;

        .product-category {
          display: block;
          font-size: 12px;
          color: #409eff;
          font-weight: 500;
          margin-bottom: 4px;
        }
      }
    }

    .product-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .product-description {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #999;

        .el-icon {
          font-size: 14px;
        }
      }
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;

      .product-provider {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #666;
      }

      .product-price {
        .price-label {
          font-size: 16px;
          font-weight: 600;
          color: #409eff;
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
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

// 响应式设计
@media (max-width: 768px) {
  .header .nav-menu {
    display: none;
  }

  .search-section .filter-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .products-section .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
