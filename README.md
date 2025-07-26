# Anime Explorer - Anime list GraphQL Integration

A Next.js application that integrates with the Anime list GraphQL API to display anime data with images. The application requires user authentication (username and job title) before allowing access to the anime data.

## Features

- **User Authentication**: Users must enter their username and job title before accessing the application
- **Anime list GraphQL Integration**: Uses Apollo Client to query the Anime list GraphQL API
- **Anime Data Display**: Shows anime with cover images, titles, descriptions, ratings, and metadata
- **Responsive Design**: Built with Chakra UI for a modern, responsive interface
- **Pagination**: Navigate through anime results with pagination controls
- **Items Per Page Selection**: Choose between 6, 12, 24, or 48 items per page
- **Information Page**: Dedicated page for browsing paginated anime data
- **URL-Based Pagination**: Direct linking to specific pages and pagination settings
- **Max-Width Containers**: Consistent layout with responsive max-width constraints
- **Detailed Modal Views**: Click on any anime item to view comprehensive details in a modal
- **Comprehensive Testing**: Full test suite with Jest and React Testing Library
- **Accessibility**: WCAG 2.1 AA compliant with comprehensive accessibility features
- **Error Handling**: Robust error boundaries and form validation

## Technology Stack

- **Next.js 15**: React framework with App Router
- **Apollo Client**: GraphQL client for data fetching
- **Chakra UI v3**: Modern component library for UI
- **TypeScript**: Type-safe development
- **Jest & React Testing Library**: Comprehensive testing framework
- **Anime list GraphQL API**: Public anime database API

## URL Parameters

The Information page supports the following URL parameters for direct linking:

- `page`: Page number (default: 1)
- `perPage`: Number of items per page - 6, 12, 24, or 48 (default: 12)

### Example URLs

- `/information` - Default page with popular anime
- `/information?page=2` - Second page of popular anime
- `/information?perPage=24` - Popular anime with 24 items per page
- `/information?page=3&perPage=6` - Third page with 6 items per page

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Run Development Server (Clean Cache)**:
   ```bash
   npm run dev:clean
   ```

4. **Open Application**:
   Navigate to `http://localhost:3000`

5. **Authentication**:
   - Enter your username and job title
   - Click "Save" to access the application

6. **Browse Anime Data**:
   - Use the dashboard to navigate to the Information page
   - Navigate through pages using pagination controls
   - Select different numbers of items per page (6, 12, 24, 48)
   - Share direct links to specific pages and pagination settings
   - **Click on any anime card to view detailed information in a modal**

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run dev:clean` - Clear Next.js cache and start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:accessibility` - Run accessibility tests
- `npm run audit:accessibility` - Run Lighthouse accessibility audit

## Project Structure

```
src/
├── app/
│   ├── information/
│   │   ├── __tests__/
│   │   │   └── page.test.tsx    # Information page tests
│   │   └── page.tsx             # Information page with URL-based pagination
│   ├── layout.tsx               # Main layout with user authentication
│   ├── page.tsx                 # Dashboard page
│   └── providers.tsx            # Apollo and Chakra UI providers
├── components/
│   ├── __tests__/               # Component test files
│   │   ├── AnimeList.test.tsx   # AnimeList component tests
│   │   ├── AnimeModal.test.tsx  # AnimeModal component tests
│   │   └── UserInfoDialog.test.tsx # UserInfoDialog component tests
│   ├── AnimeList.tsx            # Anime display component with pagination
│   ├── AnimeModal.tsx           # Modal component for detailed anime information
│   ├── EditUserButton.tsx       # Button component for editing user info
│   ├── ErrorBoundary.tsx        # Error boundary component
│   ├── Loader.tsx               # Loading spinner component
│   └── UserInfoDialog.tsx       # User authentication dialog
├── contexts/
│   ├── __tests__/
│   │   └── UserContext.test.tsx # UserContext tests
│   └── UserContext.tsx          # User state management
├── hooks/
│   ├── __tests__/
│   │   └── useFormValidation.test.ts # useFormValidation hook tests
│   ├── useBodyScrollLock.ts     # Hook for managing body scroll lock
│   ├── useFormValidation.ts     # Hook for form validation
│   └── useHydration.ts          # Hook for hydration state
└── lib/
    ├── __tests__/
    │   └── validation.test.ts   # Validation utility tests
    ├── apolloClient.ts          # Apollo Client configuration
    ├── queries.ts               # GraphQL queries for Anime list API
    └── validation.ts            # Form validation utilities
```

