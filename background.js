// URL do seu backend para onde os dados serão enviados.
const backendUrl = "https://seu-backend.com/monitor-data";

// Listener para a requisição antes de ser enviada.
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Verifica se a URL da requisição está na sua lista de monitoramento.
    const isMonitored = details.url.includes("admin/prod");
    console.log(isMonitored)

    if (isMonitored) {
      console.log("Requisição monitorada:", details.url);

      // Captura o payload da requisição, se existir.
      const payload = details.requestBody ? details.requestBody : {};
      const dataToLog = {
        url: details.url,
        method: details.method,
        payload: payload,
        timestamp: new Date().toISOString()
      };

      // Envia os dados para o backend.
      sendDataToBackend(dataToLog);
      console.log("teste")
    }
  },
  { urls: ["https://www.lendariocardgames.com.br/*"] },
  ["requestBody"] // Opção para capturar o corpo da requisição POST
);

// Listener para quando a requisição é completada, para capturar o resultado.
chrome.webRequest.onCompleted.addListener(
  (details) => {
    const isMonitored = details.url.includes("admin/prod");

    if (isMonitored) {
      console.log("Requisição finalizada:", details.url);

      const dataToLog = {
        url: details.url,
        method: details.method,
        statusCode: details.statusCode,
        statusLine: details.statusLine,
        timestamp: new Date().toISOString(),
        ...details
      };

      // Nota: Capturar o corpo da resposta é mais complexo e requer permissões adicionais.
      // O webRequest API não dá acesso direto ao corpo da resposta de forma simples.
      // Uma abordagem alternativa seria usar um content script.

      // Envia os dados do resultado para o backend.
      sendDataToBackend(dataToLog);
    }
  },
  { urls: ["https://www.lendariocardgames.com.br/*"] }
);

// Função para enviar os dados para o backend.
async function sendDataToBackend(data) {
  try {
    console.log(data);
    // const response = await fetch(backendUrl, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(data)
    // });

    // if (!response.ok) {
    //   console.error(`Erro ao enviar dados para o backend: ${response.status} ${response.statusText}`);
    // } else {
    //   console.log("Dados enviados com sucesso para o backend.");
    // }
  } catch (error) {
    console.error("Falha na requisição ao backend:", error);
  }
}