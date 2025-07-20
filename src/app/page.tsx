'use client';

import { Box, Heading, Text, VStack, Container, Button, HStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
const Loader = dynamic(() => import('../components/Loader'), { ssr: false, loading: () => null });
import { useUser } from '../contexts/UserContext';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <Container
        maxW="container.xl"
        as="main"
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={20}
        px={{ base: 4, sm: 20 }}
        bg="gray.900"
        color="white"
      >
        <VStack gap={6} w="full">
          <Heading as="h1" size="lg" textAlign="center">
            Welcome to Anime Explorer
          </Heading>
          <Text textAlign="center" color="white">
            Please enter your username and job title to start exploring anime data from AniList.
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container
      maxW="container.xl"
      as="main"
      minH="100vh"
      display="flex"
      flexDirection="column"
      px={0}
      bg="gray.900"
      color="white"
    >
      <Box flex="1">
        <VStack gap={8} p={6}>
          {/* Welcome Header */}
          <Box textAlign="center" w="full">
            <Heading as="h1" size="xl" mb={2} color="white">
              Welcome, {user.username}!
            </Heading>
            <Text color="white" fontSize="lg">
              Explore anime data from Anime list as a {user.job}
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
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
}
