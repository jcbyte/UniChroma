#include "JsonToCRGB.h"

CRGB JsonToCRGB(JsonArray json)
{
  return CRGB(json[0], json[1], json[2]);
}