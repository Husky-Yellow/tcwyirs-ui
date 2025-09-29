# 用户认证功能技术规范

## 1. 项目类型
Web应用程序 - 基于Vue 3的企业级管理后台系统

## 2. 核心技术栈

### 2.1 前端技术
- **框架**：Vue 3.3.8 (Composition API)
- **构建工具**：Vite 4.5.0
- **编程语言**：TypeScript 5.2.2
- **UI组件库**：Element Plus 2.4.2
- **状态管理**：Pinia 2.1.7
- **路由管理**：Vue Router 4.2.5
- **HTTP客户端**：Axios 1.6.0+

### 2.2 后端技术
- **框架**：Spring Boot 2.7.x
- **安全框架**：Spring Security 5.7.x
- **数据库**：MySQL 8.0
- **缓存**：Redis 6.2
- **认证令牌**：JWT (JSON Web Token)

### 2.3 开发工具
- **代码检查**：ESLint 8.54.0+
- **样式检查**：Stylelint 15.11.0+
- **代码格式化**：Prettier 3.1.0+
- **包管理**：pnpm 8.6.0+

## 3. 应用架构

### 3.1 整体架构
```
┌─────────────────────────────────────────────────────────┐
│                     前端应用层                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ Vue3 +  │  │Element  │  │ TypeScript│ │  Vite   │     │
│  │ 框架    │  │  Plus   │  │          │ │         │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
├─────────────────────────────────────────────────────────┤
│                     认证服务层                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │JWT令牌  │  │密码加密 │  │权限验证 │  │会话管理 │     │
│  │ 管理    │  │ BCrypt  │  │ RBAC    │  │ Redis   │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
├─────────────────────────────────────────────────────────┤
│                     业务逻辑层                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │用户管理 │  │角色管理 │  │权限管理 │  │登录日志 │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
├─────────────────────────────────────────────────────────┤
│                     数据存储层                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │MySQL    │  │Redis    │  │文件存储 │  │日志存储 │     │
│  │ 数据库  │  │ 缓存    │  │ 系统    │  │ 系统    │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 3.2 前端架构设计

#### 3.2.1 目录结构
```
src/
├── api/                          # API接口层
│   ├── auth/                     # 认证相关API
│   │   ├── login.ts             # 登录接口
│   │   ├── logout.ts            # 登出接口
│   │   ├── password.ts          # 密码管理接口
│   │   └── index.ts             # 导出文件
├── stores/                       # 状态管理
│   ├── modules/
│   │   ├── auth.ts              # 认证状态管理
│   │   ├── user.ts              # 用户信息管理
│   │   └── permission.ts        # 权限管理
├── composables/                  # 组合式函数
│   ├── useAuth.ts               # 认证相关逻辑
│   ├── usePermission.ts         # 权限相关逻辑
│   └── useUser.ts               # 用户相关逻辑
├── components/                   # 组件库
│   ├── Auth/                    # 认证相关组件
│   │   ├── LoginForm.vue        # 登录表单
│   │   ├── PasswordForm.vue    # 密码修改表单
│   │   └── ResetPassword.vue    # 密码重置组件
├── views/                       # 页面组件
│   ├── Auth/                    # 认证页面
│   │   ├── Login.vue            # 登录页面
│   │   └── ResetPassword.vue   # 密码重置页面
├── router/                      # 路由配置
│   ├── guards/                  # 路由守卫
│   │   ├── auth.ts             # 认证守卫
│   │   └── permission.ts       # 权限守卫
└── utils/                       # 工具函数
    ├── auth.ts                  # 认证工具
    ├── token.ts                 # 令牌管理
    └── permission.ts            # 权限工具
```

#### 3.2.2 状态管理设计
```typescript
// stores/modules/auth.ts
interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  permissions: string[]
  roles: string[]
  isLoggedIn: boolean
  loginTime: number | null
}

interface AuthActions {
  login(credentials: LoginCredentials): Promise<void>
  logout(): Promise<void>
  refreshToken(): Promise<void>
  checkAuth(): Promise<boolean>
  updateUserInfo(user: User): void
  updatePermissions(permissions: string[]): void
}
```

### 3.3 后端架构设计

#### 3.3.1 服务层架构
```java
// 认证服务接口
public interface AuthService {
    LoginResult login(LoginRequest request);
    void logout(String token);
    TokenRefreshResult refreshToken(String refreshToken);
    boolean validateToken(String token);
    UserInfo getUserInfo(String token);
}

// 用户服务接口
public interface UserService {
    User getUserById(Long id);
    User getUserByUsername(String username);
    void updateUser(User user);
    void changePassword(PasswordChangeRequest request);
    void resetPassword(PasswordResetRequest request);
}

// 权限服务接口
public interface PermissionService {
    List<String> getUserPermissions(Long userId);
    List<String> getUserRoles(Long userId);
    boolean hasPermission(Long userId, String permission);
    boolean hasRole(Long userId, String role);
}
```

#### 3.3.2 数据库设计
```sql
-- 用户表
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    status TINYINT DEFAULT 1,
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 角色表
CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    status TINYINT DEFAULT 1,
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 权限表
CREATE TABLE sys_permission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    type TINYINT NOT NULL,
    parent_id BIGINT,
    path VARCHAR(255),
    component VARCHAR(255),
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 用户角色关联表
CREATE TABLE sys_user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES sys_user(id),
    FOREIGN KEY (role_id) REFERENCES sys_role(id)
);

