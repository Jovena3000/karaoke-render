// Adicione esta função no início do arquivo
const getWebSocketUrl = () => {
  if (import.meta.env.PROD) {
    // Em produção, use o mesmo domínio
    return window.location.origin;
  }
  // Em desenvolvimento, use localhost:3000
  return 'http://localhost:3000';
};

// No seu código, onde conecta o WebSocket:
const initializeSession = async () => {
  try {
    await sessionService.connect(getWebSocketUrl());
    // ... resto do código
  } catch (err) {
    console.error('Erro ao inicializar sessão:', err);
  }
};
