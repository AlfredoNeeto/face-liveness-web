# 🔐 Face Liveness Web

Componente web profissional para detecção de vivacidade facial usando AWS Amplify. Integra-se perfeitamente com WebViews (iOS/Android) e portais web, oferecendo autenticação biométrica segura com interface localizada em português.

---

## 📋 Sumário

- [Features](#-features)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso e Integração](#-uso-e-integração)
- [Arquitetura](#-arquitetura)
- [Segurança](#-segurança)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

✅ **Detecção de Vivacidade Facial** - Verificação de rosto em tempo real via AWS Amplify Liveness  
✅ **Suporte Multi-plataforma** - iOS WebView, Android WebView, Safari, Chrome, Firefox  
✅ **Interface em Português** - Localização completa de todas as mensagens e hints  
✅ **Permissões de Câmera** - Gate inteligente com feedback de erro  
✅ **Callback System** - Sistema de callbacks para comunicação com aplicação pai  
✅ **TypeScript Strict** - 100% tipado com TypeScript 5.9+  
✅ **Content Security Policy** - Proteção contra XSS, CSRF e injeção de conteúdo  
✅ **Design Responsivo** - Otimizado para desktop, tablet e mobile  
✅ **Tratamento de Erros** - Mapeamento de 20+ erros com mensagens amigáveis  
✅ **WebView Bridges** - Suporte para Android (Java) e iOS (WKWebView)

---

## 🔧 Requisitos

- **Node.js**: v18.0.0 ou superior
- **npm**: v9.0.0 ou superior (ou yarn/pnpm)
- **AWS Account**: Com Amplify Auth configurado
- **Navegador**: Suporte a WebGL e getUserMedia API

### Dependências Principais

```json
{
  "react": "19.2.0",
  "typescript": "5.9.3",
  "vite": "7.2.4",
  "@aws-amplify/ui-react-liveness": "3.5.0",
  "aws-amplify": "6.15.9"
}
```

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd face-liveness-web
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_APP_VERSION=1.0.0

# Development
VITE_API_ENDPOINT=http://localhost:3000/api
```

---

## ⚙️ Configuração

### AWS Amplify

O projeto já vem com Amplify configurado via `amplify/` folder. Para reconfigurar:

```bash
npm install -g @aws-amplify/cli
amplify configure
amplify pull
```

Seu arquivo `src/amplifyconfiguration.json` contém a configuração padrão.

### Vite Dev Server

O servidor de desenvolvimento está configurado para:
- Escutar em `0.0.0.0` (todos os IPs da rede)
- Porta: `5173`
- Hot Module Replacement habilitado
- Headers de segurança aplicados

Acesse a aplicação:

```
Local:    http://localhost:5173
Network:  http://<seu-ip>:5173
```

### Content Security Policy

A CSP está configurada em `src/config/securityPolicy.ts` e aplicada via:
- Meta tag em `index.html`
- Headers do servidor Vite
- Produção: HTTPS obrigatório

---

## 🚀 Uso e Integração

### Uso Básico no Navegador

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Integração com WebView (React Native)

```javascript
import { WebView } from 'react-native-webview';

export function LivenessScreen({ sessionId, onComplete }) {
  return (
    <WebView
      source={{
        uri: `https://seu-dominio.com?sessionId=${sessionId}`
      }}
      onMessage={(event) => {
        const { data } = event.nativeEvent;
        if (data.type === 'liveness-complete') {
          onComplete({
            success: data.success,
            error: data.error,
            sessionId: data.sessionId
          });
        }
      }}
    />
  );
}
```

### Integração com iframe (Web)

```html
<!-- HTML da aplicação pai -->
<iframe 
  id="liveness-frame"
  src="https://seu-dominio.com?sessionId=SESSION_ID"
  style="width: 100%; height: 100%; border: none;"
></iframe>

<script>
  // Escuta resultado da detecção
  window.addEventListener('message', (event) => {
    if (event.data.type === 'liveness-complete') {
      console.log('Result:', event.data);
      // success: boolean
      // error?: string
      // sessionId: string
      // timestamp: string
    }
  });
</script>
```

### Integração com WKWebView (iOS)

```swift
import WebKit

class LivenessViewController: UIViewController {
    var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let config = WKWebViewConfiguration()
        
        // Adicione um script message handler
        config.userContentController.add(self, name: "onLivenessComplete")
        
        webView = WKWebView(frame: .zero, configuration: config)
        view = webView
        
        // Carregue a URL com sessionId
        if let url = URL(string: "https://seu-dominio.com?sessionId=\(sessionId)") {
            webView.load(URLRequest(url: url))
        }
    }
}

// MARK: - WKScriptMessageHandler
extension LivenessViewController: WKScriptMessageHandler {
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        if message.name == "onLivenessComplete" {
            if let data = message.body as? [String: Any] {
                handleLivenessResult(data)
            }
        }
    }
}
```

### Integração com WebViewClient (Android)

```java
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;

public class LivenessActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_liveness);
        
        webView = findViewById(R.id.webview);
        
        // Enable JavaScript
        webView.getSettings().setJavaScriptEnabled(true);
        
        // Add JavaScript interface
        webView.addJavascriptInterface(new LivenessInterface(), "Android");
        
        // Load URL
        String url = "https://seu-dominio.com?sessionId=" + sessionId;
        webView.loadUrl(url);
    }
    
    private class LivenessInterface {
        @JavascriptInterface
        public void onLivenessComplete(String result) {
            // result é um JSON string com: { success, error, sessionId, timestamp }
            handleLivenessResult(result);
        }
    }
}
```

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/
│   ├── LivenessVerification.tsx    # Wrapper do FaceLivenessDetector
│   ├── PermissionPrompt.tsx        # Gate de permissão de câmera
│   └── ErrorScreen.tsx             # Tela de erro genérica
├── config/
│   ├── livenessTextPtBr.ts         # Textos em português
│   └── securityPolicy.ts           # Configuração de CSP
├── types/
│   ├── liveness.ts                 # Tipos de callback
│   └── webview.d.ts                # Tipos de WebView
├── utils/
│   └── errorHandler.ts             # Mapeamento de erros
├── App.tsx                         # Componente principal
├── main.tsx                        # Entry point
├── index.css                       # Estilos globais
└── amplifyconfiguration.json       # Config AWS
```

