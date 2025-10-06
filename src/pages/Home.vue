<template>
  <div class="home">
    <!-- 轮播图 Banner -->
    <section class="banner">
      <div class="banner-slider">
        <div class="banner-item active">
          <img :src="imageImg" alt="泥彩人非遗文化" class="banner-img" />
          <div class="banner-content">
            <h2 class="banner-title">传承千年技艺</h2>
            <p class="banner-subtitle">探索泥彩人非遗文化的独特魅力</p>
            <router-link to="/about" class="banner-btn">了解更多</router-link>
          </div>
        </div>
        <div class="banner-item">
          <img :src="image1Img" alt="泥彩人作品展示" class="banner-img" />
          <div class="banner-content">
            <h2 class="banner-title">精美作品展示</h2>
            <p class="banner-subtitle">欣赏非遗传承人的匠心之作</p>
            <router-link to="/gallery" class="banner-btn">浏览作品</router-link>
          </div>
        </div>
        <div class="banner-item">
          <img :src="imageImg" alt="泥彩人体验活动" class="banner-img" />
          <div class="banner-content">
            <h2 class="banner-title">体验传统工艺</h2>
            <p class="banner-subtitle">亲手制作属于自己的泥彩人</p>
            <router-link to="/reserve" class="banner-btn">立即预约</router-link>
          </div>
        </div>
      </div>
      <!-- 轮播指示器 -->
      <div class="banner-indicators">
        <span class="indicator active" @click="setActiveSlide(0)"></span>
        <span class="indicator" @click="setActiveSlide(1)"></span>
        <span class="indicator" @click="setActiveSlide(2)"></span>
      </div>
    </section>

    <!-- 关于泥彩人 -->
    <section class="about-section">
      <div class="container">
        <h2 class="section-title">关于泥彩人</h2>
        <div class="about-content">
          <div class="about-text">
            <p class="about-paragraph">
              泥彩人是中国传统民间艺术的瑰宝，起源于宋代，至今已有千年历史。它以细腻的泥质、鲜艳的色彩、生动的形象著称，
              是中国非物质文化遗产的重要组成部分。泥彩人不仅是一种艺术形式，更是中华民族智慧和文化的传承。
            </p>
            <p class="about-paragraph">
              我们致力于泥彩人文化的保护、传承和创新，通过展示优秀作品、培养年轻传承人、开展体验活动等方式，
              让这一古老的民间艺术在现代社会焕发新的生机与活力。
            </p>
            <router-link to="/about" class="about-btn">了解更多</router-link>
          </div>
          <div class="about-image">
            <img :src="image1Img" alt="泥彩人历史" class="about-img" />
          </div>
        </div>
      </div>
    </section>

    <!-- 传承人展示 -->
    <section class="inheritors-section">
      <div class="container">
        <h2 class="section-title">非遗传承人</h2>
        <div class="inheritors-grid">
          <div class="inheritor-card" v-for="inheritor in featuredInheritors" :key="inheritor.id">
            <img :src="inheritor.image" :alt="inheritor.name" class="inheritor-img" />
            <div class="inheritor-info">
              <h3 class="inheritor-name">{{ inheritor.name }}</h3>
              <p class="inheritor-title">{{ inheritor.title }}</p>
              <p class="inheritor-desc">{{ inheritor.description }}</p>
              <router-link :to="`/inheritor/${inheritor.id}`" class="inheritor-btn">查看详情</router-link>
            </div>
          </div>
        </div>
        <div class="section-footer">
          <router-link to="/inheritors" class="section-link">查看全部传承人</router-link>
        </div>
      </div>
    </section>

    <!-- 精选作品 -->
    <section class="gallery-section">
      <div class="container">
        <h2 class="section-title">精选作品</h2>
        <div class="gallery-grid">
          <div class="gallery-item" v-for="work in featuredWorks" :key="work.id">
            <img :src="work.image" :alt="work.title" class="gallery-img" />
            <div class="gallery-overlay">
              <h3 class="gallery-title">{{ work.title }}</h3>
              <p class="gallery-artist">传承人：{{ work.artist }}</p>
            </div>
          </div>
        </div>
        <div class="section-footer">
          <router-link to="/gallery" class="section-link">浏览全部作品</router-link>
        </div>
      </div>
    </section>

    <!-- 新闻动态 -->
    <section class="news-section">
      <div class="container">
        <h2 class="section-title">新闻动态</h2>
        <div class="news-list">
          <div class="news-item" v-for="news in latestNews" :key="news.id">
            <div class="news-image">
              <img :src="news.image" :alt="news.title" class="news-img" />
            </div>
            <div class="news-content">
              <span class="news-date">{{ news.date }}</span>
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-excerpt">{{ news.excerpt }}</p>
              <router-link :to="`/news/${news.id}`" class="news-link">阅读全文</router-link>
            </div>
          </div>
        </div>
        <div class="section-footer">
          <router-link to="/news" class="section-link">查看全部新闻</router-link>
        </div>
      </div>
    </section>

    <!-- 体验预约 -->
    <section class="reserve-section">
      <div class="container">
        <div class="reserve-content">
          <div class="reserve-text">
            <h2 class="reserve-title">体验传统工艺</h2>
            <p class="reserve-desc">
              亲手制作一个属于自己的泥彩人，感受传统工艺的魅力。我们提供专业的指导和优质的材料，
              让您在轻松愉快的氛围中体验泥彩人的制作过程。
            </p>
            <ul class="reserve-features">
              <li class="feature-item">✓ 专业老师指导</li>
              <li class="feature-item">✓ 提供全套材料</li>
              <li class="feature-item">✓ 适合各年龄段</li>
              <li class="feature-item">✓ 可带走自己的作品</li>
            </ul>
            <router-link to="/reserve" class="reserve-btn">立即预约</router-link>
          </div>
          <div class="reserve-image">
            <img :src="imageImg" alt="泥彩人体验活动" class="reserve-img" />
          </div>
        </div>
      </div>
    </section>

    <!-- 商城精选 -->
    <section class="shop-section">
      <div class="container">
        <h2 class="section-title">商城精选</h2>
        <div class="shop-grid">
          <div class="shop-item" v-for="product in featuredProducts" :key="product.id">
            <img :src="product.image" :alt="product.name" class="shop-img" />
            <h3 class="shop-name">{{ product.name }}</h3>
            <p class="shop-price">¥{{ product.price }}</p>
            <button class="shop-btn">加入购物车</button>
          </div>
        </div>
        <div class="section-footer">
          <router-link to="/shop" class="section-link">进入商城</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
