<template>
  <div class="homepage">
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
            <span class="nav-item" @click="goToMarketplace">智能要素超市</span>
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
      <!-- Hero区域 -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <h1 class="hero-title"> 芯连万物 共创万物智联时代 </h1>
              <p class="hero-subtitle">
                聚集海量智能要素，共建数字化生态平台，引领未来科技发展新方向
              </p>
              <el-button type="primary" size="large" @click="goToMarketplace">
                智能要素超市
              </el-button>
            </div>
            <div class="hero-visual">
              <div class="hero-icon-stack">
                <el-icon class="hero-icon">
                  <Monitor />
                </el-icon>
                <el-icon class="hero-icon">
                  <Connection />
                </el-icon>
                <el-icon class="hero-icon">
                  <Cpu />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 统计数据区域 -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-wrapper">
            <div class="stat-item">
              <div class="stat-number">3,500</div>
              <div class="stat-label">智能要素</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1500</div>
              <div class="stat-label">服务商家</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">850</div>
              <div class="stat-label">解决方案</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">650</div>
              <div class="stat-label">成功案例</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 优质资源共享区域 -->
      <section class="resources-section">
        <div class="container">
          <h2 class="section-title">优质资源共享</h2>
          <div class="resources-grid">
            <div
              v-for="(resource, index) in resources"
              :key="index"
              class="resource-card"
              @click="goToDetail(resource)"
            >
              <div class="card-icon">
                <el-icon>
                  <Cpu />
                </el-icon>
              </div>
              <h3 class="card-title">{{ resource.title }}</h3>
              <p class="card-description">{{ resource.description }}</p>
              <div class="card-stats">
                <span class="stat">{{ resource.usage }}次调用</span>
                <span class="rating">⭐ {{ resource.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 应用场景区域 -->
      <section class="scenarios-section">
        <div class="container">
          <h2 class="section-title">应用场景</h2>
          <div class="scenarios-grid">
            <div class="scenario-item">
              <h3>政务数字化升级</h3>
              <p
                >基于先进的数字化技术和解决方案，助力政府机关提升行政效率，优化公共服务体验，推动政务服务向智能化、便民化方向发展</p
              >
            </div>
            <div class="scenario-item">
              <h3>民营企业发展</h3>
              <p
                >为中小企业和民营企业提供全方位的数字化转型支持，从技术咨询到方案实施，助力企业降低成本，提升竞争力，实现可持续发展</p
              >
            </div>
            <div class="scenario-item">
              <h3>产业数字化转型</h3>
              <p
                >深度整合产业资源，构建完整的数字化产业生态链，推动传统产业与数字技术深度融合，催生新业态、新模式，引领产业升级</p
              >
            </div>
            <div class="scenario-item">
              <h3>普惠民生服务</h3>
              <p
                >运用科技手段优化民生服务流程，提升公共服务质量和效率，让数字化红利惠及更多民众，构建智慧城市服务新生态</p
              >
            </div>
          </div>
        </div>
      </section>

      <!-- CTA区域 -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2>立即体验，拥抱数字化智能转型时代</h2>
            <el-button type="primary" size="large" @click="goToMarketplace">
              智能要素超市
            </el-button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Monitor, Connection, Cpu } from '@element-plus/icons-vue'

defineOptions({ name: 'Homepage' })

const router = useRouter()

// 资源数据
const resources = ref([
  {
    id: '1',
    title: '数据库管理工具',
    description: '高效的数据库管理和优化工具，支持多种数据库类型，提供可视化管理界面',
    usage: 2340,
    rating: 4.8
  },
  {
    id: '2',
    title: '云计算平台服务',
    description: '弹性可扩展的云计算解决方案，提供全面的基础设施即服务和平台即服务',
    usage: 1890,
    rating: 4.7
  },
  {
    id: '3',
    title: '人工智能算法库',
    description: '丰富的AI算法集合，涵盖机器学习、深度学习等多个领域的前沿算法',
    usage: 3210,
    rating: 4.9
  },
  {
    id: '4',
    title: '物联网接入平台',
    description: '支持海量设备接入的物联网平台，提供设备管理、数据采集等核心功能',
    usage: 1650,
    rating: 4.6
  },
  {
    id: '5',
    title: '区块链开发框架',
    description: '开箱即用的区块链开发工具，简化智能合约开发和部署流程',
    usage: 987,
    rating: 4.5
  },
  {
    id: '6',
    title: '大数据分析平台',
    description: '强大的大数据处理和分析平台，支持实时数据流处理和批量数据分析',
    usage: 2750,
    rating: 4.8
  },
  {
    id: '7',
    title: '网络安全防护系统',
    description: '全方位的网络安全解决方案，提供威胁检测、防护和应急响应能力',
    usage: 1320,
    rating: 4.7
  },
  {
    id: '8',
    title: '移动应用开发平台',
    description: '跨平台移动应用开发解决方案，支持iOS、Android等多个平台',
    usage: 2100,
    rating: 4.6
  },
  {
    id: '9',
    title: '企业协作办公工具',
    description: '现代化的企业协作平台，集成即时通讯、文档协作、项目管理等功能',
    usage: 1780,
    rating: 4.4
  },
  {
    id: '10',
    title: '智能客服机器人',
    description: '基于自然语言处理的智能客服系统，提供7x24小时自动化客户服务',
    usage: 2890,
    rating: 4.7
  },
  {
    id: '11',
    title: '电商运营分析工具',
    description: '专为电商平台设计的数据分析工具，提供销售分析、用户行为分析等功能',
    usage: 1540,
    rating: 4.5
  },
  {
    id: '12',
    title: '智慧城市管理平台',
    description: '综合性的智慧城市解决方案，整合城市各类资源，提升城市管理效率',
    usage: 876,
    rating: 4.8
  }
])

// 路由导航方法
const goHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToMarketplace = () => {
  router.push('/marketplace')
}

const goToDetail = (resource: any) => {
  router.push(`/marketplace/detail/${resource.id}`)
}
</script>

<style scoped lang="scss">
.homepage {
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

      &:hover {
        color: #409eff;
      }
    }
  }
}

