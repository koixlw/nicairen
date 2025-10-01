<template>
  <div class="about">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">关于泥彩人</h1>
        <p class="page-subtitle">探索千年非遗文化的独特魅力</p>
      </div>
    </div>

    <!-- 历史渊源 -->
    <section class="history-section">
      <div class="container">
        <div class="section-content">
          <div class="section-text">
            <h2 class="section-title">历史渊源</h2>
            <p class="section-paragraph">
              泥彩人是中国传统民间艺术的瑰宝，起源于宋代，至今已有千年历史。据史料记载，泥彩人的制作技艺最早出现在
              北宋时期的民间工艺中，经过元、明、清三代的发展，逐渐形成了独特的艺术风格和完整的制作工艺流程。
            </p>
            <p class="section-paragraph">
              明清时期，泥彩人制作达到鼎盛，不仅在民间广泛流传，还成为宫廷贡品。当时的泥彩人题材广泛，包括神话传说、
              历史人物、戏曲角色和日常生活场景等，造型生动，色彩鲜艳，深受人们喜爱。
            </p>
            <p class="section-paragraph">
              近代以来，泥彩人经历了兴衰起伏。新中国成立后，政府高度重视非物质文化遗产保护，泥彩人制作技艺得到了
              有效的传承和发展。2006年，泥彩人被列入第一批国家级非物质文化遗产名录，成为中华民族宝贵的文化财富。
            </p>
          </div>
          <div class="section-image">
            <img :src="historyImg" alt="泥彩人历史" class="history-img">
          </div>
        </div>
      </div>
    </section>

    <!-- 文化价值 -->
    <section class="value-section">
      <div class="container">
        <h2 class="section-title">文化价值</h2>
        <div class="value-grid">
          <div class="value-card">
            <div class="value-icon">
              <i class="icon-culture"></i>
            </div>
            <h3 class="value-title">艺术审美价值</h3>
            <p class="value-desc">
              泥彩人融合了雕塑、绘画、装饰等多种艺术形式，造型简洁生动，色彩鲜艳明快，具有很高的艺术审美价值。
              它不仅是一种民间工艺品，更是中国传统美学的重要载体。
            </p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <i class="icon-history"></i>
            </div>
            <h3 class="value-title">历史研究价值</h3>
            <p class="value-desc">
              泥彩人作为民间艺术的活化石，记录了不同历史时期的社会生活、风俗习惯、审美观念等信息，为历史学、
              社会学、民俗学等学科研究提供了珍贵的实物资料。
            </p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <i class="icon-heritage"></i>
            </div>
            <h3 class="value-title">文化传承价值</h3>
            <p class="value-desc">
              泥彩人是中华民族优秀传统文化的重要组成部分，承载着民族精神和文化基因。保护和传承泥彩人技艺，
              对于弘扬中华优秀传统文化、增强文化自信具有重要意义。
            </p>
          </div>
          <div class="value-card">
            <div class="value-icon">
              <i class="icon-innovation"></i>
            </div>
            <h3 class="value-title">创新发展价值</h3>
            <p class="value-desc">
              泥彩人技艺在保持传统特色的同时，不断吸收现代艺术元素，开发出符合当代审美需求的新产品，
              为传统工艺的创新发展提供了成功范例。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 制作工艺 -->
    <section class="craft-section">
      <div class="container">
        <h2 class="section-title">制作工艺</h2>
        <div class="craft-content">
          <div class="craft-image">
            <img :src="craftImg" alt="泥彩人制作工艺" class="craft-img">
          </div>
          <div class="craft-steps">
            <div class="craft-step">
              <div class="step-number">01</div>
              <div class="step-content">
                <h3 class="step-title">取土炼泥</h3>
                <p class="step-desc">选择优质的黏土，经过晾晒、粉碎、过筛、和泥、醒泥等多道工序，制成细腻柔软的泥料。</p>
              </div>
            </div>
            <div class="craft-step">
              <div class="step-number">02</div>
              <div class="step-content">
                <h3 class="step-title">捏塑成型</h3>
                <p class="step-desc">艺人根据构思，用手或简单工具将泥料捏塑成各种形象，注重整体比例和细节刻画。</p>
              </div>
            </div>
            <div class="craft-step">
              <div class="step-number">03</div>
              <div class="step-content">
                <h3 class="step-title">晾晒打磨</h3>
                <p class="step-desc">将成型的泥坯放在阴凉通风处自然晾干，然后用砂纸打磨光滑，去除表面的瑕疵。</p>
              </div>
            </div>
            <div class="craft-step">
              <div class="step-number">04</div>
              <div class="step-content">
                <h3 class="step-title">彩绘装饰</h3>
                <p class="step-desc">用矿物颜料进行彩绘，色彩鲜艳明快，注重线条的流畅和色彩的搭配，体现传统审美。</p>
              </div>
            </div>
            <div class="craft-step">
              <div class="step-number">05</div>
              <div class="step-content">
                <h3 class="step-title">上光保护</h3>
                <p class="step-desc">最后在彩绘完成的作品上涂上一层清漆，起到保护和增亮的作用，使作品更加光彩夺目。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 传承保护 -->
    <section class="heritage-section">
      <div class="container">
        <h2 class="section-title">传承与保护</h2>
        <div class="heritage-content">
          <div class="heritage-text">
            <p class="section-paragraph">
              面对现代化进程的挑战，泥彩人技艺的传承和保护工作显得尤为重要。近年来，我们采取了一系列措施，
              致力于泥彩人文化的保护、传承和发展：
            </p>
            <ul class="heritage-list">
              <li class="heritage-item">
                <strong>建立传承人制度：</strong>认定各级非遗传承人，为他们提供必要的支持和保障，鼓励他们带徒授艺。
              </li>
              <li class="heritage-item">
                <strong>建设传承基地：</strong>建立泥彩人传承基地和展示中心，为技艺传承提供场所和平台。
              </li>
              <li class="heritage-item">
                <strong>开展教育活动：</strong>在学校和社区开展泥彩人知识普及和技艺培训活动，培养年轻一代的兴趣和热爱。
              </li>
              <li class="heritage-item">
                <strong>创新产品设计：</strong>结合现代生活需求，开发泥彩人文创产品，扩大泥彩人的影响力和市场。
              </li>
              <li class="heritage-item">
                <strong>加强宣传推广：</strong>通过各种媒体和平台，加强泥彩人文化的宣传和推广，提高社会认知度和关注度。
              </li>
            </ul>
          </div>
          <div class="heritage-image">
            <img :src="heritageImg" alt="泥彩人传承保护" class="heritage-img">
          </div>
        </div>
      </div>
    </section>

    <!-- 项目愿景 -->
    <section class="vision-section">
      <div class="container">
        <h2 class="section-title">项目愿景</h2>
        <div class="vision-content">
          <p class="vision-paragraph">
            我们的愿景是将泥彩人这一优秀的非物质文化遗产保护好、传承好、发展好，让更多的人了解和喜爱泥彩人文化，
            让这一古老的民间艺术在现代社会焕发新的生机与活力。
          </p>
          <p class="vision-paragraph">
            我们希望通过这个平台，搭建起泥彩人与大众之间的桥梁，让更多的人有机会接触、了解和体验泥彩人文化，
            共同参与到泥彩人的保护和传承中来。
          </p>
          <div class="vision-goals">
            <div class="goal-item">
              <div class="goal-icon">
                <i class="icon-protect"></i>
              </div>
              <h3 class="goal-title">保护传承</h3>
            </div>
            <div class="goal-item">
              <div class="goal-icon">
                <i class="icon-innovation"></i>
              </div>
              <h3 class="goal-title">创新发展</h3>
            </div>
            <div class="goal-item">
              <div class="goal-icon">
                <i class="icon-share"></i>
              </div>
              <h3 class="goal-title">传播推广</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
