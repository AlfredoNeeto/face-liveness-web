export interface LivenessError {
  state?: string
  message?: string
  code?: string
}

export interface LivenessCallbackParams {
  success: boolean
  error?: string
}
