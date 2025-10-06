<template>
  <div class="news-detail">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">{{ newsDetail?.title || '新闻详情' }}</h1>
        <p class="page-subtitle">了解泥彩人非遗文化的最新动态</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <section class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- 左侧：新闻详情 -->
          <div class="content-main">
            <!-- 新闻头部信息 -->
            <div class="news-header">
              <h2 class="news-title">{{ newsDetail?.title }}</h2>
              <div class="news-meta">
                <span class="news-category">{{ getCategoryText(newsDetail?.category) }}</span>
                <span class="news-date">{{ formatDate(newsDetail?.date) }}</span>
                <span class="news-author">作者：非遗文化宣传中心</span>
              </div>
            </div>

            <!-- 新闻正文内容 -->
            <div class="news-content" v-if="newsDetail">
              <div class="news-image">
                <img :src="newsDetail.image" :alt="newsDetail.title" class="main-image" />
              </div>
              <div class="news-body" v-html="formatContent(newsDetail.content)"></div>
            </div>

            <!-- 加载状态 -->
            <div class="loading-state" v-else-if="loading">
              <div class="loading-spinner"></div>
              <p>加载中...</p>
            </div>

            <!-- 错误状态 -->
            <div class="error-state" v-else>
              <i class="icon-error"></i>
              <p>新闻不存在或已被删除</p>
              <router-link to="/news" class="back-btn">返回新闻列表</router-link>
            </div>

            <!-- 分享功能 -->
            <div class="share-section" v-if="newsDetail">
              <div class="share-title">分享本文：</div>
              <div class="share-buttons">
                <button class="share-btn share-weixin" @click="showWeixinCode = !showWeixinCode">
                  <i class="icon-weixin"></i>
                  微信
                  <div class="weixin-code" v-if="showWeixinCode">
                    <img :src="weixinCodeImg" alt="微信分享二维码" />
                    <p>扫码分享</p>
                  </div>
                </button>
                <button class="share-btn share-weibo">
                  <i class="icon-weibo"></i>
                  微博
                </button>
                <button class="share-btn share-qq">
                  <i class="icon-qq"></i>
                  QQ
                </button>
                <button class="share-btn share-link" @click="copyLink">
                  <i class="icon-link"></i>
                  复制链接
                </button>
              </div>
            </div>

            <!-- 上一篇/下一篇 -->
            <div class="prev-next-section" v-if="hasPrevNews || hasNextNews">
              <div class="prev-news" v-if="hasPrevNews">
                <span class="label">上一篇：</span>
                <router-link :to="`/news/${prevNewsId}`" class="link">{{
                  prevNewsTitle
                  }}</router-link>
              </div>
              <div class="next-news" v-if="hasNextNews">
                <span class="label">下一篇：</span>
                <router-link :to="`/news/${nextNewsId}`" class="link">{{
                  nextNewsTitle
                  }}</router-link>
              </div>
            </div>
          </div>

          <!-- 右侧：侧边栏 -->
          <div class="sidebar">
            <!-- 相关推荐 -->
            <div class="related-news">
              <h3 class="sidebar-title">相关推荐</h3>
              <ul class="related-list">
                <li v-for="item in relatedNews" :key="item.id">
                  <router-link :to="`/news/${item.id}`" class="related-item">
                    <div class="related-img-container">
                      <img :src="item.image" :alt="item.title" class="related-img" />
                    </div>
                    <div class="related-content">
                      <h4 class="related-title">{{ item.title }}</h4>
                      <div class="related-date">{{ formatDate(item.date) }}</div>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- 热门新闻 -->
            <div class="hot-news">
              <h3 class="sidebar-title">热门新闻</h3>
              <ul class="hot-list">
                <li v-for="(item, index) in hotNews" :key="item.id">
                  <router-link :to="`/news/${item.id}`" class="hot-item">
                    <span class="hot-rank">{{ index + 1 }}</span>
                    <span class="hot-title">{{ item.title }}</span>
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- 订阅提醒 -->
            <div class="subscribe-section">
              <div class="subscribe-content">
                <h3 class="subscribe-title">订阅泥彩人新闻</h3>
                <p class="subscribe-desc">第一时间获取泥彩人非遗文化的最新资讯</p>
                <form class="subscribe-form">
                  <input type="email" placeholder="请输入您的邮箱" class="subscribe-input" />
                  <button type="button" class="subscribe-btn">立即订阅</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 评论区 -->
    <section class="comment-section" v-if="newsDetail">
      <div class="container">
        <h3 class="comment-title">评论区</h3>
        <div class="comment-count">{{ comments.length }} 条评论</div>

        <!-- 评论输入框 -->
        <div class="comment-input-section">
          <div class="user-avatar">
            <img :src="userAvatarImg" alt="用户头像" />
          </div>
          <div class="comment-input-wrapper">
            <textarea placeholder="写下您的评论..." class="comment-textarea" v-model="commentText"></textarea>
            <div class="comment-actions">
              <div class="comment-tips">请文明评论，理性发言</div>
              <button class="submit-comment-btn" @click="submitComment" :disabled="!commentText.trim()">
                发表评论
              </button>
            </div>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comment-list">
          <div class="comment-item" v-for="comment in comments" :key="comment.id">
            <div class="comment-avatar">
              <img :src="comment.avatar" :alt="comment.username" />
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-username">{{ comment.username }}</span>
                <span class="comment-time">{{ formatCommentTime(comment.time) }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-footer">
                <button class="comment-action like-btn" @click="toggleLike(comment.id)">
                  <i class="icon-like" :class="{ liked: comment.liked }"></i>
                  <span>{{ comment.likes }}</span>
                </button>
                <button class="comment-action reply-btn">
                  <i class="icon-reply"></i>
                  回复
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多评论 -->
        <div class="load-more" v-if="hasMoreComments">
          <button class="load-more-btn" @click="loadMoreComments">加载更多评论</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// 导入图片资源
import news1Img from '@/assets/images/news/news1.jpg'
import news2Img from '@/assets/images/news/news2.jpg'
import news3Img from '@/assets/images/news/news3.jpg'
import news4Img from '@/assets/images/news/news4.jpg'
import news5Img from '@/assets/images/news/news5.jpg'
import avatar1Img from '@/assets/images/other/avatar1.png'
import avatar2Img from '@/assets/images/other/avatar2.png'
import avatar3Img from '@/assets/images/other/avatar3.png'
import userAvatarImg from '@/assets/images/other/user-avatar.png'
import weixinCodeImg from '@/assets/images/other/weixin-code.png'

// 路由相关
const route = useRoute()

const newsId = ref(Number(route.params.id) || 1)

// 定义新闻详情类型
interface NewsDetail {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  date: string
  views: number
  likes: number
}

// 状态管理
const loading = ref(false)
const newsDetail = ref<NewsDetail | null>(null)
const showWeixinCode = ref(false)
const commentText = ref('')
const hasMoreComments = ref(true)
const comments = ref([
  {
    id: 1,
    username: '传统文化爱好者',
    avatar: avatar1Img,
    content:
      '非常精彩的报道！泥彩人作为传统非遗文化，确实需要更多这样的宣传和推广活动。希望能看到更多关于泥彩人制作技艺的详细介绍。',
    time: '2023-10-21 15:30:00',
    likes: 32,
    liked: false,
  },
  {
    id: 2,
    username: '艺术从业者',
    avatar: avatar2Img,
    content:
      '作为一名艺术从业者，我非常欣赏泥彩人的艺术表现力。希望这次大赛能涌现出更多创新作品，让传统工艺焕发新的生命力。',
    time: '2023-10-21 16:45:00',
    likes: 28,
    liked: true,
  },
  {
    id: 3,
    username: '非遗研究者',
    avatar: avatar3Img,
    content:
      '全国性的泥彩人技艺大赛对于推动这一非遗项目的保护和传承具有重要意义。期待看到比赛的更多细节和获奖作品展示。',
    time: '2023-10-22 09:12:00',
    likes: 45,
    liked: false,
  },
])

// 模拟所有新闻数据
const allNews = ref([
  {
    id: 1,
    title: '2023年全国泥彩人技艺大赛在南京成功举办',
    excerpt:
      '本次大赛吸引了来自全国各地的200多位泥彩人传承人和爱好者参与，展示了泥彩人技艺的多样性和创新性...',
    content:
      '2023年全国泥彩人技艺大赛于10月15日至18日在南京国际博览中心成功举办。本次大赛由文化和旅游部非物质文化遗产司、江苏省文化和旅游厅主办，旨在推动泥彩人技艺的传承和创新，促进泥彩人行业的交流与发展。\n\n本次大赛吸引了来自全国各地的200多位泥彩人传承人和爱好者参与，分为传统技艺组、创新设计组和青年传承组三个组别，共收到参赛作品300余件。经过专家评审，最终评选出金奖10名、银奖20名、铜奖30名以及最佳创意奖、最佳传承奖等多个单项奖。\n\n大赛期间还举办了泥彩人技艺展示、非遗论坛、传承人手把手教学等多项活动，吸引了数万名观众前来参观和体验。许多观众表示，通过这次活动，他们更加深入地了解了泥彩人的历史文化和制作技艺，对这项传统非遗有了新的认识和喜爱。\n\n据主办方介绍，本次大赛的成功举办，不仅为泥彩人传承人和爱好者提供了一个展示和交流的平台，也为泥彩人技艺的传承和创新注入了新的活力。未来，他们将继续举办类似的活动，推动泥彩人技艺的保护、传承和发展。',
    image: news1Img,
    category: 'activity',
    date: '2023-10-20',
    views: 2538,
    likes: 156,
  },
  {
    id: 2,
    title: '泥彩人制作技艺被列入国家级非物质文化遗产代表性项目',
    excerpt:
      '近日，国务院公布了第五批国家级非物质文化遗产代表性项目名录，泥彩人制作技艺成功入选...',
    content:
      '近日，国务院公布了第五批国家级非物质文化遗产代表性项目名录，泥彩人制作技艺成功入选。这是泥彩人制作技艺保护和传承工作的重要里程碑，标志着这项传统工艺得到了国家层面的认可和重视。\n\n泥彩人制作技艺是中国传统民间工艺的重要组成部分，有着悠久的历史和深厚的文化底蕴。它以泥土为主要材料，通过手工捏制、彩绘等工序，制作出形态各异、色彩鲜艳的人物、动物、神话传说等题材的作品，具有很高的艺术价值和历史价值。\n\n近年来，随着社会经济的发展和人们生活方式的变化，泥彩人制作技艺面临着传承困难、市场萎缩等问题。为了保护和传承这项传统技艺，各地文化部门和传承人采取了一系列措施，如建立传习所、开展传承人培训、举办展览展示活动、开发文创产品等，取得了一定的成效。\n\n此次入选国家级非物质文化遗产代表性项目，将为泥彩人制作技艺的保护和传承提供更好的政策支持和资金保障。相信在各方的共同努力下，泥彩人制作技艺一定能够焕发新的生机和活力，为中华优秀传统文化的传承和发展做出更大的贡献。',
    image: news2Img,
    category: 'heritage',
    date: '2023-09-15',
    views: 3245,
    likes: 218,
  },
  {
    id: 3,
    title: '"泥彩人生"主题展览在上海博物馆开幕',
    excerpt:
      '本次展览汇集了来自全国各地的300多件泥彩人精品，包括传统经典作品和现代创新作品，全面展示了泥彩人的艺术魅力和文化内涵...',
    content:
      '由上海博物馆主办的"泥彩人生"主题展览于9月10日正式开幕，展览将持续至12月10日。本次展览汇集了来自全国各地的300多件泥彩人精品，包括传统经典作品和现代创新作品，全面展示了泥彩人的艺术魅力和文化内涵。\n\n展览分为"历史渊源"、"技艺传承"、"艺术特色"、"创新发展"四个部分，通过实物展示、图片说明、视频播放、互动体验等多种形式，向观众介绍泥彩人的历史发展、制作工艺、艺术特点和现代转型。其中，明代的"大阿福"、清代的"福禄寿三星"、民国时期的"京剧脸谱"等经典作品尤为引人注目，吸引了众多观众驻足欣赏。\n\n为了增强观众的参与感和体验感，展览还设置了互动体验区，观众可以在专业传承人的指导下，亲身体验泥彩人的制作过程，感受传统工艺的魅力。许多观众表示，通过这次展览，他们不仅欣赏到了精美的泥彩人作品，还了解了泥彩人的历史文化和制作技艺，收获颇丰。\n\n上海博物馆相关负责人表示，举办此次展览的目的是让更多的人了解和喜爱泥彩人这一传统非遗，促进泥彩人技艺的传承和发展。展览期间，他们还将举办讲座、工作坊等系列活动，为观众提供更多了解泥彩人的机会。',
    image: news3Img,
    category: 'exhibition',
    date: '2023-09-12',
    views: 1876,
    likes: 132,
  },
  {
    id: 4,
    title: '泥彩人走进校园，非遗传承从娃娃抓起',
    excerpt:
      '为了让更多的青少年了解和喜爱泥彩人这一传统非遗，近日，"泥彩人进校园"活动在苏州市多所小学展开...',
    content:
      '为了让更多的青少年了解和喜爱泥彩人这一传统非遗，近日，由苏州市文化广电和旅游局主办的"泥彩人进校园"活动在苏州市多所小学展开。本次活动邀请了国家级非遗传承人张明山、省级非遗传承人李巧云等多位专家，通过讲座、展示、互动教学等形式，向小学生们介绍泥彩人的历史文化和制作技艺。\n\n活动中，传承人首先通过图文并茂的讲座，向同学们介绍了泥彩人的起源、发展、艺术特点和文化内涵，让同学们对泥彩人有了初步的认识。接着，传承人现场展示了泥彩人的制作过程，从选泥、和泥、捏制、晾干到彩绘，每一个步骤都详细讲解，同学们看得津津有味。最后，在传承人的指导下，同学们亲自动手制作简单的泥彩人作品，体验传统工艺的乐趣。\n\n许多同学表示，这次活动非常有趣，他们不仅了解了泥彩人的相关知识，还亲手制作了泥彩人作品，感受到了传统工艺的魅力。家长们也纷纷表示，这样的活动非常有意义，能够让孩子们在轻松愉快的氛围中学习传统文化，增强文化自信。\n\n据活动主办方介绍，"泥彩人进校园"活动是苏州市非物质文化遗产传承保护工作的重要组成部分，旨在通过学校教育这一主渠道，培养青少年对传统文化的兴趣和热爱，为非遗传承储备后备人才。未来，他们将继续开展此类活动，让更多的青少年了解和喜爱泥彩人这一传统非遗。',
    image: news4Img,
    category: 'education',
    date: '2023-08-25',
    views: 2134,
    likes: 178,
  },
  {
    id: 5,
    title: '泥彩人文创产品设计大赛结果揭晓',
    excerpt:
      '为了推动泥彩人技艺的创新发展，促进传统工艺与现代设计的融合，近日，"泥彩人文创产品设计大赛"结果揭晓...',
    content:
      '为了推动泥彩人技艺的创新发展，促进传统工艺与现代设计的融合，近日，由江苏省文化和旅游厅、江苏省工业设计协会主办的"泥彩人文创产品设计大赛"结果揭晓。本次大赛共收到来自全国各地的参赛作品200余件，经过专家评审，最终评选出金奖1名、银奖3名、铜奖5名以及最佳创意奖、最佳市场潜力奖等多个单项奖。\n\n获奖作品既有对传统泥彩人技艺的传承和创新，也有将泥彩人元素与现代设计理念相结合的全新尝试，涵盖了家居装饰、文具用品、服装配饰、礼品等多个领域。其中，金奖作品《泥彩人表情包系列文创产品》将传统泥彩人的形象与现代表情包文化相结合，设计了一系列生动有趣的文创产品，深受评委和观众的喜爱。\n\n大赛期间还举办了泥彩人文创产品展示、设计论坛、产业对接会等活动，为设计师、传承人和企业搭建了交流与合作的平台。许多企业表示，通过这次大赛，他们发现了许多优秀的设计作品和创新理念，希望能够与设计师和传承人合作，将这些作品推向市场。\n\n主办方表示，举办此次大赛的目的是鼓励设计师和传承人发挥创意，开发更多符合现代人审美和需求的泥彩人文创产品，拓展泥彩人的应用领域和市场空间，推动泥彩人技艺的创新发展。未来，他们将继续举办类似的活动，为泥彩人的传承和发展注入新的活力。',
    image: news5Img,
    category: 'innovation',
    date: '2023-08-15',
    views: 1987,
    likes: 145,
  },
])

// 获取新闻详情
const getNewsDetail = () => {
  loading.value = true
  // 模拟API请求延迟
  setTimeout(() => {
    const news = allNews.value.find((item) => item.id === newsId.value)
    newsDetail.value = news || null
    loading.value = false
  }, 500)
}

// 获取分类文本
const getCategoryText = (category: string | undefined) => {
  if (!category) return ''
  const categoryMap: Record<string, string> = {
    activity: '活动动态',
    heritage: '传承保护',
    exhibition: '展览信息',
    education: '教育传承',
    innovation: '创新发展',
  }
  return categoryMap[category] || ''
}

// 格式化日期
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 格式化评论时间
const formatCommentTime = (timeString: string) => {
  const now = new Date().getTime()
  const date = new Date(timeString).getTime()
  const diffTime = now - date
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))

  if (diffDays > 0) {
    return `${diffDays}天前`
  } else if (diffHours > 0) {
    return `${diffHours}小时前`
  } else if (diffMinutes > 0) {
    return `${diffMinutes}分钟前`
  } else {
    return '刚刚'
  }
}

