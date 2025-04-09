/**
 * 다양한 색상 형식 변환을 위한 유틸리티 함수
 */

// HEX 색상을 RGB로 변환
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // HEX 포맷 검증 (# 포함 또는 미포함)
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const result = hexRegex.exec(hex);
  
  if (!result) return null;
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

// RGB 색상을 HEX로 변환
export function rgbToHex(r: number, g: number, b: number): string {
  // 각 색상값이 0~255 범위 내에 있는지 확인
  const validR = Math.min(255, Math.max(0, Math.round(r)));
  const validG = Math.min(255, Math.max(0, Math.round(g)));
  const validB = Math.min(255, Math.max(0, Math.round(b)));
  
  // 16진수로 변환하고 2자리로 맞춤
  return `#${validR.toString(16).padStart(2, '0')}${validG.toString(16).padStart(2, '0')}${validB.toString(16).padStart(2, '0')}`;
}

// RGB 값을 rgba 문자열로 변환
export function rgbToRgbaString(r: number, g: number, b: number, a: number = 1): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// HEX 색상을 RGBA 문자열로 변환
export function hexToRgbaString(hex: string, alpha: number = 1): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'rgba(0, 0, 0, 1)';
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

// RGB 색상을 HSL로 변환
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  // RGB 값을 0~1 범위로 정규화
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;
  
  const max = Math.max(normalizedR, normalizedG, normalizedB);
  const min = Math.min(normalizedR, normalizedG, normalizedB);
  
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case normalizedR:
        h = (normalizedG - normalizedB) / d + (normalizedG < normalizedB ? 6 : 0);
        break;
      case normalizedG:
        h = (normalizedB - normalizedR) / d + 2;
        break;
      case normalizedB:
        h = (normalizedR - normalizedG) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  // 값 변환 후 반환
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// HSL 색상을 RGB로 변환
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  // HSL 값을 0~1 범위로 정규화
  const normalizedH = h / 360;
  const normalizedS = s / 100;
  const normalizedL = l / 100;
  
  let r, g, b;
  
  if (normalizedS === 0) {
    r = g = b = normalizedL; // 회색조
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = normalizedL < 0.5 
      ? normalizedL * (1 + normalizedS) 
      : normalizedL + normalizedS - normalizedL * normalizedS;
    const p = 2 * normalizedL - q;
    
    r = hue2rgb(p, q, normalizedH + 1/3);
    g = hue2rgb(p, q, normalizedH);
    b = hue2rgb(p, q, normalizedH - 1/3);
  }
  
  // 0~255 범위로 변환 후 반환
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// HSL 값을 hsl 문자열로 변환
export function hslToString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// HSL 값을 hsla 문자열로 변환
export function hslToHslaString(h: number, s: number, l: number, a: number = 1): string {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

// 랜덤 HEX 색상 생성
export function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  return rgbToHex(r, g, b);
}
