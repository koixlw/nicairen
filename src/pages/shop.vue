<template>
  <div class="shop-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">泥彩人商城</h1>
        <p class="page-subtitle">购买精美的泥彩人作品，带回家继续感受非遗文化的魅力</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <section class="shop-content">
      <div class="container">
        <!-- 搜索栏 -->
        <div class="search-container">
          <div class="search-wrapper">
            <input type="text" class="search-input" placeholder="搜索泥彩人作品..." v-model="searchKeyword"
              @input="handleSearch">
            <button class="search-btn" @click="handleSearch">
              <i class="icon-search"></i> 搜索
            </button>
          </div>
        </div>

        <div class="shop-layout">
          <!-- 左侧筛选栏 -->
          <aside class="sidebar">
            <!-- 分类筛选 -->
            <div class="filter-section">
              <h3 class="filter-title">作品分类</h3>
              <ul class="filter-list">
                <li class="filter-item" @click="selectCategory('all')" :class="{ active: selectedCategory === 'all' }">
                  全部作品
                </li>
                <li class="filter-item" v-for="category in categories" :key="category.id"
                  @click="selectCategory(category.id)" :class="{ active: selectedCategory === category.id }">
                  {{ category.name }}
                </li>
              </ul>
            </div>

            <!-- 价格筛选 -->
            <div class="filter-section">
              <h3 class="filter-title">价格范围</h3>
              <div class="price-filter">
                <div class="price-inputs">
                  <input type="number" class="price-input" v-model.number="priceRange.min" placeholder="最低价" min="0">
                  <span class="price-separator">-</span>
                  <input type="number" class="price-input" v-model.number="priceRange.max" placeholder="最高价" min="0">
                </div>
                <button class="price-apply-btn" @click="applyPriceFilter">
                  确定
                </button>
                <button class="price-reset-btn" @click="resetPriceFilter">
                  重置
                </button>
              </div>
            </div>

            <!-- 传承人筛选 -->
            <div class="filter-section">
              <h3 class="filter-title">传承人</h3>
              <ul class="filter-list">
                <li class="filter-item" @click="selectInheritor('all')"
                  :class="{ active: selectedInheritor === 'all' }">
                  全部传承人
                </li>
                <li class="filter-item" v-for="inheritor in inheritors" :key="inheritor.id"
                  @click="selectInheritor(inheritor.id)" :class="{ active: selectedInheritor === inheritor.id }">
                  {{ inheritor.name }}
                </li>
              </ul>
            </div>

            <!-- 热门标签 -->
            <div class="filter-section">
              <h3 class="filter-title">热门标签</h3>
              <div class="tag-cloud">
                <span class="tag" v-for="tag in tags" :key="tag" @click="selectTag(tag)"
                  :class="{ active: selectedTags.includes(tag) }">
                  {{ tag }}
                </span>
              </div>
            </div>
          </aside>

          <!-- 右侧商品展示区 -->
          <main class="product-section">
            <!-- 排序和视图切换 -->
            <div class="product-header">
              <div class="sort-options">
                <span class="sort-label">排序方式：</span>
                <select class="sort-select" v-model="sortOption" @change="handleSort">
                  <option value="default">默认排序</option>
                  <option value="priceAsc">价格从低到高</option>
                  <option value="priceDesc">价格从高到低</option>
                  <option value="newest">最新上架</option>
                  <option value="popular">人气最高</option>
                </select>
              </div>
              <div class="view-options">
                <button class="view-btn" @click="setGridView('grid')" :class="{ active: gridView === 'grid' }">
                  <i class="icon-th-large"></i> 网格视图
                </button>
                <button class="view-btn" @click="setGridView('list')" :class="{ active: gridView === 'list' }">
                  <i class="icon-list"></i> 列表视图
                </button>
              </div>
            </div>

            <!-- 商品展示 -->
            <div class="products-container" :class="gridView">
              <div class="product-card" v-for="product in filteredProducts" :key="product.id">
                <div class="product-image">
                  <img :src="product.image" :alt="product.title" class="product-img">
                  <div class="product-tags">
                    <span v-if="product.isNew" class="tag-new">新品</span>
                    <span v-if="product.isHot" class="tag-hot">热销</span>
                  </div>
                </div>
                <div class="product-info">
                  <div class="product-category">{{ getCategoryName(product.categoryId) }}</div>
                  <h3 class="product-title">{{ product.title }}</h3>
                  <div class="product-inheritor">
                    <i class="icon-user-circle"></i> {{ getInheritorName(product.inheritorId) }}
                  </div>
                  <div class="product-rating">
                    <i class="icon-star" v-for="i in 5" :key="i" :class="{ 'active': i <= product.rating }"></i>
                    <span class="rating-count">({{ product.reviewCount }})</span>
                  </div>
                  <div class="product-price">
                    <span class="price">¥{{ product.price.toFixed(2) }}</span>
                    <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice.toFixed(2)
                      }}</span>
                  </div>
                  <div class="product-actions">
                    <button class="add-to-cart-btn" @click="addToCart(product)">
                      <i class="icon-shopping-cart"></i> 加入购物车
                    </button>
                    <button class="buy-now-btn" @click="buyNow(product)">
                      <i class="icon-credit-card"></i> 立即购买
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div class="empty-state" v-if="filteredProducts.length === 0">
              <i class="icon-search"></i>
              <p>没有找到符合条件的商品</p>
              <button class="reset-filter-btn" @click="resetAllFilters">
                重置筛选条件
              </button>
            </div>

            <!-- 分页 -->
            <div class="pagination" v-if="filteredProducts.length > 0">
              <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
                <i class="icon-angle-left"></i> 上一页
              </button>
              <div class="page-numbers">
                <button class="page-number" v-for="page in totalPages" :key="page"
                  :class="{ active: page === currentPage }" @click="goToPage(page)">
                  {{ page }}
                </button>
              </div>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
                下一页 <i class="icon-angle-right"></i>
              </button>
            </div>
          </main>
        </div>
      </div>
    </section>

    <!-- 购物车侧边栏 -->
    <div class="cart-sidebar" :class="{ open: isCartOpen }">
      <div class="cart-header">
        <h3 class="cart-title">购物车</h3>
        <button class="cart-close-btn" @click="toggleCart">
          <i class="icon-times"></i>
        </button>
      </div>
      <div class="cart-content">
        <!-- 购物车为空 -->
        <div class="cart-empty" v-if="cartItems.length === 0">
          <i class="icon-shopping-cart"></i>
          <p>购物车还是空的</p>
          <p>快去挑选心仪的泥彩人作品吧！</p>
        </div>
        <!-- 购物车商品列表 -->
        <div class="cart-items" v-else>
          <div class="cart-item" v-for="item in cartItems" :key="item.id">
            <img :src="item.image" :alt="item.title" class="cart-item-img">
            <div class="cart-item-info">
              <h4 class="cart-item-title">{{ item.title }}</h4>
              <div class="cart-item-price">¥{{ item.price.toFixed(2) }}</div>
              <div class="cart-item-quantity">
                <button class="quantity-btn" @click="decreaseQuantity(item.id)" :disabled="item.quantity <= 1">-
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button class="quantity-btn" @click="increaseQuantity(item.id)">+
                </button>
              </div>
            </div>
            <button class="cart-item-remove" @click="removeFromCart(item.id)">
              <i class="icon-trash"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="cart-footer" v-if="cartItems.length > 0">
        <div class="cart-total">
          <span>合计：</span>
          <span class="total-price">¥{{ cartTotal.toFixed(2) }}</span>
        </div>
        <div class="cart-actions">
          <button class="continue-shopping-btn" @click="toggleCart">
            继续购物
          </button>
          <button class="checkout-btn" @click="checkout">
            去结算 ({{ cartItemCount }})
          </button>
        </div>
      </div>
    </div>

    <!-- 购物车遮罩 -->
    <div class="cart-overlay" :class="{ show: isCartOpen }" @click="toggleCart"></div>

    <!-- 返回顶部按钮 -->
    <button class="back-to-top" @click="backToTop" v-show="showBackToTop">
      <i class="icon-arrow-up"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
