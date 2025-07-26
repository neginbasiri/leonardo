import { renderHook, act } from '@testing-library/react';
import useFormValidation from '../useFormValidation';

describe('useFormValidation', () => {
  const initialData = {
    username: '',
    jobTitle: '',
  };

  describe('Initial State', () => {
    it('should initialize with provided data', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      expect(result.current.data).toEqual(initialData);
      expect(result.current.isValid).toBe(false);
      expect(result.current.errors).toContain('This field is required');
    });

    it('should initialize with empty touched state', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      expect(result.current.touched).toEqual({});
    });

    it('should initialize with validation results for empty data', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      expect(result.current.validationResults.username.isValid).toBe(false);
      expect(result.current.validationResults.jobTitle.isValid).toBe(false);
    });
  });

  describe('Field Updates', () => {
    it('should update username field', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.updateField('username', 'testuser');
      });
      
      expect(result.current.data.username).toBe('testuser');
    });

    it('should update jobTitle field', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.updateField('jobTitle', 'developer');
      });
      
      expect(result.current.data.jobTitle).toBe('developer');
    });

    it('should trigger validation on field update', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.updateField('username', 'testuser');
      });
      
      expect(result.current.validationResults.username.isValid).toBe(true);
    });
  });

  describe('Touch State Management', () => {
    it('should mark field as touched', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.markFieldAsTouched('username');
      });
      
      expect(result.current.touched.username).toBe(true);
    });

    it('should mark all fields as touched', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.markAllAsTouched();
      });
      
      expect(result.current.touched.username).toBe(true);
      expect(result.current.touched.jobTitle).toBe(true);
    });
  });

  describe('Validation Logic', () => {
    describe('Username Validation', () => {
      it('should validate required username', () => {
        const { result } = renderHook(() => useFormValidation(initialData));
        
        act(() => {
          result.current.markFieldAsTouched('username');
        });
        
        expect(result.current.validationResults.username.isValid).toBe(false);
        expect(result.current.validationResults.username.errors).toContain('This field is required');
      });

      it('should validate username length (min)', () => {
        const { result } = renderHook(() => useFormValidation(initialData));
        
        act(() => {
          result.current.updateField('username', 'ab');
        });
        
        expect(result.current.validationResults.username.isValid).toBe(false);
        expect(result.current.validationResults.username.errors).toContain('Must be at least 3 characters');
      });

      it('should validate username pattern', () => {
        const { result } = renderHook(() => useFormValidation(initialData));
        
        act(() => {
          result.current.updateField('username', 'invalid@user');
        });
        
        expect(result.current.validationResults.username.isValid).toBe(false);
        expect(result.current.validationResults.username.errors).toContain('Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens');
      });

      it('should accept valid username', () => {
        const { result } = renderHook(() => useFormValidation(initialData));
        
        act(() => {
          result.current.updateField('username', 'valid_user123');
        });
        
        expect(result.current.validationResults.username.isValid).toBe(true);
        expect(result.current.validationResults.username.errors).toEqual([]);
      });
    });

    describe('Job Title Validation', () => {
      it('should validate required job title', () => {
        const { result } = renderHook(() => useFormValidation(initialData));
        
        act(() => {
          result.current.markFieldAsTouched('jobTitle');
        });
        
        expect(result.current.validationResults.jobTitle.isValid).toBe(false);
        expect(result.current.validationResults.jobTitle.errors).toContain('This field is required');
      });

      it('should validate job title pattern', () => {
        const { result } = renderHook(() => useFormValidation(initialData));
        
        act(() => {
          result.current.updateField('jobTitle', 'Developer123');
        });
        
        expect(result.current.validationResults.jobTitle.isValid).toBe(false);
        expect(result.current.validationResults.jobTitle.errors).toContain('Job title must contain only letters and spaces');
      });

      it('should accept valid job title', () => {
        const { result } = renderHook(() => useFormValidation(initialData));
        
        act(() => {
          result.current.updateField('jobTitle', 'Software Developer');
        });
        
        expect(result.current.validationResults.jobTitle.isValid).toBe(true);
        expect(result.current.validationResults.jobTitle.errors).toEqual([]);
      });
    });
  });

  describe('Form Validation', () => {
    it('should return true when all fields are valid', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.updateField('username', 'valid_user');
        result.current.updateField('jobTitle', 'Software Developer');
      });
      
      expect(result.current.isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });

    it('should return false when any field is invalid', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.updateField('username', 'valid_user');
        result.current.updateField('jobTitle', ''); // Invalid
      });
      
      expect(result.current.isValid).toBe(false);
      expect(result.current.errors).toContain('This field is required');
    });

    it('should return all validation errors', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.updateField('username', 'ab'); // Too short
        result.current.updateField('jobTitle', 'Dev123'); // Invalid pattern
      });
      
      expect(result.current.isValid).toBe(false);
      expect(result.current.errors).toContain('Must be at least 3 characters');
      expect(result.current.errors).toContain('Job title must contain only letters and spaces');
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only values', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.updateField('username', '   ');
      });
      
      expect(result.current.validationResults.username.isValid).toBe(false);
      expect(result.current.validationResults.username.errors).toContain('This field is required');
    });

    it('should handle empty string values', () => {
      const { result } = renderHook(() => useFormValidation(initialData));
      
      act(() => {
        result.current.updateField('username', '');
      });
      
      expect(result.current.validationResults.username.isValid).toBe(false);
      expect(result.current.validationResults.username.errors).toContain('This field is required');
    });
  });
}); 