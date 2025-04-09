<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo-container">
        <img src="/logo.svg" alt="RandyColor Logo" class="app-logo" />
      </div>
      <div class="header-text">
        <h1>RandyColor</h1>
        <p>랜덤 그라데이션 CSS 생성기</p>
      </div>
    </header>
    
    <main class="app-content">
      <div class="gradient-preview-section">
        <GradientCanvas 
          :gradient-css="gradientCss" 
          :colors="colors"
          :gradient-type="gradientConfig.type"
          :gradient-direction="gradientConfig.direction"
          @update:color-position="updateColorPosition"
        />
        
        <!-- 실시간 미리보기 컴포넌트 -->
        <GradientPreview :gradient-css="gradientCss" 
        />
      </div>
      
      <div class="controls-section">
        <ColorList 
          :colors="colors"
          :color-count="colorCount"
          @update:color="updateColor"
          @update:position="updatePosition"
          @toggle:fixed="toggleFixedColor"
          @set:count="setColorCount"
          @generate:random="generateRandomColors"
        />
        
        <GradientControls 
          :gradient-type="gradientConfig.type"
          :gradient-direction="gradientConfig.direction"
          @update:type="updateGradientType"
          @update:direction="updateGradientDirection"
          @reset="resetGradient"
        />
        
        <CodeDisplay 
          :css-code="cssCode"
          :gradient-css="gradientCss"
          :color-format="colorFormat"
          @update:format="updateColorFormat"
        />
      </div>
    </main>
    
    <footer class="app-footer">
      <p>Made with Vue.js and Electron</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, nextTick } from 'vue';
import GradientCanvas from '@/components/GradientCanvas.vue';
import ColorList from '@/components/ColorList.vue';
import GradientControls from '@/components/GradientControls.vue';
import CodeDisplay from '@/components/CodeDisplay.vue';
import GradientPreview from '@/components/GradientPreview.vue';
import useColors from '@/composables/useColors';
import useGradient from '@/composables/useGradient';
import { ColorFormat, GradientType, GradientDirection } from '@/types';

export default defineComponent({
  name: 'App',
  
  components: {
    GradientCanvas,
    ColorList,
    GradientControls,
    CodeDisplay,
    GradientPreview,
  },
  
  setup() {
    // 색상 관리
    const {
      colors,
      colorCount,
      updateColor: modifyColor,
      updatePosition: modifyPosition,
      toggleFixedColor,
      setColorCount,
      generateRandomColors,
      initColors,
    } = useColors(3);
    
    // 그라데이션 관리
    const {
      gradientConfig,
      colorFormat,
      gradientCss,
      cssCode,
      setType,
      setDirection,
      setColors,
      setColorFormat,
    } = useGradient([]);
    
    // 초기 색상 생성 및 그라데이션 설정
    onMounted(async () => {
      initColors();
      await nextTick();
      setColors(colors.value);
    });
    
    // 색상 정보 업데이트 시 그라데이션 설정 업데이트
    watch(colors, (newColors) => {
      setColors(newColors);
    }, { deep: true });
    
    // 색상 형식 변경
    const updateColorFormat = (format: ColorFormat) => {
      setColorFormat(format);
    };
    
    // 색상 업데이트
    const updateColor = ({ id, color }: { id: string, color: string }) => {
      modifyColor(id, color);
    };
    
    // 색상 위치 업데이트
    const updatePosition = ({ id, position }: { id: string, position: number }) => {
      modifyPosition(id, position);
    };
    
    // 캔버스에서 색상 위치 업데이트
    const updateColorPosition = ({ id, position }: { id: string, position: number }) => {
      modifyPosition(id, position);
    };
    
    // 그라데이션 타입 업데이트
    const updateGradientType = (type: GradientType) => {
      setType(type);
    };
    
    // 그라데이션 방향 업데이트
    const updateGradientDirection = (direction: GradientDirection) => {
      setDirection(direction);
    };
    
    // 그라데이션 초기화
    const resetGradient = () => {
      initColors();
      setType('linear');
      setDirection('to right');
      
      // 상태 업데이트 후 그라데이션 설정 업데이트
      nextTick(() => {
        setColors(colors.value);
      });
    };
    
    return {
      colors,
      colorCount,
      gradientConfig,
      colorFormat,
      gradientCss,
      cssCode,
      updateColor,
      updatePosition,
      updateColorPosition,
      toggleFixedColor,
      setColorCount,
      generateRandomColors,
      updateGradientType,
      updateGradientDirection,
      updateColorFormat,
      resetGradient,
    };
  },
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Roboto+Mono&display=swap');

:root {
  --background-gradient: linear-gradient(135deg, #0f1424, #2c3e50);
  --text-primary: rgba(255, 255, 255, 0.9);
  --text-secondary: rgba(255, 255, 255, 0.6);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--background-gradient);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0 30px;
  gap: 15px;
  /* 앱 헤더를 윈도우 드래그 영역으로 만들기 */
  -webkit-app-region: drag;
  user-select: none;
}

.logo-container {
  display: flex;
  align-items: center;
}

.app-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.header-text {
  text-align: left;
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.app-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.app-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  flex-grow: 1;
}

.gradient-preview-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.app-footer {
  text-align: center;
  padding: 20px 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.debug-info {
  margin-top: 5px;
  font-size: 0.8rem;
  opacity: 0.7;
  word-break: break-all;
}

/* 상호작용 요소들은 드래그 영역에서 제외 */
button, input, select, .color-marker, .gradient-canvas, .color-list-item {
  -webkit-app-region: no-drag;
}

@media (max-width: 768px) {
  .app-content {
    grid-template-columns: 1fr;
  }
  
  .app-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-text {
    text-align: center;
  }
}
</style>
