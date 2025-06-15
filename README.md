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
│   └── app.js         # Main application logic
├── package.json        # Project configuration
├── README.md          # This file
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

The application includes unit tests for core functionality:

```bash
# Run all tests
npm test

# Test specific components
npm test -- --testNamePattern="device"
```

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