// 定义组件名称以符合多词规范
defineOptions({
  name: 'ShopPage'
});

import { ref, computed, onMounted, onUnmounted } from 'vue';

// 导入产品图片
import product1Img from '@/assets/images/product/product1.jpg';
import product2Img from '@/assets/images/product/product2.jpg';
import product3Img from '@/assets/images/product/product3.jpg';
import product4Img from '@/assets/images/product/product4.jpg';
import product5Img from '@/assets/images/product/product5.jpg';
import product6Img from '@/assets/images/product/product6.jpg';
import product7Img from '@/assets/images/product/product7.jpg';
import product8Img from '@/assets/images/product/product8.jpg';
import product9Img from '@/assets/images/product/product9.jpg';
import product10Img from '@/assets/images/product/product10.jpg';
import product11Img from '@/assets/images/product/product11.jpg';
import product12Img from '@/assets/images/product/product12.jpg';
import product13Img from '@/assets/images/product/product13.jpg';
import product14Img from '@/assets/images/product/product14.jpg';
import product15Img from '@/assets/images/product/product15.jpg';
import product16Img from '@/assets/images/product/product16.jpg';

// 搜索关键词
const searchKeyword = ref('');

// 分类数据
const categories = ref([
  { id: 1, name: '传统人物' },
  { id: 2, name: '民俗风情' },
  { id: 3, name: '神话传说' },
  { id: 4, name: '现代艺术' },
  { id: 5, name: '礼品套装' },
  { id: 6, name: '儿童玩具' }
]);