// 格式化内容（处理换行符）
const formatContent = (content: string) => {
  if (!content) return ''
  // 将\n\n替换为<p>标签，\n替换为<br>标签
  return content
    .split('\n\n')
    .map((paragraph: string) => {
      if (paragraph.trim()) {
        return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
      }
      return ''
    })
    .join('')
}

// 相关新闻计算
const relatedNews = computed(() => {
  if (!newsDetail.value) return []
  // 按分类筛选相关新闻，排除当前新闻
  const related = allNews.value
    .filter(
      (item) =>
        newsDetail.value && item.category === newsDetail.value.category && item.id !== newsId.value,
    )
    .sort((a, b) => b.views - a.views)
    .slice(0, 3)

  // 如果同分类新闻不足3条，补充其他热门新闻
  if (related.length < 3) {
    const additionalNews = allNews.value
      .filter((item) => item.id !== newsId.value && !related.some((r) => r.id === item.id))
      .sort((a, b) => b.views - a.views)
      .slice(0, 3 - related.length)
    related.push(...additionalNews)
  }

  return related
})

// 热门新闻计算
const hotNews = computed(() => {
  // 按浏览量排序，取前5条
  return allNews.value.sort((a, b) => b.views - a.views).slice(0, 5)
})

// 上一篇/下一篇计算
const hasPrevNews = computed(() => {
  return allNews.value.some((item) => item.id < newsId.value)
})

