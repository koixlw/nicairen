<template>
  <div class="reserve-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">体验预约</h1>
        <p class="page-subtitle">预约泥彩人制作体验，亲手感受非遗文化的魅力</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <section class="reserve-content">
      <div class="container">
        <div class="reserve-wrapper">
          <!-- 预约表单 -->
          <div class="reserve-form-container">
            <h2 class="form-title">填写预约信息</h2>
            <form class="reserve-form" @submit.prevent="submitReservation">
              <!-- 预约类型 -->
              <div class="form-group">
                <label class="form-label">预约类型 <span class="required">*</span></label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input
                      type="radio"
                      value="individual"
                      v-model="formData.reservationType"
                      @change="onReservationTypeChange"
                    />
                    <span>个人预约</span>
                  </label>
                  <label class="radio-label">
                    <input
                      type="radio"
                      value="group"
                      v-model="formData.reservationType"
                      @change="onReservationTypeChange"
                    />
                    <span>团体预约</span>
                  </label>
                </div>
                <div class="error-message" v-if="errors.reservationType">
                  {{ errors.reservationType }}
                </div>
              </div>

              <!-- 活动类型 -->
              <div class="form-group">
                <label for="activityType" class="form-label"
                  >活动类型 <span class="required">*</span></label
                >
                <select
                  id="activityType"
                  v-model="formData.activityType"
                  class="form-select"
                  required
                >
                  <option value="">请选择活动类型</option>
                  <option value="basic">基础泥彩人制作</option>
                  <option value="advanced">高级泥彩人创作</option>
                  <option value="family">亲子体验活动</option>
                  <option value="workshop">企业团建工坊</option>
                  <option value="custom">定制主题活动</option>
                </select>
                <div class="error-message" v-if="errors.activityType">
                  {{ errors.activityType }}
                </div>
              </div>

              <!-- 预约日期 -->
              <div class="form-group">
                <label for="reservationDate" class="form-label"
                  >预约日期 <span class="required">*</span></label
                >
                <input
                  type="date"
                  id="reservationDate"
                  v-model="formData.reservationDate"
                  class="form-input"
                  :min="minDate"
                  :max="maxDate"
                  required
                />
                <div class="error-message" v-if="errors.reservationDate">
                  {{ errors.reservationDate }}
                </div>
                <div class="date-notice" v-if="formData.reservationDate">
                  <span>{{ getWeekday(formData.reservationDate) }}</span>
                  <span v-if="isHoliday(formData.reservationDate)" class="holiday">节假日</span>
                </div>
              </div>

              <!-- 预约时间段 -->
              <div class="form-group">
                <label class="form-label">预约时间段 <span class="required">*</span></label>
                <div class="time-slots">
                  <button
                    type="button"
                    v-for="slot in availableTimeSlots"
                    :key="slot.time"
                    class="time-slot-btn"
                    :class="{ active: formData.timeSlot === slot.time, disabled: !slot.available }"
                    :disabled="!slot.available"
                    @click="selectTimeSlot(slot.time)"
                  >
                    {{ slot.time }}
                    <span class="time-slot-status">{{ slot.status }}</span>
                  </button>
                </div>
                <div class="error-message" v-if="errors.timeSlot">{{ errors.timeSlot }}</div>
              </div>

              <!-- 预约人姓名 -->
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

              <!-- 联系电话 -->
              <div class="form-group">
                <label for="phone" class="form-label"
                  >联系电话 <span class="required">*</span></label
                >
                <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  class="form-input"
                  placeholder="请输入您的联系电话"
                  required
                />
                <div class="error-message" v-if="errors.phone">{{ errors.phone }}</div>
              </div>

              <!-- 电子邮箱 -->
              <div class="form-group">
                <label for="email" class="form-label">电子邮箱</label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="form-input"
                  placeholder="请输入您的电子邮箱"
                />
                <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
              </div>

              <!-- 人数选择 -->
              <div class="form-group">
                <label for="participants" class="form-label"
                  >参与人数 <span class="required">*</span></label
                >
                <div class="participants-selector">
                  <button
                    type="button"
                    class="count-btn"
                    @click="decreaseParticipants"
                    :disabled="formData.participants <= 1"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="participants"
                    v-model.number="formData.participants"
                    class="participants-input"
                    min="1"
                    max="50"
                    required
                  />
                  <button
                    type="button"
                    class="count-btn"
                    @click="increaseParticipants"
                    :disabled="formData.participants >= 50"
                  >
                    +
                  </button>
                </div>
                <div class="error-message" v-if="errors.participants">
                  {{ errors.participants }}
                </div>
              </div>

              <!-- 团体名称（仅团体预约显示） -->
              <div class="form-group" v-if="formData.reservationType === 'group'">
                <label for="groupName" class="form-label"
                  >团体名称 <span class="required">*</span></label
                >
                <input
                  type="text"
                  id="groupName"
                  v-model="formData.groupName"
                  class="form-input"
                  placeholder="请输入团体名称"
                  required
                />
                <div class="error-message" v-if="errors.groupName">{{ errors.groupName }}</div>
              </div>

              <!-- 特殊需求 -->
              <div class="form-group">
                <label for="specialRequirements" class="form-label">特殊需求</label>
                <textarea
                  id="specialRequirements"
                  v-model="formData.specialRequirements"
                  class="form-textarea"
                  placeholder="请输入您的特殊需求（如有）"
                  rows="4"
                ></textarea>
                <div class="char-count">{{ formData.specialRequirements.length }}/200</div>
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

              <!-- 同意条款 -->
              <div class="form-group agreement-group">
                <label class="agreement-label">
                  <input type="checkbox" v-model="formData.agreeTerms" required />
                  <span>
                    我已阅读并同意<a
                      href="#terms"
                      class="terms-link"
                      @click.stop="showTermsModal = true"
                      >《预约须知》</a
                    >和<a href="#privacy" class="terms-link" @click.stop="showPrivacyModal = true"
                      >《隐私政策》</a
                    >
                  </span>
                </label>
                <div class="error-message" v-if="errors.agreeTerms">{{ errors.agreeTerms }}</div>
              </div>

              <!-- 提交按钮 -->
              <div class="form-group">
                <button type="submit" class="submit-btn" :disabled="submitting">
                  <span v-if="submitting"> <i class="icon-spinner icon-spin"></i> 提交中... </span>
                  <span v-else>提交预约</span>
                </button>
              </div>
            </form>
          </div>

          <!-- 预约信息和须知 -->
          <div class="reserve-info">
            <!-- 体验信息 -->
            <div class="info-card">
              <h3 class="info-title"><i class="icon-info-circle"></i> 体验信息</h3>
              <div class="info-content">
                <div class="info-item">
                  <i class="icon-clock-o"></i>
                  <span>体验时长：约1.5-2小时</span>
                </div>
                <div class="info-item">
                  <i class="icon-money"></i>
                  <span>体验费用：80-200元/人（根据活动类型）</span>
                </div>
                <div class="info-item">
                  <i class="icon-magic"></i>
                  <span>提供材料：专业泥塑工具、颜料、泥料</span>
                </div>
                <div class="info-item">
                  <i class="icon-user"></i>
                  <span>指导老师：专业泥彩人传承人</span>
                </div>
                <div class="info-item">
                  <i class="icon-certificate"></i>
                  <span>完成作品：可带走自己创作的泥彩人作品</span>
                </div>
              </div>
            </div>

            <!-- 预约须知 -->
            <div class="info-card">
              <h3 class="info-title"><i class="icon-exclamation-circle"></i> 预约须知</h3>
              <div class="info-content">
                <ul class="notice-list">
                  <li>请提前至少3天进行预约，团体预约需提前7天。</li>
                  <li>预约成功后，我们将通过短信或电话确认您的预约信息。</li>
                  <li>如需取消预约，请提前24小时通知我们，否则将收取30%的费用。</li>
                  <li>体验当天请准时到达，迟到15分钟以上将视为自动放弃。</li>
                  <li>请穿着舒适的衣物，制作过程中可能会弄脏衣物。</li>
                  <li>12岁以下儿童需由成人陪同参加体验活动。</li>
                  <li>如需发票，请在预约时注明，我们将为您提供正规发票。</li>
                </ul>
              </div>
            </div>

            <!-- 联系咨询 -->
            <div class="info-card contact-card">
              <h3 class="info-title"><i class="icon-phone"></i> 联系咨询</h3>
              <div class="info-content">
                <p class="contact-text">如有任何疑问，请随时联系我们：</p>
                <div class="contact-options">
                  <a href="tel:+8602512345678" class="contact-btn phone-btn">
                    <i class="icon-phone"></i> 电话咨询
                  </a>
                  <a href="mailto:reserve@nicairen.com" class="contact-btn email-btn">
                    <i class="icon-envelope"></i> 邮件咨询
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门活动推荐 -->
    <section class="popular-activities">
      <div class="container">
        <h2 class="section-title">热门活动</h2>
        <div class="activities-grid">
          <div class="activity-card" v-for="(activity, index) in popularActivities" :key="index">
            <div class="activity-image">
              <img :src="activity.image" :alt="activity.title" class="activity-img" />
              <div class="activity-tag">{{ activity.tag }}</div>
            </div>
            <div class="activity-content">
              <h3 class="activity-title">{{ activity.title }}</h3>
              <p class="activity-description">{{ activity.description }}</p>
              <div class="activity-info">
                <span class="activity-price">{{ activity.price }}</span>
                <span class="activity-duration">{{ activity.duration }}</span>
              </div>
              <button class="activity-btn" @click="reserveActivity(activity.type)">立即预约</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 预约须知模态框 -->
    <div class="modal-overlay" v-if="showTermsModal" @click="showTermsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">预约须知</h3>
          <button class="modal-close" @click="showTermsModal = false">
            <i class="icon-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="terms-content">
            <h4>一、预约规则</h4>
            <ol>
              <li>请提前至少3天进行个人预约，团体预约（10人以上）需提前7天。</li>
              <li>预约成功后，我们将通过短信或电话确认您的预约信息。</li>
              <li>每张预约单最多可预约50人，超过50人请分开预约或联系我们进行团体预约。</li>
              <li>预约时请提供真实有效的个人信息，以便我们能够及时联系您。</li>
            </ol>

            <h4>二、取消与变更</h4>
            <ol>
              <li>如需取消预约，请提前24小时通知我们，否则将收取30%的费用。</li>
              <li>如需变更预约时间或人数，请提前12小时联系我们进行调整。</li>
              <li>未按时到达且未提前通知的，将视为自动放弃预约，不予退款。</li>
            </ol>

            <h4>三、体验当天须知</h4>
            <ol>
              <li>请准时到达体验地点，迟到15分钟以上将视为自动放弃。</li>
              <li>请穿着舒适的衣物，制作过程中可能会弄脏衣物。</li>
              <li>请遵守现场工作人员的指导和安排，确保体验活动顺利进行。</li>
              <li>12岁以下儿童需由成人陪同参加体验活动，成人需全程负责儿童的安全。</li>
              <li>请勿携带易燃易爆物品、尖锐物品等危险物品进入体验场所。</li>
              <li>请爱护体验场所的设施和工具，如有损坏需照价赔偿。</li>
            </ol>

            <h4>四、费用说明</h4>
            <ol>
              <li>体验费用包含：泥彩人制作所需的所有材料、工具使用、专业指导费用。</li>
              <li>完成的作品可免费带走，如需额外包装需支付相应费用。</li>
              <li>如需发票，请在预约时注明，我们将为您提供正规发票。</li>
              <li>团体预约（10人以上）可享受9折优惠。</li>
            </ol>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="showTermsModal = false">我知道了</button>
        </div>
      </div>
    </div>

    <!-- 隐私政策模态框 -->
    <div class="modal-overlay" v-if="showPrivacyModal" @click="showPrivacyModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">隐私政策</h3>
          <button class="modal-close" @click="showPrivacyModal = false">
            <i class="icon-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="terms-content">
            <h4>一、信息收集</h4>
            <p>
              我们收集的个人信息包括但不限于您的姓名、联系电话、电子邮箱、预约人数、特殊需求等。
            </p>

            <h4>二、信息使用</h4>
            <p>
              我们收集的个人信息仅用于为您提供预约服务、确认预约信息、联系您进行预约变更或取消等目的。
            </p>

            <h4>三、信息保护</h4>
            <p>我们采取严格的安全措施保护您的个人信息，防止信息泄露、丢失或被篡改。</p>

            <h4>四、信息共享</h4>
            <p>未经您的明确许可，我们不会向任何第三方共享您的个人信息，法律另有规定的除外。</p>

            <h4>五、您的权利</h4>
            <p>您有权访问、更正或删除您的个人信息，如有需要，请联系我们。</p>

            <h4>六、政策变更</h4>
            <p>我们可能会不时更新本隐私政策，更新后的政策将在网站上公布。</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="showPrivacyModal = false">我知道了</button>
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <button class="back-to-top" @click="backToTop" v-show="showBackToTop">
      <i class="icon-arrow-up"></i>
    </button>
  </div>
