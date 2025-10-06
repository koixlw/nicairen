<template>
  <div class="inheritors">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">非遗传承人</h1>
        <p class="page-subtitle">传承千年技艺，守护文化瑰宝</p>
      </div>
    </div>

    <!-- 筛选区域 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-content">
          <div class="filter-group">
            <label class="filter-label">传承人级别</label>
            <select v-model="selectedLevel" class="filter-select" @change="filterInheritors">
              <option value="all">全部级别</option>
              <option value="national">国家级</option>
              <option value="provincial">省级</option>
              <option value="municipal">市级</option>
              <option value="county">县级</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">所属地区</label>
            <select v-model="selectedRegion" class="filter-select" @change="filterInheritors">
              <option value="all">全部地区</option>
              <option value="beijing">北京</option>
              <option value="shanghai">上海</option>
              <option value="jiangsu">江苏</option>
              <option value="zhejiang">浙江</option>
              <option value="anhui">安徽</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">搜索</label>
            <div class="search-box">
              <input
                type="text"
                v-model="searchKeyword"
                placeholder="输入传承人姓名"
                class="search-input"
                @input="handleSearch"
              />
              <button class="search-btn" @click="filterInheritors">
                <i class="icon-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 传承人列表 -->
    <section class="inheritors-section">
      <div class="container">
        <div class="inheritors-grid">
          <div class="inheritor-card" v-for="inheritor in paginatedInheritors" :key="inheritor.id">
            <div class="card-header">
              <img :src="inheritor.image" :alt="inheritor.name" class="inheritor-img" />
              <div class="level-badge" :class="inheritor.level">
                {{ getLevelText(inheritor.level) }}
              </div>
            </div>
            <div class="card-body">
              <h3 class="inheritor-name">{{ inheritor.name }}</h3>
              <p class="inheritor-title">{{ inheritor.title }}</p>
              <div class="inheritor-meta">
                <span class="meta-item">
                  <i class="icon-location"></i> {{ getRegionText(inheritor.region) }}
                </span>
                <span class="meta-item">
                  <i class="icon-calendar"></i> {{ inheritor.year }}年入选
                </span>
              </div>
              <p class="inheritor-desc">{{ inheritor.description }}</p>
              <div class="card-footer">
                <router-link :to="`/inheritor/${inheritor.id}`" class="view-detail-btn">
                  查看详情
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1">
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
              <option value="6">6</option>
              <option value="12">12</option>
              <option value="24">24</option>
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
  name: 'InheritorsPage',
})

import { ref, computed, onMounted } from 'vue'

// 导入所有传承人图片
import inheritor1Img from '@/assets/images/inheritor/inheritor1.jpg'
import inheritor2Img from '@/assets/images/inheritor/inheritor2.jpg'
import inheritor3Img from '@/assets/images/inheritor/inheritor3.jpg'
import inheritor4Img from '@/assets/images/inheritor/inheritor4.jpg'
import inheritor5Img from '@/assets/images/inheritor/inheritor5.jpg'
import inheritor6Img from '@/assets/images/inheritor/inheritor6.jpg'
import inheritor7Img from '@/assets/images/inheritor/inheritor7.jpg'
import inheritor8Img from '@/assets/images/inheritor/inheritor8.jpg'
import inheritor9Img from '@/assets/images/inheritor/inheritor9.jpg'
import inheritor10Img from '@/assets/images/inheritor/inheritor10.jpg'
import inheritor11Img from '@/assets/images/inheritor/inheritor11.jpg'
import inheritor12Img from '@/assets/images/inheritor/inheritor12.jpg'

// 筛选条件
const selectedLevel = ref('all')
const selectedRegion = ref('all')
const searchKeyword = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(6)

