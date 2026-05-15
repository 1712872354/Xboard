# Xboard Go 语言重构计划（含前后端完整方案）

## 一、项目现状分析

### 1.1 技术栈对比

| 组件 | PHP/Laravel 现状 | Go 重构目标 |
|------|------------------|------------|
| 后端框架 | Laravel 12 + Octane | Gin/Gofiber + 自定义框架 |
| 数据库 | MySQL/SQLite | MySQL/SQLite (保持兼容) |
| 缓存 | Redis | Redis + 内存缓存 |
| 队列 | Horizon (Laravel Queue) | Asynq 或自定义任务队列 |
| 认证 | Laravel Sanctum | JWT + 自定义中间件 |
| 管理后台前端 | React + Shadcn UI | 保持 React 或使用 Vue3 + Element Plus |
| 用户前端 | Vue3 + TypeScript | 保持 Vue3 不变 |
| 部署 | Docker Compose | Docker Compose |

### 1.2 核心模块概览

从 [CODE_WIKI.md](file:///workspace/CODE_WIKI.md) 中分析得到，项目包含以下核心模块：

1. **HTTP 层** (V1/V2 API) - 30+ 个控制器
2. **数据模型** - 25+ 个数据表
3. **服务层** - 20+ 个核心服务
4. **协议实现** - 10+ 种订阅协议
5. **插件系统** - Hook机制 + 插件管理器
6. **定时任务** - 10+ 种周期性任务
7. **前端** - 管理后台 + 用户前端

---

## 二、Go 技术选型（后端）

### 2.1 核心框架选择

| 功能 | 推荐库 | 说明 |
|------|--------|------|
| Web 框架 | `gin-gonic/gin` | 高性能路由，学习曲线平缓 |
| ORM | `gorm.io/gorm` | 最流行的 Go ORM，迁移友好 |
| 缓存 | `go-redis/redis` + `go-cache` | Redis + 本地内存缓存 |
| 队列 | `hibiken/asynq` | Redis 驱动的任务队列，功能完善 |
| JWT 认证 | `golang-jwt/jwt/v5` | 标准 JWT 实现 |
| 配置管理 | `spf13/viper` | 多格式配置支持 |
| 日志 | `uber-go/zap` | 高性能结构化日志 |
| 定时任务 | `robfig/cron/v3` | Cron 表达式支持 |
| 数据库迁移 | `pressly/goose` | 数据库迁移工具 |
| 环境变量 | `joho/godotenv` | .env 文件支持 |
| 参数验证 | `go-playground/validator/v10` | 强大的数据验证 |

### 2.2 项目架构设计

```
xboard-go/
├── cmd/                      # 入口文件
│   ├── api/                 # API 服务入口
│   ├── worker/              # 队列 Worker 入口
│   └── migrate/             # 数据库迁移工具
├── internal/                # 核心代码
│   ├── api/                 # API 层
│   │   ├── handler/         # 控制器
│   │   ├── middleware/      # 中间件
│   │   ├── dto/             # 数据传输对象
│   │   └── response/        # 响应结构
│   ├── domain/              # 领域层（核心业务逻辑）
│   │   ├── model/           # 数据模型
│   │   ├── repository/      # 数据仓库
│   │   ├── service/         # 业务服务
│   │   └── protocol/        # 协议生成
│   ├── plugin/              # 插件系统
│   │   ├── hook/            # Hook 机制
│   │   └── manager/         # 插件管理
│   ├── queue/               # 队列系统
│   │   ├── job/             # 任务定义
│   │   └── worker/          # Worker 处理
│   └── pkg/                 # 工具包
│       ├── config/          # 配置
│       ├── cache/           # 缓存
│       ├── database/        # 数据库
│       └── utils/           # 工具函数
├── migrations/              # 数据库迁移
├── plugins/                 # 插件目录
├── themes/                  # 主题目录
├── frontend/                # 前端代码
│   ├── admin/               # 管理后台
│   └── user/                # 用户前端
├── config/                  # 配置文件
├── storage/                 # 存储目录
├── .env.example
├── go.mod
├── go.sum
└── Dockerfile
```

---

## 三、前端技术选型与重构策略

### 3.1 技术选择分析

| 方案 | 管理后台 | 用户前端 | 优势 | 劣势 |
|------|---------|---------|------|------|
| **方案 A** | 保持现有 React + Shadcn UI | 保持现有 Vue3 + TypeScript | 无需重新设计 UI，开发快 | 两套技术栈，维护成本高 |
| **方案 B** | 重构为 Vue3 + Element Plus | 保持现有 Vue3 + TypeScript | 统一技术栈，易维护 | 需要重写管理后台 |
| **方案 C** | 保持 React + 迁移到 Next.js | 保持 Vue3 + Nuxt.js | 现代化架构，SSR 支持 | 复杂度增加 |

**推荐方案：B (Vue3 + Element Plus 统一)**

### 3.2 前端技术栈（推荐方案）

| 功能 | 库 | 说明 |
|------|----|------|
| 框架 | Vue 3 + TypeScript | 统一技术栈 |
| UI 库 | Element Plus | 管理后台组件库 |
| 状态管理 | Pinia | 轻量级状态管理 |
| 路由 | Vue Router 4 | Vue 官方路由 |
| HTTP 客户端 | Axios | HTTP 请求 |
| 构建工具 | Vite 5 | 快速构建 |
| 表单验证 | VeeValidate | 强大的表单验证 |
| 图表 | ECharts | 数据可视化 |

### 3.3 管理后台功能模块

```
frontend/admin/
├── src/
│   ├── api/              # API 接口
│   ├── assets/           # 静态资源
│   ├── components/       # 通用组件
│   ├── composables/      # 组合式函数
│   ├── layouts/          # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型
│   ├── utils/            # 工具函数
│   ├── views/            # 页面视图
│   │   ├── auth/         # 登录/认证
│   │   ├── dashboard/    # 仪表板
│   │   ├── user/         # 用户管理
│   │   ├── plan/         # 套餐管理
│   │   ├── server/       # 节点管理
│   │   │   ├── group/    # 节点分组
│   │   │   ├── route/    # 路由规则
│   │   │   ├── manage/   # 节点管理
│   │   │   └── machine/  # 机器管理
│   │   ├── order/        # 订单管理
│   │   ├── payment/      # 支付管理
│   │   ├── coupon/       # 优惠券
│   │   ├── giftcard/     # 礼品卡
│   │   ├── ticket/       # 工单管理
│   │   ├── notice/       # 公告管理
│   │   ├── knowledge/    # 知识库
│   │   ├── stats/        # 统计报表
│   │   ├── config/       # 系统配置
│   │   ├── mail/         # 邮件模板
│   │   ├── plugin/       # 插件管理
│   │   └── system/       # 系统状态
│   ├── App.vue
│   └── main.ts
├── public/
├── index.html
├── vite.config.ts
└── package.json
```

### 3.4 API 兼容性保证

**关键原则：保持 API 完全兼容**

```typescript
// frontend/admin/src/api/types.ts
// 响应格式保持一致
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

// 前端不感知后端语言变化
export class ApiClient {
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.http.get<T>(url, { params });
  }
  
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.http.post<T>(url, data);
  }
}
```

---

## 四、数据库层重构

### 4.1 数据模型映射

| PHP 模型 | Go 结构体 | 文件位置 |
|----------|-----------|---------|
| `App\Models\User` | `User` | `internal/domain/model/user.go` |
| `App\Models\Plan` | `Plan` | `internal/domain/model/plan.go` |
| `App\Models\Order` | `Order` | `internal/domain/model/order.go` |
| `App\Models\Server` | `Server` | `internal/domain/model/server.go` |
| ... | ... | ... |

**示例：User 模型转换**

```go
// internal/domain/model/user.go
package model

import "time"

type User struct {
    ID               int        `json:"id" gorm:"primaryKey;autoIncrement"`
    Email            string     `json:"email" gorm:"uniqueIndex;size:64"`
    Password         string     `json:"-" gorm:"size:64"`
    PasswordAlgo     *string    `json:"-" gorm:"size:10"`
    PasswordSalt     *string    `json:"-" gorm:"size:10"`
    UUID             string     `json:"uuid" gorm:"size:36"`
    Token            string     `json:"-" gorm:"size:32"`
    InviteUserID     *int       `json:"invite_user_id"`
    PlanID           *int       `json:"plan_id"`
    GroupID          *int       `json:"group_id"`
    TransferEnable   int64      `json:"transfer_enable"`
    SpeedLimit       *int       `json:"speed_limit"`
    U                int64      `json:"u"`
    D                int64      `json:"d"`
    Banned           bool       `json:"banned"`
    RemindExpire     int8       `json:"remind_expire" gorm:"default:1"`
    RemindTraffic    int8       `json:"remind_traffic" gorm:"default:1"`
    ExpiredAt        *int64     `json:"expired_at"`
    Balance          int        `json:"balance" gorm:"default:0"`
    CommissionBalance int        `json:"commission_balance" gorm:"default:0"`
    CommissionRate   float64    `json:"commission_rate"`
    CommissionType   int8       `json:"commission_type" gorm:"default:0"`
    DeviceLimit      *int       `json:"device_limit"`
    Discount         *int       `json:"discount"`
    LastLoginAt      *int64     `json:"last_login_at"`
    ParentID         *int       `json:"parent_id"`
    IsAdmin          bool       `json:"is_admin" gorm:"default:false"`
    NextResetAt      *int64     `json:"next_reset_at"`
    LastResetAt      *int64     `json:"last_reset_at"`
    TelegramID       *int64     `json:"telegram_id"`
    ResetCount       int        `json:"reset_count" gorm:"default:0"`
    CreatedAt        int64      `json:"created_at"`
    UpdatedAt        int64      `json:"updated_at"`
    
    // 关联
    InviteUser  *User       `json:"invite_user,omitempty" gorm:"foreignKey:InviteUserID"`
    Plan        *Plan       `json:"plan,omitempty" gorm:"foreignKey:PlanID"`
    Group       *ServerGroup `json:"group,omitempty" gorm:"foreignKey:GroupID"`
    Orders      []Order     `json:"orders,omitempty" gorm:"foreignKey:UserID"`
}

// 表名
func (User) TableName() string {
    return "v2_user"
}

// 业务方法
func (u *User) IsActive() bool {
    if u.Banned {
        return false
    }
    if u.PlanID == nil {
        return false
    }
    if u.ExpiredAt != nil && *u.ExpiredAt < time.Now().Unix() {
        return false
    }
    return true
}
```

### 4.2 Repository 模式

使用 Repository 模式封装数据库操作：

```go
// internal/domain/repository/user.go
package repository

import (
    "context"
    "gorm.io/gorm"
    "xboard-go/internal/domain/model"
)

type UserRepository interface {
    Create(ctx context.Context, user *model.User) error
    GetByID(ctx context.Context, id int) (*model.User, error)
    GetByEmail(ctx context.Context, email string) (*model.User, error)
    Update(ctx context.Context, user *model.User) error
    GetAvailableUsers(ctx context.Context) ([]*model.User, error)
    GetUsersByGroup(ctx context.Context, groupID int) ([]*model.User, error)
}

type userRepository struct {
    db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
    return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *model.User) error {
    return r.db.WithContext(ctx).Create(user).Error
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*model.User, error) {
    var user model.User
    err := r.db.WithContext(ctx).Where("email = ?", email).First(&user).Error
    if err != nil {
        return nil, err
    }
    return &user, nil
}
```

---

## 五、API 层重构

### 5.1 路由结构设计

**保持 API 完全兼容**，保持原有的路由结构不变：

```
/api/v1/                    # V1 API (向后兼容)
/api/v2/                    # V2 API (管理员)
```

### 5.2 中间件实现

| Laravel 中间件 | Go 实现 | 位置 |
|--------------|---------|------|
| `Authenticate` | JWT认证中间件 | `internal/api/middleware/auth.go` |
| `Admin` | 管理员权限验证 | `internal/api/middleware/admin.go` |
| `User` | 用户权限验证 | `internal/api/middleware/user.go` |
| `ForceJson` | 强制JSON响应 | `internal/api/middleware/json.go` |
| `Language` | 多语言 | `internal/api/middleware/i18n.go` |
| `RequestLog` | 请求日志 | `internal/api/middleware/logger.go` |

**示例：JWT 认证中间件**

```go
// internal/api/middleware/auth.go
package middleware

import (
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
    "xboard-go/pkg/jwt"
)

func Auth() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        claims, err := jwt.ValidateToken(tokenString)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的令牌"})
            c.Abort()
            return
        }

        // 将用户信息存入上下文
        c.Set("user_id", claims.UserID)
        c.Set("is_admin", claims.IsAdmin)
        c.Next()
    }
}
```

### 5.3 控制器（Handler）转换

将原有 Controller 转换为 Gin Handler：

```go
// internal/api/handler/v1/user/order.go
package user

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
    "xboard-go/internal/domain/repository"
    "xboard-go/internal/domain/service"
)

type OrderHandler struct {
    orderService *service.OrderService
    userRepo     repository.UserRepository
}

func NewOrderHandler(orderService *service.OrderService, userRepo repository.UserRepository) *OrderHandler {
    return &OrderHandler{
        orderService: orderService,
        userRepo:     userRepo,
    }
}

func (h *OrderHandler) Create(c *gin.Context) {
    // 解析请求
    var req CreateOrderRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // 获取当前用户
    userID, _ := c.Get("user_id")
    
    // 创建订单
    order, err := h.orderService.Create(c.Request.Context(), userID.(int), req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "data": order,
    })
}
```

---

## 六、服务层重构

### 6.1 服务类映射

| PHP 服务 | Go 服务 |
|---------|---------|
| `UserService` | `service.UserService` |
| `ServerService` | `service.ServerService` |
| `OrderService` | `service.OrderService` |
| `CouponService` | `service.CouponService` |
| `TrafficResetService` | `service.TrafficResetService` |
| `PluginManager` | `plugin.Manager` |
| `HookManager` | `plugin.HookManager` |

### 6.2 UserService 实现示例

```go
// internal/domain/service/user.go
package service

import (
    "context"
    "xboard-go/internal/domain/model"
    "xboard-go/internal/domain/repository"
)

type UserService struct {
    userRepo repository.UserRepository
    planRepo repository.PlanRepository
    cache    cache.Cache
}

func NewUserService(userRepo repository.UserRepository, planRepo repository.PlanRepository) *UserService {
    return &UserService{
        userRepo: userRepo,
        planRepo: planRepo,
    }
}

func (s *UserService) GetAvailableServers(ctx context.Context, user *model.User) ([]*model.Server, error) {
    // 实现逻辑
    return nil, nil
}

func (s *UserService) GetUserTrafficInfo(ctx context.Context, userID int) (map[string]interface{}, error) {
    // 实现逻辑
    return nil, nil
}

func (s *UserService) CreateUser(ctx context.Context, data map[string]interface{}) (*model.User, error) {
    // 实现逻辑
    return nil, nil
}
```

---

## 七、协议生成模块重构

### 7.1 协议工厂模式

创建协议工厂统一处理不同协议的订阅生成：

```go
// internal/domain/protocol/factory.go
package protocol

import (
    "xboard-go/internal/domain/model"
)

type Protocol interface {
    Generate(user *model.User, servers []*model.Server) (string, error)
}

type ProtocolFactory struct {
    protocols map[string]Protocol
}

func NewProtocolFactory() *ProtocolFactory {
    f := &ProtocolFactory{
        protocols: make(map[string]Protocol),
    }
    f.registerProtocols()
    return f
}

func (f *ProtocolFactory) registerProtocols() {
    f.protocols["general"] = &GeneralProtocol{}
    f.protocols["clash"] = &ClashProtocol{}
    f.protocols["singbox"] = &SingBoxProtocol{}
    // ... 其他协议
}

func (f *ProtocolFactory) GetProtocol(name string) (Protocol, error) {
    p, ok := f.protocols[name]
    if !ok {
        return nil, errors.New("protocol not found")
    }
    return p, nil
}
```

### 7.2 具体协议实现

```go
// internal/domain/protocol/general.go
package protocol

import (
    "encoding/base64"
    "strings"
    "xboard-go/internal/domain/model"
)

type GeneralProtocol struct{}

func (p *GeneralProtocol) Generate(user *model.User, servers []*model.Server) (string, error) {
    var sb strings.Builder
    
    for _, server := range servers {
        uri := p.buildURI(user, server)
        sb.WriteString(uri)
        sb.WriteString("\n")
    }
    
    return base64.StdEncoding.EncodeToString([]byte(sb.String())), nil
}

func (p *GeneralProtocol) buildURI(user *model.User, server *model.Server) string {
    switch server.Type {
    case "vmess":
        return p.buildVmess(user, server)
    case "vless":
        return p.buildVless(user, server)
    case "trojan":
        return p.buildTrojan(user, server)
    case "shadowsocks":
        return p.buildShadowsocks(user, server)
    case "hysteria":
        return p.buildHysteria(user, server)
    // ... 其他协议
    }
    return ""
}
```

---

## 八、插件系统重构

### 8.1 Hook 机制

实现 Hook 系统，保持与原系统兼容：

```go
// internal/plugin/hook/manager.go
package hook

import (
    "sort"
    "sync"
)

type HookType string

const (
    ActionHook   HookType = "action"
    FilterHook   HookType = "filter"
)

type HookFunc func(payload interface{})
type FilterFunc func(payload interface{}, args ...interface{}) interface{}

type HookManager struct {
    actions map[string]map[int][]HookFunc
    filters map[string]map[int][]FilterFunc
    mu      sync.RWMutex
}

func NewHookManager() *HookManager {
    return &HookManager{
        actions: make(map[string]map[int][]HookFunc),
        filters: make(map[string]map[int][]FilterFunc),
    }
}

func (m *HookManager) RegisterAction(name string, priority int, fn HookFunc) {
    m.mu.Lock()
    defer m.mu.Unlock()
    
    if m.actions[name] == nil {
        m.actions[name] = make(map[int][]HookFunc)
    }
    m.actions[name][priority] = append(m.actions[name][priority], fn)
}

func (m *HookManager) RegisterFilter(name string, priority int, fn FilterFunc) {
    m.mu.Lock()
    defer m.mu.Unlock()
    
    if m.filters[name] == nil {
        m.filters[name] = make(map[int][]FilterFunc)
    }
    m.filters[name][priority] = append(m.filters[name][priority], fn)
}

func (m *HookManager) CallAction(name string, payload interface{}) {
    m.mu.RLock()
    defer m.mu.RUnlock()
    
    if hooks, ok := m.actions[name]; ok {
        // 按优先级排序
        priorities := make([]int, 0, len(hooks))
        for p := range hooks {
            priorities = append(priorities, p)
        }
        sort.Ints(priorities)
        
        for _, p := range priorities {
            for _, fn := range hooks[p] {
                fn(payload)
            }
        }
    }
}

func (m *HookManager) CallFilter(name string, payload interface{}, args ...interface{}) interface{} {
    m.mu.RLock()
    defer m.mu.RUnlock()
    
    result := payload
    
    if hooks, ok := m.filters[name]; ok {
        priorities := make([]int, 0, len(hooks))
        for p := range hooks {
            priorities = append(priorities, p)
        }
        sort.Ints(priorities)
        
        for _, p := range priorities {
            for _, fn := range hooks[p] {
                result = fn(result, args...)
            }
        }
    }
    
    return result
}
```

### 8.2 插件加载器

支持动态加载插件（使用 Go Plugin 或 WASM 或嵌入方式）：

```go
// internal/plugin/manager/manager.go
package manager

import (
    "plugin"
    "xboard-go/internal/plugin/hook"
)

type Plugin interface {
    Boot() error
    Install() error
    Uninstall() error
    GetCode() string
}

type PluginManager struct {
    hookMgr    *hook.HookManager
    plugins    map[string]Plugin
    pluginPath string
}

func NewPluginManager(hookMgr *hook.HookManager) *PluginManager {
    return &PluginManager{
        hookMgr:    hookMgr,
        plugins:    make(map[string]Plugin),
        pluginPath: "./plugins",
    }
}

func (m *PluginManager) LoadPlugin(code string) error {
    // 加载 .so 插件
    p, err := plugin.Open(m.pluginPath + "/" + code + ".so")
    if err != nil {
        return err
    }
    
    sym, err := p.Lookup("NewPlugin")
    if err != nil {
        return err
    }
    
    newPlugin, ok := sym.(func() Plugin)
    if !ok {
        return errors.New("invalid plugin")
    }
    
    plugin := newPlugin()
    m.plugins[code] = plugin
    return nil
}

func (m *PluginManager) EnablePlugin(code string) error {
    p, ok := m.plugins[code]
    if !ok {
        return errors.New("plugin not found")
    }
    return p.Boot()
}
```

---

## 九、队列任务系统重构

### 9.1 任务定义

```go
// internal/queue/job/traffic_fetch.go
package job

import (
    "context"
    "encoding/json"
    "github.com/hibiken/asynq"
    "xboard-go/internal/domain/service"
)

const TypeTrafficFetch = "traffic:fetch"

type TrafficFetchPayload struct {
    ServerID int
    Data     [][2]int64
    Protocol string
}

func NewTrafficFetchTask(serverID int, data [][2]int64, protocol string) (*asynq.Task, error) {
    payload, err := json.Marshal(TrafficFetchPayload{
        ServerID: serverID,
        Data:     data,
        Protocol: protocol,
    })
    if err != nil {
        return nil, err
    }
    return asynq.NewTask(TypeTrafficFetch, payload), nil
}

type TrafficFetchHandler struct {
    userService *service.UserService
}

func NewTrafficFetchHandler(userService *service.UserService) *TrafficFetchHandler {
    return &TrafficFetchHandler{
        userService: userService,
    }
}

func (h *TrafficFetchHandler) ProcessTask(ctx context.Context, t *asynq.Task) error {
    var p TrafficFetchPayload
    if err := json.Unmarshal(t.Payload(), &p); err != nil {
        return err
    }
    
    // 处理流量数据
    return h.userService.ProcessTrafficData(ctx, p.ServerID, p.Data, p.Protocol)
}
```

### 9.2 Worker 启动

```go
// cmd/worker/main.go
package main

import (
    "github.com/hibiken/asynq"
    "xboard-go/internal/queue/job"
)

func main() {
    // 初始化依赖
    srv := asynq.NewServer(
        asynq.RedisClientOpt{Addr: "localhost:6379"},
        asynq.Config{
            Concurrency: 10,
            Queues: map[string]int{
                "default": 10,
                "critical": 5,
            },
        },
    )

    mux := asynq.NewServeMux()
    // 注册处理器
    mux.Handle(job.TypeTrafficFetch, job.NewTrafficFetchHandler(userService))
    mux.Handle(job.TypeOrderHandle, job.NewOrderHandleHandler(orderService))
    mux.Handle(job.TypeSendEmail, job.NewSendEmailHandler(mailService))
    
    if err := srv.Run(mux); err != nil {
        panic(err)
    }
}
```

---

## 十、定时任务系统

```go
// internal/pkg/schedule/schedule.go
package schedule

import (
    "github.com/robfig/cron/v3"
    "xboard-go/internal/domain/service"
)

type Scheduler struct {
    cron *cron.Cron
}

func NewScheduler() *Scheduler {
    return &Scheduler{
        cron: cron.New(),
    }
}

func (s *Scheduler) RegisterTasks(orderService *service.OrderService, userService *service.UserService) error {
    // 每日统计
    _, err := s.cron.AddFunc("0 0 0 * *", func() {
        orderService.RunDailyStatistics()
    })
    if err != nil {
        return err
    }
    
    // 检查订单
    _, err = s.cron.AddFunc("0 */1 * * *", func() {
        orderService.CheckPendingOrders()
    })
    
    // 重置流量
    _, err = s.cron.AddFunc("0 */1 * * *", func() {
        userService.CheckTrafficReset()
    })
    
    return nil
}

func (s *Scheduler) Start() {
    s.cron.Start()
}

func (s *Scheduler) Stop() {
    s.cron.Stop()
}
```

---

## 十一、前端开发实施

### 11.1 管理后台页面映射

| 功能模块 | 原页面 | 新页面 |
|---------|--------|--------|
| 登录认证 | Auth | `views/auth/` |
| 仪表板 | Dashboard | `views/dashboard/` |
| 用户管理 | User | `views/user/` |
| 套餐管理 | Plan | `views/plan/` |
| 节点管理 | Server | `views/server/` |
| 订单管理 | Order | `views/order/` |
| 支付管理 | Payment | `views/payment/` |
| 优惠券 | Coupon | `views/coupon/` |
| 礼品卡 | GiftCard | `views/giftcard/` |
| 工单管理 | Ticket | `views/ticket/` |
| 公告管理 | Notice | `views/notice/` |
| 知识库 | Knowledge | `views/knowledge/` |
| 统计报表 | Stats | `views/stats/` |
| 系统配置 | Config | `views/config/` |
| 插件管理 | Plugin | `views/plugin/` |

### 11.2 UI 组件库对比

| React + Shadcn UI | Vue3 + Element Plus |
|------------------|--------------------|
| `<Button />` | `<el-button />` |
| `<Input />` | `<el-input />` |
| `<Table />` | `<el-table />` |
| `<Form />` | `<el-form />` |
| `<Dialog />` | `<el-dialog />` |
| `<Select />` | `<el-select />` |

### 11.3 主题系统

保持原有的主题配置系统：

```typescript
// frontend/admin/src/stores/theme.ts
import { defineStore } from 'pinia'

export interface ThemeConfig {
  themeColor: 'default' | 'blue' | 'black' | 'darkblue'
  backgroundUrl?: string
  customHtml?: string
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeConfig => ({
    themeColor: 'default',
    backgroundUrl: '',
    customHtml: '',
  }),
  
  actions: {
    async loadThemeConfig() {
      const config = await api.get('/api/v2/config/theme')
      this.$patch(config)
      this.applyTheme()
    },
    
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.themeColor)
    }
  }
})
```

---

## 十二、实施阶段划分

### 阶段 1：基础设施 (1-2 周)

- [ ] 后端：项目脚手架搭建
- [ ] 后端：配置和日志系统
- [ ] 后端：数据库连接和迁移
- [ ] 后端：基础中间件（认证、日志等）
- [ ] 前端：项目初始化（Vue3 + Vite）

### 阶段 2：核心模型和用户 API (2-3 周)

- [ ] 后端：实现所有数据模型
- [ ] 后端：Repository 层
- [ ] 后端：用户认证 API
- [ ] 后端：用户管理 API
- [ ] 后端：套餐管理 API
- [ ] 前端：登录认证页面
- [ ] 前端：仪表板页面
- [ ] 前端：用户管理页面

### 阶段 3：节点和订阅 (2 周)

- [ ] 后端：节点管理 API
- [ ] 后端：协议生成模块
- [ ] 后端：订阅 API
- [ ] 后端：流量上报处理
- [ ] 前端：节点管理页面
- [ ] 前端：分组/路由管理

### 阶段 4：订单和支付 (2 周)

- [ ] 后端：订单管理
- [ ] 后端：优惠券系统
- [ ] 后端：支付集成
- [ ] 后端：订单处理队列
- [ ] 前端：订单管理页面
- [ ] 前端：支付配置页面

### 阶段 5：插件系统 (2 周)

- [ ] 后端：Hook 机制
- [ ] 后端：插件加载器
- [ ] 后端：核心插件迁移
  - [ ] Telegram 插件
  - [ ] 支付宝插件
  - [ ] 其他支付插件
- [ ] 前端：插件管理页面

### 阶段 6：完整管理后台 (3 周)

- [ ] 后端：管理员认证
- [ ] 后端：统计和报表
- [ ] 后端：系统设置
- [ ] 后端：工单管理
- [ ] 后端：其他管理功能
- [ ] 前端：统计报表页面
- [ ] 前端：工单管理
- [ ] 前端：系统配置
- [ ] 前端：邮件模板
- [ ] 前端：流量重置

### 阶段 7：用户前端（可选）

如果需要也重构用户前端：
- [ ] 分析现有用户前端
- [ ] 保持 Vue3 或重构
- [ ] 确保 API 兼容

### 阶段 8：测试和优化 (2 周)

- [ ] 后端单元测试
- [ ] 后端集成测试
- [ ] 前端组件测试
- [ ] 端到端测试
- [ ] 性能优化
- [ ] 文档完善

---

## 十三、能否实现完全一致的复刻？

### 13.1 可行性分析

**是的，可以实现完全一致的复刻，包括：**

| 方面 | 复刻程度 | 说明 |
|------|---------|------|
| **API 接口** | 100% 兼容 | 保持相同的请求/响应格式 |
| **数据库** | 100% 兼容 | 使用相同的数据结构，可无缝迁移 |
| **管理后台 UI** | 100% 复刻 | 使用 Element Plus 可以完全还原 UI 和交互 |
| **用户体验** | 98%+ 一致 | 响应可能更快，其他体验一致 |
| **功能特性** | 100% 复刻 | 所有现有功能均可实现 |
| **插件系统** | 100% 兼容 | 保持相同的 Hook 机制 |

### 13.2 保持一致的关键策略

1. **API 优先原则**：先确保 API 完全兼容，再开发前端
2. **像素级还原**：使用设计稿或截图，确保 UI 1:1 还原
3. **行为一致**：所有交互、表单验证、错误提示保持一致
4. **主题兼容**：保持原有的主题配置系统
5. **渐进式迁移**：可以先只改后端，前端完全不变

---

## 十四、风险点与应对策略

### 14.1 主要风险

| 风险 | 影响 | 概率 | 应对策略 |
|------|------|------|---------|
| 数据库兼容性问题 | 高 | 中 | 使用 GORM 兼容层，充分测试 |
| API 接口不兼容 | 高 | 中 | 保持 API 路径和响应格式完全一致 |
| 插件系统复杂度过高 | 中 | 高 | 先实现核心插件，再逐步完善 |
| 前端 UI 还原度不够 | 中 | 中 | 仔细对比现有 UI，使用自动化测试 |
| 性能达不到预期 | 中 | 低 | 利用 Go 并发特性，使用缓存 |
| 迁移周期过长 | 中 | 低 | 分阶段交付，每个阶段可独立运行 |

### 14.2 迁移策略

**灰度发布方案：**

1. 第一阶段：Go 版本只处理订阅请求，其他走 PHP
2. 第二阶段：Go 处理用户 API，管理后台仍走 PHP
3. 第三阶段：完全迁移到 Go

---

## 十五、技术难点与解决方案

### 15.1 密码兼容性

**问题**：Laravel 的密码哈希与 Go 标准库不兼容

**解决方案**：
```go
import "golang.org/x/crypto/bcrypt"

func VerifyPassword(hashedPassword, password string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
    return err == nil
}
```

### 15.2 时间戳格式

**问题**：原系统使用 Unix 时间戳（秒），Go 默认时间格式

**解决方案**：统一使用 Unix 时间戳，保持数据兼容

### 15.3 JSON 字段处理

**问题**：Server 模型的 protocol_settings 是 JSON 字段

**解决方案**：
```go
type ProtocolSettings map[string]interface{}

// GORM 自定义扫描
func (p *ProtocolSettings) Scan(value interface{}) error {
    bytes, ok := value.([]byte)
    if !ok {
        return errors.New("invalid type")
    }
    return json.Unmarshal(bytes, p)
}

func (p ProtocolSettings) Value() (driver.Value, error) {
    return json.Marshal(p)
}
```

---

## 十六、依赖注入与依赖管理

### 16.1 使用 Wire 进行依赖注入

```go
// wire.go
//go:build wireinject
// +build wireinject

package main

import (
    "github.com/google/wire"
    "xboard-go/internal/api/handler"
    "xboard-go/internal/domain/repository"
    "xboard-go/internal/domain/service"
    "xboard-go/pkg/database"
)

func InitializeApp() (*App, error) {
    wire.Build(
        database.ProviderSet,
        repository.ProviderSet,
        service.ProviderSet,
        handler.ProviderSet,
        NewApp,
    )
    return &App{}, nil
}
```

---

## 十七、Docker 部署方案

```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/api ./cmd/api
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/worker ./cmd/worker

# 前端构建
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/admin/package*.json ./
RUN npm install
COPY frontend/admin/ ./
RUN npm run build

# 最终镜像
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /app/bin /app/bin
COPY --from=builder /app/migrations /app/migrations
COPY --from=builder /app/config /app/config
COPY --from=frontend-builder /frontend/dist /app/public/admin

EXPOSE 7001
CMD ["/app/bin/api"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "7001:7001"
    depends_on:
      - mysql
      - redis
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
  
  worker:
    build: .
    command: /app/bin/worker
    depends_on:
      - redis
  
  mysql:
    image: mysql:8.0
    volumes:
      - mysql_data:/var/lib/mysql
  
  redis:
    image: redis:7-alpine
  
volumes:
  mysql_data:
```

---

## 十八、成功标准

- [ ] 所有原有的 API 端点可正常工作
- [ ] 数据库完全兼容，可直接从 PHP 系统迁移
- [ ] 订阅生成与原系统一致
- [ ] 核心插件可正常使用
- [ ] **管理后台 UI 完全还原，用户无法区分差异**
- [ ] 性能优于或等于原系统（内存 < 500MB，响应 < 50ms）
- [ ] 完整的测试覆盖（单元测试 ≥ 70%，集成测试覆盖主要流程）