</template>

<script lang="ts" setup>
// 定义组件名称以符合多词规范
defineOptions({
  name: 'ReservePage',
})

import { ref, computed, onMounted, onUnmounted } from 'vue'
import work1 from '@/assets/images/activity/work1.jpg'

// 表单数据
const formData = ref({
  reservationType: 'individual', // individual: 个人预约, group: 团体预约
  activityType: '',
  reservationDate: new Date(), // 确保初始值是Date类型
  timeSlot: '',
  name: '',
  phone: '',
  email: '',
  participants: 1,
  groupName: '',
  specialRequirements: '',
  captcha: '',
  agreeTerms: false,
})

// 表单验证错误
const errors = ref<{
  reservationType?: string
  activityType?: string
  reservationDate?: string
  timeSlot?: string
  name?: string
  phone?: string
  email?: string
  participants?: string
  groupName?: string
  specialRequirements?: string
  captcha?: string
  agreeTerms?: string
}>({})

// 表单提交状态
const submitting = ref(false)

// 显示返回顶部按钮
const showBackToTop = ref(false)

// 显示预约须知模态框
const showTermsModal = ref(false)

// 显示隐私政策模态框
const showPrivacyModal = ref(false)

// 验证码文本
const captchaText = ref('')

// 热门活动数据
const popularActivities = ref([
  {
    title: '亲子泥彩人体验',
    description: '适合5-12岁儿童与家长一起参与，共同创作温馨的泥彩人作品。',
    price: '160元/组',
    duration: '约2小时',
    image: work1,
    tag: '亲子活动',
    type: 'family',
  },
  {
    title: '企业团建工坊',
    description: '为企业团队提供的特色团建活动，增强团队凝聚力，体验传统工艺魅力。',
    price: '120元/人',
    duration: '约2.5小时',
    image: work1,
    tag: '团建活动',
    type: 'workshop',
  },
  {
    title: '高级泥彩人创作',
    description: '针对有一定基础的学员，学习更复杂的泥彩人制作技巧和上色方法。',
    price: '200元/人',
    duration: '约3小时',
    image: work1,
    tag: '进阶课程',
    type: 'advanced',
  },
])

