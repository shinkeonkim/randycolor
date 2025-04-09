/**
 * 그라데이션 CSS 코드 생성 유틸리티
 */
import { GradientConfig, ColorInfo, ColorFormat } from '@/types';
import { hexToRgb, rgbToHsl, hslToString, hslToHslaString, hexToRgbaString } from './colorConversion';

// 색상 정보를 다른 포맷으로 변환
export function convertColorFormat(hexColor: string, format: ColorFormat): string {
  switch (format) {
    case 'hex':
      return hexColor;
    case 'rgb': {
      const rgb = hexToRgb(hexColor);
      if (!rgb) return '';
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    case 'rgba': {
      return hexToRgbaString(hexColor, 1);
    }
    case 'hsl': {
      const rgb = hexToRgb(hexColor);
      if (!rgb) return '';
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return hslToString(hsl.h, hsl.s, hsl.l);
    }
    case 'hsla': {
      const rgb = hexToRgb(hexColor);
      if (!rgb) return '';
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return hslToHslaString(hsl.h, hsl.s, hsl.l, 1);
    }
    default:
      return hexColor;
  }
}

// CSS 선형 그라데이션 코드 생성
export function generateLinearGradientCSS(config: GradientConfig, format: ColorFormat = 'hex'): string {
  const { direction, colors } = config;
  
  if (!colors || colors.length === 0) {
    return 'linear-gradient(to right, #000000 0%, #ffffff 100%)';
  }
  
  // 색상 위치에 따라 정렬
  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  
  // 각 색상과 위치를 CSS 형식으로 변환
  const colorStops = sortedColors.map(color => {
    const formattedColor = convertColorFormat(color.color, format);
    return `${formattedColor} ${color.position}%`;
  }).join(', ');
  
  return `linear-gradient(${direction}, ${colorStops})`;
}

// CSS 원형 그라데이션 코드 생성
export function generateRadialGradientCSS(config: GradientConfig, format: ColorFormat = 'hex'): string {
  const { colors } = config;
  
  if (!colors || colors.length === 0) {
    return 'radial-gradient(circle, #000000 0%, #ffffff 100%)';
  }
  
  // 색상 위치에 따라 정렬
  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  
  // 각 색상과 위치를 CSS 형식으로 변환
  const colorStops = sortedColors.map(color => {
    const formattedColor = convertColorFormat(color.color, format);
    return `${formattedColor} ${color.position}%`;
  }).join(', ');
  
  return `radial-gradient(circle, ${colorStops})`;
}

// CSS 원뿔형 그라데이션 코드 생성
export function generateConicGradientCSS(config: GradientConfig, format: ColorFormat = 'hex'): string {
  const { colors } = config;
  
  if (!colors || colors.length === 0) {
    return 'conic-gradient(from 0deg, #000000 0%, #ffffff 100%)';
  }
  
  // 색상 위치에 따라 정렬
  const sortedColors = [...colors].sort((a, b) => a.position - b.position);
  
  // 각 색상과 위치를 CSS 형식으로 변환
  const colorStops = sortedColors.map(color => {
    const formattedColor = convertColorFormat(color.color, format);
    return `${formattedColor} ${color.position}%`;
  }).join(', ');
  
  return `conic-gradient(from 0deg, ${colorStops})`;
}

// 그라데이션 CSS 코드 생성 (타입에 따라 분기)
export function generateGradientCSS(config: GradientConfig, format: ColorFormat = 'hex'): string {
  if (!config || !config.colors || config.colors.length === 0) {
    return 'linear-gradient(to right, #000000 0%, #ffffff 100%)';
  }
  
  try {
    switch (config.type) {
      case 'linear':
        return generateLinearGradientCSS(config, format);
      case 'radial':
        return generateRadialGradientCSS(config, format);
      case 'conic':
        return generateConicGradientCSS(config, format);
      default:
        return generateLinearGradientCSS(config, format);
    }
  } catch (error) {
    console.error('Error generating gradient CSS:', error);
    return 'linear-gradient(to right, #000000 0%, #ffffff 100%)';
  }
}

// 완전한 CSS 코드 생성 (선택자 포함)
export function generateFullCSSCode(config: GradientConfig, format: ColorFormat = 'hex'): string {
  try {
    const gradientCss = generateGradientCSS(config, format);
    return `.gradient {\n  background-image: ${gradientCss};\n}`;
  } catch (error) {
    console.error('Error generating full CSS code:', error);
    return `.gradient {\n  background-image: linear-gradient(to right, #000000 0%, #ffffff 100%);\n}`;
  }
}
