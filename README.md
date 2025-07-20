# Anime Explorer - AniList GraphQL Integration

A Next.js application that integrates with the AniList GraphQL API to display anime data with images. The application requires user authentication (username and job title) before allowing access to the anime data.

## Features

- **User Authentication**: Users must enter their username and job title before accessing the application
- **AniList GraphQL Integration**: Uses Apollo Client to query the AniList GraphQL API
- **Anime Data Display**: Shows anime with cover images, titles, descriptions, ratings, and metadata
- **Search Functionality**: Search anime by title
- **Responsive Design**: Built with Chakra UI for a modern, responsive interface
- **Pagination**: Navigate through anime results with pagination controls
- **Information Page**: Dedicated page for browsing paginated anime data
- **URL-Based Pagination**: Direct linking to specific pages, search results, and pagination settings
- **Max-Width Containers**: Consistent layout with responsive max-width constraints
- **Detailed Modal Views**: Click on any anime item to view comprehensive details in a modal

## Technology Stack

- **Next.js 15**: React framework with App Router
- **Apollo Client**: GraphQL client for data fetching
- **Chakra UI v3**: Modern component library for UI
- **TypeScript**: Type-safe development
- **AniList GraphQL API**: Public anime database API

## URL Parameters

The Information page supports the following URL parameters for direct linking:

- `page`: Page number (default: 1)
- `search`: Search term for anime titles (optional)
- `perPage`: Number of items per page - 6, 12, 24, or 48 (default: 12)

### Example URLs

- `/information` - Default page with popular anime
- `/information?page=2` - Second page of popular anime
- `/information?search=naruto` - Search results for "naruto"
- `/information?page=3&search=dragon&perPage=6` - Third page of "dragon" search with 6 items per page

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Application**:
   Navigate to `http://localhost:3000`

4. **Authentication**:
   - Enter your username and job title
   - Click "Save" to access the application

5. **Browse Anime Data**:
   - Use the dashboard to navigate to the Information page
   - Search for specific anime titles
   - Navigate through pages using pagination controls
   - Share direct links to specific pages and search results
   - **Click on any anime card to view detailed information in a modal**

## Project Structure

```
src/
├── app/
│   ├── information/
│   │   └── page.tsx          # Information page with URL-based pagination
│   ├── layout.tsx            # Main layout with user authentication
│   ├── page.tsx              # Dashboard page
│   └── providers.tsx         # Apollo and Chakra UI providers
├── components/
│   ├── AnimeList.tsx         # Anime display component with pagination and click handlers
│   └── AnimeModal.tsx        # Modal component for detailed anime information
├── contexts/
│   └── UserContext.tsx       # User state management
└── lib/
    ├── apolloClient.ts       # Apollo Client configuration
    └── queries.ts            # GraphQL queries for AniList API
```

## API Integration

The application integrates with the AniList GraphQL API (`https://graphql.anilist.co`) to fetch:

- Popular anime listings
- Search results by title
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
- **Search Functionality**: Real-time search with URL persistence
- **Pagination Controls**: Easy navigation with page indicators
- **Direct Linking**: Shareable URLs for specific pages and searches
- **Interactive Cards**: Hover effects and click interactions
- **Detailed Modal Views**: Comprehensive anime information display

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

### Testing Accessibility

```bash
# Run Lighthouse accessibility audit
npx lighthouse http://localhost:3000 --only-categories=accessibility

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

### Testing Error Scenarios

```bash
# Test error boundaries and validation
npm run test:accessibility

# Manual testing for error scenarios
# 1. Disconnect internet to test network errors
# 2. Submit invalid form data
# 3. Trigger component errors
# 4. Test validation rules
```

## Development

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency
- **Hot Reload**: Fast development with Next.js hot reloading
- **Component Architecture**: Modular, reusable components

## License

This project is open source and available under the MIT License.