// 最小可预约日期（今天）
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// 最大可预约日期（3个月后）
const maxDate = computed(() => {
  const today = new Date()
  today.setMonth(today.getMonth() + 3)
  return today.toISOString().split('T')[0]
})

// 可用时间段
const availableTimeSlots = computed(() => {
  // 根据选择的日期计算可用时间段
  // 这里简单模拟，实际项目中应从后端获取
  const slots = [
    { time: '09:00-10:30', available: true, status: '可预约' },
    { time: '11:00-12:30', available: true, status: '可预约' },
    { time: '13:30-15:00', available: true, status: '可预约' },
    { time: '15:30-17:00', available: false, status: '已满' },
    { time: '17:30-19:00', available: true, status: '可预约' },
  ]

  // 如果是节假日，增加晚上的时间段
  if (formData.value.reservationDate && isHoliday(formData.value.reservationDate)) {
    slots.push({ time: '19:30-21:00', available: true, status: '可预约' })
  }

  return slots
})

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

// 获取星期几
const getWeekday = (dateString: string | Date) => {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return weekdays[date.getDay()]
}

// 判断是否为节假日
const isHoliday = (dateString: string | Date) => {
  // 这里简单模拟，实际项目中应从后端获取节假日信息
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const day = date.getDay()
  return day === 0 || day === 6 // 周末视为节假日
}

