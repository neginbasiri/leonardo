import { 
  validateField, 
  validateForm, 
  isFormValid, 
  getFormErrors, 
  VALIDATION_PATTERNS, 
  ERROR_MESSAGES,
  useFormValidation 
} from '../validation';
import { renderHook, act } from '@testing-library/react';

describe('Validation Functions', () => {
  describe('validateField', () => {
    describe('Required Field Validation', () => {
      it('should return error for empty required field', () => {
        const result = validateField('', { required: true });
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('This field is required');
      });

      it('should return error for whitespace-only required field', () => {
        const result = validateField('   ', { required: true });
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('This field is required');
      });

      it('should return error for null required field', () => {
        const result = validateField(null as any, { required: true });
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('This field is required');
      });

      it('should return error for undefined required field', () => {
        const result = validateField(undefined as any, { required: true });
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('This field is required');
      });

      it('should pass for valid required field', () => {
        const result = validateField('valid value', { required: true });
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });

    describe('Length Validation', () => {
      it('should return error for field shorter than minLength', () => {
        const result = validateField('ab', { minLength: 3 });
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Must be at least 3 characters');
      });

      it('should return error for field longer than maxLength', () => {
        const result = validateField('very long value', { maxLength: 5 });
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Must be no more than 5 characters');
      });

      it('should pass for field within length limits', () => {
        const result = validateField('valid', { minLength: 3, maxLength: 10 });
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should pass for empty field when not required', () => {
        const result = validateField('', { minLength: 3, maxLength: 10 });
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });

    describe('Pattern Validation', () => {
      it('should return error for username with invalid pattern', () => {
        const result = validateField('invalid@user', { pattern: VALIDATION_PATTERNS.USERNAME }, 'username');
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens');
      });

      it('should return error for job title with invalid pattern', () => {
        const result = validateField('Developer123', { pattern: VALIDATION_PATTERNS.JOB_TITLE }, 'jobTitle');
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Job title must contain only letters and spaces');
      });

      it('should pass for valid username pattern', () => {
        const result = validateField('valid_user123', { pattern: VALIDATION_PATTERNS.USERNAME }, 'username');
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should pass for valid job title pattern', () => {
        const result = validateField('Software Developer', { pattern: VALIDATION_PATTERNS.JOB_TITLE }, 'jobTitle');
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });

    describe('Combined Validation', () => {
      it('should return multiple errors for field with multiple issues', () => {
        const result = validateField('ab', { 
          required: true, 
          minLength: 3, 
          pattern: VALIDATION_PATTERNS.USERNAME 
        }, 'username');
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Must be at least 3 characters');
        expect(result.errors).toContain('Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens');
      });

      it('should pass for field meeting all requirements', () => {
        const result = validateField('valid_user', { 
          required: true, 
          minLength: 3, 
          maxLength: 20,
          pattern: VALIDATION_PATTERNS.USERNAME 
        }, 'username');
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      });
    });
  });

  describe('validateForm', () => {
    it('should validate all fields in form data', () => {
      const formData = {
        username: 'ab',
        jobTitle: 'Dev123'
      };
      
      const results = validateForm(formData);
      
      expect(results.username.isValid).toBe(false);
      expect(results.jobTitle.isValid).toBe(false);
      expect(results.username.errors).toContain('Must be at least 3 characters');
      expect(results.jobTitle.errors).toContain('Job title must contain only letters and spaces');
    });

    it('should return valid results for valid form data', () => {
      const formData = {
        username: 'valid_user',
        jobTitle: 'Software Developer'
      };
      
      const results = validateForm(formData);
      
      expect(results.username.isValid).toBe(true);
      expect(results.jobTitle.isValid).toBe(true);
      expect(results.username.errors).toEqual([]);
      expect(results.jobTitle.errors).toEqual([]);
    });
  });

  describe('isFormValid', () => {
    it('should return true when all fields are valid', () => {
      const validationResults = {
        username: { isValid: true, errors: [] },
        jobTitle: { isValid: true, errors: [] }
      };
      
      expect(isFormValid(validationResults)).toBe(true);
    });

    it('should return false when any field is invalid', () => {
      const validationResults = {
        username: { isValid: true, errors: [] },
        jobTitle: { isValid: false, errors: ['This field is required'] }
      };
      
      expect(isFormValid(validationResults)).toBe(false);
    });
  });

  describe('getFormErrors', () => {
    it('should return all errors from validation results', () => {
      const validationResults = {
        username: { isValid: false, errors: ['Must be at least 3 characters'] },
        jobTitle: { isValid: false, errors: ['This field is required'] }
      };
      
      const errors = getFormErrors(validationResults);
      
      expect(errors).toContain('Must be at least 3 characters');
      expect(errors).toContain('This field is required');
      expect(errors).toHaveLength(2);
    });

    it('should return empty array when no errors', () => {
      const validationResults = {
        username: { isValid: true, errors: [] },
        jobTitle: { isValid: true, errors: [] }
      };
      
      const errors = getFormErrors(validationResults);
      
      expect(errors).toEqual([]);
    });
  });

  describe('VALIDATION_PATTERNS', () => {
    describe('USERNAME pattern', () => {
      it('should match valid usernames', () => {
        const validUsernames = ['user123', 'test_user', 'my-username', 'valid123'];
        
        validUsernames.forEach(username => {
          expect(VALIDATION_PATTERNS.USERNAME.test(username)).toBe(true);
        });
      });

      it('should not match invalid usernames', () => {
        const invalidUsernames = ['ab', 'very_long_username_that_exceeds_limit', 'user@name', 'user name', 'user.name'];
        
        invalidUsernames.forEach(username => {
          expect(VALIDATION_PATTERNS.USERNAME.test(username)).toBe(false);
        });
      });
    });

    describe('JOB_TITLE pattern', () => {
      it('should match valid job titles', () => {
        const validJobTitles = ['Developer', 'Software Engineer', 'Designer', 'Manager'];
        
        validJobTitles.forEach(title => {
          expect(VALIDATION_PATTERNS.JOB_TITLE.test(title)).toBe(true);
        });
      });

      it('should not match invalid job titles', () => {
        const invalidJobTitles = ['Developer123', 'Software-Engineer', 'Designer@', 'Manager.1'];
        
        invalidJobTitles.forEach(title => {
          expect(VALIDATION_PATTERNS.JOB_TITLE.test(title)).toBe(false);
        });
      });
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should provide correct error messages', () => {
      expect(ERROR_MESSAGES.REQUIRED).toBe('This field is required');
      expect(ERROR_MESSAGES.MIN_LENGTH(3)).toBe('Must be at least 3 characters');
      expect(ERROR_MESSAGES.MAX_LENGTH(20)).toBe('Must be no more than 20 characters');
      expect(ERROR_MESSAGES.INVALID_USERNAME).toBe('Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens');
      expect(ERROR_MESSAGES.INVALID_JOB_TITLE).toBe('Job title must contain only letters and spaces');
    });
  });

  describe('useFormValidation', () => {
    it('should initialize with provided data', () => {
      const initialData = { username: 'test', jobTitle: 'Developer' };
      const { result } = renderHook(() => useFormValidation(initialData));
      
      expect(result.current.data).toEqual(initialData);
      expect(result.current.isValid).toBe(true);
    });

    it('should update field value', () => {
      const { result } = renderHook(() => useFormValidation({ username: '', jobTitle: '' }));
      
      act(() => {
        result.current.updateField('username', 'newuser');
      });
      
      expect(result.current.data.username).toBe('newuser');
    });

    it('should mark field as touched', () => {
      const { result } = renderHook(() => useFormValidation({ username: '', jobTitle: '' }));
      
      act(() => {
        result.current.markFieldAsTouched('username');
      });
      
      expect(result.current.touched.username).toBe(true);
    });

    it('should mark all fields as touched', () => {
      const { result } = renderHook(() => useFormValidation({ username: '', jobTitle: '' }));
      
      act(() => {
        result.current.markAllAsTouched();
      });
      
      expect(result.current.touched.username).toBe(true);
      expect(result.current.touched.jobTitle).toBe(true);
    });

    it('should validate on data change', () => {
      const { result } = renderHook(() => useFormValidation({ username: '', jobTitle: '' }));
      
      act(() => {
        result.current.updateField('username', 'ab');
      });
      
      expect(result.current.validationResults.username.isValid).toBe(false);
      expect(result.current.validationResults.username.errors).toContain('Must be at least 3 characters');
    });
  });
}); 