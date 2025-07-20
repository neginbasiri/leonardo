import { Container, Text } from '@chakra-ui/react';

export default function Loader() {
  return (
    <Container
      maxW="container.xl"
      as="main"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text py={12} px={8} fontSize="xl" color="white">
        Loading...
      </Text>
    </Container>
  );
} 