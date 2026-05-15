# Xboard Code Wiki

## 项目概述

Xboard 是一个基于 Laravel 11 构建的现代化代理协议管理面板系统，支持多种代理协议的管理、用户订阅、订单处理、支付集成等功能。

## 技术栈

- **后端框架**: Laravel 11 + Octane
- **编程语言**: PHP 8.2+
- **数据库**: MySQL 5.7+ / SQLite
- **缓存**: Redis + Octane Cache
- **前端**: React + Shadcn UI (管理后台) / Vue3 + TypeScript (用户前端)
- **部署**: Docker + Docker Compose

---

## 项目架构

```
/workspace
├── app/                          # 应用核心代码
│   ├── Console/                  # 命令行命令
│   ├── Contracts/                # 契约/接口定义
│   ├── Exceptions/               # 异常处理
│   ├── Helpers/                  # 辅助函数
│   ├── Http/                     # HTTP层
│   │   ├── Controllers/          # 控制器 (V1/V2 API)
│   │   ├── Middleware/           # 中间件
│   │   ├── Requests/             # 表单请求验证
│   │   ├── Resources/            # API资源转换器
│   │   └── Routes/              # 路由定义
│   ├── Jobs/                     # 队列任务
│   ├── Models/                   # 数据模型
│   ├── Observers/                # 模型观察者
│   ├── Protocols/                # 代理协议实现
│   ├── Providers/                # 服务提供者
│   ├── Services/                 # 业务服务层
│   ├── Support/                  # 支持类
│   ├── Traits/                   # 可复用特性
│   ├── Utils/                    # 工具类
│   └── WebSocket/                # WebSocket处理
├── bootstrap/                    # 应用启动文件
├── config/                       # 配置文件
├── database/                     # 数据库相关
│   ├── factories/               # 模型工厂
│   ├── migrations/              # 数据库迁移
│   └── seeders/                 # 数据填充
├── plugins-core/                 # 核心插件
│   ├── AlipayF2f/               # 支付宝当面付
│   ├── Btcpay/                  # BTCPay
│   ├── CoinPayments/            # CoinPayments
│   ├── Coinbase/                # Coinbase
│   ├── Epay/                    # 易支付
│   ├── Mgateway/                # 支付网关
│   └── Telegram/                 # Telegram机器人
├── public/                       # 公开访问资源
├── resources/                    # 视图和语言文件
├── routes/                       # 路由定义
├── storage/                      # 存储目录
├── tests/                        # 测试文件
└── theme/                        # 主题文件
```

---

## 核心模块

### 1. HTTP层 (`app/Http/`)

#### 1.1 控制器 (`Controllers/`)

**V1 API 控制器**:

| 控制器 | 命名空间 | 职责 |
|--------|----------|------|
| `Passport/AuthController` | `App\Http\Controllers\V1\Passport` | 用户认证（登录/注册/重置密码） |
| `Passport/CommController` | `App\Http\Controllers\V1\Passport` | 认证公共功能（验证码/邮箱验证） |
| `User/UserController` | `App\Http\Controllers\V1\User` | 用户个人中心 |
| `User/ServerController` | `App\Http\Controllers\V1\User` | 用户节点管理 |
| `User/OrderController` | `App\Http\Controllers\V1\User` | 用户订单管理 |
| `User/PlanController` | `App\Http\Controllers\V1\User` | 用户套餐管理 |
| `User/TicketController` | `App\Http\Controllers\V1\User` | 用户工单管理 |
| `User/NoticeController` | `App\Http\Controllers\V1\User` | 公告查看 |
| `User/CouponController` | `App\Http\Controllers\V1\User` | 优惠券使用 |
| `User/GiftCardController` | `App\Http\Controllers\V1\User` | 礼品卡兑换 |
| `User/InviteController` | `App\Http\Controllers\V1\User` | 邀请码管理 |
| `User/StatController` | `App\Http\Controllers\V1\User` | 统计查看 |
| `User/TelegramController` | `App\Http\Controllers\V1\User` | Telegram绑定 |
| `User/KnowledgeController` | `App\Http\Controllers\V1\User` | 知识库 |
| `Client/ClientController` | `App\Http\Controllers\V1\Client` | 客户端订阅 |
| `Client/AppController` | `App\Http\Controllers\V1\Client` | APP配置获取 |
| `Server/*` | `App\Http\Controllers\V1\Server` | 节点服务回调 |
| `Guest/*` | `App\Http\Controllers\V1\Guest` | 公开接口（支付回调等） |

