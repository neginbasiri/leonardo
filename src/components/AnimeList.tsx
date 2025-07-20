'use client';

import { useQuery } from '@apollo/client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ErrorBoundary from './ErrorBoundary';
import {
  Box,
  Grid,
  Heading,
  Text,
  Image,
  Badge,
  Input,
  Flex,
  Spinner,
  Button,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { GET_POPULAR_ANIME, SEARCH_ANIME } from '../lib/queries';
import dynamic from 'next/dynamic';
const AnimeModal = dynamic(() => import('./AnimeModal'), { ssr: false, loading: () => null });

interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  bannerImage: string;
  description: string;
  averageScore: number;
  episodes: number;
  status: string;
  genres: string[];
  season: string;
  seasonYear: number;
}

interface AnimeData {
  Page: {
    media: Anime[];
  };
}

interface AnimeListProps {
  initialPage?: number;
  initialSearch?: string;
  initialPerPage?: number;
}

export default function AnimeList({ 
  initialPage = 1, 
  initialSearch = '', 
  initialPerPage = 12 
}: AnimeListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // No search validation needed

  // Update URL when state changes
  const updateURL = useCallback((newPage: number, newSearch: string, newPerPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', newPage.toString());
    if (newSearch) params.set('search', newSearch);
    if (newPerPage !== 12) params.set('perPage', newPerPage.toString());
    
    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.push(`/information${newURL}`, { scroll: false });
  }, [router]);

  // Use search query if search term exists, otherwise use popular anime query
  const { loading, error, data } = useQuery<AnimeData>(
    debouncedSearch ? SEARCH_ANIME : GET_POPULAR_ANIME,
    {
      variables: {
        search: debouncedSearch || undefined,
        page,
        perPage,
      },
      skip: false, // Always load data when component is rendered (user is authenticated)
    }
  );

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  }, []);

  // Debounce searchTerm and only trigger search if 3+ characters
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (searchTerm.length === 0 || searchTerm.length >= 3) {
        setDebouncedSearch(searchTerm);
        updateURL(1, searchTerm, perPage);
      }
    }, 400);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm, perPage, updateURL]);

  const handleNextPage = useCallback(() => {
    const newPage = page + 1;
    setPage(newPage);
    updateURL(newPage, searchTerm, perPage);
  }, [page, updateURL, searchTerm, perPage]);

  const handlePrevPage = useCallback(() => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    updateURL(newPage, searchTerm, perPage);
  }, [page, updateURL, searchTerm, perPage]);

  const handlePerPageChange = useCallback((value: string) => {
    const newPerPage = parseInt(value);
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing items per page
    updateURL(1, searchTerm, newPerPage);
  }, [updateURL, searchTerm]);

  const handleAnimeClick = useCallback((anime: Anime) => {
    setSelectedAnime(anime);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Use setTimeout to ensure state update doesn't conflict with modal closing
    setTimeout(() => {
      setSelectedAnime(null);
    }, 100);
  }, []);

  // On mount, set searchTerm from the URL (if needed)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
    setDebouncedSearch(urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Box role="status" aria-live="polite">
          <Spinner size="xl" color="white" aria-label="Loading anime data" />
          <Text position="absolute" width="1px" height="1px" padding="0" margin="-1px" overflow="hidden" clip="rect(0, 0, 0, 0)" whiteSpace="nowrap" border="0">
            Loading anime data, please wait...
          </Text>
        </Box>
      </Flex>
    );
  }

  if (error) {
    return (
      <Box 
        p={4} 
        bg="red.100" 
        color="red.800" 
        borderRadius="md"
        role="alert"
        aria-live="assertive"
      >
        <Text fontWeight="bold">Error loading anime data:</Text>
        <Text>{error.message}</Text>
      </Box>
    );
  }

  const animeList = data?.Page?.media || [];

  return (
    <ErrorBoundary>
      <Box>
        <VStack gap={6} align="stretch">
          {/* Search and Controls */}
          <VStack gap={4} align="stretch">
            {/* Search Input */}
            <Box position="relative">
              <Box
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                color="gray.300"
                zIndex={1}
              >
                🔍
              </Box>
              <Input
                placeholder="Search anime by title..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onBlur={() => {}}
                size="lg"
                pl={10}
                aria-label="Search anime database"
                role="searchbox"
                aria-invalid={false}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  right={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.300"
                  zIndex={2}
                  bg="transparent"
                  border="none"
                  minW={0}
                  h="auto"
                  p={0}
                  onClick={() => handleSearch('')}
                  _hover={{ color: 'white', bg: 'transparent' }}
                  aria-label="Clear search"
                  fontSize="xl"
                >
                  ×
                </Button>
              )}
            </Box>

            {/* Controls Row */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Heading size="lg">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Anime'}
              </Heading>
              <HStack gap={4}>
                <Text color="white" fontSize="sm">
                  Items per page:
                </Text>
                <select
                  value={perPage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePerPageChange(e.target.value)}
                  aria-label="Select number of items per page"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #2d3748', // gray.800 border
                    fontSize: '14px',
                    width: '80px',
                    background: '#1a202c', // gray.900
                    color: 'white',
                  }}
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
                <Text color="white" fontSize="sm" aria-live="polite">
                  {animeList.length} results
                </Text>
              </HStack>
            </Flex>
          </VStack>

          {/* Anime Grid */}
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            }}
            gap={6}
          >
            {animeList.map((anime) => (
              <Box
                key={anime.id}
                border="1px"
                borderColor="gray.200"
                borderRadius="lg"
                overflow="hidden"
                shadow="md"
                _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                bg="white"
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => handleAnimeClick(anime)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleAnimeClick(anime);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${anime.title.english || anime.title.romaji}`}
              >
                <Box position="relative">
                  <Image
                    src={anime.coverImage.large}
                    alt={`Cover image for ${anime.title.english || anime.title.romaji}`}
                    width="100%"
                    height="300px"
                    objectFit="cover"
                  />
                  {anime.averageScore && (
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme="green"
                      variant="solid"
                    >
                      {anime.averageScore / 10}★
                    </Badge>
                  )}
                </Box>
                
                <Box p={4}>
                  <Heading size="md" mb={2} color="gray.800">
                    {anime.title.english || anime.title.romaji}
                  </Heading>
                  {anime.title.english && anime.title.romaji !== anime.title.english && (
                    <Text fontSize="sm" color="gray.600" mb={3}>
                      {anime.title.romaji}
                    </Text>
                  )}
                  
                  <VStack align="start" gap={2}>
                    <Text fontSize="sm" color="gray.800">
                      {anime.description?.replace(/<[^>]*>/g, '').substring(0, 150) || 'No description available'}
                      {anime.description && anime.description.length > 150 ? '...' : ''}
                    </Text>
                    
                    <HStack gap={2} flexWrap="wrap">
                      {anime.genres?.slice(0, 3).map((genre) => (
                        <Badge key={genre} colorScheme="blue" variant="subtle" size="sm">
                          {genre}
                        </Badge>
                      ))}
                    </HStack>
                    
                    <HStack gap={4} fontSize="sm" color="gray.600">
                      {anime.episodes && (
                        <Text>{anime.episodes} episodes</Text>
                      )}
                      {anime.season && anime.seasonYear && (
                        <Text>{anime.season} {anime.seasonYear}</Text>
                      )}
                    </HStack>
                    
                    <Badge
                      colorScheme={
                        anime.status === 'FINISHED' ? 'green' :
                        anime.status === 'RELEASING' ? 'blue' :
                        anime.status === 'NOT_YET_RELEASED' ? 'yellow' : 'gray'
                      }
                      variant="outline"
                    >
                      {anime.status.replace('_', ' ')}
                    </Badge>
                  </VStack>
                </Box>
              </Box>
            ))}
          </Grid>

          {/* Enhanced Pagination */}
          {animeList.length > 0 && (
            <Box width="100%" mt={8}>
              <Flex justify="center" align="center" gap={4} flexWrap="wrap" width="100%">
                <Button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  colorScheme="teal"
                  variant="solid"
                  size="lg"
                  aria-label="Go to previous page"
                >
                  ← Previous
                </Button>
                
                <HStack gap={2}>
                  <Text fontWeight="bold" fontSize="lg" color="white">
                    Page {page}
                  </Text>
                  <Text color="white">
                    of {animeList.length < perPage ? page : '...'}
                  </Text>
                </HStack>
                
                <Button
                  onClick={handleNextPage}
                  disabled={animeList.length < perPage}
                  colorScheme="teal"
                  variant="solid"
                  size="lg"
                  aria-label="Go to next page"
                >
                  Next →
                </Button>
              </Flex>
            </Box>
          )}

          {/* No Results */}
          {animeList.length === 0 && !loading && (
            <Box p={8} bg="blue.50" color="blue.800" borderRadius="lg" textAlign="center">
              <Text fontSize="lg" fontWeight="medium">
                {searchTerm ? `No anime found for "${searchTerm}"` : 'No anime data available.'}
              </Text>
              {searchTerm && (
                <Text mt={2} fontSize="sm">
                  Try adjusting your search terms or browse popular anime instead.
                </Text>
              )}
            </Box>
          )}
        </VStack>
      </Box>

      {/* Anime Modal - Only render when we have data and modal should be open */}
      {selectedAnime && isModalOpen && (
        <AnimeModal
          anime={selectedAnime}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </ErrorBoundary>
  );
}