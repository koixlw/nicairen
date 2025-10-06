<template>
  <div class="news">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">新闻动态</h1>
        <p class="page-subtitle">关注泥彩人非遗文化的最新资讯</p>
      </div>
    </div>

    <!-- 筛选与搜索区域 -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-content">
          <div class="category-tabs">
            <button
              class="category-tab"
              v-for="category in newsCategories"
              :key="category.value"
              :class="{ active: selectedCategory === category.value }"
              @click="selectCategory(category.value)"
            >
              {{ category.label }}
            </button>
          </div>
          <div class="search-box">
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="搜索新闻标题或内容"
              class="search-input"
              @input="handleSearch"
            />
            <button class="search-btn" @click="filterNews">
              <i class="icon-search"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 新闻列表区域 -->
    <section class="news-section">
      <div class="container">
        <!-- 新闻数量统计 -->
        <div class="news-count" v-if="filteredNews.length > 0">
          共找到 <strong>{{ filteredNews.length }}</strong> 条新闻
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-else>
          <i class="icon-empty"></i>
          <p>没有找到符合条件的新闻</p>
          <button class="reset-btn" @click="resetFilters">重置筛选条件</button>
        </div>

        <!-- 新闻列表 -->
        <div class="news-list">
          <div class="news-item" v-for="item in paginatedNews" :key="item.id">
            <div class="news-img-container">
              <img :src="item.image" :alt="item.title" class="news-img" />
            </div>
            <div class="news-content">
              <div class="news-meta">
                <span class="news-category">{{ getCategoryText(item.category) }}</span>
                <span class="news-date">{{ formatDate(item.date) }}</span>
              </div>
              <h3 class="news-title">{{ item.title }}</h3>
              <p class="news-excerpt">{{ item.excerpt }}</p>
              <div class="news-actions">
                <router-link :to="`/news/${item.id}`" class="read-more-btn">
                  阅读全文
                  <i class="icon-arrow-right"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1 && filteredNews.length > 0">
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
  name: 'NewsPage',
})

import { ref, computed, onMounted } from 'vue'

// 导入新闻图片
import news1Img from '@/assets/images/news/news1.jpg'
import news2Img from '@/assets/images/news/news2.jpg'
import news3Img from '@/assets/images/news/news3.jpg'
import news4Img from '@/assets/images/news/news4.jpg'
import news5Img from '@/assets/images/news/news5.jpg'
import news6Img from '@/assets/images/news/news6.jpg'
import news7Img from '@/assets/images/news/news7.jpg'
import news8Img from '@/assets/images/news/news8.jpg'
import news9Img from '@/assets/images/news/news9.jpg'
import news10Img from '@/assets/images/news/news10.jpg'
import news11Img from '@/assets/images/news/news11.jpg'
import news12Img from '@/assets/images/news/news12.jpg'

// 筛选条件
const selectedCategory = ref('all')
const searchKeyword = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(6)

// 新闻分类
const newsCategories = ref([
  { value: 'all', label: '全部' },
  { value: 'activity', label: '活动动态' },
  { value: 'heritage', label: '传承保护' },
  { value: 'exhibition', label: '展览信息' },
  { value: 'education', label: '教育传承' },
  { value: 'innovation', label: '创新发展' },
])

