export interface LivenessResult {
  type: 'liveness-complete'
  success: boolean
  sessionId: string
  timestamp: string
  error?: string
}

export interface AndroidWebView {
  onLivenessComplete: (result: string) => void
}

export interface IOSWebView {
  messageHandlers: {
    onLivenessComplete: {
      postMessage: (result: LivenessResult) => void
    }
  }
}

declare global {
  interface Window {
    Android?: AndroidWebView
    webkit?: IOSWebView
  }
}

export {}
