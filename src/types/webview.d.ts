export interface LivenessResult {
  type: 'liveness-complete'
  success: boolean
  sessionId: string
  timestamp: string
  error?: string
}

export interface LivenessCancelResult {
  type: 'liveness-cancelled'
  sessionId: string
  timestamp: string
  reason?: string
}

export type LivenessEvent = LivenessResult | LivenessCancelResult

export interface AndroidWebView {
  onLivenessComplete: (result: string) => void
}

export interface IOSWebView {
  messageHandlers: {
    onLivenessComplete: {
      postMessage: (result: LivenessEvent) => void
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
