'use client';

import { Box, Heading, Text, VStack, Container, Flex } from '@chakra-ui/react';
import { useUser } from '../../contexts/UserContext';
import AnimeList from '../../components/AnimeList';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function InformationPage() {
  const { user, isLoading } = useUser();
  const searchParams = useSearchParams();
  
  // Get initial values from URL parameters
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialSearch = searchParams.get('search') || '';
  const initialPerPage = parseInt(searchParams.get('perPage') || '12');

  if (isLoading) {
    return (
      <Container maxW="container.xl" as="main" minH="100vh">
        <Text>Loading...</Text>
      </Container>
    );
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
            Browse and search through our comprehensive anime list powered by AniList
          </Text>
        </Box>
        
        {/* Anime List Component with URL parameters */}
        <AnimeList 
          initialPage={initialPage}
          initialSearch={initialSearch}
          initialPerPage={initialPerPage}
        />
      </VStack>
    </Container>
  );
} 