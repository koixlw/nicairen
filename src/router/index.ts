import { createRouter, createWebHistory } from 'vue-router'

// 路由配置数组
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
    meta: {
      title: '首页 - 泥彩人非遗文化传承',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../pages/About.vue'),
    meta: {
      title: '关于我们 - 泥彩人非遗文化传承',
    },
  },
  {
    path: '/inheritors',
    name: 'Inheritors',
    component: () => import('../pages/Inheritors.vue'),
    meta: {
      title: '传承人列表 - 泥彩人非遗文化传承',
    },
  },
  {
    path: '/inheritor/:id',
    name: 'InheritorDetail',
    component: () => import('../pages/InheritorDetail.vue'),
    meta: {
      title: '传承人详情 - 泥彩人非遗文化传承',
    },
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../pages/Gallery.vue'),
    meta: {
      title: '作品展示 - 泥彩人非遗文化传承',
    },
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('../pages/News.vue'),
    meta: {
      title: '新闻动态 - 泥彩人非遗文化传承',
    },
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('../pages/NewsDetail.vue'),
    meta: {
      title: '新闻详情 - 泥彩人非遗文化传承',
    },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../pages/Contact.vue'),
    meta: {
      title: '联系我们 - 泥彩人非遗文化传承',
    },
  },
  {
    path: '/reserve',
    name: 'Reserve',
    component: () => import('../pages/ReservePage.vue'),
    meta: {
      title: '预约体验 - 泥彩人非遗文化传承',
    },
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../pages/shop.vue'),
    meta: {
      title: '售卖商城 - 泥彩人非遗文化传承',
    },
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
    meta: {
      title: '页面不存在 - 泥彩人非遗文化传承',
    },
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 全局前置守卫，用于设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
