'use client';

import { useQuery } from '@apollo/client';
import { useState, useEffect, useRef } from 'react';
import { GET_POPULAR_ANIME } from '../../lib/queries';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { HStack, ButtonGroup, IconButton, Pagination, Spinner, Box, Text, Flex, Heading, VStack, Container } from '@chakra-ui/react';
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
  const initialPerPage = parseInt(searchParams.get('perPage') || '12');

  // State for pagination, modal, etc.
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isInitialized = useRef(false);

  // Initialize state from URL parameters on mount
  useEffect(() => {
    if (!isInitialized.current) {
      setPage(initialPage);
      setPerPage(initialPerPage);
      isInitialized.current = true;
    }
  }, [initialPage, initialPerPage]);

  // Sync state with URL parameters when they change
  useEffect(() => {
    if (!isInitialized.current) return;
    
    const currentPage = parseInt(searchParams.get('page') || '1');
    const currentPerPage = parseInt(searchParams.get('perPage') || '12');
    
    // Only update if values actually changed to avoid infinite loops
    if (currentPage !== page) {
      setPage(currentPage);
    }
    if (currentPerPage !== perPage) {
      setPerPage(currentPerPage);
    }
  }, [searchParams]);

  // Update URL when state changes
  useEffect(() => {
    if (!isInitialized.current) return; // Skip on initial mount
    
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (perPage !== 12) params.set('perPage', perPage.toString());
    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.push(`/information${newURL}`, { scroll: false });
  }, [perPage, page, router]);

  // Data fetching
  const { loading, error, data } = useQuery(GET_POPULAR_ANIME, {
    variables: {
      page,
      perPage,
    },
    skip: false,
    fetchPolicy: 'cache-and-network', // Ensure fresh data is fetched
    notifyOnNetworkStatusChange: true, // Notify when network status changes
    errorPolicy: 'all', // Handle errors gracefully
  });

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

  // Per page change handler
  const handlePerPageChange = (value: string) => {
    const newPerPage = parseInt(value);
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing items per page
  };

  // Page change handler
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
            Browse through our comprehensive anime list powered by Anime list
          </Text>
        </Box>

        {/* Controls Row */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Heading size="lg">
            Popular Anime
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
              No anime data available.
            </Text>
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
        {animeList.length > 0 && total > perPage && (
          <Flex width="100%" justify="center" mt={8} py={4}>
            <Box maxW="600px" width="100%" mx="auto" display="flex" justifyContent="center">
              <Pagination.Root
                count={Math.ceil(total / perPage)}
                pageSize={1}
                page={page}
                onPageChange={(e) => handlePageChange(e.page)}
                css={{
                  '[dataPart="ellipsis"]': {
                    color: 'white'
                  }
                }}
              >
                <ButtonGroup variant="ghost" size="sm" >
                  <Pagination.PrevTrigger asChild>
                    <IconButton 
                      aria-label="Previous page" 
                      color="white" 
                      _hover={{ color: 'black', bg: 'white' }}
                      disabled={page <= 1}
                    >
                      <HiChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>
                  <Pagination.Items
                    render={(pageObj) => (
                      <IconButton
                        key={pageObj.value}
                        variant={pageObj.value === page ? "outline" : "ghost"}
                        aria-label={`Page ${pageObj.value}`}
                        onClick={() => handlePageChange(pageObj.value)}
                        color="white"
                        _hover={{ color: 'black', bg: 'white' }}
                        _selected={{ color: 'black', bg: 'white' }}
                      >
                        {pageObj.value}
                      </IconButton>
                    )}
                  />
                  <Pagination.NextTrigger asChild>
                    <IconButton 
                      aria-label="Next page" 
                      color="white" 
                      _hover={{ color: 'black', bg: 'white' }}
                      disabled={page >= Math.ceil(total / perPage)}
                    >
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