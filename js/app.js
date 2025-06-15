/**
 * PiFlash - Raspberry Pi Image Flasher
 * Main application logic and UI interactions
 */

class PiFlashApp {
  constructor() {
    this.selectedDevice = null;
    this.selectedOS = null;
    this.flashingProgress = null;
    this.flashingInterval = null;
    this.currentTab = 'recommended';
    
    // Mock data for demonstration
    this.mockDevices = [
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

    this.osImages = {
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

    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    console.log('Initializing PiFlash application...');
    this.setupEventListeners();
    this.loadDevices();
    this.loadOSImages();
    this.updateFlashButton();
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Device refresh button
    document.getElementById('refreshDevices').addEventListener('click', () => {
      this.refreshDevices();
    });

    // OS image tabs
    document.getElementById('tabRecommended').addEventListener('click', () => {
      this.switchTab('recommended');
    });
    document.getElementById('tabAll').addEventListener('click', () => {
      this.switchTab('all');
    });
    document.getElementById('tabOther').addEventListener('click', () => {
      this.switchTab('other');
    });

    // Search functionality
    document.getElementById('searchOS').addEventListener('input', (e) => {
      this.filterOSImages(e.target.value);
    });

    // Custom image upload
    document.getElementById('customImageUpload').addEventListener('click', () => {
      document.getElementById('customImageFile').click();
    });

    document.getElementById('customImageFile').addEventListener('change', (e) => {
      this.handleCustomImageUpload(e.target.files[0]);
    });

    // Flash button
    document.getElementById('flashButton').addEventListener('click', () => {
      this.startFlashing();
    });

    // Cancel flash button
    document.getElementById('cancelFlash').addEventListener('click', () => {
      this.cancelFlashing();
    });

    // Flash another button
    document.getElementById('flashAnother').addEventListener('click', () => {
      this.resetApplication();
    });

    // Form validation
    this.setupFormValidation();
  }

  /**
   * Set up form validation
   */
  setupFormValidation() {
    const inputs = ['wifiSSID', 'wifiPassword', 'hostname'];
    inputs.forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('input', () => {
        this.validateInput(input);
      });
    });
  }

  /**
   * Validate input fields
   */
  validateInput(input) {
    const value = input.value.trim();
    
    if (input.id === 'hostname') {
      // Validate hostname format
      const hostnameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*$/;
      if (value && !hostnameRegex.test(value)) {
        input.classList.add('border-red-500');
        this.showTooltip(input, 'Invalid hostname format');
      } else {
        input.classList.remove('border-red-500');
        this.hideTooltip(input);
      }
    }

    if (input.id === 'wifiSSID') {
      // Basic SSID validation
      if (value && value.length > 32) {
        input.classList.add('border-red-500');
        this.showTooltip(input, 'SSID too long (max 32 characters)');
      } else {
        input.classList.remove('border-red-500');
        this.hideTooltip(input);
      }
    }
  }

  /**
   * Show tooltip for validation errors
   */
  showTooltip(element, message) {
    // Remove existing tooltip
    this.hideTooltip(element);
    
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute z-10 px-2 py-1 text-xs text-white bg-red-600 rounded shadow-lg tooltip';
    tooltip.textContent = message;
    tooltip.style.top = '-30px';
    tooltip.style.left = '0';
    
    element.parentElement.style.position = 'relative';
    element.parentElement.appendChild(tooltip);
  }

