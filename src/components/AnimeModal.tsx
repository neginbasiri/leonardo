'use client';

import { useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  Badge,
  Image,
} from '@chakra-ui/react';
import ErrorBoundary from './ErrorBoundary';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

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

interface AnimeModalProps {
  anime: Anime | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AnimeModal({ anime, isOpen, onClose }: AnimeModalProps) {
  // Use the improved body scroll lock hook
  useBodyScrollLock(isOpen);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!anime || !isOpen) return null;

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatSeason = (season: string, year: number) => {
    if (!season || !year) return 'Unknown';
    return `${season.charAt(0).toUpperCase() + season.slice(1).toLowerCase()} ${year}`;
  };

  const cleanDescription = (description: string) => {
    return description?.replace(/<[^>]*>/g, '') || 'No description available';
  };

  return (
    <ErrorBoundary>
      {/* Backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={9998}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        maxW="4xl"
        maxH="90vh"
        w="90%"
        bg="white"
        borderRadius="lg"
        boxShadow="2xl"
        zIndex={9999}
        overflow="auto"
        p={6}
      >
        {/* Header */}
        <Flex justify="space-between" align="start" mb={4}>
          <Text fontSize="2xl" fontWeight="bold" flex={1} color="gray.800">
            {anime.title.english || anime.title.romaji}
          </Text>
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            colorScheme="gray"
            ml={4}
            aria-label="Close anime details"
          >
            ✕
          </Button>
        </Flex>
        
        <VStack gap={6} align="stretch">
          {/* Header with Image and Basic Info */}
          <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
            {/* Cover Image */}
            <Box flexShrink={0} minW={{ base: '100%', md: '200px' }} maxW={{ base: '100%', md: '200px' }}>
              <Image
                src={anime.coverImage.large}
                alt={`Cover image for ${anime.title.english || anime.title.romaji}`}
                borderRadius="lg"
                width={{ base: '100%', md: '200px' }}
                height={{ base: 'auto', md: '300px' }}
                maxH={{ base: '300px', md: '300px' }}
                objectFit="cover"
                objectPosition="center"
                shadow="lg"
              />
            </Box>

            {/* Basic Information - 2 columns on desktop, 1 on mobile */}
            <Box flex={1} w="100%">
              <Flex direction={{ base: 'column', md: 'row' }} gap={6} w="100%">
                <VStack align="start" gap={4} flex={1} minW={0}>
                  {/* Alternative Titles */}
                  {anime.title.english && anime.title.romaji !== anime.title.english && (
                    <Box>
                      <Text fontWeight="semibold" color="gray.800" mb={1}>
                        Japanese Title:
                      </Text>
                      <Text fontSize="lg" color="gray.800">{anime.title.romaji}</Text>
                    </Box>
                  )}

                  {anime.title.native && (
                    <Box>
                      <Text fontWeight="semibold" color="gray.800" mb={1}>
                        Native Title:
                      </Text>
                      <Text fontSize="lg" color="gray.800">{anime.title.native}</Text>
                    </Box>
                  )}

                  {/* Score */}
                  {anime.averageScore && (
                    <Box>
                      <Text fontWeight="semibold" color="gray.800" mb={1}>
                        Rating:
                      </Text>
                      <HStack gap={2}>
                        <Badge colorScheme="green" variant="solid" fontSize="md">
                          {anime.averageScore / 10}★
                        </Badge>
                        <Text fontSize="sm" color="gray.800">
                          ({anime.averageScore}% score)
                        </Text>
                      </HStack>
                    </Box>
                  )}
                </VStack>
                <VStack align="start" gap={4} flex={1} minW={0}>
                  {/* Status */}
                  <Box>
                    <Text fontWeight="semibold" color="gray.800" mb={1}>
                      Status:
                    </Text>
                    <Badge
                      colorScheme={
                        anime.status === 'FINISHED' ? 'green' :
                        anime.status === 'RELEASING' ? 'blue' :
                        anime.status === 'NOT_YET_RELEASED' ? 'yellow' : 'gray'
                      }
                      variant="outline"
                      fontSize="md"
                    >
                      {formatStatus(anime.status)}
                    </Badge>
                  </Box>

                  {/* Episodes */}
                  {anime.episodes && (
                    <Box>
                      <Text fontWeight="semibold" color="gray.800" mb={1}>
                        Episodes:
                      </Text>
                      <Text fontSize="lg" color="gray.800">{anime.episodes}</Text>
                    </Box>
                  )}

                  {/* Season */}
                  {anime.season && anime.seasonYear && (
                    <Box>
                      <Text fontWeight="semibold" color="gray.800" mb={1}>
                        Season:
                      </Text>
                      <Text fontSize="lg" color="gray.800">{formatSeason(anime.season, anime.seasonYear)}</Text>
                    </Box>
                  )}
                </VStack>
              </Flex>
            </Box>
          </Flex>



          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <Box>
              <Text fontWeight="semibold" color="gray.800" mb={2}>
                Genres:
              </Text>
              <HStack gap={2} flexWrap="wrap">
                {anime.genres.map((genre) => (
                  <Badge key={genre} colorScheme="blue" variant="subtle" fontSize="sm">
                    {genre}
                  </Badge>
                ))}
              </HStack>
            </Box>
          )}



          {/* Description */}
          <Box>
            <Text fontWeight="semibold" color="gray.800" mb={2}>
              Description:
            </Text>
            <Text fontSize="md" lineHeight="1.6" color="gray.800">
              {cleanDescription(anime.description)}
            </Text>
          </Box>

          {/* Banner Image (if available) */}
          {anime.bannerImage && (
            <Box>
              <Image
                src={anime.bannerImage}
                alt={`Banner image for ${anime.title.english || anime.title.romaji}`}
                borderRadius="lg"
                width="100%"
                height="200px"
                objectFit="cover"
                shadow="md"
              />
            </Box>
          )}
        </VStack>
      </Box>
    </ErrorBoundary>
  );
} 