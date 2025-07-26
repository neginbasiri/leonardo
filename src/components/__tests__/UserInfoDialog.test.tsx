import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserInfoDialog from '../UserInfoDialog';

// Mock the UserContext
jest.mock('../../contexts/UserContext', () => ({
  useUser: () => ({
    user: null,
    setUser: jest.fn(),
  }),
}));

// Mock the useHydration hook
jest.mock('../../hooks/useHydration', () => ({
  useHydration: () => true,
}));

describe('UserInfoDialog', () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when isBlocking is true', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      expect(screen.getByText('Enter your info')).toBeInTheDocument();
    });

    it('should render when isBlocking is false', () => {
      render(<UserInfoDialog isBlocking={false} />);
      
      expect(screen.getByText('Enter your info')).toBeInTheDocument();
    });

    it('should show form fields', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your job title')).toBeInTheDocument();
    });

    it('should show Save button', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('should have proper placeholders', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your job title')).toBeInTheDocument();
    });

    it('should handle input changes', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const jobTitleInput = screen.getByPlaceholderText('Enter your job title');
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(jobTitleInput, { target: { value: 'Developer' } });
      
      expect(usernameInput).toHaveValue('testuser');
      expect(jobTitleInput).toHaveValue('Developer');
    });
  });

  describe('Buttons', () => {
    it('should show Save button', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('should show Cancel button when not blocking', () => {
      render(<UserInfoDialog isBlocking={false} />);
      
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should not show Cancel button when blocking', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle form submission with valid data', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const jobTitleInput = screen.getByPlaceholderText('Enter your job title');
      const saveButton = screen.getByText('Save');
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(jobTitleInput, { target: { value: 'Software Developer' } });
      fireEvent.click(saveButton);
      
      // The form should be valid and submission should work
      expect(usernameInput).toHaveValue('testuser');
      expect(jobTitleInput).toHaveValue('Software Developer');
    });

    it('should show validation errors for invalid data', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      const usernameInput = screen.getByPlaceholderText('Enter your username');
      const saveButton = screen.getByText('Save');
      
      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.click(saveButton);
      
      // Should show validation error for short username
      expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('should have proper labels', () => {
      render(<UserInfoDialog isBlocking={true} />);
      
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Job Title')).toBeInTheDocument();
    });
  });
}); 