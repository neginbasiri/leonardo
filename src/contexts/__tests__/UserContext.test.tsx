import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { UserProvider, useUser } from '../UserContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component to access context
const TestComponent = () => {
  const { user, setUser, isLoading } = useUser();
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">
        {user ? `${user.username} - ${user.job}` : 'No user'}
      </div>
      <button 
        data-testid="set-user" 
        onClick={() => setUser({ username: 'testuser', job: 'developer' })}
      >
        Set User
      </button>
      <button 
        data-testid="clear-user" 
        onClick={() => setUser(null)}
      >
        Clear User
      </button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('UserProvider', () => {
    it('should render children', () => {
      render(
        <UserProvider>
          <div data-testid="child">Child Component</div>
        </UserProvider>
      );
      
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should provide initial context values', () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
    });

    it('should load user from localStorage on mount', () => {
      const mockUser = { username: 'storeduser', job: 'designer' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
      
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user-info');
      expect(screen.getByTestId('user')).toHaveTextContent('storeduser - designer');
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user-info');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user-info');
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
    });

    it('should handle null localStorage value', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user-info');
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
    });

    it('should set loading to false after initialization', async () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      // Wait for useEffect to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });
  });

  describe('useUser hook', () => {
    it('should throw error when used outside UserProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useUser must be used within a UserProvider');
      
      consoleSpy.mockRestore();
    });

    it('should provide user state and setUser function', () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      expect(screen.getByTestId('set-user')).toBeInTheDocument();
      expect(screen.getByTestId('clear-user')).toBeInTheDocument();
    });
  });

  describe('User state management', () => {
    it('should set user and save to localStorage', async () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      const setUserButton = screen.getByTestId('set-user');
      
      await act(async () => {
        setUserButton.click();
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('testuser - developer');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user-info',
        JSON.stringify({ username: 'testuser', job: 'developer' })
      );
    });

    it('should clear user and remove from localStorage', async () => {
      // Set initial user
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ username: 'initial', job: 'tester' }));
      
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('initial - tester');
      
      const clearUserButton = screen.getByTestId('clear-user');
      
      await act(async () => {
        clearUserButton.click();
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user-info');
    });

    it('should update user state when setUser is called multiple times', async () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      const setUserButton = screen.getByTestId('set-user');
      
      // Set user first time
      await act(async () => {
        setUserButton.click();
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('testuser - developer');
      
      // Clear user
      const clearUserButton = screen.getByTestId('clear-user');
      await act(async () => {
        clearUserButton.click();
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      
      // Set user again
      await act(async () => {
        setUserButton.click();
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('testuser - developer');
    });
  });

  describe('localStorage integration', () => {
    it('should save user data to localStorage when user is set', async () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      const setUserButton = screen.getByTestId('set-user');
      
      await act(async () => {
        setUserButton.click();
      });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user-info',
        JSON.stringify({ username: 'testuser', job: 'developer' })
      );
    });

    it('should remove user data from localStorage when user is cleared', async () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      const clearUserButton = screen.getByTestId('clear-user');
      
      await act(async () => {
        clearUserButton.click();
      });
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user-info');
    });
  });

  describe('Error handling', () => {
    it('should handle JSON parse errors from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('{invalid json');
      
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user-info');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user-info');
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
    });
  });

  describe('Context value structure', () => {
    it('should provide correct context structure', () => {
      // Reset localStorage mock for this test
      localStorageMock.getItem.mockReturnValue(null);
      
      const TestContextStructure = () => {
        const context = useUser();
        
        return (
          <div>
            <div data-testid="has-user">{context.user ? 'has-user' : 'no-user'}</div>
            <div data-testid="has-setUser">{typeof context.setUser === 'function' ? 'has-setUser' : 'no-setUser'}</div>
            <div data-testid="has-isLoading">{typeof context.isLoading === 'boolean' ? 'has-isLoading' : 'no-isLoading'}</div>
          </div>
        );
      };
      
      render(
        <UserProvider>
          <TestContextStructure />
        </UserProvider>
      );
      
      expect(screen.getByTestId('has-user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('has-setUser')).toHaveTextContent('has-setUser');
      expect(screen.getByTestId('has-isLoading')).toHaveTextContent('has-isLoading');
    });
  });
}); 