// 传承人数据
const inheritors = ref([
  { id: 1, name: '张明山' },
  { id: 2, name: '李巧云' },
  { id: 3, name: '王建国' },
  { id: 4, name: '赵秀兰' },
  { id: 5, name: '陈志强' }
]);

// 标签数据
const tags = ref(['手工制作', '限量版', '礼品', '收藏', '传统工艺', '非遗传承', '精美包装', '促销']);

// 选择的分类
const selectedCategory = ref<string | number>('all');

// 选择的传承人
const selectedInheritor = ref<string | number>('all');

// 选择的标签
const selectedTags = ref<string[]>([]);

// 价格范围
const priceRange = ref<{min: string | number, max: string | number}>({
  min: '',
  max: ''
});

// 排序选项
const sortOption = ref('default');

// 视图类型
const gridView = ref('grid');

// 当前页码
const currentPage = ref(1);

// 每页显示数量
const pageSize = ref(12);

// 商品数据
const products = ref([
  {
    id: 1,
    title: '传统京剧脸谱泥彩人',
    categoryId: 1,
    inheritorId: 1,
    price: 198.00,
    originalPrice: 238.00,
    image: product1Img,
    tags: ['传统工艺', '非遗传承'],
    rating: 4.8,
    reviewCount: 126,
    isNew: false,
    isHot: true,
    description: '精心制作的京剧脸谱泥彩人，展现传统戏曲文化魅力，是收藏和送礼的绝佳选择。'
  },
  {
    id: 2,
    title: '民俗风情系列-连年有余',
    categoryId: 2,
    inheritorId: 2,
    price: 168.00,
    originalPrice: 198.00,
    image: product2Img,
    tags: ['手工制作', '礼品'],
    rating: 4.6,
    reviewCount: 89,
    isNew: true,
    isHot: false,
    description: '寓意吉祥的连年有余泥彩人，传统工艺精制，色彩鲜艳，形态逼真。'
  },
  {
    id: 3,
    title: '神话传说-哪吒闹海',
    categoryId: 3,
    inheritorId: 3,
    price: 268.00,
    originalPrice: 298.00,
    image: product3Img,
    tags: ['传统工艺', '收藏'],
    rating: 4.9,
    reviewCount: 156,
    isNew: false,
    isHot: true,
    description: '根据中国传统神话故事制作的哪吒闹海泥彩人，工艺精湛，细节处理到位。'
  },
  {
    id: 4,
    title: '现代艺术-城市印象',
    categoryId: 4,
    inheritorId: 4,
    price: 298.00,
    originalPrice: 0,
    image: product4Img,
    tags: ['现代艺术', '限量版'],
    rating: 4.7,
    reviewCount: 78,
    isNew: true,
    isHot: true,
    description: '融合现代艺术元素的城市印象泥彩人，独特设计，展现当代城市风貌。'
  },
  {
    id: 5,
    title: '中国传统节日礼品套装',
    categoryId: 5,
    inheritorId: 1,
    price: 368.00,
    originalPrice: 428.00,
    image: product5Img,
    tags: ['礼品套装', '精美包装'],
    rating: 4.8,
    reviewCount: 112,
    isNew: false,
    isHot: false,
    description: '包含春节、元宵节等传统节日主题的泥彩人套装，礼盒包装，送礼佳品。'
  },
  {
    id: 6,
    title: '儿童益智泥彩人-十二生肖',
    categoryId: 6,
    inheritorId: 5,
    price: 128.00,
    originalPrice: 158.00,
    image: product6Img,
    tags: ['儿童玩具', '教育'],
    rating: 4.5,
    reviewCount: 97,
    isNew: false,
    isHot: false,
    description: '专为儿童设计的十二生肖泥彩人，色彩鲜艳，形象可爱，寓教于乐。'
  },
  {
    id: 7,
    title: '传统戏曲人物-昆曲系列',
    categoryId: 1,
    inheritorId: 2,
    price: 238.00,
    originalPrice: 268.00,
    image: product7Img,
    tags: ['传统工艺', '非遗传承'],
    rating: 4.7,
    reviewCount: 65,
    isNew: true,
    isHot: false,
    description: '展现昆曲艺术魅力的泥彩人系列，服装细节精美，人物神态生动。'
  },
  {
    id: 8,
    title: '民俗生活场景-市井百态',
    categoryId: 2,
    inheritorId: 3,
    price: 288.00,
    originalPrice: 328.00,
    image: product8Img,
    tags: ['传统工艺', '收藏'],
    rating: 4.8,
    reviewCount: 103,
    isNew: false,
    isHot: true,
    description: '描绘传统市井生活场景的泥彩人组品，人物众多，场景丰富，极具收藏价值。'
  },
  {
    id: 9,
    title: '神话传说-八仙过海',
    categoryId: 3,
    inheritorId: 1,
    price: 398.00,
    originalPrice: 458.00,
    image: product9Img,
    tags: ['传统工艺', '收藏', '限量版'],
    rating: 4.9,
    reviewCount: 87,
    isNew: true,
    isHot: true,
    description: '经典神话故事八仙过海的泥彩人套装，八位仙人形态各异，栩栩如生。'
  },
  {
    id: 10,
    title: '现代艺术-抽象人物',
    categoryId: 4,
    inheritorId: 4,
    price: 258.00,
    originalPrice: 0,
    image: product10Img,
    tags: ['现代艺术', '抽象'],
    rating: 4.6,
    reviewCount: 54,
    isNew: true,
    isHot: false,
    description: '融合抽象艺术风格的泥彩人作品，线条流畅，造型独特，适合现代家居装饰。'
  },
  {
    id: 11,
    title: '商务礼品套装-福禄寿喜',
    categoryId: 5,
    inheritorId: 2,
    price: 328.00,
    originalPrice: 368.00,
    image: product11Img,
    tags: ['礼品套装', '商务礼品'],
    rating: 4.7,
    reviewCount: 76,
    isNew: false,
    isHot: false,
    description: '包含福、禄、寿、喜四位神仙的泥彩人套装，精美礼盒包装，适合商务馈赠。'
  },
  {
    id: 12,
    title: '儿童动手制作泥彩人材料包',
    categoryId: 6,
    inheritorId: 5,
    price: 88.00,
    originalPrice: 108.00,
    image: product12Img,
    tags: ['儿童玩具', 'DIY', '教育'],
    rating: 4.5,
    reviewCount: 132,
    isNew: false,
    isHot: true,
    description: '让孩子动手制作泥彩人的材料包，包含泥料、颜料、工具和说明书，培养孩子创造力。'
  },
  {
    id: 13,
    title: '传统人物-三国英雄系列',
    categoryId: 1,
    inheritorId: 3,
    price: 218.00,
    originalPrice: 248.00,
    image: product13Img,
    tags: ['传统工艺', '历史人物'],
    rating: 4.8,
    reviewCount: 98,
    isNew: false,
    isHot: false,
    description: '以三国演义为题材的英雄人物泥彩人，造型威猛，细节精致。'
  },
  {
    id: 14,
    title: '民俗风情-庙会场景',
    categoryId: 2,
    inheritorId: 4,
    price: 298.00,
    originalPrice: 338.00,
    image: product14Img,
    tags: ['传统工艺', '收藏'],
    rating: 4.7,
    reviewCount: 65,
    isNew: true,
    isHot: false,
    description: '展现传统庙会热闹场景的泥彩人组品，人物众多，细节丰富，极具民俗特色。'
  },
  {
    id: 15,
    title: '神话传说-西游记师徒四人',
    categoryId: 3,
    inheritorId: 1,
    price: 368.00,
    originalPrice: 408.00,
    image: product15Img,
    tags: ['传统工艺', '收藏', '限量版'],
    rating: 4.9,
    reviewCount: 112,
    isNew: false,
    isHot: true,
    description: '经典神话故事西游记师徒四人的泥彩人套装，造型生动，工艺精湛。'
  },
  {
    id: 16,
    title: '现代艺术-都市生活',
    categoryId: 4,
    inheritorId: 5,
    price: 238.00,
    originalPrice: 0,
    image: product16Img,
    tags: ['现代艺术', '都市'],
    rating: 4.6,
    reviewCount: 45,
    isNew: true,
    isHot: false,
    description: '反映现代都市生活的泥彩人作品，贴近生活，富有时代气息。'
  }
]);

