// Kirjastot
// ArduinoJson 6.19.4
//

#include <Arduino.h>
#include <ArduinoJson.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ESP8266HTTPClient.h>

#include <WiFiClientSecureBearSSL.h>

ESP8266WiFiMulti WiFiMulti;

StaticJsonDocument<400> doc;

double lake = 0.0;

void setup() {

  Serial.begin(115200);
  // Serial.setDebugOutput(true);

  Serial.println("Started");
  Serial.println();
  Serial.println();

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP("xxx", "xxx");
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
    Serial.flush();
  }
  Serial.println("Connected");
  Serial.println(WiFi.localIP());
}

void loop() {
  getTempFromLake();
  Serial.print("lake ");
  Serial.println(lake);
  delay(5*60*1000);
}

void getTempFromLake() {
    if ((WiFiMulti.run() == WL_CONNECTED)) {

    std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);

    client->setInsecure();
    
    HTTPClient https;
    https.useHTTP10(true);

    Serial.print("[HTTPS] begin...\n");
    if (https.begin(*client, "https://tempview.vuorenkoski.fi/api/graphql")) {  // HTTPS

      Serial.print("[HTTPS] GET...\n");

      // start connection and send HTTP header
      https.addHeader("Content-Type","application/json");
      https.addHeader("Authorization","bearer ");
      int httpCode = https.POST("{\"query\": \"query SensorDetails($sensorName: String!) {sensorDetails(sensorName: $sensorName) {lastValue}}\", \"variables\":{\"sensorName\": \"CLAK\"}}");

      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTPS] GET... code: %d\n", httpCode);

        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = https.getString();
            DeserializationError error = deserializeJson(doc, payload);
            if (!error) {
              lake = doc["data"]["sensorDetails"]["lastValue"];
            }
          Serial.println(payload);
        }
      } else {
        Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
      }

      https.end();
    } 
  }
}
