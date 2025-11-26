#include <WiFi.h>c:\Users\Crepe do Mestre\Desktop\Esp32Gerenciador
#include <HTTPClient.h>

// ============================================================
// 🔧 CONFIGURAÇÕES (ALTERE AQUI)
// ============================================================

const char* ssid = "Kaue";     
const char* password = "marques123";    

// IP do seu computador onde o Backend está rodando
// IMPORTANTE: Não use localhost. Use o IP da rede (ex: 192.168.1.15)
String serverIp = "172.20.10.2"; 
String serverPort = "5197";

// ============================================================
// 🔌 PINOS
// ============================================================
#define PIN_BOTAO 26        // Ligue o botão entre o pino 4 e o GND
#define RX_GM66 16         // Ligue o fio VERDE (TX) do GM66 aqui
#define TX_GM66 17         // Ligue o fio BRANCO (RX) do GM66 aqui (opcional)

// Variáveis de controle do botão (Debounce)
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 500; 

void setup() {
  Serial.begin(115200);
  
  // Inicia comunicação com o Leitor GM66 (9600 baud rate padrão)
  Serial2.begin(9600, SERIAL_8N1, RX_GM66, TX_GM66);
  
  // Configura botão com resistor interno (Pull-up)
  pinMode(PIN_BOTAO, INPUT_PULLUP);

  // Conecta no Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Conectado! IP: " + WiFi.localIP().toString());
}

void loop() {
  // ---------------------------------------------------------
  // 1. LÓGICA DO BOTÃO -> Mudar para "EM PREPARO"
  // ---------------------------------------------------------
  if (digitalRead(PIN_BOTAO) == LOW) {
    if ((millis() - lastDebounceTime) > debounceDelay) {
      Serial.println("\n[Botão] Solicitando próximo pedido para preparo...");
      chamarProximoPedido(); // Chama a função
      lastDebounceTime = millis();
    }
  }

  // ---------------------------------------------------------
  // 2. LÓGICA DO LEITOR -> Mudar para "PRONTO"
  // ---------------------------------------------------------
  if (Serial2.available()) {
    String qrCodeData = Serial2.readStringUntil('\r'); // Lê o código
    qrCodeData.trim(); // Remove espaços
    
    if (qrCodeData.length() > 0) {
      Serial.println("\n[Leitor] Código Lido: " + qrCodeData);
      marcarComoPronto(qrCodeData); // Chama a função
    }
  }
}

// --- FUNÇÃO 1: Chama o próximo pedido (POST /next) ---
void chamarProximoPedido() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ Sem Wi-Fi"); return;
  }

  HTTPClient http;
  String url = "http://" + serverIp + ":" + serverPort + "/api/Orders/next";
  
  http.begin(url);
  int httpCode = http.POST(""); // Envia POST vazio

  if (httpCode == 200) {
    Serial.println("✅ Sucesso! Pedido movido para 'Em Preparo'.");
    String payload = http.getString();
    Serial.println("Dados do Pedido: " + payload); 
    // Aqui você mandaria para o PHP imprimir se quisesse
  } 
  else if (httpCode == 404) {
    Serial.println("⚠️ Fila vazia! Nenhum pedido aguardando.");
  } 
  else {
    Serial.printf("❌ Erro na requisição: %d\n", httpCode);
  }
  http.end();
}

// --- FUNÇÃO 2: Finaliza o pedido (PUT /ready) ---
void marcarComoPronto(String idPedido) {
  if (WiFi.status() != WL_CONNECTED) return;

  // Limpeza: Garante que só tem números no ID
  String idLimpo = "";
  for (char c : idPedido) {
    if (isDigit(c)) idLimpo += c;
  }
  
  if (idLimpo == "") return; // Se não leu número, ignora

  HTTPClient http;
  String url = "http://" + serverIp + ":" + serverPort + "/api/Orders/" + idLimpo + "/ready";
  
  Serial.print("Finalizando pedido ID " + idLimpo + "... ");
  
  http.begin(url);
  int httpCode = http.PUT(""); // Envia PUT

  if (httpCode == 200 || httpCode == 204) {
    Serial.println("✅ PRONTO!");
  } 
  else if (httpCode == 404) {
    Serial.println("❌ Pedido não encontrado ou ID inválido.");
  } 
  else {
    Serial.printf("❌ Erro: %d\n", httpCode);
  }
  http.end();
}