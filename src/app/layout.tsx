'use client';

import "./globals.css";
import { Providers } from './providers';
import { useHydration } from '../hooks/useHydration';
import { useUser } from '../contexts/UserContext';
import ErrorBoundary from '../components/ErrorBoundary';
import UserInfoDialog from '../components/UserInfoDialog';
import EditUserButton from '../components/EditUserButton';
import {
  Box,
  Text,
  Flex,
  Container,
  Link,
} from '@chakra-ui/react';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const isHydrated = useHydration();

  // Determine if dialog should be shown
  const shouldShowDialog = isHydrated && !isLoading && !user;
  const isBlocking = !user; // Dialog blocks when no user exists

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <Link
        href="#main-content"
        position="absolute"
        top="-40px"
        left="6px"
        bg="teal.500"
        color="white"
        px={4}
        py={2}
        borderRadius="md"
        zIndex={10000}
        _focus={{ top: "6px" }}
        _hover={{ bg: "teal.600" }}
        fontSize="sm"
        fontWeight="medium"
        textDecoration="none"
      >
        Skip to main content
      </Link>
      
      {/* User Info Dialog */}
      <UserInfoDialog 
        isOpen={shouldShowDialog}
        onClose={() => {}} // No-op for blocking dialog
        isBlocking={isBlocking}
      />
      
      {/* Show user info and edit button if available - only show after hydration AND loading */}
      {isHydrated && !isLoading && user && (
        <Box bg="gray.900" borderBottom="1px" borderColor="gray.700">
          <Container maxW="container.xl">
            <Flex align="center" justify="flex-end" p={4}>
              <Text fontWeight="bold" mr={2} color="white">User:</Text>
              <Text mr={4} color="white">{user.username} ({user.job})</Text>
              <EditUserButton />
            </Flex>
          </Container>
        </Box>
      )}
      
      <Box minH="100vh" display="flex" flexDirection="column" bg="gray.900" color="white">
        <Box flex="1" display="flex" flexDirection="column" id="main-content" bg="gray.900">
          {children}
        </Box>
        <Box borderTop="1px" borderColor="gray.700" bg="gray.900">
          <Container maxW="container.xl">
            <Flex
              py={4}
              px={2}
              flexDir={{ base: "column", sm: "row" }}
              gap={{ base: 2, sm: 6 }}
              align="center"
              justify="center"
              fontSize={{ base: "xs", sm: "sm" }}
              color="gray.400"
            >
              <Box>
                Challenge Version: <b>1.0.0</b>
              </Box>
            </Flex>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ErrorBoundary>
            <LayoutContent>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </LayoutContent>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}