**V2 Admin API 控制器**:

| 控制器 | 命名空间 | 职责 |
|--------|----------|------|
| `Admin/UserController` | `App\Http\Controllers\V2\Admin` | 用户管理 |
| `Admin/PlanController` | `App\Http\Controllers\V2\Admin` | 套餐管理 |
| `Admin/OrderController` | `App\Http\Controllers\V2\Admin` | 订单管理 |
| `Admin/Server/ManageController` | `App\Http\Controllers\V2\Admin\Server` | 节点管理 |
| `Admin/Server/GroupController` | `App\Http\Controllers\V2\Admin\Server` | 节点分组 |
| `Admin/Server/RouteController` | `App\Http\Controllers\V2\Admin\Server` | 路由规则 |
| `Admin/Server/MachineController` | `App\Http\Controllers\V2\Admin\Server` | 机器管理 |
| `Admin/StatController` | `App\Http\Controllers\V2\Admin` | 统计分析 |
| `Admin/NoticeController` | `App\Http\Controllers\V2\Admin` | 公告管理 |
| `Admin/TicketController` | `App\Http\Controllers\V2\Admin` | 工单管理 |
| `Admin/CouponController` | `App\Http\Controllers\V2\Admin` | 优惠券管理 |
| `Admin/GiftCardController` | `App\Http\Controllers\V2\Admin` | 礼品卡管理 |
| `Admin/PaymentController` | `App\Http\Controllers\V2\Admin` | 支付方式管理 |
| `Admin/SystemController` | `App\Http\Controllers\V2\Admin` | 系统状态 |
| `Admin/ThemeController` | `App\Http\Controllers\V2\Admin` | 主题管理 |
| `Admin/ConfigController` | `App\Http\Controllers\V2\Admin` | 配置管理 |
| `Admin/PluginController` | `App\Http\Controllers\V2\Admin` | 插件管理 |
| `Admin/TrafficResetController` | `App\Http\Controllers\V2\Admin` | 流量重置管理 |
| `Admin/MailTemplateController` | `App\Http\Controllers\V2\Admin` | 邮件模板管理 |

#### 1.2 中间件 (`Middleware/`)

| 中间件 | 作用 |
|--------|------|
| `Admin` | 验证管理员权限 |
| `Authenticate` | 用户身份验证 |
| `User` | 用户认证中间件 |
| `Client` | 客户端访问验证（订阅） |
| `Staff` | 客服权限验证 |
| `Server` | 节点服务认证 |
| `ServerV2` | V2节点服务认证 |
| `ForceJson` | 强制JSON响应 |
| `Language` | 多语言处理 |
| `RequestLog` | 请求日志记录 |
| `InitializePlugins` | 插件初始化 |

#### 1.3 路由结构 (`Routes/`)

```
/api/v1/                    # V1 API
├── passport/              # 认证相关
├── client/               # 客户端订阅
├── user/                 # 用户接口
├── server/               # 节点回调
└── guest/                # 公开接口

/api/v2/                   # V2 Admin API
├── {admin_path}/         # 管理员路径（动态）
│   ├── config/          # 系统配置
│   ├── plan/            # 套餐管理
│   ├── server/          # 节点/分组/路由/机器
│   ├── order/           # 订单管理
│   ├── user/            # 用户管理
│   ├── stat/            # 统计分析
│   ├── notice/          # 公告管理
│   ├── ticket/          # 工单管理
│   ├── coupon/          # 优惠券
│   ├── gift-card/       # 礼品卡
│   ├── knowledge/       # 知识库
│   ├── payment/         # 支付方式
│   ├── system/          # 系统状态
│   ├── theme/           # 主题
│   ├── plugin/          # 插件
│   ├── mail/template/   # 邮件模板
│   └── traffic-reset/   # 流量重置
```

