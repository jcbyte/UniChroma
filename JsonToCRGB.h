#ifndef JSONTOCRGB_H
#define JSONTOCRGB_H

#include <Arduino.h>
#include <FastLED.h>
#include <ArduinoJson.h>

CRGB JsonToCRGB(JsonArray json);

#endif