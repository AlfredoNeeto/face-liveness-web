## Face Liveness Web

Aplicação web em Vite/React para verificação de vivacidade facial usando AWS Amplify Face Liveness.

### Requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```
Servidor padrão em `http://localhost:5173`.

### Produção (build)
```bash
npm run build
npm run preview
```

### Fontes
- Poppins (Regular 400, Medium 500, SemiBold 600) servidas de `public/fonts` e registradas em `src/index.css`.

### Configuração AWS Amplify
- Ajuste o arquivo `src/aws-exports.js` conforme seu ambiente Amplify.
- Certifique-se de fornecer `sessionId` na query string ao abrir a aplicação para iniciar a verificação.

### Scripts úteis
- `npm run lint` (se configurado) para checar estilo e qualidade.

### Estrutura principal
- `src/main.tsx`: bootstrap do React e configuração do Amplify.
- `src/App.tsx`: orquestra a verificação e trata fluxos de sucesso/erro/cancelamento.
- `src/features/liveness/components/LivenessVerification.tsx`: componente do detector de vivacidade.

### Licença
Projeto interno. Ajuste conforme sua política antes de distribuir.
