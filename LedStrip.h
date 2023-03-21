#ifndef LEDSTRIP_H
#define LEDSTRIP_H

#include <Arduino.h>
#include <FastLED.h>

struct LedStrip
{
  const uint8_t pin;
  uint16_t ledNum;
  CRGB *strip;

  LedStrip(uint8_t _pin, uint16_t _ledNum);

  ~LedStrip();
};

#endif