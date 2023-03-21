#ifndef COLPOS_H
#define COLPOS_H

#include <Arduino.h>
#include <FastLED.h>
#include <ArduinoJson.h>

#include "JsonToCRGB.h"

class ColPos
{
public:
  struct ColPosElem
  {
    int pos;
    CRGB col;

    ColPosElem();

    ColPosElem(int _pos, CRGB _col);
  };

  ColPosElem *colPos;
  int colPosLength;

  ColPos();

  ColPos(JsonArray json);

  void clear();

  ~ColPos();
};

#endif