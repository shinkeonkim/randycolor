<template>
  <div class="gradient-preview-container">
    <h3 class="preview-title">미리보기</h3>
    
    <div class="preview-grid">
      <!-- 정사각형 미리보기 -->
      <div class="preview-item">
        <div 
          class="preview-shape square"
          :style="{background: gradientCss}"
        ></div>
        <span class="preview-label">사각형</span>
      </div>
      
      <!-- 원형 미리보기 -->
      <div class="preview-item">
        <div 
          class="preview-shape circle"
          :style="{background: gradientCss}"
        ></div>
        <span class="preview-label">원형</span>
      </div>
      
      <!-- 버튼 미리보기 -->
      <div class="preview-item">
        <button 
          class="preview-button"
          :style="{background: gradientCss}"
        >
          Button
        </button>
        <span class="preview-label">버튼</span>
      </div>
      
      <!-- 텍스트 미리보기 -->
      <div class="preview-item">
        <h2 
          class="preview-text"
          :style="{
            background: gradientCss,
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            'background-clip': 'text',
            'color': 'transparent'
          }"
        >
          Randy
        </h2>
        <span class="preview-label">텍스트</span>
      </div>
    </div>
    
    <!-- 카드 디자인 미리보기 -->
    <div class="card-preview">
      <div class="preview-card" :style="{background: 'white'}">
        <div class="card-header" :style="{background: gradientCss}">
        </div>
        <div class="card-content">
          <h3>Card Title</h3>
          <p>This is a preview of how your gradient might look as a card header.</p>
        </div>
      </div>
      <span class="preview-label">카드 디자인</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, onMounted, toRefs, computed } from 'vue';

export default defineComponent({
  name: 'GradientPreview',
  
  props: {
    gradientCss: {
      type: String,
      default: 'linear-gradient(to right, #000000 0%, #ffffff 100%)'
    },
  },

  setup(props) {
    const gradientCss = computed(() => {
      return props.gradientCss;
    });

    return {
      gradientCss,
    };
  }
});
</script>

<style scoped>
.gradient-preview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* background: rgba(255, 255, 255, 0.1); */
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.preview-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: none;
}

.preview-shape {
  width: 100%;
  height: 80px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.preview-shape:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.preview-shape.square {
  border-radius: 8px;
}

.preview-shape.circle {
  border-radius: 50%;
}

.preview-button {
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  text-align: center;
}

.preview-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.preview-text {
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  padding: 10px;
  text-align: center;
  transition: transform 0.2s ease;
}

.preview-text:hover {
  transform: scale(1.1);
}

.preview-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.card-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.preview-card {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.preview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-header {
  height: 80px;
}

.card-content {
  padding: 15px;
  color: #333;
}

.card-content h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.card-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.debug-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(255, 255, 255, 0.3);
  word-break: break-all;
}
</style>
