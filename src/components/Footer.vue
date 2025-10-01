<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">关于泥彩人</h3>
          <p class="footer-text">
            泥彩人是中国传统非遗文化的重要组成部分，我们致力于传承和弘扬这一珍贵的文化遗产，
            通过现代科技与传统工艺的结合，让更多人了解和喜爱泥彩人艺术。
          </p>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">联系方式</h3>
          <ul class="contact-list">
            <li class="contact-item">
              <i class="icon">📍</i>
              <span>地址：中国江苏省无锡市惠山区惠山古镇</span>
            </li>
            <li class="contact-item">
              <i class="icon">📞</i>
              <span>电话：+86 510-12345678</span>
            </li>
            <li class="contact-item">
              <i class="icon">✉️</i>
              <span>邮箱：info@nicairen.com</span>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">快速链接</h3>
          <ul class="link-list">
            <li><router-link to="/about" class="footer-link">关于我们</router-link></li>
            <li><router-link to="/inheritors" class="footer-link">传承人</router-link></li>
            <li><router-link to="/gallery" class="footer-link">作品展示</router-link></li>
            <li><router-link to="/news" class="footer-link">新闻动态</router-link></li>
            <li><router-link to="/shop" class="footer-link">商城</router-link></li>
            <li><router-link to="/contact" class="footer-link">联系我们</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">关注我们</h3>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="icon">📱</i>
              <span>微信公众号</span>
            </a>
            <a href="#" class="social-link">
              <i class="icon">📸</i>
              <span>小红书</span>
            </a>
            <a href="#" class="social-link">
              <i class="icon">🎵</i>
              <span>抖音</span>
            </a>
            <a href="#" class="social-link">
              <i class="icon">📹</i>
              <span>Bilibili</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          © 2023 泥彩人非遗文化传承中心. 保留所有权利.
        </div>
        <div class="footer-nav">
          <a href="#" class="footer-nav-link">隐私政策</a>
          <span>|</span>
          <a href="#" class="footer-nav-link">使用条款</a>
          <span>|</span>
          <a href="#" class="footer-nav-link">网站地图</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// 定义组件名称以符合多词规范
defineOptions({
  name: 'AppFooter'
});

// 移除未使用的router导入
// import { useRouter } from 'vue-router';
// const router = useRouter();
</script>

<style scoped>
.footer {
  background-color: #333;
  color: white;
  padding: 40px 0;
  margin-top: 40px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section {
  flex: 1;
}

.footer-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #d93b30;
}

.footer-text {
  font-size: 14px;
  line-height: 1.6;
  color: #ccc;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 14px;
  color: #ccc;
}

.icon {
  margin-right: 10px;
  font-size: 16px;
}

.link-list {
  list-style: none;
  padding: 0;
}

.link-list li {
  margin-bottom: 10px;
}

.footer-link {
  text-decoration: none;
  color: #ccc;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #d93b30;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.social-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ccc;
  font-size: 14px;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #d93b30;
}

.footer-bottom {
  border-top: 1px solid #444;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.copyright {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 10px;
}

.footer-nav {
  font-size: 14px;
  color: #aaa;
}

.footer-nav-link {
  text-decoration: none;
  color: #aaa;
  margin: 0 10px;
  transition: color 0.3s ease;
}

.footer-nav-link:hover {
  color: #d93b30;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-section {
    text-align: center;
  }

  .contact-item {
    justify-content: center;
  }

  .social-links {
    align-items: center;
  }
}
</style>