const hasNextNews = computed(() => {
  return allNews.value.some((item) => item.id > newsId.value)
})

const prevNews = computed(() => {
  if (!hasPrevNews.value) return null
  return allNews.value.filter((item) => item.id < newsId.value).sort((a, b) => b.id - a.id)[0]
})

const nextNews = computed(() => {
  if (!hasNextNews.value) return null
  return allNews.value.filter((item) => item.id > newsId.value).sort((a, b) => a.id - b.id)[0]
})

const prevNewsId = computed(() => prevNews.value?.id || null)
const prevNewsTitle = computed(() => prevNews.value?.title || '')
const nextNewsId = computed(() => nextNews.value?.id || null)
const nextNewsTitle = computed(() => nextNews.value?.title || '')

// 复制链接
const copyLink = () => {
  const url = window.location.href
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert('链接已复制到剪贴板')
    })
    .catch(() => {
      alert('复制失败，请手动复制')
    })
}

// 提交评论
const submitComment = () => {
  if (!commentText.value.trim()) return

  const newComment = {
    id: Date.now(),
    username: '游客',
    avatar: userAvatarImg,
    content: commentText.value.trim(),
    time: new Date().toISOString().replace('T', ' ').substring(0, 19),
    likes: 0,
    liked: false,
  }

  comments.value.unshift(newComment)
  commentText.value = ''
  alert('评论发表成功！')
}

