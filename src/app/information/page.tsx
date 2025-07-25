'use client';

import { useQuery } from '@apollo/client';
import { useState, useEffect, useRef } from 'react';
import { GET_POPULAR_ANIME, SEARCH_ANIME } from '../../lib/queries';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { Button, HStack, Input, ButtonGroup, IconButton, Pagination, Spinner, Box, Text, Flex, Heading, VStack, Container } from '@chakra-ui/react';
import { useUser } from '../../contexts/UserContext';
import AnimeList, { type Anime } from '../../components/AnimeList';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
const Loader = dynamic(() => import('../../components/Loader'), { ssr: false, loading: () => null });

export default function InformationPage() {
  const { user, isLoading } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial values from URL parameters
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialSearch = searchParams.get('search') || '';
  const initialPerPage = parseInt(searchParams.get('perPage') || '12');

  // State for search, pagination, modal, etc.
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (searchTerm.length === 0 || searchTerm.length >= 3) {
        setDebouncedSearch(searchTerm);
        setPage(1);
      }
    }, 400);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm]);

  // Update URL when searchTerm or perPage changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (searchTerm) params.set('search', searchTerm);
    if (perPage !== 12) params.set('perPage', perPage.toString());
    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.push(`/information${newURL}`, { scroll: false });
  }, [searchTerm, perPage, page, router]);

  // Data fetching
  const { loading, error, data } = useQuery(
    debouncedSearch ? SEARCH_ANIME : GET_POPULAR_ANIME,
    {
      variables: {
        search: debouncedSearch || undefined,
        page,
        perPage,
      },
      skip: false,
    }
  );

  const animeList = data?.Page?.media || [];
  const total = data?.Page?.pageInfo?.total || 0;

  // Modal handlers
  const handleAnimeClick = (anime: Anime) => {
    setSelectedAnime(anime);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAnime(null), 100);
  };

  // Per page change
  const handlePerPageChange = (value: string) => {
    const newPerPage = parseInt(value);
    setPerPage(newPerPage);
    setPage(1);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <Container maxW="container.xl" as="main" minH="100vh">
        <VStack gap={6}>
          <Heading as="h1" size="lg" textAlign="center">
            Access Denied
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please enter your username and job title to access the information page.
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" as="main" minH="100vh" overflow="auto">
      <VStack gap={6} p={6} align="stretch">
        {/* Breadcrumb Navigation */}
        <Flex gap={2} fontSize="sm" color="white">
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <Text>/</Text>
          <Text fontWeight="medium">Information</Text>
        </Flex>

        {/* Page Header */}
        <Box textAlign="center" w="full">
          <Heading as="h1" size="xl" mb={2}>
            Anime Information
          </Heading>
          <Text color="white" fontSize="lg">
            Browse and search through our comprehensive anime list powered by Anime list
          </Text>
        </Box>

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
              onChange={(e) => setSearchTerm(e.target.value)}
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
                onClick={() => setSearchTerm('')}
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
                onChange={(e) => handlePerPageChange(e.target.value)}
                aria-label="Select number of items per page"
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #2d3748',
                  fontSize: '14px',
                  width: '80px',
                  background: '#1a202c',
                  color: 'white',
                }}
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
              <Text color="white" fontSize="sm" aria-live="polite">
                {total} results
              </Text>
            </HStack>
          </Flex>
        </VStack>

        {/* Loading/Error/No Results */}
        {loading && (
          <Flex justify="center" align="center" minH="400px">
            <Box role="status" aria-live="polite">
              <Spinner size="xl" color="white" aria-label="Loading anime data" />
              <Text position="absolute" width="1px" height="1px" padding="0" margin="-1px" overflow="hidden" clip="rect(0, 0, 0, 0)" whiteSpace="nowrap" border="0">
                Loading anime data, please wait...
              </Text>
            </Box>
          </Flex>
        )}
        {error && (
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
        )}
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

        {/* Anime Grid */}
        <AnimeList
          animeList={animeList}
          onAnimeClick={handleAnimeClick}
          selectedAnime={selectedAnime}
          isModalOpen={isModalOpen}
          onCloseModal={handleCloseModal}
        />

        {/* Pagination */}
        {animeList.length > 0 && (
          <Flex width="100%" justify="center" mt={8}  py={4}>
            <Box maxW="600px" width="100%">
              <Pagination.Root
                count={total}
                pageSize={perPage}
                page={page}
                onPageChange={(e) => setPage(e.page)}
              >
                <ButtonGroup variant="ghost" size="sm" >
                  <Pagination.PrevTrigger asChild>
                    <IconButton aria-label="Previous page">
                      <HiChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>
                  <Pagination.Items
                    render={(pageObj) => (
                      <IconButton
                        key={pageObj.value}
                        variant={{ base: "ghost", _selected: "outline" }}
                        aria-label={`Page ${pageObj.value}`}
                        onClick={() => setPage(pageObj.value)}
                      >
                        {pageObj.value}
                      </IconButton>
                    )}
                  />
                  <Pagination.NextTrigger asChild>
                    <IconButton aria-label="Next page">
                      <HiChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </Box>
          </Flex>
        )}
      </VStack>
    </Container>
  );
} 