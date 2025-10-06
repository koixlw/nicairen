<template>
  <header class="header">
    <div class="container">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <span class="logo-text">泥彩人</span>
          <span class="logo-subtitle">非遗文化传承</span>
        </router-link>
      </div>

      <nav class="nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">关于我们</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/inheritors" class="nav-link">传承人</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/gallery" class="nav-link">作品展示</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/news" class="nav-link">新闻动态</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/shop" class="nav-link">商城</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/reserve" class="nav-link">预约体验</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link">联系我们</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
// 移除未使用的router导入
// import { useRouter } from 'vue-router';

// 定义组件名称以符合多词规范
defineOptions({
  name: 'AppHeader',
})

// const router = useRouter();

// 监听滚动事件，改变header样式
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  const header = document.querySelector('.header')
  if (header) {
    if (window.scrollY > 50) {
      header.classList.add('scrolled')
    } else {
      header.classList.remove('scrolled')
    }
  }
}
</script>

<style scoped>
.header {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.header.scrolled {
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.logo-container {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #d93b30;
}

.logo-subtitle {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.nav {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 30px;
}

.nav-item {
  position: relative;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #d93b30;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #d93b30;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .nav-list {
    gap: 20px;
  }

  .nav-link {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .container {
    height: 60px;
  }

  .logo-text {
    font-size: 20px;
  }

  .nav {
    display: none;
  }
}
</style>
