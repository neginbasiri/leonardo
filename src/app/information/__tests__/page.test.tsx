import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import InformationPage from '../page';
import { GET_POPULAR_ANIME, SEARCH_ANIME } from '../../../lib/queries';

// Mock Next.js components and hooks
const params: Record<string, string> = {
  page: '1',
  search: '',
  perPage: '12'
};
const mockGet = jest.fn((key: string) => params[key] || null);

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: mockGet }),
  useRouter: () => ({ push: jest.fn() })
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href }: any) {
    return <a href={href} data-testid="link">{children}</a>;
  };
});

// Mock dynamic import
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (importFunc: any, options: any) => {
    const Component = () => <div data-testid="loader">Loading...</div>;
    Component.displayName = 'DynamicComponent';
    return Component;
  }
}));

// Mock the UserContext
jest.mock('../../../contexts/UserContext', () => ({
  useUser: jest.fn()
}));

// Mock the AnimeList component
jest.mock('../../../components/AnimeList', () => {
  return function MockAnimeList({ animeList, onAnimeClick }: any) {
    return (
      <div data-testid="anime-list">
        {animeList.map((anime: any, index: number) => (
          <div 
            key={anime.id || index} 
            data-testid={`anime-item-${index}`}
            onClick={() => onAnimeClick(anime)}
          >
            {anime.title?.english || anime.title?.romaji || 'Unknown Title'}
          </div>
        ))}
      </div>
    );
  };
});

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="button" {...props}>{children}</button>
  ),
  HStack: ({ children }: any) => <div data-testid="hstack">{children}</div>,
  Input: ({ value, onChange, placeholder, ...props }: any) => (
    <input 
      data-testid="input" 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      {...props} 
    />
  ),
  ButtonGroup: ({ children }: any) => <div data-testid="button-group">{children}</div>,
  IconButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="icon-button" {...props}>{children}</button>
  ),
  Pagination: {
    Root: ({ children, count, pageSize, page, onPageChange }: any) => (
      <div data-testid="pagination-root" data-count={count} data-page={page}>
        {children}
      </div>
    ),
    PrevTrigger: ({ children }: any) => <div data-testid="prev-trigger">{children}</div>,
    NextTrigger: ({ children }: any) => <div data-testid="next-trigger">{children}</div>,
    Items: ({ render }: any) => {
      const items = [1, 2, 3]; // Mock pagination items
      return (
        <div data-testid="pagination-items">
          {items.map(item => render({ value: item }))}
        </div>
      );
    }
  },
  Spinner: ({ ...props }: any) => <div data-testid="spinner" {...props}>Loading...</div>,
  Box: ({ children, ...props }: any) => <div data-testid="box" {...props}>{children}</div>,
  Text: ({ children, ...props }: any) => <span data-testid="text" {...props}>{children}</span>,
  Flex: ({ children, ...props }: any) => <div data-testid="flex" {...props}>{children}</div>,
  Heading: ({ children, ...props }: any) => <h1 data-testid="heading" {...props}>{children}</h1>,
  VStack: ({ children, ...props }: any) => <div data-testid="vstack" {...props}>{children}</div>,
  Container: ({ children, ...props }: any) => <div data-testid="container" {...props}>{children}</div>,
}));

// Mock react-icons
jest.mock('react-icons/hi', () => ({
  HiChevronLeft: () => <span data-testid="chevron-left">←</span>,
  HiChevronRight: () => <span data-testid="chevron-right">→</span>,
}));

// Mock data
const mockPopularAnimeData = {
  Page: {
    media: [
      {
        id: 1,
        title: { english: 'Test Anime 1', romaji: 'Test Anime 1 Romaji' },
        coverImage: { large: 'test1.jpg' },
        status: 'FINISHED',
        episodes: 12,
        averageScore: 85,
        genres: ['Action', 'Adventure']
      },
      {
        id: 2,
        title: { english: 'Test Anime 2', romaji: 'Test Anime 2 Romaji' },
        coverImage: { large: 'test2.jpg' },
        status: 'ONGOING',
        episodes: 24,
        averageScore: 90,
        genres: ['Comedy', 'Slice of Life']
      }
    ],
    pageInfo: {
      total: 100
    }
  }
};

const mockSearchAnimeData = {
  Page: {
    media: [
      {
        id: 3,
        title: { english: 'Search Result 1', romaji: 'Search Result 1 Romaji' },
        coverImage: { large: 'search1.jpg' },
        status: 'FINISHED',
        episodes: 13,
        averageScore: 88,
        genres: ['Drama', 'Romance']
      }
    ],
    pageInfo: {
      total: 1
    }
  }
};

