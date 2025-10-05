# Mock Data

This directory contains mock data used for development and testing of the PiFlash application.

## Files

- `devices.js` - Mock device data (SD cards, USB drives)
- `osImages.js` - Mock OS image data (Raspberry Pi OS, Ubuntu, etc.)

## Usage

The mock data is automatically loaded when the application is in development mode (`DEV_MODE = true`).

### Enabling Development Mode

Development mode can be toggled using the `DEV_MODE` flag in `js/app.js`:

```javascript
// In the PiFlashApp constructor
this.DEV_MODE = true; // Set to true for development, false for production
```

Alternatively, you can set it via environment variable:

```javascript
this.DEV_MODE = typeof process !== 'undefined' && process.env && process.env.DEV_MODE === 'true';
```

### Adding New Mock Data

To add new mock devices:

```javascript
// In mock/devices.js
{
  id: 'sde',
  name: 'New Device 128GB',
  path: '/dev/sde',
  size: '128GB',
  sizeBytes: 128000000000,
  type: 'sd'
}
```

To add new mock OS images:

```javascript
// In mock/osImages.js
{
  id: 'new-os',
  name: 'New OS 2024',
  description: 'A new operating system',
  version: 'v1.0',
  size: '2.5GB',
  sizeBytes: 2500000000,
  category: 'custom',
  image: 'https://example.com/logo.png'
}
```

## Security Note

Mock data is only used when `DEV_MODE` is enabled. In production, the application should connect to real device detection APIs and OS image repositories. Never include mock data in production builds.

## Testing

The mock data structure is validated by the centralized validation utilities in `js/validation.js`. Any mock data that doesn't pass validation will be rejected by the application.
