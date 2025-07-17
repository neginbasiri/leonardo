import { ApolloClient, InMemoryCache } from '@apollo/client';

// Apollo Client setup for the public Countries GraphQL API
// See: https://countries.trevorblades.com/
const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/',
  cache: new InMemoryCache(),
});

export default client; 