---

### 2. 数据模型 (`app/Models/`)

#### 2.1 核心模型

**User 模型** (`App\Models\User`)

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | int | 用户ID |
| `email` | string | 邮箱 |
| `password` | string | 密码（Hash） |
| `uuid` | string | 用户UUID |
| `token` | string | 邀请码 |
| `invite_user_id` | int | 邀请人ID |
| `plan_id` | int | 订阅ID |
| `group_id` | int | 权限组ID |
| `transfer_enable` | int | 流量上限（KB） |
| `speed_limit` | int | 限速（Mbps） |
| `u` | int | 上行流量 |
| `d` | int | 下行流量 |
| `banned` | bool | 是否封禁 |
| `expired_at` | int | 过期时间戳 |
| `balance` | int | 余额 |
| `commission_balance` | float | 佣金余额 |
| `commission_rate` | float | 返佣比例 |
| `device_limit` | int | 设备限制数 |
| `discount` | int | 折扣比例 |
| `telegram_id` | int | Telegram ID |
| `next_reset_at` | int | 下次流量重置时间 |
| `last_reset_at` | int | 上次流量重置时间 |
| `reset_count` | int | 流量重置次数 |

**关键方法**:
```php
// 用户状态检查
public function isActive(): bool           // 是否活跃
public function isAvailable(): bool        // 是否可用（有流量）
public function shouldResetTraffic(): bool // 是否需要重置流量

// 流量相关
public function getTotalUsedTraffic(): int   // 获取总使用流量
public function getRemainingTraffic(): int   // 获取剩余流量
public function getTrafficUsagePercentage(): float // 流量使用百分比
```

**Server 模型** (`App\Models\Server`)

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | int | 节点ID |
| `name` | string | 节点名称 |
| `type` | string | 服务类型 |
| `host` | string | 主机地址 |
| `port` | string/int | 端口 |
| `group_ids` | array | 分组IDs |
| `route_ids` | array | 路由IDs |
| `tags` | array | 标签 |
| `show` | bool | 是否显示 |
| `rate` | float | 流量倍率 |
| `rate_time_ranges` | array | 倍率时间范围 |
| `protocol_settings` | array | 协议设置 |
| `transfer_enable` | int | 流量上限 |
| `parent_id` | int | 父节点ID |
| `machine_id` | int | 机器ID |

**服务类型常量**:
```php
Server::TYPE_VMESS = 'vmess'
Server::TYPE_VLESS = 'vless'
Server::TYPE_TROJAN = 'trojan'
Server::TYPE_SHADOWSOCKS = 'shadowsocks'
Server::TYPE_HYSTERIA = 'hysteria'
Server::TYPE_TUIC = 'tuic'
Server::TYPE_ANYTLS = 'anytls'
Server::TYPE_SOCKS = 'socks'
Server::TYPE_HTTP = 'http'
Server::TYPE_MIERU = 'mieru'
```

#### 2.2 其他重要模型

