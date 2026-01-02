import { useMemo, useState, useEffect } from 'react'
import PermissionPrompt from './components/PermissionPrompt'
import ErrorScreen from './components/ErrorScreen'
import LivenessVerification from './components/LivenessVerification'
import type { LivenessResult } from './types/webview'
import type { LivenessCallbackParams } from './types/liveness'

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [checkingPermission, setCheckingPermission] = useState(true)
  const [permissionError, setPermissionError] = useState<string | null>(null)

  // Verificar permissão ao carregar
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach(track => track.stop())
        setHasCameraPermission(true)
      } catch {
        // Se não conseguir acessar, deixa para o usuário solicitar
        setHasCameraPermission(false)
      } finally {
        setCheckingPermission(false)
      }
    }

    checkCameraPermission()
  }, [])

  const requestCameraPermission = async () => {
    setPermissionError(null)
    setCheckingPermission(true)
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Seu navegador não suporta captura de câmera.')
        return
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      setHasCameraPermission(true)
    } catch (err) {
      setPermissionError('Permissão de câmera negada ou indisponível.')
    } finally {
      setCheckingPermission(false)
    }
  }

  const sessionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('sessionId')
  }, [])

  if (!hasCameraPermission) {
    return (
      <PermissionPrompt
        onPermissionGranted={requestCameraPermission}
        checkingPermission={checkingPermission}
        permissionError={permissionError}
      />
    )
  }

  if (!sessionId) return <ErrorScreen />

  const handleLivenessComplete = ({ success, error }: LivenessCallbackParams) => {
    const result: LivenessResult = {
      type: 'liveness-complete',
      success,
      sessionId: sessionId!,
      timestamp: new Date().toISOString(),
      ...(error && { error }),
    }

    console.log('Resultado da prova de vida:', result)

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