// 模拟传承人数据
const allInheritors = ref([
  {
    id: 1,
    name: '张明山',
    title: '国家级非遗传承人',
    description:
      '从事泥彩人制作40余年，擅长传统人物题材，作品曾多次获得国家级奖项，为泥彩人技艺的传承和发展做出了突出贡献。',
    image: inheritor1Img,
    level: 'national',
    region: 'jiangsu',
    year: 2008,
  },
  {
    id: 2,
    name: '李巧云',
    title: '省级非遗传承人',
    description:
      '专注泥彩人创作30余年，作品风格细腻生动，尤其擅长女性形象塑造，曾赴多个国家进行文化交流和展示。',
    image: inheritor2Img,
    level: 'provincial',
    region: 'jiangsu',
    year: 2012,
  },
  {
    id: 3,
    name: '王建国',
    title: '市级非遗传承人',
    description:
      '专注创新泥彩人技艺，融合现代元素，开发了多种泥彩人文创产品，为传统工艺的创新发展做出了积极探索。',
    image: inheritor3Img,
    level: 'municipal',
    region: 'shanghai',
    year: 2015,
  },
  {
    id: 4,
    name: '陈秀英',
    title: '国家级非遗传承人',
    description:
      '泥彩人制作技艺的代表性传承人之一，技艺精湛，著有多部关于泥彩人制作技艺的专著，培养了众多年轻传承人。',
    image: inheritor4Img,
    level: 'national',
    region: 'anhui',
    year: 2011,
  },
  {
    id: 5,
    name: '刘志强',
    title: '省级非遗传承人',
    description:
      '擅长历史人物和神话传说题材的泥彩人创作，作品造型生动，色彩鲜艳，多次参加国内外展览并获奖。',
    image: inheritor5Img,
    level: 'provincial',
    region: 'zhejiang',
    year: 2014,
  },
  {
    id: 6,
    name: '周红梅',
    title: '市级非遗传承人',
    description:
      '青年传承人代表，致力于泥彩人技艺的年轻化和现代化探索，通过新媒体平台推广泥彩人文化，吸引了众多年轻人的关注。',
    image: inheritor6Img,
    level: 'municipal',
    region: 'beijing',
    year: 2018,
  },
  {
    id: 7,
    name: '黄天明',
    title: '县级非遗传承人',
    description:
      '坚守传统泥彩人制作技艺，注重原材料的选择和传统工艺流程的传承，作品保留了最原汁原味的泥彩人特色。',
    image: inheritor7Img,
    level: 'county',
    region: 'jiangsu',
    year: 2020,
  },
  {
    id: 8,
    name: '赵丽华',
    title: '省级非遗传承人',
    description:
      '创新开发了泥彩人微雕技艺，将传统泥彩人制作技艺与现代微雕技术相结合，作品小巧精致，深受收藏家和艺术爱好者喜爱。',
    image: inheritor8Img,
    level: 'provincial',
    region: 'shanghai',
    year: 2016,
  },
  {
    id: 9,
    name: '吴文化',
    title: '国家级非遗传承人',
    description:
      '泥彩人制作技艺的泰斗级人物，从艺50余年，技艺炉火纯青，创作了大量具有历史价值和艺术价值的经典作品。',
    image: inheritor9Img,
    level: 'national',
    region: 'jiangsu',
    year: 2006,
  },
  {
    id: 10,
    name: '郑小云',
    title: '市级非遗传承人',
    description:
      '专注于泥彩人教学和传承工作，创办了泥彩人传习所，培养了大量年轻传承人，为泥彩人技艺的传承做出了重要贡献。',
    image: inheritor10Img,
    level: 'municipal',
    region: 'anhui',
    year: 2017,
  },
  {
    id: 11,
    name: '马小明',
    title: '县级非遗传承人',
    description:
      '90后传承人代表，将数字技术与传统泥彩人制作相结合，开发了泥彩人3D打印技术，为传统工艺注入了新的活力。',
    image: inheritor11Img,
    level: 'county',
    region: 'zhejiang',
    year: 2021,
  },
  {
    id: 12,
    name: '孙丽娟',
    title: '省级非遗传承人',
    description:
      '擅长泥彩人彩绘技艺，色彩运用独特，作品色彩鲜艳而不失典雅，形成了自己独特的艺术风格。',
    image: inheritor12Img,
    level: 'provincial',
    region: 'beijing',
    year: 2019,
  },
])

// 筛选后的传承人列表
const filteredInheritors = computed(() => {
  let result = allInheritors.value

  // 按级别筛选
  if (selectedLevel.value !== 'all') {
    result = result.filter((inheritor) => inheritor.level === selectedLevel.value)
  }

  // 按地区筛选
  if (selectedRegion.value !== 'all') {
    result = result.filter((inheritor) => inheritor.region === selectedRegion.value)
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(
      (inheritor) =>
        inheritor.name.toLowerCase().includes(keyword) ||
        inheritor.title.toLowerCase().includes(keyword) ||
        inheritor.description.toLowerCase().includes(keyword),
    )
  }

  return result
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredInheritors.value.length / pageSize.value)
})

// 当前页显示的传承人
const paginatedInheritors = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredInheritors.value.slice(startIndex, endIndex)
})

// 获取级别文本
const getLevelText = (level: string) => {
  const levelMap: Record<string, string> = {
    national: '国家级',
    provincial: '省级',
    municipal: '市级',
    county: '县级',
  }
  return levelMap[level] || ''
}

// 获取地区文本
const getRegionText = (region: string) => {
  const regionMap: Record<string, string> = {
    beijing: '北京',
    shanghai: '上海',
    jiangsu: '江苏',
    zhejiang: '浙江',
    anhui: '安徽',
  }
  return regionMap[region] || ''
}

// 筛选传承人
const filterInheritors = () => {
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
  width: 200px;
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

/* 传承人列表样式 */
.inheritors-section {
  background-color: #f9f9f9;
}

.inheritors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
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

.card-header {
  position: relative;
  height: 250px;
}

.inheritor-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.level-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.level-badge.national {
  background-color: #d93b30;
}

.level-badge.provincial {
  background-color: #f59e0b;
}

.level-badge.municipal {
  background-color: #3b82f6;
}

.level-badge.county {
  background-color: #10b981;
}

.card-body {
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
  color: #666;
  margin-bottom: 15px;
}

.inheritor-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.meta-item {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 5px;
}

.inheritor-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer {
  text-align: center;
}

.view-detail-btn {
  display: inline-block;
  padding: 10px 30px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.view-detail-btn:hover {
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

  .inheritors-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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

  .search-input {
    width: 100%;
  }

  section {
    padding: 40px 0;
  }

  .pagination {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .inheritors-grid {
    grid-template-columns: 1fr;
  }

  .card-header {
    height: 200px;
  }
}
</style>
