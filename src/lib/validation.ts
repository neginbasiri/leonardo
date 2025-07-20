import React from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Only keep patterns and error messages for username and job title
export const VALIDATION_PATTERNS = {
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  JOB_TITLE: /^[A-Za-z\s]+$/,
};

export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  INVALID_USERNAME: 'Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens',
  INVALID_JOB_TITLE: 'Job title must contain only letters and spaces',
};

export function validateField(value: string, rules: ValidationRule, fieldName?: string): ValidationResult {
  const errors: string[] = [];

  if (rules.required && (!value || value.trim() === '')) {
    errors.push(ERROR_MESSAGES.REQUIRED);
    return { isValid: false, errors };
  }

  if (!value || value.trim() === '') {
    return { isValid: true, errors: [] };
  }

  const trimmedValue = value.trim();

  if (rules.minLength && trimmedValue.length < rules.minLength) {
    errors.push(ERROR_MESSAGES.MIN_LENGTH(rules.minLength));
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    errors.push(ERROR_MESSAGES.MAX_LENGTH(rules.maxLength));
  }

  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    if (fieldName === 'username') {
      errors.push(ERROR_MESSAGES.INVALID_USERNAME);
    } else if (fieldName === 'jobTitle') {
      errors.push(ERROR_MESSAGES.INVALID_JOB_TITLE);
    } else {
      errors.push('Invalid format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const VALIDATION_SCHEMA = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: VALIDATION_PATTERNS.USERNAME,
  },
  jobTitle: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: VALIDATION_PATTERNS.JOB_TITLE,
  },
};

export function validateForm(data: Record<string, string>): Record<string, ValidationResult> {
  return {
    username: validateField(data.username, VALIDATION_SCHEMA.username, 'username'),
    jobTitle: validateField(data.jobTitle, VALIDATION_SCHEMA.jobTitle, 'jobTitle'),
  };
}

export function isFormValid(validationResults: Record<string, ValidationResult>): boolean {
  return Object.values(validationResults).every(result => result.isValid);
}

export function getFormErrors(validationResults: Record<string, ValidationResult>): string[] {
  return Object.values(validationResults).flatMap(result => result.errors);
}

export function useFormValidation(
  initialData: { username: string; jobTitle: string },
  validateOnChange: boolean = false
) {
  const [data, setData] = React.useState(initialData);
  const [touched, setTouched] = React.useState<{ [key: string]: boolean }>({});
  const [validationResults, setValidationResults] = React.useState<Record<string, ValidationResult>>({});

  React.useEffect(() => {
    setValidationResults(validateForm(data));
  }, [data]);

  const updateField = (fieldName: 'username' | 'jobTitle', value: string) => {
    setData(prev => ({ ...prev, [fieldName]: value }));
    if (validateOnChange) {
      setTouched(prev => ({ ...prev, [fieldName]: true }));
    }
  };

  const markFieldAsTouched = (fieldName: 'username' | 'jobTitle') => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const markAllAsTouched = () => {
    setTouched({ username: true, jobTitle: true });
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