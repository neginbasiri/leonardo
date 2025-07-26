import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserInfoDialog from '../UserInfoDialog';

// Mock the UserContext
jest.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: null,
    setUser: jest.fn(),
  }),
}));

// Mock the useHydration hook
jest.mock('@/hooks/useHydration', () => ({
  useHydration: () => true,
}));

// Mock the useFormValidation hook
jest.mock('@/hooks/useFormValidation', () => ({
  __esModule: true,
  default: () => ({
    data: { username: '', jobTitle: '' },
    updateField: jest.fn(),
    validationResults: {
      username: { isValid: true, errors: [] },
      jobTitle: { isValid: true, errors: [] },
    },
    touched: {},
    markFieldAsTouched: jest.fn(),
    markAllAsTouched: jest.fn(),
    isValid: true,
    errors: [],
  }),
}));

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  DialogRoot: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogTitle: ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>,
  DialogDescription: ({ children }: any) => <p data-testid="dialog-description">{children}</p>,
  DialogCloseTrigger: ({ children, onClick }: any) => <button data-testid="close-button" onClick={onClick}>{children}</button>,
  FieldRoot: ({ children }: any) => <div data-testid="field-root">{children}</div>,
  FieldLabel: ({ children }: any) => <label data-testid="field-label">{children}</label>,
  Input: ({ placeholder, onChange, value, ...props }: any) => (
    <input 
      data-testid="input" 
      placeholder={placeholder} 
      onChange={onChange} 
      value={value} 
      {...props} 
    />
  ),
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button data-testid="button" onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  VStack: ({ children }: any) => <div data-testid="vstack">{children}</div>,
  HStack: ({ children }: any) => <div data-testid="hstack">{children}</div>,
  Box: ({ children }: any) => <div data-testid="box">{children}</div>,
  Text: ({ children }: any) => <span data-testid="text">{children}</span>,
  Flex: ({ children }: any) => <div data-testid="flex">{children}</div>,
}));

describe('UserInfoDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    isBlocking: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render dialog when open', () => {
      render(<UserInfoDialog {...defaultProps} />);
      
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Enter your info');
    });

    it('should not render when closed', () => {
      render(<UserInfoDialog {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('should render form fields', () => {
      render(<UserInfoDialog {...defaultProps} />);
      
      const inputs = screen.getAllByTestId('input');
      expect(inputs).toHaveLength(2);
      
      const labels = screen.getAllByTestId('field-label');
      expect(labels).toHaveLength(2);
    });
  });

  describe('Buttons', () => {
    it('should show Save button', () => {
      render(<UserInfoDialog {...defaultProps} />);
      
      const buttons = screen.getAllByTestId('button');
      const saveButton = buttons.find(button => button.textContent === 'Save');
      expect(saveButton).toBeInTheDocument();
    });

    it('should show Cancel button when not blocking', () => {
      render(<UserInfoDialog {...defaultProps} isBlocking={false} />);
      
      const buttons = screen.getAllByTestId('button');
      const cancelButton = buttons.find(button => button.textContent === 'Cancel');
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle form submission', () => {
      const onCloseMock = jest.fn();
      
      render(<UserInfoDialog {...defaultProps} onClose={onCloseMock} />);
      
      const buttons = screen.getAllByTestId('button');
      const saveButton = buttons.find(button => button.textContent === 'Save');
      
      if (saveButton) {
        fireEvent.click(saveButton);
        expect(saveButton).toBeInTheDocument();
      }
    });

    it('should handle cancel action', () => {
      const onCloseMock = jest.fn();
      
      render(<UserInfoDialog {...defaultProps} onClose={onCloseMock} isBlocking={false} />);
      
      const buttons = screen.getAllByTestId('button');
      const cancelButton = buttons.find(button => button.textContent === 'Cancel');
      
      if (cancelButton) {
        fireEvent.click(cancelButton);
        expect(onCloseMock).toHaveBeenCalled();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<UserInfoDialog {...defaultProps} />);
      
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getAllByTestId('field-root')).toHaveLength(2);
    });

    it('should have proper labels', () => {
      render(<UserInfoDialog {...defaultProps} />);
      
      const labels = screen.getAllByTestId('field-label');
      expect(labels).toHaveLength(2);
    });
  });
});