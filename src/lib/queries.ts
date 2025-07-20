import { gql } from '@apollo/client';

// Query to fetch popular anime with images
export const GET_POPULAR_ANIME = gql`
  query GetPopularAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        averageScore
        episodes
        status
        genres
        season
        seasonYear
      }
    }
  }
`;

// Query to search anime by title
export const SEARCH_ANIME = gql`
  query SearchAnime($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        averageScore
        episodes
        status
        genres
        season
        seasonYear
      }
    }
  }
`; 