| 模型 | 表名 | 说明 |
|------|------|------|
| `Plan` | `v2_plan` | 套餐 |
| `Order` | `v2_order` | 订单 |
| `Coupon` | `v2_coupon` | 优惠券 |
| `GiftCardTemplate` | `v2_gift_card_template` | 礼品卡模板 |
| `GiftCardCode` | `v2_gift_card_code` | 礼品卡码 |
| `InviteCode` | `v2_invite_code` | 邀请码 |
| `Notice` | `v2_notice` | 公告 |
| `Ticket` | `v2_ticket` | 工单 |
| `TicketMessage` | `v2_ticket_message` | 工单消息 |
| `ServerGroup` | `v2_server_group` | 节点分组 |
| `ServerRoute` | `v2_server_route` | 路由规则 |
| `ServerMachine` | `v2_server_machine` | 服务器机器 |
| `Stat` | `v2_stat` | 统计 |
| `StatServer` | `v2_stat_server` | 节点统计 |
| `StatUser` | `v2_stat_user` | 用户统计 |
| `Setting` | `v2_setting` | 系统设置 |
| `Plugin` | `v2_plugin` | 插件 |
| `TrafficResetLog` | `v2_traffic_reset_log` | 流量重置日志 |
| `MailTemplate` | `v2_mail_template` | 邮件模板 |

---

### 3. 服务层 (`app/Services/`)

#### 3.1 核心服务

**UserService** (`App\Services\UserService`)

用户管理核心服务。

```php
// 用户创建
public function createUser(array $data): User

// 用户可用性检查
public function isAvailable(User $user): bool

// 流量获取处理
public function trafficFetch(Server $server, string $protocol, array $data)

// 获取用户流量信息（含重置检查）
public function getUserTrafficInfo(User $user): array

// 设置用户计划
public function assignPlan(User $user, Plan $plan, int $validityDays): User

// 延长订阅
public function extendSubscription(User $user, int $days): User
```

**ServerService** (`App\Services\ServerService`)

节点管理核心服务。

```php
// 获取所有服务器
public static function getAllServers(): Collection

// 获取机器下所有节点
public static function getMachineNodes(ServerMachine $machine): Collection

// 获取用户可用节点
public static function getAvailableServers(User $user): array

// 获取节点可用用户
public static function getAvailableUsers(Server $node): Collection

// 处理节点流量上报
public static function processTraffic(Server $node, array $traffic): void

// 处理节点在线设备上报
public static function processAlive(int $nodeId, array $alive): void

// 处理节点连接数上报
public static function processOnline(Server $node, array $online): void

// 处理节点负载状态
public static function processStatus(Server $node, array $status): void

// 构建节点配置
public static function buildNodeConfig(Server $node): array

// 根据标识获取服务器
public static function getServer($serverId, ?string $serverType = null): Server|null
```

**OrderService** (`App\Services\OrderService`)

订单处理核心服务。

```php
// 从请求创建订单
public static function createFromRequest(
    User $user,
    Plan $plan,
    string $period,
    ?string $couponCode = null
): Order

// 开通订单
public function open(): void

// 支付回调
public function paid(string $callbackNo): bool

// 取消订单
public function cancel(): bool

// 设置订单类型
public function setOrderType(User $user): void

// 设置邀请返佣
public function setInvite(User $user): void

// 处理用户余额
protected function handleUserBalance(User $user, UserService $userService): void
```

**TrafficResetService** (`App\Services\TrafficResetService`)

流量重置服务。

```php
// 检查并执行流量重置
public function checkAndReset(User $user, string $source): void

// 执行流量重置
public function performReset(User $user, string $source): void

// 计算下次重置时间
public function calculateNextResetTime(User $user): ?Carbon
```

#### 3.2 辅助服务

| 服务 | 职责 |
|------|------|
| `AuthService` | 认证服务 |
| `LoginService` | 登录服务 |
| `RegisterService` | 注册服务 |
| `MailLinkService` | 邮箱链接服务 |
| `CouponService` | 优惠券服务 |
| `GiftCardService` | 礼品卡服务 |
| `PaymentService` | 支付服务 |
| `PlanService` | 套餐服务 |
| `SettingService` | 设置服务 |
| `StatisticalService` | 统计服务 |
| `TelegramService` | Telegram服务 |
| `ThemeService` | 主题服务 |
| `TicketService` | 工单服务 |
| `UpdateService` | 更新服务 |
| `CaptchaService` | 验证码服务 |
| `DeviceStateService` | 设备状态服务 |
| `NodeSyncService` | 节点同步服务 |
| `NodeRegistry` | 节点注册 |

