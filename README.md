---
license: apache-2.0
title: PiFlash
sdk: static
emoji: 📈
colorFrom: red
colorTo: green
short_description: A modern, web-based tool for flashing Raspberry Pi OS images
---

# PiFlash - Raspberry Pi Image Flasher Web Application

A modern, web-based tool for flashing Raspberry Pi OS images to SD cards. Built with vanilla JavaScript, HTML5, and Tailwind CSS for maximum compatibility and ease of use.

## Features

- **Device Detection**: Automatically detects available storage devices
- **OS Image Library**: Browse recommended and community OS images
- **Custom Image Support**: Upload and flash your own image files
- **Progress Tracking**: Real-time progress monitoring with detailed status
- **Configuration Options**: Pre-configure Wi-Fi, SSH, and hostname settings
- **Responsive Design**: Works on desktop and mobile devices
- **No Installation Required**: Runs directly in your web browser
- **🔒 Security Hardening**: Input validation, sandboxing guards, and comprehensive security measures
- **✅ Input Validation**: Centralized validation for all user inputs (device paths, hostnames, SSIDs, passwords)
- **🛡️ Sandboxing**: Prevents unauthorized access to system-critical partitions
- **🧪 Development Mode**: Toggle between mock data and live device detection via DEV_MODE flag

## Quick Start

1. **Clone or download** this repository
2. **Open index.html** in your web browser
3. **Select a storage device** (SD card or USB drive)
4. **Choose an OS image** from the library or upload your own
5. **Configure settings** (optional): Wi-Fi, SSH, hostname
6. **Click Flash** to start the process

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Supported File Formats

- `.img` - Raw disk images
- `.zip` - Compressed disk images
- `.gz` - Gzip compressed images
- `.xz` - XZ compressed images

## Security Considerations

### Enhanced Security Features

PiFlash implements multiple layers of security to protect your system:

#### 1. Input Validation
All user inputs are validated using a centralized validation utility (`js/validation.js`):
- **Device Paths**: Only safe device paths are allowed (e.g., `/dev/sdb`, `/dev/mmcblk0`)
- **Hostnames**: RFC 1123 compliant hostname validation
- **Wi-Fi SSIDs**: Length validation (max 32 characters)
- **Wi-Fi Passwords**: WPA/WPA2 length requirements (8-63 characters)
- **OS Images**: Validation of required fields and size constraints

#### 2. Sandboxing Guards
The application includes sandboxing logic to prevent dangerous operations:
- **Blocked System Partitions**: Cannot write to `/dev/sda`, `/dev/nvme0n1`, `/dev/vda`, `/dev/hda`
- **Safe Device Patterns**: Only allows writes to SD cards (`/dev/sd[b-z]`) and MMC devices (`/dev/mmcblk[0-9]+`)
- **Compatibility Checks**: Validates device size against image requirements before flashing

#### 3. Development Mode (DEV_MODE)
A feature flag system separates development and production environments:
- **DEV_MODE = true**: Uses mock data from `mock/` directory
- **DEV_MODE = false**: Connects to real device detection APIs
- Toggle via `js/app.js` constructor or environment variables

#### 4. XSS Protection
All user inputs are sanitized to prevent cross-site scripting attacks:
- HTML special characters are escaped
- User-provided content is validated before rendering

### Security Audit

A comprehensive security audit has been performed. See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) for details:
- **Dependencies**: 6 vulnerabilities found (all in dev dependencies only)
- **Risk Assessment**: Production risk is LOW (vulnerabilities in development tools only)
- **Mitigation**: Documented alternatives and monitoring strategy

⚠️ **Important**: This application requires access to storage devices, which may require elevated permissions or browser API access. Always verify the source and integrity of image files before flashing.

### Web API Requirements

This application uses the following web APIs:
- **File System Access API** (Chrome 86+) - For device access
- **Web USB API** (Experimental) - For USB device communication
- **File API** - For reading uploaded files

## Configuration Options

### Wi-Fi Setup
- **SSID**: Network name (max 32 characters)
- **Password**: Network password (WPA/WPA2)

### SSH Configuration
- **Disabled**: SSH access turned off (default)
- **Password**: Enable SSH with password authentication
- **Key**: Enable SSH with public key authentication only

### System Settings
- **Hostname**: Custom device name (default: raspberrypi)
- **Validation**: Verify write after flashing
- **Compression**: Auto-detect and handle compressed images

## Flashing Process

1. **Device Selection**: Choose target storage device
2. **Image Preparation**: Download or prepare the OS image
3. **Unmounting**: Safely unmount the device
4. **Writing**: Write the image data to the device
5. **Verification**: Verify the written data (if enabled)
6. **Ejection**: Safely eject the device when complete

## File Structure

```
piflash-web-app/
├── index.html          # Main application interface
├── styles.css          # Custom CSS styles and animations
├── js/
│   ├── app.js         # Main application logic
│   └── validation.js  # Centralized validation utilities
├── mock/              # Mock data for development
│   ├── devices.js     # Mock device data
│   ├── osImages.js    # Mock OS image data
│   └── README.md      # Mock data documentation
├── __tests__/         # Test suite
│   └── validation.test.js  # Validation utility tests
├── package.json        # Project configuration
├── README.md          # This file
├── SECURITY_AUDIT.md  # Security audit report
├── .gitignore         # Git ignore rules
└── pre-commit.sh      # Pre-commit hooks
```

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Use **ES6+** JavaScript features
- Follow **responsive design** principles
- Add **comprehensive comments** for complex logic
- Include **unit tests** for new functionality
- Maintain **cross-browser compatibility**

## Testing

The application includes comprehensive unit tests for core functionality:

```bash
# Run all tests (36 tests for validation utilities)
npm test

# Test specific components
npm test -- --testNamePattern="device"

# Test validation utilities
npm test -- __tests__/validation.test.js
```

### Test Coverage

- ✅ Device path validation (7 tests)
- ✅ OS image validation (5 tests)
- ✅ Hostname validation (6 tests)
- ✅ SSID validation (4 tests)
- ✅ WiFi password validation (4 tests)
- ✅ Write permission checks (3 tests)
- ✅ Device compatibility validation (3 tests)
- ✅ XSS protection (4 tests)

**Total: 36 passing tests**

## Troubleshooting

### Common Issues

**Device not detected**
- Ensure the SD card is properly inserted
- Try refreshing the device list
- Check browser permissions for device access

**Flash process fails**
- Verify the image file is not corrupted
- Ensure sufficient space on the target device
- Try using a different SD card

**Browser compatibility**
- Use a modern browser with File System Access API support
- Enable experimental web platform features if required
- Clear browser cache and cookies

### Browser Permissions

Some browsers may require explicit permission to access storage devices:
1. Navigate to browser settings
2. Find "Site permissions" or "Privacy and security"
3. Allow file system access for this application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Raspberry Pi Foundation** for the excellent hardware and documentation
- **Tailwind CSS** for the utility-first CSS framework
- **Font Awesome** for the comprehensive icon library
- **Community contributors** who help improve this tool

## Disclaimer

This tool is provided as-is without warranty. Always backup important data before flashing storage devices. The authors are not responsible for data loss or hardware damage.

---

**Happy Flashing!** 🥧✨