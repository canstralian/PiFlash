/**
 * Centralized validation utilities for PiFlash
 * Provides input validation and sandboxing guards
 */

class ValidationUtils {
  /**
   * Validate device path format
   * @param {string} path - Device path to validate
   * @returns {Object} - { valid: boolean, error: string|null }
   */
  static validateDevicePath(path) {
    if (!path || typeof path !== 'string') {
      return { valid: false, error: 'Device path is required' };
    }

    // Ensure path starts with /dev/
    if (!path.startsWith('/dev/')) {
      return { valid: false, error: 'Device path must start with /dev/' };
    }

    // Allow only safe device patterns (sd cards, usb devices)
    // Prevent access to system-critical partitions
    const safeDevicePattern = /^\/dev\/(sd[a-z]|mmcblk[0-9]+)$/;
    if (!safeDevicePattern.test(path)) {
      return { valid: false, error: 'Invalid device path format' };
    }

    // Prevent access to system partitions
    const systemPartitions = ['/dev/sda', '/dev/nvme0n1', '/dev/vda', '/dev/hda'];
    if (systemPartitions.includes(path)) {
      return { valid: false, error: 'Cannot write to system partition' };
    }

    return { valid: true, error: null };
  }

  /**
   * Validate OS image selection
   * @param {Object} osImage - OS image object to validate
   * @returns {Object} - { valid: boolean, error: string|null }
   */
  static validateOSImage(osImage) {
    if (!osImage || typeof osImage !== 'object') {
      return { valid: false, error: 'OS image is required' };
    }

    // Required fields
    const requiredFields = ['id', 'name', 'size', 'sizeBytes'];
    for (const field of requiredFields) {
      if (osImage[field] === undefined || osImage[field] === null || osImage[field] === '') {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    // Validate size is positive
    if (osImage.sizeBytes <= 0) {
      return { valid: false, error: 'Invalid image size' };
    }

    // Validate category if present
    const validCategories = ['official', 'ubuntu', 'gaming', 'media', 'security', 'custom'];
    if (osImage.category && !validCategories.includes(osImage.category)) {
      return { valid: false, error: 'Invalid OS category' };
    }

    return { valid: true, error: null };
  }

  /**
   * Validate hostname format
   * @param {string} hostname - Hostname to validate
   * @returns {Object} - { valid: boolean, error: string|null }
   */
  static validateHostname(hostname) {
    if (!hostname || typeof hostname !== 'string') {
      return { valid: true, error: null }; // Hostname is optional
    }

    const value = hostname.trim();
    if (!value) {
      return { valid: true, error: null };
    }

    // RFC 1123 hostname validation
    const hostnameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*$/;
    if (!hostnameRegex.test(value)) {
      return { valid: false, error: 'Invalid hostname format' };
    }

    // Check length
    if (value.length > 63) {
      return { valid: false, error: 'Hostname too long (max 63 characters)' };
    }

    return { valid: true, error: null };
  }

  /**
   * Validate WiFi SSID
   * @param {string} ssid - SSID to validate
   * @returns {Object} - { valid: boolean, error: string|null }
   */
  static validateSSID(ssid) {
    if (!ssid || typeof ssid !== 'string') {
      return { valid: true, error: null }; // SSID is optional
    }

    const value = ssid.trim();
    if (!value) {
      return { valid: true, error: null };
    }

    // SSID length validation (1-32 bytes)
    if (value.length > 32) {
      return { valid: false, error: 'SSID too long (max 32 characters)' };
    }

    return { valid: true, error: null };
  }

  /**
   * Validate WiFi password
   * @param {string} password - Password to validate
   * @returns {Object} - { valid: boolean, error: string|null }
   */
  static validateWiFiPassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: true, error: null }; // Password is optional
    }

    const value = password.trim();
    if (!value) {
      return { valid: true, error: null };
    }

    // WPA/WPA2 password length (8-63 characters)
    if (value.length < 8) {
      return { valid: false, error: 'Password too short (min 8 characters)' };
    }

    if (value.length > 63) {
      return { valid: false, error: 'Password too long (max 63 characters)' };
    }

    return { valid: true, error: null };
  }

  /**
   * Check if device path is approved for write operations
   * Sandboxing guard to prevent writing to system-critical partitions
   * @param {string} path - Device path to check
   * @returns {boolean} - True if write is allowed
   */
  static isWriteAllowed(path) {
    const validation = this.validateDevicePath(path);
    return validation.valid;
  }

  /**
   * Validate device compatibility with OS image
   * @param {Object} device - Device object
   * @param {Object} osImage - OS image object
   * @returns {Object} - { compatible: boolean, error: string|null }
   */
  static validateDeviceCompatibility(device, osImage) {
    if (!device || !osImage) {
      return { compatible: false, error: 'Device and OS image are required' };
    }

    const deviceValidation = this.validateDevicePath(device.path);
    if (!deviceValidation.valid) {
      return { compatible: false, error: deviceValidation.error };
    }

    const osValidation = this.validateOSImage(osImage);
    if (!osValidation.valid) {
      return { compatible: false, error: osValidation.error };
    }

    // Check if device has enough space
    if (device.sizeBytes < osImage.sizeBytes) {
      return {
        compatible: false,
        error: `Device too small (${device.size} < ${osImage.size})`
      };
    }

    return { compatible: true, error: null };
  }

  /**
   * Sanitize user input to prevent XSS
   * @param {string} input - User input to sanitize
   * @returns {string} - Sanitized input
   */
  static sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}

// Export for both browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ValidationUtils;
}
