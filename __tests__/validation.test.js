/**
 * Tests for ValidationUtils
 */

const ValidationUtils = require('../js/validation.js');

describe('ValidationUtils', () => {
  describe('validateDevicePath', () => {
    test('should accept valid SD card paths', () => {
      const result = ValidationUtils.validateDevicePath('/dev/sdb');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should accept valid MMC paths', () => {
      const result = ValidationUtils.validateDevicePath('/dev/mmcblk0');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject paths not starting with /dev/', () => {
      const result = ValidationUtils.validateDevicePath('sdb');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must start with /dev/');
    });

    test('should reject system partition /dev/sda', () => {
      const result = ValidationUtils.validateDevicePath('/dev/sda');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('system partition');
    });

    test('should reject partition paths', () => {
      const result = ValidationUtils.validateDevicePath('/dev/sdb1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid device path format');
    });

    test('should reject null or empty paths', () => {
      expect(ValidationUtils.validateDevicePath(null).valid).toBe(false);
      expect(ValidationUtils.validateDevicePath('').valid).toBe(false);
    });

    test('should reject non-string paths', () => {
      expect(ValidationUtils.validateDevicePath(123).valid).toBe(false);
      expect(ValidationUtils.validateDevicePath({}).valid).toBe(false);
    });
  });

  describe('validateOSImage', () => {
    test('should accept valid OS image', () => {
      const osImage = {
        id: 'test-os',
        name: 'Test OS',
        size: '1GB',
        sizeBytes: 1000000000,
        category: 'official'
      };
      const result = ValidationUtils.validateOSImage(osImage);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject OS image missing required fields', () => {
      const osImage = {
        id: 'test-os',
        name: 'Test OS'
      };
      const result = ValidationUtils.validateOSImage(osImage);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Missing required field');
    });

    test('should reject OS image with invalid size', () => {
      const osImage = {
        id: 'test-os',
        name: 'Test OS',
        size: '0GB',
        sizeBytes: 0
      };
      const result = ValidationUtils.validateOSImage(osImage);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid image size');
    });

    test('should reject OS image with invalid category', () => {
      const osImage = {
        id: 'test-os',
        name: 'Test OS',
        size: '1GB',
        sizeBytes: 1000000000,
        category: 'invalid-category'
      };
      const result = ValidationUtils.validateOSImage(osImage);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid OS category');
    });

    test('should accept OS image without category', () => {
      const osImage = {
        id: 'test-os',
        name: 'Test OS',
        size: '1GB',
        sizeBytes: 1000000000
      };
      const result = ValidationUtils.validateOSImage(osImage);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateHostname', () => {
    test('should accept valid hostname', () => {
      const result = ValidationUtils.validateHostname('raspberry-pi');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should accept hostname with numbers', () => {
      const result = ValidationUtils.validateHostname('rpi-001');
      expect(result.valid).toBe(true);
    });

    test('should reject hostname with special characters', () => {
      const result = ValidationUtils.validateHostname('rpi_test');
      expect(result.valid).toBe(false);
    });

    test('should reject hostname starting with hyphen', () => {
      const result = ValidationUtils.validateHostname('-rpi');
      expect(result.valid).toBe(false);
    });

    test('should reject hostname that is too long', () => {
      const longName = 'a'.repeat(64);
      const result = ValidationUtils.validateHostname(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should accept empty hostname', () => {
      const result = ValidationUtils.validateHostname('');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateSSID', () => {
    test('should accept valid SSID', () => {
      const result = ValidationUtils.validateSSID('MyWiFiNetwork');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject SSID that is too long', () => {
      const longSSID = 'a'.repeat(33);
      const result = ValidationUtils.validateSSID(longSSID);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should accept empty SSID', () => {
      const result = ValidationUtils.validateSSID('');
      expect(result.valid).toBe(true);
    });

    test('should accept SSID with special characters', () => {
      const result = ValidationUtils.validateSSID('My WiFi! @#$');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateWiFiPassword', () => {
    test('should accept valid password', () => {
      const result = ValidationUtils.validateWiFiPassword('mypassword123');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject password that is too short', () => {
      const result = ValidationUtils.validateWiFiPassword('short');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too short');
    });

    test('should reject password that is too long', () => {
      const longPassword = 'a'.repeat(64);
      const result = ValidationUtils.validateWiFiPassword(longPassword);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should accept empty password', () => {
      const result = ValidationUtils.validateWiFiPassword('');
      expect(result.valid).toBe(true);
    });
  });

  describe('isWriteAllowed', () => {
    test('should allow write to safe device paths', () => {
      expect(ValidationUtils.isWriteAllowed('/dev/sdb')).toBe(true);
      expect(ValidationUtils.isWriteAllowed('/dev/sdc')).toBe(true);
      expect(ValidationUtils.isWriteAllowed('/dev/mmcblk0')).toBe(true);
    });

    test('should not allow write to system partitions', () => {
      expect(ValidationUtils.isWriteAllowed('/dev/sda')).toBe(false);
      expect(ValidationUtils.isWriteAllowed('/dev/nvme0n1')).toBe(false);
    });

    test('should not allow write to partition paths', () => {
      expect(ValidationUtils.isWriteAllowed('/dev/sdb1')).toBe(false);
    });
  });

  describe('validateDeviceCompatibility', () => {
    test('should accept compatible device and OS', () => {
      const device = {
        path: '/dev/sdb',
        size: '32GB',
        sizeBytes: 32000000000
      };
      const osImage = {
        id: 'test-os',
        name: 'Test OS',
        size: '1GB',
        sizeBytes: 1000000000
      };
      const result = ValidationUtils.validateDeviceCompatibility(device, osImage);
      expect(result.compatible).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject device too small for OS', () => {
      const device = {
        path: '/dev/sdb',
        size: '1GB',
        sizeBytes: 1000000000
      };
      const osImage = {
        id: 'test-os',
        name: 'Test OS',
        size: '2GB',
        sizeBytes: 2000000000
      };
      const result = ValidationUtils.validateDeviceCompatibility(device, osImage);
      expect(result.compatible).toBe(false);
      expect(result.error).toContain('too small');
    });

    test('should reject invalid device path', () => {
      const device = {
        path: '/dev/sda',
        size: '32GB',
        sizeBytes: 32000000000
      };
      const osImage = {
        id: 'test-os',
        name: 'Test OS',
        size: '1GB',
        sizeBytes: 1000000000
      };
      const result = ValidationUtils.validateDeviceCompatibility(device, osImage);
      expect(result.compatible).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    test('should sanitize HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const sanitized = ValidationUtils.sanitizeInput(input);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    test('should sanitize quotes', () => {
      const input = 'Test "quoted" \'text\'';
      const sanitized = ValidationUtils.sanitizeInput(input);
      expect(sanitized).not.toContain('"');
      expect(sanitized).toContain('&quot;');
    });

    test('should return empty string for null input', () => {
      expect(ValidationUtils.sanitizeInput(null)).toBe('');
    });

    test('should return empty string for non-string input', () => {
      expect(ValidationUtils.sanitizeInput(123)).toBe('');
      expect(ValidationUtils.sanitizeInput({})).toBe('');
    });
  });
});
