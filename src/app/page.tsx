'use client';

import { Box, Heading, Text, VStack, Container, Button, HStack } from '@chakra-ui/react';
import { useUser } from '../contexts/UserContext';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <Container maxW="container.xl" className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20" as="main">
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxW="container.xl" className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20" as="main">
        <VStack gap={6}>
          <Heading as="h1" size="lg" textAlign="center">
            Welcome to Anime Explorer
          </Heading>
          <Text textAlign="center" color="gray.600">
            Please enter your username and job title to start exploring anime data from AniList.
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" as="main" minH="100vh">
      <VStack gap={8} p={6}>
        {/* Welcome Header */}
        <Box textAlign="center" w="full">
          <Heading as="h1" size="xl" mb={2} color="white">
            Welcome, {user.username}!
          </Heading>
          <Text color="white" fontSize="lg">
            Explore anime data from AniList as a {user.job}
          </Text>
        </Box>

        {/* Dashboard Sections */}
        <VStack gap={6} w="full" maxW="2xl">
          {/* Anime Database Section */}
          <Box 
            w="full" 
            p={6} 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="lg"
            bg="white"
            shadow="sm"
          >
            <VStack gap={4} align="stretch">
              <Heading size="md" color="gray.800">Anime Database</Heading>
              <Text color="gray.600">
                Access our comprehensive anime database with detailed information, images, and search capabilities.
              </Text>
              <HStack justify="center">
                <Link href="/information" passHref>
                  <Button colorScheme="teal" size="lg">
                    Browse Anime Database
                  </Button>
                </Link>
              </HStack>
            </VStack>
          </Box>

          {/* Features Section */}
          <Box 
            w="full" 
            p={6} 
            border="1px" 
            borderColor="gray.200" 
            borderRadius="lg"
            bg="white"
            shadow="sm"
          >
            <VStack gap={3} align="stretch">
              <Heading size="md" color="gray.800">Features</Heading>
              <Text color="gray.600">
                • Search anime by title
              </Text>
              <Text color="gray.600">
                • View detailed information and cover images
              </Text>
              <Text color="gray.600">
                • Browse with pagination
              </Text>
              <Text color="gray.600">
                • Filter by popularity and status
              </Text>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Container>
  );
}