// 定义组件名称以符合多词规范
defineOptions({
  name: 'HomePage',
})

import { ref, onMounted } from 'vue'

// 图片导入
import imageImg from '@/assets/images/image.png'
import image1Img from '@/assets/images/image1.png'

// 轮播图相关
const activeSlide = ref(0)
const slideInterval = ref<ReturnType<typeof setInterval> | null>(null)

// 模拟数据 - 特色传承人
const featuredInheritors = ref([
  {
    id: 1,
    name: '张明山',
    title: '国家级非遗传承人',
    description: '从事泥彩人制作40余年，作品曾多次获得国家级奖项',
    image: imageImg,
  },
  {
    id: 2,
    name: '李巧云',
    title: '省级非遗传承人',
    description: '擅长传统人物题材，作品风格细腻生动',
    image: image1Img,
  },
  {
    id: 3,
    name: '王建国',
    title: '市级非遗传承人',
    description: '专注创新泥彩人技艺，融合现代元素',
    image: imageImg,
  },
])

// 模拟数据 - 精选作品
const featuredWorks = ref([
  {
    id: 1,
    title: '吉祥如意',
    artist: '张明山',
    image: imageImg,
  },
  {
    id: 2,
    title: '年年有余',
    artist: '李巧云',
    image: image1Img,
  },
  {
    id: 3,
    title: '福娃迎春',
    artist: '王建国',
    image: imageImg,
  },
  {
    id: 4,
    title: '松鹤延年',
    artist: '张明山',
    image: image1Img,
  },
])

// 模拟数据 - 最新新闻
const latestNews = ref([
  {
    id: 1,
    title: '泥彩人技艺入选国家级非物质文化遗产名录',
    excerpt:
      '近日，国务院公布了第五批国家级非物质文化遗产代表性项目名录，我市的泥彩人技艺成功入选...',
    date: '2023-10-15',
    image: image1Img,
  },
  {
    id: 2,
    title: '2023年泥彩人文化艺术节盛大开幕',
    excerpt:
      '为期一周的泥彩人文化艺术节在惠山古镇拉开帷幕，吸引了来自全国各地的游客和艺术爱好者...',
    date: '2023-09-28',
    image: imageImg,
  },
  {
    id: 3,
    title: '青年传承人马小明获"非遗新秀"称号',
    excerpt: '我市青年泥彩人传承人马小明在全国非遗技艺大赛中脱颖而出，获得"非遗新秀"荣誉称号...',
    date: '2023-09-10',
    image: image1Img,
  },
])

// 模拟数据 - 商城精选
const featuredProducts = ref([
  {
    id: 1,
    name: '传统泥彩人摆件 - 福禄寿',
    price: 298,
    image: imageImg,
  },
  {
    id: 2,
    name: '泥彩人DIY套装',
    price: 198,
    image: image1Img,
  },
  {
    id: 3,
    name: '泥彩人文创笔记本',
    price: 68,
    image: imageImg,
  },
  {
    id: 4,
    name: '泥彩人主题T恤',
    price: 128,
    image: image1Img,
  },
])

// 设置轮播图
const setActiveSlide = (index: number) => {
  activeSlide.value = index
  updateSlideIndicators()
}

// 更新轮播指示器
const updateSlideIndicators = () => {
  const indicators = document.querySelectorAll('.banner-indicators .indicator')
  indicators.forEach((indicator, index) => {
    if (index === activeSlide.value) {
      indicator.classList.add('active')
    } else {
      indicator.classList.remove('active')
    }
  })
}

