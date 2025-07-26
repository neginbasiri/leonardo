import '@testing-library/jest-dom'

// Polyfill for structuredClone (Node.js < 18)
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Chakra UI components if needed
// jest.mock('@chakra-ui/react', () => {
//   const originalModule = jest.requireActual('@chakra-ui/react');
//   return {
//     ...originalModule,
//     // Add specific component mocks here if needed
//   };
// })

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
}) 