// Hero区域
.hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 80px 0;

  .hero-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 60px;
  }

  .hero-text {
    flex: 1;

    .hero-title {
      font-size: 48px;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.2;
      margin-bottom: 20px;
    }

    .hero-subtitle {
      font-size: 18px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 32px;
    }
  }

  .hero-visual {
    flex-shrink: 0;

    .hero-icon-stack {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .hero-icon {
      font-size: 64px;
      color: #409eff;
      opacity: 0.8;
    }
  }
}

// 统计数据区域
.stats-section {
  background: #409eff;
  color: #fff;
  padding: 40px 0;

  .stats-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .stat-item {
    text-align: center;

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
  }
}

// 资源区域
.resources-section {
  padding: 80px 0;
  background: #fafafa;

  .section-title {
    text-align: center;
    font-size: 36px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 60px;
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .resource-card {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .card-icon {
      width: 48px;
      height: 48px;
      background: #409eff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;

      .el-icon {
        color: #fff;
        font-size: 24px;
      }
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 8px;
    }

    .card-description {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 16px;
    }

    .card-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #999;
    }
  }
}

// 应用场景区域
.scenarios-section {
  padding: 80px 0;

  .scenarios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
  }

  .scenario-item {
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 16px;
    }

    p {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
    }
  }
}

// CTA区域
.cta-section {
  background: #f8f9fa;
  padding: 60px 0;
  text-align: center;

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 32px;
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

  .hero-section .hero-content {
    flex-direction: column;
    text-align: center;

    .hero-title {
      font-size: 36px;
    }
  }

  .stats-section .stats-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .resources-section .resources-grid {
    grid-template-columns: 1fr;
  }
}
</style>
