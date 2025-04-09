/**
 * 그라데이션 설정을 관리하는 Composable
 */
import { ref, computed, watch, reactive } from 'vue';
import { GradientConfig, GradientType, GradientDirection, ColorInfo, ColorFormat } from '@/types';
import { generateGradientCSS, generateFullCSSCode } from '@/utils/gradientGenerator';

export default function useGradient(initialColors: ColorInfo[] = []) {
  // 그라데이션 설정
  const gradientConfig = reactive<GradientConfig>({
    type: 'linear',
    direction: 'to right',
    colors: [...initialColors]
  });
  
  // 색상 포맷
  const colorFormat = ref<ColorFormat>('hex');
  
  // 그라데이션 타입 설정
  const setType = (type: GradientType) => {
    gradientConfig.type = type;
  };
  
  // 그라데이션 방향 설정
  const setDirection = (direction: GradientDirection) => {
    gradientConfig.direction = direction;
  };
  
  // 색상 목록 설정
  const setColors = (colors: ColorInfo[]) => {
    // 깊은 복사를 통해 참조 문제 해결
    gradientConfig.colors = JSON.parse(JSON.stringify(colors));
  };
  
  // 색상 포맷 설정
  const setColorFormat = (format: ColorFormat) => {
    colorFormat.value = format;
  };
  
  // 그라데이션 CSS 문자열 생성 (현재 선택된 포맷 적용)
  const gradientCss = computed(() => {
    // 유효한 색상이 있는지 확인
    if (!gradientConfig.colors || gradientConfig.colors.length === 0) {
      return 'linear-gradient(to right, #000000 0%, #ffffff 100%)';
    }
    
    try {
      const result = generateGradientCSS(gradientConfig, colorFormat.value);
      return result;
    } catch (error) {
      console.error('Error generating gradient CSS:', error);
      return 'linear-gradient(to right, #ff0000 0%, #0000ff 100%)';
    }
  });
  
  // CSS 코드 프리뷰 (현재 선택된 포맷 적용)
  const cssCode = computed(() => {
    // 유효한 색상이 있는지 확인
    if (!gradientConfig.colors || gradientConfig.colors.length === 0) {
      return '.gradient {\n  background-image: linear-gradient(to right, #000000 0%, #ffffff 100%);\n}';
    }
    
    try {
      const code = generateFullCSSCode(gradientConfig, colorFormat.value);
      return code;
    } catch (error) {
      console.error('Error generating full CSS code:', error);
      return '.gradient {\n  background-image: linear-gradient(to right, #ff0000 0%, #0000ff 100%);\n}';
    }
  });
  
  return {
    gradientConfig,
    colorFormat,
    gradientCss,
    cssCode,
    setType,
    setDirection,
    setColors,
    setColorFormat
  };
}
