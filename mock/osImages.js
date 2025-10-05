/**
 * Mock OS image data for development and testing
 */

const mockOSImages = {
  recommended: [
    {
      id: 'rpi-os-64',
      name: 'Raspberry Pi OS (64-bit)',
      description: 'Recommended for most users',
      version: 'v2023-05-03',
      size: '1.2GB',
      sizeBytes: 1200000000,
      category: 'official',
      image: 'https://www.raspberrypi.com/app/uploads/2022/02/COLOUR-Raspberry-Pi-Symbol-Registered.png'
    },
    {
      id: 'rpi-os-lite-32',
      name: 'Raspberry Pi OS Lite (32-bit)',
      description: 'Minimal image for headless setups',
      version: 'v2023-05-03',
      size: '450MB',
      sizeBytes: 450000000,
      category: 'official',
      image: 'https://www.raspberrypi.com/app/uploads/2022/02/COLOUR-Raspberry-Pi-Symbol-Registered.png'
    },
    {
      id: 'ubuntu-server',
      name: 'Ubuntu Server 22.04 LTS',
      description: 'Official Ubuntu for Raspberry Pi',
      version: 'v22.04.2',
      size: '1.8GB',
      sizeBytes: 1800000000,
      category: 'ubuntu',
      image: 'https://assets.ubuntu.com/v1/29985a98-ubuntu-logo32.png'
    }
  ],
  all: [
    {
      id: 'rpi-os-64',
      name: 'Raspberry Pi OS (64-bit)',
      description: 'Recommended for most users',
      version: 'v2023-05-03',
      size: '1.2GB',
      sizeBytes: 1200000000,
      category: 'official',
      image: 'https://www.raspberrypi.com/app/uploads/2022/02/COLOUR-Raspberry-Pi-Symbol-Registered.png'
    },
    {
      id: 'rpi-os-lite-32',
      name: 'Raspberry Pi OS Lite (32-bit)',
      description: 'Minimal image for headless setups',
      version: 'v2023-05-03',
      size: '450MB',
      sizeBytes: 450000000,
      category: 'official',
      image: 'https://www.raspberrypi.com/app/uploads/2022/02/COLOUR-Raspberry-Pi-Symbol-Registered.png'
    },
    {
      id: 'ubuntu-server',
      name: 'Ubuntu Server 22.04 LTS',
      description: 'Official Ubuntu for Raspberry Pi',
      version: 'v22.04.2',
      size: '1.8GB',
      sizeBytes: 1800000000,
      category: 'ubuntu',
      image: 'https://assets.ubuntu.com/v1/29985a98-ubuntu-logo32.png'
    },
    {
      id: 'retropie',
      name: 'RetroPie 4.8',
      description: 'Turn your Pi into a retro gaming machine',
      version: 'v4.8',
      size: '2.5GB',
      sizeBytes: 2500000000,
      category: 'gaming',
      image: 'https://retropie.org.uk/wp-content/uploads/2017/07/cropped-RetroPieLogo-32x32.png'
    },
    {
      id: 'libreelec',
      name: 'LibreELEC 11.0',
      description: 'Kodi media center OS',
      version: 'v11.0.3',
      size: '350MB',
      sizeBytes: 350000000,
      category: 'media',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwN0ZGRiIvPgo8cGF0aCBkPSJNMTAgMTBoMjB2MjBIMTBWMTB6IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
    },
    {
      id: 'kali-linux',
      name: 'Kali Linux 2023.2',
      description: 'Security testing and penetration testing',
      version: 'v2023.2',
      size: '3.1GB',
      sizeBytes: 3100000000,
      category: 'security',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNMTAgMTBoMjB2MjBIMTBWMTB6IiBmaWxsPSIjRkYwMDAwIi8+Cjwvc3ZnPgo='
    }
  ],
  other: []
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = mockOSImages;
}
