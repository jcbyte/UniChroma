#include "LedStrip.h"

LedStrip::LedStrip(uint8_t _pin, uint16_t _ledNum) : pin(_pin)
{
  ledNum = _ledNum;
  strip = new CRGB[ledNum];
}

LedStrip::~LedStrip()
{
  delete[] strip;
  ledNum = 0;
}