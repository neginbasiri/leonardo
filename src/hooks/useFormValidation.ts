import React from 'react';
import {
  validateForm,
  isFormValid,
  getFormErrors,
  ValidationResult,
} from '../lib/validation';

export default function useFormValidation(
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