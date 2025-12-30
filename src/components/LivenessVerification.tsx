import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness'
import { livenessTextPtBr } from '../config/livenessTextPtBr'
import type { LivenessError, LivenessCallbackParams } from '../types/liveness'
import { getErrorMessage, logError } from '../utils/errorHandler'

interface LivenessVerificationProps {
  sessionId: string
  onComplete?: (params: LivenessCallbackParams) => void
}

export default function LivenessVerification({
  sessionId,
  onComplete,
}: LivenessVerificationProps) {
  const handleAnalysisComplete = async () => {
    console.log('Análise concluída com sucesso')
    
    if (onComplete) {
      onComplete({ success: true })
    }
  }

  const handleError = (livenessError: LivenessError) => {
    logError('LivenessVerification', livenessError)
    
    if (onComplete) {
      const errorMessage = getErrorMessage(livenessError)
      onComplete({ success: false, error: errorMessage })
    }
  }

  return (
    <FaceLivenessDetector
      sessionId={sessionId}
      region="us-east-1"
      displayText={livenessTextPtBr as any}
      onAnalysisComplete={handleAnalysisComplete}
      onError={handleError}
    />
  )
}
