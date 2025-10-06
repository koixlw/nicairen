<template>
  <div class="gallery">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">泥彩人作品集</h1>
        <p class="page-subtitle">探索千年非遗技艺的艺术魅力</p>
      </div>
    </div>

    <!-- 筛选与搜索区域 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-content">
          <div class="filter-group">
            <label class="filter-label">作品分类</label>
            <select v-model="selectedCategory" class="filter-select" @change="filterWorks">
              <option value="all">全部分类</option>
              <option value="figure">人物类</option>
              <option value="animal">动物类</option>
              <option value="legend">神话传说</option>
              <option value="folk">民俗风情</option>
              <option value="modern">现代创意</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">作品风格</label>
            <select v-model="selectedStyle" class="filter-select" @change="filterWorks">
              <option value="all">全部风格</option>
              <option value="traditional">传统风格</option>
              <option value="modern">现代风格</option>
              <option value="minimalist">简约风格</option>
              <option value="colorful">色彩丰富</option>
            </select>
          </div>
          <div class="filter-group search-group">
            <label class="filter-label">搜索作品</label>
            <div class="search-box">
              <input
                type="text"
                v-model="searchKeyword"
                placeholder="输入作品名称或关键词"
                class="search-input"
                @input="handleSearch"
              />
              <button class="search-btn" @click="filterWorks">
                <i class="icon-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 作品展示区域 -->
    <section class="gallery-section">
      <div class="container">
        <!-- 作品数量统计 -->
        <div class="works-count" v-if="filteredWorks.length > 0">
          共找到 <strong>{{ filteredWorks.length }}</strong> 件作品
        </div>

        <!-- 作品网格 -->
        <div class="gallery-grid">
          <div class="work-card" v-for="work in paginatedWorks" :key="work.id">
            <div class="card-img-container">
              <img :src="work.image" :alt="work.title" class="work-img" />
              <div class="card-overlay">
                <div class="overlay-content">
                  <h3 class="overlay-title">{{ work.title }}</h3>
                  <p class="overlay-artist">作者：{{ work.artist }}</p>
                  <div class="overlay-actions">
                    <router-link :to="`/work/${work.id}`" class="view-detail-btn">
                      查看详情
                    </router-link>
                    <button class="like-btn" @click="toggleLike(work.id)">
                      <i class="icon-heart" :class="{ liked: work.isLiked }"></i>
                      <span>{{ work.likes }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-info">
              <h3 class="work-title">{{ work.title }}</h3>
              <div class="work-meta">
                <span class="meta-category">{{ getCategoryText(work.category) }}</span>
                <span class="meta-year">{{ work.year }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-if="filteredWorks.length === 0">
          <i class="icon-empty"></i>
          <p>没有找到符合条件的作品</p>
          <button class="reset-btn" @click="resetFilters">重置筛选条件</button>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1 && filteredWorks.length > 0">
          <button class="page-btn" @click="currentPage = 1" :disabled="currentPage === 1">
            首页
          </button>
          <button class="page-btn" @click="currentPage--" :disabled="currentPage === 1">
            上一页
          </button>
          <span class="page-info"> 第 {{ currentPage }} / {{ totalPages }} 页 </span>
          <button class="page-btn" @click="currentPage++" :disabled="currentPage === totalPages">
            下一页
          </button>
          <button
            class="page-btn"
            @click="currentPage = totalPages"
            :disabled="currentPage === totalPages"
          >
            末页
          </button>
          <div class="page-size">
            <label>每页显示：</label>
            <select v-model="pageSize" class="page-size-select" @change="onPageSizeChange">
              <option value="9">9</option>
              <option value="18">18</option>
              <option value="36">36</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
// 定义组件名称以符合多词规范
defineOptions({
  name: 'GalleryPage',
})

import { ref, computed, onMounted } from 'vue'

// 导入作品图片
import work1Img from '@/assets/images/works/work1.jpg'
import work2Img from '@/assets/images/works/work2.jpg'
import work3Img from '@/assets/images/works/work3.jpg'
import work4Img from '@/assets/images/works/work4.jpg'
import work5Img from '@/assets/images/works/work5.jpg'
import work6Img from '@/assets/images/works/work6.jpg'
import work7Img from '@/assets/images/works/work7.jpg'
import work8Img from '@/assets/images/works/work8.jpg'
import work9Img from '@/assets/images/works/work9.jpg'
import work10Img from '@/assets/images/works/work10.jpg'
import work11Img from '@/assets/images/works/work11.jpg'
import work12Img from '@/assets/images/works/work12.jpg'
import work13Img from '@/assets/images/works/work13.jpg'
import work14Img from '@/assets/images/works/work14.jpg'
import work15Img from '@/assets/images/works/work15.jpg'
import work16Img from '@/assets/images/works/work16.jpg'
import work17Img from '@/assets/images/works/work16.jpg'
import work18Img from '@/assets/images/works/work16.jpg'

// 筛选条件
const selectedCategory = ref('all')
const selectedStyle = ref('all')
const searchKeyword = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(9)

// 模拟作品数据
const allWorks = ref([
  {
    id: 1,
    title: '大阿福',
    description: '传统无锡泥人代表作，象征吉祥如意，福气满满。造型圆润饱满，色彩鲜艳喜庆。',
    image: work1Img,
    category: 'figure',
    style: 'traditional',
    artist: '张明山',
    year: '2018',
    isLiked: false,
    likes: 156,
  },
  {
    id: 2,
    title: '龙凤呈祥',
    description: '以中国传统吉祥图案为题材，龙与凤相互呼应，寓意吉祥喜庆，适合新婚贺礼。',
    image: work2Img,
    category: 'legend',
    style: 'colorful',
    artist: '李巧云',
    year: '2019',
    isLiked: true,
    likes: 234,
  },
  {
    id: 3,
    title: '十二生肖-鼠',
    description: '以中国传统十二生肖为题材，生动刻画了鼠的灵动形象，细节丰富，栩栩如生。',
    image: work3Img,
    category: 'animal',
    style: 'modern',
    artist: '王建国',
    year: '2020',
    isLiked: false,
    likes: 189,
  },
  {
    id: 4,
    title: '京剧脸谱',
    description: '以京剧脸谱为创作灵感，色彩鲜明，线条流畅，展现了中国传统戏曲文化的魅力。',
    image: work4Img,
    category: 'folk',
    style: 'traditional',
    artist: '陈秀英',
    year: '2017',
    isLiked: false,
    likes: 143,
  },
  {
    id: 5,
    title: '童趣',
    description: '现代创意泥彩人作品，描绘了儿童玩耍的场景，造型简约，充满生活气息。',
    image: work5Img,
    category: 'modern',
    style: 'minimalist',
    artist: '刘志强',
    year: '2021',
    isLiked: true,
    likes: 302,
  },
  {
    id: 6,
    title: '西游记人物群像',
    description: '根据中国古典名著《西游记》创作的人物群像，唐僧师徒四人形象鲜明，神态各异。',
    image: work6Img,
    category: 'legend',
    style: 'colorful',
    artist: '周红梅',
    year: '2019',
    isLiked: false,
    likes: 276,
  },
  {
    id: 7,
    title: '连年有余',
    description: '传统吉祥题材泥彩人，描绘了莲花和鲤鱼的形象，寓意年年有余，生活富足。',
    image: work7Img,
    category: 'folk',
    style: 'traditional',
    artist: '黄天明',
    year: '2018',
    isLiked: false,
    likes: 168,
  },
  {
    id: 8,
    title: '城市之光',
    description: '现代风格泥彩人作品，以城市建筑为题材，展现了现代都市的繁荣景象。',
    image: work8Img,
    category: 'modern',
    style: 'modern',
    artist: '赵丽华',
    year: '2022',
    isLiked: true,
    likes: 221,
  },
  {
    id: 9,
    title: '十二生肖-龙',
    description: '十二生肖系列中的龙作品，造型威严大气，细节精致，展现了龙的神圣与力量。',
    image: work9Img,
    category: 'animal',
    style: 'colorful',
    artist: '吴文化',
    year: '2020',
    isLiked: false,
    likes: 298,
  },
  {
    id: 10,
    title: '红楼梦人物',
    description: '根据古典名著《红楼梦》创作的人物形象，林黛玉的形象刻画细腻，神态优雅。',
    image: work10Img,
    category: 'legend',
    style: 'traditional',
    artist: '郑小云',
    year: '2017',
    isLiked: false,
    likes: 245,
  },
  {
    id: 11,
    title: '禅意',
    description: '简约风格的泥彩人作品，以和尚打坐为题材，线条简洁，意境深远。',
    image: work11Img,
    category: 'figure',
    style: 'minimalist',
    artist: '马小明',
    year: '2021',
    isLiked: true,
    likes: 187,
  },
  {
    id: 12,
    title: '丰收',
    description: '民俗风情题材作品，描绘了农民丰收的喜悦场景，充满生活气息和乡土情怀。',
    image: work12Img,
    category: 'folk',
    style: 'colorful',
    artist: '孙丽娟',
    year: '2019',
    isLiked: false,
    likes: 203,
  },
  {
    id: 13,
    title: '生肖狗',
    description: '十二生肖系列作品，以狗为题材，造型可爱活泼，富有动感。',
    image: work13Img,
    category: 'animal',
    style: 'modern',
    artist: '张明山',
    year: '2018',
    isLiked: false,
    likes: 176,
  },
  {
    id: 14,
    title: '嫦娥奔月',
    description: '根据中国传统神话故事创作，嫦娥飘逸的姿态和月球的细节处理精美。',
    image: work14Img,
    category: 'legend',
    style: 'traditional',
    artist: '李巧云',
    year: '2020',
    isLiked: true,
    likes: 267,
  },
  {
    id: 15,
    title: '数字时代',
    description: '现代创意作品，结合了传统泥彩人技艺和现代数字元素，寓意传统与现代的融合。',
    image: work15Img,
    category: 'modern',
    style: 'modern',
    artist: '王建国',
    year: '2022',
    isLiked: false,
    likes: 198,
  },
  {
    id: 16,
    title: '福禄寿三星',
    description: '传统吉祥题材，福星、禄星、寿星三位神仙形象，寓意幸福、富贵、长寿。',
    image: work16Img,
    category: 'folk',
    style: 'colorful',
    artist: '陈秀英',
    year: '2017',
    isLiked: false,
    likes: 231,
  },
  {
    id: 17,
    title: '童趣系列-放风筝',
    description: '现代创意作品，描绘了儿童放风筝的场景，充满童真和活力。',
    image: work17Img,
    category: 'modern',
    style: 'minimalist',
    artist: '刘志强',
    year: '2021',
    isLiked: true,
    likes: 287,
  },
  {
    id: 18,
    title: '三国演义人物',
    description: '根据古典名著《三国演义》创作的人物形象，关羽的形象威风凛凛，细节精致。',
    image: work18Img,
    category: 'legend',
    style: 'traditional',
    artist: '周红梅',
    year: '2019',
    isLiked: false,
    likes: 254,
  },
])

// 筛选后的作品列表
const filteredWorks = computed(() => {
  let result = allWorks.value

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter((work) => work.category === selectedCategory.value)
  }

  // 按风格筛选
  if (selectedStyle.value !== 'all') {
    result = result.filter((work) => work.style === selectedStyle.value)
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(
      (work) =>
        work.title.toLowerCase().includes(keyword) ||
        work.description.toLowerCase().includes(keyword) ||
        work.artist.toLowerCase().includes(keyword),
    )
  }

  return result
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredWorks.value.length / pageSize.value)
})

