import { ApolloClient, InMemoryCache } from '@apollo/client';

// Apollo Client setup for the Anime list GraphQL API
// See: https://Animelist.co/graphiql
const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache(),
});

export default client; 