---

### 4. 协议实现 (`app/Protocols/`)

协议生成器，用于生成客户端订阅配置。

| 协议类 | 说明 | 支持的协议 |
|--------|------|------------|
| `General` | 通用订阅（Base64） | VMess/VLESS/Trojan/SS/Hysteria/TUIC/SOCKS |
| `Clash` | Clash 格式 | 多种协议 |
| `ClashMeta` | Clash Meta 格式 | 多种协议（含Hysteria2） |
| `Shadowrocket` | Shadowrocket 格式 | 多种协议 |
| `QuantumultX` | Quantumult X 格式 | VMess/Trojan/SS |
| `Surge` | Surge 格式 | 多种协议 |
| `Loon` | Loon 格式 | 多种协议 |
| `SingBox` | SingBox JSON格式 | 多种协议 |
| `Stash` | Stash 格式 | 多种协议 |
| `Surfboard` | Surfboard 格式 | 多种协议 |

**关键方法**:
```php
// 生成订阅响应
public function handle(): Response

// 构建各协议链接
public static function buildVmess($uuid, $server): string
public static function buildVless($uuid, $server): string
public static function buildTrojan($password, $server): string
public static function buildShadowsocks($password, $server): string
public static function buildHysteria($password, $server): string
public static function buildTuic($password, $server): string
// ...其他协议
```

---

### 5. 插件系统 (`app/Services/Plugin/`)

#### 5.1 HookManager (`App\Services\Plugin\HookManager`)

插件钩子管理器，实现动作钩子和过滤器钩子。

```php
// 触发动作钩子
public static function call(string $hook, mixed $payload = null): void

// 触发过滤器钩子
public static function filter(string $hook, mixed $value, mixed ...$args): mixed

// 注册动作钩子
public static function register(string $hook, callable $callback, int $priority = 20): void

// 注册过滤器钩子
public static function registerFilter(string $hook, callable $callback, int $priority = 20): void

// 拦截响应（返回自定义响应）
public static function intercept(SymfonyResponse|string|array $response): never
```

**常用钩子**:
| 钩子名称 | 类型 | 说明 |
|----------|------|------|
| `traffic.process.before` | filter | 流量处理前 |
| `traffic.before_process` | filter | 流量处理前（兼容旧版） |
| `server.users.get` | filter | 获取节点用户列表 |
| `order.create.before` | action | 订单创建前 |
| `order.create.after` | action | 订单创建后 |
| `order.open.before` | action | 订单开通前 |
| `order.open.after` | action | 订单开通后 |
| `user.created` | action | 用户创建后 |

#### 5.2 PluginManager (`App\Services\Plugin\PluginManager`)

插件管理器，负责插件的安装、启用、禁用、卸载等。

```php
// 安装插件
public function install(string $pluginCode): bool

// 启用插件
public function enable(string $pluginCode): bool

// 禁用插件
public function disable(string $pluginCode): bool

// 卸载插件
public function uninstall(string $pluginCode): bool

// 删除插件
public function delete(string $pluginCode): bool

// 升级插件
public function update(string $pluginCode): bool

// 上传插件
public function upload($file): bool

// 初始化已启用插件
public function initializeEnabledPlugins(): void

// 注册插件定时任务
public function registerPluginSchedules(Schedule $schedule): void

// 获取已启用插件
public function getEnabledPlugins(): array

// 获取指定类型插件
public function getEnabledPluginsByType(string $type): array
```

#### 5.3 AbstractPlugin (`App\Services\Plugin\AbstractPlugin`)

插件基类，所有插件需继承此类。