// 当前页显示的作品
const paginatedWorks = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredWorks.value.slice(startIndex, endIndex)
})

// 获取分类文本
const getCategoryText = (category: string) => {
  const categoryMap: Record<string, string> = {
    figure: '人物类',
    animal: '动物类',
    legend: '神话传说',
    folk: '民俗风情',
    modern: '现代创意',
  }
  return categoryMap[category] || ''
}

// 切换点赞状态
const toggleLike = (id: number) => {
  const work = allWorks.value.find((w) => w.id === id)
  if (work) {
    work.isLiked = !work.isLiked
    work.likes += work.isLiked ? 1 : -1
  }
}

// 筛选作品
const filterWorks = () => {
  currentPage.value = 1 // 重置到第一页
}

// 处理搜索
const handleSearch = () => {
  // 可以在这里添加防抖逻辑
  currentPage.value = 1 // 重置到第一页
}

// 页码大小改变
const onPageSizeChange = () => {
  currentPage.value = 1 // 重置到第一页
}

// 重置筛选条件
const resetFilters = () => {
  selectedCategory.value = 'all'
  selectedStyle.value = 'all'
  searchKeyword.value = ''
  currentPage.value = 1
}

// 组件挂载后初始化
onMounted(() => {
  // 可以在这里添加数据加载逻辑
})
</script>

