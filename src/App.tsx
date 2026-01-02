import { useMemo } from 'react'
import ErrorScreen from './components/ErrorScreen'
import LivenessVerification from './components/LivenessVerification'
import type { LivenessResult } from './types/webview'
import type { LivenessCallbackParams } from './types/liveness'

export default function App() {
  const sessionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('sessionId')
  }, [])

  if (!sessionId) return <ErrorScreen />

  const handleLivenessComplete = ({ success, error }: LivenessCallbackParams) => {
    const result: LivenessResult = {
      type: 'liveness-complete',
      success,
      sessionId: sessionId!,
      timestamp: new Date().toISOString(),
      ...(error && { error }),
    }

    window.parent.postMessage(result, '*')

    if (window.Android?.onLivenessComplete) {
      window.Android.onLivenessComplete(JSON.stringify(result))
    }
    if (window.webkit?.messageHandlers?.onLivenessComplete) {
      window.webkit.messageHandlers.onLivenessComplete.postMessage(result)
    }
  }

  return <LivenessVerification sessionId={sessionId} onComplete={handleLivenessComplete} />
}