// 模拟新闻数据
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
  },
  {
    id: 4,
    title: '泥彩人走进校园，非遗传承从娃娃抓起',
    excerpt:
      '为了让更多的青少年了解和喜爱泥彩人这一传统非遗，近日，"泥彩人进校园"活动在苏州市多所小学展开...',
    content:
      '为了让更多的青少年了解和喜爱泥彩人这一传统非遗，近日，由苏州市文化广电和旅游局主办的"泥彩人进校园"活动在苏州市多所小学展开。本次活动邀请了国家级非遗传承人张明山、省级非遗传承人李巧云等多位专家，通过讲座、展示、互动教学等形式，向小学生们介绍泥彩人的历史文化和制作技艺。\n\n活动中，传承人首先通过图文并茂的讲座，向同学们介绍了泥彩人的起源、发展、艺术特点和文化内涵，让同学们对泥彩人有了初步的认识。接着，传承人现场展示了泥彩人的制作过程，从选泥、和泥、捏制、晾干到彩绘，每一个步骤都详细讲解，同学们看得津津有味。最后，在传承人的指导下，同学们亲自动手制作简单的泥彩人作品，体验传统工艺的乐趣。\n\n许多同学表示，这次活动非常有趣，他们不仅了解了泥彩人的相关知识，还亲手制作了泥彩人作品，感受传统工艺的魅力。家长们也纷纷表示，这样的活动非常有意义，能够让孩子们在轻松愉快的氛围中学习传统文化，增强文化自信。\n\n据活动主办方介绍，"泥彩人进校园"活动是苏州市非物质文化遗产传承保护工作的重要组成部分，旨在通过学校教育这一主渠道，培养青少年对传统文化的兴趣和热爱，为非遗传承储备后备人才。未来，他们将继续开展此类活动，让更多的青少年了解和喜爱泥彩人这一传统非遗。',
    image: news4Img,
    category: 'education',
    date: '2023-08-25',
  },
  {
    id: 5,
    title: '泥彩人文创产品设计大赛结果揭晓',
    excerpt:
      '为了推动泥彩人技艺的创新发展，促进传统工艺与现代设计的融合，近日，"泥彩人文创产品设计大赛"结果揭晓...',
    content:
      '为了推动泥彩人技艺的创新发展，促进传统工艺与现代设计的融合，近日，由江苏省文化和旅游厅、江苏省工业设计协会主办的"泥彩人文创产品设计大赛"结果揭晓。本次大赛共收到来自全国各地的参赛作品200余件，经过专家评审，最终评选出金奖1名、银奖3名、铜奖5名以及最佳创意奖、最佳市场潜力奖等多个单项奖。\n\n获奖作品既有对传统 mud彩人技艺的传承和创新，也有将 mud彩人元素与现代设计理念相结合的全新尝试，涵盖了家居装饰、文具用品、服装配饰、礼品等多个领域。其中，金奖作品《泥彩人表情包系列文创产品》将传统 mud彩人的形象与现代表情包文化相结合，设计了一系列生动有趣的文创产品，深受评委和观众的喜爱。\n\n大赛期间还举办了泥彩人文创产品展示、设计论坛、产业对接会等活动，为设计师、传承人和企业搭建了交流与合作的平台。许多企业表示，通过这次大赛，他们发现了许多优秀的设计作品和创新理念，希望能够与设计师和传承人合作，将这些作品推向市场。\n\n主办方表示，举办此次大赛的目的是鼓励设计师和传承人发挥创意，开发更多符合现代人审美和需求的 mud彩人文创产品，拓展 mud彩人的应用领域和市场空间，推动 mud彩人技艺的创新发展。未来，他们将继续举办类似的活动，为 mud彩人的传承和发展注入新的活力。',
    image: news5Img,
    category: 'innovation',
    date: '2023-08-15',
  },
  {
    id: 6,
    title: '国际非遗交流活动在杭州举办，泥彩人技艺惊艳亮相',
    excerpt:
      '近日，"2023年国际非物质文化遗产交流活动"在杭州举办，来自中国、日本、韩国、泰国等10多个国家和地区的非遗项目参加了展示...',
    content:
      '近日，由联合国教科文组织、中国文化和旅游部、浙江省人民政府共同主办的"2023年国际非物质文化遗产交流活动"在杭州举办。来自中国、日本、韩国、泰国等10多个国家和地区的非遗项目参加了展示，泥彩人技艺作为中国传统非遗的代表之一，在活动中惊艳亮相，受到了国内外观众的广泛关注和好评。\n\n在活动现场，泥彩人传承人们现场展示了泥彩人的制作技艺，从选泥、和泥、捏制到彩绘，每一个步骤都一丝不苟，精湛的技艺赢得了观众的阵阵掌声。同时，现场还展示了30多件泥彩人精品，包括传统经典作品和现代创新作品，全面展示了泥彩人的艺术魅力和文化内涵。许多外国观众被泥彩人的精美工艺所吸引，纷纷驻足欣赏，拍照留念，有的还亲自体验了泥彩人的制作过程。\n\n活动期间，还举办了国际非遗论坛、传承人交流研讨会等活动，泥彩人传承人与来自其他国家的非遗传承人进行了深入的交流和探讨，分享了各自的传承经验和创新理念。许多外国传承人表示，通过这次交流，他们对中国的泥彩人技艺有了更深入的了解，希望未来能够有更多的机会进行交流与合作。\n\n据活动主办方介绍，举办此次国际非遗交流活动的目的是促进各国非遗的交流与合作，推动世界非遗的保护和传承。泥彩人技艺在此次活动中的精彩展示，不仅向世界展示了中国传统工艺的魅力，也为泥彩人技艺的国际传播和交流搭建了平台。',
    image: news6Img,
    category: 'activity',
    date: '2023-07-28',
  },
  {
    id: 7,
    title: '泥彩人数字博物馆正式上线',
    excerpt:
      '为了适应数字化时代的发展需求，扩大泥彩人的影响力和传播范围，近日，泥彩人数字博物馆正式上线...',
    content:
      '为了适应数字化时代的发展需求，扩大泥彩人的影响力和传播范围，近日，由江苏省文化和旅游厅、南京艺术学院共同打造的泥彩人数字博物馆正式上线。这是全国首个以泥彩人为主题的数字博物馆，旨在通过数字技术，让更多的人了解和喜爱泥彩人这一传统非遗。\n\n泥彩人数字博物馆采用了3D建模、虚拟现实、增强现实等先进技术，打造了一个沉浸式的数字体验空间。博物馆分为"历史长廊"、"技艺展示"、"精品欣赏"、"传承人风采"、"互动体验"等多个板块，通过文字、图片、音频、视频、3D模型等多种形式，全方位、多角度地展示了泥彩人的历史文化、制作技艺、艺术特色和传承现状。\n\n在"互动体验"板块，观众可以通过虚拟现实技术，亲身体验泥彩人的制作过程；通过增强现实技术，将虚拟的泥彩人作品"放置"在现实环境中进行欣赏；还可以参与泥彩人知识问答、作品评选等互动活动，增强参与感。\n\n泥彩人数字博物馆的上线，为泥彩人的保护、传承和发展开辟了新的途径。据相关负责人介绍，未来，他们将继续完善数字博物馆的内容和功能，定期更新展览内容，举办线上活动，为观众提供更加丰富、便捷的数字文化服务。同时，他们还将加强与其他数字平台的合作，扩大泥彩人的传播范围和影响力。',
    image: news7Img,
    category: 'innovation',
    date: '2023-07-10',
  },
  {
    id: 8,
    title: '国家级非遗传承人张明山收徒仪式在无锡举行',
    excerpt:
      '为了传承和弘扬泥彩人制作技艺，近日，国家级非遗传承人张明山收徒仪式在无锡举行，来自全国各地的10名青年爱好者成为他的入室弟子...',
    content:
      '为了传承和弘扬泥彩人制作技艺，近日，国家级非遗传承人张明山收徒仪式在无锡举行。来自全国各地的10名青年爱好者成为他的入室弟子，将跟随他系统学习泥彩人的制作技艺。\n\n收徒仪式按照传统礼仪进行，包括敬茶、拜师、师父训话等环节。在仪式上，张明山向弟子们传授了泥彩人制作技艺的精髓和传承理念，希望他们能够肩负起传承和弘扬泥彩人制作技艺的责任，不断学习和创新，将这一传统工艺发扬光大。弟子们纷纷表示，一定会珍惜这次机会，认真学习，努力提高自己的技艺水平，不辜负师父的期望。\n\n张明山是泥彩人制作技艺的代表性传承人之一，从艺50余年，技艺精湛，创作了大量具有历史价值和艺术价值的经典作品。近年来，他致力于泥彩人技艺的传承和推广工作，先后培养了50多名徒弟，为泥彩人技艺的传承和发展做出了重要贡献。\n\n此次活动是张明山近年来规模最大的一次收徒活动，旨在为泥彩人技艺培养更多的青年传承人。未来，他将通过定期授课、实践指导、作品点评等方式，对弟子们进行系统的培训，帮助他们掌握泥彩人的制作技艺和艺术精髓。同时，他还将鼓励弟子们在传承传统技艺的基础上进行创新，开发更多符合现代人审美和需求的泥彩人作品，推动泥彩人技艺的创新发展。',
    image: news8Img,
    category: 'heritage',
    date: '2023-06-25',
  },
  {
    id: 9,
    title: '"泥彩人暑期夏令营"活动招募中',
    excerpt:
      '为了丰富青少年的暑期生活，让更多的青少年了解和喜爱泥彩人这一传统非遗，近日，"泥彩人暑期夏令营"活动开始招募...',
    content:
      '为了丰富青少年的暑期生活，让更多的青少年了解和喜爱泥彩人这一传统非遗，近日，由苏州市非物质文化遗产保护中心主办的"泥彩人暑期夏令营"活动开始招募。本次夏令营面向8-16岁的青少年，将于7月15日至21日在苏州市泥彩人传习所举行，为期7天。\n\n夏令营期间，将邀请国家级、省级非遗传承人担任导师，通过理论讲解、实践操作、参观考察等多种形式，向营员们传授泥彩人的历史文化、制作技艺和艺术欣赏等方面的知识。营员们将在导师的指导下，系统学习泥彩人的选泥、和泥、捏制、晾干、彩绘等制作工序，完成自己的泥彩人作品。同时，还将组织营员们参观泥彩人博物馆、传承人工作室等，了解泥彩人的发展现状和传承情况。\n\n据活动主办方介绍，举办此次夏令营的目的是让青少年在轻松愉快的氛围中学习传统文化，体验传统工艺，增强文化自信和民族自豪感。同时，也为泥彩人技艺的传承储备后备人才，促进泥彩人技艺的保护和传承。\n\n报名参加夏令营的家长们表示，这样的活动非常有意义，能够让孩子们在暑期远离电子产品，接触传统文化，学习传统工艺，培养动手能力和创造力。许多孩子也对此次夏令营充满了期待，表示希望能够在夏令营中学习到泥彩人的制作技艺，交到新朋友。',
    image: news9Img,
    category: 'education',
    date: '2023-06-10',
  },
  {
    id: 10,
    title: '泥彩人主题文创店在苏州平江路开业',
    excerpt:
      '近日，一家以泥彩人为主题的文创店在苏州平江路历史文化街区开业，店内销售各类泥彩人文创产品，受到了游客和市民的热烈欢迎...',
    content:
      '近日，一家以泥彩人为主题的文创店在苏州平江路历史文化街区开业。这家名为"泥彩坊"的文创店由苏州市非物质文化遗产保护中心与当地企业合作创办，旨在通过文创产品的开发和销售，推广泥彩人文化，促进泥彩人技艺的传承和发展。\n\n店内销售的文创产品种类丰富，包括传统泥彩人作品、泥彩人主题文具、家居装饰品、服饰配件、礼品等，既有传统风格的产品，也有现代设计的产品，满足了不同消费者的需求。其中，泥彩人表情包系列文创产品、泥彩人主题笔记本、泥彩人造型钥匙扣等产品尤为畅销，深受年轻人的喜爱。\n\n除了销售文创产品外，店内还设置了泥彩人制作体验区，游客可以在专业传承人的指导下，亲身体验泥彩人的制作过程，感受传统工艺的魅力。许多游客表示，这样的文创店很有特色，不仅能够购买到精美的泥彩人文创产品，还能够体验泥彩人的制作过程，了解泥彩人的历史文化，非常有意义。\n\n据文创店负责人介绍，他们希望通过这家文创店，让更多的人了解和喜爱泥彩人这一传统非遗，扩大泥彩人的影响力和知名度。同时，也为泥彩人传承人和企业搭建了一个合作平台，促进泥彩人技艺的创新发展和市场转化。未来，他们将继续开发更多具有泥彩人元素的文创产品，举办各类泥彩人文化活动，为泥彩人的传承和发展做出更大的贡献。',
    image: news10Img,
    category: 'innovation',
    date: '2023-05-20',
  },
  {
    id: 11,
    title: '泥彩人作品在"中国非物质文化遗产博览会"上备受关注',
    excerpt:
      '近日，第八届中国非物质文化遗产博览会会在济南举行，泥彩人作品作为江苏省的代表项目参展，备受关注...',
    content:
      '近日，第八届中国非物质文化遗产博览会会在济南举行。泥彩人作品作为江苏省的代表项目参展，备受关注和好评。\n\n在博览会，江苏省展团展示了100多件泥彩人精品，包括传统经典作品和现代创新作品，全面展示了泥彩人的艺术魅力和文化内涵。其中，明代的"大阿福"、清代的"福禄寿三星"等传统经典作品，以及"泥彩人表情包系列"、"泥彩人主题文创产品"等现代创新作品尤为引人注目，吸引了众多观众驻足欣赏和拍照留念。\n\n此外，泥彩人传承人们还现场展示了泥彩人的制作技艺，从选泥、和泥、捏制到彩绘，每一个步骤都详细讲解，精湛的技艺赢得了观众的насти。许多观众表示，通过这次博览会，他们更加深入地了解了泥彩人的历史文化和制作技艺，对这项传统非遗有了新的认识和喜爱。\n\n据江苏省文化和旅游厅相关负责人介绍，此次参加中国非物质文化遗产博览会，是为了展示江苏省泥彩人保护和传承的成果，促进与其他地区非遗项目的交流与合作，推动泥彩人技艺的传承和发展。通过这次博览会，泥彩人的知名度和影响力得到了进一步提升，为泥彩人的保护和传承创造了更好的条件。',
    image: news11Img,
    category: 'exhibition',
    date: '2023-05-05',
  },
  {
    id: 12,
    title: '泥彩人保护传承专项基金设立',
    excerpt:
      '为了加强泥彩人制作技艺的保护和传承，近日，由江苏省文化和旅游厅、江苏省财政厅共同设立的"泥彩人保护传承专项基金"启动...',
    content:
      '为了加强泥彩人制作技艺的保护和传承，近日，由江苏省文化和旅游厅、江苏省财政厅共同设立的"泥彩人保护传承专项基金"启动。该基金总规模为5000万元，将用于泥彩人制作技艺的保护、传承、研究、推广等方面的工作。\n\n据了解，专项基金将重点支持以下几个方面的工作：一是支持泥彩人传承人的培养和培训，包括举办传承人培训班、建立传承基地、资助传承人开展传承活动等；二是支持泥彩人技艺的研究和记录，包括开展泥彩人历史文化研究、制作技艺记录、出版研究成果等；三是支持泥彩人的展示和推广，包括举办泥彩人展览、开展泥彩人文化宣传活动、开发泥彩人文创产品等；四是支持泥彩人技艺的创新和发展，包括鼓励传承人进行技艺创新、支持泥彩人与现代设计的融合、推动泥彩人产业化发展等。\n\n江苏省文化和旅游厅相关负责人表示，设立专项基金是加强泥彩人保护和传承的重要举措，将为泥彩人的保护和传承提供有力的资金支持。未来，他们将加强对专项基金的管理和监督，确保基金用于泥彩人保护和传承的关键领域和重点项目，提高基金的使用效益。同时，他们希望在专项基金的引导作用，吸引更多的社会力量参与泥彩人的保护和传承，形成政府主导、社会参与的多元保护传承机制。\n\n许多泥彩人传承人和专家表示，专项基金的设立是泥彩人保护和传承工作的重要里程碑，将为泥彩人的保护和传承注入新的活力。相信在专项基金的支持下，泥彩人制作技艺一定能够得到更好的保护和传承，焕发新的生机和活力。',
    image: news12Img,
    category: 'heritage',
    date: '2023-04-20',
  },
])

