import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/components/Layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/Index.vue')
        },
        {
          path: 'user/list',
          name: 'UserList',
          component: () => import('@/views/user/List.vue')
        },
        {
          path: 'user/detail/:id',
          name: 'UserDetail',
          component: () => import('@/views/user/Detail.vue')
        },
        {
          path: 'plan/list',
          name: 'PlanList',
          component: () => import('@/views/plan/List.vue')
        },
        {
          path: 'plan/edit/:id?',
          name: 'PlanEdit',
          component: () => import('@/views/plan/Edit.vue')
        },
        {
          path: 'server/manage',
          name: 'ServerManage',
          component: () => import('@/views/server/Manage.vue')
        },
        {
          path: 'server/group',
          name: 'ServerGroup',
          component: () => import('@/views/server/Group.vue')
        },
        {
          path: 'server/route',
          name: 'ServerRoute',
          component: () => import('@/views/server/Route.vue')
        },
        {
          path: 'server/machine',
          name: 'ServerMachine',
          component: () => import('@/views/server/Machine.vue')
        },
        {
          path: 'order/list',
          name: 'OrderList',
          component: () => import('@/views/order/List.vue')
        },
        {
          path: 'order/detail/:id',
          name: 'OrderDetail',
          component: () => import('@/views/order/Detail.vue')
        },
        {
          path: 'payment',
          name: 'Payment',
          component: () => import('@/views/payment/Index.vue')
        },
        {
          path: 'coupon',
          name: 'Coupon',
          component: () => import('@/views/coupon/Index.vue')
        },
        {
          path: 'gift-card',
          name: 'GiftCard',
          component: () => import('@/views/giftcard/Index.vue')
        },
        {
          path: 'ticket/list',
          name: 'TicketList',
          component: () => import('@/views/ticket/List.vue')
        },
        {
          path: 'ticket/detail/:id',
          name: 'TicketDetail',
          component: () => import('@/views/ticket/Detail.vue')
        },
        {
          path: 'notice',
          name: 'Notice',
          component: () => import('@/views/notice/Index.vue')
        },
        {
          path: 'knowledge',
          name: 'Knowledge',
          component: () => import('@/views/knowledge/Index.vue')
        },
        {
          path: 'stats',
          name: 'Stats',
          component: () => import('@/views/stats/Index.vue')
        },
        {
          path: 'config',
          name: 'Config',
          component: () => import('@/views/config/Index.vue')
        },
        {
          path: 'mail/template',
          name: 'MailTemplate',
          component: () => import('@/views/mail/Template.vue')
        },
        {
          path: 'plugin',
          name: 'Plugin',
          component: () => import('@/views/plugin/Index.vue')
        },
        {
          path: 'system',
          name: 'System',
          component: () => import('@/views/system/Index.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const appStore = useAppStore()
  
  appStore.setLoading(true)
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ path: '/' })
    appStore.setLoading(false)
    return
  }
  
  if (to.path === '/' && authStore.isLoggedIn) {
    next({ path: '/admin/dashboard' })
    appStore.setLoading(false)
    return
  }
  
  next()
  appStore.setLoading(false)
})

export default router