```php
abstract class AbstractPlugin
{
    // 获取插件代码
    public function getCode(): string

    // 获取插件名称
    public function getName(): string

    // 获取配置值
    public function getConfig(string $key, $default = null)

    // 设置配置值
    public function setConfig(array $values)

    // 安装时调用
    public function install()

    // 更新时调用
    public function update(string $oldVersion, string $newVersion)

    // 启用时调用
    public function boot()

    // 禁用时调用
    public function cleanup()

    // 注册命令
    public function registerCommands()

    // 注册定时任务
    public function schedule(Schedule $schedule)
}
```

---

### 6. 队列任务 (`app/Jobs/`)

| 任务类 | 说明 |
|--------|------|
| `TrafficFetchJob` | 流量获取处理任务 |
| `OrderHandleJob` | 订单处理任务 |
| `SendEmailJob` | 发送邮件任务 |
| `SendTelegramJob` | 发送Telegram消息任务 |
| `StatServerJob` | 节点统计任务 |
| `StatUserJob` | 用户统计任务 |
| `NodeUserSyncJob` | 节点用户同步任务 |

---

### 7. 命令行 (`app/Console/Commands/`)

| 命令 | 说明 |
|------|------|
| `BackupDatabase` | 数据库备份 |
| `CheckCommission` | 检查佣金计算 |
| `CheckOrder` | 检查订单状态 |
| `CheckServer` | 检查节点状态 |
| `CheckTicket` | 检查工单状态 |
| `CheckTrafficExceeded` | 检查流量超限 |
| `CleanupOnlineStatus` | 清理在线状态 |
| `ClearUser` | 清理用户 |
| `MigrateFromV2b` | 从V2board迁移 |
| `NodeWebSocketServer` | 节点WebSocket服务 |
| `ResetLog` | 重置日志 |
| `ResetPassword` | 重置密码 |
| `ResetTraffic` | 重置流量 |
| `ResetUser` | 重置用户 |
| `SendRemindMail` | 发送提醒邮件 |
| `XboardInstall` | Xboard安装 |
| `XboardRollback` | Xboard回滚 |
| `XboardStatistics` | Xboard统计 |
| `XboardUpdate` | Xboard更新 |

**定时任务调度** (`app/Console/Kernel.php`):

```php
// 每日统计
$schedule->command('xboard:statistics')->dailyAt('0:10')->onOneServer();

// 每分钟检查
$schedule->command('check:order')->everyMinute()->onOneServer();
$schedule->command('check:commission')->everyMinute()->onOneServer();
$schedule->command('check:ticket')->everyMinute()->onOneServer();
$schedule->command('check:traffic-exceeded')->everyMinute()->onOneServer();

// 流量重置
$schedule->command('reset:traffic')->everyMinute()->onOneServer();

// 每日清理
$schedule->command('reset:log')->daily()->onOneServer();

// 邮件提醒
$schedule->command('send:remindMail', ['--force'])->dailyAt('11:30')->onOneServer();

// Horizon指标
$schedule->command('horizon:snapshot')->everyFiveMinutes()->onOneServer();

// 清理在线状态
$schedule->command('cleanup:online-status')->everyFiveMinutes()->onOneServer();
```

---

### 8. 观察者 (`app/Observers/`)

| 观察者 | 监听模型 | 说明 |
|--------|----------|------|
| `PlanObserver` | Plan | 套餐变化处理 |
| `ServerObserver` | Server | 节点变化处理 |
| `ServerRouteObserver` | ServerRoute | 路由变化处理 |
| `UserObserver` | User | 用户变化处理 |

---

### 9. 工具类 (`app/Utils/`)

| 工具类 | 职责 |
|--------|------|
| `Helper` | 通用辅助函数 |
| `CacheKey` | 缓存键生成 |
| `Dict` | 字典数据 |

---

## 依赖关系

### 服务依赖图

