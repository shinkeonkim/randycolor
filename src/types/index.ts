// 색상 정보를 담는 인터페이스
export interface ColorInfo {
  id: string;
  color: string; // hex 형식 (#RRGGBB)
  position: number; // 0 ~ 100 사이의 위치 (%)
  fixed: boolean; // 색상 고정 여부
}

// 그라데이션 타입
export type GradientType = 'linear' | 'radial' | 'conic';

// 그라데이션 방향
export type GradientDirection = 'to right' | 'to bottom' | 'to left' | 'to top' | 'to top right' | 'to top left' | 'to bottom right' | 'to bottom left';

// 그라데이션 설정
export interface GradientConfig {
  type: GradientType;
  direction: GradientDirection;
  colors: ColorInfo[];
}

// 색상 형식 타입
export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