// 购物车状态
const isCartOpen = ref(false);

// 购物车商品
interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const cartItems = ref<CartItem[]>([]);

// 显示返回顶部按钮
const showBackToTop = ref(false);

// 根据分类ID获取分类名称
const getCategoryName = (categoryId: string | number) => {
  const category = categories.value.find(c => c.id === Number(categoryId));
  return category ? category.name : '';
};

// 根据传承人ID获取传承人名称
const getInheritorName = (inheritorId: string | number) => {
  const inheritor = inheritors.value.find(i => i.id === Number(inheritorId));
  return inheritor ? inheritor.name : '';
};

// 筛选商品
const filteredProducts = computed(() => {
  let filtered = [...products.value];

  // 根据搜索关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      getCategoryName(product.categoryId).toLowerCase().includes(keyword) ||
      getInheritorName(product.inheritorId).toLowerCase().includes(keyword)
    );
  }

  // 根据分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.categoryId === Number(selectedCategory.value));
  }

  // 根据传承人筛选
  if (selectedInheritor.value !== 'all') {
    filtered = filtered.filter(product => product.inheritorId === Number(selectedInheritor.value));
  }

  // 根据标签筛选
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(product =>
      selectedTags.value.some(tag => product.tags.includes(tag))
    );
  }

  // 根据价格范围筛选
  if (priceRange.value.min !== '' && priceRange.value.min !== null) {
    const minPrice = typeof priceRange.value.min === 'string' ? Number(priceRange.value.min) : priceRange.value.min;
    filtered = filtered.filter(product => product.price >= minPrice);
  }
  if (priceRange.value.max !== '' && priceRange.value.max !== null) {
    const maxPrice = typeof priceRange.value.max === 'string' ? Number(priceRange.value.max) : priceRange.value.max;
    filtered = filtered.filter(product => product.price <= maxPrice);
  }

  // 排序
  switch (sortOption.value) {
    case 'priceAsc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'popular':
      filtered.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0) || b.reviewCount - a.reviewCount);
      break;
    default:
      // 默认排序
      break;
  }

  // 分页
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filtered.slice(startIndex, endIndex);
});

