export interface ValidationResult {
  valid: boolean;
  error?: string;
  cleaned?: string;
}

/**
 * Validates a 10-digit Indian mobile number:
 * 1. Must be strictly 10 numeric digits.
 * 2. Must start with 6, 7, 8, or 9.
 * 3. Must not contain repeating digit patterns (e.g. 9999999999, 9999912345, 9876543210).
 * 4. Must not repeat an already-used phone number in existingNumbers (if provided).
 */
export function validatePhoneNumber(
  rawPhone: string | undefined | null,
  existingNumbers?: string[]
): ValidationResult {
  const raw = String(rawPhone ?? '').trim();
  if (!raw) {
    return { valid: false, error: 'Mobile number is required (must be 10 digits).' };
  }

  // Strip optional +91 only if explicitly prefixed with +91, otherwise check raw digits
  const normalized = raw.startsWith('+91') ? raw.slice(3).trim() : raw;

  if (!/^\d+$/.test(normalized)) {
    return { valid: false, error: 'Mobile number must contain only digits (0–9).' };
  }

  if (normalized.length !== 10) {
    return {
      valid: false,
      error: `Mobile number must be exactly 10 digits (currently ${normalized.length} digits).`,
    };
  }

  if (!/^[6-9]\d{9}$/.test(normalized)) {
    return {
      valid: false,
      error: 'Mobile number must start with 6, 7, 8, or 9.',
    };
  }

  // Disallow all-same repeating digits (e.g. 9999999999) or 5+ consecutive repeating digits (e.g. 9999912345)
  if (/^(\d)\1{9}$/.test(normalized) || /(\d)\1{4,}/.test(normalized)) {
    return {
      valid: false,
      error: 'Invalid mobile number: repeating digits (e.g. 9999999999) are not allowed.',
    };
  }

  // Disallow repeating pair/triplet patterns (e.g. 9898989898, 9090909090) or sequential dummy numbers
  if (
    /^(\d\d)\1{4}$/.test(normalized) ||
    normalized === '9876543210' ||
    normalized === '1234567890' ||
    normalized === '0123456789'
  ) {
    return {
      valid: false,
      error: 'Invalid mobile number: repetitive or sequential pattern is not allowed.',
    };
  }

  // Check against existing numbers so the phone number cannot be repeated/duplicated
  if (Array.isArray(existingNumbers) && existingNumbers.length > 0) {
    const cleanSet = new Set(
      existingNumbers
        .map((n) => String(n ?? '').replace(/\D/g, '').slice(-10))
        .filter((n) => n.length === 10)
    );
    if (cleanSet.has(normalized)) {
      return {
        valid: false,
        error: `Mobile number ${normalized} has already been used. Phone numbers cannot be repeated.`,
      };
    }
  }

  return { valid: true, cleaned: normalized };
}

/**
 * Validates an email address ONLY if it is present (non-empty).
 * If empty/blank, returns valid: true.
 */
export function validateEmailOptional(
  rawEmail: string | undefined | null
): ValidationResult {
  const trimmed = String(rawEmail ?? '').trim();
  if (!trimmed) {
    return { valid: true, cleaned: '' };
  }

  if (trimmed.includes('..')) {
    return {
      valid: false,
      error: 'Invalid email address: consecutive dots (..) are not allowed.',
    };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid email address (e.g. name@example.com) or leave it empty.',
    };
  }

  return { valid: true, cleaned: trimmed.toLowerCase() };
}

/**
 * Validates a 6-digit Indian PIN code:
 * 1. Must be strictly 6 numeric digits.
 * 2. Cannot start with 0.
 * 3. Cannot be all repeating digits (e.g. 111111, 999999).
 */
export function validatePinCode(
  rawPin: string | undefined | null
): ValidationResult {
  const trimmed = String(rawPin ?? '').trim();
  if (!trimmed) {
    return { valid: false, error: 'PIN code is required (must be 6 digits).' };
  }

  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, error: 'PIN code must contain only digits (0–9).' };
  }

  if (trimmed.length !== 6) {
    return {
      valid: false,
      error: `PIN code must be exactly 6 digits (currently ${trimmed.length} digits).`,
    };
  }

  if (!/^[1-9]\d{5}$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid PIN code: PIN code cannot start with 0.',
    };
  }

  if (/^(\d)\1{5}$/.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid PIN code: repeating digits (e.g. 555555) are not allowed.',
    };
  }

  return { valid: true, cleaned: trimmed };
}
