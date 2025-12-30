
export interface LivenessError {
  state?: string
  code?: string
  message?: string
  name?: string
  isUserCancelled?: boolean
}

export interface DeviceInfo {
  camera?: {
    supported: boolean
    enabled: boolean
  }
  microphone?: {
    supported: boolean
    enabled: boolean
  }
}