// 总页数
const totalPages = computed(() => {
  let filtered = [...products.value];

  // 应用筛选条件（复制filteredProducts中的筛选逻辑）
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      getCategoryName(product.categoryId).toLowerCase().includes(keyword) ||
      getInheritorName(product.inheritorId).toLowerCase().includes(keyword)
    );
  }

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => product.categoryId === selectedCategory.value);
  }

  if (selectedInheritor.value !== 'all') {
    filtered = filtered.filter(product => product.inheritorId === selectedInheritor.value);
  }

  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(product =>
      selectedTags.value.some(tag => product.tags.includes(tag))
    );
  }

  if (priceRange.value.min !== '' && priceRange.value.min !== null) {
    const minPrice = typeof priceRange.value.min === 'string' ? Number(priceRange.value.min) : priceRange.value.min;
    filtered = filtered.filter(product => product.price >= minPrice);
  }
  if (priceRange.value.max !== '' && priceRange.value.max !== null) {
    const maxPrice = typeof priceRange.value.max === 'string' ? Number(priceRange.value.max) : priceRange.value.max;
    filtered = filtered.filter(product => product.price <= maxPrice);
  }

  return Math.ceil(filtered.length / pageSize.value);
});

// 购物车商品总数
const cartItemCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

// 购物车总价
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1;
};