// 定义组件名称以符合多词规范
defineOptions({
  name: 'AboutPage'
});

// 导入图片资源
import historyImg from '@/assets/images/other/history.jpg';
import craftImg from '@/assets/images/other/craft.jpg';
import heritageImg from '@/assets/images/other/heritage.jpg';

// 页面内容已在template中完整实现
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
  padding: 100px 0;
}

.section-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 40px;
  position: relative;
  padding-bottom: 20px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 4px;
  background-color: #d93b30;
}

.section-paragraph {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 20px;
}

/* 历史渊源区块 */
.history-section {
  background-color: white;
}

.section-content {
  display: flex;
  gap: 50px;
  align-items: center;
}

.section-text {
  flex: 1;
}

.section-image {
  flex: 1;
}

.history-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 文化价值区块 */
.value-section {
  background-color: #f9f9f9;
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.value-card {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.value-icon {
  width: 60px;
  height: 60px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #d93b30;
}

.value-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.value-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

/* 制作工艺区块 */
.craft-section {
  background-color: white;
}

.craft-content {
  display: flex;
  gap: 50px;
  align-items: center;
}

.craft-image {
  flex: 1;
}

.craft-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.craft-steps {
  flex: 1;
}

.craft-step {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: flex-start;
}

.step-number {
  font-size: 24px;
  font-weight: bold;
  color: #d93b30;
  background-color: #f0f0f0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.step-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

/* 传承保护区块 */
.heritage-section {
  background-color: #f9f9f9;
}

.heritage-content {
  display: flex;
  gap: 50px;
  align-items: flex-start;
}

.heritage-text {
  flex: 1;
}

.heritage-list {
  list-style: none;
  padding: 0;
  margin-top: 30px;
}

.heritage-item {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 20px;
  padding-left: 20px;
  position: relative;
}

.heritage-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #d93b30;
  font-size: 20px;
}

.heritage-image {
  flex: 1;
}

.heritage-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 项目愿景区块 */
.vision-section {
  background-color: white;
  text-align: center;
}

.vision-content {
  max-width: 800px;
  margin: 0 auto;
}

.vision-paragraph {
  font-size: 18px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 30px;
}

.vision-goals {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-top: 50px;
}

.goal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.goal-icon {
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 32px;
  color: #d93b30;
}

.goal-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .page-title {
    font-size: 40px;
  }
  
  .section-content,
  .craft-content,
  .heritage-content {
    flex-direction: column;
    gap: 30px;
  }
  
  .vision-goals {
    gap: 40px;
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
    padding: 60px 0;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .vision-goals {
    flex-direction: column;
    gap: 30px;
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
  
  .value-grid {
    grid-template-columns: 1fr;
  }
}
</style>