import React from 'react';

// Form validation utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  URL: /^https?:\/\/.+/,
};

// Common error messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_USERNAME: 'Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  CUSTOM: (message: string) => message,
};

// Validation function
export function validateField(value: string, rules: ValidationRule): ValidationResult {
  const errors: string[] = [];

  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    errors.push(ERROR_MESSAGES.REQUIRED);
    return { isValid: false, errors };
  }

  // Skip other validations if value is empty and not required
  if (!value || value.trim() === '') {
    return { isValid: true, errors: [] };
  }

  const trimmedValue = value.trim();

  // Min length validation
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    errors.push(ERROR_MESSAGES.MIN_LENGTH(rules.minLength));
  }

  // Max length validation
  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    errors.push(ERROR_MESSAGES.MAX_LENGTH(rules.maxLength));
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    errors.push(ERROR_MESSAGES.CUSTOM('Invalid format'));
  }

  // Custom validation
  if (rules.custom) {
    const customResult = rules.custom(trimmedValue);
    if (typeof customResult === 'string') {
      errors.push(customResult);
    } else if (!customResult) {
      errors.push(ERROR_MESSAGES.CUSTOM('Invalid value'));
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validate entire form
export function validateForm(data: Record<string, string>, validationSchema: FieldValidation): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    const value = data[fieldName] || '';
    results[fieldName] = validateField(value, rules);
  }

  return results;
}

// Check if form is valid
export function isFormValid(validationResults: Record<string, ValidationResult>): boolean {
  return Object.values(validationResults).every(result => result.isValid);
}

// Get all form errors
export function getFormErrors(validationResults: Record<string, ValidationResult>): string[] {
  const errors: string[] = [];
  Object.values(validationResults).forEach(result => {
    errors.push(...result.errors);
  });
  return errors;
}

// Predefined validation schemas
export const VALIDATION_SCHEMAS = {
  USER_INFO: {
    username: {
      required: true,
      minLength: 2,
      maxLength: 30,
      pattern: VALIDATION_PATTERNS.USERNAME,
    },
    jobTitle: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
  },
  SEARCH: {
    query: {
      minLength: 1,
      maxLength: 100,
    },
  },
  CONTACT: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: VALIDATION_PATTERNS.EMAIL,
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
    },
  },
};

// Real-time validation hook
export function useFieldValidation(
  value: string,
  rules: ValidationRule,
  validateOnChange: boolean = false
) {
  const [touched, setTouched] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState<ValidationResult>({ isValid: true, errors: [] });

  React.useEffect(() => {
    if (validateOnChange || touched) {
      const result = validateField(value, rules);
      setValidationResult(result);
    }
  }, [value, rules, validateOnChange, touched]);

  const markAsTouched = () => setTouched(true);

  return {
    ...validationResult,
    touched,
    markAsTouched,
  };
}

// Form validation hook
export function useFormValidation<T extends Record<string, string>>(
  initialData: T,
  validationSchema: FieldValidation,
  validateOnChange: boolean = false
) {
  const [data, setData] = React.useState<T>(initialData);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [validationResults, setValidationResults] = React.useState<Record<string, ValidationResult>>({});

  React.useEffect(() => {
    const results = validateForm(data, validationSchema);
    setValidationResults(results);
  }, [data, validationSchema]);

  const updateField = (fieldName: keyof T, value: string) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    if (validateOnChange) {
      setTouched(prev => ({ ...prev, [fieldName]: true }));
    }
  };

  const markFieldAsTouched = (fieldName: keyof T) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const markAllAsTouched = () => {
    const allTouched: Record<string, boolean> = {};
    Object.keys(validationSchema).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
  };

  const isValid = isFormValid(validationResults);
  const errors = getFormErrors(validationResults);

  return {
    data,
    updateField,
    validationResults,
    touched,
    markFieldAsTouched,
    markAllAsTouched,
    isValid,
    errors,
  };
} 