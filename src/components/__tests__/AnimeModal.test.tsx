import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnimeModal from '../AnimeModal';

// Mock the ErrorBoundary component
jest.mock('../ErrorBoundary', () => {
  return function MockErrorBoundary({ children }: { children: React.ReactNode }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Box: ({ children, onClick, position, ...props }: any) => (
    <div 
      data-testid="box" 
      onClick={onClick}
      style={{ position }}
      {...props}
    >
      {children}
    </div>
  ),
  Text: ({ children, ...props }: any) => <p data-testid="text" {...props}>{children}</p>,
  Image: ({ src, alt, ...props }: any) => <img data-testid="image" src={src} alt={alt} {...props} />,
  Badge: ({ children, ...props }: any) => <span data-testid="badge" {...props}>{children}</span>,
  HStack: ({ children, ...props }: any) => <div data-testid="hstack" {...props}>{children}</div>,
  VStack: ({ children, ...props }: any) => <div data-testid="vstack" {...props}>{children}</div>,
  Flex: ({ children, ...props }: any) => <div data-testid="flex" {...props}>{children}</div>,
  Button: ({ children, onClick, ...props }: any) => (
    <button data-testid="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('AnimeModal', () => {
  const mockAnime = {
    id: 1,
    title: {
      romaji: 'Test Anime Romaji',
      english: 'Test Anime English',
      native: 'テストアニメ',
    },
    coverImage: {
      large: 'https://example.com/large.jpg',
      medium: 'https://example.com/medium.jpg',
    },
    bannerImage: 'https://example.com/banner.jpg',
    description: 'This is a test anime description with <b>HTML tags</b> that should be stripped.',
    averageScore: 85,
    episodes: 12,
    status: 'FINISHED',
    genres: ['Action', 'Adventure', 'Fantasy'],
    season: 'SPRING',
    seasonYear: 2023,
  };

  const mockAnimeWithoutEnglish = {
    ...mockAnime,
    id: 2,
    title: {
      romaji: 'Another Anime',
      english: '',
      native: 'アナザーアニメ',
    },
    averageScore: 0,
    episodes: 0,
    status: 'RELEASING',
    genres: [],
    season: '',
    seasonYear: 0,
  };

  const defaultProps = {
    anime: mockAnime,
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.body.style
    Object.defineProperty(document.body, 'style', {
      value: { overflow: '' },
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('should render modal when open with anime data', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByText('Test Anime English')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<AnimeModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Test Anime English')).not.toBeInTheDocument();
    });

    it('should not render when anime is null', () => {
      render(<AnimeModal {...defaultProps} anime={null} />);
      
      expect(screen.queryByText('Test Anime English')).not.toBeInTheDocument();
    });

    it('should render romaji title when English title is not available', () => {
      render(<AnimeModal {...defaultProps} anime={mockAnimeWithoutEnglish} />);
      
      expect(screen.getByText('Another Anime')).toBeInTheDocument();
    });
  });

  describe('Modal Structure', () => {
    it('should render backdrop and modal content', () => {
      render(<AnimeModal {...defaultProps} />);
      
      const boxes = screen.getAllByTestId('box');
      const backdrop = boxes.find(box => box.style.position === 'fixed');
      expect(backdrop).toBeInTheDocument();
    });

    it('should render close button', () => {
      render(<AnimeModal {...defaultProps} />);
      
      const closeButton = screen.getByTestId('button');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent('✕');
    });

    it('should render cover image', () => {
      render(<AnimeModal {...defaultProps} />);
      
      const images = screen.getAllByTestId('image');
      const coverImage = images.find(img => img.src === 'https://example.com/large.jpg');
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute('alt', 'Cover image for Test Anime English');
    });
  });

  describe('Anime Information Display', () => {
    it('should display Japanese title when different from English', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Japanese Title:')).toBeInTheDocument();
      expect(screen.getByText('Test Anime Romaji')).toBeInTheDocument();
    });

    it('should display native title', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Native Title:')).toBeInTheDocument();
      expect(screen.getByText('テストアニメ')).toBeInTheDocument();
    });

    it('should display rating when available', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Rating:')).toBeInTheDocument();
      expect(screen.getByText('8.5★')).toBeInTheDocument();
      expect(screen.getByText('(85% score)')).toBeInTheDocument();
    });

    it('should not display rating when score is 0', () => {
      render(<AnimeModal {...defaultProps} anime={mockAnimeWithoutEnglish} />);
      
      expect(screen.queryByText('Rating:')).not.toBeInTheDocument();
    });

    it('should display status with proper formatting', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Status:')).toBeInTheDocument();
      expect(screen.getByText('Finished')).toBeInTheDocument();
    });

    it('should display episodes when available', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Episodes:')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('should display season and year when available', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Season:')).toBeInTheDocument();
      expect(screen.getByText('Spring 2023')).toBeInTheDocument();
    });

    it('should display genres when available', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Genres:')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Adventure')).toBeInTheDocument();
      expect(screen.getByText('Fantasy')).toBeInTheDocument();
    });

    it('should display description with HTML tags stripped', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Description:')).toBeInTheDocument();
      expect(screen.getByText(/This is a test anime description with HTML tags that should be stripped/)).toBeInTheDocument();
    });

    it('should display banner image when available', () => {
      render(<AnimeModal {...defaultProps} />);
      
      const images = screen.getAllByTestId('image');
      const bannerImage = images.find(img => img.src === 'https://example.com/banner.jpg');
      expect(bannerImage).toBeInTheDocument();
      expect(bannerImage).toHaveAttribute('alt', 'Banner image for Test Anime English');
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(<AnimeModal {...defaultProps} onClose={onClose} />);
      
      const closeButton = screen.getByTestId('button');
      fireEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop is clicked', () => {
      const onClose = jest.fn();
      render(<AnimeModal {...defaultProps} onClose={onClose} />);
      
      const boxes = screen.getAllByTestId('box');
      const backdrop = boxes.find(box => box.style.position === 'fixed');
      
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onClose).toHaveBeenCalled();
      }
    });

    it('should handle Escape key press', () => {
      const onClose = jest.fn();
      render(<AnimeModal {...defaultProps} onClose={onClose} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('should not handle other key presses', () => {
      const onClose = jest.fn();
      render(<AnimeModal {...defaultProps} onClose={onClose} />);
      
      fireEvent.keyDown(document, { key: 'Enter' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('Body Scroll Management', () => {
    it('should lock body scroll when modal opens', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should unlock body scroll when modal closes', () => {
      const { rerender } = render(<AnimeModal {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      rerender(<AnimeModal {...defaultProps} isOpen={false} />);
      
      expect(document.body.style.overflow).toBe('');
    });

    it('should unlock body scroll on unmount', () => {
      const { unmount } = render(<AnimeModal {...defaultProps} />);
      
      expect(document.body.style.overflow).toBe('hidden');
      
      unmount();
      
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Status Formatting', () => {
    it('should format FINISHED status correctly', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Finished')).toBeInTheDocument();
    });

    it('should format RELEASING status correctly', () => {
      render(<AnimeModal {...defaultProps} anime={mockAnimeWithoutEnglish} />);
      
      expect(screen.getByText('Releasing')).toBeInTheDocument();
    });

    it('should format NOT_YET_RELEASED status correctly', () => {
      const notReleasedAnime = {
        ...mockAnime,
        status: 'NOT_YET_RELEASED',
      };
      
      render(<AnimeModal {...defaultProps} anime={notReleasedAnime} />);
      
      expect(screen.getByText('Not Yet_released')).toBeInTheDocument();
    });
  });

  describe('Season Formatting', () => {
    it('should format season and year correctly', () => {
      render(<AnimeModal {...defaultProps} />);
      
      expect(screen.getByText('Spring 2023')).toBeInTheDocument();
    });

    it('should handle missing season data', () => {
      const noSeasonAnime = {
        ...mockAnime,
        season: '',
        seasonYear: 0,
      };
      
      render(<AnimeModal {...defaultProps} anime={noSeasonAnime} />);
      
      // The component doesn't render season section when data is missing
      expect(screen.queryByText('Season:')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle anime without description', () => {
      const noDescriptionAnime = {
        ...mockAnime,
        description: '',
      };
      
      render(<AnimeModal {...defaultProps} anime={noDescriptionAnime} />);
      
      expect(screen.getByText('No description available')).toBeInTheDocument();
    });

    it('should handle anime with null description', () => {
      const nullDescriptionAnime = {
        ...mockAnime,
        description: null as any,
      };
      
      render(<AnimeModal {...defaultProps} anime={nullDescriptionAnime} />);
      
      expect(screen.getByText('No description available')).toBeInTheDocument();
    });

    it('should handle anime without genres', () => {
      const noGenresAnime = {
        ...mockAnime,
        genres: [],
      };
      
      render(<AnimeModal {...defaultProps} anime={noGenresAnime} />);
      
      expect(screen.queryByText('Genres:')).not.toBeInTheDocument();
    });

    it('should handle anime without banner image', () => {
      const noBannerAnime = {
        ...mockAnime,
        bannerImage: '',
      };
      
      render(<AnimeModal {...defaultProps} anime={noBannerAnime} />);
      
      const images = screen.getAllByTestId('image');
      const bannerImage = images.find(img => img.src === 'https://example.com/banner.jpg');
      expect(bannerImage).toBeUndefined();
    });

    it('should handle anime without episodes', () => {
      const noEpisodesAnime = {
        ...mockAnime,
        episodes: 0,
      };
      
      render(<AnimeModal {...defaultProps} anime={noEpisodesAnime} />);
      
      expect(screen.queryByText('Episodes:')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper close button aria-label', () => {
      render(<AnimeModal {...defaultProps} />);
      
      const closeButton = screen.getByTestId('button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close anime details');
    });

    it('should have proper image alt text', () => {
      render(<AnimeModal {...defaultProps} />);
      
      const images = screen.getAllByTestId('image');
      const coverImage = images.find(img => img.src === 'https://example.com/large.jpg');
      expect(coverImage).toHaveAttribute('alt', 'Cover image for Test Anime English');
    });
  });
}); 