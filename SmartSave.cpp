#include "SmartSave.h"

SmartSave::SmartSaveObject::SmartSaveObject()
{
  type = SmartSaveObjectType::Disabled;
}

SmartSave::DisabledSmartSaveObject::DisabledSmartSaveObject()
{
  type = SmartSaveObjectType::Disabled;
}

SmartSave::EnabledSmartSaveObject::EnabledSmartSaveObject()
{
  type = SmartSaveObjectType::Enabled;
}

SmartSave::StaticSmartSaveObject::StaticSmartSaveObject(CRGB _col)
{
  type = SmartSaveObjectType::Static;
  col = _col;
}

SmartSave::CycleSmartSaveObject::CycleSmartSaveObject(int _cycleTime, ColPos *_colPos)
{
  type = SmartSaveObjectType::Cycle;
  cycleTime = _cycleTime;
  colPos = _colPos;
}

SmartSave::WaveSmartSaveObject::WaveSmartSaveObject(int _cycleTime, ColPos *_colPos, int _spread, bool _flip)
{
  type = SmartSaveObjectType::Wave;
  cycleTime = _cycleTime;
  colPos = _colPos;
  spread = _spread;
  flip = _flip;
}

SmartSave::SmartSave()
{
  objects = nullptr;
  objectsLength = 0;
  data = nullptr;
}

SmartSave::SmartSave(JsonObject json)
{
  JsonArray jsonObjects = json["objects"].as<JsonArray>();
  objectsLength = jsonObjects.size();
  objects = new SmartSaveObject *[objectsLength];

  for (int i = 0; i < objectsLength; i++)
  {
    JsonObject jsonObject = jsonObjects[i].as<JsonObject>();
    String objectType = jsonObject["type"].as<String>();

    if (objectType == "disabled")
    {
      objects[i] = new DisabledSmartSaveObject();
    }
    else if (objectType == "enabled")
    {
      objects[i] = new EnabledSmartSaveObject();
    }
    else if (objectType == "static")
    {
      objects[i] = new StaticSmartSaveObject(JsonToCRGB(jsonObject["col"]));
    }
    else if (objectType == "cycle")
    {
      ColPos *colPos = new ColPos(jsonObject["colPos"].as<JsonArray>());
      objects[i] = new CycleSmartSaveObject(jsonObject["cycleTime"].as<int>(), colPos);
    }
    else if (objectType == "wave")
    {
      ColPos *colPos = new ColPos(jsonObject["colPos"].as<JsonArray>());
      objects[i] = new WaveSmartSaveObject(jsonObject["cycleTime"].as<int>(), colPos, jsonObject["spread"].as<int>(), jsonObject["flip"].as<bool>());
    }
  }

  JsonArray jsonData = json["data"].as<JsonArray>();
  int dataLength = jsonData.size();
  data = new int[dataLength];
  for (int i = 0; i < dataLength; i++)
  {
    data[i] = jsonData[i].as<int>();
  }
}

void SmartSave::clear() // To free memory
{
  for (int i = 0; i < objectsLength; i++)
  {
    SmartSaveObject *object = objects[i];
    SmartSaveObjectType objectType = object->type;

    if (objectType == SmartSaveObjectType::Cycle)
    {
      delete ((CycleSmartSaveObject *)object)->colPos;
    }
    else if (objectType == SmartSaveObjectType::Wave)
    {
      delete ((WaveSmartSaveObject *)object)->colPos;
    }

    delete object;
  }

  delete[] objects;

  objectsLength = 0;

  delete[] data;
}

SmartSave::~SmartSave()
{
  clear();
}