// 下一张轮播图
const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % 3
  updateSlideIndicators()
}

// 组件挂载后启动轮播
onMounted(() => {
  // 启动自动轮播
  slideInterval.value = setInterval(nextSlide, 5000)

  // 更新初始状态
  updateSlideIndicators()
})
</script>

<style scoped>
/* Banner 样式 */
.banner {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.banner-slider {
  height: 100%;
  position: relative;
}

.banner-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.banner-item.active {
  opacity: 1;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.banner-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
}

.banner-subtitle {
  font-size: 24px;
  margin-bottom: 30px;
}

.banner-btn {
  display: inline-block;
  padding: 12px 30px;
  background-color: #d93b30;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.banner-btn:hover {
  background-color: #b92c23;
}

.banner-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  width: 30px;
  border-radius: 6px;
  background-color: white;
}

/* 通用区块样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  padding-bottom: 20px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background-color: #d93b30;
}

.section-footer {
  text-align: center;
  margin-top: 40px;
}

.section-link {
  display: inline-block;
  padding: 10px 24px;
  border: 2px solid #d93b30;
  color: #d93b30;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.section-link:hover {
  background-color: #d93b30;
  color: white;
}

/* 关于我们区块 */
.about-section {
  padding: 100px 0;
  background-color: #f9f9f9;
}

.about-content {
  display: flex;
  gap: 50px;
  align-items: center;
}

.about-text {
  flex: 1;
}

.about-paragraph {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 20px;
}

.about-btn {
  display: inline-block;
  padding: 12px 30px;
  background-color: #d93b30;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.about-btn:hover {
  background-color: #b92c23;
}

.about-image {
  flex: 1;
}

.about-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 传承人区块 */
.inheritors-section {
  padding: 100px 0;
}

.inheritors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.inheritor-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.inheritor-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.inheritor-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.inheritor-info {
  padding: 20px;
}

.inheritor-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.inheritor-title {
  font-size: 14px;
  color: #d93b30;
  margin-bottom: 15px;
}

.inheritor-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.inheritor-btn {
  display: inline-block;
  padding: 8px 20px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.inheritor-btn:hover {
  background-color: #d93b30;
}

/* 作品展示区块 */
.gallery-section {
  padding: 100px 0;
  background-color: #f9f9f9;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.gallery-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-img {
  transform: scale(1.1);
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.gallery-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.gallery-artist {
  font-size: 14px;
}

/* 新闻区块 */
.news-section {
  padding: 100px 0;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.news-item {
  display: flex;
  gap: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.news-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.news-image {
  flex: 0 0 200px;
}

.news-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.news-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.news-excerpt {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}

.news-link {
  font-size: 14px;
  color: #d93b30;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.news-link:hover {
  color: #b92c23;
}

/* 体验预约区块 */
.reserve-section {
  padding: 100px 0;
  background-color: #f9f9f9;
}

.reserve-content {
  display: flex;
  gap: 50px;
  align-items: center;
}

.reserve-text {
  flex: 1;
}

.reserve-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.reserve-desc {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 30px;
}

.reserve-features {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.feature-item {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.reserve-btn {
  display: inline-block;
  padding: 12px 30px;
  background-color: #d93b30;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.reserve-btn:hover {
  background-color: #b92c23;
}

.reserve-image {
  flex: 1;
}

.reserve-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 商城区块 */
.shop-section {
  padding: 100px 0;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.shop-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.shop-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.shop-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.shop-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding: 20px 20px 10px 20px;
}

.shop-price {
  font-size: 20px;
  color: #d93b30;
  font-weight: bold;
  padding: 0 20px 20px 20px;
}

.shop-btn {
  display: block;
  width: calc(100% - 40px);
  margin: 0 20px 20px 20px;
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.shop-btn:hover {
  background-color: #d93b30;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .banner-title {
    font-size: 40px;
  }

  .banner-subtitle {
    font-size: 20px;
  }

  .about-content,
  .reserve-content {
    flex-direction: column;
    gap: 30px;
  }

  .news-item {
    flex-direction: column;
    gap: 20px;
  }

  .news-image {
    flex: 0 0 auto;
  }

  .news-img {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .banner {
    height: 400px;
  }

  .banner-title {
    font-size: 28px;
  }

  .banner-subtitle {
    font-size: 18px;
  }

  .banner-content {
    left: 5%;
  }

  .section-title {
    font-size: 28px;
  }

  .about-section,
  .inheritors-section,
  .gallery-section,
  .news-section,
  .reserve-section,
  .shop-section {
    padding: 60px 0;
  }

  .reserve-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .banner {
    height: 300px;
  }

  .banner-title {
    font-size: 24px;
  }

  .banner-subtitle {
    font-size: 16px;
  }

  .banner-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .inheritors-grid,
  .gallery-grid,
  .shop-grid {
    grid-template-columns: 1fr;
  }
}
</style>
