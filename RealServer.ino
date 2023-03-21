#include <ESP8266WiFi.h>
#include <ESPAsyncWebServer.h>
#include <FS.h>
#include <FastLED.h>
#include <ArduinoJson.h>

#include "LedStrip.h"
#include "PacketCollector.h"
#include "SmartSave.h"
#include "ObjectData.h"
#include "JsonToCRGB.h"

const String ssid = "ViridisVindex";
const String password = "12481632";

AsyncWebServer server(80);

const String webserverDirPath = "/ws";
const String serverdataDirPath = "/sd";
const String savesDirPath = serverdataDirPath + "/saves";
const String currentSavePath = serverdataDirPath + "/currentSave.json";

SmartSave *smartSave = nullptr;

PacketCollector *packetCollector;

#define SWITCH_PIN D0

bool device = false;
bool enabled = true;

unsigned long ttime = 0;
unsigned int updateInterval = 25;

#define LED_STRIPS (uint8_t)5

LedStrip ledHardware[LED_STRIPS] = {
    LedStrip(D2, 80),
    LedStrip(D3, 80),
    LedStrip(D4, 80),
    LedStrip(D5, 80),
    LedStrip(D6, 80),
};

int totalLedNum;

void setDevice(bool value)
{
  device = value;
  digitalWrite(SWITCH_PIN, value ? LOW : HIGH);

  if (!device)
    FastLED.clear(true);
}

void setEnabled(bool value)
{
  enabled = value;

  if (!enabled)
    FastLED.clear(true);
}

bool loadSmartSave()
{
  DynamicJsonDocument jsonDoc(8192);
  File currentSmartSave = SPIFFS.open(currentSavePath, "r");
  DeserializationError jsonErr = deserializeJson(jsonDoc, currentSmartSave);
  currentSmartSave.close();

  if (jsonErr)
    return false;

  if (smartSave != nullptr)
    delete smartSave;
  smartSave = new SmartSave(jsonDoc.as<JsonObject>());

  return true;
}

#pragma region Colour

uint8_t lerp(uint8_t a, uint8_t b, double d)
{
  return round(a + (b - a) * d);
}

CRGB colourLerp(CRGB a, CRGB b, double d)
{
  return CRGB(
      lerp(a.r, b.r, d),
      lerp(a.g, b.g, d),
      lerp(a.b, b.b, d));
}

CRGB getCurrentColour(int tttime, ColPos *colPos, int cycleTime)
{
  int thisTime = tttime % cycleTime;

  int higherColPos = 1;
  while (colPos->colPos[higherColPos].pos <= thisTime)
    higherColPos++;

  ColPos::ColPosElem lower = colPos->colPos[higherColPos - 1];
  ColPos::ColPosElem higher = colPos->colPos[higherColPos];

  int relativeTime = thisTime - lower.pos;
  int relativeTimeMax = higher.pos - lower.pos;
  double d = (double)relativeTime / relativeTimeMax;

  return colourLerp(lower.col, higher.col, d);
}

ObjectData getColour(SmartSave::SmartSaveObject *object)
{
  ObjectData objectData;

  SmartSaveObjectType objectType = object->type;

  if (objectType == SmartSaveObjectType::Disabled)
  {
    objectData = ObjectData(CRGB(0, 0, 0));
  }
  else if (objectType == SmartSaveObjectType::Enabled)
  {
    objectData = ObjectData(CRGB(50, 50, 50));
  }
  else if (objectType == SmartSaveObjectType::Static)
  {
    SmartSave::StaticSmartSaveObject *staticObject = (SmartSave::StaticSmartSaveObject *)object;
    objectData = ObjectData(staticObject->col);
  }
  else if (objectType == SmartSaveObjectType::Cycle)
  {
    SmartSave::CycleSmartSaveObject *cycleObject = (SmartSave::CycleSmartSaveObject *)object;
    objectData = ObjectData(getCurrentColour(ttime, cycleObject->colPos, cycleObject->cycleTime));
  }
  else if (objectType == SmartSaveObjectType::Wave)
  {
    SmartSave::WaveSmartSaveObject *waveObject = (SmartSave::WaveSmartSaveObject *)object;
    ObjectData::WaveDiyData *diyData = new ObjectData::WaveDiyData(waveObject->cycleTime, waveObject->colPos, waveObject->spread, waveObject->flip ? 1 : -1);
    objectData = ObjectData(diyData);
  }

  return objectData;
}

