import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'

// 개발 모드 확인
const isDevelopment = process.env.NODE_ENV === 'development'

// 메인 윈도우 참조를 전역으로 유지
let mainWindow: BrowserWindow | null = null

async function createWindow() {
  // 브라우저 윈도우 생성
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
    // macOS에서는 frameless 대신 titleBarStyle 사용
    titleBarStyle: 'default', // 'hiddenInset'에서 'default'로 변경
    // 반투명 배경 설정 제거
    transparent: false,
    backgroundColor: '#1a1a1a', // 불투명 배경색으로 변경
    // 앱 아이콘 설정
    icon: join(isDevelopment ? process.cwd() : app.getAppPath(), 'public', 'logo.ico')
  })

  // 앱 로드
  if (isDevelopment) {
    // 개발 모드에서는 로컬 서버 사용
    await mainWindow.loadURL('http://localhost:3000')
    // 개발자 도구 열기
    mainWindow.webContents.openDevTools()
  } else {
    // 프로덕션 모드에서는 빌드된 파일 로드
    // 빌드 출력 디렉토리가 dist로 설정되어 있으므로 dist/index.html을 로드
    await mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  // 외부 링크는 기본 브라우저에서 열기
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 윈도우가 닫힐 때 이벤트
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Electron이 초기화되면 윈도우 생성
app.whenReady().then(createWindow)

// 모든 윈도우가 닫히면 앱 종료 (윈도우/리눅스)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// macOS에서 앱 아이콘 클릭 시 윈도우 재생성
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
