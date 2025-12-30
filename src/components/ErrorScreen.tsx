interface ErrorScreenProps {
  message?: string
}

export default function ErrorScreen({ message }: ErrorScreenProps) {
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
        <h2 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>Erro ao carregar</h2>
        <p style={{ margin: 0, color: '#9aa0a6' }}>
          {message || 'Não foi possível iniciar a verificação. Tente novamente mais tarde.'}
        </p>
      </div>
    </div>
  )
}