void setColours()
{
  int objectsLength = smartSave->objectsLength;
  ObjectData *objectColours = new ObjectData[objectsLength];
  for (int i = 0; i < objectsLength; i++)
  {
    objectColours[i] = getColour(smartSave->objects[i]);
  }

  int cStrip = 0;
  int stripLed = 0;
  for (int i = 0; i < totalLedNum; i++)
  {
    if (ledHardware[cStrip].ledNum <= stripLed)
    {
      cStrip++;
      stripLed = 0;
    }

    ObjectData thisLedData = objectColours[smartSave->data[i]];
    CRGB thisLedColour = thisLedData.col;

    if (thisLedData.diy)
    {
      ObjectData::DiyData *diyData = thisLedData.diyData;
      SmartSaveObjectType ledType = diyData->type;

      if (ledType == SmartSaveObjectType::Wave)
      {
        ObjectData::WaveDiyData *waveDiyData = (ObjectData::WaveDiyData *)thisLedData.diyData;
        thisLedColour = getCurrentColour(ttime + waveDiyData->spread * i * waveDiyData->flip, waveDiyData->colPos, waveDiyData->cycleTime);
      }
    }

    ledHardware[cStrip].strip[stripLed] = thisLedColour;

    stripLed++;
  }

  for (int i = 0; i < objectsLength; i++)
  {
    if (objectColours[i].diy)
    {
      delete objectColours[i].diyData;
    }
  }

  FastLED.show();

  delete[] objectColours;
}

#pragma endregion

#pragma region API

String getSavePath(String save)
{
  return savesDirPath + "/" + save + ".json";
}

