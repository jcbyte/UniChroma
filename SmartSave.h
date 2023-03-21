#ifndef SMARTSAVE_H
#define SMARTSAVE_H

#include <Arduino.h>
#include <FastLED.h>

#include "ColPos.h"
#include "JsonToCRGB.h"

enum class SmartSaveObjectType
{
  Disabled,
  Enabled,
  Static,
  Cycle,
  Wave,
};

class SmartSave
{
public:
  struct SmartSaveObject
  {
    SmartSaveObjectType type;

    SmartSaveObject();
  };

  struct DisabledSmartSaveObject : SmartSaveObject
  {
    DisabledSmartSaveObject();
  };

  struct EnabledSmartSaveObject : SmartSaveObject
  {
    EnabledSmartSaveObject();
  };

  struct StaticSmartSaveObject : SmartSaveObject
  {
    CRGB col;

    StaticSmartSaveObject(CRGB _col);
  };

  struct CycleSmartSaveObject : SmartSaveObject
  {
    int cycleTime;
    ColPos *colPos;

    CycleSmartSaveObject(int _cycleTime, ColPos *_colPos);
  };

  struct WaveSmartSaveObject : SmartSaveObject
  {
    int cycleTime;
    ColPos *colPos;
    int spread;
    bool flip;

    WaveSmartSaveObject(int _cycleTime, ColPos *_colPos, int _spread, bool _flip);
  };

  SmartSaveObject **objects;
  int objectsLength;
  int *data;

  SmartSave();

  SmartSave(JsonObject json);

  void clear();

  ~SmartSave();
};

#endif