```
UserService
├── OrderService
│   ├── CouponService
│   ├── TrafficResetService
│   └── PlanService
├── TrafficResetService
└── Plugin/HookManager

ServerService
├── UserService
├── Plugin/HookManager
└── Plugin/HookManager

PluginManager
├── AbstractPlugin
└── HookManager

SettingService (全局单例)
└── 被所有服务使用
```

### 关键配置文件

| 文件 | 说明 |
|------|------|
| `config/app.php` | 应用配置 |
| `config/database.php` | 数据库配置 |
| `config/cache.php` | 缓存配置 |
| `config/queue.php` | 队列配置 |
| `config/mail.php` | 邮件配置 |
| `config/hidden_features.php` | 隐藏功能开关 |
| `config/theme.php` | 主题配置 |

---

## 核心流程

### 1. 用户订阅流程

```
1. 用户请求 GET /api/v1/client/subscribe?token=xxx
           ↓
2. Client 中间件验证 token
           ↓
3. ClientController.subscribe() 获取用户和可用节点
           ↓
4. 根据协议类型选择 Protocol 类
           ↓
5. Protocol.handle() 生成订阅响应
           ↓
6. 返回 Base64 编码的订阅信息
```

### 2. 订单创建流程

```
1. 用户 POST /api/v1/user/order
           ↓
2. OrderService::createFromRequest() 创建订单
           ↓
3. 验证套餐、检查优惠券、计算价格
           ↓
4. 保存订单记录
           ↓
5. 返回支付链接或直接使用余额
           ↓
6. 支付完成后回调 OrderService::paid()
           ↓
7. OrderHandleJob 处理订单
           ↓
8. OrderService::open() 开通服务
           ↓
9. 更新用户 plan_id、transfer_enable、expired_at
```

### 3. 节点流量上报流程

```
1. 节点 POST /api/v1/server/push
           ↓
2. Server 中间件验证节点认证
           ↓
3. ServerService::processTraffic() 处理流量
           ↓
4. 触发 TrafficFetchJob、StatUserJob、StatServerJob
           ↓
5. 更新用户 u/d 字段
           ↓
6. 记录统计数据
```

---

## 运行方式

### 开发环境

```bash
# 安装依赖
composer install

# 复制环境配置文件
cp .env.example .env

# 生成应用密钥
php artisan key:generate

# 运行数据库迁移
php artisan migrate

# 启动开发服务器
php artisan serve
```

### Docker 部署

```bash
# 快速启动（SQLite + Redis）
docker compose run -it --rm \
    -e ENABLE_SQLITE=true \
    -e ENABLE_REDIS=true \
    -e ADMIN_ACCOUNT=admin@demo.com \
    xboard php artisan xboard:install && \
docker compose up -d

# 标准启动（MySQL）
docker compose up -d
```

### Octane 模式

```bash
# 使用 Swoole
php artisan octane:start --server=swoole

# 使用 RoadRunner
php artisan octane:start --server=roadrunner
```

### Horizon 队列监控

```bash
# 启动队列监控
php artisan horizon

# 查看 Horizon 配置
config/horizon.php
```

---

## API 版本说明

### V1 API

V1 API 是传统的 API 版本，主要用于：
- 用户认证和注册
- 用户个人中心
- 客户端订阅
- 节点回调

### V2 API

V2 API 是管理后台使用的 API，主要用于：
- 管理员操作
- 系统配置
- 统计分析

---

## 数据库表前缀

所有数据表使用 `v2_` 前缀，主要表结构：

- `v2_user` - 用户表
- `v2_plan` - 套餐表
- `v2_order` - 订单表
- `v2_server` - 节点表
- `v2_server_group` - 节点分组表
- `v2_server_route` - 路由规则表
- `v2_server_machine` - 服务器机器表
- `v2_coupon` - 优惠券表
- `v2_ticket` - 工单表
- `v2_notice` - 公告表
- `v2_setting` - 设置表
- `v2_plugin` - 插件表
- `v2_stat` - 统计表
- `v2_mail_template` - 邮件模板表
