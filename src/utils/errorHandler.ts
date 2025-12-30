import type { LivenessError } from '../types/liveness'

interface ErrorMapping {
  [key: string]: string
}

const ERROR_MESSAGES: ErrorMapping = {
  TIMEOUT: 'Tempo esgotado. Tente novamente.',
  CONNECTION_TIMEOUT: 'Conexão expirou. Verifique sua internet.',
  
  MULTIPLE_FACES: 'Múltiplos rostos detectados. Apenas uma pessoa deve estar visível.',
  NO_FACE: 'Nenhum rosto detectado. Posicione-se na frente da câmera.',
  FACE_DISTANCE_ERROR: 'Ajuste a distância da câmera para melhor enquadramento.',
  FACE_TOO_CLOSE: 'Rosto muito próximo. Afaste-se um pouco.',
  FACE_TOO_FAR: 'Rosto muito distante. Aproxime-se da câmera.',
  
  CAMERA_ACCESS_ERROR: 'Não foi possível acessar a câmera. Verifique as permissões.',
  CAMERA_FRAMERATE_ERROR: 'Taxa de frames da câmera muito baixa.',
  CAMERA_NOT_FOUND: 'Câmera não encontrada no dispositivo.',
  
  RUNTIME_ERROR: 'Erro técnico durante a verificação. Tente novamente.',
  SERVER_ERROR: 'Serviço indisponível no momento. Tente novamente mais tarde.',
  CLIENT_ERROR: 'Erro no navegador durante a verificação.',
  
  SESSION_NOT_FOUND: 'Sessão não encontrada ou expirada.',
  INVALID_SESSION: 'Sessão inválida. Solicite uma nova verificação.',
  
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  
  UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.',
}

export const getErrorMessage = (error: LivenessError | unknown): string => {
  if (!error) {
    return ERROR_MESSAGES.UNKNOWN_ERROR
  }

  const livenessError = error as LivenessError

  if (livenessError.state && ERROR_MESSAGES[livenessError.state]) {
    return ERROR_MESSAGES[livenessError.state]
  }

  if (livenessError.code && ERROR_MESSAGES[livenessError.code]) {
    return ERROR_MESSAGES[livenessError.code]
  }

  if (livenessError.message) {
    return livenessError.message
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR
}

export const logError = (context: string, error: LivenessError | unknown): void => {
  console.error(`[${context}]`, {
    error,
    message: getErrorMessage(error),
    timestamp: new Date().toISOString(),
  })
}
