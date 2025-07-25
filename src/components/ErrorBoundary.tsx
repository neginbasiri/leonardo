'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  HStack,
} from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onRetry: () => void;
  onReload: () => void;
}

function ErrorFallback({ onRetry, onReload }: ErrorFallbackProps) {
  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        <Box
          border="1px"
          borderColor="red.200"
          borderRadius="lg"
          p={4}
          bg="red.50"
        >
          <HStack>
            <Box color="red.500" fontSize="lg">⚠️</Box>
            <Box flex="1">
              <Text fontWeight="bold" color="red.800">
                Something went wrong
              </Text>
              <Text color="red.700">
                An unexpected error occurred. Please try again or reload the page.
              </Text>
            </Box>
          </HStack>
        </Box>

        <Box
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          p={6}
          bg="gray.50"
        >
          <VStack gap={4} align="stretch">
            <Heading size="md" color="gray.800">
              Error Details
            </Heading>
            
            {/* error && (
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Error Message:
                </Text>
                <Code p={3} borderRadius="md" bg="white" display="block">
                  {error.message}
                </Code>
              </Box>
            ) */}

            {/* errorInfo && (
              <Box>
                <HStack justify="space-between" align="center">
                  <Text fontWeight="medium">Stack Trace:</Text>
                  <IconButton
                    aria-label={showDetails ? 'Hide details' : 'Show details'}
                    onClick={() => setShowDetails(!showDetails)}
                    size="sm"
                    variant="ghost"
                  >
                    {showDetails ? '▼' : '▶'}
                  </IconButton>
                </HStack>
                {showDetails && (
                  <Code p={3} borderRadius="md" bg="white" display="block" mt={2} maxH="200px" overflow="auto">
                    {errorInfo.componentStack}
                  </Code>
                )}
              </Box>
            ) */}
          </VStack>
        </Box>

        <HStack gap={4} justify="center">
          <Button
            colorScheme="teal"
            onClick={onRetry}
            aria-label="Try again"
          >
            🔄 Try Again
          </Button>
          <Button
            variant="outline"
            onClick={onReload}
            aria-label="Reload page"
          >
            Reload Page
          </Button>
        </HStack>

        {process.env.NODE_ENV === 'development' && (
          <Box
            border="1px"
            borderColor="blue.200"
            borderRadius="lg"
            p={4}
            bg="blue.50"
          >
            <Text fontSize="sm" color="blue.800">
              💡 Development Mode: Check the browser console for more detailed error information.
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`Error in ${context || 'component'}:`, error);
    
    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { tags: { context } });
  };

  return { handleError };
} 