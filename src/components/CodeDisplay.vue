<template>
  <div class="code-display">
    <div class="code-header">
      <h3>CSS 코드</h3>
      <div class="format-selector">
        <label v-for="format in colorFormats" :key="format.value">
          <input
            type="radio"
            name="format"
            :value="format.value"
            :checked="selectedFormat === format.value"
            @change="setFormat(format.value)"
          />
          {{ format.label }}
        </label>
      </div>
    </div>
    
    <div class="code-container">
      <pre><code>{{ formattedCode }}</code></pre>
      
      <button class="copy-button" @click="copyCode" :class="{ copied }">
        {{ copied ? '복사됨!' : '복사' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, PropType } from 'vue';
import { ColorFormat } from '@/types';
import useCopyToClipboard from '@/composables/useCopyToClipboard';

export default defineComponent({
  name: 'CodeDisplay',
  
  props: {
    cssCode: {
      type: String,
      default: '.gradient {\n  background: linear-gradient(to right, #000000 0%, #ffffff 100%);\n}'
    },
    gradientCss: {
      type: String,
      default: 'linear-gradient(to right, #000000 0%, #ffffff 100%)'
    },
    colorFormat: {
      type: String as PropType<ColorFormat>,
      default: 'hex'
    }
  },
  
  emits: ['update:format'],
  
  setup(props, { emit }) {
    const { copied, copyToClipboard } = useCopyToClipboard();
    
    // 로컬 상태로 선택된 포맷을 관리
    const selectedFormat = ref<ColorFormat>(props.colorFormat);
    
    // props의 colorFormat 변경 시 로컬 상태도 업데이트
    watch(() => props.colorFormat, (newFormat) => {
      selectedFormat.value = newFormat;
    });
    
    // 색상 포맷 목록
    const colorFormats = [
      { value: 'hex', label: 'HEX' },
      { value: 'rgb', label: 'RGB' },
      { value: 'rgba', label: 'RGBA' },
      { value: 'hsl', label: 'HSL' },
      { value: 'hsla', label: 'HSLA' },
    ];
    
    // 코드 포맷팅
    const formattedCode = computed(() => {
      return props.cssCode;
    });
    
    // 포맷 변경
    const setFormat = (format: ColorFormat) => {
      selectedFormat.value = format;
      emit('update:format', format);
    };
    
    // 코드 복사
    const copyCode = async () => {
      await copyToClipboard(props.gradientCss);
    };
    
    return {
      selectedFormat,
      colorFormats,
      formattedCode,
      copied,
      setFormat,
      copyCode,
    };
  },
});
</script>

<style scoped>
.code-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.format-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.format-selector label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
}

.code-container {
  position: relative;
  background: rgba(30, 30, 30, 0.7);
  border-radius: 8px;
  padding: 12px;
  overflow: hidden;
}

.code-container pre {
  margin: 0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.code-container code {
  font-family: 'Roboto Mono', monospace;
  font-size: 14px;
  color: #e0e0e0;
}

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.copy-button.copied {
  background: rgba(76, 175, 80, 0.7);
}
</style>
