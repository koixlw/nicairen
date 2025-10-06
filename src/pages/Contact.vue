<template>
  <div class="contact-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">联系我们</h1>
        <p class="page-subtitle">如果您对泥彩人有任何疑问或建议，欢迎随时与我们联系</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <section class="contact-info">
      <div class="container">
        <div class="info-grid">
          <!-- 地址信息 -->
          <div class="info-card">
            <div class="info-icon">
              <i class="icon-map-marker"></i>
            </div>
            <div class="info-content">
              <h3 class="info-title">地址</h3>
              <p class="info-text">江苏省南京市秦淮区夫子庙景区内泥彩人艺术馆</p>
              <a href="#map" class="info-link" @click="scrollToMap">查看地图</a>
            </div>
          </div>

          <!-- 电话信息 -->
          <div class="info-card">
            <div class="info-icon">
              <i class="icon-phone"></i>
            </div>
            <div class="info-content">
              <h3 class="info-title">电话</h3>
              <p class="info-text">+86 025-12345678</p>
              <p class="info-text">+86 138-8888-8888</p>
              <a href="tel:+8602512345678" class="info-link">立即拨打</a>
            </div>
          </div>

          <!-- 邮箱信息 -->
          <div class="info-card">
            <div class="info-icon">
              <i class="icon-envelope"></i>
            </div>
            <div class="info-content">
              <h3 class="info-title">邮箱</h3>
              <p class="info-text">info@nicairen.com</p>
              <p class="info-text">contact@nicairen.com</p>
              <a href="mailto:info@nicairen.com" class="info-link">发送邮件</a>
            </div>
          </div>

          <!-- 工作时间 -->
          <div class="info-card">
            <div class="info-icon">
              <i class="icon-clock-o"></i>
            </div>
            <div class="info-content">
              <h3 class="info-title">工作时间</h3>
              <p class="info-text">周一至周五: 9:00 - 18:00</p>
              <p class="info-text">周六至周日: 10:00 - 20:00</p>
              <p class="info-text">节假日: 10:00 - 21:00</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 地图和表单区域 -->
    <section class="contact-map-form">
      <div class="container">
        <div class="map-form-wrapper">
          <!-- 地图区域 -->
          <div class="map-container" id="map">
            <!-- 这里会嵌入地图，实际项目中可以使用百度地图、高德地图等API -->
            <div class="map-placeholder">
              <img :src="mapPlaceholderImg" alt="泥彩人艺术馆地图" class="map-image" />
              <div class="map-marker">
                <i class="icon-map-marker"></i>
              </div>
              <div class="map-loading">
                <div class="loading-spinner"></div>
                <p>地图加载中...</p>
              </div>
            </div>
          </div>

          <!-- 联系表单 -->
          <div class="contact-form-container">
            <h2 class="form-title">发送留言</h2>
            <form class="contact-form" @submit.prevent="submitForm">
              <!-- 姓名 -->
              <div class="form-group">
                <label for="name" class="form-label">姓名 <span class="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  class="form-input"
                  placeholder="请输入您的姓名"
                  required
                />
                <div class="error-message" v-if="errors.name">{{ errors.name }}</div>
              </div>

              <!-- 邮箱 -->
              <div class="form-group">
                <label for="email" class="form-label">邮箱 <span class="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="form-input"
                  placeholder="请输入您的邮箱"
                  required
                />
                <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
              </div>

              <!-- 电话 -->
              <div class="form-group">
                <label for="phone" class="form-label">电话</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  class="form-input"
                  placeholder="请输入您的联系电话"
                />
                <div class="error-message" v-if="errors.phone">{{ errors.phone }}</div>
              </div>

              <!-- 主题 -->
              <div class="form-group">
                <label for="subject" class="form-label">主题 <span class="required">*</span></label>
                <select id="subject" v-model="formData.subject" class="form-select" required>
                  <option value="">请选择留言主题</option>
                  <option value="visit">参观咨询</option>
                  <option value="cooperation">合作洽谈</option>
                  <option value="inheritance">传承学习</option>
                  <option value="feedback">建议反馈</option>
                  <option value="other">其他问题</option>
                </select>
                <div class="error-message" v-if="errors.subject">{{ errors.subject }}</div>
              </div>

              <!-- 留言内容 -->
              <div class="form-group">
                <label for="message" class="form-label"
                  >留言内容 <span class="required">*</span></label
                >
                <textarea
                  id="message"
                  v-model="formData.message"
                  class="form-textarea"
                  placeholder="请输入您的留言内容"
                  rows="5"
                  required
                ></textarea>
                <div class="error-message" v-if="errors.message">{{ errors.message }}</div>
                <div class="char-count">{{ formData.message.length }}/500</div>
              </div>

              <!-- 验证码 -->
              <div class="form-group captcha-group">
                <label for="captcha" class="form-label"
                  >验证码 <span class="required">*</span></label
                >
                <div class="captcha-wrapper">
                  <input
                    type="text"
                    id="captcha"
                    v-model="formData.captcha"
                    class="form-input captcha-input"
                    placeholder="请输入验证码"
                    required
                  />
                  <div class="captcha-image" @click="refreshCaptcha">
                    {{ captchaText }}
                  </div>
                </div>
                <div class="error-message" v-if="errors.captcha">{{ errors.captcha }}</div>
              </div>

              <!-- 提交按钮 -->
              <div class="form-group">
                <button type="submit" class="submit-btn" :disabled="submitting">
                  <span v-if="submitting"> <i class="icon-spinner icon-spin"></i> 提交中... </span>
                  <span v-else>提交留言</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- 常见问题 -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-list">
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
            <div class="faq-question" @click="toggleFaq(index)">
              <span class="faq-icon">{{ faq.open ? '−' : '+' }}</span>
              <span class="faq-text">{{ faq.question }}</span>
            </div>
            <div class="faq-answer" v-show="faq.open">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 社交媒体 -->
    <section class="social-section">
      <div class="container">
        <h2 class="section-title">关注我们</h2>
        <p class="section-subtitle">通过社交媒体了解更多泥彩人非遗文化</p>
        <div class="social-icons">
          <a
            href="#"
            class="social-icon social-weixin"
            @click.stop="showWeixinCode = !showWeixinCode"
          >
            <i class="icon-weixin"></i>
            <span>微信公众号</span>
            <div class="weixin-code-popover" v-if="showWeixinCode">
              <img :src="weixinOfficialImg" alt="微信公众号" />
              <p>扫码关注获取更多资讯</p>
            </div>
          </a>
          <a href="#" class="social-icon social-weibo">
            <i class="icon-weibo"></i>
            <span>微博</span>
          </a>
          <a href="#" class="social-icon social-douyin">
            <i class="icon-douyin"></i>
            <span>抖音</span>
          </a>
          <a href="#" class="social-icon social-youtube">
            <i class="icon-youtube-play"></i>
            <span>YouTube</span>
          </a>
          <a href="#" class="social-icon social-instagram">
            <i class="icon-instagram"></i>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </section>

    <!-- 返回顶部按钮 -->
    <button class="back-to-top" @click="backToTop" v-show="showBackToTop">
      <i class="icon-arrow-up"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
