import { useMemo } from 'react'
import ErrorScreen from './components/ErrorScreen'
import LivenessVerification from './components/LivenessVerification'
import type { LivenessResult, LivenessCancelResult } from './types/webview'
import type { LivenessCallbackParams } from './types/liveness'

function emitToFlutter(payload: unknown) {
  if ((window as any).flutter_inappwebview) {
    ;(window as any).flutter_inappwebview.callHandler(
      'livenessEvent',
      payload
    )
  }
}

export default function App() {
  const sessionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('sessionId')
  }, [])

  if (!sessionId) return <ErrorScreen />

  const handleLivenessComplete = ({
    success,
    error,
  }: LivenessCallbackParams) => {
    const result: LivenessResult = {
      type: 'liveness-complete',
      success,
      sessionId,
      timestamp: new Date().toISOString(),
      ...(error && { error }),
    }

    emitToFlutter(result)
  }

  const handleLivenessCancel = () => {
    const result: LivenessCancelResult = {
      type: 'liveness-cancelled',
      sessionId,
      timestamp: new Date().toISOString(),
    }

    emitToFlutter(result)
  }

  return (
    <LivenessVerification
      sessionId={sessionId}
      onComplete={handleLivenessComplete}
      onCancel={handleLivenessCancel}
    />
  )
}
