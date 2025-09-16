#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "Sameer's F15";
const char* password = "samxxxxxr";

// ThingSpeak settings
String apiKey = "JP9HODPQIJBLKDLD"; // Replace with your ThingSpeak Write API Key
const char* server = "http://api.thingspeak.com/update";

// Ultrasonic sensor pins
#define TRIG_PIN 5
#define ECHO_PIN 18

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
  
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2; // cm
  return distance;
}

void loop() {
  float distance = getDistance();
  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = server;
    url += "?api_key=" + apiKey;
    url += "&field1=" + String(distance);
    
    http.begin(url);
    int httpCode = http.GET();
    
    if (httpCode > 0) {
      Serial.println("Data uploaded to ThingSpeak!");
    } else {
      Serial.println("Error sending data.");
    }
    http.end();
  } else {
    Serial.println("WiFi not connected!");
  }

  delay(15000); // ThingSpeak minimum update interval is 15 sec
}