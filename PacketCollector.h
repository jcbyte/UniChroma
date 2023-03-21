#ifndef PACKETCOLLECTOR_H
#define PACKETCOLLECTOR_H

#include <Arduino.h>
#include <FS.h>

class PacketCollector
{
private:
  signed short dataAmountRecived;

  bool savedData;
  uint8_t *dataRecived;

  File file;

public:
  enum class FileMode
  {
    APPEND,
    WRITE
  };

  PacketCollector();

  bool collectPackets(uint8_t *data, size_t len, size_t index, size_t total);

  uint8_t *getData();

  uint8_t getData(int index);

  bool collectPacketsInFile(String filename, FileMode mode, uint8_t *data, size_t len, size_t index, size_t total);

  void clear();

  ~PacketCollector();
};

#endif