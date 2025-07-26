'use client';

import {
  Box,
  Grid,
  Image,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';
import ErrorBoundary from './ErrorBoundary';
import AnimeModal from './AnimeModal';

export interface Anime {
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

interface AnimeListProps {
  animeList: Anime[];
  onAnimeClick: (anime: Anime) => void;
  selectedAnime: Anime | null;
  isModalOpen: boolean;
  onCloseModal: () => void;
}

export default function AnimeList({
  animeList,
  onAnimeClick,
  selectedAnime,
  isModalOpen,
  onCloseModal,
}: AnimeListProps) {
  return (
    <ErrorBoundary>
      <Box>
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
          gap={6}
        >
          {animeList.map((anime, index) => (
            <Box
              key={anime.id || index}
              bg="white"
              borderRadius="lg"
              border="1px"
              borderColor="gray.200"
              shadow="md"
              p={4}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ bg: "gray.50", transform: "translateY(-2px)", shadow: "lg" }}
              onClick={() => onAnimeClick(anime)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAnimeClick(anime);
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
        {/* Anime Modal - Only render when we have data and modal should be open */}
        {selectedAnime && isModalOpen && (
          <AnimeModal
            anime={selectedAnime}
            isOpen={isModalOpen}
            onClose={onCloseModal}
          />
        )}
      </Box>
    </ErrorBoundary>
  );
}