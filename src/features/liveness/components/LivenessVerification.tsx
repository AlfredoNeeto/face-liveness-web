import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import { livenessTextPtBr } from "../config/text.pt-BR";
import type { LivenessError } from "../../../types/liveness";
import { logError } from "../../../utils/errorHandler";

interface Props {
  sessionId: string;
  onSuccess: () => void;
  onError: () => void;
  onCancel: () => void;
}

export default function LivenessVerification({
  sessionId,
  onSuccess,
  onError,
  onCancel,
}: Props) {
  const handleAnalysisComplete = async () => {
    onSuccess();
  };

  const handleUserCancel = async () => {
    onCancel();
  };

  const handleError = async (error: LivenessError) => {
    logError("LivenessVerification", error);
    onError();
  };

  return (
    <FaceLivenessDetector
      sessionId={sessionId}
      region="us-east-1"
      displayText={livenessTextPtBr as any}
      onAnalysisComplete={handleAnalysisComplete}
      onUserCancel={handleUserCancel}
      onError={handleError}
      components={{
        PhotosensitiveWarning: () => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFF8E1",
              border: "1px solid #FBC02D",
              borderRadius: 6,
              padding: "0.75em 0.9em",
              color: "#7A5D00",
              fontSize: "0.9rem",
              lineHeight: 1.4,
              gap: "1em",
            }}
          >
            {/* TEXTO */}
            <div style={{ flex: 1 }}>
              <strong
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "0.15em",
                }}
              >
                Aviso de fotossensibilidade
              </strong>

              <span>
                Esta verificação utiliza estímulos visuais e mudanças de cor.
                Evite continuar se for sensível à luz.
              </span>
            </div>

            {/* ÍCONE */}
            <span
              style={{
                color: "#FBC02D",
                display: "flex",
                alignItems: "center",
              }}
            >
              <InfoIcon />
            </span>
          </div>
        ),
      }}
    />
  );
}

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1.5em"
    height="1.5em"
    aria-hidden
    focusable="false"
    style={{ flexShrink: 0 }}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <rect x="11" y="10" width="2" height="7" fill="#ffffff" />
    <rect x="11" y="6" width="2" height="2" fill="#ffffff" />
  </svg>
);
