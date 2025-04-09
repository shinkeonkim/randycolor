/**
 * 색상 관리를 위한 Composable
 */
import { ref, computed, reactive } from 'vue';
import { ColorInfo } from '@/types';
import { generateRandomColor } from '@/utils/colorConversion';

// 간단한 UUID 생성 함수
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export default function useColors(initialCount: number = 3) {
  // 색상 목록
  const colors = ref<ColorInfo[]>([]);
  
  // 색상 개수 (2~5 사이)
  const colorCount = ref(Math.max(2, Math.min(5, initialCount)));
  
  // 색상 초기화
  const initColors = () => {
    colors.value = [];
    
    // 지정된 개수만큼 색상 생성
    for (let i = 0; i < colorCount.value; i++) {
      const position = i * (100 / (colorCount.value - 1));
      
      colors.value.push({
        id: generateId(),
        color: generateRandomColor(),
        position: position,
        fixed: false
      });
    }
  };
  
  // 색상 개수 변경
  const setColorCount = (count: number) => {
    const newCount = Math.max(2, Math.min(5, count));
    colorCount.value = newCount;
    
    if (colors.value.length < newCount) {
      // 색상 추가
      while (colors.value.length < newCount) {
        const position = colors.value.length * (100 / (newCount - 1));
        
        colors.value.push({
          id: generateId(),
          color: generateRandomColor(),
          position: position,
          fixed: false
        });
      }
    } else if (colors.value.length > newCount) {
      // 색상 제거 (고정되지 않은 색상 우선)
      const unfixedColors = colors.value.filter(c => !c.fixed);
      const fixedColors = colors.value.filter(c => c.fixed);
      
      if (unfixedColors.length >= colors.value.length - newCount) {
        // 고정되지 않은 색상 중에서 삭제
        while (colors.value.length > newCount) {
          const indexToRemove = colors.value.findIndex(c => !c.fixed);
          if (indexToRemove > -1) {
            colors.value.splice(indexToRemove, 1);
          } else {
            break;
          }
        }
      } else {
        // 고정된 색상도 삭제해야 하는 경우
        colors.value = [...fixedColors, ...unfixedColors].slice(0, newCount);
      }
    }
    
    // 위치 재조정
    redistributePositions();
  };
  
  // 색상 위치 재조정
  const redistributePositions = () => {
    const count = colors.value.length;
    
    // 정렬 후 위치 균등 분배
    const sortedColors = [...colors.value].sort((a, b) => a.position - b.position);
    
    sortedColors.forEach((color, index) => {
      color.position = index * (100 / (count - 1));
    });
    
    // 참조를 새로 할당하여 반응성 유지
    colors.value = [...sortedColors];
  };
  
  // 색상 변경
  const updateColor = (id: string, newColor: string) => {
    const index = colors.value.findIndex(c => c.id === id);
    if (index !== -1) {
      // 새 객체를 생성하여 반응성 유지
      const updatedColors = [...colors.value];
      updatedColors[index] = {
        ...updatedColors[index],
        color: newColor
      };
      colors.value = updatedColors;
    }
  };
  
  // 색상 위치 변경
  const updatePosition = (id: string, newPosition: number) => {
    const index = colors.value.findIndex(c => c.id === id);
    if (index !== -1) {
      // 0-100 범위로 제한
      const clampedPosition = Math.max(0, Math.min(100, newPosition));
      
      // 새 객체를 생성하여 반응성 유지
      const updatedColors = [...colors.value];
      updatedColors[index] = {
        ...updatedColors[index],
        position: clampedPosition
      };
      colors.value = updatedColors;
    }
  };
  
  // 색상 고정 토글
  const toggleFixedColor = (id: string) => {
    const index = colors.value.findIndex(c => c.id === id);
    if (index !== -1) {
      // 새 객체를 생성하여 반응성 유지
      const updatedColors = [...colors.value];
      updatedColors[index] = {
        ...updatedColors[index],
        fixed: !updatedColors[index].fixed
      };
      colors.value = updatedColors;
    }
  };
  
  // 랜덤 색상 생성 (고정되지 않은 색상만)
  const generateRandomColors = () => {
    const updatedColors = colors.value.map(color => {
      if (!color.fixed) {
        return {
          ...color,
          color: generateRandomColor()
        };
      }
      return color;
    });
    
    colors.value = updatedColors;
  };
  
  // 정렬된 색상 목록 (위치 기준)
  const sortedColors = computed(() => {
    return [...colors.value].sort((a, b) => a.position - b.position);
  });
  
  // 초기 색상 생성
  initColors();
  
  return {
    colors,
    colorCount,
    sortedColors,
    setColorCount,
    updateColor,
    updatePosition,
    toggleFixedColor,
    generateRandomColors,
    redistributePositions,
    initColors
  };
}
