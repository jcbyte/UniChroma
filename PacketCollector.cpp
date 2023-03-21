#include "PacketCollector.h"

PacketCollector::PacketCollector()
{
  dataAmountRecived = -1;

  savedData = false;
  dataRecived = nullptr;
}

bool PacketCollector::collectPackets(uint8_t *data, size_t len, size_t index, size_t total)
{
  if (dataAmountRecived < 0)
  {
    if (savedData)
      delete[] dataRecived;

    dataRecived = new uint8_t[total];
    savedData = true;
    dataAmountRecived = 0;
  }

  memcpy(dataRecived + index, data, len);
  dataAmountRecived += len;

  if (dataAmountRecived >= total)
  {
    dataAmountRecived = -1;
    return true;
  }
  return false;
}

uint8_t *PacketCollector::getData()
{
  return dataRecived;
}

uint8_t PacketCollector::getData(int index)
{
  return dataRecived[index];
}

bool PacketCollector::collectPacketsInFile(String filename, FileMode mode, uint8_t *data, size_t len, size_t index, size_t total)
{
  if (dataAmountRecived < 0)
  {
    if (mode == FileMode::WRITE)
      if (SPIFFS.exists(filename))
        SPIFFS.remove(filename);

    file = SPIFFS.open(filename, "a");
    dataAmountRecived = 0;
  }

  for (int i = 0; i < len; i++)
    file.write(data[i]);
  dataAmountRecived += len;

  if (dataAmountRecived >= total)
  {
    file.close();
    dataAmountRecived = -1;

    return true;
  }
  return false;
}

void PacketCollector::clear()
{
  delete[] dataRecived;
  savedData = false;
  dataAmountRecived = -1;
}

PacketCollector::~PacketCollector()
{
  clear();
}