<template>
  <div class="color-picker">
    <div class="color-swatch" :style="{ backgroundColor: modelValue }" @click="openPicker"></div>
    <input
      type="color"
      class="color-input"
      ref="colorInputRef"
      :value="modelValue"
      @input="updateColor"
      @change="closePicker"
    />
    <div class="color-value" @click="copyColorValue">{{ modelValue }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'ColorPicker',
  
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  
  emits: ['update:modelValue'],
  
  setup(props, { emit }) {
    const colorInputRef = ref<HTMLInputElement | null>(null);
    
    // 색상 선택기 열기
    const openPicker = () => {
      if (!props.disabled && colorInputRef.value) {
        colorInputRef.value.click();
      }
    };
    
    // 색상 업데이트
    const updateColor = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    };
    
    // 색상 선택기 닫기
    const closePicker = () => {
      // 색상 선택 완료 후 필요한 작업
    };
    
    // 색상 값 복사 (클립보드)
    const copyColorValue = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(props.modelValue)
          .then(() => {
            console.log('Color code copied to clipboard:', props.modelValue);
          })
          .catch(err => {
            console.error('Failed to copy color code:', err);
          });
      }
    };
    
    return {
      colorInputRef,
      openPicker,
      updateColor,
      closePicker,
      copyColorValue
    };
  },
});
</script>

<style scoped>
.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.color-swatch {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.color-swatch:hover {
  transform: scale(1.05);
}

.color-input {
  position: absolute;
  visibility: hidden;
  width: 0;
  height: 0;
}

.color-value {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  user-select: all;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-value:hover {
  color: #4f9cf9;
}

.color-value:active {
  transform: scale(0.95);
}
</style>