// 筛选后的新闻列表
const filteredNews = computed(() => {
  let result = allNews.value

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter((news) => news.category === selectedCategory.value)
  }

  // 按关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    result = result.filter(
      (news) =>
        news.title.toLowerCase().includes(keyword) ||
        news.excerpt.toLowerCase().includes(keyword) ||
        news.content.toLowerCase().includes(keyword),
    )
  }

  // 按日期排序（最新的在前）
  result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return result
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredNews.value.length / pageSize.value)
})

// 当前页显示的新闻
const paginatedNews = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredNews.value.slice(startIndex, endIndex)
})

// 获取分类文本
const getCategoryText = (category: string) => {
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
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 选择分类
const selectCategory = (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1 // 重置到第一页
}

// 筛选新闻
const filterNews = () => {
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.category-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 10px 20px;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tab:hover {
  background-color: #e0e0e0;
}

.category-tab.active {
  background-color: #d93b30;
  color: white;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
  max-width: 400px;
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

/* 新闻数量统计 */
.news-count {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  text-align: right;
}

/* 新闻列表区域样式 */
.news-section {
  background-color: #f9f9f9;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 40px;
}

.news-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 30px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.news-img-container {
  flex: 0 0 300px;
  height: 200px;
  overflow: hidden;
}

.news-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-item:hover .news-img {
  transform: scale(1.05);
}

.news-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.news-category {
  padding: 4px 12px;
  background-color: #d93b30;
  color: white;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

.news-date {
  font-size: 14px;
  color: #999;
}

.news-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-excerpt {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-actions {
  margin-top: auto;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #d93b30;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.read-more-btn:hover {
  color: #b92c23;
  transform: translateX(5px);
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

  .filter-content {
    flex-direction: column;
    align-items: stretch;
  }

  .category-tabs {
    justify-content: center;
  }

  .search-box {
    max-width: 100%;
  }

  .news-item {
    gap: 20px;
  }

  .news-img-container {
    flex: 0 0 250px;
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

  section {
    padding: 40px 0;
  }

  .news-item {
    flex-direction: column;
    gap: 0;
  }

  .news-img-container {
    flex: 0 0 200px;
    width: 100%;
  }

  .news-content {
    padding: 20px;
  }

  .news-title {
    font-size: 20px;
  }

  .news-excerpt {
    font-size: 14px;
  }

  .pagination {
    flex-direction: column;
  }

  .news-count {
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

  .category-tab {
    padding: 8px 16px;
    font-size: 12px;
  }

  .news-img-container {
    height: 150px;
  }

  .news-content {
    padding: 15px;
  }

  .news-title {
    font-size: 18px;
  }

  .news-meta {
    flex-direction: column;
    gap: 10px;
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