  /**
   * Hide tooltip
   */
  hideTooltip(element) {
    const tooltip = element.parentElement.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  /**
   * Load and display available devices
   */
  loadDevices() {
    console.log('Loading devices...');
    const deviceList = document.getElementById('deviceList');
    
    // Show loading state
    deviceList.innerHTML = '<div class="skeleton h-16 rounded-lg"></div>';
    
    // Simulate loading delay
    setTimeout(() => {
      deviceList.innerHTML = '';
      
      if (this.mockDevices.length === 0) {
        deviceList.innerHTML = `
          <div class="text-center py-8 text-gray-500">
            <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
            <p class="text-sm">No storage devices found</p>
            <p class="text-xs mt-1">Insert an SD card or USB drive</p>
          </div>
        `;
        return;
      }

      this.mockDevices.forEach(device => {
        const deviceElement = this.createDeviceElement(device);
        deviceList.appendChild(deviceElement);
      });
    }, 1000);
  }

  /**
   * Create device element
   */
  createDeviceElement(device) {
    const deviceDiv = document.createElement('div');
    deviceDiv.className = 'device-card p-3 border border-gray-200 rounded-lg cursor-pointer';
    deviceDiv.setAttribute('data-device-id', device.id);
    
    const icon = device.type === 'sd' ? 'fas fa-sd-card' : 'fas fa-usb';
    const iconColor = device.type === 'sd' ? 'text-blue-500' : 'text-green-500';
    
    deviceDiv.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <i class="${icon} ${iconColor} mr-3"></i>
          <div>
            <h3 class="font-medium text-gray-800">${device.name}</h3>
            <p class="text-sm text-gray-600">${device.path} • ${device.size}</p>
          </div>
        </div>
        <div class="flex items-center">
          <i class="fas fa-check text-green-500 hidden device-selected-icon"></i>
        </div>
      </div>
    `;

    deviceDiv.addEventListener('click', () => {
      this.selectDevice(device);
    });

    return deviceDiv;
  }

  /**
   * Select a device
   */
  selectDevice(device) {
    console.log('Selecting device:', device.name);
    
    // Remove previous selection
    document.querySelectorAll('.device-card').forEach(card => {
      card.classList.remove('selected');
      card.querySelector('.device-selected-icon').classList.add('hidden');
    });

    // Add selection to current device
    const deviceElement = document.querySelector(`[data-device-id="${device.id}"]`);
    deviceElement.classList.add('selected');
    deviceElement.querySelector('.device-selected-icon').classList.remove('hidden');

    this.selectedDevice = device;
    this.updateFlashSummary();
    this.updateFlashButton();
  }

  /**
   * Refresh devices list
   */
  refreshDevices() {
    console.log('Refreshing devices...');
    const refreshButton = document.getElementById('refreshDevices');
    const icon = refreshButton.querySelector('i');
    
    icon.classList.add('rotate-animation');
    
    setTimeout(() => {
      this.loadDevices();
      icon.classList.remove('rotate-animation');
    }, 1000);
  }

  /**
   * Switch between OS image tabs
   */
  switchTab(tab) {
    console.log('Switching to tab:', tab);
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
    });
    document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');

    this.currentTab = tab;
    this.loadOSImages();
  }

  /**
   * Load and display OS images
   */
  loadOSImages() {
    console.log('Loading OS images for tab:', this.currentTab);
    const osImageList = document.getElementById('osImageList');
    
    // Show loading state
    osImageList.innerHTML = '<div class="skeleton h-20 rounded-lg mb-3"></div>'.repeat(3);
    
    setTimeout(() => {
      osImageList.innerHTML = '';
      const images = this.osImages[this.currentTab] || [];
      
      if (images.length === 0) {
        osImageList.innerHTML = `
          <div class="text-center py-8 text-gray-500">
            <i class="fas fa-image text-2xl mb-2"></i>
            <p class="text-sm">No images available</p>
          </div>
        `;
        return;
      }

      images.forEach(osImage => {
        const imageElement = this.createOSImageElement(osImage);
        osImageList.appendChild(imageElement);
      });
    }, 500);
  }

  /**
   * Create OS image element
   */
  createOSImageElement(osImage) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'os-image-card p-3 border border-gray-200 rounded-lg cursor-pointer fade-in';
    imageDiv.setAttribute('data-os-id', osImage.id);
    
    imageDiv.innerHTML = `
      <div class="flex items-start">
        <img src="${osImage.image}" alt="${osImage.name}" class="w-10 h-10 rounded mr-3 flex-shrink-0" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJNMTIgMTVoMTZ2MkgxMnYtMnptMCA0aDE2djJIMTJ2LTJ6bTAgNGgxMnYySDE2di0yeiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=='">
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-gray-800 truncate">${osImage.name}</h3>
          <p class="text-sm text-gray-600 mb-1">${osImage.description}</p>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>${osImage.version}</span>
            <span>${osImage.size}</span>
          </div>
        </div>
        <div class="ml-2 flex items-center">
          <i class="fas fa-check text-green-500 hidden os-selected-icon"></i>
        </div>
      </div>
    `;

    imageDiv.addEventListener('click', () => {
      this.selectOSImage(osImage);
    });

    return imageDiv;
  }

  /**
   * Select an OS image
   */
  selectOSImage(osImage) {
    console.log('Selecting OS image:', osImage.name);
    
    // Remove previous selection
    document.querySelectorAll('.os-image-card').forEach(card => {
      card.classList.remove('selected');
      const icon = card.querySelector('.os-selected-icon');
      if (icon) icon.classList.add('hidden');
    });

    // Add selection to current image
    const imageElement = document.querySelector(`[data-os-id="${osImage.id}"]`);
    if (imageElement) {
      imageElement.classList.add('selected');
      const icon = imageElement.querySelector('.os-selected-icon');
      if (icon) icon.classList.remove('hidden');
    }

    this.selectedOS = osImage;
    this.updateFlashSummary();
    this.updateFlashButton();
  }

  /**
   * Filter OS images based on search
   */
  filterOSImages(searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    const images = this.osImages[this.currentTab] || [];
    const filteredImages = images.filter(image => 
      image.name.toLowerCase().includes(searchLower) ||
      image.description.toLowerCase().includes(searchLower)
    );

    const osImageList = document.getElementById('osImageList');
    osImageList.innerHTML = '';

    if (filteredImages.length === 0) {
      osImageList.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <i class="fas fa-search text-2xl mb-2"></i>
          <p class="text-sm">No images found for "${searchTerm}"</p>
        </div>
      `;
      return;
    }

    filteredImages.forEach(osImage => {
      const imageElement = this.createOSImageElement(osImage);
      osImageList.appendChild(imageElement);
    });
  }

