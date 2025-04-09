/**
 * 클립보드 복사 기능을 위한 Composable
 */
import { ref } from 'vue';

interface ElectronAPI {
  copyToClipboard?: (text: string) => boolean;
}

// 전역 Window에 electronAPI 타입 추가
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export default function useCopyToClipboard() {
  const copied = ref(false);
  const copyError = ref<Error | null>(null);

  const resetState = () => {
    copied.value = false;
    copyError.value = null;
  };

  const copyToClipboard = async (text: string) => {
    resetState();
    
    try {
      // 기본 클립보드 API 사용 가능 여부 확인
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // 대체 방법: 텍스트 영역 요소를 생성하여 복사
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // 화면 밖으로 위치 이동
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        // 문서의 execCommand 메소드 사용
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('클립보드 복사에 실패했습니다.');
        }
      }
      
      copied.value = true;
    } catch (err) {
      copyError.value = err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.');
      console.error('클립보드 복사 실패:', err);
    }
    
    // 3초 후 상태 초기화
    setTimeout(() => {
      resetState();
    }, 3000);
  };

  return {
    copied,
    copyError,
    copyToClipboard
  };
}






// useCopyToClipboard.ts 수정

// export function useCopyToClipboard() {
// }