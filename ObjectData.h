#ifndef OBJECTDATA_H
#define OBJECTDATA_H

#include <Arduino.h>
#include <FastLED.h>

#include "SmartSave.h"
#include "ColPos.h"

class ObjectData
{
public:
  struct DiyData
  {
    SmartSaveObjectType type;

    DiyData();
  };

  struct WaveDiyData : DiyData
  {
    int cycleTime;
    ColPos *colPos;
    int spread;
    int flip;

    WaveDiyData(int _cycleTime, ColPos *_colPos, int _spread, int _flip);
  };

  CRGB col;
  bool diy;
  DiyData *diyData;

  ObjectData();

  ObjectData(CRGB _col);

  ObjectData(DiyData *_diyData);

  ~ObjectData();
};

#endif