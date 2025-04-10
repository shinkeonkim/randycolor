import { contextBridge, clipboard } from 'electron'

// 렌더러 프로세스에 노출할 API 정의
contextBridge.exposeInMainWorld('electronAPI', {
  // 클립보드 복사 기능
  copyToClipboard: (text: string) => {
    clipboard.writeText(text)
    return true
  },
  
  // 앱 버전 정보
  getAppVersion: () => process.env.npm_package_version,
  
  // 플랫폼 정보
  getPlatform: () => process.platform,
})

// Electron 환경임을 나타내는 플래그 설정
contextBridge.exposeInMainWorld('isElectron', true)