### Fluxo de Dados

```
App.tsx
├─ Extrai sessionId da URL (?sessionId=...)
├─ Verifica permissão de câmera
│  ├─ ✅ Permitida → PermissionPrompt (hidden)
│  ├─ ❌ Negada → PermissionPrompt (visible)
│  └─ ⚠️ Erro → ErrorScreen
├─ LivenessVerification
│  ├─ FaceLivenessDetector (AWS)
│  ├─ handleAnalysisComplete → callback
│  └─ handleError → errorHandler → callback
└─ Callback envia resultado via:
   ├─ window.parent.postMessage() [iframe]
   ├─ window.Android.onLivenessComplete() [Android]
   └─ window.webkit.messageHandlers.onLivenessComplete.postMessage() [iOS]
```

### Componentes

#### **App.tsx** (Orquestrador)
- Gerencia estado de permissão
- Extrai sessionId da URL
- Dispensa callbacks para aplicação pai
- Renderização condicional de telas

#### **LivenessVerification.tsx** (Wrapper AWS)
- Encapsula `FaceLivenessDetector`
- Mapeia erros via `errorHandler`
- Chama callback com `LivenessCallbackParams`

#### **PermissionPrompt.tsx** (UI Minimalist)
- Solicita permissão de câmera
- Mostra erros de permissão
- Design responsivo

#### **ErrorScreen.tsx** (Fallback)
- Exibida quando sessionId não existe
- Customizável com mensagem própria

---

## 🔒 Segurança

### Content Security Policy (CSP)

Configuração rigorosa em `src/config/securityPolicy.ts`:

```
✅ Scripts: self + wasm-unsafe-eval (AWS SDK)
✅ Estilos: self + unsafe-inline (React)
✅ Imagens: self + data: + blob:
✅ Conexões: AWS endpoints + localhost (dev)
✅ Câmera: self (permissão necessária)
✅ Iframes: nenhum (bloqueado)
```

### Headers de Segurança

```
X-Frame-Options: SAMEORIGIN              # Previne clickjacking
X-Content-Type-Options: nosniff           # Previne MIME sniffing
X-XSS-Protection: 1; mode=block           # XSS protection
Strict-Transport-Security: max-age=...    # HTTPS obrigatório
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(self), microphone=(self), ...
```

### Boas Práticas

1. **HTTPS em Produção**: Sempre use HTTPS
2. **CORS**: Configure adequadamente para seus domínios
3. **Validação de sessionId**: Valide no backend antes
4. **Timeout**: Configure timeout apropriado nas requisições
5. **Rate Limiting**: Implemente no servidor

---

## 🐛 Troubleshooting

### Problema: "Câmera não encontrada"

**Possíveis causas:**
- Dispositivo não tem câmera
- Navegador não tem permissão
- Câmera em uso por outra aplicação

**Solução:**
```javascript
// Verifique suporte a getUserMedia
if (!navigator.mediaDevices?.getUserMedia) {
  console.error('getUserMedia não suportado');
}
```

### Problema: "sessionId não fornecido"

**Solução:**
Certifique-se de passar o sessionId na URL:
```
https://seu-dominio.com?sessionId=12345678-1234-1234-1234-123456789012
```

### Problema: CSP bloqueando recursos

**Debug:**
Abra DevTools → Console e procure por `Refused to load the ...`

**Solução:**
1. Identifique o recurso bloqueado
2. Atualize `securityPolicy.ts`
3. Recompile e recarregue

### Problema: iOS WebView não funciona

**Solução:**
1. Verifique que `webkit.messageHandlers.onLivenessComplete` existe
2. Injete script manualmente se necessário:
```javascript
webView.evaluateJavaScript(
  "window.webkit = { messageHandlers: { onLivenessComplete: { postMessage: function(data) { ... } } } }"
)
```

### Problema: Android WebView não recebe callback

**Solução:**
1. Confirme que `Android` interface está adicionada ao WebView
2. Verifique permissão `android:name="android.permission.CAMERA"`
3. Teste com `console.log` antes do callback:
```typescript
console.log('Android:', (window as any).Android);
```

---

## 📚 Documentação Adicional

- [AWS Amplify Liveness](https://docs.amplify.aws/react/build-a-backend/auth/concepts/user-sign-in-flow/)
- [React 19 Docs](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 📞 Suporte

Para reportar bugs ou solicitar features:
1. Crie uma issue no repositório
2. Inclua: versão do navegador, OS, passos para reproduzir
3. Anexe prints e logs do console

---

## 📄 Licença

Proprietary © 2025. Todos os direitos reservados.

---

**Última atualização**: 30 de dezembro de 2025  
**Versão**: 1.0.0  
**Status**: ✅ Production Ready