// 选择时间段
const selectTimeSlot = (timeSlot: string) => {
  formData.value.timeSlot = timeSlot
}

// 减少参与人数
const decreaseParticipants = () => {
  if (formData.value.participants > 1) {
    formData.value.participants--
  }
}

// 增加参与人数
const increaseParticipants = () => {
  if (formData.value.participants < 50) {
    formData.value.participants++
  }
}

// 预约类型变更
const onReservationTypeChange = () => {
  if (formData.value.reservationType === 'group' && formData.value.participants < 10) {
    formData.value.participants = 10
  }
}

// 预约特定活动
const reserveActivity = (activityType: string) => {
  formData.value.activityType = activityType
}

// 表单验证
const validateForm = () => {
  let isValid = true
  errors.value = {}

  // 验证预约类型
  if (!formData.value.reservationType) {
    errors.value.reservationType = '请选择预约类型'
    isValid = false
  }

  // 验证活动类型
  if (!formData.value.activityType) {
    errors.value.activityType = '请选择活动类型'
    isValid = false
  }

  // 验证预约日期
  if (!formData.value.reservationDate) {
    errors.value.reservationDate = '请选择预约日期'
    isValid = false
  }

  // 验证时间段
  if (!formData.value.timeSlot) {
    errors.value.timeSlot = '请选择预约时间段'
    isValid = false
  }

  // 验证姓名
  if (!formData.value.name.trim()) {
    errors.value.name = '请输入您的姓名'
    isValid = false
  }

  // 验证电话
  if (!formData.value.phone.trim()) {
    errors.value.phone = '请输入您的联系电话'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(formData.value.phone.trim())) {
    errors.value.phone = '请输入有效的手机号码'
    isValid = false
  }

  // 验证邮箱
  if (
    formData.value.email.trim() &&
    !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.value.email)
  ) {
    errors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  // 验证参与人数
  if (formData.value.participants < 1 || formData.value.participants > 50) {
    errors.value.participants = '参与人数必须在1-50人之间'
    isValid = false
  } else if (formData.value.reservationType === 'group' && formData.value.participants < 10) {
    errors.value.participants = '团体预约人数至少为10人'
    isValid = false
  }

  // 验证团体名称（仅团体预约）
  if (formData.value.reservationType === 'group' && !formData.value.groupName.trim()) {
    errors.value.groupName = '请输入团体名称'
    isValid = false
  }

  // 验证特殊需求字符数
  if (formData.value.specialRequirements.length > 200) {
    errors.value.specialRequirements = '特殊需求不能超过200个字符'
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

  // 验证同意条款
  if (!formData.value.agreeTerms) {
    errors.value.agreeTerms = '请阅读并同意预约须知和隐私政策'
    isValid = false
  }

  return isValid
}

// 提交预约表单
const submitReservation = () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true

  // 模拟API请求
  setTimeout(() => {
    submitting.value = false
    alert('预约提交成功！我们会在24小时内与您联系确认详情。')

    // 重置表单
    formData.value = {
      reservationType: 'individual',
      activityType: '',
      reservationDate: new Date(), // 重置为Date类型
      timeSlot: '',
      name: '',
      phone: '',
      email: '',
      participants: 1,
      groupName: '',
      specialRequirements: '',
      captcha: '',
      agreeTerms: false,
    }

    // 刷新验证码
    refreshCaptcha()
  }, 1500)
}