// Mock queries
const mocks = [
  {
    request: {
      query: GET_POPULAR_ANIME,
      variables: { page: 1, perPage: 12 }
    },
    result: {
      data: mockPopularAnimeData
    }
  },
  {
    request: {
      query: SEARCH_ANIME,
      variables: { search: 'test', page: 1, perPage: 12 }
    },
    result: {
      data: mockSearchAnimeData
    }
  }
];

// Mock useUser hook
const mockUseUser = require('../../../contexts/UserContext').useUser;

describe('InformationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset timers for debounce testing
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Loading State', () => {
    it('should show loader when user context is loading', () => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoading: true
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('Access Control', () => {
    it('should show access denied when user is not logged in', () => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoading: false
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText(/Please enter your username and job title/)).toBeInTheDocument();
    });

    it('should render main content when user is logged in', () => {
      mockUseUser.mockReturnValue({
        user: { username: 'testuser', job: 'developer' },
        isLoading: false
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      expect(screen.getByText('Anime Information')).toBeInTheDocument();
      expect(screen.getByTestId('anime-list')).toBeInTheDocument();
    });
  });

  describe('Page Structure', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: { username: 'testuser', job: 'developer' },
        isLoading: false
      });
    });

    it('should render page header and navigation', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      expect(screen.getByText('Anime Information')).toBeInTheDocument();
      expect(screen.getByText(/Browse through our comprehensive anime list/)).toBeInTheDocument();
      expect(screen.getByTestId('link')).toHaveTextContent('Home');
    });

    it('should render per page selector', () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      expect(screen.getByText('Items per page:')).toBeInTheDocument();
      expect(screen.getByDisplayValue('12')).toBeInTheDocument();
    });

    it('should render pagination when there are results', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('pagination-root')).toBeInTheDocument();
      });
    });
  });

  describe('Anime List Interaction', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: { username: 'testuser', job: 'developer' },
        isLoading: false
      });
    });

    it('should render anime items from data', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('anime-item-0')).toBeInTheDocument();
        expect(screen.getByTestId('anime-item-1')).toBeInTheDocument();
      });
    });

    it('should handle anime item click', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      await waitFor(() => {
        const animeItem = screen.getByTestId('anime-item-0');
        fireEvent.click(animeItem);
      });
    });
  });

  describe('Loading States', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: { username: 'testuser', job: 'developer' },
        isLoading: false
      });
    });

    it('should show loading spinner when data is loading', () => {
      const loadingMocks = [
        {
          request: {
            query: GET_POPULAR_ANIME,
            variables: { page: 1, perPage: 12 }
          },
          result: {
            data: mockPopularAnimeData
          },
          delay: 1000 // Simulate loading delay
        }
      ];

      render(
        <MockedProvider mocks={loadingMocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: { username: 'testuser', job: 'developer' },
        isLoading: false
      });
    });

    it('should show error message when query fails', async () => {
      const errorMocks = [
        {
          request: {
            query: GET_POPULAR_ANIME,
            variables: { page: 1, perPage: 12 }
          },
          error: new Error('Failed to fetch anime data')
        }
      ];

      render(
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading anime data:')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch anime data')).toBeInTheDocument();
      });
    });
  });

  describe('Empty States', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: { username: 'testuser', job: 'developer' },
        isLoading: false
      });
    });

    it('should show no results message when no data is available', async () => {
      const emptyMocks = [
        {
          request: {
            query: GET_POPULAR_ANIME,
            variables: { page: 1, perPage: 12 }
          },
          result: {
            data: {
              Page: {
                media: [],
                pageInfo: {
                  total: 0
                }
              }
            }
          }
        }
      ];

      render(
        <MockedProvider mocks={emptyMocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('No anime data available.')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: { username: 'testuser', job: 'developer' },
        isLoading: false
      });
    });

    it('should render pagination controls', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('pagination-root')).toBeInTheDocument();
        expect(screen.getByTestId('prev-trigger')).toBeInTheDocument();
        expect(screen.getByTestId('next-trigger')).toBeInTheDocument();
        expect(screen.getByTestId('pagination-items')).toBeInTheDocument();
      });
    });

    it('should show correct total results count', async () => {
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('100 results')).toBeInTheDocument();
      });
    });
  });

  describe('URL Parameters', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: { username: 'testuser', job: 'developer' },
        isLoading: false
      });
    });

    it('should initialize with URL parameters', () => {
      // Set params for this test
      params.page = '2';
      params.perPage = '24';
      mockGet.mockClear();

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InformationPage />
        </MockedProvider>
      );

      expect(mockGet).toHaveBeenCalledWith('page');
      expect(mockGet).toHaveBeenCalledWith('perPage');
    });
  });
}); 