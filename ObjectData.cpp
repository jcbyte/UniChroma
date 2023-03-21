#include "ObjectData.h"

ObjectData::DiyData::DiyData()
{
  type = SmartSaveObjectType::Disabled;
}

ObjectData::WaveDiyData::WaveDiyData(int _cycleTime, ColPos *_colPos, int _spread, int _flip)
{
  type = SmartSaveObjectType::Wave;
  cycleTime = _cycleTime;
  colPos = _colPos;
  spread = _spread;
  flip = _flip;
}

ObjectData::ObjectData()
{
  col = CRGB(128, 0, 128);
  diy = false;
  diyData = nullptr;
}

ObjectData::ObjectData(CRGB _col)
{
  col = _col;
  diy = false;
  diyData = nullptr;
}

ObjectData::ObjectData(DiyData *_diyData)
{
  col = CRGB(128, 0, 128);
  diy = true;
  diyData = _diyData;
}

ObjectData::~ObjectData()
{
}