'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import { useState, useEffect } from 'react';
import { useHydration } from '../hooks/useHydration';
import { useUser } from '../contexts/UserContext';
import ErrorBoundary from '../components/ErrorBoundary';
import useFormValidation from '../hooks/useFormValidation';
import { VALIDATION_SCHEMA } from '../lib/validation';
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogCloseTrigger,
  Button,
  FieldRoot,
  FieldLabel,
  Input,
  Box,
  Text,
  Flex,
  Container,
  Link,
  VStack,
  HStack,
} from '@chakra-ui/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, setUser, isLoading } = useUser();
  const [editing, setEditing] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const isHydrated = useHydration();

  // Initialize form validation hooks (always call hooks in the same order)
  const {
    data: formData,
    updateField,
    validationResults,
    touched,
    markFieldAsTouched,
    markAllAsTouched,
    isValid,
    errors,
  } = useFormValidation(
    { username: user?.username || '', jobTitle: user?.job || '' },
    // VALIDATION_SCHEMA is now used internally in useFormValidation
    true // validate on change
  );

  // Only run modal logic after mount AND user data is loaded
  useEffect(() => {
    if (isHydrated && !isLoading && !user && !editing) {
      setEditing(true);
    }
  }, [isHydrated, isLoading, user, editing]);

  // Open modal for editing
  const handleEdit = () => {
    updateField('username', user?.username || '');
    updateField('jobTitle', user?.job || '');
    setEditing(true);
    setSubmitAttempted(false);
  };

  // Save user info
  const handleSave = () => {
    setSubmitAttempted(true);
    markAllAsTouched();
    
    if (isValid) {
      const info = { username: formData.username, job: formData.jobTitle };
      setUser(info);
      setEditing(false);
      setSubmitAttempted(false);
    }
  };

  // Block page if no user info (only after hydration AND loading is complete)
  const shouldBlock = isHydrated && !isLoading && !user && !editing;
  const shouldShowModal = isHydrated && !isLoading && (shouldBlock || editing);

  // Handle body scroll locking when modal is open
  useEffect(() => {
    if (shouldShowModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [shouldShowModal]);

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
      
      {/* Backdrop overlay - only show after mounting */}
      {shouldShowModal && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={9998}
          onClick={() => {
            if (user && editing) {
              setEditing(false);
            }
          }}
        />
      )}
      
      {/* Blocking Dialog (Chakra UI v3 slot API) - only show after mounting */}
      <DialogRoot open={shouldShowModal} onOpenChange={open => { if (!open) return; }}>
        <DialogContent 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            margin: 0
          }}
          p={6}
        >
          <DialogTitle color="gray.800" mb={4}>{editing || !user ? 'Enter your info' : 'Edit your info'}</DialogTitle>
          {/* No close button if blocking */}
          {user && editing && (
            <DialogCloseTrigger asChild>
              <Button 
                onClick={() => { setEditing(false); }} 
                size="sm" 
                variant="ghost" 
                colorScheme="gray" 
                ml={4}
                aria-label="Close dialog"
              >
                ✕
              </Button>
            </DialogCloseTrigger>
          )}
          <DialogDescription asChild={false}>
            <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <VStack gap={4} align="stretch">
                <FieldRoot required>
                  <FieldLabel mb={2} color="gray.700" fontWeight="medium">Username</FieldLabel>
                  <Input
                    value={formData.username}
                    onChange={e => {
                      updateField('username', e.target.value);
                      markFieldAsTouched('username');
                    }}
                    onBlur={() => markFieldAsTouched('username')}
                    placeholder="Enter your username"
                    autoFocus
                    aria-invalid={touched.username && !validationResults.username?.isValid}
                  />
                  {touched.username && validationResults.username?.errors.length > 0 && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {validationResults.username.errors[0]}
                    </Text>
                  )}
                </FieldRoot>

                <FieldRoot required>
                  <FieldLabel mb={2} color="gray.700" fontWeight="medium">Job Title</FieldLabel>
                  <Input
                    value={formData.jobTitle}
                    onChange={e => {
                      updateField('jobTitle', e.target.value);
                      markFieldAsTouched('jobTitle');
                    }}
                    onBlur={() => markFieldAsTouched('jobTitle')}
                    placeholder="Enter your current job title or role"
                    aria-invalid={touched.jobTitle && !validationResults.jobTitle?.isValid}
                  />

                  {touched.jobTitle && validationResults.jobTitle?.errors.length > 0 && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {validationResults.jobTitle.errors[0]}
                    </Text>
                  )}
                </FieldRoot>

                {submitAttempted && errors.length > 0 && (
                  <Box
                    border="1px"
                    borderColor="red.200"
                    borderRadius="lg"
                    p={3}
                    bg="red.50"
                  >
                    <HStack>
                      <Box color="red.500" fontSize="lg">⚠️</Box>
                      <VStack align="start" gap={1}>
                        <Text fontWeight="bold" color="red.800" fontSize="sm">
                          Please fix the following errors:
                        </Text>
                        {errors.map((error, index) => (
                          <Text key={index} color="red.700" fontSize="sm">
                            • {error}
                          </Text>
                        ))}
                      </VStack>
                    </HStack>
                  </Box>
                )}

                <Flex mt={4} justify="flex-end" gap={2}>
                  {user && editing && (
                    <Button 
                      variant="outline" 
                      colorScheme="gray" 
                      onClick={() => { setEditing(false); }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    colorScheme="teal" 
                    type="submit" 
                    disabled={!isValid}
                  >
                    Save
                  </Button>
                </Flex>
              </VStack>
            </form>
          </DialogDescription>
        </DialogContent>
      </DialogRoot>
      
      {/* Show user info and edit button if available - only show after hydration AND loading */}
      {isHydrated && !isLoading && user && (
        <Box bg="gray.900" borderBottom="1px" borderColor="gray.700">
          <Container maxW="container.xl">
            <Flex align="center" justify="center" p={4}>
              <Text fontWeight="bold" mr={2} color="white">User:</Text>
              <Text mr={4} color="white">{user.username} ({user.job})</Text>
              <Button 
                size="sm" 
                onClick={handleEdit} 
                aria-label="Edit user information" 
                colorScheme="teal" 
                variant="solid"
                px={4}
                py={2}
                borderRadius="md"
                fontWeight="medium"
                _hover={{ opacity: 0.8 }}
                _active={{ transform: 'scale(0.95)' }}
              >
                Edit
              </Button>
            </Flex>
          </Container>
        </Box>
      )}
      
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col" id="main-content">
          {children}
        </div>
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
            >
              <Box>
                <span className="text-gray-400">Challenge Version: <b>1.0.0</b></span>
              </Box>
            </Flex>
          </Container>
        </Box>
      </div>
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