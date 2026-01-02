import { useMemo } from 'react'
import ErrorScreen from './components/ErrorScreen'
import LivenessVerification from './components/LivenessVerification'
import type { LivenessResult, LivenessCancelResult } from './types/webview'
import type { LivenessCallbackParams } from './types/liveness'

async function emitToFlutter(payload: unknown) {
  const jsonPayload = JSON.stringify(payload)
  
  // Debug: sempre loga no console para verificar se o evento está sendo emitido
  console.log('[Liveness Event]', jsonPayload)
  
  // flutter_inappwebview - método padrão
  if ((window as any).flutter_inappwebview) {
    try {
      await (window as any).flutter_inappwebview.callHandler(
        'livenessEvent',
        jsonPayload
      )
      console.log('[Liveness] Evento enviado via flutter_inappwebview')
      return
    } catch (error) {
      console.error('[Liveness] Erro ao enviar via flutter_inappwebview:', error)
    }
  }
  
  // Fallback: window.postMessage para webview_flutter ou outros
  try {
    window.parent.postMessage(jsonPayload, '*')
    console.log('[Liveness] Evento enviado via postMessage')
  } catch (error) {
    console.error('[Liveness] Erro ao enviar via postMessage:', error)
  }
  
  // Fallback: webkit para iOS WKWebView
  if ((window as any).webkit?.messageHandlers?.livenessEvent) {
    try {
      (window as any).webkit.messageHandlers.livenessEvent.postMessage(jsonPayload)
      console.log('[Liveness] Evento enviado via webkit messageHandler')
    } catch (error) {
      console.error('[Liveness] Erro ao enviar via webkit:', error)
    }
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
