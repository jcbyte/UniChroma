#include "ColPos.h"

ColPos::ColPosElem::ColPosElem()
{
  pos = 0;
  col = CRGB(0, 0, 0);
}

ColPos::ColPosElem::ColPosElem(int _pos, CRGB _col)
{
  pos = _pos;
  col = _col;
}

ColPos::ColPos()
{
  colPos = nullptr;
  colPosLength = 0;
}

ColPos::ColPos(JsonArray json)
{
  colPosLength = json.size();
  colPos = new ColPosElem[colPosLength];

  for (int i = 0; i < colPosLength; i++)
  {
    colPos[i] = ColPosElem(json[i]["pos"], JsonToCRGB(json[i]["col"]));
  }
}

void ColPos::clear() // To free memory
{
  delete[] colPos;
  colPosLength = 0;
}

ColPos::~ColPos()
{
  clear();
}