// 定义组件名称以符合多词规范
defineOptions({
  name: 'ContactPage',
})

import { ref, onMounted, onUnmounted } from 'vue'
// 移除未使用的computed导入
// import { computed } from 'vue';

// 导入图片资源
import mapPlaceholderImg from '@/assets/images/map-placeholder.jpg'
import weixinOfficialImg from '@/assets/images/weixin-official.png'

// 表单数据
const formData = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  captcha: '',
})

// 表单验证错误
const errors = ref<{
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  captcha?: string
}>({})

// 表单提交状态
const submitting = ref(false)

// 显示返回顶部按钮
const showBackToTop = ref(false)

// 显示微信二维码
const showWeixinCode = ref(false)

// 验证码文本
const captchaText = ref('')

// 常见问题数据
const faqs = ref([
  {
    question: '如何参观泥彩人艺术馆？',
    answer:
      '泥彩人艺术馆位于江苏省南京市秦淮区夫子庙景区内，您可以乘坐地铁1号线至三山街站下车，步行约10分钟即可到达。也可以乘坐公交1路、4路、7路等线路至夫子庙站下车。艺术馆开放时间为周一至周五9:00-18:00，周六至周日10:00-20:00，节假日10:00-21:00。',
    open: false,
  },
  {
    question: '参观泥彩人艺术馆需要门票吗？',
    answer:
      '是的，泥彩人艺术馆需要购买门票。成人票为60元/人，学生票（凭学生证）为30元/人，65岁以上老人（凭身份证）、残疾人（凭残疾证）、1.2米以下儿童免票。团体票（20人以上）可享受9折优惠。您可以在艺术馆现场购票，也可以通过我们的官方网站或合作平台提前购票。',
    open: false,
  },
  {
    question: '如何报名参加泥彩人制作体验活动？',
    answer:
      '您可以通过以下方式报名参加泥彩人制作体验活动：1. 拨打我们的客服电话025-12345678进行预约；2. 发送邮件至contact@nicairen.com进行预约；3. 在我们的官方网站或微信公众号上在线预约。体验活动需要提前3天预约，每次活动时长约1.5小时，费用为80元/人（含材料和指导费）。',
    open: false,
  },
  {
    question: '如何成为泥彩人的传承人？',
    answer:
      '成为泥彩人的传承人需要经过系统的学习和实践。我们提供不同级别的传承培训课程，包括基础班、进阶班和大师班。您可以通过我们的官方渠道了解最新的培训信息并报名参加。另外，我们也欢迎有相关艺术背景和兴趣的人士加入我们的传承团队，共同推动泥彩人技艺的传承和发展。',
    open: false,
  },
  {
    question: '泥彩人作品可以定制吗？',
    answer:
      '是的，我们提供泥彩人作品的定制服务。您可以根据自己的需求定制各种题材、尺寸和风格的泥彩人作品。定制流程包括：1. 联系我们提供定制需求和参考图片；2. 我们的设计师根据您的需求进行设计并报价；3. 确认设计和价格后支付定金；4. 制作完成后验收并支付尾款。定制周期根据作品的复杂程度而定，一般为1-4周。',
    open: false,
  },
  {
    question: '如何与泥彩人艺术馆进行合作？',
    answer:
      '我们欢迎各类机构和个人与我们进行合作，包括但不限于：文化活动策划、展览展示、文创产品开发、教育培训、媒体合作等。如果您有合作意向，请通过电话025-12345678或邮件contact@nicairen.com与我们联系，我们的工作人员会尽快回复您并安排进一步的洽谈。',
    open: false,
  },
])