void APIsetSmartSave(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
{
  if (packetCollector->collectPacketsInFile(currentSavePath, PacketCollector::FileMode::WRITE, data, len, index, total))
  {
    bool loadedErr = !loadSmartSave();

    if (loadedErr)
    {
      request->send(400);
      return;
    }

    request->send(200);
  }
}

void APIgetOptions(AsyncWebServerRequest *request)
{
  DynamicJsonDocument doc(1024);

  JsonObject options = doc.to<JsonObject>();
  options["enabled"] = enabled;
  options["device"] = device;
  options["updateInterval"] = updateInterval;

  char buffer[1024];
  serializeJson(options, buffer);

  request->send(200, "application/json", buffer);
}

void APIsetOptions(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
{
  if (packetCollector->collectPackets(data, len, index, total))
  {
    DynamicJsonDocument doc(1024);
    DeserializationError jsonErr = deserializeJson(doc, packetCollector->getData());

    if (jsonErr)
    {
      request->send(400);
      return;
    }

    JsonObject options = doc.as<JsonObject>();

    if (options.containsKey("enabled"))
      setEnabled(options["enabled"].as<bool>());
    if (options.containsKey("device"))
      setDevice(options["device"].as<bool>());
    if (options.containsKey("updateInterval"))
      updateInterval = options["updateInterval"].as<int>();

    packetCollector->clear();

    request->send(200);
  }
}

void APIgetSaves(AsyncWebServerRequest *request)
{
  DynamicJsonDocument doc(1024);
  JsonArray saves = doc.to<JsonArray>();

  Dir savesDir = SPIFFS.openDir(savesDirPath);

  while (savesDir.next())
  {
    String filename = savesDir.fileName();
    saves.add(filename.substring(savesDirPath.length() + 1, filename.length() - 5));
  }

  char buffer[1024];
  serializeJson(saves, buffer);

  request->send(200, "application/json", buffer);
}

void APIgetSave(AsyncWebServerRequest *request)
{
  if (request->hasParam("current"))
  {
    request->send(SPIFFS, currentSavePath, "application/json");
    return;
  }

  if (!request->hasParam("name"))
  {
    request->send(400);
    return;
  }

  String save = request->getParam("name")->value();
  String savePath = getSavePath(save);

  if (!SPIFFS.exists(savePath))
  {
    request->send(404);
    return;
  }

  request->send(SPIFFS, savePath, "application/json");
}

void APIgetSetSave(AsyncWebServerRequest *request)
{
  if (!request->hasParam("name"))
  {
    request->send(400);
    return;
  }

  String save = request->getParam("name")->value();
  String savePath = getSavePath(save);

  if (!SPIFFS.exists(savePath))
  {
    request->send(404);
    return;
  }

  File saveFile = SPIFFS.open(savePath, "r");
  SPIFFS.remove(currentSavePath);
  File currentSaveFile = SPIFFS.open(currentSavePath, "a");

  while (saveFile.available())
    currentSaveFile.write(saveFile.read());

  saveFile.close();
  currentSaveFile.close();

  loadSmartSave();

  request->send(SPIFFS, savePath, "application/json");
}

void APIcreateSave(AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total)
{
  if (!request->hasParam("name"))
  {
    request->send(400);
    return;
  }

  String save = request->getParam("name")->value();
  String savePath = getSavePath(save);

  if (packetCollector->collectPacketsInFile(savePath, PacketCollector::FileMode::WRITE, data, len, index, total))
  {
    request->send(200);
  }
}

void APIrenameSave(AsyncWebServerRequest *request)
{
  if (!request->hasParam("name") | !request->hasParam("newName"))
  {
    request->send(400);
    return;
  }

  String save = request->getParam("name")->value();
  String savePath = getSavePath(save);

  if (!SPIFFS.exists(savePath))
  {
    request->send(404);
    return;
  }

  String newSave = request->getParam("newName")->value();
  String newSavePath = getSavePath(newSave);

  if (SPIFFS.exists(newSavePath))
  {
    request->send(409);
    return;
  }

  SPIFFS.rename(savePath, newSavePath);

  request->send(200);
}

void APIdeleteSave(AsyncWebServerRequest *request)
{
  if (!request->hasParam("name"))
  {
    request->send(400);
    return;
  }

  String save = request->getParam("name")->value();
  String savePath = getSavePath(save);

  if (!SPIFFS.exists(savePath))
  {
    request->send(404);
    return;
  }

  SPIFFS.remove(savePath);

  request->send(200);
}

void handleNotFound(AsyncWebServerRequest *request)
{
  if (request->method() == HTTP_OPTIONS) // FOR CORS
  {
    request->send(200);
    return;
  }

  request->send(404);
}

#pragma endregion

void setupLeds()
{
  totalLedNum = 0;
  for (int i = 0; i < LED_STRIPS; i++)
  {
    totalLedNum += ledHardware[i].ledNum;

    switch (ledHardware[i].pin)
    {
    case D0:
      FastLED.addLeds<WS2812, D0, GRB>(ledHardware[i].strip, ledHardware[i].ledNum);
      break;
    case D1:
      FastLED.addLeds<WS2812, D1, GRB>(ledHardware[i].strip, ledHardware[i].ledNum);
      break;
    case D2:
      FastLED.addLeds<WS2812, D2, GRB>(ledHardware[i].strip, ledHardware[i].ledNum);
      break;
    case D3:
      FastLED.addLeds<WS2812, D3, GRB>(ledHardware[i].strip, ledHardware[i].ledNum);
      break;
    case D4:
      FastLED.addLeds<WS2812, D4, GRB>(ledHardware[i].strip, ledHardware[i].ledNum);
      break;
    case D5:
      FastLED.addLeds<WS2812, D5, GRB>(ledHardware[i].strip, ledHardware[i].ledNum);
      break;
    case D6:
      FastLED.addLeds<WS2812, D6, GRB>(ledHardware[i].strip, ledHardware[i].ledNum);
      break;
    case D7:
      FastLED.addLeds<WS2812, D7, GRB>(ledHardware[i].strip, ledHardware[i].ledNum);
      break;
    case D8:
      FastLED.addLeds<WS2812, D8, GRB>(ledHardware[i].strip, ledHardware[i].ledNum);
      break;

    default:
      break;
    }
  }
}

void setupRouting()
{
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(SPIFFS, webserverDirPath + "/index.html", "text/html"); });

  Dir webserverFiles = SPIFFS.openDir(webserverDirPath);
  while (webserverFiles.next())
  {
    String filename = webserverFiles.fileName();
    String url = filename.substring(3);
    String ext = filename.substring(filename.lastIndexOf('.') + 1);
    String contentType;

    if (ext == "html")
      contentType = "text/html";
    else if (ext == "js")
      contentType = "text/javascript";
    else if (ext == "txt")
      contentType = "text/plain";
    else if (ext == "css")
      contentType = "text/css";
    else if (ext == "ico")
      contentType = "image/x-icon";
    else
      contentType = "text/plain";

    server.on(url.c_str(), [filename, contentType](AsyncWebServerRequest *request)
              { request->send(SPIFFS, filename, contentType); });
  }

  server.on(
      "/api/setSmartSave", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, APIsetSmartSave);
  server.on("/api/getOptions", HTTP_GET, APIgetOptions);
  server.on(
      "/api/setOptions", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, APIsetOptions);
  server.on("/api/getSaves", HTTP_GET, APIgetSaves);
  server.on("/api/getSave", HTTP_GET, APIgetSave);
  server.on("/api/getSetSave", HTTP_GET, APIgetSetSave);
  server.on(
      "/api/createSave", HTTP_POST, [](AsyncWebServerRequest *request) {}, NULL, APIcreateSave);
  server.on("/api/renameSave", HTTP_PATCH, APIrenameSave);
  server.on("/api/deleteSave", HTTP_DELETE, APIdeleteSave);

  server.on("/ledServerSearch", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(200, "text/plain", "leds ready"); });

  server.onNotFound(handleNotFound);
}

#define SERIAL false

void setup()
{
  if (SERIAL)
  {
    Serial.begin(115200);
    delay(500);
  }

  pinMode(SWITCH_PIN, OUTPUT);
  setDevice(true);

  setupLeds();
  // FastLED.clear(true);

  SPIFFS.begin();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
  }
  if (SERIAL)
    Serial.println(WiFi.localIP());

  loadSmartSave();

  packetCollector = new PacketCollector();

  setupRouting();
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");
  server.begin();
}

unsigned long currentTime = 0;
unsigned long prevTime = 0;

unsigned long deltaAdder = 0;

void loop()
{
  if (device & enabled)
  {
    currentTime = millis();
    unsigned long deltaTime = currentTime - prevTime;

    ttime += deltaTime;

    deltaAdder += deltaTime;
    if (deltaAdder >= updateInterval)
    {
      setColours();
      deltaAdder = 0;
    }

    prevTime = currentTime;
  }
}