  /**
   * Handle custom image upload
   */
  handleCustomImageUpload(file) {
    if (!file) return;

    console.log('Handling custom image upload:', file.name);
    
    const customOS = {
      id: 'custom-' + Date.now(),
      name: file.name,
      description: 'Custom image file',
      version: 'Custom',
      size: this.formatFileSize(file.size),
      sizeBytes: file.size,
      category: 'custom',
      file: file,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzEwQjk4MSIvPgo8cGF0aCBkPSJNMTYgMTJsOCA4LTggOHYtNEgxMnYtOGg0di00eiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=='
    };

    this.selectOSImage(customOS);
    
    // Update the upload area to show selected file
    const uploadArea = document.getElementById('customImageUpload');
    uploadArea.innerHTML = `
      <div class="flex items-center justify-center">
        <i class="fas fa-file-check text-2xl text-green-600 mr-2"></i>
        <div class="text-left">
          <h3 class="font-medium text-gray-700">${file.name}</h3>
          <p class="text-sm text-gray-500">${this.formatFileSize(file.size)}</p>
        </div>
      </div>
    `;
    uploadArea.classList.add('border-green-400', 'bg-green-50');
  }

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)}${units[unitIndex]}`;
  }

  /**
   * Update flash summary
   */
  updateFlashSummary() {
    const summaryDiv = document.getElementById('flashSummary');
    
    if (!this.selectedDevice && !this.selectedOS) {
      summaryDiv.innerHTML = `
        <div class="flex items-center mb-2">
          <i class="fas fa-info-circle text-gray-500 mr-2"></i>
          <h3 class="font-medium text-gray-700">Select Image and Device</h3>
        </div>
        <p class="text-sm text-gray-600">
          Choose an OS image and storage device to get started.
        </p>
      `;
      return;
    }

    if (this.selectedOS && !this.selectedDevice) {
      summaryDiv.innerHTML = `
        <div class="flex items-center mb-2">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          <h3 class="font-medium text-gray-700">Select Storage Device</h3>
        </div>
        <p class="text-sm text-gray-600">
          <strong>Image:</strong> ${this.selectedOS.name}<br>
          Choose a storage device to continue.
        </p>
      `;
      return;
    }

    if (!this.selectedOS && this.selectedDevice) {
      summaryDiv.innerHTML = `
        <div class="flex items-center mb-2">
          <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
          <h3 class="font-medium text-gray-700">Select OS Image</h3>
        </div>
        <p class="text-sm text-gray-600">
          <strong>Device:</strong> ${this.selectedDevice.name}<br>
          Choose an OS image to continue.
        </p>
      `;
      return;
    }

    // Both selected
    const isDeviceCompatible = this.selectedDevice.sizeBytes >= this.selectedOS.sizeBytes;
    const statusIcon = isDeviceCompatible ? 'fas fa-check-circle text-green-500' : 'fas fa-exclamation-triangle text-red-500';
    const statusText = isDeviceCompatible ? 'Ready to Flash' : 'Size Mismatch';
    
    summaryDiv.innerHTML = `
      <div class="flex items-center mb-2">
        <i class="${statusIcon} mr-2"></i>
        <h3 class="font-medium text-gray-700">${statusText}</h3>
      </div>
      <div class="text-sm text-gray-600 space-y-1">
        <p><strong>Image:</strong> ${this.selectedOS.name} (${this.selectedOS.size})</p>
        <p><strong>Device:</strong> ${this.selectedDevice.name} (${this.selectedDevice.size})</p>
        ${!isDeviceCompatible ? '<p class="text-red-600 mt-2"><strong>Warning:</strong> Device is too small for this image.</p>' : ''}
      </div>
    `;
  }

  /**
   * Update flash button state
   */
  updateFlashButton() {
    const flashButton = document.getElementById('flashButton');
    const canFlash = this.selectedDevice && this.selectedOS && 
                     this.selectedDevice.sizeBytes >= this.selectedOS.sizeBytes;

    if (canFlash) {
      flashButton.disabled = false;
      flashButton.className = 'w-full mt-6 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center justify-center';
      flashButton.innerHTML = '<i class="fas fa-bolt mr-2"></i> Flash!';
    } else {
      flashButton.disabled = true;
      flashButton.className = 'w-full mt-6 py-3 px-4 bg-gray-400 text-white font-semibold rounded-lg shadow-md transition duration-300 flex items-center justify-center cursor-not-allowed';
      
      if (!this.selectedDevice && !this.selectedOS) {
        flashButton.innerHTML = '<i class="fas fa-bolt mr-2"></i> Select Image and Device';
      } else if (!this.selectedDevice) {
        flashButton.innerHTML = '<i class="fas fa-bolt mr-2"></i> Select Storage Device';
      } else if (!this.selectedOS) {
        flashButton.innerHTML = '<i class="fas fa-bolt mr-2"></i> Select OS Image';
      } else {
        flashButton.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i> Device Too Small';
      }
    }
  }

  /**
   * Start the flashing process
   */
  startFlashing() {
    if (!this.selectedDevice || !this.selectedOS) return;

    console.log('Starting flash process...');
    
    // Show confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to flash "${this.selectedOS.name}" to "${this.selectedDevice.name}"?\n\n` +
      `This will PERMANENTLY erase all data on the device!\n\n` +
      `Device: ${this.selectedDevice.path} (${this.selectedDevice.size})\n` +
      `Image: ${this.selectedOS.name} (${this.selectedOS.size})`
    );

    if (!confirmed) return;

    // Hide flash summary and show progress
    document.getElementById('flashSummary').parentElement.classList.add('hidden');
    document.getElementById('progressSection').classList.remove('hidden');
    document.getElementById('progressSection').classList.add('slide-up');

    // Initialize progress
    this.flashingProgress = {
      stage: 'preparing',
      percent: 0,
      speed: 0,
      eta: 0,
      startTime: Date.now()
    };

    this.updateProgress();
    this.simulateFlashingProcess();
  }

  /**
   * Simulate the flashing process
   */
  simulateFlashingProcess() {
    const stages = [
      { name: 'preparing', duration: 2000, message: 'Preparing device...' },
      { name: 'unmounting', duration: 1000, message: 'Unmounting device...' },
      { name: 'writing', duration: 15000, message: 'Writing image...' },
      { name: 'verifying', duration: 8000, message: 'Verifying write...' },
      { name: 'ejecting', duration: 1000, message: 'Ejecting device...' }
    ];

    let currentStageIndex = 0;
    let stageStartTime = Date.now();
    let totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
    let elapsedTotal = 0;

    this.flashingInterval = setInterval(() => {
      const now = Date.now();
      const currentStage = stages[currentStageIndex];
      const stageElapsed = now - stageStartTime;
      const stageProgress = Math.min(stageElapsed / currentStage.duration, 1);

      // Update progress
      const overallProgress = (elapsedTotal + (stageProgress * currentStage.duration)) / totalDuration;
      this.flashingProgress.percent = Math.round(overallProgress * 100);
      this.flashingProgress.stage = currentStage.name;
      this.flashingProgress.message = currentStage.message;

      // Calculate speed and ETA (simulation)
      if (currentStage.name === 'writing') {
        const bytesWritten = stageProgress * this.selectedOS.sizeBytes;
        const timeElapsed = stageElapsed / 1000; // seconds
        this.flashingProgress.speed = bytesWritten / timeElapsed; // bytes per second
        this.flashingProgress.eta = (this.selectedOS.sizeBytes - bytesWritten) / this.flashingProgress.speed * 1000; // ms
      }

      this.updateProgress();

      // Move to next stage
      if (stageProgress >= 1) {
        elapsedTotal += currentStage.duration;
        currentStageIndex++;
        stageStartTime = now;

        if (currentStageIndex >= stages.length) {
          clearInterval(this.flashingInterval);
          this.completeFlashing();
        }
      }
    }, 100);
  }

  /**
   * Update progress display
   */
  updateProgress() {
    const progress = this.flashingProgress;
    
    // Update progress bar
    document.getElementById('progressBar').style.width = `${progress.percent}%`;
    document.getElementById('progressPercent').textContent = `${progress.percent}%`;
    document.getElementById('progressStatus').textContent = progress.message || 'Processing...';

    // Update time remaining
    const timeRemaining = document.getElementById('timeRemaining');
    if (progress.eta && progress.eta > 0) {
      const minutes = Math.floor(progress.eta / 60000);
      const seconds = Math.floor((progress.eta % 60000) / 1000);
      timeRemaining.textContent = `${minutes}m ${seconds}s`;
    } else {
      timeRemaining.textContent = 'Calculating...';
    }

    // Update progress steps
    const stepsDiv = document.getElementById('progressSteps');
    const steps = [
      { id: 'preparing', name: 'Preparing device', icon: 'fas fa-cog' },
      { id: 'unmounting', name: 'Unmounting device', icon: 'fas fa-eject' },
      { id: 'writing', name: 'Writing image', icon: 'fas fa-pen' },
      { id: 'verifying', name: 'Verifying write', icon: 'fas fa-check-double' },
      { id: 'ejecting', name: 'Ejecting device', icon: 'fas fa-sign-out-alt' }
    ];

    stepsDiv.innerHTML = steps.map(step => {
      let statusClass = 'text-gray-400';
      let statusIcon = 'far fa-circle';
      
      if (step.id === progress.stage) {
        statusClass = 'text-blue-600';
        statusIcon = 'fas fa-spinner fa-spin';
      } else if (steps.findIndex(s => s.id === step.id) < steps.findIndex(s => s.id === progress.stage)) {
        statusClass = 'text-green-600';
        statusIcon = 'fas fa-check-circle';
      }

      return `
        <div class="flex items-center ${statusClass}">
          <i class="${statusIcon} mr-2"></i>
          <span>${step.name}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Cancel flashing process
   */
  cancelFlashing() {
    const confirmed = confirm('Are you sure you want to cancel the flashing process?\n\nThis may leave your device in an unusable state.');
    
    if (!confirmed) return;

    console.log('Cancelling flash process...');
    
    if (this.flashingInterval) {
      clearInterval(this.flashingInterval);
      this.flashingInterval = null;
    }

    // Show cancellation message
    document.getElementById('progressStatus').textContent = 'Cancelled by user';
    document.getElementById('progressBar').classList.add('bg-red-600');
    
    setTimeout(() => {
      this.resetApplication();
    }, 2000);
  }

  /**
   * Complete flashing process
   */
  completeFlashing() {
    console.log('Flash process completed successfully!');
    
    // Hide progress section and show completion
    document.getElementById('progressSection').classList.add('hidden');
    document.getElementById('completionSection').classList.remove('hidden');
    document.getElementById('completionSection').classList.add('slide-up');

    // Update completion message
    const completionMessage = document.getElementById('completionMessage');
    completionMessage.textContent = `Successfully flashed ${this.selectedOS.name} to ${this.selectedDevice.name}. Your SD card is ready to use!`;

    // Play success sound (if available)
    this.playSuccessSound();
  }

  /**
   * Play success sound
   */
  playSuccessSound() {
    try {
      // Create a simple success tone
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not play success sound:', error);
    }
  }

  /**
   * Reset application to initial state
   */
  resetApplication() {
    console.log('Resetting application...');
    
    // Reset selections
    this.selectedDevice = null;
    this.selectedOS = null;
    this.flashingProgress = null;
    
    if (this.flashingInterval) {
      clearInterval(this.flashingInterval);
      this.flashingInterval = null;
    }

    // Reset UI
    document.querySelectorAll('.device-card').forEach(card => {
      card.classList.remove('selected');
      card.querySelector('.device-selected-icon').classList.add('hidden');
    });

    document.querySelectorAll('.os-image-card').forEach(card => {
      card.classList.remove('selected');
      const icon = card.querySelector('.os-selected-icon');
      if (icon) icon.classList.add('hidden');
    });

    // Reset custom upload
    const uploadArea = document.getElementById('customImageUpload');
    uploadArea.innerHTML = `
      <i class="fas fa-file-upload text-3xl text-gray-400 mb-2"></i>
      <h3 class="font-medium text-gray-700">Use Custom Image</h3>
      <p class="text-sm text-gray-500">Upload your own .img or .zip file</p>
    `;
    uploadArea.classList.remove('border-green-400', 'bg-green-50');

    // Reset form fields
    document.getElementById('wifiSSID').value = '';
    document.getElementById('wifiPassword').value = '';
    document.getElementById('hostname').value = '';
    document.getElementById('sshOption').value = 'disabled';
    document.getElementById('customImageFile').value = '';

    // Hide sections
    document.getElementById('progressSection').classList.add('hidden');
    document.getElementById('completionSection').classList.add('hidden');
    document.getElementById('flashSummary').parentElement.classList.remove('hidden');

    // Update UI
    this.updateFlashSummary();
    this.updateFlashButton();
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing PiFlash...');
  new PiFlashApp();
});

// Unit tests for key functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PiFlashApp;
}