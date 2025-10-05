/**
 * Mock device data for development and testing
 */

const mockDevices = [
  {
    id: 'sdb',
    name: 'SanDisk Ultra 32GB',
    path: '/dev/sdb',
    size: '29.8GB',
    sizeBytes: 32000000000,
    type: 'sd'
  },
  {
    id: 'sdc',
    name: 'Samsung EVO 64GB',
    path: '/dev/sdc',
    size: '59.5GB',
    sizeBytes: 64000000000,
    type: 'sd'
  },
  {
    id: 'sdd',
    name: 'Kingston Canvas 16GB',
    path: '/dev/sdd',
    size: '14.9GB',
    sizeBytes: 16000000000,
    type: 'usb'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = mockDevices;
}