// 选择分类
const selectCategory = (categoryId: string | number) => {
  selectedCategory.value = categoryId;
  currentPage.value = 1;
};

// 选择传承人
const selectInheritor = (inheritorId: string | number) => {
  selectedInheritor.value = inheritorId;
  currentPage.value = 1;
};

// 选择标签
const selectTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
  currentPage.value = 1;
};

// 应用价格筛选
const applyPriceFilter = () => {
  currentPage.value = 1;
};

// 重置价格筛选
const resetPriceFilter = () => {
  priceRange.value = {
    min: '',
    max: ''
  };
  currentPage.value = 1;
};

// 处理排序
const handleSort = () => {
  currentPage.value = 1;
};

// 设置视图
const setGridView = (view: string) => {
  gridView.value = view;
};

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 跳转到指定页
const goToPage = (page: number) => {
  currentPage.value = page;
};

// 重置所有筛选条件
const resetAllFilters = () => {
  searchKeyword.value = '';
  selectedCategory.value = 'all';
  selectedInheritor.value = 'all';
  selectedTags.value = [];
  priceRange.value = {
    min: '',
    max: ''
  };
  sortOption.value = 'default';
  currentPage.value = 1;
};

// 切换购物车
const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
};

// 添加到购物车
const addToCart = (product: any) => {
  const existingItem = cartItems.value.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.value.push({
      ...product,
      quantity: 1
    });
  }

  // 打开购物车
  isCartOpen.value = true;

  // 显示添加成功提示
  alert(`${product.title} 已成功添加到购物车！`);
};

// 立即购买
const buyNow = (product: any) => {
  // 清空购物车并添加当前商品 
  cartItems.value = [{
    ...product,
    quantity: 1
  }];

  // 打开购物车
  isCartOpen.value = true;
};

// 减少商品数量
const decreaseQuantity = (productId: number) => {
  const item = cartItems.value.find(item => item.id === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
  }
};