// 生成验证码
const generateCaptcha = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 刷新验证码
const refreshCaptcha = () => {
  captchaText.value = generateCaptcha()
}

// 表单验证
const validateForm = () => {
  let isValid = true
  errors.value = {}

  // 验证姓名
  if (!formData.value.name.trim()) {
    errors.value.name = '请输入您的姓名'
    isValid = false
  }

  // 验证邮箱
  if (!formData.value.email.trim()) {
    errors.value.email = '请输入您的邮箱'
    isValid = false
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  // 验证电话
  if (formData.value.phone.trim() && !/^1[3-9]\d{9}$/.test(formData.value.phone.trim())) {
    errors.value.phone = '请输入有效的手机号码'
    isValid = false
  }

  // 验证主题
  if (!formData.value.subject) {
    errors.value.subject = '请选择留言主题'
    isValid = false
  }

  // 验证留言内容
  if (!formData.value.message.trim()) {
    errors.value.message = '请输入留言内容'
    isValid = false
  } else if (formData.value.message.length > 500) {
    errors.value.message = '留言内容不能超过500个字符'
    isValid = false
  }

  // 验证验证码
  if (!formData.value.captcha.trim()) {
    errors.value.captcha = '请输入验证码'
    isValid = false
  } else if (formData.value.captcha.toUpperCase() !== captchaText.value) {
    errors.value.captcha = '验证码错误'
    isValid = false
  }

  return isValid
}

// 提交表单
const submitForm = () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true

  // 模拟API请求
  setTimeout(() => {
    submitting.value = false
    alert('留言提交成功！我们会尽快与您联系。')

    // 重置表单
    formData.value = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      captcha: '',
    }

    // 刷新验证码
    refreshCaptcha()
  }, 1500)
}

// 切换FAQ展开状态
const toggleFaq = (index: number) => {
  if (faqs.value[index]) {
    faqs.value[index].open = !faqs.value[index].open
  }
}