-- 角色权限关联表
CREATE TABLE sys_role_permission (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES sys_role(id),
    FOREIGN KEY (permission_id) REFERENCES sys_permission(id)
);
```

## 4. 技术实现方案

### 4.1 前端实现

#### 4.1.1 认证状态管理
```typescript
// stores/modules/auth.ts
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: null,
    permissions: [],
    roles: [],
    isLoggedIn: false,
    loginTime: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    hasPermission: (state) => (permission: string) =>
      state.permissions.includes(permission),
    hasRole: (state) => (role: string) =>
      state.roles.includes(role)
  },

  actions: {
    async login(credentials: LoginCredentials) {
      try {
        const response = await authApi.login(credentials)
        this.token = response.token
        this.refreshToken = response.refreshToken
        this.user = response.user
        this.permissions = response.permissions
        this.roles = response.roles
        this.isLoggedIn = true
        this.loginTime = Date.now()

        // 存储到本地存储
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)

        return response
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        if (this.token) {
          await authApi.logout(this.token)
        }
      } finally {
        this.clearAuth()
      }
    },

    clearAuth() {
      this.token = null
      this.refreshToken = null
      this.user = null
      this.permissions = []
      this.roles = []
      this.isLoggedIn = false
      this.loginTime = null

      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  }
})
```

#### 4.1.2 路由守卫实现
```typescript
// router/guards/auth.ts
export function setupAuthGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // 检查是否需要认证
    if (to.meta.requiresAuth !== false) {
      if (!authStore.isAuthenticated) {
        // 未登录，跳转到登录页
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
        return
      }

      // 检查令牌是否过期
      if (isTokenExpired(authStore.token)) {
        try {
          // 尝试刷新令牌
          await authStore.refreshToken()
        } catch (error) {
          // 刷新失败，清除认证信息并跳转登录
          authStore.clearAuth()
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
          return
        }
      }
    }

    next()
  })
}
```

#### 4.1.3 权限控制实现
```typescript
// composables/usePermission.ts
export function usePermission() {
  const authStore = useAuthStore()

  const hasPermission = (permission: string): boolean => {
    return authStore.hasPermission(permission)
  }

  const hasRole = (role: string): boolean => {
    return authStore.hasRole(role)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  return {
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions
  }
}
```

### 4.2 后端实现

#### 4.2.1 JWT令牌管理
```java
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userDetails.getUsername());
        claims.put("authorities", userDetails.getAuthorities());
        return createToken(claims, userDetails.getUsername());
    }

    public String generateRefreshToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
```

#### 4.2.2 认证过滤器
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

        String token = getTokenFromRequest(request);

        if (token != null && tokenProvider.validateToken(token)) {
            String username = tokenProvider.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (userDetails != null) {
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

#### 4.2.3 密码加密
```java
@Component
public class PasswordEncoder {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    public boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }

    public boolean upgradeEncoding(String encodedPassword) {
        return encoder.upgradeEncoding(encodedPassword);
    }
}
```

## 5. 安全实现

### 5.1 密码安全策略
- **加密算法**：使用BCrypt，成本因子≥12
- **密码复杂度**：最少8位，包含字母和数字
- **密码历史**：不允许使用最近5次使用过的密码
- **密码过期**：90天强制修改密码

### 5.2 会话安全
- **令牌过期**：访问令牌1小时，刷新令牌7天
- **并发控制**：同一用户最多允许3个并发会话
- **安全退出**：登出时清除所有相关令牌

### 5.3 防护机制
- **登录限制**：连续失败5次锁定30分钟
- **验证码**：登录失败3次后要求验证码
- **IP限制**：异常IP地址登录需要额外验证
- **审计日志**：记录所有认证相关操作

## 6. 性能优化

### 6.1 缓存策略
- **用户信息缓存**：Redis缓存用户基本信息和权限
- **令牌缓存**：缓存有效令牌，减少数据库查询
- **权限缓存**：缓存用户权限列表，提高权限检查效率

### 6.2 数据库优化
- **索引优化**：为用户名、邮箱等查询字段建立索引
- **分页查询**：用户列表查询使用分页，避免全表扫描
- **连接池**：使用数据库连接池提高并发性能

## 7. 监控和日志

### 7.1 日志记录
- **登录日志**：记录登录时间、IP地址、用户代理
- **操作日志**：记录密码修改、权限变更等敏感操作
- **错误日志**：记录认证失败、令牌过期等错误信息

### 7.2 监控指标
- **登录成功率**：监控登录成功和失败的比例
- **响应时间**：监控认证接口的响应时间
- **并发用户数**：监控当前在线用户数量
- **错误率**：监控认证相关的错误率

## 8. 部署和配置

### 8.1 环境配置
```yaml
# application.yml
jwt:
  secret: ${JWT_SECRET:your-secret-key}
  expiration: 3600  # 1小时
  refresh-expiration: 604800  # 7天

spring:
  security:
    password:
      encoder:
        type: bcrypt
        strength: 12
  redis:
    host: ${REDIS_HOST:localhost}
    port: ${REDIS_PORT:6379}
    password: ${REDIS_PASSWORD:}
```

### 8.2 前端配置
```typescript
// config/auth.ts
export const authConfig = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiration: 3600 * 1000, // 1小时
  refreshTokenExpiration: 7 * 24 * 3600 * 1000, // 7天
  autoRefreshThreshold: 5 * 60 * 1000, // 5分钟
  maxRetryAttempts: 3
}
```

---

**文档版本**：1.0
**创建时间**：2025-01-25
**维护人员**：开发团队
**审核状态**：待审核
