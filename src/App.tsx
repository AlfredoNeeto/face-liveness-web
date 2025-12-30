import ErrorScreen from './components/ui/ErrorScreen'
import LivenessVerification from './features/liveness/components/LivenessVerification'

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const sessionId = params.get('sessionId')

  if (!sessionId) {
    window.location.href = 'app://liveness-error'
    return <ErrorScreen />
  }

  return (
    <LivenessVerification
      key={sessionId}
      sessionId={sessionId}
      onSuccess={() => {
        window.location.href = 'app://liveness-success'
      }}
      onError={() => {
        window.location.href = 'app://liveness-error'
      }}
      onCancel={() => {
        window.location.href = 'app://liveness-cancel'
      }}
    />
  )
}