// 点赞/取消点赞
const toggleLike = (commentId: number) => {
  const comment = comments.value.find((c) => c.id === commentId)
  if (comment) {
    if (comment.liked) {
      comment.likes--
    } else {
      comment.likes++
    }
    comment.liked = !comment.liked
  }
}

// 加载更多评论
const loadMoreComments = () => {
  // 模拟加载更多评论
  setTimeout(() => {
    hasMoreComments.value = false
    alert('没有更多评论了')
  }, 500)
}

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    newsId.value = Number(newId) || 1
    getNewsDetail()
  },
)

// 组件挂载时获取新闻详情
onMounted(() => {
  getNewsDetail()
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

/* 主要内容区域样式 */
.main-content {
  background-color: white;
}

.content-wrapper {
  display: flex;
  gap: 40px;
}

.content-main {
  flex: 1;
  min-width: 0;
}

.sidebar {
  flex: 0 0 320px;
}

/* 新闻头部样式 */
.news-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.news-header .news-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.4;
}

.news-meta {
  display: flex;
  gap: 20px;
  align-items: center;
}

.news-category {
  padding: 6px 16px;
  background-color: #d93b30;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.news-date,
.news-author {
  font-size: 14px;
  color: #999;
}

/* 新闻正文样式 */
.news-image {
  margin-bottom: 40px;
}

.main-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-body {
  font-size: 18px;
  line-height: 1.8;
  color: #333;
}

.news-body p {
  margin-bottom: 25px;
  text-align: justify;
}

.news-body p:last-child {
  margin-bottom: 0;
}

/* 加载状态样式 */
.loading-state,
.error-state {
  text-align: center;
  padding: 80px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #d93b30;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-state i {
  font-size: 80px;
  color: #ddd;
  margin-bottom: 20px;
}

.error-state p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.back-btn {
  padding: 12px 30px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #d93b30;
}

/* 分享功能样式 */
.share-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.share-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
}

.share-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.share-btn:hover {
  border-color: #d93b30;
  color: #d93b30;
}

.share-weixin:hover {
  border-color: #07c160;
  color: #07c160;
}

.share-weibo:hover {
  border-color: #e6162d;
  color: #e6162d;
}

.share-qq:hover {
  border-color: #1da1f2;
  color: #1da1f2;
}

.weixin-code {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.weixin-code img {
  width: 120px;
  height: 120px;
  margin-bottom: 8px;
}

.weixin-code p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* 上一篇/下一篇样式 */
.prev-next-section {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.prev-news,
.next-news {
  display: flex;
  align-items: center;
  gap: 15px;
}

.prev-next-section .label {
  font-size: 14px;
  color: #999;
  min-width: 80px;
}

.prev-next-section .link {
  font-size: 16px;
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prev-next-section .link:hover {
  color: #d93b30;
}

/* 侧边栏样式 */
.sidebar-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #d93b30;
}

/* 相关推荐样式 */
.related-news,
.hot-news {
  margin-bottom: 40px;
}

.related-list,
.hot-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  text-decoration: none;
  transition: all 0.3s ease;
}

.related-item:hover {
  transform: translateX(5px);
}

.related-item:last-child {
  border-bottom: none;
}

.related-img-container {
  flex: 0 0 80px;
  height: 60px;
  overflow: hidden;
}

.related-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.related-content {
  flex: 1;
  min-width: 0;
}

.related-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-date {
  font-size: 12px;
  color: #999;
}

/* 热门新闻样式 */
.hot-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  text-decoration: none;
  transition: all 0.3s ease;
}

.hot-item:hover {
  transform: translateX(5px);
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-rank {
  flex: 0 0 24px;
  height: 24px;
  background-color: #d93b30;
  color: white;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  margin-top: 2px;
}

.hot-item:nth-child(2) .hot-rank {
  background-color: #e67e22;
}

.hot-item:nth-child(3) .hot-rank {
  background-color: #f1c40f;
}

.hot-title {
  flex: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 订阅提醒样式 */
.subscribe-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 30px;
}

.subscribe-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.subscribe-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.subscribe-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.subscribe-input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.subscribe-input:focus {
  outline: none;
  border-color: #d93b30;
}

.subscribe-btn {
  padding: 12px 20px;
  background-color: #d93b30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.subscribe-btn:hover {
  background-color: #b92c23;
}

/* 评论区样式 */
.comment-section {
  background-color: #f9f9f9;
}

.comment-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.comment-count {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}

/* 评论输入框样式 */
.comment-input-section {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
}

.user-avatar {
  flex: 0 0 48px;
  height: 48px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.comment-input-wrapper {
  flex: 1;
  min-width: 0;
}

.comment-textarea {
  width: 100%;
  min-height: 100px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.comment-textarea:focus {
  outline: none;
  border-color: #d93b30;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.comment-tips {
  font-size: 12px;
  color: #999;
}

.submit-comment-btn {
  padding: 10px 30px;
  background-color: #d93b30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-comment-btn:hover:not(:disabled) {
  background-color: #b92c23;
}

.submit-comment-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 评论列表样式 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.comment-item {
  display: flex;
  gap: 15px;
}

.comment-avatar {
  flex: 0 0 40px;
  height: 40px;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 15px;
}

.comment-footer {
  display: flex;
  gap: 20px;
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background-color: transparent;
  border: none;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  transition: all 0.3s ease;
}

.comment-action:hover {
  color: #d93b30;
}

.comment-action.liked {
  color: #d93b30;
}

/* 加载更多评论样式 */
.load-more {
  text-align: center;
  margin-top: 40px;
}

.load-more-btn {
  padding: 10px 30px;
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  border-color: #d93b30;
  color: #d93b30;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .page-title {
    font-size: 40px;
  }

  .content-wrapper {
    gap: 30px;
  }

  .sidebar {
    flex: 0 0 280px;
  }

  .news-header .news-title {
    font-size: 28px;
  }

  .news-body {
    font-size: 16px;
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

  .content-wrapper {
    flex-direction: column;
    gap: 40px;
  }

  .sidebar {
    flex: 1;
  }

  .news-header .news-title {
    font-size: 24px;
  }

  .news-meta {
    flex-wrap: wrap;
    gap: 10px;
  }

  .share-buttons {
    justify-content: center;
  }

  .comment-input-section {
    flex-direction: column;
  }

  .user-avatar {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .news-header .news-title {
    font-size: 20px;
  }

  .news-body {
    font-size: 14px;
  }

  .share-btn {
    flex: 1;
    justify-content: center;
  }

  .subscribe-section {
    padding: 20px;
  }

  .prev-news,
  .next-news {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .prev-next-section .label {
    min-width: auto;
  }
}
</style>
