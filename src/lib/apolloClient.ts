import { ApolloClient, InMemoryCache } from '@apollo/client';

// Apollo Client setup for the AniList GraphQL API
// See: https://anilist.co/graphiql
const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache(),
});

export default client; 