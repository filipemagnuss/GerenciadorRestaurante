#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "Kaue";     
const char* password = "marques123";    

// IP do Backend que está rodando
String serverIp = "172.20.10.2"; 
String serverPort = "5197";

#define PIN_BOTAO 26        
#define RX_GM66 16         
#define TX_GM66 17         

// Variáveis de controle do botão (Debounce)
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 500; 

void setup() {
  Serial.begin(115200);
  

  Serial2.begin(9600, SERIAL_8N1, RX_GM66, TX_GM66);

  pinMode(PIN_BOTAO, INPUT_PULLUP);

  // Conecta no Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Conectando ao Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado! IP: " + WiFi.localIP().toString());
}

void loop() {

  if (digitalRead(PIN_BOTAO) == LOW) {
    if ((millis() - lastDebounceTime) > debounceDelay) {
      Serial.println("\n[Botão] Solicitando próximo pedido para preparo...");
      chamarProximoPedido(); // Chama a função
      lastDebounceTime = millis();
    }
  }

  if (Serial2.available()) {
    String qrCodeData = Serial2.readStringUntil('\r');
    qrCodeData.trim();
    
    if (qrCodeData.length() > 0) {
      Serial.println("\n[Leitor] Código Lido: " + qrCodeData);
      marcarComoPronto(qrCodeData);
    }
  }
}

void chamarProximoPedido() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Sem Wi-Fi"); return;
  }

  HTTPClient http;
  String url = "http://" + serverIp + ":" + serverPort + "/api/Orders/next";
  
  http.begin(url);
  int httpCode = http.POST(""); 

  if (httpCode == 200) {
    Serial.println("Sucesso! Pedido movido para 'Em Preparo'.");
    String payload = http.getString();
    Serial.println("Dados do Pedido: " + payload); 
  } 
  else if (httpCode == 404) {
    Serial.println("Fila vazia! Nenhum pedido aguardando.");
  } 
  else {
    Serial.printf("Erro na requisição: %d\n", httpCode);
  }
  http.end();
}

void marcarComoPronto(String idPedido) {
  if (WiFi.status() != WL_CONNECTED) return;

  String idLimpo = "";
  for (char c : idPedido) {
    if (isDigit(c)) idLimpo += c;
  }
  
  if (idLimpo == "") return;

  HTTPClient http;
  String url = "http://" + serverIp + ":" + serverPort + "/api/Orders/" + idLimpo + "/ready";
  
  Serial.print("Finalizando pedido ID " + idLimpo + "... ");
  
  http.begin(url);
  int httpCode = http.PUT("");

  if (httpCode == 200 || httpCode == 204) {
    Serial.println("PRONTO!");
  } 
  else if (httpCode == 404) {
    Serial.println("Pedido não encontrado ou ID inválido.");
  } 
  else {
    Serial.printf("Erro: %d\n", httpCode);
  }
  http.end();
}