## API Integration

The application integrates with the Anime list GraphQL API (`https://graphql.Anime list.co`) to fetch:

- Popular anime listings with pagination
- Anime details including:
  - Cover images and banner images
  - English and Romaji titles
  - Descriptions and ratings
  - Episode counts and seasons
  - Genres and status information

## User Experience Features

- **Consistent User State**: Shared user context across all pages
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Smooth loading indicators during data fetching
- **Error Handling**: Graceful error messages for failed requests
- **Pagination Controls**: Easy navigation with page indicators and items per page selection
- **Direct Linking**: Shareable URLs for specific pages and pagination settings
- **Interactive Cards**: Hover effects and click interactions
- **Detailed Modal Views**: Comprehensive anime information display
- **Body Scroll Lock**: Prevents background scrolling when modals are open

## Modal Features

When you click on any anime item, a detailed modal opens showing:

- **Large Cover Image**: High-quality anime cover
- **Multiple Titles**: English, Japanese (Romaji), and Native titles
- **Rating Information**: Star rating and percentage score
- **Status Badge**: Color-coded status (Finished, Releasing, Not Yet Released)
- **Episode Count**: Number of episodes
- **Season Information**: Season and year
- **Genre Tags**: All associated genres with color coding
- **Full Description**: Complete description with HTML cleaning
- **Banner Image**: Anime banner image (if available)
- **Responsive Layout**: Adapts to different screen sizes
- **Easy Close**: Click outside or use the close button
- **Keyboard Navigation**: ESC key to close modal

## Testing

The application includes a comprehensive test suite with:

- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Component interaction testing
- **Accessibility Tests**: Automated accessibility validation
- **Form Validation Tests**: Validation logic testing
- **Error Handling Tests**: Error boundary and error scenario testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testPathPattern="page.test.tsx"

# Run accessibility tests
npm run test:accessibility
```

## Accessibility

This application is designed with accessibility in mind and follows WCAG 2.1 AA guidelines. For comprehensive accessibility documentation, see [ACCESSIBILITY.md](./ACCESSIBILITY.md).

### Key Accessibility Features

- **Keyboard Navigation**: Complete keyboard accessibility for all features
- **Screen Reader Support**: Full compatibility with NVDA, JAWS, VoiceOver, and TalkBack
- **ARIA Labels**: Proper labeling for all interactive elements
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: High contrast ratios meeting WCAG standards
- **Semantic HTML**: Proper HTML structure and heading hierarchy
- **Form Accessibility**: Accessible forms with validation and help text
- **Skip Links**: Quick navigation for keyboard users
- **Loading States**: Screen reader announcements for loading and error states
- **Modal Accessibility**: Proper focus trapping and ARIA attributes

### Testing Accessibility

```bash
# Run Lighthouse accessibility audit
npm run audit:accessibility

# Manual testing checklist available in ACCESSIBILITY.md
```

## Error Handling & Validation

The application includes comprehensive error handling and form validation systems. For detailed documentation, see [ERROR-HANDLING.md](./ERROR-HANDLING.md).

### Key Features

- **Error Boundaries**: Graceful error recovery with user-friendly fallback UI
- **Form Validation**: Real-time validation with accessibility support
- **Error Recovery**: Automatic retry mechanisms and clear recovery options
- **Development Support**: Detailed error information and debugging tools
- **User Experience**: Friendly error messages and consistent error handling

### Error Handling Components

- **ErrorBoundary**: Catches and handles React component errors
- **Form Validation**: Real-time field validation with user feedback
- **API Error Handling**: Graceful handling of network and data errors
- **Accessibility**: Screen reader announcements for errors and validation

## Development

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency with flat config
- **Prettier**: Code formatting
- **Hot Reload**: Fast development with Next.js hot reloading
- **Component Architecture**: Modular, reusable components
- **Custom Hooks**: Reusable logic for common functionality
- **Testing**: Comprehensive test coverage with Jest and React Testing Library

## License

This project is open source and available under the MIT License.