// 返回顶部
const backToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听滚动事件
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

// 组件挂载时初始化
onMounted(() => {
  // 生成初始验证码
  refreshCaptcha()

  // 监听滚动事件
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
  margin-bottom: 50px;
}

/* 预约内容区域样式 */
.reserve-content {
  background-color: white;
}

.reserve-wrapper {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.reserve-form-container {
  flex: 0 0 700px;
  background-color: #f9f9f9;
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

.reserve-form {
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

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 30px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.radio-label input[type='radio'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* 输入框和选择框样式 */
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
  min-height: 100px;
}

/* 日期选择器提示 */
.date-notice {
  display: flex;
  gap: 15px;
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.holiday {
  color: #d93b30;
  font-weight: 500;
}

/* 时间段选择 */
.time-slots {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.time-slot-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 100px;
}

.time-slot-btn:hover:not(.disabled) {
  border-color: #d93b30;
  background-color: #fff5f5;
}

.time-slot-btn.active {
  border-color: #d93b30;
  background-color: #d93b30;
  color: white;
}

.time-slot-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f0f0f0;
}

.time-slot-status {
  font-size: 12px;
  opacity: 0.8;
}

/* 人数选择器 */
.participants-selector {
  display: flex;
  align-items: center;
  width: 200px;
}

.count-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
}

.count-btn:hover:not(:disabled) {
  background-color: #f9f9f9;
  border-color: #d93b30;
  color: #d93b30;
}

.count-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.participants-input {
  flex: 1;
  height: 40px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-left: none;
  border-right: none;
  text-align: center;
  font-size: 16px;
}

.participants-input:focus {
  outline: none;
}

/* 验证码样式 */
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

/* 字符计数 */
.char-count {
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 12px;
  color: #999;
}

/* 同意条款 */
.agreement-group {
  margin-bottom: 30px;
}

.agreement-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.agreement-label input[type='checkbox'] {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.terms-link {
  color: #d93b30;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

/* 错误信息 */
.error-message {
  position: absolute;
  bottom: -20px;
  left: 0;
  font-size: 12px;
  color: #d93b30;
}

/* 提交按钮 */
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

/* 预约信息卡片 */
.reserve-info {
  flex: 1;
  min-width: 300px;
}

.info-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.info-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-content {
  color: #666;
  font-size: 15px;
  line-height: 1.6;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.info-item:last-child {
  margin-bottom: 0;
}

/* 预约须知列表 */
.notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-list li {
  margin-bottom: 10px;
  position: relative;
  padding-left: 20px;
}

.notice-list li:before {
  content: '•';
  position: absolute;
  left: 0;
  color: #d93b30;
  font-size: 18px;
}

/* 联系咨询卡片 */
.contact-card .info-content {
  text-align: center;
}

.contact-text {
  margin-bottom: 20px;
  font-size: 16px;
}

.contact-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  font-size: 16px;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.phone-btn:hover {
  border-color: #d93b30;
  color: #d93b30;
}

.email-btn:hover {
  border-color: #4285f4;
  color: #4285f4;
}

/* 热门活动推荐 */
.popular-activities {
  background-color: #f9f9f9;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.activity-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.activity-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.activity-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.activity-card:hover .activity-img {
  transform: scale(1.05);
}

.activity-tag {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 5px 15px;
  background-color: #d93b30;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.activity-content {
  padding: 25px;
}

.activity-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.activity-description {
  font-size: 15px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.activity-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.activity-price {
  font-size: 18px;
  font-weight: bold;
  color: #d93b30;
}

.activity-duration {
  font-size: 14px;
  color: #999;
}

.activity-btn {
  width: 100%;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.activity-btn:hover {
  background-color: #d93b30;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 59, 48, 0.3);
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.modal-close {
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

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 30px;
  max-height: 60vh;
  overflow-y: auto;
}

.terms-content {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
}

.terms-content h4 {
  font-size: 18px;
  margin-top: 25px;
  margin-bottom: 15px;
  color: #333;
}

.terms-content h4:first-child {
  margin-top: 0;
}

.terms-content p {
  margin-bottom: 15px;
}

.terms-content ol {
  padding-left: 20px;
  margin-bottom: 20px;
}

.terms-content ol li {
  margin-bottom: 10px;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #eee;
  text-align: center;
}

.modal-btn {
  padding: 10px 30px;
  background-color: #d93b30;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn:hover {
  background-color: #b92c23;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 59, 48, 0.3);
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

  .reserve-wrapper {
    flex-direction: column;
    gap: 30px;
  }

  .reserve-form-container {
    flex: 1;
  }

  .reserve-info {
    width: 100%;
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
    margin-bottom: 40px;
  }

  .reserve-form-container {
    padding: 30px;
  }

  .form-title {
    font-size: 24px;
  }

  .radio-group {
    flex-direction: column;
    gap: 15px;
  }

  .time-slots {
    gap: 8px;
  }

  .time-slot-btn {
    padding: 8px 16px;
    min-width: 80px;
    font-size: 13px;
  }

  .info-card {
    padding: 25px;
  }

  .activities-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
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

  .reserve-form-container {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    font-size: 14px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    font-size: 14px;
    padding: 10px 12px;
  }

  .captcha-wrapper {
    flex-direction: column;
    gap: 10px;
  }

  .captcha-image {
    width: 100%;
  }

  .participants-selector {
    width: 150px;
  }

  .submit-btn {
    font-size: 16px;
    padding: 12px 20px;
  }

  .info-card {
    padding: 20px;
  }

  .info-title {
    font-size: 18px;
  }

  .info-item {
    font-size: 14px;
  }

  .activity-card {
    margin-bottom: 20px;
  }

  .activity-image {
    height: 180px;
  }

  .activity-content {
    padding: 20px;
  }

  .activity-title {
    font-size: 18px;
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
