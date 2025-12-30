interface PermissionPromptProps {
  onPermissionGranted: () => void
  checkingPermission: boolean
  permissionError: string | null
}

export default function PermissionPrompt({
  onPermissionGranted,
  checkingPermission,
  permissionError,
}: PermissionPromptProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>Permitir câmera</h2>
        <p style={{ margin: '0 0 16px', color: '#9aa0a6' }}>
          Para iniciar a verificação, conceda acesso à câmera.
        </p>
        <button
          onClick={onPermissionGranted}
          disabled={checkingPermission}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #3a3a3a',
            background: '#2f2f2f',
            color: '#ffffff',
            cursor: checkingPermission ? 'default' : 'pointer',
          }}
        >
          {checkingPermission ? 'Solicitando…' : 'Permitir câmera'}
        </button>
        {permissionError && (
          <p style={{ color: '#e57373', marginTop: '12px' }}>{permissionError}</p>
        )}
      </div>
    </div>
  )
}
