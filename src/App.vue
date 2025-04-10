<template>
  <div class="app-container" :class="{ 'web-env': isWebEnv }">
    <header class="app-header" :class="{ 'is-mobile': isMobile }">
      <div class="logo-container">
        <img src="/logo.svg" alt="RandyColor Logo" class="app-logo" />
      </div>
      <div class="header-text">
        <h1>RandyColor</h1>
        <p>랜덤 그라데이션 CSS 생성기</p>
      </div>
      
      <!-- 웹 환경에서만 보이는 GitHub 링크 -->
      <a v-if="isWebEnv" href="https://github.com/shinkeonkim/randycolor" target="_blank" class="github-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </a>
    </header>
    
    <main class="app-content" :class="{ 'is-mobile': isMobile }">
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
      <p>Made with Vue.js {{ isWebEnv ? 'for Web' : 'and Electron' }}</p>
      <p v-if="isWebEnv" class="web-note">
        이 웹 버전은 <a href="https://github.com/shinkeonkim/randycolor" target="_blank">GitHub</a>에서 데스크탑 버전도 다운로드 가능합니다.
      </p>
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
import useWebEnvironment from '@/composables/useWebEnvironment';
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
    // 웹 환경 감지
    const { isWebEnv, isDarkMode, isMobile } = useWebEnvironment();
    
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
      isWebEnv,
      isDarkMode,
      isMobile
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
  position: relative;
}

.app-header.is-mobile {
  flex-direction: column;
}

.github-link {
  position: absolute;
  right: 10px;
  top: 20px;
  color: var(--text-secondary);
  transition: color 0.3s;
  -webkit-app-region: no-drag;
}

.github-link:hover {
  color: var(--text-primary);
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

.app-content.is-mobile {
  grid-template-columns: 1fr;
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

.web-note {
  margin-top: 5px;
  font-size: 0.8rem;
}

.web-note a {
  color: #ff7e5f;
  text-decoration: none;
}

.web-note a:hover {
  text-decoration: underline;
}

.debug-info {
  margin-top: 5px;
  font-size: 0.8rem;
  opacity: 0.7;
  word-break: break-all;
}

/* 웹 환경일 때 앱 드래그 영역 비활성화 */
.web-env .app-header {
  -webkit-app-region: none;
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
