<template>
  <div class="gradient-controls">
    <div class="control-section">
      <h3>그라데이션 유형</h3>
      <div class="button-group">
        <button
          v-for="type in gradientTypes"
          :key="type.value"
          :class="{ active: gradientType === type.value }"
          @click="setType(type.value)"
        >
          {{ type.label }}
        </button>
      </div>
    </div>
    
    <div class="control-section" v-if="gradientType === 'linear'">
      <h3>그라데이션 방향</h3>
      <div class="direction-picker">
        <div class="direction-grid">
          <button class="top-left" :class="{ active: gradientDirection === 'to top left' }" @click="setDirection('to top left')">
            <span class="direction-arrow">↖</span>
          </button>
          <button class="top" :class="{ active: gradientDirection === 'to top' }" @click="setDirection('to top')">
            <span class="direction-arrow">↑</span>
          </button>
          <button class="top-right" :class="{ active: gradientDirection === 'to top right' }" @click="setDirection('to top right')">
            <span class="direction-arrow">↗</span>
          </button>
          <button class="left" :class="{ active: gradientDirection === 'to left' }" @click="setDirection('to left')">
            <span class="direction-arrow">←</span>
          </button>
          <div class="center"></div>
          <button class="right" :class="{ active: gradientDirection === 'to right' }" @click="setDirection('to right')">
            <span class="direction-arrow">→</span>
          </button>
          <button class="bottom-left" :class="{ active: gradientDirection === 'to bottom left' }" @click="setDirection('to bottom left')">
            <span class="direction-arrow">↙</span>
          </button>
          <button class="bottom" :class="{ active: gradientDirection === 'to bottom' }" @click="setDirection('to bottom')">
            <span class="direction-arrow">↓</span>
          </button>
          <button class="bottom-right" :class="{ active: gradientDirection === 'to bottom right' }" @click="setDirection('to bottom right')">
            <span class="direction-arrow">↘</span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="control-section">
      <h3>기타 옵션</h3>
      <div class="options-container">
        <button class="option-button" @click="resetGradient">
          초기화
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { GradientType, GradientDirection } from '@/types';

export default defineComponent({
  name: 'GradientControls',
  
  props: {
    gradientType: {
      type: String as () => GradientType,
      required: true,
    },
    gradientDirection: {
      type: String as () => GradientDirection,
      required: true,
    },
  },
  
  emits: ['update:type', 'update:direction', 'reset'],
  
  setup(props, { emit }) {
    // 그라데이션 타입 목록
    const gradientTypes = [
      { value: 'linear', label: '선형' },
      { value: 'radial', label: '방사형' },
      { value: 'conic', label: '원뿔형' },
    ];
    
    // 그라데이션 타입 설정
    const setType = (type: GradientType) => {
      emit('update:type', type);
    };
    
    // 그라데이션 방향 설정
    const setDirection = (direction: GradientDirection) => {
      emit('update:direction', direction);
    };
    
    // 그라데이션 초기화
    const resetGradient = () => {
      emit('reset');
    };
    
    return {
      gradientTypes,
      setType,
      setDirection,
      resetGradient,
    };
  },
});
</script>

<style scoped>
.gradient-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-section h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.button-group button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-group button.active {
  background: rgba(255, 255, 255, 0.8);
  color: #333;
  font-weight: bold;
}

.direction-picker {
  width: 100%;
}

.direction-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    "top-left top top-right"
    "left center right"
    "bottom-left bottom bottom-right";
  gap: 8px;
}

.direction-grid button {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.direction-grid button.active {
  background: rgba(255, 255, 255, 0.8);
  color: #333;
}

.direction-grid .top-left { grid-area: top-left; }
.direction-grid .top { grid-area: top; }
.direction-grid .top-right { grid-area: top-right; }
.direction-grid .left { grid-area: left; }
.direction-grid .center { 
  grid-area: center; 
  visibility: hidden;
}
.direction-grid .right { grid-area: right; }
.direction-grid .bottom-left { grid-area: bottom-left; }
.direction-grid .bottom { grid-area: bottom; }
.direction-grid .bottom-right { grid-area: bottom-right; }

.direction-arrow {
  font-size: 18px;
  font-weight: bold;
  display: inline-block;
}

.options-container {
  display: flex;
  gap: 8px;
}

.option-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-button:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>