// 增加商品数量
const increaseQuantity = (productId: number) => {
  const item = cartItems.value.find(item => item.id === productId);
  if (item) {
    item.quantity++;
  }
};

// 从购物车移除商品
const removeFromCart = (productId: number) => {
  cartItems.value = cartItems.value.filter(item => item.id !== productId);
};

// 结算
const checkout = () => {
  if (cartItems.value.length === 0) {
    alert('购物车为空，请先添加商品！');
    return;
  }

  // 这里可以跳转到结算页面
  alert('即将跳转到结算页面！');
};

// 返回顶部
const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 组件挂载时初始化
onMounted(() => {
  // 监听滚动事件
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
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

/* 搜索栏样式 */
.search-container {
  margin-bottom: 30px;
}

.search-wrapper {
  display: flex;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #d93b30;
}

.search-btn {
  padding: 12px 30px;
  background-color: #d93b30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-btn:hover {
  background-color: #b92c23;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 59, 48, 0.3);
}

/* 商城布局 */
.shop-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

/* 侧边栏样式 */
.sidebar {
  flex: 0 0 280px;
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.filter-section {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.filter-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.filter-item {
  padding: 10px 0;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.filter-item:last-child {
  border-bottom: none;
}

.filter-item:hover {
  color: #d93b30;
  padding-left: 5px;
}

.filter-item.active {
  color: #d93b30;
  font-weight: 500;
  position: relative;
  padding-left: 15px;
}

.filter-item.active:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #d93b30;
  border-radius: 50%;
}

/* 价格筛选 */
.price-filter {
  margin-top: 10px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.price-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.price-separator {
  color: #999;
  font-size: 16px;
}

.price-apply-btn {
  width: 100%;
  padding: 10px;
  background-color: #d93b30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

.price-apply-btn:hover {
  background-color: #b92c23;
}

.price-reset-btn {
  width: 100%;
  padding: 10px;
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.price-reset-btn:hover {
  border-color: #d93b30;
  color: #d93b30;
}

/* 标签云 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  padding: 6px 15px;
  background-color: #f5f5f5;
  color: #666;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background-color: #d93b30;
  color: white;
}

.tag.active {
  background-color: #d93b30;
  color: white;
}

/* 商品展示区 */
.product-section {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 商品头部（排序和视图切换） */
.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sort-label {
  font-size: 16px;
  color: #666;
}

.sort-select {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: #d93b30;
}

.view-options {
  display: flex;
  gap: 10px;
}

.view-btn {
  padding: 8px 15px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.view-btn:hover {
  border-color: #d93b30;
  color: #d93b30;
}

.view-btn.active {
  border-color: #d93b30;
  background-color: #d93b30;
  color: white;
}

/* 商品容器 */
.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.products-container.list {
  grid-template-columns: 1fr;
}

/* 商品卡片 */
.product-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.products-container.list .product-card {
  flex-direction: row;
  min-height: 200px;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

/* 商品图片 */
.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.products-container.list .product-image {
  flex: 0 0 200px;
  height: auto;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

/* 商品标签 */
.product-tags {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 10px;
}

.tag-new,
.tag-hot {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.tag-new {
  background-color: #4285f4;
}

.tag-hot {
  background-color: #d93b30;
}

/* 商品信息 */
.product-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-category {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

.product-title:hover {
  color: #d93b30;
}

.product-inheritor {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 商品评分 */
.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
}

.icon-star {
  color: #ddd;
  font-size: 16px;
  transition: color 0.3s ease;
}

.icon-star.active {
  color: #ffb300;
}

.rating-count {
  font-size: 14px;
  color: #999;
}

/* 商品价格 */
.product-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #d93b30;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

/* 商品操作按钮 */
.product-actions {
  display: flex;
  gap: 10px;
}

.add-to-cart-btn,
.buy-now-btn {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.add-to-cart-btn:hover {
  border-color: #d93b30;
  color: #d93b30;
}

.buy-now-btn {
  background-color: #d93b30;
  color: white;
  border-color: #d93b30;
}

.buy-now-btn:hover {
  background-color: #b92c23;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 59, 48, 0.3);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state i {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.reset-filter-btn {
  padding: 12px 30px;
  background-color: #d93b30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-filter-btn:hover {
  background-color: #b92c23;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 59, 48, 0.3);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.page-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-btn:hover:not(:disabled) {
  border-color: #d93b30;
  color: #d93b30;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover {
  border-color: #d93b30;
  color: #d93b30;
}

.page-number.active {
  border-color: #d93b30;
  background-color: #d93b30;
  color: white;
}

/* 购物车侧边栏 */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.cart-sidebar.open {
  right: 0;
}

/* 购物车头部 */
.cart-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.cart-close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.cart-close-btn:hover {
  color: #333;
}

/* 购物车内容 */
.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 购物车为空 */
.cart-empty {
  text-align: center;
  padding: 60px 20px;
}

.cart-empty i {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

.cart-empty p {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.cart-empty p:last-child {
  margin-bottom: 0;
}

/* 购物车商品列表 */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.cart-item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.cart-item-price {
  font-size: 18px;
  font-weight: bold;
  color: #d93b30;
  margin-bottom: 10px;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  border-color: #d93b30;
  color: #d93b30;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  min-width: 20px;
  text-align: center;
}

.cart-item-remove {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s ease;
}

.cart-item-remove:hover {
  color: #d93b30;
}

/* 购物车底部 */
.cart-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.cart-total span:first-child {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.total-price {
  font-size: 24px;
  font-weight: bold;
  color: #d93b30;
}

.cart-actions {
  display: flex;
  gap: 10px;
}

.continue-shopping-btn,
.checkout-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continue-shopping-btn {
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
}

.continue-shopping-btn:hover {
  border-color: #d93b30;
  color: #d93b30;
}

.checkout-btn {
  background-color: #d93b30;
  color: white;
}

.checkout-btn:hover {
  background-color: #b92c23;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 59, 48, 0.3);
}

/* 购物车遮罩 */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.cart-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* 返回顶部按钮样式 */
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: #d93b30;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 99;
  box-shadow: 0 4px 12px rgba(217, 59, 48, 0.3);
}

.back-to-top:hover {
  background-color: #b92c23;
  transform: translateY(-5px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .page-title {
    font-size: 40px;
  }

  .shop-layout {
    flex-direction: column;
    gap: 30px;
  }

  .sidebar {
    flex: 1;
  }

  .products-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

  section {
    padding: 40px 0;
  }

  .search-wrapper {
    flex-direction: column;
  }

  .product-section {
    padding: 20px;
  }

  .product-header {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .sort-options {
    justify-content: space-between;
  }

  .view-options {
    justify-content: center;
  }

  .products-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  .products-container.list {
    grid-template-columns: 1fr;
  }

  .product-card {
    min-height: auto;
  }

  .products-container.list .product-card {
    flex-direction: column;
  }

  .products-container.list .product-image {
    flex: 0 0 150px;
  }

  .product-image {
    height: 180px;
  }

  .product-info {
    padding: 15px;
  }

  .product-title {
    font-size: 16px;
  }

  .price {
    font-size: 20px;
  }

  .cart-sidebar {
    width: 100%;
    right: -100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .sidebar {
    padding: 20px;
  }

  .filter-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  .filter-title {
    font-size: 16px;
  }

  .products-container {
    grid-template-columns: 1fr;
  }

  .product-image {
    height: 200px;
  }

  .product-actions {
    flex-direction: column;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 5px;
  }

  .page-btn {
    padding: 8px 15px;
    font-size: 12px;
  }

  .page-number {
    width: 35px;
    height: 35px;
    font-size: 12px;
  }

  .cart-header,
  .cart-content,
  .cart-footer {
    padding: 15px;
  }

  .cart-title {
    font-size: 20px;
  }

  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}
</style>