<style scoped>
/* 页面标题样式 */
.page-header {
  background-color: #f9f9f9;
  padding: 80px 0;
  text-align: center;
}

.page-title {
  font-size: 48px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.page-subtitle {
  font-size: 20px;
  color: #666;
}

/* 通用区块样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

section {
  padding: 60px 0;
}

/* 筛选区域样式 */
.filter-section {
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.filter-content {
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.filter-select {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #d93b30;
}

.search-group {
  flex: 1;
  min-width: 250px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-right: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  font-size: 14px;
  width: 100%;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #d93b30;
}

.search-btn {
  padding: 10px 20px;
  background-color: #d93b30;
  color: white;
  border: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-btn:hover {
  background-color: #b92c23;
}

/* 作品数量统计 */
.works-count {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  text-align: right;
}

/* 作品展示区域样式 */
.gallery-section {
  background-color: #f9f9f9;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.work-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.work-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-img-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.work-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.work-card:hover .work-img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 20px;
}

.work-card:hover .card-overlay {
  opacity: 1;
}

.overlay-content {
  width: 100%;
}

.overlay-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
}

.overlay-artist {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
}

.overlay-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-detail-btn {
  padding: 8px 20px;
  background-color: #d93b30;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.view-detail-btn:hover {
  background-color: #b92c23;
}

.like-btn {
  padding: 8px 15px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.like-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.like-btn .icon-heart.liked {
  color: #d93b30;
}

.card-info {
  padding: 20px;
}

.work-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.work-meta {
  display: flex;
  gap: 15px;
  align-items: center;
}

.meta-category {
  padding: 4px 12px;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 15px;
  font-size: 12px;
}

.meta-year {
  font-size: 14px;
  color: #999;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state i {
  font-size: 80px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.reset-btn {
  padding: 12px 30px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reset-btn:hover {
  background-color: #d93b30;
}

/* 分页样式 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 40px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  color: #666;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #d93b30;
  color: #d93b30;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.page-size {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.page-size-select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .page-title {
    font-size: 40px;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .pagination {
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 60px 0;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 18px;
  }

  .filter-content {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .filter-select {
    width: 100%;
  }

  section {
    padding: 40px 0;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .pagination {
    flex-direction: column;
  }

  .works-count {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .card-img-container {
    height: 200px;
  }

  .empty-state i {
    font-size: 60px;
  }

  .empty-state p {
    font-size: 16px;
  }

  .reset-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
