import { onMounted, ref } from 'vue'

// 웹 환경에서 필요한 기능들을 관리하는 훅
export default function useWebEnvironment() {
  // Electron 환경 감지 (window.isElectron이 true면 Electron 환경)
  const isWebEnv = ref(!(window as any).isElectron)
  
  // 웹에서 사용할 다크/라이트 모드 설정
  const isDarkMode = ref(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  onMounted(() => {
    // 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        isDarkMode.value = event.matches
      })
  })
  
  // 모바일 여부 감지
  const isMobile = ref(window.innerWidth < 768)
  
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }
  
  onMounted(() => {
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  })
  
  return {
    isWebEnv,
    isDarkMode,
    isMobile
  }
}
