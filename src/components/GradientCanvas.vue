<template>
  <div class="gradient-canvas-container">
    <div 
      class="gradient-canvas" 
      :style="{backgroundImage: gradientCss}"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <!-- 색상 위치 마커 -->
      <div 
        v-for="color in sortedColors" 
        :key="color.id"
        class="color-marker"
        :class="{ 'fixed': color.fixed, 'active': activeMarkerId === color.id }"
        :style="markerStyle(color)"
        @mousedown.stop="selectMarker($event, color.id)"
        @touchstart.stop="selectMarker($event, color.id)"
      >
        <div 
          class="marker-handle"
          :style="{ backgroundColor: color.color }"
        ></div>
      </div>
    </div>
    
    <!-- 그라데이션 유형 및 방향 표시 -->
    <div class="gradient-info">
      <div class="gradient-type">
        {{ typeLabel }}: {{ colorCount }}색상
      </div>
      <div v-if="gradientType === 'linear'" class="gradient-direction">
        {{ directionLabel }}
      </div>
    </div>
    
    <!-- 색상 코드 표시 -->
    <div class="color-info-container">
      <div 
        v-for="color in sortedColors" 
        :key="`info-${color.id}`"
        class="color-info"
        :class="{ 'fixed': color.fixed }"
      >
        <div 
          class="color-swatch" 
          :style="{ backgroundColor: color.color }"
        ></div>
        <div class="color-code">{{ color.color }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { ColorInfo } from '@/types';

export default defineComponent({
  name: 'GradientCanvas',
  
  props: {
    gradientCss: {
      type: String,
      default: 'linear-gradient(to right, #000000 0%, #ffffff 100%)'
    },
    colors: {
      type: Array as () => ColorInfo[],
      required: true,
    },
    gradientType: {
      type: String,
      default: 'linear',
    },
    gradientDirection: {
      type: String,
      default: 'to right',
    },
  },
  
  emits: ['update:color-position'],
  
  setup(props, { emit }) {
    const canvasRef = ref<HTMLElement | null>(null);
    const activeMarkerId = ref<string | null>(null);
    const isDragging = ref(false);
    
    // 색상 개수
    const colorCount = computed(() => props.colors.length);
    
    // 그라데이션 타입 레이블
    const typeLabel = computed(() => {
      switch(props.gradientType) {
        case 'linear': return '선형 그라데이션';
        case 'radial': return '방사형 그라데이션';
        case 'conic': return '원뿔형 그라데이션';
        default: return '그라데이션';
      }
    });
    
    // 방향 레이블
    const directionLabel = computed(() => {
      const directionMap: Record<string, string> = {
        'to right': '→ 오른쪽',
        'to left': '← 왼쪽',
        'to top': '↑ 위쪽',
        'to bottom': '↓ 아래쪽',
        'to top right': '↗ 오른쪽 위',
        'to top left': '↖ 왼쪽 위',
        'to bottom right': '↘ 오른쪽 아래',
        'to bottom left': '↙ 왼쪽 아래',
      };
      
      return directionMap[props.gradientDirection] || props.gradientDirection;
    });
    
    // 색상 위치 기준으로 정렬된 배열
    const sortedColors = computed(() => {
      return [...props.colors].sort((a, b) => a.position - b.position);
    });
    
    // 마커 스타일 계산
    const markerStyle = (color: ColorInfo) => {
      return {
        left: `${color.position}%`,
      };
    };
    
    // 마커 선택
    const selectMarker = (event: MouseEvent | TouchEvent, id: string) => {
      event.preventDefault();
      activeMarkerId.value = id;
      isDragging.value = true;
      
      // 마우스/터치 이벤트 리스너 등록
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('touchmove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchend', stopDrag);
    };
    
    // 캔버스에서 직접 드래그 시작
    const startDrag = (event: MouseEvent | TouchEvent) => {
      if (!(event.target as HTMLElement).classList.contains('gradient-canvas')) {
        return;
      }
      
      const canvas = event.currentTarget as HTMLElement;
      const rect = canvas.getBoundingClientRect();
      
      // 클릭/터치 위치 계산
      let clientX: number;
      
      if ('touches' in event) {
        clientX = event.touches[0].clientX;
      } else {
        clientX = event.clientX;
      }
      
      const offsetX = clientX - rect.left;
      const positionPercent = (offsetX / rect.width) * 100;
      
      // 가장 가까운 마커 찾기
      let closestMarker: ColorInfo | null = null;
      let minDistance = Infinity;
      
      for (const color of props.colors) {
        const distance = Math.abs(color.position - positionPercent);
        if (distance < minDistance) {
          minDistance = distance;
          closestMarker = color;
        }
      }
      
      // 마커 선택 및 이동
      if (closestMarker) {
        activeMarkerId.value = closestMarker.id;
        isDragging.value = true;
        
        // 위치 업데이트
        updateMarkerPosition(positionPercent);
        
        // 마우스/터치 이벤트 리스너 등록
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('touchmove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
      }
    };
    
    // 드래그 중 처리
    const handleDrag = (event: MouseEvent | TouchEvent) => {
      if (!isDragging.value || !activeMarkerId.value) return;
      
      const canvas = event.currentTarget as Document;
      const canvasEl = document.querySelector('.gradient-canvas') as HTMLElement;
      
      if (!canvasEl) return;
      
      const rect = canvasEl.getBoundingClientRect();
      
      // 마우스/터치 위치 계산
      let clientX: number;
      
      if ('touches' in event) {
        clientX = event.touches[0].clientX;
      } else {
        clientX = event.clientX;
      }
      
      const offsetX = clientX - rect.left;
      const positionPercent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
      
      // 위치 업데이트
      updateMarkerPosition(positionPercent);
    };
    
    // 마커 위치 업데이트
    const updateMarkerPosition = (positionPercent: number) => {
      if (!activeMarkerId.value) return;
      
      // 이벤트 발생
      emit('update:color-position', {
        id: activeMarkerId.value,
        position: positionPercent
      });
    };
    
    // 드래그 종료
    const stopDrag = () => {
      isDragging.value = false;
      activeMarkerId.value = null;
      
      // 이벤트 리스너 제거
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    };
    
    // 컴포넌트 마운트 시 참조 설정
    onMounted(() => {
      canvasRef.value = document.querySelector('.gradient-canvas');
    });
    
    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchend', stopDrag);
    });
    
    return {
      canvasRef,
      sortedColors,
      colorCount,
      activeMarkerId,
      typeLabel,
      directionLabel,
      markerStyle,
      selectMarker,
      startDrag,
    };
  },
});
</script>

<style scoped>
.gradient-canvas-container {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
}

.gradient-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  user-select: none;
}

.color-marker {
  position: absolute;
  bottom: 15px;
  transform: translateX(-50%);
  width: 20px;
  height: 36px;
  cursor: move;
  z-index: 10;
}

.marker-handle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.color-marker::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 16px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.color-marker.fixed .marker-handle {
  border: 2px solid #ff5722;
}

.color-marker.active .marker-handle {
  transform: scale(1.2);
  border: 2px solid #2196f3;
}

.gradient-info {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.color-info-container {
  position: absolute;
  bottom: 60px;
  left: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-info {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.color-info.fixed {
  border-left: 2px solid #ff5722;
}

.color-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.color-code {
  font-family: 'Roboto Mono', monospace;
}
</style>