// 滚动到地图位置
const scrollToMap = () => {
  const mapElement = document.getElementById('map')
  if (mapElement) {
    mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 返回顶部
const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

// 监听点击事件，关闭微信二维码
const handleClickOutside = (event: Event) => {
  const socialIcons = document.querySelector('.social-icons')
  const weixinIcon = document.querySelector('.social-weixin')

  if (
    socialIcons &&
    weixinIcon &&
    !socialIcons.contains(event.target as Node) &&
    showWeixinCode.value
  ) {
    showWeixinCode.value = false
  }
}

// 组件挂载时初始化
onMounted(() => {
  // 生成初始验证码
  refreshCaptcha()

  // 监听滚动事件
  window.addEventListener('scroll', handleScroll)

  // 监听点击事件
  document.addEventListener('click', handleClickOutside)

  // 模拟加载地图
  setTimeout(() => {
    const mapLoading = document.querySelector('.map-loading') as HTMLElement
    if (mapLoading) {
      mapLoading.style.display = 'none'
    }
  }, 1500)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
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

.section-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.section-subtitle {
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-bottom: 50px;
}

/* 联系信息区域样式 */
.contact-info {
  background-color: white;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.info-icon {
  flex: 0 0 60px;
  height: 60px;
  background-color: #d93b30;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.info-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
  line-height: 1.6;
}

.info-link {
  display: inline-block;
  font-size: 14px;
  color: #d93b30;
  text-decoration: none;
  margin-top: 10px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.info-link:hover {
  color: #b92c23;
}

/* 地图和表单区域样式 */
.contact-map-form {
  background-color: #f9f9f9;
}

.map-form-wrapper {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.map-container {
  flex: 1;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background-color: #e0e0e0;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-marker {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;
  color: #d93b30;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #d93b30;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.contact-form-container {
  flex: 0 0 500px;
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.contact-form {
  width: 100%;
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.required {
  color: #d93b30;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #d93b30;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.error-message {
  position: absolute;
  bottom: -20px;
  left: 0;
  font-size: 12px;
  color: #d93b30;
}

.char-count {
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 12px;
  color: #999;
}

.captcha-group {
  margin-bottom: 30px;
}

.captcha-wrapper {
  display: flex;
  gap: 15px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  flex: 0 0 120px;
  height: 46px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  letter-spacing: 5px;
}

.captcha-image:hover {
  background-color: #e0e0e0;
  border-color: #d93b30;
}

.submit-btn {
  width: 100%;
  padding: 15px 30px;
  background-color: #d93b30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #b92c23;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 59, 48, 0.3);
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 常见问题样式 */
.faq-section {
  background-color: white;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.faq-question {
  padding: 20px;
  background-color: #f9f9f9;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background-color: #f0f0f0;
}

.faq-icon {
  flex: 0 0 20px;
  height: 20px;
  background-color: #d93b30;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.faq-text {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.faq-answer {
  padding: 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 社交媒体样式 */
.social-section {
  background-color: #f9f9f9;
}

.social-icons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.social-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.social-icon:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.social-weixin:hover {
  border-color: #07c160;
  color: #07c160;
}

.social-weibo:hover {
  border-color: #e6162d;
  color: #e6162d;
}

.social-douyin:hover {
  border-color: #000000;
  color: #000000;
}

.social-youtube:hover {
  border-color: #ff0000;
  color: #ff0000;
}

.social-instagram:hover {
  border-color: #e1306c;
  color: #e1306c;
}

.weixin-code-popover {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.weixin-code-popover img {
  width: 150px;
  height: 150px;
  margin-bottom: 10px;
}

.weixin-code-popover p {
  font-size: 14px;
  color: #666;
  margin: 0;
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

  .section-title {
    font-size: 32px;
  }

  .map-form-wrapper {
    gap: 30px;
  }

  .contact-form-container {
    flex: 0 0 450px;
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
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

  .section-title {
    font-size: 28px;
  }

  .section-subtitle {
    font-size: 16px;
  }

  .map-form-wrapper {
    flex-direction: column;
    gap: 30px;
  }

  .map-container {
    height: 400px;
  }

  .contact-form-container {
    flex: 1;
    padding: 30px;
  }

  .form-title {
    font-size: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .social-icons {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .social-icon {
    width: 280px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .section-subtitle {
    font-size: 14px;
  }

  .info-card {
    padding: 20px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .info-icon {
    flex: 0 0 50px;
    height: 50px;
    font-size: 20px;
    margin-bottom: 15px;
  }

  .contact-form-container {
    padding: 20px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    font-size: 14px;
  }

  .captcha-wrapper {
    flex-direction: column;
    gap: 10px;
  }

  .captcha-image {
    flex: 0 0 auto;
    width: 100%;
  }

  .submit-btn {
    font-size: 16px;
  }

  .faq-question {
    padding: 15px;
    gap: 10px;
  }

  .faq-text {
    font-size: 14px;
  }

  .faq-answer {
    padding: 15px;
    font-size: 14px;
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
