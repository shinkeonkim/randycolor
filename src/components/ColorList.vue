<template>
  <div class="color-list">
    <div class="color-count-control">
      <label>색상 개수:</label>
      <div class="color-count-buttons">
        <button 
          v-for="count in [2, 3, 4, 5]" 
          :key="count"
          :class="{ active: colorCount === count }"
          @click="setColorCount(count)"
        >
          {{ count }}
        </button>
      </div>
    </div>
    
    <div class="colors-container">
      <div 
        v-for="color in sortedColors" 
        :key="color.id"
        class="color-item"
        :class="{ fixed: color.fixed }"
      >
        <ColorPicker 
          :model-value="color.color"
          @update:model-value="updateColor(color.id, $event)"
        />
        
        <div class="color-controls">
          <label class="position-label">
            위치:
            <input
              type="number"
              min="0"
              max="100"
              :value="Math.round(color.position)"
              @input="updatePosition(color.id, parseFloat(($event.target as HTMLInputElement).value))"
            />
            %
          </label>
          
          <label class="fix-toggle">
            <input
              type="checkbox"
              :checked="color.fixed"
              @change="toggleFixedColor(color.id)"
            />
            고정
          </label>
        </div>
      </div>
    </div>
    
    <button class="random-button" @click="generateRandomColors">
      랜덤 색상 생성
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ColorPicker from './ColorPicker.vue';
import { ColorInfo } from '@/types';

export default defineComponent({
  name: 'ColorList',
  
  components: {
    ColorPicker,
  },
  
  props: {
    colors: {
      type: Array as () => ColorInfo[],
      required: true,
    },
    colorCount: {
      type: Number,
      required: true,
    },
  },
  
  emits: [
    'update:color', 
    'update:position', 
    'toggle:fixed',
    'set:count',
    'generate:random'
  ],
  
  setup(props, { emit }) {
    // 위치 기준으로 정렬된 색상 목록
    const sortedColors = computed(() => {
      return [...props.colors].sort((a, b) => a.position - b.position);
    });
    
    // 색상 업데이트
    const updateColor = (id: string, color: string) => {
      emit('update:color', { id, color });
    };
    
    // 위치 업데이트
    const updatePosition = (id: string, position: number) => {
      emit('update:position', { id, position });
    };
    
    // 고정 토글
    const toggleFixedColor = (id: string) => {
      emit('toggle:fixed', id);
    };
    
    // 색상 개수 설정
    const setColorCount = (count: number) => {
      emit('set:count', count);
    };
    
    // 랜덤 색상 생성
    const generateRandomColors = () => {
      emit('generate:random');
    };
    
    return {
      sortedColors,
      updateColor,
      updatePosition,
      toggleFixedColor,
      setColorCount,
      generateRandomColors,
    };
  },
});
</script>

<style scoped>
.color-list {
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

.color-count-control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.color-count-buttons {
  display: flex;
  gap: 8px;
}

.color-count-buttons button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-count-buttons button.active {
  background: rgba(255, 255, 255, 0.8);
  color: #333;
}

.colors-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.color-item.fixed {
  background: rgba(255, 136, 0, 0.1);
  border-left: 3px solid #ff8800;
}

.color-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.position-label input {
  width: 50px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
}

.fix-toggle {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.random-button {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.random-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.random-button:active {
  transform: translateY(0);
}
</style>
